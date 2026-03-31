
import { useAddBook, useGetAllSections, useGetBooksBySectionId } from "../api/hooks/journalQuery";
import SasanamBooks from "../components/SasanamBooks";
import SasanamSections from "../components/SasanamSections";
import { useMemo, useState } from "react";

/* ─── Decorative SVG ornaments ──────────────────────────────────────── */
const OrnamentDivider = () => (
  <svg viewBox="0 0 200 16" className="w-32 h-4 text-[#c9a87a] opacity-60" fill="none">
    <line x1="0" y1="8" x2="72" y2="8" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="84" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
    <circle cx="116" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
    <line x1="128" y1="8" x2="200" y2="8" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const CornerGlyph = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={`w-10 h-10 text-[#c9a87a] opacity-25 ${className}`} fill="none">
    <path d="M2 2 L2 18 M2 2 L18 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 10 L10 6 L14 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <circle cx="6" cy="6" r="1.5" fill="currentColor" />
  </svg>
);

const ParchmentTexture = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ─── Skeleton loader cards ──────────────────────────────────────────── */
const SectionSkeletons = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="relative bg-[#fdf8f0] border border-[#e2c9a0]/70 rounded-2xl p-7 flex flex-col items-center gap-3 overflow-hidden"
        style={{ animationDelay: `${i * 80}ms` }}
      >
        <div className="w-14 h-14 rounded-full bg-[#e8d9c4]/60 animate-pulse" />
        <div className="w-3/4 h-4 rounded-full bg-[#e8d9c4]/60 animate-pulse" />
        <div className="w-1/2 h-3 rounded-full bg-[#e8d9c4]/40 animate-pulse" />
        {/* shimmer sweep */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    ))}
  </div>
);

/* ─── Empty state ────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="relative rounded-3xl bg-[#fdf8f0] p-14 shadow-[0_8px_40px_rgba(61,37,22,0.1)] border border-[#e2c9a0] text-center max-w-sm w-full overflow-hidden">
    <ParchmentTexture />
    <CornerGlyph className="absolute top-3 left-3" />
    <CornerGlyph className="absolute top-3 right-3 rotate-90" />
    <CornerGlyph className="absolute bottom-3 left-3 -rotate-90" />
    <CornerGlyph className="absolute bottom-3 right-3 rotate-180" />
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0e6d3] text-[#b8956a] ring-1 ring-[#e2c9a0] shadow-inner">
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </div>
    <p className="text-base font-semibold text-[#5a4535] leading-relaxed">
      No sections found.<br />
      <span className="text-[#a07850] font-normal text-sm italic">Inscriptions arriving soon…</span>
    </p>
    <div className="mt-5 flex justify-center">
      <OrnamentDivider />
    </div>
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────── */
const Journal = () => {
  const [step, setStep] = useState("sections");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const { data: sectionsData, isLoading: sectionLoading, error } = useGetAllSections();
  const { data: booksData, isLoading: booksLoading } = useGetBooksBySectionId(selectedSectionId ?? "");
  const {mutateAsync: addBook} = useAddBook();
  const [response, setResponse] = useState<any>(null);
  const reversedSections = useMemo(() => {
    if (Array.isArray(sectionsData)) return [...sectionsData].reverse();
    return [];
  }, [sectionsData]);

  return (
    <main className="relative min-h-screen bg-[#F7F3EC] font-sans text-[#4A3B32] flex flex-col overflow-x-hidden">
     <iframe src="/HS 01.pdf" width="100%" height="600px"></iframe>
      {/* ── Background atmosphere ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* soft radial warm glow top-center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#e8d3b0]/30 rounded-full blur-[120px]" />
        {/* subtle bottom-left shadow mass */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c9a87a]/10 rounded-full blur-[100px]" />
        {/* noise texture overlay */}
        <ParchmentTexture />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
        <section className="mt-4 flex flex-col items-center flex-1 pb-20 w-full">

          {/* ── Header row ── */}
          <div className="flex items-center w-full mt-6 mb-1 relative">
            {/* Back button — only visible when not on sections */}
            <div className="w-24 flex-shrink-0">
              {step !== "sections" && (
                <button
                  type="button"
                  onClick={() => setStep("sections")}
                  className="group flex items-center gap-1.5 text-[#8C6A4A] hover:text-[#4A3B32] transition-colors duration-200 focus:outline-none"
                  aria-label="Back"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f0e6d3] group-hover:bg-[#e2ceb0] transition-colors duration-200 shadow-sm border border-[#e2c9a0]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold tracking-wide">Back</span>
                </button>
              )}
            </div>

            {/* Centered title block */}
            <div className="flex-1 flex flex-col items-center gap-2">
              {/* script-style decorative top line */}
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a87a]/60" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#a07850] font-medium">
                  {step === "sections" ? "Browse Archive" : "Section Contents"}
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a87a]/60" />
              </div>

              <h1
                className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#3D2516] leading-none"
                style={{ fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif", letterSpacing: "-0.01em" }}
              >
                Journal
              </h1>

              <OrnamentDivider />
            </div>

            {/* Right spacer to keep title centered */}
            <div className="w-24 flex-shrink-0" />
          </div>

          {/* ── Breadcrumb trail ── */}
          {step !== "sections" && (
            <div className="flex items-center gap-2 text-xs text-[#a07850] mb-4 mt-1 self-start ml-1">
              <span
                className="hover:text-[#4A3B32] cursor-pointer transition-colors underline-offset-2 hover:underline"
                onClick={() => setStep("sections")}
              >
                Sections
              </span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[#6b4f36] font-medium">Books</span>
            </div>
          )}

          {/* ── Sections step ── */}
          {step === "sections" && (
            <div className="mt-4 w-full flex flex-col items-center">
              {sectionLoading ? (
                <SectionSkeletons />
              ) : reversedSections.length > 0 ? (
                <SasanamSections
                  data={reversedSections}
                  onChangeSection={(id: any) => {
                    setSelectedSectionId(id);
                    setStep("books");
                  }}
                />
              ) : !error ? (
                <EmptyState />
              ) : null}
            </div>
          )}

          {/* ── Books step ── */}
          {step === "books" && (
            <div className="w-full mt-4">
              {booksLoading ? (
                <SectionSkeletons/>
              ) : booksData && booksData.length > 0 ? (
                 <SasanamBooks data={booksData || []}/>
              ) : (
                <div className="flex flex-col items-center mt-12 gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0e6d3] text-[#b8956a] border border-[#e2c9a0]">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-[#5a4535]">No books found in this section.</p>
                  <OrnamentDivider />
                </div>
              )}
            </div>
          )}

        </section>
      </div>
      {/* ── shimmer keyframe (injected globally) ── */}
      <style>{`
        @keyframes shimmer { to { transform: translateX(200%); } }
      `}</style>
    </main>
  );
};

export default Journal;