import React from 'react';

const GameDashboard = ({ revealedPercentage, speed }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000
    }}>
      <div>Revealed: {revealedPercentage.toFixed(2)}%</div>
      <div>Speed: {speed} km/h</div>
    </div>
  );
};

export default GameDashboard;