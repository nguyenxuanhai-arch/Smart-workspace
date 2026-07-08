import { http, unwrap } from './http.js'

export const dashboardApi = {
  getStats: () => unwrap(http.get('/admin/dashboard')),
}
