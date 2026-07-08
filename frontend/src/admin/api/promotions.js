import { http, unwrap } from './http.js'

export const promotionsApi = {
  list: ({ search, status, page = 0, size = 10 } = {}) =>
    unwrap(http.get('/admin/promotions', { params: { search, status, page, size } })),
  getById: (id) => unwrap(http.get(`/admin/promotions/${id}`)),
  create: (payload) => unwrap(http.post('/admin/promotions', payload)),
  update: (id, payload) => unwrap(http.put(`/admin/promotions/${id}`, payload)),
  remove: (id) => unwrap(http.delete(`/admin/promotions/${id}`)),
}
