import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

// GET /api/dashboard/download?orderId=xxx&fileName=xxx
export async function GET(request: NextRequest) {
  try {
    // Use your existing async server client
    const supabase = await createClient();
    
    // Check authentication using getUser (not getSession for security)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const fileName = searchParams.get('fileName');

    if (!orderId || !fileName) {
      return NextResponse.json(
        { error: 'Missing orderId or fileName' },
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

    // Check if download has expired
    if (order.expires_at && new Date(order.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Download link has expired', code: 'EXPIRED' },
        { status: 410 }
      );
    }

    // Generate signed URL for the file
    const filePath = `${orderId}/${fileName}`;
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('order-files')
      .createSignedUrl(filePath, 60 * 5); // 5 minutes expiry

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('Signed URL error:', signedUrlError);
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      );
    }

    // Log download activity (optional)
    await supabase.from('download_logs').insert({
      order_id: orderId,
      user_id: user.id,
      file_name: fileName,
      downloaded_at: new Date().toISOString()
    });

    // Return the signed URL
    return NextResponse.json({
      signedUrl: signedUrlData.signedUrl,
      expiresIn: 300 // 5 minutes in seconds
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}