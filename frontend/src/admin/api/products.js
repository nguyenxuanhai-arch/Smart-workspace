import { http, unwrap } from './http.js'

export const productsApi = {
  list: ({ search, categoryId, minPrice, maxPrice, sort = 'newest', page = 0, size = 10 } = {}) =>
    unwrap(
      http.get('/admin/products', {
        params: { search, categoryId, minPrice, maxPrice, sort, page, size },
      })
    ),
  getById: (id) => unwrap(http.get(`/admin/products/${id}`)),
  create: (payload) => unwrap(http.post('/admin/products', payload)),
  update: (id, payload) => unwrap(http.put(`/admin/products/${id}`, payload)),
  remove: (id) => unwrap(http.delete(`/admin/products/${id}`)),
}
