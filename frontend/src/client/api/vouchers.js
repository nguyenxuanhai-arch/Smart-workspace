import { clientHttp } from './http'

export const vouchersApi = {
  check: (code, subtotal) => {
    const params = new URLSearchParams({ code })
    if (subtotal) {
      params.append('subtotal', subtotal)
    }
    return clientHttp.get(`/vouchers/check?${params.toString()}`).then(res => res.data)
  }
}
