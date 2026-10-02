import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import AdminLogin from '../components/AdminLogin';
import { useMeta } from '../hooks/useMeta';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminPage() {
  useMeta(null, { noindex: true });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="text-white text-center py-12">Loading...</div>;
  }

  return session ? <AdminDashboard /> : <AdminLogin />;
}
