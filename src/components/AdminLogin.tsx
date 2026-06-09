import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brutalist-black text-brutalist-grey font-sans flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] font-mono tracking-[0.3em] opacity-40 mb-3">CHHAY VIZUAL</p>
          <h1 className="text-6xl font-bold uppercase tracking-tighter leading-none">Admin<br />Access</h1>
        </div>

        {error && (
          <div className="border border-red-500/40 bg-red-500/10 text-red-400 px-4 py-3 text-sm font-mono mb-8">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-mono tracking-[0.3em] opacity-40 mb-3">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-0 py-3 bg-transparent border-b border-zinc-700 text-brutalist-grey placeholder-zinc-600 focus:outline-none focus:border-brutalist-grey transition-colors text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-[0.3em] opacity-40 mb-3">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-0 py-3 bg-transparent border-b border-zinc-700 text-brutalist-grey placeholder-zinc-600 focus:outline-none focus:border-brutalist-grey transition-colors text-sm"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brutalist-grey text-brutalist-black font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 disabled:opacity-40 transition-colors duration-150"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
