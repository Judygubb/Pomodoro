import { useState, useEffect } from 'react';
import MainView from '../views/mainView.jsx';

const ORCHESTRATOR_URL = 'http://localhost:8000';

export default function MainPresenter() {
  const [timerData, setTimerData] = useState({ formatted_time: "25:00", is_running: false });

  // Fetch initial timer state from the backend on load
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

  // Poll the backend every second when the timer is running (NOW INSIDE THE COMPONENT)
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

  const handlePlay = async () => {
    try {
      console.log("play: presenter");
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

  const handleBack = async () => {
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

  const handleSkip = () => {
    console.log("Skip logic goes here");
  };

  // Pass state and actions down to your view
  return (
    <MainView 
      timer={timerData.formatted_time}
      onPlay={handlePlay}
      onBack={handleBack}
      onSkip={handleSkip}
    />
  );
}