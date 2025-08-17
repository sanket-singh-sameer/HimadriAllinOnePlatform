import React from "react";
import { Link } from "react-router-dom";

export default function OTPv() {
  return (
    <>
      <div className="min-h-screen bg-[#272643] px-[clamp(32px,5vw,96px)] flex items-center justify-center text-[#E3F6F5]">
        <div className="absolute top-6 right-8 text-sm transition hidden sm:block hover:underline cursor-pointer">
          <Link to="/login" className="underline-offset-2">
            <h6 className="!leading-none">Already a member? Login</h6>
          </Link>
        </div>
        <div className="center-container flex items-center justify-center flex-col sm:flex-row">
          <div className="right-box mb-6">
            <h4 className="sm:!text-right font-semibold [text-shadow:12px_12px_8px_rgba(0,0,0,0.8)]">
              Himadri <br /> Boys <br /> Hostel
            </h4>
          </div>
          <div className="mx-8 h-1 sm:h-108 w-108 sm:w-1 bg-white bg-opacity-50 rounded-full"></div>
          <div className="right-box flex flex-col items-center mt-6 sm:mt-0 sm:ml-16 text-[#E3F6F5]">
            <h2 className="!leading-none ">Verification</h2>
            <h6>Enter the OTP you received, champ!</h6>
            <form
              action=""
              className="flex flex-col justify-center gap-4 w-[clamp(12rem,50vw,24rem)] mt-6"
            >
              <input
                type="OTP"
                placeholder="OTP"
                className="px-4 py-2 rounded bg-[#E3F6F5] text-[#272643] focus:outline-none"
                required
              />
            </form>
            <div className="flex flex-col items-center mt-16">
              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  className="mt-2 w-1/2 bg-[#BAE8E8] py-2 rounded hover:bg-[#2C698D] transition !text-[#272643] cursor-pointer"
                >
                  <p className="!leading-none !text-[#272643] !m-0 !italic !font-semibold !opacity-100">
                    Verify
                  </p>
                </button>
              </div>
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
          </div>
        </div>
      </div>
    </>
  );
}
