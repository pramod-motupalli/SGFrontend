import React, { useState } from "react";

const gridSize = 5;

const LightsOutPuzzle = () => {
  // Create a 5x5 board with random on/off state (true = light on)
  const initialBoard = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => Math.random() < 0.5)
  );
  const [board, setBoard] = useState(initialBoard);
  const [message, setMessage] = useState("");

  const toggleCell = (r, c, boardCopy) => {
    if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
      boardCopy[r][c] = !boardCopy[r][c];
    }
  };

  const handleCellClick = (row, col) => {
    const newBoard = board.map((r) => [...r]);
    // Toggle clicked cell and its neighbors
    toggleCell(row, col, newBoard);
    toggleCell(row - 1, col, newBoard);
    toggleCell(row + 1, col, newBoard);
    toggleCell(row, col - 1, newBoard);
    toggleCell(row, col + 1, newBoard);
    setBoard(newBoard);
    setMessage("");
    // Check win condition: all false
    if (newBoard.flat().every((cell) => !cell)) {
      setMessage("Congratulations! You turned off all the lights.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Lights Out Puzzle</h1>
      <div className="grid grid-cols-5 gap-1">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={`w-12 h-12 sm:w-16 sm:h-16 border border-gray-600 
                transition-colors duration-300 ${
                  cell ? "bg-yellow-400" : "bg-gray-800"
                }`}
            />
          ))
        )}
      </div>
      {message && <p className="mt-4 text-xl font-semibold">{message}</p>}
    </div>
  );
};

export default LightsOutPuzzle;
