'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  HardHat, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  Plus,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Order {
  id: string;
  productName: string;
  category: string;
  price: number;
  purchaseDate: string;
  status: 'delivered' | 'processing' | 'pending';
  files: string[];
  hasBOQ: boolean;
  hasInteriors: boolean;
  hasLandscape: boolean;
  expiresAt: string;
}

interface Project {
  id: string;
  name: string;
  type: string;
  startDate: string;
  expectedHandover: string;
  currentPhase: string;
  progress: number;
  lastUpdate: string;
}

interface Activity {
  id: string;
  type: 'order' | 'message' | 'project' | 'download';
  title: string;
  description: string;
  timestamp: string;
  link: string;
}

interface DashboardStats {
  totalOrders: number;
  activeProjects: number;
  unreadMessages: number;
  expiringDownloads: number;
}

export default function DashboardOverview() {
  const [userName, setUserName] = useState('Client');
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeProjects: 0,
    unreadMessages: 0,
    expiringDownloads: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  // Fetch user and dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setError('Please sign in to view your dashboard');
          return;
        }
        
        setUserId(user.id);
        setUserName(user.email?.split('@')[0] || 'Client');

        // Fetch all data in parallel
        const [
          ordersResult,
          projectsResult,
          messagesResult,
          activityResult
        ] = await Promise.all([
          // Fetch recent orders with product details
          supabase
            .from('orders')
            .select(`
              id,
              total_price,
              status,
              expires_at,
              created_at,
              products:product_id (title, category),
              selected_addons
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
          
          // Fetch active projects
          supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(3),
          
          // Fetch unread message count
          supabase
            .from('conversations')
            .select('unread_count')
            .eq('user_id', user.id),
          
          // Fetch recent activity (combined from multiple sources)
          supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        // Process orders
        if (ordersResult.data) {
          const formattedOrders: Order[] = ordersResult.data.map(order => ({
            id: order.id,
            productName: order.products?.[0]?.title || 'Unknown Product',
            category: order.products?.[0]?.category || 'Uncategorized',
            price: order.total_price,
            purchaseDate: order.created_at,
            status: order.status,
            files: ['Floor Plan', 'Elevations', 'Sections'], // This would come from storage
            hasBOQ: order.selected_addons?.some((a: any) => a.name?.includes('BOQ')) || false,
            hasInteriors: order.selected_addons?.some((a: any) => a.name?.includes('Interior')) || false,
            hasLandscape: order.selected_addons?.some((a: any) => a.name?.includes('Landscape')) || false,
            expiresAt: order.expires_at
          }));
          setRecentOrders(formattedOrders);
        }

        // Process projects
        if (projectsResult.data) {
          const formattedProjects: Project[] = projectsResult.data.map(project => ({
            id: project.id,
            name: project.name,
            type: project.type,
            startDate: project.start_date,
            expectedHandover: project.expected_handover,
            currentPhase: project.current_phase,
            progress: project.progress,
            lastUpdate: `Project is currently in ${project.current_phase} phase`
          }));
          setActiveProjects(formattedProjects);
        }

        // Calculate stats
        const expiringCount = ordersResult.data?.filter(o => {
          if (!o.expires_at) return false;
          const hoursLeft = (new Date(o.expires_at).getTime() - Date.now()) / (1000 * 60 * 60);
          return hoursLeft < 24 && hoursLeft > 0;
        }).length || 0;

        const unreadCount = messagesResult.data?.reduce((sum, conv) => sum + (conv.unread_count || 0), 0) || 0;

        setStats({
          totalOrders: ordersResult.data?.length || 0,
          activeProjects: projectsResult.data?.length || 0,
          unreadMessages: unreadCount,
          expiringDownloads: expiringCount
        });

        // Process activity
        if (activityResult.data) {
          const formattedActivity: Activity[] = activityResult.data.map(notif => ({
            id: notif.id,
            type: notif.type as any,
            title: notif.title,
            description: notif.description,
            timestamp: formatTimeAgo(notif.created_at),
            link: notif.link || '/dashboard'
          }));
          setRecentActivity(formattedActivity);
        }

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up realtime subscriptions
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Subscribe to order changes
      const ordersChannel = supabase
        .channel('orders-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
          () => fetchDashboardData()
        )
        .subscribe();

      // Subscribe to project changes
      const projectsChannel = supabase
        .channel('projects-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${user.id}` },
          () => fetchDashboardData()
        )
        .subscribe();

      // Subscribe to notification changes
      const notificationsChannel = supabase
        .channel('notifications-changes')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          () => fetchDashboardData()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(ordersChannel);
        supabase.removeChannel(projectsChannel);
        supabase.removeChannel(notificationsChannel);
      };
    };

    const cleanup = setupRealtime();
    return () => {
      cleanup.then(fn => fn?.());
    };
  }, [supabase]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getTimeRemaining = (expiresAt: string) => {
    const hours = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h remaining`;
    return `${Math.ceil(hours / 24)} days remaining`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'download': return <Download className="w-4 h-4 text-tefetra" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-deep" />;
      case 'project': return <HardHat className="w-4 h-4 text-sage" />;
      case 'order': return <ShoppingBag className="w-4 h-4 text-tefetra" />;
      default: return <CheckCircle2 className="w-4 h-4 text-stone-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-tefetra" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-deep mb-2">Error</h2>
        <p className="text-stone-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-deep">
              Welcome back, <span className="text-tefetra">{userName}</span>
            </h1>
            <p className="text-stone-600 mt-2">
              Here's what's happening with your projects and orders.
            </p>
          </div>
          <Link 
            href="/products" 
            className="btn-primary whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Browse Plans
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-tefetra/10 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-tefetra" />
            </div>
            <span className="text-2xl font-bold text-deep">{stats.totalOrders}</span>
          </div>
          <p className="text-sm text-stone-600 mt-2">Total Orders</p>
        </div>

        <div className="glass rounded-xl p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-sage/10 rounded-lg">
              <HardHat className="w-5 h-5 text-sage" />
            </div>
            <span className="text-2xl font-bold text-deep">{stats.activeProjects}</span>
          </div>
          <p className="text-sm text-stone-600 mt-2">Active Projects</p>
        </div>

        <div className="glass rounded-xl p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-deep/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-deep" />
            </div>
            <span className="text-2xl font-bold text-deep">{stats.unreadMessages}</span>
          </div>
          <p className="text-sm text-stone-600 mt-2">Unread Messages</p>
        </div>

        <div className="glass rounded-xl p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-2xl font-bold text-deep">{stats.expiringDownloads}</span>
          </div>
          <p className="text-sm text-stone-600 mt-2">Expiring Soon</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Orders & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Orders with Upsells */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-deep">Recent Orders</h2>
              <Link href="/dashboard/orders" className="text-sm text-tefetra hover:text-tefetra-600 font-medium flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500">No orders yet</p>
                <Link href="/products" className="text-tefetra hover:underline mt-2 inline-block">
                  Browse our plans
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-deep">{order.productName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status === 'delivered' ? 'Delivered' : 'Processing'}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500 mt-1">
                          {order.category} • KES {order.price.toLocaleString()}
                        </p>
                        
                        {/* Files */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {order.files.map((file, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg text-xs text-stone-600">
                              <FileText className="w-3.5 h-3.5" />
                              {file}
                            </span>
                          ))}
                        </div>

                        {/* Expiry Warning */}
                        {order.expiresAt && new Date(order.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000 && (
                          <div className="flex items-center gap-2 mt-3 text-amber-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Download expires in {getTimeRemaining(order.expiresAt)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link 
                          href={`/dashboard/orders/${order.id}`}
                          className="btn-secondary text-sm py-2"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Files
                        </Link>
                      </div>
                    </div>

                    {/* Contextual Upsells - Only show relevant ones */}
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
                        Complete Your Project
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {!order.hasBOQ && (
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-tefetra/10 hover:bg-tefetra/20 text-tefetra rounded-lg text-sm font-medium transition-colors">
                            <Plus className="w-4 h-4" />
                            Add BOQ (+KES 8,000)
                          </button>
                        )}
                        {!order.hasInteriors && (
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-deep/10 hover:bg-deep/20 text-deep rounded-lg text-sm font-medium transition-colors">
                            <Plus className="w-4 h-4" />
                            Interior Design (+KES 15,000)
                          </button>
                        )}
                        {!order.hasLandscape && (
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-sage/10 hover:bg-sage/20 text-sage rounded-lg text-sm font-medium transition-colors">
                            <Plus className="w-4 h-4" />
                            Landscape Design (+KES 12,000)
                          </button>
                        )}
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-medium transition-colors">
                          <HardHat className="w-4 h-4" />
                          Construction Services
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-stone-100">
              <h2 className="text-lg font-bold text-deep">Recent Activity</h2>
            </div>
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                No recent activity
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {recentActivity.map((activity) => (
                  <Link 
                    key={activity.id}
                    href={activity.link}
                    className="flex items-start gap-4 p-4 hover:bg-stone-50 transition-colors"
                  >
                    <div className="p-2 bg-stone-100 rounded-lg mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-deep">{activity.title}</p>
                      <p className="text-sm text-stone-500 mt-0.5">{activity.description}</p>
                      <p className="text-xs text-stone-400 mt-1">{activity.timestamp}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Active Projects */}
        <div className="space-y-8">
          {/* Active Project Card */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-deep">Active Projects</h2>
              <Link href="/dashboard/projects" className="text-sm text-tefetra hover:text-tefetra-600 font-medium">
                View all
              </Link>
            </div>
            
            {activeProjects.length === 0 ? (
              <div className="p-8 text-center">
                <HardHat className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 mb-4">No active projects</p>
                <Link href="/dashboard/messages" className="btn-primary text-sm">
                  Start a Project
                </Link>
              </div>
            ) : (
              activeProjects.map((project) => (
                <div key={project.id} className="p-6 border-b border-stone-100 last:border-0">
                  <div className="aspect-video bg-gradient-to-br from-deep/20 to-sage/20 rounded-xl flex items-center justify-center mb-4">
                    <HardHat className="w-12 h-12 text-deep/40" />
                  </div>
                  
                  <h3 className="font-bold text-deep text-lg">{project.name}</h3>
                  <p className="text-sm text-stone-500">{project.type}</p>
                  
                  {/* Progress Tracker */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-medium text-deep">{project.currentPhase}</span>
                      <span className="text-stone-500">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-deep to-sage rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    
                    {/* Phase Indicators */}
                    <div className="flex justify-between mt-4 text-xs">
                      {['Consultation', 'Design', 'Approvals', 'Construction', 'Handover'].map((phase, idx) => {
                        const phases = ['Consultation', 'Design Finalization', 'Approvals', 'Construction', 'Handover'];
                        const currentIdx = phases.indexOf(project.currentPhase);
                        const isCompleted = idx < currentIdx;
                        const isCurrent = phase === project.currentPhase;
                        return (
                          <div key={phase} className="flex flex-col items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              isCompleted ? 'bg-sage' : isCurrent ? 'bg-tefetra animate-pulse' : 'bg-stone-300'
                            }`} />
                            <span className={`${isCurrent ? 'text-tefetra font-medium' : 'text-stone-400'}`}>
                              {phase === 'Design' ? 'Design...' : phase}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-stone-50 rounded-lg">
                    <p className="text-sm text-stone-600">
                      <span className="font-medium">Latest:</span> {project.lastUpdate}
                    </p>
                  </div>

                  <Link 
                    href={`/dashboard/projects/${project.id}`}
                    className="btn-primary w-full mt-4 text-sm"
                  >
                    View Project Details
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-deep mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/dashboard/messages" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 transition-colors">
                <div className="p-2 bg-deep/10 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-deep" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-deep">Message Tefetra</p>
                  <p className="text-xs text-stone-500">Get construction quote</p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </Link>
              
              <Link href="/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 transition-colors">
                <div className="p-2 bg-tefetra/10 rounded-lg">
                  <ShoppingBag className="w-4 h-4 text-tefetra" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-deep">Browse Plans</p>
                  <p className="text-xs text-stone-500">Explore new designs</p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}