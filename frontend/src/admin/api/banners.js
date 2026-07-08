import { http, unwrap } from './http.js'

export const bannersApi = {
  list: ({ search, status, position, page = 0, size = 10 } = {}) =>
    unwrap(http.get('/admin/banners', { params: { search, status, position, page, size } })),
  getById: (id) => unwrap(http.get(`/admin/banners/${id}`)),
  create: (payload) => unwrap(http.post('/admin/banners', payload)),
  update: (id, payload) => unwrap(http.put(`/admin/banners/${id}`, payload)),
  remove: (id) => unwrap(http.delete(`/admin/banners/${id}`)),
}
