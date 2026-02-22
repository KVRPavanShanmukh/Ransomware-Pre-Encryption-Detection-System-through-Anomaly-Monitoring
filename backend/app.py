import os
import hmac
import hashlib
import base64
import secrets
import smtplib
import json
import io
import zipfile
import random

from pathlib import Path
from datetime import datetime, timedelta, timezone
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

app = Flask(__name__)
CORS(app)

# ==============================
# DATABASE CONNECTION
# ==============================

dbconf = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    **dbconf
)

print("MySQL pool ready.")

# ==============================
# DETECTOR PACKAGE LOCATION
# ==============================

DETECTOR_PACKAGE_DIR = Path(__file__).resolve().parent / "detector_package"

# ==============================
# TOKEN SYSTEM
# ==============================

DETECTOR_SECRET = os.getenv("DETECTOR_SECRET", "prd-secret")

def create_detector_token(user_id, email):
    raw = f"{user_id}|{email}|{secrets.token_hex(8)}"
    sig = hmac.new(DETECTOR_SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
    return base64.urlsafe_b64encode(f"{sig}|{raw}".encode()).decode()

def verify_detector_token(token):
    try:
        decoded = base64.urlsafe_b64decode(token.encode()).decode()
        sig, raw = decoded.split("|", 1)
        expected = hmac.new(DETECTOR_SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        parts = raw.split("|")
        return {"user_id": int(parts[0]), "email": parts[1]}
    except:
        return None

# ==============================
# EMAIL FUNCTION
# ==============================

def send_email_safe(to_email, subject, body):
    try:
        host = os.getenv("MAIL_HOST")
        port = int(os.getenv("MAIL_PORT", 587))
        user = os.getenv("MAIL_USER")
        password = os.getenv("MAIL_PASS")

        if not user or not password:
            print("Email not configured.")
            return False

        msg = MIMEMultipart()
        msg["From"] = user
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP(host, port)
        server.starttls()
        server.login(user, password)
        server.sendmail(user, to_email, msg.as_string())
        server.quit()

        return True
    except Exception as e:
        print("Email error:", e)
        return False

# ==============================
# AUTH
# ==============================

_pending_logins = {}
OTP_EXPIRY = 10

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    sec_q = data.get("sec_q")
    sec_a = data.get("sec_a")

    if not all([username, email, password, sec_q, sec_a]):
        return jsonify({"error": "All fields required"}), 400

    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM users WHERE username=%s", (username,))
    if cursor.fetchone():
        return jsonify({"error": "Username taken"}), 409

    cursor.execute("""
        INSERT INTO users (username, password_hash, email, sec_q, sec_a_hash)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        username,
        generate_password_hash(password),
        email,
        sec_q,
        generate_password_hash(sec_a)
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "User created"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    identifier = data.get("username")
    password = data.get("password")

    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE username=%s OR email=%s",
        (identifier, identifier)
    )

    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    email = user["email"]
    otp = ''.join(secrets.choice("0123456789") for _ in range(6))
    psk = ''.join(secrets.choice("abcdefghijklmnopqrstuvwxyz0123456789") for _ in range(8))

    _pending_logins[email.lower()] = {
        "otp": otp,
        "psk": psk,
        "user_id": user["id"],
        "username": user["username"],
        "email": email,
        "role": user.get("role", "user"),
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY)
    }

    body = f"OTP: {otp}\nPSK: {psk}\nValid for {OTP_EXPIRY} minutes."
    send_email_safe(email, "PRD-SYS Login", body)

    return jsonify({
        "pending": True,
        "identifier": email
    }), 200

@app.route('/api/login/verify', methods=['POST'])
def verify():
    data = request.json
    identifier = data.get("identifier")
    otp = data.get("otp")
    psk = data.get("psk")

    pending = _pending_logins.get(identifier.lower())
    if not pending:
        return jsonify({"error": "Invalid or expired"}), 401

    if pending["otp"] != otp or pending["psk"] != psk:
        return jsonify({"error": "Invalid OTP/PSK"}), 401

    conn = pool.get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO login_sessions (user_id, login_time, is_active)
        VALUES (%s, NOW(), TRUE)
    """, (pending["user_id"],))

    conn.commit()
    cursor.close()
    conn.close()

    token = create_detector_token(pending["user_id"], pending["email"])
    del _pending_logins[identifier.lower()]

    return jsonify({
        "message": "Login successful",
        "detector_token": token,
        "username": pending["username"],
        "email": pending["email"],
        "user_id": pending["user_id"]
    }), 200

# ==============================
# DETECTOR DOWNLOAD
# ==============================

@app.route('/api/detector-download', methods=['GET'])
def detector_download():
    token = request.args.get("token")
    if not token:
        return jsonify({"error": "token required"}), 400

    info = verify_detector_token(token)
    if not info:
        return jsonify({"error": "Invalid token"}), 401

    if not DETECTOR_PACKAGE_DIR.exists():
        return jsonify({"error": "Detector package not found"}), 404

    config = {
        "api_base": request.url_root.rstrip("/"),
        "token": token,
        "email": info["email"]
    }

    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("config.json", json.dumps(config, indent=2))
        for file in DETECTOR_PACKAGE_DIR.rglob("*"):
            if file.is_file():
                zf.write(file, file.relative_to(DETECTOR_PACKAGE_DIR))

    buffer.seek(0)

    return send_file(
        buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name="PRD-SYS-FolderGuard.zip"
    )

# ==============================
# SYSMON LIVE FAKE STREAM
# ==============================

SYSMON_TEMPLATES = [
    {"id": 11, "type": "FileRename", "process": "unknown.exe", "target": "C:/Docs/test.locked", "alert": "CRITICAL"},
    {"id": 1, "type": "ProcessCreate", "process": "cmd.exe", "target": "N/A", "alert": "medium"},
    {"id": 3, "type": "NetworkConn", "process": "powershell.exe", "target": "185.22.1.1:443", "alert": "high"},
]

@app.route('/api/sysmon/live', methods=['GET'])
def sysmon_live():
    template = random.choice(SYSMON_TEMPLATES)
    now = datetime.now()

    return jsonify({
        **template,
        "time": now.strftime("%H:%M:%S"),
        "idCounter": random.random()
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)