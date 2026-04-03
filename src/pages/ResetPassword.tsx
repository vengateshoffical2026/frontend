import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import apiClient from '../api/interceptors/axiosInstance'
import PageSEO from '../components/PageSEO'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirm) return toast.error('Passwords do not match')
    setSaving(true)
    try {
      await apiClient.post('/auth/reset-password', { token, password })
      setDone(true)
      toast.success('Password reset successfully!')
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Reset failed')
    } finally {
      setSaving(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-body font-bold mb-4">Invalid reset link</p>
          <Link to="/forgot-password" className="text-sm font-bold text-primary hover:underline">Request a new one</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-16">
      <PageSEO title="Reset Password" description="Set a new password for your Sasanam account" path="/reset-password" />
      <div className="w-full max-w-md bg-paper rounded-2xl border border-border/50 p-8">
        {done ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-body mb-2">Password Reset</h2>
            <p className="text-sm text-muted mb-6">Your password has been updated. You can now login.</p>
            <Link to="/login" className="inline-block px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-light transition-colors">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-serif font-bold text-body mb-2">New Password</h1>
            <p className="text-sm text-muted mb-6">Enter your new password below.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted mb-1 block">New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters" required minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-border/60 text-sm text-body focus:outline-none focus:border-primary/30" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted mb-1 block">Confirm Password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password" required
                  className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-border/60 text-sm text-body focus:outline-none focus:border-primary/30" />
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm uppercase tracking-widest hover:bg-primary-light transition-colors disabled:opacity-50">
                {saving ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
