import React, { useState, useEffect } from "react";
      

const Snacks = () => {

     const [activeFeature, setActiveFeature] = useState("snacks");
     const [websiteStats, setWebsiteStats] = useState(null);
       
  return (
    <div>
      
                    
                      <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
                        <h3 className="!text-4xl !font-semibold text-gray-900 text-center mb-6">
                          Manage Student Snacks Preferences
                        </h3>
                        <p className="!text-center !text-gray-600 mt-2 !text-lg mb-8">
                          Add or remove students from the snacks list
                        </p>

                        <div className="space-y-6">
                          <div className="bg-gray-50 rounded-xl p-6">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">
                              Search Student
                            </h4>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input
                                type="text"
                                placeholder="Enter roll number (e.g., 21MCA001)"
                                value={searchRollNumber}
                                onChange={(e) =>
                                  setSearchRollNumber(
                                    e.target.value.toUpperCase()
                                  )
                                }
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                onClick={handleSearchStudent}
                                disabled={!searchRollNumber || localIsLoading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {localIsLoading ? "Searching..." : "Search"}
                              </button>
                            </div>
                          </div>

                          {studentDetails && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                                    Student Information
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Name:</span>
                                      <span className="font-medium">
                                        {studentDetails.name}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Roll Number:
                                      </span>
                                      <span className="font-medium">
                                        {studentDetails.roll}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Room:</span>
                                      <span className="font-medium">
                                        {studentDetails.room}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Email:
                                      </span>
                                      <span className="font-medium">
                                        {studentDetails.email}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                                    Snacks Management
                                  </h4>
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          Current Status:
                                        </p>
                                        <p
                                          className={`text-sm ${studentDetails.snacksInfo
                                            ?.optedForSnacks
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}
                                        >
                                          {studentDetails.snacksInfo
                                            ?.optedForSnacks
                                            ? "Opted for Snacks"
                                            : "Not Opted for Snacks"}
                                        </p>
                                      </div>
                                      <div
                                        className={`w-4 h-4 rounded-full ${studentDetails.snacksInfo
                                          ?.optedForSnacks
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                          }`}
                                      ></div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <button
                                        onClick={() =>
                                          handleAddToSnacksList(
                                            studentDetails.roll
                                          )
                                        }
                                        disabled={
                                          localIsLoading ||
                                          studentDetails.snacksInfo
                                            ?.optedForSnacks
                                        }
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        {localIsLoading
                                          ? "Processing..."
                                          : "Add to Snacks"}
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleRemoveFromSnacksList(
                                            studentDetails.roll
                                          )
                                        }
                                        disabled={
                                          localIsLoading ||
                                          !studentDetails.snacksInfo
                                            ?.optedForSnacks
                                        }
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        {localIsLoading
                                          ? "Processing..."
                                          : "Remove from Snacks"}
                                      </button>
                                    </div>

                                    <button
                                      onClick={() =>
                                        handleToggleSnacksStatus(
                                          studentDetails.roll
                                        )
                                      }
                                      disabled={localIsLoading}
                                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      {localIsLoading
                                        ? "Processing..."
                                        : "Toggle Status"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Today's Attendance Log Table */}
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                          {/* Table Header */}
                          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 sm:px-8 py-5 sm:py-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div>
                                <h6 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                  Today's Attendance Log
                                </h6>
                                <p className="text-sm text-gray-300 mt-1">
                                  Real-time hostel in/out tracking
                                </p>
                              </div>
                              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                                <svg
                                  className="w-4 h-4 text-gray-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="text-sm font-semibold text-gray-900">
                                  {new Date().toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Table View */}
                          <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-100 border-b-2 border-gray-200">
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Name
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Roll No
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Out Time
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Place of Visit
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {[
                                  {
                                    name: "Rahul Sharma",
                                    roll: "24BCS101",
                                    outTime: "10:30 AM",
                                    place: "Library",
                                    status: "Out",
                                  },
                                  {
                                    name: "Priya Singh",
                                    roll: "24BCS102",
                                    outTime: "09:15 AM",
                                    place: "Market",
                                    status: "Returned",
                                  },
                                  {
                                    name: "Amit Kumar",
                                    roll: "24BCS103",
                                    outTime: "11:45 AM",
                                    place: "Medical Center",
                                    status: "Out",
                                  },
                                  {
                                    name: "Sneha Patel",
                                    roll: "24BCS104",
                                    outTime: "08:00 AM",
                                    place: "College",
                                    status: "Returned",
                                  },
                                  {
                                    name: "Vikram Rao",
                                    roll: "24BCS105",
                                    outTime: "02:30 PM",
                                    place: "Gym",
                                    status: "Out",
                                  },
                                ].map((student, index) => (
                                  <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                    style={{
                                      backgroundColor:
                                        index % 2 === 0
                                          ? "white"
                                          : "rgb(249, 250, 251)",
                                    }}
                                  >
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                          {student.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                          {student.name}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="text-sm font-medium text-gray-700">
                                        {student.roll}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="text-sm text-gray-600">
                                        {student.outTime}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="text-sm text-gray-700">
                                        {student.place}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span
                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-200 ${student.status === "Out"
                                          ? "bg-gray-900 text-white border-gray-900"
                                          : "bg-white text-gray-700 border-gray-300"
                                          }`}
                                      >
                                        {student.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile/Tablet Card View */}
                          <div className="lg:hidden divide-y divide-gray-200">
                            {[
                              {
                                name: "Rahul Sharma",
                                roll: "24BCS101",
                                outTime: "10:30 AM",
                                place: "Library",
                                status: "Out",
                              },
                              {
                                name: "Priya Singh",
                                roll: "24BCS102",
                                outTime: "09:15 AM",
                                place: "Market",
                                status: "Returned",
                              },
                              {
                                name: "Amit Kumar",
                                roll: "24BCS103",
                                outTime: "11:45 AM",
                                place: "Medical Center",
                                status: "Out",
                              },
                              {
                                name: "Sneha Patel",
                                roll: "24BCS104",
                                outTime: "08:00 AM",
                                place: "College",
                                status: "Returned",
                              },
                              {
                                name: "Vikram Rao",
                                roll: "24BCS105",
                                outTime: "02:30 PM",
                                place: "Gym",
                                status: "Out",
                              },
                            ].map((student, index) => (
                              <div
                                key={index}
                                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150"
                                style={{
                                  backgroundColor:
                                    index % 2 === 0
                                      ? "white"
                                      : "rgb(249, 250, 251)",
                                }}
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                      {student.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-base font-bold text-gray-900 truncate">
                                        {student.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 mt-0.5">
                                        {student.roll}
                                      </p>
                                    </div>
                                  </div>
                                  <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 flex-shrink-0 ml-2 ${student.status === "Out"
                                      ? "bg-gray-900 text-white border-gray-900"
                                      : "bg-white text-gray-700 border-gray-300"
                                      }`}
                                  >
                                    {student.status}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                      Out Time
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {student.outTime}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                      Destination
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {student.place}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    
    </div>
  )
}

export default Snacks
