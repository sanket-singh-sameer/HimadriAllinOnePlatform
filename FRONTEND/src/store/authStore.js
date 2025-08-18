import { create } from "zustand";
import axios from "axios";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import Login from "../Pages/Login";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  signup: async (name, email, password) => {
    try {
      const response = await axiosInstance.post(API_PATHS.SIGNUP, {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response.data.message || "Signup failed",
        isLoading: false,
      });
      console.error("Signup failed:", error);
      throw error;
    }
  },

  verifyOtp: async (otp) => {
    try {
      const response = await axiosInstance.post(API_PATHS.VERIFY_EMAIL, { otp });
      if (response.status === 200) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response.data.message || "OTP verification failed",
        isLoading: false,
      });
      console.error("OTP verification failed:", error);
      throw error;
    }
  },
  Login: async (email, password) => {
    try {
      const response = await axiosInstance.post(API_PATHS.LOGIN, {
        email,
        password,
      });
      if (response.status === 200) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response.data.message || "Login failed",
        isLoading: false,
      });
      console.error("Login failed:", error);
      throw error;
    }
  },
}));
