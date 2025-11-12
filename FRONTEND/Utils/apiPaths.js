
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
  FETCH_TOTAL_USERS: "/auth/total-user-count",

  // unavailabe as of now
  // GET_MY_SNACKS_PREFERENCE: "/mess/my-snacks",
  // UPDATE_MY_SNACKS_PREFERENCE: "/mess/my-snacks",
  
  CHECK_SNACKS_BY_ROLL: (roll) => `/mess/snacks/${roll}`,
  ADD_TO_SNACKS_LIST: (roll) => `/mess/snacks/${roll}/true`,
  REMOVE_FROM_SNACKS_LIST: (roll) => `/mess/snacks/${roll}/false`,
  UPDATE_SNACKS_STATUS: (roll) => `/mess/snacks/${roll}/update-status`,

  // Outpass Management
  SUBMIT_OUTPASS: "/id/outpass/submit",
  GET_MY_OUTPASSES: "/id/outpass/my",
  GET_ALL_OUTPASSES: "/id/outpass/all",
  UPDATE_OUTPASS_STATUS: (id) => `/id/outpass/${id}/status`,

  // Mess Attendance
  MARK_MESS_ATTENDANCE: (roll) => `/id/mess-attendance/${roll}`,
  EXPORT_MESS_ATTENDANCE: "/id/mess-attendance/export",

  // Guard Outpass Verification
  GUARD_VERIFY_OUTPASS: (roll) => `/id/guard/verify-outpass/${roll}`,
};
