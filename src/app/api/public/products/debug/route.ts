import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
    },
    tests: {}
  }

  try {
    const supabase = await createClient()
    
    // Test 1: Basic connection
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    diagnostics.tests.connection = testError ? `✗ ${testError.message}` : '✓ OK'
    
    // Test 2: Products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, price')
      .limit(2)
    
    diagnostics.tests.products = productsError ? `✗ ${productsError.message}` : `✓ ${products?.length || 0} rows`
    
    // Test 3: Addons table
    const { data: addons, error: addonsError } = await supabase
      .from('addons')
      .select('id')
      .limit(1)
    
    diagnostics.tests.addons = addonsError ? `✗ ${addonsError.message}` : '✓ OK'
    
    // Test 4: Product_addons junction
    const { data: junction, error: junctionError } = await supabase
      .from('product_addons')
      .select('product_id, addon_id')
      .limit(1)
    
    diagnostics.tests.junction = junctionError ? `✗ ${junctionError.message}` : '✓ OK'
    
    // Test 5: Full query with join
    const { data: fullQuery, error: fullError } = await supabase
      .from('products')
      .select(`
        *,
        product_addons (
          addon:addons (*)
        )
      `)
      .limit(1)
    
    diagnostics.tests.fullQuery = fullError ? `✗ ${fullError.message}` : '✓ OK'
    
    return NextResponse.json(diagnostics)
    
  } catch (err: any) {
    return NextResponse.json({
      ...diagnostics,
      fatalError: err.message,
      stack: err.stack
    }, { status: 500 })
  }
}