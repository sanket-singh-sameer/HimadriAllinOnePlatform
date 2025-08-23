import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { generateToken } from "../utils/jwtTokenOperations.js";
import { clearCookies, setCookies } from "../utils/cookieOperations.js";
import { generateOtp } from "../utils/otpGeneration.js";
import {
  otpVerificationMail,
  passwordResetEmail,
  passwordResetSuccessEmail,
  welcomeEmail,
} from "../resend/mailConfig.js";

export const signupController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    let roll;
    if (email.endsWith("@nith.ac.in")) {
      roll = email.trim().split("@")[0].toUpperCase();
    } else {
      return res.status(400).json({ message: "Use your college email" });
    }
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      if (isUserExists.isVerified === true) {
        return res.status(400).json({ message: "User already exists" });
      } else if (isUserExists.isVerified === false) {
        const otp = await generateOtp();
        const hashedPassword = await bcrypt.hash(password, 10);
        isUserExists.name = name;
        isUserExists.password = hashedPassword;
        isUserExists.verificationToken = otp;
        isUserExists.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
        await isUserExists.save();
        await otpVerificationMail(email, otp);
        
        return res.status(201).json({
          message: "User registered successfully",
          user: { ...isUserExists._doc, password: undefined },
        });
      }
    }
    const otp = await generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      roll,
      verificationToken: otp,
      verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    await newUser.save();
    await otpVerificationMail(email, otp);
    return res.status(201).json({
      message: "User registered successfully",
      user: { ...newUser._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    if (!token) {
      return res.status(500).json({ message: "Error generating token" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified" });
    }
    setCookies(res, token);

    res.status(200).json({ message: "Login successful", user: user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const logoutController = (req, res) => {
  try {
    clearCookies(res);
    res.status(200).json({ message: "Logout successful", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error, success: false });
  }
};

export const otpVerificationController = async (req, res) => {
  const { otp } = req.body;
  try {
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }
    const user = await User.findOne({
      verificationToken: otp,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid OTP or OTP expired" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    const token = generateToken(user);
    if (!token) {
      return res.status(500).json({ message: "Error generating token" });
    }
    setCookies(res, token);
    await welcomeEmail(
      user.email,
      user.name,
      "HBH NITH",
      "http://yourapp.com/dashboard",
      "support@yourapp.com",
      "http://yourapp.com/help"
    );
    return res.status(200).json({
      message: "Email verified successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error verifying email", error });
  }
};

export const passwordForgotController = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!email.endsWith("@nith.ac.in")) {
      return res.status(400).json({ message: "Use your college email" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    user.resetPasswordToken = crypto.randomBytes(16).toString("hex");
    user.resetPasswordTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();
    await passwordResetEmail(email, user.resetPasswordToken);
    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error });
  }
};

export const passwordResetController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();
    await passwordResetSuccessEmail(user.email);
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error });
  }
};

export const checkAuthController = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = await User.findById(req.userId).select("-password");
    res
      .status(200)
      .json({
        message: "User is authenticated",
        user: { ...user._doc, password: undefined },
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const updateProfileController = async (req, res) => {
  const { name, phone, room, profilePicture } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.room = room || user.room;
    user.profilePicture = profilePicture || user.profilePicture;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user:{...user._doc, password: undefined} });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};
