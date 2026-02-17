import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import { useRole } from '../../../../../src/Context/RoleContext'
import { getDoctorByEmail } from '../../../../../src/api/user'

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { clearRole, role, userEmail } = useRole()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [doctorName, setDoctorName] = useState(null)
  const [doctorSpec, setDoctorSpec] = useState(null)

  const toggleMenu = () => setIsOpen(o => !o)
  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    const fetchDoctor = async () => {
      if (role !== 'doctor' || !userEmail) return
      try {
        const data = await getDoctorByEmail(userEmail)
        setDoctorName(data?.fullName || null)
        setDoctorSpec(data?.specialization || null)
      } catch (err) {
        console.error('Failed to load doctor info for navbar:', err)
      }
    }
    fetchDoctor()
  }, [role, userEmail])

  const initialsFromName = (name) => {
    if (!name) return 'DR'
    return name
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  const displayName = doctorName ? `${doctorName}` : 'Dr. Doctor'
  const displaySpec = doctorSpec || 'Doctor'

  const isGenerateActive = () => {
    const path = location.pathname || ''
    return path.startsWith('/prescription') && !path.includes('/pharmacy')
  }

  const isPharmacyActive = () => {
    const path = location.pathname || ''
    return path.startsWith('/prescription/pharmacy')
  }

  return (
    /* CHANGE 1: h-screen locks the height to 100% of the window.
       CHANGE 2: overflow-hidden prevents the body from scrolling.
       CHANGE 3: flex flex-col allows the main content to fill the remaining space.
    */
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden">
      
      {/* Top Navbar: shrink-0 ensures it doesn't get squashed */}
      <header className="shrink-0 z-50 bg-white border-b border-slate-200 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.18)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              closeMenu()
              navigate('/prescription/new')
            }}
          >
            <img src={logo} alt="Logo" className="h-8" />
            <div className="leading-tight">
              <div className="text-base font-black text-slate-900">MediConnect</div>
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">EHR Management</div>
            </div>
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
            <NavLink
              to="/prescription/new"
              className={() =>
                `px-3 py-2 rounded-lg transition-colors ${
                  isGenerateActive()
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              Generate Prescription
            </NavLink>
            <NavLink
              to="/prescription/pharmacy"
              className={() =>
                `px-3 py-2 rounded-lg transition-colors ${
                  isPharmacyActive()
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              Pharmacy Fulfillment
            </NavLink>
          </nav>

          {/* Right Stats + Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                  {initialsFromName(doctorName)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[11px] font-black text-slate-900 leading-none">{displayName}</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{displaySpec}</div>
                </div>
                <svg className={`w-3 h-3 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-60 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setIsProfileOpen(false)
                      navigate('/doctor-dashboard')
                    }}
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Go To Dashboard
                  </button>
                  <div className="h-px bg-slate-100 my-1 mx-2"></div>
                  <button
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setIsProfileOpen(false)
                      clearRole()
                      navigate('/login')
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            <button className="md:hidden text-2xl leading-none px-1" onClick={toggleMenu} aria-label="Toggle menu">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white shadow-sm">
            <nav className="flex flex-col px-4 py-3 gap-2 text-sm font-semibold">
              <NavLink to="/prescription/new" onClick={closeMenu} className={({isActive}) => `px-3 py-2 rounded-lg ${isGenerateActive() ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>Generate Prescription</NavLink>
              <NavLink to="/prescription/pharmacy" onClick={closeMenu} className={({isActive}) => `px-3 py-2 rounded-lg ${isPharmacyActive() ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>Pharmacy Fulfillment</NavLink>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content: 
          - flex-1 tells it to take all remaining vertical space.
          - min-h-0 is a CSS flexbox trick to allow the container to be smaller than its content.
          - relative + overflow-hidden ensures the card centered inside can handle its own internal scrolling.
      */}
      <main className="flex-1 min-h-0 relative w-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}