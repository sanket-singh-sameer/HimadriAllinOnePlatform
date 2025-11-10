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
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.GMAIL_SMTP_USER,
    pass: process.env.GMAIL_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates in development
    ciphers: 'SSLv3'
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify transporter configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Helper function to send email with retry logic
const sendEmailWithRetry = async (mailOptions, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully on attempt ${attempt}:`, info.messageId);
      return info;
    } catch (error) {
      lastError = error;
      console.error(`❌ Email sending failed (attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  // If all retries failed, throw the last error
  throw lastError;
};

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
    await sendEmailWithRetry(mailOptions);
    console.log("✅ OTP sent successfully to", email);
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    throw new Error("Failed to send verification email. Please try again later.");
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
    await sendEmailWithRetry(mailOptions);
    console.log("✅ Welcome email sent successfully to", email);
    return true;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
    // Don't throw error for welcome emails, just log it
    return false;
  }
};

export const resetPasswordGMail = async (email, resetToken) => {
  const resetURL = process.env.CLIENT_URL 
    ? `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    : `https://himadri.nith.org.in/reset-password/${resetToken}`;
    
  const mailOptions = {
    from: `"NITH" <${process.env.GMAIL_SMTP_USER}>`,
    to: email,
    subject: "Password Reset",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replaceAll(
      "{resetURL}",
      resetURL
    ).replaceAll("Your App Team", "HBH NITH"),
  };

  try {
    await sendEmailWithRetry(mailOptions);
    console.log("✅ Password reset email sent successfully to", email);
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error.message);
    throw new Error("Failed to send password reset email. Please try again later.");
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
    await sendEmailWithRetry(mailOptions);
    console.log("✅ Password reset success email sent successfully to", email);
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset success email:", error.message);
    // Don't throw error for success confirmation emails, just log it
    return false;
  }
};
