import mongoose from "mongoose";
import xsam from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(xsam.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
