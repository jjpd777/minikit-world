"use client";

import { useRef, useEffect, useState } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINOES = [
  { shape: [[1, 1, 1, 1]], color: '#00f0f0' }, // I
  { shape: [[1, 1], [1, 1]], color: '#f0f000' }, // O
  { shape: [[1, 1, 1], [0, 1, 0]], color: '#a000f0' }, // T
  { shape: [[1, 1, 1], [1, 0, 0]], color: '#f0a000' }, // L
  { shape: [[1, 1, 1], [0, 0, 1]], color: '#0000f0' }, // J
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#00f000' }, // S
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#f00000' }, // Z
];

export const GameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPiece, setCurrentPiece] = useState(() => ({
    shape: TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)].shape,
    color: TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)].color,
    x: Math.floor(BOARD_WIDTH / 2) - 1,
    y: 0,
  }));
  const [board, setBoard] = useState(() =>
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const BLOCK_SIZE = 30;
    canvas.width = BOARD_WIDTH * BLOCK_SIZE;
    canvas.height = BOARD_HEIGHT * BLOCK_SIZE;

    const drawBoard = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the grid
      board.forEach((row, y) => {
        row.forEach((color, x) => {
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        });
      });

      // Draw current piece
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
    };

    const gameLoop = setInterval(() => {
      if (!gameOver) {
        movePiece(0, 1);
        drawBoard();
      }
    }, 1000);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
      drawBoard();
    };

    window.addEventListener('keydown', handleKeyPress);
    drawBoard();

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [board, currentPiece, gameOver]);

  const movePiece = (dx: number, dy: number) => {
    const newX = currentPiece.x + dx;
    const newY = currentPiece.y + dy;

    if (isValidMove(newX, newY, currentPiece.shape)) {
      setCurrentPiece(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    } else if (dy > 0) {
      // Piece has landed
      placePiece();
      checkLines();
      spawnNewPiece();
    }
  };

  const rotatePiece = () => {
    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );

    if (isValidMove(currentPiece.x, currentPiece.y, rotated)) {
      setCurrentPiece(prev => ({
        ...prev,
        shape: rotated,
      }));
    }
  };

  const isValidMove = (x: number, y: number, shape: number[][]) => {
    return shape.every((row, dy) =>
      row.every((value, dx) =>
        value === 0 ||
        (x + dx >= 0 &&
          x + dx < BOARD_WIDTH &&
          y + dy >= 0 &&
          y + dy < BOARD_HEIGHT &&
          !board[y + dy]?.[x + dx])
      )
    );
  };

  const placePiece = () => {
    const newBoard = [...board];
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          if (currentPiece.y + y < 0) {
            setGameOver(true);
            return;
          }
          newBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
        }
      });
    });
    setBoard(newBoard);
  };

  const checkLines = () => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      if (row.every(cell => cell !== null)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }

    if (linesCleared > 0) {
      setScore(prev => prev + linesCleared * 100);
      setBoard(newBoard);
    }
  };

  const spawnNewPiece = () => {
    const randomPiece = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
    setCurrentPiece({
      shape: randomPiece.shape,
      color: randomPiece.color,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-white text-xl">Score: {score}</div>
      <canvas
        ref={canvasRef}
        className="border-2 border-white"
      />
      {gameOver && (
        <div className="text-white text-xl">
          Game Over! Score: {score}
        </div>
      )}
    </div>
  );
};