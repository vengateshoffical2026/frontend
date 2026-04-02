import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import apiClient from '../api/interceptors/axiosInstance'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function PdfViewer() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state || {}) as { bookName?: string; authorName?: string }
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookName] = useState(state.bookName || '')
  const [authorName] = useState(state.authorName || '')
  const [pageWidth, setPageWidth] = useState(800)

  // Responsive page width
  const updateWidth = useCallback(() => {
    const w = Math.min(window.innerWidth - 32, 900)
    setPageWidth(w)
  }, [])

  useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [updateWidth])

  // Fetch PDF data
  useEffect(() => {
    if (!bookId) return

    const fetchPdf = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await apiClient.get(`/sasanam-books/${bookId}/view`, {
          responseType: 'arraybuffer',
        })
        setPdfData(res.data)
      } catch {
        setError('Unable to load this document. It may not have a PDF file.')
      } finally {
        setLoading(false)
      }
    }

    fetchPdf()
  }, [bookId])

  // Disable right-click on the viewer
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.pdf-viewer-area')) {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', handler)
    return () => document.removeEventListener('contextmenu', handler)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] bg-[#1a1a1a] flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2a2218] shrink-0 border-b border-[#3d3020]">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-[#e2c9a0] hover:bg-white/10 transition-all shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-[#fdfaf2] truncate">{bookName || 'Document Viewer'}</h2>
            {authorName && <p className="text-[11px] text-[#c9a87a]">by {authorName}</p>}
          </div>
        </div>
        {numPages > 0 && (
          <span className="text-xs font-medium text-[#c9a87a] shrink-0">
            {numPages} page{numPages !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-y-auto pdf-viewer-area" style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="h-10 w-10 border-3 border-[#c9a87a] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#c9a87a]">Loading document...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-sm text-[#fdfaf2]">{error}</p>
            <button onClick={() => navigate(-1)} className="text-sm font-bold text-[#c9a87a] hover:underline">Go back</button>
          </div>
        ) : pdfData ? (
          <div className="flex flex-col items-center py-6 gap-4">
            <Document
              file={{ data: pdfData }}
              onLoadSuccess={({ numPages: n }) => setNumPages(n)}
              loading={
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 border-3 border-[#c9a87a] border-t-transparent rounded-full animate-spin" />
                </div>
              }
              error={
                <p className="text-sm text-red-400 text-center py-20">Failed to render PDF</p>
              }
            >
              {Array.from({ length: numPages }, (_, i) => (
                <div key={i} className="mb-4 shadow-lg rounded-lg overflow-hidden bg-white">
                  <Page
                    pageNumber={i + 1}
                    width={pageWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </Document>
          </div>
        ) : null}
      </div>
    </div>
  )
}
