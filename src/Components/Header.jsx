// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../Context/RoleContext";

export default function Header() {
  const { role, clearRole } = useRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearRole(); // removes role + tokens (future-proof)
    navigate("/login", { replace: true });
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-[1000] bg-[#1DB1A2] text-white
                 shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                 border-b border-white/10"
    >
      <div
        className="max-w-[1100px] mx-auto px-5 py-3
                   flex items-center justify-between"
      >
        {/* Logo */}
        <Link
          to="/"
          aria-label="Go to home"
          className="inline-flex items-center gap-2.5 no-underline text-white"
        >
          <span
            aria-hidden="true"
            className="inline-grid place-items-center w-10 h-10 rounded-[10px]
                       bg-white text-[#1DB1A2] text-[22px]
                       shadow-[inset_0_0_8px_rgba(144,224,239,0.35)]"
          >
            🩺
          </span>

          <span className="text-[1.4rem] font-extrabold tracking-[0.3px]">
            Medi-Connect
          </span>
        </Link>

        {/* Navigation */}
        <nav aria-label="Primary" className="flex items-center gap-3">

          {/* If NOT logged in */}
          {!role && (
            <>
              <Link
                to="/register"
                className="text-[#eaf7fb] font-semibold px-2.5 py-2 rounded-lg
                           transition hover:bg-white/15 hover:text-white"
              >
                Register
              </Link>

              <Link
                to="/login"
                className="text-[#eaf7fb] font-semibold px-2.5 py-2 rounded-lg
                           transition hover:bg-white/15 hover:text-white"
              >
                Login
              </Link>
            </>
          )}

          {/* If logged in */}
          {role && (
            <>
              {/* Show current role */}
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-lg capitalize">
                Role: {role}
              </span>

              {/* Role-based Dashboard links */}
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="px-3 py-2 bg-white/20 rounded-lg font-semibold hover:bg-white/30"
                >
                  Admin Panel
                </Link>
              )}

              {role === "doctor" && (
                <Link
                  to="/doctor-dashboard"
                  className="px-3 py-2 bg-white/20 rounded-lg font-semibold hover:bg-white/30"
                >
                  Doctor Dashboard
                </Link>
              )}

              {role === "patient" && (
                <Link
                  to="/patient-dashboard"
                  className="px-3 py-2 bg-white/20 rounded-lg font-semibold hover:bg-white/30"
                >
                  Patient Dashboard
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-500 rounded-lg font-semibold hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}