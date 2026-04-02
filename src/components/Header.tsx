import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

const Header = () => {
  const token: string | null = localStorage.getItem('token')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const navigate = useNavigate()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) return JSON.parse(userData)
    } catch {}
    return null
  }
  const user = getUserData()
  const displayName = user?.fullName || user?.email?.split('@')[0] || ''

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setIsUserMenuOpen(false)
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const location = useLocation()
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
    setOpenDropdown(null)
    setMobileExpanded(null)
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsUserMenuOpen(false)
    navigate('/')
    window.location.reload()
  }

  // More dropdown items (only shown when logged in)
  const moreItems = [
    { to: '/archive', label: 'Archive' },
    { to: '/library', label: 'Library' },
    { to: '/news-events', label: 'News & Events' },
    { to: '/community', label: 'Community' },
    { to: '/contact', label: 'Contact' },
    { to: '/pricing', label: 'Subscribe' },
  ]

  const isDropdownActive = (items: { to: string }[]) =>
    items.some((item) => location.pathname === item.to)

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] w-full transition-all duration-500 font-sans ${
      isScrolled
        ? 'bg-[#f4ecd8]/95 backdrop-blur-md border-b border-[#DDBB99]/40 shadow-md'
        : 'bg-[#f4ecd8] border-b border-[#DDBB99]/60'
    }`}>
      <div className={`relative z-[1001] flex w-full items-center justify-between px-5 sm:px-8 lg:px-14 transition-all duration-500 ${
        isScrolled ? 'h-14' : 'h-[68px]'
      }`}>

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-all group shrink-0">
          <div className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-white/60 ring-1 ring-[#8B4513]/10 transition-all duration-500 shadow-inner ${
            isScrolled ? 'h-8 w-8 p-1' : 'h-11 w-11 p-1.5'
          }`}>
            <img src="/logo.jpeg" alt="Sasanam" className="h-full w-full object-contain mix-blend-multiply" />
          </div>
          <span className={`font-serif font-black text-[#8B4513] tracking-[0.1em] uppercase transition-all duration-500 ${
            isScrolled ? 'text-base' : 'text-lg'
          }`}>
            Sasanam
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold" ref={dropdownRef}>

          {/* Home - always visible */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-[#8B4513] font-bold'
                  : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Home
                {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[#8B4513]" />}
              </>
            )}
          </NavLink>

          {/* About - always visible */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-[#8B4513] font-bold'
                  : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                About
                {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[#8B4513]" />}
              </>
            )}
          </NavLink>

          {/* === LOGGED OUT: News & Events === */}
          {!token && (
            <NavLink
              to="/news-events"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-[#8B4513] font-bold'
                    : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  News & Events
                  {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[#8B4513]" />}
                </>
              )}
            </NavLink>
          )}

          {/* === LOGGED IN: Journal === */}
          {token && (
            <NavLink
              to="/journal"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-[#8B4513] font-bold'
                    : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Journal
                  {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[#8B4513]" />}
                </>
              )}
            </NavLink>
          )}

          {/* === LOGGED IN: More dropdown === */}
          {token && (
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'more' ? null : 'more')}
                className={`relative flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isDropdownActive(moreItems) || openDropdown === 'more'
                    ? 'text-[#8B4513] font-bold'
                    : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
                }`}
              >
                More
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'more' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {isDropdownActive(moreItems) && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[#8B4513]" />}
              </button>

              {openDropdown === 'more' && (
                <div className="absolute top-full right-0 mt-2 w-52 rounded-xl bg-[#fdfaf2] shadow-[0_12px_40px_rgba(61,37,22,0.2)] border border-[#8B4513]/10 overflow-hidden py-1">
                  {moreItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? 'text-[#8B4513] font-bold bg-[#8B4513]/8'
                            : 'text-[#4A3B32] hover:bg-[#8B4513]/5 hover:text-[#8B4513]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513] shrink-0" />}
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === Auth section === */}
          {token ? (
            /* LOGGED IN: User icon with dropdown */
            <div className="relative ml-3" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-full bg-[#8B4513] pl-1 pr-3 py-1 text-white transition-all hover:bg-[#a0522d] active:scale-95"
              >
                <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-black uppercase">
                  {displayName.charAt(0)}
                </div>
                <span className="max-w-20 truncate capitalize text-xs font-bold">{displayName}</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-[#fdfaf2] shadow-[0_20px_60px_rgba(61,37,22,0.25)] border border-[#8B4513]/10 overflow-hidden z-[1100]">
                  {/* User info */}
                  <div className="p-4 border-b border-[#8B4513]/10 bg-[#f4ecd8]/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#8B4513] to-[#a0522d] flex items-center justify-center text-white text-sm font-black uppercase shadow-md">
                        {displayName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#4A3B32] truncate capitalize">{displayName}</p>
                        <p className="text-[11px] text-[#6A5A4A] truncate">{user?.email || 'User'}</p>
                      </div>
                    </div>
                    {user?.isSubscribed !== undefined && (
                      <span className={`inline-flex items-center gap-1.5 mt-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        user.isSubscribed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.isSubscribed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {user.isSubscribed ? 'Contributor' : 'Free Explorer'}
                      </span>
                    )}
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">
                    <NavLink to="/pricing" onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#4A3B32] hover:bg-[#8B4513]/5 transition-colors">
                      <svg className="w-4 h-4 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Subscription
                    </NavLink>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* LOGGED OUT: Login & Sign Up buttons */
            <div className="flex items-center gap-2 ml-3">
              <NavLink to="/login"
                className="rounded-full border border-[#8B4513]/30 px-5 py-2 text-xs font-black text-[#8B4513] uppercase tracking-widest hover:bg-[#8B4513]/5 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                Login
              </NavLink>
              <NavLink to="/signup"
                className="rounded-full bg-[#8B4513] px-5 py-2 text-xs font-black text-white shadow-lg hover:bg-[#a0522d] hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest transition-all">
                Sign Up
              </NavLink>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {token && !isMobileMenuOpen && (
            <div className="h-8 w-8 rounded-full bg-[#8B4513] flex items-center justify-center text-white text-xs font-black uppercase shadow-md">
              {displayName.charAt(0)}
            </div>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#8B4513] hover:bg-[#8B4513]/10 rounded-lg transition-all active:scale-95 z-[1003]"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[1002] bg-[#f4ecd8] px-6 pt-24 pb-8 overflow-y-auto transition-all duration-400 ease-in-out transform ${
        isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="absolute inset-0 bg-[#f4ecd8] z-[-1]" />

        {/* User info card (logged in) */}
        {token && user && (
          <div className="mb-6 p-4 rounded-2xl bg-white/50 border border-[#8B4513]/10 flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#8B4513] to-[#a0522d] flex items-center justify-center text-white text-base font-black uppercase shadow-md shrink-0">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#4A3B32] truncate capitalize">{displayName}</p>
              <p className="text-xs text-[#6A5A4A] truncate">{user.email}</p>
              {user?.isSubscribed !== undefined && (
                <span className={`inline-flex items-center gap-1 mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  user.isSubscribed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <span className={`h-1 w-1 rounded-full ${user.isSubscribed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {user.isSubscribed ? 'Contributor' : 'Free Explorer'}
                </span>
              )}
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-1">
          {/* Home - always */}
          <NavLink
            to="/"
            end
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-base font-bold transition-all ${
                isActive
                  ? 'text-[#8B4513] bg-[#8B4513]/8 border-l-[3px] border-[#8B4513]'
                  : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
              }`
            }
          >
            Home
          </NavLink>

          {/* About - always */}
          <NavLink
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-base font-bold transition-all ${
                isActive
                  ? 'text-[#8B4513] bg-[#8B4513]/8 border-l-[3px] border-[#8B4513]'
                  : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
              }`
            }
          >
            About
          </NavLink>

          {/* LOGGED OUT: News & Events */}
          {!token && (
            <NavLink
              to="/news-events"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  isActive
                    ? 'text-[#8B4513] bg-[#8B4513]/8 border-l-[3px] border-[#8B4513]'
                    : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
                }`
              }
            >
              News & Events
            </NavLink>
          )}

          {/* LOGGED IN: Journal */}
          {token && (
            <NavLink
              to="/journal"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  isActive
                    ? 'text-[#8B4513] bg-[#8B4513]/8 border-l-[3px] border-[#8B4513]'
                    : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
                }`
              }
            >
              Journal
            </NavLink>
          )}

          {/* LOGGED IN: More accordion */}
          {token && (
            <div>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === 'more' ? null : 'more')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  isDropdownActive(moreItems)
                    ? 'text-[#8B4513] bg-[#8B4513]/8'
                    : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
                }`}
              >
                More
                <svg className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === 'more' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === 'more' ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-[#8B4513]/15 pl-4">
                  {moreItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          isActive ? 'text-[#8B4513] font-bold bg-[#8B4513]/8' : 'text-[#6A5A4A] hover:text-[#8B4513]'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LOGGED IN: Subscription link */}
          {token && (
            <NavLink
              to="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  isActive
                    ? 'text-[#8B4513] bg-[#8B4513]/8 border-l-[3px] border-[#8B4513]'
                    : 'text-[#6A5A4A] hover:text-[#8B4513] hover:bg-[#8B4513]/5'
                }`
              }
            >
              Subscription
            </NavLink>
          )}

          {/* Bottom auth section */}
          <div className="mt-6 pt-6 border-t border-[#8B4513]/15">
            {token ? (
              <button
                onClick={() => { setIsMobileMenuOpen(false); handleLogout() }}
                className="w-full rounded-xl bg-red-600 px-6 py-3.5 text-center text-white font-bold text-sm uppercase tracking-wider shadow-lg active:scale-[0.98] transition-transform"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-block rounded-xl border-2 border-[#8B4513] px-6 py-3.5 text-center text-[#8B4513] font-bold text-sm uppercase tracking-wider"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-block rounded-xl bg-[#8B4513] px-6 py-3.5 text-center text-white font-bold text-sm uppercase tracking-wider shadow-lg"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
