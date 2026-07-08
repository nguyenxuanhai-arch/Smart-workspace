import { clientHttp as http, unwrapClient as unwrap } from './http.js'

export const productsApi = {
  list: ({ search, categoryId, minPrice, maxPrice, sort = 'newest', page = 0, size = 10 } = {}) =>
    unwrap(
      http.get('/products', {
        params: { search, categoryId, minPrice, maxPrice, sort, page, size },
      })
    ),

  getById: (id) => unwrap(http.get(`/products/${id}`)),
  getBySlug: (slug) => unwrap(http.get(`/products/slug/${slug}`)),
}
