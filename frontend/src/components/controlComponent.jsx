export default function TimerSection({
    progress,
    isRunning,
    handleResetClick,
    handlePlayClick,
    handleSkipClick
}) {
  return (
    <>
        <div className="control-container">
            <div className="progress-bar">
                <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
                ></div>
            </div>
            
            <div className="text">Current Task: Taking out the trash</div>

            <div className="buttons">
                <button 
                    className="button button-back" 
                    onClick={handleResetClick}
                ></button>
                <button 
                    className={`button button-play ${isRunning ? 'running' : ''}`} 
                    onClick={handlePlayClick}
                ></button> 
                <button 
                    className="button button-skip" 
                    onClick={handleSkipClick}
                ></button>
            </div>
        </div>
    </>
  );
}