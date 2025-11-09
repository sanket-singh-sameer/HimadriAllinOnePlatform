import express from "express";
import { 
  viewIDByRoll, 
  markMessAttendence,
  exportMessAttendance,
  submitOutpassRequest,
  getMyOutpasses,
  getAllOutpasses,
  updateOutpassStatus
} from "../controllers/id.controller.js";
import { checkIfCommittee } from "../middlewares/checkIfCommitte.middleware.js";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";
import { checkIfAdmin } from "../middlewares/checkIfAdmin.middleware.js";

const router = express.Router();

// View student ID by roll number (committee only)
router.get("/:roll", checkIfCommittee, viewIDByRoll);

// Mess attendance routes
router.post("/mess-attendance/:roll", checkIfCommittee, markMessAttendence);
router.get("/mess-attendance/export", checkIfCommittee, exportMessAttendance);

// Outpass routes
router.post("/outpass/submit", verifyTokenFromCookies, submitOutpassRequest);
router.get("/outpass/my", verifyTokenFromCookies, getMyOutpasses);
router.get("/outpass/all", checkIfCommittee, getAllOutpasses);
router.patch("/outpass/:id/status", checkIfAdmin, updateOutpassStatus);

export default router;
