import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import complaintRoutes from "./routes/complaint.route.js";
import adminRoutes from "./routes/admin.route.js";
import messMenuRoutes from "./routes/messmenu.route.js";
import noticeRoutes from "./routes/notice.router.js";
import cgpiRoutes from "./routes/cgpi.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const allowedOrigins = [
  "https://nith.org.in/", 
  "http://localhost:5173",
  process.env.CLIENT_URL
]

app.use(cors({
  // origin: process.env.CLIENT_URL ||  "http://localhost:5173",
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,

}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/messmenu", messMenuRoutes);
app.use("/api/v1/notice", noticeRoutes);
app.use("/api/v1/cgpi", cgpiRoutes);


const PORT = process.env.PORT || 3000;

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "FRONTEND/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "FRONTEND", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
