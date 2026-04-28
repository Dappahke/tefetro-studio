// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Singleton pattern - only one instance across the app
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseInstance;
}

// Export a single instance for convenience
export const supabase = createClient();