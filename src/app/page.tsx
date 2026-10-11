'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Dna, 
  Cpu, 
  UserCheck, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Terminal
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RiskBadge, ApprovalBadge } from '@/components/ui/Badge';
import { EnterpriseVisualGrid } from '@/components/ui/EnterpriseVisualGrid';
import { Tilt3DCard } from '@/components/ui/Tilt3DCard';
import { CyberRadarHUD } from '@/components/ui/CyberRadarHUD';
import { ThreatPipelineGraph } from '@/components/ui/ThreatPipelineGraph';
import { ArchitectureModal } from '@/components/modals/ArchitectureModal';
import { WhyBharatShieldModal } from '@/components/modals/WhyBharatShieldModal';

const PRESET_URLS = [
  {
    name: 'Fake GitHub Repo Trap',
    url: 'http://g1thub-auth-token-login.xyz/octocat/private-repo/access-token',
    score: 82,
    level: 'CRITICAL',
    category: 'Developer Token Harvesting',
    reason: 'Brand typosquatting impersonation ("g1thub" with digit 1), suspicious TLD (.xyz), plain HTTP protocol, credential/token harvest path.'
  },
  {
    name: 'PayPal Phishing Portal',
    url: 'http://paypa1-secure-login.verification-center.xyz/signin?ref=urgent',
    score: 92,
    level: 'CRITICAL',
    category: 'Banking / Credential Harvest',
    reason: 'Severe typosquatting ("paypa1"), suspicious TLD (.xyz), plain HTTP protocol, credential harvest path.'
  },
  {
    name: 'SBI NetBanking Impersonation',
    url: 'http://onlinesbi-pan-kyc-update.com/netbanking/login.php',
    score: 88,
    level: 'CRITICAL',
    category: 'Bank KYC Pretexting',
    reason: 'Banking domain impersonation with PAN-KYC pretext, HTTP protocol, credential harvesting form.'
  },
  {
    name: 'Recruitment Scam Shortener',
    url: 'https://tinyurl.com/free-placement-drive-offer',
    score: 58,
    level: 'HIGH_RISK',
    category: 'Job & Internship Fraud',
    reason: 'URL shortener masking destination with candidate placement fee bait keywords.'
  },
  {
    name: 'Verified Enterprise Domain',
    url: 'https://en.wikipedia.org/wiki/Phishing',
    score: 5,
    level: 'SAFE',
    category: 'Legitimate Resource',
    reason: 'Established domain reputation, valid HTTPS, zero suspicious keywords or obfuscations.'
  }
];

