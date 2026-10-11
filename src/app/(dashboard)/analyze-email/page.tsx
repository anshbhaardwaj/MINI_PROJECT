'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Dna, 
  Download, 
  Sparkles, 
  PhoneCall, 
  ChevronDown, 
  SlidersHorizontal,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { RiskBadge, ApprovalBadge } from '@/components/ui/Badge';
import { Tilt3DCard } from '@/components/ui/Tilt3DCard';
import { CyberRadarHUD } from '@/components/ui/CyberRadarHUD';
import toast from 'react-hot-toast';

interface ThreatIndicator {
  id: string;
  name: string;
  description: string;
  severity: string;
  weight: number;
}

interface EmailScanResult {
  id: string;
  originalInput: string;
  riskScore: number;
  riskLevel: string;
  approvalStatus: string;
  needsReview: boolean;
  metadata: {
    sender: string;
    subject: string;
    senderDomain: string;
    bodyLength: number;
    hasHeaders: boolean;
  };
  threatIndicators: ThreatIndicator[];
  recommendations: string[];
  scamCategory?: string;
  scamNarrative?: string;
  audienceTarget?: string;
}

const EMAIL_PRESETS = [
  {
    name: '🟢 Safe Email: University Notice',
    sender: 'controller.examinations@university.edu.in',
    subject: 'Official Notification: Semester Examination Schedule',
    body: `Dear Students,\n\nThe semester examination schedule for all undergraduate programs is now published on the official student portal.\n\nPlease visit the official portal to review your timings. No fees are required to access your datesheet.\n\nAcademic Office`,
    tag: 'Safe'
  },
  {
    name: '🔴 Fake Placement Fee Scam',
    sender: 'recruitment-drive-tcs@gmail-jobportal.online',
    subject: 'URGENT: Shortlisted for Tech Campus Placement - Registration Fee Required',
    body: `Dear Student,\n\nCongratulations! Based on your profile, you have been selected for the Joint Campus Recruitment Interview scheduled for tomorrow.\n\nTo confirm your slot, you must pay a mandatory background verification and seat reservation fee of Rs. 2,499/- TODAY before 5:00 PM. Failure to pay will result in immediate disqualification.\n\nClick here to pay and submit your Aadhaar number: http://tcs-campus-portal-verification.top/pay\n\nRegards,\nCampus Recruitment Cell`,
    tag: 'Phishing'
  },
  {
    name: '⚠️ Electricity Cutoff Tonight',
    sender: 'power-support@state-electricity-bill-alert.xyz',
    subject: 'FINAL WARNING: Electricity will be disconnected tonight at 9:30 PM',
    body: `Dear Consumer,\n\nYour electricity power connection will be cut off tonight at 9:30 PM from the sub-station because previous month bill was not updated.\n\nImmediately call our power officer on 9876543210 or pay your bill immediately to avoid blackout.\n\nElectricity Department`,
    tag: 'Urgency Scam'
  },
  {
    name: '🛑 SBI Account Block Threat',
    sender: 'security-alert@onlinesbi-service-update.top',
    subject: 'Alert: Your SBI NetBanking Account Has Been Blocked due to Pending KYC',
    body: `Dear SBI Customer,\n\nYour net banking facility has been temporarily suspended due to pending PAN and Aadhaar card re-verification.\n\nClick here http://onlinesbi-pan-kyc-update.com/netbanking/login.php to verify your password and OTP within 24 hours to avoid permanent closure.\n\nState Bank Security`,
    tag: 'Banking Fraud'
  }
];

