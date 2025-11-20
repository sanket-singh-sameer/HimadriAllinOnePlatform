import { Resend } from "resend";
import {
  OUTPASS_APPROVED_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./mailTemplate.js";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Verify Resend API key on startup
if (!process.env.RESEND_API_KEY) {
  console.error('⚠️  RESEND_API_KEY not found in environment variables');
  console.log('📧 Email functionality will be limited');
} else {
  console.log('✅ Resend email service initialized');
}

export const otpVerificationGMail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "HBH NITH <noreply@nith.org.in>",
      to: [email],
      subject: "OTP Verification - HBH NITH",
      html: VERIFICATION_EMAIL_TEMPLATE.replaceAll("{verificationCode}", otp)
        .replaceAll("{appName}", "HBH NITH")
        .replaceAll("{supportEmail}", "support@nith.org.in")
        .replaceAll("Your App Team", "HBH NITH Team"),
    });

    if (error) {
      console.error('❌ Error sending OTP:', error);
      throw new Error("Failed to send verification email. Please try again later.");
    }

    console.log('✅ OTP sent successfully to', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP:', error.message);
    throw new Error("Failed to send verification email. Please try again later.");
  }
};

export const welcomeGMail = async (email, userName) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "HBH NITH <welcome@nith.org.in>",
      to: [email],
      subject: "Welcome to HBH NITH",
      html: WELCOME_EMAIL_TEMPLATE.replaceAll("{userName}", userName)
        .replaceAll("{appName}", "HBH NITH")
        .replaceAll("{dashboardURL}", process.env.CLIENT_URL || "https://himadri.nith.org.in")
        .replaceAll("{supportEmail}", "support@nith.org.in")
        .replaceAll("{helpCenterURL}", "https://nith.org.in/help")
        .replaceAll("Your App Team", "HBH NITH Team"),
    });

    if (error) {
      console.error('❌ Error sending welcome email:', error);
      return false;
    }

    console.log('✅ Welcome email sent successfully to', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    return false;
  }
};

export const resetPasswordGMail = async (email, resetToken) => {
  try {
    const resetURL = process.env.CLIENT_URL 
      ? `${process.env.CLIENT_URL}/reset-password/${resetToken}`
      : `https://himadri.nith.org.in/reset-password/${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: "HBH NITH <security@nith.org.in>",
      to: [email],
      subject: "Password Reset - HBH NITH",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replaceAll(
        "{resetURL}",
        resetURL
      ).replaceAll("Your App Team", "HBH NITH Team"),
    });

    if (error) {
      console.error('❌ Error sending password reset email:', error);
      throw new Error("Failed to send password reset email. Please try again later.");
    }

    console.log('✅ Password reset email sent successfully to', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    throw new Error("Failed to send password reset email. Please try again later.");
  }
};

export const passwordResetSuccessGMail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "HBH NITH <security@nith.org.in>",
      to: [email],
      subject: "Password Reset Successful - HBH NITH",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE.replaceAll(
        "{appName}",
        "HBH NITH"
      ).replaceAll("Your App Team", "HBH NITH Team"),
    });

    if (error) {
      console.error('❌ Error sending password reset success email:', error);
      return false;
    }

    console.log('✅ Password reset success email sent successfully to', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset success email:', error.message);
    return false;
  }
};

export const outpassApprovedGMail = async (email, outpassDetails) => {
  try {
    const {
      studentName,
      placeOfVisit,
      outDate,
      outTime,
      expectedReturnTime,
    } = outpassDetails;

    const { data, error } = await resend.emails.send({
      from: "HBH NITH <noreply@nith.org.in>",
      to: [email],
      subject: "Outpass Request Approved - HBH NITH",
      html: OUTPASS_APPROVED_TEMPLATE.replaceAll("{studentName}", studentName)
        .replaceAll("{placeOfVisit}", placeOfVisit)
        .replaceAll("{outDate}", new Date(outDate).toLocaleDateString())
        .replaceAll("{outTime}", outTime)
        .replaceAll("{expectedReturnTime}", expectedReturnTime),
    });

    if (error) {
      console.error("❌ Error sending outpass approved email:", error);
      return false;
    }

    console.log("✅ Outpass approved email sent successfully to", email);
    return true;
  } catch (error) {
    console.error("❌ Error sending outpass approved email:", error.message);
    return false;
  }
};