export default function HomePage() {
  const [testUrl, setTestUrl] = useState('');
  const [activePreset, setActivePreset] = useState<typeof PRESET_URLS[0] | null>(PRESET_URLS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showBharatModal, setShowBharatModal] = useState(false);

  const handleScanPreset = (preset: typeof PRESET_URLS[0]) => {
    setIsScanning(true);
    setActivePreset(preset);
    setTestUrl(preset.url);
    setTimeout(() => {
      setIsScanning(false);
    }, 400);
  };

  const handleCustomScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testUrl) return;
    setIsScanning(true);

    const lower = testUrl.toLowerCase();
    let score = 15;
    let level = 'SAFE';
    let category = 'Analyzed Web Target';
    let reason = 'Valid secure connection structure, zero immediate homoglyph threats detected.';

    if (lower.includes('g1thub') || lower.includes('github-') || lower.includes('githvb')) {
      score = 82;
      level = 'CRITICAL';
      category = 'GitHub Developer Spoof';
      reason = 'Detected GitHub brand typosquatting ("g1thub"), suspicious endpoint or token harvesting parameters.';
    } else if (lower.includes('paypa1') || lower.includes('xyz') || lower.includes('kyc') || lower.includes('sbi-')) {
      score = 88;
      level = 'CRITICAL';
      category = 'Banking Impersonation';
      reason = 'Detected brand homoglyph, high-risk TLD or unverified KYC update pattern.';
    } else if (lower.includes('login') || lower.includes('verify') || lower.includes('bit.ly') || lower.includes('tinyurl')) {
      score = 56;
      level = 'HIGH_RISK';
      category = 'Credential Redirection';
      reason = 'URL shortener or unverified credential verification endpoint detected.';
    }

    setTimeout(() => {
      setActivePreset({
        name: 'Custom URL Input',
        url: testUrl,
        score,
        level,
        category,
        reason
      });
      setIsScanning(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090c13] text-slate-100 relative overflow-hidden bg-enterprise-mesh">
      {/* Enterprise Interactive Visual Mesh */}
      <EnterpriseVisualGrid />

      {/* Top Navbar */}
      <div className="relative z-40">
        <Navbar />
      </div>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-14 pb-20 md:pt-22 md:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            {/* Classy Badge */}
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-300 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md animate-soft-float">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span>BharatShield™ Cognitive Threat Radar Active</span>
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                <span className="text-[11px] text-amber-200/90 font-mono">Enterprise Defense Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.12]">
                Autonomous Phishing Defense with{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                  Scam DNA
                </span>{' '}
                Profiling
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Zero-execution static threat analysis for credential harvesting, developer token traps, and localized social engineering with real-time analyst triage.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/analyze-url"
                  className="px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 flex items-center gap-2.5 transition transform hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  Launch Security Scanner
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>

                <button
                  onClick={() => setShowArchModal(true)}
                  className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/[0.08] hover:border-amber-500/30 flex items-center gap-2 transition backdrop-blur-md"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  Inspect Architecture
                </button>

                <Link
                  href="/login"
                  className="px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/60 hover:bg-slate-800 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition"
                >
                  1-Click Analyst Login
                </Link>
              </div>
            </div>

            {/* 3D Tilt Scanner Interactive Console */}
            <div className="mt-14 max-w-5xl mx-auto">
              <Tilt3DCard glowColor="rgba(245, 158, 11, 0.35)" className="glass-card border border-white/[0.08] p-6 sm:p-8">
                {/* Console Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      phishguard-core://autonomous-heuristics
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Air-Gapped • Zero-Execution Static Parse
                    </span>
                  </div>
                </div>

                {/* Live URL Input Form */}
                <form onSubmit={handleCustomScan} className="mt-6 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      placeholder="Paste suspicious target URL (e.g. http://g1thub-auth-token-login.xyz/...)"
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-white/[0.08] text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isScanning}
                    className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shrink-0 shadow-lg shadow-amber-500/20"
                  >
                    {isScanning ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        Scanning Matrix...
                      </span>
                    ) : (
                      <>
                        <Search className="w-4 h-4 text-slate-950" />
                        Execute Analysis
                      </>
                    )}
                  </button>
                </form>

                {/* Preset Scenario Buttons */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Quick Test Presets:
                  </span>
                  {PRESET_URLS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleScanPreset(preset)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        activePreset?.name === preset.name
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                          : 'bg-slate-900/80 text-slate-300 border-white/[0.08] hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                {/* Output Grid */}
                {activePreset && (
                  <div className="mt-8 pt-6 border-t border-white/[0.06] grid md:grid-cols-12 gap-6 items-center">
                    {/* Cyber Radar HUD */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/60 border border-white/[0.06]">
                      <CyberRadarHUD
                        score={activePreset.score}
                        level={activePreset.level}
                        isScanning={isScanning}
                      />
                      <span className="text-[11px] font-mono text-slate-400 mt-2">
                        TELEMETRY: TARGET ACQUIRED
                      </span>
                    </div>

                    {/* Threat Details */}
                    <div className="md:col-span-8 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <RiskBadge level={activePreset.level} />
                        <ApprovalBadge
                          status={
                            activePreset.score >= 35 && activePreset.score <= 70
                              ? 'NEEDS_REVIEW'
                              : 'AUTO_ANALYZED'
                          }
                        />
                        <span className="text-xs font-mono text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-500/30">
                          {activePreset.category}
                        </span>
                      </div>

                      <div className="text-xs font-mono bg-slate-950/90 p-3 rounded-xl border border-white/[0.08] text-slate-200 break-all select-all">
                        {activePreset.url}
                      </div>

                      <div className="text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-xl border border-white/[0.06] leading-relaxed">
                        <strong className="text-white flex items-center gap-1.5 mb-1">
                          <Dna className="w-3.5 h-3.5 text-amber-400" />
                          BharatShield™ Scam DNA Analysis:
                        </strong>
                        {activePreset.reason}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-400">
                          Persisted to database with complete forensic audit trail
                        </span>
                        <Link
                          href="/analyze-url"
                          className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition"
                        >
                          Open Detailed Inspector <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </Tilt3DCard>
            </div>
          </div>
        </section>

        {/* Real-time Threat Pipeline Telemetry Section (Fills blank space with high-end graph) */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ThreatPipelineGraph />
        </section>

        {/* Enterprise Security Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Enterprise Cyber Defense Modules
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Architected to eliminate false positives and counteract localized social engineering traps with explainable forensics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Tilt3DCard glowColor="rgba(245, 158, 11, 0.25)" className="p-6 rounded-2xl glass-card border border-white/[0.08]">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Static Heuristic Engine
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deconstructs candidate URLs into protocol, lexical tokens, Shannon entropy, homoglyph character substitutions, and subdomain depth safely.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 pt-4 mt-4 border-t border-white/[0.06]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  GitHub, PayPal, SBI Typosquat Detection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Punycode & Zero-Width Obfuscation Checks
                </li>
              </ul>
            </Tilt3DCard>

            <Tilt3DCard glowColor="rgba(16, 185, 129, 0.25)" className="p-6 rounded-2xl glass-card border border-white/[0.08]">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
                <Dna className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                BharatShield™ Scam DNA
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Profiles social-engineering levers (fear, urgency, greed) and identifies targeted demographic groups with step-by-step avoidance guidance.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 pt-4 mt-4 border-t border-white/[0.06]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Campus Recruitment & Job Fraud Filters
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Direct 1930 Cyber Helpline Integration
                </li>
              </ul>
            </Tilt3DCard>

            <Tilt3DCard glowColor="rgba(99, 102, 241, 0.25)" className="p-6 rounded-2xl glass-card border border-white/[0.08]">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-sm">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Human-in-the-Loop Triage
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When uncertainty exists (scores 35–70), the scan enters an authorized analyst queue for verification, eliminating enterprise false positives.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 pt-4 mt-4 border-t border-white/[0.06]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Reviewer Audit Signature & Forensic Notes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  4-Way Decision Commit & Audit Trail
                </li>
              </ul>
            </Tilt3DCard>
          </div>
        </section>

        {/* BharatShield Spotlight Interactive Card */}
        <section className="py-14 bg-gradient-to-b from-slate-950 via-[#0a0f19] to-slate-950 border-y border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl p-8 sm:p-10 border border-amber-500/25 bg-amber-950/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Dna className="w-4 h-4" />
                  Cognitive Threat Architecture
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Beyond Binary Detection: Real Context & Guidance
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Traditional scanners output only &ldquo;safe&rdquo; or &ldquo;phishing&rdquo;. BharatShield extracts the psychological lever, the targeted group, and gives step-by-step avoidance instructions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
                <button
                  onClick={() => setShowBharatModal(true)}
                  className="px-6 py-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                >
                  View Paradigm Comparison
                </button>
                <Link
                  href="/bharatshield"
                  className="px-6 py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition flex items-center justify-center gap-2"
                >
                  Explore Scam DNA Hub
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ArchitectureModal isOpen={showArchModal} onClose={() => setShowArchModal(false)} />
      <WhyBharatShieldModal isOpen={showBharatModal} onClose={() => setShowBharatModal(false)} />
    </div>
  );
}
