// src/components/admin/RealtimeOrders.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { OrdersTable } from './OrdersTable'

// Complete Order interface matching your database schema
interface Order {
  id: string
  total: number | null
  status: string | null
  created_at: string | null
  user_id: string | null
  email: string | null
  product_id: string | null
  payment_ref: string | null
  download_url: string | null
  expires_at: string | null
  addons: any[] | null
  last_regenerated_at: string | null
  regeneration_count: number | null
  metadata: Record<string, any> | null
}

interface RealtimeOrdersProps {
  initialOrders: Order[]
  currentPage: number
  totalPages: number
  totalOrders: number
  filters: Record<string, string | undefined>
}

export function RealtimeOrders({ 
  initialOrders, 
  currentPage, 
  totalPages, 
  totalOrders: initialTotal,
  filters 
}: RealtimeOrdersProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [totalOrders, setTotalOrders] = useState(initialTotal)
  const supabase = createClient()

  const refreshData = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })
      
      const response = await fetch(`/api/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setTotalOrders(data.total)
      }
    } catch (error) {
      console.error('Failed to refresh orders:', error)
    }
  }, [filters])

  useEffect(() => {
    setOrders(initialOrders)
    setTotalOrders(initialTotal)
  }, [initialOrders, initialTotal])

  useEffect(() => {
    const subscription = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload: RealtimePostgresChangesPayload<Order>) => {
          console.log('Order change detected, refreshing...', payload)
          refreshData()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, refreshData])

  return (
    <OrdersTable 
      orders={orders}
      currentPage={currentPage}
      totalPages={Math.ceil(totalOrders / 20)}
      totalOrders={totalOrders}
    />
  )
}