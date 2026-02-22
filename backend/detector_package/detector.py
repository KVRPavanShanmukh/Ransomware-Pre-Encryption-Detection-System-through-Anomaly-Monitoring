import os
import time
import json
import requests
from collections import deque
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, "monitor.log")

if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)
    
# ================= LOAD CONFIG =================

with open("config.json", "r") as f:
    config = json.load(f)

API_BASE = config["api_base"]
TOKEN = config["token"]

RENAME_THRESHOLD = 15
MODIFY_THRESHOLD = 25
TIME_WINDOW = 10

rename_events = deque()
modify_events = deque()

# ================= ALERT FUNCTION =================

def send_alert(message):
    print("⚠ ALERT:", message)

    try:
        requests.post(
            f"{API_BASE}/api/detector/log",
            json={
                "token": TOKEN,
                "log_content": message
            },
            timeout=5
        )
    except Exception as e:
        print("Backend notify failed:", e)

# ================= MONITOR CLASS =================

class FolderGuard(FileSystemEventHandler):

    def on_moved(self, event):
        now = time.time()
        rename_events.append(now)

        while rename_events and now - rename_events[0] > TIME_WINDOW:
            rename_events.popleft()

        if len(rename_events) >= RENAME_THRESHOLD:
            send_alert("Mass rename activity detected.")
            rename_events.clear()

    def on_modified(self, event):
        now = time.time()
        modify_events.append(now)

        while modify_events and now - modify_events[0] > TIME_WINDOW:
            modify_events.popleft()

        if len(modify_events) >= MODIFY_THRESHOLD:
            send_alert("High modification spike detected.")
            modify_events.clear()

# ================= MAIN =================

def monitor_directory(path):
    observer = Observer()
    observer.schedule(FolderGuard(), path, recursive=True)
    observer.start()

    print("\n=================================")
    print("PRD-SYS FolderGuard Running...")
    print("Monitoring:", path)
    print("Press CTRL+C to stop.")
    print("=================================\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()


if __name__ == "__main__":

    print("Enter directory to monitor:")
    target = input("> ").strip()

    if not os.path.exists(target):
        print("Invalid directory. Exiting.")
        exit()

    monitor_directory(target)