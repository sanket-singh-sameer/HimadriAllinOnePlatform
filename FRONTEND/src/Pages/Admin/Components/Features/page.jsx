import React, { useState, useEffect } from "react";
import { API_PATHS } from "../../../../../Utils/apiPaths";
import axiosInstance from "../../../../../Utils/axiosInstance";
import { useAuthStore } from "../../../../store/authStore";
// import { set } from "mongoose";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Stats from "./Stats";
import Complaints from "./Complaints";
import Mess from "./Mess";

import Outpass from "./Outpass";
import Attendance from "./Attendance";
import Records from "./Records";
import Sancks from "./Snacks";


export default function Features() {
  
  

  
  const [websiteStats, setWebsiteStats] = useState(null);
  
  const [activeFeature, setActiveFeature] = useState("statistics");
 

  const COLORS = ["#4ade80", "#f87171"];

  return (
    <>
       <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100 hover:border-gray-200 lg:col-span-3 flex flex-col relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                     </div>
                     <h3 className="!text-xl sm:!text-2xl md:!text-3xl !font-black !text-gray-900 tracking-tight">
                      Features
                          </h3>
                               </div>
                          <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-md group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                           <span className="relative inline-block px-2 py-1 sm:px-3 sm:py-1 !text-xs sm:!text-sm !font-bold !tracking-wide bg-gradient-to-r from-purple-50 to-pink-50 !text-purple-700 rounded-full border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 uppercase">
                        Active
                           </span>
                          </div>
                             </div>

                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                            {/*Stats*/}
                         <div className="flex flex-col space-y-2 sm:space-y-3 lg:space-y-4 mt-2 sm:mt-4 lg:mt-6">
                        <button
                      onClick={() => setActiveFeature("statistics")}
                      className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${activeFeature === "statistics"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                        }`}
                        >
                      View Statistics
                          </button>
                      {/*Stats*/}


                     {/*Complaints*/}
                          <button
                      onClick={() => setActiveFeature("complaints")}
                      className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${activeFeature === "complaints"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                        }`}
                         >
                           Manage Complaints
                         </button>

                        {/*Complaints*/}

                       {/*Records*/}
                       <button
                      onClick={() => setActiveFeature("records")}
                      className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${activeFeature === "records"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                      Student Records
                     </button>
                       {/*Records*/}

                       {/*Mess Menu*/}
                     <button
                      onClick={() => setActiveFeature("mess")}
                      className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${activeFeature === "mess"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                        }`}
                     >
                      Today’s Mess Menu
                     </button>

                      {/*Mess Menu*/}

                      {/*Outpass*/}

                     <button
                      onClick={() => setActiveFeature("outpass")}
                      className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${activeFeature === "outpass"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                        }`}
                     >
                      Manage Outpasses
                      </button>


                        {/*Outpass*/}

                         {/*Attendance*/}
                        <button
                            onClick={() => setActiveFeature("attendance")}
                            className={`w-full cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 font-bold tracking-wide border-2 hover:shadow-md hover:scale-105 ${activeFeature === "attendance"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                        }`}
                              >
                             Attendance Manager
                              </button>
                             {/*Attendance*/}
                                  </div>
                             
                            <div className="lg:col-span-3 bg-gray-50 rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-5 lg:p-6 shadow-inner">
                              {/*Stats*/}
                      {activeFeature === "statistics" && <Stats/>}
                    {/*Stats*/}
                    
                    {/*Complaints*/}
                    {activeFeature === "complaints" && <Complaints/>}
                     {/*Complaints*/}

                     {/*Student Record*/}
                     {activeFeature === "records" && <Records/>}
                   
                     {/*Student Record*/}


                     {/*Todays Mess Menu*/}
                    {activeFeature === "mess" && <Mess/>}
                    {/*Todays Mess Menu*/}
                     

                     {/*OutPass*/}
                    {activeFeature === "outpass" && <Outpass/>}
                    {/*OutPass*/}


                    {/*Attendance*/}
                    {activeFeature === "attendance" && <Attendance/>}
                    {/*Attendance*/}

                    {/*Snacks*/}
                    {activeFeature === "manageSnacks" && <Snacks/>}
                    {/*Snacks*/}
                  </div>
                </div>
              </div>

                {/* Export Attendance Modal */}
        




      
    </>
  );
}
