import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import { useData } from '../../context/DataContext'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { unreadCount } = useNotifications()
  const { notifications, markNotificationRead } = useData()

  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20)

  function handleClick(n) {
    if (!n.read) markNotificationRead(n.id)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-xl hover:bg-white/10 transition text-white/80 hover:text-white"
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
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-luxury-lg border border-gray-100 z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-navy">Notifications</p>
              {unreadCount > 0 && (
                <span className="text-xs text-brand-teal font-medium">{unreadCount} unread</span>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {sorted.length === 0 ? (
                <p className="text-sm text-brand-slate/50 text-center py-8">No notifications</p>
              ) : sorted.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-brand-cream transition-colors ${!n.read ? 'bg-brand-teal/5' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 shrink-0" />}
                    <div className={!n.read ? '' : 'ml-4'}>
                      <p className="text-sm text-brand-navy">{n.message}</p>
                      <p className="text-xs text-brand-slate/50 mt-0.5">
                        {new Date(n.createdAt).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
