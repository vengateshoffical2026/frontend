import Header from '../components/Header'

const Library = () => {
  return (
    <main className="min-h-screen bg-[#e4d3be] bg-cover bg-center" style={{ backgroundImage: 'url(/homebg.png)' }}>
      <div className="min-h-screen bg-[#f1e4d7]/75">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 pb-0 pt-2 sm:px-6 lg:px-7">
          <div className="p-5">
            <Header />
          </div>
          <section className="mt-8 flex flex-col items-center justify-center flex-1">
            <div className="rounded-2xl bg-[#d5ceb9]/95 p-8 shadow-lg text-center max-w-md">
              <h1 className="text-4xl font-bold text-[#4f1f1f] mb-4">Library</h1>
              <p className="text-lg text-[#5c2a2a]">Coming Soon...</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Library
