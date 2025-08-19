import User from "../models/user.model.js";
import { getUserId } from "../utils/getUserId.js";

export const checkIfCommittee = async (req, res, next) => {
  const committeeId = getUserId(req);
  if (!committeeId) {
    return res.status(403).json({ message: "Access denied" });
  }
  const committee = await User.findById(committeeId);
  if (!committee || committee.role == "student") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
