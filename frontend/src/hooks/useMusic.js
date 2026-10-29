import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api';

export function useMusic() {
  const [songs, setSongs] = useState([]);
  const [queue, setQueue] = useState([]);

  // Fetch all songs when the app loads
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await fetch(`${API_BASE}/songs`);
      const data = await res.json();
      setSongs(data); // This populates your song library array!
    } catch (err) {
      console.error("Failed to fetch songs:", err);
    }
  };

  return {
    songs,       // Array of all songs from SQLite
    queue,       // Active playback queue
    fetchSongs,  // Expose this if you want to manually refresh later
    // ... other music functions (add, delete, stream, etc.)
  };
}