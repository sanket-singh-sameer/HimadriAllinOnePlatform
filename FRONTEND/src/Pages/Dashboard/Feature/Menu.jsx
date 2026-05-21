import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { API_PATHS } from "../../../../Utils/apiPaths";
import axiosInstance from "../../../../Utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Menu= () => {
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
  const [activeFeature, setActiveFeature] = useState("mess");
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
 <div className="w-full space-y-6 max-w-6xl mx-auto">
                      {/* Header Section */}
                      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border-2 border-gray-700 p-8 sm:p-10">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                          <div className="text-center lg:text-left">
                            <h2 className="!text-3xl sm:!text-4xl lg:!text-5xl !font-extrabold !text-white !mb-3">
                              Today's Mess Menu
                            </h2>
                            <p className="!text-base sm:!text-lg !text-gray-300 !font-medium">
                              Daily meal schedule for hostel residents
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-1 bg-gray-600 hidden lg:block"></div>
                            <div className="bg-white rounded-xl px-8 py-4 shadow-lg border-2 border-gray-200">
                              <p className="!text-xs !font-bold !text-gray-500 uppercase tracking-widest !mb-1">
                                Current Day
                              </p>
                              <p className="!text-2xl sm:!text-3xl !font-black !text-gray-900">
                                {todaysMenu?.day || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mess Menu Table */}
                      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-900">
                                <th className="px-6 py-4 text-left !text-sm !font-bold !text-white uppercase tracking-wider w-1/4 border-r border-gray-700">
                                  Meal Time
                                </th>
                                <th className="px-6 py-4 text-left !text-sm !font-bold !text-white uppercase tracking-wider">
                                  Menu Items
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-5 !text-base !font-bold !text-gray-900 bg-gray-50 border-r border-gray-200">
                                  Breakfast
                                </td>
                                <td className="px-6 py-5 !text-base !text-gray-700 leading-relaxed">
                                  {todaysMenu?.breakfast || "N/A"}
                                </td>
                              </tr>
                              <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-5 !text-base !font-bold !text-gray-900 bg-gray-50 border-r border-gray-200">
                                  Lunch
                                </td>
                                <td className="px-6 py-5 !text-base !text-gray-700 leading-relaxed">
                                  {todaysMenu?.lunch || "N/A"}
                                </td>
                              </tr>
                              <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-5 !text-base !font-bold !text-gray-900 bg-gray-50 border-r border-gray-200">
                                  Snacks
                                </td>
                                <td className="px-6 py-5 !text-base !text-gray-700 leading-relaxed">
                                  {todaysMenu?.snacks || "N/A"}
                                </td>
                              </tr>
                              <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-5 !text-base !font-bold !text-gray-900 bg-gray-50 border-r border-gray-200">
                                  Dinner
                                </td>
                                <td className="px-6 py-5 !text-base !text-gray-700 leading-relaxed">
                                  {todaysMenu?.dinner || "N/A"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-200">
                          <div className="p-5 bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="!text-lg !font-bold !text-gray-900">
                                Breakfast
                              </h3>
                            </div>
                            <p className="!text-sm !text-gray-700 leading-relaxed">
                              {todaysMenu?.breakfast || "N/A"}
                            </p>
                          </div>

                          <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="!text-lg !font-bold !text-gray-900">
                                Lunch
                              </h3>
                            </div>
                            <p className="!text-sm !text-gray-700 leading-relaxed">
                              {todaysMenu?.lunch || "N/A"}
                            </p>
                          </div>

                          <div className="p-5 bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="!text-lg !font-bold !text-gray-900">
                                Snacks
                              </h3>
                            </div>
                            <p className="!text-sm !text-gray-700 leading-relaxed">
                              {todaysMenu?.snacks || "N/A"}
                            </p>
                          </div>

                          <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="!text-lg !font-bold !text-gray-900">
                                Dinner
                              </h3>
                            </div>
                            <p className="!text-sm !text-gray-700 leading-relaxed">
                              {todaysMenu?.dinner || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Info Footer */}
                      <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-5 sm:p-6">
                        <p className="!text-sm !font-semibold !text-gray-900 mb-2">
                          Important Information
                        </p>
                        <p className="!text-xs sm:!text-sm !text-gray-600 leading-relaxed">
                          The menu is subject to change based on availability.
                          For any dietary concerns or special requests, please
                          contact the mess committee.
                        </p>
                      </div>
                    </div>
</>
  )
}

export default Menu