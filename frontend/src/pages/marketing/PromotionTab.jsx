import { Search, Plus, Pencil, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const programs = [
  {
    id: 1,
    name: 'Siêu Sale 6.6',
    desc: 'Ưu đãi lớn nhất tháng 6',
    apply: 'Toàn bộ sản phẩm',
    time: '01/06/2026 - 06/06/2026',
    order: 'Từ 500.000đ',
    benefit: 'Giảm đến 60% Freeship đơn từ 300k',
    status: 'Đang diễn ra',
    bg: 'from-red-500 to-pink-600',
    tag: '6.6',
    sub: 'GIẢM ĐẾN 60%',
  },
  {
    id: 2,
    name: 'Mua 1 Tặng 1',
    desc: 'Mua 1 sản phẩm, tặng 1 sản phẩm cùng loại',
    apply: 'Sản phẩm nhóm mỹ phẩm',
    time: '15/06/2026 - 30/06/2026',
    order: 'Từ 300.000đ',
    benefit: 'Mua 1 tặng 1 Sản phẩm cùng loại',
    status: 'Sắp diễn ra',
    bg: 'from-amber-400 to-orange-500',
    tag: '🎁',
    sub: 'MUA 1 TẶNG 1',
  },
  {
    id: 3,
    name: 'Deal Chớp Nhoáng',
    desc: 'Deal giá giờ vàng, 0h - 2h mỗi ngày',
    apply: 'Sản phẩm đang khuyến mại',
    time: '01/06/2026 - 30/06/2026',
    order: 'Từ 200.000đ',
    benefit: 'Giảm 25% khung giờ 0h - 2h',
    status: 'Đang diễn ra',
    bg: 'from-teal-400 to-cyan-600',
    tag: '⚡',
    sub: 'GIẢM 25%',
  },
  {
    id: 4,
    name: 'Ưu Đãi Thành Viên VIP',
    desc: 'Giảm thêm cho khách hàng thành viên VIP',
    apply: 'Khách hàng thành viên VIP',
    time: '01/06/2026 - 31/12/2026',
    order: 'Từ 1.000.000đ',
    benefit: 'Giảm thêm 10% đơn từ 1.000.000đ',
    status: 'Đang diễn ra',
    bg: 'from-blue-600 to-indigo-700',
    tag: '👑',
    sub: 'THÀNH VIÊN VIP',
  },
  {
    id: 5,
    name: 'Back To School',
    desc: 'Ưu đãi mùa tựu trường',
    apply: 'Nhóm sản phẩm đồ dùng học tập',
    time: '20/07/2026 - 31/08/2026',
    order: 'Từ 300.000đ',
    benefit: 'Giảm đến 30% nhiều sản phẩm',
    status: 'Kết thúc',
    bg: 'from-purple-500 to-violet-700',
    tag: '🎒',
    sub: 'BACK TO SCHOOL',
  },
]

const statusStyles = {
  'Đang diễn ra': 'bg-emerald-100 text-emerald-600',
  'Sắp diễn ra': 'bg-amber-100 text-amber-600',
  'Kết thúc': 'bg-red-100 text-red-500',
}

export default function PromotionTab() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chương trình..."
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
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Áp dụng cho</span>
          <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-brand-teal">
            <option>Tất cả</option>
          </select>
        </div>
        <button className="ml-auto flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} />
          Thêm chương trình
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[960px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-4 font-medium w-10">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="p-4 font-medium">Tên chương trình</th>
              <th className="p-4 font-medium">Áp dụng cho</th>
              <th className="p-4 font-medium">Thời gian diễn ra</th>
              <th className="p-4 font-medium">Đơn hàng</th>
              <th className="p-4 font-medium">Ưu đãi</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="p-4">
                  <input type="checkbox" className="rounded border-slate-300" />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.bg} flex flex-col items-center justify-center text-white shrink-0`}
                    >
                      <span className="text-sm leading-none">{p.tag}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 leading-tight">{p.name}</p>
                      <p className="text-xs text-slate-400 leading-tight">{p.desc}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600 max-w-[150px]">{p.apply}</td>
                <td className="p-4 text-slate-600 whitespace-nowrap">{p.time}</td>
                <td className="p-4 text-slate-600 whitespace-nowrap">{p.order}</td>
                <td className="p-4 text-slate-600 max-w-[180px]">{p.benefit}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyles[p.status]}`}>
                    {p.status}
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
        <p>Hiển thị 1 đến {programs.length} trong tổng số 15 chương trình</p>
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
