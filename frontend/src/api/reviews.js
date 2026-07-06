import { http, unwrap } from './http.js'
// Backend chưa có endpoint "GET /api/admin/reviews" liệt kê tất cả đánh giá.
  // Chỉ có GET /api/products/{productId}/reviews (theo từng sản phẩm) là public.
export const reviewsApi = {
  
  listByProduct: (productId) => unwrap(http.get(`/products/${productId}/reviews`)),
  updateStatus: (id, status) => unwrap(http.put(`/admin/reviews/${id}/status`, { status })),
}
