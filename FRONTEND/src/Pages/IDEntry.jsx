import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import { useAuthStore } from "../store/authStore";

const roleMeta = {
  "mess-committee": {
    title: "Mess Committee",
    subtitle: "Meal attendance and dining operations",
    accent: "",
    icon: "🍽️",
    badge: "border border-slate-300 text-slate-900 bg-white",
  },
  guard: {
    title: "Guard",
    subtitle: "Hostel gate access and verification",
    accent: "",
    icon: "🛡️",
    badge: "border border-slate-300 text-slate-900 bg-white",
  },
  "college-gate": {
    title: "College Gate",
    subtitle: "Outpass verification and entry tracking",
    accent: "",
    icon: "🚪",
    badge: "border border-slate-300 text-slate-900 bg-white",
  },
  "discipline-committee": {
    title: "Discipline Committee",
    subtitle: "Records, complaints, and conduct",
    accent: "from-red-600 via-orange-500 to-amber-500",
    icon: "⚖️",
    badge: "bg-red-100 text-red-700",
  },
  "cleaning-committee": {
    title: "Cleaning Committee",
    subtitle: "Room checks and cleanliness reviews",
    accent: "from-cyan-600 via-sky-600 to-blue-600",
    icon: "🧹",
    badge: "bg-cyan-100 text-cyan-700",
  },
  "commonroom-committee": {
    title: "Common Room Committee",
    subtitle: "Facilities and equipment management",
    accent: "from-fuchsia-600 via-pink-600 to-rose-600",
    icon: "🎮",
    badge: "bg-fuchsia-100 text-fuchsia-700",
  },
  "hostel-committee": {
    title: "Hostel Committee",
    subtitle: "Overall hostel operations and oversight",
    accent: "from-amber-600 via-orange-600 to-red-600",
    icon: "🏠",
    badge: "bg-amber-100 text-amber-700",
  },
  admin: {
    title: "Admin",
    subtitle: "Full platform access and management",
    accent: "",
    icon: "👨‍💼",
    badge: "border border-slate-300 text-slate-900 bg-white",
  },
  "super-admin": {
    title: "Super Admin",
    subtitle: "Highest level control and configuration",
    accent: "",
    icon: "👑",
    badge: "border border-slate-300 text-slate-900 bg-white",
  },
};

const formatRole = (role) => role?.replace(/-/g, " ") || "Unknown role";

const RoleDetailCard = ({ title, description }) => {
  return (
    <div className={`rounded-[1.4rem] border p-5 sm:p-6 bg-white`}>
      <h2 className="text-lg font-black text-slate-900 sm:text-xl">{title}</h2>
      <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">{description}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-3.5 ring-1 ring-slate-200">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Role visibility</p>
          <p className="mt-2 text-sm font-bold text-slate-900">Visible at /id</p>
        </div>
        <div className="rounded-2xl bg-white p-3.5 ring-1 ring-slate-200">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Page layout</p>
          <p className="mt-2 text-sm font-bold text-slate-900">Separate component</p>
        </div>
      </div>
    </div>
  );
};

