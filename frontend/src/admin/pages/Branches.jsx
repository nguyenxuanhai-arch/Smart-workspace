import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2, Pencil, X } from 'lucide-react'
import { storeLocationsApi } from '../api/storeLocations.js'

const emptyForm = { name: '', address: '', phone: '', latitude: '', longitude: '', googleMapUrl: '', status: 'ACTIVE' }

function BranchModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      name: form.name,
      address: form.address,
      phone: form.phone,
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
      googleMapUrl: form.googleMapUrl,
      status: form.status,
    }
    try {
      if (form.id) {
        await storeLocationsApi.update(form.id, payload)
      } else {
        await storeLocationsApi.create(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu chi nhánh thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-md w-full p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">{form.id ? 'Cập nhật chi nhánh' : 'Thêm chi nhánh mới'}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên chi nhánh</label>
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Địa chỉ</label>
          <input
            required
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Số điện thoại</label>
            <input
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
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
              <option value="INACTIVE">Tạm ngưng</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Latitude</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => update('latitude', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Longitude</label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => update('longitude', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Google Map URL</label>
          <input
            value={form.googleMapUrl}
            onChange={(e) => update('googleMapUrl', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-brand-teal hover:bg-brand-tealDark disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          {saving ? 'Đang lưu...' : 'Lưu chi nhánh'}
        </button>
      </form>
    </div>
  )
}

export default function Branches() {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalData, setModalData] = useState(null)

  const fetchBranches = useCallback(() => {
    setLoading(true)
    storeLocationsApi
      .list()
      .then(setBranches)
      .catch(() => setError('Không thể tải danh sách chi nhánh từ backend.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  const handleDelete = async (id) => {
    if (!confirm('Xóa chi nhánh này?')) return
    try {
      await storeLocationsApi.remove(id)
      fetchBranches()
    } catch (err) {
      alert(err.response?.data?.message || 'Xóa chi nhánh thất bại.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Quản Lý Chi Nhánh</h1>
        <button
          onClick={() => setModalData(emptyForm)}
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Thêm chi nhánh
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-4 font-medium">Tên chi nhánh</th>
              <th className="p-4 font-medium">Địa chỉ</th>
              <th className="p-4 font-medium">Số điện thoại</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  Đang tải...
                </td>
              </tr>
            ) : branches.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  Chưa có chi nhánh nào.
                </td>
              </tr>
            ) : (
              branches.map((b) => (
                <tr key={b.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="p-4 font-medium text-slate-700 whitespace-nowrap">{b.name}</td>
                  <td className="p-4 text-slate-600 max-w-xs">{b.address}</td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{b.phone}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        b.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {b.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm ngưng'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <button onClick={() => setModalData(b)} className="hover:text-brand-teal transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="hover:text-red-500 transition-colors">
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

      {modalData && (
        <BranchModal
          initial={modalData}
          onClose={() => setModalData(null)}
          onSaved={() => {
            setModalData(null)
            fetchBranches()
          }}
        />
      )}
    </div>
  )
}
