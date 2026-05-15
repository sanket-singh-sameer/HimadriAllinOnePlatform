import React, { useState, useEffect } from "react";
      

const Records = () => {
                const [searchRollNumber, setSearchRollNumber] = useState("");
 
              const [websiteStats, setWebsiteStats] = useState(null);
              const [activeFeature, setActiveFeature] = useState("records");
                
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

  const [studentDetails, setStudentDetails] = useState(null);
      const COLORS = ["#4ade80", "#f87171"];

    

  return (
    <div>
      
                      <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
                        <div className="!text-center !pb-6 !border-b-2 !border-gray-900">
                          <h3 className="!text-3xl sm:!text-4xl !font-black !text-gray-900 !tracking-tight">
                            Search A Student
                          </h3>
                          <p className="!text-sm !text-gray-500 !font-medium !mt-2">
                            Academic Student Data Search
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="relative w-full sm:w-96">
                              <input
                                type="text"
                                placeholder="Enter Roll Number (e.g., 24XYZ111)"
                                className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-700 placeholder-gray-400 transition-all duration-300 bg-white"
                                onChange={handleRollSearchText}
                                value={searchRollNumber}
                              />
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
                            <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap">
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
                              <span>Search</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
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

                          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-900 text-white border-b-2 border-gray-700">
                                    <th className="!px-6 !py-4 !text-left !text-xs !font-bold !uppercase !tracking-wider">
                                      <div className="flex items-center justify-center space-x-2">
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
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                          />
                                        </svg>
                                        <span>Student Info</span>
                                      </div>
                                    </th>
                                    <th className="!px-6 !py-4 !text-left !text-xs !font-bold !uppercase !tracking-wider">
                                      <div className="flex items-center justify-center space-x-2">
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
                                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                          />
                                        </svg>
                                        <span>Academic</span>
                                      </div>
                                    </th>
                                    <th className="!px-6 !py-4 !text-left !text-xs !font-bold !uppercase !tracking-wider">
                                      <div className="flex items-center justify-center space-x-2">
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
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                          />
                                        </svg>
                                        <span>Contact & Housing</span>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                  {studentDetails ? (
                                    <tr className="hover:!bg-gray-50 !transition-all !duration-200">
                                      <td className="!px-6 !py-6 align-top">
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-4 !pb-3 border-b border-gray-100">
                                            <div className="!w-12 !h-12 !bg-gray-900 !rounded-xl flex items-center justify-center !text-white !font-bold !text-lg !shadow-md !flex-shrink-0">
                                              {studentDetails.name?.charAt(0) ||
                                                "S"}
                                            </div>
                                            <div className="flex-1">
                                              <div className="!text-base !font-bold !text-gray-900 !mb-1">
                                                {studentDetails.name || "N/A"}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <div className="flex items-start justify-between !py-2">
                                              <span className="!text-xs !font-medium !text-gray-500 !uppercase !tracking-wide">
                                                Roll Number
                                              </span>
                                              <span className="!text-sm !font-semibold !text-gray-900">
                                                {studentDetails.roll || "N/A"}
                                              </span>
                                            </div>
                                            <div className="flex items-start justify-between !py-2 !border-t !border-gray-100">
                                              <span className="!text-xs !font-medium !text-gray-500 !uppercase !tracking-wide">
                                                Father's Name
                                              </span>
                                              <span className="!text-sm !font-semibold !text-gray-900 !text-right !max-w-[180px]">
                                                {studentDetails.fatherName ||
                                                  "N/A"}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </td>

                                      <td className="!px-6 !py-6 align-top">
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-4 !pb-3 border-b border-gray-100">
                                            <div className="!w-16 !h-16 !bg-gray-900 !rounded-xl flex items-center justify-center !text-white !font-black !text-2xl !shadow-lg !flex-shrink-0">
                                              {studentDetails.cgpi || "N/A"}
                                            </div>
                                            <div>
                                              <div className="!text-xs !font-bold !text-gray-900 !uppercase !tracking-wide">
                                                CGPA Score
                                              </div>
                                              <div className="!text-xs !text-gray-500 !mt-0.5">
                                                Current Performance
                                              </div>
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between !py-2">
                                              <span className="!text-xs !font-medium !text-gray-500 !uppercase !tracking-wide">
                                                Performance
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <div
                                                  className={`!w-2.5 !h-2.5 !rounded-full ${parseFloat(
                                                    studentDetails.cgpi
                                                  ) >= 8.5
                                                    ? "!bg-gray-900"
                                                    : parseFloat(
                                                      studentDetails.cgpi
                                                    ) >= 7.0
                                                      ? "!bg-gray-600"
                                                      : "!bg-gray-400"
                                                    }`}
                                                ></div>
                                                <span className="!text-sm !font-semibold !text-gray-900">
                                                  {parseFloat(
                                                    studentDetails.cgpi
                                                  ) >= 8.5
                                                    ? "Excellent"
                                                    : parseFloat(
                                                      studentDetails.cgpi
                                                    ) >= 7.0
                                                      ? "Good"
                                                      : "Average"}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </td>

                                      <td className="!px-6 !py-6 align-top">
                                        <div className="space-y-3">
                                          <div className="flex items-start justify-between !py-2.5 !px-3 !bg-gray-50 !rounded-lg !border !border-gray-200">
                                            <div className="flex items-center gap-2">
                                              <div className="!w-7 !h-7 !bg-gray-900 !rounded-lg flex items-center justify-center !flex-shrink-0">
                                                <svg
                                                  className="!w-3.5 !h-3.5 !text-white"
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
                                                <div className="!text-xs !font-medium !text-gray-500 !uppercase">
                                                  Room Number
                                                </div>
                                                <div className="!text-sm !font-bold !text-gray-900">
                                                  {studentDetails?.room || "N/A"}
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="flex items-start justify-between !py-2.5 !px-3 !bg-gray-50 !rounded-lg !border !border-gray-200">
                                            <div className="flex items-center gap-2">
                                              <div className="!w-7 !h-7 !bg-gray-900 !rounded-lg flex items-center justify-center !flex-shrink-0">
                                                <svg
                                                  className="!w-3.5 !h-3.5 !text-white"
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
                                              <div className="flex-1 min-w-0">
                                                <div className="!text-xs !font-medium !text-gray-500 !uppercase">
                                                  Email Address
                                                </div>
                                                <div className="!text-sm !font-bold !text-gray-900 !truncate">
                                                  {`${studentDetails.roll}@nith.ac.in` ||
                                                    "N/A"}
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="flex items-start justify-between !py-2.5 !px-3 !bg-gray-50 !rounded-lg !border !border-gray-200">
                                            <div className="flex items-center gap-2">
                                              <div className="!w-7 !h-7 !bg-gray-900 !rounded-lg flex items-center justify-center !flex-shrink-0">
                                                <svg
                                                  className="!w-3.5 !h-3.5 !text-white"
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
                                              <div>
                                                <div className="!text-xs !font-medium !text-gray-500 !uppercase">
                                                  Phone Number
                                                </div>
                                                <div className="!text-sm !font-bold !text-gray-900">
                                                  {studentDetails?.phone || "N/A"}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan="3"
                                        className="!px-6 !py-12 !text-center"
                                      >
                                        <div className="flex flex-col items-center space-y-4">
                                          <div className="!w-20 !h-20 !bg-gray-100 !rounded-full flex items-center justify-center">
                                            <svg
                                              className="!w-10 !h-10 !text-gray-400"
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
                                          <div className="text-center">
                                            <h3 className="!text-lg !font-bold !text-gray-900 !mb-2">
                                              No Student Found
                                            </h3>
                                            <p className="!text-gray-500 !text-sm !max-w-md">
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


                        </div>
                      </div>
                
    </div>
  )
}


export default Records
