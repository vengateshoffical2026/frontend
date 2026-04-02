import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { toast } from "react-toastify";
import PageSEO from "../components/PageSEO";
import apiClient from "../api/interceptors/axiosInstance";
import { API_ENDPOINTS } from "../api/endPoints";

const Contact = () => {
  const reveal = useScrollReveal();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return toast.error('Please fill all fields');
    }
    setSending(true);
    try {
      await apiClient.post(API_ENDPOINTS.CONTACT, form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const revealClass = (isVisible: boolean) =>
    `reveal-smooth ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      <PageSEO
        title="Contact Us"
        description="Get in touch with the Sasanam team. Reach out for inquiries about ancient inscriptions, collaborations, or support."
        path="/contact"
      />
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div
        ref={reveal.ref as any}
        className={`w-full max-w-4xl bg-beige/80 backdrop-blur-md rounded-[2.5rem] p-10 sm:p-16 shadow-[0_20px_50px_rgba(139,69,19,0.15)] border border-white/40 relative ${revealClass(reveal.isVisible)}`}
      >
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-body mb-6 uppercase tracking-widest">
            Contact <span className="text-primary">Us</span>
          </h1>
          <div className="w-24 h-1 bg-primary/20 rounded-full mb-6" />
          <p className="text-lg text-muted max-w-2xl font-medium leading-relaxed">
            Have questions about our archive or want to contribute? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="text-sm font-black text-primary uppercase tracking-wider mb-1">Email Us</h3>
                <p className="text-body font-bold text-lg">contact@sasanam.org</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h3 className="text-sm font-black text-primary uppercase tracking-wider mb-1">Our Location</h3>
                <p className="text-body font-bold text-lg leading-snug">Chennai, Tamil Nadu<br />India</p>
              </div>
            </div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-black text-primary uppercase tracking-widest ml-1 mb-1.5 block">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name" required
                className="w-full rounded-2xl bg-white/50 border border-primary/10 px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-body placeholder:text-accent/50" />
            </div>
            <div>
              <label className="text-xs font-black text-primary uppercase tracking-widest ml-1 mb-1.5 block">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com" required
                className="w-full rounded-2xl bg-white/50 border border-primary/10 px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-body placeholder:text-accent/50" />
            </div>
            <div>
              <label className="text-xs font-black text-primary uppercase tracking-widest ml-1 mb-1.5 block">Message</label>
              <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?" required maxLength={2000}
                className="w-full rounded-2xl bg-white/50 border border-primary/10 px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-body placeholder:text-accent/50 resize-none" />
            </div>
            <button type="submit" disabled={sending}
              className="mt-1 w-full rounded-2xl bg-primary py-4 text-center text-white font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary-light transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50">
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
