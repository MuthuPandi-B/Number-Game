import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//App Config
const app=express();
const port = process.env.PORT || 4000;

//Middlewares
app.use(express.json());
app.use(cors(I));

//DB Config
dotenv.config();

//DB Connection
connectDB();



app.get("/",(req,res)=>res.status(200).send("Welcome to the Backend"));
app.listen(port(),console.log(`Listening on localhost:${port}`));
