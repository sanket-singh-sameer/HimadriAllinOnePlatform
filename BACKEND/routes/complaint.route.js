import {
  createComplaint,
  updateComplaintStatus,
  viewMyComplaint,
  viewComplaintDetails,
  viewAllComplaint,
  totalComplaintsController,
} from "../controllers/complaint.controller.js";
import express from "express";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";
import { checkIfAdmin } from "../middlewares/checkIfAdmin.middleware.js";
const router = express.Router();

router.post("/new", createComplaint);
router.get("/my", viewMyComplaint);
router.get("/all", viewAllComplaint);
router.get("/stats", totalComplaintsController);
router.get("/:id", viewComplaintDetails);
router.put("/:id", verifyTokenFromCookies, updateComplaintStatus);

export default router;
