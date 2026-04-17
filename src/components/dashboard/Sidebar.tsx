'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  HardHat, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  User, 
  LogOut,
  X,
  ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  onClose?: () => void
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Projects', href: '/dashboard/projects', icon: HardHat },
  { name: 'Files', href: '/dashboard/files', icon: FileText },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch user on mount
  useState(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  })

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-72 h-full bg-white shadow-xl border-r border-[#0F4C5C]/10 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#0F4C5C]/10 bg-gradient-to-r from-[#0F4C5C]/5 to-transparent">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image 
                src="/images/tefetro-logo.png" 
                alt="Tefetra Studios"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#0F4C5C] text-lg tracking-wider">TEFETRA</span>
              <span className="text-xs text-[#1E1E1E]/50">STUDIOS</span>
            </div>
          </Link>
          
          {/* Close button for mobile */}
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-[#0F4C5C]/5 text-[#0F4C5C]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-[#0F4C5C] text-white shadow-lg shadow-[#0F4C5C]/20' 
                  : 'text-[#1E1E1E]/70 hover:bg-[#0F4C5C]/5 hover:text-[#0F4C5C]'
                }
              `}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
              <span className="font-medium">{item.name}</span>
              {item.name === 'Messages' && unreadCount > 0 && (
                <span className="ml-auto bg-[#F28C00] text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#0F4C5C]/10 bg-gradient-to-r from-transparent to-[#0F4C5C]/5">
        <div className="flex items-center gap-3 p-3 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F4C5C] to-[#6faa99] flex items-center justify-center shadow-md">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0F4C5C] truncate">
              {user?.email?.split('@')[0] || 'Client'}
            </p>
            <p className="text-xs text-[#1E1E1E]/50 truncate">{user?.email || 'client@example.com'}</p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#F28C00] hover:bg-[#F28C00]/10 rounded-lg transition-all duration-200 group mt-2"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}