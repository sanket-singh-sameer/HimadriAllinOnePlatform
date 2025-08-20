import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { API_PATHS } from "../../Utils/apiPaths";
import axiosInstance from "../../Utils/axiosInstance";

const Dashboard = () => {
  const { logout, isLoading, error, user } = useAuthStore();
  const [formLoading, setFormLoading] = useState(false);
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

  const fetchTodaysMenu = async () => {
    try {
      const todaysMenu = await axiosInstance.get(API_PATHS.FETCH_TODAYS_MENU);
      setTodaysMenu(todaysMenu.data);
    } catch (error) {
      console.error("Error fetching today's menu:", error);
    }
  };

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setComplaintForm((prev) => ({ ...prev, [name]: value }));
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

  useEffect(() => {
    fetchTodaysMenu();
    fetchMyComplaint();
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

              <button
                disabled
                className="mt-8 w-full bg-gray-300 text-gray-500 py-2.5 rounded-lg cursor-not-allowed shadow-inner"
              >
                Edit Profile
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-100 lg:col-span-2">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight !italic underline ">
                Notice Board
              </h3>
              <ul className="space-y-6 text-gray-700 text-base"></ul>
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
                            placeholder="Enter your room number"
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
                            placeholder="Describe the issue in one line..."
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
                            placeholder="Describe the issue in detail..."
                          ></textarea>
                        </div>
                        <p className="text-red-500">{formError}</p>

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
                        <table className="w-full min-w-[600px] border-collapse text-left text-gray-700 text-sm sm:text-base">
                          <thead>
                            <tr className="bg-gray-100 text-gray-900 font-semibold">
                              <th className="p-3 sm:p-4">Serial No</th>
                              <th className="p-3 sm:p-4">Room</th>
                              <th className="p-3 sm:p-4">Category</th>
                              <th className="p-3 sm:p-4">Dated On</th>
                              <th className="p-3 sm:p-4">Short Description</th>
                              <th className="p-3 sm:p-4">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myComplaints?.map((complaint, index) => {
                              return (
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
                              );
                            })}
                          </tbody>
                        </table>
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
                          <span className="text-gray-600 text-base max-w-xs text-right leading-relaxed !text-center md:!text-right">
                            {todaysMenu?.breakfast || "N/A"}
                          </span>
                        </div>

                        <div className="py-5 flex flex-col md:flex-row justify-between items-center">
                          <p className="!text-lg !font-semibold !text-gray-900">
                            Lunch
                          </p>
                          <span className="text-gray-600 text-base max-w-xs text-right leading-relaxed">
                            {todaysMenu?.lunch || "N/A"}
                          </span>
                        </div>

                        <div className="py-5 flex flex-col md:flex-row justify-between items-center">
                          <p className="!text-lg !font-semibold !text-gray-900">
                            Snacks
                          </p>
                          <span className="text-gray-600 text-base max-w-xs text-right leading-relaxed">
                            {todaysMenu?.snacks || "N/A"}
                          </span>
                        </div>

                        <div className="py-5 flex flex-col md:flex-row justify-between items-center">
                          <p className="!text-lg !font-semibold !text-gray-900">
                            Dinner
                          </p>
                          <span className="text-gray-600 text-base max-w-xs text-right leading-relaxed">
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
