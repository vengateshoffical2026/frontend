import { NavLink } from 'react-router-dom'
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDonors(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 font-sans ${
      isScrolled 
        ? 'bg-[#f4ecd8]/80 backdrop-blur-xl border-b border-[#DDBB99]/50 shadow-sm' 
        : 'bg-[#f4ecd8] border-b border-[#DDBB99]'
    }`}>
      <div className={`flex w-full items-center justify-between px-6 sm:px-10 lg:px-16 transition-all duration-500 ${
        isScrolled ? 'h-16' : 'h-24'
      }`}>
          
        <NavLink
          to="/"
          className="flex items-center gap-4 hover:opacity-80 transition-all group"
        >
          <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-white/40 ring-1 ring-[#8B4513]/10 transition-all duration-500 ${
            isScrolled ? 'h-10 w-10 p-1' : 'h-16 w-16 p-2'
          }`}>
            <img 
              src="/logo.jpeg" 
              alt="Sasanam Logo" 
              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-serif font-black text-[#8B4513] tracking-tight transition-all duration-500 ${
              isScrolled ? 'text-xl' : 'text-3xl'
            }`}>
              Sasanam
            </span>
            {!isScrolled && (
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B4513]/40 -mt-1 scale-90 origin-left">
                Sasanam History
              </span>
            )}
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-x-2 lg:gap-x-6 text-sm font-semibold">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/journal" className={navLinkClass}>Journal</NavLink>
          <NavLink to="/archive" className={navLinkClass}>Archive</NavLink>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDonors(!showDonors)}
              className={`transition-colors duration-300 font-semibold px-3 py-2 flex items-center gap-1.5 ${showDonors ? 'text-[#8B4513]' : 'text-[#a78e7e] hover:text-[#8B4513]'}`}
            >
              Top Donors
              <svg className={`w-4 h-4 transition-transform ${showDonors ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Dropdown Menu */}
            {showDonors && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white shadow-xl border border-[#EEDDCC] z-50">
                <div className="p-4">
                  <h3 className="text-xs font-bold text-[#a78e7e] mb-3 uppercase tracking-wider border-b border-[#EEDDCC] pb-2">Recent Contributions</h3>
                  <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {dummyDonors.map((donor) => (
                      <div key={donor.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-[#FAF9F6] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B4513]/10 text-[#8B4513] font-bold text-xs ring-1 ring-[#8B4513]/30">
                            {donor.username ? donor.username.charAt(0).toUpperCase() : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#4A3B32]">
                              {donor.username || maskUpi(donor.upiId)}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-[#8B4513]">
                          ₹{donor.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                  <NavLink to="/pricing" className="mt-4 w-full block rounded-lg bg-[#8B4513]/10 py-2.5 text-center text-xs font-bold text-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-colors">
                    Contribute Now
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/library" className={`hidden xl:inline ${navLinkClass({ isActive: false })}`}>Library</NavLink>
          <NavLink to="/community" className={`hidden xl:inline ${navLinkClass({ isActive: false })}`}>Community</NavLink>
          
          {!token && (
            <NavLink
              to="/login"
              className="ml-4 rounded-lg bg-[#8B4513] px-6 py-2.5 text-sm font-bold text-white transition-all shadow-[0_4px_12px_rgba(139,69,19,0.2)] hover:shadow-[0_6px_20px_rgba(139,69,19,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Contact Us
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-[#f4ecd8] px-6 pt-24 pb-12 transition-all duration-500 ease-in-out transform ${
        isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <nav className="flex flex-col gap-y-4 text-lg font-bold">
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Home</NavLink>
          <NavLink to="/journal" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Journal</NavLink>
          <NavLink to="/archive" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Archive</NavLink>
          <NavLink to="/library" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Library</NavLink>
          <NavLink to="/community" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Community</NavLink>
          <NavLink to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Donate</NavLink>
          
          <div className="mt-8 pt-8 border-t border-[#8B4513]/10">
            <NavLink
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full inline-block rounded-xl bg-[#8B4513] px-6 py-4 text-center text-white font-black uppercase tracking-widest shadow-xl"
            >
              Contact Us
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header;