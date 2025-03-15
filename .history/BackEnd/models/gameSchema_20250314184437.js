import mongoose from "mongoose";
const gameSchema=mongoose.Schema({
    name:{type:String,required:true},
    score:{type:Number,required:true},
    time:{type:String,required:true},
    
})