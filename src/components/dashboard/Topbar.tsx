'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, Bell, Search, User } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface TopbarProps {
  onMenuClick?: () => void
}

interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  read: boolean
  link: string
  type: 'order' | 'message' | 'project' | 'default'  // Add this line
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'My Orders', href: '/dashboard/orders' },
  { name: 'Projects', href: '/dashboard/projects' },
  { name: 'Files', href: '/dashboard/files' },
  { name: 'Payments', href: '/dashboard/payments' },
  { name: 'Messages', href: '/dashboard/messages' },
  { name: 'Profile', href: '/dashboard/profile' },
]

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)
  const supabase = createClient()

  const currentPage = navItems.find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))?.name || 'Dashboard'

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Download Expiring Soon',
      description: 'Your Bungalow Plan download expires in 4 hours',
      timestamp: '2 hours ago',
      read: false,
      link: '/dashboard/orders',
      type: 'order'  // Add type
    },
    {
      id: '2',
      title: 'New Message from Tefetra',
      description: 'We have updated the construction timeline',
      timestamp: '5 hours ago',
      read: false,
      link: '/dashboard/messages',
      type: 'message'  // Add type
    },
    {
      id: '3',
      title: 'Project Phase Updated',
      description: 'Karen Maisonette moved to Approvals phase',
      timestamp: '1 day ago',
      read: true,
      link: '/dashboard/projects',
      type: 'project'  // Add type
    }
  ]

  const markAllAsRead = () => {
    setUnreadCount(0)
    setIsNotificationsOpen(false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <Bell className="w-4 h-4 text-[#F28C00]" />
      case 'message': return <Bell className="w-4 h-4 text-[#0F4C5C]" />
      case 'project': return <Bell className="w-4 h-4 text-[#6faa99]" />
      default: return <Bell className="w-4 h-4 text-[#1E1E1E]/40" />
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#0F4C5C]/10 px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-[#0F4C5C]/5 text-[#0F4C5C] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-[#0F4C5C] hidden sm:block">
            {currentPage}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search Button (Mobile) */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-[#0F4C5C]/5 text-[#0F4C5C] transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#FAF9F6] rounded-xl border border-[#0F4C5C]/10">
            <Search className="w-4 h-4 text-[#1E1E1E]/40" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-[#0F4C5C] placeholder:text-[#1E1E1E]/40 focus:outline-none w-48"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-xl hover:bg-[#0F4C5C]/5 text-[#0F4C5C] transition-all duration-200 hover:scale-105"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F28C00] rounded-full animate-pulse ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-[#0F4C5C]/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-[#0F4C5C]/10 bg-gradient-to-r from-[#0F4C5C]/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#0F4C5C] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#F28C00]" />
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-[#F28C00] hover:text-[#F28C00]/80 font-medium transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-[#0F4C5C]/5">
                    {notifications.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.link}
                        onClick={() => setIsNotificationsOpen(false)}
                        className={`
                          flex items-start gap-3 p-4 hover:bg-[#FAF9F6] transition-all duration-200
                          ${!notif.read ? 'bg-[#F28C00]/5 border-l-4 border-l-[#F28C00]' : ''}
                        `}
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-white shadow-sm">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${!notif.read ? 'text-[#0F4C5C]' : 'text-[#1E1E1E]/70'}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-[#1E1E1E]/50 mt-0.5 line-clamp-2">{notif.description}</p>
                          <p className="text-xs text-[#1E1E1E]/40 mt-1">{notif.timestamp}</p>
                        </div>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-[#F28C00] rounded-full mt-1.5 flex-shrink-0 animate-pulse" />
                        )}
                      </Link>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[#0F4C5C]/10 bg-[#FAF9F6]">
                    <Link 
                      href="/dashboard/notifications"
                      className="block text-center text-sm text-[#0F4C5C] hover:text-[#F28C00] font-medium transition-colors"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Avatar */}
          <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#0F4C5C]/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F4C5C] to-[#6faa99] flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-[#0F4C5C]/10 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#FAF9F6] rounded-xl border border-[#0F4C5C]/10">
            <Search className="w-4 h-4 text-[#1E1E1E]/40" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-[#0F4C5C] placeholder:text-[#1E1E1E]/40 focus:outline-none flex-1"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}