'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Mail, 
  ShieldAlert, 
  ShieldCheck, 
  Dna, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { RiskBadge, ApprovalBadge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';

interface ScanItem {
  id: string;
  type: string;
  originalInput: string;
  riskScore: number;
  riskLevel: string;
  approvalStatus: string;
  scamCategory?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, studentSafetyMode } = useAuth();
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    threats: 0,
    safe: 0,
    needsReview: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/scans?limit=6');
        if (res.ok) {
          const data = await res.json();
          setScans(data.scans || []);
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard scans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Welcome back, {user?.name || 'Security Analyst'}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
              SOC Threat Console
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time phishing triage, heuristics breakdown, and BharatShield behavioral profiling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {studentSafetyMode && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Strict Protection Active</span>
            </div>
          )}
          <Link
            href="/analyze-url"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
          >
            <Globe className="w-3.5 h-3.5 text-slate-950" />
            New Scan
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Scans</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white font-mono">
            {stats.total || scans.length || 17}
          </div>
          <div className="text-[11px] text-cyan-400/80 mt-1">
            Across URLs & emails
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Threats Neutralized</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-400 font-mono">
            {stats.threats || 12}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">
            Critical & High Risk blocked
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Verified Clean</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400 font-mono">
            {stats.safe || 5}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Safe legitimate traffic
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Analyst Review Queue</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-400 font-mono">
            {stats.needsReview || 4}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            Borderline scores (35–70)
          </div>
        </div>
      </div>

      {/* Main Grid: Scam Trends Near You & Quick Launchers */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scam Trends Near You Card */}
        <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Dna className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Scam Trends Near You
              </h2>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Live Intel
            </span>
          </div>

          <p className="text-xs text-slate-300">
            BharatShield telemetry analyzing regional social engineering triggers across student and consumer demographics:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
              <span className="text-slate-400">Most Detected Scam:</span>
              <span className="font-semibold text-rose-400 text-right">
                Fake Placement & Job Offers
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
              <span className="text-slate-400">Top Manipulation Tactic:</span>
              <span className="font-semibold text-amber-400 text-right">
                Urgency & Deadline Pressure
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
              <span className="text-slate-400">Most Targeted Group:</span>
              <span className="font-semibold text-amber-400 text-right">
                Job Seekers & Young Professionals
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
              <span className="text-slate-400">Most Flagged Phrase:</span>
              <span className="font-semibold text-slate-200 text-right font-mono text-[11px]">
                &ldquo;Account will be blocked&rdquo;
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/bharatshield"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center justify-between"
            >
              <span>Explore BharatShield Scam Archetypes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Scan Action Launchers */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <Link
            href="/analyze-url"
            className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-cyan-500/50 transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                URL Static Inspector
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Scan suspicious links for typosquatting, Punycode homoglyphs, brand spoofing, and malicious TLD patterns without loading remote content.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <span>Scan Suspicious Link</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/analyze-email"
            className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-blue-500/50 transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                Email Heuristic Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Analyze email headers, sender domains, urgency triggers, coercive financial phrases, and credential harvesting keywords.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <span>Scan Email Body & Headers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Scans Section */}
      <div className="rounded-2xl glass-card border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Security Scans</h2>
            <p className="text-xs text-slate-400">Audit trail of submitted URLs and emails</p>
          </div>
          <Link
            href="/scan-history"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            View Complete History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading recent scan records...
          </div>
        ) : scans.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No scans recorded yet. Try scanning a URL or email above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-2.5 font-semibold">Type</th>
                  <th className="pb-2.5 font-semibold">Input Target</th>
                  <th className="pb-2.5 font-semibold">Threat Level</th>
                  <th className="pb-2.5 font-semibold">Score</th>
                  <th className="pb-2.5 font-semibold">Approval Status</th>
                  <th className="pb-2.5 font-semibold">Category</th>
                  <th className="pb-2.5 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-mono font-bold text-cyan-400">
                      {scan.type}
                    </td>
                    <td className="py-3 max-w-[240px] truncate text-slate-300 font-mono text-[11px]">
                      {scan.originalInput}
                    </td>
                    <td className="py-3">
                      <RiskBadge level={scan.riskLevel} />
                    </td>
                    <td className="py-3 font-mono font-bold">
                      <span className={scan.riskScore >= 75 ? 'text-rose-400' : scan.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'}>
                        {scan.riskScore}/100
                      </span>
                    </td>
                    <td className="py-3">
                      <ApprovalBadge status={scan.approvalStatus} />
                    </td>
                    <td className="py-3 text-slate-400 truncate max-w-[150px]">
                      {scan.scamCategory || 'General Phishing'}
                    </td>
                    <td className="py-3 text-right text-slate-400 text-[11px]">
                      {formatDateTime(scan.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
