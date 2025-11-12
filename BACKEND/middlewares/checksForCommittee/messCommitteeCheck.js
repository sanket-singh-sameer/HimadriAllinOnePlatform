import User from "../../models/user.model.js";
import { getUserId } from "../../utils/getUserId.js";

export const checkIfMessCommittee = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(403).json({ message: "Access denied. Authentication required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ message: "Access denied. User not found." });
    }

    const allowedRoles = ["mess-committee"];
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        message: "Access denied. Only mess committee members can perform this action." 
      });
    }

    next();
  } catch (error) {
    console.error("Error checking mess committee access:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
