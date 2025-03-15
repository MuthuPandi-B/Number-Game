import axios from "axios";
import React, { useState, useEffect } from "react";

const App = () => {
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [bestScore, setBestScore] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [secretNumber, setSecretNumber] = useState("");
  const [error, setError] = useState(null);

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
    console.log()
  };

  // 📌 Start Game
  const startGame = () => {
    if (playerName === "") {
      setError("Please enter your name");
      return;
    }
    setGameStarted(true);
    setStartTime(Date.now());
    setAttempts(0);
    setSecretNumber);
    console.log("Secret Number (Debug):", secretNumber); // Debugging
    setFeedback("");
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
      saveScore(playerName, attempts + 1, timeTaken);
      setFeedback(`🎉 You won in ${attempts + 1} attempts!`);
      setGameStarted(false);
    } else {
      setFeedback(feedbackStr);
    }
  };

  // 📌 Save Score to Backend & Fetch Best Score
  const saveScore = async (name, attempts, time) => {
    try {
      await axios.post("http://localhost:5000/save-score", { name, attempts, time });
      fetchBestScore(); // Refresh Best Score
    } catch (error) {
      console.error("Error saving score", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">🔢 Guess the Number</h1>

        {!gameStarted ? (
          <>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border p-2 rounded mb-4 w-full"
            />
            <button
              onClick={startGame}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Start Game
            </button>
            {bestScore && (
              <p className="mt-4 text-gray-700">
                🏆 Best Score: {bestScore.name} - {bestScore.finalScore.toFixed(2)}
              </p>
            )}
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter your guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="border p-2 rounded mb-4 w-full"
            />
            <button
              onClick={checkGuess}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Submit Guess
            </button>
            <p className="mt-4 text-lg font-semibold">{feedback}</p>
            <p className="mt-4 text-gray-700">Attempts: {attempts}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
