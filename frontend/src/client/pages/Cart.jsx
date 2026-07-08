import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, LockKeyhole, Minus, Plus, ShieldCheck, Trash2, Loader2 } from 'lucide-react'
import ClientLayout from '../components/layout/ClientLayout.jsx'
import { CLIENT_ROUTES } from '../routes.js'
import { formatCurrency } from '../utils/formatters.js'

const initialItems = [
  {
    id: 'smart-standing-desk-s1',
    name: 'Smart Standing Desk S1',
    price: 15500000,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBReaKbCB0PiDmZxpTzp8bhMnCGYlmmR-lFMCZ91pChFAI2arztTakpNqIm8lXdV5AulqQOF3kuZq8sgEORuZgCGYMrq2cuM3aeo0WJtnB5fdblSMJPb3TxgE7XJO4AtgI2PseRSYfhCwMzccAjZWyFa8IpETCLrTxnG-Msd97VhOUYv2RZQxVAuA2VqRoIRVeeB-Hu5489gLqTVjR7en8GfwVuva-2uvQPU0eq-tmo4nMXEeco6_1OpA',
    options: [
      ['Mặt bàn', 'Walnut top'],
      ['Khung', 'Black frame'],
      ['Kích thước', '120x60cm'],
    ],
  },
  {
    id: 'monitor-light-bar',
    name: 'Monitor Light Bar',
    price: 1250000,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXyD_PChULakPW8FThaARqy-LPdsNvoT9Z9vc4wtsiIOW6MtIMDsw8fzELEj45U4FM53K3_sW_zqGm_TMTCFDDB55cJRy9iKASC4F_xG2IQnojF2w7sumBOHhMdYGFD34AnY8RdXHZARBihKiOPFbPQ-AlRTGt9hBzrvDHA1Tufr5jgBX7fnhhn2UDSR_-SPmlJN0RrghllnXiE8fYFwQ86tl_622pUkksaCi3JqYVMEFG_gJB80cng',
    options: [['Loại', 'Pro Series']],
  },
]

function QuantityControl({ value, onDecrease, onIncrease }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border-subtle bg-surface-elevated">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-10 w-10 items-center justify-center rounded-l-lg transition hover:bg-surface-container"
        aria-label="Giảm số lượng"
      >
        <Minus size={16} strokeWidth={1.5} />
      </button>
      <span className="min-w-10 px-3 text-center font-mono text-sm font-medium">{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        className="flex h-10 w-10 items-center justify-center rounded-r-lg transition hover:bg-surface-container"
        aria-label="Tăng số lượng"
      >
        <Plus size={16} strokeWidth={1.5} />
      </button>
    </div>
  )
}

