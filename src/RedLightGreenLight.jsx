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

const squidGameMusic = "/public/images/squidgamemusic.mp3";

const RedLightGreenLight = () => {
  const navigate = useNavigate();
  const tugWarControls = useAnimation();

  // Custom blood alert state and helper function
  const [bloodAlert, setBloodAlert] = useState(null);
  const showBloodAlert = (message, onClose, buttonText = "OK", title = "Blood Bath Alert!") => {
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
  const updateWonLocal = (newWon) => {
    localStorage.setItem("won", newWon);
    console.log("Won updated in localStorage:", newWon);
  };

  // ------------------------------
  // Question & Code States
  // ------------------------------
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [userCode, setUserCode] = useState({});
  const questions = [
    // {
    //   prompt:
    //     "// Fix the bug in this function\n#include <stdio.h>\nint main() {\n  for(inti=;i<10;i+)\n{\nprint('Hello')}\n  return 0;\n}",
    //   expected: '#include<stdio.h>intmain(){for(inti=0;i<10;i++){printf("hello");}return0;}',
    //   // #inlcude<stdio.h>intmain(){for(inti=0;i<10;i++){printf("hello");}return0;}
    // },
    {
      prompt:
        "// Fix the bug in this code\n#incude <stdoi.h>\nint sumOfDigits(int n) {\nint sum = 0;\nwhle (n > 0)\n{\nsum += n % 10; \nn = n/10; \n}\nreturn sum\n}\nint man() {\nint num = 30213468; \n print('Sum of digits of %D is %D', num, sumOfDigits(num));\n return 0,\n}",
      expected: '#include<stdio.h>intsumOfDigits(int n){intsum=0;while(n>0){sum+=n%10;n=n/10;}returnsum;}intmain(){intnum=30213468;printf("Sumofdigitsof%dis%d",num,sumOfDigits(num));return0;}',
    },
  ];
  const [expectedOutput, setExpectedOutput] = useState("");
  useEffect(() => {
    // Normalize the expected output to lowercase with no spaces for checking
    setExpectedOutput(questions[currentQuestion].expected.toLowerCase().replace(/\s/g, ""));
  }, [currentQuestion, questions]);

  // Retrieve saved code from localStorage on mount
  useEffect(() => {
    const savedCode = {};
    const code1 = localStorage.getItem("level1q1");
    const code2 = localStorage.getItem("level1q2");
    const code3 = localStorage.getItem("level1q3");
    if (code1) savedCode[0] = code1;
    if (code2) savedCode[1] = code2;
    if (code3) savedCode[2] = code3;
    setUserCode(savedCode);
  }, []);

  // Define handleGameOver before timer effect so it can be used safely.
  const handleGameOver = useCallback(() => {
    localStorage.setItem("eliminated", "true");
    navigate("/Thankyou");
  }, [navigate]);

  // ------------------------------
  // New 10-Minute Timer using localStorage ("l1timer")
  // ------------------------------
  const [l1timeLeft, setL1TimeLeft] = useState(() => {
    const storedTimer = localStorage.getItem("l1timer");
    if (storedTimer) {
      return Math.max(parseInt(storedTimer, 10) - Date.now(), 0);
    } else {
      const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes in ms
      localStorage.setItem("l1timer", expirationTime);
      return expirationTime - Date.now();
    }
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedTimer = localStorage.getItem("l1timer");
      if (storedTimer) {
        const newTimeLeft = Math.max(parseInt(storedTimer, 10) - Date.now(), 0);
        // Update the timer every second using the correct setter name
        setL1TimeLeft(newTimeLeft);
        if (newTimeLeft <= 0) {
          clearInterval(intervalId);
          if (completedQuestions.length === questions.length && won > 60) {
            navigate("/Level2instructions");
          } else {
            setGameOver(true);
            showBloodAlert("Game over!!!", handleGameOver, "Farewell", "Blood Bath Finale");
          }
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [completedQuestions, questions.length, won, navigate, handleGameOver]);

  // Additional effect: if the player completes all questions before time runs out, navigate automatically.
  useEffect(() => {
    if (completedQuestions.length === questions.length && won > 60) {
      navigate("/Level2instructions");
    }
  }, [completedQuestions, questions.length, won, navigate]);

  // ------------------------------
  // Other States
  // ------------------------------
  const [isGreenLight, setIsGreenLight] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [output, setOutput] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [audio] = useState(() => new Audio(squidGameMusic));
  const username = localStorage.getItem("username");

  // ------------------------------
  // Red/Green Light Management & Audio Playback
  // ------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGreenLight(false);
      audio.play().catch((error) => console.log("Audio play blocked:", error));
      const redLightDuration = 5.31; // duration in seconds
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

  // ------------------------------
  // Code Change Handler with Red Light Penalty
  // ------------------------------
  const handleCodeChange = (newValue) => {
    const prevValue = userCode[currentQuestion] || "";
    const diff = newValue.length - prevValue.length;
    if (!isGreenLight && diff > 0) {
      const updatedWon = Math.max(won - diff, 0);
      setWon(updatedWon);
      localStorage.setItem("won", updatedWon);
    }
    setUserCode((prev) => ({ ...prev, [currentQuestion]: newValue }));
  };

  // ------------------------------
  // Code Compilation Simulation (optional)
  // ------------------------------
  const handleCompileRun = async () => {
    setCompiling(true);
    setTimeout(() => {
      const codeToCheck = userCode[currentQuestion] || "";
      if (codeToCheck.toLowerCase().includes("fix")) {
        setOutput(expectedOutput);
      } else {
        setOutput("errorinexecution");
      }
      setCompiling(false);
    }, 1000);
  };

  // ------------------------------
  // Submission Handler: Compare editor text with expected output
  // ------------------------------
  const handleSubmit = async () => {
    const codeEntered = (userCode[currentQuestion] || "").toLowerCase().replace(/\s/g, "");
    const expected = expectedOutput.toLowerCase().replace(/\s/g, "");
    console.log(codeEntered);
    if (codeEntered === expected) {
      if (!completedQuestions.includes(currentQuestion)) {
        const newWon = won + 10;
        setWon(newWon);
        updateWonLocal(newWon);
        setCompletedQuestions((prev) => [...prev, currentQuestion]);
        showBloodAlert(
          `correct!you earned 10 won!completedquestions:${completedQuestions.length + 1}`,
          () => {},
          "continue",
          "slaughterofsuccess!"
        );
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
        }
        let questionField = "";
        if (currentQuestion === 0) questionField = "level1q1";
        else if (currentQuestion === 1) questionField = "level1q2";
        else if (currentQuestion === 2) questionField = "level1q3";
        if (questionField) {
          localStorage.setItem(questionField, userCode[currentQuestion] || "");
          console.log(`saved code for ${questionField}`);
        }
      } else {
        showBloodAlert("you've already completed this question.movetonext!", () => {});
      }
    } else {
      const newWon = Math.max(won - 10, 0);
      setWon(newWon);
      updateWonLocal(newWon);
      showBloodAlert("incorrectoutput.youlost10won!", () => {});
    }
  };

  // ------------------------------
  // Navigation & Code Change Helpers
  // ------------------------------
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const markLevel1Complete = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      console.error("no username found in localStorage");
      return;
    }
    localStorage.setItem("level1", "true");
    navigate("/Level2instructions");
  };

  // ------------------------------
  // Rendering (with header container to prevent overlap)
  // ------------------------------
  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">game over</h1>
        <button onClick={() => navigate("/Thankyou")} className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 text-white">
          thank you!!!
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center p-6 min-h-screen bg-black text-white w-full relative ${!isGreenLight ? "border-8 border-red-500 animate-pulse shadow-[0px_0px_50px_rgba(255,0,0,0.8)] before:content-[''] before:absolute before:inset-0 before:bg-red-600 before:blur-[80px] before:opacity-50" : ""}`}>
      {/* Header Container: Player ID & Timer */}
      <header className="w-full flex flex-col sm:flex-row justify-between items-center px-4 py-4">
        <div className="bg-gradient-to-r from-blue-500 via-red-500 to-green-500 bg-clip-text text-transparent mb-4 font-bold text-xl md:text-3xl">
          player id: {localStorage.getItem("playerId") || "guest"}
        </div>
        <div className="text-red-400 font-bold text-xl sm:text-2xl md:text-3xl">
          ⏳ time left: {Math.floor(l1timeLeft / 1000 / 60)}:
          {(Math.floor(l1timeLeft / 1000) % 60).toString().padStart(2, "0")}
        </div>
      </header>

      {/* Main Heading */}
      <h1 className="mt-4 text-3xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent md:text-4xl font-bold mb-6 text-center">
        Red light, Green light
      </h1>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-4 lg:space-y-0 lg:space-x-4 relative">
        <div className="w-full lg:w-1/2 relative">
          <p className="text-lg font-bold">question:</p>
          {!isGreenLight && (
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
              <img src="/images/dollred.jpg" alt="squid game doll" className="w-96 md:w-96 h-48 md:h-96 animate-pulse" />
            </div>
          )}
          <pre className="bg-gray-800 p-4 rounded-md w-full overflow-auto mb-4 text-sm md:text-base select-none" onContextMenu={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()} style={{ userSelect: "none", cursor: "default" }}>
            {questions[currentQuestion].prompt}
          </pre>
          {/* <div className="flex space-x-4 mt-4">
            <button onClick={handlePreviousQuestion} className="px-4 py-2 bg-blue-700 hover:bg-blue-900 text-white rounded" disabled={currentQuestion === 0}>
              previous
            </button>
            <button onClick={handleNextQuestion} className="px-4 py-2 bg-green-500 hover:bg-emerald-700 text-white rounded" disabled={currentQuestion === questions.length - 1}>
              next
            </button>
          </div> */}
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
            <button onClick={handleSubmit} className="px-4 py-2 bg-yellow-500 hover:bg-amber-600 text-white rounded">
              submit
            </button>
          </div>
        </div>
      </div>
      <p className="text-lg">
        current won: <span className="font-bold text-yellow-400">{won} won</span>
      </p>
      {/* Custom Blood Alert Modal */}
      {bloodAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-red-800 border-4 border-red-500 p-8 rounded-lg shadow-xl text-center animate-pulse">
            <h2 className="text-3xl font-bold text-white mb-4">{bloodAlert.title}</h2>
            <p className="text-xl text-white">{bloodAlert.message}</p>
            <button className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded" onClick={() => { setBloodAlert(null); bloodAlert.onClose && bloodAlert.onClose(); }}>
              {bloodAlert.buttonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedLightGreenLight;
