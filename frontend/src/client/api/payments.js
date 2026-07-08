import { clientHttp, unwrapClient } from './http.js'

export const paymentsApi = {
  getMyPayments: () => unwrapClient(clientHttp.get('/payments/my')),
  createPayment: (orderId, data) => unwrapClient(clientHttp.post(`/payments/${orderId}`, data)),
  createPayosCheckout: (orderId) => unwrapClient(clientHttp.post('/payments/payos/checkout', { orderId })),
  syncPayosPayment: (orderCode) => unwrapClient(clientHttp.post(`/payments/payos/sync`, { orderCode })),
}
