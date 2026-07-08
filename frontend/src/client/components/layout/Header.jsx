import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CreditCard, ListOrdered, LogOut, Menu, Settings, ShoppingCart, User, X } from 'lucide-react'
import { CLIENT_ROUTES } from '../../routes.js'
import { useClientAuth } from '../../context/AuthContext.jsx'
import { accountNavItems } from '../../data/accountNav.js'
import { useCart } from '../../context/CartContext.jsx'

const headerNav = [
  ['Bàn thông minh', `${CLIENT_ROUTES.products}?category=ban-thong-minh`],
  ['Ghế công thái học', `${CLIENT_ROUTES.products}?category=ghe-cong-thai-hoc`],
  ['Phụ kiện', `${CLIENT_ROUTES.products}?category=phu-kien`],
  ['Giải pháp', CLIENT_ROUTES.workspace3d],
  ['Chính sách', CLIENT_ROUTES.policies],
  ['Hỗ trợ', CLIENT_ROUTES.contact],
]

const accountIconMap = {
  user: User,
  orders: ListOrdered,
  payments: CreditCard,
  settings: Settings,
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { cartCount } = useCart()
  const { pathname, search } = useLocation()
  const { user, isAuthenticated, logout } = useClientAuth()
  const currentLocation = `${pathname}${search}`
  const isCartFlow = pathname === CLIENT_ROUTES.cart || pathname === CLIENT_ROUTES.checkout
  const displayName = user?.fullName || user?.name || user?.email || 'Tài khoản'
  const isActive = (to) => {
    const [targetPath] = to.split('?')
    return currentLocation === to || (!to.includes('?') && pathname === to) || (targetPath === CLIENT_ROUTES.policies && pathname.startsWith(CLIENT_ROUTES.policies))
  }
  const handleLogout = async () => {
    await logout()
    setOpen(false)
    setAccountOpen(false)
  }

  useEffect(() => {
    setAccountOpen(false)
  }, [pathname, search])

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-border-subtle bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between gap-6 px-4 sm:px-6">
        <Link to={CLIENT_ROUTES.home} className="text-[30px] font-bold leading-[38px] text-primary">
          Smart Workspace
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {headerNav.map(([label, to]) => (
            <Link
              key={label}
              to={to}
              className={`font-mono text-sm font-medium transition-colors ${
                isActive(to) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 text-primary md:flex">
          <Link
            to={CLIENT_ROUTES.cart}
            aria-label="Giỏ hàng"
            className={`relative transition hover:opacity-80 ${isCartFlow ? 'text-secondary' : ''}`}
          >
            <ShoppingCart size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Mở menu tài khoản"
                aria-expanded={accountOpen}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                  accountOpen ? 'border-secondary bg-surface text-secondary' : 'border-border-subtle text-primary hover:bg-surface'
                }`}
                onClick={() => setAccountOpen((value) => !value)}
              >
                <User size={20} strokeWidth={1.5} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-xl border border-border-subtle bg-white shadow-[0_24px_48px_-12px_rgba(19,27,46,0.16)]">
                  <div className="border-b border-border-subtle px-4 py-3">
                    <p className="truncate text-sm font-semibold text-primary">{displayName}</p>
                    {user?.email && <p className="mt-1 truncate font-mono text-xs text-on-surface-variant">{user.email}</p>}
                  </div>
                  <nav className="py-1">
                    {accountNavItems.map((item) => {
                      const Icon = accountIconMap[item.icon] || User
                      return (
                        <Link
                          key={item.key}
                          to={item.to}
                          className="flex items-center gap-3 px-4 py-3 font-mono text-sm text-on-surface-variant transition hover:bg-surface hover:text-primary"
                        >
                          <Icon size={16} strokeWidth={1.5} />
                          {item.label}
                        </Link>
                      )
                    })}
                  </nav>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-border-subtle px-4 py-3 text-left font-mono text-sm text-danger transition hover:bg-danger/10"
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={CLIENT_ROUTES.login}
              aria-label="Đăng nhập"
              className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-primary transition hover:bg-surface"
            >
              <User size={18} strokeWidth={1.5} />
              <span className="flex flex-col font-mono">
                <span className="text-[10px] font-semibold uppercase text-on-surface-variant">Chưa đăng nhập</span>
                <span className="text-xs font-semibold">Đăng nhập</span>
              </span>
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label="Mở menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle text-primary lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-20 border-t border-border-subtle bg-white px-4 py-4 shadow-[0_24px_48px_-12px_rgba(19,27,46,0.08)] lg:hidden">
          <div className="grid gap-2 font-mono text-sm font-medium text-on-surface-variant">
            {headerNav.map(([label, to]) => (
              <Link key={label} to={to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 hover:bg-surface">
                {label}
              </Link>
            ))}
            <Link
              to={CLIENT_ROUTES.cart}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-3 hover:bg-surface ${isCartFlow ? 'bg-surface text-primary' : ''}`}
            >
              Giỏ hàng{cartCount > 0 ? ` (${cartCount > 99 ? '99+' : cartCount})` : ''}
            </Link>
            {isAuthenticated ? (
              <>
                <span className="truncate rounded-lg px-3 py-2 text-primary">Xin chào, {displayName}</span>
                {accountNavItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 hover:bg-surface"
                  >
                    {item.label}
                  </Link>
                ))}
                <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-3 text-left hover:bg-surface">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <span className="rounded-lg px-3 py-2 text-on-surface-variant">Chưa đăng nhập</span>
                <Link to={CLIENT_ROUTES.login} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 hover:bg-surface">
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
