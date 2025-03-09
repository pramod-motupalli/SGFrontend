import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Level2Instructions = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3); // Timer in seconds

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Check Level 1 completion status in localStorage
  const checkLevel1Status = () => {
    const level1Completed = localStorage.getItem("level1Completed");
    if (level1Completed === "true") {
      navigate("/TugOfWar"); // Navigate to Level 2 page
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          checkLevel1Status(); // Use localStorage check when timer ends
          navigate("/TugOfWar"); // Ensure navigation on 00
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4"
      style={{
        backgroundImage: "url('public/images/Tugofwarbg.jpg')",
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
          Level 2: Tug of War (Aptitude & Logic Face-off)
        </h1>
        <p className="mt-4 text-lg">
          Welcome to the Second level of the competition! Follow the instructions carefully:
        </p>
        <ul className="mt-4 text-left space-y-2">
          <li>
            🔹 Both teams receive the same set of aptitude and logical reasoning questions.
          </li>
          <li>
            🔹 Correct answers move the virtual rope toward their team’s side.
          </li>
          <li>
            🔹 The team that pulls the rope completely to their side wins the round.
          </li>
          <li>
            🔹 The winning team will be qualified to the next level of the game.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Level2Instructions;
