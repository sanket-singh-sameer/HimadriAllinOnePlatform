export const API_BASE_URL = "http://localhost:8080/api/v1";


export const API_PATHS = {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    VERIFY_EMAIL: "/auth/verify-email",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
    CHECK_AUTH: "/auth/check-auth",


    ADMIN_LOGIN: "/admin/login",
    ADMIN_LOGOUT: "/admin/logout",
    ADMIN_DASHBOARD: "/admin",

    ADD_COMPLAINT: "/complaints",


    FETCH_TODAYS_MENU: "/messmenu/today",
    FETCH_ALL_NOTICES: "/notice/all",
};
