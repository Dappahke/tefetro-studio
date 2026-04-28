'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from "@/lib/supabase";
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

const supabaseClient = createBrowserClient();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setRole(profile?.role || 'user');
      }
      
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          setRole(profile?.role || 'user');
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, role, loading };
}