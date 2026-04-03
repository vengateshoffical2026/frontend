import { Link } from 'react-router-dom'

const Footer = () => {
  const token = localStorage.getItem("token")
  return (
    <footer className="w-full bg-gradient-to-b from-primary to-[#5a2d0c] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/3 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/[0.02] rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="relative w-full px-6 sm:px-10 lg:px-16">
        {/* Top section with logo */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg border border-white/10">
            <span className="text-2xl font-serif font-black text-white">S</span>
          </div>
          <h2 className="text-2xl font-serif font-black tracking-wide text-white mb-2">Sasanam</h2>
          <p className="text-sm text-white/60 max-w-md leading-relaxed">
            Preserving India's ancient inscriptions for future generations through digital archival.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-2">About</h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              We are dedicated to exploring and preserving the rich heritage, cultural nuances, and historical timelines, ensuring the legacy of knowledge passes seamlessly to the next generation.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-2">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/journal', label: 'Journal' },
                { to: '/archive', label: 'Archive' },
                { to: '/library', label: 'Library' },
                { to: '/pricing', label: 'Subscribe' },
                { to: '/community', label: 'Community' },
                { to: '/news-events', label: 'News & Events' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => {
  const isRestricted =
    link?.label === "Journal" ||
    link?.label === "Subscribe" ||
    link?.label === "News & Events" ||
    link?.label === "Contact"

  if (isRestricted && !token) {
    return null; // hide link if no token
  }

  return (
    <Link
      key={link.to}
      to={link.to}
      className="group text-sm font-medium text-white/60 hover:text-white transition-all duration-200 w-fit flex items-center gap-2"
    >
      <span className="h-px w-0 bg-white group-hover:w-3 transition-all duration-300" />
      {link.label}
    </Link>
  );
})}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-2">Connect</h3>
            <a
              href="mailto:contact@sasanam.in"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2 mb-3"
            >
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contact@sasanam.in
            </a>
            <div className="flex items-center gap-3">
              {[
                { href: '#', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg> },
                { href: '#', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white hover:-translate-y-0.5 transition-all duration-300 border border-white/5"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-white/50">&copy; {new Date().getFullYear()} Sasanam. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-xs font-medium text-white/40 hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="text-xs font-medium text-white/40 hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
