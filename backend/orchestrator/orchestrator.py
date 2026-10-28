from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, Form, HTTPException, UploadFile, Request
from fastapi.responses import StreamingResponse
import requests

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
MUSIC_SERVICE_URL = "http://music-service:8002"

# --- TIMER ROUTES ---

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

@app.post("/api/timer/break")
def break_timer():
    try:
        response = requests.post(f"{TIMER_SERVICE_URL}/break")
        return response.json()
    except requests.exceptions.ConnectionError:
        return {"error": "Timer service is offline"}

@app.post("/api/timer/work")
def work_timer():
    try:
        response = requests.post(f"{TIMER_SERVICE_URL}/work")
        return response.json()
    except requests.exceptions.ConnectionError:
        return {"error": "Timer service is offline"}


# --- MUSIC SERVICE PROXIES ---

@app.get("/api/songs")
def get_songs():
    try:
        response = requests.get(f"{MUSIC_SERVICE_URL}/api/songs")
        return response.json()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Music service is offline")

@app.post("/api/songs")
async def upload_song(name: str = Form(...), artist: str = Form(...), file: UploadFile = File(...)):
    try:
        # Forward the file and form fields to the internal music-service
        files = {"file": (file.filename, await file.read(), file.content_type)}
        data = {"name": name, "artist": artist}
        
        response = requests.post(f"{MUSIC_SERVICE_URL}/api/songs", data=data, files=files)
        return response.json()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Music service is offline")

@app.get("/api/songs/{song_id}/stream")
def stream_song(song_id: int):
    try:
        # Stream the binary audio response through the orchestrator back to the frontend
        req = requests.get(f"{MUSIC_SERVICE_URL}/api/songs/{song_id}/stream", stream=True)
        if req.status_code == 404:
            raise HTTPException(status_code=404, detail="Song not found")
        
        return StreamingResponse(req.iter_content(chunk_size=1024), media_type="audio/mpeg")
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Music service is offline")

@app.delete("/api/songs/{song_id}")
def delete_song(song_id: int):
    try:
        response = requests.delete(f"{MUSIC_SERVICE_URL}/api/songs/{song_id}")
        return response.json()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Music service is offline")