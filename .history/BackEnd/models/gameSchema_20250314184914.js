import mongoose from "mongoose";
const gameSchema=mongoose.Schema({
    name:{type:String,required:true},
    score:{type:Number,required:true},
    atte
    time:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    highScore:{type:Boolean,default:false},
})