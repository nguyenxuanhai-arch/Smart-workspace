import { clientHttp, unwrapClient } from './http.js'

export const ordersApi = {
  getMyOrders: () => unwrapClient(clientHttp.get('/orders/my')),
  getById: (id) => unwrapClient(clientHttp.get(`/orders/${id}`)),
  create: (data) => unwrapClient(clientHttp.post('/orders', data)),
}
