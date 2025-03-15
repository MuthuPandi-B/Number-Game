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

  return (
  <div className="flex jus">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🎯 Guess the Number</h1>

        {!gameStarted && !showNameInput && !gameOver && (
          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200">
            Start New Game
          </button>
        )}

        {showNameInput && (
          <>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border p-3 rounded-lg w-full mb-4"
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
              onClick={handleNameSubmit}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200">
              Continue
            </button>
          </>
        )}

        {gameStarted && (
          <>
            <input
              type="text"
              placeholder="Enter your guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="border p-3 rounded-lg w-full mb-4"
            />
            <button
              onClick={checkGuess}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200">
              Submit Guess
            </button>
            <p className="mt-4 text-lg font-semibold text-gray-700">{feedback}</p>
            <p className="mt-2 text-gray-600">Attempts: {attempts}</p>
          </>
        )}

        {gameOver && (
          <>
            <h2 className="text-xl font-bold text-green-600 mt-4">🎉 Game Over!</h2>
            <p className="text-gray-700 mt-2">Your Score: {finalScore}</p>
            {bestScore && (
              <p className="text-gray-800 mt-1">
                🏆 Best Score: {bestScore.name} - {bestScore.finalScore.toFixed(2)}
              </p>
            )}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setGameOver(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200">
                Close
              </button>
              <button
                onClick={restartGame}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                Start New Game
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
  );
};

export default App;
