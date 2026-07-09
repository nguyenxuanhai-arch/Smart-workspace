import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ChevronDown, ChevronRight, Eye, SlidersHorizontal, Star, XCircle, Loader2 } from 'lucide-react'
import ClientLayout from '../components/layout/ClientLayout.jsx'
import { CLIENT_ROUTES } from '../routes.js'
import { formatCurrency } from '../utils/formatters.js'
import { productsApi } from '../api/products.js'
import { resolveAssetUrl } from '../api/http.js'
import SEO from '../../components/SEO.jsx'

const categories = [
  { id: 'ban-thong-minh', label: 'Bàn thông minh' },
  { id: 'ghe-cong-thai-hoc', label: 'Ghế công thái học' },
  { id: 'phu-kien', label: 'Phụ kiện công nghệ' },
  { id: 'combo-workspace', label: 'Combo Workspace' },
]

const featureFilters = [
  { id: 'anti-collision', label: 'Chống va chạm' },
  { id: 'app-control', label: 'Điều khiển qua App' },
  { id: 'dual-motor', label: 'Dual Motor (Động cơ đôi)' },
]

const colorFilters = [
  { id: 'obsidian', label: 'Obsidian Black', className: 'bg-primary' },
  { id: 'silver', label: 'Stellar Silver', className: 'bg-[#E5E5E5]' },
  { id: 'oak', label: 'Natural Oak', className: 'bg-[#D4C4B7]' },
]

const products = [
  {
    id: 'lumina-desk-s1-pro',
    name: 'Lumina Desk S1 Pro',
    category: 'ban-thong-minh',
    price: 12500000,
    oldPrice: 15000000,
    rating: 5,
    reviewCount: 48,
    badge: 'New Arrival',
    badgeTone: 'blue',
    color: 'obsidian',
    features: ['dual-motor', 'anti-collision', 'app-control'],
    specs: ['Dual Motor', '120kg Load'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvigrwwTJhj6uu2qNwvFND2KltJirBzK79-YcTjmh0-sJuCFWW8yjPlewvJVgKZRyEfRcIhzLuepZxU0KCQOD-u5HlXr-R00UjoT0yxs3xYH_NxnDxtf2RbHXM4i3vVzSb41Ot4evulVGkYBOtonw_GW1UGvvh_dqsRQb6cp7qMXeS2JGhkTpd6qN2FVYxWWu2qq7A-SUe_kofmRmeKO3m3eBGSC6L1rsXLuHKDRL7P13YoZgze76FCA',
  },
  {
    id: 'aura-ergo-chair-gen-2',
    name: 'Aura Ergo Chair Gen 2',
    category: 'ghe-cong-thai-hoc',
    price: 8900000,
    rating: 4,
    reviewCount: 102,
    color: 'silver',
    features: ['anti-collision'],
    specs: ['4D Armrest', 'Lumbar Support'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAdivbNQzRh8PE7sw2kxnRHTTgsHda_lwj3w7hlF0muQsrtyISnjfLjBubZ1S0609w6MrCrTWScllBjiR1vtKGSDsI2sa0MLZG3iT3As_YI9LVnw7r3fk3rUDNf9u9-DW_Pl6-7hQDsKZq7Tr9J6B-Fi0OtQCekmpgceNtTQtyWwZv5ElvaT0V7ZsAm3KMBc-S6Pef6VR3y8KT6-ALWn0Gwd5xHdZnts6sTCHZ9y_dD2tP_GHtEoaCoRw',
  },
  {
    id: 'apex-monitor-arm',
    name: 'Apex Monitor Arm',
    category: 'phu-kien',
    price: 1850000,
    oldPrice: 2200000,
    rating: 5,
    reviewCount: 215,
    badge: '-15%',
    badgeTone: 'danger',
    color: 'silver',
    features: ['anti-collision'],
    specs: ['Gas Spring', '34" Support'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBlrRGSqjDv8HH_X9hDg0An9NZw7BL5HLXKSnES2FATLXM-5CcF3jJ5csfMSrri3llvgvR3PwPxicWAf6HBDa1M1KNcnlngNb386xUgTz9jKViDs3ue6g47DngzuZpRJqmNI7KE_B6DRDADRMZY3crw7WpOz-VQwNg0gtmDsgntuRqPBADvac0xHal0P3ybsGUahM3sWdUYQN84kXGkl4c11YlGF54SisHefhYMS0mgWzd1wDoJ7nPIvg',
  },
]

const comparisonRows = [
  ['Động cơ (Motor)', 'Single Motor', 'Dual High-Speed', 'Triple Ultra-Quiet'],
  ['Tải trọng tối đa', '80kg', '120kg', '180kg'],
  ['Chất liệu mặt bàn', 'Gỗ MDF cao cấp', 'Gỗ Sồi Tự Nhiên', 'Sợi Carbon / Đá Marble'],
]

const catalogTotal = 24

const splitParam = (value) => value?.split(',').filter(Boolean) ?? []

function FilterCheckbox({ checked, label, onChange }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-outline text-primary focus:ring-primary"
      />
      <span className={`text-base leading-6 transition-colors group-hover:text-secondary ${checked ? 'text-on-surface' : 'text-on-surface-variant'}`}>
        {label}
      </span>
    </label>
  )
}

function Rating({ value, count }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          className={index < value ? 'fill-[#FFB800] text-[#FFB800]' : 'fill-border-subtle text-border-subtle'}
        />
      ))}
      <span className="ml-1 font-mono text-xs text-on-surface-variant">({count})</span>
    </div>
  )
}

