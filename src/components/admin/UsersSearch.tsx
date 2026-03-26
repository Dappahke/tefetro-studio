'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function UsersSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (value: string) => {
    setQuery(value)
    
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    
    router.push(`/admin/users?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sage">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none transition-colors"
        />
      </div>
      
      <select 
        className="px-4 py-2.5 bg-white border border-mist/50 rounded-xl text-neutral-600 focus:border-tefetra outline-none"
        defaultValue={searchParams.get('role') || ''}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString())
          if (e.target.value) {
            params.set('role', e.target.value)
          } else {
            params.delete('role')
          }
          router.push(`/admin/users?${params.toString()}`)
        }}
      >
        <option value="">All Roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="super_admin">Super Admin</option>
      </select>
    </div>
  )
}