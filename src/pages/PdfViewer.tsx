import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

export default function PdfViewer() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state || {}) as { bookName?: string; authorName?: string }

  const [numPages, setNumPages] = useState(0)
  const [docReady, setDocReady] = useState(false)
  const [error, setError] = useState(false)
  const [pageWidth, setPageWidth] = useState(800)
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set())
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set())

  const scrollRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const bookName = state.bookName || ''
  const authorName = state.authorName || ''

  // Stable file config
  const fileConfig = useMemo(() => {
    if (!bookId) return null
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    return {
      url: `${baseURL}/sasanam-books/${bookId}/view`,
      httpHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    }
  }, [bookId])

  // Responsive width
  const updateWidth = useCallback(() => {
    setPageWidth(Math.min(window.innerWidth - 48, 850))
  }, [])

  useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [updateWidth])

  // Lazy page loading — only render pages near viewport
  useEffect(() => {
    if (!scrollRef.current || numPages === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        setVisiblePages((prev) => {
          const next = new Set(prev)
          let changed = false
          entries.forEach((entry) => {
            const page = Number(entry.target.getAttribute('data-page'))
            if (entry.isIntersecting && !prev.has(page)) {
              next.add(page)
              if (page + 1 <= numPages) next.add(page + 1)
              changed = true
            }
          })
          return changed ? next : prev
        })
      },
      { root: scrollRef.current, rootMargin: '400px 0px' }
    )

    pageRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [numPages])

  // Keep track of rendered pages (don't unmount once rendered)
  useEffect(() => {
    setRenderedPages((prev) => {
      const next = new Set(prev)
      visiblePages.forEach((p) => next.add(p))
      return next.size !== prev.size ? next : prev
    })
  }, [visiblePages])

  // Disable right-click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.pdf-area')) e.preventDefault()
    }
    document.addEventListener('contextmenu', handler)
    return () => document.removeEventListener('contextmenu', handler)
  }, [])

  const setPageRef = useCallback((page: number, el: HTMLDivElement | null) => {
    if (el) pageRefs.current.set(page, el)
    else pageRefs.current.delete(page)
  }, [])

  const pageH = Math.round(pageWidth * 1.414)

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cream shrink-0 border-b border-border/60 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-all shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-heading truncate">{bookName || 'Document'}</h2>
            {authorName && <p className="text-[11px] text-subtle">by {authorName}</p>}
          </div>
        </div>
        {numPages > 0 && (
          <span className="text-xs font-semibold text-primary/70 shrink-0">{numPages} pages</span>
        )}
      </div>

      {/* PDF area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pdf-area bg-bg" style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>
        {error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
            <p className="text-sm text-body">Unable to load document</p>
            <button onClick={() => navigate(-1)} className="text-sm font-bold text-primary hover:underline">Go back</button>
          </div>
        ) : fileConfig ? (
          <div className="flex flex-col items-center py-4 gap-3">
            {!docReady && (
              <div className="flex flex-col items-center py-32 gap-3">
                <div className="h-10 w-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-body">Loading...</p>
              </div>
            )}

            <div style={docReady ? undefined : { position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
              <Document
                file={fileConfig}
                onLoadSuccess={({ numPages: n }) => {
                  setNumPages(n)
                  setVisiblePages(new Set([1, 2]))
                  setDocReady(true)
                }}
                onLoadError={() => setError(true)}
              >
                {numPages > 0 && Array.from({ length: numPages }, (_, i) => {
                  const p = i + 1
                  const show = renderedPages.has(p)
                  return (
                    <div
                      key={p}
                      ref={(el) => setPageRef(p, el)}
                      data-page={p}
                      className="mb-3 rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(61,37,22,0.1)] border border-border/40"
                      style={!show ? { height: pageH, width: pageWidth, background: '#fdf8f0' } : undefined}
                    >
                      {show ? (
                        <Page
                          pageNumber={p}
                          width={pageWidth}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          loading={
                            <div className="flex items-center justify-center bg-paper" style={{ height: pageH, width: pageWidth }}>
                              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          }
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-paper" style={{ height: pageH, width: pageWidth }}>
                          <span className="text-xs text-accent/50">{p}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </Document>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
