      
      import React, { useState, useEffect } from "react";
      
      const Stats = () => {

          
          const [websiteStats, setWebsiteStats] = useState(null);
          
        return (
          <div>
            
            
                         <div className="!w-full !bg-white !rounded-3xl !shadow-lg !border !border-gray-200 !p-6 sm:!p-8 md:!p-10 !max-w-6xl !mx-auto !space-y-6">
                        <div className="!text-center !pb-6 !border-b-2 !border-gray-900">
                          <h3 className="!text-3xl sm:!text-4xl !font-black !text-gray-900 !tracking-tight">
                            Statistics Dashboard
                          </h3>
                          <p className="!text-sm !text-gray-500 !font-medium !mt-2">
                            System Overview & Analytics
                          </p>
                        </div>

                        <div className="!bg-white !border-2 !border-gray-200 !rounded-2xl !overflow-hidden !shadow-sm">
                          <div className="!bg-gray-900 !px-6 !py-4">
                            <h6 className="!text-lg !font-bold !text-white !uppercase !tracking-wide">
                              System Overview
                            </h6>
                          </div>
                          <div className="!overflow-x-auto">
                            <table className="!w-full">
                              <thead className="!bg-gray-50 !border-b-2 !border-gray-200">
                                <tr>
                                  <th className="!px-6 !py-4 !text-left !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider">
                                    Metric
                                  </th>
                                  <th className="!px-6 !py-4 !text-right !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider">
                                    Count
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="!divide-y !divide-gray-200">
                                <tr className="hover:!bg-gray-50 !transition-colors">
                                  <td className="!px-6 !py-4">
                                    <div className="!flex !items-center !gap-3">
                                      <div className="!w-10 !h-10 !bg-gray-900 !rounded-lg !flex !items-center !justify-center !flex-shrink-0">
                                        <svg
                                          className="!w-5 !h-5 !text-white"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                          />
                                        </svg>
                                      </div>
                                      <span className="!text-sm !font-semibold !text-gray-900">
                                        Total Students
                                      </span>
                                    </div>
                                  </td>
                                  <td className="!px-6 !py-4 !text-right">
                                    <span className="!text-2xl !font-black !text-gray-900">
                                      {websiteStats?.totalStudents || 0}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="hover:!bg-gray-50 !transition-colors">
                                  <td className="!px-6 !py-4">
                                    <div className="!flex !items-center !gap-3">
                                      <div className="!w-10 !h-10 !bg-gray-900 !rounded-lg !flex !items-center !justify-center !flex-shrink-0">
                                        <svg
                                          className="!w-5 !h-5 !text-white"
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
                                      <span className="!text-sm !font-semibold !text-gray-900">
                                        Total Complaints
                                      </span>
                                    </div>
                                  </td>
                                  <td className="!px-6 !py-4 !text-right">
                                    <span className="!text-2xl !font-black !text-gray-900">
                                      {websiteStats?.totalComplaints || 0}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="!bg-white !border-2 !border-gray-200 !rounded-2xl !overflow-hidden !shadow-sm">
                          <div className="!bg-gray-900 !px-6 !py-4">
                            <h6 className="!text-lg !font-bold !text-white !uppercase !tracking-wide">
                              Complaint Status Breakdown
                            </h6>
                          </div>
                          <div className="!overflow-x-auto">
                            <table className="!w-full">
                              <thead className="!bg-gray-50 !border-b-2 !border-gray-200">
                                <tr>
                                  <th className="!px-6 !py-4 !text-left !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider">
                                    Status
                                  </th>
                                  <th className="!px-6 !py-4 !text-right !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider">
                                    Count
                                  </th>
                                  <th className="!px-6 !py-4 !text-right !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider">
                                    Percentage
                                  </th>
                                  <th className="!px-6 !py-4 !text-left !text-xs !font-bold !text-gray-700 !uppercase !tracking-wider">
                                    Progress
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="!divide-y !divide-gray-200">
                                <tr className="hover:!bg-gray-50 !transition-colors">
                                  <td className="!px-6 !py-4">
                                    <div className="!flex !items-center !gap-3">
                                      <div className="!w-3 !h-3 !bg-gray-900 !rounded-full"></div>
                                      <span className="!text-sm !font-semibold !text-gray-900">
                                        Resolved
                                      </span>
                                    </div>
                                  </td>
                                  <td className="!px-6 !py-4 !text-right">
                                    <span className="!text-2xl !font-black !text-gray-900">
                                      {websiteStats?.resolvedComplaints || 0}
                                    </span>
                                  </td>
                                  <td className="!px-6 !py-4 !text-right">
                                    <span className="!text-lg !font-bold !text-gray-700">
                                      {websiteStats?.totalComplaints
                                        ? Math.round(
                                          (websiteStats.resolvedComplaints /
                                            websiteStats.totalComplaints) *
                                          100
                                        )
                                        : 0}
                                      %
                                    </span>
                                  </td>
                                  <td className="!px-6 !py-4">
                                    <div className="!w-full !max-w-xs !bg-gray-200 !rounded-full !h-3">
                                      <div
                                        className="!bg-gray-900 !h-3 !rounded-full !transition-all !duration-500"
                                        style={{
                                          width: `${websiteStats?.totalComplaints
                                            ? Math.round(
                                              (websiteStats.resolvedComplaints /
                                                websiteStats.totalComplaints) *
                                              100
                                            )
                                            : 0
                                            }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="hover:!bg-gray-50 !transition-colors">
                                  <td className="!px-6 !py-4">
                                    <div className="!flex !items-center !gap-3">
                                      <div className="!w-3 !h-3 !bg-gray-600 !rounded-full"></div>
                                      <span className="!text-sm !font-semibold !text-gray-900">
                                        Pending
                                      </span>
                                    </div>
                                  </td>
                                  <td className="!px-6 !py-4 !text-right">
                                    <span className="!text-2xl !font-black !text-gray-900">
                                      {websiteStats?.pendingComplaints || 0}
                                    </span>
                                  </td>
                                  <td className="!px-6 !py-4 !text-right">
                                    <span className="!text-lg !font-bold !text-gray-700">
                                      {websiteStats?.totalComplaints
                                        ? Math.round(
                                          (websiteStats.pendingComplaints /
                                            websiteStats.totalComplaints) *
                                          100
                                        )
                                        : 0}
                                      %
                                    </span>
                                  </td>
                                  <td className="!px-6 !py-4">
                                    <div className="!w-full !max-w-xs !bg-gray-200 !rounded-full !h-3">
                                      <div
                                        className="!bg-gray-600 !h-3 !rounded-full !transition-all !duration-500"
                                        style={{
                                          width: `${websiteStats?.totalComplaints
                                            ? Math.round(
                                              (websiteStats.pendingComplaints /
                                                websiteStats.totalComplaints) *
                                              100
                                            )
                                            : 0
                                            }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="hover:!bg-gray-50 !transition-colors">
                                  <td className="!px-6 !py-4">
                                    <div className="!flex !items-center !gap-3">
                                      <div className="!w-3 !h-3 !bg-gray-400 !rounded-full"></div>
                                      <span className="!text-sm !font-semibold !text-gray-900">
                                        Rejected
                                      </span>
                                    </div>
                                  </td>
                                  <td className="!px-6 !py-4 !text-right">
                                    <span className="!text-2xl !font-black !text-gray-900">
                                      {websiteStats?.rejectedComplaints || 0}
                                    </span>
                                  </td>
                                  <td className="!px-6 !py-4 !text-right">
                                    <span className="!text-lg !font-bold !text-gray-700">
                                      {websiteStats?.totalComplaints
                                        ? Math.round(
                                          (websiteStats.rejectedComplaints /
                                            websiteStats.totalComplaints) *
                                          100
                                        )
                                        : 0}
                                      %
                                    </span>
                                  </td>
                                  <td className="!px-6 !py-4">
                                    <div className="!w-full !max-w-xs !bg-gray-200 !rounded-full !h-3">
                                      <div
                                        className="!bg-gray-400 !h-3 !rounded-full !transition-all !duration-500"
                                        style={{
                                          width: `${websiteStats?.totalComplaints
                                            ? Math.round(
                                              (websiteStats.rejectedComplaints /
                                                websiteStats.totalComplaints) *
                                              100
                                            )
                                            : 0
                                            }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    
          </div>
        )
      }
      
      export default Stats
      
      
      