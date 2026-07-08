import { http, unwrap } from './http.js'

export const vouchersApi = {
  list: ({ search, status, page = 0, size = 10 } = {}) =>
    unwrap(http.get('/admin/vouchers', { params: { search, status, page, size } })),
  getById: (id) => unwrap(http.get(`/admin/vouchers/${id}`)),
  create: (payload) => unwrap(http.post('/admin/vouchers', payload)),
  update: (id, payload) => unwrap(http.put(`/admin/vouchers/${id}`, payload)),
  remove: (id) => unwrap(http.delete(`/admin/vouchers/${id}`)),
}
