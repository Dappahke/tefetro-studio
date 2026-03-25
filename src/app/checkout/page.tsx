import { Suspense } from 'react'
import { fetchProductById } from '@/lib/dal'
import { verifySession } from '@/lib/dal'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

interface CheckoutPageProps {
  searchParams: { 
    productId?: string
    addons?: string
    quickBuy?: string
  }
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  // Require authentication
  const session = await verifySession()
  if (!session) {
    redirect('/login?redirectTo=/checkout')
  }

  const { productId, addons } = await searchParams
  
  if (!productId) {
    return (
      <main className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-deep-700 mb-4">No Product Selected</h1>
          <Link href="/products" className="btn-primary">
            Browse Plans
          </Link>
        </div>
      </main>
    )
  }

  try {
    const product = await fetchProductById(productId)
    
    if (!product) {
      notFound()
    }

    // Parse selected addons
    const selectedAddonIds = addons ? addons.split(',').filter(Boolean) : []
    
    // Validate addons belong to this product (security)
    const validAddonIds = product.addons?.map((a: any) => a.id) || []
    const selectedAddons = product.addons?.filter((a: any) => 
      selectedAddonIds.includes(a.id) && validAddonIds.includes(a.id)
    ) || []

    // Server-side price calculation (secure)
    const basePrice = product.price
    const addonsTotal = selectedAddons.reduce((sum: number, a: any) => sum + Number(a.price), 0)
    const total = basePrice + addonsTotal

    return (
      <main className="min-h-screen bg-canvas">
        {/* Header */}
        <div className="bg-white border-b border-mist/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href={`/products/${productId}`} className="flex items-center gap-2 text-neutral-600 hover:text-deep-700 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Product</span>
              </Link>
              <h1 className="text-xl font-bold text-deep-700">Secure Checkout</h1>
              <div className="w-20" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Checkout Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
                <h2 className="text-xl font-bold text-deep-700 mb-2">Complete Your Purchase</h2>
                <p className="text-neutral-600 mb-6">
                  Logged in as <span className="font-medium text-deep-700">{session.email}</span>
                </p>
                
                <CheckoutForm 
                  productId={productId}
                  productTitle={product.title}
                  total={total}
                  selectedAddons={selectedAddons}
                  userEmail={session.email}
                />
              </div>

              {/* Payment Security */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
                <h3 className="font-semibold text-deep-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure Payment
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-deep/5 rounded-lg">
                    <svg className="w-6 h-6 text-deep" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <span className="text-sm font-medium text-deep">Paystack</span>
                  </div>
                  <span className="text-xs text-neutral-500">Bank Transfer • Card • Mobile Money</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Your payment is processed securely. We never store your card details.
                </p>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              <OrderSummary 
                product={product}
                selectedAddons={selectedAddons}
                basePrice={basePrice}
                addonsTotal={addonsTotal}
                total={total}
              />

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-deep-700">SSL Secure</p>
                      <p className="text-xs text-neutral-500">256-bit encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-deep-700">24h Access</p>
                      <p className="text-xs text-neutral-500">Instant download</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    notFound()
  }
}