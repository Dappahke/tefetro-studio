// src/lib/storage/avatars.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const storageClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<{ url: string; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    
    if (!fileExt || !allowedExts.includes(fileExt)) {
      throw new Error('Invalid file type. Allowed: JPG, PNG, GIF, WebP')
    }

    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `profiles/${fileName}`

    const { error: uploadError } = await storageClient
      .storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = storageClient
      .storage
      .from('avatars')
      .getPublicUrl(filePath)

    return { url: publicUrl, error: null }
  } catch (error) {
    return { url: '', error: error as Error }
  }
}

export async function deleteAvatar(url: string): Promise<void> {
  try {
    if (!url.includes('/avatars/')) return
    
    const pathMatch = url.match(/avatars\/(.+)/)
    if (!pathMatch) return

    await storageClient
      .storage
      .from('avatars')
      .remove([pathMatch[1]])
  } catch (error) {
    console.error('Error deleting avatar:', error)
  }
}