import React from "react";

const Congratulations = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative overflow-hidden">
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl animate-bounce">
          Congratulations!
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-white">
          You have successfully completed the challenge.
        </p>
      </div>
      {/* Firework Animation */}
      <svg
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-20 firework-animation"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="10" fill="yellow" />
        <circle cx="50" cy="50" r="20" fill="orange" opacity="0.6" />
        <circle cx="50" cy="50" r="30" fill="red" opacity="0.4" />
      </svg>
      <style>{`
        @keyframes firework {
          0% {
            transform: scale(0.5) translate(-50%, -50%);
            opacity: 1;
          }
          100% {
            transform: scale(2) translate(-50%, -50%);
            opacity: 0;
          }
        }
        .firework-animation {
          animation: firework 2s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Congratulations;
