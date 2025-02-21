
"use client";
import { useEffect, useRef, useState } from 'react';

const GameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let playerY = 150;
    let velocity = 0;
    const gravity = 0.5;
    const jumpForce = -10;
    let obstacles: { x: number; width: number; height: number }[] = [];
    let gameSpeed = 5;
    let isJumping = false;

    const player = {
      x: 50,
      width: 30,
      height: 30,
    };

    const handleJump = () => {
      if (!isJumping) {
        velocity = jumpForce;
        isJumping = true;
      }
    };

    const addObstacle = () => {
      obstacles.push({
        x: canvas.width,
        width: 20,
        height: 40,
      });
    };

    const update = () => {
      // Update player
      velocity += gravity;
      playerY += velocity;

      // Ground collision
      if (playerY > canvas.height - player.height) {
        playerY = canvas.height - player.height;
        velocity = 0;
        isJumping = false;
      }

      // Update obstacles
      obstacles = obstacles.filter(obstacle => {
        obstacle.x -= gameSpeed;
        
        // Collision detection
        if (
          player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          playerY < canvas.height - obstacle.height &&
          playerY + player.height > canvas.height - obstacle.height
        ) {
          setGameOver(true);
        }

        return obstacle.x > -obstacle.width;
      });

      // Add new obstacles
      if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 300) {
        addObstacle();
      }

      setScore(prev => prev + 1);
    };

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(player.x, playerY, player.width, player.height);

      // Draw obstacles
      ctx.fillStyle = '#F44336';
      obstacles.forEach(obstacle => {
        ctx.fillRect(
          obstacle.x,
          canvas.height - obstacle.height,
          obstacle.width,
          obstacle.height
        );
      });

      // Draw ground
      ctx.fillStyle = '#795548';
      ctx.fillRect(0, canvas.height - 2, canvas.width, 2);
    };

    const gameLoop = () => {
      if (!gameOver) {
        update();
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    // Event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleJump();
      }
    };

    canvas.addEventListener('click', handleJump);
    window.addEventListener('keydown', handleKeyDown);
    gameLoop();

    return () => {
      canvas.removeEventListener('click', handleJump);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver]);

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="border border-gray-700 bg-gray-800"
      />
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <p className="text-white text-2xl mb-4">Game Over! Score: {score}</p>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Play Again
          </button>
        </div>
      )}
      <p className="text-white mt-2">Score: {score}</p>
      <p className="text-gray-400 text-sm mt-2">
        Press SPACE or click to jump
      </p>
    </div>
  );
};

export default GameComponent;
