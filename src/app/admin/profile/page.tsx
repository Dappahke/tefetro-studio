// src/app/admin/profile/page.tsx
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  User, Mail, Shield, Calendar, Clock, Save, ArrowLeft, 
  CheckCircle2, ShoppingCart, FileText, Settings, LogIn, Key 
} from 'lucide-react'
import AvatarUpload from '@/components/admin/AvatarUpload'
import { updateProfile } from './actions'

export const metadata = {
  title: 'Profile | Admin',
  description: 'Manage your admin profile',
}

export const dynamic = 'force-dynamic'

async function fetchUserActivity(userId: string) {
  const { data } = await adminClient
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
  return data || []
}

function getActivityInfo(log: any) {
  const map: Record<string, { icon: any; color: string; label: string }> = {
    'order_created': { icon: ShoppingCart, color: 'bg-blue-100 text-blue-600', label: 'New Order' },
    'order_updated': { icon: ShoppingCart, color: 'bg-amber-100 text-amber-600', label: 'Order Updated' },
    'project_created': { icon: FileText, color: 'bg-purple-100 text-purple-600', label: 'Project Created' },
    'user_login': { icon: LogIn, color: 'bg-emerald-100 text-emerald-600', label: 'Login' },
    'profile_updated': { icon: Settings, color: 'bg-stone-100 text-stone-600', label: 'Profile Updated' },
    'password_changed': { icon: Key, color: 'bg-rose-100 text-rose-600', label: 'Password Changed' },
  }
  return map[log.event] || { 
    icon: CheckCircle2, 
    color: 'bg-canvas text-mist', 
    label: log.event?.replace(/_/g, ' ') || 'Unknown' 
  }
}

export default async function ProfilePage({ 
  searchParams 
}: { 
  searchParams: { success?: string } 
}) {
  const session = await verifyAdmin()
  if (!session.user) redirect('/login')

  // Get or create profile
  let { data: profile } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    const { data: newProfile } = await adminClient
      .from('profiles')
      .insert({
        id: session.user.id,
        name: session.email.split('@')[0],
        email: session.user.email,
        role: session.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    profile = newProfile
  }

  const activityLog = await fetchUserActivity(session.user.id)

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-white border-b border-mist/30 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-canvas text-deep-600 hover:bg-mist/50 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-deep-800">Profile Settings</h1>
              <p className="text-sm text-mist">Manage your account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchParams.success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700">
            <CheckCircle2 size={20} />
            <p className="font-medium">Profile updated successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-tefetro/5 to-transparent">
                <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                  <User size={18} className="text-tefetro" />
                  Personal Information
                </h2>
              </div>
              
              <div className="p-6">
                <form action={updateProfile} className="space-y-6">
                  <AvatarUpload 
                    currentAvatarUrl={profile?.avatar_url}
                    userName={profile?.name || ''}
                    userEmail={session.email}
                  />

                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-deep-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={profile?.name || ''}
                        placeholder="Your full name"
                        className="w-full pl-12 pr-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetro/20 focus:border-tefetro transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-deep-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                      <input
                        type="email"
                        value={session.email}
                        disabled
                        className="w-full pl-12 pr-4 py-3 bg-stone-100 border border-mist rounded-xl text-deep-600 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-mist">Email cannot be changed</p>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-mist/20">
                    <Link
                      href="/admin"
                      className="px-6 py-2.5 text-deep-600 hover:text-deep-800 font-medium transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-tefetro text-white rounded-xl font-medium hover:bg-tefetro-600 transition-all shadow-lg shadow-tefetro/20 flex items-center gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Security */}
            <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-rose-50 to-transparent">
                <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                  <Key size={18} className="text-rose-500" />
                  Security
                </h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-canvas rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Key size={20} className="text-deep-600" />
                    </div>
                    <div>
                      <p className="font-medium text-deep-700">Password</p>
                      <p className="text-sm text-mist">Change your password</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/profile/change-password"
                    className="px-4 py-2 text-sm font-medium text-tefetro hover:text-tefetro-600"
                  >
                    Change
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-mist/30 shadow-soft p-6">
              <h3 className="font-semibold text-deep-700 mb-4">Account</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-deep-700">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Role</span>
                  <span className="text-deep-700 capitalize">{profile?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Joined</span>
                  <span className="text-deep-700">
                    {new Date(session.user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-mist/20">
                <h3 className="font-semibold text-deep-700">Recent Activity</h3>
              </div>
              <div className="p-4">
                {activityLog.length === 0 ? (
                  <p className="text-center py-4 text-mist text-sm">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {activityLog.map((log) => {
                      const info = getActivityInfo(log)
                      const Icon = info.icon
                      return (
                        <div key={log.id} className="flex items-start gap-3 p-3 bg-canvas rounded-xl">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${info.color}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-deep-700 font-medium">{info.label}</p>
                            <p className="text-xs text-mist">
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}