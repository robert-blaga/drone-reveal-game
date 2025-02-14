import React, { useState, useEffect, useRef } from 'react';
import './GameStart.css';

const GameStart = ({ onCountdownEnd }) => {
  const [countdown, setCountdown] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const audioRef = useRef(new Audio('/audio/game_start.mp3'));

  const startCountdown = () => {
    setShowInstructions(false);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    const audio = audioRef.current;
    audio.volume = 0.05;
    audio.play().catch(e => console.error("Error playing audio:", e));

    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount === 1) {
          clearInterval(timer);
          onCountdownEnd();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [countdown, onCountdownEnd]);

  if (!showInstructions && countdown === null) return null;

  return (
    <div className="game-start-overlay">
      {showInstructions ? (
        <div className="start-container">
          <div className="game-instructions">
            <h2 className="how-to-play">HOW TO PLAY</h2>
            <div className="instruction-list">
              <p>Use <span className="key">↑</span><span className="key">↓</span><span className="key">←</span><span className="key">→</span> keyboard keys to move the Paintbrush and reveal the hidden image and the passcode for the next section.</p>
            </div>
          </div>
          <button className="start-button" onClick={startCountdown}>
            Start Game
          </button>
        </div>
      ) : (
        <div className="countdown">
          {countdown > 0 ? countdown : 'GO!'}
        </div>
      )}
    </div>
  );
};

export default GameStart;