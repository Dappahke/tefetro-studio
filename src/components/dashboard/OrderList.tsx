import Link from 'next/link'
import { PriceDisplayCompact } from '../products/PriceDisplayCompact'

interface Order {
  id: string
  product_id: string
  product_title?: string
  total: number
  status: string
  payment_ref: string
  created_at: string
  addons?: Array<{
    id: string
    name: string
    type: string
  }>
}

interface OrderListProps {
  orders: Order[]
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-mist/30">
        <div className="w-16 h-16 bg-mist/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-deep-700">No orders yet</h3>
        <p className="text-neutral-600 mt-2 mb-4">Start building with our architectural plans</p>
        <Link href="/products" className="btn-primary">
          Browse Plans
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-mist/30 overflow-hidden">
      <div className="divide-y divide-mist/30">
        {orders.map((order) => (
          <div key={order.id} className="p-6 hover:bg-canvas/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <code className="text-xs font-mono text-sage bg-sage/10 px-2 py-1 rounded">
                    {order.payment_ref?.slice(0, 12)}...
                  </code>
                  <span className={`
                    text-xs px-2 py-1 rounded-full font-medium
                    ${order.status === 'completed' ? 'bg-sage/10 text-sage' : 
                      order.status === 'pending' ? 'bg-tefetra/10 text-tefetra' : 
                      'bg-neutral-100 text-neutral-600'}
                  `}>
                    {order.status}
                  </span>
                </div>
                
                <h3 className="font-semibold text-deep-700">
                  {order.product_title || `Order #${order.id.slice(0, 8)}`}
                </h3>
                
                {order.addons && order.addons.length > 0 && (
                  <p className="text-sm text-neutral-600 mt-1">
                    + {order.addons.length} addon{order.addons.length > 1 ? 's' : ''}
                  </p>
                )}
                
                <p className="text-xs text-neutral-400 mt-2">
                  {new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Price & Action */}
              <div className="flex items-center gap-4">
                <PriceDisplayCompact amountKES={order.total} className="font-bold text-deep-700" />
                <Link 
                  href={`/dashboard/orders/${order.id}`}
                  className="btn-ghost text-sm py-2 px-4"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}