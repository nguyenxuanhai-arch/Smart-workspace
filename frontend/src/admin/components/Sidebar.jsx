import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  Package,
  FolderTree,
  ClipboardList,
  Users,
  Star,
  Megaphone,
  ShieldCheck,
  Building2,
  CreditCard,
} from 'lucide-react'
import { ADMIN_ROUTES } from '../routes.js'

const navItems = [
  { to: ADMIN_ROUTES.root, label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: ADMIN_ROUTES.products, label: 'Sản Phẩm', icon: Package },
  { to: ADMIN_ROUTES.productForm, label: 'Danh Mục', icon: FolderTree },
  { to: ADMIN_ROUTES.orders, label: 'Đơn Hàng', icon: ClipboardList },
  { to: ADMIN_ROUTES.payments, label: 'Thanh Toán', icon: CreditCard },
  { to: ADMIN_ROUTES.customers, label: 'Khách Hàng', icon: Users },
  { to: ADMIN_ROUTES.reviews, label: 'Đánh Giá', icon: Star },
  { to: ADMIN_ROUTES.marketing, label: 'Marketing', icon: Megaphone },
  { to: ADMIN_ROUTES.policy, label: 'Chính Sách', icon: ShieldCheck },
  { to: ADMIN_ROUTES.branches, label: 'Chi Nhánh', icon: Building2 },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-navy-950 text-slate-200 min-h-screen flex flex-col py-4">
      <div className="px-5 pb-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-brand-teal flex items-center justify-center font-bold text-navy-950">
          A
        </div>
        <span className="font-semibold text-white tracking-wide">Admin Panel</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-brand-teal text-navy-950 font-medium'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
