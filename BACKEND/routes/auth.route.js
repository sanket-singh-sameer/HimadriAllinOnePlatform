import express from "express";
import {
  loginController,
  logoutController,
  signupController,
  otpVerificationController,
  passwordForgotController,
  passwordResetController,
  checkAuthController,
  updateProfileController,
  totalUserLoggedInController,
} from "../controllers/auth.controller.js";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";
import { getStudentByRoll } from "../controllers/admin.controller.js";
import { checkIfAdmin } from "../middlewares/checkIfAdmin.middleware.js";
const router = express.Router();

router.get("/check-auth", verifyTokenFromCookies, checkAuthController);

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/logout", logoutController);

router.post("/verify-email", otpVerificationController);
router.post("/forgot-password", passwordForgotController);
router.post("/reset-password/:token", passwordResetController);

router.put("/update-profile", verifyTokenFromCookies, updateProfileController);

router.get(
  "/total-user-count",
  totalUserLoggedInController
);
router.get(
  "/:rollNumber",
  verifyTokenFromCookies,
  checkIfAdmin,
  getStudentByRoll
);

export default router;
