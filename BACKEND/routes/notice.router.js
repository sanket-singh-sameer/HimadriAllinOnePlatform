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

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});


router.post(
  "/create",
  verifyTokenFromCookies,
  checkIfCommittee,
  upload.single("file"),
  createNotice
);
router.get("/all", viewAllNotices);
router.delete("/:noticeId", verifyTokenFromCookies, deleteNotice);

export default router;
