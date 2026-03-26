import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    await verifyAdmin()
    
    const tests: any = {}
    
    // Test 1: Check storage bucket
    const { data: buckets, error: bucketError } = await adminClient.storage.listBuckets()
    tests.buckets = bucketError ? `✗ ${bucketError.message}` : `✓ ${buckets?.map(b => b.name).join(', ') || 'none'}`
    
    // Test 2: Check products table structure
    const { data: sample, error: sampleError } = await adminClient
      .from('products')
      .select('*')
      .limit(1)
    
    tests.productsTable = sampleError ? `✗ ${sampleError.message}` : `✓ OK, columns: ${sample ? Object.keys(sample[0] || {}).join(', ') : 'none'}`
    
    // Test 3: Check addons
    const { data: addons, error: addonError } = await adminClient.from('addons').select('id, name').limit(2)
    tests.addons = addonError ? `✗ ${addonError.message}` : `✓ ${addons?.length || 0} addons`
    
    return NextResponse.json(tests)
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 })
  }
}