import { useState } from 'react'
import PageSEO from '../components/PageSEO'
import { useGetArchiveItems } from '../api/hooks/archiveQuery'

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
    <filter id="arcNoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#arcNoise)" />
  </svg>
)

const CardSkeletons = () => (
  <div className="space-y-8 w-full">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="relative bg-paper border border-border/70 rounded-2xl p-8 overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-48 h-32 rounded-xl bg-[#e8d9c4]/60 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="w-1/3 h-3 rounded-full bg-[#e8d9c4]/40 animate-pulse" />
            <div className="w-3/4 h-5 rounded-full bg-[#e8d9c4]/60 animate-pulse" />
            <div className="w-full h-3 rounded-full bg-[#e8d9c4]/40 animate-pulse" />
            <div className="w-2/3 h-3 rounded-full bg-[#e8d9c4]/40 animate-pulse" />
          </div>
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    </div>
    <p className="text-base font-semibold text-body leading-relaxed">
      No archive entries yet.<br />
      <span className="text-subtle font-normal text-sm italic">Historical records arriving soon...</span>
    </p>
    <div className="mt-5 flex justify-center"><OrnamentDivider /></div>
  </div>
)

/* Lightbox for viewing images */
const Lightbox = ({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) => {
  const [current, setCurrent] = useState(startIndex)
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <img src={imgUrl(images[current])} alt="" className="w-full h-full object-contain rounded-lg" />
        {/* Close */}
        <button onClick={onClose} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-body flex items-center justify-center shadow-lg hover:bg-gray-100">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {/* Nav */}
        {images.length > 1 && (
          <>
            <button onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-body flex items-center justify-center shadow-lg hover:bg-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setCurrent((c) => (c + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-body flex items-center justify-center shadow-lg hover:bg-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const Archive = () => {
  const { data: items, isLoading } = useGetArchiveItems()
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)

  return (
    <main className="relative min-h-screen bg-bg font-sans text-body flex flex-col overflow-x-hidden">
      <PageSEO
        title="Archive – Historical Document Archive"
        description="Access Sasanam's archive of historical documents, ancient manuscripts, and epigraphic records from Tamil Nadu and South India."
        path="/archive"
      />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#e8d3b0]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        <ParchmentTexture />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
        <section className="mt-4 flex flex-col items-center flex-1 pb-20 w-full">

          {/* Header */}
          <div className="flex flex-col items-center gap-2 mt-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent/60" />
              <span className="text-2xs uppercase tracking-[0.3em] text-subtle font-medium">Old History of Sasanam</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent/60" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-heading leading-none"
              style={{ fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif", letterSpacing: "-0.01em" }}>
              Archive
            </h1>
            <OrnamentDivider />
            <p className="text-sm text-muted max-w-lg text-center mt-2">
              Explore the rich historical legacy of Sasanam through the ages — from ancient dynasties to modern preservation efforts.
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <CardSkeletons />
          ) : items && items.length > 0 ? (
            <div className="w-full space-y-6">
              {items.map((item: any, idx: number) => {
                const images: string[] = item.images || []
                const hasImages = images.length > 0
                return (
                  <article
                    key={item._id}
                    className="group relative bg-paper border border-border/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    {/* Main content row */}
                    <div className="flex flex-col sm:flex-row">
                      {hasImages && (
                        <div
                          className="w-full sm:w-56 md:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden cursor-pointer relative"
                          onClick={() => setLightbox({ images, index: 0 })}
                        >
                          <img src={imgUrl(images[0])} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {images.length > 1 && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/60 text-white text-2xs font-bold flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                              {images.length}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 p-6 sm:p-8">
                        {item.period && (
                          <span className="inline-block px-3 py-1 rounded-full text-2xs font-bold uppercase tracking-wider bg-primary/10 text-primary mb-3">
                            {item.period}
                          </span>
                        )}
                        <h2 className="text-xl font-bold text-heading leading-snug mb-3">{item.title}</h2>
                        <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{item.content}</p>
                      </div>
                    </div>

                    {/* Image gallery strip (when more than 1 image) */}
                    {images.length > 1 && (
                      <div className="px-6 pb-5 pt-1">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {images.map((img: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => setLightbox({ images, index: i })}
                              className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border border-border/50 hover:border-primary/40 hover:shadow-md transition-all"
                            >
                              <img src={imgUrl(img)} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          ) : (
            <EmptyState />
          )}

        </section>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox images={lightbox.images} startIndex={lightbox.index} onClose={() => setLightbox(null)} />
      )}

      <style>{`@keyframes shimmer { to { transform: translateX(200%); } }`}</style>
    </main>
  )
}

export default Archive
