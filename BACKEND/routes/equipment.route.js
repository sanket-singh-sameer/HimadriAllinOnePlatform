import express from "express";

import {
  addNewEquipment,
  issueEquipment,
  returnEquipment,
  updateEquipmentDetails,
} from "../controllers/equipment.controller.js";
import { checkIfCommittee } from "../middlewares/checkIfCommitte.middleware.js";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.post("/add", verifyTokenFromCookies, checkIfCommittee, addNewEquipment);
router.post(
  "/update/:id",
  verifyTokenFromCookies,
  checkIfCommittee,
  updateEquipmentDetails
);
router.post(
  "/issue/:id",
  verifyTokenFromCookies,
  checkIfCommittee,
  issueEquipment
);
router.post(
  "/return/:id",
  verifyTokenFromCookies,
  checkIfCommittee,
  returnEquipment
);

export default router;
