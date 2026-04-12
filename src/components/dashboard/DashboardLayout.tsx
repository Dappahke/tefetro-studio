import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  )
}