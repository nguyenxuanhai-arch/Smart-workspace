import { http, unwrap } from './http.js'

export const customersApi = {
  list: ({ search, status, page = 0, size = 10 } = {}) =>
    unwrap(http.get('/admin/customers', { params: { search, status, page, size } })),
  updateStatus: (id, status) => unwrap(http.put(`/admin/customers/${id}/status`, { status })),
}
