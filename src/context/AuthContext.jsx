import { createContext, useContext, useState, useCallback } from 'react'
import { getArray, getItem, setItem } from '../utils/storage'

const AuthContext = createContext(null)

async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getItem('derm_session'))

  const login = useCallback(async (email, password) => {
    const users = getArray('derm_users')
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) throw new Error('Invalid email or password.')

    const hash = await sha256hex(password)
    if (hash !== user.passwordHash) throw new Error('Invalid email or password.')

    const session = { userId: user.id, role: user.role, name: user.name, loginAt: new Date().toISOString() }
    setItem('derm_session', session)
    setCurrentUser(session)
    return session
  }, [])

  const logout = useCallback(() => {
    setItem('derm_session', null)
    setCurrentUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
