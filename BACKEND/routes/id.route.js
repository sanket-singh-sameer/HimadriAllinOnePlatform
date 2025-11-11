import express from "express";
import { 
  viewIDByRoll, 
  markMessAttendence,
  exportMessAttendance,
  cleanupDuplicateAttendance,
  submitOutpassRequest,
  getMyOutpasses,
  getAllOutpasses,
  updateOutpassStatus
} from "../controllers/id.controller.js";
import { checkIfCommittee } from "../middlewares/checkIfCommitte.middleware.js";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";
import { checkIfAdmin } from "../middlewares/checkIfAdmin.middleware.js";
import { checkIfMessCommittee } from "../middlewares/checksForCommittee/messCommitteeCheck.js";

const router = express.Router();

// View student ID by roll number (committee only)
router.get("/:roll", checkIfCommittee, viewIDByRoll);

// Mess attendance routes (mess committee only)
router.post("/mess-attendance/cleanup-duplicates", checkIfAdmin, cleanupDuplicateAttendance);
router.get("/mess-attendance/export", checkIfCommittee, exportMessAttendance);
router.post("/mess-attendance/:roll", checkIfMessCommittee, markMessAttendence);

// Outpass routes
router.post("/outpass/submit", verifyTokenFromCookies, submitOutpassRequest);
router.get("/outpass/my", verifyTokenFromCookies, getMyOutpasses);
router.get("/outpass/all", checkIfCommittee, getAllOutpasses);
router.patch("/outpass/:id/status", checkIfAdmin, updateOutpassStatus);

export default router;
