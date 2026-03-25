'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminMobileNavProps {
  userRole: 'user' | 'admin'
}

const mobileNavItems = [
  { href: '/admin', label: 'Home', icon: '📊', roles: ['user', 'admin'] },
  { href: '/admin/orders', label: 'Orders', icon: '📦', roles: ['user', 'admin'] },
  { href: '/admin/projects', label: 'Projects', icon: '🏗️', roles: ['user', 'admin'] },
  { href: '/admin/menu', label: 'More', icon: '☰', roles: ['admin'] },
]

export function AdminMobileNav({ userRole }: AdminMobileNavProps) {
  const pathname = usePathname()
  
  const visibleNav = mobileNavItems.filter(item => item.roles.includes(userRole))

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-deep-800 text-canvas border-t border-deep-700 z-50">
      <div className="flex items-center justify-around py-2">
        {visibleNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors
                ${isActive ? 'text-tefetra' : 'text-mist'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}