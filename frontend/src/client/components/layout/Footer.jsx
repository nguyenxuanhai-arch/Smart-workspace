import { Link } from 'react-router-dom'
import { CLIENT_ROUTES } from '../../routes.js'

const footerGroups = [
  {
    title: 'Sản phẩm',
    links: [
      ['Bàn thông minh', `${CLIENT_ROUTES.products}?category=ban-thong-minh`],
      ['Ghế công thái học', `${CLIENT_ROUTES.products}?category=ghe-cong-thai-hoc`],
      ['Phụ kiện', `${CLIENT_ROUTES.products}?category=phu-kien`],
      ['Workspace 3D', CLIENT_ROUTES.workspace3d],
    ],
  },
  {
    title: 'Công ty',
    links: [
      ['Về chúng tôi', CLIENT_ROUTES.home],
      ['Tuyển dụng', CLIENT_ROUTES.contact],
      ['Liên hệ', CLIENT_ROUTES.contact],
    ],
  },
  {
    title: 'Pháp lý',
    links: [
      ['Đổi trả', CLIENT_ROUTES.returnPolicy],
      ['Bảo hành', CLIENT_ROUTES.warrantyPolicy],
      ['Thanh toán', CLIENT_ROUTES.paymentPolicy],
      ['Vận chuyển', CLIENT_ROUTES.shippingPolicy],
    ],
  },
]

export default function Footer({ compact = false }) {
  return (
    <footer className="w-full border-t border-border-subtle bg-surface-container">
      <div
        className={`mx-auto grid max-w-[1280px] grid-cols-1 gap-gutter px-4 sm:px-6 md:grid-cols-4 ${
          compact ? 'py-12' : 'py-section-gap-mobile lg:py-16'
        }`}
      >
        <div>
          <Link to={CLIENT_ROUTES.home} className="mb-4 block text-[30px] font-semibold leading-[38px] text-primary">
            Smart Workspace
          </Link>
          <p className="text-base leading-6 text-on-surface-variant">Trao quyền cho các nhóm hiện đại bằng công nghệ chính xác.</p>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.title} className="flex flex-col gap-3">
            <h3 className="font-mono text-sm font-semibold uppercase text-primary">{group.title}</h3>
            {group.links.map(([label, to]) => (
              <Link key={label} to={to} className="font-mono text-xs text-on-surface-variant transition hover:text-secondary">
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="mx-auto max-w-[1280px] border-t border-border-subtle px-4 py-6 text-center font-mono text-xs text-on-surface-variant sm:px-6">
        © 2026 Smart Workspace. Bảo lưu mọi quyền.
      </div>
    </footer>
  )
}
