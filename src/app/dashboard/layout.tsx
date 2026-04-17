'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  HardHat, 
  MessageSquare, 
  Bell, 
  User, 
  Menu,
  LogOut,
  ChevronRight,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface Notification {
  id: string;
  type: 'order' | 'message' | 'project' | 'action';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'My Projects', href: '/dashboard/projects', icon: HardHat },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'order',
      title: 'Download Expiring Soon',
      description: 'Your Bungalow Plan download expires in 4 hours',
      timestamp: '2 hours ago',
      read: false,
      link: '/dashboard/orders'
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message from Tefetra',
      description: 'We have updated the construction timeline',
      timestamp: '5 hours ago',
      read: false,
      link: '/dashboard/messages'
    },
    {
      id: '3',
      type: 'project',
      title: 'Project Phase Updated',
      description: 'Karen Maisonette moved to Approvals phase',
      timestamp: '1 day ago',
      read: true,
      link: '/dashboard/projects'
    }
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
    setIsNotificationsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4 text-[#F28C00]" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-[#0F4C5C]" />;
      case 'project': return <HardHat className="w-4 h-4 text-[#6faa99]" />;
      case 'action': return <Bell className="w-4 h-4 text-[#F28C00]" />;
      default: return <Bell className="w-4 h-4 text-[#1E1E1E]/40" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl border-r border-[#0F4C5C]/10
        transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-[#0F4C5C]/10 bg-gradient-to-r from-[#0F4C5C]/5 to-transparent">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12">
              <Image 
                src="/images/tefetro-logo.png" 
                alt="Tefetra Studios"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#0F4C5C] text-lg tracking-wider">TEFETRA</span>
              <span className="text-xs text-[#1E1E1E]/50">STUDIOS</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[#0F4C5C] text-white shadow-lg shadow-[#0F4C5C]/20' 
                    : 'text-[#1E1E1E]/70 hover:bg-[#0F4C5C]/5 hover:text-[#0F4C5C]'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                <span className="font-medium">{item.name}</span>
                {item.name === 'Messages' && unreadCount > 0 && (
                  <span className="ml-auto bg-[#F28C00] text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[#0F4C5C]/10 bg-gradient-to-r from-transparent to-[#0F4C5C]/5">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-[#0F4C5C]/5 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F4C5C] to-[#6faa99] flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-[#0F4C5C]">
                {user?.email?.split('@')[0] || 'Client'}
              </p>
              <p className="text-xs text-[#1E1E1E]/50 truncate">{user?.email || 'client@example.com'}</p>
            </div>
            <ChevronRight className={`w-4 h-4 text-[#0F4C5C]/40 transition-transform duration-200 ${isProfileOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
          </button>

          {isProfileOpen && (
            <div className="mt-2 px-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#F28C00] hover:bg-[#F28C00]/10 rounded-lg transition-all duration-200 group"
              >
                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#0F4C5C]/10 px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-[#0F4C5C]/5 text-[#0F4C5C] transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-[#0F4C5C] hidden sm:block">
                {navItems.find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-xl hover:bg-[#0F4C5C]/5 text-[#0F4C5C] transition-all duration-200 hover:scale-105"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F28C00] rounded-full animate-pulse ring-2 ring-white" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-[#0F4C5C]/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-[#0F4C5C]/10 bg-gradient-to-r from-[#0F4C5C]/5 to-transparent">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[#0F4C5C] flex items-center gap-2">
                            <Bell className="w-4 h-4 text-[#F28C00]" />
                            Notifications
                          </h3>
                          {unreadCount > 0 && (
                            <button 
                              onClick={markAllAsRead}
                              className="text-xs text-[#F28C00] hover:text-[#F28C00]/80 font-medium transition-colors"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto divide-y divide-[#0F4C5C]/5">
                        {notifications.map((notif) => (
                          <Link
                            key={notif.id}
                            href={notif.link || '#'}
                            onClick={() => setIsNotificationsOpen(false)}
                            className={`
                              flex items-start gap-3 p-4 hover:bg-[#FAF9F6] transition-all duration-200
                              ${!notif.read ? 'bg-[#F28C00]/5 border-l-4 border-l-[#F28C00]' : ''}
                            `}
                          >
                            <div className="mt-0.5 p-1.5 rounded-lg bg-white shadow-sm">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${!notif.read ? 'text-[#0F4C5C]' : 'text-[#1E1E1E]/70'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-[#1E1E1E]/50 mt-0.5 line-clamp-2">{notif.description}</p>
                              <p className="text-xs text-[#1E1E1E]/40 mt-1">{notif.timestamp}</p>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-[#F28C00] rounded-full mt-1.5 flex-shrink-0 animate-pulse" />
                            )}
                          </Link>
                        ))}
                      </div>
                      <div className="p-3 border-t border-[#0F4C5C]/10 bg-[#FAF9F6]">
                        <Link 
                          href="/dashboard/notifications"
                          className="block text-center text-sm text-[#0F4C5C] hover:text-[#F28C00] font-medium transition-colors"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Close Button */}
      {isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="fixed top-4 right-4 z-50 lg:hidden p-2 bg-white rounded-full shadow-lg border border-[#0F4C5C]/10"
        >
          <X className="w-5 h-5 text-[#0F4C5C]" />
        </button>
      )}
    </div>
  );
}