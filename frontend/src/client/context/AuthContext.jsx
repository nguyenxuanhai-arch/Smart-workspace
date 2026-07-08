import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { clientAuthApi } from '../api/auth.js'
import { clientSessionStorage } from '../api/http.js'

const ClientAuthContext = createContext(null)

export function ClientAuthProvider({ children }) {
  const [user, setUser] = useState(() => clientSessionStorage.getUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Tokens nằm trong HTTP-only cookies, không kiểm tra được từ JS.
    // Nếu có user trong storage → thử gọi /me để verify session.
    if (!clientSessionStorage.getUser()) {
      setLoading(false)
      return
    }

    clientAuthApi
      .me()
      .then((me) => {
        setUser(me)
        clientSessionStorage.setSession({ user: me })
      })
      .catch(() => {
        clientSessionStorage.clear()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await clientAuthApi.login(email, password)
    // Backend đã set HTTP-only cookies, response chỉ chứa user info
    clientSessionStorage.setSession({ user: data.user })
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await clientAuthApi.logout()
    } catch {
      // Client session is cleared locally even when the backend logout request fails.
    }
    clientSessionStorage.clear()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [loading, login, logout, user],
  )

  return <ClientAuthContext.Provider value={value}>{children}</ClientAuthContext.Provider>
}

export function useClientAuth() {
  return useContext(ClientAuthContext)
}