import { useCart } from '../context/CartContext.jsx'

function ProductCard({ product }) {
  const [added, setAdded] = useState(false)
  const badgeClass = product.badgeTone === 'danger' ? 'bg-danger text-white' : 'bg-secondary text-white'
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      dbId: product.dbId,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      options: [['Loại', product.specs.join(' / ')]],
    })
    setAdded(true)
  }

  return (
    <article className="group overflow-hidden rounded-lg bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(19,27,46,0.08)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
        {product.badge && (
          <div className="absolute left-4 top-4 z-10">
            <span className={`rounded-full px-3 py-1 font-mono text-xs font-medium ${badgeClass}`}>{product.badge}</span>
          </div>
        )}
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-end justify-center bg-black/5 px-4 pb-8 opacity-100 transition duration-300 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 rounded-lg py-3 font-mono text-sm font-medium text-white transition hover:opacity-90 ${
                added ? 'bg-secondary' : 'bg-primary'
              }`}
            >
              {added ? 'Đã thêm' : 'Thêm vào giỏ'}
            </button>
            <Link to={`/san-pham/${product.id}`} className="flex h-12 w-12 items-center justify-center rounded-lg border border-border-subtle bg-white text-primary transition hover:bg-surface">
              <Eye size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
      <div className="space-y-2 pt-6">
        <div className="flex flex-wrap gap-2">
          {product.specs.map((spec, index) => (
            <span
              key={spec}
              className={`rounded px-2 py-0.5 font-mono text-xs font-medium ${
                index === 0 ? 'bg-tertiary/15 text-emerald-700' : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {spec}
            </span>
          ))}
        </div>
        <Link to={`/san-pham/${product.id}`} className="block text-xl font-semibold text-primary transition-colors group-hover:text-secondary">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} />
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-[22px] font-semibold leading-7 text-primary">{formatCurrency(product.price)}</span>
          {product.oldPrice && <span className="text-base leading-6 text-outline line-through">{formatCurrency(product.oldPrice)}</span>}
        </div>
      </div>
    </article>
  )
}

