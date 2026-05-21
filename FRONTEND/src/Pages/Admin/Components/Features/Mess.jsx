import React, { useEffect, useState } from "react";
import { API_PATHS } from "../../../../../Utils/apiPaths";
import axiosInstance from "../../../../../Utils/axiosInstance";

const Mess = () => {
  const [todaysMenu, setTodaysMenu] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState(null);

  const [activeFeature, setActiveFeature] = useState("mess");
  const [websiteStats, setWebsiteStats] = useState(null);

  const fetchTodaysMenu = async () => {
    setMenuLoading(true);
    setMenuError(null);

    try {
      const response = await axiosInstance.get(API_PATHS.FETCH_TODAYS_MENU);
      setTodaysMenu(response.data);
    } catch (error) {
      console.error("Error fetching today's menu:", error);
      setTodaysMenu(null);
      setMenuError(
        error.response?.data?.message || "Failed to load today's mess menu",
      );
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysMenu();
  }, []);

  return (
    <div>
      <div className="w-full space-y-6 max-w-6xl mx-auto">
        {menuLoading && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 shadow-sm">
            Loading today's mess menu...
          </div>
        )}

        {menuError && !menuLoading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            {menuError}
          </div>
        )}

        {/* Header Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border-2 border-gray-700 p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="!text-3xl sm:!text-4xl lg:!text-5xl !font-extrabold !text-white !mb-3">
                Today's Mess Menu
              </h2>
              <p className="!text-base sm:!text-lg !text-gray-300 !font-medium">
                Daily meal schedule for hostel residents
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-16 w-1 bg-gray-600 hidden lg:block"></div>
              <div className="bg-white rounded-xl px-8 py-4 shadow-lg border-2 border-gray-200">
                <p className="!text-xs !font-bold !text-gray-500 uppercase tracking-widest !mb-1">
                  Current Day
                </p>
                <p className="!text-2xl sm:!text-3xl !font-black !text-gray-900">
                  {todaysMenu?.day || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mess Menu Table */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-4 text-left !text-sm !font-bold !text-white uppercase tracking-wider w-1/4 border-r border-gray-700">
                    Meal Time
                  </th>
                  <th className="px-6 py-4 text-left !text-sm !font-bold !text-white uppercase tracking-wider">
                    Menu Items
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 !text-base !font-bold !text-gray-900 bg-gray-50 border-r border-gray-200">
                    Breakfast
                  </td>
                  <td className="px-6 py-5 !text-base !text-gray-700 leading-relaxed">
                    {todaysMenu?.breakfast || "N/A"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 !text-base !font-bold !text-gray-900 bg-gray-50 border-r border-gray-200">
                    Lunch
                  </td>
                  <td className="px-6 py-5 !text-base !text-gray-700 leading-relaxed">
                    {todaysMenu?.lunch || "N/A"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 !text-base !font-bold !text-gray-900 bg-gray-50 border-r border-gray-200">
                    Snacks
                  </td>
                  <td className="px-6 py-5 !text-base !text-gray-700 leading-relaxed">
                    {todaysMenu?.snacks || "N/A"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 !text-base !font-bold !text-gray-900 bg-gray-50 border-r border-gray-200">
                    Dinner
                  </td>
                  <td className="px-6 py-5 !text-base !text-gray-700 leading-relaxed">
                    {todaysMenu?.dinner || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            <div className="p-5 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="!text-lg !font-bold !text-gray-900">
                  Breakfast
                </h3>
              </div>
              <p className="!text-sm !text-gray-700 leading-relaxed">
                {todaysMenu?.breakfast || "N/A"}
              </p>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="!text-lg !font-bold !text-gray-900">Lunch</h3>
              </div>
              <p className="!text-sm !text-gray-700 leading-relaxed">
                {todaysMenu?.lunch || "N/A"}
              </p>
            </div>

            <div className="p-5 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="!text-lg !font-bold !text-gray-900">Snacks</h3>
              </div>
              <p className="!text-sm !text-gray-700 leading-relaxed">
                {todaysMenu?.snacks || "N/A"}
              </p>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="!text-lg !font-bold !text-gray-900">Dinner</h3>
              </div>
              <p className="!text-sm !text-gray-700 leading-relaxed">
                {todaysMenu?.dinner || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-5 sm:p-6">
          <p className="!text-sm !font-semibold !text-gray-900 mb-2">
            Important Information
          </p>
          <p className="!text-xs sm:!text-sm !text-gray-600 leading-relaxed">
            The menu is subject to change based on availability. For any dietary
            concerns or special requests, please contact the mess committee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mess;
