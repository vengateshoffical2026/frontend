import { useScrollReveal } from "../hooks/useScrollReveal";
import { useDonationList } from "../api/hooks/donationQuery";
import PageSEO from "../components/PageSEO";
import { useNavigate } from "react-router-dom";
import { isBusinessMode } from "../config";

const Home = () => {
  const heroReveal = useScrollReveal();
  const contributionsReveal = useScrollReveal();
  const featuredReveal = useScrollReveal();
  const toolsReveal = useScrollReveal();
  const communityReveal = useScrollReveal();
  const statsReveal = useScrollReveal();
  const navigate = useNavigate();

  const { data: donationData } = useDonationList(1, 20);
   const donors = donationData?.data?.donations ?? [];

  const revealClass = (isVisible: boolean) =>
    `reveal-smooth ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`;

  const statsData = [
    { label: "Inscriptions", value: "10,000+", icon: "📜" },
    { label: "Contributors", value: "500+", icon: "👥" },
    { label: "Languages", value: "12+", icon: "🔤" },
    { label: "Centuries Covered", value: "20+", icon: "🏛️" },
  ];

  return (
    <main className="min-h-screen bg-cream font-sans selection:bg-primary/30 selection:text-primary">
      <PageSEO
        title="Sasanam – India's Digital Archive of Ancient Inscriptions & Epigraphs"
        description="Sasanam is India's premier digital archive of ancient inscriptions, copper plates, stone epigraphs, and historical documents from Tamil Nadu and South India. Explore Pallava, Chola, and Pandya era inscriptions."
        path="/"
      />
      <div className="min-h-screen">
        {/* Donor Infinite Scroller */}
        { donors.length > 0 && (
          <div className="w-full bg-gradient-to-r from-primary via-primary-light to-primary py-3 overflow-hidden border-y border-primary/20 relative z-10">
            <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
              {[...donors, ...donors].map((donor, idx) => (
                <div
                  key={`${donor._id}-${idx}`}
                  className="flex items-center gap-4 mx-8 text-white/90"
                >
                  <div className="h-2 w-2 rounded-full bg-white/40" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    {donor.donaterName}
                  </span>
                  <span className="font-serif font-black text-white px-2.5 py-0.5 rounded-lg bg-white/15">
                    ₹{Math.round(donor.donationAmount / 100)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto flex w-full max-w-[1600px] flex-col px-5 sm:px-6 lg:px-8">

          {/* Main CSS Grid layout */}
          <section className="mt-4 mb-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 lg:items-start">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-8 lg:col-span-7 xl:col-span-8">

              {/* Hero card */}
              <div
                ref={heroReveal.ref as any}
                className={`group relative overflow-hidden rounded-3xl bg-beige/90 p-8 shadow-[0_8px_32px_rgba(61,37,22,0.15)] border border-white/30 sm:p-12 hover:shadow-[0_12px_48px_rgba(61,37,22,0.2)] transition-shadow duration-500 ${revealClass(heroReveal.isVisible)}`}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d4a574]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">

                  {/* Text side */}
                  <div className="flex flex-col lg:flex-1">
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 px-3 py-1.5 rounded-full bg-primary/10 w-fit">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      Digital Archive
                    </span>
                    <h1 className="text-4xl font-serif font-black tracking-tight text-body sm:text-5xl xl:text-6xl leading-[1.1]">
                      Unearth the Secrets<br />
                      of the <span className="text-primary relative">
                        Past
                        <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none">
                          <path d="M0 7 Q25 0 50 5 Q75 2 100 7" stroke="#8B4513" strokeWidth="2" fill="none" opacity="0.3" />
                        </svg>
                      </span>
                    </h1>
                    <p className="mt-6 text-lg font-medium text-muted max-w-lg leading-relaxed">
                      Explore our vast archive of ancient inscriptions and contribute to deciphering history through a beautifully curated modern lens.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-10">
                      <button
                        type="button"
                        onClick={() => navigate('/journal')}
                        className="group/btn inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-1 hover:bg-primary-light hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 active:shadow-md"
                      >
                        Explore the Archive
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/about')}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white/60 border border-primary/20 px-7 py-3.5 text-sm font-bold text-primary transition-all hover:-translate-y-1 hover:bg-white/80 hover:shadow-md active:translate-y-0"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>

                  {/* Image side */}
                  <div className="h-64 overflow-hidden rounded-2xl border border-white/30 lg:h-80 w-full lg:w-[40%] flex-shrink-0 shadow-lg">
                    <img
                      src="/acientBooks.webp"
                      alt="Ancient inscription"
                      loading="eager"
                      fetchPriority="high"
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div
                ref={statsReveal.ref as any}
                className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${revealClass(statsReveal.isVisible)}`}
              >
                {statsData.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="group rounded-2xl bg-beige/70 p-5 text-center shadow-[0_4px_20px_rgba(61,37,22,0.08)] border border-white/20 hover:shadow-[0_8px_30px_rgba(61,37,22,0.12)] hover:-translate-y-1 transition-all duration-300"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="text-2xl mb-2 transition-transform duration-300 group-hover:scale-110">{stat.icon}</div>
                    <p className="text-xl font-black text-body">{stat.value}</p>
                    <p className="text-xs font-bold text-muted/70 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Latest Contributions bar */}
              <article
                ref={contributionsReveal.ref as any}
                className={`rounded-3xl bg-beige/70 p-6 shadow-[0_4px_20px_rgba(61,37,22,0.1)] border border-white/20 sm:p-8 ${revealClass(contributionsReveal.isVisible)}`}
              >
                <div className="flex items-center justify-between mb-6 border-b border-[#c8bba6]/50 pb-4">
                  <h3 className="text-xl font-bold text-body">Latest Contributions</h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    { name: 'Ravi M.', desc: 'Transcribed a Pallava Script from the 8th Century', gradient: 'from-amber-500 to-orange-600' },
                    { name: 'Anita D.', desc: 'Identified a new structural symbol', gradient: 'from-emerald-500 to-teal-600' },
                    { name: "Project 'Chola'", desc: 'Reached 50% translation completion', gradient: 'from-blue-500 to-indigo-600' },
                  ].map((contributor, i) => (
                    <div
                      key={i}
                      className={`group flex items-start gap-4 rounded-2xl bg-white/25 p-4 transition-all duration-300 hover:bg-white/40 hover:-translate-y-0.5 hover:shadow-md border border-white/20 cursor-pointer ${i === 2 ? 'sm:col-span-2 xl:col-span-1' : ''}`}
                    >
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${contributor.gradient} text-white text-sm font-black shadow-md transition-transform duration-300 group-hover:scale-110`}>
                        {contributor.name.charAt(0)}
                      </div>
                      <p className="text-sm font-medium text-muted leading-tight">
                        <span className="font-bold text-[#301a1a] block mb-1">{contributor.name}</span>
                        {contributor.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            {/* RIGHT COLUMN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-5 xl:col-span-4 gap-6 relative">

              {/* Featured Inscription */}
              <article
                ref={featuredReveal.ref as any}
                className={`group cursor-pointer rounded-3xl bg-beige/80 p-6 shadow-[0_4px_20px_rgba(61,37,22,0.1)] border border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(61,37,22,0.15)] hover:-translate-y-1 hover:border-white/40 sm:col-span-2 lg:col-span-1 ${revealClass(featuredReveal.isVisible)}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-1 w-6 rounded-full bg-primary" />
                  <h2 className="text-xs font-black tracking-widest text-primary uppercase">Featured Inscription</h2>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-white/30 shadow-md">
                    <img src="/acientBooks.webp" alt="Feature" loading="lazy" width={80} height={80} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold leading-snug text-body line-clamp-2 group-hover:text-primary transition-colors">Copper Plate Grant of King Rajaraja Chola I</h3>
                    <p className="mt-1.5 text-sm text-muted font-medium">Discover the intricate details and history.</p>
                    <span className="mt-3 text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read more
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                  </div>
                </div>
              </article>

              {/* Decipher Tools */}
              <article
                ref={toolsReveal.ref as any}
                className={`group cursor-pointer rounded-3xl bg-beige/70 p-6 shadow-[0_4px_20px_rgba(61,37,22,0.1)] border border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(61,37,22,0.15)] hover:-translate-y-1 hover:border-white/40 ${revealClass(toolsReveal.isVisible)}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-1 w-6 rounded-full bg-primary" />
                  <h2 className="text-xs font-black tracking-widest text-primary uppercase">Decipher Tools</h2>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
                    <img src='/Search.webp' alt="Search" loading="lazy" width={28} height={28} className='w-7 h-7 opacity-80 transition-transform duration-300 group-hover:scale-110' />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold leading-snug text-body group-hover:text-primary transition-colors">Advanced Symbol Matching</h3>
                    <p className="mt-1 text-sm text-muted font-medium">Utilize tools to cross-reference ancient texts.</p>
                    <span className="mt-3 text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Try now
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                  </div>
                </div>
              </article>

              {/* Community Projects */}
              <article
                ref={communityReveal.ref as any}
                className={`group cursor-pointer rounded-3xl bg-beige/70 p-6 shadow-[0_4px_20px_rgba(61,37,22,0.1)] border border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(61,37,22,0.15)] hover:-translate-y-1 hover:border-white/40 ${revealClass(communityReveal.isVisible)}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-1 w-6 rounded-full bg-primary" />
                  <h2 className="text-xs font-black tracking-widest text-primary uppercase">Community Projects</h2>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
                    <img src='/Search.webp' alt="Community" loading="lazy" width={28} height={28} className='w-7 h-7 opacity-80 transition-transform duration-300 group-hover:scale-110' />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold leading-snug text-body group-hover:text-primary transition-colors">Join Collaborative Efforts</h3>
                    <p className="mt-1 text-sm text-muted font-medium">Work with historians worldwide to transcribe.</p>
                    <span className="mt-3 text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Join now
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                  </div>
                </div>
              </article>

              {/* CTA Card */}
              {isBusinessMode && (
              <article className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 shadow-xl text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <h3 className="text-lg font-bold mb-2">Support Our Mission</h3>
                  <p className="text-sm text-white/80 mb-5 leading-relaxed">Help us preserve and digitize ancient inscriptions for future generations.</p>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-primary shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all"
                  >
                    Contribute Now
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                </div>
              </article>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Home;
