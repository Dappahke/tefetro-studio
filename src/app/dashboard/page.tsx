// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PaymentSummary } from '@/components/dashboard/PaymentSummary';
import { ProjectList } from '@/components/dashboard/ProjectList';
import ChatPanel from '@/components/dashboard/ChatPanel';

// Define the order type
interface DashboardOrder {
  id: string;
  status: string;
  expires_at: string | null;
}

export default function DashboardOverview() {
  const [userName, setUserName] = useState<string>('Client');
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeProjects: 0,
    unreadMessages: 0,
    expiringDownloads: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        setUserName(user.email?.split('@')[0] || 'Client');

        const { data: orders } = await supabase
          .from('orders')
          .select('id, status, expires_at')
          .eq('user_id', user.id);

        const expiringCount = orders?.filter((o: DashboardOrder) => {
          if (!o.expires_at) return false;
          const hoursLeft = (new Date(o.expires_at).getTime() - Date.now()) / (1000 * 60 * 60);
          return hoursLeft < 24 && hoursLeft > 0;
        }).length || 0;

        setStats({
          totalOrders: orders?.length || 0,
          activeProjects: 0,
          unreadMessages: 0,
          expiringDownloads: expiringCount
        });
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#F28C00]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 border border-[#0F4C5C]/10">
        <h1 className="text-2xl font-bold text-[#0F4C5C]">
          Welcome back, <span className="text-[#F28C00]">{userName}</span>
        </h1>
        <p className="text-[#1E1E1E]/60 mt-2">Here's what's happening with your projects and orders.</p>
      </div>

      <PaymentSummary
        total={0}
        paid={0}
        currency="KES"
      />
      
      <div className="grid lg:grid-cols-2 gap-8">
        <ProjectList orders={[]} />
        <ChatPanel projectId={''} />
      </div>
    </div>
  );
}