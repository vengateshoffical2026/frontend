const Home = () => {
  return (
    <main
      className="min-h-screen bg-[#FAF9F6]  font-sans selection:bg-[#8B4513]/30 selection:text-[#8B4513]"
      
    >
      <div className="min-h-screen bg-[#FFFFFF]/70 backdrop-blur-[2px]">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 sm:px-6 lg:px-8">
          

          {/* ── Main CSS Grid layout ── */}
          <section className="mt-8 mb-20 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 lg:items-start">
            
            {/* ══ LEFT COLUMN (Takes 7/12 cols on large screens) ════════════ */}
            <div className="flex flex-col gap-8 lg:col-span-7 xl:col-span-8">
              
              {/* Hero card */}
              <div className="group relative overflow-hidden rounded-3xl bg-[#F5F5DC]/80 p-8 shadow-[0_8px_32px_rgba(61,37,22,0.15)] backdrop-blur-md border border-white/20 sm:p-12 transition-all hover:bg-[#F5F5DC]/90">
                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
                  
                  {/* Text side */}
                  <div className="flex flex-col lg:flex-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#4A3B32] sm:text-5xl xl:text-6xl">
                      Unearth the Secrets<br />
                      of the <span className="text-[#8B4513]">Past</span>
                    </h1>
                    <p className="mt-6 text-lg font-medium text-[#6A5A4A] max-w-lg leading-relaxed">
                      Explore our vast archive of ancient inscriptions and contribute to deciphering history through a beautifully curated modern lens.
                    </p>
                    
                    <button
                      type="button"
                      className="mt-10 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#8B4513] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#256a5e] hover:shadow-xl"
                    >
                      Explore the Archive
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>

                  {/* Image side */}
                  <div className="h-64 overflow-hidden rounded-2xl border border-white/30 lg:h-80 w-full lg:w-[40%] flex-shrink-0">
                    <img
                      src="/acientBooks.png"
                      alt="Ancient inscription"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Latest Contributions bar */}
              <article className="rounded-3xl bg-[#F5F5DC]/70 p-6 shadow-[0_4px_20px_rgba(61,37,22,0.1)] backdrop-blur-md border border-white/20 sm:p-8">
                <div className="flex items-center justify-between mb-6 border-b border-[#c8bba6]/50 pb-4">
                  <h3 className="text-xl font-bold text-[#4A3B32]">Latest Contributions</h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B4513] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B4513]"></span>
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  
                  {/* Contributor 1 */}
                  <div className="group flex items-start gap-4 rounded-2xl bg-white/20 p-4 transition-colors hover:bg-white/30 border border-white/20">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#b8a88a]/50 text-[#4A3B32] ring-1 ring-[#8a7f6a]/30">
                      👤
                    </div>
                    <p className="text-sm font-medium text-[#6A5A4A] leading-tight">
                      <span className="font-bold text-[#301a1a] block mb-1">Ravi M.</span>
                      Transcribed a Pallava Script from the 8th Century
                    </p>
                  </div>

                  {/* Contributor 2 */}
                  <div className="group flex items-start gap-4 rounded-2xl bg-white/20 p-4 transition-colors hover:bg-white/30 border border-white/20">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#b8a88a]/50 text-[#4A3B32] ring-1 ring-[#8a7f6a]/30">
                      👤
                    </div>
                    <p className="text-sm font-medium text-[#6A5A4A] leading-tight">
                      <span className="font-bold text-[#301a1a] block mb-1">Anita D.</span>
                      Identified a new structural symbol
                    </p>
                  </div>

                  {/* Contributor 3 */}
                  <div className="group flex items-start sm:col-span-2 xl:col-span-1 gap-4 rounded-2xl bg-white/20 p-4 transition-colors hover:bg-white/30 border border-white/20">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#b8a88a]/50 text-[#4A3B32] ring-1 ring-[#8a7f6a]/30">
                      👤
                    </div>
                    <p className="text-sm font-medium text-[#6A5A4A] leading-tight">
                      <span className="font-bold text-[#301a1a] block mb-1">Project 'Chola'</span>
                      Reached 50% translation completion
                    </p>
                  </div>

                </div>
              </article>
            </div>

            {/* ══ RIGHT COLUMN (Takes 5/12 cols on large screens) ════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-5 xl:col-span-4 gap-6 relative">
              
              {/* Featured Inscription */}
              <article className="group cursor-pointer rounded-3xl bg-[#F5F5DC]/70 p-6 shadow-[0_4px_20px_rgba(61,37,22,0.1)] backdrop-blur-md border border-white/20 transition-all hover:bg-[#F5F5DC]/90 hover:-translate-y-1 hover:border-white/40 sm:col-span-2 lg:col-span-1">
                <h2 className="text-xs font-black tracking-widest text-[#8B4513] uppercase mb-4">Featured Inscription</h2>
                <div className="flex gap-5 items-center">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-white/30">
                    <img src="/acientBooks.png" alt="Feature" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold leading-snug text-[#4A3B32] line-clamp-2">Copper Plate Grant of King Rajaraja Chola I</h3>
                    <p className="mt-1 text-sm text-[#6A5A4A] font-medium">Discover the intricate details and history.</p>
                  </div>
                </div>
              </article>

              {/* Decipher Tools */}
              <article className="group cursor-pointer rounded-3xl bg-[#F5F5DC]/70 p-6 shadow-[0_4px_20px_rgba(61,37,22,0.1)] backdrop-blur-md border border-white/20 transition-all hover:bg-[#F5F5DC]/90 hover:-translate-y-1 hover:border-white/40">
                <h2 className="text-xs font-black tracking-widest text-[#8B4513] uppercase mb-4">Decipher Tools</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/40 shadow-inner">
                    <img src='Search.png' alt="Search" className='w-8 h-8 opacity-80' />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold leading-snug text-[#4A3B32]">Advanced Symbol Matching</h3>
                    <p className="mt-1 text-sm text-[#6A5A4A] font-medium">Utilize tools to cross-reference ancient texts.</p>
                  </div>
                </div>
              </article>

              {/* Community Projects */}
              <article className="group cursor-pointer rounded-3xl bg-[#F5F5DC]/70 p-6 shadow-[0_4px_20px_rgba(61,37,22,0.1)] backdrop-blur-md border border-white/20 transition-all hover:bg-[#F5F5DC]/90 hover:-translate-y-1 hover:border-white/40">
                <h2 className="text-xs font-black tracking-widest text-[#8B4513] uppercase mb-4">Community Projects</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/40 shadow-inner">
                    <img src='Search.png' alt="Community" className='w-8 h-8 opacity-80' />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold leading-snug text-[#4A3B32]">Join Collaborative Efforts</h3>
                    <p className="mt-1 text-sm text-[#6A5A4A] font-medium">Work with historians worldwide to transcribe.</p>
                  </div>
                </div>
              </article>

            </div>
          </section>

          
        
        </div>
      </div>
    </main>
  )
}

export default Home