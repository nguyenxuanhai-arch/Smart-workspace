import { http, unwrap } from './http.js'

export const authApi = {
  login: (email, password) => unwrap(http.post('/auth/login', { email, password })),
  me: () => unwrap(http.get('/auth/me')),
  logout: () => unwrap(http.post('/auth/logout')),
}
