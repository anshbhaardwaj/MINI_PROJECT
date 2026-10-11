'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Successfully signed in');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
  };

  const fillCredentials = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    const result = await login(demoEmail, demoPass);
    setLoading(false);

    if (result.success) {
      toast.success(`Signed in as ${demoEmail.includes('admin') ? 'Security Analyst' : 'Standard User'}`);
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-[#090c13] bg-enterprise-mesh relative">
      {/* Background warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Sign in to PhishGuard AI
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Enterprise Cognitive Threat Defense & SOC Console
          </p>
        </div>

        {/* 1-Click Fast Credentials Buttons */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.08] shadow-xl space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            1-Click Credentials (Instant Access)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => fillCredentials('demo@phishguard.ai', 'Demo@123')}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-850 hover:bg-slate-800 text-slate-200 border border-white/[0.08] transition text-center"
            >
              <div className="font-bold text-amber-300">Standard User</div>
              <div className="text-[10px] text-slate-400 font-mono">demo@phishguard.ai</div>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => fillCredentials('admin@phishguard.ai', 'Admin@123')}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-500/30 transition text-center"
            >
              <div className="font-bold flex items-center justify-center gap-1 text-amber-300">
                <UserCheck className="w-3 h-3 text-amber-400" /> SOC Lead (Admin)
              </div>
              <div className="text-[10px] text-amber-400/80 font-mono">admin@phishguard.ai</div>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-6 rounded-2xl glass-card border border-white/[0.08] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@domain.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  Sign In to Console
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/[0.06] text-center text-xs text-slate-400">
            Don&apos;t have an enterprise account?{' '}
            <Link href="/register" className="text-amber-400 hover:underline font-semibold">
              Create account
            </Link>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">
            ← Return to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
