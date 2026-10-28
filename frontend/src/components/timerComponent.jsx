export default function TimerSection({
  isBreak,
  timer,
}) {
  return (
    <>
      <div className={`tomato ${isBreak ? 'break' : ''}`}>
        <h1 className="timer">{timer || "00:00"}</h1>
      </div>
    </>
  );
}