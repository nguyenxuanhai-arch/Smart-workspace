import { clientHttp as http, unwrapClient as unwrap } from './http.js'

export const reviewsApi = {
  listByProduct: (productId) => unwrap(http.get(`/products/${productId}/reviews`)),
}
