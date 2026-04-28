// src/components/admin/RealtimeProjects.tsx
'use client'

import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RealtimePostgresChangesPayload, RealtimeChannel } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { 
  CheckCircle2, 
  AlertCircle,
  Info,
  RefreshCw
} from 'lucide-react'

// Complete Project interface matching your database schema
interface Project {
  id: string
  name: string | null
  full_name: string | null
  status: string | null
  user_id: string | null
  order_id: string | null
  type: string | null
  service_type: string | null
  location: string | null
  start_date: string | null
  expected_handover: string | null
  current_phase: string | null
  progress: number | null
  created_at: string | null
}

interface RealtimeProjectsProps {
  onUpdate?: () => void
  showToasts?: boolean
}

export function RealtimeProjects({ onUpdate, showToasts = true }: RealtimeProjectsProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = useCallback((payload: RealtimePostgresChangesPayload<Project>) => {
    router.refresh()
    onUpdate?.()

    if (showToasts) {
      const eventType = payload.eventType
      const newRecord = payload.new as Project | null
      const oldRecord = payload.old as Project | null
      const projectId = newRecord?.id || oldRecord?.id
      
      switch (eventType) {
        case 'INSERT':
          toast.success('New project created', {
            description: `Project ${projectId?.slice(0, 8)}... has been added.`,
            icon: <CheckCircle2 className="w-4 h-4" />,
          })
          break
        case 'UPDATE':
          const newStatus = newRecord?.status
          const oldStatus = oldRecord?.status
          
          if (newStatus !== oldStatus) {
            toast.info(`Project status updated to ${newStatus || 'unknown'}`, {
              description: `Project ${projectId?.slice(0, 8)}... has been updated.`,
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
    let channel: RealtimeChannel | null = null
    
    const setupSubscription = async () => {
      channel = supabase
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
        .subscribe((status: string) => {
          console.log('Realtime subscription status:', status)
        })
    }

    setupSubscription()

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [supabase, handleUpdate])

  return null
}

// Alternative version with connection status indicator
export function RealtimeProjectsWithIndicator({ onUpdate, showToasts = true }: RealtimeProjectsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')

  const handleUpdate = useCallback((payload: RealtimePostgresChangesPayload<Project>) => {
    router.refresh()
    onUpdate?.()

    if (showToasts) {
      const eventType = payload.eventType
      const newRecord = payload.new as Project | null
      const oldRecord = payload.old as Project | null
      const projectId = newRecord?.id || oldRecord?.id
      
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
    let channel: RealtimeChannel | null = null

    const setupSubscription = async () => {
      channel = supabase
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
        .subscribe((status: string) => {
          setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected')
        })
    }

    setupSubscription()

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
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
export function useRealtimeProjects(options: { showToasts?: boolean } = {}) {
  const router = useRouter()
  const supabase = createClient()
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupSubscription = async () => {
      channel = supabase
        .channel('projects-hook')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'projects',
          },
          (payload: RealtimePostgresChangesPayload<Project>) => {
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
    }

    setupSubscription()

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [supabase, router, options.showToasts])

  return { lastUpdate }
}