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
  const [emojiCount, setEmojiCount] = useState(0); // Track collected emojis
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
    let playerX = 30;
    let velocityY = 0;
    let velocityX = 0;
    const gravity = 0.5;
    const jumpForce = -12;
    let platforms: { x: number; y: number; width: number; height: number }[] = [];
    let collectibles: { x: number; y: number; width: number; height: number; collected: boolean }[] = [];
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

      // Add collectible above platform
      collectibles.push({
        x: canvas.width + 30,
        y: platformHeight - 40,
        width: 20,
        height: 20,
        collected: false
      });
    };

    const update = () => {
      // Update player
      velocityY += gravity;
      playerY += velocityY;

      // Move platforms and collectibles at a slower speed
      platforms.forEach(platform => {
        platform.x -= 0.7;
      });

      collectibles.forEach(collectible => {
        collectible.x -= 0.7;
      });

      // Check collectible collisions without resetting position
      collectibles = collectibles.filter(collectible => {
        if (!collectible.collected &&
            playerX < collectible.x + collectible.width &&
            playerX + player.width > collectible.x &&
            playerY < collectible.y + collectible.height &&
            playerY + player.height > collectible.y) {
          setEmojiCount(prev => Math.min(22, prev + 1));
          collectible.collected = true;
        }
        return !collectible.collected && collectible.x > -collectible.width;
      });

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

      // Draw collectibles
      ctx.fillStyle = '#9b4dca';
      collectibles.forEach(collectible => {
        if (!collectible.collected) {
          ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
        }
      });

      // Draw ground
      ctx.fillStyle = '#795548';
      ctx.fillRect(0, canvas.height - 2, canvas.width, 2);
    };

    const drawEmojiCount = () => {
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`✨: ${emojiCount}`, 10, 30);
    };

    const checkCollisions = () => {
      // Check ground collision
      if (playerY + player.height > canvas.height - 2) {
        console.log('[Game] Ground collision detected');
        playerY = canvas.height - player.height - 2;
        velocityY = 0;
        isJumping = false;
        consecutiveJumps = 0;
      }

      // Check platform collisions
      platforms.forEach((platform, index) => {
        if (
          playerX < platform.x + platform.width &&
          playerX + player.width > platform.x &&
          playerY + player.height > platform.y &&
          playerY < platform.y + platform.height
        ) {
          console.log(`[Game] Platform collision detected at index ${index}`);
          playerY = platform.y - player.height;
          velocityY = 0;
          isJumping = false;
          consecutiveJumps = 0;
        }
      });

      // Check collectible collisions
      collectibles.forEach((collectible, index) => {
        if (
          !collectible.collected &&
          playerX < collectible.x + collectible.width &&
          playerX + player.width > collectible.x &&
          playerY + player.height > collectible.y &&
          playerY < collectible.y + collectible.height
        ) {
          console.log(`[Game] Collectible collected at index ${index}`);
          console.log('[Game] Current game state before reset:', {
            playerX,
            playerY,
            platformCount: platforms.length,
            emojiCount
          });

          collectible.collected = true;
          setEmojiCount(prev => {
            console.log('[Game] Updating emoji count from', prev, 'to', prev + 1);
            return prev + 1;
          });

          // Reset position and clear platforms
          playerX = 30;
          playerY = 250;
          platforms = [];

          console.log('[Game] Game state after reset:', {
            playerX,
            playerY,
            platformCount: platforms.length,
            emojiCount: emojiCount + 1
          });
        }
      });
    };


    const gameLoop = () => {
      if (!gameOver) {
        update();
        checkCollisions(); // Call the collision detection function
        draw();
        drawEmojiCount(); // Draw emoji count each frame
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
  }, [gameOver, emojiCount]);

  const canClaimToken = emojiCount >= 22; // Condition to enable claim button

  const claimChristianityToken = () => {
    // Implement your token claiming logic here.  This is a placeholder.
    // For example, you might make a fetch request to your backend.
    fetch('/api/claim-token', {
      method: 'POST',
      body: JSON.stringify({ token: 'Christianity Token' }),
    })
      .then(response => {
        if (response.ok) {
          alert('Christianity Token claimed!');
          setEmojiCount(0); // Reset emoji count after claiming
        } else {
          alert('Failed to claim token.');
        }
      })
      .catch(error => {
        console.error('Error claiming token:', error);
        alert('Failed to claim token.');
      });
  };

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
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
      <div className="relative">
        {canClaimToken && (
          <button
            onClick={claimChristianityToken}
            className="absolute top-2 right-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Claim Christianity Token
          </button>
        )}
      </div>

    </div>
  );
};

export default GameComponent;