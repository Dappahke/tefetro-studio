// src/app/dashboard/profile/page.tsx

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/dashboard/ProfileForm'

export default async function ProfilePage() {
  const supabase =
    await createClient()

  const {
    data: { user },
  } =
    await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const {
    data: profile,
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const mergedProfile = {
    id: user.id,
    email:
      user.email || '',
    name:
      profile?.name ||
      '',
    avatar_url:
      profile?.avatar_url ||
      '',
    phone:
      profile?.phone ||
      '',
    country:
      profile?.country ||
      '',
    company:
      profile?.company ||
      '',
    bio:
      profile?.bio ||
      '',
    email_notifications:
      profile?.email_notifications ??
      true,
    marketing_notifications:
      profile?.marketing_notifications ??
      false,
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your personal information, preferences and account identity.
        </p>
      </div>

      <ProfileForm
        profile={
          mergedProfile
        }
      />
    </div>
  )
}