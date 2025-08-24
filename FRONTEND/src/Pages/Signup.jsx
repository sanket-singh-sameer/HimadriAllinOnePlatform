import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea] px-[clamp(32px,5vw,96px)] flex items-center justify-center text-[#2c2c2c] font-serif overflow-hidden">
        <Link
          to="/login"
          className="absolute top-6 right-8 text-gray-700 px-5 py-2 rounded transition hover:underline underline-offset-2 hidden md:block z-10"
          data-aos="fade-left"
        >
          <h6 className="!leading-none text-sm">Already a member? Login</h6>
        </Link>

        <div className="center-container flex items-center justify-center flex-col sm:flex-row">
          <div className="left-box mb-6" data-aos="zoom-in">
            <Link to={"/"}>
              <h4 className="sm:!text-right font-semibold text-4xl text-gray-800 [text-shadow:2px_2px_0px_rgba(0,0,0,0.05)]">
                Himadri <br /> Boys <br /> Hostel
              </h4>
            </Link>
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
              className="flex flex-col gap-4 w-full max-w-md mt-8"
              onSubmit={handleSubmit}
            >
              <label className="flex flex-col text-left">
                <span className="mb-1 text-gray-700">Name</span>
                <input
                  value={name}
                  onChange={({ target }) => setName(target.value)}
                  type="text"
                  name="name"
                  className="px-3 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                  placeholder="Enter your name"
                  required
                />
              </label>
              <label className="flex flex-col text-left">
                <span className="mb-1 text-gray-700">Email</span>
                <input
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  type="email"
                  name="email"
                  className="px-3 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </label>
              <label className="flex flex-col text-left">
                <span className="mb-1 text-gray-700">Password</span>
                <input
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  type="password"
                  name="password"
                  className="px-3 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </label>
              {error && <p className="text-red-700 !italic">{error}</p>}
              <button
                type="submit"
                className="mt-4 bg-gray-900 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition shadow-md cursor-pointer"
              >
                <p className="!leading-none !m-0 !italic !font-semibold">
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </p>
              </button>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:underline ml-auto"
                >
                  <h6 className="!leading-none">You are one of us? Login</h6>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
