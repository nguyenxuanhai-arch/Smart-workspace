import { http, unwrap } from './http.js'

export const policiesApi = {
  list: () => unwrap(http.get('/policies')),
  getByType: (type) => unwrap(http.get(`/policies/${type}`)),
  create: (payload) => unwrap(http.post('/admin/policies', payload)),
  update: (id, payload) => unwrap(http.put(`/admin/policies/${id}`, payload)),
}
