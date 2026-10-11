'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Dna, 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  PhoneCall,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { RiskBadge, ApprovalBadge } from '@/components/ui/Badge';
import { Tilt3DCard } from '@/components/ui/Tilt3DCard';
import { CyberRadarHUD } from '@/components/ui/CyberRadarHUD';
import toast from 'react-hot-toast';

interface ThreatIndicator {
  name: string;
  description: string;
  severity: string;
  weight: number;
}

interface ScanResult {
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
  threatIndicators: ThreatIndicator[];
  recommendations: string[];
  metadata: {
    domain: string;
    protocol: string;
    urlLength: number;
    subdomains: string[];
    hasIP: boolean;
    hasSuspiciousChars: boolean;
    entropy: number;
    tld: string;
    victimDemographic: string;
  };
}

const EASY_PRESETS = [
  {
    name: '🟢 Safe Site (GitHub)',
    url: 'https://github.com/torvalds/linux',
    tag: 'Safe'
  },
  {
    name: '🔴 PayPal Phishing (paypa1.xyz)',
    url: 'http://paypa1-secure-login.verification-center.xyz/signin?session=expired',
    tag: 'Phishing'
  },
  {
    name: '⚠️ SBI Banking Scam (Fake KYC)',
    url: 'http://onlinesbi-pan-kyc-update.com/netbanking/login.php',
    tag: 'Scam'
  },
  {
    name: '⚡ Electricity Bill Scare',
    url: 'https://electricity-bill-disconnection-alert.support/pay-now.php',
    tag: 'Threat'
  }
];

