import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtTokenOperations.js";
import { setCookies } from "../utils/cookieOperations.js";
import { getUserId } from "../utils/getUserId.js";

export const loginAdminController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const admin = await User.findOne({
      email,
      role: { $in: ["admin", "super-admin"] },
    });
    if (!admin) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(admin._id);
    setCookies(res, token);
    res.status(200).json({
      message: "Admin login successful",
      admin: {
        ...admin._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminDashboardController = async (req, res) => {
  try {
    const adminId = getUserId(req);
    if (!adminId) {
      return res.status(404).json({ message: "Unauthorized" });
    }
    const admin = await User.findById(adminId).select("-password");
    if (admin) {
        if(admin.role !== "admin" && admin.role !== "super-admin") {
            return res.status(403).json({ message: "Access denied" });
        }
    }
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({
      message: "Admin dashboard",
      admin: {
        ...admin._doc,
        password: undefined,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutAdminController = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Admin logged out successfully" });
};


export const checkAdminController = async (req, res) => {
  const adminId = getUserId(req);
  if (!adminId) {
    return res.status(403).json({ message: "Access denied" });
  }
  const admin = await User.findById(adminId);
  if (!admin || (admin.role !== "admin" && admin.role !== "super-admin")) {
    return res.status(403).json({ message: "Access denied" });
  }
  res.status(200).json({ message: "Admin is authenticated" });
};


export const getStudentByRoll = async (req, res) => {
  let { rollNumber } = req.params;
  try {
    if (!rollNumber) {
      return res.status(400).json({ message: "Roll number is required" });
    }else{
      rollNumber = rollNumber.toUpperCase();
    }
    const student = await User.findOne({ roll:rollNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student found",
      student: {
        ...student._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};