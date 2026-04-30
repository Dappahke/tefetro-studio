// src/types/realtime.ts
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { Database } from './supabase'

// Generic real-time payload type
export type RealtimePayload<T extends keyof Database['public']['Tables']> = 
  RealtimePostgresChangesPayload<Database['public']['Tables'][T]['Row']>

// Specific payload types for each table
export type OrderPayload = RealtimePayload<'orders'>
export type MessagePayload = RealtimePayload<'messages'>
export type ConversationPayload = RealtimePayload<'conversations'>
export type NotificationPayload = RealtimePayload<'notifications'>
export type ProjectPayload = RealtimePayload<'projects'>

// Helper function to safely handle real-time payloads
export function getRealtimePayload<T extends keyof Database['public']['Tables']>(
  payload: RealtimePayload<T>,
  userId?: string | null
): Database['public']['Tables'][T]['Row'] | null {
  // payload.new can be {} — check if it has any meaningful keys
  if (!payload.new || Object.keys(payload.new).length === 0) {
    return null
  }

  // Type guard: check if user_id exists and matches
  if (
    userId &&
    typeof payload.new === 'object' &&
    payload.new !== null &&
    'user_id' in payload.new &&
    (payload.new as Record<string, unknown>).user_id !== userId
  ) {
    return null
  }

  // Cast through unknown to satisfy TypeScript's strict union checking
  return payload.new as unknown as Database['public']['Tables'][T]['Row']
}