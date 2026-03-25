import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/dal'
import { UpdateProjectStatusSchema } from '@/lib/security/input-validation'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'
import { audit } from '@/lib/security/audit-logger'
import { sendProjectUpdateEmail } from '@/lib/email'
import { z } from 'zod'

const QuerySchema = z.object({
  status: z.enum(['pending', 'contacted', 'in_progress', 'completed']).optional(),
  userId: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
})

// GET: List all projects
export async function GET(request: Request) {
  try {
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.general.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    await verifyAdmin()

    const { searchParams } = new URL(request.url)
    const queryResult = QuerySchema.safeParse({
      status: searchParams.get('status'),
      userId: searchParams.get('userId'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    const { status, userId, limit, offset } = queryResult.data

    let dbQuery = adminClient
      .from('projects')
      .select(`
        *,
        user:profiles(id, email),
        order:orders(id, total, product_id)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      dbQuery = dbQuery.eq('status', status)
    }

    if (userId) {
      dbQuery = dbQuery.eq('user_id', userId)
    }

    const { data: projects, error, count } = await dbQuery

    if (error) throw error

    return NextResponse.json({
      data: projects,
      meta: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })

  } catch (err) {
    console.error('Admin projects error:', err)
    
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// PATCH: Update project status
export async function PATCH(request: Request) {
  try {
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.general.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const session = await verifyAdmin()

    const body = await request.json()
    const validation = UpdateProjectStatusSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { projectId, status } = validation.data

    // Get current project for audit log
    const { data: currentProject, error: fetchError } = await adminClient
      .from('projects')
      .select('*, user:profiles(email)')
      .eq('id', projectId)
      .single()

    if (fetchError || !currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const oldStatus = currentProject.status

    // Update status
    const { data: updatedProject, error: updateError } = await adminClient
      .from('projects')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single()

    if (updateError) throw updateError

    // Audit log
    await audit.projectStatusUpdated({
      projectId,
      oldStatus,
      newStatus: status,
      updatedBy: session.user.id,
    })

    // Notify user
    try {
      await sendProjectUpdateEmail(
        currentProject.user.email,
        projectId,
        status,
        currentProject.service_type
      )
    } catch (emailError) {
      console.error('Status update email failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      data: updatedProject,
    })

  } catch (err) {
    console.error('Update project error:', err)
    
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}