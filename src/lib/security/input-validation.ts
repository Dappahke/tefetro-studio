import { z } from 'zod'

// Product ID validation
export const ProductIdSchema = z.string().min(1, 'Product ID required')

// Addon selection validation
export const AddonSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['drawing', 'service']),
  price: z.number().positive(),
})

export const CreateOrderSchema = z.object({
  productId: ProductIdSchema,
  addons: z.array(z.string().min(1)).default([]), // Just IDs, prices fetched server-side
  paymentRef: z.string().min(1, 'Payment reference required'),
  // Note: total is NOT accepted from frontend — calculated server-side
})

// Project request validation
export const ProjectRequestSchema = z.object({
  serviceType: z.enum(
    ['supervision', 'contracting', 'interior', 'landscape'],
    { message: 'Invalid service type' }
  ),
  description: z.string().max(1000).optional(),
})

// Regenerate download link validation
export const RegenerateLinkSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
})

// Admin update project status
export const UpdateProjectStatusSchema = z.object({
  projectId: z.string().uuid(),
  status: z.enum(['pending', 'contacted', 'in_progress', 'completed']),
})

// Paystack webhook payload validation (subset of actual payload)
export const PaystackWebhookSchema = z.object({
  event: z.string(),
  data: z.object({
    reference: z.string(),
    status: z.enum(['success', 'failed', 'abandoned']),
    amount: z.number(),
    customer: z.object({
      email: z.string().email(),
    }),
    // Fixed: record() requires key type and value type
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
})

// Type exports
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
export type ProjectRequestInput = z.infer<typeof ProjectRequestSchema>
export type RegenerateLinkInput = z.infer<typeof RegenerateLinkSchema>
export type UpdateProjectStatusInput = z.infer<typeof UpdateProjectStatusSchema>
export type PaystackWebhookInput = z.infer<typeof PaystackWebhookSchema>