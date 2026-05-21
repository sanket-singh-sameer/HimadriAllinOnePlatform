import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { API_PATHS } from "../../../Utils/apiPaths.js";
import axiosInstance from "../../../Utils/axiosInstance.js";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Nav from "./Nav.jsx";
import Profile from "./DProfile.jsx";
import Footer from "../../Components/Footer.jsx";
import Notice from "./DNotice.jsx";
import Feature from "./Feature/page.jsx";
const Dashboard = () => {

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea]">
        <main className="flex-1 flex flex-col">


           
         <Nav/>
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 flex-1">
           
           
           <Profile/>
             <Notice/>
            
            <Feature/>
          </div>
          <Footer></Footer>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
  