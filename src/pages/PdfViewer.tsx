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

  const scrollRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const bookName = state.bookName || ''
  const authorName = state.authorName || ''

  // Stable file config — only changes when bookId changes
  const fileConfig = useMemo(() => {
    if (!bookId) return null
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    return {
      url: `${baseURL}/sasanam-books/${bookId}/view`,
      httpHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      rangeChunkSize: 65536,
    }
  }, [bookId])

  // Responsive width
  const updateWidth = useCallback(() => {
    setPageWidth(Math.min(window.innerWidth - 32, 900))
  }, [])

  useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [updateWidth])

  // Lazy page loading
  useEffect(() => {
    if (!scrollRef.current || numPages === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        setVisiblePages((prev) => {
          const next = new Set(prev)
          entries.forEach((entry) => {
            const page = Number(entry.target.getAttribute('data-page'))
            if (entry.isIntersecting) {
              next.add(page)
              if (page + 1 <= numPages) next.add(page + 1)
            }
          })
          return next
        })
      },
      { root: scrollRef.current, rootMargin: '600px 0px' }
    )

    pageRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [numPages])

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
    <div className="fixed inset-0 z-[9999] bg-[#1a1a1a] flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2a2218] shrink-0 border-b border-[#3d3020]">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-[#e2c9a0] hover:bg-white/10 transition-all shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-[#fdfaf2] truncate">{bookName || 'Document'}</h2>
            {authorName && <p className="text-[11px] text-[#c9a87a]">by {authorName}</p>}
          </div>
        </div>
        {numPages > 0 && (
          <span className="text-xs font-medium text-[#c9a87a] shrink-0">{numPages} pages</span>
        )}
      </div>

      {/* PDF area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pdf-area bg-[#1a1a1a]" style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>
        {error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
            <p className="text-sm text-[#fdfaf2]">Unable to load document</p>
            <button onClick={() => navigate(-1)} className="text-sm font-bold text-[#c9a87a] hover:underline">Go back</button>
          </div>
        ) : fileConfig ? (
          <div className="flex flex-col items-center py-6 gap-4">
            {/* Spinner shown until Document fires onLoadSuccess */}
            {!docReady && (
              <div className="flex flex-col items-center py-32 gap-3">
                <div className="h-10 w-10 border-[3px] border-[#c9a87a] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#c9a87a]">Loading...</p>
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
                  const show = visiblePages.has(p)
                  return (
                    <div
                      key={p}
                      ref={(el) => setPageRef(p, el)}
                      data-page={p}
                      className="mb-3 rounded-lg overflow-hidden shadow-lg"
                      style={!show ? { height: pageH, width: pageWidth, background: '#2a2a2a' } : undefined}
                    >
                      {show ? (
                        <Page
                          pageNumber={p}
                          width={pageWidth}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          loading={
                            <div className="flex items-center justify-center bg-[#2a2a2a]" style={{ height: pageH, width: pageWidth }}>
                              <div className="h-5 w-5 border-2 border-[#c9a87a] border-t-transparent rounded-full animate-spin" />
                            </div>
                          }
                        />
                      ) : (
                        <div className="flex items-center justify-center" style={{ height: pageH, width: pageWidth, background: '#2a2a2a' }}>
                          <span className="text-xs text-[#555]">{p}</span>
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
