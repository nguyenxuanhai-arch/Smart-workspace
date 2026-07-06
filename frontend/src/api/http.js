import axios from 'axios'

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || '/api')
const ASSET_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_ASSET_BASE_URL || inferBackendOrigin(API_BASE_URL)
)

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

function normalizeBaseUrl(value) {
  return String(value || '').replace(/\/+$/, '')
}

function inferBackendOrigin(apiBaseUrl) {
  if (!/^https?:\/\//i.test(apiBaseUrl)) return ''
  try {
    return new URL(apiBaseUrl).origin
  } catch {
    return ''
  }
}

export function resolveAssetUrl(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }
  if (!ASSET_BASE_URL) return path
  return `${ASSET_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

// ---- Token storage helpers ----
export const tokenStorage = {
  getAccessToken: () => localStorage.getItem('sw_access_token'),
  getRefreshToken: () => localStorage.getItem('sw_refresh_token'),
  getUser: () => {
    const raw = localStorage.getItem('sw_user')
    return raw ? JSON.parse(raw) : null
  },
  setSession: ({ accessToken, refreshToken, user }) => {
    if (accessToken) localStorage.setItem('sw_access_token', accessToken)
    if (refreshToken) localStorage.setItem('sw_refresh_token', refreshToken)
    if (user) localStorage.setItem('sw_user', JSON.stringify(user))
  },
  clear: () => {
    localStorage.removeItem('sw_access_token')
    localStorage.removeItem('sw_refresh_token')
    localStorage.removeItem('sw_user')
  },
}

// Gắn access token vào mỗi request
http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tự động refresh access token khi bị 401, retry lại request cũ 1 lần
let isRefreshing = false
let pendingQueue = []

function resolvePendingQueue(error, token) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  pendingQueue = []
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return http(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      const refreshToken = tokenStorage.getRefreshToken()

      if (!refreshToken) {
        tokenStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
        const newAccessToken = data.data.accessToken
        const newRefreshToken = data.data.refreshToken
        tokenStorage.setSession({ accessToken: newAccessToken, refreshToken: newRefreshToken })
        resolvePendingQueue(null, newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return http(originalRequest)
      } catch (refreshError) {
        resolvePendingQueue(refreshError, null)
        tokenStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// Helper bóc data từ ApiResponse { success, message, data }
export function unwrap(promise) {
  return promise.then((res) => res.data.data)
}
