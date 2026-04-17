'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Download, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Plus,
  RefreshCw,
  HardHat,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { Order } from '@/types/dashboard';

interface OrderListProps {
  orders: Order[];
  onDownload?: (orderId: string) => void;
  onRenewal?: (orderId: string) => void;
}

export function OrderList({ orders, onDownload, onRenewal }: OrderListProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [renewalRequested, setRenewalRequested] = useState<string[]>([]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const requestRenewal = (orderId: string) => {
    setRenewalRequested([...renewalRequested, orderId]);
    onRenewal?.(orderId);
  };

  const getTimeRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return 'No expiry';
    const hours = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60));
    if (hours < 0) return 'Expired';
    if (hours < 24) return `${hours}h remaining`;
    return `${Math.ceil(hours / 24)} days remaining`;
  };

  const isExpiringSoon = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    const hours = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60));
    return hours < 24 && hours > 0;
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt).getTime() < Date.now();
  };

  const files = [
    { name: 'Floor Plan (Ground)', type: 'pdf', size: '2.4 MB' },
    { name: 'Elevations', type: 'pdf', size: '3.2 MB' },
    { name: 'Sections', type: 'pdf', size: '1.5 MB' },
  ];

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-[#0F4C5C]/10">
        <ShoppingBag className="w-16 h-16 text-[#F28C00] mx-auto mb-4" />
        <h3 className="font-bold text-[#0F4C5C] text-lg mb-2">No Orders Yet</h3>
        <p className="text-[#1E1E1E]/60 mb-4">Browse our collection of architectural plans</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#F28C00] text-white rounded-xl hover:bg-[#F28C00]/90 transition-all">
          Browse Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedOrder === order.id;
        const isExpiring = isExpiringSoon(order.expiresAt);
        const expired = isExpired(order.expiresAt);
        const renewalPending = renewalRequested.includes(order.id);

        return (
          <div 
            key={order.id} 
            className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border ${
              isExpiring && !expired ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-[#0F4C5C]/10'
            }`}
          >
            <div 
              className="p-6 cursor-pointer hover:bg-[#FAF9F6] transition-colors"
              onClick={() => toggleExpand(order.id)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#0F4C5C]/20 to-[#6faa99]/20 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-[#0F4C5C]/40" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[#0F4C5C] text-lg">{order.productName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status === 'completed' ? 'Completed' : order.status}
                      </span>
                      {isExpiring && !expired && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expiring Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#1E1E1E]/50 mt-1">
                      {order.category} • Order {order.id.slice(0, 8)} • {new Date(order.purchaseDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-[#0F4C5C] mt-1">
                      KES {order.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:justify-end">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      expired ? 'text-red-500' : isExpiring ? 'text-amber-600' : 'text-[#1E1E1E]/50'
                    }`}>
                      {getTimeRemaining(order.expiresAt)}
                    </p>
                    <p className="text-xs text-[#1E1E1E]/40">Download access</p>
                  </div>
                  
                  <button className="p-2 rounded-lg hover:bg-[#FAF9F6] transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="px-6 pb-6 border-t border-[#0F4C5C]/10">
                <div className="pt-6 grid lg:grid-cols-2 gap-6">
                  {/* Files Section */}
                  <div>
                    <h4 className="font-semibold text-[#0F4C5C] mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Available Files ({files.length})
                    </h4>
                    
                    {expired ? (
                      <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-700">Download Access Expired</p>
                            <p className="text-sm text-red-600 mt-1">Your download link has expired. Request a renewal from the admin.</p>
                            {renewalPending ? (
                              <p className="text-sm text-stone-600 mt-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Renewal request sent - awaiting admin approval
                              </p>
                            ) : (
                              <button onClick={() => requestRenewal(order.id)} className="mt-3 text-sm text-[#0F4C5C] hover:underline">
                                <RefreshCw className="w-4 h-4 inline mr-2" />
                                Request Renewal
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl border border-[#0F4C5C]/10 hover:border-[#F28C00]/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg">
                                <FileText className="w-4 h-4 text-[#F28C00]" />
                              </div>
                              <div>
                                <p className="font-medium text-sm text-[#0F4C5C]">{file.name}</p>
                                <p className="text-xs text-[#1E1E1E]/40">{file.size}</p>
                              </div>
                            </div>
                            <button onClick={() => onDownload?.(order.id)} className="p-2 hover:bg-white rounded-lg transition-colors text-[#F28C00]">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upsells Section */}
                  <div>
                    <h4 className="font-semibold text-[#0F4C5C] mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Complete Your Project
                    </h4>
                    
                    <div className="space-y-3">
                      {!order.hasBOQ && (
                        <div className="p-4 bg-[#F28C00]/5 rounded-xl border border-[#F28C00]/20">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-[#0F4C5C]">Bill of Quantities (BOQ)</p>
                              <p className="text-sm text-[#1E1E1E]/60 mt-1">Detailed cost breakdown for materials and labor</p>
                              <p className="text-sm font-semibold text-[#F28C00] mt-2">+KES 8,000</p>
                            </div>
                            <button className="px-4 py-2 bg-[#F28C00] text-white rounded-lg text-sm font-medium hover:bg-[#F28C00]/90">Add</button>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-gradient-to-br from-[#0F4C5C]/10 to-[#6faa99]/10 rounded-xl border border-[#0F4C5C]/20">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#0F4C5C] rounded-lg">
                            <HardHat className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-[#0F4C5C]">Ready to Build?</p>
                            <p className="text-sm text-[#1E1E1E]/60 mt-1">Tefetra offers full construction services, site supervision, and project management.</p>
                            <div className="flex gap-2 mt-3">
                              <Link href="/dashboard/messages" className="flex-1 py-2 bg-[#0F4C5C] text-white rounded-lg text-sm font-medium text-center hover:bg-[#0F4C5C]/90">
                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                Chat with Us
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}