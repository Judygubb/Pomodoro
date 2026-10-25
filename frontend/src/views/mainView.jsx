import { useState } from 'react'
import '../css/index.css';
import '../css/home_page.css';

function MainView({ timer, onPlay, onBack, onSkip }) {

  const clickSound = new Audio('/sounds/click.mp3');

  const playSound = (audio) => {
    audio.currentTime = 0; // Reset sound to start if clicked rapidly
    audio.play().catch(err => console.log("Audio play deferred:", err));
  };

  function handlePlayClick(){
    playSound(clickSound);
    if (onPlay) onPlay();

    console.log("Play");
  };

  function handleBackClick(){
    playSound(clickSound);
    if (onBack) onBack();

    console.log("Back");
  };

  function handleSkipClick(){
    playSound(clickSound);
    if (onSkip) onSkip();

    console.log("Skip");
  };

  return (
    <>
      <div className="background">
        <div className="pomodoro-container"> 

          <div className="tomato">
            <h1 className="timer">{timer || "00:00"}</h1>
          </div>
          
          <div className="buttons">
            <button className="button button-back" onClick={handleBackClick}></button>

            <button className="button button-play" onClick={handlePlayClick}></button>
            
            <button className="button button-skip" onClick={handleSkipClick}></button>
          </div>

        </div>
      </div>
    </>
  )
}

export default MainView
