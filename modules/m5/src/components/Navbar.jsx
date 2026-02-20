import { useState } from 'react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { useRole } from "../../../../src/Context/RoleContext"

export const Navbar = () => {
  const { clearRole } = useRole()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(o => !o)
  const closeMenu = () => setIsOpen(false)

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const linkClass = (path, exact = false) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-colors no-underline ${
      isActive(path, exact)
        ? 'bg-[#1DB1A2]/10 text-[#1DB1A2]'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <div className="fixed right-0 left-0 top-0 z-50">
      <header
        className="bg-white border-b"
        style={{
          borderColor: '#dbe5ef',
          boxShadow: '0 4px 20px -4px rgba(33, 45, 63, 0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-14">
          {/* Brand */}
          <div
            className="flex flex-col cursor-pointer select-none"
            onClick={() => { closeMenu(); navigate('/admin') }}
          >
            <span className="text-base font-black text-slate-900 tracking-tight leading-none">
              MediConnect
            </span>
            <span className="text-[9px] font-bold text-[#1DB1A2] uppercase tracking-[0.18em] mt-0.5">
              Admin Panel
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/admin" end onClick={closeMenu} className={() => linkClass('/admin', true)}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/reports" onClick={closeMenu} className={() => linkClass('/admin/reports')}>
              Reports
            </NavLink>
            <NavLink to="/admin/analytics" onClick={closeMenu} className={() => linkClass('/admin/analytics')}>
              Analytics
            </NavLink>
          </nav>

          {/* Right: Logout + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Logout — always visible */}
            <button
              className="
                hidden md:inline-flex items-center gap-1.5
                px-3 py-1.5 rounded-lg text-xs font-bold
                text-[#F0745A] bg-rose-50 border border-rose-200
                hover:bg-rose-100 transition-colors cursor-pointer
              "
              onClick={() => { clearRole(); navigate('/login') }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div
            className="md:hidden border-t px-4 py-3"
            style={{ borderColor: '#dbe5ef', background: 'linear-gradient(180deg, #ffffff, #f6fbfc)' }}
          >
            <nav className="flex flex-col gap-1">
              <NavLink to="/admin" end onClick={closeMenu} className={() => linkClass('/admin', true)}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/reports" onClick={closeMenu} className={() => linkClass('/admin/reports')}>
                Reports
              </NavLink>
              <NavLink to="/admin/analytics" onClick={closeMenu} className={() => linkClass('/admin/analytics')}>
                Analytics
              </NavLink>

              <div className="h-px bg-slate-200 my-2" />

              <button
                className="
                  flex items-center gap-2
                  px-3 py-2 rounded-lg text-xs font-bold
                  text-rose-600 hover:bg-rose-50
                  transition-colors cursor-pointer text-left
                "
                onClick={() => { closeMenu(); clearRole(); navigate('/login') }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </header>
    </div>
  )
}
