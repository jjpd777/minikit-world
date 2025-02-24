"use client";
import { useRef, useEffect, useState } from 'react';

const GameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bookmarkedFiles, setBookmarkedFiles] = useState<string[]>([]);
  const [selectedAudioFile, setSelectedAudioFile] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [emojiCount, setEmojiCount] = useState(0);
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

    canvas.width = 200;
    canvas.height = 400;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let playerY = 250;
    let playerX = 20;
    let velocityY = 0;
    const gravity = 0.5;
    const jumpForce = -10;

    let obstacles = Array.from({ length: 3 }, (_, i) => ({
      x: canvas.width + i * 150,
      y: 300,
      width: 20,
      height: 60,
      speed: 2
    }));

    let collectible = {
      x: canvas.width + 20,
      y: 320,
      width: 15,
      height: 15,
      collected: false,
      speed: canvas.width / (61 * 60)
    };

    const player = {
      width: 25,
      height: 25,
    };

    const handleJump = () => {
      if (playerY >= canvas.height - player.height) {
        velocityY = jumpForce;
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

    const update = () => {
      velocityY += gravity;
      playerY += velocityY;

      // Move obstacles
      obstacles.forEach(obstacle => {
        obstacle.x -= obstacle.speed;
        if (obstacle.x + obstacle.width < 0) {
          obstacle.x = canvas.width;
        }
      });

      // Move collectible
      if (!collectible.collected) {
        collectible.x -= collectible.speed;
      }

      // Check collectible collision
      if (!collectible.collected &&
          playerX < collectible.x + collectible.width &&
          playerX + player.width > collectible.x &&
          playerY < collectible.y + collectible.height &&
          playerY + player.height > collectible.y) {
        collectible.collected = true;
        setEmojiCount(prev => prev + 1);
      }

      // Keep player in bounds
      if (playerY > canvas.height - player.height) {
        playerY = canvas.height - player.height;
        velocityY = 0;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw obstacles
      ctx.fillStyle = '#4CAF50';
      obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      // Draw player
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

      // Draw collectible
      if (!collectible.collected) {
        ctx.fillStyle = '#9b4dca';
        ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
      }

      // Draw ground
      ctx.fillStyle = '#795548';
      ctx.fillRect(0, canvas.height - 2, canvas.width, 2);

      // Draw emoji count
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`✨: ${emojiCount}`, 10, 30);
    };

    const gameLoop = () => {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouch);
    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  const canClaimToken = emojiCount >= 22;

  const claimChristianityToken = () => {
    fetch('/api/claim-token', {
      method: 'POST',
      body: JSON.stringify({ token: 'Christianity Token' }),
    })
      .then(response => {
        if (response.ok) {
          alert('Christianity Token claimed!');
          setEmojiCount(0);
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
        className="border border-gray-600 rounded-lg"
        style={{ backgroundColor: '#2D2D2D' }}
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