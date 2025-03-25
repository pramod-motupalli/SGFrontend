import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import HomePage from "./HomePage.jsx";
import Level1Instructions from "./level1instructions.jsx";
import RedLightGreenLight from "./RedLightGreenLight.jsx";
import Level2instructions from "./Level2instructions";
import TugOfWar from "./TugOfWar.jsx";
import Level3instructions from "./Level3instructions";
import Symbols from "./Symbols.jsx";
import SingleAndMingle from "./SingleAndMingle.jsx";
import TugOfWarDisqualified from "./TugOfWarDisqualified.jsx";
import Thankyou from "./Thankyou.jsx";
import ContinuousBloodStainEffect from "./ContinuousRedTrailEffect"; // Import the effect
import PairingButton from "./pair.jsx";
import EightQueensPuzzle from "./EightQueensPuzzle.jsx"
import TowerOfHanoiPuzzle from "./TowerOfHanoiPuzzle.jsx"
import Sudoku from"./Sudoku.jsx"
import Game2048 from"./Game2048.jsx"
import Congratulations from"./Congratulations.jsx"
import LightsOut from"./TypingChallenge.jsx"
import { Analytics } from "@vercel/analytics/react"
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {/* Render the BloodStainEffect component so it applies globally */}
      <ContinuousBloodStainEffect />

      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <LoginPage />}
        />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/Congratulations" element={<Congratulations />} />
        <Route path="/EightQueensPuzzle" element={<EightQueensPuzzle />} />
        <Route path="/TowerOfHanoiPuzzle" element={<TowerOfHanoiPuzzle />} />
        <Route path="/Game2048" element={<Game2048 />} />
        <Route path="/LightsOut" element={<LightsOut />} />
        <Route path="/Sudoku" element={<Sudoku />} />
        <Route path="/pair" element={<PairingButton />} />
        <Route path="/level1-instructions" element={<Level1Instructions />} />
        <Route path="/level1/game" element={<RedLightGreenLight />} />
        <Route path="/Level2instructions" element={<Level2instructions />} />

        <Route path="/TugOfWar" element={<TugOfWar />} />
        <Route path="/Level3instructions" element={<Level3instructions />} />
        <Route path="/Symbols" element={<Symbols />} />
        <Route path="/SingleAndMingle" element={<SingleAndMingle />} /> 
        <Route path="/TugOfWarDisqualified" element={<TugOfWarDisqualified />} />
        <Route path="/SingleAndMingle" element={<SingleAndMingle />} />
        <Route path="/Thankyou" element={<Thankyou />} />
      </Routes>
    </Router>
  );
};

export default App;
