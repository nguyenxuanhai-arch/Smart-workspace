import { http, unwrap } from './http.js'

export const storeLocationsApi = {
  list: () => unwrap(http.get('/store-locations')),
  create: (payload) => unwrap(http.post('/admin/store-locations', payload)),
  update: (id, payload) => unwrap(http.put(`/admin/store-locations/${id}`, payload)),
  remove: (id) => unwrap(http.delete(`/admin/store-locations/${id}`)),
}
