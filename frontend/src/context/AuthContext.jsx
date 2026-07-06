import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../api/auth.js'
import { tokenStorage } from '../api/http.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStorage.getUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = tokenStorage.getAccessToken()
    if (!token) {
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
    tokenStorage.setSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    })
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken()
    try {
      await authApi.logout(refreshToken)
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
