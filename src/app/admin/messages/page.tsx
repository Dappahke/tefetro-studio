// src/app/admin/messages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, Users, Clock, CheckCircle } from 'lucide-react';

interface Conversation {
  id: string;
  user_id: string;
  user_email?: string;
  name: string;
  type: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          user:user_id (
            email
          )
        `)
        .order('last_message_time', { ascending: false });

      if (error) {
        console.error('Error:', error);
        return;
      }

      const formatted = (data || []).map((conv: any) => ({
        ...conv,
        user_email: conv.user?.email
      }));

      setConversations(formatted);
      setLoading(false);
    };

    fetchConversations();

    // Subscribe to new conversations
    const channel = supabase
      .channel('admin-conversations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations' },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const stats = {
    total: conversations.length,
    active: conversations.filter(c => new Date(c.last_message_time) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    unread: conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0)
  };

  if (loading) {
    return <div className="p-8 text-center">Loading conversations...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-deep">Customer Messages</h1>
        <p className="text-stone-600 mt-1">Manage all customer conversations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm">Total Conversations</p>
              <p className="text-2xl font-bold text-deep">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-tefetra/30" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm">Active This Week</p>
              <p className="text-2xl font-bold text-deep">{stats.active}</p>
            </div>
            <Clock className="w-8 h-8 text-tefetra/30" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm">Unread Messages</p>
              <p className="text-2xl font-bold text-deep">{stats.unread}</p>
            </div>
            <Users className="w-8 h-8 text-tefetra/30" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left p-4 font-semibold text-deep">Customer</th>
                <th className="text-left p-4 font-semibold text-deep">Type</th>
                <th className="text-left p-4 font-semibold text-deep">Last Message</th>
                <th className="text-left p-4 font-semibold text-deep">Time</th>
                <th className="text-center p-4 font-semibold text-deep">Status</th>
                <th className="text-center p-4 font-semibold text-deep">Action</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((conv) => (
                <tr key={conv.id} className="border-b border-stone-100 hover:bg-stone-50 transition">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-deep">{conv.name}</p>
                      <p className="text-xs text-stone-500">{conv.user_email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      conv.type === 'project' ? 'bg-blue-100 text-blue-700' :
                      conv.type === 'order' ? 'bg-green-100 text-green-700' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {conv.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-stone-600 max-w-xs truncate">
                      {conv.last_message || 'No messages yet'}
                    </p>
                  </td>
                  <td className="p-4 text-sm text-stone-500">
                    {new Date(conv.last_message_time).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    {conv.unread_count > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-tefetra/10 text-tefetra rounded-full text-xs font-medium">
                        <MessageSquare className="w-3 h-3" />
                        {conv.unread_count} unread
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Read
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <a
                      href={`/admin/messages/${conv.id}`}
                      className="text-tefetra hover:underline text-sm font-medium"
                    >
                      Reply →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}