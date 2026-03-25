import { z } from 'zod'

// Server-side environment variables (never exposed to browser)
const serverEnvSchema = z.object({
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Service role key required'),
  
  // Paystack
  PAYSTACK_SECRET_KEY: z.string().min(1, 'Paystack secret required'),
  
  // Email
  RESEND_API_KEY: z.string().min(1, 'Resend API key required'),
  
  // Security
  DOWNLOAD_SECRET: z.string().min(32, 'Download secret must be at least 32 characters'),
})

// Client-side environment variables (exposed to browser, must start with NEXT_PUBLIC_)
const clientEnvSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Anon key required'),
})

// Validate server env
const serverEnv = serverEnvSchema.safeParse(process.env)

if (!serverEnv.success) {
  console.error('❌ Invalid server environment variables:', serverEnv.error.flatten().fieldErrors)
  throw new Error('Invalid server environment variables')
}

// Validate client env
const clientEnv = clientEnvSchema.safeParse(process.env)

if (!clientEnv.success) {
  console.error('❌ Invalid client environment variables:', clientEnv.error.flatten().fieldErrors)
  throw new Error('Invalid client environment variables')
}

// Export typed env
export const env = {
  server: serverEnv.data,
  client: clientEnv.data,
} as const

// Type-safe helpers
export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>