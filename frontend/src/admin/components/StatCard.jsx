import { AreaChart, Area, ResponsiveContainer } from 'recharts'

export default function StatCard({ title, value, change, data, color }) {
  const isPositive = change >= 0

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <p className="text-sm text-slate-500 mb-1">{title}</p>
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-2xl font-semibold text-slate-800">{value}</h3>
        <span
          className={`text-xs font-medium ${
            isPositive ? 'text-emerald-500' : 'text-red-500'
          }`}
        >
          {isPositive ? '+' : ''}
          {change}%
        </span>
      </div>
      <div className="h-12 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${title})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
