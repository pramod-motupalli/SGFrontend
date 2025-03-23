import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage upon component mount.
    localStorage.clear();
  }, [navigate]);

  return (
    <div
      className="flex flex-col justify-end items-center min-h-screen bg-cover bg-top text-white text-center"
      style={{ backgroundImage: "url('/images/Lastpage.jpg')" }}
    >
      <div className="mb-10">
        <h1 className="text-8xl font-bold mb-6">Thank You! 😊</h1>
        <p className="text-3xl">
          We appreciate your effort and time in the game.
        </p>
      </div>
    </div>
  );
}
