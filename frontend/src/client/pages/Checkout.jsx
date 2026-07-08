import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
  WalletCards,
} from 'lucide-react'
import ClientLayout from '../components/layout/ClientLayout.jsx'
import { CLIENT_ROUTES } from '../routes.js'
import { getCartItems } from '../utils/cartStorage.js'
import { formatCurrency } from '../utils/formatters.js'

const checkoutItems = [
  {
    id: 'smart-standing-desk-s1',
    name: 'Smart Standing Desk S1',
    price: 15500000,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBReaKbCB0PiDmZxpTzp8bhMnCGYlmmR-lFMCZ91pChFAI2arztTakpNqIm8lXdV5AulqQOF3kuZq8sgEORuZgCGYMrq2cuM3aeo0WJtnB5fdblSMJPb3TxgE7XJO4AtgI2PseRSYfhCwMzccAjZWyFa8IpETCLrTxnG-Msd97VhOUYv2RZQxVAuA2VqRoIRVeeB-Hu5489gLqTVjR7en8GfwVuva-2uvQPU0eq-tmo4nMXEeco6_1OpA',
    option: 'Walnut top / Black frame / 120x60cm',
  },
  {
    id: 'monitor-light-bar',
    name: 'Monitor Light Bar',
    price: 1250000,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXyD_PChULakPW8FThaARqy-LPdsNvoT9Z9vc4wtsiIOW6MtIMDsw8fzELEj45U4FM53K3_sW_zqGm_TMTCFDDB55cJRy9iKASC4F_xG2IQnojF2w7sumBOHhMdYGFD34AnY8RdXHZARBihKiOPFbPQ-AlRTGt9hBzrvDHA1Tufr5jgBX7fnhhn2UDSR_-SPmlJN0RrghllnXiE8fYFwQ86tl_622pUkksaCi3JqYVMEFG_gJB80cng',
    option: 'Pro Series',
  },
]

const shippingOptions = [
  {
    id: 'standard',
    title: 'Giao tiêu chuẩn',
    description: 'Nhận hàng trong 3-5 ngày làm việc',
    price: 0,
    Icon: Truck,
  },
  {
    id: 'install',
    title: 'Giao và lắp đặt ưu tiên',
    description: 'Lắp đặt trong 24-48 giờ tại nội thành',
    price: 150000,
    Icon: PackageCheck,
  },
]

const paymentMethods = [
  {
    id: 'cod',
    title: 'Thanh toán khi nhận hàng',
    description: 'Kiểm tra sản phẩm trước khi thanh toán',
    Icon: WalletCards,
  },
  {
    id: 'payos',
    title: 'Chuyển khoản tự động (PayOS)',
    description: 'Nhận mã QR và xác nhận tự động',
    Icon: Building2,
  },
  {
    id: 'card',
    title: 'Thẻ tín dụng / ghi nợ',
    description: 'Hỗ trợ Visa, Mastercard và JCB',
    Icon: CreditCard,
  },
]

function Field({ label, placeholder, type = 'text', className = '', name, required = true, defaultValue }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="font-mono text-sm font-medium text-on-surface">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="rounded-lg border border-border-subtle bg-surface px-4 py-3 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  )
}



function CheckoutSection({ title, subtitle, icon: Icon, children }) {
  return (
    <section className="rounded-xl border border-border-subtle bg-surface-container p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
          <Icon size={21} strokeWidth={1.5} />
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-primary">{title}</h2>
          {subtitle && <p className="mt-1 text-sm leading-6 text-on-surface-variant">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function OptionCard({ option, selected, onSelect, showPrice = false }) {
  const { Icon } = option

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
        selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border-subtle bg-surface hover:border-primary/50'
      }`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${selected ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-primary'}`}>
        <Icon size={20} strokeWidth={1.5} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="font-semibold text-primary">{option.title}</span>
          {showPrice && (
            <span className="shrink-0 font-mono text-sm font-semibold text-secondary">
              {option.price === 0 ? 'Miễn phí' : formatCurrency(option.price)}
            </span>
          )}
        </span>
        <span className="mt-1 block text-sm leading-6 text-on-surface-variant">{option.description}</span>
      </span>
      {selected && <CheckCircle2 size={20} strokeWidth={1.5} className="shrink-0 text-secondary" />}
    </button>
  )
}

