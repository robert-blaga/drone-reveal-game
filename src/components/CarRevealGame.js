import React, { useEffect, useRef, useState } from 'react';
import GameDashboard from './GameDashboard';
import GameStart from './GameStart';

const CarRevealGame = () => {
  const canvasRef = useRef(null);
  const revealCanvasRef = useRef(null);
  const carCanvasRef = useRef(null);
  const carPositionRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const movementRef = useRef({ forward: false, reverse: false });
  const turningRef = useRef({ left: false, right: false });
  const angleRef = useRef(0); // 0 radians is pointing right
  const lastUpdateTimeRef = useRef(0);
  const [revealedPercentage, setRevealedPercentage] = useState(0);
  const [speed, setSpeed] = useState(0);
  const totalPixelsRef = useRef(0);
  const revealedPixelsRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);

  const handleCountdownEnd = () => {
    setGameStarted(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const revealCanvas = revealCanvasRef.current;
    const carCanvas = carCanvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    revealCanvas.width = window.innerWidth;
    revealCanvas.height = window.innerHeight;
    carCanvas.width = window.innerWidth;
    carCanvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const revealCtx = revealCanvas.getContext('2d');
    const carCtx = carCanvas.getContext('2d');
    const backgroundImage = new Image();
    const revealImage = new Image();
    const carImage = new Image();

    backgroundImage.src = '/images/background-image.png';
    revealImage.src = '/images/reveal-image.png';
    carImage.src = '/images/car-image.png';


    

    totalPixelsRef.current = canvas.width * canvas.height;

    const drawGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      
      // Draw the revealed area
      ctx.drawImage(revealCanvas, 0, 0);

      // Clear the car canvas and draw the car
      carCtx.clearRect(0, 0, canvas.width, canvas.height);
      carCtx.save();
      carCtx.translate(carPositionRef.current.x, carPositionRef.current.y);
      carCtx.rotate(angleRef.current);
      carCtx.drawImage(carImage, -50, -50, 100, 100);
      carCtx.restore();
    };

    const updateRevealCanvas = () => {
      revealCtx.save();
      revealCtx.beginPath();
      revealCtx.arc(carPositionRef.current.x, carPositionRef.current.y, 100, 0, Math.PI * 2); // Increased radius from 25 to 50
      revealCtx.clip();
      revealCtx.drawImage(revealImage, 0, 0, canvas.width, canvas.height);
      revealCtx.restore();

      // Calculate revealed pixels
      const imageData = revealCtx.getImageData(0, 0, revealCanvas.width, revealCanvas.height);
      const pixels = imageData.data;
      let revealedPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] > 0) revealedPixels++;
      }
      revealedPixelsRef.current = revealedPixels;
      const percentage = (revealedPixels / totalPixelsRef.current) * 100;
      setRevealedPercentage(percentage);
    };

    const pixelsPerSecond = 320; // This value represents the top speed in km/h
    
    const gameLoop = (currentTime) => {
      if (!lastUpdateTimeRef.current) {
        lastUpdateTimeRef.current = currentTime;
        lastPositionRef.current = { ...carPositionRef.current };
      }

      const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
      lastUpdateTimeRef.current = currentTime;

      const moveDistance = pixelsPerSecond * deltaTime;
      const turnAngle = 2 * deltaTime; // Adjust this value to change turning speed

      let dx = 0;
      let dy = 0;

      if (movementRef.current.forward) {
        dx += Math.cos(angleRef.current) * moveDistance;
        dy += Math.sin(angleRef.current) * moveDistance;
      }
      if (movementRef.current.reverse) {
        dx -= Math.cos(angleRef.current) * moveDistance;
        dy -= Math.sin(angleRef.current) * moveDistance;
      }

      if (turningRef.current.left) {
        angleRef.current -= turnAngle;
      }
      if (turningRef.current.right) {
        angleRef.current += turnAngle;
      }

      if (dx !== 0 || dy !== 0) {
        carPositionRef.current = {
          x: Math.max(0, Math.min(canvas.width, carPositionRef.current.x + dx)),
          y: Math.max(0, Math.min(canvas.height, carPositionRef.current.y + dy))
        };
        updateRevealCanvas();
      }

      // Set speed directly based on movement
      let newSpeed = 0;
      if (movementRef.current.forward) {
        newSpeed = pixelsPerSecond;
      } else if (movementRef.current.reverse) {
        newSpeed = pixelsPerSecond / 2; // Assume reverse is half the forward speed
      }

      setSpeed(Math.round(newSpeed));

      console.log('Debug:', {
        deltaTime,
        dx,
        dy,
        newSpeed,
        isMoving: movementRef.current.forward || movementRef.current.reverse,
        isTurning: turningRef.current.left || turningRef.current.right
      });

      lastPositionRef.current = { ...carPositionRef.current };

      drawGame();
      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e) => {
      console.log("Key pressed:", e.key);
      switch (e.key) {
        case 'ArrowUp':
          movementRef.current.forward = true;
          break;
        case 'ArrowDown':
          movementRef.current.reverse = true;
          break;
        case 'ArrowLeft':
          turningRef.current.left = true;
          break;
        case 'ArrowRight':
          turningRef.current.right = true;
          break;
        default:
          break;
      }
      
    };

    const handleKeyUp = (e) => {
      console.log("Key released:", e.key);
      switch (e.key) {
        case 'ArrowUp':
          movementRef.current.forward = false;
          break;
        case 'ArrowDown':
          movementRef.current.reverse = false;
          break;
        case 'ArrowLeft':
          turningRef.current.left = false;
          break;
        case 'ArrowRight':
          turningRef.current.right = false;
          break;
        default:
          break;
      }
      
      // Check if all movement and turning keys are released
      if (!movementRef.current.forward && !movementRef.current.reverse &&
          !turningRef.current.left && !turningRef.current.right) {
        
      }
    };

    

    

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      revealCanvas.width = window.innerWidth;
      revealCanvas.height = window.innerHeight;
      carCanvas.width = window.innerWidth;
      carCanvas.height = window.innerHeight;
      carPositionRef.current = {
        x: Math.min(carPositionRef.current.x, window.innerWidth),
        y: Math.min(carPositionRef.current.y, window.innerHeight)
      };
    };

    const startGame = () => {
      console.log('Starting game');
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      requestAnimationFrame(gameLoop);
    };

    let imagesLoaded = 0;
    const onImageLoad = () => {
      imagesLoaded += 1;
      console.log(`Image loaded: ${imagesLoaded}`);
      if (imagesLoaded === 3) {
        startGame();
      }
    };

    const handleImageError = (imageName) => {
      console.error(`Failed to load ${imageName}`);
    };

    backgroundImage.onload = onImageLoad;
    revealImage.onload = onImageLoad;
    carImage.onload = onImageLoad;
    backgroundImage.onerror = () => handleImageError('background image');
    revealImage.onerror = () => handleImageError('reveal image');
    carImage.onerror = () => handleImageError('car image');

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {!gameStarted && <GameStart onCountdownEnd={handleCountdownEnd} />}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />
      <canvas
        ref={revealCanvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />
      <canvas
        ref={carCanvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />
      <GameDashboard revealedPercentage={revealedPercentage} speed={speed} />
    </div>
  );
};

export default CarRevealGame;