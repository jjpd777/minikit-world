"use client";
import { useRef, useEffect, useState } from 'react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 50;
const JUMP_FORCE = 12;
const GRAVITY = 0.6;

export default function GameComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerY, setPlayerY] = useState(GAME_HEIGHT - PLAYER_HEIGHT);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<{ x: number; y: number }[]>([]);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastObstacleTime = Date.now();

    const createObstacle = () => {
      const now = Date.now();
      if (now - lastObstacleTime > 2000) {
        setObstacles(prev => [...prev, { x: GAME_WIDTH, y: GAME_HEIGHT - OBSTACLE_HEIGHT }]);
        lastObstacleTime = now;
      }
    };

    const updateGame = () => {
      if (gameOver) return;

      // Update player
      setPlayerY(prev => {
        const newY = prev + velocity;
        if (newY > GAME_HEIGHT - PLAYER_HEIGHT) {
          setIsJumping(false);
          setVelocity(0);
          return GAME_HEIGHT - PLAYER_HEIGHT;
        }
        return newY;
      });
      setVelocity(prev => prev + GRAVITY);

      // Update obstacles
      setObstacles(prev => {
        const newObstacles = prev
          .map(obs => ({ ...obs, x: obs.x - 5 }))
          .filter(obs => obs.x > -OBSTACLE_WIDTH);
        return newObstacles;
      });

      // Check collisions
      const playerHitbox = {
        x: 50,
        y: playerY,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
      };

      obstacles.forEach(obstacle => {
        const obstacleHitbox = {
          x: obstacle.x,
          y: obstacle.y,
          width: OBSTACLE_WIDTH,
          height: OBSTACLE_HEIGHT,
        };

        if (
          playerHitbox.x < obstacleHitbox.x + obstacleHitbox.width &&
          playerHitbox.x + playerHitbox.width > obstacleHitbox.x &&
          playerHitbox.y < obstacleHitbox.y + obstacleHitbox.height &&
          playerHitbox.y + playerHitbox.height > obstacleHitbox.y
        ) {
          setGameOver(true);
        }
      });

      // Increment score
      setScore(prev => prev + 1);

      // Create new obstacles
      createObstacle();
    };

    const drawGame = () => {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw player
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(50, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);

      // Draw obstacles
      ctx.fillStyle = '#ff0000';
      obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
      });

      // Draw score
      ctx.fillStyle = '#000000';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);

      if (gameOver) {
        ctx.fillStyle = '#000000';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2);
      }
    };

    const gameLoop = () => {
      if (!gameOver) {
        updateGame();
      }
      drawGame();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isJumping && !gameOver) {
        setVelocity(-JUMP_FORCE);
        setIsJumping(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, playerY, velocity, obstacles, score, isJumping]);

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setPlayerY(GAME_HEIGHT - PLAYER_HEIGHT);
    setVelocity(0);
    setObstacles([]);
    setIsJumping(false);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="border border-gray-300"
      />
      {gameOver && (
        <button
          onClick={handleRestart}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Restart
        </button>
      )}
    </div>
  );
}