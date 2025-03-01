import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Level3Instructions = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10); // 2 minutes in seconds
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setButtonEnabled(true); // Enable button when timer reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4"
      style={{
        backgroundImage: "url('/images/Level3insbg.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="border-gray-900 bg-black/50 p-6 rounded-lg shadow-lg text-center max-w-2xl">
        {/* Countdown Timer */}
        <div className="text-2xl font-bold text-red-500">
          Time Left: {formatTime(timeLeft)}
        </div>

        <h1 className="text-3xl font-bold text-white mt-4">
          Level 3: Single and Mingle (Algorithmic Showdown)
        </h1>
        <p className="mt-4 text-lg">
          Welcome to the final level! Follow the instructions carefully:
        </p>
        <ul className="mt-4 text-left space-y-2">
          <li>🔹 Each pair will receive an algorithm and pseudo code.</li>
          <li>
            🔹 The team should predict the suitable data structure to solve it.
          </li>
          <li>🔹 The team must analyze and complete the given pseudo code.</li>
          <li>
            🔹 The teams that correctly implement them will be declared the
            winners.
          </li>
        </ul>

        <button
          onClick={() => navigate("/Symbols")}
          className={`mt-6 px-6 py-3 rounded-lg text-lg transition-all duration-300 ${
            buttonEnabled
              ? "bg-blue-600 hover:bg-blue-800 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!buttonEnabled}
        >
          Start Level 3
        </button>
      </div>
    </div>
  );
};

export default Level3Instructions;
