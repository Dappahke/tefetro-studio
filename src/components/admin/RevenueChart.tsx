// src/components/admin/RevenueChart.tsx
"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimePostgresChangesPayload, RealtimeChannel } from "@supabase/supabase-js";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Line,
  Cell,
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  RefreshCw, 
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";
type ChartType = "area" | "bar" | "combined";

interface OrderRecord {
  id: string;
  created_at: string;
  total: number | string;
  status: "pending" | "paid" | "completed" | "cancelled" | "refunded";
  user_id?: string;
  product_id?: string;
}

interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  previousRevenue?: number;
  growth?: number;
}

interface RevenueAnalyticsProps {
  className?: string;
  defaultRange?: TimeRange;
  showControls?: boolean;
  height?: number;
  refreshInterval?: number;
}

const RANGE_CONFIG: Record<TimeRange, { days: number; label: string; interval: string }> = {
  "7d": { days: 7, label: "Last 7 Days", interval: "daily" },
  "30d": { days: 30, label: "Last 30 Days", interval: "daily" },
  "90d": { days: 90, label: "Last 3 Months", interval: "weekly" },
  "1y": { days: 365, label: "Last Year", interval: "monthly" },
  "all": { days: 365 * 5, label: "All Time", interval: "monthly" },
};

export function RevenueAnalytics({
  className = "",
  defaultRange = "30d",
  showControls = true,
  height = 400,
  refreshInterval = 30,
}: RevenueAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultRange);
  const [chartType, setChartType] = useState<ChartType>("area");
  const [data, setData] = useState<DailyRevenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [hoveredPoint, setHoveredPoint] = useState<DailyRevenue | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");

  const chartRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Helper: safely parse total (handles string numeric from Supabase)
  const parseTotal = (value: number | string | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Process raw orders into daily aggregates
  const processOrders = useCallback((orders: OrderRecord[]): DailyRevenue[] => {
    const { days } = RANGE_CONFIG[timeRange];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Group by date
    const grouped = orders.reduce((acc, order) => {
      const date = new Date(order.created_at).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { revenue: 0, orders: 0, totalAmount: 0 };
      }
      const orderTotal = parseTotal(order.total);
      acc[date].revenue += orderTotal;
      acc[date].orders += 1;
      acc[date].totalAmount += orderTotal;
      return acc;
    }, {} as Record<string, { revenue: number; orders: number; totalAmount: number }>);

    // Fill all dates in range
    const filled: DailyRevenue[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const dayData = grouped[dateStr] || { revenue: 0, orders: 0, totalAmount: 0 };

      filled.push({
        date: dateStr,
        revenue: dayData.revenue,
        orders: dayData.orders,
        avgOrderValue: dayData.orders > 0 ? dayData.totalAmount / dayData.orders : 0,
      });
    }

    // Calculate growth rates
    return filled.map((day, index) => {
      if (index === 0) return { ...day, growth: 0 };
      const prev = filled[index - 1];
      const growth = prev.revenue > 0 
        ? ((day.revenue - prev.revenue) / prev.revenue) * 100 
        : 0;
      return {
        ...day,
        previousRevenue: prev.revenue,
        growth,
      };
    });
  }, [timeRange]);

  // Fetch data from Supabase
  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    const { days } = RANGE_CONFIG[timeRange];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("id, created_at, total, status, user_id")
        .gte("created_at", startDate.toISOString())
        .in("status", ["paid", "completed"])
        .order("created_at", { ascending: true });

      if (error) throw error;

      console.log("Fetched orders:", orders?.length || 0);
      console.log("Sample order:", orders?.[0]);

      const processed = processOrders(orders || []);
      setData(processed);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch revenue data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, timeRange, processOrders]);

  // Real-time subscription
  useEffect(() => {
    fetchData();

    let channel: RealtimeChannel | null = null;

    const setupSubscription = async () => {
      channel = supabase
        .channel("revenue-analytics")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `status=in.(paid,completed)`,
          },
          (payload: RealtimePostgresChangesPayload<OrderRecord>) => {
            console.log("Real-time update:", payload);
            fetchData(true);
          }
        )
        .subscribe((status: string) => {
          setConnectionStatus(status === "SUBSCRIBED" ? "connected" : "disconnected");
        });
    };

    setupSubscription();

    // Polling fallback
    let intervalId: NodeJS.Timeout;
    if (refreshInterval > 0) {
      intervalId = setInterval(() => fetchData(true), refreshInterval * 1000);
    }

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData, refreshInterval, supabase]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data.length) return null;

    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const avgDailyRevenue = totalRevenue / data.length;

    const maxDay = data.reduce((max, d) => d.revenue > max.revenue ? d : max, data[0]);
    const minDay = data.reduce((min, d) => d.revenue < min.revenue ? d : min, data[0]);

    // Compare with previous period
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);
    const firstHalfRevenue = firstHalf.reduce((sum, d) => sum + d.revenue, 0);
    const secondHalfRevenue = secondHalf.reduce((sum, d) => sum + d.revenue, 0);
    const periodGrowth = firstHalfRevenue > 0 
      ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100 
      : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      avgDailyRevenue,
      maxDay,
      minDay,
      periodGrowth,
      conversionRate: 68.5,
    };
  }, [data]);

  // Formatting helpers
  const formatCurrency = (value: number, compact = true) => {
    if (compact && value >= 1000000) return `KES ${(value / 1000000).toFixed(1)}M`;
    if (compact && value >= 1000) return `KES ${(value / 1000).toFixed(1)}K`;
    return `KES ${value.toLocaleString()}`;
  };

  const formatDate = (dateStr: string, range: TimeRange) => {
    const date = new Date(dateStr);
    if (range === "7d") return date.toLocaleDateString("en-US", { weekday: "short" });
    if (range === "30d") return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  // Export CSV
  const exportData = () => {
    const csv = [
      ["Date", "Revenue", "Orders", "Avg Order Value", "Growth %"].join(","),
      ...data.map(d => [
        d.date,
        d.revenue,
        d.orders,
        d.avgOrderValue.toFixed(2),
        d.growth?.toFixed(2) || 0,
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-${timeRange}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Export PDF via server-side API
  const exportPDF = async () => {
    try {
      setIsExportingPDF(true);

      const response = await fetch("/api/export/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeRange,
          chartData: data,
          stats,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "PDF generation failed");
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tefetro-revenue-${timeRange}-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const dayData = payload[0].payload as DailyRevenue;
    const isPositive = (dayData.growth || 0) >= 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-stone-200 rounded-2xl shadow-xl p-4 min-w-[200px]"
      >
        <p className="text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider">
          {new Date(label).toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-stone-600 text-sm">Revenue</span>
            <span className="text-lg font-bold text-stone-900">
              {formatCurrency(dayData.revenue, false)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-600 text-sm">Orders</span>
            <span className="font-semibold text-stone-800">{dayData.orders}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-600 text-sm">Avg Order</span>
            <span className="font-medium text-stone-700">
              {formatCurrency(dayData.avgOrderValue)}
            </span>
          </div>

          {dayData.growth !== undefined && (
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-stone-600 text-sm">vs Previous</span>
              <span className={`flex items-center gap-1 font-medium ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(dayData.growth || 0).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`bg-white rounded-3xl border border-stone-200 shadow-sm ${className}`}>
        <div className="p-6 border-b border-stone-100">
          <div className="h-8 bg-stone-200 rounded-lg w-1/3 animate-pulse" />
          <div className="h-4 bg-stone-100 rounded w-1/4 mt-2 animate-pulse" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-stone-100 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-80 bg-stone-50 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={chartRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-stone-100">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              Revenue Analytics
              <span className={`
                inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                ${connectionStatus === "connected" 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-amber-100 text-amber-700"}
              `}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  connectionStatus === "connected" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`} />
                {connectionStatus === "connected" ? "Live" : "Reconnecting..."}
              </span>
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              Real-time revenue tracking and insights
            </p>
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchData(true)}
                disabled={isRefreshing}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              </button>

              <button
                onClick={exportPDF}
                disabled={isExportingPDF}
                className="p-2 text-stone-400 hover:text-tefetro hover:bg-orange-50 rounded-xl transition-all disabled:opacity-50"
                title="Export PDF"
              >
                <FileText size={18} className={isExportingPDF ? "animate-pulse" : ""} />
              </button>

              <button
                onClick={exportData}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all"
                title="Export CSV"
              >
                <Download size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Revenue"
              value={formatCurrency(stats.totalRevenue, false)}
              trend={stats.periodGrowth}
              icon={<DollarSign size={18} className="text-tefetra" />}
              highlight
            />
            <StatCard
              label="Total Orders"
              value={stats.totalOrders.toLocaleString()}
              subtext={`${stats.avgOrderValue >= 1000 ? (stats.avgOrderValue/1000).toFixed(1) + 'K' : stats.avgOrderValue.toFixed(0)} avg`}
              icon={<Activity size={18} className="text-blue-500" />}
            />
            <StatCard
              label="Best Day"
              value={formatCurrency(stats.maxDay.revenue)}
              subtext={new Date(stats.maxDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              icon={<TrendingUp size={18} className="text-emerald-500" />}
            />
            <StatCard
              label="Conversion"
              value={`${stats.conversionRate}%`}
              trend={2.4}
              icon={<Filter size={18} className="text-violet-500" />}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {(Object.keys(RANGE_CONFIG) as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${timeRange === range 
                    ? "bg-white text-stone-900 shadow-sm" 
                    : "text-stone-500 hover:text-stone-700"}
                `}
              >
                {RANGE_CONFIG[range].label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 uppercase tracking-wider font-medium">Chart Type</span>
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
              {(["area", "bar", "combined"] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`
                    px-3 py-1 rounded-md text-xs font-medium capitalize transition-all
                    ${chartType === type 
                      ? "bg-white text-stone-900 shadow-sm" 
                      : "text-stone-500 hover:text-stone-700"}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="p-6">
        <div style={{ height }} className="relative">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart
                data={data}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                onMouseMove={(e: any) => e.activePayload && setHoveredPoint(e.activePayload[0].payload)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F28C00" stopOpacity={0.3} />
                    <stop offset="50%" stopColor="#F28C00" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#F28C00" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="4 4" 
                  stroke="#E4E0D1" 
                  vertical={false}
                  opacity={0.4}
                />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#78716c", fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(val) => formatDate(val, timeRange)}
                  dy={10}
                  minTickGap={30}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#78716c", fontSize: 11 }}
                  tickFormatter={(val) => formatCurrency(val)}
                  width={80}
                  domain={[0, "auto"]}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#F28C00", strokeWidth: 1, strokeDasharray: "4 4" }} />

                {stats && (
                  <ReferenceLine
                    y={stats.avgDailyRevenue}
                    stroke="#78716c"
                    strokeDasharray="4 4"
                    strokeOpacity={0.5}
                    label={{ value: "Avg", position: "right", fill: "#78716c", fontSize: 10 }}
                  />
                )}

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F28C00"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            ) : chartType === "bar" ? (
              <BarChart
                data={data}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#E4E0D1" vertical={false} opacity={0.4} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#78716c", fontSize: 11 }}
                  tickFormatter={(val) => formatDate(val, timeRange)}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#78716c", fontSize: 11 }}
                  tickFormatter={(val) => formatCurrency(val)}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.revenue > (stats?.avgDailyRevenue || 0) ? "#F28C00" : "#FDBA74"}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#E4E0D1" vertical={false} opacity={0.4} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#78716c", fontSize: 11 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#78716c", fontSize: 11 }} tickFormatter={(val) => formatCurrency(val)} width={80} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#78716c", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="revenue" fill="#F28C00" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </ComposedChart>
            )}
          </ResponsiveContainer>

          <AnimatePresence>
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-xl p-3 shadow-lg pointer-events-none"
              >
                <p className="text-xs text-stone-400">{new Date(hoveredPoint.date).toLocaleDateString()}</p>
                <p className="text-lg font-bold text-stone-900">{formatCurrency(hoveredPoint.revenue)}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
          <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
          <p className="flex items-center gap-1">
            <Calendar size={12} />
            {data.length} days of data
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Sub-component for stat cards
function StatCard({ 
  label, 
  value, 
  trend, 
  subtext, 
  icon, 
  highlight = false 
}: { 
  label: string;
  value: string;
  trend?: number;
  subtext?: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  const isPositive = (trend || 0) >= 0;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-4 transition-all hover:shadow-md
      ${highlight 
        ? "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100" 
        : "bg-stone-50 border border-stone-100"}
    `}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">{label}</span>
        <div className={`p-1.5 rounded-lg ${highlight ? "bg-white/80" : "bg-white"}`}>
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <p className={`text-2xl font-bold ${highlight ? "text-stone-900" : "text-stone-800"}`}>
          {value}
        </p>

        {(trend !== undefined || subtext) && (
          <div className="flex items-center gap-2">
            {trend !== undefined && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(trend).toFixed(1)}%
              </span>
            )}
            {subtext && (
              <span className="text-xs text-stone-400">{subtext}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}