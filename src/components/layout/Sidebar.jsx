import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, CalendarDays, Building2, Layers, Users, UserCircle, LogOut,
} from 'lucide-react'

const NAV = [
  { to: '/admin/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/admin/patients',     label: 'Patients',     icon: Users },
]
const ADMIN_NAV = [
  { to: '/admin/clinic',    label: 'Clinic Profile', icon: Building2 },
  { to: '/admin/services',  label: 'Services',       icon: Layers },
  { to: '/admin/providers', label: 'Providers',      icon: UserCircle },
]

export default function Sidebar() {
  const { currentUser, logout } = useAuth()
  const isAdmin = currentUser?.role === 'admin'

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
    ${isActive
      ? 'bg-brand-teal text-white'
      : 'text-gray-400 hover:bg-white/10 hover:text-white'}`

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-brand-navy flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center">
            <span className="font-display text-brand-gold font-semibold text-lg">L</span>
          </div>
          <div>
            <p className="text-white font-display text-sm font-semibold leading-tight">Lumière</p>
            <p className="text-gray-400 text-xs">Dermatology</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <p className="px-4 pt-5 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Settings
            </p>
            {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center text-white text-xs font-semibold">
            {currentUser?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{currentUser?.name}</p>
            <p className="text-gray-400 text-xs capitalize">{currentUser?.role}</p>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-white transition p-1">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
