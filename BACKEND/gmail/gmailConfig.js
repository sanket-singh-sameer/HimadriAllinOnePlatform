import nodemailer from "nodemailer";
import xsam from "../config/env.js";

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./gmailTemplate.js";

/**
 * Gmail SMTP Configuration for Email Service
 * 
 * IMPORTANT: Gmail SMTP may have connectivity issues in production environments
 * like Render, Heroku, etc. due to firewall restrictions.
 * 
 * Alternative Solutions:
 * 1. Use Resend (already configured in /resend/mailConfig.js)
 * 2. Use SendGrid (free tier: 100 emails/day)
 * 3. Use Mailgun (free tier: 5,000 emails/month)
 * 4. Use AWS SES (very reliable and cheap)
 * 
 * Required Environment Variables:
 * - GMAIL_SMTP_USER: Your Gmail address
 * - GMAIL_SMTP_PASS: Gmail App Password (NOT your regular password)
 *   Generate at: https://myaccount.google.com/apppasswords
 * - CLIENT_URL: Your frontend URL for reset links
 */

// Try multiple configurations - Gmail can be restrictive in some environments
const createTransporter = () => {
  // Configuration 1: Try port 587 with STARTTLS (most common)
  try {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: xsam.env.GMAIL_SMTP_USER,
        pass: xsam.env.GMAIL_SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
      pool: true, // Use pooled connections
      maxConnections: 5,
      rateDelta: 1000,
      rateLimit: 5
    });
  } catch (error) {
    console.error('Failed to create email transporter:', error.message);
    // Return a dummy transporter that won't crash the app
    return null;
  }
};

const transporter = createTransporter();

// Verify transporter configuration on startup (non-blocking)
if (transporter) {
  transporter.verify(function (error, success) {
    if (error) {
      console.error('⚠️  Email transporter verification failed:', error.message);
      console.log('📧 Email sending may be affected. Check your GMAIL_SMTP credentials and network settings.');
      console.log('💡 Consider using alternative email service (SendGrid, Mailgun, AWS SES)');
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
} else {
  console.error('⚠️  Email transporter could not be initialized');
  console.log('📧 Email functionality will be disabled');
}

// Helper function to check if email is available
const isEmailAvailable = () => {
  return transporter !== null && xsam.env.GMAIL_SMTP_USER && xsam.env.GMAIL_SMTP_PASS;
};

// Helper function to send email with retry logic
const sendEmailWithRetry = async (mailOptions, maxRetries = 2) => {
  // Check if email is configured
  if (!isEmailAvailable()) {
    console.error('❌ Email service not configured or unavailable');
    throw new Error('Email service is currently unavailable. Please contact support.');
  }

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
        // Wait before retrying (shorter wait time)
        const waitTime = 2000; // Fixed 2 seconds
        console.log(`⏳ Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  // If all retries failed, throw the last error
  console.error('❌ All email retry attempts failed. Email service may be down.');
  throw lastError;
};

export const otpVerificationGMail = async (email, otp) => {
  const mailOptions = {
    from: `"NITH" <${xsam.env.GMAIL_SMTP_USER}>`,
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
    from: `"NITH" <${xsam.env.GMAIL_SMTP_USER}>`,
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
  const resetURL = xsam.env.CLIENT_URL 
    ? `${xsam.env.CLIENT_URL}/reset-password/${resetToken}`
    : `https://himadri.nith.org.in/reset-password/${resetToken}`;
    
  const mailOptions = {
    from: `"NITH" <${xsam.env.GMAIL_SMTP_USER}>`,
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
    from: `"NITH" <${xsam.env.GMAIL_SMTP_USER}>`,
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
