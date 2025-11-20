import mongoose from "mongoose";

// Database url added in .env
const baseUrl = process.env.MONGODB || "mongodb://localhost:27017/chatterUp";

// Connect to the database
export const connectMongoose = async () => {
  
  try {
    await mongoose.connect(baseUrl);
    console.log("MongoDB connected using mongoose");
  }
  catch (err) {
    console.log(err);
  }

};