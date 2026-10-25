from fastapi import FastAPI
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS so your React frontend can talk to the orchestrator
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The internal Docker network name and port for your timer service
TIMER_SERVICE_URL = "http://timer-service:8001"

@app.get("/api/timer/state")
def get_timer_state():
    try:
        response = requests.get(f"{TIMER_SERVICE_URL}/state")
        return response.json()
    except requests.exceptions.ConnectionError:
        return {"error": "Timer service is offline", "formatted_time": "00:00", "is_running": False}

@app.post("/api/timer/start")
def start_timer():
    try:
        response = requests.post(f"{TIMER_SERVICE_URL}/start")
        return response.json()
    except requests.exceptions.ConnectionError:
        return {"error": "Timer service is offline"}

@app.post("/api/timer/pause")
def pause_timer():
    try:
        response = requests.post(f"{TIMER_SERVICE_URL}/pause")
        return response.json()
    except requests.exceptions.ConnectionError:
        return {"error": "Timer service is offline"}

@app.post("/api/timer/reset")
def reset_timer():
    try:
        response = requests.post(f"{TIMER_SERVICE_URL}/reset")
        return response.json()
    except requests.exceptions.ConnectionError:
        return {"error": "Timer service is offline"}