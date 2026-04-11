// src/components/admin/RealtimeNotifications.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  DollarSign,
  User,
  Clock,
  X,
  Link
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Notification {
  id: string
  type: 'order' | 'payment' | 'project' | 'user' | 'system'
  title: string
  message: string
  read: boolean
  created_at: string
  data?: Record<string, any>
}

interface RealtimeNotificationsProps {
  userId?: string
  userRole?: string
}

export function RealtimeNotifications({ userId, userRole }: RealtimeNotificationsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      // Filter by user if not admin
      if (userRole !== 'admin' && userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount(data?.filter((n: Notification) => !n.read).length || 0)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, userId, userRole])

  // Mark as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
      
      if (unreadIds.length === 0) return

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds)

      if (error) throw error

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      
      toast.success('All notifications marked as read')
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  // Real-time subscription
  useEffect(() => {
    fetchNotifications()

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: userRole === 'admin' ? undefined : `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification
          
          setNotifications(prev => [newNotification, ...prev].slice(0, 20))
          setUnreadCount(prev => prev + 1)

          // Show toast for new notification
          toast.info(newNotification.title, {
            description: newNotification.message,
            action: {
              label: 'View',
              onClick: () => router.push('/admin/notifications'),
            },
          })

          // Play sound if enabled
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/images/tefetro-logo.png',
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const updated = payload.new as Notification
          setNotifications(prev => 
            prev.map(n => n.id === updated.id ? updated : n)
          )
        }
      )
      .subscribe()

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, userId, userRole, fetchNotifications, router])

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-blue-500" />
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-500" />
      case 'project':
        return <CheckCircle2 className="w-4 h-4 text-purple-500" />
      case 'user':
        return <User className="w-4 h-4 text-amber-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-mist" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-50'
      case 'payment':
        return 'bg-emerald-50'
      case 'project':
        return 'bg-purple-50'
      case 'user':
        return 'bg-amber-50'
      default:
        return 'bg-stone-50'
    }
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-mist/50 text-deep-600 hover:border-tefetra/30 hover:text-tefetra transition-all relative"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl border border-mist/30 shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-mist/20 flex items-center justify-between bg-canvas/30">
              <div>
                <h3 className="font-semibold text-deep-700">Notifications</h3>
                <p className="text-xs text-mist">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'No new notifications'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-tefetra hover:text-tefetra-600 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-mist">
                  <div className="w-8 h-8 border-2 border-tefetra/20 border-t-tefetra rounded-full animate-spin mx-auto mb-3" />
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-canvas rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-mist" />
                  </div>
                  <p className="text-mist text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id)
                    }}
                    className={`
                      px-4 py-3 border-b border-mist/10 cursor-pointer transition-all
                      ${notification.read ? 'opacity-60' : 'bg-canvas/30 hover:bg-canvas'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                        ${getBgColor(notification.type)}
                      `}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notification.read ? 'text-deep-600' : 'text-deep-800 font-medium'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-mist mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-mist/70 mt-1 flex items-center gap-1">
                          <Clock size={10} />
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-tefetra rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-mist/20 bg-canvas/30">
              <Link 
                href="/admin/notifications" 
                onClick={() => setIsOpen(false)}
                className="text-sm text-tefetra hover:text-tefetra-600 font-medium flex items-center justify-center gap-1"
              >
                View all notifications
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}