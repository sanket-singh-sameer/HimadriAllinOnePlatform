import express from "express";
import {
  loginController,
  logoutController,
  signupController,
  otpVerificationController,
  passwordForgotController,
  passwordResetController,
  checkAuthController,
} from "../controllers/auth.controller.js";
import { verifyTokenFromCookies } from "../middlewares/verifyToken.middleware.js";
const router = express.Router();

router.get("/check-auth", verifyTokenFromCookies, checkAuthController);

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/logout", logoutController);

router.post("/verify-email", otpVerificationController);
router.post("/forgot-password", passwordForgotController);
router.post("/reset-password/:token", passwordResetController);

export default router;
