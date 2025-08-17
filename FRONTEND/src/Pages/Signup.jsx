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
      <div className="min-h-screen bg-[#272643] px-[clamp(32px,5vw,96px)] flex items-center justify-center text-[#E3F6F5]">
        <div className="absolute top-6 right-8 text-sm transition hidden sm:block hover:underline cursor-pointer">
          <Link to="/login" className="underline-offset-2">
            <h6 className="!leading-none">Already a member? Login</h6>
          </Link>
        </div>
        <div className="center-container flex items-center justify-center flex-col sm:flex-row">
          <div className="left-box mb-6" data-aos="zoom-in">
            <h4 className="sm:!text-right font-semibold [text-shadow:12px_12px_8px_rgba(0,0,0,0.8)]">
              Himadri <br /> Boys <br /> Hostel
            </h4>
          </div>
          <div className="mx-8 h-1 sm:h-108 w-108 sm:w-1 bg-white bg-opacity-50 rounded-full"></div>
          <div
            className="right-box flex flex-col items-center mt-6 sm:mt-0 sm:ml-16 text-[#E3F6F5]"
            data-aos="fade-left"
          >
            <h2 className="!leading-none ">Welcome</h2>
            <h6>Please Sign-up to The Platform</h6>
            <form
              className="flex flex-col justify-center gap-4 w-[clamp(12rem,50vw,24rem)] mt-6"
              onSubmit={handleSubmit}
            >
              <input
                value={name}
                type="text"
                placeholder="Name"
                className="px-4 py-2 rounded bg-[#E3F6F5] text-[#272643] focus:outline-none"
                required
                onChange={({ target }) => setName(target.value)}
              />
              <input
                value={email}
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded bg-[#E3F6F5] text-[#272643] focus:outline-none"
                required
                onChange={({ target }) => setEmail(target.value)}
              />
              <input
                value={password}
                type="password"
                placeholder="Password"
                className="px-4 py-2 rounded bg-[#E3F6F5] text-[#272643] focus:outline-none"
                required
                onChange={({ target }) => setPassword(target.value)}
              />
              <div className="flex flex-col items-center mt-16">
              {error && <p className="text-red-500">{error}</p>}
                <div className="w-full flex justify-center">
                  <button
                    type="submit"
                    className="mt-2 w-1/2 bg-[#BAE8E8] py-2 rounded hover:bg-[#2C698D] transition !text-[#272643] cursor-pointer"
                    disabled={isLoading}
                  >
                    <p className="!leading-none !text-[#272643] !m-0 !italic !font-semibold !opacity-100">
                      {isLoading ? "Signing Up..." : "Sign Up"}
                    </p>
                  </button>
                </div>
                <div>
                  <Link
                    to="/login"
                    className="hover:underline underline-offset-2"
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
