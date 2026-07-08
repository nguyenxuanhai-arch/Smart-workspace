import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../api/auth.js'
import { tokenStorage } from '../api/http.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStorage.getUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Tokens nằm trong HTTP-only cookies, không kiểm tra được từ JS.
    // Nếu có user trong storage → thử gọi /me để verify session.
    // Nếu không có user → coi như chưa login.
    if (!tokenStorage.getUser()) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then((me) => {
        setUser(me)
        tokenStorage.setSession({ user: me })
      })
      .catch(() => {
        tokenStorage.clear()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password)
    // Backend đã set HTTP-only cookies, response chỉ chứa user info
    tokenStorage.setSession({ user: data.user })
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore lỗi logout, vẫn xóa session local
    }
    tokenStorage.clear()
    setUser(null)
  }, [])

  const isAdmin = user?.roles?.includes('ADMIN')

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
