# 🛡️ Ransomware Pre-Encryption Detection System

A full-stack project that detects ransomware behaviour *before* files are encrypted,
based on system event monitoring and anomaly analysis.  
This solution includes:

🟢 A **Spring Boot backend** to receive and analyze system logs  
🟢 A **React + Vite dashboard** for visualization and alerts  
🟢 A **secure database** to store events, hashes, and alerts  
🟢 A **JWT-based login system** for authentication  

---

## 📌 Overview

Ransomware attacks encrypt user files rapidly, often within seconds.  
Instead of responding *after* encryption, this system monitors activity and detects anomalous behaviour — especially high-entropy file write patterns and mass renaming — to stop attacks early.

Key features:

- 📌 **Real-time anomaly detection**
- 📊 **Events logging with tamper-proof hashes**
- 🚨 **Alert notifications for admin and user**
- 🔐 **Secure authentication & authorization**
- 💾 **Dedicated backend with Spring Boot & MySQL**
- 📱 **Frontend dashboard with React + Vite**

---

## 📂 Repository Structure


📦 RansomeWare-project
├── backend/ # Spring Boot backend
│ ├── src/main/java/…
│ ├── application.properties
│ └── pom.xml
├── public/ # Frontend assets & UI
├── src/ # React + Vite frontend
├── .gitignore
├── LICENSE
└── README.md # ← This file


---

## 🧠 How It Works

### Backend
1. Receives event logs from monitoring agents  
2. Stores logs and generates SHA-256 hashes for tamper-proof integrity  
3. Matches events against whitelist and thresholds  
4. Triggers alerts if suspicious behaviour is found  
5. Stores alert logs and optionally notifies users/admin

### Frontend
- Displays real-time events
- Shows alert list and severity
- Provides login/role management

---

## 🚀 Features

### 🎯 Anomaly Detection
- Entropy-based detection  
- Write frequency thresholds  
- Whitelist process support  

### 🛡 Security
- JWT authentication
- Secure password hashing
- Centralized alerts

### 📊 Dashboard
- Alerts view (LOW → CRITICAL)
- Live event stream
- User login & session tracking

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Java, Spring Boot, JPA |
| Auth | JWT, Spring Security |
| Frontend | React + Vite |
| Database | MySQL |
| Logging | Anomaly & Event Logs |

---

## 🚧 Setup Instructions

### 🧩 Backend

1. Clone the repo  
2. Create `RANSOMWARE` database in MySQL
3. Add DB credentials in `application.properties`
4. Run the backend in your IDE or via `mvn spring-boot:run`

---

## 🔑 Authentication

Use the default admin defined in the DB:

| Username | `admin` |
|----------|--------|
| Password | `password123` |

This account is stored securely with bcrypt hashes.

---

## 📍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Obtain JWT token |
| POST | `/api/logs` | Submit event log |
| GET | `/api/alerts` | Get all alerts |
| GET | `/api/events` | Get all logged events |

*(Protected endpoints require a Bearer token)*

---

## 📝 Example Usage

**Login**

```bash
curl -X POST /api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"admin","password":"password123"}'

Send Log

curl -X POST /api/logs \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "eventId":4663,
  "processName":"evil.exe",
  "pid":1234,
  "targetPath":"C:/Users/attacked/file.txt",
  "accessType":"Write",
  "entropy":8.2,
  "timestamp":"2026-02-15T10:20:30"
}'
🔒 Security Considerations

This is a defensive simulation project and not production antivirus code.

Designed for learning and academic demonstration only.

Do not install components with full system access privileges on production systems.

🧑‍💻 Contributing

If you’d like to improve this project:

Fork the repo

Create a new feature branch

Submit a pull request

All valid enhancements are welcome!

📄 License

This project is licensed under GPL-3.0 License.

❤️ Acknowledgments

Inspired by real-world ransomware research and anomaly monitoring principles.


---

# 🔥 Why This README is Good  

✅ Clearly explains *what the project does*  
✅ Gives *setup instructions*  
✅ Shows *API usage*  
✅ Communicates *limitations and ethics*  
✅ Helps professor, recruiter, or developer quickly understand  

---

If you want, I can also generate:

🔹 A **project demo GIF**  
🔹 A **tech stack diagram**  
🔹 A **user guide PDF**  

Just ask 🙂
::contentReference[oaicite:1]{index=1}
