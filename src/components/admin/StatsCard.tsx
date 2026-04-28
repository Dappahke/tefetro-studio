// src/components/admin/StatsCard.tsx
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
          <p className="text-sm text-mist mb-1">{title}</p>
          <p className="text-2xl font-bold text-deep-800">{value}</p>
        </div>
        <span className="text-3xl text-tefetro">{icon}</span>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <span className={`
          text-xs font-medium px-2.5 py-1 rounded-full
          ${alert 
            ? 'bg-rose-100 text-rose-700' 
            : trendUp 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-stone-100 text-stone-600'}
        `}>
          {trend}
        </span>
        {!alert && (
          <span className="text-xs text-mist">
            {trendUp ? '↑' : '↓'} vs last period
          </span>
        )}
      </div>
    </div>
  )
}