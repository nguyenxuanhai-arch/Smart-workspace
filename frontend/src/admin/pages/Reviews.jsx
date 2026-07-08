import { useEffect, useState, useCallback } from 'react'
import { Star, Eye, EyeOff, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { reviewsApi } from '../api/reviews.js'

const statusLabel = {
  VISIBLE: 'Hiển thị',
  HIDDEN: 'Đã ẩn',
}

const statusStyle = {
  VISIBLE: 'bg-emerald-100 text-emerald-600',
  HIDDEN: 'bg-red-100 text-red-500',
}

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
  const [data, setData] = useState({ items: [], page: 0, totalPages: 0, totalElements: 0 })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReviews = useCallback(() => {
    setLoading(true)
    setError('')
    reviewsApi
      .list({ search: search || undefined, status: status || undefined, page, size: 10 })
      .then(setData)
      .catch(() => setError('Không thể tải danh sách đánh giá từ backend.'))
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const toggleVisibility = async (review) => {
    const nextStatus = review.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE'
    try {
      await reviewsApi.updateStatus(review.id, nextStatus)
      fetchReviews()
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật trạng thái thất bại.')
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800">Quản Lý Đánh Giá Sản Phẩm</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(0)
              setSearch(e.target.value)
            }}
            placeholder="Tìm theo khách hàng, sản phẩm, nội dung"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setPage(0)
            setStatus(e.target.value)
          }}
          className="border border-slate-200 rounded-lg text-sm px-3 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-brand-teal"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="VISIBLE">Hiển thị</option>
          <option value="HIDDEN">Đã ẩn</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
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
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  Chưa có đánh giá nào.
                </td>
              </tr>
            ) : (
              data.items.map((review) => (
                <tr key={review.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="p-4 font-medium text-slate-700 whitespace-nowrap">{review.userFullName}</td>
                  <td className="p-4 text-slate-600 max-w-[180px]">{review.productName}</td>
                  <td className="p-4">
                    <Stars rating={review.rating} />
                  </td>
                  <td className="p-4 text-slate-600 max-w-[260px]">{review.content}</td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{formatDate(review.createdAt)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyle[review.status]}`}>
                      {statusLabel[review.status] || review.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleVisibility(review)}
                      className="flex items-center gap-1 text-slate-400 hover:text-brand-teal transition-colors"
                      title={review.status === 'VISIBLE' ? 'Ẩn đánh giá' : 'Hiện đánh giá'}
                    >
                      {review.status === 'VISIBLE' ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Trang {data.page + 1} / {data.totalPages} - Tổng {data.totalElements} đánh giá
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page + 1 >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
