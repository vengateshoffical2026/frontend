import { useState } from 'react'
import { useGetAllBooks } from '../api/hooks/journalQuery'
import { downloadBook } from '../api/controllers/journal'
import apiClient from '../api/interceptors/axiosInstance'
import { toast } from 'react-toastify'
import PageSEO from '../components/PageSEO'
import { useNavigate } from 'react-router-dom'

const Sasanam = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [viewingBook, setViewingBook] = useState<any>(null)
  const [bookContent, setBookContent] = useState<string | null>(null)
  const [contentLoading, setContentLoading] = useState(false)

  const getUserData = () => {
    try {
      const d = localStorage.getItem('user')
      if (d) return JSON.parse(d)
    } catch {}
    return null
  }
  const user = getUserData()
  const isSubscribed = user?.isSubscribed === true
  const canDownloadAccess = user?.canDownload === true
  const hasDownloadAccess = isSubscribed || canDownloadAccess

  const { data: books, isLoading } = useGetAllBooks()
  const allBooks: any[] = books || []

  // View book content
  const handleView = async (book: any) => {
    setViewingBook(book)
    setBookContent(null)
    setContentLoading(true)
    try {
      const res = await apiClient.get(`/sasanam-book-details/${book._id}`)
      const details = res.data?.data
      if (details && details.bookDetails) {
        setBookContent(details.bookDetails)
      } else {
        setBookContent('<p style="text-align:center;color:#6A5A4A;padding:40px;">No content available for this book yet.</p>')
      }
    } catch {
      setBookContent('<p style="text-align:center;color:#6A5A4A;padding:40px;">No content available for this book yet.</p>')
    } finally {
      setContentLoading(false)
    }
  }

  // Download PDF
  const handleDownload = async (e: React.MouseEvent, bookId: string, bookName: string) => {
    e.stopPropagation()
    if (!token) {
      toast.error('Please login to download')
      navigate('/login')
      return
    }
    if (!hasDownloadAccess) {
      toast.error('Subscribe to download books')
      navigate('/pricing')
      return
    }

    setDownloadingId(bookId)
    try {
      const response = await downloadBook(bookId)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${bookName}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Download started')
    } catch (err: any) {
      if (err?.response?.status === 403) {
        toast.error('Subscribe to download books')
      } else if (err?.response?.status === 404) {
        toast.error('PDF not available for this book')
      } else {
        toast.error('Download failed')
      }
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <main className="min-h-screen font-sans text-[#4A3B32]">
      <PageSEO
        title="Sasanam Books – Ancient Inscription Archive"
        description="Browse and download Sasanam's curated collection of ancient inscription books."
        path="/sasanam"
      />

      {/* ── Book Viewer Modal ── */}
      {viewingBook && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-4 pb-4 px-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => { setViewingBook(null); setBookContent(null) }} />
          <div className="relative bg-[#fdfaf2] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2c9a0]/50 bg-[#f4ecd8]/50 shrink-0">
              <div className="min-w-0 flex-1 mr-4">
                <h2 className="text-lg font-bold text-[#4A3B32] truncate">{viewingBook.bookName}</h2>
                <p className="text-xs text-[#6A5A4A]">by {viewingBook.authorName}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* Download icon in modal */}
                {viewingBook.pdfFile && (
                  hasDownloadAccess ? (
                    <button
                      onClick={(e) => handleDownload(e, viewingBook._id, viewingBook.bookName)}
                      disabled={downloadingId === viewingBook._id}
                      className="p-2 rounded-lg bg-[#8B4513] text-white hover:bg-[#a0522d] transition-all"
                      title="Download PDF"
                    >
                      {downloadingId === viewingBook._id ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => { toast.error('Subscribe to download'); navigate('/pricing') }}
                      className="p-2 rounded-lg bg-gray-200 text-gray-400 hover:bg-gray-300 transition-all"
                      title="Subscribe to download"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </button>
                  )
                )}
                {/* Close button */}
                <button
                  onClick={() => { setViewingBook(null); setBookContent(null) }}
                  className="p-2 rounded-lg text-[#6A5A4A] hover:bg-[#8B4513]/10 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Modal content */}
            <div className="flex-1 overflow-y-auto p-6">
              {contentLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="h-8 w-8 border-3 border-[#8B4513] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : bookContent ? (
                <div
                  className="prose prose-stone max-w-none text-[#4A3B32] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: bookContent }}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#8B4513] mb-3 px-3 py-1.5 rounded-full bg-[#8B4513]/10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Digital Library
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#4A3B32] mb-4">
            Sasanam <span className="text-[#8B4513]">Books</span>
          </h1>
          <p className="text-base text-[#6A5A4A] max-w-xl mx-auto">
            Browse our collection of ancient inscription books. {hasDownloadAccess ? 'You have full download access.' : 'Subscribe to unlock downloads.'}
          </p>

          {/* Status badge */}
          <div className="mt-4">
            {token ? (
              hasDownloadAccess ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Full Access
                </span>
              ) : (
                <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#8B4513] text-white hover:-translate-y-0.5 hover:shadow-lg transition-all">
                  Subscribe to Download
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              )
            ) : (
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => navigate('/login')} className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/5 transition-all">Login</button>
                <button onClick={() => navigate('/signup')} className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#8B4513] text-white hover:-translate-y-0.5 hover:shadow-lg transition-all">Sign Up</button>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#F5F5DC]/60 border border-[#e2c9a0]/40 rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-[#e2c9a0]/40 mb-4" />
                <div className="w-3/4 h-4 rounded bg-[#e2c9a0]/40 mb-2" />
                <div className="w-1/2 h-3 rounded bg-[#e2c9a0]/30 mb-4" />
                <div className="w-full h-10 rounded-xl bg-[#e2c9a0]/30" />
              </div>
            ))}
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && allBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allBooks.map((book: any) => {
              const hasPdf = !!book.pdfFile
              return (
                <div
                  key={book._id}
                  className="group relative bg-[#F5F5DC]/80 border border-[#e2c9a0] rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(61,37,22,0.13)] overflow-hidden"
                >
                  {/* Card body — clickable to view */}
                  <button
                    onClick={() => handleView(book)}
                    className="text-left p-5 pb-3 flex-1 flex flex-col cursor-pointer"
                  >
                    {/* Top row: icon + download badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#8B4513]/10 shrink-0">
                        <svg className="w-6 h-6 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      {hasPdf && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B4513]/10 text-[#8B4513]">
                          PDF
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-[#4A3B32] mb-1 line-clamp-2 group-hover:text-[#8B4513] transition-colors leading-snug">{book.bookName}</h3>
                    <p className="text-[11px] text-[#6A5A4A] mb-1">by <span className="font-semibold">{book.authorName}</span></p>
                    {book.description && <p className="text-[11px] text-[#6A5A4A]/60 line-clamp-2 mt-1">{book.description}</p>}

                    {/* View hint */}
                    <span className="mt-auto pt-3 text-[11px] font-bold text-[#8B4513]/60 group-hover:text-[#8B4513] flex items-center gap-1 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Book
                    </span>
                  </button>

                  {/* Footer: Download action */}
                  {hasPdf && (
                    <div className="px-5 py-3 border-t border-[#e2c9a0]/40 bg-[#f4ecd8]/30 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-[#6A5A4A]">{book.pdfFile}</span>
                      {hasDownloadAccess ? (
                        <button
                          onClick={(e) => handleDownload(e, book._id, book.bookName)}
                          disabled={downloadingId === book._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B4513] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#a0522d] active:scale-95 disabled:opacity-50 transition-all"
                          title="Download PDF"
                        >
                          {downloadingId === book._id ? (
                            <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
                            </svg>
                          )}
                          Download
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); token ? navigate('/pricing') : navigate('/login') }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-300 transition-all"
                          title={token ? 'Subscribe to download' : 'Login to download'}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Locked
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && allBooks.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B4513]/10 text-[#8B4513]">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-base font-semibold text-[#4A3B32]">No books available yet</p>
            <p className="text-sm text-[#6A5A4A] mt-1">Books will appear here once added.</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default Sasanam
