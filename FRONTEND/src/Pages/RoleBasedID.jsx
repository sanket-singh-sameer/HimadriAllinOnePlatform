import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import MarkAttendance from "./MarkAttendance";

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

// Guard Page Component
const GuardPage = ({ roll }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
          <div className="text-8xl mb-4">🛡️</div>
          <h1 className="text-4xl font-black text-white mb-2">Guard Portal</h1>
          <p className="text-blue-100 text-lg">Gate Entry/Exit Management</p>
        </div>
        <div className="p-8">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
            <p className="text-blue-900 font-bold text-lg text-center">
              Roll Number: <span className="bg-blue-200 px-4 py-1 rounded-lg ml-2">{roll?.toUpperCase()}</span>
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p className="mb-4">🚧 Guard module coming soon...</p>
            <p className="text-sm">Features: Entry/Exit logs, Visitor management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// College Gate Page Component
const CollegeGatePage = ({ roll }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-700 p-8 text-center">
          <div className="text-8xl mb-4">🏫</div>
          <h1 className="text-4xl font-black text-white mb-2">College Gate Portal</h1>
          <p className="text-green-100 text-lg">Main Gate Access Control</p>
        </div>
        <div className="p-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
            <p className="text-green-900 font-bold text-lg text-center">
              Roll Number: <span className="bg-green-200 px-4 py-1 rounded-lg ml-2">{roll?.toUpperCase()}</span>
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p className="mb-4">🚧 College Gate module coming soon...</p>
            <p className="text-sm">Features: Outpass verification, Vehicle tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
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
