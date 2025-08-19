import { create } from "zustand";
import axios from "axios";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
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
          error: null,
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
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_PATHS.VERIFY_EMAIL, {
        otp,
      });
      if (response.status === 200) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
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
  login: async (email, password) => {
    set({ isLoading: true, error: null });
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
          error: null,
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

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axiosInstance.get(API_PATHS.CHECK_AUTH);
      if (response.status === 200) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      }
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
      console.error("Authentication check failed:", error);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_PATHS.LOGOUT);
      if (response.status === 200) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        error: error.response.data.message || "Logout failed",
        isLoading: false,
      });
      console.error("Logout failed:", error);
      throw error;
    }
  },
}));
