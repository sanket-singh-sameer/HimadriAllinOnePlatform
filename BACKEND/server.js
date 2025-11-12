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
import messRoutes from "./routes/mess.route.js"
import equipmentRoutes from "./routes/equipment.route.js";
import idRoutes from "./routes/id.route.js";
import { startOutpassExpirationScheduler } from "./utils/outpassScheduler.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const allowedOrigins = [
  "https://nith.org.in",
  "https://himadri.nith.org.in",
  "http://localhost:5173",
  "http://localhost:8080",
  "https://himadriallinoneplatform.onrender.com",
  process.env.CLIENT_URL
]

app.use(cors({
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
app.use("/api/v1/mess", messRoutes);
app.use("/api/v1/equipment", equipmentRoutes);
app.use("/api/v1/id", idRoutes);

const PORT = process.env.PORT || 3000;

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "FRONTEND/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "FRONTEND", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  startOutpassExpirationScheduler();
  console.log(`Server is running on port ${PORT}`);
});
