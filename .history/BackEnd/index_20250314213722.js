import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {

}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("DB Connection Error:", err));

// Score Schema & Model
const scoreSchema = new mongoose.Schema({
  name: String,
  attempts: Number,
  time: Number,
  finalScore: Number,
});

const Score = mongoose.model("Score", scoreSchema);

// 📌 Calculate Feedback for User's Guess
const getFeedback = (secretNumber, userGuess) => {
  let feedback = "";
  
  for (let i = 0; i < 4; i++) {
    if (userGuess[i] === secretNumber[i]) {
      feedback += "+"; // ✅ Correct digit & position
    } else if (secretNumber.includes(userGuess[i])) {
      feedback += "-"; // ➖ Correct digit but wrong position
    } else {
      feedback += " "; // ⬜ Digit not present
    }
  }
  
  return feedback;
};

// 📌 Save Score API & Return Best Score
app.post("/save-score", async (req, res) => {
  try {
    const { name, attempts, time } = req.body;

    // 📌 Updated Scoring Formula (Higher is Better)
    const finalScore = 10000 / ((attempts * 2) + time);

    // Save new score
    const newScore = new Score({ name, attempts, time, finalScore });
    await newScore.save();

    // Get the Best Score (Highest Score)
    const bestScore = await Score.find().sort({ finalScore: -1 }).limit(1);
    
    res.json({ 
      message: "Score saved!", 
      finalScore, 
      bestScore: bestScore[0] || { name: "None", finalScore: 0 } 
    });
  } catch (error) {
    res.status(500).json({ error: "Error saving score" });
  }
});

// 📌 Get Best Score API (Highest Score Wins)
app.get("/best-score", async (req, res) => {
  try {
    const bestScore = await Score.find().sort({ finalScore: -1 }).limit(1);
    res.json(bestScore[0] || { name: "None", finalScore: 0 });
  } catch (error) {
    res.status(500).json({ error: "Error fetching best score" });
  }
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
