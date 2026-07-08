import { CLIENT_ROUTES } from '../routes.js'

export const accountNavItems = [
  {
    key: 'profile',
    label: 'Thông tin cá nhân',
    to: CLIENT_ROUTES.accountProfile,
    icon: 'user',
  },
  {
    key: 'orders',
    label: 'Đơn hàng của tôi',
    to: CLIENT_ROUTES.accountOrders,
    icon: 'orders',
  },
  {
    key: 'payments',
    label: 'Lịch sử thanh toán',
    to: CLIENT_ROUTES.accountPayments,
    icon: 'payments',
  },
  {
    key: 'settings',
    label: 'Cài đặt',
    to: CLIENT_ROUTES.accountSettings,
    icon: 'settings',
  },
]
