import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Route configuration constants
const PUBLIC_ROUTES = ['/', '/products', '/products/[id]']
const AUTH_ROUTES = ['/login', '/reset-password']
const PROTECTED_ROUTES = ['/dashboard', '/checkout']
const ADMIN_ROUTES = ['/admin']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Verify user session using getUser() - more secure than getSession()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user role from profiles if authenticated
  let userRole: 'user' | 'admin' | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    userRole = profile?.role || 'user'
  }

  const { pathname } = request.nextUrl

  // Check if route matches patterns
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith('/products/')
  )
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    const redirectUrl = userRole === 'admin' ? '/admin' : '/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Redirect unauthenticated users to login for protected routes
  if ((isProtectedRoute || isAdminRoute) && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect non-admin users away from admin routes
  if (isAdminRoute && user && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Add user context headers for downstream use
  // These are trusted by API routes - never trust client-sent user IDs
  if (user) {
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-role', userRole || 'user')
    response.headers.set('x-user-email', user.email || '')
  }

  // Add client IP header for currency/geolocation detection
  // Used by server components to detect user's country/currency
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1'
  response.headers.set('x-client-ip', clientIp)

  // Add currency detection flag for product/checkout pages
  // Server components will use this to trigger currency conversion
  if (pathname.startsWith('/products') || pathname.startsWith('/checkout')) {
    response.headers.set('x-detect-currency', 'true')
  }

  return response
}

// Matcher configuration - run on all routes except static files and API webhooks
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/webhooks/* (webhook routes need raw body access)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)',
  ],
}