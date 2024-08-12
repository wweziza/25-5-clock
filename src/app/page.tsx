'use client'
import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

const Page: React.FC = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [isRunning, setIsRunning] = useState(false);
  const [animalState, setAnimalState] = useState('idle');

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            audioRef.current?.play();
            setAnimalState('celebrating');
            setTimeout(() => setAnimalState('idle'), 3000);
            
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timerLabel, breakLength, sessionLength]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    setAnimalState('idle');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    setAnimalState(isRunning ? 'idle' : 'active');
  };

  const handleLengthChange = (type: 'break' | 'session', change: number) => {
    if (!isRunning) {
      if (type === 'break') {
        setBreakLength((prev) => {
          const newValue = prev + change;
          return newValue > 0 && newValue <= 60 ? newValue : prev;
        });
      } else {
        setSessionLength((prev) => {
          const newValue = prev + change;
          if (newValue > 0 && newValue <= 60) {
            setTimeLeft(newValue * 60);
            return newValue;
          }
          return prev;
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>25 + 5 Clock</h1>
      <div className={styles.timerContainer}>
        <div className={styles.length}>
          <div id="break-label">Break Length</div>
          <div className={styles.controls}>
            <button id="break-decrement" onClick={() => handleLengthChange('break', -1)}>-</button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={() => handleLengthChange('break', 1)}>+</button>
          </div>
        </div>
        <div className={styles.length}>
          <div id="session-label">Session Length</div>
          <div className={styles.controls}>
            <button id="session-decrement" onClick={() => handleLengthChange('session', -1)}>-</button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={() => handleLengthChange('session', 1)}>+</button>
          </div>
        </div>
      </div>
      <div className={styles.timer}>
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left" className={styles.timeLeft}>{formatTime(timeLeft)}</div>
      </div>
      <div className={styles.mainControls}>
        <button id="start_stop" onClick={handleStartStop}>{isRunning ? 'Pause' : 'Start'}</button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>
      <div className={`${styles.animal} ${styles[animalState]}`}></div>
      <audio id="beep" ref={audioRef} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
      <footer className={styles.footer}>
      Created by <a href="https://github.com/wweziza/25-5-clock" target="_blank" rel="noopener noreferrer">weziza</a>
      </footer>
    </div>
  );
};

export default Page;