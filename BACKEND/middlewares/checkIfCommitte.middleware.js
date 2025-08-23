import User from "../models/user.model.js";
import { getUserId } from "../utils/getUserId.js";

export const checkIfCommittee = async (req, res, next) => {
  try {
    const committeeId = getUserId(req);
    if (!committeeId) {
      return res.status(403).json({ message: "Access denied" });
    }
    const committee = await User.findById(committeeId);
    if (!committee || committee.role == "student") {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (error) {
    console.error("Error checking committee access:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
