import React, { useState, useEffect } from "react";
import { API_PATHS } from "../../Utils/apiPaths";
import axiosInstance from "../../Utils/axiosInstance";
import { useAuthStore } from "../store/authStore";

export default function Admin() {
  const { logout, isLoading, error, user } = useAuthStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [allNotices, setAllNotices] = useState([]);
  const [complaintsList, setComplaintsList] = useState([]);
  const [complaintsListTemp, setComplaintsListTemp] = useState([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [searchRollNumber, setSearchRollNumber] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);

  const [activeFeature, setActiveFeature] = useState("statistics");
  const [todaysMenu, setTodaysMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    room: user.room || "",
  });

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditProfileForm((prev) => ({ ...prev, [name]: value }));
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
    try {
      const response = await axiosInstance.delete(
        API_PATHS.DELETE_NOTICE(noticeId)
      );
      console.log("Notice deleted successfully:", response.data);
      setAllNotices((prevNotices) =>
        prevNotices.filter((notice) => notice._id !== noticeId)
      );
    } catch (error) {
      console.error("Error deleting notice:", error);
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
    } catch (error) {
      console.error("Error updating complaint status:", error);
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
    setComplaintsListTemp(complaintsList);
  };

  const applyFilters = (
    statusFilter = selectedStatusFilter,
    categoryFilter = selectedCategoryFilter
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

        if (student || cgpiData) {
          setStudentDetails({
            name: cgpiData?.name || "N/A",
            roll: student?.roll || rollNumber,
            room: student?.room || "N/A",
            phone: student?.phone || "N/A",
            email: student?.email || "N/A",
            role: student?.role || "N/A",
            fatherName: cgpiData?.fName || "N/A",
            cgpi: cgpiData?.CGPI || "N/A",
          });

          console.log("Student details set:", {
            student,
            cgpiData,
            combined: {
              name: student?.name,
              roll: student?.roll,
              room: student?.room,
              fatherName: cgpiData?.fName,
              cgpi: cgpiData?.cgpi,
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
    applyFilters(status, selectedCategoryFilter);
  };

  const handleFilterChangeByCategory = (category) => {
    setSelectedCategoryFilter(category);
    applyFilters(selectedStatusFilter, category);
  };

  useEffect(() => {
    fetchTodaysMenu();
    fetchAllNotices();
    fetchAllComplaints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaintsList]);

  const COLORS = ["#4ade80", "#f87171"];

  return (
    <div>
      <div className="min-h-screen flex bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea]">
        <main className="flex-1 flex flex-col">
          <div className="flex justify-center">
            <header className="bg-white/80 w-[100%] backdrop-blur-md border-b border-gray-200 shadow-sm px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between rounded-b-2xl mx-auto">
              <div className="flex items-center gap-6">
                <h4 className="text-5xl !font-light text-gray-900 leading-tight">
                  HBH Dashboard
                </h4>
              </div>
              <div className="w-1/2 md:w-1/6 flex justify-center mt-3 md:mt-0">
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full bg-gray-900  py-2 rounded-lg hover:bg-gray-700 transition shadow-md cursor-pointer"
                >
                  <p className="!leading-none !text-white !m-0 !italic !font-semibold !opacity-100">
                    {isLoading ? "Logging out..." : "Logout"}
                  </p>
                </button>
              </div>
            </header>
          </div>

          <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col relative">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-4xl !font-black !text-gray-900 !italic underline">
                  Profile
                </h3>
                <p
                  className="inline-block px-6 py-2 sm:px-5 sm:py-1.5 xs:px-4 xs:py-1 
                    !text-sm xs:!text-xs !font-semibold !tracking-wide 
                 bg-gray-50 !text-gray-700 rounded-full border border-gray-200 
                shadow-sm hover:shadow-md transition-all duration-300 uppercase !opacity-100"
                >
                  {user?.role}
                </p>
              </div>

              <div className="flex flex-col items-center mb-6">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYRYThvhDcy28VrH3k-SC0Cn2K5FHYV_D3JQ&s"
                  alt="Profile Picture"
                  className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-md object-cover"
                />
                <p className="!mt-6 !text-lg !font-semibold !opacity-100 !text-gray-900 !leading-none">
                  {user?.name}
                </p>
                <p className="!text-sm !text-gray-500 !opacity-100 !leading-none">
                  {user?.roll || <span className="text-gray-400">N/A</span>}
                </p>
              </div>

              <div className="space-y-5 text-gray-700 text-base flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Phone:</span>
                  <span className="text-gray-600">{user?.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Email:</span>
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Room No:</span>
                  <span className="text-gray-600">{user?.room}</span>
                </div>
              </div>

              <div className="w-full">
                <button
                  onClick={() => setIsOpen(true)}
                  className="mt-8 w-full bg-gray-900 !text-white  py-3 rounded-lg hover:bg-gray-700 transition shadow-md cursor-pointer "
                >
                  <p className="!m-0 !leading-none !text-lg !text-white !font-semibold !italic !opacity-100">
                    Edit Profile
                  </p>
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
                        onSubmit={handleEditFormSubmit}
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
                            onChange={handleEditFormChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
                            placeholder="Enter Your Name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            value={editProfileForm.phone}
                            type="text"
                            name="phone"
                            onChange={handleEditFormChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
                            placeholder="Enter Your Phone Number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Room No
                          </label>
                          <input
                            value={editProfileForm.room}
                            type="text"
                            name="room"
                            onChange={handleEditFormChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
                            placeholder="Enter Your Room Number"
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

            <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-100 lg:col-span-2">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight !italic underline ">
                Notice Board
              </h3>

              <div className="mb-4 flex justify-end">
                <button className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:bg-gray-200 transition-all duration-300 cursor-pointer text-lg">
                  + Add Notice
                </button>
              </div>

              <ul className="space-y-6 text-gray-700 text-base max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <ul className="space-y-4">
                  {allNotices.map(
                    (notice, index) =>
                      index < 10 && (
                        <li
                          key={notice._id || index}
                          className="bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-all duration-300 relative"
                        >
                          {(user.role === "admin" ||
                            user.role === "super-admin") && (
                            <button
                              onClick={() => {
                                setSelectedNotice(notice);
                                setShowConfirm(true);
                              }}
                              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18 18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}

                          <p className="!text-3xl !font-semibold !text-gray-900 !mb-3 !text-left">
                            {notice.title}
                          </p>
                          <p className="!text-gray-500 !text-sm !leading-relaxed !mb-3 !text-left ml-6">
                            Dated on:{" "}
                            <span className="!font-medium">{notice.date}</span>
                          </p>

                          <p className="!text-gray-700 !text-base !leading-relaxed !text-left ml-6 !mb-4">
                            {notice.description}
                          </p>

                          <p className="!text-gray-900 !text-lg !leading-relaxed !text-right !font-semibold">
                            - {notice.author}
                          </p>
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
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 lg:col-span-3">
              <h3 className="text-2xl !font-black text-gray-900 mb-10 tracking-tight !italic underline">
                Features
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="flex flex-col space-y-4 my-6">
                  <button
                    onClick={() => setActiveFeature("statistics")}
                    className={`w-full cursor-pointer px-5 py-3.5 rounded-xl font-semibold text-left border transition-all duration-300
                    ${
                      activeFeature === "statistics"
                        ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-[1.02]"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200"
                    } hover:shadow-md hover:scale-[1.01]`}
                  >
                    View Statistics
                  </button>
                  <button
                    onClick={() => setActiveFeature("complaints")}
                    className={`w-full cursor-pointer px-5 py-3.5 rounded-xl font-semibold text-left border transition-all duration-300
                    ${
                      activeFeature === "complaints"
                        ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-[1.02]"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200"
                    } hover:shadow-md hover:scale-[1.01]`}
                  >
                    Manage Complaints
                  </button>
                  <button
                    onClick={() => setActiveFeature("searchStudent")}
                    className={`w-full cursor-pointer px-5 py-3.5 rounded-xl font-semibold text-left border transition-all duration-300
                    ${
                      activeFeature === "searchStudent"
                        ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-[1.02]"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200"
                    } hover:shadow-md hover:scale-[1.01]`}
                  >
                    Student Records
                  </button>

                  <button
                    onClick={() => setActiveFeature("mess")}
                    className={`w-full cursor-pointer px-5 py-3.5 rounded-xl font-semibold text-left border transition-all duration-300
                    ${
                      activeFeature === "mess"
                        ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-[1.02]"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200"
                    } hover:shadow-md hover:scale-[1.01]`}
                  >
                    Today’s Mess Menu
                  </button>
                </div>

                <div className="lg:col-span-3 bg-gray-50 rounded-2xl border border-gray-100 p-6 shadow-inner">
                  {activeFeature === "statistics" && (
                    <div className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 max-w-5xl mx-auto">
                      <h3 className="!text-3xl sm:!text-4xl !font-semibold text-gray-900 text-center mb-8 sm:mb-12">
                        Statistics
                      </h3>

                      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm transition-all duration-300 text-center mb-8 sm:mb-10">
                        <h3 className="!text-lg sm:!text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
                          Total Students
                        </h3>
                        <p className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                          1200
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
                              350
                            </p>
                          </div>

                          <div className="p-4 sm:p-6 text-center">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              Resolved
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                              220
                            </p>
                          </div>

                          <div className="p-4 sm:p-6 text-center">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              Pending
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                              90
                            </p>
                          </div>

                          <div className="p-4 sm:p-6 text-center">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              Rejected
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                              40
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === "complaints" && (
                    <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-10 max-w-4xl mx-auto">
                      <h3 className="!text-3xl sm:!text-4xl !font-semibold text-gray-900 text-center mb-8">
                        Complaint Register
                      </h3>
                      <div className="mb-6 flex flex-col gap-4 sm:gap-6">
                        {/* Filters Container */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-4">
                          {/* Status Filter */}
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

                          {/* Category Filter */}
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

                          {/* Clear Filters Button */}
                          {(selectedStatusFilter || selectedCategoryFilter) && (
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

                        {/* Active Filters Display (Mobile) */}
                        {(selectedStatusFilter || selectedCategoryFilter) && (
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
                          </div>
                        )}
                      </div>
                      <div className="relative my-8 sm:my-10">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 sm:px-4 bg-white text-gray-400 text-xs sm:text-sm font-medium">
                            {selectedStatusFilter || selectedCategoryFilter
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
                                {selectedStatusFilter || selectedCategoryFilter
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
                                    <h3 className="text-lg sm:text-xl lg:!text-2xl !font-bold !text-gray-900 !tracking-tight !leading-snug">
                                      Complaint #{complaint.serial}
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
                                        ✓ Resolved
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
                                        ✗ Rejected
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
                    <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-10 max-w-4xl mx-auto space-y-8">
                      <h3 className="!text-4xl !font-semibold text-gray-900 text-center">
                        Search Student
                      </h3>

                      {/* Search Bar */}
                      <div className="flex justify-center">
                        <div className="relative w-full sm:w-2/3">
                          <input
                            type="text"
                            placeholder="Enter Roll Number"
                            className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 placeholder-gray-400 transition-all duration-300"
                            onChange={handleRollSearchText}
                            value={searchRollNumber}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Example Student Details */}
                      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-lg mx-auto p-8 sm:p-10 space-y-6 relative">
                        {/* Top Accent */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gray-200 rounded-full"></div>

                        {/* Header */}
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold shadow-inner">
                            {studentDetails?.name?.charAt(0) || (
                              <span className="text-gray-400">JD</span>
                            )}
                          </div>
                          <p className="text-gray-900 !font-extrabold text-2xl sm:text-3xl">
                            {studentDetails?.name || (
                              <span className="text-gray-400">Jane Doe</span>
                            )}
                          </p>
                          <p className="text-gray-700 !font-medium text-base sm:text-lg">
                            Roll No:{" "}
                            {studentDetails?.roll || (
                              <span className="text-gray-400">1769</span>
                            )}
                          </p>
                        </div>

                        {/* Info Sections */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="bg-gray-50 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition">
                            <p className="!font-medium text-gray-900 mb-1">
                              Room No
                            </p>
                            <p className="!text-base text-gray-700">
                              {studentDetails?.room || (
                                <span className="text-gray-400">509</span>
                              )}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition">
                            <p className="!font-medium text-gray-900 mb-1">
                              Father Name
                            </p>
                            <p className="!text-base text-gray-700">
                              {studentDetails?.fatherName || (
                                <span className="text-gray-400">Mr. Sam</span>
                              )}
                            </p>
                          </div>

                          <div className="bg-blue-50 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition">
                            <p className="!font-medium text-blue-700 mb-1">
                              CGPA
                            </p>
                            <p className="!text-base text-blue-800 font-semibold">
                              {studentDetails?.cgpi || (
                                <span className="text-gray-400">8.9</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-gray-500 text-sm mt-2 tracking-wide">
                          Academic Details Overview
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === "mess" && (
                    <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-10 max-w-4xl mx-auto">
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
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
