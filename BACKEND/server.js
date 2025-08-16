import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import { otpVerificationMail } from "./resend/mailConfig.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import complaintRoutes from "./routes/complaint.route.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/complaints", complaintRoutes);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
//   otpVerificationMail("legendprice007@gmail.com", "123456");
//   otpVerificationMail("sanketsinghsameer8055@gmail.com", "696969");
  res.send("Hello Bhai!");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
