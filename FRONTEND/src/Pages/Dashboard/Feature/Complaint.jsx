 import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { API_PATHS } from "../../../../Utils/apiPaths";
import axiosInstance from "../../../../Utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Hostel from "./KnowYourHostel"

const Complaint = () => {
  const navigate = useNavigate();
  const { logout, isLoading, error, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("complaints");
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
    <>
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
                          {localIsLoading
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
                                  <td
                                    className={`p-3 sm:p-4  ${
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
                                    {complaint?.status || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="sm:hidden space-y-4 p-3">
                          {myComplaints?.map((complaint, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
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

                              <div className="p-4 space-y-4">
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

                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                                    Category
                                  </span>
                                  <p className="text-sm font-semibold text-gray-800 mt-1">
                                    {complaint?.category || "N/A"}
                                  </p>
                                </div>

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
    </>
)
}
export default Complaint