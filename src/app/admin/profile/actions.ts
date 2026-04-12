// src/app/admin/profile/actions.ts
'use server'

import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { uploadAvatar, deleteAvatar } from '@/lib/storage/avatars'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const session = await verifyAdmin()
  if (!session.user) redirect('/login')

  const name = formData.get('name') as string
  const existingAvatarUrl = formData.get('avatar_url') as string
  const avatarFile = formData.get('avatar_file') as File

  let avatarUrl = existingAvatarUrl

  // Handle new avatar upload
  if (avatarFile && avatarFile.size > 0) {
    const { url, error } = await uploadAvatar(avatarFile, session.user.id)
    if (error) throw new Error(`Upload failed: ${error.message}`)
    
    // Clean up old avatar
    if (existingAvatarUrl && existingAvatarUrl !== url) {
      await deleteAvatar(existingAvatarUrl)
    }
    
    avatarUrl = url
  }

  // Update profile
  const { error } = await adminClient
    .from('profiles')
    .upsert({
      id: session.user.id,
      name: name || session.email.split('@')[0],
      email: session.user.email,
      role: session.role,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

  if (error) throw new Error('Failed to update profile')

  // Log activity
  await adminClient.from('audit_logs').insert({
    user_id: session.user.id,
    event: 'profile_updated',
    metadata: { 
      description: 'Profile updated',
      avatar_changed: avatarFile?.size > 0 
    },
  })

  revalidatePath('/admin/profile')
  redirect('/admin/profile?success=true')
}