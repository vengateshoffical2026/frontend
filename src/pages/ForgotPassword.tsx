import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import apiClient from '../api/interceptors/axiosInstance'
import PageSEO from '../components/PageSEO'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return toast.error('Enter your email')
    setSending(true)
    try {
      await apiClient.post('/auth/forgot-password', { email: email.trim() })
      setSent(true)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-16">
      <PageSEO title="Forgot Password" description="Reset your Sasanam password" path="/forgot-password" />
      <div className="w-full max-w-md bg-paper rounded-2xl border border-border/50 p-8">
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-body mb-2">Check your email</h2>
            <p className="text-sm text-muted mb-6">If an account exists with {email}, we've sent a password reset link. Check your inbox and spam folder.</p>
            <Link to="/login" className="text-sm font-bold text-primary hover:underline">Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-serif font-bold text-body mb-2">Forgot Password</h1>
            <p className="text-sm text-muted mb-6">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted mb-1 block">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-border/60 text-sm text-body focus:outline-none focus:border-primary/30" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm uppercase tracking-widest hover:bg-primary-light transition-colors disabled:opacity-50">
                {sending ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="text-center mt-6 text-sm text-muted">
              Remember your password? <Link to="/login" className="font-bold text-primary hover:underline">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
