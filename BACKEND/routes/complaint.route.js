import { createComplaint, viewComplaint, viewComplaintDetails } from "../controllers/complaint.controller.js";
import express from "express";
const router = express.Router();

router.post("/new", createComplaint);
router.get("/", viewComplaint);
router.get("/:id", viewComplaintDetails);


export default router;
