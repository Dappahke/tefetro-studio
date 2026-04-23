'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface AdminMobileNavProps {
  userRole: 'user' | 'admin'
}

const mobileNavItems = [
  { href: '/admin', label: 'Home', icon: '📊', roles: ['user', 'admin'] },
  { href: '/admin/orders', label: 'Orders', icon: '📦', roles: ['user', 'admin'] },
  { href: '/admin/projects', label: 'Projects', icon: '🏗️', roles: ['user', 'admin'] },


]

const adminMenuItems = [
  { href: '/admin/products', label: 'Products', icon: '📐' },
    { href: '/admin/portfolio', label: 'Portfolio', icon: '🎨', roles: ['admin'] },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/activity', label: 'Activity', icon: '📜' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export function AdminMobileNav({ userRole }: AdminMobileNavProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const visibleNav = mobileNavItems.filter(item => item.roles.includes(userRole))
  const isAdmin = userRole === 'admin'

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-deep-800 text-canvas border-t border-deep-700 z-50">
        <div className="flex items-center justify-around py-2">
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors
                ${isActive(item.href) ? 'text-tefetra' : 'text-mist'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
          
          {isAdmin && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors
                ${isMenuOpen ? 'text-tefetra' : 'text-mist'}
              `}
            >
              <span className="text-xl">☰</span>
              <span className="text-xs font-medium">More</span>
            </button>
          )}
        </div>
      </nav>

      {/* Admin Menu Sheet */}
      {isAdmin && isMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="lg:hidden fixed bottom-[72px] left-4 right-4 bg-deep-800 rounded-2xl border border-deep-700 shadow-2xl z-50 overflow-hidden">
            <div className="p-2">
              {adminMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${isActive(item.href) 
                      ? 'bg-tefetra/10 text-tefetra' 
                      : 'text-mist hover:bg-deep-700'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}