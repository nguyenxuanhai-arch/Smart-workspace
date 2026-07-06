import { http, unwrap } from './http.js'

export const productsApi = {
  // Lưu ý: backend chỉ có GET /api/products công khai (chỉ trả sản phẩm ACTIVE),
  // chưa có endpoint GET /api/admin/products để admin xem toàn bộ trạng thái (kể cả INACTIVE/OUT_OF_STOCK).
  list: ({ search, categoryId, minPrice, maxPrice, sort = 'newest', page = 0, size = 10 } = {}) =>
    unwrap(
      http.get('/products', {
        params: { search, categoryId, minPrice, maxPrice, sort, page, size },
      })
    ),
  getById: (id) => unwrap(http.get(`/products/${id}`)),
  create: (payload) => unwrap(http.post('/admin/products', payload)),
  update: (id, payload) => unwrap(http.put(`/admin/products/${id}`, payload)),
  remove: (id) => unwrap(http.delete(`/admin/products/${id}`)),
}
