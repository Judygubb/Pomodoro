import os
import sqlite3
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MusicService:
    def __init__(self, db_path="data/database.db", upload_dir="uploads"):
        self.db_path = db_path
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)
        self._init_db()

    def _init_db(self):
        """Initializes the SQLite database table."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS songs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    artist TEXT NOT NULL,
                    file_path TEXT NOT NULL
                )
            """)
            conn.commit()

            # Check if the songs table is empty
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM songs")
            count = cursor.fetchone()[0]

            if count == 0:
                self._seed_default_songs(conn, cursor)


    def _seed_default_songs(self, conn, cursor):
        """Copies default sample MP3s from initial_songs/ and inserts them into DB."""
        initial_songs_dir = "initial_songs"
        
        # Default tracks definition
        default_tracks = [
            {
                "name": "Once Upon A Time",
                "artist": "Toby Fox",
                "filename": "once_upon_a_time.mp3"
            },
            {
                "name": "Home",
                "artist": "Toby Fox",
                "filename": "home.mp3"
            }
        ]

        for track in default_tracks:
            src_path = os.path.join(initial_songs_dir, track["filename"])
            dest_path = os.path.join(self.upload_dir, track["filename"])

            # If the sample file exists in your repository image, copy it to uploads
            if os.path.exists(src_path):
                if not os.path.exists(dest_path):
                    with open(src_path, "rb") as f_src, open(dest_path, "wb") as f_dst:
                        f_dst.write(f_src.read())

                # Insert metadata into SQLite
                cursor.execute(
                    "INSERT INTO songs (name, artist, file_path) VALUES (?, ?, ?)",
                    (track["name"], track["artist"], dest_path)
                )
        conn.commit()

    def get_all_songs(self):
        """Retrieves all song metadata from SQLite."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, artist FROM songs")
            return [dict(row) for row in cursor.fetchall()]

    async def add_song(self, name: str, artist: str, file: UploadFile):
        """Saves the MP3 file to disk and records metadata in SQLite."""
        file_path = os.path.join(self.upload_dir, file.filename)
        
        # Save binary file locally
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Save metadata to database
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO songs (name, artist, file_path) VALUES (?, ?, ?)",
                (name, artist, file_path)
            )
            conn.commit()
            
        return {"message": "Song added successfully"}

    def get_song_path(self, song_id: int):
        """Fetches the physical file path for streaming."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT file_path FROM songs WHERE id = ?", (song_id,))
            row = cursor.fetchone()
            if row and os.path.exists(row[0]):
                return row[0]
        return None

    def delete_song(self, song_id: int):
        """Deletes the song file from disk and removes it from SQLite."""
        file_path = self.get_song_path(song_id)
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM songs WHERE id = ?", (song_id,))
            conn.commit()
            
        return {"message": "Song deleted successfully"}

# Instantiate your service
music_service = MusicService()

@app.get("/api/songs")
def get_songs():
    return music_service.get_all_songs()

@app.post("/api/songs")
async def upload_song(name: str = Form(...), artist: str = Form(...), file: UploadFile = File(...)):
    return await music_service.add_song(name, artist, file)

@app.get("/api/songs/{song_id}/stream")
def stream_song(song_id: int):
    file_path = music_service.get_song_path(song_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="Song not found")
    return FileResponse(file_path, media_type="audio/mpeg")

@app.delete("/api/songs/{song_id}")
def delete_song(song_id: int):
    return music_service.delete_song(song_id)