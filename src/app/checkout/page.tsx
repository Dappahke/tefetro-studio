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
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#0F4C5C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#0F4C5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1E1E1E] mb-4">No Product Selected</h1>
          <p className="text-[#1E1E1E]/60 mb-6">Please select a product to proceed with checkout.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F28C00] text-white font-semibold rounded-xl hover:bg-[#F28C00]/90 transition-all duration-200 shadow-lg shadow-[#F28C00]/20 hover:shadow-xl hover:shadow-[#F28C00]/30 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
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

    // Parse selected addons from URL
    const selectedAddonIds = addons ? addons.split(',').filter(Boolean) : []
    
    // Validate addons belong to this product (security check)
    const validAddonIds = product.addons?.map((a: any) => a.id) || []
    const selectedAddons = product.addons?.filter((a: any) => 
      selectedAddonIds.includes(a.id) && validAddonIds.includes(a.id)
    ) || []

    // Server-side price calculation (secure - cannot be manipulated by client)
    const basePrice = Number(product.price)
    const addonsTotal = selectedAddons.reduce((sum: number, a: any) => sum + Number(a.price), 0)
    const total = basePrice + addonsTotal

    return (
      <main className="min-h-screen bg-[#FAF9F6]">
        {/* Header */}
        <div className="bg-white border-b border-[#0F4C5C]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href={`/products/${productId}`} 
                className="flex items-center gap-2 text-[#1E1E1E]/60 hover:text-[#0F4C5C] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Product</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#F28C00]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-[#0F4C5C]">Secure Checkout</h1>
              </div>
              
              <div className="w-24" /> {/* Spacer for balance */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Checkout Form */}
            <div className="space-y-6">
              {/* User Info Card */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-[#0F4C5C]/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0F4C5C]/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#0F4C5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#1E1E1E]/60">Logged in as</p>
                    <p className="font-semibold text-[#1E1E1E]">{session.email}</p>
                  </div>
                </div>
                
                <div className="bg-[#6faa99]/5 border border-[#6faa99]/20 rounded-xl p-4">
                  <p className="text-sm text-[#6faa99] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ready to complete your purchase
                  </p>
                </div>
              </div>

              {/* Payment Form */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-[#0F4C5C]/10">
                <h2 className="text-xl font-bold text-[#0F4C5C] mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Details
                </h2>
                
                <CheckoutForm 
                  productId={productId}
                  productTitle={product.title}
                  total={total}
                  selectedAddons={selectedAddons}
                  userEmail={session.email}
                />
              </div>

              {/* Security Info */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-[#0F4C5C]/10">
                <h3 className="font-semibold text-[#0F4C5C] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#6faa99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure Payment
                </h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#0F4C5C]/5 rounded-lg border border-[#0F4C5C]/10">
                    <svg className="w-6 h-6 text-[#0F4C5C]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <span className="text-sm font-medium text-[#0F4C5C]">Paystack</span>
                  </div>
                  <span className="text-xs text-[#1E1E1E]/50">Bank Transfer • Card • M-Pesa</span>
                </div>
                
                <p className="text-xs text-[#1E1E1E]/50">
                  Your payment is processed securely by Paystack. We never store your card details. 
                  All transactions are encrypted with 256-bit SSL.
                </p>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Suspense fallback={
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-[#0F4C5C]/10 animate-pulse">
                  <div className="h-6 bg-[#0F4C5C]/10 rounded w-1/3 mb-4"></div>
                  <div className="h-20 bg-[#0F4C5C]/5 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#0F4C5C]/10 rounded"></div>
                    <div className="h-4 bg-[#0F4C5C]/10 rounded w-2/3"></div>
                  </div>
                </div>
              }>
                <OrderSummary 
                  product={product}
                  selectedAddons={selectedAddons}
                  basePrice={basePrice}
                  addonsTotal={addonsTotal}
                  total={total}
                />
              </Suspense>

              {/* Trust Badges */}
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-soft border border-[#0F4C5C]/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6faa99]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#6faa99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">SSL Secure</p>
                      <p className="text-xs text-[#1E1E1E]/50">256-bit encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6faa99]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#6faa99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">24h Access</p>
                      <p className="text-xs text-[#1E1E1E]/50">Instant download</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1F4E79]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#1F4E79]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">Verified</p>
                      <p className="text-xs text-[#1E1E1E]/50">Code compliant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F28C00]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" stroke-linejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">Support</p>
                      <p className="text-xs text-[#1E1E1E]/50">24/7 available</p>
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
    console.error('Checkout page error:', error)
    notFound()
  }
}