import { http, unwrap } from './http.js'

export const feedbacksApi = {
  list: ({ page = 0, size = 10 } = {}) => unwrap(http.get('/admin/feedbacks', { params: { page, size } })),
  updateStatus: (id, status) => unwrap(http.put(`/admin/feedbacks/${id}/status`, { status })),
}

export const uploadsApi = {
  uploadProductImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return unwrap(
      http.post('/admin/uploads/product-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
  },
}
