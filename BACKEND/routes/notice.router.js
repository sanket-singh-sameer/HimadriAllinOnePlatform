import express from "express";
import {
  createNotice,
  deleteNotice,
  viewAllNotices,
} from "../controllers/notice.controller.js";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";
import { checkIfAdmin } from "../middlewares/checkIfAdmin.middleware.js";
import { checkIfCommittee } from "../middlewares/checkIfCommitte.middleware.js";
const router = express.Router();

router.post("/create", verifyTokenFromCookies, checkIfCommittee, createNotice);
router.get("/all", viewAllNotices);
router.delete("/:noticeId", verifyTokenFromCookies, deleteNotice);

export default router;
