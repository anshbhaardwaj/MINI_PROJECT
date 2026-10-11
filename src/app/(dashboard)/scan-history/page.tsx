'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Mail, 
  X, 
  Dna 
} from 'lucide-react';
import { RiskBadge, ApprovalBadge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';

interface ScanItem {
  id: string;
  type: string;
  originalInput: string;
  riskScore: number;
  riskLevel: string;
  approvalStatus: string;
  metadata: string;
  threatIndicators: string;
  recommendations: string;
  scamCategory?: string;
  scamNarrative?: string;
  audienceTarget?: string;
  createdAt: string;
}

export default function ScanHistoryPage() {
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedScan, setSelectedScan] = useState<ScanItem | null>(null);

  useEffect(() => {
    async function fetchScans() {
      try {
        const res = await fetch('/api/scans');
        if (res.ok) {
          const data = await res.json();
          setScans(data.scans || []);
        }
      } catch (err) {
        console.error('Failed to load scan history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchScans();
  }, []);

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.originalInput.toLowerCase().includes(search.toLowerCase()) ||
      (scan.scamCategory && scan.scamCategory.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || scan.type === typeFilter;
    const matchesRisk = riskFilter === 'ALL' || scan.riskLevel === riskFilter;

    return matchesSearch && matchesType && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Scan History & Audit Log
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Audit Trail
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical threat scans, approval lifecycle statuses, and forensic breakdown logs.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Total Logs: <strong className="text-white">{scans.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search targets or categories..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="URL">URLs Only</option>
            <option value="EMAIL">Emails Only</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH_RISK">High Risk</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="SAFE">Safe</option>
          </select>
        </div>
      </div>

      {/* Scans List / Table */}
      <div className="rounded-2xl glass-card border border-slate-800 p-5">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">
            Loading historical scans...
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No scans match your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Candidate Payload</th>
                  <th className="pb-3 font-semibold">Risk Level</th>
                  <th className="pb-3 font-semibold">Threat Score</th>
                  <th className="pb-3 font-semibold">Approval State</th>
                  <th className="pb-3 font-semibold">Scam DNA</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredScans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-slate-800/40 transition cursor-pointer"
                    onClick={() => setSelectedScan(scan)}
                  >
                    <td className="py-3 font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                      {scan.type === 'URL' ? <Globe className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                      {scan.type}
                    </td>
                    <td className="py-3 max-w-[260px] truncate font-mono text-slate-300 text-[11px]">
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
                    <td className="py-3 text-slate-400 text-[11px]">
                      {formatDateTime(scan.createdAt)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedScan(scan);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Inspection Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b1120]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                  {selectedScan.type} SCAN
                </span>
                <span className="text-sm font-bold text-white">Forensic Threat Record</span>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiskBadge level={selectedScan.riskLevel} />
                  <ApprovalBadge status={selectedScan.approvalStatus} />
                </div>
                <div className="text-right font-mono text-xs text-slate-400">
                  Score: <strong className="text-white text-sm">{selectedScan.riskScore}/100</strong>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Candidate Payload:</span>
                <div className="mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 break-all">
                  {selectedScan.originalInput}
                </div>
              </div>

              {selectedScan.scamNarrative && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Dna className="w-4 h-4" />
                    BharatShield™ Scam Narrative
                  </div>
                  <div className="text-xs font-semibold text-white">
                    Category: {selectedScan.scamCategory || 'Phishing Tactic'}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedScan.scamNarrative}
                  </p>
                </div>
              )}

              <div className="text-xs text-slate-400">
                Created: {formatDateTime(selectedScan.createdAt)}
              </div>
            </div>

            <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-[#0b1120]">
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
