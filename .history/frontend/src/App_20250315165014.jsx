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
    // ✅ Retrieve Player Name on Page Load
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // 📌 Fetch Best Score
  const fetchBestScore = async () => {
    try {
      // const response = await axios.get("https://number-game-n2wf.onrender.com/best-score");
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
    localStorage.setItem("playerName", playerName);
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
      setError("Enter a valid 4-digit number with unique digits.");

      //Clear the error after 3 seconds
      setTimeout(()=>{
        setError("");
      },3000);
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
      console.log(timeTaken)
      const score = 1000 / timeTaken + 100 / (attempts + 1); // 🏆 Best Score Formula
      console.log(score);
      setFinalScore(score.toFixed(2));
      saveScore(playerName, attempts + 1, timeTaken, score);
      console.log(playerName, attempts + 1, timeTaken, score);
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
      // await axios.post("https://number-game-n2wf.onrender.com/save-score", {
      await axios.post("http://localhost:5000/save-score", {
        name,
        attempts,
        time,
        score,
      });
      fetchBestScore(); // Refresh Best Score
    } catch (error) {
      console.error("Error saving score", error);
    }
  };

  // 📌 Restart Game
  const restartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setFinalScore(null);
    setShowNameInput(false);
    setGuess("");
    setFeedback("");
    setAttempts(0);
    setSecretNumber(generateUniqueNumber());
    setStartTime(Date.now());
  };
  const closeGame = () => {
    setGameOver(false);
    setPlayerName(""); // Clear the entered name
    setGuess(""); // Clear the entered guess
    setFeedback(""); // Clear feedback message (if any)
    setAttempts(0); // Reset the attempts
    setGameStarted(false); // Reset the game started state
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black p-4">
      {/* Centered Box */}
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-2xl border-2 border-gray-800 text-center">
        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-8 text-white neon-text">
          🎯 Guess the Number
        </h1>
        {/* ✅ Show Player Name (Only If Entered) */}
        {playerName && (
          <p className="text-xl text-gray-300 mb-4">👤 Player: {playerName}</p>
        )}

        {/* Start Game Button */}
        {!gameStarted && !showNameInput && !gameOver && (
          <button
            onClick={startGame}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-blue-400/50 text-2xl font-bold"
          >
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
              className="w-full bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition duration-300 shadow-lg hover:shadow-green-400/50 text-2xl font-bold"
            >
              Continue
            </button>
          </>
        )}

        {/* Gameplay Section */}
        {gameStarted && (
          <>
            {/* Guess Input */}
            <div className="flex gap-2 justify-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <input
                    type="text"
                    maxLength="1"
                    value={guess[i] || ""}
                    onChange={(e) => {
                      // Allow only numbers (0-9)
                      if (!/^\d$/.test(e.target.value)) return;

                      // Ensure 4-digit input
                      if (guess.length >= 4) return;

                      // Add the new digit
                      let newGuess = guess + e.target.value;
                      setGuess(newGuess); // Convert array back to string

                      // Auto-focus to next input field
                      if (e.target.value && i < 3) {
                        document.getElementById(`guess-${i + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // If Backspace or Delete is pressed, reset everything
                      if (e.key === "Backspace" || e.key === "Delete") {
                        e.preventDefault();
                        setGuess("");
                      }
                    }}
                    id={`guess-${i}`} // Unique ID for focus
                    className="border p-3 w-12 h-12 text-center rounded-lg bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-green-500 text-2xl"
                  />
                
                  {/* Show feedback directly under each digit */}
                  <span className="text-xl font-bold mt-1 text-white">
                    {feedback[i] || ""}
                  </span>
                  
                </div>
                
              ))}
            </div>
              {/* Show Error Message if Input is Invalid */}
              {error && (
                    <p className="text-red-400 text-xl mt-2">{error}</p>
                  )}

            <button
              onClick={checkGuess}
              className="w-full bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition duration-300 shadow-lg hover:shadow-green-400/50 text-2xl font-bold"
            >
              Submit Guess
            </button>

            <p className="mt-4 text-xl text-gray-400">Attempts: {attempts}</p>
            <button
              onClick={closeGame}
              className="w-1/2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300 shadow-lg hover:shadow-gray-500/50 text-xl font-bold"
            >
              Close
            </button>
          </>
        )}

        {/* Game Over Section */}
        {gameOver && (
          <>
            <h2 className="text-3xl font-bold text-green-500 mt-6">
              🎉 Game Over!
            </h2>
            <p className="text-2xl text-gray-300 mt-4">
              Your Score: {finalScore}
            </p>
            {bestScore && (
              <p className="text-xl text-gray-400 mt-2">
                🏆 Best Score: {bestScore.name} -{" "}
                {bestScore.finalScore.toFixed(2)}
              </p>
            )}
            <div className="mt-8 flex justify-between gap-4">
              <button
                onClick={closeGame}
                className="w-1/2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300 shadow-lg hover:shadow-gray-500/50 text-xl font-bold"
              >
                Close
              </button>
              <button
                onClick={restartGame}
                className="w-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-blue-400/50 text-xl font-bold"
              >
                Play Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
