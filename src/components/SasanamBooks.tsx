import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { downloadBook } from "../api/controllers/journal";
import { useDownloadStatus } from "../api/hooks/journalQuery";
import apiClient from "../api/interceptors/axiosInstance";

interface SasanamBookData {
  _id: string;
  bookName: string;
  authorName: string;
  sectionId: string;
  pdfFile?: string;
  description?: string;
  __v: number;
}

interface SasanamBooksProps {
  data: SasanamBookData[];
  loading?: boolean;
}

const SasanamBooks: React.FC<SasanamBooksProps> = ({ data }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [viewingBook, setViewingBook] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"pdf" | "html" | "none">("none");
  const [bookContent, setBookContent] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [contentLoading, setContentLoading] = useState(false);

  const { data: dlStatus } = useDownloadStatus();
  const unlimitedAccess = dlStatus?.unlimitedAccess ?? false;
  const remaining = dlStatus?.remaining ?? 4;
  const freeLimit = dlStatus?.freeLimit ?? 4;
  const downloadCount = dlStatus?.downloadCount ?? 0;
  const canDownloadNow = unlimitedAccess || remaining > 0;

  const handleView = async (book: any) => {
    setViewingBook(book);
    setBookContent(null);
    setPdfUrl(null);
    setViewMode("none");
    setContentLoading(true);

    // Try HTML content first
    try {
      const res = await apiClient.get(`/sasanam-book-details/${book._id}`);
      const details = res.data?.data;
      if (details && details.bookDetails) {
        setBookContent(details.bookDetails);
        setViewMode("html");
        setContentLoading(false);
        return;
      }
    } catch {
      // no HTML content
    }

    // Fallback: show PDF if available
    if (book.pdfFile) {
      try {
        const res = await apiClient.get(`/sasanam-books/${book._id}/view`, {
          responseType: "blob",
        });
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setViewMode("pdf");
      } catch {
        setViewMode("none");
      }
    }

    setContentLoading(false);
  };

  const closeViewer = () => {
    setViewingBook(null);
    setBookContent(null);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setViewMode("none");
  };

  const handleDownload = async (e: React.MouseEvent, bookId: string, bookName: string) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Please login to download");
      navigate("/login");
      return;
    }
    if (!canDownloadNow) {
      toast.error("Free download limit reached. Subscribe for more!");
      navigate("/pricing");
      return;
    }

    setDownloadingId(bookId);
    try {
      const response = await downloadBook(bookId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${bookName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
      queryClient.invalidateQueries({ queryKey: ["downloadStatus"] });
    } catch (err: any) {
      if (err?.response?.data?.error === "free_limit_reached") {
        toast.error("Free download limit reached. Subscribe for unlimited!");
        queryClient.invalidateQueries({ queryKey: ["downloadStatus"] });
        navigate("/pricing");
      } else if (err?.response?.status === 404) {
        toast.error("PDF not available");
      } else {
        toast.error("Download failed");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Download status bar */}
      {token && !unlimitedAccess && (
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#fdf8f0] border border-[#e2c9a0] shadow-sm">
            <div className="flex gap-1.5">
              {Array.from({ length: freeLimit }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${i < downloadCount ? "bg-[#8B4513]" : "bg-[#8B4513]/15"}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#4A3B32]">
              {remaining > 0
                ? `${remaining} free download${remaining !== 1 ? "s" : ""} left`
                : "No free downloads left"}
            </span>
            {remaining === 0 && (
              <button
                onClick={() => navigate("/pricing")}
                className="ml-1 text-xs font-bold text-white bg-[#8B4513] px-3 py-1 rounded-full hover:bg-[#a0522d] transition-colors"
              >
                Subscribe
              </button>
            )}
          </div>
        </div>
      )}

      {/* Book Viewer Modal — true fullscreen */}
      {viewingBook && (
        <div className="fixed inset-0 z-[9999] bg-[#1a1a1a] flex flex-col">
          {/* Compact header bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#2a2218] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={closeViewer}
                className="p-2 rounded-lg text-[#e2c9a0] hover:bg-white/10 transition-all shrink-0"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-[#fdfaf2] truncate">{viewingBook.bookName}</h2>
                <p className="text-[11px] text-[#c9a87a]">by {viewingBook.authorName}</p>
              </div>
            </div>
          </div>

          {/* Content area — fills entire remaining screen */}
          <div className="flex-1 overflow-hidden">
            {contentLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="h-10 w-10 border-3 border-[#c9a87a] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#c9a87a]">Loading document...</p>
              </div>
            ) : viewMode === "pdf" && pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={viewingBook.bookName}
              />
              ) : viewMode === "html" && bookContent ? (
                <div className="overflow-y-auto h-full bg-[#fdfaf2]">
                  <div className="max-w-4xl mx-auto p-6 sm:p-10">
                    <div
                      className="prose prose-stone max-w-none text-[#4A3B32] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: bookContent }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#c9a87a]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-[#fdfaf2]">No content available yet</p>
                  <p className="text-sm text-[#c9a87a]">This book's content will be available soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Books Grid — big cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((book) => {
          const hasPdf = !!book.pdfFile;
          return (
            <div
              key={book._id}
              className="group relative bg-[#fdf8f0] border border-[#e2c9a0]/80 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(61,37,22,0.13)] hover:border-[#c9a87a] flex flex-col"
            >
              {/* Card top — decorative header bar */}
              <div className="h-2 bg-gradient-to-r from-[#8B4513] via-[#a0522d] to-[#c9a87a]" />

              {/* Card body */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Icon + PDF badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B4513]/12 to-[#8B4513]/5 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  {hasPdf && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                      PDF Available
                    </span>
                  )}
                </div>

                {/* Title & author */}
                <h3 className="text-lg font-bold text-[#3D2516] mb-1 line-clamp-2 leading-snug group-hover:text-[#8B4513] transition-colors">
                  {book.bookName}
                </h3>
                <p className="text-sm text-[#8C7055] mb-2">
                  by <span className="font-semibold text-[#6b4f36]">{book.authorName}</span>
                </p>
                {book.description && (
                  <p className="text-sm text-[#8C7055]/70 line-clamp-2 mb-4 leading-relaxed">{book.description}</p>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Action buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-[#e2c9a0]/50">
                  {/* View button */}
                  <button
                    onClick={() => handleView(book)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#8B4513]/20 text-[#8B4513] text-sm font-bold hover:bg-[#8B4513]/5 hover:border-[#8B4513]/40 active:scale-[0.97] transition-all"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>

                  {/* Download button */}
                  {hasPdf && (
                    <>
                      {token ? (
                        canDownloadNow ? (
                          <button
                            onClick={(e) => handleDownload(e, book._id, book.bookName)}
                            disabled={downloadingId === book._id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B4513] text-white text-sm font-bold hover:bg-[#a0522d] active:scale-[0.97] disabled:opacity-50 transition-all"
                          >
                            {downloadingId === book._id ? (
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
                              </svg>
                            )}
                            Download
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate("/pricing")}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-sm font-bold hover:bg-amber-100 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Subscribe
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => navigate("/login")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-500 border border-gray-200 text-sm font-bold hover:bg-gray-100 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Login
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SasanamBooks;
