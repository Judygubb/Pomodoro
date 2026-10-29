//import MusicManager from './musicManager';

import '../css/musicPanel.css';
import '../css/index.css';

export default function MusicPanel({ isMusicOpen, onClose, songs = [] }) {
  if (!isMusicOpen) return null;

  return (
    <div className="background-overlay" onClick={onClose}>
      <div className="music-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="text">Music Library</div>

        <div className="song-list">
          {songs.length === 0 ? (
            <p className="empty-text">No songs in library yet.</p>
          ) : (
            songs.map((song) => (
              <div key={song.id} className="song-row">
                <div className="song-details">
                  <span className="song-name">{song.name}</span>
                  <span className="song-artist">{song.artist}</span>
                </div>
                <button 
                  className="play-btn" 
                  onClick={() => onPlaySong(song.id)}
                >
                  ▶ Play
                </button>
              </div>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}