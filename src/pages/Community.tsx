import PageSEO from '../components/PageSEO'
import { useGetResourceCenters } from '../api/hooks/communityQuery'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const imgUrl = (photo: string) => {
  if (!photo) return ''
  if (photo.startsWith('http')) return photo
  return `${API}/uploads/${photo}?w=640`
}

const OrnamentDivider = () => (
  <svg viewBox="0 0 200 16" className="w-32 h-4 text-accent opacity-60" fill="none">
    <line x1="0" y1="8" x2="72" y2="8" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="84" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
    <circle cx="116" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
    <line x1="128" y1="8" x2="200" y2="8" stroke="currentColor" strokeWidth="1" />
  </svg>
)

const ParchmentTexture = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <filter id="comNoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#comNoise)" />
  </svg>
)

const CardSkeletons = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="relative bg-paper border border-border/70 rounded-2xl overflow-hidden" style={{ animationDelay: `${i * 80}ms` }}>
        <div className="w-full h-40 bg-[#e8d9c4]/60 animate-pulse" />
        <div className="p-5 space-y-3">
          <div className="w-3/4 h-5 rounded-full bg-[#e8d9c4]/60 animate-pulse" />
          <div className="w-1/2 h-3 rounded-full bg-[#e8d9c4]/40 animate-pulse" />
          <div className="w-full h-3 rounded-full bg-[#e8d9c4]/40 animate-pulse" />
        </div>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    ))}
  </div>
)

const EmptyState = () => (
  <div className="rounded-3xl bg-paper p-14 shadow-[0_8px_40px_rgba(61,37,22,0.1)] border border-border text-center max-w-sm w-full">
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0e6d3] text-accent ring-1 ring-border shadow-inner">
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </div>
    <p className="text-base font-semibold text-body leading-relaxed">
      No resource centers listed yet.<br />
      <span className="text-subtle font-normal text-sm italic">Community resources arriving soon...</span>
    </p>
    <div className="mt-5 flex justify-center"><OrnamentDivider /></div>
  </div>
)

const Community = () => {
  const { data: centers, isLoading } = useGetResourceCenters()

  return (
    <main className="relative min-h-screen bg-bg font-sans text-body flex flex-col overflow-x-hidden">
      <PageSEO
        title="Community – Resource Centers"
        description="Discover research centers, institutions, and organizations dedicated to preserving South Indian inscriptions and epigraphic heritage."
        path="/community"
      />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#e8d3b0]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        <ParchmentTexture />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
        <section className="mt-4 flex flex-col items-center flex-1 pb-20 w-full">

          {/* Header */}
          <div className="flex flex-col items-center gap-2 mt-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent/60" />
              <span className="text-2xs uppercase tracking-[0.3em] text-subtle font-medium">Explore Institutions</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent/60" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-heading leading-none"
              style={{ fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif", letterSpacing: "-0.01em" }}>
              Community
            </h1>
            <OrnamentDivider />
            <p className="text-sm text-muted max-w-lg text-center mt-2">
              Explore research centers and institutions working to preserve and study ancient South Indian inscriptions and heritage.
            </p>
          </div>

          {/* Cards */}
          {isLoading ? (
            <CardSkeletons />
          ) : centers && centers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {centers.map((center: any) => {
                const hasUrl = center.url && center.url.trim()
                const Wrapper = hasUrl ? 'a' : 'div'
                const wrapperProps = hasUrl ? { href: center.url, target: '_blank', rel: 'noopener noreferrer' } : {}
                return (
                  <Wrapper
                    key={center._id}
                    {...wrapperProps}
                    className="group relative bg-paper border border-border/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    {center.imageUrl ? (
                      <div className="h-44 w-full overflow-hidden">
                        <img src={imgUrl(center.imageUrl)} alt={center.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="h-44 w-full bg-gradient-to-br from-[#f0e6d3] to-[#e2c9a0] flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-body text-base group-hover:text-primary transition-colors leading-snug">{center.name}</h3>
                      {center.location && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-primary/70">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-2xs font-semibold">{center.location}</span>
                        </div>
                      )}
                      {center.description && (
                        <p className="text-xs text-muted mt-3 line-clamp-3 leading-relaxed">{center.description}</p>
                      )}
                      {hasUrl && (
                        <div className="flex items-center gap-1.5 mt-4 text-primary/70 group-hover:text-primary transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="text-2xs font-semibold uppercase tracking-wider">Visit Website</span>
                        </div>
                      )}
                    </div>
                  </Wrapper>
                )
              })}
            </div>
          ) : (
            <EmptyState />
          )}

        </section>
      </div>
      <style>{`@keyframes shimmer { to { transform: translateX(200%); } }`}</style>
    </main>
  )
}

export default Community
