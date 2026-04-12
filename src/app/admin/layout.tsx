// src/app/admin/layout.tsx
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'
import { RealtimeNotifications } from '@/components/admin/RealtimeNotifications'
import { 
  Search, 
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Sun,
  Moon
} from 'lucide-react'
import { Suspense } from 'react'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'Admin Dashboard | Tefetro',
  description: 'Tefetro Admin Panel',
}

// Server action for signout
async function signOut() {
  'use server'
  const cookieStore = cookies()
  cookieStore.delete('sb-access-token')
  cookieStore.delete('sb-refresh-token')
  redirect('/login')
}

// Server action for theme toggle
async function toggleTheme() {
  'use server'
  const cookieStore = cookies()
  const currentTheme = cookieStore.get('theme')?.value || 'light'
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'
  cookieStore.set('theme', newTheme)
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifyAdmin()

  if (!session.user) {
    redirect('/login')
  }

  // Fetch user profile for avatar
  const { data: profile } = await adminClient
    .from('profiles')
    .select('avatar_url, name')
    .eq('id', session.user.id)
    .single()

  const displayName = profile?.name || session.email.split('@')[0]
  const avatarUrl = profile?.avatar_url

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop Sidebar with Logo */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:bg-white lg:border-r lg:border-mist/30 lg:flex lg:flex-col">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-mist/20">
          <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/images/tefetro-logo.png" 
              alt="Tefetro" 
              width={40} 
              height={40}
              className="rounded-lg object-contain"
              priority
            />
            <div>
              <h1 className="text-lg font-bold text-deep-800 leading-tight">Tefetro</h1>
              <p className="text-xs text-mist">Admin Panel</p>
            </div>
          </Link>
        </div>

        <AdminSidebar userRole={session.role} />
      </aside>

      {/* Mobile Bottom Navigation */}
      <AdminMobileNav userRole={session.role} />

      {/* Main Content */}
      <main className="lg:ml-64 pb-20 lg:pb-0 min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-xl border-b border-mist/30">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Mobile Menu & Search */}
              <div className="flex items-center gap-4 flex-1">
                {/* Mobile Logo */}
                <Link href="/admin" className="lg:hidden flex items-center gap-2">
                  <Image 
                    src="/images/tefetro-logo.png" 
                    alt="Tefetro" 
                    width={32} 
                    height={32}
                    className="rounded-lg object-contain"
                  />
                </Link>

                <button 
                  type="button"
                  className="lg:hidden p-2 text-deep-600 hover:bg-white rounded-xl transition-colors"
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </button>

                <div className="hidden md:flex items-center flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={18} />
                    <input
                      type="search"
                      placeholder="Search orders, products, projects..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-mist/50 rounded-xl text-sm text-deep-700 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Actions & User */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Theme Toggle - Functional */}
                <form action={toggleTheme}>
                  <button 
                    type="submit"
                    className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-mist/50 text-deep-600 hover:border-tefetra/30 hover:text-tefetra transition-all"
                    aria-label="Toggle theme"
                  >
                    <Sun size={18} />
                  </button>
                </form>

                {/* Realtime Notifications */}
                <RealtimeNotifications 
                  userId={session.user.id} 
                  userRole={session.role} 
                />

                {/* User Menu Dropdown */}
                <div className="relative group">
                  <button 
                    type="button"
                    className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white border border-mist/50 rounded-xl hover:border-tefetra/30 transition-all"
                  >
                    {/* Avatar or Initials */}
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-tefetra to-tefetra-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {displayName[0].toUpperCase()}
                      </div>
                    )}
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-deep-700 leading-tight truncate max-w-[120px]">
                        {displayName}
                      </p>
                      <p className="text-xs text-mist capitalize leading-tight">
                        {session.role}
                      </p>
                    </div>
                    <ChevronDown size={16} className="text-mist" />
                  </button>

                  {/* User Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl border border-mist/30 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-mist/20">
                      <p className="text-sm font-medium text-deep-700 truncate">
                        {session.email}
                      </p>
                      <p className="text-xs text-mist capitalize">
                        {session.role} Account
                      </p>
                    </div>
                    <div className="p-2">
                      <Link 
                        href="/admin/profile" 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-deep-700 hover:bg-canvas transition-colors"
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <Link 
                        href="/admin/settings" 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-deep-700 hover:bg-canvas transition-colors"
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      <div className="border-t border-mist/20 my-2" />
                      <form action={signOut}>
                        <button 
                          type="submit"
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}