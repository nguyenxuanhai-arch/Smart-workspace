import { clientHttp, unwrapClient } from './http.js'

export const usersApi = {
  getProfile: () => unwrapClient(clientHttp.get('/users/me')),
  updateProfile: (data) => unwrapClient(clientHttp.put('/users/me', data)),
  
  getAddresses: () => unwrapClient(clientHttp.get('/users/me/addresses')),
  createAddress: (data) => unwrapClient(clientHttp.post('/users/me/addresses', data)),
  updateAddress: (id, data) => unwrapClient(clientHttp.put(`/users/me/addresses/${id}`, data)),
  deleteAddress: (id) => unwrapClient(clientHttp.delete(`/users/me/addresses/${id}`))
}
