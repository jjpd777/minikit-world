"use client";
import { useRef, useEffect, useState } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;
const BLOCK_SIZE = 30;

const GameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bookmarkedFiles, setBookmarkedFiles] = useState<string[]>([]);
  const [selectedAudioFile, setSelectedAudioFile] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const filesPerPage = 5;

  useEffect(() => {
    const loadBookmarkedFiles = () => {
      const bookmarked = JSON.parse(localStorage.getItem('bookmarkedAudios') || '[]');
      setBookmarkedFiles(bookmarked);
    };

    loadBookmarkedFiles();
    window.addEventListener('storage', loadBookmarkedFiles);
    return () => window.removeEventListener('storage', loadBookmarkedFiles);
  }, []);

  const playAudioFile = async (gsPath: string) => {
    try {
      const filePath = gsPath.replace(/^gs:\/\/[^/]+\//, '');
      const response = await fetch(`/api/upload-audio?file=${encodeURIComponent(filePath)}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio file');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setSelectedAudioFile(url);
    } catch (error) {
      console.error('Error playing audio file:', error);
      alert('Failed to play audio file');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let playerY = 250;
    let velocity = 0;
    const gravity = 0.4;
    const jumpForce = -8;
    let obstacles: { x: number; width: number; height: number }[] = [];
    let gameSpeed = 4;
    let isJumping = false;

    const player = {
      x: 30,
      width: 25,
      height: 25,
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
        width: 15,
        height: 30,
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
          if (lives > 1) {
            setLives(prev => prev - 1);
            // Reset player position and remove obstacle
            playerY = 250;
            velocity = 0;
            obstacles = obstacles.filter(obs => obs !== obstacle);
          } else {
            setGameOver(true);
          }
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
    <div className="flex flex-col items-center gap-8">
      <canvas
        ref={canvasRef}
        width={BOARD_WIDTH * BLOCK_SIZE}
        height={BOARD_HEIGHT * BLOCK_SIZE}
        className="border border-purple-500"
      />
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-white">Lives: {lives}</span>
        <span className="text-white">Score: {score}</span>
      </div>
      
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-xl text-white mb-4">Final Score: {score}</p>
          <button
            onClick={() => {
              setGameOver(false);
              setScore(0);
              setLives(3);
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Play Again
          </button>
        </div>
      )}

      {bookmarkedFiles.length > 0 && (
        <div className="w-full max-w-md">
          <div className="max-h-80 overflow-y-auto bg-purple-900/20 p-4 rounded-lg">
            {[...bookmarkedFiles]
              .reverse()
              .slice(currentPage * filesPerPage, (currentPage + 1) * filesPerPage)
              .map((file, index) => {
                const globalIndex = bookmarkedFiles.length - (currentPage * filesPerPage + index);
                return (
                  <div
                    key={index}
                    onClick={() => playAudioFile(file)}
                    className="text-white text-sm mb-2 p-2 bg-purple-800/20 rounded cursor-pointer hover:bg-purple-700/20"
                  >
                    🎵 Prayer #{globalIndex}
                  </div>
                );
              })}
          </div>
          {selectedAudioFile && (
            <audio
              controls
              src={selectedAudioFile}
              className="mt-4 w-full"
              autoPlay
            />
          )}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-purple-400/80 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white">
              Page {currentPage + 1} of {Math.ceil(bookmarkedFiles.length / filesPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(bookmarkedFiles.length / filesPerPage) - 1, prev + 1))}
              disabled={currentPage >= Math.ceil(bookmarkedFiles.length / filesPerPage) - 1}
              className="px-4 py-2 bg-purple-400/80 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
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