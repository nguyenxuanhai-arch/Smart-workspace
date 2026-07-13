import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, CreditCard, MessageCircle, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck, Loader2, X } from 'lucide-react'
import ClientLayout from '../components/layout/ClientLayout.jsx'
import { CLIENT_ROUTES } from '../routes.js'
import { formatCurrency } from '../utils/formatters.js'
import { productsApi } from '../api/products.js'
import { reviewsApi } from '../api/reviews.js'
import { resolveAssetUrl } from '../api/http.js'
import { saveBuyNowDraft } from '../utils/buyNowCheckout.js'
import SEO from '../../components/SEO.jsx'

const gallery = [
  {
    label: 'Bàn làm việc',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwHdVgmp4YVFNyGnSnnQ-aD7julD6itRGe3UQEewW1o1JD1kfwl77Fw3-F3LulY4DgfR3aGB1EaO8HtDVGobAeCuy4cVG2IoYJ_6T_HrfPXqXdNHi43zPefsBYaQGObzcaHpzjM8AmCPKSlnNafvq0gIfpPR5TcS01yz0lM6w_IiBNTNbfF1Y6sNwFrEyxjfoImRAlWsSae8qbnW0l61Z53f0UUhOx5jOOhyJE9k5AfW_M0mO3bhwXFw',
  },
  {
    label: 'Bảng điều khiển',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBkG8aVqp2_hcN5gbk1WQCcikmJemSSOlZFWOj_DCW9xSVBcYLvPicuCSR2CW-hHe1ZwfnJqJSXxAMICf-cf-ik1u8YN_AMwk6W_kCJlYm0S0IRhcgn-MQCpo-wiiFrWz60pp1JufbAPHuvjpdWFts6dnmKAD9LNVpwn9xTehx2TmM49KBtnahPN2STgWebHI9LzkwQEA2jyJEsfz_2ohtWx3m7LIJFLk-xvsZFJ7ayveBVrpEKBRDhQ',
  },
  {
    label: 'Khung chân',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALU12MFEkjpt-tUPQOdzeOteJoLDxcOOFfAfPaQQi1lEVfVPTDmMb017J3qcYOWAzuKnQnKsmzq6GC_6wK-Wqi8fX__TfFY2zB4t8ujL3uxXgX25B5LrDUfYuaHdGTxw0t-9bSirHZeLtEZrAgcFidZOILrl9iFPzIZbz99at_BCN0YvXFExBCIq4zoSDuztcQH-Q-fqgKM-YMzUaFCy88TzBKjteryvgs3WgCz9IW4u5TARJa9RAWQA',
  },
  {
    label: 'Mặt bàn',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAglb8WJevGScfGy8TihonTYcDQQZU_DrWdJLpuMS5JumsnVhHZJfOeDaYVCYC8LKD0mR5Jy6Gqp6Ft_qgC7sADvrI_ueFWFuFUUVUOxBiu4bNrYjdWE_NPGLh722ziPwL-EQHy9g_PSWHj1YOjtmLdtwrE3JhrTmFf7nRLqjglOtPKBPGaIbNH6G7KeuZ4Oyz5LAYKWIiHXC4QKQMM7vgkSgD4AyIFlBYAKIeyXFqjZm8xxi1xej0H8A',
  },
  {
    label: 'Quản lý dây',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqYEyzK1JYNLZ53W8rLkORfpZO0qraw9RyODP8OaQVv6O_7Rbt9J3eKY_wdYb69weDYBpK4nAvK6-0P_7M9Bghg33Dd7q-ToKmb1x5kDk6a-LNOy0PmjYy3lWtVSe0_QfVrgFgH_JlTOAD_O9lrIMe8DQPbPcYGRJlC1BDrxzAV2XirkvyYBiX_qjOFR3eKmvUbb2QjUYAqOLklxOTexDxopKjOf5gwN9OxPg0Yscs0Vj2Sal-q57SKw',
  },
]

const sizes = ['120x60cm', '140x70cm', '160x80cm']
const topColors = [
  { name: 'Trắng', className: 'bg-white' },
  { name: 'Đen', className: 'bg-black' },
  { name: 'Gỗ sồi', className: 'bg-[#d2b48c]' },
  { name: 'Gỗ óc chó', className: 'bg-[#5c4033]' },
]
const frameColors = [
  { name: 'Trắng', className: 'bg-white' },
  { name: 'Đen', className: 'bg-black' },
  { name: 'Xám', className: 'bg-gray-500' },
]

