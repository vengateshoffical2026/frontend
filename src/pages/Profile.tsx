import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import apiClient from '../api/interceptors/axiosInstance'
import { API_ENDPOINTS } from '../api/endPoints'
import PageSEO from '../components/PageSEO'

export default function Profile() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    apiClient.get(API_ENDPOINTS.AUTH.PROFILE)
      .then(res => {
        const u = res.data.data
        setUser(u)
        setForm({ fullName: u.fullName || '', email: u.email || '' })
        // Sync localStorage
        localStorage.setItem('user', JSON.stringify(u))
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [token, navigate])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, form)
      const updated = res.data.data
      setUser(updated)
      localStorage.setItem('user', JSON.stringify(updated))
      setEditing(false)
      toast.success('Profile updated')
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (d: string | null) => {
    if (!d) return null
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const daysLeft = (d: string | null) => {
    if (!d) return 0
    return Math.max(0, Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const subEnd = user.subscriptionEndDate
  const isExpired = subEnd && new Date(subEnd) < new Date()
  const remaining = daysLeft(subEnd)

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-5 py-16">
      <PageSEO title="My Profile" description="Manage your Sasanam profile and subscription." path="/profile" />

      <div className="w-full max-w-lg">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-black mb-4 shadow-lg">
            {(user.fullName || 'U').charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-body capitalize">{user.fullName}</h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>

        {/* Subscription Status */}
        <div className="bg-paper rounded-2xl border border-border/50 p-6 mb-6">
          <h2 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Subscription</h2>

          {user.isSubscribed && subEnd && !isExpired ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-bold text-emerald-700">Active</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Expires on</span>
                  <span className="font-bold text-body">{formatDate(subEnd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Days remaining</span>
                  <span className="font-bold text-body">{remaining} days</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-2 bg-border/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (remaining / (365 * 3)) * 100)}%` }}
                />
              </div>
            </div>
          ) : isExpired ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-sm font-bold text-red-600">Expired</span>
              </div>
              <p className="text-sm text-muted mb-3">Your subscription expired on {formatDate(subEnd)}</p>
              <button onClick={() => navigate('/pricing')}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors">
                Renew Subscription
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="text-sm font-bold text-muted">Not subscribed</span>
              </div>
              <p className="text-sm text-muted mb-3">Subscribe to get unlimited downloads for 3 years.</p>
              <button onClick={() => navigate('/pricing')}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors">
                Subscribe Now
              </button>
            </div>
          )}
        </div>

        {/* Profile Edit */}
        <div className="bg-paper rounded-2xl border border-border/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-primary uppercase tracking-widest">Profile Details</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-xs font-bold text-primary hover:underline">Edit</button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted mb-1 block">Full Name</label>
                <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-primary/10 text-sm text-body focus:outline-none focus:border-primary/30" required />
              </div>
              <div>
                <label className="text-xs font-bold text-muted mb-1 block">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-primary/10 text-sm text-body focus:outline-none focus:border-primary/30" required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setEditing(false); setForm({ fullName: user.fullName, email: user.email }) }}
                  className="flex-1 py-2.5 rounded-xl border border-primary/20 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Name</span>
                <span className="font-bold text-body capitalize">{user.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Email</span>
                <span className="font-bold text-body">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Downloads used</span>
                <span className="font-bold text-body">{user.downloadCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Member since</span>
                <span className="font-bold text-body">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
