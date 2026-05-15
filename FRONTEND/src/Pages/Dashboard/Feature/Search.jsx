import React, { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { API_PATHS } from "../../../../Utils/apiPaths";
import axiosInstance from "../../../../Utils/axiosInstance";
import { toast } from "react-toastify";

const Search = () => {
  
  const [searchRollNumber, setSearchRollNumber] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);

  // Loading & Error State
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);


  const { user } = useAuthStore();

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
    setSearchError(null);

    if (rollNumber.trim()) {
      setLocalIsLoading(true);
      try {
        const [student, cgpiData] = await Promise.all([
          getStudentByRoll(rollNumber),
          getCGPIByRoll(rollNumber),
        ]);

        if (student || cgpiData) {
          setStudentDetails({
            name: cgpiData?.name || student?.name || "N/A",
            roll: student?.roll || rollNumber,
            room: student?.room || "N/A",
            phone: student?.phone || "N/A",
            email: student?.email || "N/A",
            role: student?.role || "N/A",
            fatherName: cgpiData?.fName || "N/A",
            cgpi: cgpiData?.cgpi || "N/A",
          });
        } else {
          setStudentDetails(null);
          setSearchError("Student not found. Please verify the roll number.");
        }
      } catch (error) {
        console.error("Error in handleRollSearchText:", error);
        setStudentDetails(null);
        setSearchError("Error fetching student details. Please try again.");
      } finally {
        setLocalIsLoading(false);
      }
    } else {
      setStudentDetails(null);
    }
  };

  /**
   * Get CGPA performance status
   */
  const getCGPAStatus = (cgpa) => {
    const score = parseFloat(cgpa);
    if (score >= 8.5) {
      return { label: "Excellent", color: "bg-green-500", textColor: "text-green-600" };
    } else if (score >= 7.0) {
      return { label: "Good", color: "bg-yellow-500", textColor: "text-yellow-600" };
    } else {
      return { label: "Needs Improvement", color: "bg-red-500", textColor: "text-red-600" };
    }
  };

  // ============================================
  // RENDER
  // ============================================

  const cgpaStatus = studentDetails ? getCGPAStatus(studentDetails.cgpi) : null;

  return (
    <>
      <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <h3 className="!text-2xl sm:!text-4xl !font-semibold text-gray-900">
              Student Records
            </h3>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Enter Roll Number (e.g., 24XYZ111)"
                className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-700 placeholder-gray-400 transition-all duration-300 bg-white"
                onChange={handleRollSearchText}
                value={searchRollNumber}
                disabled={localIsLoading}
              />
              {/* Search Icon */}
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

            {/* Search Button */}
            <button
              disabled={localIsLoading || !searchRollNumber.trim()}
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
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
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <span>{localIsLoading ? "Searching..." : "Search"}</span>
            </button>
          </div>
        </div>

        {/* Search Results Section */}
        <div className="space-y-4">
          {/* Results Header */}
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

          {/* Results Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Head */}
                <thead>
                  <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                    {/* Student Info Column */}
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

                    {/* Academic Column */}
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
                            d="M12 6.253v13m0-13C6.228 6.228 2 10.456 2 15.5c0 5.046 4.228 9.276 10 9.276s10-4.23 10-9.276c0-5.044-4.228-9.247-10-9.247z"
                          />
                        </svg>
                        <span>Academic</span>
                      </div>
                    </th>

                    {/* Contact & Housing Column */}
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

                {/* Table Body */}
                <tbody>
                  {studentDetails ? (
                    <tr className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
                      {/* Student Info Cell */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-6">
                          {/* Avatar */}
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-md flex-shrink-0">
                            {studentDetails.name?.charAt(0).toUpperCase() ||
                              "S"}
                          </div>

                          {/* Student Details */}
                          <div className="flex flex-col gap-1 min-w-0">
                            <div className="text-lg font-semibold text-gray-900 leading-tight truncate">
                              {studentDetails.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-700 font-medium">
                              Roll: {studentDetails.roll || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Father: {studentDetails.fatherName || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Academic Cell */}
                      <td className="px-6 py-6">
                        <div className="space-y-3">
                          {/* CGPA Score */}
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
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

                          {/* CGPA Status */}
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${cgpaStatus?.color}`}
                            ></div>
                            <span className="text-xs font-medium text-gray-600">
                              {cgpaStatus?.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact & Housing Cell */}
                      <td className="px-6 py-6">
                        <div className="space-y-4">
                          {/* Room */}
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                Room {studentDetails.room || "N/A"}
                              </div>
                              <div className="text-xs text-gray-500">
                                Hostel Accommodation
                              </div>
                            </div>
                          </div>

                          {/* Email */}
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {`${studentDetails.roll}@nith.ac.in` || "N/A"}
                              </div>
                              <div className="text-xs text-gray-500">
                                Email Address
                              </div>
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {studentDetails.phone || "N/A"}
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
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          {/* Empty State Icon */}
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

                          {/* Empty State Message */}
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

          {/* Additional Info Footer */}
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

          {/* Error State */}
          {searchError && !localIsLoading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
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
                    d="M12 9v2m0 4v2m0 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-red-700">{searchError}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;