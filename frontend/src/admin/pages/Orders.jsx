import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Eye, X } from 'lucide-react'
import { ordersApi } from '../api/orders.js'

const statusOptions = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED']

const statusLabel = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
}

const statusStyle = {
  PENDING: 'bg-amber-100 text-amber-600',
  CONFIRMED: 'bg-blue-100 text-blue-600',
  SHIPPING: 'bg-blue-100 text-blue-600',
  COMPLETED: 'bg-emerald-100 text-emerald-600',
  CANCELLED: 'bg-red-100 text-red-500',
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '')

export default function Orders() {
  const [data, setData] = useState({ items: [], page: 0, totalPages: 0, totalElements: 0 })
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('Tất Cả')
  const [detail, setDetail] = useState(null)

  const fetchOrders = useCallback(() => {
    setLoading(true)
    ordersApi
      .list({ page, size: 10 })
      .then(setData)
      .catch(() => setError('Không thể tải danh sách đơn hàng từ backend.'))
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStatusChange = async (id, status) => {
    try {
      await ordersApi.updateStatus(id, status)
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật trạng thái thất bại.')
    }
  }

  const filtered =
    activeTab === 'Tất Cả' ? data.items : data.items.filter((o) => o.status === activeTab)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800">Quản Lý Đơn Hàng</h1>

      <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto">
        {['Tất Cả', ...statusOptions].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'border-brand-teal text-brand-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'Tất Cả' ? 'Tất Cả' : statusLabel[tab]}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-4 font-medium">Mã Đơn</th>
              <th className="p-4 font-medium">Ngày Đặt</th>
              <th className="p-4 font-medium">Khách Hàng</th>
              <th className="p-4 font-medium">Người Nhận</th>
              <th className="p-4 font-medium">Tổng Tiền</th>
              <th className="p-4 font-medium">Trạng Thái</th>
              <th className="p-4 font-medium">Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  Đang tải...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="p-4 font-medium text-slate-700 whitespace-nowrap">{o.orderCode}</td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                  <td className="p-4 text-slate-600">
                    <p>{o.customerName}</p>
                    <p className="text-xs text-slate-400">{o.customerEmail}</p>
                  </td>
                  <td className="p-4 text-slate-600">
                    <p>{o.receiverName}</p>
                    <p className="text-xs text-slate-400">{o.receiverPhone}</p>
                  </td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{formatCurrency(o.totalAmount)}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-3 py-1.5 border-0 outline-none cursor-pointer ${statusStyle[o.status]}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setDetail(o)}
                      className="flex items-center gap-1 text-blue-500 hover:underline text-sm"
                    >
                      <Eye size={14} /> Xem chi tiết
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
            Trang {data.page + 1} / {data.totalPages} — Tổng {data.totalElements} đơn hàng
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

      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Chi tiết đơn {detail.orderCode}</h3>
              <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p><span className="text-slate-400">Người nhận:</span> {detail.receiverName} - {detail.receiverPhone}</p>
              <p><span className="text-slate-400">Địa chỉ:</span> {detail.shippingAddress}</p>
              <p><span className="text-slate-400">Ghi chú:</span> {detail.note || '—'}</p>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-sm font-medium text-slate-700 mb-2">Sản phẩm</p>
              <div className="space-y-2">
                {detail.items?.map((it) => (
                  <div key={it.id} className="flex justify-between text-sm text-slate-600">
                    <span>{it.productName} x{it.quantity}</span>
                    <span>{formatCurrency(it.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3 text-sm space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Tạm tính</span>
                <span>{formatCurrency(detail.subtotalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Phí vận chuyển</span>
                <span>{formatCurrency(detail.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Giảm giá</span>
                <span>-{formatCurrency(detail.discountAmount)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-800 pt-1">
                <span>Tổng cộng</span>
                <span>{formatCurrency(detail.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
