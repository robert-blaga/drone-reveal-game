import React, { useState, useEffect, useRef } from 'react';

const GameStart = ({ onCountdownEnd }) => {
  const [countdown, setCountdown] = useState(3);
  const audioRef = useRef(new Audio('/audio/game_start.mp3'));

  useEffect(() => {
    const audio = audioRef.current;
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
  }, [onCountdownEnd]);

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '72px',
      color: 'white',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      zIndex: 1000
    }}>
      {countdown > 0 ? countdown : 'GO!'}
    </div>
  );
};

export default GameStart;