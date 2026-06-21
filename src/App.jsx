import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppShell from './components/layout/AppShell'
import PublicLayout from './components/layout/PublicLayout'

import LoginPage          from './pages/public/LoginPage'
import BookingPage        from './pages/public/BookingPage'
import ConfirmationPage   from './pages/public/ConfirmationPage'
import DashboardPage      from './pages/admin/DashboardPage'
import AppointmentsPage   from './pages/admin/AppointmentsPage'
import ClinicProfilePage  from './pages/admin/ClinicProfilePage'
import ServicesPage       from './pages/admin/ServicesPage'
import ProvidersPage      from './pages/admin/ProvidersPage'
import PatientsPage       from './pages/admin/PatientsPage'
import NotFoundPage       from './pages/NotFoundPage'

function RequireAuth({ children }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  return children
}

function RequireRole({ role, children }) {
  const { currentUser } = useAuth()
  if (currentUser?.role !== role) return (
    <div className="p-8 text-center text-brand-slate text-sm">
      You don't have permission to view this page.
    </div>
  )
  return children
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Public booking (no auth required) */}
        <Route path="/book" element={<BookingPage />} />
        <Route path="/book/confirmation/:id" element={<ConfirmationPage />} />

        {/* Admin (auth required) */}
        <Route path="/admin" element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<DashboardPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="patients"     element={<PatientsPage />} />
          <Route path="clinic"       element={<RequireRole role="admin"><ClinicProfilePage /></RequireRole>} />
          <Route path="services"     element={<RequireRole role="admin"><ServicesPage /></RequireRole>} />
          <Route path="providers"    element={<RequireRole role="admin"><ProvidersPage /></RequireRole>} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  )
}
