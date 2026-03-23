import { NavLink, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

const dummyDonors = [
  { id: 1, amount: 500, username: "John Doe", upiId: "johndoe@okaxis" },
  { id: 2, amount: 1200, username: "", upiId: "sarah99@okhdfcbank" },
  { id: 3, amount: 250, username: "Arjun K", upiId: "arjunk@ybl" },
  { id: 4, amount: 3000, username: "", upiId: "mysterydonor@oksbi" },
  { id: 5, amount: 50, username: "Priya S", upiId: "priya@icici" },
]

const maskUpi = (upi: string) => {
  if (!upi.includes('@')) return upi;
  const [name, bank] = upi.split('@');
  return `${name.substring(0, Math.min(3, name.length))}***@${bank}`;
}

const Header = () => {
  const token: string | null = localStorage.getItem('token')
  const [showDonors, setShowDonors] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-all duration-300 font-semibold px-3 py-2 ${isActive ? 'text-[#8B4513]' : 'text-[#a78e7e] hover:text-[#8B4513]'}`

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDonors(false)
      }
    }
    if (showDonors) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDonors])

  // Close dropdown on route change
  const location = useLocation()
  useEffect(() => {
    setShowDonors(false)
  }, [location.pathname])

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
          <NavLink to="/news-events" className={navLinkClass}>News</NavLink>
          <NavLink to="/archive" className={navLinkClass}>Archive</NavLink>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDonors(!showDonors)}
              className={`transition-colors duration-300 font-bold px-3 py-2 flex items-center gap-1.5 ${showDonors ? 'text-[#8B4513]' : 'text-[#a78e7e] hover:text-[#8B4513]'}`}
            >
              Top Donors
              <svg className={`w-4 h-4 transition-transform ${showDonors ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Dropdown Menu */}
            {showDonors && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white shadow-[0_20px_50px_rgba(139,69,19,0.15)] border border-[#DDBB99]/40 z-[1002] p-5">
                <h3 className="text-[10px] font-black text-[#a78e7e] mb-4 uppercase tracking-[0.2em] border-b border-[#DDBB99]/30 pb-2">Recent Contributions</h3>
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {dummyDonors.map((donor) => (
                    <div key={donor.id} className="flex items-center justify-between rounded-xl p-3 bg-[#FAF9F6] ring-1 ring-[#8B4513]/5 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B4513]/10 text-[#8B4513] font-bold text-xs ring-1 ring-[#8B4513]/20">
                          {donor.username ? donor.username.charAt(0).toUpperCase() : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#4A3B32]">
                            {donor.username || maskUpi(donor.upiId)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-black text-[#8B4513] font-serif">
                        ₹{donor.amount}
                      </div>
                    </div>
                  ))}
                </div>
                <NavLink to="/pricing" className="mt-5 w-full block rounded-xl bg-[#8B4513] py-3.5 text-center text-xs font-black text-white hover:bg-[#a0522d] transition-all shadow-lg hover:-translate-y-0.5 uppercase tracking-widest">
                  CONTRIBUTE NOW
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/library" className={`hidden xl:inline ${navLinkClass({ isActive: false })}`}>Library</NavLink>
          <NavLink to="/community" className={`hidden xl:inline ${navLinkClass({ isActive: false })}`}>Community</NavLink>
          
          {!token && (
            <NavLink
              to="/login"
              className="ml-4 rounded-xl bg-[#8B4513] px-7 py-3 text-sm font-black text-white transition-all shadow-xl hover:bg-[#a0522d] hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest ring-2 ring-[#8B4513]/10"
            >
              Login
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-[1002] bg-[#f4ecd8] px-8 pt-32 pb-12 transition-all duration-500 ease-in-out transform ${
        isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="absolute inset-0 bg-[#f4ecd8] z-[-1]" /> {/* Explicit solid bg layer */}
        <nav className="flex flex-col gap-y-6 text-2xl font-black font-serif tracking-widest uppercase relative z-10">
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[#8B4513] hover:translate-x-2 transition-transform">Home</NavLink>
          <NavLink to="/journal" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">Journal</NavLink>
          <NavLink to="/news-events" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">News</NavLink>
          <NavLink to="/archive" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">Archive</NavLink>
          <NavLink to="/library" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">Library</NavLink>
          <NavLink to="/community" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">Community</NavLink>
          <NavLink to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a78e7e] hover:text-[#8B4513] hover:translate-x-2 transition-transform">Donate</NavLink>
          
          <div className="mt-12 pt-12 border-t border-[#8B4513]/20">
            <NavLink
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full inline-block rounded-2xl bg-[#8B4513] px-8 py-5 text-center text-white font-black uppercase tracking-[0.3em] shadow-2xl ring-4 ring-[#8B4513]/10"
            >
              Login
            </NavLink>
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