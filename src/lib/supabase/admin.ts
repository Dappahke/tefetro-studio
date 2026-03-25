import { createClient } from '@supabase/supabase-js'
import 'server-only'

// This client bypasses Row Level Security - use only for admin operations
// Never import this into client components or API routes accessible to users
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)