function OrderItem({ item }) {
  const optionText = item.option || item.options?.map(([label, value]) => `${label}: ${value}`).join(' / ')

  return (
    <div className="flex gap-4 border-b border-border-subtle py-4 last:border-0">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-6 text-primary">{item.name}</h3>
          <span className="font-mono text-sm font-semibold text-primary">{formatCurrency(item.price * item.quantity)}</span>
        </div>
        {optionText && <p className="mt-1 text-sm leading-5 text-on-surface-variant">{optionText}</p>}
        <p className="mt-2 font-mono text-xs text-on-surface-variant">Số lượng: {item.quantity}</p>
      </div>
    </div>
  )
}

function SummaryLine({ label, value, strong = false }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? 'text-lg font-semibold text-primary' : 'text-base text-on-surface-variant'}`}>
      <span>{label}</span>
      <span className={strong ? 'text-secondary' : 'text-primary'}>{value}</span>
    </div>
  )
}


import { useCart } from '../context/CartContext.jsx'
import { locationsApi } from '../api/locationsApi.js'
import { ordersApi } from '../api/orders.js'
import { usersApi } from '../api/users.js'
import { paymentsApi } from '../api/payments.js'
import { Loader2 } from 'lucide-react'
import SearchableSelectField from '../components/SearchableSelectField.jsx'

export default function Checkout() {
  const [shippingId, setShippingId] = useState('standard')
  const [paymentId, setPaymentId] = useState('cod')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { items, subtotal, clear } = useCart()

  const [defaultAddress, setDefaultAddress] = useState({
    receiverName: '',
    receiverPhone: '',
    detailAddress: ''
  })
  
  const [province, setProvince] = useState('')
  const [ward, setWard] = useState('')
  
  const [provincesList, setProvincesList] = useState([])
  const [wardsList, setWardsList] = useState([])

  useEffect(() => {
    locationsApi.getProvinces().then(setProvincesList).catch(console.error)
  }, [])

  useEffect(() => {
    const pData = provincesList.find(p => p.name === province)
    if (pData) {
      locationsApi.getWardsByProvince(pData.code).then(setWardsList).catch(console.error)
    } else {
      setWardsList([])
    }
  }, [province, provincesList])

  const provinceOptions = useMemo(() => provincesList.map(p => p.name), [provincesList])
  const wardOptions = useMemo(() => wardsList.map(w => w.name), [wardsList])

  const handleProvinceChange = (e) => {
    setProvince(e.target.value)
    setWard('')
  }

  const [loadingAddress, setLoadingAddress] = useState(true)

  useEffect(() => {
    usersApi.getAddresses()
      .then(res => {
        const defaultAddr = res.find(a => a.isDefault) || res[0]
        if (defaultAddr) {
          setDefaultAddress({
            receiverName: defaultAddr.receiverName || '',
            receiverPhone: defaultAddr.receiverPhone || '',
            detailAddress: defaultAddr.detailAddress || ''
          })
          setProvince(defaultAddr.provinceName || '')
          setWard(defaultAddr.wardName || '')
        }
      })
      .catch(console.error)
      .finally(() => setLoadingAddress(false))
  }, [])
  
  const selectedShipping = shippingOptions.find((option) => option.id === shippingId) || shippingOptions[0]
  const total = subtotal + selectedShipping.price

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    
    // Address combination
    const province = formData.get('province')
    const ward = formData.get('ward')
    const addressDetails = formData.get('addressDetails')
    const fullAddress = `${addressDetails}, ${ward}, ${province}`

    const payload = {
      receiverName: formData.get('name'),
      receiverPhone: formData.get('phone'),
      shippingAddress: fullAddress,
      paymentMethod: paymentId.toUpperCase(),
      note: formData.get('note'),
    }

    try {
      setSubmitting(true)
      const order = await ordersApi.create(payload)
      clear() // clear cart
      setSubmitted(true)
      
      if (paymentId === 'payos') {
        const checkoutResp = await paymentsApi.createPayosCheckout(order.id)
        if (checkoutResp && checkoutResp.checkoutUrl) {
           window.location.href = checkoutResp.checkoutUrl
           return
        }
      }

      // Default Redirect
      setTimeout(() => {
         window.location.href = CLIENT_ROUTES.accountOrderDetail.replace(':id', order.id)
      }, 2000)
    } catch (err) {
      console.error(err)
      alert('Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingAddress) {
    return (
      <ClientLayout>
        <main className="mx-auto flex min-h-[60vh] max-w-[1280px] items-center justify-center px-4 pb-section-gap-mobile pt-40 sm:px-6 lg:pb-section-gap lg:pt-44">
          <Loader2 className="animate-spin text-primary" size={32} />
        </main>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <main className="mx-auto max-w-[1280px] px-4 pb-section-gap-mobile pt-40 sm:px-6 lg:pb-section-gap lg:pt-44">
        <nav className="mb-10 flex flex-wrap items-center gap-2 font-mono text-xs font-medium text-on-surface-variant">
          <Link to={CLIENT_ROUTES.home} className="transition hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} />
          <Link to={CLIENT_ROUTES.cart} className="transition hover:text-primary">
            Giỏ hàng
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} />
          <span className="font-bold text-primary">Thanh toán</span>
        </nav>

        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-sm font-semibold uppercase text-secondary">Hoàn tất đơn hàng</p>
            <h1 className="text-[40px] font-semibold leading-[48px] text-primary sm:text-[56px] sm:leading-[64px]">Thanh toán</h1>
            <p className="mt-4 text-lg leading-7 text-on-surface-variant">
              Điền thông tin nhận hàng, chọn phương thức thanh toán và xác nhận đơn hàng Smart Workspace của bạn.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border-subtle bg-surface-container p-2 font-mono text-xs font-semibold text-on-surface-variant sm:min-w-[360px]">
            {['Giỏ hàng', 'Thông tin', 'Hoàn tất'].map((step, index) => (
              <div key={step} className={`rounded-lg px-3 py-2 text-center ${index < 2 ? 'bg-primary text-on-primary' : 'bg-surface text-primary'}`}>
                {step}
              </div>
            ))}
          </div>
        </div>

        {submitted && (
          <div role="status" className="mb-8 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 size={22} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            <p className="text-sm leading-6">Đơn hàng đã được ghi nhận ở giao diện mẫu. Đội ngũ Smart Workspace sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
          </div>
        )}

        <form
          className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_420px]"
          onSubmit={handleSubmit}
        >
          <div className="space-y-8">
            <CheckoutSection title="Thông tin liên hệ" subtitle="Dùng để gửi xác nhận đơn hàng và lịch giao." icon={ShieldCheck}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field name="name" label="Họ và tên" placeholder="Nguyễn Minh Anh" defaultValue={defaultAddress.receiverName} />
                <Field name="phone" label="Số điện thoại" placeholder="0901 234 567" type="tel" defaultValue={defaultAddress.receiverPhone} />
                <Field name="email" label="Email" placeholder="minhanh@email.com" type="email" className="md:col-span-2" required={false} />
              </div>
            </CheckoutSection>

            <CheckoutSection title="Địa chỉ nhận hàng" subtitle="Thông tin này giúp đội giao hàng chuẩn bị lịch lắp đặt phù hợp." icon={MapPin}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <SearchableSelectField name="province" label="Tỉnh/Thành phố trực thuộc Trung ương *" placeholder="Chọn Tỉnh/Thành phố" value={province} onChange={handleProvinceChange} options={provinceOptions} />
                <SearchableSelectField name="ward" label="Xã/Phường/Đặc khu *" placeholder="Chọn Xã/Phường" value={ward} onChange={e => setWard(e.target.value)} options={wardOptions} disabled={!province} />
                <Field name="zip" label="Mã bưu chính" placeholder="700000" required={false} />
                <Field name="addressDetails" label="Địa chỉ chi tiết" placeholder="Số nhà, tên đường, tòa nhà, tầng..." className="md:col-span-2" defaultValue={defaultAddress.detailAddress} />
              </div>
            </CheckoutSection>

            <CheckoutSection title="Phương thức vận chuyển" subtitle="Chọn tốc độ giao hàng phù hợp với lịch làm việc của bạn." icon={Truck}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {shippingOptions.map((option) => (
                  <OptionCard key={option.id} option={option} selected={shippingId === option.id} onSelect={() => setShippingId(option.id)} showPrice />
                ))}
              </div>
            </CheckoutSection>

            <CheckoutSection title="Phương thức thanh toán" subtitle="Thông tin thanh toán được bảo vệ bằng lớp bảo mật tiêu chuẩn." icon={LockKeyhole}>
              <div className="grid grid-cols-1 gap-4">
                {paymentMethods.map((method) => (
                  <OptionCard key={method.id} option={method} selected={paymentId === method.id} onSelect={() => setPaymentId(method.id)} />
                ))}
              </div>
            </CheckoutSection>

            <section className="rounded-xl border border-border-subtle bg-surface-container p-6 shadow-sm sm:p-8">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-sm font-medium text-on-surface">Ghi chú đơn hàng</span>
                <textarea
                  name="note"
                  placeholder="Ví dụ: gọi trước khi giao, giao ngoài giờ hành chính, cần hỗ trợ lắp đặt..."
                  className="min-h-[132px] resize-y rounded-lg border border-border-subtle bg-surface px-4 py-3 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-36">
            <section className="rounded-xl border border-border-subtle bg-surface-elevated p-6 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-primary">Đơn hàng</h2>
                <Link to={CLIENT_ROUTES.cart} className="font-mono text-xs font-semibold text-secondary underline">
                  Sửa giỏ hàng
                </Link>
              </div>

              <div className="mb-6">
                {items.length > 0 ? (
                  items.map((item) => <OrderItem key={item.id} item={item} />)
                ) : (
                  <p className="rounded-lg border border-border-subtle bg-surface p-4 text-sm text-on-surface-variant">
                    Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi thanh toán.
                  </p>
                )}
              </div>

              <div className="mb-6 rounded-lg border border-border-subtle bg-surface p-3">
                <label className="mb-2 block font-mono text-xs font-semibold uppercase text-primary" htmlFor="checkout-voucher">
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <input
                    id="checkout-voucher"
                    type="text"
                    placeholder="SMART2026"
                    className="min-w-0 flex-1 rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  />
                  <button type="button" className="rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold text-on-primary transition hover:opacity-90">
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="space-y-4 border-t border-border-subtle pt-6">
                <SummaryLine label="Tạm tính" value={formatCurrency(subtotal)} />
                <SummaryLine label="Phí vận chuyển" value={selectedShipping.price === 0 ? 'Miễn phí' : formatCurrency(selectedShipping.price)} />
                <SummaryLine label="Thuế VAT" value="Đã bao gồm" />
                <div className="border-t border-border-subtle pt-5">
                  <SummaryLine label="Tổng cộng" value={formatCurrency(total)} strong />
                </div>
              </div>

              <button
                type="submit"
                disabled={items.length === 0 || submitting}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-mono text-sm font-bold uppercase text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-on-surface-variant">
                Khi đặt hàng, bạn đồng ý với{' '}
                <Link to={CLIENT_ROUTES.paymentPolicy} className="font-semibold text-primary underline">
                  chính sách thanh toán
                </Link>{' '}
                của Smart Workspace.
              </p>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-container-low p-4">
                <ShieldCheck size={22} strokeWidth={1.5} className="shrink-0 text-secondary" />
                <span className="font-mono text-xs font-semibold text-primary">Bảo mật thông tin</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-container-low p-4">
                <PackageCheck size={22} strokeWidth={1.5} className="shrink-0 text-secondary" />
                <span className="font-mono text-xs font-semibold text-primary">Hỗ trợ lắp đặt</span>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </ClientLayout>
  )
}
