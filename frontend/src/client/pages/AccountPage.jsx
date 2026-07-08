import { useMemo, useState, useEffect } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import {
  Bell,
  CreditCard,
  ListOrdered,
  LockKeyhole,
  Mail,
  Settings,
  Smartphone,
  User,
  Loader2,
} from 'lucide-react'
import ClientLayout from '../components/layout/ClientLayout.jsx'
import { useClientAuth } from '../context/AuthContext.jsx'
import { accountNavItems } from '../data/accountNav.js'
import { CLIENT_ROUTES } from '../routes.js'
import { formatCurrency } from '../utils/formatters.js'
import { usersApi } from '../api/users.js'
import { locationsApi } from '../api/locationsApi.js'
import SearchableSelectField from '../components/SearchableSelectField.jsx'
const accountIconMap = {
  user: User,
  orders: ListOrdered,
  payments: CreditCard,
  settings: Settings,
}

const orders = [
  {
    id: 'SW-1025',
    date: '26/05/2024',
    status: 'pending',
    total: 4200000,
    items: [
      {
        name: 'Ergo Arm Pro (Dual)',
        quantity: 1,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB3K_X2KtRHA564TO-W-JqNcMjxWHHfCLSuzPFZgMIf0v8IJLwaWu4un4oEtg2kJU-3-e5RAwkLFI-VdcdqP_n-Oo7DSBi9Q9vNRK9jYtihADfgssLxwCqxaVc8OPtWR3MRzrA21szO5t_f8U8T0d4o-gzZwbvQQ_jd_0SvxDYz5W0_c-dQm-dWoQZwij0jj_mfI6z9LWnDx6CoO94kDWvKyYiKqfrA7EQVkNP-wgDUM_BEm-4dEWsSKg',
      },
    ],
  },
  {
    id: 'SW-1024',
    date: '24/05/2024',
    status: 'shipping',
    total: 18500000,
    items: [
      {
        name: 'Smart Standing Desk S1',
        quantity: 1,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ-oS1YxgfVptgArZFfRcVK9UIeQhEhrJ0hTIShqHwLg9wMK5NDtdeoA45UajLAboyA3wfxYVTydEPIr5EGYCYrtONAB2TWJTT-KMuyNJ0XsSg2DwZqrOBKN_MK9sGxV1S5f3-xS4XLl3VjdbcFYKhNYPli-x7zMD7AdOxxYoNA0Dgg322307F7az_nauBEwrtr9X4miI_gz9eWNHEjExtvm6R0LJ872CLTniGCz0MMy3C7rr05nERGA',
      },
    ],
  },
  {
    id: 'SW-0988',
    date: '10/05/2024',
    status: 'completed',
    total: 12800000,
    items: [
      {
        name: 'ErgoChair X2',
        quantity: 1,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBDBueKMwclEAXVy7c-JTkWnEYnneHWAkG2E1raIc4TejaryAHFum06BE4KL4hubXE-mO5c7ZuZlvc5igZz0jNB2lf3IerjUxiLXDNunce0uRPdDE_mVudsnKWHG1trsmaCtiJQrbeNg9nn1xnR005igyQAh0K-2A9_v6fm8nJ4aeEhp2NlT5BQyyEuWUtq-uGdiYq7bqd-jCASoq4sJV2b9wBtQON_Qq9-66VtkNPMrCh5EtB8_BXeiQ',
      },
      {
        name: 'Premium Anti-Fatigue Mat',
        quantity: 1,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC6b5iDG97IPtVc0XZAJ6pfT5f1nmABGMvs6RCVGaVXOQlJGFzJD1y4hT0Re_DLHtImg5crbAFFBixmsvVIkeSWIBunDYdsuFSios-g81qk1ltm-nY2UxPhlbofuTfjwUuuYP5BhqIwiwHtJcTlm1dH8rwrdfx4a1wehN3E-LSiMPoVg2OtKosUnUbDwEQeaWxmy4yiMqBubud8_VfXvSKZuX07UFOeI3zEXxav3dvz7BUyBZNItZw45A',
      },
    ],
  },
]

const statusMeta = {
  pending: {
    label: 'Chờ xử lý',
    tone: 'border-border-subtle bg-surface-container text-on-surface-variant',
    dot: 'bg-outline',
  },
  shipping: {
    label: 'Đang giao',
    tone: 'border-blue-200 bg-blue-50 text-secondary',
    dot: 'bg-secondary',
  },
  completed: {
    label: 'Hoàn thành',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-600',
  },
  cancelled: {
    label: 'Đã hủy',
    tone: 'border-red-200 bg-red-50 text-danger',
    dot: 'bg-danger',
  },
}

