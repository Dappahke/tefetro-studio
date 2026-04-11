// src/components/admin/RealtimeProjects.tsx
'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Bell, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Info
} from 'lucide-react'

interface RealtimeProjectsProps {
  onUpdate?: () => void
  showToasts?: boolean
}

export function RealtimeProjects({ onUpdate, showToasts = true }: RealtimeProjectsProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = useCallback((payload: any) => {
    // Refresh the page data
    router.refresh()
    
    // Call custom callback if provided
    onUpdate?.()

    // Show toast notification
    if (showToasts) {
      const eventType = payload.eventType
      const projectId = payload.new?.id || payload.old?.id
      
      switch (eventType) {
        case 'INSERT':
          toast.success('New project created', {
            description: `Project ${projectId?.slice(0, 8)}... has been added.`,
            icon: <CheckCircle2 className="w-4 h-4" />,
          })
          break
        case 'UPDATE':
          const newStatus = payload.new?.status
          const oldStatus = payload.old?.status
          
          if (newStatus !== oldStatus) {
            toast.info(`Project status updated to ${newStatus}`, {
              description: `Project ${projectId?.slice(0, 8)}... moved from ${oldStatus}.`,
              icon: <Info className="w-4 h-4" />,
            })
          } else {
            toast.info('Project updated', {
              description: `Project ${projectId?.slice(0, 8)}... has been modified.`,
              icon: <RefreshCw className="w-4 h-4" />,
            })
          }
          break
        case 'DELETE':
          toast.error('Project deleted', {
            description: `Project ${projectId?.slice(0, 8)}... has been removed.`,
            icon: <AlertCircle className="w-4 h-4" />,
          })
          break
      }
    }
  }, [router, onUpdate, showToasts])

  useEffect(() => {
    // Subscribe to all project changes
    const channel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events: INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'projects',
        },
        handleUpdate
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
      })

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe()
    }
  }, [supabase, handleUpdate])

  // This component doesn't render anything visible
  // It's a "ghost" component that only handles realtime updates
  return null
}

// Alternative version with connection status indicator
export function RealtimeProjectsWithIndicator({ onUpdate, showToasts = true }: RealtimeProjectsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')

  const handleUpdate = useCallback((payload: any) => {
    router.refresh()
    onUpdate?.()

    if (showToasts) {
      const eventType = payload.eventType
      const projectId = payload.new?.id || payload.old?.id
      
      switch (eventType) {
        case 'INSERT':
          toast.success('New project created', {
            description: `Project ${projectId?.slice(0, 8)}... added.`,
          })
          break
        case 'UPDATE':
          toast.info('Project updated', {
            description: `Project ${projectId?.slice(0, 8)}... modified.`,
          })
          break
        case 'DELETE':
          toast.error('Project deleted', {
            description: `Project ${projectId?.slice(0, 8)}... removed.`,
          })
          break
      }
    }
  }, [router, onUpdate, showToasts])

  useEffect(() => {
    const channel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        handleUpdate
      )
      .subscribe((status) => {
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected')
      })

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, handleUpdate])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium border shadow-lg
        ${connectionStatus === 'connected' 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
          : connectionStatus === 'connecting'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-rose-50 text-rose-700 border-rose-200'}
      `}>
        <span className={`
          w-2 h-2 rounded-full animate-pulse
          ${connectionStatus === 'connected' ? 'bg-emerald-500' : ''}
          ${connectionStatus === 'connecting' ? 'bg-amber-500' : ''}
          ${connectionStatus === 'disconnected' ? 'bg-rose-500' : ''}
        `} />
        {connectionStatus === 'connected' && 'Live'}
        {connectionStatus === 'connecting' && 'Connecting...'}
        {connectionStatus === 'disconnected' && 'Offline'}
      </div>
    </div>
  )
}

// Hook version for use in other components
import { useState } from 'react'

export function useRealtimeProjects(options: { showToasts?: boolean } = {}) {
  const router = useRouter()
  const supabase = createClient()
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel('projects-hook')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          router.refresh()
          setLastUpdate(new Date())
          
          if (options.showToasts) {
            toast.info('Projects updated', {
              description: 'New changes detected.',
            })
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, router, options.showToasts])

  return { lastUpdate }
}