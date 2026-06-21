import { createContext, useContext, useMemo } from 'react'
import { useData } from './DataContext'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { notifications, markNotificationRead } = useData()
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markNotificationRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider')
  return ctx
}
