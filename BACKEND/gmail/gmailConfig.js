import nodemailer from "nodemailer";

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./gmailTemplate.js";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 587,
  //   secure: false, // Use TLS
  service: "gmail",

  auth: {
    user: process.env.GMAIL_SMTP_USER,
    pass: process.env.GMAIL_SMTP_PASS,
  },
});

export const otpVerificationGMail = async (email, otp) => {
  const mailOptions = {
    from: `"NITH" <${process.env.GMAIL_SMTP_USER}>`,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP code is ${otp}`,
    html: VERIFICATION_EMAIL_TEMPLATE.replaceAll("{verificationCode}", otp)
      .replaceAll("{appName}", "HBH NITH")
      .replaceAll("{supportEmail}", "sanketsinghsameer@proton.me")
      .replaceAll("Your App Team", "HBH NITH"),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

export const welcomeGMail = async (email, userName) => {
  const mailOptions = {
    from: `"NITH" <${process.env.GMAIL_SMTP_USER}>`,
    to: email,
    subject: "Welcome to HBH NITH",
    html: WELCOME_EMAIL_TEMPLATE.replaceAll("{userName}", userName)
      .replaceAll("{appName}", "HBH NITH")
      .replaceAll("{supportEmail}", "nith.org.in@gmail.com")
      .replaceAll("Your App Team", "HBH NITH"),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const resetPasswordGMail = async (email, resetToken) => {
  const mailOptions = {
    from: `"NITH" <${process.env.GMAIL_SMTP_USER}>`,
    to: email,
    subject: "Password Reset",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replaceAll(
      "{resetURL}",
      `https://nith.org.in/reset-password/${resetToken}`
    ).replaceAll("Your App Team", "HBH NITH"),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

export const passwordResetSuccessGMail = async (email) => {
  const mailOptions = {
    from: `"NITH" <${process.env.GMAIL_SMTP_USER}>`,
    to: email,
    subject: "Password Reset Successful",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE.replaceAll(
      "{appName}",
      "HBH NITH"
    ).replaceAll("Your App Team", "HBH NITH"),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset success email sent successfully");
  } catch (error) {
    console.error("Error sending password reset success email:", error);
  }
};
