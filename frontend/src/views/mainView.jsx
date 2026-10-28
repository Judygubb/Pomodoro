import React, { useState } from 'react';

import '../css/index.css';
import '../css/middle_container.css';
import '../css/left_&_right_containers.css';

import TimerComponent from '../components/timerComponent.jsx'
import ControlComponent from '../components/controlComponent.jsx'
import MusicPanel from '../components/musicPanel.jsx'

function MainView({ timer, progress, isRunning, isBreak, isFinished, onPlay, onPause, onReset, onSkip, onFinished}) {

  const [isMusicOpen, setIsMusicOpen] = useState(false);

  const clickSound = new Audio('/sounds/click.mp3');
  const alarmSound = new Audio('/sounds/timer_done.mp3');

  const playSound = (audio) => {
    audio.currentTime = 0; // Reset sound to start if clicked rapidly
    audio.play().catch(err => console.log("Audio play deferred:", err));
  };

  if (isFinished) {
  playSound(alarmSound);
  if (onFinished) onFinished();
  };

  function handlePlayClick(){
    playSound(clickSound);
    if (isRunning) {
      if (onPause) onPause();
    } else {
      if (onPlay) onPlay();
    }
  };

  function handleResetClick(){
    playSound(clickSound);
    if (onReset) onReset();
  };

  function handleSkipClick(){
    playSound(clickSound);
    if (onSkip) onSkip();
  };

  function handleMusicClick() {
    playSound(clickSound);
    setIsMusicOpen(true)
  }

  return (
    <>
    <div className={`background-container ${isBreak ? 'break' : ''}`}>
      
      {/* Top-Left Section */}
      <div className="section">
        <div className="top-left-buttons">
          <div className="music-title-container">
            <button className="button button-music" onClick={handleMusicClick}></button>
            <div className="text">Jane Doe - Kenshi Yonezu x Hikaru Utada</div>
          </div>
          <button className="button button-mute"></button>
          <button className="button button-settings"></button>
        </div>
      </div>

      {/* Middle Section */}
      <div className="section">
        <div className="middle-container">
          <div className="section"></div>

          <TimerComponent 
            isBreak={isBreak}
            timer={timer}
          />

          <div className="section">
            <ControlComponent 
              progress={progress}
              isRunning={isRunning}
              handleResetClick={handleResetClick}
              handlePlayClick={handlePlayClick}
              handleSkipClick={handleSkipClick}
            />
          </div>
        </div>
      </div>

      {/* Top-Right Section */}
      <div className="section">
        <div className="top-right-buttons">
          <button className="button button-menu"></button>
        </div>
      </div>

    </div>
    <MusicPanel isMusicOpen={isMusicOpen}
                onClose={() => setIsMusicOpen(false)}
                />
    </>
  )
}

export default MainView
