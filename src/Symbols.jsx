import React, { useState } from "react";
import { Circle, Umbrella, Star, Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import your puzzle components if needed
import Sudoku from "./Sudoku.jsx";
import EightQueens from "./EightQueensPuzzle.jsx";
import Game2048 from "./Game2048.jsx";
import TowerOfHanoiPuzzle from "./TowerOfHanoiPuzzle.jsx";

const Symbols = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleSymbol = (symbol) => {
    if (selectedSymbol === symbol) {
      setSelectedSymbol("");
    } else {
      setSelectedSymbol(symbol);
    }
    setError("");
  };

  const handleNext = () => {
    if (!selectedSymbol) {
      setError("Please select a symbol before proceeding.");
      return;
    }
    switch (selectedSymbol) {
      case "umbrella":
        navigate("/Game2048");
        break;
      case "circle":
        navigate("/EightQueensPuzzle");
        break;
      case "triangle":
        navigate("/TowerOfHanoiPuzzle");
        break;
      case "star":
        navigate("/Sudoku");
        break;
      default:
        break;
    }
  };

  const renderSymbol = (symbol) => {
    switch (symbol) {
      case "circle":
        return <Circle size={100} className="text-green-900" />;
      case "umbrella":
        return <Umbrella size={100} className="text-blue-900" />;
      case "star":
        return <Star size={100} className="text-yellow-500" />;
      case "triangle":
        return <Triangle size={100} className="text-red-500" />;
      default:
        return <p className="text-gray-900 text-center">Select a symbol</p>;
    }
  };

  return (
    <div
      className="min-h-screen p-6 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/SquidSymbol.jpg')" }}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
        Choose a Symbol
      </h1>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {[
          { name: "circle", color: "bg-green-800 hover:bg-green-900" },
          { name: "triangle", color: "bg-red-600 hover:bg-red-700" },
          { name: "star", color: "bg-yellow-500 hover:bg-yellow-600" },
          { name: "umbrella", color: "bg-blue-600 hover:bg-blue-700" },
        ].map(({ name, color }) => (
          <button
            key={name}
            onClick={() => toggleSymbol(name)}
            className={`${color} px-4 py-2 rounded w-20 h-20 md:w-28 md:h-28 flex items-center justify-center ${
              selectedSymbol === name ? "border-2 border-white" : ""
            }`}
          >
            <b>
              <p className="text-sm md:text-lg">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </p>
            </b>
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center justify-center border border-gray-500 p-4 rounded-lg w-32 h-32 md:w-40 md:h-40 bg-black/31">
          {renderSymbol(selectedSymbol)}
        </div>
      </div>
      {error && (
        <b>
          <p className="text-red-600 mt-4 text-center">{error}</p>
        </b>
      )}
      <button
        onClick={handleNext}
        className="mt-6 px-6 py-3 text-base md:text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
      >
        Next Level
      </button>
    </div>
  );
};

export default Symbols;
