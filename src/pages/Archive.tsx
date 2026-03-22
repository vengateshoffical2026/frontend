const Archive = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F6] font-sans text-[#4A3B32]  flex flex-col" >
      <div className="fixed inset-0 z-0 bg-[#FFFFFF]/70 backdrop-blur-[2px]"></div>
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
        
        <section className="mt-8 flex flex-col items-center justify-center flex-1 pb-16">
          <div className="grid grid-cols-1 place-items-center w-full">
            <div className="rounded-3xl bg-[#F5F5DC]/80 p-12 shadow-[0_8px_32px_rgba(61,37,22,0.15)] backdrop-blur-xl border border-white/30 text-center max-w-md w-full transition-all duration-300 hover:-translate-y-2 hover:bg-[#F5F5DC]/90 hover:shadow-[0_12px_40px_rgba(61,37,22,0.2)]">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EEDDCC]/50 text-[#a78e7e] ring-1 ring-white/50 shadow-inner">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#4A3B32] mb-4 drop-shadow-sm">Archive</h1>
              <p className="text-lg text-[#6A5A4A] font-semibold">Curating history.<br/>Coming Soon...</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Archive
