import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const CreateProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().min(1),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  floors: z.number().int().optional(),
  plinth_area: z.number().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  addonIds: z.array(z.string()).optional(),
})

export async function POST(request: Request) {
  console.log('=== ADMIN PRODUCTS POST ===')
  
  try {
    // Step 1: Auth
    console.log('1. Checking admin...')
    await verifyAdmin()
    console.log('1. ✓ Admin verified')

    // Step 2: Parse form data
    console.log('2. Parsing form data...')
    let formData: FormData
    try {
      formData = await request.formData()
      console.log('2. ✓ Form data parsed')
    } catch (e: any) {
      console.error('2. ✗ Form data parse error:', e)
      return NextResponse.json({ error: 'Invalid form data', details: e.message }, { status: 400 })
    }

    // Step 3: Extract fields
    console.log('3. Extracting fields...')
    const getField = (name: string) => formData.get(name) as string | null
    
    const title = getField('title')
    const description = getField('description') || undefined
    const priceRaw = getField('price')
    const category = getField('category')
    const bedroomsRaw = getField('bedrooms')
    const bathroomsRaw = getField('bathrooms')
    const floorsRaw = getField('floors')
    const plinth_areaRaw = getField('plinth_area')
    const lengthRaw = getField('length')
    const widthRaw = getField('width')
    const addonIdsRaw = getField('addonIds')
    const file = formData.get('file') as File | null

    console.log('3. Fields:', { title, priceRaw, category, hasFile: !!file, fileSize: file?.size })

    // Step 4: Parse numbers
    const price = priceRaw ? parseFloat(priceRaw) : NaN
    const bedrooms = bedroomsRaw ? parseInt(bedroomsRaw) : undefined
    const bathrooms = bathroomsRaw ? parseInt(bathroomsRaw) : undefined
    const floors = floorsRaw ? parseInt(floorsRaw) : undefined
    const plinth_area = plinth_areaRaw ? parseFloat(plinth_areaRaw) : undefined
    const length = lengthRaw ? parseFloat(lengthRaw) : undefined
    const width = widthRaw ? parseFloat(widthRaw) : undefined
    
    let addonIds: string[] = []
    try {
      addonIds = JSON.parse(addonIdsRaw || '[]')
    } catch (e) {
      console.error('3. ✗ addonIds parse error:', addonIdsRaw)
      return NextResponse.json({ error: 'Invalid addonIds format' }, { status: 400 })
    }

    // Step 5: Validate
    console.log('5. Validating...')
    const validation = CreateProductSchema.safeParse({
      title, description, price, category, bedrooms, bathrooms, floors, plinth_area, length, width, addonIds
    })

    if (!validation.success) {
      console.error('5. ✗ Validation failed:', validation.error.flatten())
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      )
    }
    console.log('5. ✓ Validation passed')

    // Step 6: Generate ID
    const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    console.log('6. Generated ID:', id)

    // Step 7: Handle file upload
    let file_path: string | null = null
    if (file && file.size > 0) {
      console.log('7. Uploading file:', file.name, file.size, file.type)
      
      const fileExt = file.name.split('.').pop() || 'pdf'
      const fileName = `${id}.${fileExt}`

      try {
        // Convert File to ArrayBuffer for upload
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { data: uploadData, error: uploadError } = await adminClient.storage
          .from('drawings')
          .upload(fileName, buffer, {
            contentType: file.type || 'application/pdf',
            upsert: false
          })

        if (uploadError) {
          console.error('7. ✗ Upload error:', uploadError)
          return NextResponse.json(
            { error: 'File upload failed', details: uploadError.message },
            { status: 500 }
          )
        }

        file_path = uploadData?.path || `${fileName}`
        console.log('7. ✓ File uploaded:', file_path)
      } catch (uploadErr: any) {
        console.error('7. ✗ Upload exception:', uploadErr)
        return NextResponse.json(
          { error: 'File upload failed', details: uploadErr.message },
          { status: 500 }
        )
      }
    } else {
      console.log('7. No file to upload')
    }

    // Step 8: Insert product
    console.log('8. Inserting product...')
    const insertData = {
      id,
      title,
      description,
      price,
      category,
      file_path,
      bedrooms,
      bathrooms,
      floors,
      plinth_area,
      length,
      width,
    }
    console.log('8. Insert data:', insertData)

    const { data: product, error: insertError } = await adminClient
      .from('products')
      .insert(insertData)
      .select()
      .single()

    if (insertError) {
      console.error('8. ✗ Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create product', details: insertError.message, hint: insertError.hint },
        { status: 500 }
      )
    }
    console.log('8. ✓ Product inserted:', product?.id)

    // Step 9: Link addons
    if (addonIds && addonIds.length > 0) {
      console.log('9. Linking addons:', addonIds)
      const { error: linkError } = await adminClient
        .from('product_addons')
        .insert(
          addonIds.map((addonId: string) => ({
            product_id: id,
            addon_id: addonId,
          }))
        )

      if (linkError) {
        console.error('9. ⚠ Addon link error (non-fatal):', linkError)
      } else {
        console.log('9. ✓ Addons linked')
      }
    }

    console.log('=== SUCCESS ===')
    return NextResponse.json({
      success: true,
      data: product
    })

  } catch (err: any) {
    console.error('=== UNEXPECTED ERROR ===', err)
    return NextResponse.json(
      { error: 'Internal server error', message: err.message, stack: err.stack },
      { status: 500 }
    )
  }
}

// GET: List products for admin
export async function GET() {
  try {
    await verifyAdmin()

    const { data: products, error } = await adminClient
      .from('products')
      .select(`
        *,
        product_addons (
          addon:addons (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      )
    }

    // Flatten structure
    const flattened = (products || []).map((p: any) => ({
      ...p,
      addons: p.product_addons?.map((pa: any) => pa.addon).filter(Boolean) || []
    }))

    return NextResponse.json({
      success: true,
      data: flattened
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: err.message },
      { status: 500 }
    )
  }
}