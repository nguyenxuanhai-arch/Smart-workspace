import { CLIENT_ROUTES } from '../routes.js'

export const navItems = [
  { label: 'Bàn thông minh', to: `${CLIENT_ROUTES.products}?category=ban-thong-minh` },
  { label: 'Ghế công thái học', to: `${CLIENT_ROUTES.products}?category=ghe-cong-thai-hoc` },
  { label: 'Combo', to: CLIENT_ROUTES.combos },
  { label: 'Phụ kiện', to: `${CLIENT_ROUTES.products}?category=phu-kien` },
  { label: 'Workspace 3D', to: CLIENT_ROUTES.workspace3d },
  { label: 'Chính sách', to: CLIENT_ROUTES.policies },
]

export const trustBadges = ['Đổi trả 7 ngày', 'Bảo hành 6-12 tháng', 'Giao hàng nhanh', 'COD / MoMo / VNPay']

export const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Ld7NU52WYF6TU36VQ4NyiWSXW-xcsSrHAILkQuhFHtHsPuCXBdwrkbWERkjU_kltE0fDK80QnhElwM_KaX_u0C3z64sQPnAENBA2iEIPv8J_M_UWJBoiEDg7fOkShrPd-PfIgIkFJ0KobVaRvbNOSLkm70CbhN1FYtyD4oMqbvgWIvN4VYUGesJ4sIE1tfu9j0vp2x4C6n49m99svwwzYvAn6ihfQtM2WA58XrbcQq0l2g_4R5zLlw'

export const roomStyles = ['Tối giản', 'Creator', 'Coder', 'Hybrid']
export const deskTypes = ['Bàn nâng hạ cơ bản', 'Bàn thông minh cao cấp']
export const chairTypes = ['Ghế lưới công thái học', 'Ghế công thái học cao cấp']
export const deskColors = [
  { name: 'Oak', className: 'from-amber-200 to-yellow-700' },
  { name: 'Walnut', className: 'from-amber-700 to-stone-900' },
  { name: 'Graphite', className: 'from-slate-500 to-slate-950' },
]

export const categoryCards = [
  {
    title: 'Smart Standing Desk S1',
    desc: 'Dual motor, 100kg load, Bluetooth',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXSodoyR9Qr6jRVl96UvgDXO3DA--qOSE6lWceBD58aVOjiAX6-69fJ_FLp5jcJ-Yh9ypZA0aD_Y8sjzYaUx_juXms7L8tOZMDnx1JdfJuHZlC009qJZU8j6FNCE_Tt5OZZib7Yc0_-HafFS22mqdqGP6_oNOJv2gbcETKmvhtKZ6QFC1_JIoQLB3rMyJzoyEfXv3KohhdB98ZeyxGXUQNrwFnrW70Bd1zp4Dof6TRxPgtmvAegl-eVg',
    oldPrice: 10000000,
    price: 8500000,
    discount: '-15%',
  },
  {
    title: 'Ergo Mesh Chair M2',
    desc: '3D Armrest, Dynamic Lumbar Support',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB32ZQwrCRb7NoaLeHRhDnsdPX9NILXrxBmvBUueyGtujwNFPohb90vbuGR1ASvXTN1XyftFaTKf9vO3mKSzcTfBTl0zSO3eFdcdktXUJNTWoMnWXq8uMeooOQyHCFd0QbjCQSjKtEsX6fRAqyxYvzLU9i1crguxkmymZRSHKM0jxz080pVXy_1mZnAR5LuDMFB1MxhHiciG0yLi6g_gJSKvy1pZHCtTEu5YllBWMAM4BB6gMSjQuQhOw',
    price: 5200000,
  },
  {
    title: 'Monitor Light Bar',
    desc: 'Auto-dimming, CRI > 95, USB-C',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbRWfuWdYSDIax-qKlZ7-NXueVhmXrITmSvADQPjr4MhNp3gmxUKneudSCQTZYMktuaKx9rH1cLz8Cp7D6-uzT4q2T1kCuH4Ss8_QxQF54XRg8jqSGrl4gwwUq6GWfcKdB1iewKuI5hcKjxZIlqUboqojJEyJkFw4GFr0sSKilK4sWrWNa-NqhZoR6iJoWgya7PiPTd_vZ-Mis9663_5gK2in92vSmfD1HbvWiJZnI8KiYtxfnaCZmBQ',
    price: 1250000,
  },
  {
    title: 'Aluminum Laptop Stand',
    desc: '6-level tilt, portable',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_8JksOM7CndbqdQjJ8CxK-j1OfFfaKTyg4wmZQkEzoJWiPcsc46ZSi08cxkPygzWmARHvCFyT9XDPLulmONnLQTHR2PYRA4T0EZCw0SqRzxKMXPejtT1kRKkRN9kRu2X9qkBOS7exPVdwmon3HonHsk2VaDeBbjg9yMpPtfYnZyn4fc5ZCv1pdND4DLHoaBiM7PEo85m3ThqwHHzlMwKAVkxxoRMdguVOTmBZQ87WVP8I7uNlBXM39g',
    price: 450000,
  },
  {
    title: 'Wireless Charging Mat',
    desc: '15W Fast Charge, Felt Finish',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqvolD6P0kvAd-fRQbYTtvAs0lrKZqTjeTAdvXZyvq0S3uHVR3ZrIP5FnxcqwvT7G09iuGtF_94U_Jmeu2B9zGlwJFYRn-t-HFibg6UgndX2cAFmgPM9WzIoNQdxrjOd61VrwdP4eLW1p3xQUNLzpDde3AQo8fOsf9gSJ4Lv8GEFTO5ood9YkqooeM-YO1BqE2rrpT9j0p7slpRw78Jg3U6pKtpAqdFSAzZFYcPOMoq6b6n-WCNJeMtQ',
    price: 890000,
  },
  {
    title: 'Cable Management Kit',
    desc: 'Under-desk tray, 10 clips',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhyCQCDBVoy25buZ8dVFSYzmbVw7FzgMaKMHAzeZ2vDQCtqUJwH7wzYfsdRTcGm-tn9sFls1Roerp1O27At_dnwRB5NY0F9ErQt1kHq6iMBNZub33jJmxZxpW0t1_ZERfS6FJl3ydpfIQzDpZMpQIgSt1EMv1FJtyRf_SeSRoWeMen97pQLR4D_2Ei2H4q7BnXE3MBiVSOC3jAP04K0hhc0wQbpV47RDOO7G1QVSjovjCHdhUJS6gpNw',
    price: 350000,
  },
]

