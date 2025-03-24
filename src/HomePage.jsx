import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  // State for tabs, timer, error, and player ID
  const [activeTab, setActiveTab] = useState("intro");
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);

  // Slider state and sample data for dynamic player details
  const [currentSlide, setCurrentSlide] = useState(0);
  const playerNames = ["Pramod Motupalli", "Snehitha Mankena", "Bhavani Maradapu"];
  const playerIds = ["Player531", "Player526", "Player572"];

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % playerNames.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + playerNames.length) % playerNames.length);
  };

  // Retrieve playerId and setup hometimer on mount
  useEffect(() => {
    const storedPlayerId = localStorage.getItem("playerId");
    if (!storedPlayerId) {
      setError("Player ID not found in localStorage");
    } else {
      setPlayerId(storedPlayerId);
    }

    const storedTimer = localStorage.getItem("hometimer");
    if (!storedTimer) {
      // Set timer to 200 minutes from now
      const expirationTime = Date.now() + 1 * 60 * 1000;
      localStorage.setItem("hometimer", expirationTime);
      setRemainingTime(expirationTime - Date.now());
    } else {
      setRemainingTime(parseInt(storedTimer, 10) - Date.now());
    }
    setLoading(false);
  }, []);

  // Update the timer every second and navigate when time is up
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedTimer = localStorage.getItem("hometimer");
      if (storedTimer) {
        const timeLeft = parseInt(storedTimer, 10) - Date.now();
        if (timeLeft <= 0) {
          setRemainingTime(0);
          clearInterval(intervalId);
          navigate("/level1-instructions");
        } else {
          setRemainingTime(timeLeft);
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Format time in mm:ss
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto p-4 4k:p-8 bg-black min-h-screen min-w-full text-white relative">
      {/* Player ID & Timer Display (Top-Left & Top-Right) */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 px-3 py-1 rounded-md text-xs sm:text-sm md:text-2xl 4k:text-4xl shadow-md bg-gradient-to-r from-blue-500 via-pink-500 to-green-500 bg-clip-text text-transparent font-extrabold">
        Welcome, {playerId || "N/A"}
      </div>
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 px-3 py-1 rounded-md text-xs sm:text-sm md:text-2xl 4k:text-4xl shadow-md text-red-500 font-bold">
        Timer: {formatTime(remainingTime)}
      </div>

      {/* Main Content Box with Tabs */}
      <div className="slider w-full max-w-3xl 4k:max-w-7xl bg-white/20 p-4 sm:p-6 md:p-8 4k:p-12 rounded-lg shadow-lg text-center flex flex-col mx-auto">
        {/* Tab Buttons */}
        <div className="tab-buttons flex flex-wrap justify-center gap-3 mb-4">
          {["intro", "about", "rules"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 bg-blue-700 text-white rounded-md transition-all text-xs sm:text-sm md:text-base 4k:text-lg ${
                activeTab === tab ? "bg-blue-900" : "hover:bg-blue-900"
              }`}
            >
              {tab === "intro"
                ? "Introduction"
                : tab === "about"
                ? "About Us"
                : "Rules"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content flex-grow overflow-y-auto mt-2 text-xs sm:text-sm md:text-base 4k:text-lg">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && activeTab === "intro" && (
            <div className="intro-section">
              <h1 className="text-xl sm:text-2xl md:text-3xl 4k:text-5xl font-bold mb-2">
                Welcome to Cresence 2K25
              </h1>
              <p>
                <span className="text-blue-500 font-semibold">
                  Get ready for an electrifying experience!
                </span>
                <br />
                Cresence 2K25 is more than just a tech fest—it’s a celebration of
                innovation, competition, and creativity. Organized by the third-year
                students of JNTU GV's CSE department, this national-level fest brings
                together some of the sharpest minds from across the country.
              </p>
            </div>
          )}

          {!loading && !error && activeTab === "about" && (
            <div className="about-section">
              <h1 className="text-xl sm:text-2xl md:text-3xl 4k:text-5xl font-bold mb-2">
                About Us
              </h1>
              <p>
                <span className="text-blue-500 font-semibold">
                  Cresence2K25: A National-Level Tech Fest
                </span>
                <br />
                CRESENCE is a technical symposium organized by the students from the
                Department of Computer Science & Engineering, JNTU Vizianagaram.
                Designed around an immersive space theme, the fest serves as a dynamic
                platform for students to explore emerging technologies, enhance
                technical competencies, and engage in collaborative innovation. The
                symposium features a diverse range of technical events, coding challenges,
                hackathons, workshops, and expert sessions, alongside cultural engagements
                that foster a holistic learning experience. CRESENCE aims to bridge the gap
                between academia and industry by encouraging knowledge sharing, problem-solving,
                and technical excellence.
              </p>
            </div>
          )}

          {!loading && !error && activeTab === "rules" && (
            <div className="rules-section">
              <h1 className="text-xl sm:text-2xl md:text-3xl 4k:text-5xl font-bold mb-2">
                Game Rules
              </h1>
              <div className="rules-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Level 1: Red Light, Green Light (Debugging Battle)",
                    rules: [
                      "Participants will compete in pairs from the start.",
                      "Each pair starts with 100 won.",
                      "A buggy code will be given along with an editor to fix it.",
                      "Debugging is only allowed during the green light.",
                      "If they write during the red light, 5 won is deducted.",
                      "Pairs with less than 75 won are eliminated.",
                    ],
                  },
                  {
                    title: "Level 2: Tug of War (Aptitude & Logic Face-off)",
                    rules: [
                      "The remaining pairs will be split into two teams.",
                      "Both teams receive the same set of aptitude and logical reasoning questions.",
                      "Correct answers move the virtual rope toward their team’s side.",
                      "The team that pulls the rope completely to their side wins the round.",
                    ],
                  },
                  // {
                  //   title: "Level 3: Single and Mingle (Algorithmic Showdown)",
                  //   rules: [
                  //     "Each pair will receive an algorithm and pseudo code.",
                  //     "The team should predict the suitable data structure to solve it and complete the code.",
                  //     "The teams that correctly implement them will be declared the winners.",
                  //   ],
                  // },
                ].map((level, index) => (
                  <div
                    key={index}
                    className="bg-white/5 p-3 4k:p-6 rounded-lg shadow-md border border-white/10"
                  >
                    <b className="text-base sm:text-lg md:text-xl 4k:text-2xl text-blue-500">
                      {level.title}
                    </b>
                    <ul className="mt-2 space-y-1 text-left text-xs sm:text-sm md:text-base 4k:text-lg">
                      {level.rules.map((rule, i) => (
                        <li key={i}>• {rule}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Our Team Section with Slider */}
      <div className="max-w-4xl mx-auto my-8 px-4 4k:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
          {/* Left Column */}
          <div className="md:w-1/3">
            <h1 className="text-3xl sm:text-4xl 4k:text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent mb-4">
              Our Team
            </h1>
            <p className="text-base sm:text-lg 4k:text-xl leading-relaxed">
              Squid Game is powered by a passionate team of students dedicated to
              making this tech event a success. From Level1 to Level3, we ensure a
              seamless and engaging experience. Together, we bring innovation,
              creativity, and technology to life.
            </p>
          </div>

          {/* Middle Column - Slider with Images */}
          <div className="md:w-1/3 w-full">
            <div className="overflow-hidden rounded-md">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                <div
                  className="min-w-full w-full object-cover rounded-xl aspect-[2/3] bg-no-repeat bg-center bg-cover"
                  style={{ backgroundImage: "url('/images/pramodSG.jpg')" }}
                ></div>
                <div
                  className="min-w-full w-full object-cover rounded-xl aspect-[2/3] bg-no-repeat bg-center bg-cover"
                  style={{ backgroundImage: "url('/images/snehithasg.jpg')" }}
                ></div>
                <div
                  className="min-w-full w-full object-cover rounded-xl aspect-[2/3] bg-no-repeat bg-center bg-cover"
                  style={{ backgroundImage: "url('/images/bhavanisg.jpg')" }}
                ></div>
              </div>
            </div>
            {/* Navigation Buttons */}
            <div className="flex justify-center mt-2 gap-4">
              <button
                onClick={prevSlide}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-900"
              >
                &#8592;
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-900"
              >
                &#8594;
              </button>
            </div>
          </div>

          {/* Right Column - Dynamic Player Details */}
          <div className="md:w-1/3 w-full md:text-right">
            <h3 className="text-2xl sm:text-3xl 4k:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent mb-2">
              {playerNames[currentSlide]}
            </h3>
            <p className="text-base sm:text-2xl 4k:text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
              {playerIds[currentSlide]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
