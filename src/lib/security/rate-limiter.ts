import 'server-only'

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

export class RateLimiter {
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  async check(identifier: string): Promise<{ success: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    // Clean old entries occasionally (simple GC)
    if (Math.random() < 0.001) {
      for (const [key, entry] of store.entries()) {
        if (entry.resetTime < now) {
          store.delete(key)
        }
      }
    }
    
    const key = `${identifier}:${Math.floor(now / this.windowMs)}`
    const existing = store.get(key)
    
    if (!existing || existing.resetTime < now) {
      // New window
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.windowMs,
      }
      store.set(key, newEntry)
      return {
        success: true,
        remaining: this.maxRequests - 1,
        resetTime: newEntry.resetTime,
      }
    }
    
    // Existing window
    if (existing.count >= this.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: existing.resetTime,
      }
    }
    
    existing.count++
    return {
      success: true,
      remaining: this.maxRequests - existing.count,
      resetTime: existing.resetTime,
    }
  }
}

// Pre-configured limiters for different routes
export const limiters = {
  // Strict: 5 attempts per 10 minutes for payment creation
  createOrder: new RateLimiter(5, 10 * 60 * 1000),
  
  // Strict: 3 attempts per minute for downloads (prevents brute force)
  download: new RateLimiter(3, 60 * 1000),
  
  // Medium: 3 attempts per hour for link regeneration
  regenerateLink: new RateLimiter(3, 60 * 60 * 1000),
  
  // Standard auth: 5 attempts per 15 minutes
  login: new RateLimiter(5, 15 * 60 * 1000),
  
  // Lenient: 100 requests per minute for general API
  general: new RateLimiter(100, 60 * 1000),
} as const

// Helper to extract identifier from request
export function getIdentifier(request: Request): string {
  // Use x-forwarded-for or x-real-ip if behind proxy, fallback to unknown
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // Include user ID if authenticated (from middleware header)
  const userId = request.headers.get('x-user-id')
  
  return userId ? `${ip}:${userId}` : ip
}