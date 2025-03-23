import React from "react";

const Congratulations = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Confetti overlay (optional image) */}
      <img
        src="/images/confetti.png"
        alt="Confetti"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30 animate-fadeIn"
      />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl animate-bounce">
          Congratulations!
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-white">
          You have successfully completed the challenge.
        </p>
        <button className="mt-8 px-6 py-3 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300">
          Celebrate
        </button>
      </div>
      {/* Additional animated confetti elements */}
      <div className="absolute bottom-0 w-full flex justify-center mb-8">
        <svg
          className="w-24 h-24 md:w-32 md:h-32 animate-spin-slow"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="10" strokeDasharray="283" strokeDashoffset="75" />
        </svg>
      </div>
    </div>
  );
};

export default Congratulations;
