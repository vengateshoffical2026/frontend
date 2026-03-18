import Header from '../components/Header'

const Home = () => {
  return (
    <main
      className="min-h-screen bg-[#e4d3be] bg-cover bg-center"
      style={{ backgroundImage: 'url(/homebg.png)' }}
    >
      <div className="min-h-screen bg-[#f1e4d7]/75">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 pb-0 pt-2 sm:px-6 lg:px-7">
          <div className='p-5'>
          <Header />
          </div>
          {/* ── Main grid: left 60% / right 40% ── */}
          <section className="mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-center sm:gap-8">

            {/* ══ LEFT COLUMN ══════════════════════════════════════════════ */}
            <div className="flex flex-col gap-6 lg:w-1/2">

              {/* Hero card */}
              <div className="rounded-2xl bg-[#d5ceb9]/95 p-8 shadow-[0_8px_26px_rgba(61,37,22,0.18)] sm:p-10 sm:max-w-[50vw]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">

                  {/* Text side */}
                  <div className="flex flex-col justify-between sm:flex-1">
                    <div>
                      <h1 className="text-2xl font-bold leading-tight text-[#4f1f1f] sm:text-3xl lg:text-4xl">
                        Unearth the Secrets<br />of the Past
                      </h1>
                      <p className="mt-3 text-sm font-semibold leading-snug text-[#4f1f1f] sm:text-base lg:text-lg">
                        Explore our vast archive of ancient inscriptions and
                        contribute to deciphering history
                      </p>
                    </div>
                    <button
                      type="button"
                      className="mt-6 rounded-lg bg-[#2e8578] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#256a5e] sm:mt-8 sm:w-fit sm:py-3 sm:text-base"
                    >
                      Explore the Archive
                    </button>
                  </div>

                  {/* Image side */}
                  <div className="h-35 overflow-hidden rounded-xl sm:h-auto sm:w-[38%] lg:w-[36%]">
                    <img
                      src="/acientBooks.png"
                      alt="Ancient inscription"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Latest Contributions bar */}
              <article className="rounded-2xl bg-[#d5ceb9]/95 px-4 py-4 shadow-[0_8px_24px_rgba(61,37,22,0.14)] sm:px-8 sm:py-7 sm:max-w-[50vw]">
                <h3 className="text-base font-bold text-[#4f1f1f] sm:text-lg lg:text-xl">
                  Latest Contributions
                </h3>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">

                  {/* Contributor 1 */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#b8a88a] text-base">
                      👤
                    </div>
                    <p className="text-xs leading-tight text-[#4d2a2a] sm:text-sm">
                      <span className="font-semibold">Ravi M.</span> transcribed
                      <br className="hidden sm:block" /> a Pallava Script
                    </p>
                  </div>

                  <span className="hidden h-8 w-px self-center bg-[#9f8d79] sm:block" />

                  {/* Contributor 2 */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#b8a88a] text-base">
                      👤
                    </div>
                    <p className="text-xs leading-tight text-[#4d2a2a] sm:text-sm">
                      <span className="font-semibold">Anita D.</span> identified
                      <br className="hidden sm:block" /> a new symbol
                    </p>
                  </div>

                  <span className="hidden h-8 w-px self-center bg-[#9f8d79] sm:block" />

                  {/* Contributor 3 */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#b8a88a] text-base">
                      👤
                    </div>
                    <p className="text-xs leading-tight text-[#4d2a2a] sm:text-sm">
                      <span className="font-semibold">Project &apos;Chola Temples&apos;</span>
                      <br className="hidden sm:block" /> reached 50% Completion
                    </p>
                  </div>

                </div>
              </article>
            </div>

            {/* ══ RIGHT COLUMN ═════════════════════════════════════════════ */}
            <div className="flex flex-col gap-6 lg:w-[38%]">

              {/* Featured Inscription */}
              <article className="rounded-2xl bg-[#d5ceb9]/95 p-4 shadow-[0_8px_24px_rgba(61,37,22,0.16)] sm:p-7 sm:max-w-[30vw]">
                <h2 className="text-base font-bold text-[#4f1f1f] sm:text-lg lg:text-xl">
                  Features Inscription
                </h2>
                <div className="mt-3 flex gap-3">
                  <img
                    src="/acientBooks.png"
                    alt="Feature"
                    className="h-16 w-16 flex-shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                  />
                  <p className="text-md leading-snug text-[#5c2a2a] sm:text-lg font-semibold">
                    Copper Plate Grant of King Rajaraja Chola I Discover The Details
                  </p>
                </div>
              </article>

              {/* Decipher Tools */}
              <article className="rounded-2xl bg-[#d5ceb9]/95 p-4 shadow-[0_8px_24px_rgba(61,37,22,0.16)] sm:p-7 sm:max-w-[30vw]">
                <h2 className="text-base font-bold text-[#4f1f1f] sm:text-lg lg:text-xl">
                  Decipher Tools
                </h2>
                <div className="mt-3 flex gap-3">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-[#ece4d4] text-2xl sm:h-20 sm:w-20">
                    <img
                    src='Search.png'
                    className='w-full h-full'
                    />
                  </div>
                  <p className="text-md leading-snug text-[#5c2a2a] sm:text-lg font-semibold">
                    Copper Plate Grant of King Rajaraja Chola I Discover The Details
                  </p>
                </div>
              </article>

              {/* Community Projects */}
              <article className="rounded-2xl bg-[#d5ceb9]/95 p-4 shadow-[0_8px_24px_rgba(61,37,22,0.16)] sm:p-7 sm:max-w-[30vw]">
                <h2 className="text-base font-bold text-[#4f1f1f] sm:text-lg lg:text-xl">
                  Community Projects
                </h2>
                <div className="mt-3 flex gap-3">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-[#ece4d4] text-2xl sm:h-20 sm:w-20">
                    <img
                    src='Search.png'
                    className='w-full h-full'
                    />
                  </div>
                  <p className="text-md leading-snug text-[#5c2a2a] sm:text-lg font-semibold">
                    Join Collaborative efforts to transcribe
                  </p>
                </div>
              </article>

            </div>
          </section>

        </div>
        <footer className="mt-4 rounded-t-xl bg-[#cfb793]/95 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-[#4f1f1f] sm:gap-x-8 sm:text-sm lg:gap-x-12 lg:text-base">
              <span className="cursor-pointer hover:underline">Contact Us</span>
              <span className="cursor-pointer hover:underline">Terms of service</span>
              <span className="cursor-pointer hover:underline">Privacy &amp; Policy</span>
              <span className="cursor-pointer hover:underline">About</span>
            </div>
          </footer>
      </div>
    </main>
  )
}

export default Home