import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import game from "./models/gameSchema.js";

//App Config
const app=express();


//Middlewares
app.use(express.json());
app.use(cors());

//DB Config
dotenv.config();

//DB Connection
connectDB();



app.get("/",(req,res)=>res.status(200).send("Welcome to the Backend"));

//Save Score
app.post("/save-score",async(req,res)=>{
    try {
        const {name,score,attempts,time}=req.body;
        const newGame=new game({name,score,attempts,time});
        await newGame.save();
        res.status(200).send("Score saved successfully");
        
    } catch (error) {
        res.status(500).send("Error saving the score");
    }
});

//Get Best Scores
app.get("/best-scores",async (req,res) => {
    
})



const port = process.env.PORT || 4000;
app.listen(port,()=>console.log(`Server is running on port ${port}`));
