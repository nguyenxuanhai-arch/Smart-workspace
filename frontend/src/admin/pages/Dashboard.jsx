import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { AlertCircle } from 'lucide-react'
import StatCard from '../components/StatCard.jsx'
import { dashboardApi } from '../api/dashboard.js'

const miniSeries = (base, variance) =>
  Array.from({ length: 12 }, (_, i) => ({
    v: base + Math.sin(i / 1.5) * variance + Math.random() * variance * 0.4,
  }))

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardApi
      .getStats()
      .then(setStats)
      .catch(() => setError('Không thể tải dữ liệu tổng quan từ backend.'))
      .finally(() => setLoading(false))
  }, [])

  const cards = stats
    ? [
        {
          title: 'Tổng Doanh Thu',
          value: formatCurrency(stats.totalRevenue),
          change: 0,
          color: '#14B8A6',
          data: miniSeries(50, 20),
        },
        {
          title: 'Tổng Đơn Hàng',
          value: stats.totalOrders,
          change: 0,
          color: '#3B82F6',
          data: miniSeries(50, 15),
        },
        {
          title: 'Đơn Chờ Xử Lý',
          value: stats.pendingOrders,
          change: 0,
          color: '#F59E0B',
          data: miniSeries(50, 25),
        },
        {
          title: 'Tổng Sản Phẩm',
          value: stats.totalProducts,
          change: 0,
          color: '#3B82F6',
          data: miniSeries(50, 10),
        },
      ]
    : []
  const topProducts = stats?.topProducts || []
  const chartData = (stats?.revenueSeries || []).map((item) => ({
    day: item.date?.slice(5) || '',
    doanhThu: Number(item.revenue || 0),
    donHang: item.orderCount || 0,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Tổng Quan</h1>

      {error && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3">
          <AlertCircle size={16} />
          {error} Kiểm tra backend đã chạy ở <code>http://localhost:8080</code> và bạn đã đăng nhập tài khoản ADMIN chưa.
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Đang tải dữ liệu...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
          {stats && (
            <div className="sm:col-span-2 xl:col-span-4 bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-sm text-slate-500">
              Feedback mới chưa xử lý: <span className="font-semibold text-slate-700">{stats.newFeedbacks}</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Doanh Thu &amp; Đơn Hàng Theo Ngày</h3>
            <span className="text-xs text-slate-400">7 ngày gần nhất</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  tickFormatter={(value) => (value >= 1000000 ? `${Math.round(value / 1000000)}tr` : value)}
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === 'doanhThu' ? [formatCurrency(value), 'Doanh thu'] : [value, 'Đơn hàng']
                  }
                />
                <Legend
                  formatter={(value) =>
                    value === 'doanhThu' ? 'Doanh Thu (triệu đồng)' : 'Đơn Hàng'
                  }
                />
                <Line
                  type="monotone"
                  dataKey="doanhThu"
                  stroke="#14B8A6"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="donHang"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Top Sản Phẩm Bán Chạy</h3>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-slate-400">Chưa có sản phẩm bán chạy từ các đơn đã hoàn tất.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.productId || product.productSku} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-700 truncate">{product.productName}</p>
                    <p className="text-xs text-slate-400">
                      SKU {product.productSku || 'N/A'} • Đã bán {product.soldQuantity || 0}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
