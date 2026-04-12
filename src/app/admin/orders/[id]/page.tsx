// src/app/admin/orders/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { adminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Clock, 
  CreditCard, 
  Package, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Truck,
  User,
  FileText,
  Printer,
  Send,
  MoreVertical,
  Edit3,
  History,
  Home,
  Ruler,
  Layers
} from "lucide-react";
import "./print-styles.css";
import { PrintButton } from "@/components/admin/PrintButton";

interface PageProps {
  params: { id: string };
  searchParams: { tab?: string };
}

// Server actions
async function updateOrderStatus(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;
  
  await verifyAdmin();
  
  const { error } = await adminClient
    .from("orders")
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", orderId);
    
  if (error) throw error;
  
  await adminClient.from("audit_logs").insert({
    user_id: (await verifyAdmin()).user.id,
    event: "order_updated",
    metadata: { 
      order_id: orderId,
      action: `Status changed to ${status}`
    }
  });
  
  revalidatePath(`/admin/orders/${orderId}`);
}

async function sendEmailToCustomer(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  const subject = formData.get("subject") as string;
  
  const session = await verifyAdmin();
  
  await adminClient.from("audit_logs").insert({
    user_id: session.user.id,
    event: "email_sent",
    metadata: { 
      order_id: orderId,
      subject
    }
  });
  
  revalidatePath(`/admin/orders/${orderId}`);
}

