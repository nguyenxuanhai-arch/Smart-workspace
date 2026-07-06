import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Eye, Trash2, Search, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productsApi } from '../api/products.js'
import { resolveAssetUrl } from '../api/http.js'

const statusLabel = {
  ACTIVE: 'Hiển thị',
  INACTIVE: 'Ẩn',
  OUT_OF_STOCK: 'Hết hàng',
}

const statusStyle = {
  ACTIVE: 'bg-emerald-100 text-emerald-600',
  INACTIVE: 'bg-red-100 text-red-500',
  OUT_OF_STOCK: 'bg-amber-100 text-amber-600',
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

export default function Products() {
  const [data, setData] = useState({ items: [], page: 0, totalPages: 0, totalElements: 0 })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = useCallback(() => {
    setLoading(true)
    setError('')
    productsApi
      .list({ search: search || undefined, page, size: 10 })
      .then(setData)
      .catch(() => setError('Không thể tải danh sách sản phẩm từ backend.'))
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này? Hành động không thể hoàn tác.')) return
    try {
      await productsApi.remove(id)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Xóa sản phẩm thất bại.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Quản Lý Sản Phẩm</h1>
        <Link
          to="/danh-muc"
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Thêm Sản Phẩm Mới
        </Link>
      </div>

      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-3">
        <AlertCircle size={16} className="shrink-0" />
        Danh sách này gọi <code>GET /api/products</code> (endpoint công khai) nên chỉ hiển thị sản phẩm đang{' '}
        <strong>ACTIVE</strong>. Backend chưa có endpoint admin liệt kê toàn bộ trạng thái sản phẩm.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(0)
              setSearch(e.target.value)
            }}
            placeholder="Tìm theo tên sản phẩm..."
            className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand-teal w-64"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-4 font-medium w-10">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="p-4 font-medium">Ảnh</th>
              <th className="p-4 font-medium">Tên Sản Phẩm</th>
              <th className="p-4 font-medium">Danh Mục</th>
              <th className="p-4 font-medium">Giá</th>
              <th className="p-4 font-medium">Kho</th>
              <th className="p-4 font-medium">Trạng Thái</th>
              <th className="p-4 font-medium">Hành Động</th>
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
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            ) : (
              data.items.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </td>
                  <td className="p-4">
                    {p.images?.[0]?.imageUrl ? (
                      <img
                        src={resolveAssetUrl(p.images[0].imageUrl)}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 text-xs">
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-medium text-slate-700">{p.name}</td>
                  <td className="p-4 text-slate-600">{p.category?.name}</td>
                  <td className="p-4 text-slate-600">{formatCurrency(p.price)}</td>
                  <td className="p-4 text-slate-600">{p.stockQuantity}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[p.status]}`}>
                      {statusLabel[p.status] || p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Link to={`/danh-muc?editId=${p.id}`} className="hover:text-brand-teal transition-colors">
                        <Pencil size={16} />
                      </Link>
                      <button className="hover:text-blue-500 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
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
            Trang {data.page + 1} / {data.totalPages} — Tổng {data.totalElements} sản phẩm
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