const RoleShell = ({ user, meta, children }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white px-4 py-8 text-black">
      <div className="mx-auto flex w-[95%] max-w-[95vw] flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm">
        <div className={`px-5 py-6 text-center sm:px-8 sm:py-7 bg-black`}>
          <div className="text-2xl sm:text-3xl text-white">{meta.icon}</div>
          <p className="mt-3 text-[8px] font-semibold uppercase tracking-[0.4em] text-white/80">Current Role</p>
          <h1 className="mt-1 text-sm font-black tracking-tight text-white sm:text-xl">{meta.title}</h1>
          <p className="mt-2 text-[9px] text-white/80 sm:text-[10px]">{meta.subtitle}</p>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-4 sm:p-6">
            <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-slate-500">Signed In As</p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-sm font-black text-slate-900 sm:text-base">{user?.name || "Student"}</h2>
                  <p className="mt-1 text-[10px] text-slate-600">{user?.email || "No email on file"}</p>
                </div>
                <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.badge}`}>{formatRole(user?.role)}</span>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-3.5 ring-1 ring-slate-200">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.26em] text-slate-400">Roll Number</p>
                  <p className="mt-1.5 break-all text-[10px] font-bold text-slate-900">{user?.roll || "N/A"}</p>
                </div>
                <div className="rounded-2xl bg-white p-3.5 ring-1 ring-slate-200">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.26em] text-slate-400">Role Key</p>
                  <p className="mt-1.5 break-all text-[10px] font-bold text-slate-900">{user?.role || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">{children}</div>
          </div>

          <div className="border-t border-slate-200 bg-black p-4 text-white lg:border-l lg:border-t-0 lg:p-6">
            <p className="text-[8px] font-semibold uppercase tracking-[0.34em] text-slate-400">Portal Summary</p>
            <h3 className="mt-2 text-sm font-black leading-tight">{meta.title} access is active.</h3>
            <p className="mt-1.5 text-[10px] leading-4 text-slate-300">{meta.subtitle}</p>

            <div className="mt-4 space-y-2.5 text-sm">
              <div className="rounded-2xl border border-slate-700 bg-black p-3">
                <p className="text-slate-400">Current role</p>
                <p className="mt-1 text-[10px] font-bold text-white">{formatRole(user?.role)}</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-black p-3">
                <p className="text-slate-400">Student</p>
                <p className="mt-1 text-[10px] font-bold text-white">{user?.name || "N/A"}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-4 w-full rounded-2xl bg-white px-4 py-2 text-[10px] font-bold text-slate-900 transition hover:bg-slate-100"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessCommitteePage = ({ user }) => {
  const navigate = useNavigate();

  return (
    <RoleShell user={user} meta={roleMeta["mess-committee"]}>
      <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="text-sm font-black text-slate-900 sm:text-base">Mess attendance panel</h2>
        <p className="mt-1.5 text-[10px] leading-4 text-slate-600 sm:text-[10px]">
          Your account is connected to the mess committee role. You can open the attendance flow for your own roll number from here.
        </p>

        <button
          type="button"
          onClick={() => navigate(`/mess/${encodeURIComponent((user?.roll || "").toUpperCase())}`)}
          disabled={!user?.roll}
          className="mt-3 rounded-2xl bg-black px-4 py-2 text-[10px] font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:text-[10px]"
        >
          Open Mess Attendance
        </button>
      </div>
    </RoleShell>
  );
};

const GuardPage = ({ user }) => {
  return (
    <RoleShell user={user} meta={roleMeta.guard}>
      <RoleDetailCard
        title="Guard Portal"
        description="Use this role for hostel gate monitoring, visitor checks, and access control."
      />
    </RoleShell>
  );
};

const CollegeGatePage = ({ user }) => {
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");

  const normalizedRoll = rollNumber.trim().toUpperCase();

  const handleLookup = async (event) => {
    event.preventDefault();

    if (!normalizedRoll) {
      setLookupError("Enter a roll number first.");
      return;
    }

    setLoading(true);
    setLookupError("");
    setLookupResult(null);

    try {
      const response = await axiosInstance.get(API_PATHS.GUARD_CHECK_OUTPASS(normalizedRoll));
      setLookupResult(response.data);
      toast.success(response.data.message || "Student status loaded");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load student status";
      setLookupError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleMark = async () => {
    if (!normalizedRoll || !lookupResult) {
      return;
    }

    const actionLabel = lookupResult.canMarkOut ? "OUT" : lookupResult.canMarkIn ? "IN" : "";
    if (!actionLabel) {
      return;
    }

    setActionLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.GUARD_VERIFY_OUTPASS(normalizedRoll));
      setLookupResult((current) => ({
        ...current,
        ...response.data,
        canMarkOut: response.data.action === "OUT",
        canMarkIn: response.data.action === "IN",
        currentState: response.data.action === "OUT" ? "OUT" : "IN",
        nextAction: response.data.action === "OUT" ? "MARK_IN" : "MARK_OUT",
      }));
      toast.success(response.data.message || `Marked ${response.data.action}`);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update outpass";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
        <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="text-sm font-black text-slate-900 sm:text-base">College gate verification</h2>
        <p className="mt-1.5 text-[8px] leading-4 text-slate-600 sm:text-[10px]">
          Enter a roll number, check the outpass state, and then mark OUT or IN based on the current campus status.
        </p>

        <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={handleLookup}>
          <input
            value={rollNumber}
            onChange={(event) => setRollNumber(event.target.value)}
            placeholder="Enter roll number"
            className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-2 focus:ring-black/10 sm:text-[11px]"
            autoComplete="off"
          />
          <button
            type="submit"
            className="rounded-2xl bg-black px-4 py-2 text-[10px] font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:text-[10px]"
            disabled={loading}
          >
            {loading ? "Checking..." : "Submit"}
          </button>
        </form>

        {lookupError ? (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-[8px] font-semibold text-red-700 sm:text-[10px]">
            {lookupError}
          </div>
        ) : null}

        {lookupResult ? (
          <div className="mt-3 space-y-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-3">
                <p className="text-[8px] uppercase tracking-[0.3em] text-slate-400">Student</p>
                <p className="mt-1 text-[10px] font-bold text-slate-900 sm:text-[11px]">{lookupResult.user?.name || "N/A"}</p>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <p className="text-[8px] uppercase tracking-[0.3em] text-slate-400">Current state</p>
                <p className="mt-1 text-[10px] font-bold text-slate-900 sm:text-[11px]">{lookupResult.currentState || "N/A"}</p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleMark}
                disabled={actionLoading || (!lookupResult.canMarkOut && !lookupResult.canMarkIn)}
                className="rounded-2xl bg-black px-4 py-2 text-[10px] font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:text-[10px]"
              >
                {lookupResult.canMarkOut ? "Mark OUT" : "Mark IN"}
              </button>
              <button
                type="button"
                disabled
                className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-2 text-[10px] font-bold text-slate-400 sm:text-[10px]"
              >
                {lookupResult.canMarkOut ? "Mark IN after exit" : lookupResult.canMarkIn ? "Mark OUT before return" : "No action available"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    // </RoleShell>
  );
};

const DisciplineCommitteePage = ({ user }) => {
  return (
    <RoleShell user={user} meta={roleMeta["discipline-committee"]}>
      <RoleDetailCard
        title="Discipline Committee Portal"
        description="Track complaints, policy actions, and student conduct updates from this role."
        accentClassName="bg-red-50 border-red-200"
      />
    </RoleShell>
  );
};

const CleaningCommitteePage = ({ user }) => {
  return (
    <RoleShell user={user} meta={roleMeta["cleaning-committee"]}>
      <RoleDetailCard
        title="Cleaning Committee Portal"
        description="Room inspection, cleanliness scoring, and maintenance notes belong here."
        accentClassName="bg-cyan-50 border-cyan-200"
      />
    </RoleShell>
  );
};

const CommonroomCommitteePage = ({ user }) => {
  return (
    <RoleShell user={user} meta={roleMeta["commonroom-committee"]}>
      <RoleDetailCard
        title="Common Room Committee Portal"
        description="Manage shared facilities, bookings, and room equipment from this role."
        accentClassName="bg-fuchsia-50 border-fuchsia-200"
      />
    </RoleShell>
  );
};

const HostelCommitteePage = ({ user }) => {
  return (
    <RoleShell user={user} meta={roleMeta["hostel-committee"]}>
      <RoleDetailCard
        title="Hostel Committee Portal"
        description="This role represents the overall hostel management and oversight view."
        accentClassName="bg-amber-50 border-amber-200"
      />
    </RoleShell>
  );
};

const AdminIDPage = ({ user }) => {
  return (
    <RoleShell user={user} meta={roleMeta.admin}>
      <RoleDetailCard
        title="Admin Portal"
        description="This account has full platform access for users, notices, and operational controls."
        accentClassName="bg-gray-50 border-gray-200"
      />
    </RoleShell>
  );
};

const SuperAdminIDPage = ({ user }) => {
  return (
    <RoleShell user={user} meta={roleMeta["super-admin"]}>
      <RoleDetailCard
        title="Super Admin Portal"
        description="This role has the highest level of access for platform-wide configuration."
        accentClassName="bg-gray-50 border-gray-200"
      />
    </RoleShell>
  );
};

const UnauthorizedPage = ({ role }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6 text-center">
          <div className="mb-2 text-4xl">🚫</div>
          <h1 className="text-sm font-black text-slate-900 sm:text-base">Access Denied</h1>
          <p className="mt-2 text-[10px] text-slate-700 sm:text-[10px]">{role ? `Role ${formatRole(role)} is not configured` : "No role detected"}</p>
        </div>
        <div className="p-6 text-center text-gray-700">
          <p className="text-[10px] font-semibold sm:text-[10px]">Please contact your administrator if this role should be available.</p>
        </div>
      </div>
    </div>
  );
};

const IDEntry = () => {
  const { user, isAuthenticated } = useAuthStore();
  const role = user?.role?.toLowerCase();
  const meta = roleMeta[role];

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (role) {
    case "mess-committee":
      return <MessCommitteePage user={user} />;
    case "guard":
      return <GuardPage user={user} />;
    case "college-gate":
      return <CollegeGatePage user={user} />;
    case "discipline-committee":
      return <DisciplineCommitteePage user={user} />;
    case "cleaning-committee":
      return <CleaningCommitteePage user={user} />;
    case "commonroom-committee":
      return <CommonroomCommitteePage user={user} />;
    case "hostel-committee":
      return <HostelCommitteePage user={user} />;
    case "admin":
      return <AdminIDPage user={user} />;
    case "super-admin":
      return <SuperAdminIDPage user={user} />;
    default:
      return <UnauthorizedPage role={meta?.title || role} />;
  }
};

export default IDEntry;