
    import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { API_PATHS } from "../../../../Utils/apiPaths";
import axiosInstance from "../../../../Utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const KnowYourHostel = () => {
  const navigate = useNavigate();
  const { logout, isLoading, error, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("knowYourHostel");
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
  const [activeFeature, setActiveFeature] = useState("knowYourHostel");
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

    return(
    <div className="w-full bg-gradient-to-br from-white via-gray-50 to-white rounded-lg sm:rounded-xl lg:rounded-2xl xl:rounded-3xl shadow-xl border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10 relative overflow-hidden">
                      <button
                        onClick={() =>
                          window.open(
                            "https://github.com/sanket-singh-sameer/HimadriAllinOnePlatform/raw/refs/heads/main/FRONTEND/public/hostel-booklet-pdf.pdf",
                            "_blank"
                          )
                        }
                        className="absolute top-2 sm:top-3 md:top-4 lg:top-6 xl:top-8 right-2 sm:right-3 md:right-4 lg:right-6 xl:right-8 z-10 group bg-white text-gray-900 hover:bg-gray-100 hover:shadow-lg px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300 font-medium sm:font-semibold text-xs sm:text-sm md:text-base lg:text-lg tracking-wide border border-gray-300 sm:border-2 sm:border-gray-900 hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-1.5 md:gap-2 cursor-pointer shadow-sm sm:shadow-md"
                      >
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:rotate-12 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <span className="hidden sm:inline md:text-sm lg:text-base whitespace-nowrap">
                          Download Hostel Booklet
                        </span>
                        <span className="sm:hidden text-xs">Booklet</span>
                      </button>{" "}
                      <div className="relative text-center space-y-2 sm:space-y-3 pt-12 sm:pt-14 md:pt-16 lg:pt-18 xl:pt-20">
                        <h3 className="!text-xl sm:!text-2xl md:!text-3xl lg:!text-4xl xl:!text-5xl !font-black  !text-gray-900  tracking-tight  leading-none px-2 sm:px-0">
                          Himadri Boys Hostel
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                        <div className="relative group order-1 xl:order-1">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <img
                            src="/HBH-01-img.jpg "
                            alt="Himadri Boys Hostel"
                            className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96 object-cover rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-white group-hover:scale-[1.02] transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl sm:rounded-3xl"></div>
                        </div>

                        <div className="space-y-4 sm:space-y-6 order-2 xl:order-2">
                          <h3 className="!text-lg sm:!text-xl md:!text-2xl lg:!text-3xl !font-bold !text-gray-900  tracking-tight text-center sm:!text-left">
                            About Our Hostel
                          </h3>
                          <p className="!text-sm sm:!text-base lg:!text-lg !text-gray-700  !leading-relaxed  !font-normal text-center sm:!text-left px-2 sm:px-0">
                            Himadri Boys Hostel, operational since 2013,
                            accommodates ~710 students in 82 triple and 116
                            four-seater rooms across seven elevator-accessible
                            floors. It has a dining hall with a deep freezer,
                            geyser-equipped bathrooms, water coolers, and
                            high-speed Wi-Fi. Facilities include a common hall
                            with LED TV, a recreation hall for badminton/table
                            tennis, and three guest rooms. Outdoor courts for
                            volleyball and basketball are nearby.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-300">
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
                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="!text-lg sm:!text-2xl !font-bold !text-blue-700  !leading-none">
                                    500+
                                  </p>
                                  <p className="!text-xs !text-blue-600  !font-semibold  uppercase tracking-wide">
                                    Students
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="group bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-300">
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
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="!text-lg sm:!text-2xl !font-bold !text-green-700  !leading-none">
                                    200+
                                  </p>
                                  <p className="!text-xs !text-green-600  !font-semibold  uppercase tracking-wide">
                                    Rooms
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-300">
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
                                <div>
                                  <p className="!text-lg sm:!text-2xl !font-bold !text-purple-700  !leading-none">
                                    24/7
                                  </p>
                                  <p className="!text-xs !text-purple-600  !font-semibold  uppercase tracking-wide">
                                    Support
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-inner">
                        <h3 className="!text-lg sm:!text-xl md:!text-2xl !font-bold  !text-gray-900  text-center mb-6 sm:mb-8 tracking-tight px-2 sm:px-0">
                          World-Class Facilities
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                          {[
                            {
                              icon: "📶",
                              title: "High-Speed Wi-Fi",
                              desc: "24/7 Internet",
                            },
                            {
                              icon: "🏋️‍♂️",
                              title: "Indoor Sports",
                              desc: "Badminton & Table Tennis",
                            },
                            {
                              icon: "📺",
                              title: "Common Room",
                              desc: "TV & Games",
                            },
                            {
                              icon: "🍽️",
                              title: "Mess",
                              desc: "Veg & Non-Veg",
                            },
                            {
                              icon: "📚",
                              title: "Study Rooms",
                              desc: "Quiet Spaces",
                            },
                            {
                              icon: "🔐",
                              title: "24/7 Security",
                              desc: "Safe Environment",
                            },
                            {
                              icon: "🧺",
                              title: "Laundry Service",
                              desc: "Convenient Care",
                            },
                            {
                              icon: "🚑",
                              title: "Medical Aid",
                              desc: "Emergency Care",
                            },
                          ].map((facility, index) => (
                            <div
                              key={index}
                              className="group bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
                            >
                              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                                {facility.icon}
                              </div>
                              <h3 className="!text-xs sm:!text-sm md:!text-base !font-bold  !text-gray-900  mb-1">
                                {facility.title}
                              </h3>
                              <p className="!text-xs !text-gray-600  !font-medium ">
                                {facility.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl border border-gray-700 p-4 sm:p-6 lg:p-8 shadow-2xl text-white">
                        <div className="text-center mb-6 sm:mb-8">
                          <h3 className="!text-lg sm:!text-xl md:!text-2xl lg:!text-3xl !font-bold  !text-white  mb-2 sm:mb-3 tracking-tight px-2 sm:px-0">
                            Important Contacts
                          </h3>

                          <p className="!text-sm !text-gray-300  mt-2 sm:mt-3 !font-medium px-2 sm:px-0">
                            Dedicated hostel staff available for your assistance
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="group bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-300">
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
                              <div>
                                <h3 className="!text-base sm:!text-lg !font-bold !text-left  !text-white  tracking-tight ">
                                  Warden
                                </h3>
                                <p className="!text-xs sm:!text-sm !text-blue-300  !font-medium ">
                                  Chief Administrator
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <p className="!text-sm sm:!text-base !text-gray-200 !text-left  !font-semibold ">
                                Dr. Vivek Tiwari
                              </p>
                              <p className="!text-xs sm:!text-sm !text-gray-300  flex items-center space-x-2">
                                <span>📞</span>
                                <span className="!font-mono ">
                                  +91 9456026603
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="group bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-300">
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="!text-base sm:!text-lg !font-bold  !text-white !text-left  tracking-tight ">
                                  Assistant Warden
                                </h3>
                                <p className="!text-xs sm:!text-sm !text-green-300 !text-left  !font-medium ">
                                  Student Affairs
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <p className="!text-sm sm:!text-base !text-gray-200 !text-left  !font-semibold ">
                                Dr. Aman Kumar
                              </p>
                              <p className="!text-xs sm:!text-sm !text-gray-300  flex items-center space-x-2">
                                <span>📞</span>
                                <span className="!font-mono ">
                                  +91 7307364773
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                    export default KnowYourHostel 