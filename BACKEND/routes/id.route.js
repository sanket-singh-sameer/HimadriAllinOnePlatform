import express from "express";
import { 
  viewIDByRoll, 
  submitOutpassRequest,
  getMyOutpasses,
  getAllOutpasses,
  updateOutpassStatus
} from "../controllers/id.controller.js";
import { checkIfCommittee } from "../middlewares/checkIfCommitte.middleware.js";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// View student ID by roll number (committee only)
router.get("/:roll", checkIfCommittee, viewIDByRoll);

// Outpass routes
router.post("/outpass/submit", verifyTokenFromCookies, submitOutpassRequest);
router.get("/outpass/my", verifyTokenFromCookies, getMyOutpasses);
router.get("/outpass/all", checkIfCommittee, getAllOutpasses);
router.patch("/outpass/:id/status", checkIfCommittee, updateOutpassStatus);

export default router;
