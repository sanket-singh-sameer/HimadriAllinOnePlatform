import { create } from "zustand";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";

const PENDING_SIGNUP_EMAIL_KEY = "pendingSignupEmail";

const getPendingSignupEmail = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.sessionStorage.getItem(PENDING_SIGNUP_EMAIL_KEY) || "";
};

const setPendingSignupEmail = (email) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(PENDING_SIGNUP_EMAIL_KEY, email);
};

const clearPendingSignupEmail = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(PENDING_SIGNUP_EMAIL_KEY);
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_PATHS.SIGNUP, {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        setPendingSignupEmail(email);
        set({
          user: response.data.user,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Signup failed",
        isLoading: false,
      });
      console.error("Signup failed:", error.response?.data?.message || error.message);
      throw error;
    }
  },

  verifyOtp: async (otp) => {
    set({ isLoading: true, error: null });
    try {
      const email = getPendingSignupEmail();
      if (!email) {
        set({
          error: "Pending signup email is missing. Please sign up again.",
          isLoading: false,
        });
        return;
      }
      const response = await axiosInstance.post(API_PATHS.VERIFY_EMAIL, {
        email,
        otp,
      });
      if (response.status === 200) {
        clearPendingSignupEmail();
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "OTP verification failed",
        isLoading: false,
      });
      console.error("OTP verification failed:", error.response?.data?.message || error.message);
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
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      console.error("Login failed:", error.response?.data?.message || error.message);
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
      console.error("Authentication check failed:", error.response?.data?.message || error.message);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_PATHS.LOGOUT);
      if (response.status === 200) {
        clearPendingSignupEmail();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Logout failed",
        isLoading: false,
      });
      console.error("Logout failed:", error.response?.data?.message || error.message);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_PATHS.FORGOT_PASSWORD, {
        email,
      });
      if (response.status === 200) {
        set({
          isLoading: false,
          error: null,
        });
        return response.data;
      }
      return null;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send reset email";
      set({
        error: message,
        isLoading: false,
      });
      console.error("Forgot password failed:", message);
      return null;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_PATHS.RESET_PASSWORD(token), {
        newPassword: password,
      });
      if (response.status === 200) {
        set({
          isLoading: false,
          error: null,
        });
        return response.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to reset password",
        isLoading: false,
      });
      console.error("Reset password failed:", error.response?.data?.message || error.message);
      throw error;
    }
  },
}));