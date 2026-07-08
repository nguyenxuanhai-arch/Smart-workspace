import { http, unwrap } from './http.js'

export const paymentsApi = {
  list: () => unwrap(http.get('/admin/payments')),
  updateStatus: (id, statusData) => unwrap(http.put(`/admin/payments/${id}/status`, statusData)),
}
