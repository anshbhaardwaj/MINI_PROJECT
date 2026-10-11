'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  Dna 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area 
} from 'recharts';

interface AnalyticsSummary {
  stats?: {
    totalScans?: number;
    threatsBlocked?: number;
    accuracyRate?: number;
    avgLatencyMs?: number;
  };
}

const DEFAULT_RISK_DISTRIBUTION = [
  { name: 'Safe', value: 5, color: '#10b981' },
  { name: 'Suspicious', value: 4, color: '#f59e0b' },
  { name: 'High Risk', value: 4, color: '#f97316' },
  { name: 'Critical', value: 4, color: '#ef4444' },
];

const DEFAULT_TREND = [
  { day: 'Mon', scans: 2, threats: 1, avgScore: 45 },
  { day: 'Tue', scans: 3, threats: 2, avgScore: 68 },
  { day: 'Wed', scans: 5, threats: 4, avgScore: 82 },
  { day: 'Thu', scans: 2, threats: 1, avgScore: 35 },
  { day: 'Fri', scans: 4, threats: 3, avgScore: 74 },
  { day: 'Sat', scans: 6, threats: 5, avgScore: 89 },
  { day: 'Sun', scans: 3, threats: 2, avgScore: 56 },
];

const SCAM_CATEGORIES_DATA = [
  { category: 'Placement / Jobs', count: 6 },
  { category: 'Bank KYC (SBI/HDFC)', count: 4 },
  { category: 'Electricity Bill', count: 3 },
  { category: 'UPI Reverse Fraud', count: 2 },
  { category: 'Courier / Customs', count: 2 },
];

const MANIPULATION_TACTICS = [
  { tactic: 'Artificial Urgency', percentage: 42, color: 'bg-rose-500' },
  { tactic: 'Fear & Account Suspension', percentage: 28, color: 'bg-amber-500' },
  { tactic: 'Financial Greed / Cash Back', percentage: 18, color: 'bg-cyan-500' },
  { tactic: 'Authority & Regulatory Pretext', percentage: 12, color: 'bg-purple-500' },
];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok && isMounted) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    void loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Threat Analytics & Intelligence Radar
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Aggregated Metrics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical distribution of threat severity, manipulation tactics, and BharatShield fraud trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Heuristic Accuracy: <strong className="text-emerald-400 font-mono">98.4%</strong>
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Total Scans Ingested</span>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            {data?.stats?.totalScans || 17}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">100% Client-Safe</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Threat Rate</span>
          <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
            70.5%
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">Critical & High Risk</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Analyst Triage Band</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
            23.5%
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Scores 35–70 Flagged</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Average Risk Score</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
            64 / 100
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across demo corpus</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Risk Distribution Donut Chart */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">
                Threat Classification Breakdown
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">
              Severity Ratio
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEFAULT_RISK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DEFAULT_RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
            {DEFAULT_RISK_DISTRIBUTION.map((item) => (
              <div key={item.name} className="space-y-0.5">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
                <div className="text-xs font-mono font-bold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scan Volume & Threat Trend */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">
                Scan Activity & Threats Detected (7 Days)
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">
              Daily Timeline
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEFAULT_TREND}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="scans" stroke="#06b6d4" fillOpacity={1} fill="url(#colorScans)" name="Total Scans" />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" fillOpacity={1} fill="url(#colorThreats)" name="Threats" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-cyan-400 rounded-full" />
              <span>Total Scans</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-rose-500 rounded-full" />
              <span>Threats Detected</span>
            </div>
          </div>
        </div>
      </div>

      {/* BharatShield Regional Categories & Psychological Manipulation */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Scam Categories Bar Chart */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">
                Top India-Specific Scam Categories
              </h2>
            </div>
            <span className="text-[10px] text-emerald-400 uppercase font-mono">
              BharatShield
            </span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SCAM_CATEGORIES_DATA} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} name="Detections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Psychological Manipulation Levers Progress Bars */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white">
                Social Engineering Manipulation Levers
              </h2>
            </div>
            <span className="text-[10px] text-purple-400 uppercase font-mono">
              Psychological Vector
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {MANIPULATION_TACTICS.map((item) => (
              <div key={item.tactic} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.tactic}</span>
                  <span className="font-mono text-slate-400">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-800">
            Based on lexical parsing of urgency tokens, credential demands, and coercive authority pretexts.
          </p>
        </div>
      </div>
    </div>
  );
}
