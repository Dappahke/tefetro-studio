import 'server-only'
import { createClient } from '../supabase/server'

export type AuditEvent = 
  | 'payment_success'
  | 'payment_failed'
  | 'download_link_generated'
  | 'download_link_expired'
  | 'download_completed'
  | 'project_created'
  | 'project_status_updated'
  | 'order_created'
  | 'link_regenerated'
  | 'admin_login'
  | 'product_created'
  | 'product_updated'
  | 'product_deleted'

interface AuditLogEntry {
  event: AuditEvent
  userId?: string
  email?: string
  orderId?: string
  projectId?: string
  productId?: string
  metadata?: Record<string, unknown>
  ip?: string
  userAgent?: string
  timestamp: string
}

export async function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>) {
  const supabase = await createClient()
  
  const logEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  }

  // Insert to audit_logs table (create this in Supabase)
  const { error } = await supabase
    .from('audit_logs')
    .insert({
      event: logEntry.event,
      user_id: logEntry.userId || null,
      email: logEntry.email || null,
      order_id: logEntry.orderId || null,
      project_id: logEntry.projectId || null,
      product_id: logEntry.productId || null,
      metadata: logEntry.metadata || null,
      ip_address: logEntry.ip || null,
      user_agent: logEntry.userAgent || null,
      created_at: logEntry.timestamp,
    })

  if (error) {
    // Log to console as fallback - don't throw to prevent disrupting user flow
    console.error('Failed to write audit log:', error)
    console.log('Audit event:', logEntry)
  }
}

// Convenience helpers for common events
export const audit = {
  paymentSuccess: (data: { userId: string; email: string; orderId: string; amount: number; paymentRef: string }) => 
    logAuditEvent({
      event: 'payment_success',
      userId: data.userId,
      email: data.email,
      orderId: data.orderId,
      metadata: { amount: data.amount, paymentRef: data.paymentRef },
    }),

  paymentFailed: (data: { email: string; paymentRef: string; reason: string }) =>
    logAuditEvent({
      event: 'payment_failed',
      email: data.email,
      metadata: { paymentRef: data.paymentRef, reason: data.reason },
    }),

  downloadLinkGenerated: (data: { userId: string; orderId: string; expiresAt: string }) =>
    logAuditEvent({
      event: 'download_link_generated',
      userId: data.userId,
      orderId: data.orderId,
      metadata: { expiresAt: data.expiresAt },
    }),

  downloadCompleted: (data: { userId: string; orderId: string; ip: string }) =>
    logAuditEvent({
      event: 'download_completed',
      userId: data.userId,
      orderId: data.orderId,
      ip: data.ip,
    }),

  projectCreated: (data: { userId: string; email: string; projectId: string; serviceType: string }) =>
    logAuditEvent({
      event: 'project_created',
      userId: data.userId,
      email: data.email,
      projectId: data.projectId,
      metadata: { serviceType: data.serviceType },
    }),

  projectStatusUpdated: (data: { projectId: string; oldStatus: string; newStatus: string; updatedBy: string }) =>
    logAuditEvent({
      event: 'project_status_updated',
      projectId: data.projectId,
      metadata: { oldStatus: data.oldStatus, newStatus: data.newStatus, updatedBy: data.updatedBy },
    }),

  linkRegenerated: (data: { userId: string; orderId: string; adminId?: string }) =>
    logAuditEvent({
      event: 'link_regenerated',
      userId: data.userId,
      orderId: data.orderId,
      metadata: { adminId: data.adminId },
    }),

  // Product audit events
  productCreated: (data: { userId: string; productId: string; title: string; price: number }) =>
    logAuditEvent({
      event: 'product_created',
      userId: data.userId,
      productId: data.productId,
      metadata: { title: data.title, price: data.price },
    }),

  productUpdated: (data: { userId: string; productId: string; title: string; changes: string[] }) =>
    logAuditEvent({
      event: 'product_updated',
      userId: data.userId,
      productId: data.productId,
      metadata: { title: data.title, changes: data.changes },
    }),

  productDeleted: (data: { userId: string; productId: string; title?: string }) =>
    logAuditEvent({
      event: 'product_deleted',
      userId: data.userId,
      productId: data.productId,
      metadata: { title: data.title },
    }),
}