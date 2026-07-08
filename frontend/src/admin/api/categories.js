import { http, unwrap } from './http.js'

export const categoriesApi = {
  // Backend chỉ có GET /api/categories công khai (chỉ trả danh mục ACTIVE)
  list: () => unwrap(http.get('/categories')),
  getById: (id) => unwrap(http.get(`/categories/${id}`)),
  create: (payload) => unwrap(http.post('/admin/categories', payload)),
  update: (id, payload) => unwrap(http.put(`/admin/categories/${id}`, payload)),
  remove: (id) => unwrap(http.delete(`/admin/categories/${id}`)),
}