const orderTabs = [
  ['all', 'Tất cả'],
  ['pending', 'Chờ xử lý'],
  ['shipping', 'Đang giao'],
  ['completed', 'Hoàn thành'],
  ['cancelled', 'Đã hủy'],
]

const paymentRows = [
  ['PAY-240526-01', '26/05/2024', 'Thẻ tín dụng', 'Đơn SW-1025', 4200000, 'Đang chờ'],
  ['PAY-240524-02', '24/05/2024', 'Chuyển khoản', 'Đơn SW-1024', 18500000, 'Đã thanh toán'],
  ['PAY-240510-03', '10/05/2024', 'Ví điện tử', 'Đơn SW-0988', 12800000, 'Đã thanh toán'],
]

function AccountLayout({ section, title, children }) {
  const { pathname } = useLocation()
  const { user } = useClientAuth()
  const displayName = user?.fullName || user?.name || user?.email || 'Customer Demo'

  return (
    <ClientLayout>
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 pb-section-gap-mobile pt-32 sm:px-6 lg:flex-row lg:pb-section-gap lg:pt-36">
        <aside className="hidden w-64 shrink-0 flex-col gap-2 self-start rounded-lg bg-surface-container-low py-8 lg:flex">
          <div className="mb-6 px-4">
            <h2 className="font-mono text-sm font-bold text-primary">Tài khoản</h2>
            <p className="mt-1 text-sm leading-5 text-on-surface-variant">Quản lý tài khoản của bạn</p>
          </div>
          <nav className="flex flex-col">
            {accountNavItems.map((item) => {
              const Icon = accountIconMap[item.icon] || User
              const active = pathname === item.to || section === item.key
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 font-mono text-sm transition ${
                    active
                      ? 'border-r-4 border-secondary bg-white font-bold text-secondary'
                      : 'text-on-surface-variant hover:bg-surface hover:text-secondary'
                  }`}
                >
                  <Icon size={20} strokeWidth={1.5} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-secondary">{displayName}</p>
              <h1 className="mt-2 text-[32px] font-semibold leading-10 text-primary sm:text-[48px] sm:leading-[56px]">{title}</h1>
            </div>
            <Link to={CLIENT_ROUTES.cart} className="w-fit rounded-lg border border-border-subtle px-4 py-2 font-mono text-sm text-primary transition hover:bg-surface">
              Giỏ hàng
            </Link>
          </div>

          <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto border-b border-border-subtle px-4 pb-2 lg:hidden">
            {accountNavItems.map((item) => {
              const active = pathname === item.to || section === item.key
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`whitespace-nowrap border-b-2 px-4 py-2 font-mono text-sm transition ${
                    active ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {children}
        </section>
      </main>
    </ClientLayout>
  )
}

function Field({ label, value, onChange, type = 'text', disabled = false }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-sm font-medium text-on-surface">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`h-12 w-full rounded-lg border border-border-subtle bg-white px-4 text-base text-on-surface outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 ${disabled ? 'opacity-70 bg-surface-container' : ''}`}
      />
    </label>
  )
}



function StatusBadge({ status }) {
  const meta = statusMeta[status] || statusMeta.pending
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs ${meta.tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

function OrderCard({ order }) {
  return (
    <article className="rounded-lg border border-border-subtle bg-white p-6 transition hover:shadow-[0_24px_48px_-12px_rgba(19,27,46,0.05)]">
      <div className="mb-4 flex flex-col gap-4 border-b border-border-subtle pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm font-bold text-primary">#{order.id}</span>
          <span className="rounded bg-surface-container-low px-2 py-1 font-mono text-xs text-on-surface-variant">{order.date}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mb-6 flex flex-col gap-4">
        {order.items.map((item) => (
          <div key={item.name} className="flex items-center gap-4">
            <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded border border-border-subtle bg-surface-container-low object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-medium text-primary">{item.name}</p>
              <p className="mt-1 font-mono text-xs text-on-surface-variant">Số lượng: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-border-subtle pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 font-mono text-sm">
          <span className="text-on-surface-variant">Tổng cộng:</span>
          <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:flex">
          <Link to={CLIENT_ROUTES.accountOrderDetail.replace(':id', order.dbId)} className="flex items-center justify-center rounded border border-border-subtle px-4 py-2 font-mono text-sm text-on-surface-variant transition hover:bg-surface">
            Xem chi tiết
          </Link>
          {order.status === 'shipping' && (
            <button
              type="button"
              className="rounded px-4 py-2 font-mono text-sm transition bg-primary text-on-primary hover:bg-inverse-surface"
            >
              Theo dõi đơn hàng
            </button>
          )}
          {order.status === 'completed' && (
            <button
              type="button"
              className="rounded px-4 py-2 font-mono text-sm transition border border-secondary text-secondary hover:bg-blue-50"
            >
              Đổi trả
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function OrdersContent() {
  const [tab, setTab] = useState('all')
  const [ordersData, setOrdersData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('../api/orders.js')
      .then((m) => m.ordersApi.getMyOrders())
      .then(setOrdersData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const visibleOrders = useMemo(() => {
    const formatted = ordersData.map((o) => ({
      dbId: o.id,
      id: o.orderCode || o.id,
      date: new Date(o.createdAt).toLocaleDateString('vi-VN'),
      status: o.status.toLowerCase(),
      total: o.totalAmount,
      items: o.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        image: i.productImage || 'https://placehold.co/150x150?text=' + encodeURIComponent(i.productName.substring(0, 20)),
      })),
    }))
    return tab === 'all' ? formatted : formatted.filter((order) => order.status === tab)
  }, [tab, ordersData])

  if (loading) return <div className="p-8 text-on-surface text-center"><Loader2 size={24} className="animate-spin inline mr-2" /> Đang tải đơn hàng...</div>

  return (
    <div className="space-y-6">
      <div className="-mx-4 flex gap-2 overflow-x-auto border-b border-border-subtle px-4 pb-2 sm:mx-0 sm:px-0">
        {orderTabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`whitespace-nowrap border-b-2 px-4 py-2 font-mono text-sm transition ${
              tab === key ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {visibleOrders.map((order) => (
          <OrderCard key={order.dbId} order={order} />
        ))}
        {visibleOrders.length === 0 && <p className="py-8 text-center text-on-surface-variant">Không tìm thấy đơn hàng nào.</p>}
      </div>
    </div>
  )
}

function ProfileContent() {
  const { user } = useClientAuth()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [email, setEmail] = useState(user?.email || '')
  const [addressObj, setAddressObj] = useState(null)
  
  const [province, setProvince] = useState('')
  const [ward, setWard] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName)
    if (user?.phone) setPhone(user.phone)
    if (user?.email) setEmail(user.email)
  }, [user])

  useEffect(() => {
    usersApi.getAddresses().then(res => {
      const defaultAddr = res.find(a => a.isDefault) || res[0]
      if (defaultAddr) {
        setAddressObj(defaultAddr)
        setProvince(defaultAddr.provinceName || '')
        setWard(defaultAddr.wardName || '')
        setDetailAddress(defaultAddr.detailAddress || '')
      }
    }).catch(console.error)
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      await usersApi.updateProfile({ fullName, phone })
      
      const pData = provincesList.find(p => p.name === province)
      const wData = wardsList.find(w => w.name === ward)

      const addrReq = {
        receiverName: fullName || user?.fullName || 'Khách',
        receiverPhone: phone || user?.phone || '0000',
        provinceName: province || 'N/A',
        provinceCode: pData?.code ? parseInt(pData.code) : 0,
        wardName: ward || 'N/A',
        wardCode: wData?.code ? parseInt(wData.code) : 0,
        detailAddress: detailAddress || 'N/A',
        isDefault: true
      }
      
      if (addressObj) {
        await usersApi.updateAddress(addressObj.id, addrReq)
      } else {
        await usersApi.createAddress(addrReq)
      }
      
      alert('Đã cập nhật thông tin thành công!')
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 rounded-lg border border-border-subtle bg-white p-6 md:grid-cols-2">
      <Field label="Họ và tên" value={fullName} onChange={e => setFullName(e.target.value)} />
      <Field label="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
      <Field label="Email" value={email} type="email" disabled={true} />
      <Field label="Công ty" value="Smart Workspace Studio" disabled={true} />
      
      <div className="md:col-span-2 mb-2 border-b border-border-subtle pb-2">
        <h3 className="font-mono text-sm font-bold text-primary uppercase">Địa chỉ mặc định</h3>
      </div>
      
      <SearchableSelectField label="Tỉnh/Thành phố trực thuộc Trung ương *" value={province} onChange={handleProvinceChange} options={provinceOptions} placeholder="Chọn Tỉnh/Thành phố" />
      <SearchableSelectField label="Xã/Phường/Đặc khu *" value={ward} onChange={e => setWard(e.target.value)} options={wardOptions} disabled={!province} placeholder="Chọn Xã/Phường" />
      <Field label="Địa chỉ chi tiết" value={detailAddress} onChange={e => setDetailAddress(e.target.value)} />
      
      <div className="md:col-span-2">
        <button 
          type="button" 
          onClick={handleSave}
          disabled={loading}
          className="w-fit flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-mono text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Lưu thay đổi
        </button>
      </div>
    </div>
  )
}

const paymentStatusLabels = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  FAILED: 'Thất bại',
  REFUNDED: 'Hoàn tiền',
}

function PaymentsContent() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('../api/payments.js')
      .then((m) => m.paymentsApi.getMyPayments())
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-on-surface text-center"><Loader2 size={24} className="animate-spin inline mr-2" /> Đang tải thanh toán...</div>

  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-white">
      <div className="grid min-w-[760px] grid-cols-[1.2fr_0.8fr_1fr_1fr_1fr_0.9fr] border-b border-border-subtle bg-surface-container-low px-5 py-4 font-mono text-xs font-semibold uppercase text-on-surface-variant">
        <span>Mã giao dịch</span>
        <span>Ngày</span>
        <span>Phương thức</span>
        <span>Mã đơn hàng</span>
        <span>Số tiền</span>
        <span>Trạng thái</span>
      </div>
      <div className="overflow-x-auto">
        {payments.map((pm) => {
          const isPaid = pm.paymentStatus === 'PAID'
          return (
            <div key={pm.id} className="grid min-w-[760px] grid-cols-[1.2fr_0.8fr_1fr_1fr_1fr_0.9fr] items-center border-b border-border-subtle px-5 py-4 last:border-0">
              <span className="font-mono text-sm font-semibold text-primary">{pm.transactionCode || 'N/A'}</span>
              <span className="text-sm text-on-surface-variant">{pm.paidAt ? new Date(pm.paidAt).toLocaleDateString('vi-VN') : '-'}</span>
              <span className="text-sm text-primary">{pm.paymentMethod}</span>
              <span className="font-mono text-sm text-on-surface-variant">{pm.orderId}</span>
              <span className="font-semibold text-primary">{formatCurrency(pm.amount)}</span>
              <span className={`w-fit rounded-full px-3 py-1 font-mono text-xs ${isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-container text-on-surface-variant'}`}>
                {paymentStatusLabels[pm.paymentStatus] || pm.paymentStatus}
              </span>
            </div>
          )
        })}
        {payments.length === 0 && <p className="py-8 text-center text-on-surface-variant">Chưa có giao dịch nào.</p>}
      </div>
    </div>
  )
}

function SettingsContent() {
  const settings = [
    [Bell, 'Thông báo đơn hàng', 'Nhận cập nhật khi đơn hàng đổi trạng thái.'],
    [Mail, 'Bản tin ưu đãi', 'Nhận gợi ý setup và chương trình thành viên.'],
    [Smartphone, 'Xác thực qua điện thoại', 'Tăng bảo mật khi thanh toán.'],
    [LockKeyhole, 'Đổi mật khẩu', 'Cập nhật mật khẩu định kỳ cho tài khoản.'],
  ]

  return (
    <div className="grid gap-4">
      {settings.map(([Icon, title, description], index) => (
        <div key={title} className="flex items-center justify-between gap-4 rounded-lg border border-border-subtle bg-white p-5">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-primary">
              <Icon size={20} strokeWidth={1.5} />
            </span>
            <div>
              <p className="font-semibold text-primary">{title}</p>
              <p className="mt-1 text-sm leading-5 text-on-surface-variant">{description}</p>
            </div>
          </div>
          <button
            type="button"
            className={`h-6 w-11 shrink-0 rounded-full p-1 transition ${index < 2 ? 'bg-secondary' : 'bg-surface-container-highest'}`}
            aria-label={title}
          >
            <span className={`block h-4 w-4 rounded-full bg-white transition ${index < 2 ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      ))}
    </div>
  )
}

function OrderDetailContent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('../api/orders.js')
      .then((m) => m.ordersApi.getById(id))
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-8 text-center text-on-surface"><Loader2 size={24} className="animate-spin inline mr-2" /> Đang tải chi tiết đơn hàng...</div>
  if (!order) return <div className="p-8 text-center text-on-surface-variant">Không tìm thấy đơn hàng.</div>

  const isPaid = order.payment?.paymentStatus === 'PAID'

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate(CLIENT_ROUTES.accountOrders)} className="text-secondary font-mono text-sm hover:underline flex items-center gap-2 w-fit">
        &larr; Quay lại danh sách
      </button>

      <div className="rounded-lg border border-border-subtle bg-white p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b border-border-subtle pb-4">
           <div>
             <h3 className="font-mono text-lg font-bold text-primary">Đơn hàng #{order.orderCode}</h3>
             <p className="text-sm text-on-surface-variant mt-1">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
           </div>
           <StatusBadge status={order.status.toLowerCase()} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-2 border-b border-border-subtle pb-6">
           <div>
             <h4 className="font-mono text-sm font-semibold mb-2">Thông tin nhận hàng</h4>
             <p className="text-sm text-primary font-medium">{order.receiverName}</p>
             <p className="text-sm text-on-surface-variant">{order.receiverPhone}</p>
             <p className="text-sm text-on-surface-variant mt-1">{order.shippingAddress}</p>
           </div>
           <div>
             <h4 className="font-mono text-sm font-semibold mb-2">Thanh toán</h4>
             <p className="text-sm text-primary">Phương thức: {order.payment?.paymentMethod}</p>
             <p className="text-sm text-on-surface-variant mt-1">Trạng thái: <span className={isPaid ? 'text-emerald-600 font-medium' : 'text-on-surface-variant'}>{isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></p>
           </div>
        </div>

        <div>
          <h4 className="font-mono text-sm font-semibold mb-4">Sản phẩm</h4>
          <div className="flex flex-col gap-4">
            {order.items.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-surface-container-low p-4 rounded-lg gap-4">
                 <div className="flex items-center gap-4">
                   <img src={item.productImage || ('https://placehold.co/150x150?text=' + encodeURIComponent(item.productName.substring(0, 20)))} alt={item.productName} className="h-16 w-16 shrink-0 rounded border border-border-subtle bg-white object-cover" />
                   <div>
                     <p className="font-medium text-primary text-base">{item.productName}</p>
                     <p className="text-sm text-on-surface-variant mt-1">Phân loại: {item.productSku} | Số lượng: {item.quantity}</p>
                   </div>
                 </div>
                 <p className="font-semibold text-primary">{formatCurrency(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 border-t border-border-subtle pt-4">
          <div className="flex justify-between w-full sm:w-64 text-sm text-on-surface-variant"><span>Tạm tính:</span> <span>{formatCurrency(order.subtotalAmount)}</span></div>
          <div className="flex justify-between w-full sm:w-64 text-sm text-on-surface-variant"><span>Phí vận chuyển:</span> <span>{formatCurrency(order.shippingFee)}</span></div>
          {order.discountAmount > 0 && <div className="flex justify-between w-full sm:w-64 text-sm text-emerald-600"><span>Giảm giá:</span> <span>-{formatCurrency(order.discountAmount)}</span></div>}
          <div className="flex justify-between w-full sm:w-64 text-base font-bold text-primary mt-2"><span>Tổng tiền:</span> <span>{formatCurrency(order.totalAmount)}</span></div>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage({ section = 'orders' }) {
  const titleMap = {
    profile: 'Thông tin cá nhân',
    orders: 'Đơn hàng của tôi',
    orderDetail: 'Chi tiết đơn hàng',
    payments: 'Lịch sử thanh toán',
    settings: 'Cài đặt tài khoản',
  }
  const contentMap = {
    profile: <ProfileContent />,
    orders: <OrdersContent />,
    orderDetail: <OrderDetailContent />,
    payments: <PaymentsContent />,
    settings: <SettingsContent />,
  }

  return (
    <AccountLayout section={section === 'orderDetail' ? 'orders' : section} title={titleMap[section] || titleMap.orders}>
      {contentMap[section] || contentMap.orders}
    </AccountLayout>
  )
}
