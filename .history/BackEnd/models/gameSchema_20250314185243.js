import mongoose from "mongoose";
const gameSchema=mongoose.Schema({
    name:{type:String,required:true},
    score:{type:Number,required:true},
    attempts:{type:Number,required:true},
    time:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    bestScore:{type:Boolean,default:false},
})

export default mongoose.model("game",gameSchema);
