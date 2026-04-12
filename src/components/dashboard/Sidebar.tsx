import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r p-4">
      <h2 className="font-bold text-lg mb-6">Tefetro</h2>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/project">Project</Link>
        <Link href="/dashboard/files">Files</Link>
        <Link href="/dashboard/payments">Payments</Link>
        <Link href="/dashboard/messages">Messages</Link>
        <Link href="/dashboard/profile">Profile</Link>
      </nav>
    </aside>
  )
}