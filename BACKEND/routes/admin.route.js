import express from "express";
import { checkAdminController, getAdminDashboardController, loginAdminController, logoutAdminController } from "../controllers/admin.controller.js";
import { checkIfAdmin } from "../middlewares/checkIfAdmin.middleware.js";

const router = express.Router();

router.get("/check-auth", checkIfAdmin, checkAdminController);

router.get("/", getAdminDashboardController);
router.post("/login", loginAdminController);
router.get("/logout", logoutAdminController);


router.put("/committee-member-role-update", checkIfAdmin, (req, res) => {
  // Committee update logic here
});

export default router;
