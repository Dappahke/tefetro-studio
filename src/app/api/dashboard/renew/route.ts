import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

// POST /api/dashboard/renew
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }

    // Verify order belongs to user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 403 }
      );
    }

    // Create renewal request
    const { data: renewalRequest, error: renewalError } = await supabase
      .from('download_renewal_requests')
      .insert({
        order_id: orderId,
        user_id: user.id,
        status: 'pending',
        requested_at: new Date().toISOString()
      })
      .select()
      .single();

    if (renewalError) {
      console.error('Renewal error:', renewalError);
      return NextResponse.json(
        { error: 'Failed to create renewal request' },
        { status: 500 }
      );
    }

    // Create notification for admin
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'action',
      title: 'Download Renewal Requested',
      description: `User requested renewal for order ${orderId}`,
      link: `/admin/renewals/${renewalRequest.id}`
    });

    return NextResponse.json({
      success: true,
      message: 'Renewal request submitted successfully. You will be notified once approved.',
      requestId: renewalRequest.id
    });

  } catch (error) {
    console.error('Renewal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}