import User from "../models/user.model.js";
import { getUserId } from "../utils/getUserId.js";

export const checkIfAdmin = async (req, res, next) => {
  const adminId = getUserId(req);
  if (!adminId) {
    return res.status(403).json({ message: "Access denied" });
  }
  const admin = await User.findById(adminId);
  if (!admin || (admin.role !== "admin" && admin.role !== "super-admin")) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
