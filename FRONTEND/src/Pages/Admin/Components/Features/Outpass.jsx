import React, { useState, useEffect } from "react";
      
const Outpass = () => {

     const [selectedOutpass, setSelectedOutpass] = useState(null);
 
 const [selectedOutpasses, setSelectedOutpasses] = useState([]);
 
const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
     const [showOutpassModal, setShowOutpassModal] = useState(false);
     
     const [outpassSearchTerm, setOutpassSearchTerm] = useState("");
      const [outpassStatusFilter, setOutpassStatusFilter] = useState("");
      const [outpassDateFilter, setOutpassDateFilter] = useState("");
     const [filteredOutpasses, setFilteredOutpasses] = useState([]);
     
  
    const [activeFeature, setActiveFeature] = useState("outpass");
              const [websiteStats, setWebsiteStats] = useState(null);
         
              const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
              const paginatedOutpasses = filteredOutpasses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  
  const applyOutpassFilters = () => {
    let filtered = [...outpassRequests];

    if (outpassSearchTerm) {
      filtered = filtered.filter(
        (outpass) =>
          outpass.fullName
            ?.toLowerCase()
            .includes(outpassSearchTerm.toLowerCase()) ||
          outpass.rollNumber
            ?.toLowerCase()
            .includes(outpassSearchTerm.toLowerCase()) ||
          outpass.roomNumber
            ?.toLowerCase()
            .includes(outpassSearchTerm.toLowerCase()) ||
          outpass.placeOfVisit
            ?.toLowerCase()
            .includes(outpassSearchTerm.toLowerCase())
      );
    }

    if (outpassStatusFilter) {
      filtered = filtered.filter(
        (outpass) => outpass.status === outpassStatusFilter.toLowerCase()
      );
    }

    if (outpassDateFilter) {
      filtered = filtered.filter((outpass) => {
        const outDate = new Date(outpass.outDate).toISOString().split("T")[0];
        return outDate === outpassDateFilter;
      });
    }

    setFilteredOutpasses(filtered);
    setCurrentPage(1);
  };


  const handleSelectAllOutpasses = () => {
    if (selectedOutpasses.length === paginatedOutpasses.length) {
      setSelectedOutpasses([]);
    } else {
      setSelectedOutpasses(paginatedOutpasses.map((outpass) => outpass._id));
    }
  };

  const fetchOutpassRequests = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GET_ALL_OUTPASSES);

      // Show all outpass requests (pending, approved, and rejected)
      const allOutpasses = response.data.outpasses;

      setOutpassRequests(allOutpasses);
      setFilteredOutpasses(allOutpasses);
      console.log("Outpass requests fetched:", allOutpasses);
    } catch (error) {
      console.error("Error fetching outpass requests:", error);
      toast.error("Failed to fetch outpass requests");
    }
  };

    const totalPages = Math.ceil(filteredOutpasses.length / itemsPerPage);


  return (
    <div>
      
                      <div className="w-full space-y-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                          <h2 className="!text-3xl !font-bold !text-gray-900 !mb-2">
                            Outpass Requests
                          </h2>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                placeholder="Search by name, roll, room, or place..."
                                value={outpassSearchTerm}
                                onChange={(e) =>
                                  setOutpassSearchTerm(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                              />
                            </div>
                            <div>
                              <select
                                value={outpassStatusFilter}
                                onChange={(e) =>
                                  setOutpassStatusFilter(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                              >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                            <div>
                              <input
                                type="date"
                                value={outpassDateFilter}
                                onChange={(e) =>
                                  setOutpassDateFilter(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                              />
                            </div>
                          </div>
                          {(outpassSearchTerm ||
                            outpassStatusFilter ||
                            outpassDateFilter) && (
                              <button
                                onClick={clearOutpassFilters}
                                className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                Clear Filters
                              </button>
                            )}
                        </div>

                        <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                  <th className="w-12 px-4 py-3.5 text-left">
                                    <input
                                      type="checkbox"
                                      checked={
                                        paginatedOutpasses.length > 0 &&
                                        paginatedOutpasses.every((o) =>
                                          selectedOutpasses.includes(o._id)
                                        )
                                      }
                                      onChange={handleSelectAllOutpasses}
                                      className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 cursor-pointer"
                                      aria-label="Select all outpasses"
                                    />
                                  </th>

                                  <th className="px-6 py-3.5 text-left !text-xs !font-semibold !text-gray-600 uppercase tracking-wider">
                                    Student
                                  </th>

                                  <th className="px-6 py-3.5 text-left !text-xs !font-semibold !text-gray-600 uppercase tracking-wider">
                                    Room
                                  </th>

                                  <th className="px-6 py-3.5 text-left !text-xs !font-semibold !text-gray-600 uppercase tracking-wider">
                                    Destination
                                  </th>

                                  <th className="px-6 py-3.5 text-left !text-xs !font-semibold !text-gray-600 uppercase tracking-wider">
                                    Out Time
                                  </th>

                                  <th className="px-6 py-3.5 text-left !text-xs !font-semibold !text-gray-600 uppercase tracking-wider">
                                    Return Time
                                  </th>

                                  <th className="px-6 py-3.5 text-left !text-xs !font-semibold !text-gray-600 uppercase tracking-wider">
                                    Status
                                  </th>

                                  <th className="px-6 py-3.5 text-left !text-xs !font-semibold !text-gray-600 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedOutpasses.length === 0 ? (
                                  // Empty State
                                  <tr>
                                    <td
                                      colSpan="8"
                                      className="px-6 py-16 text-center"
                                    >
                                      <div className="flex flex-col items-center justify-center space-y-2">
                                        <p className="!text-base !font-medium !text-gray-500">
                                          No outpass requests found
                                        </p>
                                        <p className="!text-sm !text-gray-400">
                                          Try adjusting your filters or search
                                          criteria
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                ) : (
                                  // Data Rows
                                  paginatedOutpasses.map((outpass) => (
                                    <tr
                                      key={outpass.id}
                                      className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                      <td className="w-12 px-4 py-4">
                                        <input
                                          type="checkbox"
                                          checked={selectedOutpasses.includes(
                                            outpass._id
                                          )}
                                          onChange={() =>
                                            handleSelectOutpass(outpass._id)
                                          }
                                          className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 cursor-pointer"
                                          aria-label={`Select ${outpass.fullName}`}
                                        />
                                      </td>

                                      <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                          <span className="!text-sm !font-medium !text-gray-900">
                                            {outpass.fullName}
                                          </span>
                                          <span className="!text-xs !text-gray-500 mt-0.5">
                                            {outpass.rollNumber}
                                          </span>
                                        </div>
                                      </td>

                                      <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                          <span className="!text-sm !font-medium !text-gray-900">
                                            {outpass.roomNumber}
                                          </span>
                                          <span className="!text-xs !text-gray-500 mt-0.5">
                                            {outpass.semester
                                              ? `Sem ${outpass.semester}`
                                              : ""}
                                          </span>
                                        </div>
                                      </td>

                                      <td className="px-6 py-4">
                                        <span className="!text-sm !text-gray-900">
                                          {outpass.placeOfVisit}
                                        </span>
                                      </td>

                                      <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                          <span className="!text-sm !font-medium !text-gray-900">
                                            {new Date(
                                              outpass.outDate
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })}
                                          </span>
                                          <span className="!text-xs !text-gray-500 mt-0.5">
                                            {outpass.outTime}
                                          </span>
                                        </div>
                                      </td>

                                      <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                          <span className="!text-sm !font-medium !text-gray-900">
                                            {new Date(
                                              outpass.outDate
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })}
                                          </span>
                                          <span className="!text-xs !text-gray-500 mt-0.5">
                                            {outpass.expectedReturnTime}
                                          </span>
                                        </div>
                                      </td>

                                      <td className="px-6 py-4">
                                        <span
                                          className={`inline-flex items-center px-2.5 py-1 rounded-full !text-xs !font-medium ${outpass.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                            : outpass.status === "approved"
                                              ? "bg-green-100 text-green-700 border border-green-300"
                                              : outpass.status === "rejected"
                                                ? "bg-red-100 text-red-700 border border-red-300"
                                                : outpass.status === "expired"
                                                  ? "bg-gray-100 text-gray-700 border border-gray-300"
                                                  : "bg-gray-200 text-gray-800 border border-gray-400"
                                            }`}
                                        >
                                          {outpass.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            outpass.status.slice(1)}
                                        </span>
                                      </td>

                                      <td className="px-6 py-4">
                                        <button
                                          onClick={() => {
                                            setSelectedOutpass(outpass);
                                            setShowOutpassModal(true);
                                          }}
                                          className="px-3 py-1.5 !text-sm !font-medium text-gray-900 hover:text-white hover:bg-gray-900 rounded-md transition-all duration-150 border border-gray-300 hover:border-gray-900"
                                        >
                                          View Details
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>

                          {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 bg-white">
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="!text-sm !text-gray-600">
                                  Showing{" "}
                                  <span className="!font-medium !text-gray-900">
                                    {indexOfFirstItem + 1}
                                  </span>{" "}
                                  to{" "}
                                  <span className="!font-medium !text-gray-900">
                                    {Math.min(
                                      indexOfLastItem,
                                      filteredOutpasses.length
                                    )}
                                  </span>{" "}
                                  of{" "}
                                  <span className="!font-medium !text-gray-900">
                                    {filteredOutpasses.length}
                                  </span>{" "}
                                  requests
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 !text-sm !font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-150"
                                    aria-label="Previous page"
                                  >
                                    Previous
                                  </button>

                                  <div className="hidden sm:flex items-center gap-1 mx-2">
                                    {[...Array(totalPages)].map((_, i) => {
                                      const pageNumber = i + 1;
                                      const isCurrentPage =
                                        currentPage === pageNumber;

                                      return (
                                        <button
                                          key={pageNumber}
                                          onClick={() =>
                                            handlePageChange(pageNumber)
                                          }
                                          className={`min-w-[36px] px-3 py-1.5 !text-sm !font-medium rounded-md transition-all duration-150 ${isCurrentPage
                                            ? "bg-gray-900 text-white shadow-sm"
                                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                            }`}
                                          aria-label={`Page ${pageNumber}`}
                                          aria-current={
                                            isCurrentPage ? "page" : undefined
                                          }
                                        >
                                          {pageNumber}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  <div className="sm:hidden px-3 py-1.5 !text-sm !font-medium text-gray-700">
                                    Page {currentPage} of {totalPages}
                                  </div>

                                  <button
                                    onClick={() =>
                                      handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 !text-sm !font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-150"
                                    aria-label="Next page"
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="md:hidden space-y-4">
                          {paginatedOutpasses.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                              <p className="!text-lg !font-medium !text-gray-500">
                                No outpass requests found
                              </p>
                              <p className="!text-sm !text-gray-400 !mt-1">
                                Try adjusting your filters
                              </p>
                            </div>
                          ) : (
                            paginatedOutpasses.map((outpass) => (
                              <div
                                key={outpass.id}
                                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-start gap-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedOutpasses.includes(
                                        outpass.id
                                      )}
                                      onChange={() =>
                                        handleSelectOutpass(outpass.id)
                                      }
                                      className="mt-1 w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
                                    />
                                    <div>
                                      <h3 className="!text-lg !font-semibold !text-gray-900">
                                        {outpass.name}
                                      </h3>
                                      <p className="!text-sm !text-gray-500">
                                        {outpass.roll}
                                      </p>
                                    </div>
                                  </div>
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full !text-xs !font-semibold ${outpass.status === "Pending"
                                      ? "bg-gray-100 text-gray-700 border border-gray-300"
                                      : outpass.status === "Approved"
                                        ? "bg-gray-900 text-white border border-gray-900"
                                        : "bg-gray-200 text-gray-800 border border-gray-400"
                                      }`}
                                  >
                                    {outpass.status}
                                  </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                  <div className="flex justify-between">
                                    <span className="!text-sm !text-gray-500">
                                      Room:
                                    </span>
                                    <span className="!text-sm !font-medium !text-gray-900">
                                      {outpass.room} ({outpass.hostelBlock})
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="!text-sm !text-gray-500">
                                      Destination:
                                    </span>
                                    <span className="!text-sm !font-medium !text-gray-900">
                                      {outpass.placeOfVisit}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="!text-sm !text-gray-500">
                                      Out:
                                    </span>
                                    <span className="!text-sm !font-medium !text-gray-900">
                                      {new Date(
                                        outpass.outDate
                                      ).toLocaleDateString()}{" "}
                                      {outpass.outTime}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="!text-sm !text-gray-500">
                                      Return:
                                    </span>
                                    <span className="!text-sm !font-medium !text-gray-900">
                                      {new Date(
                                        outpass.returnDate
                                      ).toLocaleDateString()}{" "}
                                      {outpass.returnTime}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    setSelectedOutpass(outpass);
                                    setShowOutpassModal(true);
                                  }}
                                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors !text-sm !font-medium"
                                >
                                  View Details
                                </button>
                              </div>
                            ))
                          )}

                          {totalPages > 1 && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                              <div className="flex justify-between items-center mb-3">
                                <p className="!text-sm !text-gray-700">
                                  Page {currentPage} of {totalPages}
                                </p>
                              </div>
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() =>
                                    handlePageChange(currentPage - 1)
                                  }
                                  disabled={currentPage === 1}
                                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed !text-sm"
                                >
                                  Previous
                                </button>
                                <button
                                  onClick={() =>
                                    handlePageChange(currentPage + 1)
                                  }
                                  disabled={currentPage === totalPages}
                                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed !text-sm"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {showOutpassModal && selectedOutpass && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
                            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
                                <h3 className="!text-2xl !font-semibold !text-gray-900 text-center flex-1">
                                  Outpass Details
                                </h3>
                                <button
                                  onClick={() => {
                                    setShowOutpassModal(false);
                                    setSelectedOutpass(null);
                                    setShowConfirmAction(false);
                                  }}
                                  className="text-gray-400 hover:text-gray-700 transition-colors !text-2xl !font-light"
                                >
                                  ×
                                </button>
                              </div>

                              <div className="p-8 space-y-8">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                  <h6 className="!text-base !font-semibold !text-gray-900 !mb-5 pb-2 border-b border-gray-100">
                                    Student Information
                                  </h6>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Student Name
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {selectedOutpass.fullName}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Roll Number
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {selectedOutpass.rollNumber}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Room Number
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {selectedOutpass.roomNumber}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Semester
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {selectedOutpass.semester}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Student Phone
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {selectedOutpass.studentContact}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Emergency Contact
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {selectedOutpass.emergencyContact}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2 md:col-span-2">
                                      <span className="!text-sm !text-gray-500">
                                        Email
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {selectedOutpass.email}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                  <h6 className="!text-base !font-semibold !text-gray-900 !mb-5 pb-2 border-b border-gray-100">
                                    Visit Information
                                  </h6>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Place of Visit
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {selectedOutpass.placeOfVisit}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Out Date
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {new Date(
                                          selectedOutpass.outDate
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Out Time
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {selectedOutpass.outTime}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Expected Return Time
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {selectedOutpass.expectedReturnTime}
                                      </span>
                                    </div>
                                    {selectedOutpass.remarks && (
                                      <div className="flex flex-col gap-2 py-2 md:col-span-2">
                                        <span className="!text-sm !text-gray-500">
                                          Remarks
                                        </span>
                                        <span className="!text-sm !text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">
                                          {selectedOutpass.remarks}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                  <h6 className="!text-base !font-semibold !text-gray-900 !mb-5 pb-2 border-b border-gray-100">
                                    Request Information
                                  </h6>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Request ID
                                      </span>
                                      <span className="!text-xs !font-medium !text-gray-900 text-right font-mono">
                                        {selectedOutpass._id}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Created At
                                      </span>
                                      <span className="!text-sm !font-medium !text-gray-900 text-right">
                                        {new Date(
                                          selectedOutpass.createdAt
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start py-2">
                                      <span className="!text-sm !text-gray-500">
                                        Status
                                      </span>
                                      <span
                                        className={`inline-flex items-center px-3 py-1 rounded !text-xs !font-medium ${selectedOutpass.status === "pending"
                                          ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                          : selectedOutpass.status ===
                                            "approved"
                                            ? "bg-green-100 text-green-700 border border-green-300"
                                            : selectedOutpass.status ===
                                              "rejected"
                                              ? "bg-red-100 text-red-700 border border-red-300"
                                              : selectedOutpass.status === "expired"
                                                ? "bg-gray-100 text-gray-700 border border-gray-300"
                                                : "bg-gray-200 text-gray-800 border border-gray-400"
                                          }`}
                                      >
                                        {selectedOutpass.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          selectedOutpass.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {selectedOutpass.status === "pending" && (
                                  <div className="pt-2">
                                    {!showConfirmAction ? (
                                      <div className="flex gap-3">
                                        <button
                                          onClick={() => {
                                            setConfirmActionType("approve");
                                            setShowConfirmAction(true);
                                          }}
                                          className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 !text-sm !font-medium shadow-sm hover:shadow"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => {
                                            setConfirmActionType("reject");
                                            setShowConfirmAction(true);
                                          }}
                                          className="flex-1 px-6 py-3 bg-white text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 !text-sm !font-medium shadow-sm hover:shadow"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                                        <p className="!text-sm !text-gray-700 !mb-4">
                                          Are you sure you want to{" "}
                                          <span className="!font-semibold">
                                            {confirmActionType}
                                          </span>{" "}
                                          this outpass request?
                                        </p>
                                        <div className="flex gap-3">
                                          <button
                                            onClick={() =>
                                              handleOutpassAction(
                                                selectedOutpass._id,
                                                confirmActionType
                                              )
                                            }
                                            disabled={localIsLoading}
                                            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 !text-sm !font-medium cursor-pointer"
                                          >
                                            {localIsLoading
                                              ? "Processing..."
                                              : "Confirm"}
                                          </button>
                                          <button
                                            onClick={() =>
                                              setShowConfirmAction(false)
                                            }
                                            disabled={localIsLoading}
                                            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 !text-sm !font-medium cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    
    </div>
  )
}

export default Outpass
