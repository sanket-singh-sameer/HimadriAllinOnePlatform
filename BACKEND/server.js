import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import complaintRoutes from "./routes/complaint.route.js";
import adminRoutes from "./routes/admin.route.js";
import messMenuRoutes from "./routes/messmenu.route.js";
import noticeRoutes from "./routes/notice.router.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,

}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/messmenu", messMenuRoutes);
app.use("/api/v1/notice", noticeRoutes);


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
