import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, ShieldCheck, Truck, Save, Plus } from 'lucide-react'
import { policiesApi } from '../api/policies.js'

const cards = [
  { type: 'RETURN', icon: RefreshCw, title: 'Đổi trả', desc: 'Quản lý chính sách đổi trả sản phẩm' },
  { type: 'WARRANTY', icon: ShieldCheck, title: 'Bảo hành', desc: 'Quản lý chính sách bảo hành sản phẩm' },
  { type: 'SHIPPING', icon: Truck, title: 'Vận chuyển', desc: 'Quản lý chính sách vận chuyển' },
]

function PolicyEditor({ type, policy, onSaved }) {
  const [title, setTitle] = useState(policy?.title || '')
  const [content, setContent] = useState(policy?.content || '')
  const [status, setStatus] = useState(policy?.status || 'ACTIVE')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setTitle(policy?.title || '')
    setContent(policy?.content || '')
    setStatus(policy?.status || 'ACTIVE')
  }, [policy])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (policy?.id) {
        await policiesApi.update(policy.id, { type, title, content, status })
      } else {
        await policiesApi.create({ type, title, content, status })
      }
      onSaved?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu chính sách thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">
          {policy?.id ? 'Cập nhật chính sách' : 'Tạo chính sách mới'}
        </h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
        >
          <option value="ACTIVE">Đang áp dụng</option>
          <option value="INACTIVE">Ngừng áp dụng</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Tiêu đề</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nội dung</label>
        <textarea
          required
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        {policy?.id ? <Save size={16} /> : <Plus size={16} />}
        {saving ? 'Đang lưu...' : policy?.id ? 'Lưu thay đổi' : 'Tạo chính sách'}
      </button>
    </form>
  )
}

export default function Policy() {
  const [active, setActive] = useState('RETURN')
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPolicies = useCallback(() => {
    setLoading(true)
    policiesApi
      .list()
      .then(setPolicies)
      .catch(() => setError('Không thể tải chính sách từ backend.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchPolicies()
  }, [fetchPolicies])

  const currentPolicy = policies.find((p) => p.type === active)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800">Quản Lý Chính Sách</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ type, icon: Icon, title, desc }) => {
          const isActive = active === type
          return (
            <button
              key={type}
              onClick={() => setActive(type)}
              className={`text-left p-5 rounded-xl border transition-colors bg-white ${
                isActive ? 'border-brand-teal ring-2 ring-brand-teal/30' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  isActive ? 'bg-brand-teal text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon size={18} />
              </div>
              <p className="font-semibold text-slate-800 mb-0.5">{title}</p>
              <p className="text-sm text-slate-400">{desc}</p>
            </button>
          )
        })}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-400">Đang tải...</p>
      ) : (
        <PolicyEditor type={active} policy={currentPolicy} onSaved={fetchPolicies} />
      )}
    </div>
  )
}
