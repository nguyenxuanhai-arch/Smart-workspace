import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, UploadCloud, Loader2 } from 'lucide-react'
import { productsApi } from '../api/products.js'
import { categoriesApi } from '../api/categories.js'
import { uploadsApi } from '../api/uploads.js'
import { resolveAssetUrl } from '../api/http.js'

const slugify = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function ProductForm({ categories, editId, onSaved }) {
  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    price: '',
    oldPrice: '',
    stockQuantity: '',
    sku: '',
    status: 'ACTIVE',
    imageUrls: [],
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (!editId) return
    productsApi.getById(editId).then((p) => {
      setForm({
        categoryId: p.category?.id || '',
        name: p.name || '',
        slug: p.slug || '',
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        price: p.price ?? '',
        oldPrice: p.oldPrice ?? '',
        stockQuantity: p.stockQuantity ?? '',
        sku: p.sku || '',
        status: p.status || 'ACTIVE',
        imageUrls: (p.images || []).map((i) => i.imageUrl),
      })
      setSlugTouched(true)
    })
  }, [editId])

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleNameChange = (value) => {
    update('name', value)
    if (!slugTouched) update('slug', slugify(value))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const res = await uploadsApi.uploadProductImage(file)
      update('imageUrls', [...form.imageUrls, res.url])
    } catch (err) {
      setError(err.response?.data?.message || 'Upload ảnh thất bại.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (url) => update('imageUrls', form.imageUrls.filter((u) => u !== url))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      categoryId: Number(form.categoryId),
      name: form.name,
      slug: form.slug,
      shortDescription: form.shortDescription,
      description: form.description,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stockQuantity: Number(form.stockQuantity),
      sku: form.sku,
      status: form.status,
      imageUrls: form.imageUrls,
    }
    try {
      if (editId) {
        await productsApi.update(editId, payload)
      } else {
        await productsApi.create(payload)
      }
      onSaved?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu sản phẩm thất bại. Kiểm tra lại thông tin.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên sản phẩm</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Ví dụ: Bàn nâng hạ thông minh"
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Danh mục</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => update('categoryId', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.parentName ? `${c.parentName} / ${c.name}` : c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU</label>
          <input
            type="text"
            required
            value={form.sku}
            onChange={(e) => update('sku', e.target.value)}
            placeholder="SW-DESK-001"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Giá bán</label>
          <input
            type="number"
            required
            min="0"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Giá cũ</label>
          <input
            type="number"
            min="0"
            value={form.oldPrice}
            onChange={(e) => update('oldPrice', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tồn kho</label>
          <input
            type="number"
            required
            min="0"
            value={form.stockQuantity}
            onChange={(e) => update('stockQuantity', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả ngắn</label>
        <input
          type="text"
          value={form.shortDescription}
          onChange={(e) => update('shortDescription', e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả chi tiết</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh sản phẩm</label>
        <div className="grid grid-cols-4 gap-3">
          {form.imageUrls.map((url) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 group">
              <img src={resolveAssetUrl(url)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-white/90 rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-brand-teal hover:text-brand-teal transition-colors cursor-pointer">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
            <span className="text-xs">{uploading ? 'Đang tải...' : 'Tải ảnh lên'}</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Trạng thái</label>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="ACTIVE">Hiển thị (ACTIVE)</option>
            <option value="INACTIVE">Ẩn (INACTIVE)</option>
            <option value="OUT_OF_STOCK">Hết hàng (OUT_OF_STOCK)</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-brand-teal hover:bg-brand-tealDark disabled:opacity-60 text-white text-sm font-medium transition-colors"
        >
          {saving ? 'Đang lưu...' : editId ? 'Cập Nhật Sản Phẩm' : 'Đăng Sản Phẩm'}
        </button>
      </div>
    </form>
  )
}

function CategoryPanel({ categories, onChanged }) {
  const [form, setForm] = useState({ parentId: '', name: '', slug: '', description: '', status: 'ACTIVE' })
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleNameChange = (value) => {
    update('name', value)
    if (!slugTouched) update('slug', slugify(value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await categoriesApi.create({
        parentId: form.parentId ? Number(form.parentId) : undefined,
        name: form.name,
        slug: form.slug,
        description: form.description,
        status: form.status,
      })
      setForm({ parentId: '', name: '', slug: '', description: '', status: 'ACTIVE' })
      setSlugTouched(false)
      onChanged?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo danh mục thất bại.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa danh mục này?')) return
    try {
      await categoriesApi.remove(id)
      onChanged?.()
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa danh mục (có thể đang có sản phẩm).')
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-800">Thêm danh mục mới</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên danh mục</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ví dụ: Bàn ghế văn phòng"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Danh mục cha (nếu có)</label>
          <select
            value={form.parentId}
            onChange={(e) => update('parentId', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="">-- Không có --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-teal resize-none"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          {saving ? 'Đang lưu...' : 'Thêm danh mục'}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">Danh sách danh mục ({categories.length})</h3>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">{c.name}</p>
                <p className="text-xs text-slate-400">{c.parentName ? `Thuộc: ${c.parentName}` : 'Danh mục gốc'}</p>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="px-5 py-6 text-center text-sm text-slate-400">Chưa có danh mục nào.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AddProduct() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const editId = searchParams.get('editId')
  const [categories, setCategories] = useState([])

  const loadCategories = () => categoriesApi.list().then(setCategories).catch(() => {})

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800">
        {editId ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm'} &amp; Quản Lý Danh Mục
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ProductForm
          categories={categories}
          editId={editId}
          onSaved={() => navigate('/san-pham')}
        />
        <CategoryPanel categories={categories} onChanged={loadCategories} />
      </div>
    </div>
  )
}
