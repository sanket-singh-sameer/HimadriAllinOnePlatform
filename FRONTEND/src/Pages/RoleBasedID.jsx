import React, { useState, useRef, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import MarkAttendance from "./MarkAttendance";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import { toast } from "react-hot-toast";

const RoleBasedID = () => {
  const { roll } = useParams();
  const { user, isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Route based on user role
  switch (user.role) {
    case "mess-committee":
      return <MarkAttendance />;
    
    case "guard":
      return <GuardPage roll={roll} />;
    
    case "college-gate":
      return <CollegeGatePage roll={roll} />;
    
    case "discipline-committee":
      return <DisciplineCommitteePage roll={roll} />;
    
    case "cleaning-committee":
      return <CleaningCommitteePage roll={roll} />;
    
    case "commonroom-committee":
      return <CommonroomCommitteePage roll={roll} />;
    
    case "hostel-committee":
      return <HostelCommitteePage roll={roll} />;
    
    case "admin":
    case "super-admin":
      return <AdminIDPage roll={roll} />;
    
    default:
      return <UnauthorizedPage />;
  }
};

// Guard Page Component (Placeholder)
const GuardPage = ({ roll }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
          <div className="text-8xl mb-4">🛡️</div>
          <h1 className="text-4xl font-black text-white mb-2">Guard Portal</h1>
          <p className="text-blue-100 text-lg">Hostel Gate Security</p>
        </div>
        <div className="p-8">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
            <p className="text-blue-900 font-bold text-lg text-center">
              Roll Number: <span className="bg-blue-200 px-4 py-1 rounded-lg ml-2">{roll?.toUpperCase()}</span>
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p className="mb-4">🚧 Guard module coming soon...</p>
            <p className="text-sm">Features: Hostel entry/exit logs, Visitor management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// College Gate Page Component (Functional - Outpass Verification)
const CollegeGatePage = ({ roll }) => {
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState(null);
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    const verifyOutpass = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axiosInstance.post(API_PATHS.GUARD_VERIFY_OUTPASS(roll));
        
        if (response.data.success) {
          setVerificationData(response.data);
          
          // Show success toast based on action type
          if (response.data.action === "OUT") {
            toast.success(`✅ EXIT recorded for ${response.data.user.name}`, {
              duration: 5000,
              style: {
                background: '#10B981',
                color: '#fff',
                fontWeight: 'bold',
              },
            });
          } else if (response.data.action === "IN") {
            toast.success(`✅ ENTRY recorded for ${response.data.user.name}`, {
              duration: 5000,
              style: {
                background: '#3B82F6',
                color: '#fff',
                fontWeight: 'bold',
              },
            });
          }
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to verify outpass";
        setError(errorMessage);
        
        toast.error(errorMessage, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontWeight: 'bold',
          },
        });
      } finally {
        setLoading(false);
      }
    };

    verifyOutpass();
  }, [roll]);

  const handleNewScan = () => {
    hasVerifiedRef.current = false;
    setVerificationData(null);
    setError(null);
    window.location.reload();
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
            <div className="text-8xl mb-4">🛡️</div>
            <h1 className="text-4xl font-black text-white mb-2">Guard Portal</h1>
            <p className="text-blue-100 text-lg">Verifying Outpass...</p>
          </div>
          <div className="p-8">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
            <p className="text-center text-gray-600 mt-4">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-pink-700 p-8 text-center">
            <div className="text-8xl mb-4">❌</div>
            <h1 className="text-4xl font-black text-white mb-2">Verification Failed</h1>
            <p className="text-red-100 text-lg">Outpass Issue Detected</p>
          </div>
          <div className="p-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
              <p className="text-red-900 font-bold text-lg text-center mb-2">
                Roll Number: <span className="bg-red-200 px-4 py-1 rounded-lg ml-2">{roll?.toUpperCase()}</span>
              </p>
              <div className="bg-red-100 rounded-lg p-4 mt-4">
                <p className="text-red-800 text-center font-semibold">{error}</p>
              </div>
            </div>
            <button
              onClick={handleNewScan}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Scan Another Student
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success State - EXIT
  if (verificationData && verificationData.action === "OUT") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-center">
            <div className="text-8xl mb-4">�‍♂️➡️</div>
            <h1 className="text-4xl font-black text-white mb-2">EXIT Recorded</h1>
            <p className="text-green-100 text-lg">Student Leaving Campus</p>
          </div>
          <div className="p-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800">{verificationData.user.name}</h2>
                <p className="text-green-700 font-bold text-xl mt-2">
                  Roll: {verificationData.user.roll}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-gray-500 text-sm">Room</p>
                  <p className="text-gray-800 font-bold text-lg">{verificationData.user.room || "N/A"}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="text-gray-800 font-bold text-lg">{verificationData.user.phone || "N/A"}</p>
                </div>
              </div>
              <div className="bg-green-100 rounded-lg p-4 mt-4">
                <p className="text-green-800 text-center font-semibold">
                  Exit Time: {new Date(verificationData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleNewScan}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Scan Another Student
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success State - ENTRY
  if (verificationData && verificationData.action === "IN") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
            <div className="text-8xl mb-4">⬅️🚶‍♂️</div>
            <h1 className="text-4xl font-black text-white mb-2">ENTRY Recorded</h1>
            <p className="text-blue-100 text-lg">Student Returning to Campus</p>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800">{verificationData.user.name}</h2>
                <p className="text-blue-700 font-bold text-xl mt-2">
                  Roll: {verificationData.user.roll}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-500 text-sm">Room</p>
                  <p className="text-gray-800 font-bold text-lg">{verificationData.user.room || "N/A"}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="text-gray-800 font-bold text-lg">{verificationData.user.phone || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="text-blue-600 text-sm">Out Time</p>
                  <p className="text-blue-900 font-bold text-sm">
                    {new Date(verificationData.outTime).toLocaleTimeString()}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="text-blue-600 text-sm">In Time</p>
                  <p className="text-blue-900 font-bold text-sm">
                    {new Date(verificationData.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="bg-purple-100 rounded-lg p-4 mt-4">
                <p className="text-purple-800 text-center font-semibold">
                  Duration: {verificationData.duration}
                </p>
              </div>
            </div>
            <button
              onClick={handleNewScan}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Scan Another Student
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Discipline Committee Page Component
const DisciplineCommitteePage = ({ roll }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-orange-700 p-8 text-center">
          <div className="text-8xl mb-4">⚖️</div>
          <h1 className="text-4xl font-black text-white mb-2">Discipline Committee</h1>
          <p className="text-red-100 text-lg">Student Records & Violations</p>
        </div>
        <div className="p-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
            <p className="text-red-900 font-bold text-lg text-center">
              Roll Number: <span className="bg-red-200 px-4 py-1 rounded-lg ml-2">{roll?.toUpperCase()}</span>
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p className="mb-4">🚧 Discipline module coming soon...</p>
            <p className="text-sm">Features: Complaint tracking, Penalty management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cleaning Committee Page Component
const CleaningCommitteePage = ({ roll }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-sky-700 p-8 text-center">
          <div className="text-8xl mb-4">🧹</div>
          <h1 className="text-4xl font-black text-white mb-2">Cleaning Committee</h1>
          <p className="text-cyan-100 text-lg">Room Inspection & Cleanliness</p>
        </div>
        <div className="p-8">
          <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6 mb-6">
            <p className="text-cyan-900 font-bold text-lg text-center">
              Roll Number: <span className="bg-cyan-200 px-4 py-1 rounded-lg ml-2">{roll?.toUpperCase()}</span>
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p className="mb-4">🚧 Cleaning module coming soon...</p>
            <p className="text-sm">Features: Room inspections, Cleanliness scores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Common Room Committee Page Component
const CommonroomCommitteePage = ({ roll }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-8 text-center">
          <div className="text-8xl mb-4">🎮</div>
          <h1 className="text-4xl font-black text-white mb-2">Common Room Committee</h1>
          <p className="text-purple-100 text-lg">Facilities & Equipment Management</p>
        </div>
        <div className="p-8">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
            <p className="text-purple-900 font-bold text-lg text-center">
              Roll Number: <span className="bg-purple-200 px-4 py-1 rounded-lg ml-2">{roll?.toUpperCase()}</span>
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p className="mb-4">🚧 Common Room module coming soon...</p>
            <p className="text-sm">Features: Equipment booking, Facility usage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hostel Committee Page Component
const HostelCommitteePage = ({ roll }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-8 text-center">
          <div className="text-8xl mb-4">🏠</div>
          <h1 className="text-4xl font-black text-white mb-2">Hostel Committee</h1>
          <p className="text-amber-100 text-lg">Overall Hostel Management</p>
        </div>
        <div className="p-8">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
            <p className="text-amber-900 font-bold text-lg text-center">
              Roll Number: <span className="bg-amber-200 px-4 py-1 rounded-lg ml-2">{roll?.toUpperCase()}</span>
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p className="mb-4">🚧 Hostel Committee module coming soon...</p>
            <p className="text-sm">Features: Room allocation, General oversight</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin ID Page Component
const AdminIDPage = ({ roll }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-center">
          <div className="text-8xl mb-4">👨‍💼</div>
          <h1 className="text-4xl font-black text-white mb-2">Admin Portal</h1>
          <p className="text-gray-300 text-lg">Full Access & Management</p>
        </div>
        <div className="p-8">
          <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-6 mb-6">
            <p className="text-gray-900 font-bold text-lg text-center">
              Roll Number: <span className="bg-gray-200 px-4 py-1 rounded-lg ml-2">{roll?.toUpperCase()}</span>
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p className="mb-4">🚧 Admin ID module coming soon...</p>
            <p className="text-sm">Features: Complete student information, All records access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Unauthorized Page Component
const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-pink-700 p-8 text-center">
          <div className="text-8xl mb-4">🚫</div>
          <h1 className="text-4xl font-black text-white mb-2">Access Denied</h1>
          <p className="text-red-100 text-lg">Unauthorized Role</p>
        </div>
        <div className="p-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-900 font-bold text-lg mb-4">
              You don't have permission to access this page
            </p>
            <p className="text-red-700">
              Please contact your administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedID;
