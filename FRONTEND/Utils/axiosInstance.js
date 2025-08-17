import { API_BASE_URL } from "./apiPaths";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any request interceptors here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized access - redirecting to Landing Page...");
        window.location.href = "/";
      } else if (error.response.status === 403) {
        console.error("Forbidden access - redirecting to Landing Page...");
        window.location.href = "/";
      } else if (error.response.status === 404) {
        console.error("Resource not found - redirecting to Landing Page...");
        window.location.href = "/";
      } else if (error.response.status >= 500) {
        console.error("Server error - redirecting to Landing Page...");
        window.location.href = "/";
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout - redirecting to Landing Page...");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
