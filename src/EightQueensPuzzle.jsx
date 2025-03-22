import React, { useState } from "react";

const boardSize = 8;

const EightQueensPuzzle = () => {
  // Create a board state: a 2D array of booleans (false = empty, true = queen)
  const [board, setBoard] = useState(
    Array.from({ length: boardSize }, () => Array(boardSize).fill(false))
  );
  const [message, setMessage] = useState("");

  // Helper to count current queens on the board
  const countQueens = (board) =>
    board.flat().filter((cell) => cell).length;

  // Toggle queen placement on a cell, but allow a maximum of 8 queens
  const toggleQueen = (row, col) => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((r) => [...r]);
      // If the cell already has a queen, allow removal.
      if (newBoard[row][col]) {
        newBoard[row][col] = false;
        setMessage("");
      } else {
        // If placing a queen, check the current count.
        const queensCount = countQueens(newBoard);
        if (queensCount >= boardSize) {
          setMessage("Maximum of 8 queens allowed!");
          return prevBoard; // Return previous board unmodified.
        }
        newBoard[row][col] = true;
        setMessage("");
      }
      return newBoard;
    });
  };

  // Check if board is a valid solution for the 8 queens puzzle
  const isValidSolution = () => {
    const queens = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j]) {
          queens.push({ row: i, col: j });
        }
      }
    }
    // There must be exactly 8 queens
    if (queens.length !== boardSize) return false;

    for (let i = 0; i < queens.length; i++) {
      for (let j = i + 1; j < queens.length; j++) {
        const q1 = queens[i];
        const q2 = queens[j];
        // Same row or same column
        if (q1.row === q2.row || q1.col === q2.col) return false;
        // Same diagonal: difference in rows equals difference in columns
        if (Math.abs(q1.row - q2.row) === Math.abs(q1.col - q2.col))
          return false;
      }
    }
    return true;
  };

  // Handler for checking the solution
  const checkSolution = () => {
    if (isValidSolution()) {
      setMessage("Congratulations! Valid solution.");
    } else {
      setMessage("Not a valid solution. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">8 Queens Puzzle</h1>
      <div className="grid grid-cols-8 gap-1 border-4 border-gray-700">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            // Alternate cell colors for chessboard effect
            const isDark = (rowIndex + colIndex) % 2 === 1;
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => toggleQueen(rowIndex, colIndex)}
                className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center border 
                  ${isDark ? "bg-gray-700" : "bg-gray-300 text-gray-900"} 
                  ${cell ? "bg-red-500" : ""} 
                  focus:outline-none`}
              >
                {cell && "♛"}
              </button>
            );
          })
        )}
      </div>
      <button
        onClick={checkSolution}
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold"
      >
        Check Solution
      </button>
      {message && (
        <p className="mt-4 text-xl font-semibold">
          {message}
        </p>
      )}
    </div>
  );
};

export default EightQueensPuzzle;
