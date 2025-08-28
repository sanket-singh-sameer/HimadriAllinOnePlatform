import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

export default function ResetPassword() {
  console.log("ResetPassword component rendering...");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, error, isLoading } = useAuthStore();

  console.log("Token from URL:", token);

  useEffect(() => {
    console.log("ResetPassword useEffect running...");
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(pass)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(pass)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(pass)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    // Check if token exists
    if (!token) {
      setValidationError("Invalid reset token");
      return;
    }

    try {
      await resetPassword(token, password);
      setIsSubmitted(true);
      toast.success("Password reset successfully!");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successfully</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <Link
              to="/login"
              className="inline-block bg-gray-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition"
            >
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea] flex flex-col md:flex-row overflow-hidden">
        <Link
          to="/login"
          className="absolute top-6 right-8 text-gray-700 px-5 py-2 rounded transition hover:underline underline-offset-2 hidden md:block z-10"
          data-aos="fade-left"
        >
          <h6 className="!leading-none text-sm">Back to Login</h6>
        </Link>

        <div className="left-box w-full md:w-2/5 md:min-h-screen bg-white px-[clamp(32px,5vw,96px)] pt-[clamp(2rem,5vw,12rem)] pb-6 border-r border-gray-200 shadow-sm">
          <Link to={"/"}>
            <h4
              className="!text-left text-4xl font-semibold text-gray-800 [text-shadow:2px_2px_0px_rgba(0,0,0,0.05)]"
              data-aos="zoom-in"
            >
              Himadri <br />
              Boys <br />
              Hostel
            </h4>
          </Link>

          <h6
            className="!leading-tight mt-6 text-gray-600  hidden md:block"
            data-aos="zoom-in"
          >
            "This is an all-in-one platform created by students, managed by
            students, and built for every hosteler's life. It brings everything
            you need into one place—making hostel life simpler, smarter, and
            more connected."
          </h6>
          <h6
            className="!leading-tight mt-12 md:mt-24 italic !font-bold text-gray-800 hidden md:block"
            data-aos="zoom-in"
          >
            Because who knows hostel struggles better than us? Made by students,
            managed by students!
          </h6>
        </div>

        <div
          className="right-box flex flex-col items-center justify-center w-full md:w-3/5 text-gray-800 py-12 px-8"
          data-aos="fade-left"
        >
          <h2 className="!leading-tight text-3xl font-bold tracking-wide">
            Create New Password
          </h2>
          <h6 className="text-gray-600 italic text-center mt-2">
            Enter your new password below
          </h6>

          <form
            className="flex flex-col gap-4 w-full max-w-sm mt-8"
            onSubmit={handleSubmit}
          >
            <label className="flex flex-col text-left">
              <span className="mb-1 text-gray-700">New Password</span>
              <input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                type="password"
                name="password"
                className="px-3 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                placeholder="Enter your new password"
                required
              />
            </label>

            <label className="flex flex-col text-left">
              <span className="mb-1 text-gray-700">Confirm Password</span>
              <input
                value={confirmPassword}
                onChange={({ target }) => setConfirmPassword(target.value)}
                type="password"
                name="confirmPassword"
                className="px-3 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                placeholder="Confirm your new password"
                required
              />
            </label>
            
            {(validationError || error) && (
              <p className="text-red-700 !italic">{validationError || error}</p>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-gray-900 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition shadow-md cursor-pointer disabled:opacity-50"
            >
              <p className="!leading-none !m-0 !italic !font-semibold">
                {isLoading ? "Resetting..." : "Reset Password"}
              </p>
            </button>
            
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:underline ml-auto"
              >
                <h6 className="!leading-none">Back to Login</h6>
              </Link>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:underline ml-auto"
              >
                <h6 className="!leading-none">Need another reset link?</h6>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}