'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminSidebarProps {
  userRole: 'user' | 'admin';
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', roles: ['user', 'admin'] },
  { href: '/admin/orders', label: 'Orders', icon: '📦', roles: ['user', 'admin'] },
  { href: '/admin/projects', label: 'Projects', icon: '🏗️', roles: ['user', 'admin'] },
  { href: '/admin/products', label: 'Products', icon: '📐', roles: ['admin'] },
  { href: '/admin/users', label: 'Users', icon: '👥', roles: ['admin'] },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈', roles: ['admin'] },
  { href: '/admin/activity', label: 'Activity Log', icon: '📜', roles: ['admin'] },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️', roles: ['admin'] },
]

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname()

  const visibleNav = navItems.filter(item => item.roles.includes(userRole))

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-deep-800 text-canvas flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-deep-700">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-tefetra rounded-xl flex items-center justify-center font-bold text-deep">
            T
          </div>
          <div>
            <h2 className="font-bold text-lg">Tefetro</h2>
            <p className="text-xs text-mist">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-tefetra text-deep font-semibold' 
                  : 'text-mist hover:bg-deep-700 hover:text-canvas'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-2 h-2 bg-deep rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-deep-700 space-y-2">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-mist hover:bg-deep-700 transition-colors"
        >
          <span>🏠</span>
          <span>View Site</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-alert-300 hover:bg-alert/10 transition-colors">
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}