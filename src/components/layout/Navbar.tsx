'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Layers, 
  Dna, 
  LogOut, 
  LayoutDashboard, 
  Shield, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ArchitectureModal } from '@/components/modals/ArchitectureModal';
import { WhyBharatShieldModal } from '@/components/modals/WhyBharatShieldModal';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, studentSafetyMode, setStudentSafetyMode } = useAuth();
  const [showArchModal, setShowArchModal] = useState(false);
  const [showBharatModal, setShowBharatModal] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090c13]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo with classy Champagne & Amber glow */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative p-2 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform font-bold">
              <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                PhishGuard <span className="text-amber-400 font-mono text-xs px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">PRO</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Enterprise Cognitive Threat Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wide">
            <Link
              href="/analyze-url"
              className={`transition hover:text-amber-400 ${
                pathname === '/analyze-url' ? 'text-amber-400 font-bold' : 'text-slate-300'
              }`}
            >
              URL Scanner
            </Link>
            <Link
              href="/analyze-email"
              className={`transition hover:text-amber-400 ${
                pathname === '/analyze-email' ? 'text-amber-400 font-bold' : 'text-slate-300'
              }`}
            >
              Email Scanner
            </Link>
            <Link
              href="/bharatshield"
              className={`transition hover:text-amber-400 flex items-center gap-1.5 ${
                pathname === '/bharatshield' ? 'text-amber-400 font-bold' : 'text-slate-300'
              }`}
            >
              <Dna className="w-4 h-4 text-amber-400" />
              BharatShield™ DNA
            </Link>

            {/* Architecture Modal Trigger */}
            <button
              onClick={() => setShowArchModal(true)}
              className="text-slate-300 hover:text-amber-400 flex items-center gap-1.5 transition"
            >
              <Layers className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              System Architecture
            </button>

            {/* Why Different Modal Trigger */}
            <button
              onClick={() => setShowBharatModal(true)}
              className="text-amber-300 hover:text-white px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 transition text-[11px] font-bold"
            >
              Why BharatShield?
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Protection Mode Toggle */}
            <button
              onClick={() => setStudentSafetyMode(!studentSafetyMode)}
              title="Toggle Strict Social Engineering Protection"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                studentSafetyMode
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Strict Mode: {studentSafetyMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* User Session */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-slate-900/90 hover:border-amber-500/40 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-[11px] font-bold text-slate-950">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                    {user.name.split(' ')[0]}
                  </span>
                  {user.role === 'ADMIN' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono border border-rose-500/30">
                      SOC LEAD
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 text-xs z-50 animate-in fade-in"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3.5 py-2.5 border-b border-slate-800">
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-[11px] text-slate-400 truncate font-mono">{user.email}</div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-slate-200 hover:bg-slate-800 transition"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                      SOC Dashboard
                    </Link>
                    <Link
                      href="/scan-history"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-slate-200 hover:bg-slate-800 transition"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      Telemetry History
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-400 hover:bg-slate-800 transition text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <ArchitectureModal isOpen={showArchModal} onClose={() => setShowArchModal(false)} />
      <WhyBharatShieldModal isOpen={showBharatModal} onClose={() => setShowBharatModal(false)} />
    </>
  );
}
