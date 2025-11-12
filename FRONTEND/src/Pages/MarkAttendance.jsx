import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";

const MarkAttendance = () => {
  const { roll } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const hasMarkedRef = useRef(false); // Prevent double API calls in Strict Mode

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mark attendance on component mount
  useEffect(() => {
    const markAttendance = async () => {
      // Prevent double execution in React Strict Mode
      if (hasMarkedRef.current) return;
      hasMarkedRef.current = true;

      if (!roll) {
        setError("No roll number provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.post(
          API_PATHS.MARK_MESS_ATTENDANCE(roll.toUpperCase())
        );

        setAttendanceData(response.data);
        setLoading(false);
        
        // Show success toast only once
        if (response.data.alreadyMarked) {
          toast.warning(response.data.message);
        } else {
          toast.success(response.data.message);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to mark attendance"
        );
        setLoading(false);
        toast.error(err.response?.data?.message || "Failed to mark attendance");
      }
    };

    markAttendance();
  }, [roll]);

  // Helper function to get meal emoji
  const getMealEmoji = (meal) => {
    switch (meal?.toLowerCase()) {
      case "breakfast":
        return "🌅";
      case "lunch":
        return "🌞";
      case "dinner":
        return "🌙";
      default:
        return "🍽️";
    }
  };

  // Helper function to get current time greeting
  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 10) return "Good Morning";
    if (hour >= 11 && hour < 15) return "Good Afternoon";
    if (hour >= 18 && hour < 22) return "Good Evening";
    return "Hello";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Marking Attendance...
          </h2>
          <p className="text-gray-600">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Check if it's outside meal hours
    const isOutsideMealHours = error.includes("meal times");
    const isUserNotFound = error.includes("not found");

    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideIn">
          {/* Header */}
          <div className={`p-8 text-center ${
            isOutsideMealHours ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-red-500 to-pink-600"
          }`}>
            <div className="text-8xl mb-4 animate-bounce">
              {isOutsideMealHours ? "⏰" : isUserNotFound ? "❌" : "🔧"}
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              {isOutsideMealHours ? "Outside Meal Hours" : isUserNotFound ? "Student Not Found" : "Error"}
            </h1>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-xl text-gray-700 text-center mb-6">{error}</p>

            {isOutsideMealHours && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  📅 Meal Timings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-amber-800 font-medium">
                    <span className="text-2xl">🌅</span>
                    <span>Breakfast: 6:00 AM - 10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-3 text-amber-800 font-medium">
                    <span className="text-2xl">🌞</span>
                    <span>Lunch: 11:00 AM - 3:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3 text-amber-800 font-medium">
                    <span className="text-2xl">🌙</span>
                    <span>Dinner: 6:00 PM - 10:00 PM</span>
                  </div>
                </div>
              </div>
            )}

            {isUserNotFound && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <p className="text-red-900 font-bold text-lg">
                  Roll Number: <span className="bg-red-200 px-3 py-1 rounded-lg">{roll?.toUpperCase()}</span>
                </p>
              </div>
            )}

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
              <p className="text-blue-900 font-bold text-center">
                Current Time: {currentTime.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit',
                  hour12: true 
                })}
              </p>
            </div>

            <button
              onClick={() => navigate("/admin")}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Go to Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  const isAlreadyMarked = attendanceData?.alreadyMarked === true;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideIn">
        {/* Header */}
        <div className={`p-8 text-center relative overflow-hidden ${
          isAlreadyMarked 
            ? "bg-gradient-to-r from-amber-500 to-orange-600" 
            : "bg-gradient-to-r from-green-500 to-emerald-600"
        }`}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-full animate-pulse delay-75"></div>
          </div>
          <div className={`text-8xl mb-4 relative z-10 ${isAlreadyMarked ? 'animate-pulse' : 'animate-bounce'}`}>
            {isAlreadyMarked ? '⚠️' : '✅'}
          </div>
          <h1 className="text-4xl font-black text-white mb-2 relative z-10">
            {isAlreadyMarked ? 'Already Marked!' : `${getTimeGreeting()}!`}
          </h1>
          <p className={`text-lg font-medium relative z-10 ${
            isAlreadyMarked ? 'text-amber-100' : 'text-green-100'
          }`}>
            {isAlreadyMarked 
              ? attendanceData.message 
              : 'Attendance Marked Successfully'
            }
          </p>
        </div>

        {/* Student Details */}
        <div className="p-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border-2 border-gray-200">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-300 pb-3">
                <span className="font-semibold text-gray-600">Student Name:</span>
                <span className="font-bold text-gray-900 text-lg">
                  {attendanceData?.attendance?.user?.name || "N/A"}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-300 pb-3">
                <span className="font-semibold text-gray-600">Roll Number:</span>
                <span className="font-bold text-gray-900 text-lg bg-gray-200 px-4 py-1 rounded-lg">
                  {roll?.toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-300 pb-3">
                <span className="font-semibold text-gray-600">Date:</span>
                <span className="font-bold text-gray-900">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Time:</span>
                <span className="font-bold text-gray-900">
                  {currentTime.toLocaleTimeString('en-IN', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Meal Badge */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-3 border-2 px-8 py-4 rounded-full ${
              isAlreadyMarked 
                ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300' 
                : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
            }`}>
              <span className="text-4xl">
                {getMealEmoji(attendanceData?.markedMeal)}
              </span>
              <span className={`text-2xl font-black ${
                isAlreadyMarked ? 'text-amber-800' : 'text-green-800'
              }`}>
                {attendanceData?.markedMeal?.charAt(0).toUpperCase() + 
                 attendanceData?.markedMeal?.slice(1) || "Meal"}
              </span>
            </div>
          </div>

          {/* Status Message */}
          <div className={`border-2 rounded-2xl p-6 mb-6 ${
            isAlreadyMarked 
              ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300' 
              : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
          }`}>
            <p className={`font-bold text-center text-lg flex items-center justify-center gap-2 ${
              isAlreadyMarked ? 'text-amber-900' : 'text-green-900'
            }`}>
              <span className="text-2xl">{isAlreadyMarked ? '⚠️' : '✅'}</span>
              {isAlreadyMarked 
                ? 'This meal was already marked earlier today'
                : 'Attendance successfully recorded in the system'
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Go to Admin Panel
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="py-4 bg-white border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Mark Another
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        .delay-75 {
          animation-delay: 75ms;
        }
      `}</style>
    </div>
  );
};

export default MarkAttendance;
