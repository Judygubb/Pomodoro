import '../css/index.css';
import '../css/middle_container.css';
import '../css/left_container.css';

function MainView({ timer, progress, isRunning, isBreak, isFinished, onPlay, onPause, onReset, onSkip, onFinished}) {

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

  return (
    <>
    <div className={`background-container background-container.break ${isBreak ? 'break' : ''}`}>

      <div className="section">
        <div className="top-left-buttons">
          <div className="music-title-container">
            <button className="button button-music"></button>
            <div className="text">Jane Doe - Kenshi Yonezu x Hikaru Utada</div>
          </div>
           <button className="button button-mute"></button>
           <button className="button button-settings"></button>
        </div>
      </div>

      <div className="section">
        <div className="pomodoro-container"> 

          <div className={`tomato tomato.break ${isBreak ? 'break' : ''}`}>
            <h1 className="timer">{timer || "00:00"}</h1>
          </div>

          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }} 
            ></div>
          </div>

          <div className="text">Current Task: Taking out the trash</div>

          
          <div className="buttons">
            <button className="button button-back" 
                    onClick={handleResetClick}></button>

            <button className={`button button-play ${isRunning ? 'running' : ''}`} 
                    onClick={handlePlayClick}></button>
            
            <button className="button button-skip" 
                    onClick={handleSkipClick}></button>
          </div>

        </div>
    </div>

  <div className="section"></div>
</div>
    </>
  )
}

export default MainView
