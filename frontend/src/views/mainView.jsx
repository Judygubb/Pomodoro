import '../css/index.css';
import '../css/home_page.css';

function MainView({ timer, isRunning, onPlay, onPause, onSkip}) {

  const clickSound = new Audio('/sounds/click.mp3');

  const playSound = (audio) => {
    audio.currentTime = 0; // Reset sound to start if clicked rapidly
    audio.play().catch(err => console.log("Audio play deferred:", err));
  };

  function handlePlayClick(){
    playSound(clickSound);

    if (isRunning) {
      if (onPause) onPause();
    } else {
      if (onPlay) onPlay();
    }
  };

  function handleBackClick(){
    playSound(clickSound);

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

            <button className={`button button-play ${isRunning ? 'running' : ''}`} onClick={handlePlayClick}></button>
            
            <button className="button button-skip" onClick={handleSkipClick}></button>
          </div>

        </div>
      </div>
    </>
  )
}

export default MainView
