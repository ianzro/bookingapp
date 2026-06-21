import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import { formatDate } from '../../utils/dateUtils'

export default function Topbar({ title }) {
  const { notifications, unreadCount, markNotificationRead } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
      <h2 className="font-display text-base font-semibold text-brand-navy">{title}</h2>

      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="relative p-2 rounded-xl hover:bg-gray-50 transition text-brand-slate"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-gold text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-luxury-lg border border-gray-100 z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-navy">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs text-brand-teal font-medium">{unreadCount} new</span>
                )}
              </div>
              <ul className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 && (
                  <li className="px-4 py-6 text-center text-sm text-gray-400">No notifications</li>
                )}
                {[...notifications].reverse().slice(0, 20).map(n => (
                  <li
                    key={n.id}
                    onClick={() => { markNotificationRead(n.id); setOpen(false) }}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${!n.read ? 'bg-teal-50/40' : ''}`}
                  >
                    <p className="text-sm text-brand-navy">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
