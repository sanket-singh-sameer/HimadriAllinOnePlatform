import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function OTPv() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { verifyOtp, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ otp });
    try {
      await verifyOtp(otp);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea] px-[clamp(32px,5vw,96px)] flex items-center justify-center text-gray-800 font-serif">
        <div className="absolute top-6 right-8 text-sm transition hidden sm:block hover:underline cursor-pointer text-gray-600">
          <Link to="/login" className="underline-offset-2">
            <h6 className="!leading-none">Already a member? Login</h6>
          </Link>
        </div>

        <div className="flex items-center justify-center w-full">
          <div className="center-container flex items-center justify-center flex-col sm:flex-row">
            <div className="right-box mb-6">
              <h4 className="sm:!text-right font-semibold text-4xl text-gray-800 [text-shadow:2px_2px_0px_rgba(0,0,0,0.05)]">
                Himadri <br /> Boys <br /> Hostel
              </h4>
            </div>

            <div className="mx-8 h-1 sm:h-108 w-108 sm:w-1 bg-gray-400 bg-opacity-30 rounded-full"></div>

            <div className="right-box flex flex-col items-center mt-6 sm:mt-0 sm:ml-16 text-gray-800">
              <h2 className="!leading-none text-3xl font-bold tracking-wide">
                Verification
              </h2>
              <h6 className="text-gray-600 italic">
                Enter the OTP you received, champ!
              </h6>

              <form
                action=""
                className="flex flex-col justify-center gap-4 w-[clamp(12rem,50vw,24rem)] mt-6"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="OTP"
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                  required
                  onChange={({ target }) => setOtp(target.value)}
                  value={otp}
                />

                {error && <p className="text-red-500">{error}</p>}

                <div className="w-full flex flex-col justify-center items-center">
                  <button
                    type="submit"
                    className="mt-16 w-1/2 bg-gray-900 py-2 rounded hover:bg-gray-700 transition !text-white cursor-pointer"
                    disabled={isLoading}
                  >
                    <p className="!leading-none !text-white !m-0 !italic !font-semibold !opacity-100">
                      {isLoading ? "Verifying..." : "Verify"}
                    </p>
                  </button>
                  <div>
                    <Link
                      to="/login"
                      className="hover:underline underline-offset-2"
                    >
                      <h6 className="!leading-none mt-4">
                        Still waiting? Resend OTP
                      </h6>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