function ProductFilters({ selectedCategories, selectedFeatures, selectedColor, priceLimit, onCategoryToggle, onFeatureToggle, onColorSelect, onPriceChange }) {
  return (
    <aside className="space-y-10 lg:sticky lg:top-36 lg:self-start">
      <div>
        <h2 className="mb-4 border-b border-border-subtle pb-2 font-mono text-sm font-medium uppercase text-primary">
          Danh mục
        </h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <FilterCheckbox
              key={category.id}
              label={category.label}
              checked={selectedCategories.includes(category.id)}
              onChange={() => onCategoryToggle(category.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 border-b border-border-subtle pb-2 font-mono text-sm font-medium uppercase text-primary">
          Khoảng giá
        </h2>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="50000000"
            step="1000000"
            value={priceLimit}
            onChange={(event) => onPriceChange(Number(event.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-high accent-primary"
          />
          <div className="flex items-center justify-between font-mono text-xs text-on-surface-variant">
            <span>0đ</span>
            <span>{formatCurrency(priceLimit)}+</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 border-b border-border-subtle pb-2 font-mono text-sm font-medium uppercase text-primary">
          Tính năng kỹ thuật
        </h2>
        <div className="space-y-3">
          {featureFilters.map((feature) => (
            <FilterCheckbox
              key={feature.id}
              label={feature.label}
              checked={selectedFeatures.includes(feature.id)}
              onChange={() => onFeatureToggle(feature.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 border-b border-border-subtle pb-2 font-mono text-sm font-medium uppercase text-primary">
          Màu sắc
        </h2>
        <div className="flex flex-wrap gap-3">
          {colorFilters.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              aria-label={color.label}
              onClick={() => onColorSelect(selectedColor === color.id ? '' : color.id)}
              className={`h-8 w-8 rounded-full border border-white ${color.className} ${
                selectedColor === color.id ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-outline hover:ring-offset-2'
              }`}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}

function ComparisonTable() {
  return (
    <section className="mt-section-gap-mobile lg:mt-section-gap">
      <div className="mb-12 text-center">
        <h2 className="mb-2 text-[30px] font-semibold leading-[38px] text-primary">So sánh các dòng sản phẩm</h2>
        <p className="text-base leading-6 text-on-surface-variant">Tìm kiếm giải pháp phù hợp nhất với nhu cầu kỹ thuật của bạn.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border-subtle bg-white shadow-sm">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-container-low">
              <th className="p-6 font-mono text-sm font-medium uppercase text-primary">Tính năng</th>
              <th className="p-6 text-center text-lg font-semibold text-primary">Lumina S1</th>
              <th className="border-x border-border-subtle bg-blue-50 p-6 text-center text-lg font-semibold text-primary">Lumina S2 Pro</th>
              <th className="p-6 text-center text-lg font-semibold text-primary">Lumina Enterprise</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {comparisonRows.map(([feature, s1, s2, enterprise]) => (
              <tr key={feature}>
                <td className="p-6 text-base leading-6 text-primary">{feature}</td>
                <td className="p-6 text-center text-base text-on-surface-variant">{s1}</td>
                <td className="border-x border-border-subtle bg-blue-50/70 p-6 text-center text-base font-semibold text-primary">{s2}</td>
                <td className="p-6 text-center text-base text-on-surface-variant">{enterprise}</td>
              </tr>
            ))}
            <tr>
              <td className="p-6 text-base leading-6 text-primary">Kết nối App</td>
              <td className="p-6 text-center text-on-surface-variant">
                <XCircle className="mx-auto text-outline" size={22} strokeWidth={1.5} />
              </td>
              <td className="border-x border-border-subtle bg-blue-50/70 p-6 text-center text-primary">
                <CheckCircle2 className="mx-auto text-secondary" size={22} strokeWidth={1.5} />
              </td>
              <td className="p-6 text-center text-on-surface-variant">
                <CheckCircle2 className="mx-auto text-secondary" size={22} strokeWidth={1.5} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [selectedColor, setSelectedColor] = useState('')
  const [priceLimit, setPriceLimit] = useState(50000000)
  const [sort, setSort] = useState('popular')
  const selectedCategories = splitParam(searchParams.get('category'))
  const [apiProducts, setApiProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsApi.list({ size: 100 })
      .then((res) => {
        const mapped = (res.items || []).map(p => {
          const mainImage = p.primaryImage || (p.images?.length > 0 ? p.images[0].imageUrl : '')
          return {
            id: p.slug,
            dbId: p.id,
            name: p.name,
            category: p.category?.slug || '',
            price: p.price,
            oldPrice: p.oldPrice,
            rating: 5,
            reviewCount: 0,
            badge: p.oldPrice && p.oldPrice > p.price ? `-${Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%` : null,
            badgeTone: 'danger',
            color: 'obsidian', // placeholder for now
            features: ['anti-collision'], // placeholder for now
            specs: [p.sku || 'N/A'],
            image: resolveAssetUrl(mainImage)
          }
        })
        setApiProducts(mapped)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const updateCategories = (nextCategories) => {
    const nextParams = new URLSearchParams(searchParams)
    if (nextCategories.length > 0) {
      nextParams.set('category', nextCategories.join(','))
    } else {
      nextParams.delete('category')
    }
    setSearchParams(nextParams)
  }

  const toggleCategory = (categoryId) => {
    const nextCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]
    updateCategories(nextCategories)
  }

  const toggleFeature = (featureId) => {
    setSelectedFeatures((current) => (current.includes(featureId) ? current.filter((id) => id !== featureId) : [...current, featureId]))
  }

  const visibleProducts = useMemo(() => {
    const filtered = apiProducts.filter((product) => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesFeatures = selectedFeatures.length === 0 || selectedFeatures.every((feature) => product.features.includes(feature))
      const matchesColor = !selectedColor || product.color === selectedColor
      const matchesPrice = product.price <= priceLimit

      return matchesCategory && matchesFeatures && matchesColor && matchesPrice
    })

    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'newest') return a.badge === 'New Arrival' ? -1 : 1
      return b.reviewCount - a.reviewCount
    })
  }, [apiProducts, priceLimit, selectedCategories, selectedColor, selectedFeatures, sort])

  return (
    <ClientLayout>
      <SEO 
        title="Tất cả sản phẩm" 
        description="Khám phá hệ sinh thái nội thất thông minh được thiết kế với độ chính xác cơ khí, hỗ trợ sức khỏe và tối ưu hóa quy trình làm việc chuyên nghiệp."
      />
      <main className="mx-auto max-w-[1280px] px-4 pb-section-gap-mobile pt-28 sm:px-6 lg:pb-section-gap lg:pt-32">
        <header className="mb-12 lg:mb-16">
          <nav className="mb-6 flex items-center gap-2">
            <Link to={CLIENT_ROUTES.home} className="font-mono text-xs font-medium text-on-surface-variant transition hover:text-secondary">
              Trang chủ
            </Link>
            <ChevronRight size={14} strokeWidth={1.5} className="text-outline" />
            <span className="font-mono text-xs font-medium text-primary">Tất cả sản phẩm</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs font-medium uppercase text-secondary">
              <SlidersHorizontal size={16} strokeWidth={1.5} /> Precision catalog
            </p>
            <h1 className="mb-4 text-[40px] font-semibold leading-[48px] text-primary sm:text-[48px] sm:leading-[56px]">
              Nâng tầm hiệu suất công việc.
            </h1>
            <p className="text-lg leading-7 text-on-surface-variant">
              Khám phá hệ sinh thái nội thất thông minh được thiết kế với độ chính xác cơ khí, hỗ trợ sức khỏe và tối ưu hóa quy trình làm việc chuyên nghiệp.
            </p>
          </div>
        </header>

        <div className="grid gap-12 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-gutter">
          <ProductFilters
            selectedCategories={selectedCategories}
            selectedFeatures={selectedFeatures}
            selectedColor={selectedColor}
            priceLimit={priceLimit}
            onCategoryToggle={toggleCategory}
            onFeatureToggle={toggleFeature}
            onColorSelect={setSelectedColor}
            onPriceChange={setPriceLimit}
          />

          <section>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-base leading-6 text-on-surface-variant">
                <span className="font-bold text-primary">{visibleProducts.length || 0}</span> / {apiProducts.length} sản phẩm được tìm thấy
              </p>
              <label className="flex items-center gap-4">
                <span className="font-mono text-sm font-medium text-on-surface-variant">Sắp xếp:</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="cursor-pointer border-0 bg-transparent py-1 pr-8 font-mono text-sm font-medium text-primary focus:ring-0"
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>
              </label>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : visibleProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-gutter gap-y-12 md:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border-subtle bg-white p-10 text-center">
                <p className="text-xl font-semibold text-primary">Không tìm thấy sản phẩm phù hợp.</p>
                <p className="mt-2 text-base leading-6 text-on-surface-variant">Thử bỏ bớt bộ lọc hoặc mở rộng khoảng giá.</p>
              </div>
            )}

            <div className="mt-20 flex flex-col items-center gap-4">
              <button className="group inline-flex items-center gap-3 rounded-lg border border-primary px-8 py-4 font-mono text-sm font-medium text-primary transition duration-300 hover:bg-primary hover:text-white">
                Tải thêm sản phẩm
                <ChevronDown size={18} strokeWidth={1.5} className="transition duration-500 group-hover:rotate-180" />
              </button>
              <p className="font-mono text-xs text-on-surface-variant">Hiển thị {visibleProducts.length} trên {apiProducts.length} sản phẩm</p>
              <div className="h-1 w-64 overflow-hidden rounded-full bg-surface-container">
                <div className="h-full w-[12.5%] bg-primary" />
              </div>
            </div>
          </section>
        </div>

        <ComparisonTable />
      </main>
    </ClientLayout>
  )
}
