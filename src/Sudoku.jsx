import React, { useState } from "react";

const initialPuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const solution = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

const Sudoku = () => {
  const [board, setBoard] = useState(initialPuzzle);
  const [message, setMessage] = useState("");

  const handleChange = (row, col, value) => {
    if (/^[1-9]?$/.test(value)) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = value === "" ? 0 : parseInt(value, 10);
      setBoard(newBoard);
      setMessage("");
    }
  };

  const checkSolution = () => {
    let correct = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== solution[i][j]) {
          correct = false;
          break;
        }
      }
    }
    setMessage(correct ? "Sudoku Solved!" : "Solution is incorrect. Try again!");
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Sudoku Puzzle</h1>
      <div className="grid grid-cols-9 gap-0.5 bg-black p-1">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              value={cell === 0 ? "" : cell}
              onChange={(e) => handleChange(i, j, e.target.value)}
              disabled={initialPuzzle[i][j] !== 0}
              className={`w-8 h-8 sm:w-10 sm:h-10 text-center text-xl 
                ${initialPuzzle[i][j] !== 0 ? "bg-gray-600" : "bg-white text-black"} 
                border border-gray-500`}
            />
          ))
        )}
      </div>
      <button onClick={checkSolution} className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded">
        Check Solution
      </button>
      {message && <p className="mt-4 text-xl">{message}</p>}
    </div>
  );
};

export default Sudoku;
