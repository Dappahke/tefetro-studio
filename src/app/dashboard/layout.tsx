// src/app/dashboard/layout.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/dashboard/Sidebar'
import {
  Bell,
  Loader2,
  Menu,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router =
    useRouter()

  const supabase =
    createClient()

  const [user, setUser] =
    useState<any>(null)

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true)

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false)

  const [
    savedCount,
    setSavedCount,
  ] = useState(0)

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0)

  /* -------------------------------- */
  /* Auth First (Critical Only)       */
  /* -------------------------------- */
  useEffect(() => {
    async function loadAuth() {
      try {
        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser()

        if (!user) {
          router.push(
            '/login'
          )
          return
        }

        setUser(
          user
        )
      } catch (
        error
      ) {
        console.error(
          'Auth error:',
          error
        )

        router.push(
          '/login'
        )
      } finally {
        setAuthLoading(
          false
        )
      }
    }

    loadAuth()
  }, [
    router,
    supabase,
  ])

  /* -------------------------------- */
  /* Secondary Widgets (Non Blocking) */
  /* -------------------------------- */
  useEffect(() => {
    if (!user)
      return

    async function loadExtras() {
      try {
        const res =
          await fetch(
            '/api/saved-plans',
            {
              cache:
                'no-store',
            }
          )

        if (
          res.ok
        ) {
          const data =
            await res.json()

          setSavedCount(
            data.length ||
              0
          )
        }
      } catch (
        error
      ) {
        console.error(
          'Saved plans load error:',
          error
        )
      }

      try {
        // placeholder until messages are connected
        setUnreadCount(
          0
        )
      } catch {}
    }

    loadExtras()
  }, [user])

  async function handleSignOut() {
    await supabase.auth.signOut()

    router.push('/')
    router.refresh()
  }

  /* -------------------------------- */
  /* Loading State                    */
  /* -------------------------------- */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F4C5C]" />
      </div>
    )
  }

  /* -------------------------------- */
  /* Layout                           */
  /* -------------------------------- */
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          user={user}
          savedCount={
            savedCount
          }
          unreadCount={
            unreadCount
          }
          onSignOut={
            handleSignOut
          }
        />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-72 h-full bg-white shadow-2xl">
            <Sidebar
              user={user}
              savedCount={
                savedCount
              }
              unreadCount={
                unreadCount
              }
              onSignOut={
                handleSignOut
              }
              onClose={() =>
                setSidebarOpen(
                  false
                )
              }
            />
          </div>

          <button
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
            className="flex-1 bg-black/40 backdrop-blur-sm"
          />
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md">
          <div className="h-full px-4 md:px-8 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setSidebarOpen(
                    true
                  )
                }
                className="lg:hidden h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>

              <div>
                <h1 className="text-sm md:text-base font-semibold text-slate-800">
                  Client Dashboard
                </h1>

                <p className="text-xs text-slate-500">
                  Manage your plans, files & orders
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button className="relative h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition">
                <Bell className="w-5 h-5 text-slate-700" />

                {unreadCount >
                  0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {
                      unreadCount
                    }
                  </span>
                )}
              </button>

              <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#0F4C5C] to-[#1F4E79] flex items-center justify-center text-white text-sm font-bold uppercase">
                  {user?.email?.charAt(
                    0
                  ) ||
                    'C'}
                </div>

                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    {user?.email?.split(
                      '@'
                    )[0] ||
                      'Client'}
                  </p>

                  <p className="text-xs text-slate-500">
                    Active Account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}