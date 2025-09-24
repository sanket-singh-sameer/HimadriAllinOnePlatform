import express from "express";
import { checkIfCommittee } from "../middlewares/checkIfCommitte.middleware.js";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";
import {
  addToSnacksList,
  checkIfOptedForSnacks,
  removeFromSnacksList,
  updateOptedForSnacks,
  getMySnacksPreference,
  updateMySnacksPreference,
} from "../controllers/mess.controller.js";

const router = express.Router();

router.get("/snacks/:roll", checkIfOptedForSnacks);
router.put("/snacks/:roll/true", checkIfCommittee, addToSnacksList);
router.put("/snacks/:roll/false", checkIfCommittee, removeFromSnacksList);
router.put("/snacks/:roll/update-status", checkIfCommittee, updateOptedForSnacks);



// unavailable (may add soon)
// router.get("/my-snacks", verifyTokenFromCookies, getMySnacksPreference);
// router.put("/my-snacks", verifyTokenFromCookies, updateMySnacksPreference);

export default router;

