import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/public/LoginPage'

function RequireAuth({ children }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  return children
}

function AdminPlaceholder() {
  const { currentUser, logout } = useAuth()
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl text-brand-navy mb-2">Dashboard</h1>
        <p className="text-brand-slate text-sm mb-6">Welcome, {currentUser?.name}</p>
        <button
          onClick={logout}
          className="px-6 py-2 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal-light transition"
        >
          Sign Out
        </button>
        <p className="mt-4 text-xs text-gray-400">Full dashboard coming in Milestone 2</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<RequireAuth><AdminPlaceholder /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  )
}
