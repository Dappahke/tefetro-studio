'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Download, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Plus,
  ArrowRight,
  RefreshCw,
  HardHat,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Order {
  id: string;
  productName: string;
  category: string;
  price: number;
  purchaseDate: string;
  status: 'delivered' | 'processing' | 'pending';
  files: FileItem[];
  hasBOQ: boolean;
  hasInteriors: boolean;
  hasLandscape: boolean;
  expiresAt: string | null;
}

interface FileItem {
  name: string;
  type: 'pdf' | 'dwg' | 'image';
  size: string;
  url: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [renewalRequested, setRenewalRequested] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch orders from Supabase
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
            total_price,
            status,
            expires_at,
            created_at,
            download_url,
            products:product_id (title, category, file_url),
            selected_addons
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
          return;
        }

        // Format orders
        const formattedOrders: Order[] = (data || []).map(order => {
          // Parse files from download_url or use default
          const files: FileItem[] = [
            { name: 'Floor Plan (Ground)', type: 'pdf', size: '2.4 MB', url: '#' },
            { name: 'Floor Plan (First)', type: 'pdf', size: '1.8 MB', url: '#' },
            { name: 'Elevations', type: 'pdf', size: '3.2 MB', url: '#' },
            { name: 'Sections', type: 'pdf', size: '1.5 MB', url: '#' },
          ];

          const addons = order.selected_addons || [];
          
          // Access products as an array - take the first element
          const product = order.products?.[0];
          
          return {
            id: order.id,
            productName: product?.title || 'Unknown Product',
            category: product?.category || 'Uncategorized',
            price: order.total_price,
            purchaseDate: order.created_at,
            status: order.status,
            files: files,
            hasBOQ: addons.some((a: any) => a.name?.includes('BOQ')),
            hasInteriors: addons.some((a: any) => a.name?.includes('Interior')),
            hasLandscape: addons.some((a: any) => a.name?.includes('Landscape')),
            expiresAt: order.expires_at
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

    // Subscribe to order changes
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('orders-page-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
          () => fetchOrders()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupRealtime();
    return () => {
      cleanup.then(fn => fn?.());
    };
  }, [supabase]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const requestRenewal = async (orderId: string) => {
    try {
      const response = await fetch('/api/dashboard/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      if (response.ok) {
        setRenewalRequested([...renewalRequested, orderId]);
      }
    } catch (err) {
      console.error('Renewal request failed:', err);
    }
  };

  const handleDownload = async (orderId: string, fileName: string) => {
    try {
      setDownloading(`${orderId}-${fileName}`);
      
      const response = await fetch(`/api/dashboard/download?orderId=${orderId}&fileName=${encodeURIComponent(fileName)}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const { signedUrl } = await response.json();
      
      // Trigger download
      window.open(signedUrl, '_blank');
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloading(null);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-tefetra" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep">My Orders</h1>
          <p className="text-stone-600 mt-1">Manage your purchased plans and downloads</p>
        </div>
        <Link href="/products" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Browse More Plans
        </Link>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-tefetra mx-auto mb-4" />
            <h3 className="font-bold text-deep text-lg mb-2">No Orders Yet</h3>
            <p className="text-stone-600 mb-4">Browse our collection of architectural plans</p>
            <Link href="/products" className="btn-primary">
              Browse Plans
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const isExpiring = isExpiringSoon(order.expiresAt);
            const expired = isExpired(order.expiresAt);
            const renewalPending = renewalRequested.includes(order.id);

            return (
              <div 
                key={order.id} 
                className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpiring && !expired ? 'ring-2 ring-amber-400/50' : ''
                }`}
              >
                {/* Order Header - Always Visible */}
                <div 
                  className="p-6 cursor-pointer hover:bg-stone-50/50 transition-colors"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Thumbnail & Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-deep/20 to-sage/20 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-8 h-8 text-deep/40" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-deep text-lg">{order.productName}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status === 'delivered' ? 'Delivered' : 'Processing'}
                          </span>
                          {isExpiring && !expired && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Expiring Soon
                            </span>
                          )}
                          {expired && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Expired
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone-500 mt-1">
                          {order.category} • Order {order.id.slice(0, 8)} • {new Date(order.purchaseDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium text-deep mt-1">
                          KES {order.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Expiry & Actions */}
                    <div className="flex items-center gap-4 lg:justify-end">
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          expired ? 'text-red-500' : isExpiring ? 'text-amber-600' : 'text-stone-500'
                        }`}>
                          {getTimeRemaining(order.expiresAt)}
                        </p>
                        <p className="text-xs text-stone-400">Download access</p>
                      </div>
                      
                      <button className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-stone-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-stone-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-stone-100">
                    <div className="pt-6 grid lg:grid-cols-2 gap-6">
                      {/* Files Section */}
                      <div>
                        <h4 className="font-semibold text-deep mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Available Files ({order.files.length})
                        </h4>
                        
                        {expired ? (
                          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-red-700">Download Access Expired</p>
                                <p className="text-sm text-red-600 mt-1">
                                  Your download link has expired. Request a renewal from the admin.
                                </p>
                                {renewalPending ? (
                                  <p className="text-sm text-stone-600 mt-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    Renewal request sent - awaiting admin approval
                                  </p>
                                ) : (
                                  <button 
                                    onClick={() => requestRenewal(order.id)}
                                    className="mt-3 btn-tertiary text-sm py-2"
                                  >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Request Renewal
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {order.files.map((file, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200 hover:border-tefetra/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    file.type === 'pdf' ? 'bg-red-100 text-red-600' :
                                    file.type === 'dwg' ? 'bg-blue-100 text-blue-600' :
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm text-deep">{file.name}</p>
                                    <p className="text-xs text-stone-400">{file.size}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleDownload(order.id, file.name)}
                                  disabled={downloading === `${order.id}-${file.name}`}
                                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-tefetra disabled:opacity-50"
                                >
                                  {downloading === `${order.id}-${file.name}` ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            ))}
                            
                            <button 
                              onClick={() => handleDownload(order.id, 'all-files.zip')}
                              className="w-full mt-2 py-2 text-sm text-tefetra hover:text-tefetra-600 font-medium flex items-center justify-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download All Files (ZIP)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Upsells Section - Contextual */}
                      <div>
                        <h4 className="font-semibold text-deep mb-4 flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Complete Your Project
                        </h4>
                        
                        <div className="space-y-3">
                          {!order.hasBOQ && (
                            <div className="p-4 bg-tefetra/5 rounded-xl border border-tefetra/20">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-deep">Bill of Quantities (BOQ)</p>
                                  <p className="text-sm text-stone-600 mt-1">
                                    Detailed cost breakdown for materials and labor
                                  </p>
                                  <p className="text-sm font-semibold text-tefetra mt-2">
                                    +KES 8,000
                                  </p>
                                </div>
                                <button className="px-4 py-2 bg-tefetra text-white rounded-lg text-sm font-medium hover:bg-tefetra-500 transition-colors">
                                  Add
                                </button>
                              </div>
                            </div>
                          )}

                          {!order.hasInteriors && (
                            <div className="p-4 bg-deep/5 rounded-xl border border-deep/20">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-deep">Interior Design Drawings</p>
                                  <p className="text-sm text-stone-600 mt-1">
                                    Complete interior layouts, finishes, and fixtures
                                  </p>
                                  <p className="text-sm font-semibold text-deep mt-2">
                                    +KES 15,000
                                  </p>
                                </div>
                                <button className="px-4 py-2 bg-deep text-white rounded-lg text-sm font-medium hover:bg-deep-600 transition-colors">
                                  Add
                                </button>
                              </div>
                            </div>
                          )}

                          {!order.hasLandscape && (
                            <div className="p-4 bg-sage/5 rounded-xl border border-sage/20">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-deep">Landscape Design</p>
                                  <p className="text-sm text-stone-600 mt-1">
                                    Garden layout, hardscaping, and planting plans
                                  </p>
                                  <p className="text-sm font-semibold text-sage mt-2">
                                    +KES 12,000
                                  </p>
                                </div>
                                <button className="px-4 py-2 bg-sage text-white rounded-lg text-sm font-medium hover:bg-sage-600 transition-colors">
                                  Add
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Construction Services CTA */}
                          <div className="p-4 bg-gradient-to-br from-deep/10 to-sage/10 rounded-xl border border-deep/20">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-deep rounded-lg">
                                <HardHat className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-deep">Ready to Build?</p>
                                <p className="text-sm text-stone-600 mt-1">
                                  Tefetra offers full construction services, site supervision, and project management.
                                </p>
                                <div className="flex gap-2 mt-3">
                                  <Link 
                                    href="/dashboard/messages"
                                    className="flex-1 py-2 bg-deep text-white rounded-lg text-sm font-medium hover:bg-deep-600 transition-colors text-center"
                                  >
                                    <MessageSquare className="w-4 h-4 inline mr-2" />
                                    Chat with Us
                                  </Link>
                                  <a 
                                    href="mailto:build@tefetra.com"
                                    className="flex-1 py-2 bg-white border-2 border-deep text-deep rounded-lg text-sm font-medium hover:bg-deep/5 transition-colors text-center"
                                  >
                                    Email for Quote
                                  </a>
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
          })
        )}
      </div>
    </div>
  );
}