import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { API_PATHS } from "../../../../Utils/apiPaths";
import axiosInstance from "../../../../Utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const OutPass= () => {
  const navigate = useNavigate();
  const { logout, isLoading, error, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [allNotices, setAllNotices] = useState([]);
  const [searchRollNumber, setSearchRollNumber] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);

  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [outpassForm, setOutpassForm] = useState({
    name: user.name || "",
    email: user.email || "",
    rollNumber: user.roll || "",
    semester: "",
    roomNumber: user.room || "",
    placeOfVisit: "",
    purpose: "",
    outDate: "",
    outTime: "",
    expectedReturnDate: "",
    expectedReturnTime: "",
    studentContact: user.phone || "",
    parentContact: "",
    parentName: "",
    emergencyContact: "",
  });

  const [formError, setFormError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [todaysMenu, setTodaysMenu] = useState(null);
  const [myComplaints, setMyComplaints] = useState(null);
  const [activeFeature, setActiveFeature] = useState("outpass");
  const [myOutpasses, setMyOutpasses] = useState([]);
  const [outpassFilter, setOutpassFilter] = useState("All");
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
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  //Outpass form ke liye
  const handleOutpassFormChange = (e) => {
    const { name, value } = e.target;
    setOutpassForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOutpass = async (e) => {
    e.preventDefault();
    setLocalIsLoading(true);

    try {
      const outpassData = {
        fullName: outpassForm.name,
        email: outpassForm.email,
        rollNumber: outpassForm.rollNumber,
        semester: outpassForm.semester,
        roomNumber: outpassForm.roomNumber,
        placeOfVisit: outpassForm.placeOfVisit,
        outDate: outpassForm.outDate,
        outTime: outpassForm.outTime,
        expectedReturnTime: outpassForm.expectedReturnTime,
        studentContact: outpassForm.studentContact,
        emergencyContact: outpassForm.emergencyContact,
      };

      const response = await axiosInstance.post(
        API_PATHS.SUBMIT_OUTPASS,
        outpassData
      );

      if (response.status === 201) {
        toast.success("Outpass request submitted successfully!");

        // Reset form
        setOutpassForm({
          name: user.name || "",
          email: user.email || "",
          rollNumber: user.roll || "",
          semester: "",
          roomNumber: user.room || "",
          placeOfVisit: "",
          purpose: "",
          outDate: "",
          outTime: "",
          expectedReturnDate: "",
          expectedReturnTime: "",
          studentContact: user.phone || "",
          parentContact: "",
          parentName: "",
          emergencyContact: "",
        });

        // Refresh outpasses list
        fetchMyOutpasses();
      }

      setLocalIsLoading(false);
    } catch (error) {
      console.error("Error submitting outpass:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit outpass request";
      toast.error(errorMessage);
      setLocalIsLoading(false);
    }
  };

  const handleAddComplaint = async (e) => {
    e.preventDefault();
    setLocalIsLoading(true);
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
      setLocalIsLoading(false);
      toast.success(response.data.message);
      setFormError(null);
      fetchMyComplaint();
    } catch (error) {
      console.error("Error registering complaint:", error);
      setLocalIsLoading(false);
      toast.error("Error registering complaint");
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

  const fetchMyOutpasses = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GET_MY_OUTPASSES);
      setMyOutpasses(response.data.outpasses || []);
      console.log("My Outpasses:", response.data.outpasses);
    } catch (error) {
      console.error("Error fetching my outpasses:", error);
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
    setLocalIsLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.EDIT_PROFILE,
        editProfileForm
      );
      if (response.status === 200) {
        console.log("Profile updated:", response.data);
      }
      toast.success(response.data.message);
      setIsOpen(false);
      setLocalIsLoading(false);
      fetchUserData();
    } catch (error) {
      toast.error("Error updating profile");
      setIsOpen(false);
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
            cgpi: cgpiData?.cgpi || "N/A",
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

  useEffect(() => {
    fetchTodaysMenu();
    fetchMyComplaint();
    fetchAllNotices();
    fetchMyOutpasses();
  }, []);

  const openImage = (e) => {
    e.preventDefault();
    window.open("/mess-menu-30082025-pdf.pdf", "_blank");
  };

  return (
<>
<div className="w-full bg-gradient-to-br from-white via-gray-50 to-white rounded-lg sm:rounded-xl lg:rounded-2xl xl:rounded-3xl shadow-xl border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 max-w-5xl mx-auto">
                      <div className="text-center mb-6 sm:mb-8 lg:mb-10 space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <h3 className="!text-xl sm:!text-2xl lg:!text-3xl xl:!text-4xl !font-black !text-gray-900 tracking-tight">
                            Outpass Request Form
                          </h3>
                        </div>
                      </div>

                      <form
                        onSubmit={handleSubmitOutpass}
                        className="space-y-5 sm:space-y-6 lg:space-y-8"
                      >
                        <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200">
                          <h6 className="!text-base sm:!text-lg lg:!text-xl !font-bold !text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Personal Information
                          </h6>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                            <div>
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Full Name{" "}
                                <span className="text-gray-900">*</span>
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={outpassForm.name}
                                onChange={handleOutpassFormChange}
                                required
                                readOnly
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base bg-gray-50"
                                placeholder="Enter your full name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Email
                                <span className="text-gray-900">*</span>
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={outpassForm.email}
                                onChange={handleOutpassFormChange}
                                required
                                readOnly
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base bg-gray-50"
                                placeholder="Enter your full name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Roll Number{" "}
                                <span className="text-gray-900">*</span>
                              </label>
                              <input
                                type="text"
                                name="rollNumber"
                                value={outpassForm.rollNumber}
                                onChange={handleOutpassFormChange}
                                required
                                readOnly
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base bg-gray-50"
                                placeholder="Enter your roll number"
                              />
                            </div>

                            <div>
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Semester{" "}
                                <span className="text-gray-900">*</span>
                              </label>
                              <select
                                name="semester"
                                value={outpassForm.semester}
                                onChange={handleOutpassFormChange}
                                required
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base"
                              >
                                <option value="">Select Semester</option>
                                <option value="1">1st Semester</option>
                                <option value="2">2nd Semester</option>
                                <option value="3">3rd Semester</option>
                                <option value="4">4th Semester</option>
                                <option value="5">5th Semester</option>
                                <option value="6">6th Semester</option>
                                <option value="7">7th Semester</option>
                                <option value="8">8th Semester</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Room Number{" "}
                                <span className="text-gray-900">*</span>
                              </label>
                              <input
                                type="text"
                                name="roomNumber"
                                value={outpassForm.roomNumber}
                                onChange={handleOutpassFormChange}
                                required
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base"
                                placeholder="Enter room number"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200">
                          <h6 className="!text-base sm:!text-lg lg:!text-xl !font-bold !text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
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
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Visit Details
                          </h6>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                            <div className="md:col-span-2">
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Place of Visit{" "}
                                <span className="text-gray-900">*</span>
                              </label>
                              <input
                                type="text"
                                name="placeOfVisit"
                                value={outpassForm.placeOfVisit}
                                onChange={handleOutpassFormChange}
                                required
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base"
                                placeholder="Enter destination (e.g., Market)"
                              />
                            </div>

                            <div>
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Out Date{" "}
                                <span className="text-gray-900">*</span>
                              </label>
                              <input
                                type="date"
                                name="outDate"
                                value={outpassForm.outDate}
                                onChange={handleOutpassFormChange}
                                required
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base"
                              />
                            </div>

                            <div>
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Out Time{" "}
                                <span className="text-gray-900">*</span>
                              </label>
                              <input
                                type="time"
                                name="outTime"
                                value={outpassForm.outTime}
                                onChange={handleOutpassFormChange}
                                required
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base"
                              />
                            </div>

                            <div>
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Expected Return Time{" "}
                                <span className="text-gray-900">*</span>
                              </label>
                              <input
                                type="time"
                                name="expectedReturnTime"
                                value={outpassForm.expectedReturnTime}
                                onChange={handleOutpassFormChange}
                                required
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200">
                          <h6 className="!text-base sm:!text-lg lg:!text-xl !font-bold !text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
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
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            Contact Information
                          </h6>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                            <div>
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Student Contact Number{" "}
                                <span className="text-gray-900">*</span>
                              </label>
                              <input
                                type="tel"
                                name="studentContact"
                                value={outpassForm.studentContact}
                                onChange={handleOutpassFormChange}
                                required
                                pattern="[0-9]{10}"
                                maxLength="10"
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base"
                                placeholder="Enter 10-digit mobile number"
                              />
                            </div>

                            <div>
                              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                                Parent's/Emergency Contact Number{" "}
                                <span className="text-gray-900">*</span>
                              </label>
                              <input
                                type="tel"
                                name="emergencyContact"
                                value={outpassForm.emergencyContact}
                                onChange={handleOutpassFormChange}
                                required
                                pattern="[0-9]{10}"
                                maxLength="10"
                                className="w-full border-2 border-gray-300 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base"
                                placeholder="Enter emergency contact number"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 sm:pt-4">
                          <button
                            type="submit"
                            disabled={localIsLoading}
                            className="w-full cursor-pointer group relative bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold py-3.5 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl text-base sm:text-lg lg:text-xl hover:from-gray-800 hover:to-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                          >
                            {localIsLoading ? (
                              <>
                                <svg
                                  className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
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
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                <span>Submitting Request...</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                  />
                                </svg>
                                <span>Submit Outpass Request to Warden</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>

                      {/* My Outpasses Section */}
                      <div className="mt-10 sm:mt-12 lg:mt-16">
                        <div className="relative mb-6 sm:mb-8">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <div className="bg-white px-6 py-2">
                              <h3 className="!text-xl sm:!text-2xl lg:!text-3xl !font-black !text-gray-900 tracking-tight text-center">
                                My Outpasses
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Filter & Refresh Section */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                              Filter by:
                            </label>
                            <select
                              value={outpassFilter}
                              onChange={(e) => setOutpassFilter(e.target.value)}
                              className="flex-1 sm:flex-initial border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none shadow-sm transition-all duration-200 text-sm sm:text-base"
                            >
                              <option value="All">All Outpasses</option>
                              <option value="Pending">🟠 Pending</option>
                              <option value="Approved">🟢 Approved</option>
                              <option value="Rejected">🔴 Rejected</option>
                              <option value="Returned">⚪ Returned</option>
                            </select>
                          </div>

                          <button
                            onClick={fetchMyOutpasses}
                            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <span>Refresh</span>
                          </button>
                        </div>

                        {/* Outpasses Table Container */}
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                          {myOutpasses && myOutpasses.length > 0 ? (
                            <>
                              {/* Desktop Table View */}
                              <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-gray-900 text-white">
                                      <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-gray-700">
                                        Outpass ID
                                      </th>
                                      <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-gray-700">
                                        Place of Visit
                                      </th>
                                      <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-gray-700">
                                        Out Date
                                      </th>
                                      <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-gray-700">
                                        Out Time
                                      </th>
                                      <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-gray-700">
                                        Expected Return
                                      </th>
                                      <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wider">
                                        Status
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {myOutpasses
                                      .filter(
                                        (outpass) =>
                                          outpassFilter === "All" ||
                                          outpass.status === outpassFilter
                                      )
                                      .map((outpass, index) => (
                                        <tr
                                          key={outpass._id || index}
                                          className="hover:bg-gray-50 hover:shadow-lg transition-all duration-300 group"
                                        >
                                          <td className="px-4 py-4 text-sm font-semibold text-gray-900 border-r border-gray-100">
                                            #
                                            {outpass._id
                                              ?.slice(-6)
                                              .toUpperCase() || index + 1}
                                          </td>
                                          <td className="px-4 py-4 text-sm text-gray-700 border-r border-gray-100">
                                            {outpass.placeOfVisit || "N/A"}
                                          </td>
                                          <td className="px-4 py-4 text-sm text-gray-700 border-r border-gray-100">
                                            {outpass.outDate
                                              ? new Date(
                                                  outpass.outDate
                                                ).toLocaleDateString("en-GB")
                                              : "N/A"}
                                          </td>
                                          <td className="px-4 py-4 text-sm text-gray-700 border-r border-gray-100">
                                            {outpass.outTime || "N/A"}
                                          </td>
                                          <td className="px-4 py-4 text-sm text-gray-700 border-r border-gray-100">
                                            {outpass.expectedReturnTime ||
                                              "N/A"}
                                          </td>
                                          <td className="px-4 py-4 text-center">
                                            <span
                                              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                                outpass.status === "Approved"
                                                  ? "bg-green-500 text-white"
                                                  : outpass.status === "Pending"
                                                  ? "bg-yellow-500 text-white"
                                                  : outpass.status ===
                                                    "Rejected"
                                                  ? "bg-red-500 text-white"
                                                  : outpass.status ===
                                                    "Returned"
                                                  ? "bg-gray-400 text-white"
                                                  : "bg-gray-300 text-gray-700"
                                              }`}
                                            >
                                              {outpass.status || "Unknown"}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Mobile/Tablet Card View */}
                              <div className="lg:hidden space-y-4 p-4">
                                {myOutpasses
                                  .filter(
                                    (outpass) =>
                                      outpassFilter === "All" ||
                                      outpass.status === outpassFilter
                                  )
                                  .map((outpass, index) => (
                                    <div
                                      key={outpass._id || index}
                                      className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                                    >
                                      {/* Card Header */}
                                      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                          </svg>
                                          <span className="text-white font-bold text-sm">
                                            #
                                            {outpass._id
                                              ?.slice(-6)
                                              .toUpperCase() || index + 1}
                                          </span>
                                        </div>
                                        <span
                                          className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                                            outpass.status === "Approved"
                                              ? "bg-green-500 text-white"
                                              : outpass.status === "Pending"
                                              ? "bg-yellow-500 text-white"
                                              : outpass.status === "Rejected"
                                              ? "bg-red-500 text-white"
                                              : outpass.status === "Returned"
                                              ? "bg-gray-400 text-white"
                                              : "bg-gray-300 text-gray-700"
                                          }`}
                                        >
                                          {outpass.status || "Unknown"}
                                        </span>
                                      </div>

                                      {/* Card Body */}
                                      <div className="p-4 space-y-3">
                                        <div className="flex items-start gap-3">
                                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                              className="w-5 h-5 text-blue-600"
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
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                              Place of Visit
                                            </p>
                                            <p className="text-base font-bold text-gray-900 mt-0.5">
                                              {outpass.placeOfVisit || "N/A"}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                          <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                                              Out Date
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                              {outpass.outDate
                                                ? new Date(
                                                    outpass.outDate
                                                  ).toLocaleDateString("en-GB")
                                                : "N/A"}
                                            </p>
                                          </div>
                                          <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                                              Out Time
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                              {outpass.outTime || "N/A"}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                                            Expected Return
                                          </p>
                                          <p className="text-sm font-semibold text-gray-900">
                                            {outpass.expectedReturnTime ||
                                              "N/A"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </>
                          ) : (
                            // Empty State
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <h3 className="!text-lg sm:!text-xl !font-bold !text-gray-900 mb-2 text-center">
                                No outpasses requested yet
                              </h3>
                              <p className="!text-sm sm:!text-base !text-gray-600 text-center max-w-md">
                                Submit your first outpass request using the form
                                above to see it here.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Info Note */}
                        {myOutpasses && myOutpasses.length > 0 && (
                          <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start gap-3">
                              <svg
                                className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"
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
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-1">
                                  Outpass Guidelines
                                </p>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  <li>
                                    • Approved outpasses must be shown to
                                    security before leaving the hostel
                                  </li>
                                  <li>
                                    • Return to hostel before the expected
                                    return time mentioned
                                  </li>
                                  <li>
                                    • In case of emergency, contact hostel
                                    warden immediately
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
</>
  )
}

export default OutPass