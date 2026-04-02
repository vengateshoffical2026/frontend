import { useScrollReveal } from '../hooks/useScrollReveal'
import { useTeamMembers, useAuthors } from '../api/hooks/aboutQuery'
import PageSEO from '../components/PageSEO'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const imgUrl = (photo: string, w = 640) => {
  if (!photo) return ''
  if (photo.startsWith('http')) return photo
  return `${API}/uploads/${photo}?w=${w}`
}

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

/* ── Person Card ── */
const PersonCard = ({ photo, name, subtitle, large }: { photo?: string; name: string; subtitle: string; large?: boolean }) => (
  <div className={`shrink-0 ${large ? 'w-56' : 'w-48'} rounded-2xl bg-paper border border-border/50 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_8px_32px_rgba(61,37,22,0.12)] hover:border-primary/25 overflow-hidden`}>
    {/* Photo area */}
    <div className={`w-full ${large ? 'h-52' : 'h-44'} bg-cream/50 flex items-center justify-center overflow-hidden`}>
      {photo ? (
        <img src={imgUrl(photo, 640)} alt={name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center">
          <span className={`${large ? 'text-4xl' : 'text-3xl'} font-black text-primary/40`}>{initials(name)}</span>
        </div>
      )}
    </div>
    {/* Info */}
    <div className={`w-full ${large ? 'px-4 py-4' : 'px-3 py-3'}`}>
      <h3 className={`${large ? 'text-base' : 'text-sm'} font-bold text-body leading-tight mb-1 line-clamp-2`}>{name}</h3>
      <p className="text-xs font-semibold text-primary line-clamp-1">{subtitle}</p>
    </div>
  </div>
)

/* ── Marquee ── */
const MarqueeRow = ({ items, reverse = false, speed = 30, large }: { items: any[]; reverse?: boolean; speed?: number; large?: boolean }) => {
  if (items.length === 0) return null
  const duration = Math.max(items.length * speed, 20)

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />
      <div
        className="flex gap-5 hover:[animation-play-state:paused]"
        style={{
          animation: `${reverse ? 'scroll-right' : 'scroll-left'} ${duration}s linear infinite`,
          width: 'max-content',
        }}
      >
        {[...items, ...items].map((item, i) => (
          <PersonCard
            key={`${item._id}-${i}`}
            photo={item.photo}
            name={item.name}
            subtitle={item.role || item.bookName || ''}
            large={large}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Static grid for small lists (< 6 people) ── */
const StaticGrid = ({ items, large }: { items: any[]; large?: boolean }) => (
  <div className="flex flex-wrap justify-center gap-5 px-5">
    {items.map((item: any) => (
      <PersonCard
        key={item._id}
        photo={item.photo}
        name={item.name}
        subtitle={item.role || item.bookName || ''}
        large={large}
      />
    ))}
  </div>
)

const About = () => {
  const heroReveal = useScrollReveal()
  const teamReveal = useScrollReveal()
  const authorReveal = useScrollReveal()

  const { data: teamData, isLoading: isTeamLoading } = useTeamMembers()
  const { data: authorData, isLoading: isAuthorLoading } = useAuthors(1, 200)

  const allTeam = teamData?.data || []
  const allAuthors = authorData?.data?.authors || []

  // Split into two rows for marquee
  const authorRow1 = allAuthors.filter((_: any, i: number) => i % 2 === 0)
  const authorRow2 = allAuthors.filter((_: any, i: number) => i % 2 === 1)

  const revealClass = (isVisible: boolean) =>
    `reveal-smooth ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PageSEO
        title="About Sasanam"
        description="Learn about Sasanam, the team behind India's digital archive of ancient inscriptions, and the authors who contributed to preserving South Indian epigraphic heritage."
        path="/about"
      />

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Background */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Hero */}
        <section
          ref={heroReveal.ref as any}
          className={`pt-16 pb-10 text-center px-5 ${revealClass(heroReveal.isVisible)}`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-body mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Sasanam</span>
          </h1>
          <div className="w-24 h-1 bg-primary/20 rounded-full mx-auto mb-6" />
          <p className="text-base sm:text-lg text-muted max-w-3xl mx-auto font-medium leading-relaxed">
            Dedicated to preserving and digitizing historical inscriptions and manuscripts.
            Our team of researchers, technologists, and historians work together to make ancient knowledge accessible to everyone.
          </p>
        </section>

        {/* ═══ Leadership ═══ */}
        <section
          ref={teamReveal.ref as any}
          className={`py-10 ${revealClass(teamReveal.isVisible)}`}
        >
          <div className="text-center mb-8 px-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-body">Our Leadership</h2>
            <p className="text-sm text-muted mt-1">The people behind Sasanam's mission</p>
          </div>

          {isTeamLoading ? (
            <div className="flex justify-center gap-5 px-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-56 rounded-2xl bg-paper animate-pulse overflow-hidden">
                  <div className="w-full h-52 bg-border/30" />
                  <div className="p-4"><div className="h-4 bg-border/40 rounded w-24 mx-auto mb-2" /><div className="h-3 bg-border/30 rounded w-16 mx-auto" /></div>
                </div>
              ))}
            </div>
          ) : allTeam.length === 0 ? (
            <div className="text-center py-12 text-muted">Team information coming soon.</div>
          ) : (
            <StaticGrid items={allTeam} large />
          )}
        </section>

        {/* ═══ Authors ═══ */}
        <section
          ref={authorReveal.ref as any}
          className={`py-10 pb-20 ${revealClass(authorReveal.isVisible)}`}
        >
          <div className="text-center mb-8 px-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-body">Our Authors</h2>
            <p className="text-sm text-muted mt-1">
              {allAuthors.length > 0 ? `${allAuthors.length} contributing scholar${allAuthors.length !== 1 ? 's' : ''} and their published works` : 'Contributing scholars and their published works'}
            </p>
          </div>

          {isAuthorLoading ? (
            <div className="space-y-5">
              {[0, 1].map((row) => (
                <div key={row} className="flex gap-5 overflow-hidden">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="shrink-0 w-48 rounded-2xl bg-paper animate-pulse overflow-hidden">
                      <div className="w-full h-44 bg-border/30" />
                      <div className="p-3"><div className="h-3 bg-border/40 rounded w-20 mx-auto mb-1.5" /><div className="h-2.5 bg-border/30 rounded w-24 mx-auto" /></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : allAuthors.length === 0 ? (
            <div className="text-center py-12 text-muted">Author listings coming soon.</div>
          ) : allAuthors.length <= 8 ? (
            <StaticGrid items={allAuthors} />
          ) : (
            <div className="space-y-5">
              <MarqueeRow items={authorRow1} speed={30} />
              <MarqueeRow items={authorRow2} reverse speed={30} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default About
