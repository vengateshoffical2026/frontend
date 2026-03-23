import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { newsEventsData } from "../data/newsEvents";
import { loginAPI } from "../api/controllers/authcontroller";
import { toast } from "react-toastify";

type PopupView = "news" | "login";

const NotificationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [view, setView] = useState<PopupView>("news");
  const token = localStorage.getItem("token");
  const location = useLocation();

  const newItems = newsEventsData.filter((i) => i.isNew);
  const hasNew = newItems.length > 0;

  // Initial Logic: Show news if available, or login if guest
  useEffect(() => {
    if (hasNew) {
      setView("news");
      setIsVisible(true);
      const timer = setTimeout(() => setIsMinimized(false), 1000);
      return () => clearTimeout(timer);
    } else if (!token) {
      setView("login");
      setIsVisible(true);
      const timer = setTimeout(() => setIsMinimized(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasNew, token]);

  // Route Change Logic: If guest and not showing news, show login
  useEffect(() => {
    if (!token) {
      // If we were showing news, transition to login on next page
      if (view === "news" || isMinimized) {
        setView("login");
        setIsMinimized(false);
        setIsVisible(true);
      }
    }
  }, [location.pathname, token, isMinimized, view]);

  const handleDismiss = () => {
    if (view === "news" && !token) {
      // Transition to login instead of fully closing
      setView("login");
    } else {
      setIsVisible(false);
    }
  };

  const [loginValues, setLoginValues] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res: any = await loginAPI(loginValues);
      localStorage.setItem("token", res?.data?.token || res?.token);
      if (res?.data?.user || res?.user) {
        localStorage.setItem("user", JSON.stringify(res?.data?.user || res?.user));
      }
      toast.success("Welcome back, scribe!");
      window.location.reload();
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {!isMinimized && (
        <div 
          className="fixed inset-0 bg-[#4A3B32]/60 backdrop-blur-sm z-[1999] animate-in fade-in duration-500"
          onClick={() => setIsMinimized(true)}
        />
      )}
      <div className={`fixed z-[2000] transition-all duration-500 ease-out flex flex-col items-center justify-center pointer-events-none ${
        isMinimized 
          ? "top-24 right-6 items-end" 
          : "inset-0 items-center justify-center p-4"
      }`}>
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="pointer-events-auto h-16 w-16 rounded-full bg-[#8B4513] text-white shadow-[0_10px_30px_rgba(139,69,19,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative ring-4 ring-white group"
          >
            {view === "news" && hasNew && (
              <span className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-black group-hover:animate-bounce">
                {newItems.length}
              </span>
            )}
            {view === "login" && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full border-2 border-white" />
            )}
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {view === "news" ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20a10.003 10.003 0 006.203-2.138l.054.09a10.003 10.003 0 00-2.753-9.57M12 7a5 5 0 11-10 0 5 5 0 0110 0zm0 0c0 1.141-.21 2.232-.592 3.242" />
              )}
            </svg>
          </button>
        ) : (
          <div className="pointer-events-auto w-full max-w-md bg-[#fdfaf2] rounded-[2rem] shadow-[0_40px_100px_rgba(61,37,22,0.4)] border border-[#8B4513]/10 overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="bg-[#8B4513] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-serif font-bold text-lg tracking-tight">
                  {view === "news" ? "New Updates" : "Member Access"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg></button>
                <button onClick={handleDismiss} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>

            <div className="p-6">
              {view === "login" && !token ? (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="mx-auto h-16 w-16 mb-4 rounded-full bg-[#8B4513]/10 flex items-center justify-center text-[#8B4513]">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h3 className="text-[#4A3B32] font-black text-sm uppercase tracking-widest mb-1">Archive Entry</h3>
                    <p className="text-xs text-[#6A5A4A] leading-relaxed">Please sign in to unlock your persistent scribe identity and save your research.</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#8B4513]/60 ml-1">Email or Mobile</label>
                      <input type="text" placeholder="scribe@sasanam.org" className="w-full px-4 py-3 rounded-xl bg-[#f4ecd8]/40 border-2 border-[#f4ecd8] focus:border-[#8B4513]/30 focus:bg-white outline-none text-sm font-semibold transition-all" value={loginValues.email} onChange={(e) => setLoginValues({ ...loginValues, email: e.target.value })} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#8B4513]/60 ml-1">Secret Key</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-[#f4ecd8]/40 border-2 border-[#f4ecd8] focus:border-[#8B4513]/30 focus:bg-white outline-none text-sm font-semibold transition-all" value={loginValues.password} onChange={(e) => setLoginValues({ ...loginValues, password: e.target.value })} required />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 bg-[#8B4513] text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg hover:bg-[#a0522d] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isSubmitting ? "Unlocking..." : "Unlock Access"}
                    </button>
                    {!hasNew && (
                      <div className="text-center pt-2">
                        <Link to="/signup" onClick={handleDismiss} className="text-[10px] font-bold text-[#8B4513] uppercase tracking-widest hover:underline">Enroll as New Scribe</Link>
                      </div>
                    )}
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-4">
                    <p className="text-xs text-[#6A5A4A] font-medium leading-relaxed italic border-l-2 border-[#8B4513]/20 pl-3">
                      Greetings! We have unearthed {newItems.length} new records recently.
                    </p>
                  </div>
                  {newItems.map((item) => (
                    <Link key={item.id} to="/news-events" onClick={() => setIsMinimized(true)} className="group flex flex-col gap-1 p-3 rounded-2xl bg-[#FAF9F6] border border-[#8B4513]/5 hover:bg-white hover:border-[#8B4513]/20 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-[#8B4513]/10 text-[#8B4513] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">{item.type}</span>
                        <span className="text-[10px] text-[#6A5A4A] font-bold">{item.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#4A3B32] group-hover:text-[#8B4513] transition-colors">{item.title}</h4>
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 pt-2">
                    <Link to="/news-events" onClick={handleDismiss} className="w-full block py-3 text-center text-[10px] font-black uppercase tracking-widest text-white bg-[#8B4513] rounded-xl hover:bg-[#a0522d] transition-all shadow-md">Explore Now</Link>
                    {!token && (
                      <button onClick={() => setView("login")} className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-[#8B4513]/60 hover:text-[#8B4513] transition-colors">Skip to Login</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPopup;
