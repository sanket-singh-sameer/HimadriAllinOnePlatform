import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea]">
      <nav className="flex justify-between items-center px-16 py-8 backdrop-blur-sm bg-white/80 border-b border-gray-200/50 absolute w-full z-20">
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
              <div className="w-3 h-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full transform group-hover:scale-110 transition-transform duration-300 delay-75"></div>
              <div className="w-3 h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full transform group-hover:scale-110 transition-transform duration-300 delay-150"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-gray-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h4 className="!text-2xl !text-left !font-black !text-gray-900 tracking-tight leading-none">
                Himadri
              </h4>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <span className="!text-sm !text-gray-600 !font-medium tracking-wide leading-none">
              Boys Hostel Platform
            </span>
          </div>
        </div>
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/login"
            className="group relative !text-gray-700 hover:!text-white transition-all duration-300 !font-semibold tracking-wide px-6 py-3 rounded-xl overflow-hidden border-2 border-gray-300 hover:border-gray-900"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gray-900 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </Link>
          <Link
            to="/signup"
            className="group relative !bg-gray-900 !text-white hover:!text-gray-900 px-8 py-3 rounded-xl transition-all duration-300 !font-bold tracking-wide overflow-hidden border-2 border-gray-900 hover:border-white"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sign Up
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </Link>
        </div>
      </nav>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      <section className="h-fit flex items-center px-4 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col justify-center h-screen py-12 sm:py-16 md:py-20 mt-12 sm:mt-14 md:mt-16 space-y-12 sm:space-y-14 md:space-y-16">
            <div className="space-y-6 sm:space-y-7 md:space-y-8">
              <h1 className="!text-4xl sm:!text-5xl md:!text-6xl xl:!text-8xl !font-black !leading-[0.8] tracking-[-0.02em] relative !text-left">
                <span className="block !text-gray-900 hover:!text-gray-700 transition-colors duration-500">
                  HIMADRI
                </span>
                <span className="block !text-gray-800 !font-light tracking-[0.3em] !text-2xl sm:!text-3xl md:!text-4xl xl:!text-5xl mt-2">
                  BOYS HOSTEL
                </span>
              </h1>

              <div className="max-w-4xl space-y-4 sm:space-y-5 md:space-y-6">
                <blockquote className="!text-lg sm:!text-xl md:!text-2xl xl:!text-3xl !font-light !text-gray-800 !italic !leading-[1.4] !opacity-100 tracking-wide !text-left">
                  "This is an all-in-one platform created by students, managed
                  by students, and built for every hosteler's life. It brings
                  everything you need into one place—making hostel life simpler,
                  smarter, and more connected."
                </blockquote>
                <p className="!text-base sm:!text-lg md:!text-xl xl:!text-2xl !text-gray-600 !font-medium !opacity-100 !leading-relaxed tracking-wide !text-left">
                  Because who knows hostel struggles better than us? <br /> Made
                  by students, managed by students!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <a
                href="#features-section"
                className="group relative !bg-gray-900 !text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-2xl 
               hover:!bg-gray-800 transition-all duration-500 
               shadow-2xl hover:shadow-3xl !font-bold 
               !text-lg sm:!text-xl tracking-wide transform hover:scale-[1.05] 
               active:scale-[0.95] overflow-hidden text-center sm:text-left"
              >
                <span className="relative z-10 flex items-center justify-center sm:justify-start gap-3">
                  Know More
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <Link
                to="/signup"
                className="group relative border-2 border-gray-400 !text-gray-800 px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-2xl 
               hover:border-gray-600 hover:!bg-gray-50 hover:shadow-2xl 
               transition-all duration-500 !font-bold !text-lg sm:!text-xl tracking-wide 
               transform hover:scale-[1.05] active:scale-[0.95] overflow-hidden
               backdrop-blur-sm bg-white/80 text-center sm:text-left"
              >
                <span className="relative z-10 flex items-center justify-center sm:justify-start gap-3">
                  Join Now
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features-section"
        className="py-24 !bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="!text-5xl !font-black !text-gray-900 !mb-6 !leading-tight tracking-tight">
              Your Hostel Life,
              <span className="block !text-gray-700 !font-light">
                Simplified
              </span>
            </h2>
            <p className="!text-2xl !text-gray-600 !opacity-100 max-w-3xl mx-auto !leading-relaxed">
              Experience the relief of having everything you need in one
              powerful platform
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="!text-2xl !font-bold !text-gray-900 !mb-4 !leading-tight">
                  Complaint Management
                </h3>
                <p className="!text-gray-600 !opacity-100 !leading-relaxed !text-lg mb-4">
                  Submit and track complaints effortlessly. No more running
                  around or waiting in queues.
                </p>
                <div className="flex items-center !text-blue-600 !font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Get instant relief</span>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                    />
                  </svg>
                </div>
                <h3 className="!text-2xl !font-bold !text-gray-900 !mb-4 !leading-tight">
                  Smart Notice Board
                </h3>
                <p className="!text-gray-600 !opacity-100 !leading-relaxed !text-lg mb-4">
                  Never miss important announcements. Get instant notifications
                  for all hostel updates.
                </p>
                <div className="flex items-center !text-green-600 !font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Stay always informed</span>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="!text-2xl !font-bold !text-gray-900 !mb-4 !leading-tight">
                  Digital Mess Menu
                </h3>
                <p className="!text-gray-600 !opacity-100 !leading-relaxed !text-lg mb-4">
                  Check daily menus, meal timings, and special announcements.
                  Plan your day better.
                </p>
                <div className="flex items-center !text-orange-600 !font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Never miss a meal</span>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-50 to-transparent rounded-bl-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="!text-2xl !font-bold !text-gray-900 !mb-4 !leading-tight">
                  Community Connect
                </h3>
                <p className="!text-gray-600 !opacity-100 !leading-relaxed !text-lg mb-4">
                  Connect with fellow hostelers, share experiences, and build
                  lasting friendships.
                </p>
                <div className="flex items-center !text-purple-600 !font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Build connections</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/90"></div>
            <div className="relative z-10">
              <h3 className="!text-3xl !font-bold !text-white !mb-4">
                Ready to Experience the Relief?
              </h3>
              <p className="!text-xl !text-gray-300 !opacity-100 mb-8 max-w-2xl mx-auto">
                Join hundreds of students who've already simplified their hostel
                life
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="!bg-white !text-gray-900 px-8 py-4 rounded-xl hover:!bg-gray-100 transition-all duration-300 !font-semibold !text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Your Journey
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200/20 rounded-full blur-xl"></div>
      </section>

      <footer className="bg-gray-900 py-12 sm:py-16 lg:py-20 relative overflow-hidden border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="relative group cursor-pointer">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                    <div className="w-3 h-6 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full transform group-hover:scale-110 transition-transform duration-300 delay-75"></div>
                    <div className="w-3 h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full transform group-hover:scale-110 transition-transform duration-300 delay-150"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-gray-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <h4 className="!text-2xl !text-left !font-black !text-white tracking-tight leading-none">
                      Himadri
                    </h4>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="!text-sm !text-gray-400 !font-medium tracking-wide leading-none">
                    Boys Hostel Platform
                  </span>
                </div>
              </div>
              <p className="!text-base sm:!text-lg !text-gray-300 !opacity-90 !leading-relaxed mb-6 sm:mb-8 !text-left">
                Making hostel life simpler, smarter, and more connected through
                technology built by students, for students.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="mailto:support@hbh.com"
                  className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="sm:col-span-1">
              <h3 className="underline underline-offset-4 !text-lg sm:!text-xl !font-bold !text-white !mb-4 sm:!mb-6 !leading-tight tracking-wide !text-left">
                Quick Links
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <Link
                  to="/login"
                  className="block !text-gray-300 hover:!text-white transition-colors duration-200 !font-medium text-base"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block !text-gray-300 hover:!text-white transition-colors duration-200 !font-medium text-base"
                >
                  Sign Up
                </Link>
                <Link
                  to="/reset-password"
                  className="block !text-gray-300 hover:!text-white transition-colors duration-200 !font-medium text-base"
                >
                  Reset Password
                </Link>
                <Link
                  to="/dashboard"
                  className="block !text-gray-300 hover:!text-white transition-colors duration-200 !font-medium text-base"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="sm:col-span-1">
              <h3 className="underline underline-offset-4 !text-lg sm:!text-xl !font-bold !text-white !mb-4 sm:!mb-6 !leading-tight tracking-wide !text-left">
                Resources
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block !text-gray-300 hover:!text-white transition-colors duration-200 !font-medium text-base"
                >
                  Source Code
                </a>
                <a
                  href="#"
                  className="block !text-gray-300 hover:!text-white transition-colors duration-200 !font-medium text-base"
                >
                  Documentation
                </a>
                <a
                  href="#"
                  className="block !text-gray-300 hover:!text-white transition-colors duration-200 !font-medium text-base"
                >
                  Support
                </a>
                <a
                  href="#"
                  className="block !text-gray-300 hover:!text-white transition-colors duration-200 !font-medium text-base"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 sm:pt-10 lg:pt-12 mb-8 sm:mb-10">
            <div className="max-w-full px-4 sm:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                {/* Left Side - Content */}
                <div className="text-left">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="!text-3xl !font-bold !text-white !text-left">
                      Built with Passion by Students
                    </h3>
                  </div>
                  <p className="!text-lg !text-gray-300 !opacity-100 !leading-relaxed mb-8 !text-left">
                    This platform was designed, developed, and maintained by
                    students who understand the real challenges of hostel life.
                    Every feature is crafted with genuine student experiences in
                    mind.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="!text-green-400 !font-semibold">
                      Active Development
                    </span>
                  </div>
                </div>

                <div className="relative mt-8 lg:mt-0">
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-6 sm:p-8 border border-gray-700/50 backdrop-blur-sm">
                    <h4 className="!text-lg sm:!text-xl !font-bold !text-white !mb-4 sm:!mb-6 text-center">
                      Tech Stack
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="group bg-gray-800/60 hover:bg-gray-700/60 rounded-xl p-4 transition-all duration-300 border border-gray-600/30 hover:border-blue-500/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              R
                            </span>
                          </div>
                          <span className="!text-gray-300 !font-semibold">
                            React.js
                          </span>
                        </div>
                      </div>
                      <div className="group bg-gray-800/60 hover:bg-gray-700/60 rounded-xl p-4 transition-all duration-300 border border-gray-600/30 hover:border-green-500/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              N
                            </span>
                          </div>
                          <span className="!text-gray-300 !font-semibold">
                            Node.js
                          </span>
                        </div>
                      </div>
                      <div className="group bg-gray-800/60 hover:bg-gray-700/60 rounded-xl p-4 transition-all duration-300 border border-gray-600/30 hover:border-green-600/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              M
                            </span>
                          </div>
                          <span className="!text-gray-300 !font-semibold">
                            MongoDB
                          </span>
                        </div>
                      </div>
                      <div className="group bg-gray-800/60 hover:bg-gray-700/60 rounded-xl p-4 transition-all duration-300 border border-gray-600/30 hover:border-cyan-500/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              T
                            </span>
                          </div>
                          <span className="!text-gray-300 !font-semibold">
                            Tailwind
                          </span>
                        </div>
                      </div>
                      <div className="group bg-gray-800/60 hover:bg-gray-700/60 rounded-xl p-4 transition-all duration-300 border border-gray-600/30 hover:border-yellow-500/50 sm:col-span-2">
                        <div className="flex items-center sm:justify-center gap-3">
                          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              E
                            </span>
                          </div>
                          <span className="!text-gray-300 !font-semibold">
                            Express.js
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <p className="!text-gray-400 text-center sm:text-left text-sm !font-light tracking-wider order-2 sm:order-1">
              &copy; 2025 Himadri Boys Hostel Platform. All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6 order-1 sm:order-2">
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="!text-gray-400 hover:!text-white transition-colors duration-300 text-sm font-medium"
              >
                View on GitHub
              </a>
              <span className="!text-gray-700 hidden sm:inline">•</span>
              <span className="!text-gray-400 text-sm font-medium">
                Made in 509 🇮🇳
              </span>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-gray-800/10 to-transparent blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-full bg-gradient-to-l from-gray-800/10 to-transparent blur-3xl -z-10  "></div>
      </footer>
    </div>
  );
}
