//import MusicManager from './musicManager';

import '../css/musicPanel.css';
import '../css/index.css';

export default function MusicPanel({ isMusicOpen, onClose }) {
  if (!isMusicOpen) return null;

  return (
    <div className="background-overlay" onClick={onClose}>
      <div className="music-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="text">Music Library</div>
      </div>
    </div>
  );
}