import { NavLink } from 'react-router-dom'

const Header = () => {
  const token:string | null = localStorage.getItem('token')
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition ${isActive ? 'text-[#2e8578] font-bold' : 'text-[#5b2222] hover:text-[#2e8578]'}`
  console.log('Token in Header:', token) 
  return (
    <header className="rounded-lg sm:rounded-xl bg-[#FFFFFF]/30 px-3 sm:px-5 lg:px-6 py-2 sm:py-3 shadow-[0_4px_16px_rgba(67,42,30,0.15)]">
      <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
        <NavLink to="/" className="text-xl sm:text-2xl lg:text-4xl leading-none text-[#b78b61] hover:opacity-80 transition" style={{ fontFamily: 'serif' }}>
          Sasanam
        </NavLink>

        <nav className="flex flex-wrap items-center justify-end gap-x-2 sm:gap-x-4 lg:gap-x-10 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm lg:text-lg font-semibold">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/journal" className={navLinkClass}>Journal</NavLink>
          <NavLink to="/archive" className={navLinkClass}>Archive</NavLink>
          <NavLink to="/library" className={`hidden sm:inline ${navLinkClass({ isActive: false })}`}>Library</NavLink>
          <NavLink to="/community" className={`hidden lg:inline ${navLinkClass({ isActive: false })}`}>Community</NavLink>
          <NavLink to="/pricing" className={`hidden lg:inline ${navLinkClass({ isActive: false })}`}>Pricing</NavLink>
          {!token && (<NavLink to="/login" className={navLinkClass}>Login</NavLink>)}
          
        </nav>
      </div>
    </header>
  )
}

export default Header