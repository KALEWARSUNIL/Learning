import mongoose from "mongoose";

async function connectdb()
{
 
 await mongoose.connect(process.env.MONGODB_URI);
 console.log("database connected succesfully");
}
export  default connectdb;