export default function AnalyzeUrlPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const performScan = async (targetUrl: string) => {
    if (!targetUrl.trim()) {
      toast.error('Kripya check karne ke liye URL daalein');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/analyze/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      if (!res.ok) {
        throw new Error('Analysis failed');
      }

      const data = await res.json();
      setResult(data.scan);
      toast.success('Inspection complete!');
    } catch {
      toast.error('Scan failed. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    void performScan(url);
  };

  const handlePresetSelect = (presetUrl: string) => {
    setUrl(presetUrl);
    void performScan(presetUrl);
  };

  const handleCopyInput = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.originalInput);
    setCopied(true);
    toast.success('URL copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const reportText = `=========================================
PHISHGUARD AI — THREAT INSPECTION REPORT
=========================================
Target URL: ${result.originalInput}
Safety Score: ${result.riskScore} / 100
Classification: ${result.riskLevel}
Approval Status: ${result.approvalStatus}
Scam Category: ${result.scamCategory || 'None Detected'}
Audience Targeted: ${result.audienceTarget || 'General'}

TECHNICAL BREAKDOWN:
Domain: ${result.metadata.domain}
Protocol: ${result.metadata.protocol}
TLD: ${result.metadata.tld}
Entropy: ${result.metadata.entropy}

IDENTIFIED SIGNALS:
${result.threatIndicators.map(t => `- [${t.severity.toUpperCase()}] ${t.name}: ${t.description}`).join('\n')}

SAFETY RECOMMENDATIONS:
${result.recommendations.map(r => `* ${r}`).join('\n')}

Helpline: 1930 (National Cybercrime Reporting Portal: cybercrime.gov.in)
=========================================`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `PhishGuard-Scan-${result.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    toast.success('Report downloaded');
  };

  const isSafe = result && result.riskScore < 35;
  const isSuspicious = result && result.riskScore >= 35 && result.riskScore < 65;
  const isDangerous = result && result.riskScore >= 65;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Friendly, Simple Header Banner */}
      <div className="p-6 rounded-3xl glass-card border border-white/[0.08] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Globe className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                URL Safety Scanner
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Sandboxed
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Paste any suspicious link to instantly verify whether it is safe to open or a dangerous scam. Simple, clear, and completely secure.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-white/[0.06] text-xs text-slate-300 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Never clicks or executes untrusted links</span>
          </div>
        </div>
      </div>

      {/* Main Single-Click Scanner Input */}
      <div className="p-6 rounded-3xl glass-card border border-white/[0.08] space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Enter Website Link to Inspect:
        </label>
        
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste URL here (e.g. https://example.com or suspicious link...)"
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-white/[0.12] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-medium flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                Scanning...
              </span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Scan Link Now
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Preset Chips */}
        <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Try an Example:
          </span>
          {EASY_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePresetSelect(preset.url)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-900/70 border border-white/[0.08] hover:border-amber-500/40 text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear, Straightforward Results Display */}
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
                    {isSafe && '✅ VERIFIED SAFE (Surakshit Link)'}
                    {isDangerous && '🛑 DANGEROUS PHISHING (Khatarnaak Link)'}
                    {isSuspicious && '⚠️ SUSPICIOUS LINK (Savdhaan Rahein)'}
                  </h2>
                  <RiskBadge level={result.riskLevel} />
                </div>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {isSafe && 'This link shows no malicious signs. It uses a trusted domain with standard security certificates.'}
                  {isDangerous && 'DO NOT OPEN THIS LINK! It is designed to steal passwords, financial details, or personal data.'}
                  {isSuspicious && 'Be cautious. This link exhibits suspicious signals or unverified registration patterns.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <button
                onClick={handleCopyInput}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.08] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Link
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

          {/* Simple Explanation & What to Do Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Simple Explanation Card */}
            <div className="p-6 rounded-3xl glass-card border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Plain-Language Summary (Saral Bhasha Mein)
                </h3>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/[0.06]">
                  <span className="text-xs text-slate-400 block mb-0.5">Scanned Target:</span>
                  <span className="font-mono text-white text-xs break-all">{result.originalInput}</span>
                </div>

                {result.scamCategory && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <strong className="block text-xs uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1">
                      <Dna className="w-3.5 h-3.5" />
                      Detected Scam Type:
                    </strong>
                    {result.scamCategory} — {result.scamNarrative}
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Why was it flagged?
                  </span>
                  {result.threatIndicators.length === 0 ? (
                    <p className="text-xs text-emerald-400">
                      ✓ Domain is legitimate, encrypted with HTTPS, and has no brand impersonation or suspicious redirects.
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

            {/* What Should You Do Card + Helpline */}
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
                    <span className="text-xs text-slate-400 block">Trapped in a cyber fraud? Call</span>
                    <strong className="text-white text-sm font-mono">1930 (Helpline)</strong>
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

          {/* Collapsible Deep SOC Telemetry (for technical analysts) */}
          <div className="rounded-3xl glass-card border border-white/[0.08] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">
                  Advanced Technical Telemetry & Heuristics (Click to {showTechnicalDetails ? 'Collapse' : 'Expand'})
                </span>
                <span className="text-xs text-slate-500">
                  {result.threatIndicators.length} signals, Entropy {result.metadata.entropy}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`} />
            </button>

            {showTechnicalDetails && (
              <div className="p-6 border-t border-white/[0.06] space-y-6 animate-in fade-in">
                {/* 3D Gauge & Radar */}
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

                  {/* Metadata matrix */}
                  <div className="md:col-span-2 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Lexical Architecture
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06]">
                        <span className="text-slate-500 text-[10px] block">Protocol</span>
                        <span className={`font-mono font-bold ${result.metadata.protocol === 'http' ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {result.metadata.protocol.toUpperCase()}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06]">
                        <span className="text-slate-500 text-[10px] block">Root Domain</span>
                        <span className="font-mono text-white truncate block">{result.metadata.domain}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06]">
                        <span className="text-slate-500 text-[10px] block">TLD</span>
                        <span className="font-mono text-amber-400">{result.metadata.tld}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06]">
                        <span className="text-slate-500 text-[10px] block">Shannon Entropy</span>
                        <span className="font-mono text-white">{result.metadata.entropy}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Heuristic Signature Triggers
                      </h4>
                      <div className="space-y-2">
                        {result.threatIndicators.map((ind, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between text-xs">
                            <span className="text-slate-200">{ind.name}</span>
                            <span className="font-mono text-amber-400">+{ind.weight} pts</span>
                          </div>
                        ))}
                      </div>
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
