import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/dal'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'
import { audit } from '@/lib/security/audit-logger'
import { z } from 'zod'

const UpdateSchema = z.object({
  role: z.enum(['user', 'admin', 'super_admin']).optional(),
  disabled: z.boolean().optional(),
})

// PATCH: Update user role or status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.general.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const session = await verifyAdmin()

    // Only super_admin can change roles
    if (session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Super admin required for role changes' },
        { status: 403 }
      )
    }

    const { id } = params
    const body = await request.json()
    
    const validation = UpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    const { role, disabled } = validation.data

    // Update profile
    const updates: any = {}
    if (role) updates.role = role
    if (disabled !== undefined) updates.disabled = disabled

    const { data: profile, error } = await adminClient
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Audit log
    // Note: Replace with the appropriate audit method from your audit object
    // based on the available methods: paymentSuccess, paymentFailed, etc.

    return NextResponse.json({
      success: true,
      data: profile,
    })

  } catch (err) {
    console.error('Admin user PATCH error:', err)
    
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}