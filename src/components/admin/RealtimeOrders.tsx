// src/components/admin/RealtimeOrders.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OrdersTable } from './OrdersTable'

interface RealtimeOrdersProps {
  initialOrders: any[]
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
  const [orders, setOrders] = useState(initialOrders)
  const [totalOrders, setTotalOrders] = useState(initialTotal)
  const supabase = createClient()

  // Refresh data from server (properly authenticated)
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
    // Subscribe to order changes - this will only notify of changes
    // but we re-fetch to get proper data with RLS bypass via API
    const subscription = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change detected, refreshing...', payload)
          // Re-fetch from API to get complete data with proper permissions
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