'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, PhoneCall, ExternalLink, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#07090e] text-slate-400 text-xs mt-auto relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-wide">
                PhishGuard <span className="text-amber-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous phishing detection, brand impersonation interception, and BharatShield™ cognitive fraud DNA profiling.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Air-Gapped Zero-Execution Guarantee
              </span>
            </div>
          </div>

          {/* Core Engines */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Security Engines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/analyze-url" className="hover:text-amber-400 transition">
                  Static Lexical Heuristic Engine
                </Link>
              </li>
              <li>
                <Link href="/analyze-email" className="hover:text-amber-400 transition">
                  Social Engineering & Urgency Parser
                </Link>
              </li>
              <li>
                <Link href="/bharatshield" className="hover:text-amber-400 transition">
                  BharatShield™ Scam DNA Explorer
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-amber-400 transition">
                  Enterprise Attack Radar & Telemetry
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Safety Notice */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Incident Response Directives
            </h4>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <PhoneCall className="w-3.5 h-3.5" />
                Cyber Helpline: 1930
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Report financial cyber fraud immediately within the golden hour to freeze illicit recipient accounts.
              </p>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline font-semibold"
              >
                cybercrime.gov.in <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Compliance & Standards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Standards & Compliance
            </h4>
            <div className="text-xs space-y-1.5 text-slate-300">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Enterprise Security Baseline
              </p>
              <p className="text-slate-400">Architected for ISO-27001 & SOC-2 Alignment</p>
              <p className="text-slate-400">NIST SP 800-61 Computer Security Incident Handling</p>
              <p className="text-[11px] text-slate-500 font-mono pt-1">
                Engine: v4.2 Production Release
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 PhishGuard AI Systems. All rights reserved. Production Threat Defense Platform.</p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Global Cluster Status: Operational
          </p>
        </div>
      </div>
    </footer>
  );
}
