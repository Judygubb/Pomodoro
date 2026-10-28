import '../css/index.css';
import '../css/home_page.css';

function MainView({ timer, isRunning, isBreak, onPlay, onPause, onReset, onSkip}) {

  const clickSound = new Audio('/sounds/click.mp3');
  const alarmSound = new Audio('/sounds/timer_done.mp3');

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

  function handleResetClick(){
    playSound(clickSound);
    if (onReset) onReset();
  };

  function handleSkipClick(){
    playSound(clickSound);
    if (onSkip) onSkip();
  };

  return (
    <>
      <div className={`background background.break ${isBreak ? 'break' : ''}`}>
        <div className="pomodoro-container"> 

          <div className={`tomato tomato.break ${isBreak ? 'break' : ''}`}>
            <h1 className="timer">{timer || "00:00"}</h1>
          </div>
          
          <div className="buttons">
            <button className="button button-back" onClick={handleResetClick}></button>

            <button className={`button button-play ${isRunning ? 'running' : ''}`} onClick={handlePlayClick}></button>
            
            <button className="button button-skip" onClick={handleSkipClick}></button>
          </div>

        </div>
      </div>
    </>
  )
}

export default MainView
