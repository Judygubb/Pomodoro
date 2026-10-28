import { useState, useEffect } from 'react';
import { useSQLite } from '../useSQLite';

export default function MusicManager() {
  const { db, isReady, saveToDisk } = useSQLite();
  const [songs, setSongs] = useState([]);
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);

  useEffect(() => {
    if (!isReady || !db) return;
    fetchSongs();
  }, [isReady, db]);

  const fetchSongs = () => {
    const result = db.exec("SELECT id, name, artist FROM songs"); // Don't pull raw binary data until needed
    if (result.length > 0) {
      const columns = result[0].columns;
      const values = result[0].values;
      const formattedSongs = values.map(row => {
        let song = {};
        columns.forEach((col, index) => { song[col] = row[index]; });
        return song;
      });
      setSongs(formattedSongs);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill song name from filename if empty
      if (!songName) setSongName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const addSong = async (e) => {
    e.preventDefault();
    if (!songName.trim() || !artistName.trim() || !selectedFile) return;

    // Read the MP3 file as an ArrayBuffer
    const arrayBuffer = await selectedFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Insert song name, artist, and binary audio data into SQLite
    db.run(
      "INSERT INTO songs (name, artist, data) VALUES (?, ?, ?)", 
      [songName, artistName, uint8Array]
    );
    
    saveToDisk();
    fetchSongs();

    // Reset form
    setSongName('');
    setArtistName('');
    setSelectedFile(null);
  };

  const playSong = (id) => {
    // Query the specific song's binary data
    const stmt = db.prepare("SELECT data FROM songs WHERE id = ?");
    stmt.bind([id]);
    
    if (stmt.step()) {
      const row = stmt.get();
      const binaryData = row[0]; // This is a Uint8Array of the MP3 file
      
      // Create a playable blob URL from the binary data
      const blob = new Blob([binaryData], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);
      
      setCurrentAudioUrl(audioUrl);
    }
    stmt.free();
  };

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h3>Local Music Database</h3>
      <form onSubmit={addSong}>
        <input 
          type="text" 
          placeholder="Song Name" 
          value={songName} 
          onChange={(e) => setSongName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Artist" 
          value={artistName} 
          onChange={(e) => setArtistName(e.target.value)} 
        />
        <input 
          type="file" 
          accept="audio/mp3,audio/*" 
          onChange={handleFileUpload} 
        />
        <button type="submit">Save Song to DB</button>
      </form>

      {/* Audio player preview */}
      {currentAudioUrl && (
        <div style={{ margin: '20px 0' }}>
          <audio controls src={currentAudioUrl} autoPlay />
        </div>
      )}

      <ul>
        {songs.map(song => (
          <li key={song.id} style={{ margin: '10px 0' }}>
            <strong>{song.name}</strong> by {song.artist} &nbsp;
            <button onClick={() => playSong(song.id)}>Play</button>
          </li>
        ))}
      </ul>
    </div>
  );
}