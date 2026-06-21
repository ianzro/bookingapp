import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-6xl font-semibold text-brand-teal mb-4">404</p>
        <p className="text-brand-slate mb-6">Page not found.</p>
        <Link to="/admin/dashboard" className="text-sm text-brand-teal hover:underline font-medium">← Back to Dashboard</Link>
      </div>
    </div>
  )
}
