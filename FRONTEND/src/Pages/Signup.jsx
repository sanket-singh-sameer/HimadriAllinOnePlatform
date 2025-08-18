import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, email, password });
    try {
      await signup(name, email, password);
      navigate("/otp-verify"); 
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea] px-[clamp(32px,5vw,96px)] flex items-center justify-center text-[#2c2c2c] font-serif">
        <Link
          to="/login"
          className="absolute top-6 right-8 text-gray-700 px-5 py-2 rounded transition hover:underline underline-offset-2 hidden md:block z-10"
          data-aos="fade-left"
        >
          <h6 className="!leading-none text-sm">Already a member? Login</h6>
        </Link>

        <div className="center-container flex items-center justify-center flex-col sm:flex-row">
          <div className="left-box mb-6" data-aos="zoom-in">
            <h4 className="sm:!text-right font-semibold text-4xl text-gray-800 [text-shadow:2px_2px_0px_rgba(0,0,0,0.05)]">
              Himadri <br /> Boys <br /> Hostel
            </h4>
          </div>

          <div className="mx-8 h-1 sm:h-108 w-108 sm:w-1 bg-gray-400 bg-opacity-30 rounded-full"></div>

          <div
            className="right-box flex flex-col items-center mt-6 sm:mt-0 sm:ml-16 text-gray-800"
            data-aos="fade-left"
          >
            <h2 className="!leading-none text-3xl font-bold tracking-wide">
              Welcome
            </h2>
            <h6 className="text-gray-600 italic">
              Please Sign-up to The Platform
            </h6>

            <form
              className="flex flex-col justify-center gap-4 w-[clamp(12rem,50vw,24rem)] mt-6"
              onSubmit={handleSubmit}
            >
              <input
                value={name}
                type="text"
                placeholder="Name"
                className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                required
                onChange={({ target }) => setName(target.value)}
              />
              <input
                value={email}
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                required
                onChange={({ target }) => setEmail(target.value)}
              />
              <input
                value={password}
                type="password"
                placeholder="Password"
                className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                required
                onChange={({ target }) => setPassword(target.value)}
              />

              {/* Button + Login Link */}
              <div className="flex flex-col items-center mt-16">
              {error && <p className="text-red-500">{error}</p>}
                <div className="w-full flex justify-center">
                  <button
                    type="submit"
                    className="mt-2 w-1/2 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition shadow-md"
                    disabled={isLoading}
                  >
                    <p className="!leading-none !m-0 !italic !font-semibold">
                      {isLoading ? "Signing Up..." : "Sign Up"}

                    </p>
                  </button>
                </div>
                <div>
                  <Link
                    to="/login"
                    className="hover:underline underline-offset-2 text-gray-600"
                  >
                    <h6 className="!leading-none mt-4">
                      You’re one of us? Login
                    </h6>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
