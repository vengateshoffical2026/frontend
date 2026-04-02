import { useState } from 'react'
import { useGetAllBooks, useDownloadStatus } from '../api/hooks/journalQuery'
import { downloadBook } from '../api/controllers/journal'
import { toast } from 'react-toastify'
import PageSEO from '../components/PageSEO'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

const Sasanam = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const token = localStorage.getItem('token')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const { data: books, isLoading } = useGetAllBooks()
  const { data: dlStatus } = useDownloadStatus()
  const allBooks: any[] = books || []

  const unlimitedAccess = dlStatus?.unlimitedAccess ?? false
  const remaining = dlStatus?.remaining ?? 4
  const freeLimit = dlStatus?.freeLimit ?? 4
  const downloadCount = dlStatus?.downloadCount ?? 0
  const canDownloadNow = unlimitedAccess || remaining > 0

  // Download PDF
  const handleDownload = async (e: React.MouseEvent, bookId: string, bookName: string) => {
    e.stopPropagation()
    if (!token) {
      toast.error('Please login to download')
      navigate('/login')
      return
    }
    if (!canDownloadNow) {
      toast.error('You have used all free downloads. Subscribe for more!')
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
      // Refresh download status
      queryClient.invalidateQueries({ queryKey: ['downloadStatus'] })
    } catch (err: any) {
      if (err?.response?.data?.error === 'free_limit_reached') {
        toast.error('Free download limit reached. Subscribe for unlimited downloads!')
        queryClient.invalidateQueries({ queryKey: ['downloadStatus'] })
        navigate('/pricing')
      } else if (err?.response?.status === 403) {
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


      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary mb-3 px-3 py-1.5 rounded-full bg-primary/10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Digital Library
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#4A3B32] mb-4">
            Sasanam <span className="text-primary">Books</span>
          </h1>
          <p className="text-base text-[#6A5A4A] max-w-xl mx-auto">
            Browse our collection of ancient inscription books.
            {token && unlimitedAccess && ' You have unlimited download access.'}
            {token && !unlimitedAccess && ` ${remaining} of ${freeLimit} free downloads remaining.`}
            {!token && ' Login to start downloading.'}
          </p>

          {/* Status badge */}
          <div className="mt-4 flex flex-col items-center gap-2">
            {token ? (
              unlimitedAccess ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Subscribed – Unlimited Downloads
                </span>
              ) : (
                <>
                  {/* Download counter bar */}
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#f4ecd8] border border-[#e2c9a0]">
                    <div className="flex gap-1">
                      {Array.from({ length: freeLimit }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full transition-colors ${i < downloadCount ? 'bg-primary' : 'bg-primary/15'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#6A5A4A]">
                      {remaining > 0 ? `${remaining} free left` : 'No free downloads left'}
                    </span>
                  </div>
                  {remaining === 0 ? (
                    <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-primary text-white hover:-translate-y-0.5 hover:shadow-lg transition-all">
                      Subscribe to Download More
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  ) : (
                    <button onClick={() => navigate('/pricing')} className="text-[11px] font-semibold text-primary hover:underline">
                      Want unlimited? Subscribe now
                    </button>
                  )}
                </>
              )
            ) : (
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => navigate('/login')} className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-all">Login</button>
                <button onClick={() => navigate('/signup')} className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-primary text-white hover:-translate-y-0.5 hover:shadow-lg transition-all">Sign Up</button>
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
                    onClick={() => book.pdfFile ? navigate(`/view/${book._id}`, { state: { bookName: book.bookName, authorName: book.authorName } }) : null}
                    className="text-left p-5 pb-3 flex-1 flex flex-col cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0">
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      {hasPdf && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          PDF
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-[#4A3B32] mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-snug">{book.bookName}</h3>
                    <p className="text-[11px] text-[#6A5A4A] mb-1">by <span className="font-semibold">{book.authorName}</span></p>
                    {book.description && <p className="text-[11px] text-[#6A5A4A]/60 line-clamp-2 mt-1">{book.description}</p>}

                    <span className="mt-auto pt-3 text-[11px] font-bold text-primary/60 group-hover:text-primary flex items-center gap-1 transition-colors">
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
                      {token ? (
                        canDownloadNow ? (
                          <button
                            onClick={(e) => handleDownload(e, book._id, book.bookName)}
                            disabled={downloadingId === book._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-wider hover:bg-primary-light active:scale-95 disabled:opacity-50 transition-all"
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
                            onClick={(e) => { e.stopPropagation(); navigate('/pricing') }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider hover:bg-amber-200 transition-all"
                            title="Subscribe to download more"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Subscribe
                          </button>
                        )
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate('/login') }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-300 transition-all"
                          title="Login to download"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Login
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
