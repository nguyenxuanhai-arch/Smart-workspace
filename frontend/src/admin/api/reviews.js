import { http, unwrap } from './http.js'

export const reviewsApi = {
  list: ({ search, status, productId, page = 0, size = 10 } = {}) =>
    unwrap(http.get('/admin/reviews', { params: { search, status, productId, page, size } })),
  listByProduct: (productId) => unwrap(http.get(`/products/${productId}/reviews`)),
  updateStatus: (id, status) => unwrap(http.put(`/admin/reviews/${id}/status`, { status })),
}
