import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const boardSize = 8;

const EightQueensPuzzle = () => {
  const navigate = useNavigate();
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
      // Navigate to thank you page when solved successfully
      navigate("/Thankyou");
    } else {
      setMessage("Not a valid solution. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">8 Queens Puzzle</h1>

      {/* Instruction Section with Transparent Background */}
      <div className="bg-black/50 p-4 rounded-md text-white text-center max-w-3xl mb-6">
        <p>
          Place exactly 8 queens on the chessboard so that no two queens threaten each other.
          Click on a cell to place or remove a queen. When you're done, click "Check Solution" 
          to see if you solved the puzzle!
        </p>
      </div>

      {/* Chessboard */}
      <div className="grid grid-cols-8 gap-1 border-4 border-gray-700 w-full max-w-md">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            // Alternate cell colors for chessboard effect
            const isDark = (rowIndex + colIndex) % 2 === 1;
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => toggleQueen(rowIndex, colIndex)}
                className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center border 
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

      {/* Check Solution Button */}
      <button
        onClick={checkSolution}
        className="mt-6 px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold"
      >
        Check Solution
      </button>

      {/* Message Display */}
      {message && (
        <p className="mt-4 text-xl font-semibold text-center">
          {message}
        </p>
      )}
    </div>
  );
};

export default EightQueensPuzzle;
