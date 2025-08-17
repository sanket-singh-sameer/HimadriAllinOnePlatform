import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { Login, error, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      navigate("/login", {
        state: { error: "Login failed. Please try again." },
      });
    }
  };
  return (
    <>
      <div className="min-h-screen bg-[#272643] flex flex-col md:flex-row">
        <Link
          to="/signup"
          className="absolute top-6 right-8  text-[#E3F6F5] px-5 py-2 rounded transition hover:underline underline-offset-2 hidden md:block"
        >
          <h6 className="!leading-none text-sm">New member? Signup</h6>
        </Link>
        <div className="left-box w-full md:w-2/5 md:min-h-screen bg-[#BAE8E8] px-[clamp(32px,5vw,96px)] pt-[clamp(2rem,5vw,12rem)] pb-6">
          <h4 className="!text-left [text-shadow:12px_12px_6px_rgba(255,255,255,0.8)]">
            Himadri <br />
            Boys <br />
            Hostel
          </h4>
          <h6 className="!leading-tight mt-6">
            “This is an all-in-one platform created by students, managed by
            students, and built for every hosteler’s life. It brings everything
            you need into one place—making hostel life simpler, smarter, and
            more connected.”
          </h6>
          <h6 className="!leading-tight mt-12 md:mt-24 italic !font-bold">
            Because who knows hostel struggles better than us? Made by students,
            managed by students!
          </h6>
        </div>
        <div className="right-box flex flex-col items-center justify-center w-full md:w-3/5 text-[#E3F6F5] py-12 px-8">
          <h2 className="!leading-tight">Step Right In</h2>
          <h6>Log in and take charge</h6>
          <form
            className="flex flex-col gap-4 w-full max-w-sm mt-8"
            onSubmit={handleSubmit}
          >
            <label className="flex flex-col text-left">
              <span className="mb-1">Email</span>
              <input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                type="email"
                name="email"
                className="px-3 py-2 rounded bg-[#22223b] text-[#E3F6F5] border border-[#BAE8E8] focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </label>
            <label className="flex flex-col text-left">
              <span className="mb-1">Password</span>
              <input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                type="password"
                name="password"
                className="px-3 py-2 rounded bg-[#22223b] text-[#E3F6F5] border border-[#BAE8E8] focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </label>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="mt-4 bg-[#BAE8E8] text-[#272643] font-bold py-2 rounded hover:bg-[#2C698D] transition cursor-pointer"
            >
              <p className="!leading-none !text-[#272643] !m-0 !italic !font-semibold !opacity-100">
                {isLoading ? "Logging in..." : "Log In"}
              </p>
            </button>
            <div className="flex">
              <Link
                to="/reset-password"
                className="text-sm text-[#BAE8E8] hover:underline ml-auto"
              >
                <h6 className="!leading-none">Lost your password? Reset Now</h6>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
