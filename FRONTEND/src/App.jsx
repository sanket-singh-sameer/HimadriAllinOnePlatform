import React from "react";
import { useEffect } from "react";
import AOS from "aos";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import OTPv from "./Pages/OTP-v";
import Dashboard from "./Pages/Dashboard";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: true, // whether animation should happen only once
    });
  }, []);

  return (
    <main className="main-container">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/otp-verify" element={<OTPv />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </main>
  );
}

export default App;
