import { Search, Plus, Pencil, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const banners = [
  {
    id: 1,
    title: 'Sale Hè Rực Rỡ - Giảm Đến 50%',
    position: 'Trang chủ (Slide chính)',
    time: '01/06/2026 - 30/06/2026',
    status: 'Đang hiển thị',
    bg: 'from-orange-400 to-pink-500',
    label: 'SALE HÈ RỰC RỠ',
    sub: 'TOÀN BỘ SẢN PHẨM',
    tag: '-50%',
  },
  {
    id: 2,
    title: 'Laptop Chính Hãng - Ưu Đãi Đặc Biệt',
    position: 'Trang chủ (Giữa trang)',
    time: '25/05/2026 - 25/06/2026',
    status: 'Đang hiển thị',
    bg: 'from-blue-600 to-blue-800',
    label: 'LAPTOP CHÍNH HÃNG',
    sub: 'ƯU ĐÃI ĐẶC BIỆT',
  },
  {
    id: 3,
    title: 'Mỹ Phẩm Chính Hãng - Giảm 30%',
    position: 'Danh mục sản phẩm',
    time: '20/05/2026 - 20/06/2026',
    status: 'Đang hiển thị',
    bg: 'from-pink-200 to-pink-300',
    label: 'MỸ PHẨM CHÍNH HÃNG',
    sub: 'Giảm đến 30%',
    dark: true,
  },
  {
    id: 4,
    title: 'Freeship Toàn Quốc',
    position: 'Trang giỏ hàng',
    time: '01/05/2026 - 31/05/2026',
    status: 'Đã ẩn',
    bg: 'from-sky-400 to-sky-600',
    label: 'FREESHIP',
    sub: 'TOÀN QUỐC',
    tag: 'ĐƠN TỪ 300K',
  },
  {
    id: 5,
    title: 'Gaming Gear - Giảm Đến 40%',
    position: 'Trang chủ (Dưới cùng)',
    time: '10/06/2026 - 10/07/2026',
    status: 'Đang hiển thị',
    bg: 'from-slate-800 to-black',
    label: 'GAMING GEAR',
    sub: 'GEAR',
    tag: 'GIẢM ĐẾN 40%',
  },
]

const statusStyles = {
  'Đang hiển thị': 'bg-emerald-100 text-emerald-600',
  'Đã ẩn': 'bg-red-100 text-red-500',
}

export default function BannerTab() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm banner..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Vị trí hiển thị</span>
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
          Thêm banner
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[880px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-4 font-medium w-10">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="p-4 font-medium">Banner</th>
              <th className="p-4 font-medium">Tiêu đề</th>
              <th className="p-4 font-medium">Vị trí hiển thị</th>
              <th className="p-4 font-medium">Thời gian hiển thị</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="p-4">
                  <input type="checkbox" className="rounded border-slate-300" />
                </td>
                <td className="p-4">
                  <div
                    className={`w-28 h-14 rounded-md bg-gradient-to-br ${b.bg} flex flex-col items-center justify-center text-center px-1 ${
                      b.dark ? 'text-slate-800' : 'text-white'
                    }`}
                  >
                    <span className="text-[10px] font-bold leading-tight">{b.label}</span>
                    <span className="text-[8px] leading-tight">{b.sub}</span>
                    {b.tag && (
                      <span className="text-[8px] font-bold bg-black/20 rounded px-1 mt-0.5">
                        {b.tag}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-slate-600 max-w-[180px]">{b.title}</td>
                <td className="p-4 text-slate-600 whitespace-nowrap">{b.position}</td>
                <td className="p-4 text-slate-600 whitespace-nowrap">{b.time}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyles[b.status]}`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <button className="hover:text-blue-500 transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="hover:text-brand-teal transition-colors">
                      <Pencil size={16} />
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
        <p>Hiển thị 1 đến {banners.length} trong tổng số 12 banner</p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3].map((n) => (
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
