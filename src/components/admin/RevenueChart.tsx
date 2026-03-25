'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

interface Order {
  created_at: string
  total: number
}

interface RevenueChartProps {
  orders: Order[]
}

export function RevenueChart({ orders }: RevenueChartProps) {
  const data = useMemo(() => {
    // Group orders by date (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })

    const dailyRevenue = last7Days.map(date => {
      const dayOrders = orders.filter((o: any) => 
        o.created_at.startsWith(date)
      )
      const revenue = dayOrders.reduce((sum: number, o: any) => 
        sum + Number(o.total), 0
      )
      
      return {
        date: new Date(date).toLocaleDateString('en-GB', { 
          weekday: 'short',
          day: 'numeric'
        }),
        revenue: Math.round(revenue),
        orders: dayOrders.length
      }
    })

    return dailyRevenue
  }, [orders])

  const formatCurrency = (value: number) => {
    if (value >= 1000) return `KES ${(value / 1000).toFixed(1)}K`
    return `KES ${value}`
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF961C" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#EF961C" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E0D1" vertical={false} />
          
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6F6F6F', fontSize: 12 }}
            dy={10}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6F6F6F', fontSize: 12 }}
            tickFormatter={formatCurrency}
            width={80}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #E4E0D1',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
            formatter={(value) => {
              if (typeof value === 'number') {
                return [formatCurrency(value), 'Revenue']
              }
              return ['KES 0', 'Revenue']
            }}
          />
          
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#EF961C" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}