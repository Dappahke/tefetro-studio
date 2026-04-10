"use client";

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  date: string;
  revenue: number;
};

interface RevenueChartProps {
  orders: ChartData[]; // matches analytics output
}

export function RevenueChart({ orders }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000) return `KES ${(value / 1000).toFixed(1)}K`;
    return `KES ${value}`;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={orders}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {/* Gradient */}
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF961C" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF961C" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E4E0D1"
            vertical={false}
          />

          {/* X Axis */}
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6F6F6F", fontSize: 12 }}
            dy={10}
          />

          {/* Y Axis */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6F6F6F", fontSize: 12 }}
            tickFormatter={(value: number) => formatCurrency(value)}
            width={80}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #E4E0D1",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
            formatter={(value) => {
              const safeValue =
                typeof value === "number" ? value : 0;
              return [formatCurrency(safeValue), "Revenue"];
            }}
          />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#EF961C" // tefetra orange
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}