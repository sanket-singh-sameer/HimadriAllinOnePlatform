import express from "express";
import multer from "multer";
import {
  createNotice,
  deleteNotice,
  viewAllNotices,
} from "../controllers/notice.controller.js";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";
import { checkIfAdmin } from "../middlewares/checkIfAdmin.middleware.js";
import { checkIfCommittee } from "../middlewares/checkIfCommitte.middleware.js";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/png' || 
        file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.'), false);
    }
  }
});


router.post(
  "/create",
  verifyTokenFromCookies,
  checkIfCommittee,
  (req, res, next) => {
    upload.single("media")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: 'File upload error: ' + err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createNotice
);
router.get("/all", viewAllNotices);
router.delete("/:noticeId", verifyTokenFromCookies, deleteNotice);

export default router;
