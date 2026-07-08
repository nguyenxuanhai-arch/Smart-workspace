import { http, unwrap } from './http.js'

export const ordersApi = {
  list: ({ page = 0, size = 10 } = {}) => unwrap(http.get('/admin/orders', { params: { page, size } })),
  getById: (id) => unwrap(http.get(`/admin/orders/${id}`)),
  updateStatus: (id, status) => unwrap(http.put(`/admin/orders/${id}/status`, { status })),
}
