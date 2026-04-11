// src/app/admin/profile/page.tsx
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Clock,
  Edit3,
  Key,
  Bell,
  Smartphone,
  Globe,
  Save,
  ArrowLeft,
  CheckCircle2,
  ShoppingCart,
  FileText,
  Settings,
  LogIn
} from 'lucide-react'

export const metadata = {
  title: 'Profile | Tefetro Admin',
  description: 'Manage your admin profile and settings',
}

export const dynamic = 'force-dynamic'

async function fetchUserActivity(userId: string) {
  // Use adminClient instead of createClient
  const { data: activity, error } = await adminClient
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching activity:', error)
    return []
  }

  return activity || []
}

// Map audit log events to display info
function getActivityInfo(log: any) {
  const eventMap: Record<string, { icon: any; color: string; label: string }> = {
    'order_created': { icon: ShoppingCart, color: 'bg-blue-100 text-blue-600', label: 'New Order' },
    'order_updated': { icon: ShoppingCart, color: 'bg-amber-100 text-amber-600', label: 'Order Updated' },
    'project_created': { icon: FileText, color: 'bg-purple-100 text-purple-600', label: 'Project Created' },
    'project_updated': { icon: FileText, color: 'bg-purple-100 text-purple-600', label: 'Project Updated' },
    'user_login': { icon: LogIn, color: 'bg-emerald-100 text-emerald-600', label: 'Login' },
    'profile_updated': { icon: Settings, color: 'bg-stone-100 text-stone-600', label: 'Profile Updated' },
    'password_changed': { icon: Key, color: 'bg-rose-100 text-rose-600', label: 'Password Changed' },
  }

  return eventMap[log.event] || { 
    icon: CheckCircle2, 
    color: 'bg-canvas text-mist', 
    label: log.event 
  }
}

export default async function AdminProfilePage() {
  const session = await verifyAdmin()
  
  if (!session.user) {
    redirect('/login')
  }

  // Use adminClient for all database queries
  const { data: profile } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // For auth user data, we need to use a different approach
  // Since we can't use supabase.auth.getUser() with adminClient easily,
  // we'll use the session data we already have
  const userCreatedAt = session.user.created_at || new Date().toISOString()

  const activityLog = await fetchUserActivity(session.user.id)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-white border-b border-mist/30 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-canvas text-deep-600 hover:bg-mist/50 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-deep-800">Profile Settings</h1>
                <p className="text-sm text-mist">Manage your account and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Card */}
            <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-tefetra/5 to-transparent">
                <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                  <User size={18} className="text-tefetra" />
                  Personal Information
                </h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-tefetra to-tefetra-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {session.email[0].toUpperCase()}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border border-mist shadow-sm flex items-center justify-center text-deep-600 hover:text-tefetra transition-colors">
                      <Edit3 size={14} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-deep-800">
                      {profile?.full_name || session.email.split('@')[0]}
                    </h3>
                    <p className="text-mist">{session.email}</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-tefetra/10 text-tefetra rounded-full text-xs font-medium mt-2">
                      <Shield size={12} />
                      {session.role} Account
                    </span>
                  </div>
                </div>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-deep-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                        <input
                          type="text"
                          defaultValue={profile?.full_name || ''}
                          placeholder="Your full name"
                          className="w-full pl-12 pr-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-deep-700">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                        <input
                          type="tel"
                          defaultValue={profile?.phone || ''}
                          placeholder="+254 700 000 000"
                          className="w-full pl-12 pr-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all"
                        />
                      </div>
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-deep-700">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={profile?.bio || ''}
                      placeholder="Tell us a bit about yourself..."
                      className="w-full px-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                      type="button"
                      className="px-6 py-2.5 text-deep-600 hover:text-deep-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-tefetra text-white rounded-xl font-medium hover:bg-tefetra-600 transition-all shadow-lg shadow-tefetra/20 flex items-center gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Security Settings */}
            <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-rose-50 to-transparent">
                <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                  <Key size={18} className="text-rose-500" />
                  Security
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-canvas rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Key size={20} className="text-deep-600" />
                    </div>
                    <div>
                      <p className="font-medium text-deep-700">Password</p>
                      <p className="text-sm text-mist">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/profile/change-password"
                    className="px-4 py-2 text-sm font-medium text-tefetra hover:text-tefetra-600 transition-colors"
                  >
                    Change
                  </Link>
                </div>

                <div className="flex items-center justify-between p-4 bg-canvas rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Shield size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-deep-700">Two-Factor Authentication</p>
                      <p className="text-sm text-mist">Not enabled</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-tefetra hover:text-tefetra-600 transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-6">
            
            {/* Account Status */}
            <div className="bg-white rounded-2xl border border-mist/30 shadow-soft p-6">
              <h3 className="font-semibold text-deep-700 mb-4">Account Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-deep-700">Active</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-mist" />
                  <span className="text-mist">Joined</span>
                  <span className="text-deep-700 ml-auto">
                    {formatDate(userCreatedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-mist" />
                  <span className="text-mist">Last active</span>
                  <span className="text-deep-700 ml-auto">
                    Just now
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity - Using audit_logs */}
            <div className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-mist/20">
                <h3 className="font-semibold text-deep-700">Recent Activity</h3>
              </div>
              
              <div className="p-4">
                {activityLog.length === 0 ? (
                  <div className="text-center py-6 text-mist text-sm">
                    <div className="w-12 h-12 bg-canvas rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6" />
                    </div>
                    No recent activity
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activityLog.map((log: any) => {
                      const info = getActivityInfo(log)
                      const Icon = info.icon
                      
                      return (
                        <div key={log.id} className="flex items-start gap-3 p-3 bg-canvas rounded-xl">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${info.color}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-deep-700 font-medium">
                              {info.label}
                            </p>
                            {log.metadata?.description && (
                              <p className="text-xs text-mist line-clamp-2">
                                {log.metadata.description}
                              </p>
                            )}
                            <p className="text-xs text-mist mt-1">
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                
                <Link 
                  href="/admin/activity"
                  className="block text-center text-sm text-tefetra hover:text-tefetra-600 mt-4 pt-4 border-t border-mist/20"
                >
                  View all activity
                </Link>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl border border-mist/30 shadow-soft p-6">
              <h3 className="font-semibold text-deep-700 mb-4">Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell size={18} className="text-mist" />
                    <span className="text-sm text-deep-700">Email Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-mist peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tefetra"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-mist" />
                    <span className="text-sm text-deep-700">Language</span>
                  </div>
                  <select className="text-sm bg-canvas border border-mist rounded-lg px-3 py-1.5">
                    <option>English</option>
                    <option>Swahili</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}