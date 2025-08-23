import express from "express";
import { viewCGPIByRoll } from "../controllers/cgpi.controller.js";
const router = express.Router();

router.get("/:roll", viewCGPIByRoll);

export default router;