function CartItem({ item, onDecrease, onIncrease, onRemove }) {
  return (
    <article className="grid grid-cols-1 items-center gap-6 border-b border-border-subtle py-8 md:grid-cols-12">
      <div className="md:col-span-6">
        <div className="flex gap-5 sm:gap-6">
          <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container sm:h-32 sm:w-32">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <h2 className="mb-2 text-xl font-semibold text-primary">{item.name}</h2>
            <div className="space-y-1">
              {item.options.map(([label, value]) => (
                <p key={label} className="font-mono text-xs text-on-surface-variant">
                  {label}: <span className="text-on-surface">{value}</span>
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="mt-4 inline-flex w-fit items-center gap-1 font-mono text-xs font-medium text-danger transition hover:opacity-70"
            >
              <Trash2 size={16} strokeWidth={1.5} />
              Xóa sản phẩm
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 md:col-span-2 md:block md:text-center">
        <span className="font-mono text-xs text-on-surface-variant md:hidden">Đơn giá</span>
        <span className="font-mono text-sm font-medium text-primary">{formatCurrency(item.price)}</span>
      </div>
      <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-center">
        <span className="font-mono text-xs text-on-surface-variant md:hidden">Số lượng</span>
        <QuantityControl value={item.quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
      </div>
      <div className="flex items-center justify-between gap-4 md:col-span-2 md:block md:text-right">
        <span className="font-mono text-xs text-on-surface-variant md:hidden">Thành tiền</span>
        <span className="font-mono text-sm font-bold text-primary">{formatCurrency(item.price * item.quantity)}</span>
      </div>
    </article>
  )
}

function OrderSummary({ subtotal }) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-36">
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.06)] sm:p-8">
        <h2 className="mb-8 text-2xl font-bold text-primary">Tóm tắt đơn hàng</h2>
        <div className="mb-8 space-y-4">
          <div className="flex justify-between text-base leading-6">
            <span className="text-on-surface-variant">Tạm tính</span>
            <span className="text-primary">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-base leading-6">
            <span className="text-on-surface-variant">Phí vận chuyển (ước tính)</span>
            <span className="font-medium text-emerald-700">Miễn phí</span>
          </div>
        </div>

        <label className="mb-2 block font-mono text-sm font-medium text-primary" htmlFor="voucher">
          Mã giảm giá / Voucher
        </label>
        <div className="mb-8 flex gap-2">
          <input
            id="voucher"
            type="text"
            placeholder="Nhập mã của bạn"
            className="min-w-0 flex-1 rounded-lg border border-border-subtle bg-surface px-3 py-2 text-base leading-6 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <button type="button" className="rounded-lg bg-primary px-5 py-2 font-mono text-sm font-medium text-on-primary transition hover:opacity-90">
            Áp dụng
          </button>
        </div>

        <div className="mb-8 border-t border-border-subtle pt-6">
          <div className="flex items-end justify-between gap-4">
            <span className="text-lg font-semibold text-primary">Tổng cộng</span>
            <span className="text-[30px] font-bold leading-[38px] text-secondary">{formatCurrency(subtotal)}</span>
          </div>
          <p className="mt-1 text-right text-xs text-on-surface-variant">(Đã bao gồm VAT)</p>
        </div>

        <Link
          to={CLIENT_ROUTES.checkout}
          className="mb-4 flex w-full items-center justify-center rounded-xl bg-primary py-4 font-mono text-sm font-bold uppercase text-on-primary transition hover:opacity-90"
        >
          Tiến hành thanh toán
        </Link>
        <Link to={CLIENT_ROUTES.products} className="block text-center font-mono text-sm font-medium text-on-surface-variant underline transition hover:text-primary">
          Tiếp tục mua sắm
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-container-low p-4">
          <ShieldCheck size={22} strokeWidth={1.5} className="shrink-0 text-secondary" />
          <span className="font-mono text-xs font-semibold text-primary">Thanh toán an toàn</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-container-low p-4">
          <LockKeyhole size={22} strokeWidth={1.5} className="shrink-0 text-secondary" />
          <span className="font-mono text-xs font-semibold text-primary">Bảo mật thông tin</span>
        </div>
      </div>
    </aside>
  )
}

import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, loading, updateQuantity, removeItem, subtotal } = useCart()

  if (loading) {
    return (
      <ClientLayout>
        <main className="mx-auto flex max-w-[1280px] items-center justify-center px-4 pb-section-gap-mobile pt-40 sm:px-6 lg:pb-section-gap lg:pt-44">
          <Loader2 className="animate-spin text-primary" size={32} />
        </main>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <main className="mx-auto max-w-[1280px] px-4 pb-section-gap-mobile pt-40 sm:px-6 lg:pb-section-gap lg:pt-44">
        <nav className="mb-10 flex items-center gap-2 font-mono text-xs font-medium text-on-surface-variant">
          <Link to={CLIENT_ROUTES.home} className="transition hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} />
          <span className="font-bold text-primary">Giỏ hàng</span>
        </nav>

        <h1 className="mb-12 text-[40px] font-semibold leading-[48px] text-primary sm:text-[48px] sm:leading-[56px]">
          Giỏ hàng của bạn
        </h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
            <section className="space-y-6 lg:col-span-2">
              <div className="hidden grid-cols-12 gap-4 border-b border-border-subtle pb-4 font-mono text-sm font-medium uppercase text-on-surface-variant md:grid">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </section>

            <OrderSummary subtotal={subtotal} />
          </div>
        ) : (
          <div className="rounded-xl border border-border-subtle bg-white p-10 text-center">
            <h2 className="text-2xl font-semibold text-primary">Giỏ hàng đang trống.</h2>
            <p className="mt-2 text-base leading-6 text-on-surface-variant">Chọn vài món cho góc làm việc mới rồi quay lại đây nhé.</p>
            <Link
              to={CLIENT_ROUTES.products}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-mono text-sm font-medium text-on-primary transition hover:bg-primary/90"
            >
              Xem sản phẩm
            </Link>
          </div>
        )}
      </main>
    </ClientLayout>
  )
}