export default function AnalyzeEmailPage() {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState('');
  const [showHeaders, setShowHeaders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailScanResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const performScan = async (s: string, sub: string, b: string, h?: string) => {
    if (!s.trim() || !sub.trim() || !b.trim()) {
      toast.error('Sender, subject, and body are all required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/analyze/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: s.trim(),
          subject: sub.trim(),
          body: b.trim(),
          headers: h?.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Analysis failed');
      }

      const data = await res.json();
      setResult(data.scan);
      toast.success('Inspection complete!');
    } catch {
      toast.error('Scan failed. Please verify the fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    void performScan(sender, subject, body, headers);
  };

  const handlePresetSelect = (preset: typeof EMAIL_PRESETS[0]) => {
    setSender(preset.sender);
    setSubject(preset.subject);
    setBody(preset.body);
    void performScan(preset.sender, preset.subject, preset.body);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Sender: ${result.metadata.sender}\nSubject: ${result.metadata.subject}\nScore: ${result.riskScore}/100`);
    setCopied(true);
    toast.success('Summary copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const reportText = `=========================================
PHISHGUARD AI — EMAIL THREAT REPORT
=========================================
Sender: ${result.metadata.sender}
Subject: ${result.metadata.subject}
Score: ${result.riskScore} / 100
Classification: ${result.riskLevel}
Approval Status: ${result.approvalStatus}
Scam Category: ${result.scamCategory || 'None Detected'}

THREAT INDICATORS:
${result.threatIndicators.map(t => `- [${t.severity.toUpperCase()}] ${t.name}: ${t.description}`).join('\n')}

SAFETY RECOMMENDATIONS:
${result.recommendations.map(r => `* ${r}`).join('\n')}

National Cybercrime Helpline: 1930
=========================================`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `PhishGuard-Email-Scan-${result.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    toast.success('Report downloaded');
  };

  const isSafe = result && result.riskScore < 35;
  const isSuspicious = result && result.riskScore >= 35 && result.riskScore < 65;
  const isDangerous = result && result.riskScore >= 65;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Friendly Header */}
      <div className="p-6 rounded-3xl glass-card border border-white/[0.08] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Mail className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Email Phishing Inspector
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Static Analysis
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Inspect suspicious emails for urgent pressure tactics, spoofed sender domains, fake job fees, and credential harvesters.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-white/[0.06] text-xs text-slate-300 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Air-gapped static inspection</span>
          </div>
        </div>
      </div>

      {/* Main Email Input Form */}
      <div className="p-6 rounded-3xl glass-card border border-white/[0.08] space-y-4">
        {/* Quick Example Chips */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-white/[0.06]">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Try an Example Email:
          </span>
          {EMAIL_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-900/70 border border-white/[0.08] hover:border-amber-500/40 text-slate-300 hover:text-white transition cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleScan} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Sender Email Address:
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. support@service-portal.xyz"
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/[0.12] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Subject Line:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. URGENT: Action required within 24 hours"
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/[0.12] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Body Content:
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Paste email text or message content here..."
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/[0.12] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition resize-y"
            />
          </div>

          {/* Optional Raw Headers Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowHeaders(!showHeaders)}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition cursor-pointer"
            >
              <span>{showHeaders ? 'Hide' : 'Add'} optional email headers (SPF, DKIM, Received)</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHeaders ? 'rotate-180' : ''}`} />
            </button>

            {showHeaders && (
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                rows={3}
                placeholder="Paste raw email headers (optional)..."
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/[0.12] text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                Inspecting Email...
              </span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Analyze Email Now
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Big Prominent Verdict Banner */}
          <div className={`p-6 rounded-3xl border ${
            isSafe 
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' 
              : isDangerous
              ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          } flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl`}>
            <div className="flex items-start sm:items-center gap-4">
              <div className={`p-3.5 rounded-2xl ${
                isSafe 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : isDangerous
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-amber-500/20 text-amber-400'
              } shrink-0`}>
                {isSafe ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : isDangerous ? (
                  <AlertTriangle className="w-8 h-8" />
                ) : (
                  <AlertTriangle className="w-8 h-8" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                    {isSafe && '✅ VERIFIED SAFE (Surakshit Email)'}
                    {isDangerous && '🛑 DANGEROUS PHISHING (Khatarnaak Email)'}
                    {isSuspicious && '⚠️ SUSPICIOUS EMAIL (Savdhaan Rahein)'}
                  </h2>
                  <RiskBadge level={result.riskLevel} />
                </div>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {isSafe && 'No malicious requests, fake fees, or urgent extortion detected. Normal business communication.'}
                  {isDangerous && 'DO NOT REPLY OR CLICK ANY LINKS! This email attempts extortion, password theft, or financial fraud.'}
                  {isSuspicious && 'Exercise caution. This email contains pressure tactics or an unverified sender address.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.08] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Summary
              </button>
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download Report
              </button>
            </div>
          </div>

          {/* Simple Explanation & Recommendations Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Plain-Language Explanation */}
            <div className="p-6 rounded-3xl glass-card border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Plain-Language Summary (Saral Bhasha Mein)
                </h3>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/[0.06]">
                  <span className="text-xs text-slate-400 block mb-0.5">Sender:</span>
                  <span className="font-mono text-white text-xs break-all">{result.metadata.sender}</span>
                </div>

                {result.scamCategory && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <strong className="block text-xs uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1">
                      <Dna className="w-3.5 h-3.5" />
                      Detected Fraud Vector:
                    </strong>
                    {result.scamCategory} — {result.scamNarrative}
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Key Red Flags Detected:
                  </span>
                  {result.threatIndicators.length === 0 ? (
                    <p className="text-xs text-emerald-400">
                      ✓ No suspicious payment demands, urgency triggers, or lookalike domain issues found.
                    </p>
                  ) : (
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {result.threatIndicators.slice(0, 3).map((ind, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold shrink-0">•</span>
                          <span><strong>{ind.name}:</strong> {ind.description}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* What to Do Next */}
            <div className="p-6 rounded-3xl glass-card border border-white/[0.08] space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    What Should You Do? (Kya Karein?)
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 mt-3">
                  {result.recommendations.slice(0, 3).map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency Hotline */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/20 to-slate-900 border border-amber-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Cyber Financial Fraud Helpline</span>
                    <strong className="text-white text-sm font-mono">1930</strong>
                  </div>
                </div>

                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs flex items-center gap-1 hover:bg-amber-400 transition"
                >
                  cybercrime.gov.in
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Collapsible Deep Telemetry */}
          <div className="rounded-3xl glass-card border border-white/[0.08] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">
                  SOC Analyst Telemetry & Signal Breakdown (Click to {showTechnicalDetails ? 'Collapse' : 'Expand'})
                </span>
                <span className="text-xs text-slate-500">
                  {result.threatIndicators.length} signals detected
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`} />
            </button>

            {showTechnicalDetails && (
              <div className="p-6 border-t border-white/[0.06] space-y-6 animate-in fade-in">
                <div className="grid md:grid-cols-3 gap-6">
                  <Tilt3DCard glowColor="rgba(245, 158, 11, 0.4)" className="p-6 glass-card-3d border border-white/[0.08] flex flex-col items-center justify-center text-center">
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2 font-mono">
                      Radar Vector
                    </span>
                    <div className="flex flex-col items-center gap-3">
                      <CyberRadarHUD score={result.riskScore} level={result.riskLevel} />
                      <RiskGauge score={result.riskScore} size={140} showLabel={false} />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <ApprovalBadge status={result.approvalStatus} />
                    </div>
                  </Tilt3DCard>

                  <div className="md:col-span-2 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Heuristic Weights & Signals
                    </h4>
                    <div className="space-y-2">
                      {result.threatIndicators.map((ind, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between text-xs">
                          <div>
                            <span className="text-white font-semibold block">{ind.name}</span>
                            <span className="text-slate-400 text-[11px]">{ind.description}</span>
                          </div>
                          <span className="font-mono text-amber-400 shrink-0 ml-3">+{ind.weight} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
