import axios from 'axios'
import { CLIENT_ROUTES } from '../routes.js'

export const CLIENT_API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || '/api')
const ASSET_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_ASSET_BASE_URL || inferBackendOrigin(CLIENT_API_BASE_URL)
)

export const clientHttp = axios.create({
  baseURL: CLIENT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Context': 'client',
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

function readJson(key) {
  const raw = sessionStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    sessionStorage.removeItem(key)
    return null
  }
}

// ---- User storage helpers (chỉ lưu user info, token nằm trong HTTP-only cookies) ----
export const clientSessionStorage = {
  getUser: () => readJson('sw_client_user'),
  setSession: ({ user }) => {
    if (user) sessionStorage.setItem('sw_client_user', JSON.stringify(user))
  },
  clear: () => {
    sessionStorage.removeItem('sw_client_user')
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

clientHttp.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then(() => {
          return clientHttp(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axios.post(`${CLIENT_API_BASE_URL}/auth/refresh`, null, {
          withCredentials: true,
          headers: { 'X-Auth-Context': 'client' },
        })
        resolvePendingQueue(null)
        return clientHttp(originalRequest)
      } catch (refreshError) {
        resolvePendingQueue(refreshError)
        clientSessionStorage.clear()
        window.location.href = CLIENT_ROUTES.login
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export function unwrapClient(promise) {
  return promise.then((res) => res.data.data)
}

export function resolveAssetUrl(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }
  if (!ASSET_BASE_URL) return path
  return `${ASSET_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
