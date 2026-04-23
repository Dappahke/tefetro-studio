// src/components/dashboard/Sidebar.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  HardHat,
  MessageSquare,
  FileText,
  CreditCard,
  User,
  LogOut,
  X,
} from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
  user?: {
    email?: string | null
  } | null
  savedCount?: number
  unreadCount?: number
  onSignOut?: () => void
  loading?: boolean
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Orders',
    href: '/dashboard/orders',
    icon: ShoppingBag,
  },
  {
    name: 'Saved Plans',
    href: '/dashboard/saved-plans',
    icon: Heart,
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: HardHat,
  },
  {
    name: 'Files',
    href: '/dashboard/files',
    icon: FileText,
  },
  {
    name: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard,
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
]

export default function Sidebar({
  onClose,
  user = null,
  savedCount = 0,
  unreadCount = 0,
  onSignOut,
  loading = false,
}: SidebarProps) {
  const pathname =
    usePathname()

  const firstName =
    user?.email
      ?.split('@')[0]
      ?.replace(
        '.',
        ' '
      ) || 'Client'

  return (
    <aside className="w-72 h-full bg-white border-r border-slate-200 shadow-xl flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-[#0F4C5C]/5 to-transparent">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="relative w-10 h-10">
              <Image
                src="/images/tefetro-logo.png"
                alt="Tefetro Studios"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div>
              <p className="font-bold tracking-wider leading-none text-[#0F4C5C]">
                TEFETRO
              </p>

              <p className="text-[11px] mt-1 text-slate-500">
                STUDIOS
              </p>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={
                onClose
              }
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map(
          (item) => {
            const Icon =
              item.icon

            const isActive =
              pathname ===
                item.href ||
              pathname.startsWith(
                `${item.href}/`
              )

            return (
              <Link
                key={
                  item.name
                }
                href={
                  item.href
                }
                onClick={
                  onClose
                }
                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#0F4C5C] text-white shadow-lg shadow-[#0F4C5C]/15'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F4C5C]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? 'text-white'
                      : ''
                  }`}
                />

                <span className="text-sm font-medium">
                  {
                    item.name
                  }
                </span>

                {item.name ===
                  'Saved Plans' &&
                  savedCount >
                    0 && (
                    <span className="ml-auto bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {
                        savedCount
                      }
                    </span>
                  )}

                {item.name ===
                  'Messages' &&
                  unreadCount >
                    0 && (
                    <span className="ml-auto bg-[#C88A2B] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {
                        unreadCount
                      }
                    </span>
                  )}
              </Link>
            )
          }
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl p-3 bg-white border border-slate-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F4C5C] to-[#1F4E79] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {loading
                ? 'Loading...'
                : firstName}
            </p>

            <p className="text-xs text-slate-500 truncate">
              {loading
                ? ''
                : user?.email ||
                  'client@example.com'}
            </p>
          </div>
        </div>

        <button
          onClick={
            onSignOut
          }
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-[#C88A2B]/20 text-[#C88A2B] hover:bg-[#C88A2B]/10 transition"
        >
          <LogOut className="w-4 h-4" />

          <span className="font-medium">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  )
}