"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
};

type ChartData = {
  date: string;
  revenue: number;
};

export default function AnalyticsPage() {
  // ✅ FIX 1: Initialize Supabase correctly
  const supabase = useMemo(() => createClient(), []);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Compute analytics
  const computeAnalytics = (orders: Order[]) => {
    const completed = orders.filter(
      (o) => o.status === "completed" || o.status === "paid"
    );

    const revenue = completed.reduce(
      (sum, o) => sum + Number(o.total),
      0
    );

    const totalOrders = orders.length;
    const completedOrders = completed.length;

    const conversionRate = totalOrders
      ? ((completedOrders / totalOrders) * 100).toFixed(1)
      : "0";

    // 📊 Group revenue by date
    const revenueMap: Record<string, number> = {};

    completed.forEach((o) => {
      const date = new Date(o.created_at).toLocaleDateString();

      if (!revenueMap[date]) {
        revenueMap[date] = 0;
      }

      revenueMap[date] += Number(o.total);
    });

    const chartData: ChartData[] = Object.entries(revenueMap).map(
      ([date, revenue]) => ({
        date,
        revenue,
      })
    );

    return {
      revenue,
      orders: completedOrders,
      conversionRate,
      chartData,
    };
  };

  useEffect(() => {
    // 🔄 Initial fetch
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Fetch error:", error);
      }

      if (data) {
        setOrders(data);
      }

      setLoading(false);
    };

    fetchOrders();

    // ⚡ REAL-TIME SUBSCRIPTION
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Realtime event:", payload);

          if (payload.eventType === "INSERT") {
            setOrders((prev) => [...prev, payload.new as Order]);
          }

          if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === payload.new.id ? (payload.new as Order) : o
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setOrders((prev) =>
              prev.filter((o) => o.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]); // ✅ FIX 2: dependency added

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm">
        Loading analytics...
      </div>
    );
  }

  const analytics = computeAnalytics(orders);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Analytics Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Live performance of your platform
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Revenue"
          value={`KES ${analytics.revenue.toLocaleString()}`}
          trend="Live"
          trendUp={true}
          icon={<DollarSign size={18} />}
        />

        <StatsCard
          title="Orders"
          value={analytics.orders.toString()}
          trend="Live"
          trendUp={true}
          icon={<ShoppingCart size={18} />}
        />

        <StatsCard
          title="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          trend="Live"
          trendUp={true}
          icon={<TrendingUp size={18} />}
        />

        <StatsCard
          title="Users"
          value="--"
          trend="N/A"
          trendUp={true}
          icon={<Users size={18} />}
        />
      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-medium mb-4">
          Revenue Trends
        </h2>

        {analytics.chartData.length > 0 ? (
          <RevenueChart orders={analytics.chartData} />
        ) : (
          <p className="text-gray-400 text-sm">
            No data available
          </p>
        )}
      </div>
    </div>
  );
}