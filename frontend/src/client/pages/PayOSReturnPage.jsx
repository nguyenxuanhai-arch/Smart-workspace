import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import ClientLayout from '../components/layout/ClientLayout.jsx'
import { CLIENT_ROUTES } from '../routes.js'

export default function PayOSReturnPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing')
  const [orderCode, setOrderCode] = useState('')

  useEffect(() => {
    const orderCodeParam = searchParams.get('orderCode')

    setOrderCode(orderCodeParam || '')

    if (orderCodeParam) {
      import('../api/payments.js')
        .then(module => module.paymentsApi.syncPayosPayment(orderCodeParam))
        .then(status => {
          switch (status) {
            case 'PAID':
              setStatus('success')
              break
            case 'CANCELLED':
              setStatus('cancelled')
              break
            case 'PENDING':
            case 'PROCESSING':
              setStatus('processing') // Or maybe a specific pending state
              break
            default:
              setStatus('error')
          }
        })
        .catch(err => {
          console.error('Failed to sync payment', err)
          setStatus('error')
        })
    } else {
      setStatus('error')
    }
  }, [searchParams])

  return (
    <ClientLayout>
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 pt-40 sm:px-6 lg:pt-44 text-center">
        {status === 'processing' && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <h1 className="text-2xl font-bold text-on-surface">Đang xử lý thanh toán...</h1>
            <p className="mt-2 text-on-surface-variant">Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 mb-4" size={64} />
            <h1 className="text-2xl font-bold text-on-surface">Thanh toán thành công!</h1>
            <p className="mt-2 text-on-surface-variant">
              Mã đơn hàng của bạn là <strong>#{orderCode}</strong>
            </p>
            <button
              onClick={() => navigate(CLIENT_ROUTES.accountPayments)}
              className="mt-8 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary/90"
            >
              Lịch sử giao dịch
            </button>
          </div>
        )}

        {status === 'cancelled' && (
          <div className="flex flex-col items-center">
            <XCircle className="text-orange-500 mb-4" size={64} />
            <h1 className="text-2xl font-bold text-on-surface">Thanh toán đã bị hủy</h1>
            <p className="mt-2 text-on-surface-variant">
              Đơn hàng <strong>#{orderCode}</strong> chưa được thanh toán.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate(CLIENT_ROUTES.accountPayments)}
                className="rounded-full border border-outline px-6 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
              >
                Quản lý giao dịch
              </button>
              <button
                onClick={() => navigate(CLIENT_ROUTES.home)}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary/90"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="text-red-500 mb-4" size={64} />
            <h1 className="text-2xl font-bold text-on-surface">Lỗi thanh toán</h1>
            <p className="mt-2 text-on-surface-variant">
              Giao dịch cho đơn hàng <strong>#{orderCode}</strong> thất bại.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate(CLIENT_ROUTES.accountPayments)}
                className="rounded-full border border-outline px-6 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
              >
                Quản lý giao dịch
              </button>
              <button
                onClick={() => navigate(CLIENT_ROUTES.home)}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary/90"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </main>
    </ClientLayout>
  )
}
