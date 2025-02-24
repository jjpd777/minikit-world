"use client";
import { useRef, useEffect, useState } from "react";

const TOKENS = [
  { address: "0x908BE4717360397348F35271b9461192B6c84522", name: "Christianity" },
  { address: "0xC1b3a96113aC409fe3a40126962c74aEBccDda62", name: "Orthodox" },
  { address: "0x848B9D2d07C601706ff86b7956579bDFB9Bc0635", name: "Judaism" },
  { address: "0x723da9e13D5519a63a5cbC8342B4e4c3aE1eEb8A", name: "Islam" },
  { address: "0x840934539c988fA438f005a4B94234E50f5D6c4a", name: "Sikhism" },
  { address: "0x5b1b84197a2235C67c65E0Ec60f891A6975bcb95", name: "Hinduism" },
  { address: "0x2AC26A1380B3eBbe4149fbcAf61e88D0304688d7", name: "Science" },
  { address: "0xd01366ca8642a0396c4e909feb8c5E9Ec3A00F65", name: "Buddhism" }
];

const RELIGIOUS_TOKEN_ABI = [
  {
    inputs: [],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const GameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [isClaimingToken, setIsClaimingToken] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isTransactionConfirmed, setIsTransactionConfirmed] = useState(false);
  const [bookmarkedFiles, setBookmarkedFiles] = useState<string[]>([]);
  const [selectedAudioFile, setSelectedAudioFile] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [emojiCount, setEmojiCount] = useState(0);
  const filesPerPage = 5;

  useEffect(() => {
    const loadBookmarkedFiles = () => {
      const bookmarked = JSON.parse(
        localStorage.getItem("bookmarkedAudios") || "[]",
      );
      setBookmarkedFiles(bookmarked);
    };

    loadBookmarkedFiles();
    window.addEventListener("storage", loadBookmarkedFiles);
    return () => window.removeEventListener("storage", loadBookmarkedFiles);
  }, []);

  const playAudioFile = async (gsPath: string) => {
    try {
      const filePath = gsPath.replace(/^gs:\/\/[^/]+\//, "");
      const response = await fetch(
        `/api/upload-audio?file=${encodeURIComponent(filePath)}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch audio file");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setSelectedAudioFile(url);
    } catch (error) {
      console.error("Error playing audio file:", error);
      alert("Failed to play audio file");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 340;
    canvas.height = 400;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let playerY = 250;
    let playerX = 20;
    let velocityY = 0;
    const gravity = 0.5;
    const jumpForce = -10;

    let collectible = {
      x: canvas.width + 20,
      y: 320,
      width: 15,
      height: 15,
      collected: false,
      speed: canvas.width / (61 * 60),
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
      if (e.code === "Space") {
        handleJump();
      }
    };

    const handleTouch = () => {
      handleJump();
    };

    const update = () => {
      velocityY += gravity;
      playerY += velocityY;

      // Move collectible
      if (!collectible.collected) {
        collectible.x -= collectible.speed;
      }

      // Check collectible collision
      if (
        !collectible.collected &&
        playerX < collectible.x + collectible.width &&
        playerX + player.width > collectible.x &&
        playerY < collectible.y + collectible.height &&
        playerY + player.height > collectible.y
      ) {
        collectible.collected = true;
        setShowPopup(true); // Show popup on collision
        return; // This pauses the game by stopping the update
      }

      // Keep player in bounds
      if (playerY > canvas.height - player.height) {
        playerY = canvas.height - player.height;
        velocityY = 0;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(
        playerX + player.width / 2,
        playerY + player.height / 2,
        player.width / 2,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // Draw collectible
      if (!collectible.collected) {
        ctx.save();
        const radius = player.width;
        const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 1; // Pulsing effect

        // Outer glow
        ctx.beginPath();
        ctx.arc(collectible.x + radius, collectible.y + radius, radius * 2 * pulse, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          collectible.x + radius, collectible.y + radius, radius,
          collectible.x + radius, collectible.y + radius, radius * 2 * pulse
        );
        gradient.addColorStop(0, '#FFEB3B');
        gradient.addColorStop(1, 'rgba(255, 235, 59, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner circle
        ctx.beginPath();
        ctx.arc(collectible.x + radius, collectible.y + radius, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
      }

      // Draw ground
      ctx.fillStyle = "#795548";
      ctx.fillRect(0, canvas.height - 2, canvas.width, 2);
    };

    const gameLoop = () => {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", handleTouch);
    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  const canClaimToken = emojiCount >= 22;

  const claimChristianityToken = () => {
    fetch("/api/claim-token", {
      method: "POST",
      body: JSON.stringify({ token: "Christianity Token" }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Christianity Token claimed!");
          setEmojiCount(0);
        } else {
          alert("Failed to claim token.");
        }
      })
      .catch((error) => {
        console.error("Error claiming token:", error);
        alert("Failed to claim token.");
      });
  };

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="border border-gray-600 rounded-lg"
        style={{ backgroundColor: "#2D2D2D" }}
      />
      {bookmarkedFiles.length > 0 && (
        <div className="w-full max-w-md">
          <div className="max-h-80 overflow-y-auto bg-purple-900/20 p-4 rounded-lg">
            {[...bookmarkedFiles]
              .reverse()
              .slice(
                currentPage * filesPerPage,
                (currentPage + 1) * filesPerPage,
              )
              .map((file, index) => {
                const globalIndex =
                  bookmarkedFiles.length - (currentPage * filesPerPage + index);
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
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-purple-400/80 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white">
              Page {currentPage + 1} of{" "}
              {Math.ceil(bookmarkedFiles.length / filesPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    Math.ceil(bookmarkedFiles.length / filesPerPage) - 1,
                    prev + 1,
                  ),
                )
              }
              disabled={
                currentPage >=
                Math.ceil(bookmarkedFiles.length / filesPerPage) - 1
              }
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
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white font-bold">Claim Tokens</h2>
              <button
                onClick={() => {
                  setShowPopup(false);
                  window.location.reload();
                }}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <select 
                className="w-full bg-gray-800 text-white rounded-lg p-2 border border-gray-700"
                onChange={(e) => setSelectedToken(e.target.value)}
                value={selectedToken}
              >
                <option value="">Select a token</option>
                {TOKENS.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.name}
                  </option>
                ))}
              </select>
              <button
                onClick={async () => {
                  if (!selectedToken) {
                    alert("Please select a token first");
                    return;
                  }
                  if (!MiniKit.isInstalled()) {
                    alert("Please install World App to claim tokens");
                    return;
                  }
                  setIsClaimingToken(true);
                  try {
                    const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                      transaction: [{
                        address: selectedToken,
                        abi: RELIGIOUS_TOKEN_ABI,
                        functionName: "claimTokens",
                        args: []
                      }]
                    });

                    if (finalPayload.status === "success") {
                      setTransactionId(finalPayload.transaction_id);
                      setIsTransactionConfirmed(true);
                      alert("Tokens claimed successfully!");
                    }
                  } catch (error) {
                    console.error("Failed to claim tokens:", error);
                    alert("Failed to claim tokens: " + error.message);
                  } finally {
                    setIsClaimingToken(false);
                  }
                }}
                disabled={!selectedToken || isClaimingToken}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isClaimingToken ? "Claiming..." : isTransactionPending ? "Confirming..." : isTransactionConfirmed ? "Tokens Claimed!" : "Claim Tokens"}
              </button>
              {transactionId && (
                <p className="text-sm text-gray-400">
                  Transaction ID: {transactionId}
                </p>
              )}
              {isTransactionConfirmed && (
                <button
                  onClick={() => {
                    setShowPopup(false);
                    window.location.reload();
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameComponent;