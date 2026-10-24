import { useState } from 'react'
import './css/index.css'
import './css/home_page.css'

function App() {

  const clickSound = new Audio('/sounds/click.mp3');

  const playSound = (audio) => {
    audio.currentTime = 0; // Reset sound to start if clicked rapidly
    audio.play().catch(err => console.log("Audio play deferred:", err));
  };

  function playButtonClick(){
    playSound(clickSound);
    console.log("Play");
  };

  function backButtonClick(){
    playSound(clickSound);
    console.log("Back");
  };

  function skipButtonClick(){
    playSound(clickSound);
    console.log("Skip");
  };

  return (
    <>
      <div className="background">
        <div className="pomodoro-container"> 

          <div className="tomato">
            <h1 className="timer">00:00</h1>
          </div>
          
          <div className="buttons">
            <button className="button button-back" onClick={backButtonClick}></button>

            <button className="button button-play" onClick={playButtonClick}></button>
            
            <button className="button button-skip" onClick={skipButtonClick}></button>
          </div>

        </div>
      </div>
    </>
  )
}

export default App
