import React from "react";
import { useEffect } from "react";
import AOS from "aos";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Home from "./Pages/Home";
import OTPv from "./Pages/OTP-v";
import Dashboard from "./Pages/Dashboard";
import Admin from "./Pages/Admin";
import { useAuthStore } from "./store/authStore";
import { FullPageLoader } from "./Components/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user?.isVerified) {
    return <Navigate to="/login" replace />;
  }
  if (
    (user?.role === "admin" || user?.role === "super-admin") &&
    window.location.pathname === "/dashboard"
  ) {
    return <Navigate to="/admin" replace />;
  }
  if (
    (user?.role === "user" || user?.role === "student") &&
    window.location.pathname === "/admin"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user?.isVerified) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role === "student") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    if (user?.role === "admin" || user?.role === "super-admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  if (isCheckingAuth) {
    return <FullPageLoader />;
  }

  return (
    <main className="main-container">
      <Routes>
        <Route
          path="/"
          element={
            <RedirectAuthenticatedUser>
              <Home />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/otp-verify" element={<OTPv />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

export default App;
