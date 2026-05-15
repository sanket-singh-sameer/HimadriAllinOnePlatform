import React, { useState, useEffect } from "react";
import { API_PATHS } from "../../../../Utils/apiPaths";
import axiosInstance from "../../../../Utils/axiosInstance";
import { useAuthStore } from "../../../store/authStore";
// import { set } from "mongoose";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Notice() {
const [showConfirm, setShowConfirm] = useState(false);
   const [showAddNoticeForm, setShowAddNoticeForm] = useState(false);
 const [selectedNotice, setSelectedNotice] = useState(null);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [localIsLoadingResolved, setLocalIsLoadingResolved] = useState(false);
  const [localIsLoadingRejected, setLocalIsLoadingRejected] = useState(false);
  const [localIsLoadingPending, setLocalIsLoadingPending] = useState(false);

const [noticeForm, setNoticeForm] = useState({
    title: "",
    description: "",
    media: null,
  });
   const { logout, isLoading, error, user } = useAuthStore();
  const [allNotices, setAllNotices] = useState([]);
 
  const handleNoticeFormChange = (e) => {
    const { name, value } = e.target;
    setNoticeForm((prev) => ({ ...prev, [name]: value }));
  };

const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
  const handleAddNewNoticeForm = async (e) => {
    e.preventDefault();
    setLocalIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", noticeForm.title);
      formData.append("description", noticeForm.description);

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
    const removeMedia = () => {
    setNoticeForm((prev) => ({ ...prev, media: null }));
    const fileInput = document.getElementById("media-upload");
    if (fileInput) fileInput.value = "";
  };


  const COLORS = ["#4ade80", "#f87171"];

  return(
    
    <>
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
