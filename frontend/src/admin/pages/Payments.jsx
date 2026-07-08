import { useEffect, useState, useCallback } from 'react'
import { Eye, X } from 'lucide-react'
import { paymentsApi } from '../api/payments.js'

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '')

const statusLabel = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  FAILED: 'Thất bại',
  REFUNDED: 'Hoàn tiền',
}

const statusStyle = {
  UNPAID: 'bg-amber-100 text-amber-600',
  PAID: 'bg-emerald-100 text-emerald-600',
  FAILED: 'bg-red-100 text-red-500',
  REFUNDED: 'bg-blue-100 text-blue-600',
}

export default function Payments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)

  const fetchPayments = useCallback(() => {
    setLoading(true)
    paymentsApi
      .list()
      .then((data) => setItems(data))
      .catch(() => setError('Không thể tải danh sách thanh toán từ backend.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleStatusChange = async (id, status) => {
    try {
      await paymentsApi.updateStatus(id, { paymentStatus: status })
      fetchPayments()
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật trạng thái thất bại.')
    }
  }

  if (loading) return <div className="p-8 text-on-surface">Đang tải...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight text-on-surface">
          Quản Lý Thanh Toán
        </h1>
        <p className="mt-2 text-sm text-on-surface/70">
          Theo dõi và cập nhật trạng thái thanh toán.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-subtle bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-surface-container text-on-surface/70">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Mã GD</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Phương thức</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Đơn hàng ID</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Ngày thanh toán</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-on-surface">
              {items.map((pm) => (
                <tr key={pm.id} className="transition hover:bg-surface-container/50">
                  <td className="px-6 py-4">{pm.transactionCode || 'N/A'}</td>
                  <td className="px-6 py-4">{pm.paymentMethod}</td>
                  <td className="px-6 py-4">{pm.orderId}</td>
                  <td className="px-6 py-4">{formatCurrency(pm.amount)}</td>
                  <td className="px-6 py-4">{formatDate(pm.paidAt)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={pm.paymentStatus}
                      onChange={(e) => handleStatusChange(pm.id, e.target.value)}
                      className={`rounded-full px-3 py-1 text-xs font-medium outline-none cursor-pointer ${statusStyle[pm.paymentStatus]}`}
                    >
                      {Object.entries(statusLabel).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setDetail(pm)}
                      className="text-on-surface/50 hover:text-primary transition"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-on-surface/50">
                    Chưa có thanh toán nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <h3 className="font-mono text-lg font-bold text-on-surface">Chi Tiết Thanh Toán</h3>
              <button
                onClick={() => setDetail(null)}
                className="rounded-full p-2 text-on-surface/50 hover:bg-surface-container hover:text-on-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-4 font-mono text-sm text-on-surface">
              <div className="flex justify-between">
                <span className="text-on-surface/70">ID Thanh Toán:</span>
                <span className="font-medium">{detail.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface/70">Mã GD:</span>
                <span className="font-medium">{detail.transactionCode || 'Chưa có'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface/70">Phương thức:</span>
                <span className="font-medium">{detail.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface/70">Số tiền:</span>
                <span className="font-medium">{formatCurrency(detail.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface/70">Ngày tạo:</span>
                <span className="font-medium">{formatDate(detail.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface/70">Ngày thanh toán:</span>
                <span className="font-medium">{formatDate(detail.paidAt) || 'Chưa có'}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                <span className="text-on-surface/70">Trạng thái hiện tại:</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[detail.paymentStatus]}`}
                >
                  {statusLabel[detail.paymentStatus]}
                </span>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setDetail(null)}
                className="rounded-lg bg-surface-container px-6 py-2.5 font-mono text-sm font-semibold text-on-surface transition hover:bg-surface-container/80"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
