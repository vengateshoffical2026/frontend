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
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-300 font-semibold px-3 py-2 ${isActive ? 'text-[#8B4513]' : 'text-[#a78e7e] hover:text-[#8B4513]'}`

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
    <header className="sticky top-0 z-50 w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#EEDDCC]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          
        <NavLink
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B4513]/10 text-[#8B4513]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <span className="text-2xl font-bold text-[#8B4513] tracking-tight" style={{ fontFamily: 'sans-serif' }}>
            Sasanam
          </span>
        </NavLink>

        <nav className="flex items-center gap-x-2 lg:gap-x-6 text-sm font-semibold">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/journal" className={navLinkClass}>Journal</NavLink>
          <NavLink to="/archive" className={navLinkClass}>Archive</NavLink>
          
          <div className="relative hidden xl:block" ref={dropdownRef}>
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
          <NavLink to="/pricing" className={`hidden xl:inline ${navLinkClass({ isActive: false })}`}>Pricing</NavLink>
          
          {!token && (
            <NavLink
              to="/login"
              className="ml-4 rounded-lg bg-[#8B4513] px-5 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Contact Us
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header