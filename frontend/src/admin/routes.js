export const ADMIN_ROUTES = {
  root: '/admin',
  login: '/admin/login',
  products: '/admin/san-pham',
  productForm: '/admin/danh-muc',
  orders: '/admin/don-hang',
  customers: '/admin/khach-hang',
  reviews: '/admin/danh-gia',
  marketing: '/admin/marketing',
  policy: '/admin/chinh-sach',
  branches: '/admin/chi-nhanh',
  payments: '/admin/thanh-toan',
}

export const LEGACY_ADMIN_REDIRECTS = [
  { from: '/login', to: ADMIN_ROUTES.login },
  { from: '/', to: ADMIN_ROUTES.root },
  { from: '/san-pham', to: ADMIN_ROUTES.products },
  { from: '/danh-muc', to: ADMIN_ROUTES.productForm },
  { from: '/don-hang', to: ADMIN_ROUTES.orders },
  { from: '/khach-hang', to: ADMIN_ROUTES.customers },
  { from: '/danh-gia', to: ADMIN_ROUTES.reviews },
  { from: '/marketing', to: ADMIN_ROUTES.marketing },
  { from: '/chinh-sach', to: ADMIN_ROUTES.policy },
  { from: '/chi-nhanh', to: ADMIN_ROUTES.branches },
]
