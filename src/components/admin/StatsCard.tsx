import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string
  trend: string
  trendUp: boolean
  alert?: boolean
  icon: ReactNode
}

export function StatsCard({ title, value, trend, trendUp, alert, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30 hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-deep-700">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <span className={`
          text-xs font-medium px-2 py-1 rounded-full
          ${alert ? 'bg-alert/10 text-alert' : 
            trendUp ? 'bg-sage/10 text-sage' : 'bg-neutral-100 text-neutral-600'}
        `}>
          {trend}
        </span>
        {!alert && (
          <span className="text-xs text-neutral-400">
            {trendUp ? '↑' : '↓'} vs last period
          </span>
        )}
      </div>
    </div>
  )
}