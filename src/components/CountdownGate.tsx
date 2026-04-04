import { useState, useEffect } from 'react'
import { useGetSiteSettings } from '../api/hooks/siteSettingsQuery'

function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!targetDate) return
    const tick = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

function CountdownPage({ launchDate }: { launchDate: string | null }) {
  const { days, hours, minutes, seconds } = useCountdown(launchDate)

  const units = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ]

  return (
    <div className="min-h-screen bg-bg font-sans flex flex-col items-center justify-center relative overflow-hidden px-5">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#e8d3b0]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <filter id="countdownNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#countdownNoise)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Logo */}
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-xl mb-8">
          <span className="text-white font-serif font-black text-3xl">S</span>
        </div>

        <h1
          className="text-5xl sm:text-6xl font-extrabold tracking-tight text-heading leading-none mb-4"
          style={{ fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif" }}
        >
          Sasanam
        </h1>

        {/* Ornament */}
        <svg viewBox="0 0 200 16" className="w-32 h-4 text-accent opacity-60 mb-6" fill="none">
          <line x1="0" y1="8" x2="72" y2="8" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="84" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
          <circle cx="116" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
          <line x1="128" y1="8" x2="200" y2="8" stroke="currentColor" strokeWidth="1" />
        </svg>

        <p className="text-lg text-muted font-medium leading-relaxed mb-10">
          Preserving India's ancient inscriptions for future generations.<br />
          Something remarkable is on the way.
        </p>

        {/* Countdown */}
        {launchDate && (
          <div className="flex items-center gap-3 sm:gap-5 mb-10">
            {units.map((unit) => (
              <div key={unit.label} className="flex flex-col items-center">
                <div className="w-18 sm:w-22 h-20 sm:h-24 rounded-2xl bg-paper border border-border shadow-lg flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-black text-primary tabular-nums">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-2xs uppercase tracking-[0.2em] font-bold text-muted mt-2">{unit.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Social links */}
        <div className="flex items-center gap-3">
          {[
            { href: 'https://x.com/sasanamjournal', label: 'X', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
            { href: 'https://www.instagram.com/sasanamjournal/', label: 'Instagram', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
            { href: 'https://wa.me/919842647101', label: 'WhatsApp', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
              className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary/20 hover:text-primary transition-all border border-primary/10">
              {s.icon}
            </a>
          ))}
        </div>

        <p className="text-xs text-muted/50 mt-8 font-medium">&copy; {new Date().getFullYear()} Sasanam. All rights reserved.</p>
      </div>
    </div>
  )
}

export default function CountdownGate({ children }: { children: React.ReactNode }) {
  const { data: settings, isLoading } = useGetSiteSettings()

  // While loading, show blank (prevents flash)
  if (isLoading) return <div className="min-h-screen bg-bg" />

  // If site is live, show the app
  if (settings?.isLive) return <>{children}</>

  // Site is not live — show countdown
  return <CountdownPage launchDate={settings?.launchDate || null} />
}
