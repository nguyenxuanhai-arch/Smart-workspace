import { clientHttp, unwrapClient } from './http.js'

export const clientAuthApi = {
  register: (payload) => unwrapClient(clientHttp.post('/auth/register', payload)),
  login: (email, password) => unwrapClient(clientHttp.post('/auth/login', { email, password })),
  me: () => unwrapClient(clientHttp.get('/auth/me')),
  logout: () => unwrapClient(clientHttp.post('/auth/logout')),
}
