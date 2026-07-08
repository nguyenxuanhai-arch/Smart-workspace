import { clientHttp, unwrapClient } from './http.js'

export const cartApi = {
  getMyCart: () => unwrapClient(clientHttp.get('/cart')),
  addItem: (payload) => unwrapClient(clientHttp.post('/cart/items', payload)),
  updateItem: (itemId, payload) => unwrapClient(clientHttp.put(`/cart/items/${itemId}`, payload)),
  removeItem: (itemId) => unwrapClient(clientHttp.delete(`/cart/items/${itemId}`)),
}
