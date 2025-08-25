import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { API_PATHS } from "../../Utils/apiPaths";
import axiosInstance from "../../Utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, isLoading, error, user } = useAuthStore();
  const [formLoading, setFormLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allNotices, setAllNotices] = useState([]);

  const [formError, setFormError] = useState(null);
  const [todaysMenu, setTodaysMenu] = useState(null);
  const [myComplaints, setMyComplaints] = useState(null);
  const [activeFeature, setActiveFeature] = useState("complaints");
  const [complaintForm, setComplaintForm] = useState({
    name: user.name || "",
    room: user.room || "",
    title: "",
    category: "",
    photo: null,
    description: "",
  });
  const [editProfileForm, setEditProfileForm] = useState({
    name: user.name || "",
    room: user.room || "",
    phone: user.phone || "",
  });

  const fetchTodaysMenu = async () => {
    try {
      const todaysMenu = await axiosInstance.get(API_PATHS.FETCH_TODAYS_MENU);
      setTodaysMenu(todaysMenu.data);
    } catch (error) {
      console.error("Error fetching today's menu:", error);
    }
  };

  const fetchAllNotices = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.FETCH_ALL_NOTICES);
      setAllNotices(response.data.notices);
    } catch (error) {
      console.error("Error fetching all notices:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setComplaintForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddComplaint = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const complaintData = {
        user: user._id,
        name: complaintForm.name,
        room: complaintForm.room,
        title: complaintForm.title,
        category: complaintForm.category,
        photo: complaintForm.photo,
        description: complaintForm.description,
      };
      console.log("Complaint Data:", complaintData);
      const response = await axiosInstance.post(
        API_PATHS.ADD_COMPLAINT,
        complaintData
      );
      console.log("Complaint Response:", response);
      if (response.status === 201) {
        setComplaintForm({
          name: user.name || "",
          room: user.room || "",
          title: "",
          date: "",
          category: "",
          photo: null,
          description: "",
        });
      }
      setFormLoading(false);
      setFormError(null);
      fetchMyComplaint();
    } catch (error) {
      console.error("Error registering complaint:", error);
      setFormLoading(false);
      setFormError(
        error.response.data.message ||
          "An error occurred while registering the complaint."
      );
    }
  };

  const fetchMyComplaint = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.FETCH_MY_COMPLAINTS);
      setMyComplaints(response.data.complaints);
      console.log("My Complaints:", response.data.complaints);
    } catch (error) {
      console.error("Error fetching my complaints:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.CHECK_AUTH);
      if (response.status === 200) {
        useAuthStore.setState({ user: response.data.user });
      }
      console.log("User Data:", response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        API_PATHS.EDIT_PROFILE,
        editProfileForm
      );
      if (response.status === 200) {
        console.log("Profile updated:", response.data);
      }
      setIsOpen(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    fetchTodaysMenu();
    fetchMyComplaint();
    fetchAllNotices();
  }, []);

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea]">
        <main className="flex-1 flex flex-col">
          <nav className="sticky top-0 z-20 flex justify-between items-center px-4 sm:px-8 lg:px-16 py-4 sm:py-6 lg:py-8 backdrop-blur-sm bg-white/90 border-b border-gray-200/50 w-full shadow-sm">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="relative group cursor-pointer">
                <div className="flex items-center space-x-1">
                  <div className="w-2 sm:w-3 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="w-2 sm:w-3 h-4 sm:h-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full transform group-hover:scale-110 transition-transform duration-300 delay-75"></div>
                  <div className="w-2 sm:w-3 h-7 sm:h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full transform group-hover:scale-110 transition-transform duration-300 delay-150"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-gray-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <h4 className="!text-lg sm:!text-xl lg:!text-2xl !text-left !font-black !text-gray-900 tracking-tight leading-none">
                    <span className="hidden sm:inline">Himadri Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                  </h4>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <span className="!text-xs sm:!text-sm !text-gray-600 !font-medium tracking-wide leading-none">
                  <span className="hidden sm:inline">
                    Welcome back, {user.name}
                  </span>
                  <span className="sm:hidden">Hi, {user.name}</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4 items-center">
              {user.role !== "student" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="group relative !text-gray-700 hover:!text-white transition-all duration-300 !font-semibold tracking-wide px-4 lg:px-6 py-2 lg:py-3 rounded-xl overflow-hidden border-2 border-gray-300 hover:border-gray-900"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="hidden lg:inline">Admin Panel</span>
                    <span className="lg:hidden">Admin</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gray-900 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="cursor-pointer group relative !bg-gray-900 !text-white hover:!text-gray-900 px-4 lg:px-8 py-2 lg:py-3 rounded-xl transition-all duration-300 !font-bold tracking-wide overflow-hidden border-2 border-gray-900 hover:border-white"
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? "..." : "Logout"}
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white/80 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200/50 backdrop-blur-sm transition-all duration-200"
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-6 h-6 flex flex-col items-center justify-center">
                  <span
                    className={`block absolute h-0.5 w-5 bg-gray-700 transform transition-all duration-300 ease-in-out ${
                      mobileMenuOpen
                        ? "rotate-45 translate-y-0"
                        : "-translate-y-1.5"
                    }`}
                  />
                  <span
                    className={`block absolute h-0.5 w-5 bg-gray-700 transform transition-all duration-300 ease-in-out ${
                      mobileMenuOpen
                        ? "opacity-0 scale-0"
                        : "opacity-100 scale-100"
                    }`}
                  />
                  <span
                    className={`block absolute h-0.5 w-5 bg-gray-700 transform transition-all duration-300 ease-in-out ${
                      mobileMenuOpen
                        ? "-rotate-45 translate-y-0"
                        : "translate-y-1.5"
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
              className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-xl transform transition-all duration-300 ease-in-out z-30 ${
                mobileMenuOpen
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-4 invisible"
              }`}
            >
              <div className="px-4 py-6 space-y-4">
                {user.role !== "student" && (
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full group relative !text-gray-700 hover:!text-white transition-all duration-300 !font-semibold tracking-wide px-6 py-4 rounded-xl overflow-hidden border-2 border-gray-300 hover:border-gray-900 flex items-center justify-center gap-2"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Admin Panel
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gray-900 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full group relative !bg-gray-900 !text-white hover:!text-gray-900 px-8 py-4 rounded-xl transition-all duration-300 !font-bold tracking-wide overflow-hidden border-2 border-gray-900 hover:border-white flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? "Logging out..." : "Logout"}
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                </button>
              </div>
            </div>
          </nav>

          <div className="p-4 sm:p-6 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 flex-1">
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 md:p-8 border border-gray-100 hover:border-gray-200 flex flex-col relative overflow-hidden">
              {/* Decorative background gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gray-50 to-transparent rounded-tr-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="!text-xl sm:!text-2xl md:!text-3xl !font-black !text-gray-900 tracking-tight">
                      Profile
                    </h3>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-gray-500/20 rounded-full blur-md group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                    <span className="relative inline-block px-2 py-1 sm:px-4 sm:py-2 !text-xs sm:!text-sm !font-bold !tracking-wide bg-gradient-to-r from-gray-50 to-gray-100 !text-gray-700 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 uppercase">
                      {user.role || "Boarder"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center mb-6 sm:mb-8">
                  <div className="relative group/avatar">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-0 group-hover/avatar:opacity-30 transition-opacity duration-500"></div>
                    <img
                      src={
                        user.profilePicture
                          ? user.profilePicture
                          : "https://static.vecteezy.com/system/resources/thumbnails/020/911/740/small_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                      }
                      alt="Profile Picture"
                      className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl object-cover group-hover/avatar:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 sm:border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center mt-4 sm:mt-6">
                    <h4 className="!text-lg sm:!text-xl md:!text-2xl !font-bold !text-gray-900 !leading-tight mb-2">
                      {user.name}
                    </h4>
                    <p className="!text-xs sm:!text-sm !text-gray-500 !font-medium tracking-wide uppercase">
                      {user.roll}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 text-gray-700 flex-1">
                  <div className="group/item flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-blue-50 hover:to-blue-50/50 transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200 flex-shrink-0">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <span className="!font-semibold !text-gray-900 text-sm sm:text-base flex-shrink-0">
                        Phone
                      </span>
                    </div>
                    <span className="!text-gray-600 !font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[120px] text-right">
                      {user.phone || "N/A"}
                    </span>
                  </div>

                  <div className="group/item flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-purple-50 hover:to-purple-50/50 transition-all duration-300 border border-gray-100 hover:border-purple-200">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200 flex-shrink-0">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="!font-semibold !text-gray-900 text-sm sm:text-base flex-shrink-0">
                        Email
                      </span>
                    </div>
                    <span className="!text-gray-600 !font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[180px] text-right">
                      {user.email}
                    </span>
                  </div>

                  <div className="group/item flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-green-50 hover:to-green-50/50 transition-all duration-300 border border-gray-100 hover:border-green-200">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <span className="!font-semibold !text-gray-900 text-sm sm:text-base">
                        Room No
                      </span>
                    </div>
                    <span className="!text-gray-600 !font-medium text-sm sm:text-base">
                      {user.room || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-6 sm:mt-8">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full group relative !bg-gray-900 !text-white hover:!text-gray-900 px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all duration-300 !font-bold tracking-wide overflow-hidden border-2 border-gray-900 hover:border-white flex items-center justify-center gap-2"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile
                    </span>
                    <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  </button>

                  {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10 relative transition-all">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl"
                        >
                          ✕
                        </button>

                        <h3 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">
                          Edit Profile
                        </h3>

                        <form
                          onSubmit={handleEditProfile}
                          className="space-y-6"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              value={editProfileForm.name}
                              type="text"
                              name="name"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
                              placeholder="Enter Your Name"
                              onChange={handleEditFormChange}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              value={editProfileForm.phone}
                              type="tel"
                              name="phone"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
                              placeholder="Enter Your Phone Number (+91 9876543210)"
                              onChange={handleEditFormChange}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Room No
                            </label>
                            <input
                              value={editProfileForm.room}
                              type="number"
                              name="room"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
                              placeholder="Enter Your Room Number"
                              onChange={handleEditFormChange}
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-gray-900 py-3.5 rounded-xl hover:bg-gray-700 shadow-lg cursor-pointer transition"
                          >
                            <p className="!m-0 !leading-none !text-lg !text-white !font-semibold !italic !opacity-100 ">
                              Save Changes
                            </p>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-100 hover:border-gray-200 lg:col-span-2 flex flex-col relative overflow-hidden">
              {/* Decorative background gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-3xl"></div>

              <div className="relative z-10">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                    <h3 className="!text-xl sm:!text-2xl md:!text-3xl !font-black !text-gray-900 tracking-tight">
                      Notice Board
                    </h3>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-md group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                    <span className="relative inline-block px-2 py-1 sm:px-3 sm:py-1 !text-xs sm:!text-sm !font-bold !tracking-wide bg-gradient-to-r from-green-50 to-blue-50 !text-green-700 rounded-full border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 uppercase">
                      Live
                    </span>
                  </div>
                </div>

                {/* Notice List Container */}
                <ul className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base max-h-[350px] sm:max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <ul className="space-y-3 sm:space-y-4">
                    {allNotices.map(
                      (notice, idx) =>
                        idx < 10 && (
                          <li
                            key={notice._id}
                            className="group/notice bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-green-50 hover:to-blue-50/50 rounded-2xl border border-gray-200 hover:border-green-200 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                          >
                            {/* Notice decorative elements */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-100/30 to-transparent rounded-bl-2xl opacity-0 group-hover/notice:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative z-10">
                              <div className="mb-3">
                                <p className="!text-lg sm:!text-xl md:!text-2xl !font-bold !text-gray-900 !text-left !leading-tight">
                                  {notice.title}
                                </p>
                              </div>

                              <p className="!text-gray-500 !text-xs sm:!text-sm !leading-relaxed !text-left !opacity-100 mb-3 flex items-center gap-2 font-medium">
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                                {new Date(notice.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>

                              <p className="!text-gray-700 !text-sm sm:!text-base !leading-relaxed !text-left !opacity-100 mb-4 font-normal">
                                {notice.description}
                              </p>

                              <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                                <p className="!text-gray-700 !text-sm sm:!text-base !leading-relaxed !font-semibold">
                                  {notice.author}
                                </p>
                              </div>
                            </div>
                          </li>
                        )
                    )}
                  </ul>
                </ul>
              </div>
            </div>

            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-100 hover:border-gray-200 lg:col-span-3 flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="!text-xl sm:!text-2xl md:!text-3xl !font-black !text-gray-900 tracking-tight">
                    Features
                  </h3>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-md group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                  <span className="relative inline-block px-2 py-1 sm:px-3 sm:py-1 !text-xs sm:!text-sm !font-bold !tracking-wide bg-gradient-to-r from-purple-50 to-pink-50 !text-purple-700 rounded-full border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 uppercase">
                    Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <div className="flex flex-col space-y-2 sm:space-y-3 lg:space-y-4 mt-2 sm:mt-4 lg:mt-6">
                  <button
                    onClick={() => setActiveFeature("complaints")}
                    className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${
                      activeFeature === "complaints"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    Register a Complaint
                  </button>
                  <button
                    onClick={() => setActiveFeature("mess")}
                    className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${
                      activeFeature === "mess"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    Today's Mess Menu
                  </button>
                </div>

                <div className="lg:col-span-3 bg-gray-50 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-100 p-2 sm:p-3 md:p-4 lg:p-6 shadow-inner">
                  {activeFeature === "complaints" && (
                    <div className="w-full bg-white rounded-lg sm:rounded-xl lg:rounded-2xl xl:rounded-3xl shadow-md border border-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 max-w-4xl mx-auto">
                      <h3 className="!text-xl sm:!text-2xl lg:!text-3xl xl:!text-4xl !font-semibold text-gray-900 text-center mb-4 sm:mb-6 lg:mb-8">
                        Complaint Register
                      </h3>

                      <form
                        className="space-y-4 sm:space-y-5"
                        onSubmit={handleAddComplaint}
                      >
                        <div>
                          <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                            Name
                          </label>
                          <input
                            name="name"
                            value={complaintForm.name}
                            readOnly
                            type="text"
                            className="w-full rounded-lg sm:rounded-xl border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                            Room No.
                          </label>
                          <input
                            name="room"
                            value={complaintForm.room}
                            onChange={handleFormDataChange}
                            type="text"
                            className="w-full rounded-lg sm:rounded-xl border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base"
                            placeholder="Enter Your Room Number"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                            Type
                          </label>
                          <select
                            name="category"
                            value={complaintForm.category}
                            onChange={handleFormDataChange}
                            className="w-full rounded-lg sm:rounded-xl border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base"
                          >
                            <option value="">Select category</option>
                            <option value="Mess-Related">Mess-Related</option>
                            <option value="Water-Related">Water-Related</option>
                            <option value="Bathroom-Related">
                              Bathroom-Related
                            </option>
                            <option value="Electricity-Related">
                              Electricity-Related
                            </option>
                            <option value="Internet-Related">
                              Internet-Related
                            </option>
                            <option value="Floor-Related">Floor-Related</option>
                            <option value="Elevator-Related">
                              Elevator-Related
                            </option>
                            <option value="Furniture-Related">
                              Furniture-Related
                            </option>
                            <option value="Security-Related">
                              Security-Related
                            </option>
                            <option value="Others">Others</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                            Short Description
                          </label>
                          <input
                            name="title"
                            value={complaintForm.title}
                            onChange={handleFormDataChange}
                            type="text"
                            className="w-full rounded-lg sm:rounded-xl border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base"
                            placeholder="Describe The Issue In One Line..."
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={complaintForm.description}
                            onChange={handleFormDataChange}
                            rows="3"
                            className="w-full rounded-lg sm:rounded-xl border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base"
                            placeholder="Describe The Issue In Detail..."
                          ></textarea>
                        </div>
                        <p className="text-red-700 !italic text-sm sm:text-base">
                          {formError}
                        </p>

                        <button
                          type="submit"
                          className="w-full cursor-pointer bg-gray-900 text-white font-medium sm:font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base hover:bg-gray-800 transition-colors duration-200"
                        >
                          {formLoading
                            ? "Adding Complaint..."
                            : "Add Complaint"}
                        </button>
                      </form>

                      <div className="relative my-8 sm:my-10">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center mb-6">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative bg-white px-4">
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                              Your Complaints
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full border-collapse text-left text-gray-700 text-sm sm:text-base">
                            <thead>
                              <tr className="bg-gray-100 text-gray-900 font-semibold">
                                <th className="p-3 sm:p-4">Serial No</th>
                                <th className="p-3 sm:p-4">Room</th>
                                <th className="p-3 sm:p-4">Category</th>
                                <th className="p-3 sm:p-4">Dated On</th>
                                <th className="p-3 sm:p-4">
                                  Short Description
                                </th>
                                <th className="p-3 sm:p-4">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {myComplaints?.map((complaint, index) => (
                                <tr
                                  key={index}
                                  className="border-b hover:bg-gray-50 transition-colors"
                                >
                                  <td className="p-3 sm:p-4 font-medium text-gray-900">
                                    {index + 1}
                                  </td>
                                  <td className="p-3 sm:p-4">
                                    {complaint?.room || "N/A"}
                                  </td>
                                  <td className="p-3 sm:p-4">
                                    {complaint?.category || "N/A"}
                                  </td>
                                  <td className="p-3 sm:p-4">
                                    {complaint?.date || "N/A"}
                                  </td>
                                  <td className="p-3 sm:p-4">
                                    {complaint?.title || "N/A"}
                                  </td>
                                  <td className={`p-3 sm:p-4  ${
                                      complaint.status === "Resolved"
                                        ? "bg-green-100 text-green-700"
                                        : complaint.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : complaint.status === "Rejected"
                                        ? "bg-red-100 text-red-700"
                                        : complaint.status === "Under-Progress"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}>
                                    {complaint?.status || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="sm:hidden space-y-4 p-3">
                          {myComplaints?.map((complaint, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                              {/* Header Strip */}
                              <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold">
                                    #{index + 1}
                                  </span>
                                  <span className="text-sm opacity-90">
                                    Complaint
                                  </span>
                                </div>
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded ${
                                    complaint?.status === "Resolved"
                                      ? "bg-green-500 text-white"
                                      : complaint?.status === "In Progress"
                                      ? "bg-yellow-500 text-black"
                                      : "bg-gray-500 text-white"
                                  }`}
                                >
                                  {complaint?.status || "Pending"}
                                </span>
                              </div>

                              {/* Content */}
                              <div className="p-4 space-y-4">
                                {/* Quick Info Row */}
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                                      Room
                                    </span>
                                    <p className="text-xl font-bold text-gray-900">
                                      {complaint?.room || "N/A"}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                                      Date
                                    </span>
                                    <p className="text-sm font-medium text-gray-700">
                                      {complaint?.date || "N/A"}
                                    </p>
                                  </div>
                                </div>

                                {/* Category */}
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                                    Category
                                  </span>
                                  <p className="text-sm font-semibold text-gray-800 mt-1">
                                    {complaint?.category || "N/A"}
                                  </p>
                                </div>

                                {/* Description */}
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                                    Description
                                  </span>
                                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                    {complaint?.title ||
                                      "No description provided"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === "mess" && (
                    <div className="w-full bg-white rounded-lg sm:rounded-xl lg:rounded-2xl xl:rounded-3xl shadow-md border border-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 max-w-4xl mx-auto">
                      <h3 className="!text-xl sm:!text-2xl lg:!text-3xl xl:!text-4xl !font-semibold text-gray-900 text-center">
                        Mess Menu
                      </h3>
                      <p className="!text-center !text-gray-900 mt-2 !text-base sm:!text-lg lg:!text-xl !opacity-100 uppercase !italic">
                        [{todaysMenu ? todaysMenu?.day : "Not Available"}]
                      </p>

                      <div className="mt-4 sm:mt-6 lg:mt-8 xl:mt-10 divide-y divide-gray-200">
                        <div className="py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <p className="!text-base sm:!text-lg !font-semibold !text-gray-900 mb-2 sm:mb-0">
                            Breakfast
                          </p>
                          <span className="text-gray-600 text-sm sm:text-base max-w-xs leading-relaxed !text-left sm:!text-right">
                            {todaysMenu?.breakfast || "N/A"}
                          </span>
                        </div>

                        <div className="py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <p className="!text-base sm:!text-lg !font-semibold !text-gray-900 mb-2 sm:mb-0">
                            Lunch
                          </p>
                          <span className="text-gray-600 text-sm sm:text-base max-w-xs leading-relaxed !text-left sm:!text-right">
                            {todaysMenu?.lunch || "N/A"}
                          </span>
                        </div>

                        <div className="py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <p className="!text-base sm:!text-lg !font-semibold !text-gray-900 mb-2 sm:mb-0">
                            Snacks
                          </p>
                          <span className="text-gray-600 text-sm sm:text-base max-w-xs !text-left sm:!text-right leading-relaxed">
                            {todaysMenu?.snacks || "N/A"}
                          </span>
                        </div>

                        <div className="py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <p className="!text-base sm:!text-lg !font-semibold !text-gray-900 mb-2 sm:mb-0">
                            Dinner
                          </p>
                          <span className="text-gray-600 text-sm sm:text-base max-w-xs !text-left sm:!text-right leading-relaxed">
                            {todaysMenu?.dinner || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
