import axios from 'axios'
import { ADMIN_ROUTES } from '../routes.js'

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || '/api')
const ASSET_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_ASSET_BASE_URL || inferBackendOrigin(API_BASE_URL)
)

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Context': 'admin',
  },
  withCredentials: true,
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

// ---- User storage helpers (chỉ lưu user info, token nằm trong HTTP-only cookies) ----
export const tokenStorage = {
  getUser: () => {
    const raw = localStorage.getItem('sw_user')
    return raw ? JSON.parse(raw) : null
  },
  setSession: ({ user }) => {
    if (user) localStorage.setItem('sw_user', JSON.stringify(user))
  },
  clear: () => {
    localStorage.removeItem('sw_user')
  },
}

// Tự động refresh access token khi bị 401, retry lại request cũ 1 lần
let isRefreshing = false
let pendingQueue = []

function resolvePendingQueue(error) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve()
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
        }).then(() => {
          return http(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
          withCredentials: true,
          headers: { 'X-Auth-Context': 'admin' },
        })
        resolvePendingQueue(null)
        return http(originalRequest)
      } catch (refreshError) {
        resolvePendingQueue(refreshError)
        tokenStorage.clear()
        window.location.href = ADMIN_ROUTES.login
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
