'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Globe, 
  Mail, 
  History, 
  Dna, 
  BarChart3, 
  UserCheck, 
  Settings, 
  Layers, 
  ShieldCheck, 
  Shield, 
  LogOut,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ArchitectureModal } from '@/components/modals/ArchitectureModal';
import { WhyBharatShieldModal } from '@/components/modals/WhyBharatShieldModal';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout, studentSafetyMode, setStudentSafetyMode } = useAuth();
  const [showArchModal, setShowArchModal] = useState(false);
  const [showBharatModal, setShowBharatModal] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'SOC Overview', icon: LayoutDashboard },
    { href: '/analyze-url', label: 'URL Scanner', icon: Globe },
    { href: '/analyze-email', label: 'Email Analyzer', icon: Mail },
    { href: '/scan-history', label: 'Threat Telemetry', icon: History },
    { href: '/bharatshield', label: 'BharatShield™ DNA', icon: Dna, highlight: true },
    { href: '/analytics', label: 'Attack Radar', icon: BarChart3 },
    { 
      href: '/admin', 
      label: 'Analyst Triage Queue', 
      icon: UserCheck, 
      adminOnly: true,
      badge: 'Review' 
    },
    { href: '/settings', label: 'Preferences', icon: Settings },
  ];

  return (
    <>
      <aside className="w-64 border-r border-white/[0.08] bg-[#0a0d14] flex flex-col shrink-0 min-h-screen">
        {/* Brand */}
        <div className="p-5 border-b border-white/[0.08] flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold">
              <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                PhishGuard <span className="text-amber-400 font-mono text-[10px] px-1 py-0.2 rounded bg-amber-400/10 border border-amber-400/20">PRO</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Threat Defense Platform
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Security Operations
          </div>

          {navLinks.map((link) => {
            if (link.adminOnly && user?.role !== 'ADMIN') return null;

            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-amber-400'
                        : link.highlight
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Architecture & Briefings
          </div>

          <button
            onClick={() => setShowArchModal(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition text-left"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Pipeline Architecture</span>
          </button>

          <button
            onClick={() => setShowBharatModal(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition text-left"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Why BharatShield?</span>
          </button>
        </div>

        {/* Protection Mode Toggle */}
        <div className="p-3 m-3 rounded-2xl bg-slate-900/90 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Shield className="w-4 h-4 text-amber-400" />
              Protection Shield
            </div>
            <button
              onClick={() => setStudentSafetyMode(!studentSafetyMode)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                studentSafetyMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {studentSafetyMode ? 'Active' : 'Muted'}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Enhanced heuristics for financial lures, fake recruitment drives, and credential grabs.
          </p>
        </div>

        {/* User Session */}
        <div className="p-3 border-t border-white/[0.08] bg-[#070a10]">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-xs font-bold text-slate-950 shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate font-mono">
                    {user.role}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition shadow-md shadow-amber-500/20"
            >
              Sign In to Save Scans
            </Link>
          )}
        </div>
      </aside>

      <ArchitectureModal isOpen={showArchModal} onClose={() => setShowArchModal(false)} />
      <WhyBharatShieldModal isOpen={showBharatModal} onClose={() => setShowBharatModal(false)} />
    </>
  );
}
