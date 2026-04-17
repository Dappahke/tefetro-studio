'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { OrderList } from '@/components/dashboard/OrderList';
import { DownloadManager } from '@/components/dashboard/DownloadManager';
import type { Order } from '@/types/dashboard';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            total,
            status,
            expires_at,
            created_at,
            download_url,
            addons,
            product:products!product_id (
              title,
              category,
              file_path
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedOrders: Order[] = (data || []).map(order => {
          const productData = Array.isArray(order.product) ? order.product[0] : order.product;
          return {
            id: order.id,
            productName: productData?.title || 'Unknown Product',
            category: productData?.category || 'Uncategorized',
            price: order.total || 0,
            purchaseDate: order.created_at,
            status: order.status || 'pending',
            expiresAt: order.expires_at,
            downloadUrl: order.download_url,
            addons: order.addons || [],
            hasBOQ: order.addons?.some((a: any) => a.name?.includes('BOQ')) || false,
            hasInteriors: order.addons?.some((a: any) => a.name?.includes('Interior')) || false,
            hasLandscape: order.addons?.some((a: any) => a.name?.includes('Landscape')) || false,
          };
        });

        setOrders(formattedOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#F28C00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F4C5C]">My Orders</h1>
          <p className="text-[#1E1E1E]/60 mt-1">Manage your purchased plans and downloads</p>
        </div>
      </div>

      <OrderList orders={orders} />
      <DownloadManager orders={orders} />
    </div>
  );
}