import React, { useState, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TugOfWar = () => {
  const navigate = useNavigate();
  const tugWarControls = useAnimation();
  const totalQuestions = 10;
  const challengeDuration = 900; // 15 minutes in seconds

  // ------------------------------
  // Timer: Store expiration in localStorage ("tugOfWarTimer")
  // ------------------------------
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTimer = localStorage.getItem("tugOfWarTimer");
    if (storedTimer) {
      return Math.max(parseInt(storedTimer, 10) - Date.now(), 0);
    } else {
      const expirationTime = Date.now() + challengeDuration * 1000;
      localStorage.setItem("tugOfWarTimer", expirationTime);
      return expirationTime - Date.now();
    }
  });

  // ------------------------------
  // Question & Answer States
  // ------------------------------
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ropePosition, setRopePosition] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const questions = [
    {
      question:
        "If January 1, 2024 is a Monday, what day of the week will October 31, 2024 be?",
      options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      answer: "Thursday",
      marks: 10,
    },
    {
      question:
        "A train traveling at 60 km/hr departs at 8:00 AM. A second train at 80 km/hr leaves 8:30 AM. At what time will the second catch up?",
      options: ["9:30 AM", "10:00 AM", "10:15 AM", "10:30 AM"],
      answer: "10:00 AM",
      marks: 10,
    },
    {
      question:
        "Find the next term in the sequence: 7G, 11K, 13Q, 17U, ___?",
      options: ["19A", "19B", "19C", "19D"],
      answer: "19A",
      marks: 10,
    },
    {
      question:
        "A school's student council has 12 members. How many different subcommittees of 4 can be formed?",
      options: [495, 330, 210, 120],
      answer: 495,
      marks: 10,
    },
    {
      question:
        "Consider the sentences: (i) Everybody in the class is prepared for the exam. (ii) Babu invited Danish to his home because he enjoys playing chess. Which observation is correct?",
      options: [
        "(i) is grammatically correct and (ii) is unambiguous",
        "(i) is grammatically incorrect and (ii) is unambiguous",
        "(i) is grammatically correct and (ii) is ambiguous",
        "(i) is grammatically incorrect and (ii) is ambiguous",
      ],
      answer: "(i) is grammatically correct and (ii) is ambiguous",
      marks: 10,
    },
    {
      question:
        "Directions: In a survey of 100 students, 60 like Mathematics, 45 like Science, and 30 like both. How many like only Science?",
      options: ["15", "30", "45", "60"],
      answer: "15",
      marks: 10,
    },
    {
      question:
        "In a family, if A is the sister of B, B is married to C, and C is the sister of D, who is the mother of E, what is A's relation to E?",
      options: ["Aunt", "Cousin", "Sister", "Grandmother"],
      answer: "Aunt",
      marks: 10,
    },
    {
      question:
        "Directions: From town A, travel 3 km east, 4 km north, 5 km west, and 2 km south. In which direction from town A is town B located?",
      options: ["North-West", "North-East", "South-West", "South-East"],
      answer: "North-West",
      marks: 10,
    },
    {
      question:
        "In a family, if A is the daughter of B, and B has two children, A and C. C is married to D, and they have a daughter E. What is E's relation to A?",
      options: ["Sister", "Cousin", "Niece", "Aunt"],
      answer: "Niece",
      marks: 10,
    },
    {
      question:
        "A book costs Rs. 250. With a 10% discount and an additional 5% discount on the sale price, what is the final price?",
      options: ["Rs. 210", "Rs. 213.75", "Rs. 220", "Rs. 225"],
      answer: "Rs. 213.75",
      marks: 10,
    },
  ];

  // ------------------------------
  // Fetch saved answer when revisiting a question
  // ------------------------------
  useEffect(() => {
    const saved = localStorage.getItem(`answer-${currentQuestion}`);
    if (saved) {
      setSelectedAnswer(JSON.parse(saved));
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestion]);

  // ------------------------------
  // Final Submission Handler
  // ------------------------------
  const handleFinalSubmit = useCallback(() => {
    // Save current answer
    localStorage.setItem(`answer-${currentQuestion}`, JSON.stringify(selectedAnswer));
    setIsSubmitting(true);
    let correctCount = 0;
    for (let i = 0; i < totalQuestions; i++) {
      const storedAnswer = localStorage.getItem(`answer-${i}`);
      if (storedAnswer) {
        const ans = JSON.parse(storedAnswer);
        if (ans === questions[i].answer) {
          correctCount++;
        }
      }
    }
    setScore(correctCount);
    localStorage.setItem("score", correctCount);
    setIsSubmitting(false);
    if (correctCount >= 6) {
      navigate("/Level3instructions");
    } else {
      setGameOver(true);
      navigate("/Thankyou");
      // Optionally display an alert for insufficient correct answers
    }
  }, [currentQuestion, selectedAnswer, totalQuestions, questions, navigate]);

  // ------------------------------
  // Timer Effect: Auto-submit when time is up
  // ------------------------------
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedTimer = localStorage.getItem("tugOfWarTimer");
      if (storedTimer) {
        const newTimeLeft = Math.max(parseInt(storedTimer, 10) - Date.now(), 0);
        setTimeLeft(newTimeLeft);
        if (newTimeLeft <= 0) {
          clearInterval(intervalId);
          handleFinalSubmit();
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [handleFinalSubmit]);

  // ------------------------------
  // Continuous Oscillation for Rope Animation
  // ------------------------------
  useEffect(() => {
    const oscillateTugOfWar = async () => {
      while (!gameOver) {
        await tugWarControls.start({
          x: 10,
          transition: { duration: 0.5, yoyo: Infinity },
        });
        await tugWarControls.start({
          x: -10,
          transition: { duration: 0.5, yoyo: Infinity },
        });
      }
    };
    oscillateTugOfWar();
  }, [gameOver, tugWarControls]);

  // ------------------------------
  // Option Selection
  // ------------------------------
  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
    localStorage.setItem(`answer-${currentQuestion}`, JSON.stringify(option));
  };

  // ------------------------------
  // Navigation between Questions
  // ------------------------------
  const handleNextQuestion = () => {
    localStorage.setItem(`answer-${currentQuestion}`, JSON.stringify(selectedAnswer));
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // ------------------------------
  // Timer Display Calculations
  // ------------------------------
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-black text-white relative">
      <div className="absolute top-4 left-4 px-8 py-4 rounded-md text-yellow-400 font-bold text-xl">
        Player ID: {localStorage.getItem("playerId") || "Guest"}
      </div>
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
        Tug of War Challenge
      </h1>
      <p className="mb-2">
        Question {currentQuestion + 1} of {totalQuestions}
      </p>
      <p className="text-xl font-bold text-red-400 mb-4">
        ⏳ Time Left: {minutes}:{seconds}
      </p>

      <motion.div
        className="relative w-1/2 h-40 flex justify-between items-center mt-4"
        animate={tugWarControls}
      >
        <motion.img
          src="/images/TeamA.png"
          alt="Team A"
          className="w-32 h-32 z-10"
          animate={{ x: -ropePosition / 2 }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        <motion.div
          className="absolute top-[53%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-2 bg-yellow-800"
          style={{ zIndex: 1 }}
          animate={{ x: ropePosition }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        <motion.img
          src="/images/TeamB.png"
          alt="Team B"
          className="w-32 h-32 z-10"
          animate={{ x: ropePosition / 2 }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </motion.div>

      <div className="my-6 w-1/2 flex justify-center">
        <div className="bg-gray-800 p-4 rounded-lg text-center w-full">
          <p className="mt-2 text-xl">{questions[currentQuestion]?.question}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`px-4 py-2 rounded text-white ${
                  selectedAnswer === option ? "bg-blue-600" : "bg-gray-700"
                } hover:bg-blue-800`}
                disabled={isSubmitting}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0 || isSubmitting}
            >
              Previous
            </button>
            {currentQuestion === totalQuestions - 1 ? (
              <button
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                onClick={handleNextQuestion}
                disabled={isSubmitting}
              >
                Next
              </button>
            )}
          </div>
          {errorMessage && (
            <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => navigate("/Level3instructions")}
        className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
        disabled={isSubmitting}
      >
        Next Level
      </button>
    </div>
  );
};

export default TugOfWar;
