import { createContext, useContext, useMemo, useState } from 'react'

const AUTH_USER_KEY = 'floodrescue_user'
const AUTH_USERS_KEY = 'floodrescue_users'

const AuthContext = createContext(null)

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(AUTH_USER_KEY, null))

  const signup = ({ fullName, email, password }) => {
    const users = readJson(AUTH_USERS_KEY, [])
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (exists) {
      return { ok: false, message: 'An account with this email already exists.' }
    }
    const newUser = { fullName, email, password }
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify([...users, newUser]))
    return { ok: true }
  }

  const login = ({ email, password }) => {
    const users = readJson(AUTH_USERS_KEY, [])
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!match) return { ok: false, message: 'Invalid email or password.' }

    const sessionUser = { fullName: match.fullName, email: match.email }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_USER_KEY)
    setUser(null)
  }

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), signup, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}