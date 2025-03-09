import React, { useState, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useNavigate } from "react-router-dom";
import { EditorView } from "@codemirror/view";
import { motion, useAnimation } from "framer-motion";

const disableCopyPaste = EditorView.domEventHandlers({
  copy: (event, view) => {
    event.preventDefault();
    return true;
  },
  cut: (event, view) => {
    event.preventDefault();
    return true;
  },
  paste: (event, view) => {
    event.preventDefault();
    return true;
  },
});

const squidGameMusic = "/public/images/squid game music.mpeg";

// Admin-provided start time and game duration (in seconds)
const adminStartTime = new Date("2025-03-09T19:16:00"); // Replace with admin-provided timestamp
const gameDuration = 600; // Game duration in seconds
const targetTime = new Date(adminStartTime.getTime() + gameDuration * 1000);

const RedLightGreenLight = () => {
  const navigate = useNavigate();
  const tugWarControls = useAnimation();

  // Custom blood alert state
  const [bloodAlert, setBloodAlert] = useState(null);

  // Helper to show our custom alert
  const showBloodAlert = (
    message,
    onClose,
    buttonText = "OK",
    title = "Blood Bath Alert!"
  ) => {
    setBloodAlert({ message, onClose, buttonText, title });
  };

  // Reset state on new login
  useEffect(() => {
    if (localStorage.getItem("newLogin") === "true") {
      localStorage.removeItem("newLogin");
    }
  }, []);

  // Initialize won from localStorage or default to 100
  const [won, setWon] = useState(() => {
    const stored = localStorage.getItem("won");
    return stored ? parseInt(stored, 10) : 100;
  });

  // Update localStorage when won changes
  const updateWonLocal = (newWon) => {
    localStorage.setItem("won", newWon);
    console.log("Won updated in localStorage:", newWon);
  };

  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(Math.floor((targetTime - Date.now()) / 1000), 0)
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [isGreenLight, setIsGreenLight] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [output, setOutput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [audio] = useState(() => new Audio(squidGameMusic));
  const username = localStorage.getItem("username");
  const [userCode, setUserCode] = useState({});

  const questions = [
    {
      prompt:
        "// Fix the bug in this function\n#include <stdio.h>\nint main() {\n  for(i=0;i<10;i+)\n{\nprint('Hello')}\n  return 0;\n}",
      expected: "HelloHelloHelloHelloHelloHelloHelloHelloHelloHello",
    },
    {
      prompt:
        "// Fix the bug in this code\ninclude <stduio.h>\nint isPrime(it num) {\nif (num < 2) return 0, \nfor ( i = 2, i * i <= num; i+) {\nif (num % i == 0) return 0,\n}\n return 1;\n}\nint main() {\nint number=31847726;\nif (isPrime(num)){\nprinf('%d is a prime number.', number);\nelse{\nprntf('%d is not a prime number.', num);\n return 0;\n}",
      expected: "31847726 is not a prime number.",
    },
    {
      prompt:
        "// Fix the bug in this code\n#incude <stdoi.h>\nint sumOfDigits(int n) {\nint sum = 0;\nwhle (n > 0)\n{\nsum += n % (100/10); \nn = n/10; \n}\nreturn s;\nint man() {\nint num = 30213468; \n print('Sum of digits of %D is %D', num, sumOfDigits(num));\n return 0,\n}",
      expected: "Sum of digits of 30213468 is 27",
    },
  ];

  // Update expected output when current question changes
  useEffect(() => {
    setExpectedOutput(questions[currentQuestion].expected);
  }, [currentQuestion]);

  // Retrieve saved code from localStorage on mount
  useEffect(() => {
    const savedCode = {};
    const level1Q1 = localStorage.getItem("level1Q1");
    const level1Q2 = localStorage.getItem("level1Q2");
    const level1Q3 = localStorage.getItem("level1Q3");
    if (level1Q1) savedCode[0] = level1Q1;
    if (level1Q2) savedCode[1] = level1Q2;
    if (level1Q3) savedCode[2] = level1Q3;
    setUserCode(savedCode);
  }, []);

  // Real-time timer sync using admin-provided targetTime.
  const handleGameOver = useCallback(() => {
    // Mark user as eliminated in localStorage and navigate
    localStorage.setItem("eliminated", "true");
    navigate("/Thankyou");
  }, [navigate]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newTimeLeft = Math.max(
        Math.floor((targetTime - Date.now()) / 1000),
        0
      );
      setTimeLeft(newTimeLeft);
      if (newTimeLeft === 0) {
        clearInterval(timerInterval);
        if (completedQuestions.length === questions.length && won >= 70) {
          navigate("/Level2instructions");
        } else {
          setGameOver(true);
          // When alert is acknowledged, handleGameOver is called
          showBloodAlert(
            "Game over!!!",
            handleGameOver,
            "Farewell",
            "Blood Bath Finale"
          );
        }
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [completedQuestions, questions.length, won, navigate, handleGameOver]);

  // Manage red/green light transitions and audio playback.
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGreenLight(false);
      audio.play().catch((error) => console.log("Audio play blocked:", error));
      const redLightDuration = 31; // exactly 31 seconds
      setTimeout(() => {
        setIsGreenLight(true);
        audio.pause();
        audio.currentTime = 0;
      }, redLightDuration * 1000);
    }, 30000);
    return () => {
      clearInterval(interval);
      audio.pause();
    };
  }, [audio]);

  // Simulate code compilation instead of calling a backend compiler.
  const handleCompileRun = async () => {
    setCompiling(true);
    // Simulate a delay and check if the code includes the word "fix" to decide output.
    setTimeout(() => {
      const codeToCheck = userCode[currentQuestion] || "";
      if (codeToCheck.includes("fix")) {
        setOutput(expectedOutput);
      } else {
        setOutput("Error in execution");
      }
      setCompiling(false);
    }, 1000);
  };

  // On submission, update won in localStorage, mark the question as completed,
  // and automatically progress to the next question if available.
  const handleSubmit = async () => {
    if (output.trim() === expectedOutput.trim()) {
      if (!completedQuestions.includes(currentQuestion)) {
        const newWon = won + 10;
        setWon(newWon);
        updateWonLocal(newWon);
        setCompletedQuestions((prev) => [...prev, currentQuestion]);
        showBloodAlert(
          `Correct! You earned 10 Won! Completed Questions: ${
            completedQuestions.length + 1
          }`,
          () => {},
          "Continue",
          "Slaughter of Success!"
        );
        // Automatically go to the next question if available.
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
        }
        // Save code to localStorage instead of backend.
        let questionField = "";
        if (currentQuestion === 0) {
          questionField = "level1Q1";
        } else if (currentQuestion === 1) {
          questionField = "level1Q2";
        } else if (currentQuestion === 2) {
          questionField = "level1Q3";
        }
        if (questionField) {
          localStorage.setItem(questionField, userCode[currentQuestion] || "");
          console.log(`Saved code for ${questionField}`);
        }
      } else {
        showBloodAlert(
          "You've already completed this question. Move to the next one!",
          () => {}
        );
      }
    } else {
      const newWon = Math.max(won - 10, 0);
      setWon(newWon);
      updateWonLocal(newWon);
      showBloodAlert("Incorrect output. You lost 10 Won!", () => {});
    }
  };

  const markLevel1Complete = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      console.error("No username found in localStorage");
      return;
    }
    // Mark level1 as complete in localStorage and navigate.
    localStorage.setItem("level1", "true");
    navigate("/Level2instructions");
  };

  // Additional helper functions for navigation and code change handling:
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleCodeChange = (value) => {
    setUserCode((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Game Over</h1>
        <button
          onClick={() => navigate("/Thankyou")}
          className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 text-white"
        >
          Thank You!!!
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center p-6 min-h-screen bg-black text-white w-full relative ${
        !isGreenLight
          ? "border-8 border-red-500 animate-pulse shadow-[0px_0px_50px_rgba(255,0,0,0.8)] before:content-[''] before:absolute before:inset-0 before:bg-red-600 before:blur-[80px] before:opacity-50"
          : ""
      }`}
    >
      {/* Player ID at the top left corner */}
      <div className="absolute top-4 left-4 px-8 py-4 rounded-md text-yellow-400 font-bold text-xl">
        Player ID: {localStorage.getItem("playerid") || "Guest"}
      </div>
      {/* Timer positioned at the top right corner */}
      <div className="absolute top-4 right-4 px-8 py-4 rounded-md text-red-400 font-bold text-xl">
        ⏳ Time Left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </div>
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
        Level 1: Red Light, Green Light
      </h1>
      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-4 lg:space-y-0 lg:space-x-4 relative">
        <div className="w-full lg:w-1/2 relative">
          <p className="text-lg font-bold">Question:</p>
          {!isGreenLight && (
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
              <img
                src="/images/dollred.jpg"
                alt="Squid Game Doll"
                className="w-96 md:w-96 h-48 md:h-96 animate-pulse"
              />
            </div>
          )}
          <pre
            className="bg-gray-800 p-4 rounded-md w-full overflow-auto mb-4 text-sm md:text-base select-none"
            onContextMenu={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            style={{ userSelect: "none", cursor: "default" }}
          >
            {questions[currentQuestion].prompt}
          </pre>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handlePreviousQuestion}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-900 text-white rounded"
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-green-500 hover:bg-emerald-700 text-white rounded"
              disabled={currentQuestion === questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <CodeMirror
            value={userCode[currentQuestion] || ""}
            height="400px"
            width="100%"
            extensions={[cpp(), disableCopyPaste]}
            theme={dracula}
            onChange={handleCodeChange}
          />
          <div className="flex mt-2 space-x-2">
            <button
              onClick={handleCompileRun}
              className="px-4 py-2 bg-green-500 hover:bg-green-800 text-white rounded"
            >
              Run
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-yellow-500 hover:bg-amber-600 text-white rounded"
            >
              Submit
            </button>
          </div>
          <pre className="bg-gray-800 p-4 rounded-md w-full overflow-auto mt-4 text-sm md:text-base">
            Output: {compiling ? "Compiling..." : output}
          </pre>
        </div>
      </div>
      <p className="text-lg">
        Current Won:{" "}
        <span className="font-bold text-yellow-400">{won} Won</span>
      </p>
      <button
        onClick={markLevel1Complete}
        className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
      >
        Next Level
      </button>

      {/* Custom Blood Alert Modal */}
      {bloodAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-red-800 border-4 border-red-500 p-8 rounded-lg shadow-xl text-center animate-pulse">
            <h2 className="text-3xl font-bold text-white mb-4">
              {bloodAlert.title}
            </h2>
            <p className="text-xl text-white">{bloodAlert.message}</p>
            <button
              className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded"
              onClick={() => {
                setBloodAlert(null);
                bloodAlert.onClose && bloodAlert.onClose();
              }}
            >
              {bloodAlert.buttonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedLightGreenLight;
