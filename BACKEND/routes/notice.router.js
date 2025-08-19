import express from "express";
import {
  createNotice,
  viewAllNotices,
} from "../controllers/notice.controller.js";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";
import { checkIfAdmin } from "../middlewares/checkIfAdmin.middleware.js";
const router = express.Router();

router.post("/create", verifyTokenFromCookies, checkIfAdmin, createNotice);
router.get("/all", viewAllNotices);

export default router;
