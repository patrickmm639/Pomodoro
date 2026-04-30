import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Flame } from 'lucide-react';
import './index.css';

const MODES = {
  POMODORO: { id: 'pomodoro', label: 'Pomodoro', minutes: 25 },
  SHORT_BREAK: { id: 'short_break', label: 'Short Break', minutes: 5 },
  LONG_BREAK: { id: 'long_break', label: 'Long Break', minutes: 15 },
};

function App() {
  const [mode, setMode] = useState(MODES.POMODORO);
  const [timeLeft, setTimeLeft] = useState(MODES.POMODORO.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  // Audio and Worker references
  const audioRef = useRef(null);
  const workerRef = useRef(null);

  useEffect(() => {
    // Create audio object for notification
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

    // Create a web worker to handle the timer interval.
    // This prevents the browser from throttling the timer when the tab is inactive.
    const workerCode = `
      let interval;
      self.onmessage = function(e) {
        if (e.data === 'start') {
          if (interval) clearInterval(interval);
          interval = setInterval(() => {
            self.postMessage('tick');
          }, 1000);
        } else if (e.data === 'stop') {
          if (interval) clearInterval(interval);
          interval = null;
        }
      };
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleModeChange = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode.minutes * 60);
  };

  // Effect to manage the Web Worker depending on running state
  useEffect(() => {
    if (!workerRef.current) return;

    if (isRunning) {
      workerRef.current.onmessage = () => {
        setTimeLeft((prev) => {
          return prev > 0 ? prev - 1 : 0;
        });
      };
      workerRef.current.postMessage('start');
    } else {
      workerRef.current.postMessage('stop');
    }

    return () => {
      workerRef.current.postMessage('stop');
    };
  }, [isRunning]);

  // Effect to handle phase transitions when time reaches 0
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      }

      if (mode.id === MODES.POMODORO.id) {
        setCycles((c) => c + 1);
        handleModeChange(MODES.SHORT_BREAK);
      } else {
        handleModeChange(MODES.POMODORO);
      }
    }
  }, [timeLeft, isRunning, mode]);


  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode.minutes * 60);
  };

  // Format time (MM:SS)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="app-container animate-slide-up glass-panel">
      
      <div className="header">
        <h1>Pomodoro</h1>
        <div className="cycles">
          <Flame size={18} color="#ff2a5f" />
          <span>{cycles} Cycles Completed</span>
        </div>
      </div>

      <div className="mode-selector">
        {Object.values(MODES).map((m) => (
          <button
            key={m.id}
            className={`mode-btn ${mode.id === m.id ? 'active' : ''}`}
            onClick={() => handleModeChange(m)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className={`timer-container ${isRunning ? 'running' : ''}`}>
        <span className="timer-text">{formattedTime}</span>
      </div>

      <div className="controls">
        <button className="control-btn" onClick={resetTimer} title="Reset">
          <RotateCcw size={24} />
        </button>
        
        <button className="control-btn primary" onClick={toggleTimer}>
          {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        
        <button className="control-btn" onClick={() => { setIsRunning(false); setTimeLeft(0); }} title="Skip">
          <Square size={24} fill="currentColor" />
        </button>
      </div>

    </div>
  );
}

export default App;
