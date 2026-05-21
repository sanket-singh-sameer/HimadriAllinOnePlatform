import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import xsam from "./config/env.js";
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
import { isRedisConfigured } from "./utils/redisClient.js";

if (!isRedisConfigured()) {
  console.warn("Redis credentials are missing. Cache-backed flows will be disabled.");
}

const app = express();
const __dirname = path.resolve();

const allowedOrigins = [
  "https://nith.org.in",
  "https://himadri.nith.org.in",
  "http://localhost:5173",
  "http://localhost:8080",
  "https://himadriallinoneplatform.onrender.com",
  xsam.env.CLIENT_URL
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



app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/messmenu", messMenuRoutes);
app.use("/api/v1/notice", noticeRoutes);
app.use("/api/v1/cgpi", cgpiRoutes);
app.use("/api/v1/mess", messRoutes);
app.use("/api/v1/equipment", equipmentRoutes);
app.use("/api/v1/id", idRoutes);

const PORT = xsam.env.PORT || 3000;

if (xsam.env.NODE_ENV === "production" && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, "FRONTEND/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "FRONTEND", "dist", "index.html"));
  });
}

connectDB();

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
