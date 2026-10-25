import { useState, useEffect } from 'react';
import MainView from '../views/mainView.jsx';

const ORCHESTRATOR_URL = 'http://localhost:8000';

export default function MainPresenter() {
  const [timerData, setTimerData] = useState({ formatted_time: "25:00", is_running: false, is_break: false});

  // Fetch initial timer state
  useEffect(() => {
    async function fetchState() {
      try {
        const response = await fetch(`${ORCHESTRATOR_URL}/api/timer/state`);
        if (response.ok) {
          const data = await response.json();
          setTimerData(data);
        }
      } catch (error) {
        console.error("Error fetching timer state:", error);
      }
    }
    fetchState();
  }, []);

  // Live polling
  useEffect(() => {
    let interval = null;

    if (timerData.is_running) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${ORCHESTRATOR_URL}/api/timer/state`);
          if (response.ok) {
            const data = await response.json();
            setTimerData(data);
          }
        } catch (error) {
          console.error("Error polling timer state:", error);
        }
      }, 1000); // Runs every 1 second
    }

    // Cleanup interval when paused or component unmounts
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerData.is_running]);

  // Starting timer logic
  const handlePlay = async () => {
    try {
      const response = await fetch(`${ORCHESTRATOR_URL}/api/timer/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setTimerData(data);
      }
    } catch (error) {
      console.error("Error starting timer:", error);
    }
  };

  // Pausing timer logic
  const handlePause = async () => {
    try {
      const response = await fetch(`${ORCHESTRATOR_URL}/api/timer/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setTimerData(data);
      }
    } catch (error) {
      console.error("Error pausing timer:", error);
    }
  };

  // reseting timer logic
  const handleReset = async () => {
    try {
      const response = await fetch(`${ORCHESTRATOR_URL}/api/timer/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setTimerData(data);
      }
    } catch (error) {
      console.error("Error reseting timer:", error);
    }
  };

  // Skipping logic
  const handleSkip = async () => {
    if (timerData.is_break) {
      try {
        const response = await fetch(`${ORCHESTRATOR_URL}/api/timer/work`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setTimerData(data);
        }
      } catch (error) {
        console.error("Error resetting timer:", error);
      }
    } else {
      try {
        const response = await fetch(`${ORCHESTRATOR_URL}/api/timer/break`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setTimerData(data);
        }
      } catch (error) {
        console.error("Error resetting timer:", error);
      }
    }
  };

  // Passing props to view
  return (
    <MainView 
      timer={timerData.formatted_time}
      isRunning={timerData.is_running}
      isBreak={timerData.is_break}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      onSkip={handleSkip}
    />
  );
}