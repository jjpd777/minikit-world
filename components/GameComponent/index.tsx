
import { useRef, useEffect, useState } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

interface Piece {
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

const TETROMINOS = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00f0f0'
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: '#f0f000'
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#a000f0'
  },
  L: {
    shape: [[1, 0], [1, 0], [1, 1]],
    color: '#f0a000'
  },
  J: {
    shape: [[0, 1], [0, 1], [1, 1]],
    color: '#0000f0'
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#00f000'
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#f00000'
  }
};

const GameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState<string[][]>(
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);

  const createNewPiece = () => {
    const pieces = Object.keys(TETROMINOS);
    const tetromino = TETROMINOS[pieces[Math.floor(Math.random() * pieces.length)] as keyof typeof TETROMINOS];
    return {
      shape: tetromino.shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: 0,
      color: tetromino.color
    };
  };

  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw board
    board.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      });
    });

    // Draw current piece
    if (currentPiece) {
      ctx.fillStyle = currentPiece.color;
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            ctx.fillRect(
              (currentPiece.x + x) * BLOCK_SIZE,
              (currentPiece.y + y) * BLOCK_SIZE,
              BLOCK_SIZE - 1,
              BLOCK_SIZE - 1
            );
          }
        });
      });
    }
  };

  const isValidMove = (piece: Piece, offsetX: number, offsetY: number) => {
    return piece.shape.every((row, y) => {
      return row.every((value, x) => {
        const newX = piece.x + x + offsetX;
        const newY = piece.y + y + offsetY;
        return (
          value === 0 ||
          (newX >= 0 &&
            newX < BOARD_WIDTH &&
            newY < BOARD_HEIGHT &&
            (newY < 0 || board[newY][newX] === ''))
        );
      });
    });
  };

  const mergePiece = (piece: Piece) => {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = piece.y + y;
          if (boardY >= 0) {
            board[boardY][piece.x + x] = piece.color;
          }
        }
      });
    });

    // Check for completed lines
    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board[y].every(cell => cell !== '')) {
        board.splice(y, 1);
        board.unshift(Array(BOARD_WIDTH).fill(''));
        linesCleared++;
        y++;
      }
    }

    setScore(prev => prev + linesCleared * 100);
    setBoard([...board]);
  };

  const moveDown = () => {
    if (!currentPiece) return;
    
    if (isValidMove(currentPiece, 0, 1)) {
      setCurrentPiece({
        ...currentPiece,
        y: currentPiece.y + 1
      });
    } else {
      mergePiece(currentPiece);
      const newPiece = createNewPiece();
      if (!isValidMove(newPiece, 0, 0)) {
        setGameOver(true);
      } else {
        setCurrentPiece(newPiece);
      }
    }
  };

  const rotatePiece = () => {
    if (!currentPiece) return;

    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[row.length - 1 - i])
    );

    const newPiece = {
      ...currentPiece,
      shape: rotated
    };

    if (isValidMove(newPiece, 0, 0)) {
      setCurrentPiece(newPiece);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = BOARD_WIDTH * BLOCK_SIZE;
    canvas.height = BOARD_HEIGHT * BLOCK_SIZE;

    if (!currentPiece && !gameOver) {
      setCurrentPiece(createNewPiece());
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || !currentPiece) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (isValidMove(currentPiece, -1, 0)) {
            setCurrentPiece({
              ...currentPiece,
              x: currentPiece.x - 1
            });
          }
          break;
        case 'ArrowRight':
          if (isValidMove(currentPiece, 1, 0)) {
            setCurrentPiece({
              ...currentPiece,
              x: currentPiece.x + 1
            });
          }
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = setInterval(() => {
      if (!gameOver) {
        moveDown();
      }
    }, 1000);

    const renderLoop = () => {
      drawBoard(ctx);
      requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(gameLoop);
    };
  }, [currentPiece, board, gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-white text-xl">Score: {score}</div>
      <canvas
        ref={canvasRef}
        className="border border-gray-600"
      />
      {gameOver && (
        <div className="text-red-500 text-xl">Game Over!</div>
      )}
    </div>
  );
};

export default GameComponent;
