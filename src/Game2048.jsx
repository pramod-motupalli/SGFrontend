import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

const GRID_SIZE = 4;

const initializeGrid = () => {
  const emptyGrid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0)
  );
  return addRandomTile(addRandomTile(emptyGrid));
};

const addRandomTile = (grid) => {
  let emptyCells = [];
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push([i, j]);
    });
  });
  if (emptyCells.length === 0) return grid;
  const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[x][y] = Math.random() < 0.9 ? 2 : 4;
  return grid;
};

const moveTiles = (grid, direction) => {
  let newGrid = grid.map((row) => [...row]);

  // Function to rotate grid 90 degrees clockwise
  const rotateGrid = (grid) =>
    grid[0]
      .map((_, colIndex) => grid.map((row) => row[colIndex]))
      .reverse();

  // Slide non-zero numbers to the left
  const slide = (row) => {
    let filteredRow = row.filter((num) => num !== 0);
    while (filteredRow.length < GRID_SIZE) filteredRow.push(0);
    return filteredRow;
  };

  // Combine adjacent numbers if they are the same
  const combine = (row) => {
    for (let i = 0; i < GRID_SIZE - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
      }
    }
    return row;
  };

  // Define number of 90-degree clockwise rotations based on direction.
  // "Right": 0 rotations, "Down": 1, "Left": 2, "Up": 3.
  const rotations = { Right: 0, Down: 1, Left: 2, Up: 3 };

  // Rotate grid to "normalize" movement as left shift.
  for (let i = 0; i < rotations[direction]; i++) {
    newGrid = rotateGrid(newGrid);
  }

  // Process each row: slide, combine, then slide again.
  newGrid = newGrid.map((row) => slide(combine(slide(row))));

  // Rotate grid back to original orientation.
  for (let i = 0; i < 4 - rotations[direction]; i++) {
    newGrid = rotateGrid(newGrid);
  }

  return addRandomTile(newGrid);
};

const Game2048 = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState(initializeGrid);

  const handleMove = (direction) => {
    setGrid((prevGrid) => moveTiles(prevGrid, direction));
  };

  // Swipe handlers: on swiping in any direction, call handleMove with the corresponding direction.
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => handleMove("Left"),
    onSwipedLeft: () => handleMove("Right"),
    onSwipedDown: () => handleMove("Up"),
    onSwipedUp: () => handleMove("Down"),
    trackMouse: true, // allows testing with mouse events
  });

  // Arrow key event handler for desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        const direction = e.key.replace("Arrow", "");
        if (direction === "Left") {
          handleMove("Right");
        }
        if (direction === "Right") {
          handleMove("Left");
        }
        if (direction === "Up") {
          handleMove("Down");
        }
        if (direction === "Down") {
          handleMove("Up");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Navigate to ThankYou page if 2048 is reached.
  useEffect(() => {
    if (grid.flat().some((cell) => cell === 2048)) {
      navigate("/Thankyou");
    }
  }, [grid, navigate]);

  // Helper to check if the grid is full and no merge is possible.
  const checkGameOver = (grid) => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return false;
      }
    }
    // Check horizontally for possible merges
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE - 1; j++) {
        if (grid[i][j] === grid[i][j + 1]) return false;
      }
    }
    // Check vertically for possible merges
    for (let i = 0; i < GRID_SIZE - 1; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === grid[i + 1][j]) return false;
      }
    }
    return true;
  };

  // Check game over condition and navigate if no moves are possible.
  useEffect(() => {
    if (checkGameOver(grid)) {
      navigate("/tugofwardisqualified");
    }
  }, [grid, navigate]);

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
    >
      <h1 className="text-3xl font-bold mb-4">2048 Game</h1>
      <div className="grid grid-cols-4 gap-2 bg-gray-800 p-4 rounded-lg">
        {grid.flat().map((value, index) => (
          <div
            key={index}
            className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded shadow-lg ${
              value ? "bg-yellow-400 text-gray-900" : "bg-gray-700"
            }`}
          >
            {value !== 0 && value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game2048;
