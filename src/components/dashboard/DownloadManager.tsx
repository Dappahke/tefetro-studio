'use client';

import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import type { Order } from '@/types/dashboard';

interface DownloadManagerProps {
  orders: Order[];
}

export function DownloadManager({ orders }: DownloadManagerProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (orderId: string) => {
    try {
      setDownloading(orderId);
      
      const tokenRes = await fetch(`/api/protected/downloads/generate/${orderId}`);
      const tokenData = await tokenRes.json();
      
      if (!tokenData.success) {
        throw new Error('Failed to generate download token');
      }
      
      window.open(`/download?token=${encodeURIComponent(tokenData.token)}`, '_blank');
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const completedOrders = orders.filter(order => order.status === 'completed');

  if (completedOrders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#0F4C5C]/10">
      <h2 className="text-lg font-bold text-[#0F4C5C] mb-4">Recent Downloads</h2>
      <div className="space-y-3">
        {completedOrders.slice(0, 3).map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <FileText className="w-4 h-4 text-[#F28C00]" />
              </div>
              <div>
                <p className="font-medium text-sm text-[#0F4C5C]">{order.productName}</p>
                <p className="text-xs text-[#1E1E1E]/40">Ordered on {new Date(order.purchaseDate).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={() => handleDownload(order.id)}
              disabled={downloading === order.id}
              className="p-2 hover:bg-white rounded-lg transition-colors text-[#F28C00] disabled:opacity-50"
            >
              {downloading === order.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}