'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  role: 'user' | 'admin' | 'super_admin'
  created_at: string
  order_count: number
  last_sign_in_at?: string
}

interface UsersTableProps {
  users: User[]
}

const roleColors: Record<string, string> = {
  user: 'bg-neutral-100 text-neutral-600',
  admin: 'bg-tefetra/10 text-tefetra',
  super_admin: 'bg-alert/10 text-alert',
}

const roleLabels: Record<string, string> = {
  user: 'User',
  admin: 'Admin',
  super_admin: 'Super Admin',
}

export function UsersTable({ users }: UsersTableProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId)
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!res.ok) throw new Error('Failed to update role')
      
      router.refresh()
    } catch (err) {
      alert('Failed to update user role')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleToggleStatus = async (userId: string, currentDisabled: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabled: !currentDisabled }),
      })

      if (!res.ok) throw new Error('Failed to update status')
      
      router.refresh()
    } catch (err) {
      alert('Failed to update user status')
    }
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-mist/30">
        <p className="text-neutral-600">No users found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-mist/30 overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-canvas border-b border-mist/30">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">User</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Role</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Orders</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Joined</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Last Active</th>
              <th className="text-right py-4 px-6 font-semibold text-deep-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist/30">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-canvas/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-deep rounded-full flex items-center justify-center text-canvas font-semibold">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-deep-700">{user.email}</p>
                      <code className="text-xs text-neutral-400 font-mono">
                        {user.id.slice(0, 8)}...
                      </code>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updatingId === user.id}
                    className={`text-sm px-3 py-1.5 rounded-lg border-0 font-medium ${roleColors[user.role]}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-neutral-600">
                    {user.order_count} orders
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-neutral-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-neutral-600">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleStatus(user.id, false)}
                      className="p-2 text-neutral-400 hover:text-alert hover:bg-alert/10 rounded-lg transition-colors"
                      title="Disable Account"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      className="p-2 text-neutral-400 hover:text-deep-700 hover:bg-canvas rounded-lg transition-colors"
                      title="View Details"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}