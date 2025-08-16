import { Resend } from "resend";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./mailTemplate.js";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const otpVerificationMail = async (email, otp) => {
  console.log(email, otp);
  const { data, error } = await resend.emails.send({
    from: "HBH NITH <onboarding@test.divyamsingh.me>",
    to: [email],
    subject: "OTP Verification",
    html: VERIFICATION_EMAIL_TEMPLATE.replaceAll("{verificationCode}", otp),
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};

export const welcomeEmail = async (email, userName, appName, dashboardURL, supportEmail, helpCenterURL) => {
  console.log(email, userName);
  const { data, error } = await resend.emails.send({
    from: "HBH NITH <welcome@test.divyamsingh.me>",
    to: [email],
    subject: "Welcome to " + appName,
    html: WELCOME_EMAIL_TEMPLATE
      .replaceAll("{userName}", userName)
      .replaceAll("{appName}", appName)
      .replaceAll("{dashboardURL}", dashboardURL)
      .replaceAll("{supportEmail}", supportEmail)
      .replaceAll("{helpCenterURL}", helpCenterURL),
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};

export const passwordResetEmail = async (email, resetToken) => {
  console.log(email, resetToken);
  const { data, error } = await resend.emails.send({
    from: "HBH NITH <reset@test.divyamsingh.me>",
    to: [email],
    subject: "Password Reset",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replaceAll("{resetURL}", `${process.env.CLIENT_URL}/forgot-password/${resetToken}`),
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};

export const passwordResetSuccessEmail = async (email) => {
  console.log(email);
  const { data, error } = await resend.emails.send({
    from: "HBH NITH <reset@test.divyamsingh.me>",
    to: [email],
    subject: "Password Reset Successful",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE.replaceAll("{appName}", "HBH NITH"),
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};
