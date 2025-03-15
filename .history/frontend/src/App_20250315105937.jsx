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
  div
  );
};

export default App;
