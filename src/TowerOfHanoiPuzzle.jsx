import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const initialDisks = 4;
const getInitialTowers = (n) => [
  Array.from({ length: n }, (_, i) => n - i),
  [],
  [],
];

const TowerOfHanoiPuzzle = () => {
  const navigate = useNavigate();
  const [numDisks] = useState(initialDisks);
  const [towers, setTowers] = useState(getInitialTowers(initialDisks));
  const [selectedTower, setSelectedTower] = useState(null);
  const [message, setMessage] = useState("");
  const [isSolving, setIsSolving] = useState(false);
  const [solutionMoves, setSolutionMoves] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const resetPuzzle = () => {
    setTowers(getInitialTowers(numDisks));
    setSelectedTower(null);
    setMessage("");
    setIsSolving(false);
    setSolutionMoves([]);
    setCurrentMoveIndex(0);
  };

  const handleTowerClick = (towerIndex) => {
    if (isSolving) return;

    if (selectedTower === null) {
      if (towers[towerIndex].length === 0) {
        setMessage("No disk to move from this tower.");
        return;
      }
      setSelectedTower(towerIndex);
      setMessage("");
    } else {
      if (selectedTower === towerIndex) {
        setSelectedTower(null);
        setMessage("Move cancelled.");
        return;
      }

      const sourceTower = towers[selectedTower];
      const destinationTower = towers[towerIndex];
      const diskToMove = sourceTower[sourceTower.length - 1];

      if (
        destinationTower.length === 0 ||
        destinationTower[destinationTower.length - 1] > diskToMove
      ) {
        const newTowers = towers.map((tower, index) => {
          if (index === selectedTower) {
            return tower.slice(0, tower.length - 1);
          } else if (index === towerIndex) {
            return [...tower, diskToMove];
          }
          return tower;
        });
        setTowers(newTowers);
        setSelectedTower(null);
        setMessage("");

        if (newTowers[2].length === numDisks) {
          setMessage("Congratulations! Puzzle solved.");
          window.open(
        "https://squidgame2025.vercel.app/Congratulations",
        "_self"
      );
          // navigate("/Congratulations");
        }
      } else {
        setMessage("Invalid move: you cannot place a larger disk on a smaller one.");
        setSelectedTower(null);
      }
    }
  };

  const computeSolutionMoves = (n, from, to, aux) => {
    if (n === 0) return [];
    return [
      ...computeSolutionMoves(n - 1, from, aux, to),
      [from, to],
      ...computeSolutionMoves(n - 1, aux, to, from),
    ];
  };

  const startAutoSolve = () => {
    if (isSolving) return;
    if (towers[2].length === numDisks) {
      setMessage("Puzzle already solved!");
      return;
    }
    const moves = computeSolutionMoves(numDisks, 0, 2, 1);
    setSolutionMoves(moves);
    setIsSolving(true);
    setCurrentMoveIndex(0);
    setMessage("Auto-solving...");
  };

  useEffect(() => {
    if (isSolving && solutionMoves.length > 0 && currentMoveIndex < solutionMoves.length) {
      const timer = setTimeout(() => {
        const [from, to] = solutionMoves[currentMoveIndex];
        const sourceTower = towers[from];
        if (sourceTower.length === 0) {
          setMessage("Error: no disk to move.");
          setIsSolving(false);
          return;
        }
        const diskToMove = sourceTower[sourceTower.length - 1];
        const destinationTower = towers[to];
        if (
          destinationTower.length === 0 ||
          destinationTower[destinationTower.length - 1] > diskToMove
        ) {
          const newTowers = towers.map((tower, index) => {
            if (index === from) {
              return tower.slice(0, tower.length - 1);
            } else if (index === to) {
              return [...tower, diskToMove];
            }
            return tower;
          });
          setTowers(newTowers);
          setCurrentMoveIndex(currentMoveIndex + 1);
        } else {
          setMessage("Auto-solver encountered an error.");
          setIsSolving(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else if (isSolving && currentMoveIndex >= solutionMoves.length) {
      setIsSolving(false);
      setMessage("Auto-solve complete! Puzzle solved.");
    }
  }, [isSolving, solutionMoves, currentMoveIndex, towers, numDisks]);

  const renderDisk = (disk) => {
    const width = disk * 40;
    const gradient =
      disk === numDisks
        ? "bg-gradient-to-r from-purple-600 to-blue-600"
        : disk === numDisks - 1
        ? "bg-gradient-to-r from-green-500 to-teal-500"
        : disk === numDisks - 2
        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
        : "bg-gradient-to-r from-pink-500 to-red-500";

    return (
      <div
        key={disk}
        className={`${gradient} text-white text-center rounded shadow-lg transition-all duration-300 mb-1`}
        style={{ width: `${width}px`, height: "30px", lineHeight: "30px" }}
      >
        {disk}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="text-4xl font-bold mb-4 text-center text-amber-50">
        Tower of Hanoi Puzzle
      </h1>

      <div className="bg-black/50 p-4 rounded-md text-white text-center max-w-xl mb-6">
        <p>
          Move all the disks from the first tower to the third tower.
          <br />
          <span className="text-sm font-extrabold">
            Click on a tower to select its top disk, then click another tower to move it.
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <button
          onClick={resetPuzzle}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
        >
          Reset Puzzle
        </button>
        {/* Uncomment below button to allow auto-solving */}
        {/* <button
          onClick={startAutoSolve}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
        >
          Auto Solve
        </button> */}
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-end justify-center gap-4 w-full max-w-3xl">
        {towers.map((tower, towerIndex) => (
          <div
            key={towerIndex}
            onClick={() => handleTowerClick(towerIndex)}
            className={`flex flex-col-reverse items-center justify-end p-2 rounded-md cursor-pointer transition-transform duration-200 
              ${selectedTower === towerIndex ? "border-4 border-green-600 scale-105" : "border border-gray-400"} 
              ${towerIndex === 2 ? "bg-green-400" : "bg-gray-800"} w-full sm:w-1/3`}
            style={{ minHeight: "200px" }}
          >
            {tower.map((disk, index) => (
              <React.Fragment key={index}>{renderDisk(disk)}</React.Fragment>
            ))}
          </div>
        ))}
      </div>

      {message && (
        <div className="mt-4 text-xl text-red-600 text-center">
          {message}
        </div>
      )}
    </div>
  );

};

export default TowerOfHanoiPuzzle;
