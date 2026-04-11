// src/app/admin/profile/change-password/page.tsx
import { verifyAdmin } from '@/lib/dal'
import Link from 'next/link'
import { ArrowLeft, Key, Eye, EyeOff } from 'lucide-react'

export const metadata = {
  title: 'Change Password | Tefetro Admin',
}

export default async function ChangePasswordPage() {
  const session = await verifyAdmin()

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-md mx-auto px-4 py-12">
        <Link 
          href="/admin/profile"
          className="inline-flex items-center gap-2 text-mist hover:text-deep-700 mb-8"
        >
          <ArrowLeft size={18} />
          Back to Profile
        </Link>

        <div className="bg-white rounded-2xl border border-mist/30 shadow-soft p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-xl font-bold text-deep-800">Change Password</h1>
            <p className="text-mist text-sm mt-2">
              Enter your current password and a new password
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-deep-700">
                Current Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-deep-700">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all"
              />
              <p className="text-xs text-mist">Must be at least 8 characters</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-deep-700">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-tefetra text-white rounded-xl font-medium hover:bg-tefetra-600 transition-all shadow-lg shadow-tefetra/20"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}