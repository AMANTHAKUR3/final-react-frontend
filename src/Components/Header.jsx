// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../Context/RoleContext";
import { getUserById } from "../api/user";

export default function Header() {
  const { role, clearRole, userId } = useRole();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const data = await getUserById(userId);
        setUserData(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [userId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name[0].toUpperCase();
  };

  const getDashboardPath = () => {
    if (role === "admin") return "/admin";
    if (role === "doctor") return "/doctor-dashboard";
    if (role === "patient") return "/patient-dashboard";
    return "/";
  };

  return (
    <header className="sticky top-0 z-[1000] h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center px-6 relative">

        {/* CENTER: BRANDING */}
        <Link
          to="/"
          aria-label="Go to home"
          className="absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-2.5 no-underline"
        >
          <span
            aria-hidden="true"
            className="inline-grid place-items-center w-11 h-11 rounded-xl bg-white text-2xl shadow-sm"
          >
            🩺
          </span>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            MediConnect
          </span>
        </Link>

        {/* RIGHT: NAV — pushed to end */}
        <nav aria-label="Primary" className="ml-auto flex items-center gap-2">

          {/* Logged in — avatar + dropdown */}
          {role && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 rounded-full p-1 pr-3
                           border border-transparent transition
                           hover:bg-slate-50 hover:border-slate-200 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#F0745A] flex items-center justify-center text-white text-xs font-black shadow-sm">
                  {getInitials(userData?.fullName)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[11px] font-black text-slate-900 leading-none">
                    {userData?.fullName || "User"}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {role}
                  </div>
                </div>
                <svg
                  className={`w-3 h-3 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* DROPDOWN */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-[9999]">
                  <button
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate(getDashboardPath());
                    }}
                  >
                    <svg className="w-4 h-4 text-[#F0745A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
                    </svg>
                    Go to Dashboard
                  </button>

                  <div className="h-px bg-slate-100 my-1 mx-2" />

                  <button
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setIsProfileOpen(false);
                      clearRole();
                      navigate("/login", { replace: true });
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}