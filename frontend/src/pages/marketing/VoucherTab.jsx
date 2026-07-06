import { Search, Plus, Pencil, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const vouchers = [
  { id: 1, code: 'SALE20', name: 'Sale tháng 6', discount: '20%', condition: 'Đơn hàng từ 500.000đ', min: '≥ 500.000đ', start: '01/06/2026', end: '30/06/2026', status: 'Đang hoạt động' },
  { id: 2, code: 'VIP100', name: 'Khách VIP', discount: '100.000đ', condition: 'Đơn hàng từ 1.000.000đ', min: '≥ 1.000.000đ', start: '01/06/2026', end: '15/07/2026', status: 'Đã khóa' },
  { id: 3, code: 'FREESHIP', name: 'Freeship toàn quốc', discount: 'Miễn phí', condition: 'Đơn hàng từ 300.000đ', min: '≥ 300.000đ', start: '05/06/2026', end: '31/07/2026', status: 'Đang hoạt động' },
  { id: 4, code: 'WELCOME10', name: 'Giảm 10% cho khách mới', discount: '10%', condition: 'Khách hàng mới', min: '≥ 200.000đ', start: '01/06/2026', end: '30/06/2026', status: 'Đang hoạt động' },
  { id: 5, code: 'SUMMER50', name: 'Ưu đãi mùa hè', discount: '50.000đ', condition: 'Đơn hàng từ 800.000đ', min: '≥ 800.000đ', start: '10/06/2026', end: '20/06/2026', status: 'Đang hoạt động' },
]

const statusStyles = {
  'Đang hoạt động': 'bg-emerald-100 text-emerald-600',
  'Đã khóa': 'bg-red-100 text-red-500',
}

export default function VoucherTab() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mã giảm giá..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Đơn hàng</span>
          <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-brand-teal">
            <option>Tất cả</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Trạng thái</span>
          <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-brand-teal">
            <option>Tất cả</option>
          </select>
        </div>
        <button className="ml-auto flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} />
          Thêm mã giảm giá
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-4 font-medium w-10">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="p-4 font-medium">Mã ↕</th>
              <th className="p-4 font-medium">Tên chương trình</th>
              <th className="p-4 font-medium">Giảm giá</th>
              <th className="p-4 font-medium">Điều kiện</th>
              <th className="p-4 font-medium">Đơn hàng</th>
              <th className="p-4 font-medium">Ngày bắt đầu</th>
              <th className="p-4 font-medium">Ngày hết hạn</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="p-4">
                  <input type="checkbox" className="rounded border-slate-300" />
                </td>
                <td className="p-4 font-semibold text-slate-700 whitespace-nowrap">{v.code}</td>
                <td className="p-4 text-slate-600 whitespace-nowrap">{v.name}</td>
                <td className="p-4 text-slate-600 whitespace-nowrap">{v.discount}</td>
                <td className="p-4 text-slate-600 whitespace-nowrap">{v.condition}</td>
                <td className="p-4 text-slate-600 whitespace-nowrap">{v.min}</td>
                <td className="p-4 text-slate-600 whitespace-nowrap">{v.start}</td>
                <td className="p-4 text-slate-600 whitespace-nowrap">{v.end}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyles[v.status]}`}>
                    {v.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <button className="hover:text-brand-teal transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button className="hover:text-blue-500 transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>Hiển thị 1 đến {vouchers.length} trong tổng số 18 mã giảm giá</p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-colors ${
                n === 1 ? 'bg-brand-teal text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {n}
            </button>
          ))}
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
