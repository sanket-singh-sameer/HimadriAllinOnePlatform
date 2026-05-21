import jwt from "jsonwebtoken";
import xsam from "../config/env.js";

export const generateToken = (user) => {
  const JWT_SECRET = xsam.env.JWT_SECRET;
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
  return token;
};

export const verifyToken = (token) => {
  const JWT_SECRET = xsam.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
