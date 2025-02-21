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
  const filesPerPage = 5;

  const trackGameStart = async () => {
    const walletAddress = localStorage.getItem('walletAddress') || '';
    try {
      await fetch('/api/track-gameplay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          timestamp: new Date().toISOString(),
          unix_timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error('Failed to track game start:', error);
    }
  };

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
    let playerX = 30;
    let velocityY = 0;
    let velocityX = 0;
    const gravity = 0.4;
    const jumpForce = -15;
    let platforms: { x: number; y: number; width: number; height: number }[] = [];
    let isJumping = false;
    let consecutiveJumps = 0;
    const maxConsecutiveJumps = 2;

    const player = {
      width: 25,
      height: 25,
    };

    const handleJump = () => {
      if (consecutiveJumps < maxConsecutiveJumps) {
        velocityY = jumpForce * (consecutiveJumps + 1);
        isJumping = true;
        consecutiveJumps++;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleJump();
      }
    };

    const handleTouch = () => {
      handleJump();
    };

    const addPlatform = () => {
      const minHeight = canvas.height * 0.3;
      const maxHeight = canvas.height * 0.7;
      const platformHeight = Math.random() * (maxHeight - minHeight) + minHeight;

      platforms.push({
        x: canvas.width,
        y: platformHeight,
        width: 80,
        height: 15
      });
    };

    const update = () => {
      // Update player
      velocityY += gravity;
      playerY += velocityY;

      // Keep player in bounds
      if (playerX < 0) playerX = 0;
      if (playerX + player.width > canvas.width) playerX = canvas.width - player.width;

      // Ground collision
      if (playerY > canvas.height - player.height) {
        playerY = canvas.height - player.height;
        velocityY = 0;
        isJumping = false;
        consecutiveJumps = 0;
      }

      // Update platforms
      platforms = platforms.filter(platform => {
        platform.x -= 2;

        // Platform collision
        if (playerX + player.width > platform.x &&
            playerX < platform.x + platform.width &&
            playerY + player.height > platform.y &&
            playerY < platform.y + platform.height) {

          // Landing on top of platform
          if (velocityY > 0 && playerY < platform.y) {
            playerY = platform.y - player.height;
            velocityY = 0;
            isJumping = false;
            consecutiveJumps = 0;
          }
        }

        return platform.x > -platform.width;
      });

      // Add new platforms
      if (platforms.length === 0 || platforms[platforms.length - 1].x < canvas.width - 300) {
        addPlatform();
      }

      setScore(prev => prev + 1);
    };

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player glow effect
      const gradient = ctx.createRadialGradient(
        playerX + player.width/2, 
        playerY + player.height/2, 
        player.width/4,
        playerX + player.width/2, 
        playerY + player.height/2, 
        player.width
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 150, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(
        playerX + player.width/2,
        playerY + player.height/2,
        player.width,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw player circle
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(
        playerX + player.width/2,
        playerY + player.height/2,
        player.width/2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw platforms
      ctx.fillStyle = '#4CAF50';
      platforms.forEach(platform => {
        ctx.fillRect(
          platform.x,
          platform.y,
          platform.width,
          platform.height
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

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouch);

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouch);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver]);

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
      <button onClick={trackGameStart}>Play Game</button> {/* Added Play Game button */}
      <canvas
        ref={canvasRef}
        width={Math.min(BOARD_WIDTH * BLOCK_SIZE * 3, window.innerWidth - 32)}  
        height={BOARD_HEIGHT * BLOCK_SIZE}
        className="border border-purple-500 max-w-full"
        style={{ touchAction: 'none' }}
      />
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
    </div>
  );
};

export default GameComponent;