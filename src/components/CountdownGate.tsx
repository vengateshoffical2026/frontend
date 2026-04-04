import { useState, useEffect, useMemo } from 'react'
import { useGetSiteSettings } from '../api/hooks/siteSettingsQuery'

/* ─── Countdown hook ─────────────────────────────────────────── */
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

/* ─── Ancient Tamil script characters ─────────────────────── */
const ANCIENT_CHARS = [
  '\u0B85', '\u0B86', '\u0B87', '\u0B88', '\u0B89',
  '\u0B95', '\u0B9A', '\u0B9F', '\u0BA4', '\u0BAA',
  '\u0BAE', '\u0BAF', '\u0BB0', '\u0BB2', '\u0BB5',
  '\u0B9E', '\u0BA3', '\u0BA8', '\u0BB7', '\u0BB8', '\u0BB9',
  '\u0C85', '\u0C86', '\u0C95', '\u0C9A',
]

/* ─── Single digit with smooth number transition ──────────── */
function SmoothDigit({ value }: { value: string }) {
  const [display, setDisplay] = useState(value)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (value !== display) {
      setAnimating(true)
      const t = setTimeout(() => {
        setDisplay(value)
        setAnimating(false)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [value, display])

  return (
    <div className="relative w-[2.6rem] sm:w-[3.4rem] h-[3.2rem] sm:h-[4.2rem] overflow-hidden rounded-xl border border-[#d4b896] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_14px_rgba(61,37,22,0.12)]">
      {/* Parchment background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8eed8] via-[#f3e5cc] to-[#ede0c8]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.8\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
      {/* Center fold */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-[#c9a87a]/20 z-10" />

      {/* Number — slides out old, slides in new */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          transform: animating ? 'translateY(-100%)' : 'translateY(0)',
          opacity: animating ? 0 : 1,
        }}
      >
        <span className="text-[1.6rem] sm:text-[2rem] font-black text-primary tabular-nums relative z-10" style={{ fontFamily: "'Cinzel', serif" }}>
          {display}
        </span>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          transform: animating ? 'translateY(0)' : 'translateY(100%)',
          opacity: animating ? 1 : 0,
        }}
      >
        <span className="text-[1.6rem] sm:text-[2rem] font-black text-primary tabular-nums relative z-10" style={{ fontFamily: "'Cinzel', serif" }}>
          {value}
        </span>
      </div>
    </div>
  )
}

/* ─── Countdown unit ─────────────────────────────────────── */
function CountdownUnit({ value, label, delay }: { value: number; label: string; delay: number }) {
  const str = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center" style={{ animation: `cdFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s both` }}>
      <div className="flex gap-[3px]">
        <SmoothDigit value={str[0]} />
        <SmoothDigit value={str[1]} />
      </div>
      <span
        className="mt-2 text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.25em] font-bold text-accent/70"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {label}
      </span>
    </div>
  )
}

/* ─── Separator ──────────────────────────────────────────── */
function Colon() {
  return (
    <div className="flex flex-col gap-1.5 pb-5">
      <div className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-pulse-soft" />
      <div className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
    </div>
  )
}

