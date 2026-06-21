import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const PAGE_TITLES = {
  '/admin/dashboard':    'Dashboard',
  '/admin/appointments': 'Appointments',
  '/admin/patients':     'Patients',
  '/admin/clinic':       'Clinic Profile',
  '/admin/services':     'Services',
  '/admin/providers':    'Providers',
}

export default function AppShell() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'Lumière'

  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60 flex flex-col min-h-screen">
        <Topbar title={title} />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
