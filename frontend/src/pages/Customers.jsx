import { useState } from 'react'
import { Search, ShoppingCart, Pencil, Eye, Lock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

const customers = [
  { id: 1, name: 'Lê Văn B', email: 'le.vanb@mail.com', phone: '(076) 534-7556', spent: '43.360.000đ', orders: 12, date: '19/10/2023', status: 'Hoạt động' },
  { id: 2, name: 'Nguyễn Thị A', email: 'nguyenthiA.com', phone: '(076) 339-4319', spent: '43.360.000đ', orders: 8, date: '19/10/2023', status: 'Bị khóa' },
  { id: 3, name: 'Nguyễn Thị A', email: 'nguyenthiA.com', phone: '(076) 339-7553', spent: '578.000đ', orders: 3, date: '19/10/2023', status: 'Hoạt động' },
  { id: 4, name: 'Nguyễn Thị A', email: 'nguyenthiA.com', phone: '(016) 292-4223', spent: '578.000đ', orders: 5, date: '19/10/2023', status: 'Hoạt động' },
  { id: 5, name: 'Nguyễn Thị A', email: 'nguyenthiA.com', phone: '(076) 298-3859', spent: '578.000đ', orders: 2, date: '19/10/2023', status: 'Hoạt động' },
  { id: 6, name: 'Lê Văn B', email: 'nguyenthiA.com', phone: '(076) 25-6934', spent: '318.000đ', orders: 1, date: '19/10/2023', status: 'Hoạt động' },
]

function StatusBadge({ status }) {
  const active = status === 'Hoạt động'
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        active ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
      }`}
    >
      {status}
    </span>
  )
}

export default function Customers() {
  const [type, setType] = useState('B2C')

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800">Quản Lý Khách Hàng (B2C/B2B)</h1>

      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3">
        <AlertCircle size={16} className="shrink-0" />
        Backend Smart Workspace chưa có endpoint admin để liệt kê khách hàng (không có <code>GET /api/admin/users</code>),
        cũng chưa phân loại B2C/B2B. Bảng dưới đây vẫn là <strong>dữ liệu mẫu</strong> để giữ giao diện.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search for: Name, Email, Phone"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>

        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-sm font-medium">
          <button
            onClick={() => setType('B2C')}
            className={`px-4 py-2 transition-colors ${
              type === 'B2C' ? 'bg-brand-teal text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            B2C
          </button>
          <button
            onClick={() => setType('B2B')}
            className={`px-4 py-2 transition-colors ${
              type === 'B2B' ? 'bg-brand-teal text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            B2B
          </button>
        </div>

        <button className="flex items-center gap-2 border border-brand-teal text-brand-teal rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-teal/5 transition-colors">
          <ShoppingCart size={16} />
          Đơn Hàng
        </button>

        <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-brand-teal">
          <option>Trạng Thái</option>
          <option>Hoạt động</option>
          <option>Bị khóa</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-4 font-medium w-10">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="p-4 font-medium">Tên Khách Hàng</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Tổng Tiêu</th>
              <th className="p-4 font-medium">Số Đơn Hàng</th>
              <th className="p-4 font-medium">Ngày Sử Dụng</th>
              <th className="p-4 font-medium">Trạng Thái</th>
              <th className="p-4 font-medium">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="p-4">
                  <input type="checkbox" className="rounded border-slate-300" />
                </td>
                <td className="p-4 font-medium text-slate-700">{c.name}</td>
                <td className="p-4">
                  <p className="text-slate-700">{c.email}</p>
                  <p className="text-slate-400 text-xs">{c.phone}</p>
                </td>
                <td className="p-4 text-slate-600">{c.spent}</td>
                <td className="p-4 text-slate-600">{c.orders}</td>
                <td className="p-4 text-slate-600">{c.date}</td>
                <td className="p-4">
                  <StatusBadge status={c.status} />
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
                      <Lock size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>Hiển thị 1 đến {customers.length} trong tổng số {customers.length} khách hàng</p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-teal text-white font-medium">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
