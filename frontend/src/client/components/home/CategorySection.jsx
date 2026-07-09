import { ChevronRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { productsApi } from '../../api/products.js'
import { resolveAssetUrl } from '../../api/http.js'
import { formatCurrency } from '../../utils/formatters.js'
import SectionHeading from './SectionHeading.jsx'
import { CLIENT_ROUTES } from '../../routes.js'
import { useCart } from '../../context/CartContext.jsx'

export default function CategorySection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    productsApi.list({ size: 6 })
      .then(res => setProducts(res.items || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="products" className="mx-auto max-w-[1280px] px-4 py-section-gap-mobile sm:px-6 lg:py-section-gap">
      <div className="mb-12 flex items-end justify-between gap-6">
        <SectionHeading eyebrow="New Arrivals" title="Sản phẩm mới nhất" align="left" />
        <Link to={CLIENT_ROUTES.products} className="hidden border-b border-on-surface-variant font-mono text-sm font-medium text-on-surface-variant transition hover:text-primary sm:inline-flex">
          Xem tất cả
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const mainImage = product.primaryImage || (product.images?.length > 0 ? product.images[0].imageUrl : '')
            const discount = product.oldPrice && product.oldPrice > product.price 
              ? `-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%` 
              : null

            return (
              <article key={product.id} className="group overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_48px_-12px_rgba(19,27,46,0.08)]">
                <div className="relative aspect-square overflow-hidden bg-surface">
                  {discount && (
                    <div className="absolute left-4 top-4 z-10 rounded-full bg-secondary px-3 py-1 font-mono text-xs font-medium text-on-primary">
                      {discount}
                    </div>
                  )}
                  <img src={resolveAssetUrl(mainImage)} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-primary line-clamp-1">{product.name}</h3>
                  <p className="mb-4 font-mono text-xs font-medium text-on-surface-variant line-clamp-1">{product.shortDescription}</p>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <span className={`text-[30px] font-semibold leading-[38px] ${discount ? 'text-secondary' : 'text-primary'}`}>
                      {formatCurrency(product.price)}
                    </span>
                    {product.oldPrice && <span className="font-mono text-xs text-outline line-through">{formatCurrency(product.oldPrice)}</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to={`/san-pham/${product.slug}`} className="flex items-center justify-center rounded-lg border border-primary py-3 font-mono text-sm font-medium text-primary transition hover:bg-primary hover:text-on-primary">
                      Xem chi tiết
                    </Link>
                    <button 
                      onClick={() => {
                        addItem({
                          id: product.slug,
                          productId: product.slug,
                          dbId: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          image: resolveAssetUrl(mainImage),
                          options: [],
                        })
                        alert('Đã thêm vào giỏ hàng')
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-mono text-sm font-medium text-on-primary transition hover:bg-primary/90"
                    >
                      Thêm vào giỏ <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
      
      {!loading && products.length > 0 && (
        <div className="mt-8 text-center sm:hidden">
          <Link to={CLIENT_ROUTES.products} className="inline-flex items-center justify-center rounded-lg border border-primary px-8 py-3 font-mono text-sm font-medium text-primary transition hover:bg-primary hover:text-on-primary">
            Xem tất cả sản phẩm
          </Link>
        </div>
      )}
    </section>
  )
}
