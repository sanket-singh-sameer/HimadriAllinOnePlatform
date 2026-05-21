import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../../Utils/axiosInstance";
import { API_PATHS } from "../../../../../Utils/apiPaths";

const Complaints = () => {
  const [complaintsItemsPerPage] = useState(10);

  const [websiteStats, setWebsiteStats] = useState(null);
  const [roomSearchFilter, setRoomSearchFilter] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [localIsLoading, setLocalIsLoading] = useState(false);

  const handleRoomSearchChange = (e) => {
    const roomValue = e.target.value;
    setRoomSearchFilter(roomValue);
    setComplaintsCurrentPage(1); // Reset to first page when filter changes
    applyFilters(selectedStatusFilter, selectedCategoryFilter, roomValue);
  };

  const [complaintsList, setComplaintsList] = useState([]);
  const [complaintsListTemp, setComplaintsListTemp] = useState([]);
  const complaintsTotalPages = Math.ceil(
    complaintsListTemp.length / complaintsItemsPerPage,
  );
  const [complaintsCurrentPage, setComplaintsCurrentPage] = useState(1);
  const complaintsIndexOfLastItem =
    complaintsCurrentPage * complaintsItemsPerPage;
  const complaintsIndexOfFirstItem =
    complaintsIndexOfLastItem - complaintsItemsPerPage;
  const paginatedComplaints = complaintsListTemp.slice(
    complaintsIndexOfFirstItem,
    complaintsIndexOfLastItem,
  );

  const applyFilters = (status = selectedStatusFilter, category = selectedCategoryFilter, room = roomSearchFilter) => {
    const filtered = complaintsList.filter((complaint) => {
      const matchesStatus = !status || complaint.status === status;
      const matchesCategory = !category || complaint.category === category;
      const matchesRoom = !room || complaint.room?.toLowerCase().includes(room.toLowerCase());
      return matchesStatus && matchesCategory && matchesRoom;
    });

    setComplaintsListTemp(filtered);
    setComplaintsCurrentPage(1);
    setOpenIndex(null);
  };

  const handleFilterChangeByStatus = (status) => {
    setSelectedStatusFilter(status);
    applyFilters(status, selectedCategoryFilter, roomSearchFilter);
  };

  const handleFilterChangeByCategory = (category) => {
    setSelectedCategoryFilter(category);
    applyFilters(selectedStatusFilter, category, roomSearchFilter);
  };

  const clearAllFilters = () => {
    setRoomSearchFilter("");
    setSelectedStatusFilter("");
    setSelectedCategoryFilter("");
    setComplaintsListTemp(complaintsList);
    setComplaintsCurrentPage(1);
    setOpenIndex(null);
  };

  const handleComplaintsPageChange = (pageNumber) => {
    const nextPage = Math.max(1, Math.min(pageNumber, complaintsTotalPages));
    setComplaintsCurrentPage(nextPage);
    setOpenIndex(null);
  };

  const toggleAccordion = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const updateComplaintStatus = async (complaintId, status) => {
    try {
      setLocalIsLoading(true);
      const response = await axiosInstance.put(API_PATHS.UPDATE_COMPLAINT_STATUS(complaintId), {
        status,
      });

      const updatedComplaint = response.data.complaint;
      setComplaintsList((current) =>
        current.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, ...updatedComplaint } : complaint
        )
      );
      applyFilters();
    } catch (error) {
      console.error("Error updating complaint status:", error);
    } finally {
      setLocalIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch complaints data from the backend API
    const fetchComplaints = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.FETCH_ALL_COMPLAINTS);
        const data = response.data.complaints || [];
        console.log("Fetched complaints data:", data);
        setComplaintsList(data);
        setComplaintsListTemp(data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div>
      <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
        <div className="!text-center !pb-6 !border-b-2 !border-gray-900">
          <h3 className="!text-3xl sm:!text-4xl !font-black !text-gray-900 !tracking-tight">
            Complaint Register
          </h3>
          <p className="!text-sm !text-gray-500 !font-medium !mt-2">
            Centralized Overview of Complaints & Status
          </p>
        </div>
        <div className="my-6 flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label
                className="text-gray-700 font-medium text-sm whitespace-nowrap"
                htmlFor="room-search-filter"
              >
                Search by Room:
              </label>
              <div className="relative">
                <input
                  id="room-search-filter"
                  type="text"
                  value={roomSearchFilter}
                  onChange={handleRoomSearchChange}
                  placeholder="Enter room number..."
                  className="w-full sm:w-auto min-w-[160px] border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
                />
                <svg
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label
                className="text-gray-700 font-medium text-sm whitespace-nowrap"
                htmlFor="complaint-filter-01"
              >
                Filter by Status:
              </label>
              <select
                id="complaint-filter-01"
                value={selectedStatusFilter}
                onChange={(e) => handleFilterChangeByStatus(e.target.value)}
                className="w-full sm:w-auto min-w-[140px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label
                className="text-gray-700 font-medium text-sm whitespace-nowrap"
                htmlFor="complaint-filter-02"
              >
                Filter by Category:
              </label>
              <select
                id="complaint-filter-02"
                value={selectedCategoryFilter}
                onChange={(e) => handleFilterChangeByCategory(e.target.value)}
                className="w-full sm:w-auto min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Bathroom-Related">Bathroom-Related</option>
                <option value="Water-Related">Water-Related</option>
                <option value="Electricity-Related">Electricity-Related</option>
                <option value="Mess-Related">Mess-Related</option>
                <option value="Internet-Related">Internet-Related</option>
                <option value="Floor-Related">Floor-Related</option>
                <option value="Elevator-Related">Elevator-Related</option>
                <option value="Furniture-Related">Furniture-Related</option>
                <option value="Security-Related">Security-Related</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {(selectedStatusFilter ||
              selectedCategoryFilter ||
              roomSearchFilter) && (
              <div className="flex justify-center sm:justify-end lg:justify-start">
                <button
                  onClick={clearAllFilters}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition cursor-pointer text-sm font-medium min-w-[120px]"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {(selectedStatusFilter ||
            selectedCategoryFilter ||
            roomSearchFilter) && (
            <div className="flex flex-wrap gap-2 lg:hidden">
              {selectedStatusFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Status: {selectedStatusFilter}
                  <button
                    onClick={() => handleFilterChangeByStatus("")}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategoryFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Category: {selectedCategoryFilter}
                  <button
                    onClick={() => handleFilterChangeByCategory("")}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {roomSearchFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  Room: {roomSearchFilter}
                  <button
                    onClick={() => {
                      setRoomSearchFilter("");
                      applyFilters(
                        selectedStatusFilter,
                        selectedCategoryFilter,
                        "",
                      );
                    }}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        <div className="relative my-8 sm:my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 sm:px-4 bg-white text-gray-400 text-xs sm:text-sm font-medium">
              {selectedStatusFilter ||
              selectedCategoryFilter ||
              roomSearchFilter
                ? `Filtered Complaints (${complaintsListTemp.length})`
                : `All Complaints (${complaintsListTemp.length})`}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-6">
            {paginatedComplaints.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No complaints found
                </h3>
                <p className="text-gray-500 text-sm">
                  {selectedStatusFilter ||
                  selectedCategoryFilter ||
                  roomSearchFilter
                    ? "Try adjusting your filters to see more results."
                    : "No complaints have been submitted yet."}
                </p>
              </div>
            ) : (
              paginatedComplaints.map((complaint, index) => (
                <div
                  key={complaint.serial}
                  className="border rounded-2xl lg:rounded-3xl shadow-md bg-white transition-all duration-500 hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 lg:p-8 text-left cursor-pointer gap-3 sm:gap-0"
                  >
                    <div className="flex flex-col items-start justify-center space-y-1 sm:space-y-1">
                      <h3 className="text-lg sm:text-xl lg:!text-2xl !font-bold !text-gray-900 !tracking-tight !leading-snug flex items-center">
                        Complaint #{complaint.serial} &nbsp;
                        <span className="font-light text-lg">
                          [Registerd on: {complaint.date}]
                        </span>
                      </h3>
                      <p className="text-sm sm:!text-base !font-medium !text-gray-600 !leading-snug !opacity-100 line-clamp-2">
                        {complaint.title}
                      </p>
                      <p className="text-xs sm:!text-base !font-medium !text-gray-600 !leading-snug !opacity-100">
                        Room No: &nbsp;{complaint.room}
                      </p>
                    </div>

                    <span
                      className={`self-start sm:self-center text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm min-w-fit ${
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
                      {complaint.status}
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-700 overflow-hidden ${
                      openIndex === index
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-3 text-gray-700 text-sm sm:text-base">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <p className="!font-medium !text-gray-900 !opacity-100">
                          <span className="text-gray-600">Category:</span>{" "}
                          {complaint.category}
                        </p>
                        <p className="!font-medium !text-gray-900 !opacity-100">
                          <span className="text-gray-600">Date:</span>{" "}
                          {complaint.date}
                        </p>
                      </div>

                      <div className="pt-2">
                        <p className="!font-medium !text-gray-900 !opacity-100 mb-2">
                          <span className="text-gray-600">Description:</span>
                        </p>
                        <p className="!font-light !text-gray-900 !opacity-100 pl-4 border-l-2 border-gray-200">
                          {complaint.description}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center flex-wrap gap-2 sm:gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() =>
                            updateComplaintStatus(complaint._id, "Resolved")
                          }
                          disabled={complaint.status === "Resolved" || localIsLoading}
                          className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium shadow-sm hover:bg-green-200 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {localIsLoading ? "Loading..." : "✓ Resolved"}
                        </button>
                        <button
                          onClick={() =>
                            updateComplaintStatus(complaint._id, "Pending")
                          }
                          disabled={complaint.status === "Pending" || localIsLoading}
                          className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 font-medium shadow-sm hover:bg-yellow-200 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {localIsLoading ? "Loading..." : "⚠️ Pending"}
                        </button>
                        <button
                          onClick={() =>
                            updateComplaintStatus(complaint._id, "Rejected")
                          }
                          disabled={complaint.status === "Rejected" || localIsLoading}
                          className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl bg-red-100 text-red-700 font-medium shadow-sm hover:bg-red-200 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {localIsLoading ? "Loading..." : "✗ Rejected"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {complaintsTotalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
            {/* Results Summary */}
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {complaintsIndexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(complaintsIndexOfLastItem, complaintsListTemp.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{complaintsListTemp.length}</span>{" "}
              complaints
            </div>

            {/* Desktop Pagination */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() =>
                  handleComplaintsPageChange(complaintsCurrentPage - 1)
                }
                disabled={complaintsCurrentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {[...Array(complaintsTotalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  pageNumber === 1 ||
                  pageNumber === complaintsTotalPages ||
                  (pageNumber >= complaintsCurrentPage - 1 &&
                    pageNumber <= complaintsCurrentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handleComplaintsPageChange(pageNumber)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        complaintsCurrentPage === pageNumber
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === complaintsCurrentPage - 2 ||
                  pageNumber === complaintsCurrentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() =>
                  handleComplaintsPageChange(complaintsCurrentPage + 1)
                }
                disabled={complaintsCurrentPage === complaintsTotalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>

            {/* Mobile Pagination */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() =>
                  handleComplaintsPageChange(complaintsCurrentPage - 1)
                }
                disabled={complaintsCurrentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-sm text-gray-700">
                Page {complaintsCurrentPage} of {complaintsTotalPages}
              </span>
              <button
                onClick={() =>
                  handleComplaintsPageChange(complaintsCurrentPage + 1)
                }
                disabled={complaintsCurrentPage === complaintsTotalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
