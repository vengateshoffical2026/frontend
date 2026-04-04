import PageSEO from '../components/PageSEO'
import { useGetLibraryLinks } from '../api/hooks/libraryQuery'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const imgUrl = (photo: string) => {
  if (!photo) return ''
  if (photo.startsWith('http')) return photo
  return `${API}/uploads/${photo}?w=640`
}

/* Decorative ornament */
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
    <filter id="libNoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#libNoise)" />
  </svg>
)

/* Skeleton cards */
const CardSkeletons = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="relative bg-paper border border-border/70 rounded-2xl p-6 overflow-hidden" style={{ animationDelay: `${i * 80}ms` }}>
        <div className="w-full h-5 rounded-full bg-[#e8d9c4]/60 animate-pulse mb-3" />
        <div className="w-3/4 h-4 rounded-full bg-[#e8d9c4]/40 animate-pulse mb-2" />
        <div className="w-1/2 h-3 rounded-full bg-[#e8d9c4]/40 animate-pulse" />
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    ))}
  </div>
)

/* Empty state */
const EmptyState = () => (
  <div className="rounded-3xl bg-paper p-14 shadow-[0_8px_40px_rgba(61,37,22,0.1)] border border-border text-center max-w-sm w-full">
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0e6d3] text-accent ring-1 ring-border shadow-inner">
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <p className="text-base font-semibold text-body leading-relaxed">
      No documents available yet.<br />
      <span className="text-subtle font-normal text-sm italic">Resources arriving soon...</span>
    </p>
    <div className="mt-5 flex justify-center"><OrnamentDivider /></div>
  </div>
)

const Library = () => {
  const { data: links, isLoading } = useGetLibraryLinks()

  /* Group links by category */
  const grouped = (links || []).reduce((acc: Record<string, any[]>, link: any) => {
    const cat = link.category || 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(link)
    return acc
  }, {} as Record<string, any[]>)

  const categories = Object.keys(grouped)

  return (
    <main className="relative min-h-screen bg-bg font-sans text-body flex flex-col overflow-x-hidden">
      <PageSEO
        title="Library – Ancient Books & Texts"
        description="Explore Sasanam's digital library of ancient books, translated texts, and epigraphic literature on South Indian history and inscriptions."
        path="/library"
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
              <span className="text-2xs uppercase tracking-[0.3em] text-subtle font-medium">External Resources</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent/60" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-heading leading-none"
              style={{ fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif", letterSpacing: "-0.01em" }}>
              Library
            </h1>
            <OrnamentDivider />
            <p className="text-sm text-muted max-w-lg text-center mt-2">
              A curated collection of documents, books, and research resources from other websites and institutions.
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <CardSkeletons />
          ) : categories.length > 0 ? (
            <div className="w-full space-y-10">
              {categories.map((category) => (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-border/60" />
                    <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary/70">{category}</h2>
                    <div className="h-px flex-1 bg-border/60" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {grouped[category].map((link: any) => (
                      <a
                        key={link._id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-paper border border-border/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                      >
                        {link.imageUrl && (
                          <div className="h-36 w-full overflow-hidden">
                            <img src={imgUrl(link.imageUrl)} alt={link.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="p-5">
                          <h3 className="font-bold text-body text-base group-hover:text-primary transition-colors leading-snug">{link.title}</h3>
                          {link.description && (
                            <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">{link.description}</p>
                          )}
                          <div className="flex items-center gap-1.5 mt-3 text-primary/70 group-hover:text-primary transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="text-2xs font-semibold uppercase tracking-wider">Visit Resource</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
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

export default Library
