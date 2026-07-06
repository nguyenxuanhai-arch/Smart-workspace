import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import VoucherTab from './marketing/VoucherTab.jsx'
import BannerTab from './marketing/BannerTab.jsx'
import PromotionTab from './marketing/PromotionTab.jsx'

const tabs = [
  { key: 'voucher', label: 'Mã giảm giá' },
  { key: 'banner', label: 'Banner' },
  { key: 'promotion', label: 'Chương trình khuyến mại' },
]

export default function Marketing() {
  const [active, setActive] = useState('voucher')

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800">Quản Lý Khuyến Mại</h1>

      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3">
        <AlertCircle size={16} className="shrink-0" />
        Backend chưa có API cho mã giảm giá / banner / chương trình khuyến mại (dù có entity{' '}
        <code>Promotion</code> nhưng chưa có controller). 3 tab dưới đây vẫn là <strong>dữ liệu mẫu</strong>.
      </div>

      <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              active === t.key
                ? 'bg-brand-teal text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === 'voucher' && <VoucherTab />}
      {active === 'banner' && <BannerTab />}
      {active === 'promotion' && <PromotionTab />}
    </div>
  )
}
