import React, { useState } from "react";
import { Square, Circle, Triangle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [playerId, setPlayerId] = useState("");
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    localStorage.setItem("playerId", playerId.trim());
    navigate("/HomePage");
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundImage: "url('/images/squid game landscape(pramod).png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-10 z-0"></div>

      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative p-6 sm:p-8 rounded-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl text-center z-10"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="flex justify-center mb-5 space-x-2">
          <Circle size={50} className="text-white" />
          <Triangle size={50} className="text-white" />
          <Square size={50} className="text-white" />
        </div>
        <h1 className="text-cyan-700 font-bold text-2xl sm:text-3xl mb-5">
          Enter your Player ID
        </h1>
        <form onSubmit={handleStart}>
          <div className="mb-4 text-left">
            <label className="block mb-1 text-emerald-50 text-3xl">
              Player ID
            </label>
            <input
              type="text"
              placeholder="Enter your Player ID"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              required
              className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white focus:outline-none focus:border-red-600"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-400 text-black font-roboto text-lg rounded cursor-pointer hover:bg-blue-500 active:bg-blue-400"
          >
            Let's Start
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
