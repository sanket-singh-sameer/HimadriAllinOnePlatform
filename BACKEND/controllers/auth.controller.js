import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { generateToken } from "../utils/jwtTokenOperations.js";
import { clearCookies, setCookies } from "../utils/cookieOperations.js";
import { generateOtp } from "../utils/otpGeneration.js";
import {
  redisDelete,
  redisGetJson,
  redisIncrement,
  redisSetJson,
} from "../utils/redisCache.js";

import {
  otpVerificationGMail,
  welcomeGMail,
  resetPasswordGMail,
  passwordResetSuccessGMail,
} from "../resend/mailConfig.js";

const OTP_TTL_SECONDS = 15 * 60;
const OTP_MAX_ATTEMPTS = 3;
const RESET_TOKEN_TTL_SECONDS = 60 * 60;
const USER_STATS_CACHE_KEY = "stats:users:totals";

const normalizeEmail = (email) => email.trim().toLowerCase();
const signupSessionKey = (email) => `auth:signup:${normalizeEmail(email)}`;
const signupAttemptKey = (email) => `auth:signup:attempts:${normalizeEmail(email)}`;
const resetTokenKey = (token) => `auth:reset:token:${token}`;
const resetEmailKey = (email) => `auth:reset:email:${normalizeEmail(email)}`;
const hashValue = (value) =>
  crypto.createHash("sha256").update(String(value)).digest("hex");

const clearSignupSession = async (email) => {
  await Promise.all([
    redisDelete(signupSessionKey(email)),
    redisDelete(signupAttemptKey(email)),
  ]);
};

const cacheUserStats = async (data) => {
  await redisSetJson(USER_STATS_CACHE_KEY, data, 300);
};

const clearUserStatsCache = async () => {
  await redisDelete(USER_STATS_CACHE_KEY);
};

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
    const normalizedEmail = normalizeEmail(email);
    let roll;
    if (normalizedEmail.endsWith("@nith.ac.in")) {
      roll = normalizedEmail.split("@")[0].toUpperCase();
    } else {
      return res.status(400).json({ message: "Use your college email" });
    }
    const isUserExists = await User.findOne({ email: normalizedEmail });
    if (isUserExists) {
      if (isUserExists.isVerified === true) {
        return res.status(400).json({ message: "User already exists" });
      } else if (isUserExists.isVerified === false) {
        const otp = await generateOtp();
        const hashedPassword = await bcrypt.hash(password, 10);
        isUserExists.name = name;
        isUserExists.password = hashedPassword;
        await isUserExists.save();
        await clearSignupSession(normalizedEmail);
        await redisSetJson(signupSessionKey(normalizedEmail), {
          otpHash: hashValue(otp),
        }, OTP_TTL_SECONDS);
        await otpVerificationGMail(normalizedEmail, otp);

        return res.status(201).json({
          message: "User registered successfully",
          user: { ...isUserExists._doc, password: undefined },
        });
      }
    }
    const otp = await generateOtp();
    console.log("Generated OTP for new user:", otp, "with email:", email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      roll,
    });
    await newUser.save();
    await clearSignupSession(normalizedEmail);
    await redisSetJson(signupSessionKey(normalizedEmail), {
      otpHash: hashValue(otp),
    }, OTP_TTL_SECONDS);
    await clearUserStatsCache();
    await otpVerificationGMail(normalizedEmail, otp);
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
    const user = await User.findOne({ email: normalizeEmail(email) });
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
    res
      .status(500)
      .json({ message: "Error logging out", error, success: false });
  }
};

export const otpVerificationController = async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email ? normalizeEmail(email) : "";
  try {
    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const verificationSession = await redisGetJson(signupSessionKey(normalizedEmail));
    const user = await User.findOne({
      email: normalizedEmail,
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Please signup again!" });
    }
    if (!verificationSession?.otpHash) {
      return res.status(404).json({ message: "OTP expired. Please signup again!" });
    }

    if (verificationSession.otpHash !== hashValue(otp)) {
      const attempts = await redisIncrement(signupAttemptKey(normalizedEmail), OTP_TTL_SECONDS);
      if (attempts >= OTP_MAX_ATTEMPTS && !user.isVerified) {
        await Promise.all([
          redisDelete(signupSessionKey(normalizedEmail)),
          redisDelete(signupAttemptKey(normalizedEmail)),
          User.deleteOne({ email: normalizedEmail }),
          clearUserStatsCache(),
        ]);
        return res
          .status(429)
          .json({ message: "Too many requests, Signup again" });
      }
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
    await clearSignupSession(normalizedEmail);
    setCookies(res, token);
    await welcomeGMail(
      user.email,
      user.name,
      "HBH NITH",
      "https://nith.org.in" || "http://localhost:5173/dashboard",
      "sanketsinghsameer@proton.me",
      process.env.SUPPORT_URL || "https://divyamsingh.me"
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
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail.endsWith("@nith.ac.in")) {
      return res.status(400).json({ message: "Use your college email" });
    }
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const existingResetSession = await redisGetJson(resetEmailKey(normalizedEmail));
    await Promise.all([
      existingResetSession?.token ? redisDelete(resetTokenKey(existingResetSession.token)) : Promise.resolve(),
      redisDelete(resetEmailKey(normalizedEmail)),
      redisSetJson(resetTokenKey(resetToken), { email: normalizedEmail }, RESET_TOKEN_TTL_SECONDS),
      redisSetJson(resetEmailKey(normalizedEmail), { token: resetToken }, RESET_TOKEN_TTL_SECONDS),
    ]);
    await resetPasswordGMail(normalizedEmail, resetToken);
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

    const resetSession = await redisGetJson(resetTokenKey(token));
    const email = resetSession?.email;
    const user = email ? await User.findOne({ email }) : null;

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await Promise.all([
      redisDelete(resetTokenKey(token)),
      redisDelete(resetEmailKey(user.email)),
    ]);
    await passwordResetSuccessGMail(user.email);
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
    res.status(200).json({
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
    if (user.roll) {
      await redisDelete(`users:roll:${user.roll.toUpperCase()}`);
    }
    res.status(200).json({
      message: "Profile updated successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

export const totalUserLoggedInController = async (req, res) => {
  try {
    const cachedStats = await redisGetJson(USER_STATS_CACHE_KEY);
    if (cachedStats) {
      return res.status(200).json({
        message: "Total users fetched successfully",
        data: cachedStats,
      });
    }
    const totalUsers = await User.countDocuments({});
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalSuperAdmins = await User.countDocuments({ role: "super-admin" });
    await cacheUserStats({ totalUsers, totalAdmins, totalSuperAdmins });
    res.status(200).json({
      message: "Total users fetched successfully",
      data: { totalUsers, totalAdmins, totalSuperAdmins },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total users", error });
  }
};

export const changePasswordController = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error changing password", error });
  }
};
