import React, { useEffect, useState } from "react";
import { API_PATHS } from "../../../../../Utils/apiPaths";
import axiosInstance from "../../../../../Utils/axiosInstance";
import { toast } from "react-toastify";

const Attendance = () => {

    const [localIsLoading, setLocalIsLoading] = useState(false);
        const [localIsLoadingResolved, setLocalIsLoadingResolved] = useState(false);
        const [localIsLoadingRejected, setLocalIsLoadingRejected] = useState(false);
        const [localIsLoadingPending, setLocalIsLoadingPending] = useState(false);
      
     const [attendanceCurrentPage, setAttendanceCurrentPage] = useState(1);
      const [attendanceItemsPerPage] = useState(10);
     const [showExportModal, setShowExportModal] = useState(false);
       const [exportDateRange, setExportDateRange] = useState({
         startDate: "",
         endDate: "",
       });
     const [outpassRequests, setOutpassRequests] = useState([]);
     
     const [studentDetails, setStudentDetails] = useState(null);
     
const [nfcScanning, setNfcScanning] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(false);
   const [searchRollNumber, setSearchRollNumber] = useState("");
   
    const [activeFeature, setActiveFeature] = useState("attendance");
              const [websiteStats, setWebsiteStats] = useState(null);

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

  const fetchOutpassRequests = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GET_ALL_OUTPASSES);
      setOutpassRequests(response.data.outpasses || []);
    } catch (error) {
      console.error("Error fetching outpass requests:", error);
      toast.error("Failed to fetch outpass records");
    }
  };

  useEffect(() => {
    fetchOutpassRequests();
  }, []);
             
              const handleNFCInput = (e) => {
    const value = e.target.value;
    setSearchRollNumber(value);

    // Auto-submit when Enter is pressed (for NFC readers that send Enter)
    if (value.includes("\n") || value.includes("\r")) {
      const cleanValue = value.replace(/[\n\r]/g, "").trim();
      if (cleanValue) {
        setSearchRollNumber(cleanValue.toUpperCase());
        handleRollSearchText({ target: { value: cleanValue.toUpperCase() } });
      }
    }
  };


  const handleMarkMessAttendance = async (rollNumber) => {
    if (!rollNumber) {
      toast.error("Please scan a student first");
      return;
    }

    setLocalIsLoading(true);
    try {
      const response = await axiosInstance.post(
        API_PATHS.MARK_MESS_ATTENDANCE(rollNumber)
      );
      toast.success(response.data.message);

      // Show which meal was marked
      const markedMeal = response.data.markedMeal;
      if (markedMeal) {
        toast.info(
          `${markedMeal.charAt(0).toUpperCase() + markedMeal.slice(1)
          } attendance marked!`
        );
      }
    } catch (error) {
      console.error("Error marking mess attendance:", error);
      const errorMessage =
        error.response?.data?.message || "Error marking mess attendance";
      toast.error(errorMessage);
    } finally {
      setLocalIsLoading(false);
    }
  };


  const handleExportAttendance = async () => {
    if (!exportDateRange.startDate || !exportDateRange.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    const startDate = new Date(exportDateRange.startDate);
    const endDate = new Date(exportDateRange.endDate);

    if (startDate > endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setLocalIsLoading(true);
    try {
      // Build params object
      const params = {
        startDate: exportDateRange.startDate,
        endDate: exportDateRange.endDate,
      };

      // If a student is searched, add their roll number
      if (studentDetails && studentDetails.roll) {
        params.roll = studentDetails.roll;
      }

      const response = await axiosInstance.get(
        API_PATHS.EXPORT_MESS_ATTENDANCE,
        {
          params,
          responseType: "blob", // Important for file download
        }
      );

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename based on whether specific student or all students
      const filename =
        studentDetails && studentDetails.roll
          ? `mess_attendance_${studentDetails.roll}_${exportDateRange.startDate}_to_${exportDateRange.endDate}.xlsx`
          : `mess_attendance_all_students_${exportDateRange.startDate}_to_${exportDateRange.endDate}.xlsx`;

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Attendance exported successfully!");
      setShowExportModal(false);
      setExportDateRange({ startDate: "", endDate: "" });
    } catch (error) {
      console.error("Error exporting attendance:", error);
      toast.error(
        error.response?.data?.message || "Failed to export attendance"
      );
    } finally {
      setLocalIsLoading(false);
    }
  };


    const handleRollSearchText = async (e) => {
    const rollNumber = e.target.value;
    setSearchRollNumber(rollNumber);

    if (rollNumber) {
      try {
        const student = await getStudentByRoll(rollNumber);
        const cgpiData = await getCGPIByRoll(rollNumber);

        // Fetch snacks information
        let snacksInfo = { optedForSnacks: false };
        try {
          const snacksResponse = await axiosInstance.get(
            API_PATHS.CHECK_SNACKS_BY_ROLL(rollNumber)
          );
          snacksInfo = { optedForSnacks: snacksResponse.data.optedForSnacks };
        } catch (snacksError) {
          console.warn("Could not fetch snacks info:", snacksError);
        }

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
            snacksInfo: snacksInfo,
          });

          console.log("Student details set:", {
            student,
            cgpiData,
            snacksInfo,
            combined: {
              name: student?.name,
              roll: student?.roll,
              room: student?.room,
              fatherName: cgpiData?.fName,
              cgpi: cgpiData?.cgpi,
              snacksInfo,
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


  return (
    <div>
      
                      <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8">
                        <div className="flex items-center justify-between flex-col gap-4 lg:flex-row">
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="!text-2xl sm:!text-4xl !font-black text-gray-900 tracking-tight">
                              Attendance Manager
                            </h3>
                          </div>

                          <button
                            onClick={() => setShowExportModal(true)}
                            className="group relative overflow-hidden flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-900 text-gray-900 font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 group-hover:scale-110 transition-all duration-300">
                              <svg
                                className="w-3.5 h-3.5 text-gray-700 group-hover:text-white transition-colors duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <span className="relative text-sm tracking-wide hidden sm:inline">
                              Export Log
                            </span>
                            <span className="relative text-sm tracking-wide sm:hidden">
                              Export
                            </span>
                          </button>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative w-full sm:flex-1">
                              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <svg
                                  className={`w-5 h-5 ${nfcScanning
                                    ? "text-green-500 animate-pulse"
                                    : "text-gray-400"
                                    }`}
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
                              <input
                                type="text"
                                placeholder="Tap NFC card or enter roll number (e.g., 24BCS001)"
                                className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 transition-all duration-300 bg-white"
                                onChange={handleNFCInput}
                                value={searchRollNumber}
                                autoFocus
                              />
                            </div>

                            {/* NFC Scan Button (only show if supported) */}
                            {nfcSupported && (
                              <button
                                onClick={startNFCScan}
                                disabled={nfcScanning}
                                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${nfcScanning
                                  ? "bg-green-500 text-white animate-pulse"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                                  }`}
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>
                                  {nfcScanning ? "Scanning..." : "NFC Scan"}
                                </span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (searchRollNumber) {
                                  handleRollSearchText({
                                    target: { value: searchRollNumber },
                                  });
                                }
                              }}
                              className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl cursor-pointer"
                            >
                              <svg
                                className="w-5 h-5"
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
                              <span>Search</span>
                            </button>
                          </div>

                          {/* Instructions */}
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-800">
                              <strong>💡 Tip:</strong>{" "}
                              {nfcSupported
                                ? 'Click "NFC Scan" and tap your card, or simply'
                                : "Simply"}{" "}
                              tap your NFC card when the input is focused, or type
                              the roll number manually and press Enter.
                            </p>
                          </div>
                        </div>

                        {studentDetails && (
                          <div className="!bg-white !rounded-3xl !border !border-gray-200 !shadow-2xl !overflow-hidden !max-w-4xl !mx-auto">
                            <div className="!bg-gradient-to-r !from-gray-900 !via-gray-800 !to-gray-900 !px-8 !py-6">
                              <div className="!flex !items-center !justify-between">
                                <div className="!flex-1">
                                  <h6 className="!text-2xl !font-bold !text-white !mb-2 !tracking-tight">
                                    {studentDetails.name || "N/A"}
                                  </h6>
                                  <div className="!flex !items-center !gap-4 !text-sm !text-gray-300">
                                    <div className="!flex !items-center !gap-2">
                                      <svg
                                        className="!w-4 !h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                        />
                                      </svg>
                                      <span className="!font-medium">
                                        {studentDetails.roll || "N/A"}
                                      </span>
                                    </div>
                                    <div className="!w-1 !h-1 !bg-gray-500 !rounded-full"></div>
                                    <div className="!flex !items-center !gap-2">
                                      <svg
                                        className="!w-4 !h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        />
                                      </svg>
                                      <span className="!font-medium">
                                        Room {studentDetails.room || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="!p-4 sm:!p-6 md:!p-8 !space-y-4 sm:!space-y-6 !bg-gray-50">
                              <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4 sm:!gap-6">
                                <div className="group !bg-white !rounded-2xl !p-4 sm:!p-6 !border !border-gray-200 hover:!border-gray-300 !transition-all !duration-300 !shadow-sm hover:!shadow-lg">
                                  <div className="!flex !items-center !gap-2 sm:!gap-3 !mb-4 sm:!mb-6">
                                    <div className="!w-10 !h-10 sm:!w-11 sm:!h-11 !bg-gray-900 !rounded-xl !flex !items-center !justify-center !shadow-md !flex-shrink-0">
                                      <svg
                                        className="!w-5 !h-5 sm:!w-6 sm:!h-6 !text-white"
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
                                    <div className="!flex-1 !text-left">
                                      <h6 className="!text-base sm:!text-lg !font-bold !text-gray-900 !mb-0.5 !leading-tight">
                                        Hostel Attendance
                                      </h6>
                                    </div>
                                  </div>

                                  <div className="!grid !grid-cols-2 !gap-2 sm:!gap-3">
                                    <button className="group/btn !cursor-pointer !relative !overflow-hidden !flex !flex-col !items-center !justify-center !space-y-2 sm:!space-y-2.5 !px-3 sm:!px-4 !py-4 sm:!py-5 !bg-white hover:!bg-gray-50 !border-2 !border-gray-300 hover:!border-gray-900 !text-gray-900 !font-semibold !rounded-xl !transition-all !duration-300 !shadow-sm hover:!shadow-md hover:!scale-[1.02] active:!scale-95">
                                      <div className="!absolute !inset-0 !bg-gradient-to-br !from-gray-100/50 !via-transparent !to-transparent !opacity-0 group-hover/btn:!opacity-100 !transition-opacity !duration-300"></div>
                                      <div className="!relative !w-10 !h-10 sm:!w-11 sm:!h-11 !bg-gray-100 !rounded-xl !flex !items-center !justify-center group-hover/btn:!bg-gray-900 group-hover/btn:!scale-110 !transition-all !duration-300">
                                        <svg
                                          className="!w-5 !h-5 !text-gray-700 group-hover/btn:!text-white !transition-colors !duration-300"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                          />
                                        </svg>
                                      </div>
                                      <span className="!relative !text-xs sm:!text-sm !font-bold !tracking-wide">
                                        Hostel In
                                      </span>
                                    </button>

                                    <button className="group/btn !cursor-pointer !relative !overflow-hidden !flex !flex-col !items-center !justify-center !space-y-2 sm:!space-y-2.5 !px-3 sm:!px-4 !py-4 sm:!py-5 !bg-white hover:!bg-gray-50 !border-2 !border-gray-300 hover:!border-gray-900 !text-gray-900 !font-semibold !rounded-xl !transition-all !duration-300 !shadow-sm hover:!shadow-md hover:!scale-[1.02] active:!scale-95">
                                      <div className="!absolute !inset-0 !bg-gradient-to-br !from-gray-100/50 !via-transparent !to-transparent !opacity-0 group-hover/btn:!opacity-100 !transition-opacity !duration-300"></div>
                                      <div className="!relative !w-10 !h-10 sm:!w-11 sm:!h-11 !bg-gray-100 !rounded-xl !flex !items-center !justify-center group-hover/btn:!bg-gray-900 group-hover/btn:!scale-110 !transition-all !duration-300">
                                        <svg
                                          className="!w-5 !h-5 !text-gray-700 group-hover/btn:!text-white !transition-colors !duration-300"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                          />
                                        </svg>
                                      </div>
                                      <span className="!relative !text-xs sm:!text-sm !font-bold !tracking-wide">
                                        Hostel Out
                                      </span>
                                    </button>
                                  </div>
                                </div>

                                <div className="group !bg-white !rounded-2xl !p-4 sm:!p-6 !border !border-gray-200 hover:!border-gray-300 !transition-all !duration-300 !shadow-sm hover:!shadow-lg">
                                  <div className="!flex !items-center !gap-2 sm:!gap-3 !mb-4 sm:!mb-6">
                                    <div className="!w-10 !h-10 sm:!w-11 sm:!h-11 !bg-gray-900 !rounded-xl !flex !items-center !justify-center !shadow-md !flex-shrink-0">
                                      <svg
                                        className="!w-5 !h-5 sm:!w-6 sm:!h-6 !text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                      </svg>
                                    </div>
                                    <div className="!flex-1 !text-left">
                                      <h6 className="!text-base sm:!text-lg !font-bold !text-gray-900 !mb-0.5 !leading-tight">
                                        Mess Attendance
                                      </h6>
                                    </div>
                                  </div>

                                  <div className="!grid !grid-cols-2 !gap-2 sm:!gap-3">
                                    <button
                                      onClick={() =>
                                        handleMarkMessAttendance(
                                          studentDetails?.roll
                                        )
                                      }
                                      disabled={!studentDetails || localIsLoading}
                                      className="group/btn !cursor-pointer !relative !overflow-hidden !flex !flex-col !items-center !justify-center !space-y-2 sm:!space-y-2.5 !px-3 sm:!px-4 !py-4 sm:!py-5 !bg-white hover:!bg-gray-50 !border-2 !border-gray-300 hover:!border-gray-900 !text-gray-900 !font-semibold !rounded-xl !transition-all !duration-300 !shadow-sm hover:!shadow-md hover:!scale-[1.02] active:!scale-95 disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!scale-100"
                                    >
                                      <div className="!absolute !inset-0 !bg-gradient-to-br !from-gray-100/50 !via-transparent !to-transparent !opacity-0 group-hover/btn:!opacity-100 !transition-opacity !duration-300"></div>
                                      <div className="!relative !w-10 !h-10 sm:!w-11 sm:!h-11 !bg-gray-100 !rounded-xl !flex !items-center !justify-center group-hover/btn:!bg-gray-900 group-hover/btn:!scale-110 !transition-all !duration-300">
                                        <svg
                                          className="!w-5 !h-5 !text-gray-700 group-hover/btn:!text-white !transition-colors !duration-300"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                          />
                                        </svg>
                                      </div>
                                      <span className="!relative !text-xs sm:!text-sm !font-bold !tracking-wide">
                                        {localIsLoading
                                          ? "Processing..."
                                          : "Mess In"}
                                      </span>
                                    </button>

                                    <button
                                      disabled
                                      className="group/btn !relative !overflow-hidden !flex !flex-col !items-center !justify-center !space-y-2 sm:!space-y-2.5 !px-3 sm:!px-4 !py-4 sm:!py-5 !bg-white !border-2 !border-gray-300 !text-gray-900 !font-semibold !rounded-xl !transition-all !duration-300 !shadow-sm !opacity-50 !cursor-not-allowed"
                                    >
                                      <div className="!absolute !inset-0 !bg-gradient-to-br !from-gray-100/50 !via-transparent !to-transparent !opacity-0 !transition-opacity !duration-300"></div>
                                      <div className="!relative !w-10 !h-10 sm:!w-11 sm:!h-11 !bg-gray-100 !rounded-xl !flex !items-center !justify-center !transition-all !duration-300">
                                        <svg
                                          className="!w-5 !h-5 !text-gray-700 !transition-colors !duration-300"
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
                                      </div>
                                      <span className="!relative !text-xs sm:!text-sm !font-bold !tracking-wide">
                                        Mess Out
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="group !bg-white !rounded-2xl !p-4 sm:!p-6 !border !border-gray-200 hover:!border-gray-300 !transition-all !duration-300 !shadow-sm hover:!shadow-lg">
                                <div className="!flex !items-center !gap-2 sm:!gap-3 !mb-4 sm:!mb-6">
                                  <div className="!w-10 !h-10 sm:!w-11 sm:!h-11 !bg-gray-900 !rounded-xl !flex !items-center !justify-center !shadow-md !flex-shrink-0">
                                    <svg
                                      className="!w-5 !h-5 sm:!w-6 sm:!h-6 !text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                      />
                                    </svg>
                                  </div>
                                  <div className="!flex-1 !text-left">
                                    <h6 className="!text-base sm:!text-lg !font-bold !text-gray-900 !mb-0.5 !leading-tight">
                                      Additional Controls
                                    </h6>
                                  </div>
                                </div>

                                <div className="!grid !grid-cols-2 md:!grid-cols-3 !gap-2 sm:!gap-3">
                                  <button className="group/btn !cursor-pointer !relative !overflow-hidden !flex !flex-col !items-center !justify-center !space-y-2 sm:!space-y-2.5 !px-3 sm:!px-4 !py-4 sm:!py-5 !bg-white hover:!bg-gray-50 !border-2 !border-gray-300 hover:!border-gray-900 !text-gray-900 !font-semibold !rounded-xl !transition-all !duration-300 !shadow-sm hover:!shadow-md hover:!scale-[1.02] active:!scale-95">
                                    <div className="!absolute !inset-0 !bg-gradient-to-br !from-gray-100/50 !via-transparent !to-transparent !opacity-0 group-hover/btn:!opacity-100 !transition-opacity !duration-300"></div>
                                    <div className="!relative !w-10 !h-10 sm:!w-11 sm:!h-11 !bg-gray-100 !rounded-xl !flex !items-center !justify-center group-hover/btn:!bg-gray-900 group-hover/btn:!scale-110 !transition-all !duration-300">
                                      <svg
                                        className="!w-5 !h-5 !text-gray-700 group-hover/btn:!text-white !transition-colors !duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                    </div>
                                    <span className="!relative !text-xs sm:!text-sm !font-bold !tracking-wide !text-center">
                                      Mark Late
                                    </span>
                                  </button>

                                  <button className="group/btn !cursor-pointer !relative !overflow-hidden !flex !flex-col !items-center !justify-center !space-y-2 sm:!space-y-2.5 !px-3 sm:!px-4 !py-4 sm:!py-5 !bg-white hover:!bg-gray-50 !border-2 !border-gray-300 hover:!border-gray-900 !text-gray-900 !font-semibold !rounded-xl !transition-all !duration-300 !shadow-sm hover:!shadow-md hover:!scale-[1.02] active:!scale-95">
                                    <div className="!absolute !inset-0 !bg-gradient-to-br !from-gray-100/50 !via-transparent !to-transparent !opacity-0 group-hover/btn:!opacity-100 !transition-opacity !duration-300"></div>
                                    <div className="!relative !w-10 !h-10 sm:!w-11 sm:!h-11 !bg-gray-100 !rounded-xl !flex !items-center !justify-center group-hover/btn:!bg-gray-900 group-hover/btn:!scale-110 !transition-all !duration-300">
                                      <svg
                                        className="!w-5 !h-5 !text-gray-700 group-hover/btn:!text-white !transition-colors !duration-300"
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
                                    <span className="!relative !text-xs sm:!text-sm !font-bold !tracking-wide !text-center">
                                      Export Student's Logs
                                    </span>
                                  </button>

                                  <button className="group/btn !cursor-pointer !relative !overflow-hidden !flex !flex-col !items-center !justify-center !space-y-2 sm:!space-y-2.5 !px-3 sm:!px-4 !py-4 sm:!py-5 !bg-white hover:!bg-gray-50 !border-2 !border-gray-300 hover:!border-gray-900 !text-gray-900 !font-semibold !rounded-xl !transition-all !duration-300 !shadow-sm hover:!shadow-md hover:!scale-[1.02] active:!scale-95 !col-span-2 md:!col-span-1">
                                    <div className="!absolute !inset-0 !bg-gradient-to-br !from-gray-100/50 !via-transparent !to-transparent !opacity-0 group-hover/btn:!opacity-100 !transition-opacity !duration-300"></div>
                                    <div className="!relative !w-10 !h-10 sm:!w-11 sm:!h-11 !bg-gray-100 !rounded-xl !flex !items-center !justify-center group-hover/btn:!bg-gray-900 group-hover/btn:!scale-110 !transition-all !duration-300">
                                      <svg
                                        className="!w-5 !h-5 !text-gray-700 group-hover/btn:!text-white !transition-colors !duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                      </svg>
                                    </div>
                                    <span className="!relative !text-xs sm:!text-sm !font-bold !tracking-wide !text-center">
                                      Issue Warning
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="!mt-8 !bg-white !rounded-2xl !border !border-gray-200 !shadow-lg !overflow-hidden">
                          <div className="!bg-black !px-6 !py-5 !border-b !border-gray-800">
                            <div className="!flex !items-center !justify-between !flex-wrap !gap-4">
                              <div>
                                <h6 className="!text-lg sm:!text-xl !font-bold !text-white !mb-1">
                                  Today's Attendance Log
                                </h6>
                              </div>
                              <div className="!flex !items-center !gap-2 !px-3 !py-1.5 !bg-white/10 !rounded-lg !backdrop-blur-sm">
                                <svg
                                  className="!w-3.5 !h-3.5 !text-white/80"
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
                                <span className="!text-xs !font-semibold !text-white">
                                  {new Date().toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="!overflow-x-auto">
                            <div className="!max-h-[450px] !overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
                              <table className="!w-full !border-collapse">
                                <thead className="!sticky !top-0 !z-10 !bg-gray-50">
                                  <tr className="!border-b !border-gray-200">
                                    <th className="!px-6 !py-3.5 !text-left !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider !bg-gray-50">
                                      Student
                                    </th>
                                    <th className="!px-6 !py-3.5 !text-left !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider !bg-gray-50">
                                      Roll No
                                    </th>
                                    <th className="!px-6 !py-3.5 !text-left !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider !bg-gray-50">
                                      Out Time
                                    </th>
                                    <th className="!px-6 !py-3.5 !text-left !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider !bg-gray-50">
                                      In Time
                                    </th>
                                    <th className="!px-6 !py-3.5 !text-left !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider !bg-gray-50">
                                      Place of Visit
                                    </th>
                                    <th className="!px-6 !py-3.5 !text-center !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider !bg-gray-50">
                                      Status
                                    </th>
                                  </tr>
                                </thead>

                                <tbody className="!bg-white !divide-y !divide-gray-100">
                                  {/* Filter today's outpasses with actualOutTime */}
                                  {(() => {
                                    const todaysAttendance = outpassRequests.filter((outpass) => {
                                      // Only show outpasses that have actualOutTime (student went out)
                                      if (!outpass.actualOutTime) return false;

                                      // Check if actualOutTime is today
                                      const outTime = new Date(outpass.actualOutTime);
                                      const today = new Date();
                                      return (
                                        outTime.getDate() === today.getDate() &&
                                        outTime.getMonth() === today.getMonth() &&
                                        outTime.getFullYear() === today.getFullYear()
                                      );
                                    });

                                    // Calculate pagination
                                    const indexOfLastItem = attendanceCurrentPage * attendanceItemsPerPage;
                                    const indexOfFirstItem = indexOfLastItem - attendanceItemsPerPage;
                                    const currentItems = todaysAttendance.slice(indexOfFirstItem, indexOfLastItem);

                                    return currentItems.map((outpass, index) => {
                                      const isReturned = outpass.actualInTime != null;
                                      const outTime = new Date(outpass.actualOutTime);

                                      return (
                                        <tr
                                          key={outpass._id || index}
                                          className="hover:!bg-gray-50/50 !transition-all !duration-200 group"
                                        >
                                          <td className="!px-6 !py-4">
                                            <span className="!text-sm !font-semibold !text-gray-900">
                                              {outpass.fullName}
                                            </span>
                                          </td>
                                          <td className="!px-6 !py-4">
                                            <span className="!text-sm !font-mono !font-medium !text-gray-600 !bg-gray-50 !px-2.5 !py-1 !rounded">
                                              {outpass.rollNumber}
                                            </span>
                                          </td>
                                          <td className="!px-6 !py-4">
                                            <div className="!flex !items-center !gap-2">
                                              <svg
                                                className="!w-4 !h-4 !text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                              </svg>
                                              <span className="!text-sm !font-medium !text-gray-700">
                                                {outTime.toLocaleTimeString("en-US", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  hour12: true,
                                                })}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="!px-6 !py-4">
                                            {isReturned ? (
                                              <div className="!flex !items-center !gap-2">
                                                <svg
                                                  className="!w-4 !h-4 !text-green-500"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                  />
                                                </svg>
                                                <span className="!text-sm !font-medium !text-green-700">
                                                  {new Date(outpass.actualInTime).toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                  })}
                                                </span>
                                              </div>
                                            ) : (
                                              <span className="!text-sm !font-medium !text-gray-400 !italic">
                                                Not returned
                                              </span>
                                            )}
                                          </td>
                                          <td className="!px-6 !py-4">
                                            <span className="!text-sm !font-medium !text-gray-700">
                                              {outpass.placeOfVisit}
                                            </span>
                                          </td>
                                          <td className="!px-6 !py-4 !text-center">
                                            <span
                                              className={`!inline-flex !items-center !justify-center !px-3 !py-1 !rounded-full !text-xs !font-bold !tracking-wide !min-w-[90px] !transition-all !duration-200 ${!isReturned
                                                ? "!bg-black !text-white"
                                                : "!bg-white !text-gray-700 !border-2 !border-gray-300"
                                                }`}
                                            >
                                              {isReturned ? "Returned" : "Out"}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    });
                                  })()}

                                  {/* Show message if no records for today */}
                                  {outpassRequests.filter((outpass) => {
                                    if (!outpass.actualOutTime) return false;
                                    const outTime = new Date(outpass.actualOutTime);
                                    const today = new Date();
                                    return (
                                      outTime.getDate() === today.getDate() &&
                                      outTime.getMonth() === today.getMonth() &&
                                      outTime.getFullYear() === today.getFullYear()
                                    );
                                  }).length === 0 && (
                                      <tr>
                                        <td colSpan="6" className="!px-6 !py-12 !text-center">
                                          <div className="!flex !flex-col !items-center !justify-center">
                                            <div className="!w-16 !h-16 !bg-gray-100 !rounded-full !flex !items-center !justify-center !mb-4">
                                              <svg
                                                className="!w-8 !h-8 !text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                              </svg>
                                            </div>
                                            <h4 className="!text-lg !font-semibold !text-gray-900 !mb-1">
                                              No attendance logs
                                            </h4>
                                            <p className="!text-sm !text-gray-500">
                                              No students have checked out today
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                </tbody>
                              </table>

                              {/* Empty State - Show when no data */}
                              {false && (
                                <div className="!flex !flex-col !items-center !justify-center !py-20">
                                  <div className="!w-16 !h-16 !bg-gray-100 !rounded-full !flex !items-center !justify-center !mb-4">
                                    <svg
                                      className="!w-8 !h-8 !text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                      />
                                    </svg>
                                  </div>
                                  <h4 className="!text-lg !font-semibold !text-gray-900 !mb-1">
                                    No attendance logs
                                  </h4>
                                  <p className="!text-sm !text-gray-500">
                                    No records available for today
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer Summary */}
                          <div className="!bg-gray-50 !px-6 !py-4 !border-t !border-gray-200">
                            <div className="!flex !items-center !justify-between !flex-wrap !gap-4">
                              <div className="!flex !items-center !gap-8">
                                <div className="!flex !items-center !gap-2">
                                  <div className="!w-2.5 !h-2.5 !bg-black !rounded-full"></div>
                                  <span className="!text-sm !font-medium !text-gray-600">
                                    Out:{" "}
                                    <span className="!font-bold !text-gray-900">
                                      {outpassRequests.filter((outpass) => {
                                        if (!outpass.actualOutTime || outpass.actualInTime) return false;
                                        const outTime = new Date(outpass.actualOutTime);
                                        const today = new Date();
                                        return (
                                          outTime.getDate() === today.getDate() &&
                                          outTime.getMonth() === today.getMonth() &&
                                          outTime.getFullYear() === today.getFullYear()
                                        );
                                      }).length}
                                    </span>
                                  </span>
                                </div>
                                <div className="!flex !items-center !gap-2">
                                  <div className="!w-2.5 !h-2.5 !bg-white !border-2 !border-gray-400 !rounded-full"></div>
                                  <span className="!text-sm !font-medium !text-gray-600">
                                    Returned:{" "}
                                    <span className="!font-bold !text-gray-900">
                                      {outpassRequests.filter((outpass) => {
                                        if (!outpass.actualOutTime || !outpass.actualInTime) return false;
                                        const outTime = new Date(outpass.actualOutTime);
                                        const today = new Date();
                                        return (
                                          outTime.getDate() === today.getDate() &&
                                          outTime.getMonth() === today.getMonth() &&
                                          outTime.getFullYear() === today.getFullYear()
                                        );
                                      }).length}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <div className="!text-sm !font-medium !text-gray-500">
                                Total:{" "}
                                <span className="!font-bold !text-gray-900">
                                  {outpassRequests.filter((outpass) => {
                                    if (!outpass.actualOutTime) return false;
                                    const outTime = new Date(outpass.actualOutTime);
                                    const today = new Date();
                                    return (
                                      outTime.getDate() === today.getDate() &&
                                      outTime.getMonth() === today.getMonth() &&
                                      outTime.getFullYear() === today.getFullYear()
                                    );
                                  }).length}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Pagination Controls */}
                          {(() => {
                            const todaysAttendance = outpassRequests.filter((outpass) => {
                              if (!outpass.actualOutTime) return false;
                              const outTime = new Date(outpass.actualOutTime);
                              const today = new Date();
                              return (
                                outTime.getDate() === today.getDate() &&
                                outTime.getMonth() === today.getMonth() &&
                                outTime.getFullYear() === today.getFullYear()
                              );
                            });

                            const totalPages = Math.ceil(todaysAttendance.length / attendanceItemsPerPage);

                            if (totalPages <= 1) return null;

                            return (
                              <div className="!bg-white !px-6 !py-4 !border-t !border-gray-200">
                                <div className="!flex !items-center !justify-between !flex-wrap !gap-4">
                                  <div className="!text-sm !text-gray-600">
                                    Showing {((attendanceCurrentPage - 1) * attendanceItemsPerPage) + 1} to{" "}
                                    {Math.min(attendanceCurrentPage * attendanceItemsPerPage, todaysAttendance.length)} of{" "}
                                    {todaysAttendance.length} entries
                                  </div>
                                  <div className="!flex !items-center !gap-2">
                                    <button
                                      onClick={() => setAttendanceCurrentPage(prev => Math.max(prev - 1, 1))}
                                      disabled={attendanceCurrentPage === 1}
                                      className={`!px-3 !py-1.5 !rounded-lg !text-sm !font-medium !transition-all !duration-200 ${attendanceCurrentPage === 1
                                        ? "!bg-gray-100 !text-gray-400 !cursor-not-allowed"
                                        : "!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
                                        }`}
                                    >
                                      Previous
                                    </button>

                                    <div className="!flex !items-center !gap-1">
                                      {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        // Show first page, last page, current page, and pages around current
                                        if (
                                          pageNumber === 1 ||
                                          pageNumber === totalPages ||
                                          (pageNumber >= attendanceCurrentPage - 1 && pageNumber <= attendanceCurrentPage + 1)
                                        ) {
                                          return (
                                            <button
                                              key={pageNumber}
                                              onClick={() => setAttendanceCurrentPage(pageNumber)}
                                              className={`!px-3 !py-1.5 !rounded-lg !text-sm !font-medium !transition-all !duration-200 ${attendanceCurrentPage === pageNumber
                                                ? "!bg-black !text-white"
                                                : "!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
                                                }`}
                                            >
                                              {pageNumber}
                                            </button>
                                          );
                                        } else if (
                                          pageNumber === attendanceCurrentPage - 2 ||
                                          pageNumber === attendanceCurrentPage + 2
                                        ) {
                                          return <span key={pageNumber} className="!text-gray-400 !px-1">...</span>;
                                        }
                                        return null;
                                      })}
                                    </div>

                                    <button
                                      onClick={() => setAttendanceCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                      disabled={attendanceCurrentPage === totalPages}
                                      className={`!px-3 !py-1.5 !rounded-lg !text-sm !font-medium !transition-all !duration-200 ${attendanceCurrentPage === totalPages
                                        ? "!bg-gray-100 !text-gray-400 !cursor-not-allowed"
                                        : "!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
                                        }`}
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                            {showExportModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                Export Mess Attendance
              </h3>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setExportDateRange({ startDate: "", endDate: "" });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
             
            <div className="space-y-4">
              {studentDetails && studentDetails.roll ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
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
                    <div>
                      <p className="text-sm font-semibold text-green-800 mb-1">
                        Exporting for: {studentDetails.name}
                      </p>
                      <p className="text-xs text-green-700">
                        Roll: {studentDetails.roll} • Room:{" "}
                        {studentDetails.room || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
                    <div>
                      <p className="text-sm font-semibold text-blue-800 mb-1">
                        Exporting for: All Students
                      </p>
                      <p className="text-xs text-blue-700">
                        Complete attendance records for all students in the
                        selected date range.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={exportDateRange.startDate}
                  onChange={(e) =>
                    setExportDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={exportDateRange.endDate}
                  onChange={(e) =>
                    setExportDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  max={new Date().toISOString().split("T")[0]}
                  min={exportDateRange.startDate}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setExportDateRange({ startDate: "", endDate: "" });
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleExportAttendance}
                disabled={
                  localIsLoading ||
                  !exportDateRange.startDate ||
                  !exportDateRange.endDate
                }
                className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {localIsLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>Export</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
                    
    </div>
  )
}

export default Attendance
