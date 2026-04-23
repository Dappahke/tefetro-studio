import Link from 'next/link'
import { PriceDisplayCompact } from '../checkout/PriceDisplayCompact'

interface Order {
  id: string
  email: string
  product_title?: string
  total: number
  status: string
  created_at: string
  profiles?: { email: string }
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="p-8 text-center text-neutral-500">
        No recent orders
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-canvas/50">
          <tr>
            <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
              Order ID
            </th>
            <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
              Customer
            </th>
            <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
              Product
            </th>
            <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
              Amount
            </th>
            <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
              Status
            </th>
            <th className="text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-mist/30">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-canvas/30 transition-colors">
              <td className="px-6 py-4">
                <code className="text-xs font-mono text-sage bg-sage/10 px-2 py-1 rounded">
                  {order.id.slice(0, 8)}...
                </code>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-deep-700 truncate max-w-[150px]">
                  {order.profiles?.email || order.email}
                </p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-neutral-600 truncate max-w-[150px]">
                  {order.product_title || 'Architectural Plan'}
                </p>
              </td>
              <td className="px-6 py-4">
                <PriceDisplayCompact amountKES={order.total} className="text-sm font-medium" />
              </td>
              <td className="px-6 py-4">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${order.status === 'completed' ? 'bg-sage/10 text-sage' : 
                    order.status === 'pending' ? 'bg-tefetra/10 text-tefetra' : 
                    'bg-neutral-100 text-neutral-600'}
                `}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link 
                  href={`/admin/orders/${order.id}`}
                  className="text-sm text-tefetra hover:text-tefetra-600 font-medium"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}