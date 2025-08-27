import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged In Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed");
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea] flex flex-col md:flex-row overflow-hidden">
        <Link
          to="/signup"
          className="absolute top-6 right-8 text-gray-700 px-5 py-2 rounded transition hover:underline underline-offset-2 hidden md:block z-10"
          data-aos="fade-left"
        >
          <h6 className="!leading-none text-sm">New member? Signup</h6>
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
            “This is an all-in-one platform created by students, managed by
            students, and built for every hosteler’s life. It brings everything
            you need into one place—making hostel life simpler, smarter, and
            more connected.”
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
            Get Started
          </h2>
          <h6 className="text-gray-600 italic">Log in and take charge</h6>

          <form
            className="flex flex-col gap-4 w-full max-w-sm mt-8"
            onSubmit={handleSubmit}
          >
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
              className="mt-4 bg-gray-900 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition shadow-md cursor-pointer "
            >
              <p className="!leading-none !m-0 !italic !font-semibold">
                {isLoading ? "Logging in..." : "Log In"}
              </p>
            </button>
            <div className="flex flex-col gap-3">
              <Link
                to="/reset-password"
                className="text-sm text-gray-600 hover:underline ml-auto"
              >
                <h6 className="!leading-none">Lost your password? Reset Now</h6>
              </Link>
              <Link
                to="/signup"
                className="text-sm text-gray-600 hover:underline ml-auto block md:hidden"
              >
                <h6 className="!leading-none">New member? Signup</h6>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
