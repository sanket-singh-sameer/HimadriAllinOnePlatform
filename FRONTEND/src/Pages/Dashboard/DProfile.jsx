import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_PATHS } from "../../../Utils/apiPaths";
import axiosInstance from "../../../Utils/axiosInstance";
import { toast } from "react-toastify";

const Profile = () => {
  // ============================================
  // STATE VARIABLES
  // ============================================

  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Loading & Error State
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  // Form State
  const [editProfileForm, setEditProfileForm] = useState({
    name: "",
    room: "",
    phone: "",
  });

  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { user } = useAuthStore();

  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle change password form input changes
   */
  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({ ...prev, [name]: value }));
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
        toast.success(response.data.message || "Profile updated successfully");
        setIsOpen(false);
        setActiveTab("profile");
        // Refresh user data
        const userResponse = await axiosInstance.get(API_PATHS.CHECK_AUTH);
        if (userResponse.status === 200) {
          useAuthStore.setState({ user: userResponse.data.user });
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating profile";
      toast.error(errorMessage);
      console.error("Error updating profile:", error);
    } finally {
      setLocalIsLoading(false);
    }
  };

  /**
   * Handle change password submission
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLocalIsLoading(true);
    setPasswordError(null);

    // Validation
    if (
      changePasswordForm.newPassword !== changePasswordForm.confirmPassword
    ) {
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
        setIsOpen(false);
        setActiveTab("profile");
        setChangePasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error changing password";
      setPasswordError(errorMessage);
      console.error("Error changing password:", error);
    } finally {
      setLocalIsLoading(false);
    }
  };

  
  const closeModal = () => {
    setIsOpen(false);
    setActiveTab("profile");
    setPasswordError(null);
    setChangePasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };


  useEffect(() => {
    if (user) {
      setEditProfileForm({
        name: user.name || "",
        room: user.room || "",
        phone: user.phone || "",
      });
    }
  }, [user]);


  return (
<>
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
                              onSubmit={handleEditProfile}
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
                                    type="number"
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
</>
  )
}

export default Profile