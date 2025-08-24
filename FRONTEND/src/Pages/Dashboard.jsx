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
          <div className="flex justify-center">
            <header className="bg-white/80 w-[100%] backdrop-blur-md border-b border-gray-200 shadow-sm px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between rounded-b-2xl mx-auto">
              <div className="flex items-center gap-6">
                <h4 className="text-5xl !font-light text-gray-900 leading-tight">
                  HBH Dashboard
                </h4>
              </div>
              <div className="w-full md:w-1/3 gap-3 flex justify-end mt-3 md:mt-0">
                {user.role !== "student" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="mt-2 w-full bg-gray-900  py-2 rounded-lg hover:bg-gray-700 transition shadow-md cursor-pointer">
                    <p className="!leading-none !text-white !m-0 !italic !font-semibold !opacity-100">
                      Go to Admin Dashboard
                    </p>
                  </button>)
                }
                <button
                  onClick={handleLogout}
                  className="mt-2 w-1/2 bg-gray-900  py-2 rounded-lg hover:bg-gray-700 transition shadow-md cursor-pointer"
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
                  {user.role || "Boarder"}
                </p>
              </div>

              <div className="flex flex-col items-center mb-6">
                <img
                  src={
                    user.profilePicture
                      ? user.profilePicture
                      : "https://static.vecteezy.com/system/resources/thumbnails/020/911/740/small_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                  }
                  alt="Profile Picture"
                  className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-md object-cover"
                />
                <p className="!mt-6 !text-lg !font-semibold !opacity-100 !text-gray-900 !leading-none">
                  {user.name}
                </p>
                <p className="!text-sm !text-gray-500 !opacity-100 !leading-none">
                  {user.roll}
                </p>
              </div>

              <div className="space-y-5 text-gray-700 text-base flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Phone:</span>
                  <span className="text-gray-600">{user.phone || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Email:</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Room No:</span>
                  <span className="text-gray-600">{user.room || "N/A"}</span>
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

                      <form onSubmit={handleEditProfile} className="space-y-6">
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

            <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-100 lg:col-span-2">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight !italic underline ">
                Notice Board
              </h3>
              <ul className="space-y-6 text-gray-700 text-base max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <ul className="space-y-4">
                  {allNotices.map(
                    (notice, idx) =>
                      idx < 10 && (
                        <li
                          key={notice._id}
                          className="bg-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all"
                        >
                          <p className="!text-3xl !font-light !text-gray-900 !text-left">
                            {notice.title}
                          </p>
                          <p className="!text-gray-600 !text-sm !leading-relaxed !text-left ml-6 !opacity-100">
                            Dated on:{" "}
                            <span>
                              {new Date(notice.date).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="!text-gray-600 !text-sm !leading-relaxed !text-left ml-6 !opacity-100">
                            {notice.description}
                          </p>
                          <p className="!text-gray-900 !text-lg !leading-relaxed !text-right !font-semibold">
                            - {notice.author}
                          </p>
                        </li>
                      )
                  )}
                </ul>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 lg:col-span-3">
              <h3 className="text-2xl !font-black text-gray-900 mb-10 tracking-tight !italic underline">
                Features
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="flex flex-col space-y-4 mt-6">
                  <button
                    onClick={() => setActiveFeature("complaints")}
                    className={`w-full cursor-pointer px-5 py-3.5 rounded-xl font-semibold text-left border transition-all duration-300
                    ${
                      activeFeature === "complaints"
                        ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-[1.02]"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200"
                    } hover:shadow-md hover:scale-[1.01]`}
                  >
                    Register a Complaint
                  </button>

                  <button
                    onClick={() => setActiveFeature("mess")}
                    className={`w-full cursor-pointer mt-3 px-5 py-3.5 rounded-xl font-semibold text-left border transition-all duration-300
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
                  {activeFeature === "complaints" && (
                    <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-10 max-w-4xl mx-auto">
                      <h3 className="!text-3xl sm:!text-4xl !font-semibold text-gray-900 text-center mb-8">
                        Complaint Register
                      </h3>

                      <form className="space-y-5" onSubmit={handleAddComplaint}>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            Name
                          </label>
                          <input
                            name="name"
                            value={complaintForm.name}
                            readOnly
                            type="text"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            Room No.
                          </label>
                          <input
                            name="room"
                            value={complaintForm.room}
                            onChange={handleFormDataChange}
                            type="text"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2"
                            placeholder="Enter Your Room Number"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            Type
                          </label>
                          <select
                            name="category"
                            value={complaintForm.category}
                            onChange={handleFormDataChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-2"
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
                          <label className="block text-gray-700 font-medium mb-1">
                            Short Description
                          </label>
                          <input
                            name="title"
                            value={complaintForm.title}
                            onChange={handleFormDataChange}
                            type="text"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2"
                            placeholder="Describe The Issue In One Line..."
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={complaintForm.description}
                            onChange={handleFormDataChange}
                            rows="3"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2"
                            placeholder="Describe The Issue In Detail..."
                          ></textarea>
                        </div>
                        <p className="text-red-700 !italic">{formError}</p>

                        <button
                          type="submit"
                          className="w-full cursor-pointer bg-gray-900 text-white font-semibold py-2.5 rounded-xl"
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
                        <div className="relative flex justify-center">
                          <span className="px-3 sm:px-4 bg-white text-gray-400 text-xs sm:text-sm font-medium">
                            Your Complaints
                          </span>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
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
                                  <td className="p-3 sm:p-4">
                                    {complaint?.status || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="sm:hidden space-y-4">
                          {myComplaints?.map((complaint, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg shadow border border-gray-200 p-4"
                            >
                              <p className="text-sm font-semibold text-gray-900 mb-2">
                                Complaint #{index + 1}
                              </p>
                              <div className="space-y-1 text-sm text-gray-700">
                                <p>
                                  <span className="font-medium">Room:</span>{" "}
                                  {complaint?.room || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Category:</span>{" "}
                                  {complaint?.category || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Dated On:</span>{" "}
                                  {complaint?.date || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Description:
                                  </span>{" "}
                                  {complaint?.title || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Status:</span>{" "}
                                  {complaint?.status || "N/A"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === "mess" && (
                    <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-10 max-w-2xl mx-auto">
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
    </>
  );
};

export default Dashboard;
