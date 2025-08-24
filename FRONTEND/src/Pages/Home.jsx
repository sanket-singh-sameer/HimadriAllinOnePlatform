import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea]">
      <nav className="flex justify-between items-center px-16 py-8 backdrop-blur-sm bg-white/80 border-b border-gray-200/50 absolute w-full z-20">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-xl flex items-center justify-center shadow-xl border border-gray-600/20">
              <h4 className="!text-white !font-black !text-xl tracking-wider transform hover:scale-110 transition-transform duration-300">
                H
              </h4>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="!text-2xl !text-left !font-black !text-gray-900 tracking-tight leading-none hover:!text-gray-700 transition-colors duration-300">
              HBH
            </h4>
            <span className="!text-xs !text-gray-600 !font-semibold tracking-wider leading-none uppercase">
              Himadri Boys Hostel
            </span>
          </div>
        </div>
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/login"
            className="!text-gray-700 hover:!text-gray-900 transition-all duration-200 !font-medium tracking-wide hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="!bg-gray-900 !text-white px-6 py-3 rounded-xl hover:!bg-gray-700 transition-all duration-300 !font-semibold tracking-wide shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      <section className="h-fit flex items-center px-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col justify-center h-screen py-20 mt-20 space-y-16">
            <div className="space-y-8">
              <h1 className="!text-6xl xl:!text-8xl !font-black !leading-[0.8] tracking-[-0.02em] relative !text-left">
                <span className="block !text-gray-900 hover:!text-gray-700 transition-colors duration-500">
                  HIMADRI
                </span>
                <span className="block !text-gray-800 !font-light tracking-[0.3em] !text-4xl xl:!text-5xl mt-2">
                  BOYS HOSTEL
                </span>
              </h1>

              <div className="max-w-4xl space-y-6">
                <blockquote className="!text-2xl xl:!text-3xl !font-light !text-gray-800 !italic !leading-[1.4] !opacity-100 tracking-wide !text-left">
                  "This is an all-in-one platform created by students, managed
                  by students, and built for every hosteler's life. It brings
                  everything you need into one place—making hostel life simpler,
                  smarter, and more connected."
                </blockquote>
                <p className="!text-xl xl:!text-2xl !text-gray-600 !font-medium !opacity-100 !leading-relaxed tracking-wide !text-left">
                  Because who knows hostel struggles better than us? Made by
                  students, managed by students!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#features-section"
                className="!bg-gray-900 !text-white px-10 py-4 rounded-xl 
               hover:!bg-gray-700 transition-all duration-300 
               shadow-xl hover:shadow-2xl !font-semibold 
               !text-lg tracking-wide transform hover:scale-[1.02] 
               active:scale-[0.98]"
              >
                Know More
              </a>

              <Link
                to="/signup"
                className="border-2 border-gray-300 !text-gray-700 px-10 py-4 rounded-xl hover:border-gray-500 hover:bg-white hover:shadow-xl transition-all duration-300 !font-semibold !text-lg tracking-wide transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Join Now
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

      <footer className="bg-gray-900 py-20 relative overflow-hidden border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <div className="lg:col-span-2 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                  <h4 className="!text-gray-900 !font-bold !text-xl tracking-wider">
                    H
                  </h4>
                </div>
                <div className="flex flex-col">
                  <h4 className="!text-3xl !text-left !font-extrabold !text-white tracking-tight leading-none">
                    HBH
                  </h4>
                  <span className="!text-sm !text-gray-400 !font-medium tracking-wide leading-none">
                    Himadri Boys Hostel
                  </span>
                </div>
              </div>
              <p className="!text-lg !text-gray-300 !opacity-90 !leading-relaxed mb-8 !text-left">
                Making hostel life simpler, smarter, and more connected through
                technology built by students, for students.
              </p>
              <div className="flex space-x-4">
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

            <div className="md:col-span-1">
              <h3 className="underline underline-offset-4 !text-xl !font-bold !text-white !mb-6 !leading-tight tracking-wide !text-left">
                Quick Links
              </h3>
              <div className="space-y-4">
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

            <div className="md:col-span-1">
              <h3 className="underline underline-offset-4 !text-xl !font-bold !text-white !mb-6 !leading-tight tracking-wide !text-left">
                Resources
              </h3>
              <div className="space-y-4">
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

          <div className="border-t border-gray-800 pt-12 mb-10">
            <div className="text-center">
              <h3 className="!text-2xl !font-bold !text-white !mb-4">
                Built with Passion by Students
              </h3>
              <p className="!text-gray-400 !opacity-100 !leading-relaxed max-w-3xl mx-auto mb-8">
                This platform was designed, developed, and maintained by
                students who understand the real challenges of hostel life.
                Every feature is crafted with genuine student experiences in
                mind.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm">
                <span className="font-medium !text-gray-400">React.js</span>
                <span className="!text-gray-600">•</span>
                <span className="font-medium !text-gray-400">Node.js</span>
                <span className="!text-gray-600">•</span>
                <span className="font-medium !text-gray-400">MongoDB</span>
                <span className="!text-gray-600">•</span>
                <span className="font-medium !text-gray-400">Tailwind CSS</span>
                <span className="!text-gray-600">•</span>
                <span className="font-medium !text-gray-400">Express.js</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="!text-gray-500 !opacity-100 text-center md:text-left mb-4 md:mb-0 text-sm">
              &copy; 2024 Himadri Boys Hostel Platform. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="!text-gray-400 hover:!text-white transition-colors duration-300 text-sm font-medium"
              >
                View on GitHub
              </a>
              <span className="!text-gray-700">•</span>
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
