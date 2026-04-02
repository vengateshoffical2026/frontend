import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useTeamMembers, useAuthors } from '../api/hooks/aboutQuery'
import PageSEO from '../components/PageSEO'

const About = () => {
  const heroReveal = useScrollReveal()
  const teamReveal = useScrollReveal()
  const authorReveal = useScrollReveal()
  const [authorPage, setAuthorPage] = useState(1)

  const { data: teamData, isLoading: isTeamLoading } = useTeamMembers()
  const { data: authorData, isLoading: isAuthorLoading } = useAuthors(authorPage, 12)

  const teamMembers = teamData?.data || []
  const authors = authorData?.data?.authors || []
  const totalAuthors = authorData?.data?.total || 0
  const totalAuthorPages = Math.ceil(totalAuthors / 12)

  const revealClass = (isVisible: boolean) =>
    `reveal-smooth ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`

  const defaultAvatar = (name: string) => {
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary to-[#a78e7e] flex items-center justify-center text-white text-2xl font-black">
        {initials}
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PageSEO
        title="About Sasanam"
        description="Learn about Sasanam, the team behind India's digital archive of ancient inscriptions, and the authors who contributed to preserving South Indian epigraphic heritage."
        path="/about"
      />
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <section
          ref={heroReveal.ref as any}
          className={`pt-16 pb-12 text-center ${revealClass(heroReveal.isVisible)}`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#4A3B32] mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#a78e7e]">Sasanam</span>
          </h1>
          <div className="w-24 h-1 bg-primary/20 rounded-full mx-auto mb-6" />
          <p className="text-base sm:text-lg lg:text-xl text-[#6A5A4A] max-w-3xl mx-auto font-medium leading-relaxed">
            Dedicated to preserving and digitizing historical inscriptions and manuscripts.
            Our team of researchers, technologists, and historians work together to make ancient knowledge accessible to everyone.
          </p>
        </section>

        {/* Team Section */}
        <section
          ref={teamReveal.ref as any}
          className={`py-12 ${revealClass(teamReveal.isVisible)}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3B32] text-center mb-3">Our Leadership</h2>
          <p className="text-sm text-[#6A5A4A] text-center mb-12 font-medium">The people behind Sasanam's mission</p>

          {isTeamLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl bg-[#F5F5DC]/60 p-8 animate-pulse">
                  <div className="w-28 h-28 rounded-full bg-[#EEDDCC] mx-auto mb-4" />
                  <div className="h-5 bg-[#EEDDCC] rounded w-32 mx-auto mb-2" />
                  <div className="h-4 bg-[#EEDDCC] rounded w-20 mx-auto" />
                </div>
              ))}
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12 text-[#a78e7e] font-semibold">
              Team information coming soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member._id}
                  className="group rounded-3xl bg-[#F5F5DC]/80 backdrop-blur-md p-8 shadow-[0_8px_32px_rgba(61,37,22,0.1)] border border-white/30 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(61,37,22,0.15)]"
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden mb-5 ring-4 ring-primary/20 shadow-lg">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      defaultAvatar(member.name)
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#4A3B32] mb-1">{member.name}</h3>
                  <span className="text-sm font-bold text-primary uppercase tracking-wider mb-3">{member.role}</span>
                  {member.bio && (
                    <p className="text-sm text-[#6A5A4A] leading-relaxed mt-2">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Authors Section */}
        <section
          ref={authorReveal.ref as any}
          className={`py-12 pb-20 ${revealClass(authorReveal.isVisible)}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3B32] text-center mb-3">Our Authors</h2>
          <p className="text-sm text-[#6A5A4A] text-center mb-12 font-medium">Contributing scholars and their published works</p>

          {isAuthorLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl bg-[#F5F5DC]/60 p-6 animate-pulse">
                  <div className="w-20 h-20 rounded-full bg-[#EEDDCC] mx-auto mb-3" />
                  <div className="h-4 bg-[#EEDDCC] rounded w-24 mx-auto mb-2" />
                  <div className="h-3 bg-[#EEDDCC] rounded w-32 mx-auto" />
                </div>
              ))}
            </div>
          ) : authors.length === 0 ? (
            <div className="text-center py-12 text-[#a78e7e] font-semibold">
              Author listings coming soon.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {authors.map((author) => (
                  <div
                    key={author._id}
                    className="group rounded-2xl bg-[#FFFFFF]/90 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(61,37,22,0.08)] border border-white/40 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(61,37,22,0.12)]"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 ring-3 ring-primary/15 shadow-md">
                      {author.photo ? (
                        <img src={author.photo} alt={author.name} className="w-full h-full object-cover" />
                      ) : (
                        defaultAvatar(author.name)
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#4A3B32] mb-1">{author.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-xs font-semibold text-primary">{author.bookName}</span>
                    </div>
                  </div>
                ))}
              </div>

              {totalAuthorPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8">
                  <button
                    onClick={() => setAuthorPage((p) => Math.max(1, p - 1))}
                    disabled={authorPage <= 1}
                    className="px-4 py-2 rounded-lg text-sm font-bold text-primary border border-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-semibold text-[#6A5A4A]">
                    Page {authorPage} of {totalAuthorPages}
                  </span>
                  <button
                    onClick={() => setAuthorPage((p) => Math.min(totalAuthorPages, p + 1))}
                    disabled={authorPage >= totalAuthorPages}
                    className="px-4 py-2 rounded-lg text-sm font-bold text-primary border border-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default About
