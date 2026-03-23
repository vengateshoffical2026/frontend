import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { newsEventsData } from '../data/newsEvents'

const Header = () => {
  const token: string | null = localStorage.getItem('token')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  const hasNewNews = newsEventsData.some(item => item.isNew);

  // Parse user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) return JSON.parse(userData)
    } catch {}
    return null
  }
  const user = getUserData()
  const displayName = user?.username?.split('@')[0] || user?.username || ''

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-all duration-300 font-semibold px-3 py-2 flex items-center gap-1.5 ${isActive ? 'text-[#8B4513]' : 'text-[#a78e7e] hover:text-[#8B4513]'}`

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const location = useLocation()
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsUserMenuOpen(false)
    navigate('/')
    window.location.reload()
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] w-full transition-all duration-500 font-sans ${
      isScrolled 
        ? 'bg-[#f4ecd8] border-b border-[#DDBB99]/50 shadow-lg' 
        : 'bg-[#f4ecd8] border-b border-[#DDBB99]'
    }`}>
      <div className={`relative z-[1001] flex w-full items-center justify-between px-6 sm:px-10 lg:px-16 transition-all duration-500 ${
        isScrolled ? 'h-16' : 'h-24'
      }`}>
          
        <NavLink
          to="/"
          className="flex items-center gap-4 hover:opacity-80 transition-all group"
        >
          <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-white/60 ring-1 ring-[#8B4513]/10 transition-all duration-500 shadow-inner ${
            isScrolled ? 'h-10 w-10 p-1.5' : 'h-16 w-16 p-2.5'
          }`}>
            <img 
              src="/logo.jpeg" 
              alt="Sasanam Logo" 
              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-serif font-black text-[#8B4513] tracking-[0.15em] transition-all duration-500 uppercase ${
              isScrolled ? 'text-lg' : 'text-3xl'
            }`}>
              Sasanam
            </span>
            {!isScrolled && (
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B4513]/40 -mt-1 scale-90 origin-left">
                Historical Archive
              </span>
            )}
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-x-2 lg:gap-x-8 text-sm font-bold tracking-wide">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/journal" className={navLinkClass}>Journal</NavLink>
          <NavLink to="/news-events" className={navLinkClass}>
            News
            {hasNewNews && (
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse ring-2 ring-red-500/20" />
            )}
          </NavLink>
          <NavLink to="/archive" className={navLinkClass}>Archive</NavLink>
          <NavLink to="/pricing" className={navLinkClass}>Subscribe</NavLink>
          <NavLink to="/library" className={`hidden xl:inline ${navLinkClass({ isActive: false })}`}>Library</NavLink>
          <NavLink to="/community" className={`hidden xl:inline ${navLinkClass({ isActive: false })}`}>Community</NavLink>
          
          {token ? (
            /* Logged-in user dropdown */
            <div className="relative ml-4" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 rounded-xl bg-[#8B4513]/10 px-4 py-2.5 text-sm font-bold text-[#8B4513] transition-all hover:bg-[#8B4513]/20 active:scale-95 border border-[#8B4513]/10"
              >
                {/* User avatar */}
                <div className="h-8 w-8 rounded-full bg-[#8B4513] flex items-center justify-center text-white text-xs font-black uppercase shadow-md">
                  {displayName.charAt(0)}
                </div>
                <span className="max-w-[120px] truncate capitalize">{displayName}</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#fdfaf2] shadow-[0_20px_60px_rgba(61,37,22,0.25)] border border-[#8B4513]/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[1100]">
                  <div className="p-4 border-b border-[#8B4513]/10 bg-[#f4ecd8]/50">
                    <p className="text-xs font-black uppercase tracking-widest text-[#8B4513]/50 mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-[#4A3B32] truncate">{user?.username || 'User'}</p>
                    {user?.isSubscribed !== undefined && (
                      <span className={`inline-block mt-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        user.isSubscribed 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {user.isSubscribed ? '✦ Contributor' : 'Free Explorer'}
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <NavLink
                      to="/pricing"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#4A3B32] hover:bg-[#8B4513]/5 transition-colors"
                    >
                      <svg className="w-4 h-4 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Subscription
                    </NavLink>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
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
            <NavLink
              to="/login"
              className="ml-4 rounded-xl bg-[#8B4513] px-7 py-3 text-sm font-black text-white transition-all shadow-xl hover:bg-[#a0522d] hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest ring-2 ring-[#8B4513]/10"
            >
              Login
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {/* Mobile: show user avatar if logged in */}
          {token && !isMobileMenuOpen && (
            <div className="lg:hidden h-9 w-9 rounded-full bg-[#8B4513] flex items-center justify-center text-white text-xs font-black uppercase shadow-md">
              {displayName.charAt(0)}
            </div>
          )}
          {hasNewNews && !isMobileMenuOpen && (
            <span className="lg:hidden h-2 w-2 rounded-full bg-red-500 animate-pulse ring-2 ring-red-500/20 mr-1" />
          )}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 text-[#8B4513] hover:bg-[#8B4513]/10 rounded-xl transition-all active:scale-95 z-[1003]"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-[1002] bg-[#f4ecd8] px-8 pt-32 pb-12 transition-all duration-500 ease-in-out transform ${
        isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="absolute inset-0 bg-[#f4ecd8] z-[-1]" /> {/* Explicit solid bg layer */}
        
        {/* Show user info at the top of mobile menu if logged in */}
        {token && user && (
          <div className="mb-8 p-4 rounded-2xl bg-white/50 border border-[#8B4513]/10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#8B4513] flex items-center justify-center text-white text-lg font-black uppercase shadow-md flex-shrink-0">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-[#4A3B32] truncate capitalize">{displayName}</p>
              <p className="text-xs text-[#6A5A4A] truncate">{user.username}</p>
              {user?.isSubscribed !== undefined && (
                <span className={`inline-block mt-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  user.isSubscribed 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {user.isSubscribed ? '✦ Contributor' : 'Free Explorer'}
                </span>
              )}
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-y-6 text-2xl font-black font-serif tracking-widest uppercase relative z-10">
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[#8B4513] hover:translate-x-2 transition-transform">Home</NavLink>
          <NavLink to="/journal" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">Journal</NavLink>
          <NavLink to="/news-events" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform flex items-center gap-3">
            News
            {hasNewNews && (
              <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            )}
          </NavLink>
          <NavLink to="/archive" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">Archive</NavLink>
          <NavLink to="/library" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">Library</NavLink>
          <NavLink to="/community" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">Community</NavLink>
          <NavLink to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">Subscribe</NavLink>
          
          <div className="mt-12 pt-12 border-t border-[#8B4513]/20">
            {token ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleLogout()
                }}
                className="w-full inline-block rounded-2xl bg-red-600 px-8 py-5 text-center text-white font-black uppercase tracking-[0.3em] shadow-2xl ring-4 ring-red-600/10 text-base"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full inline-block rounded-2xl bg-[#8B4513] px-8 py-5 text-center text-white font-black uppercase tracking-[0.3em] shadow-2xl ring-4 ring-[#8B4513]/10"
              >
                Login
              </NavLink>
            )}
          </div>
        </nav>
        
        {/* Decorative element for mobile menu */}
        <div className="absolute bottom-10 right-10 opacity-[0.03] pointer-events-none">
          <img src="/logo.jpeg" alt="" className="w-64 h-64 mix-blend-multiply grayscale" />
        </div>
      </div>
    </header>
  )
}

export default Header;