export default async function OrderDetailsPage({ params, searchParams }: PageProps) {
  const session = await verifyAdmin();
  if (!session.user) redirect("/login");
  
  const { id } = params;
  const activeTab = searchParams.tab || "overview";

  const { data: order, error: orderError } = await adminClient
    .from("orders")
    .select(`
      *,
      products (
        id,
        title,
        category,
        price,
        file_path,
        bedrooms,
        bathrooms,
        floors,
        plinth_area,
        length,
        width,
        description
      ),
      profiles:user_id (
        id,
        name,
        email,
        avatar_url,
        created_at,
        role
      )
    `)
    .eq("id", id)
    .single();

  if (orderError || !order) {
    console.error("Order fetch error:", orderError);
    return notFound();
  }

  const { data: orderLogs } = await adminClient
    .from("audit_logs")
    .select("*")
    .eq("metadata->order_id", id)
    .or(`event.eq.order_updated,event.eq.email_sent`)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: relatedOrders } = await adminClient
    .from("orders")
    .select("id, total, status, created_at, payment_ref")
    .eq("email", order.email)
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  const addons = order.addons || [];
  const customer = order.profiles;
  const product = order.products;
  
  const orderDate = new Date(order.created_at);
  const expiryDate = order.expires_at ? new Date(order.expires_at) : null;
  const isExpired = expiryDate ? expiryDate < new Date() : false;

  const statusConfig = {
    paid: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: CreditCard, label: "Paid - Processing" },
    completed: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2, label: "Completed" },
    processing: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: Package, label: "Processing" },
    cancelled: { color: "bg-rose-100 text-rose-700 border-rose-200", icon: XCircle, label: "Cancelled" },
    refunded: { color: "bg-gray-100 text-gray-700 border-gray-200", icon: History, label: "Refunded" }
  };
  
  const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.paid;

  const formatKES = (amount: number | string) => {
    return `KES ${Number(amount).toLocaleString('en-KE')}`;
  };

  return (
    <div className="min-h-screen bg-canvas pb-20 print:bg-white print:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-mist/30 sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/orders"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-canvas text-deep-600 hover:bg-mist/50 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-deep-800">Order #{order.payment_ref || order.id.slice(0, 8).toUpperCase()}</h1>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${currentStatus.color}`}>
                    <currentStatus.icon size={14} />
                    {currentStatus.label}
                  </span>
                </div>
                <p className="text-sm text-mist mt-1 flex items-center gap-2">
                  <Calendar size={14} />
                  {orderDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Print Button - Client Component */}
              <PrintButton />
              
              <div className="relative group">
                <button className="px-4 py-2.5 text-sm font-medium text-deep-600 hover:text-deep-800 flex items-center gap-2 bg-white border border-mist rounded-xl hover:bg-canvas transition-colors">
                  <MoreVertical size={16} />
                  <span className="hidden sm:inline">Actions</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-mist/30 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <div className="p-2">
                    <form action={updateOrderStatus}>
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="hidden" name="status" value="completed" />
                      <button type="submit" className="w-full text-left px-3 py-2 rounded-lg text-sm text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        Mark as Completed
                      </button>
                    </form>
                    <form action={updateOrderStatus}>
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <button type="submit" className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2">
                        <XCircle size={16} />
                        Cancel Order
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="print-header hidden">
        <div className="flex items-center justify-between p-8 border-b-2 border-gray-300">
          <div className="flex items-center gap-4">
            <Image 
              src="/images/tefetro-logo.png" 
              alt="Tefetro Studios" 
              width={60} 
              height={60}
              className="object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tefetro Studios</h1>
              <p className="text-sm text-gray-600">Architectural Drawings & Design Services</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Order #{order.payment_ref || order.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-sm text-gray-600">{orderDate.toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print-container">
        {/* Tab Navigation - Hidden when printing */}
        <div className="flex gap-1 bg-white p-1.5 rounded-xl border border-mist/30 mb-6 w-fit shadow-sm no-print">
          {[
            { id: "overview", label: "Overview", icon: FileText },
            { id: "customer", label: "Customer", icon: User },
            { id: "deliverables", label: "Deliverables", icon: Download },
            { id: "timeline", label: "Timeline", icon: History },
          ].map((tab) => (
            <Link
              key={tab.id}
              href={`/admin/orders/${id}?tab=${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-tefetra text-white shadow-md"
                  : "text-deep-600 hover:bg-canvas"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Print Title - Only visible when printing */}
        <div className="print-title hidden mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Order Reference: <span className="font-mono font-semibold">{order.payment_ref || order.id}</span></p>
              <p className="text-gray-600">Date: {orderDate.toLocaleString()}</p>
              <p className="text-gray-600">Status: <span className="capitalize">{order.status}</span></p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Customer: {customer?.name || order.email}</p>
              <p className="text-gray-600">Email: {order.email}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 print-layout">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 print-content">
            
            {/* Overview Tab */}
            {(activeTab === "overview" || true) && (
              <>
                {/* Product Card */}
                <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden print-section">
                  <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-tefetra/5 to-transparent flex items-center justify-between print-header-row">
                    <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                      <Home size={18} className="text-tefetra" />
                      Architectural Drawing
                    </h2>
                    <span className="px-3 py-1 bg-tefetra/10 text-tefetra text-xs font-medium rounded-full no-print">
                      {product?.category || "Digital Product"}
                    </span>
                  </div>
                  <div className="p-6 print-body">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-32 h-32 bg-canvas rounded-xl flex items-center justify-center text-4xl border-2 border-dashed border-mist/50 no-print">
                        🏗️
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-deep-800 mb-2 print-text-lg">
                          {product?.title || "Architectural Drawing Package"}
                        </h3>
                        <p className="text-mist text-sm mb-4 line-clamp-2 print-text-gray">
                          {product?.description || "Complete architectural drawings including floor plans, elevations, and sections."}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 print-gap-1">
                          {product?.bedrooms && (
                            <span className="px-3 py-1.5 bg-canvas rounded-lg text-deep-600 text-sm font-medium flex items-center gap-1.5 print-badge">
                              {product.bedrooms} Bedrooms
                            </span>
                          )}
                          {product?.bathrooms && (
                            <span className="px-3 py-1.5 bg-canvas rounded-lg text-deep-600 text-sm font-medium flex items-center gap-1.5 print-badge">
                              {product.bathrooms} Bathrooms
                            </span>
                          )}
                          {product?.floors && (
                            <span className="px-3 py-1.5 bg-canvas rounded-lg text-deep-600 text-sm font-medium flex items-center gap-1.5 print-badge">
                              {product.floors} Floors
                            </span>
                          )}
                          {product?.plinth_area && (
                            <span className="px-3 py-1.5 bg-canvas rounded-lg text-deep-600 text-sm font-medium flex items-center gap-1.5 print-badge">
                              {product.plinth_area} m²
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right md:border-l md:border-mist/20 md:pl-6 print-price-box">
                        <p className="text-2xl font-bold text-tefetra print-text-black">
                          {formatKES(product?.price || 0)}
                        </p>
                        <p className="text-xs text-mist print-text-gray">Base price</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Add-ons */}
                {addons.length > 0 && (
                  <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden print-section">
                    <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-tefetra/5 to-transparent print-header-row">
                      <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-tefetra" />
                        Selected Add-ons ({addons.length})
                      </h2>
                    </div>
                    <div className="divide-y divide-mist/20 print-divide">
                      {addons.map((addon: any, i: number) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-canvas/30 transition-colors print-row">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center no-print ${
                              addon.type === 'digital' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                              {addon.type === 'digital' ? <FileText size={20} /> : <Truck size={20} />}
                            </div>
                            <div>
                              <p className="font-semibold text-deep-800 print-text-sm">{addon.name}</p>
                              <p className="text-sm text-mist line-clamp-1 print-text-xs print-text-gray">{addon.description}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block no-print ${
                                addon.type === 'digital' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                {addon.type}
                              </span>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-tefetra print-text-sm print-text-black">
                            {formatKES(addon.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 py-4 bg-canvas/50 border-t border-mist/20 print-footer-row">
                      <div className="flex justify-between items-center">
                        <span className="text-mist font-medium print-text-gray">Add-ons Total</span>
                        <span className="text-xl font-bold text-deep-800 print-text-black">
                          {formatKES(addons.reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0))}
                        </span>
                      </div>
                    </div>
                  </section>
                )}

                {/* Payment Summary for Print */}
                <section className="bg-white rounded-2xl border border-mist/30 shadow-soft p-6 print-section print-only-block">
                  <h3 className="font-semibold text-deep-700 mb-4 border-b pb-2">Payment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatKES(order.total)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Tax (VAT)</span>
                      <span className="font-medium">Included</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-300 mt-2 pt-2">
                      <span className="font-bold">Total Paid</span>
                      <span className="font-bold text-lg">{formatKES(order.total)}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t text-xs text-gray-600">
                    <p>Payment Method: M-Pesa</p>
                    <p>Reference: {order.payment_ref}</p>
                    <p>Status: Paid</p>
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Sidebar - Hidden when printing */}
          <div className="space-y-6 no-print">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-mist/30 shadow-soft p-6">
              <h3 className="font-semibold text-deep-700 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-tefetra" />
                Payment Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-mist/10">
                  <span className="text-mist">Subtotal</span>
                  <span className="text-deep-800 font-medium">{formatKES(order.total)}</span>
                </div>
                {addons.length > 0 && (
                  <div className="flex justify-between py-2 border-b border-mist/10">
                    <span className="text-mist">Add-ons ({addons.length})</span>
                    <span className="text-deep-800 font-medium">
                      {formatKES(addons.reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-mist/10">
                  <span className="text-mist">Tax (16% VAT)</span>
                  <span className="text-deep-800 font-medium">Included</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-mist">Discount</span>
                  <span className="text-emerald-600 font-medium">- KES 0</span>
                </div>
                <div className="border-t border-mist/20 pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-deep-800">Total Paid</span>
                    <span className="text-tefetra">{formatKES(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-mist/30 shadow-soft p-6">
              <h3 className="font-semibold text-deep-700 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <form action={updateOrderStatus}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="status" value="completed" />
                  <button
                    type="submit"
                    disabled={order.status === 'completed'}
                    className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    {order.status === 'completed' ? 'Completed' : 'Mark Completed'}
                  </button>
                </form>
                
                {/* Print Button in Sidebar */}
                <PrintButton />
                
                <form action={updateOrderStatus}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="status" value="cancelled" />
                  <button
                    type="submit"
                    disabled={order.status === 'cancelled'}
                    className="w-full px-4 py-3 bg-rose-50 text-rose-700 rounded-xl font-medium hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Cancel Order
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Print Footer - Only visible when printing */}
        <div className="print-footer hidden mt-12 pt-8 border-t-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image 
                src="/images/tefetro-logo.png" 
                alt="Tefetro" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <div>
                <p className="font-bold text-gray-900">Tefetro Studios</p>
                <p className="text-xs text-gray-600">Quality Architectural Solutions</p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-600">
              <p>www.tefetro.studio</p>
              <p>support@tefetro.studio</p>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            This is an official order document from Tefetro Studios. For inquiries, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}