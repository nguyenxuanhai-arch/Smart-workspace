import { useEffect, useState, useCallback } from 'react'
import { Star, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { productsApi } from '../api/products.js'
import { reviewsApi } from '../api/reviews.js'

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '')

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // Backend chưa có "GET /api/admin/reviews" liệt kê tất cả đánh giá,
      // nên phải lấy danh sách sản phẩm (đang ACTIVE) rồi gọi review theo từng sản phẩm.
      const productPage = await productsApi.list({ size: 50 })
      const perProduct = await Promise.all(
        productPage.items.map((p) =>
          reviewsApi
            .listByProduct(p.id)
            .then((list) => list.map((r) => ({ ...r, productName: p.name })))
            .catch(() => [])
        )
      )
      const merged = perProduct
        .flat()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setReviews(merged)
    } catch {
      setError('Không thể tải danh sách đánh giá từ backend.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const toggleVisibility = async (review) => {
    const nextStatus = review.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE'
    try {
      await reviewsApi.updateStatus(review.id, nextStatus)
      setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, status: nextStatus } : r)))
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật trạng thái thất bại.')
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800">Quản Lý Đánh Giá Sản Phẩm</h1>

      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-3">
        <AlertCircle size={16} className="shrink-0" />
        Backend chưa có endpoint liệt kê tất cả đánh giá cùng lúc. Trang này gộp dữ liệu bằng cách gọi{' '}
        <code>GET /api/products/{'{id}'}/reviews</code> cho từng sản phẩm đang hiển thị.
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[780px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-4 font-medium">Khách hàng</th>
              <th className="p-4 font-medium">Sản phẩm</th>
              <th className="p-4 font-medium">Đánh giá</th>
              <th className="p-4 font-medium">Nội dung</th>
              <th className="p-4 font-medium">Ngày</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  Đang tải...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  Chưa có đánh giá nào.
                </td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="p-4 font-medium text-slate-700 whitespace-nowrap">{r.userFullName}</td>
                  <td className="p-4 text-slate-600 max-w-[160px]">{r.productName}</td>
                  <td className="p-4">
                    <Stars rating={r.rating} />
                  </td>
                  <td className="p-4 text-slate-600 max-w-[240px]">{r.content}</td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        r.status === 'VISIBLE' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {r.status === 'VISIBLE' ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleVisibility(r)}
                      className="flex items-center gap-1 text-slate-400 hover:text-brand-teal transition-colors"
                      title={r.status === 'VISIBLE' ? 'Ẩn đánh giá' : 'Hiện đánh giá'}
                    >
                      {r.status === 'VISIBLE' ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
