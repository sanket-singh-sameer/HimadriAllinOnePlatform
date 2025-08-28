
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const API_PATHS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  VERIFY_EMAIL: "/auth/verify-email",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
  CHECK_AUTH: "/auth/check-auth",
  EDIT_PROFILE: "/auth/update-profile",
  CHANGE_PASSWORD: "/auth/change-password",

  ADMIN_LOGIN: "/admin/login",
  ADMIN_LOGOUT: "/admin/logout",
  ADMIN_DASHBOARD: "/admin",

  ADD_COMPLAINT: "/complaints/new",
  FETCH_MY_COMPLAINTS: "/complaints/my",
  FETCH_ALL_COMPLAINTS: "/complaints/all",
  UPDATE_COMPLAINT_STATUS: (id) => `/complaints/${id}`,

  ADD_NOTICE: "/notice/create",
  FETCH_TODAYS_MENU: "/messmenu/today",
  FETCH_ALL_NOTICES: "/notice/all",
  DELETE_NOTICE: (noticeId) => `/notice/${noticeId}`,

  FETCH_CGPI_BY_ROLL: (roll) => `/cgpi/${roll}`,
  FETCH_USER_DETAILS: (roll) => `/auth/${roll}`,

  FETCH_TOTAL_COMPLAINTS: "/complaints/stats",
  FETCH_TOTAL_USERS: "/auth/total-user-count"
};
