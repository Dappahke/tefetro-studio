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
  ChevronRight
} from 'lucide-react';
// Use your existing client.ts which exports createBrowserClient
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
      case 'order': return <ShoppingBag className="w-4 h-4 text-tefetra" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-deep" />;
      case 'project': return <HardHat className="w-4 h-4 text-sage" />;
      case 'action': return <Bell className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-200/60
        transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-stone-100">
          <Link href="/" className="flex items-center gap-3">
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
              <span className="font-bold text-deep text-sm tracking-wider">TEFETRA</span>
              <span className="text-xs text-stone-500">STUDIOS</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-deep text-white shadow-lg shadow-deep/20' 
                    : 'text-stone-600 hover:bg-stone-100 hover:text-deep'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.name === 'Messages' && unreadCount > 0 && (
                  <span className="ml-auto bg-tefetra text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-stone-100">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
              <User className="w-5 h-5 text-sage" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-stone-800">
                {user?.email?.split('@')[0] || 'Client'}
              </p>
              <p className="text-xs text-stone-500">{user?.email || 'client@example.com'}</p>
            </div>
            <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${isProfileOpen ? 'rotate-90' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="mt-2 px-3">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200/60 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-600"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-deep hidden sm:block">
                {navItems.find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-tefetra rounded-full animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden">
                      <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                        <h3 className="font-semibold text-deep">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-xs text-tefetra hover:text-tefetra-600 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <Link
                            key={notif.id}
                            href={notif.link || '#'}
                            onClick={() => setIsNotificationsOpen(false)}
                            className={`flex items-start gap-3 p-4 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0 ${!notif.read ? 'bg-tefetra/5' : ''}`}
                          >
                            <div className="mt-0.5">{getNotificationIcon(notif.type)}</div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${!notif.read ? 'text-deep' : 'text-stone-700'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{notif.description}</p>
                              <p className="text-xs text-stone-400 mt-1">{notif.timestamp}</p>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-tefetra rounded-full mt-1.5 flex-shrink-0" />
                            )}
                          </Link>
                        ))}
                      </div>
                      <div className="p-3 border-t border-stone-100 bg-stone-50">
                        <Link 
                          href="/dashboard/notifications"
                          className="block text-center text-sm text-stone-600 hover:text-deep font-medium"
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
    </div>
  );
}