/* ─── Inscription lines ──────────────────────────────────── */
function InscriptionLines() {
  return (
    <div className="w-full max-w-md mx-auto my-8 flex flex-col items-center gap-2 opacity-25">
      {[0.6, 0.85, 1, 0.75, 0.5].map((w, i) => (
        <div
          key={i}
          className="h-[1.5px] rounded-full overflow-hidden"
          style={{
            width: `${w * 100}%`,
            animation: `cdLineReveal 1.2s cubic-bezier(0.22,1,0.36,1) ${0.8 + i * 0.12}s both`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>
      ))}
    </div>
  )
}

/* ─── Main countdown page ────────────────────────────────── */
function CountdownPage({ launchDate }: { launchDate: string | null }) {
  const { days, hours, minutes, seconds } = useCountdown(launchDate)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Stable particle positions — only generate once
  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      char: ANCIENT_CHARS[i % ANCIENT_CHARS.length],
      delay: (i * 0.7) % 14,
      duration: 14 + (i % 5) * 3,
      x: 3 + ((i * 37) % 94),
      size: 1.4 + (i % 4) * 0.6,
    }))
  , [])

  return (
    <div className="min-h-screen bg-bg font-sans flex flex-col items-center justify-center relative overflow-hidden px-5">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#e8d3b0]/25 rounded-full blur-[140px] animate-pulse-soft" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px]" style={{ animation: 'cdDrift 20s ease-in-out infinite alternate' }} />
        <div className="absolute top-[30%] left-[-5%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" style={{ animation: 'cdDrift 25s ease-in-out infinite alternate-reverse' }} />

        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <filter id="cdNoise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="5" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#cdNoise)" />
        </svg>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(61,37,22,0.08)_100%)]" />

        {/* Floating ancient script — smooth linear drift */}
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-0 pointer-events-none select-none font-bold"
            style={{
              left: `${p.x}%`,
              fontSize: `${p.size}rem`,
              color: '#8B4513',
              fontFamily: "'Noto Sans Tamil', 'Anek Tamil', sans-serif",
              fontWeight: 700,
              animation: `cdFloat ${p.duration}s linear ${p.delay}s infinite`,
            }}
          >
            {p.char}
          </span>
        ))}
      </div>

      {/* ── Content ── */}
      <div className={`relative z-10 flex flex-col items-center text-center max-w-2xl transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

        {/* Logo */}
        <div style={{ animation: 'cdFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}>
          <div className="relative mb-10">
            <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-xl scale-150 animate-pulse-soft" />
            <div className="relative h-24 w-24 rounded-2xl bg-white/60 ring-1 ring-primary/10 flex items-center justify-center shadow-[0_8px_30px_rgba(139,69,19,0.25)] overflow-hidden p-2">
              <img src="/logo.webp" alt="Sasanam" className="h-full w-full object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-heading leading-none mb-2"
          style={{
            fontFamily: "'Cinzel', 'Palatino Linotype', Palatino, serif",
            letterSpacing: '0.04em',
            animation: 'cdFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.25s both',
          }}
        >
          Sasanam
        </h1>

        {/* Subtitle */}
        <p
          className="text-sm sm:text-base uppercase tracking-[0.35em] text-accent font-bold mb-2"
          style={{
            fontFamily: "'Cinzel', serif",
            animation: 'cdFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both',
          }}
        >
          Ancient Inscriptions Archive
        </p>

        <InscriptionLines />

        {/* Tagline */}
        <p
          className="text-base sm:text-lg text-muted font-medium leading-relaxed max-w-md mb-10"
          style={{ animation: 'cdFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 1.0s both' }}
        >
          Preserving India's ancient inscriptions for future generations.
          <br />
          <span className="text-subtle italic">Something remarkable is on the way.</span>
        </p>

        {/* ── Countdown timer ── */}
        {launchDate && (
          <div
            className="relative mb-12 p-5 sm:p-7 rounded-3xl bg-paper/80 backdrop-blur-sm border border-border/60 shadow-[0_12px_40px_rgba(61,37,22,0.1)]"
            style={{ animation: 'cdScaleUp 0.6s cubic-bezier(0.22,1,0.36,1) 1.2s both' }}
          >
            {/* Corner ornaments */}
            {['top-2 left-2', 'top-2 right-2 rotate-90', 'bottom-2 left-2 -rotate-90', 'bottom-2 right-2 rotate-180'].map((pos, i) => (
              <svg key={i} className={`absolute ${pos} w-5 h-5 text-accent/20`} viewBox="0 0 40 40" fill="none">
                <path d="M2 2 L2 16 M2 2 L16 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="5" cy="5" r="1" fill="currentColor" />
              </svg>
            ))}

            <div className="flex items-center gap-2 sm:gap-3">
              <CountdownUnit value={days} label="Days" delay={1.4} />
              <Colon />
              <CountdownUnit value={hours} label="Hours" delay={1.55} />
              <Colon />
              <CountdownUnit value={minutes} label="Minutes" delay={1.7} />
              <Colon />
              <CountdownUnit value={seconds} label="Seconds" delay={1.85} />
            </div>
          </div>
        )}

        {/* Social links */}
        <div className="flex items-center gap-3" style={{ animation: 'cdFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 2.0s both' }}>
          {[
            { href: 'https://x.com/sasanamjournal', label: 'X', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
            { href: 'https://www.instagram.com/sasanamjournal/', label: 'Instagram', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
            { href: 'https://wa.me/919842647101', label: 'WhatsApp', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
            { href: 'https://www.linkedin.com/in/sasanam-journal-9b5931400', label: 'LinkedIn', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
              className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary/50 hover:bg-primary/15 hover:text-primary hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 border border-primary/8">
              {s.icon}
            </a>
          ))}
        </div>

        <p className="text-xs text-muted/40 mt-10 font-medium tracking-wide" style={{ animation: 'cdFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 2.2s both' }}>
          &copy; {new Date().getFullYear()} Sasanam. All rights reserved.
        </p>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes cdFloat {
          0% { opacity: 0; transform: translateY(20px) rotate(0deg); }
          5% { opacity: 0.2; }
          50% { opacity: 0.22; }
          95% { opacity: 0.15; }
          100% { opacity: 0; transform: translateY(-100vh) rotate(15deg); }
        }
        @keyframes cdFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cdScaleUp {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes cdLineReveal {
          from { opacity: 0; transform: scaleX(0); }
          to { opacity: 1; transform: scaleX(1); }
        }
        @keyframes cdDrift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(25px, -15px) scale(1.05); }
        }
      `}</style>
    </div>
  )
}

/* ─── Gate wrapper ────────────────────────────────────────── */
export default function CountdownGate({ children }: { children: React.ReactNode }) {
  const { data: settings, isLoading } = useGetSiteSettings()

  if (isLoading) return <div className="min-h-screen bg-bg" />
  if (settings?.isLive) return <>{children}</>

  return <CountdownPage launchDate={settings?.launchDate || null} />
}
