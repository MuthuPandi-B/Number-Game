import mongoose from "mongoose";
const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.M)
        
    } catch (error) {
        
    }
}
