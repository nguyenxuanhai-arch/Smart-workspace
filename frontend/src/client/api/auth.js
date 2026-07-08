import { clientHttp, unwrapClient } from './http.js'

export const clientAuthApi = {
  login: (email, password) => unwrapClient(clientHttp.post('/auth/login', { email, password })),
  me: () => unwrapClient(clientHttp.get('/auth/me')),
  logout: () => unwrapClient(clientHttp.post('/auth/logout')),
}
