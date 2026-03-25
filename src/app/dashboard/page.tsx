import { Suspense } from 'react'
import { verifySession } from '@/lib/dal'
import { fetchUserOrders } from '@/lib/dal'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { OrderList } from '@/components/dashboard/OrderList'
import { ProjectList } from '@/components/dashboard/ProjectList'
import { DownloadManager } from '@/components/dashboard/DownloadManager'

export default async function DashboardPage() {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login?redirectTo=/dashboard')
  }

  const orders = await fetchUserOrders()

  // Separate orders with downloads vs projects
  const downloadOrders = orders.filter((o: any) => o.download_url)
  const projectOrders = orders.filter((o: any) => 
    o.addons?.some((a: any) => a.type === 'service')
  )

  return (
    <main className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-deep text-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-mist mt-1">Welcome back, {session.email}</p>
            </div>
            <Link href="/products" className="btn-tertiary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Browse Plans
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-mist/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-canvas rounded-xl">
              <div className="text-2xl font-bold text-deep-700">{orders.length}</div>
              <div className="text-sm text-neutral-600">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-canvas rounded-xl">
              <div className="text-2xl font-bold text-tefetra">{downloadOrders.length}</div>
              <div className="text-sm text-neutral-600">Downloads</div>
            </div>
            <div className="text-center p-4 bg-canvas rounded-xl">
              <div className="text-2xl font-bold text-sage">{projectOrders.length}</div>
              <div className="text-sm text-neutral-600">Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Orders & Downloads */}
          <div className="lg:col-span-2 space-y-8">
            {/* Downloads Section */}
            {downloadOrders.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-deep-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-tefetra" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Available Downloads
                </h2>
                <Suspense fallback={<div className="h-32 bg-mist/30 rounded-2xl animate-pulse" />}>
                  <DownloadManager orders={downloadOrders} />
                </Suspense>
              </section>
            )}

            {/* Order History */}
            <section>
              <h2 className="text-xl font-bold text-deep-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order History
              </h2>
              <Suspense fallback={<div className="h-64 bg-mist/30 rounded-2xl animate-pulse" />}>
                <OrderList orders={orders} />
              </Suspense>
            </section>
          </div>

          {/* Right: Projects & Support */}
          <div className="space-y-8">
            {/* Active Projects */}
            {projectOrders.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-deep-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Service Projects
                </h2>
                <Suspense fallback={<div className="h-32 bg-mist/30 rounded-2xl animate-pulse" />}>
                  <ProjectList orders={projectOrders} />
                </Suspense>
              </section>
            )}

            {/* Support Card */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
              <h3 className="font-semibold text-deep-700 mb-3">Need Help?</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Having trouble with downloads or have questions about your order?
              </p>
              <div className="space-y-2">
                <a 
                  href="mailto:support@tefetra.studio" 
                  className="flex items-center gap-2 text-sm text-deep-600 hover:text-tefetra transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@tefetra.studio
                </a>
                <p className="text-xs text-neutral-500 mt-2">
                  Response within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}