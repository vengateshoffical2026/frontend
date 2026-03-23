import { useScrollReveal } from "../hooks/useScrollReveal";

const Contact = () => {
  const reveal = useScrollReveal();

  const revealClass = (isVisible: boolean) =>
    `transition-all duration-1000 ease-out ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    }`;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-[#8B4513]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#8B4513]/5 rounded-full blur-3xl pointer-events-none" />

      <div 
        ref={reveal.ref as any}
        className={`w-full max-w-4xl bg-[#F5F5DC]/80 backdrop-blur-md rounded-[2.5rem] p-10 sm:p-16 shadow-[0_20px_50px_rgba(139,69,19,0.15)] border border-white/40 relative z-10 ${revealClass(reveal.isVisible)}`}
      >
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-[#4A3B32] mb-6 uppercase tracking-widest">
            Contact <span className="text-[#8B4513]">Us</span>
          </h1>
          <div className="w-24 h-1 bg-[#8B4513]/20 rounded-full mb-6" />
          <p className="text-lg text-[#6A5A4A] max-w-2xl font-medium leading-relaxed">
            Have questions about our archive or want to contribute to our historical preservation efforts? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8B4513] flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="text-sm font-black text-[#8B4513] uppercase tracking-wider mb-1">Email Us</h3>
                <p className="text-[#4A3B32] font-bold text-lg">contact@sasanam.org</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8B4513] flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h3 className="text-sm font-black text-[#8B4513] uppercase tracking-wider mb-1">Our Location</h3>
                <p className="text-[#4A3B32] font-bold text-lg leading-snug">Chennai, Tamil Nadu<br />India</p>
              </div>
            </div>

            <div className="mt-4 pt-8 border-t border-[#8B4513]/10">
              <h3 className="text-sm font-black text-[#8B4513] uppercase tracking-wider mb-4">Follow Our Journey</h3>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'instagram'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#8B4513] shadow-md hover:-translate-y-1 transition-all border border-[#8B4513]/5">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-[#8B4513]/20 rounded-full" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-[#8B4513] uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your name"
                className="w-full rounded-2xl bg-white/50 border border-[#8B4513]/10 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 transition-all font-bold text-[#4A3B32] placeholder:text-[#a78e7e]/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-[#8B4513] uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="your@email.com"
                className="w-full rounded-2xl bg-white/50 border border-[#8B4513]/10 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 transition-all font-bold text-[#4A3B32] placeholder:text-[#a78e7e]/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-[#8B4513] uppercase tracking-widest ml-1">Message</label>
              <textarea 
                rows={4}
                placeholder="How can we help?"
                className="w-full rounded-2xl bg-white/50 border border-[#8B4513]/10 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 transition-all font-bold text-[#4A3B32] placeholder:text-[#a78e7e]/50 resize-none"
              ></textarea>
            </div>
            <button className="mt-2 w-full rounded-2xl bg-[#8B4513] py-5 text-center text-white font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#a0522d] transition-all hover:-translate-y-1 active:translate-y-0">
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      {/* Decorative logo */}
      <img 
        src="/logo.jpeg" 
        alt="" 
        className="absolute bottom-0 right-0 w-96 h-96 mix-blend-multiply opacity-[0.03] grayscale pointer-events-none translate-y-1/4 translate-x-1/4"
      />
    </div>
  );
};

export default Contact;
