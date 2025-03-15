import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://guess4numbers.netlify.app"],
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL,)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// Score Schema & Model
const scoreSchema = new mongoose.Schema({
  name: String,
  attempts: Number,
  time: Number,
  finalScore: Number,
});

const Score = mongoose.model("Score", scoreSchema);

app.get("/", (req, res) => {
  res.send("Welcome to backend");
});

// 📌 Save Score API & Return Best Score
app.post("/save-score", async (req, res) => {
  try {
    const { name, attempts, time,score} = req.body;
   


    // Save new score
    const newScore = new Score({ name, attempts, time, finalScore:score });
    await newScore.save();

    // Get the Best Score (Highest Score)
    const bestScore = await Score.find().sort({ finalScore: -1 }).limit(1);

    res.json({
      message: "Score saved!",
      finalScore:score,
      bestScore: bestScore[0] || { name: "None", finalScore: 0 },
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
