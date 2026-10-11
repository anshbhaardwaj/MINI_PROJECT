'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Globe, 
  Mail 
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { RiskBadge, ApprovalBadge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AdminScan {
  id: string;
  type: string;
  originalInput: string;
  riskScore: number;
  riskLevel: string;
  approvalStatus: string;
  needsReview: boolean;
  scamCategory?: string;
  scamNarrative?: string;
  audienceTarget?: string;
  metadata: string;
  threatIndicators: string;
  createdAt: string;
  user: { name: string; email: string };
  reviews?: Array<{
    id: string;
    decision: string;
    notes?: string;
    reviewer: { name: string; email: string };
    createdAt: string;
  }>;
}

interface AdminStats {
  pending: number;
  totalReviewed: number;
  verifiedThreats: number;
  falsePositives: number;
  approvedSafe: number;
  escalated: number;
  verifiedThreatRate: number;
  falsePositiveRate: number;
  totalScans: number;
}

export default function AdminReviewQueuePage() {
  const { user, login } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [scans, setScans] = useState<AdminScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('NEEDS_REVIEW');
  const [typeFilter, setTypeFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [selectedScan, setSelectedScan] = useState<AdminScan | null>(null);

  // Review decision form states
  const [decision, setDecision] = useState<'VERIFIED_THREAT' | 'FALSE_POSITIVE' | 'APPROVED_SAFE' | 'ESCALATED'>('VERIFIED_THREAT');
  const [finalClassification, setFinalClassification] = useState<'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL'>('CRITICAL');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // Fetch queue
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);
      if (riskFilter) params.append('riskLevel', riskFilter);

      const queueRes = await fetch(`/api/admin/queue?${params.toString()}`);
      if (queueRes.ok) {
        const queueData = await queueRes.json();
        setScans(queueData.scans || []);
      }
    } catch (err) {
      console.error('Failed to load admin queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (user?.role !== 'ADMIN') {
        // Yield to avoid synchronous setState within effect body
        await Promise.resolve();
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.ok && isMounted) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }

        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (typeFilter) params.append('type', typeFilter);
        if (riskFilter) params.append('riskLevel', riskFilter);

        const queueRes = await fetch(`/api/admin/queue?${params.toString()}`);
        if (queueRes.ok && isMounted) {
          const queueData = await queueRes.json();
          setScans(queueData.scans || []);
        }
      } catch (err) {
        console.error('Failed to load admin queue:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [user?.role, statusFilter, typeFilter, riskFilter]);

  const handleOpenReview = (scan: AdminScan) => {
    setSelectedScan(scan);
    // Pre-populate sensible defaults based on original score
    if (scan.riskScore >= 50) {
      setDecision('VERIFIED_THREAT');
      setFinalClassification(scan.riskScore >= 75 ? 'CRITICAL' : 'HIGH_RISK');
      setNotes('Confirmed active phishing signals during analyst triage inspection.');
    } else {
      setDecision('APPROVED_SAFE');
      setFinalClassification('SAFE');
      setNotes('No malicious payload verified; legitimate domain registration confirmed.');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScan) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scanId: selectedScan.id,
          decision,
          notes,
          finalClassification,
        }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (!res.ok) {
        toast.error(data.error || 'Failed to submit review');
        return;
      }

      toast.success('Analyst decision recorded');
      setSelectedScan(null);
      fetchQueue();
    } catch {
      setSubmitting(false);
      toast.error('Network error during review submission');
    }
  };

  // If user is not admin, show role elevation card
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <UserCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Security Analyst Access Required
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            The Admin Review Queue is an enterprise feature designed for authorized cyber analysts to triage borderline scans (scores 35–70), audit threat classifications, and verify false positives.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          Current session: <strong className="text-white">{user ? user.email : 'Guest'}</strong> (Role: {user ? user.role : 'None'})
        </div>

        <button
          onClick={async () => {
            const res = await login('admin@phishguard.ai', 'Admin@123');
            if (res.success) {
              toast.success('Switched to Admin Analyst');
            }
          }}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-600/20 transition inline-flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          1-Click Switch to Admin Analyst
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl glass-card border border-rose-500/30 bg-gradient-to-r from-rose-950/20 via-slate-900 to-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Enterprise Analyst Review Queue
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
              Human-in-the-Loop
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Borderline scans with scores between 35 and 70 are routed here for authorized verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Analyst: <strong className="text-white font-mono">{user.name}</strong>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Pending Triage</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-400 font-mono">
            {stats?.pending ?? 0}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Requiring decision</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Reviewed Scans</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white font-mono">
            {stats?.totalReviewed ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Audit log completed</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Verified Threat Rate</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-400 font-mono">
            {stats?.verifiedThreatRate ?? 0}%
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">Confirmed attacks</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>False Positive Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-blue-400 font-mono">
            {stats?.falsePositiveRate ?? 0}%
          </div>
          <div className="text-[11px] text-blue-400/80 mt-1">Rescued legitimate sites</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Filter Queue:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          >
            <option value="NEEDS_REVIEW">Needs Review (Pending)</option>
            <option value="ALL">All Approval States</option>
            <option value="VERIFIED_THREAT">Verified Threats</option>
            <option value="FALSE_POSITIVE">False Positives</option>
            <option value="APPROVED_SAFE">Approved Safe</option>
            <option value="ESCALATED">Escalated</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          >
            <option value="">All Types</option>
            <option value="URL">URLs Only</option>
            <option value="EMAIL">Emails Only</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH_RISK">High Risk</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="SAFE">Safe</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <strong>{scans.length}</strong> items in triage
        </div>
      </div>

      {/* Queue Table */}
      <div className="rounded-2xl glass-card border border-slate-800 p-5">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">
            Fetching triage records...
          </div>
        ) : scans.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-slate-300 font-semibold">Triage queue is currently clear!</p>
            <p className="text-slate-500 text-[11px]">All uncertain scans have been triaged or none match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Candidate Target</th>
                  <th className="pb-3 font-semibold">Auto Score</th>
                  <th className="pb-3 font-semibold">Risk Level</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Submitter</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                      {scan.type === 'URL' ? <Globe className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                      {scan.type}
                    </td>
                    <td className="py-3 max-w-[260px] truncate font-mono text-slate-300 text-[11px]">
                      {scan.originalInput}
                    </td>
                    <td className="py-3 font-mono font-bold">
                      <span className={scan.riskScore >= 75 ? 'text-rose-400' : scan.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'}>
                        {scan.riskScore}/100
                      </span>
                    </td>
                    <td className="py-3">
                      <RiskBadge level={scan.riskLevel} />
                    </td>
                    <td className="py-3">
                      <ApprovalBadge status={scan.approvalStatus} />
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {scan.user?.name || 'User'}
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {formatDateTime(scan.createdAt)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleOpenReview(scan)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition"
                      >
                        Triage & Decide
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Decision Drawer / Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b1120]">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-rose-400" />
                <span className="text-sm font-bold text-white">
                  Analyst Verification & Decision Panel
                </span>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Target info */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    Target Payload ({selectedScan.type}):
                  </span>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={selectedScan.riskLevel} />
                    <span className="text-xs font-mono font-bold text-white">
                      Score: {selectedScan.riskScore}/100
                    </span>
                  </div>
                </div>
                <div className="font-mono text-xs text-slate-200 break-all">
                  {selectedScan.originalInput}
                </div>
              </div>

              {selectedScan.scamNarrative && (
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300">
                  <strong className="text-emerald-400">BharatShield Narrative:</strong> {selectedScan.scamNarrative}
                </div>
              )}

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Analyst Decision Action
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setDecision('VERIFIED_THREAT');
                        setFinalClassification('CRITICAL');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition font-semibold ${
                        decision === 'VERIFIED_THREAT'
                          ? 'border-rose-500 bg-rose-950/30 text-rose-300 ring-1 ring-rose-500'
                          : 'border-slate-800 bg-slate-900 text-slate-300'
                      }`}
                    >
                      🛡️ Approve as Verified Threat
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDecision('FALSE_POSITIVE');
                        setFinalClassification('SAFE');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition font-semibold ${
                        decision === 'FALSE_POSITIVE'
                          ? 'border-blue-500 bg-blue-950/30 text-blue-300 ring-1 ring-blue-500'
                          : 'border-slate-800 bg-slate-900 text-slate-300'
                      }`}
                    >
                      ✓ Mark as False Positive
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDecision('APPROVED_SAFE');
                        setFinalClassification('SAFE');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition font-semibold ${
                        decision === 'APPROVED_SAFE'
                          ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 ring-1 ring-emerald-500'
                          : 'border-slate-800 bg-slate-900 text-slate-300'
                      }`}
                    >
                      🟢 Mark as Safe
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDecision('ESCALATED');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition font-semibold ${
                        decision === 'ESCALATED'
                          ? 'border-purple-500 bg-purple-950/30 text-purple-300 ring-1 ring-purple-500'
                          : 'border-slate-800 bg-slate-900 text-slate-300'
                      }`}
                    >
                      ⚡ Escalate for Senior Triage
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Final Approved Risk Classification
                    </label>
                    <select
                      value={finalClassification}
                      onChange={(e) => setFinalClassification(e.target.value as 'CRITICAL' | 'HIGH_RISK' | 'SUSPICIOUS' | 'SAFE')}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    >
                      <option value="CRITICAL">CRITICAL (Active Danger)</option>
                      <option value="HIGH_RISK">HIGH_RISK</option>
                      <option value="SUSPICIOUS">SUSPICIOUS</option>
                      <option value="SAFE">SAFE (Verified Clean)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Reviewing Analyst
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`${user.name} (${user.role})`}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Analyst Notes & Forensic Rationale
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter audit notes (e.g. Typosquat domain verified, credentials targeted)..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedScan(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition shadow-lg shadow-rose-600/20"
                  >
                    {submitting ? 'Submitting...' : 'Commit Approval Decision'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
