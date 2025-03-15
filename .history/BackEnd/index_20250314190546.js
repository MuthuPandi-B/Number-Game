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
    tr
}
    )


const port = process.env.PORT || 4000;
app.listen(port,()=>console.log(`Server is running on port ${port}`));
