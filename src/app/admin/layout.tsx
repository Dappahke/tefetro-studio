import { verifyAdmin } from '@/lib/dal'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifyAdmin()

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop Sidebar */}
      <AdminSidebar userRole={session.role} />
      
      {/* Mobile Bottom Navigation */}
      <AdminMobileNav userRole={session.role} />
      
      {/* Main Content */}
      <main className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-deep-700">Admin Dashboard</h1>
              <p className="text-sm text-neutral-500 capitalize">{session.role} Access</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-neutral-600 hover:text-deep-700 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-alert rounded-full" />
              </button>
              
              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-mist/50">
                <div className="w-10 h-10 bg-deep rounded-full flex items-center justify-center text-canvas font-semibold">
                  {session.email[0].toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-deep-700">{session.email}</p>
                  <p className="text-xs text-neutral-500 capitalize">{session.role}</p>
                </div>
              </div>
            </div>
          </header>
          
          {children}
        </div>
      </main>
    </div>
  )
}