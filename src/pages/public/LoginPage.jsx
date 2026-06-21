import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-navy mb-4">
            <span className="text-brand-gold font-display text-2xl font-semibold">L</span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-brand-navy tracking-wide">
            Lumière Dermatology
          </h1>
          <p className="mt-2 text-brand-slate text-sm">Staff & Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-luxury px-8 py-10">
          <h2 className="font-display text-xl font-medium text-brand-navy mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@lumierederm.ph"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-navy placeholder-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-navy placeholder-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-teal text-white text-sm font-semibold tracking-wide
                hover:bg-brand-teal-light transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Dev hint */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Demo: admin@lumierederm.ph / Admin123!
        </p>
      </div>
    </div>
  )
}
