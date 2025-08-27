import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

export default function OTPv() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { verifyOtp, isLoading, error } = useAuthStore();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ otp });
    try {
      await verifyOtp(otp);
      navigate("/dashboard");
      toast.success("OTP verified successfully");
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error("OTP verification failed");
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea] px-[clamp(32px,5vw,96px)] flex items-center justify-center text-gray-800 font-serif overflow-hidden">
        <div className="absolute top-6 right-8 text-sm transition hidden sm:block hover:underline cursor-pointer text-gray-600" data-aos="fade-left">
          <Link to="/login" className="underline-offset-2">
            <h6 className="!leading-none">Already a member? Login</h6>
          </Link>
        </div>

        <div className="flex items-center justify-center w-full">
          <div className="center-container flex items-center justify-center flex-col sm:flex-row">
            <div className="right-box mb-6" data-aos="zoom-in">
              <h4 className="sm:!text-right font-semibold text-4xl text-gray-800 [text-shadow:2px_2px_0px_rgba(0,0,0,0.05)]">
                Himadri <br /> Boys <br /> Hostel
              </h4>
            </div>

            <div className="mx-8 h-1 sm:h-108 w-108 sm:w-1 bg-gray-400 bg-opacity-30 rounded-full"></div>

            <div className="right-box flex flex-col items-center mt-6 sm:mt-0 sm:ml-16 text-gray-800" data-aos="fade-left">
              <h2 className="!leading-none text-3xl font-bold tracking-wide">
                Verification
              </h2>
              <h6 className="text-gray-600 italic">
                Enter the OTP you received, champ!
              </h6>

              <form
                className="flex flex-col gap-4 w-full max-w-md mt-8"
                onSubmit={handleSubmit}
              >
                <label className="flex flex-col text-left">
                  <span className="mb-1 text-gray-700">OTP</span>
                  <input
                    value={otp}
                    onChange={({ target }) => setOtp(target.value)}
                    type="text"
                    name="otp"
                    className="px-3 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                    placeholder="Enter your OTP"
                    required
                  />
                </label>

                {error && <p className="text-red-700 !italic">{error}</p>}
                <button
                  type="submit"
                  className="mt-4 bg-gray-900 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition shadow-md cursor-pointer"
                >
                  <p className="!leading-none !m-0 !italic !font-semibold">
                    {isLoading ? "Verifying..." : "Verify"}
                  </p>
                </button>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 hover:underline ml-auto"
                  >
                    <h6 className="!leading-none">Still waiting? Resend OTP</h6>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
