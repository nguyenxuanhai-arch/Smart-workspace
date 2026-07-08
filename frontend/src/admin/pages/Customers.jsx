import { useEffect, useState, useCallback } from 'react'
import { Search, ShoppingCart, Eye, Lock, Unlock, ChevronLeft, ChevronRight } from 'lucide-react'
import { customersApi } from '../api/customers.js'

const statusLabel = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngừng hoạt động',
  BLOCKED: 'Bị khóa',
}

const statusStyle = {
  ACTIVE: 'bg-emerald-100 text-emerald-600',
  INACTIVE: 'bg-slate-100 text-slate-500',
  BLOCKED: 'bg-red-100 text-red-500',
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '')

function StatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyle[status]}`}>
      {statusLabel[status] || status}
    </span>
  )
}

export default function Customers() {
  const [data, setData] = useState({ items: [], page: 0, totalPages: 0, totalElements: 0 })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCustomers = useCallback(() => {
    setLoading(true)
    setError('')
    customersApi
      .list({ search: search || undefined, status: status || undefined, page, size: 10 })
      .then(setData)
      .catch(() => setError('Không thể tải danh sách khách hàng từ backend.'))
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const updateStatus = async (customer, nextStatus) => {
    try {
      await customersApi.updateStatus(customer.id, nextStatus)
      fetchCustomers()
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật trạng thái khách hàng thất bại.')
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800">Quản Lý Khách Hàng</h1>

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
            placeholder="Tìm theo tên, email, số điện thoại"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>

        <button className="flex items-center gap-2 border border-brand-teal text-brand-teal rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-teal/5 transition-colors">
          <ShoppingCart size={16} />
          Đơn hàng
        </button>

        <select
          value={status}
          onChange={(e) => {
            setPage(0)
            setStatus(e.target.value)
          }}
          className="border border-slate-200 rounded-lg text-sm px-3 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-brand-teal"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Ngừng hoạt động</option>
          <option value="BLOCKED">Bị khóa</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-4 font-medium w-10">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="p-4 font-medium">Tên khách hàng</th>
              <th className="p-4 font-medium">Liên hệ</th>
              <th className="p-4 font-medium">Tổng tiêu</th>
              <th className="p-4 font-medium">Số đơn hàng</th>
              <th className="p-4 font-medium">Ngày tạo</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-400">
                  Đang tải...
                </td>
              </tr>
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-400">
                  Chưa có khách hàng nào.
                </td>
              </tr>
            ) : (
              data.items.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </td>
                  <td className="p-4 font-medium text-slate-700">{customer.fullName}</td>
                  <td className="p-4">
                    <p className="text-slate-700">{customer.email}</p>
                    <p className="text-slate-400 text-xs">{customer.phone || 'Chưa cập nhật'}</p>
                  </td>
                  <td className="p-4 text-slate-600">{formatCurrency(customer.totalSpent)}</td>
                  <td className="p-4 text-slate-600">{customer.orderCount}</td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{formatDate(customer.createdAt)}</td>
                  <td className="p-4">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <button className="hover:text-blue-500 transition-colors" title="Xem khách hàng">
                        <Eye size={16} />
                      </button>
                      {customer.status === 'BLOCKED' ? (
                        <button
                          onClick={() => updateStatus(customer, 'ACTIVE')}
                          className="hover:text-emerald-500 transition-colors"
                          title="Mở khóa"
                        >
                          <Unlock size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(customer, 'BLOCKED')}
                          className="hover:text-red-500 transition-colors"
                          title="Khóa khách hàng"
                        >
                          <Lock size={16} />
                        </button>
                      )}
                    </div>
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
            Trang {data.page + 1} / {data.totalPages} - Tổng {data.totalElements} khách hàng
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
