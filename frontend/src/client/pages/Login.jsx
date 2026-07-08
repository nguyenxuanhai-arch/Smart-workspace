import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Footer from '../components/layout/Footer.jsx'
import { useClientAuth } from '../context/AuthContext.jsx'
import { CLIENT_ROUTES } from '../routes.js'

function resolveLoginError(error) {
  const message = error?.response?.data?.message
  if (message?.toLowerCase().includes('invalid email or password')) {
    return 'Email hoặc mật khẩu không đúng.'
  }
  return message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loading: authLoading, login } = useClientAuth()
  const [email, setEmail] = useState(location.state?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const from = location.state?.from
  const redirectTo = from ? `${from.pathname}${from.search || ''}` : CLIENT_ROUTES.home
  const successMessage = location.state?.message

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate, redirectTo])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(resolveLoginError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <main className="flex flex-grow items-center justify-center px-4 py-section-gap-mobile sm:px-6 lg:py-section-gap">
        <section className="w-full max-w-[480px] rounded-lg border border-border-subtle bg-white p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] sm:p-12">
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-[30px] font-bold leading-[38px] text-primary">Smart Workspace</h1>
            <p className="text-2xl font-semibold text-on-surface">Chào mừng trở lại</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block font-mono text-sm font-medium uppercase text-on-surface-variant">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                className="h-12 w-full rounded border border-border-subtle bg-white px-4 text-base text-on-surface outline-none transition focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center justify-between gap-4">
                <span className="font-mono text-sm font-medium uppercase text-on-surface-variant">Mật khẩu</span>
                <button type="button" className="font-mono text-sm font-medium text-secondary transition hover:opacity-80">
                  Quên mật khẩu?
                </button>
              </span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="h-12 w-full rounded border border-border-subtle bg-white px-4 text-base text-on-surface outline-none transition focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </label>

            {successMessage && !error && (
              <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">{successMessage}</p>
            )}
            {error && <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm leading-6 text-danger">{error}</p>}

            <button
              type="submit"
              disabled={submitting || authLoading}
              className="flex h-12 w-full items-center justify-center rounded bg-primary font-mono text-sm font-medium uppercase text-on-primary transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="my-10 flex items-center">
            <div className="h-px flex-grow bg-border-subtle" />
            <span className="px-4 font-mono text-xs uppercase text-on-surface-variant">Hoặc tiếp tục với</span>
            <div className="h-px flex-grow bg-border-subtle" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['Google', 'Apple'].map((provider) => (
              <button key={provider} type="button" className="flex h-12 items-center justify-center rounded border border-border-subtle bg-white font-mono text-sm font-medium text-on-surface transition hover:bg-surface-container">
                {provider}
              </button>
            ))}
          </div>

          <p className="mt-10 text-center text-base leading-6 text-on-surface-variant">
            Chưa có tài khoản?{' '}
            <Link to={CLIENT_ROUTES.register} className="font-bold text-primary transition hover:opacity-80">
              Đăng ký ngay
            </Link>
          </p>
        </section>
      </main>
      <Footer compact />
    </div>
  )
}
