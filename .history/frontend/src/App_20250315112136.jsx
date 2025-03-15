import axios from "axios";
import React, { useState, useEffect } from "react";

const App = () => {
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [bestScore, setBestScore] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [secretNumber, setSecretNumber] = useState("");
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
    fetchBestScore();
  }, []);

  // 📌 Fetch Best Score
  const fetchBestScore = async () => {
    try {
      const response = await axios.get("http://localhost:5000/best-score");
      setBestScore(response.data);
    } catch (error) {
      console.error("Error fetching best score", error);
    }
  };

  // 📌 Generate Secret Number (Unique Digits)
  const generateUniqueNumber = () => {
    let digits = new Set();
    while (digits.size < 4) {
      digits.add(Math.floor(Math.random() * 10));
    }
    return Array.from(digits).join("");
  };

  // 📌 Start Game
  const startGame = () => {
    setShowNameInput(true);
  };

  const handleNameSubmit = () => {
    if (playerName.trim() === "") {
      setError("Please enter your name");
      return;
    }
    setError(null);
    const newSecretNumber = generateUniqueNumber();
    setGameStarted(true);
    setStartTime(Date.now());
    setAttempts(0);
    setSecretNumber(newSecretNumber);
    setShowNameInput(false);
    setFeedback("");
    console.log(`🔍 Secret Number (Debug): ${newSecretNumber}`);
  };

  // 📌 Check User's Guess
  const checkGuess = () => {
    if (guess.length !== 4 || new Set(guess).size !== 4) {
      setFeedback("Enter a valid 4-digit number with unique digits.");
      return;
    }

    setAttempts(attempts + 1);
    let feedbackStr = "";

    for (let i = 0; i < 4; i++) {
      if (guess[i] === secretNumber[i]) {
        feedbackStr += "+";
      } else if (secretNumber.includes(guess[i])) {
        feedbackStr += "-";
      } else {
        feedbackStr += " ";
      }
    }

    if (feedbackStr === "++++") {
      const timeTaken = (Date.now() - startTime) / 1000;
      const score = (1000 / timeTaken) + (100 / (attempts + 1)); // 🏆 Best Score Formula
      setFinalScore(score.toFixed(2));
      saveScore(playerName, attempts + 1, timeTaken, score);
      setFeedback(`🎉 You won in ${attempts + 1} attempts!`);
      setGameStarted(false);
      setGameOver(true);
    } else {
      setFeedback(feedbackStr);
    }
  };

  // 📌 Save Score to Backend & Fetch Best Score
  const saveScore = async (name, attempts, time, score) => {
    try {
      await axios.post("http://localhost:5000/save-score", { name, attempts, time, score });
      fetchBestScore(); // Refresh Best Score
    } catch (error) {
      console.error("Error saving score", error);
    }
  };

  // 📌 Restart Game
  const restartGame = () => {
    setPlayerName("");
    setGameStarted(false);
    setGameOver(false);
    setFinalScore(null);
    setShowNameInput(false);
    setGuess("");
    setFeedback("");
  };

  return 
  (
  <div className="flex justify-center items-center min-h-screen bg-black p-4">
  {/* Centered Box */}
  <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-2xl border-2 border-gray-800 text-center">
    {/* Title */}
    <h1 className="text-5xl font-extrabold mb-8 text-white neon-text">
      🎯 Guess the Number
    </h1>

    {/* Start Game Button */}
    {!gameStarted && !showNameInput && !gameOver && (
      <button
        onClick={startGame}
        className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-blue-400/50 text-2xl font-bold">
        Start New Game
      </button>
    )}

    {/* Name Input */}
    {showNameInput && (
      <>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="border p-4 rounded-lg w-full mb-6 bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 transition text-2xl"
        />
        {error && <p className="text-red-400 mb-4 text-xl">{error}</p>}
        <button
          onClick={handleNameSubmit}
          className="w-full bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition duration-300 shadow-lg hover:shadow-green-400/50 text-2xl font-bold">
          Continue
        </button>
      </>
    )}

    {/* Gameplay Section */}
    {gameStarted && (
      <>
        <input
          type="text"
          placeholder="Enter your guess"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="border p-4 rounded-lg w-full mb-6 bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-green-500 transition text-2xl"
        />
        <button
          onClick={checkGuess}
          className="w-full bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition duration-300 shadow-lg hover:shadow-green-400/50 text-2xl font-bold">
          Submit Guess
        </button>
        <p className="mt-6 text-2xl font-semibold text-gray-300">{feedback}</p>
        <p className="mt-4 text-xl text-gray-400">Attempts: {attempts}</p>
      </>
    )}

    {/* Game Over Section */}
    {gameOver && (
      <>
        <h2 className="text-3xl font-bold text-green-500 mt-6">🎉 Game Over!</h2>
        <p className="text-2xl text-gray-300 mt-4">Your Score: {finalScore}</p>
        {bestScore && (
          <p className="text-xl text-gray-400 mt-2">
            🏆 Best Score: {bestScore.name} - {bestScore.finalScore.toFixed(2)}
          </p>
        )}
        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={() => setGameOver(false)}
            className="w-1/2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300 shadow-lg hover:shadow-gray-500/50 text-xl font-bold">
            Close
          </button>
          <button
            onClick={restartGame}
            className="w-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-blue-400/50 text-xl font-bold">
            Play Again
          </button>
        </div>
      </>
    )}
  </div>
</div>
  )
};

export default App;
