import { useEffect, useState, useCallback } from 'react'
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, Save } from 'lucide-react'
import { promotionsApi } from '../../api/promotions.js'

const emptyForm = {
  name: '',
  description: '',
  discountType: 'PERCENT',
  discountValue: '',
  startDate: '',
  endDate: '',
  status: 'ACTIVE',
}

const statusLabel = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Đã khóa',
}

const statusStyles = {
  ACTIVE: 'bg-emerald-100 text-emerald-600',
  INACTIVE: 'bg-red-100 text-red-500',
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '')

const toInputDateTime = (iso) => (iso ? iso.slice(0, 16) : '')

const toApiDateTime = (value) => (value ? `${value}:00` : null)

function formatDiscount(promotion) {
  if (promotion.discountType === 'PERCENT') return `${promotion.discountValue}%`
  return formatCurrency(promotion.discountValue)
}

function PromotionForm({ initialValue, onClose, onSaved }) {
  const [form, setForm] = useState(() =>
    initialValue
      ? {
          name: initialValue.name || '',
          description: initialValue.description || '',
          discountType: initialValue.discountType || 'PERCENT',
          discountValue: initialValue.discountValue || '',
          startDate: toInputDateTime(initialValue.startDate),
          endDate: toInputDateTime(initialValue.endDate),
          status: initialValue.status || 'ACTIVE',
        }
      : emptyForm
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      startDate: toApiDateTime(form.startDate),
      endDate: toApiDateTime(form.endDate),
    }

    try {
      if (initialValue?.id) {
        await promotionsApi.update(initialValue.id, payload)
      } else {
        await promotionsApi.create(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu chương trình thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">
            {initialValue?.id ? 'Cập nhật chương trình' : 'Thêm chương trình'}
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên chương trình</label>
            <input
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Loại giảm</label>
            <select
              value={form.discountType}
              onChange={(e) => update('discountType', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <option value="PERCENT">Phần trăm</option>
              <option value="FIXED_AMOUNT">Số tiền cố định</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Giá trị</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.discountValue}
              onChange={(e) => update('discountValue', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ngày bắt đầu</label>
            <input
              required
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => update('startDate', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ngày kết thúc</label>
            <input
              required
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => update('endDate', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Trạng thái</label>
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Đã khóa</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal resize-none"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <Save size={16} />
          {saving ? 'Đang lưu...' : 'Lưu chương trình'}
        </button>
      </form>
    </div>
  )
}

export default function PromotionTab() {
  const [data, setData] = useState({ items: [], page: 0, totalPages: 0, totalElements: 0 })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPromotions = useCallback(() => {
    setLoading(true)
    setError('')
    promotionsApi
      .list({ search: search || undefined, status: status || undefined, page, size: 10 })
      .then(setData)
      .catch(() => setError('Không thể tải chương trình khuyến mại từ backend.'))
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => {
    fetchPromotions()
  }, [fetchPromotions])

  const handleDelete = async (id) => {
    if (!confirm('Xóa chương trình này? Hành động không thể hoàn tác.')) return
    try {
      await promotionsApi.remove(id)
      fetchPromotions()
    } catch (err) {
      alert(err.response?.data?.message || 'Xóa chương trình thất bại.')
    }
  }

  const handleSaved = () => {
    setEditing(null)
    fetchPromotions()
  }

  return (
    <div className="space-y-5">
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
            placeholder="Tìm kiếm chương trình..."
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
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="INACTIVE">Đã khóa</option>
        </select>
        <button
          onClick={() => setEditing({})}
          className="ml-auto flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Thêm chương trình
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-4 font-medium">Tên chương trình</th>
              <th className="p-4 font-medium">Loại giảm</th>
              <th className="p-4 font-medium">Ưu đãi</th>
              <th className="p-4 font-medium">Thời gian diễn ra</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  Đang tải...
                </td>
              </tr>
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  Chưa có chương trình khuyến mại nào.
                </td>
              </tr>
            ) : (
              data.items.map((promotion) => (
                <tr key={promotion.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="p-4">
                    <p className="font-medium text-slate-700">{promotion.name}</p>
                    <p className="text-xs text-slate-400 max-w-[260px]">{promotion.description || 'Không có mô tả'}</p>
                  </td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">
                    {promotion.discountType === 'PERCENT' ? 'Phần trăm' : 'Số tiền cố định'}
                  </td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{formatDiscount(promotion)}</td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">
                    {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyles[promotion.status]}`}>
                      {statusLabel[promotion.status] || promotion.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <button onClick={() => setEditing(promotion)} className="hover:text-brand-teal transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(promotion.id)} className="hover:text-red-500 transition-colors">
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
            Trang {data.page + 1} / {data.totalPages} - Tổng {data.totalElements} chương trình
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

      {editing && <PromotionForm initialValue={editing.id ? editing : null} onClose={() => setEditing(null)} onSaved={handleSaved} />}
    </div>
  )
}
