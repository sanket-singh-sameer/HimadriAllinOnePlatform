import React, { useState, useEffect } from "react";
import { API_PATHS } from "../../Utils/apiPaths";
import axiosInstance from "../../Utils/axiosInstance";
import { useAuthStore } from "../store/authStore";
import { set } from "mongoose";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Admin() {
  const { logout, isLoading, error, user } = useAuthStore();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [allNotices, setAllNotices] = useState([]);
  const [complaintsList, setComplaintsList] = useState([]);
  const [complaintsListTemp, setComplaintsListTemp] = useState([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [roomSearchFilter, setRoomSearchFilter] = useState("");
  const [searchRollNumber, setSearchRollNumber] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [websiteStats, setWebsiteStats] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [localIsLoadingResolved, setLocalIsLoadingResolved] = useState(false);
  const [localIsLoadingRejected, setLocalIsLoadingRejected] = useState(false);
  const [localIsLoadingPending, setLocalIsLoadingPending] = useState(false);

  const [activeFeature, setActiveFeature] = useState("statistics");
  const [todaysMenu, setTodaysMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddNoticeForm, setShowAddNoticeForm] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    description: "",
    media: null,
  });
  const [editProfileForm, setEditProfileForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    room: user.room || "",
  });
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNoticeFormChange = (e) => {
    const { name, value } = e.target;
    setNoticeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = "";
        return;
      }

      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];

      if (validTypes.includes(file.type)) {
        setNoticeForm((prev) => ({ ...prev, media: file }));
      } else {
        toast.error("Please select a valid file (JPG, PNG, or PDF)");
        e.target.value = "";
      }
    }
  };

  const removeMedia = () => {
    setNoticeForm((prev) => ({ ...prev, media: null }));
    const fileInput = document.getElementById("media-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleAddNewNoticeForm = async (e) => {
    e.preventDefault();
    setLocalIsLoading(true);
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("title", noticeForm.title);
      formData.append("description", noticeForm.description);

      // Only append media if it exists
      if (noticeForm.media) {
        formData.append("media", noticeForm.media);
      }

      const response = await axiosInstance.post(
        API_PATHS.ADD_NOTICE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        fetchAllNotices();
        setNoticeForm({ title: "", description: "", media: null });
        // Clear the file input
        const fileInput = document.getElementById("media-upload");
        if (fileInput) fileInput.value = "";
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error adding notice:", error);
      toast.error(error.response?.data?.message || "Error adding notice");
    } finally {
      setLocalIsLoading(false);
      setShowAddNoticeForm(false);
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
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setLocalIsLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.EDIT_PROFILE,
        editProfileForm
      );
      if (response.status === 200) {
        console.log("Profile updated:", response.data);
      }
      setIsOpen(false);
      toast.success(response.data.message);
      setLocalIsLoading(false);
      fetchUserData();
    } catch (error) {
      toast.error("Error updating profile");
      setLocalIsLoading(false);
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLocalIsLoading(true);
    setPasswordError(null);

    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      setLocalIsLoading(false);
      return;
    }

    if (changePasswordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setLocalIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.put(API_PATHS.CHANGE_PASSWORD, {
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully");
        setIsPasswordModalOpen(false);
        setChangePasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
      setLocalIsLoading(false);
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Error changing password"
      );
      setLocalIsLoading(false);
      console.error("Error changing password:", error);
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

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDeleteNotice = async (noticeId) => {
    setLocalIsLoading(true);
    try {
      const response = await axiosInstance.delete(
        API_PATHS.DELETE_NOTICE(noticeId)
      );
      console.log("Notice deleted successfully:", response.data);
      setAllNotices((prevNotices) =>
        prevNotices.filter((notice) => notice._id !== noticeId)
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Error deleting notice");
    } finally {
      setLocalIsLoading(false);
    }

    console.log("Deleting notice with ID:", noticeId);
    setShowConfirm(false);
    setSelectedNotice(null);
  };

  const fetchTodaysMenu = async () => {
    try {
      const todaysMenu = await axiosInstance.get(API_PATHS.FETCH_TODAYS_MENU);
      setTodaysMenu(todaysMenu.data);
    } catch (error) {
      console.error("Error fetching today's menu:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchAllComplaints = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.FETCH_ALL_COMPLAINTS);
      setComplaintsList(response.data.complaints);
      categorizeComplaints(response.data.complaints);
      console.log(
        "All complaints fetched successfully:",
        response.data.complaints
      );
    } catch (error) {
      console.error("Error fetching all complaints:", error);
    }
  };

  const updateComplaintStatus = async (id, status) => {
    if (status == "Resolved") {
      setLocalIsLoadingResolved(true);
    }
    if (status == "Rejected") {
      setLocalIsLoadingRejected(true);
    }
    if (status == "Pending") {
      setLocalIsLoadingPending(true);
    }
    try {
      console.log("Updating complaint ID:", id, "to status:", status);
      const response = await axiosInstance.put(
        API_PATHS.UPDATE_COMPLAINT_STATUS(id),
        { status }
      );
      if (response.status === 200) {
        console.log("Complaint status updated successfully:", response.data);
        fetchAllComplaints();
      }
      // toast.success(response.data.message);
      if (status == "Resolved") {
        toast.success("Marked As Resolved");
      }
      if (status == "Rejected") {
        toast.error("Marked As Rejected");
      }
      if (status == "Pending") {
        toast.warn("Marked As Pending");
      }
    } catch (error) {
      toast.error("Error updating complaint status");
      console.error("Error updating complaint status:", error);
    } finally {
      setLocalIsLoadingRejected(false);
      setLocalIsLoadingResolved(false);
      setLocalIsLoadingPending(false);
    }
  };

  const getWebsiteStats = async () => {
    try {
      const responseComplaints = await axiosInstance.get(
        API_PATHS.FETCH_TOTAL_COMPLAINTS
      );
      const responseUsers = await axiosInstance.get(
        API_PATHS.FETCH_TOTAL_USERS
      );
      console.log("Website stats responses:", {
        responseComplaints,
        responseUsers,
      });
      setWebsiteStats({
        totalComplaints: responseComplaints.data.data.totalComplaints,
        pendingComplaints: responseComplaints.data.data.pendingComplaints,
        underProgressComplaints:
          responseComplaints.data.data.underProgressComplaints,
        resolvedComplaints: responseComplaints.data.data.resolvedComplaints,
        rejectedComplaints: responseComplaints.data.data.rejectedComplaints,
        totalUsers: responseUsers.data.data.totalUsers,
        totalAdmins: responseUsers.data.data.totalAdmins,
        totalSuperAdmins: responseUsers.data.data.totalSuperAdmins,
        totalStudents:
          responseUsers.data.data.totalUsers -
          responseUsers.data.data.totalAdmins -
          responseUsers.data.data.totalSuperAdmins,
      });
    } catch (error) {
      console.error("Error fetching website stats:", error);
      setWebsiteStats(null);
    }
  };
  const categorizeComplaints = (complaints) => {
    if (!complaints || !Array.isArray(complaints)) {
      console.warn("Invalid field:", complaints);
      return;
    }

    const statusCategories = {
      Pending: [],
      Rejected: [],
      Resolved: [],
      "Under-Progress": [],
    };
    const categoryCategories = {
      "Bathroom-Related": [],
      "Electricity-Related": [],
      "Elevator-Related": [],
      "Floor-Related": [],
      "Furniture-Related": [],
      "Internet-Related": [],
      "Mess-Related": [],
      Other: [],
      "Security-Related": [],
      "Water-Related": [],
    };

    complaints.forEach((complaint) => {
      if (statusCategories[complaint.status]) {
        statusCategories[complaint.status].push(complaint);
      }
      if (categoryCategories[complaint.category]) {
        categoryCategories[complaint.category].push(complaint);
      } else {
        categoryCategories.Other.push(complaint);
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedStatusFilter("");
    setSelectedCategoryFilter("");
    setRoomSearchFilter("");
    setComplaintsListTemp(complaintsList);
  };

  const applyFilters = (
    statusFilter = selectedStatusFilter,
    categoryFilter = selectedCategoryFilter,
    roomFilter = roomSearchFilter
  ) => {
    let filteredComplaints = complaintsList;

    if (statusFilter && statusFilter !== "") {
      filteredComplaints = filteredComplaints.filter(
        (complaint) => complaint.status === statusFilter
      );
    }

    if (categoryFilter && categoryFilter !== "") {
      filteredComplaints = filteredComplaints.filter(
        (complaint) => complaint.category === categoryFilter
      );
    }

    if (roomFilter && roomFilter !== "") {
      filteredComplaints = filteredComplaints.filter(
        (complaint) =>
          complaint.room && complaint.room.toString().includes(roomFilter)
      );
    }

    setComplaintsListTemp(filteredComplaints);
  };

  const getStudentByRoll = async (rollNumber) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.FETCH_USER_DETAILS(rollNumber)
      );
      return response.data.student;
    } catch (error) {
      console.error("Error fetching student by roll number:", error);
      return null;
    }
  };

  const getCGPIByRoll = async (rollNumber) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.FETCH_CGPI_BY_ROLL(rollNumber)
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching CGPI by roll number:", error);
      return null;
    }
  };

  const handleRollSearchText = async (e) => {
    const rollNumber = e.target.value;
    setSearchRollNumber(rollNumber);

    if (rollNumber) {
      try {
        const student = await getStudentByRoll(rollNumber);
        const cgpiData = await getCGPIByRoll(rollNumber);

        // Fetch snacks information
        let snacksInfo = { optedForSnacks: false };
        try {
          const snacksResponse = await axiosInstance.get(
            API_PATHS.CHECK_SNACKS_BY_ROLL(rollNumber)
          );
          snacksInfo = { optedForSnacks: snacksResponse.data.optedForSnacks };
        } catch (snacksError) {
          console.warn("Could not fetch snacks info:", snacksError);
        }

        if (student || cgpiData) {
          setStudentDetails({
            name: cgpiData?.name || "N/A",
            roll: student?.roll || rollNumber,
            room: student?.room || "N/A",
            phone: student?.phone || "N/A",
            email: student?.email || "N/A",
            role: student?.role || "N/A",
            fatherName: cgpiData?.fName || "N/A",
            cgpi: cgpiData?.cgpi || "N/A",
            snacksInfo: snacksInfo,
          });

          console.log("Student details set:", {
            student,
            cgpiData,
            snacksInfo,
            combined: {
              name: student?.name,
              roll: student?.roll,
              room: student?.room,
              fatherName: cgpiData?.fName,
              cgpi: cgpiData?.cgpi,
              snacksInfo,
            },
          });
        } else {
          console.error("Student not found");
          setStudentDetails(null);
        }
      } catch (error) {
        console.error("Error in handleRollSearchText:", error);
        setStudentDetails(null);
      }
    } else {
      setStudentDetails(null);
    }
  };
  const handleFilterChangeByStatus = (status) => {
    setSelectedStatusFilter(status);
    applyFilters(status, selectedCategoryFilter, roomSearchFilter);
  };

  const handleFilterChangeByCategory = (category) => {
    setSelectedCategoryFilter(category);
    applyFilters(selectedStatusFilter, category, roomSearchFilter);
  };

  const handleRoomSearchChange = (e) => {
    const roomValue = e.target.value;
    setRoomSearchFilter(roomValue);
    applyFilters(selectedStatusFilter, selectedCategoryFilter, roomValue);
  };

  // Snacks Management Functions
  const handleSearchStudent = async () => {
    if (!searchRollNumber) return;

    setLocalIsLoading(true);
    try {
      const student = await getStudentByRoll(searchRollNumber);
      const snacksResponse = await axiosInstance.get(
        API_PATHS.CHECK_SNACKS_BY_ROLL(searchRollNumber)
      );

      if (student) {
        setStudentDetails({
          ...student,
          snacksInfo: {
            optedForSnacks: snacksResponse.data.optedForSnacks,
          },
        });
        toast.success("Student found!");
      } else {
        toast.error("Student not found");
        setStudentDetails(null);
      }
    } catch (error) {
      console.error("Error searching student:", error);
      toast.error("Error searching student");
      setStudentDetails(null);
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleAddToSnacksList = async (rollNumber) => {
    setLocalIsLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.ADD_TO_SNACKS_LIST(rollNumber)
      );
      toast.success(response.data.message);

      // Update student details
      setStudentDetails((prev) => ({
        ...prev,
        snacksInfo: {
          optedForSnacks: true,
        },
      }));
    } catch (error) {
      console.error("Error adding to snacks list:", error);
      toast.error("Error adding student to snacks list");
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleRemoveFromSnacksList = async (rollNumber) => {
    setLocalIsLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.REMOVE_FROM_SNACKS_LIST(rollNumber)
      );
      toast.success(response.data.message);

      // Update student details
      setStudentDetails((prev) => ({
        ...prev,
        snacksInfo: {
          optedForSnacks: false,
        },
      }));
    } catch (error) {
      console.error("Error removing from snacks list:", error);
      toast.error("Error removing student from snacks list");
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleToggleSnacksStatus = async (rollNumber) => {
    setLocalIsLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.UPDATE_SNACKS_STATUS(rollNumber)
      );
      toast.success(response.data.message);

      // Update student details
      setStudentDetails((prev) => ({
        ...prev,
        snacksInfo: {
          optedForSnacks: response.data.optedForSnacks,
        },
      }));
    } catch (error) {
      console.error("Error toggling snacks status:", error);
      toast.error("Error updating snacks status");
    } finally {
      setLocalIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysMenu();
    fetchAllNotices();
    fetchAllComplaints();
    getWebsiteStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaintsList]);

  const COLORS = ["#4ade80", "#f87171"];

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
                    <span className="hidden sm:inline">
                      Himadri Admin Panel
                    </span>
                    <span className="sm:hidden">Admin Panel</span>
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

            <div className="hidden md:flex space-x-4 items-center">
              {user.role !== "admin" && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="group relative cursor-pointer !text-gray-700 hover:!text-white transition-all duration-300 !font-semibold tracking-wide px-4 lg:px-6 py-2 lg:py-3 rounded-xl overflow-hidden border-2 border-gray-300 hover:border-gray-900"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="hidden lg:inline">Student Dashboard</span>
                    <span className="lg:hidden">Dashboard</span>
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
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5v6l3-3 3 3V5"
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

            <div
              className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-xl transform transition-all duration-300 ease-in-out z-30 ${
                mobileMenuOpen
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-4 invisible"
              }`}
            >
              <div className="px-4 py-6 space-y-4">
                {user.role !== "admin" && (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full cursor-pointer group relative !text-gray-700 hover:!text-white transition-all duration-300 !font-semibold tracking-wide px-6 py-4 rounded-xl overflow-hidden border-2 border-gray-300 hover:border-gray-900 flex items-center justify-center gap-2"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Student Dashboard
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
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5v6l3-3 3 3V5"
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
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center mb-6 sm:mb-8">
                  <div className="relative group/avatar">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-0 group-hover/avatar:opacity-30 transition-opacity duration-500"></div>
                    <img
                      src={
                        user?.profilePicture
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
                      {user?.name}
                    </h4>
                    <p className="!text-xs sm:!text-sm !text-gray-500 !font-medium tracking-wide uppercase">
                      {user?.roll || <span className="text-gray-400">N/A</span>}
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
                      {user?.phone || "N/A"}
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
                      {user?.email}
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
                      {user?.room || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-6 sm:mt-8">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full !bg-gray-900 !text-white hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 px-6 py-3 sm:px-8 sm:py-4 rounded-xl !font-bold tracking-wide border-2 border-gray-900 hover:border-gray-700 hover:shadow-xl hover:shadow-gray-900/25 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 transform transition-all duration-300 ease-out cursor-pointer group"
                  >
                    <span className="flex items-center gap-2 group-hover:translate-x-0.5 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
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
                      Edit Profile & Settings
                    </span>
                  </button>

                  {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto relative transition-all">
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            setActiveTab("profile");
                            setPasswordError(null);
                            setChangePasswordForm({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          }}
                          className="cursor-pointer absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl z-10"
                        >
                          ✕
                        </button>

                        <div className="p-6 sm:p-8">
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight text-center">
                            Profile Settings
                          </h3>

                          <div className="flex bg-gray-100 rounded-xl p-1 mb-4 sm:mb-6">
                            <button
                              onClick={() => setActiveTab("profile")}
                              className={`cursor-pointer flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                activeTab === "profile"
                                  ? "bg-white text-gray-900 shadow-sm"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              <svg
                                className="w-4 h-4"
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
                              Profile Info
                            </button>
                            <button
                              onClick={() => setActiveTab("password")}
                              className={`cursor-pointer flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                activeTab === "password"
                                  ? "bg-white text-gray-900 shadow-sm"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2l-4.257-2.257A6 6 0 0117 9zm-5 8a2 2 0 100-4 2 2 0 000 4z"
                                />
                              </svg>
                              Password
                            </button>
                          </div>

                          {activeTab === "profile" && (
                            <form
                              onSubmit={handleEditFormSubmit}
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                  </label>
                                  <input
                                    value={editProfileForm.name}
                                    type="text"
                                    name="name"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm transition-all duration-200"
                                    placeholder="Enter Your Name"
                                    onChange={handleEditFormChange}
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                  </label>
                                  <input
                                    value={editProfileForm.phone}
                                    type="tel"
                                    name="phone"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm transition-all duration-200"
                                    placeholder="Enter Phone Number"
                                    onChange={handleEditFormChange}
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Room Number
                                  </label>
                                  <input
                                    value={editProfileForm.room}
                                    type="text"
                                    name="room"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm transition-all duration-200"
                                    placeholder="Enter Room Number"
                                    onChange={handleEditFormChange}
                                  />
                                </div>
                              </div>

                              <div className="pt-2">
                                <button
                                  type="submit"
                                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl hover:bg-gray-700 shadow-lg cursor-pointer transition-all duration-300 font-semibold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                  disabled={localIsLoading}
                                >
                                  {localIsLoading
                                    ? "Saving Changes..."
                                    : "Save Changes"}
                                </button>
                              </div>
                            </form>
                          )}

                          {activeTab === "password" && (
                            <form
                              onSubmit={handleChangePassword}
                              className="space-y-4"
                            >
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                  </label>
                                  <input
                                    value={changePasswordForm.currentPassword}
                                    type="password"
                                    name="currentPassword"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all duration-200"
                                    placeholder="Enter your current password"
                                    onChange={handlePasswordFormChange}
                                    required
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      New Password
                                    </label>
                                    <input
                                      value={changePasswordForm.newPassword}
                                      type="password"
                                      name="newPassword"
                                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all duration-200"
                                      placeholder="Enter new password"
                                      onChange={handlePasswordFormChange}
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Confirm New Password
                                    </label>
                                    <input
                                      value={changePasswordForm.confirmPassword}
                                      type="password"
                                      name="confirmPassword"
                                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all duration-200"
                                      placeholder="Confirm new password"
                                      onChange={handlePasswordFormChange}
                                      required
                                    />
                                  </div>
                                </div>

                                {passwordError && (
                                  <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
                                    <svg
                                      className="shrink-0 h-5 w-5 text-red-500"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
                                      />
                                    </svg>
                                    <p className="!text-sm !font-medium text-red-700 !leading-tight">
                                      {passwordError}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="pt-2">
                                <button
                                  type="submit"
                                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 shadow-lg cursor-pointer transition-all duration-300 font-semibold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                  disabled={localIsLoading}
                                >
                                  {localIsLoading
                                    ? "Changing Password..."
                                    : "Change Password"}
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-100 hover:border-gray-200 lg:col-span-2 flex flex-col relative overflow-hidden z-0">
              <div className="relative z-10">
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

                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setShowAddNoticeForm(true)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-semibold rounded-xl sm:rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:from-gray-200 hover:to-gray-100 transition-all duration-300 cursor-pointer text-sm sm:text-base lg:text-lg flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="hidden sm:inline">Add Notice</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>

                <ul className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base max-h-[360px] sm:max-h-[490px] overflow-y-auto pr-2 scrollbar-thin">
                  <ul className="space-y-3 sm:space-y-4">
                    {allNotices.map(
                      (notice, index) =>
                        index < 10 && (
                          <li
                            key={notice._id || index}
                            className="group/notice bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-green-50 hover:to-blue-50/50 rounded-2xl border border-gray-200 hover:border-green-200 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-100/30 to-transparent rounded-bl-2xl opacity-0 group-hover/notice:opacity-100 transition-opacity duration-300"></div>

                            {(user.role === "admin" ||
                              user.role === "super-admin" ||
                              user._id === notice.authorId) && (
                              <button
                                onClick={() => {
                                  setSelectedNotice(notice);
                                  setShowConfirm(true);
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer z-20 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            )}

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

                              {notice.media && (
                                <div className="mb-4">
                                  {notice.media
                                    .toLowerCase()
                                    .endsWith(".pdf") ? (
                                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                                      <svg
                                        className="w-5 h-5 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                      </svg>
                                      <a
                                        href={notice.media}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                      >
                                        View PDF Attachment
                                      </a>
                                    </div>
                                  ) : (
                                    <img
                                      src={notice.media}
                                      alt="Notice attachment"
                                      className="w-full max-w-sm rounded-lg border shadow-sm cursor-pointer"
                                      onClick={() =>
                                        window.open(`${notice.media}`)
                                      }
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  )}
                                </div>
                              )}

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
                  {showConfirm && selectedNotice && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <h3 className="!text-xl font-semibold text-gray-900 mb-4">
                          Confirm Deletion
                        </h3>
                        <p className="text-gray-600 mb-6 !text-lg">
                          Are you sure you want to delete this notice?
                        </p>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => {
                              setShowConfirm(false);
                              setSelectedNotice(null);
                            }}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 font-medium shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                          >
                            Cancel
                          </button>

                          <button
                            className="px-5 py-2.5 rounded-lg text-white bg-gray-700 hover:bg-gray-800 font-medium shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                            onClick={() =>
                              handleDeleteNotice(selectedNotice?._id)
                            }
                          >
                            {localIsLoading ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </ul>
              </div>
            </div>

            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100 hover:border-gray-200 lg:col-span-3 flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
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

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="flex flex-col space-y-2 sm:space-y-3 lg:space-y-4 mt-2 sm:mt-4 lg:mt-6">
                  <button
                    onClick={() => setActiveFeature("statistics")}
                    className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${
                      activeFeature === "statistics"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    View Statistics
                  </button>

                  <button
                    onClick={() => setActiveFeature("complaints")}
                    className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${
                      activeFeature === "complaints"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    Manage Complaints
                  </button>
                  <button
                    onClick={() => setActiveFeature("searchStudent")}
                    className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${
                      activeFeature === "searchStudent"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    Student Records
                  </button>

                  <button
                    onClick={() => setActiveFeature("mess")}
                    className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${
                      activeFeature === "mess"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    Today’s Mess Menu
                  </button>
                </div>

                <div className="lg:col-span-3 bg-gray-50 rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-5 lg:p-6 shadow-inner">
                  {activeFeature === "statistics" && (
                    <div className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl mx-auto">
                      <h3 className="!text-3xl sm:!text-4xl !font-semibold text-gray-900 text-center mb-8 sm:mb-12">
                        Statistics
                      </h3>

                      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm transition-all duration-300 text-center mb-8 sm:mb-10">
                        <h3 className="!text-lg sm:!text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
                          Total Students
                        </h3>
                        <p className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                          {websiteStats?.totalStudents}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                        <h3 className="!text-lg sm:!text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
                          Complaints Overview
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                          <div className="p-4 sm:p-6 text-center">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              Total
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                              {websiteStats?.totalComplaints}
                            </p>
                          </div>

                          <div className="p-4 sm:p-6 text-center">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              Resolved
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                              {websiteStats?.resolvedComplaints}
                            </p>
                          </div>

                          <div className="p-4 sm:p-6 text-center">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              Pending
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                              {websiteStats?.pendingComplaints}
                            </p>
                          </div>

                          <div className="p-4 sm:p-6 text-center">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              Rejected
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                              {websiteStats?.rejectedComplaints}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === "complaints" && (
                    <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
                      <h3 className="!text-3xl sm:!text-4xl !font-semibold text-gray-900 text-center mb-8">
                        Complaint Register
                      </h3>
                      <div className="mb-6 flex flex-col gap-4 sm:gap-6">
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <label
                              className="text-gray-700 font-medium text-sm whitespace-nowrap"
                              htmlFor="room-search-filter"
                            >
                              Search by Room:
                            </label>
                            <div className="relative">
                              <input
                                id="room-search-filter"
                                type="text"
                                value={roomSearchFilter}
                                onChange={handleRoomSearchChange}
                                placeholder="Enter room number..."
                                className="w-full sm:w-auto min-w-[160px] border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
                              />
                              <svg
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                              </svg>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <label
                              className="text-gray-700 font-medium text-sm whitespace-nowrap"
                              htmlFor="complaint-filter-01"
                            >
                              Filter by Status:
                            </label>
                            <select
                              id="complaint-filter-01"
                              value={selectedStatusFilter}
                              onChange={(e) =>
                                handleFilterChangeByStatus(e.target.value)
                              }
                              className="w-full sm:w-auto min-w-[140px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm cursor-pointer"
                            >
                              <option value="">All Status</option>
                              <option value="Pending">Pending</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <label
                              className="text-gray-700 font-medium text-sm whitespace-nowrap"
                              htmlFor="complaint-filter-02"
                            >
                              Filter by Category:
                            </label>
                            <select
                              id="complaint-filter-02"
                              value={selectedCategoryFilter}
                              onChange={(e) =>
                                handleFilterChangeByCategory(e.target.value)
                              }
                              className="w-full sm:w-auto min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm cursor-pointer"
                            >
                              <option value="">All Categories</option>
                              <option value="Bathroom-Related">
                                Bathroom-Related
                              </option>
                              <option value="Water-Related">
                                Water-Related
                              </option>
                              <option value="Electricity-Related">
                                Electricity-Related
                              </option>
                              <option value="Mess-Related">Mess-Related</option>
                              <option value="Internet-Related">
                                Internet-Related
                              </option>
                              <option value="Floor-Related">
                                Floor-Related
                              </option>
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

                          {(selectedStatusFilter ||
                            selectedCategoryFilter ||
                            roomSearchFilter) && (
                            <div className="flex justify-center sm:justify-end lg:justify-start">
                              <button
                                onClick={clearAllFilters}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition cursor-pointer text-sm font-medium min-w-[120px]"
                              >
                                Clear Filters
                              </button>
                            </div>
                          )}
                        </div>

                        {(selectedStatusFilter ||
                          selectedCategoryFilter ||
                          roomSearchFilter) && (
                          <div className="flex flex-wrap gap-2 lg:hidden">
                            {selectedStatusFilter && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                Status: {selectedStatusFilter}
                                <button
                                  onClick={() => handleFilterChangeByStatus("")}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </span>
                            )}
                            {selectedCategoryFilter && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Category: {selectedCategoryFilter}
                                <button
                                  onClick={() =>
                                    handleFilterChangeByCategory("")
                                  }
                                  className="ml-1 text-green-600 hover:text-green-800"
                                >
                                  ×
                                </button>
                              </span>
                            )}
                            {roomSearchFilter && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                Room: {roomSearchFilter}
                                <button
                                  onClick={() => {
                                    setRoomSearchFilter("");
                                    applyFilters(
                                      selectedStatusFilter,
                                      selectedCategoryFilter,
                                      ""
                                    );
                                  }}
                                  className="ml-1 text-purple-600 hover:text-purple-800"
                                >
                                  ×
                                </button>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="relative my-8 sm:my-10">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 sm:px-4 bg-white text-gray-400 text-xs sm:text-sm font-medium">
                            {selectedStatusFilter ||
                            selectedCategoryFilter ||
                            roomSearchFilter
                              ? `Filtered Complaints (${complaintsListTemp.length})`
                              : `All Complaints (${complaintsListTemp.length})`}
                          </span>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                        <div className="space-y-4 sm:space-y-6 lg:space-y-8 py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-6">
                          {complaintsListTemp.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="text-gray-400 text-4xl mb-4">
                                📋
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No complaints found
                              </h3>
                              <p className="text-gray-500 text-sm">
                                {selectedStatusFilter ||
                                selectedCategoryFilter ||
                                roomSearchFilter
                                  ? "Try adjusting your filters to see more results."
                                  : "No complaints have been submitted yet."}
                              </p>
                            </div>
                          ) : (
                            complaintsListTemp.map((complaint, index) => (
                              <div
                                key={complaint.serial}
                                className="border rounded-2xl lg:rounded-3xl shadow-md bg-white transition-all duration-500 hover:shadow-lg"
                              >
                                <button
                                  onClick={() => toggleAccordion(index)}
                                  className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 lg:p-8 text-left cursor-pointer gap-3 sm:gap-0"
                                >
                                  <div className="flex flex-col items-start justify-center space-y-1 sm:space-y-1">
                                    <h3 className="text-lg sm:text-xl lg:!text-2xl !font-bold !text-gray-900 !tracking-tight !leading-snug flex items-center">
                                      Complaint #{complaint.serial} &nbsp;
                                      <span className="font-light text-lg">
                                        [Registerd on: {complaint.date}]
                                      </span>
                                    </h3>
                                    <p className="text-sm sm:!text-base !font-medium !text-gray-600 !leading-snug !opacity-100 line-clamp-2">
                                      {complaint.title}
                                    </p>
                                    <p className="text-xs sm:!text-base !font-medium !text-gray-600 !leading-snug !opacity-100">
                                      Room No: &nbsp;{complaint.room}
                                    </p>
                                  </div>

                                  <span
                                    className={`self-start sm:self-center text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm min-w-fit ${
                                      complaint.status === "Resolved"
                                        ? "bg-green-100 text-green-700"
                                        : complaint.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : complaint.status === "Rejected"
                                        ? "bg-red-100 text-red-700"
                                        : complaint.status === "Under-Progress"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {complaint.status}
                                  </span>
                                </button>

                                <div
                                  className={`transition-all duration-700 overflow-hidden ${
                                    openIndex === index
                                      ? "max-h-[500px] opacity-100"
                                      : "max-h-0 opacity-0"
                                  }`}
                                >
                                  <div className="border-t px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-3 text-gray-700 text-sm sm:text-base">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                      <p className="!font-medium !text-gray-900 !opacity-100">
                                        <span className="text-gray-600">
                                          Category:
                                        </span>{" "}
                                        {complaint.category}
                                      </p>
                                      <p className="!font-medium !text-gray-900 !opacity-100">
                                        <span className="text-gray-600">
                                          Date:
                                        </span>{" "}
                                        {complaint.date}
                                      </p>
                                    </div>

                                    <div className="pt-2">
                                      <p className="!font-medium !text-gray-900 !opacity-100 mb-2">
                                        <span className="text-gray-600">
                                          Description:
                                        </span>
                                      </p>
                                      <p className="!font-light !text-gray-900 !opacity-100 pl-4 border-l-2 border-gray-200">
                                        {complaint.description}
                                      </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-center flex-wrap gap-2 sm:gap-3 mt-4 pt-4 border-t border-gray-100">
                                      <button
                                        onClick={() =>
                                          updateComplaintStatus(
                                            complaint._id,
                                            "Resolved"
                                          )
                                        }
                                        disabled={
                                          complaint.status === "Resolved"
                                        }
                                        className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium shadow-sm hover:bg-green-200 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {localIsLoadingResolved
                                          ? "Loading..."
                                          : "✓ Resolved"}
                                      </button>
                                      <button
                                        onClick={() =>
                                          updateComplaintStatus(
                                            complaint._id,
                                            "Pending"
                                          )
                                        }
                                        disabled={
                                          complaint.status === "Pending"
                                        }
                                        className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 font-medium shadow-sm hover:bg-yellow-200 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {localIsLoadingPending
                                          ? "Loading..."
                                          : "⚠️ Pending"}
                                      </button>
                                      <button
                                        onClick={() =>
                                          updateComplaintStatus(
                                            complaint._id,
                                            "Rejected"
                                          )
                                        }
                                        disabled={
                                          complaint.status === "Rejected"
                                        }
                                        className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl bg-red-100 text-red-700 font-medium shadow-sm hover:bg-red-200 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {localIsLoadingRejected
                                          ? "Loading..."
                                          : "✗ Rejected"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === "searchStudent" && (
                    <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <h3 className="!text-2xl sm:!text-4xl !font-semibold text-gray-900">
                            Student Records
                          </h3>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                          <div className="relative w-full sm:w-96">
                            <input
                              type="text"
                              placeholder="Enter Roll Number (e.g., 24XYZ111)"
                              className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-700 placeholder-gray-400 transition-all duration-300 bg-white"
                              onChange={handleRollSearchText}
                              value={searchRollNumber}
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <svg
                                className="w-5 h-5 text-gray-900"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                              </svg>
                            </div>
                          </div>
                          <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                              />
                            </svg>
                            <span>Search</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="!text-xl !font-bold text-gray-900">
                            Search Results
                          </h3>
                          {studentDetails && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span>Record Found</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        className="w-4 h-4"
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
                                      <span>Student Info</span>
                                    </div>
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 5v6l3-3 3 3V5"
                                        />
                                      </svg>
                                      <span>Academic</span>
                                    </div>
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                      </svg>
                                      <span>Contact & Housing</span>
                                    </div>
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {studentDetails ? (
                                  <tr className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
                                    <td className="px-8 py-6">
                                      <div className="flex items-center gap-6">
                                        {/* Avatar */}
                                        <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-md">
                                          {studentDetails.name?.charAt(0) ||
                                            "S"}
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-col gap-1">
                                          <div className="text-lg font-semibold text-gray-900 leading-tight">
                                            {studentDetails.name || "N/A"}
                                          </div>
                                          <div className="text-sm text-gray-700 font-medium">
                                            Roll: {studentDetails.roll || "N/A"}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            Father:{" "}
                                            {studentDetails.fatherName || "N/A"}
                                          </div>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="px-6 py-6">
                                      <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {studentDetails.cgpi || "N/A"}
                                          </div>
                                          <div>
                                            <div className="text-sm font-medium text-gray-700">
                                              CGPA Score
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              Current Performance
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <div
                                            className={`w-3 h-3 rounded-full ${
                                              parseFloat(studentDetails.cgpi) >=
                                              8.5
                                                ? "bg-green-500"
                                                : parseFloat(
                                                    studentDetails.cgpi
                                                  ) >= 7.0
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                            }`}
                                          ></div>
                                          <span className="text-xs font-medium text-gray-600">
                                            {parseFloat(studentDetails.cgpi) >=
                                            8.5
                                              ? "Excellent"
                                              : parseFloat(
                                                  studentDetails.cgpi
                                                ) >= 7.0
                                              ? "Good"
                                              : "Needs Improvement"}
                                          </span>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="px-6 py-6">
                                      <div className="space-y-4">
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg
                                              className="w-4 h-4 text-green-600"
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
                                          <div>
                                            <div className="text-sm font-semibold text-gray-900">
                                              Room{" "}
                                              {studentDetails?.room || "N/A"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              Hostel Accommodation
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg
                                              className="w-4 h-4 text-blue-600"
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
                                          <div>
                                            <div className="text-sm font-semibold text-gray-900">
                                              {`${studentDetails.roll}@nith.ac.in` ||
                                                "N/A"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              Email Address
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg
                                              className="w-4 h-4 text-purple-600"
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
                                          <div>
                                            <div className="text-sm font-semibold text-gray-900">
                                              {studentDetails?.phone || "N/A"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              Phone Number
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="3"
                                      className="px-6 py-12 text-center"
                                    >
                                      <div className="flex flex-col items-center space-y-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-10 h-10 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                            />
                                          </svg>
                                        </div>
                                        <div className="text-center">
                                          <h3 className="!text-lg !font-medium !text-gray-900 mb-2">
                                            No Student Found
                                          </h3>
                                          <p className="!text-gray-500 !text-sm !max-w-md opacity-100">
                                            {searchRollNumber
                                              ? "No student record found for the entered roll number. Please verify and try again."
                                              : "Enter a roll number in the search field above to find student details."}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {studentDetails && (
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="w-5 h-5 text-gray-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">
                                  Complete student profile information
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Last updated: {new Date().toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        )}

                        {studentDetails && (
                          <div className="group bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 md:p-10 relative overflow-hidden">
                            <div className="relative z-10">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                                <div className="flex items-center space-x-3">
                                  <div>
                                    <h3 className="!text-2xl sm:!text-3xl !font-black !text-gray-900 tracking-tight leading-none">
                                      Student Management!
                                    </h3>
                                    <p className="!text-sm !text-gray-600 !font-medium opacity-90 !text-left">
                                      Administer student profiles
                                    </p>
                                  </div>
                                </div>
                                {localIsLoading && (
                                  <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
                                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm font-semibold text-gray-900">
                                      Processing...
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/50 hover:border-gray-300 transition-all duration-300 group/status">
                                  <div className="flex items-center justify-between mb-5">
                                    <h3 className="!text-lg !font-bold !text-gray-900 flex items-center space-x-2">
                                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                                        <svg
                                          className="w-4 h-4 text-gray-700"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                      </div>
                                      <span>Current Status!</span>
                                    </h3>
                                  </div>

                                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm group-hover/status:shadow-md transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-4">
                                        <div
                                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                            studentDetails.snacksInfo
                                              ?.optedForSnacks
                                              ? "bg-gray-900 shadow-lg shadow-gray-900/25"
                                              : "bg-gray-100 border-2 border-dashed border-gray-300"
                                          }`}
                                        >
                                          {studentDetails.snacksInfo
                                            ?.optedForSnacks ? (
                                            <svg
                                              className="w-6 h-6 text-white"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                          ) : (
                                            <svg
                                              className="w-6 h-6 text-gray-400"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          )}
                                        </div>
                                        <div>
                                          <p className="!text-base !text-left !font-bold !text-gray-900">
                                            {studentDetails.snacksInfo
                                              ?.optedForSnacks
                                              ? "Opted for Snacks!"
                                              : "Not Opted for Snacks"}
                                          </p>
                                          <p className="!text-sm !text-gray-600 !opacity-90">
                                            {studentDetails.snacksInfo
                                              ?.optedForSnacks
                                              ? "Student will receive snacks"
                                              : "Student will not receive snacks"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/50 hover:border-gray-300 transition-all duration-300 group/actions">
                                  <div className="flex items-center justify-between mb-5">
                                    <h3 className="!text-lg !font-bold !text-gray-900 flex items-center space-x-2">
                                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                                        <svg
                                          className="w-4 h-4 text-gray-700"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1z"
                                          />
                                        </svg>
                                      </div>
                                      <span>Quick Actions!</span>
                                    </h3>
                                  </div>

                                  <div className="space-y-4">
                                    {!studentDetails.snacksInfo
                                      ?.optedForSnacks ? (
                                      <button
                                        onClick={() =>
                                          handleAddToSnacksList(
                                            studentDetails.roll
                                          )
                                        }
                                        disabled={localIsLoading}
                                        className="w-full group/btn cursor-pointer px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:shadow-gray-900/25 hover:scale-[1.02] active:scale-[0.98] border-2 border-gray-900"
                                      >
                                        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover/btn:bg-white/30 transition-colors duration-300">
                                          <svg
                                            className="w-3 h-3"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </div>
                                        <span className="group-hover/btn:translate-x-0.5 transition-transform duration-300">
                                          {localIsLoading
                                            ? "Processing..."
                                            : "Add to Snacks List"}
                                        </span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleRemoveFromSnacksList(
                                            studentDetails.roll
                                          )
                                        }
                                        disabled={localIsLoading}
                                        className="w-full group/btn cursor-pointer px-6 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl border-2 border-gray-900 hover:border-black hover:scale-[1.02] active:scale-[0.98]"
                                      >
                                        <div className="w-5 h-5 bg-gray-900/10 rounded-lg flex items-center justify-center group-hover/btn:bg-gray-900/20 transition-colors duration-300">
                                          <svg
                                            className="w-3 h-3"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              d="M20 12H4"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </div>
                                        <span className="group-hover/btn:translate-x-0.5 transition-transform duration-300">
                                          {localIsLoading
                                            ? "Processing..."
                                            : "Remove from Snacks List"}
                                        </span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() =>
                                        handleToggleSnacksStatus(
                                          studentDetails.roll
                                        )
                                      }
                                      disabled={localIsLoading}
                                      className="w-full group/btn cursor-pointer px-6 py-4 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 border-2 border-gray-300 hover:border-gray-400 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                      <div className="w-5 h-5 bg-gray-900/10 rounded-lg flex items-center justify-center group-hover/btn:bg-gray-900/20 transition-colors duration-300">
                                        <svg
                                          className="w-3 h-3"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </div>
                                      <span className="group-hover/btn:translate-x-0.5 transition-transform duration-300">
                                        {localIsLoading
                                          ? "Processing..."
                                          : "Toggle Status"}
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-8 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/5 to-black/10 rounded-2xl blur-xl"></div>
                                <div className="relative bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                  <div className="flex items-start space-x-4">
                                    <div className="flex-1">
                                      <h3 className="!text-sm !font-bold !text-gray-900 mb-2">
                                        Important Note!
                                      </h3>
                                      <p className="!text-sm !text-gray-700 !leading-relaxed !opacity-90">
                                        Changes will be reflected immediately.
                                        Students will receive snacks during
                                        snack time if they are opted in. Please
                                        ensure accurate updates to maintain
                                        proper meal planning and inventory
                                        management.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                      Last updated:{" "}
                                      {new Date().toLocaleTimeString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeFeature === "mess" && (
                    <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
                      <h3 className="!text-4xl !font-semibold text-gray-900 text-center">
                        Mess Menu
                      </h3>
                      <p className="!text-center !text-gray-900 mt-2 !text-xl !opacity-100 uppercase !italic">
                        [{todaysMenu ? todaysMenu?.day : "Not Available"}]
                      </p>

                      <div className="mt-10 divide-y divide-gray-200">
                        <div className="py-5 flex flex-col md:flex-row justify-between items-center">
                          <p className="!text-lg !font-semibold !text-gray-900 ">
                            Breakfast
                          </p>
                          <span className="text-gray-600 text-base max-w-xs leading-relaxed !text-center md:!text-right">
                            {todaysMenu?.breakfast || "N/A"}
                          </span>
                        </div>

                        <div className="py-5 flex flex-col md:flex-row justify-between items-center">
                          <p className="!text-lg !font-semibold !text-gray-900">
                            Lunch
                          </p>
                          <span className="text-gray-600 text-base max-w-xs leading-relaxed !text-center md:!text-right">
                            {todaysMenu?.lunch || "N/A"}
                          </span>
                        </div>

                        <div className="py-5 flex flex-col md:flex-row justify-between items-center">
                          <p className="!text-lg !font-semibold !text-gray-900">
                            Snacks
                          </p>
                          <span className="text-gray-600 text-base max-w-xs !text-center md:!text-right leading-relaxed">
                            {todaysMenu?.snacks || "N/A"}
                          </span>
                        </div>

                        <div className="py-5 flex flex-col md:flex-row justify-between items-center">
                          <p className="!text-lg !font-semibold !text-gray-900">
                            Dinner
                          </p>
                          <span className="text-gray-600 text-base max-w-xs !text-center md:!text-right leading-relaxed">
                            {todaysMenu?.dinner || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === "manageSnacks" && (
                    <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
                      <h3 className="!text-4xl !font-semibold text-gray-900 text-center mb-6">
                        Manage Student Snacks Preferences
                      </h3>
                      <p className="!text-center !text-gray-600 mt-2 !text-lg mb-8">
                        Add or remove students from the snacks list
                      </p>

                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className="text-xl font-semibold text-gray-800 mb-4">
                            Search Student
                          </h4>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              type="text"
                              placeholder="Enter roll number (e.g., 21MCA001)"
                              value={searchRollNumber}
                              onChange={(e) =>
                                setSearchRollNumber(
                                  e.target.value.toUpperCase()
                                )
                              }
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={handleSearchStudent}
                              disabled={!searchRollNumber || localIsLoading}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {localIsLoading ? "Searching..." : "Search"}
                            </button>
                          </div>
                        </div>

                        {studentDetails && (
                          <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Student Info */}
                              <div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                                  Student Information
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium">
                                      {studentDetails.name}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Roll Number:
                                    </span>
                                    <span className="font-medium">
                                      {studentDetails.roll}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Room:</span>
                                    <span className="font-medium">
                                      {studentDetails.room}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Email:
                                    </span>
                                    <span className="font-medium">
                                      {studentDetails.email}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                                  Snacks Management
                                </h4>
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        Current Status:
                                      </p>
                                      <p
                                        className={`text-sm ${
                                          studentDetails.snacksInfo
                                            ?.optedForSnacks
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {studentDetails.snacksInfo
                                          ?.optedForSnacks
                                          ? "Opted for Snacks"
                                          : "Not Opted for Snacks"}
                                      </p>
                                    </div>
                                    <div
                                      className={`w-4 h-4 rounded-full ${
                                        studentDetails.snacksInfo
                                          ?.optedForSnacks
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                    ></div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                      onClick={() =>
                                        handleAddToSnacksList(
                                          studentDetails.roll
                                        )
                                      }
                                      disabled={
                                        localIsLoading ||
                                        studentDetails.snacksInfo
                                          ?.optedForSnacks
                                      }
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      {localIsLoading
                                        ? "Processing..."
                                        : "Add to Snacks"}
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRemoveFromSnacksList(
                                          studentDetails.roll
                                        )
                                      }
                                      disabled={
                                        localIsLoading ||
                                        !studentDetails.snacksInfo
                                          ?.optedForSnacks
                                      }
                                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      {localIsLoading
                                        ? "Processing..."
                                        : "Remove from Snacks"}
                                    </button>
                                  </div>

                                  <button
                                    onClick={() =>
                                      handleToggleSnacksStatus(
                                        studentDetails.roll
                                      )
                                    }
                                    disabled={localIsLoading}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {localIsLoading
                                      ? "Processing..."
                                      : "Toggle Status"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showAddNoticeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-premium">
            <div className="sticky top-0 bg-white rounded-t-2xl sm:rounded-t-3xl border-b border-gray-100 px-4 sm:px-6 md:px-8 py-4 sm:py-6 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="!text-lg sm:!text-xl md:!text-2xl !font-bold text-gray-900">
                    Add New Notice
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowAddNoticeForm(false);
                    setNoticeForm({ title: "", description: "", media: null });
                    removeMedia();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
              <form
                onSubmit={handleAddNewNoticeForm}
                className="space-y-6 sm:space-y-8"
              >
                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={noticeForm.title}
                    onChange={handleNoticeFormChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter a clear and descriptive title"
                    required
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={noticeForm.description}
                    onChange={handleNoticeFormChange}
                    rows="4"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none transition-all duration-200 text-sm sm:text-base"
                    placeholder="Provide detailed information about the notice"
                    required
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Attach Media{" "}
                    <span className="text-gray-500 font-normal">
                      (Optional)
                    </span>
                  </label>

                  {!noticeForm.media ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center hover:border-gray-400 transition-colors duration-200">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-center">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="media-upload"
                            className="cursor-pointer inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="hidden sm:inline">
                              Choose File
                            </span>
                            <span className="sm:hidden">Upload</span>
                          </label>
                          <input
                            id="media-upload"
                            name="media"
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleMediaChange}
                            className="hidden"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">
                          <span className="hidden sm:inline">
                            Support for JPG, PNG, and PDF files
                          </span>
                          <span className="sm:hidden">JPG, PNG, PDF only</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            {noticeForm.media.type.startsWith("image/") ? (
                              <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {noticeForm.media.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(noticeForm.media.size / 1024 / 1024).toFixed(2)}{" "}
                              MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeMedia}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1.5 sm:p-2 rounded-full hover:bg-red-50 flex-shrink-0"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Author
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="author"
                      value={user.name}
                      readOnly
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed text-sm sm:text-base pr-10 sm:pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0"
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
                    <span className="text-xs sm:text-sm font-medium text-blue-700">
                      <span className="hidden sm:inline">
                        Publication Date:{" "}
                      </span>
                      <span className="sm:hidden">Date: </span>
                      {new Date().toLocaleDateString("en-US", {
                        weekday: window.innerWidth < 640 ? "short" : "long",
                        year: "numeric",
                        month: window.innerWidth < 640 ? "short" : "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddNoticeForm(false);
                      setNoticeForm({
                        title: "",
                        description: "",
                        media: null,
                      });
                      removeMedia();
                    }}
                    className="cursor-pointer w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm sm:text-base order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={localIsLoading}
                    className="cursor-pointer w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-900 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center space-x-1.5 sm:space-x-2 order-1 sm:order-2"
                  >
                    {localIsLoading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4 sm:w-5 sm:h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span className="hidden sm:inline">Publishing...</span>
                        <span className="sm:hidden">Publishing...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        <span className="hidden sm:inline">Publish Notice</span>
                        <span className="sm:hidden">Publish</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
