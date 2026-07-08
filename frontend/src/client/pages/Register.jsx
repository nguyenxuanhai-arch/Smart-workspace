import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/layout/Footer.jsx'
import Header from '../components/layout/Header.jsx'
import { clientAuthApi } from '../api/auth.js'
import { CLIENT_ROUTES } from '../routes.js'

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8ijNI8b0JHNlO90lDXvvRWIXeUykHGld32YcYQCSN85chFqWG57IzK24M7lzFHXWS0E1GAmZbGprYpPlOR5u4__vKaPgVako-cWmaq7PCa3W3Kx4jgJcxJ7GPjCkqZ8BaOfnOMHMi08H0-pq00IlpwOJ8Qu3R6NOj6FFNFSLvqet8uAR0PbYbBXHW1gTguJB_AuXk14Qd2Di4ii7k5nYf7xGnVfiq87sCj9LuUnpSoLUBbOwFsFhxwQ'

function resolveRegisterError(error) {
  const message = error?.response?.data?.message
  if (message?.toLowerCase().includes('email')) return 'Email này đã được sử dụng hoặc không hợp lệ.'
  if (message?.toLowerCase().includes('phone')) return 'Số điện thoại này đã được sử dụng hoặc không hợp lệ.'
  return message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp.')
      return
    }

    if (!accepted) {
      setError('Bạn cần đồng ý điều khoản trước khi đăng ký.')
      return
    }

    setSubmitting(true)
    try {
      await clientAuthApi.register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      })
      navigate(CLIENT_ROUTES.login, {
        replace: true,
        state: {
          email: form.email.trim(),
          message: 'Đăng ký thành công. Bạn có thể đăng nhập ngay.',
        },
      })
    } catch (err) {
      setError(resolveRegisterError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <Header />
      <main className="relative flex flex-grow items-center justify-center overflow-hidden px-4 pb-section-gap-mobile pt-32 sm:px-6 lg:pb-section-gap lg:pt-40">
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#c6c6cd 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <section className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border-subtle bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] md:flex-row">
          <div className="flex w-full flex-col justify-center p-8 sm:p-12 lg:w-1/2 lg:p-16">
            <div className="mb-10">
              <h1 className="mb-2 text-[32px] font-semibold leading-10 text-primary sm:text-[48px] sm:leading-[56px]">
                Tạo tài khoản Smart Workspace
              </h1>
              <p className="text-base leading-6 text-on-surface-variant">Thiết kế không gian làm việc chuyên nghiệp của bạn.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1 block font-mono text-sm font-medium text-on-surface">Họ tên</span>
                <input
                  className="w-full rounded-lg border border-border-subtle bg-white px-4 py-3 text-base text-on-surface outline-none transition focus:border-transparent focus:ring-2 focus:ring-secondary"
                  placeholder="Nguyễn Văn A"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.fullName}
                  onChange={updateField('fullName')}
                />
              </label>

              <label className="block">
                <span className="mb-1 block font-mono text-sm font-medium text-on-surface">Email</span>
                <input
                  className="w-full rounded-lg border border-border-subtle bg-white px-4 py-3 text-base text-on-surface outline-none transition focus:border-transparent focus:ring-2 focus:ring-secondary"
                  placeholder="name@company.com"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={updateField('email')}
                />
              </label>

              <label className="block">
                <span className="mb-1 block font-mono text-sm font-medium text-on-surface">Số điện thoại</span>
                <input
                  className="w-full rounded-lg border border-border-subtle bg-white px-4 py-3 text-base text-on-surface outline-none transition focus:border-transparent focus:ring-2 focus:ring-secondary"
                  placeholder="0909000000"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={updateField('phone')}
                />
              </label>

              <label className="block">
                <span className="mb-1 block font-mono text-sm font-medium text-on-surface">Mật khẩu</span>
                <input
                  className="w-full rounded-lg border border-border-subtle bg-white px-4 py-3 text-base text-on-surface outline-none transition focus:border-transparent focus:ring-2 focus:ring-secondary"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={updateField('password')}
                />
              </label>

              <label className="block">
                <span className="mb-1 block font-mono text-sm font-medium text-on-surface">Xác nhận mật khẩu</span>
                <input
                  className="w-full rounded-lg border border-border-subtle bg-white px-4 py-3 text-base text-on-surface outline-none transition focus:border-transparent focus:ring-2 focus:ring-secondary"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={updateField('confirmPassword')}
                />
              </label>

              <label className="flex cursor-pointer items-start gap-3 py-2">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-border-subtle text-secondary focus:ring-2 focus:ring-secondary"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  required
                />
                <span className="text-base leading-6 text-on-surface-variant">
                  Tôi đồng ý với <Link to={CLIENT_ROUTES.policies} className="text-secondary transition hover:underline">Điều khoản</Link> và{' '}
                  <Link to={CLIENT_ROUTES.policies} className="text-secondary transition hover:underline">Chính sách bảo mật</Link>
                </span>
              </label>

              {error && <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm leading-6 text-danger">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-lg bg-primary py-4 font-mono text-sm font-medium text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
              </button>
            </form>

            <div className="my-8 flex items-center">
              <div className="h-px flex-grow bg-border-subtle" />
              <span className="px-4 font-mono text-xs uppercase text-on-surface-variant">Hoặc đăng ký bằng</span>
              <div className="h-px flex-grow bg-border-subtle" />
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
              {['Google', 'Apple'].map((provider) => (
                <button key={provider} type="button" className="flex items-center justify-center rounded-lg border border-border-subtle bg-transparent py-3 font-mono text-sm font-medium text-on-surface transition hover:bg-surface-container-low">
                  {provider}
                </button>
              ))}
            </div>

            <p className="text-center text-base leading-6 text-on-surface-variant">
              Đã có tài khoản?{' '}
              <Link to={CLIENT_ROUTES.login} className="font-bold text-primary transition hover:text-secondary">
                Đăng nhập
              </Link>
            </p>
          </div>

          <div className="hidden w-1/2 border-l border-border-subtle bg-surface-container-low md:block">
            <div className="h-full min-h-[720px] bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
          </div>
        </section>
      </main>
      <Footer compact />
    </div>
  )
}
