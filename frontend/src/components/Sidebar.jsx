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
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/san-pham', label: 'Sản Phẩm', icon: Package },
  { to: '/danh-muc', label: 'Danh Mục', icon: FolderTree },
  { to: '/don-hang', label: 'Đơn Hàng', icon: ClipboardList },
  { to: '/khach-hang', label: 'Khách Hàng', icon: Users },
  { to: '/danh-gia', label: 'Đánh Giá', icon: Star },
  { to: '/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/chinh-sach', label: 'Chính Sách', icon: ShieldCheck },
  { to: '/chi-nhanh', label: 'Chi Nhánh', icon: Building2 },
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