export const comboCards = [
  {
    name: 'Creator Setup',
    audience: 'Freelancer và content creator',
    desc: 'Tập trung vào thẩm mỹ, ánh sáng đẹp, phù hợp quay video và làm nội dung.',
    oldPrice: 14990000,
    price: 11990000,
    discount: '-20%',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5wv56NmyUt2VtM6JIAaOMju_5OIY2iDw6JMLe0sLSfXFOva3XvHfGlrtUfUXuS5HJ-3XWTksyf3ur9vvuZfzlpb4SxHy9kvFb0IFmPDPyaXHKO4pfcSDqZKkeEHXnl5hPsJ4yBW-nQYg3KvSVTscXtXxb1CIJHshHSUTxyzBXL1y44Z564kR_OcFVIpMvMN6teZKZy-Mj-L3rvJwdDr1xx3w29qIEkNe_dyBeMm6nX30wAcn3StRLeA',
    benefits: ['Ánh sáng quay video đẹp', 'Kệ decor gọn mắt', 'Desk mat sạc không dây'],
  },
  {
    name: 'Coder Elite',
    audience: 'Lập trình viên',
    desc: 'Tối ưu sự tập trung, màn hình kép, công thái học và quản lý dây cáp.',
    oldPrice: 16990000,
    price: 13490000,
    discount: '-21%',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj1LT9DX5FktKZlVsXKv3FBptAHF066yHERUyh_gIr6CI8Wpiiu9FQQOaagVuq1wcb7l1EE9XkRAhtkwnhFPorf9MU-z0z9Zym-NhiWk-X8SmiEyW_mKGXfubN_WkNEyN3oRjCva-fRbQ_R3dsy0AAXpY5PEXsmJGG902cLfrJCwQBcmQviR402UfY1OdbkVPuCS6vOWz-2d4VsoolalAGV7CA6_nqwkXy8fQ-KahDJrEilvCw-_CMRA',
    benefits: ['Bàn nâng hạ S1', 'Ghế Ergo Mesh M2', 'Cable kit đầy đủ'],
  },
  {
    name: 'Hybrid Focus',
    audience: 'Nhân viên remote hoặc hybrid',
    desc: 'Cân bằng giữa chuyên nghiệp, gọn gàng, thoải mái và tiết kiệm diện tích.',
    oldPrice: 12990000,
    price: 9990000,
    discount: '-23%',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaNLiXl_umLCjoZeLJzcCy2-SyZsN9KPl45QRuTV4F9gfUIUEIddYM-DZ1XGKaJAM-SMb4UZlbSiZVLXHNmjHZGTKlA-u4Mm012-Ka8JHxD3FRalme08L-hTuvVpBaV-GR0WbxTJFsYxIilOC47agvZJsLixj-BbZLqRSYpfI_h_XGgheKI2SEIxg8Q2caqmCSPv1lRkL1bl3_8zHEYiPwUXQwuucygooHY6LYLN5OsGIe5jXUvtfr_g',
    benefits: ['Bàn compact', 'Ghế lưới thoáng', 'Giá laptop + hub sạc'],
  },
]

export const featuredProducts = [
  ['Smart Standing Desk S1', 8990000, 6990000, '-22%', categoryCards[0].image],
  ['Ergo Mesh Chair M2', 5490000, 4190000, '-24%', categoryCards[1].image],
  ['Aluminum Laptop Stand', 890000, 690000, '-22%', categoryCards[2].image],
  ['Anti-glare Monitor Light Bar', 1490000, 1190000, '-20%', categoryCards[3].image],
  ['Wireless Charging Desk Mat', 1290000, 990000, '-23%', categoryCards[4].image],
  ['Cable Management Kit', 590000, 390000, '-34%', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80'],
]

export const reviews = [
  ['Minh Anh', 'Lập trình viên', 'Góc làm việc gọn hơn rất nhiều, ngồi code cả ngày đỡ mỏi lưng rõ rệt.', comboCards[1].image],
  ['Hoàng Vy', 'Content creator', 'Ánh sáng và bố cục setup lên hình đẹp, mình quay video nhanh hơn trước.', comboCards[0].image],
  ['Tuấn Kiệt', 'Sinh viên', 'Combo vừa ngân sách, bàn nhỏ nhưng đủ cho laptop, màn hình và sách vở.', categoryCards[2].image],
  ['Ngọc Hà', 'Nhân viên hybrid', 'Showroom tư vấn đúng nhu cầu, giao nhanh và lắp đặt rất gọn.', comboCards[2].image],
]