const formatReviewDate = (iso) =>
  iso
    ? new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(iso))
    : ''

function ReviewStars({ rating, size = 16 }) {
  const roundedRating = Math.round(Number(rating) || 0)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          className={index < roundedRating ? 'fill-primary text-primary' : 'fill-border-subtle text-border-subtle'}
        />
      ))}
    </div>
  )
}

import { useCart } from '../context/CartContext.jsx'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState(sizes[0])
  const [topColor, setTopColor] = useState(topColors[3])
  const [frameColor, setFrameColor] = useState(frameColors[1])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const { addItem } = useCart()
  
  const displayPrice = product?.price || 8500000
  const displayOldPrice = product?.oldPrice || 10000000
  
  const total = useMemo(() => displayPrice * quantity, [displayPrice, quantity])
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0
    return reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length
  }, [reviews])
  const descriptionBlocks = useMemo(() => {
    const description = product?.description || product?.shortDescription || ''
    return description
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean)
  }, [product?.description, product?.shortDescription])

  useEffect(() => {
    setLoading(true)
    productsApi.getBySlug(slug)
      .then(res => {
        setProduct(res)
        setActiveImage(0)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!product?.id) {
      setReviews([])
      return
    }

    setReviewsLoading(true)
    reviewsApi.listByProduct(product.id)
      .then((res) => setReviews(Array.isArray(res) ? res : []))
      .catch((err) => {
        console.error(err)
        setReviews([])
      })
      .finally(() => setReviewsLoading(false))
  }, [product?.id])

  useEffect(() => {
    setAdded(false)
  }, [frameColor.name, quantity, size, topColor.name])

  const dynamicGallery = useMemo(() => {
    if (!product || !product.images || product.images.length === 0) return gallery
    return product.images.map(img => ({
      label: img.altText || product.name,
      image: resolveAssetUrl(img.imageUrl)
    }))
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: `${product.slug}-${size}-${topColor.name}-${frameColor.name}`,
      productId: product.slug, // fallback for local storage
      dbId: product.id, // For API call
      name: product.name,
      price: displayPrice,
      quantity,
      image: dynamicGallery[0]?.image || '',
      options: [
        ['Mặt bàn', topColor.name],
        ['Khung', frameColor.name],
        ['Kích thước', size],
      ],
    })
    setAdded(true)
  }

  const handleBuyNow = () => {
    if (!product) return
    saveBuyNowDraft({
      id: `${product.slug}-${size}-${topColor.name}-${frameColor.name}`,
      productId: product.id,
      name: product.name,
      price: displayPrice,
      quantity,
      image: dynamicGallery[0]?.image || '',
      options: [
        ['Mặt bàn', topColor.name],
        ['Khung', frameColor.name],
        ['Kích thước', size],
      ],
    })
    navigate(`${CLIENT_ROUTES.checkout}?mode=buy-now`)
  }

  if (loading) {
    return (
      <ClientLayout>
        <main className="mx-auto flex max-w-[1280px] items-center justify-center px-4 pb-section-gap-mobile pt-32 sm:px-6 lg:pb-section-gap lg:pt-36">
          <Loader2 className="animate-spin text-primary" size={32} />
        </main>
      </ClientLayout>
    )
  }

  if (!product) {
    return (
      <ClientLayout>
        <main className="mx-auto max-w-[1280px] px-4 pb-section-gap-mobile pt-32 text-center sm:px-6 lg:pb-section-gap lg:pt-36">
          <h1 className="text-2xl font-bold text-primary">Sản phẩm không tồn tại</h1>
          <Link to={CLIENT_ROUTES.products} className="mt-4 inline-block text-secondary underline">Quay lại danh mục</Link>
        </main>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <SEO 
        title={product.name} 
        description={product.shortDescription || `Mua ${product.name} chính hãng tại Smart Workspace`} 
        image={dynamicGallery[0]?.image}
      />
      <main className="mx-auto max-w-[1280px] px-4 pb-section-gap-mobile pt-32 sm:px-6 lg:pb-section-gap lg:pt-36">
        <nav className="mb-8 flex items-center gap-2 font-mono text-xs font-medium text-on-surface-variant">
          <Link to={CLIENT_ROUTES.home} className="transition hover:text-primary">Trang chủ</Link>
          <ChevronRight size={14} strokeWidth={1.5} />
          <Link to={`${CLIENT_ROUTES.products}?category=${product.category?.slug}`} className="transition hover:text-primary">{product.category?.name || 'Sản phẩm'}</Link>
          <ChevronRight size={14} strokeWidth={1.5} />
          <span className="text-primary">{product.name}</span>
        </nav>

        <section className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-7">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-surface-container-low p-4 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.06)] sm:p-8">
              <img 
                src={dynamicGallery[activeImage]?.image} 
                alt={dynamicGallery[activeImage]?.label} 
                className="h-full w-full cursor-pointer rounded object-cover" 
                onClick={() => setIsImageModalOpen(true)}
              />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-3 sm:gap-4">
              {dynamicGallery.map((item, index) => (
                <button
                  key={item.label + index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`aspect-square overflow-hidden rounded border bg-surface-container-low transition ${
                    activeImage === index ? 'border-secondary' : 'border-border-subtle opacity-70 hover:border-secondary hover:opacity-100'
                  }`}
                >
                  <img src={item.image} alt={item.label} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:col-span-5">
            <div className="mb-2">
              {product.oldPrice && product.oldPrice > product.price ? (
                <span className="rounded bg-danger px-2 py-1 font-mono text-xs font-medium text-white">-{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>
              ) : (
                <span className="rounded bg-secondary-container px-2 py-1 font-mono text-xs font-medium text-white">Sản phẩm mới</span>
              )}
            </div>
            <h1 className="mb-2 text-[40px] font-semibold leading-[48px] text-primary sm:text-[48px] sm:leading-[56px]">
              {product.name}
            </h1>
            <div className="mb-6 flex items-center gap-4 border-b border-border-subtle pb-6">
              <div className="flex items-center text-primary">
                <ReviewStars rating={averageRating} size={20} />
                <span className="ml-2 font-mono text-sm font-bold">{reviews.length > 0 ? averageRating.toFixed(1) : '0.0'}</span>
              </div>
              <span className="font-mono text-xs text-on-surface-variant underline decoration-border-subtle">
                ({reviews.length} đánh giá)
              </span>
            </div>

            <div className="mb-8 flex items-end gap-4">
              <span className="text-[30px] font-semibold leading-[38px] text-primary">{formatCurrency(displayPrice)}</span>
              {displayOldPrice > displayPrice && (
                <span className="mb-1 text-base leading-6 text-outline line-through">{formatCurrency(displayOldPrice)}</span>
              )}
            </div>
            
            {product.shortDescription && (
              <p className="mb-8 text-base leading-6 text-on-surface-variant">
                {product.shortDescription}
              </p>
            )}

            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="font-mono text-sm font-medium text-on-surface">Kích thước</span>
                <button type="button" className="font-mono text-xs text-secondary underline transition hover:opacity-80">Hướng dẫn chọn size</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    className={`rounded py-3 text-center font-mono text-sm font-medium transition ${
                      size === option ? 'border-2 border-secondary bg-white text-primary' : 'border border-border-subtle bg-white text-on-surface-variant hover:border-secondary'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <span className="mb-3 block font-mono text-sm font-medium text-on-surface">
                Màu mặt bàn: <strong>{topColor.name}</strong>
              </span>
              <div className="flex gap-3">
                {topColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    aria-label={color.name}
                    onClick={() => setTopColor(color)}
                    className={`h-10 w-10 rounded-full border border-border-subtle transition hover:scale-105 ${color.className} ${
                      topColor.name === color.name ? 'ring-2 ring-secondary ring-offset-2' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <span className="mb-3 block font-mono text-sm font-medium text-on-surface">
                Màu khung chân: <strong>{frameColor.name}</strong>
              </span>
              <div className="flex gap-3">
                {frameColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    aria-label={color.name}
                    onClick={() => setFrameColor(color)}
                    className={`h-10 w-10 rounded border border-border-subtle transition hover:scale-105 ${color.className} ${
                      frameColor.name === color.name ? 'ring-2 ring-secondary ring-offset-2' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-border-subtle pt-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex h-14 w-32 rounded border border-border-subtle">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex w-10 items-center justify-center text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary">
                    <Minus size={16} strokeWidth={1.5} />
                  </button>
                  <span className="flex flex-1 items-center justify-center font-mono text-sm font-medium">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => value + 1)} className="flex w-10 items-center justify-center text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary">
                    <Plus size={16} strokeWidth={1.5} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex h-14 flex-1 items-center justify-center gap-2 rounded font-mono text-sm font-medium text-on-primary transition hover:opacity-90 ${
                    added ? 'bg-secondary' : 'bg-primary'
                  }`}
                >
                  <ShoppingCart size={25} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex h-14 flex-1 items-center justify-center gap-2 rounded border border-secondary bg-surface font-mono text-sm font-medium text-secondary transition hover:bg-surface-container-low"
                >
                  <CreditCard size={18} strokeWidth={1.5} />
                  Mua ngay
                </button>
              </div>
              <button type="button" className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded border border-secondary font-mono text-sm font-medium text-secondary transition hover:bg-surface-container-low">
                <MessageCircle size={18} strokeWidth={1.5} />
                Tư vấn qua Zalo
              </button>

              <div className="mt-4 text-right font-mono text-xs text-on-surface-variant">Tạm tính: {formatCurrency(total)}</div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-on-surface-variant">
                <span className="flex items-center gap-1"><Truck size={16} strokeWidth={1.5} /> Miễn phí vận chuyển</span>
                <span className="flex items-center gap-1"><ShieldCheck size={16} strokeWidth={1.5} /> Bảo hành 5 năm</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-section-gap-mobile grid gap-10 border-t border-border-subtle pt-12 lg:mt-section-gap lg:grid-cols-[minmax(0,1fr)_420px]">
          <article>
            <p className="mb-3 font-mono text-xs font-medium uppercase text-secondary">Thông tin chi tiết</p>
            <h2 className="mb-6 text-[30px] font-semibold leading-[38px] text-primary">Mô tả sản phẩm</h2>
            {descriptionBlocks.length > 0 ? (
              <div className="space-y-4 text-base leading-7 text-on-surface-variant">
                {descriptionBlocks.map((block) => (
                  <p key={block}>{block}</p>
                ))}
              </div>
            ) : (
              <p className="text-base leading-7 text-on-surface-variant">Thông tin chi tiết của sản phẩm đang được cập nhật.</p>
            )}
          </article>

          <aside>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 font-mono text-xs font-medium uppercase text-secondary">Đánh giá sản phẩm</p>
                <h2 className="text-[30px] font-semibold leading-[38px] text-primary">
                  {reviews.length > 0 ? `${averageRating.toFixed(1)}/5` : 'Chưa có đánh giá'}
                </h2>
              </div>
              <div className="text-right">
                <ReviewStars rating={averageRating} size={18} />
                <p className="mt-2 font-mono text-xs text-on-surface-variant">{reviews.length} đánh giá hiển thị</p>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="flex justify-center rounded-lg border border-border-subtle bg-white py-10">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-lg border border-border-subtle bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-mono text-sm font-bold text-primary">{review.userFullName || 'Khách hàng'}</h3>
                        <p className="mt-1 font-mono text-[11px] text-on-surface-variant">{formatReviewDate(review.createdAt)}</p>
                      </div>
                      <ReviewStars rating={review.rating} />
                    </div>
                    {review.content && (
                      <p className="text-base leading-6 text-on-surface-variant">"{review.content}"</p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border-subtle bg-white p-6 text-center">
                <p className="font-mono text-sm text-on-surface-variant">Sản phẩm này chưa có đánh giá.</p>
              </div>
            )}
          </aside>
        </section>
      </main>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button 
            type="button"
            className="absolute right-4 top-4 text-white hover:text-gray-300 sm:right-8 sm:top-8"
            onClick={() => setIsImageModalOpen(false)}
          >
            <X size={32} />
          </button>
          <img 
            src={dynamicGallery[activeImage]?.image} 
            alt={dynamicGallery[activeImage]?.label}
            className="max-h-[90vh] max-w-[90vw] cursor-default rounded object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </ClientLayout>
  )
}
