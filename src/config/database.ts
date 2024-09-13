// <========================= file to establish the database connection ===============>

// importing the required statements
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// establishing the connection
export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB as string);
    console.log("mongo db connected");
  } catch (error) {
    console.error("connection error");
  }
};
