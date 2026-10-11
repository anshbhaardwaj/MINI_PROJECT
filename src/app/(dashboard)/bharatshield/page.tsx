'use client';

import React, { useState } from 'react';
import { 
  Dna, 
  ShieldAlert, 
  CheckCircle2, 
  PhoneCall, 
  Zap, 
  GraduationCap, 
  Building2, 
  CreditCard, 
  Smartphone,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { WhyBharatShieldModal } from '@/components/modals/WhyBharatShieldModal';

const SCAM_VECTORS = [
  {
    id: 'placement',
    icon: GraduationCap,
    title: 'Fraudulent Recruitment & Job Drive Schemes',
    target: 'Job Seekers, Freshers & Early Professionals',
    tactic: 'Urgency + Fear of Missing Out (FOMO)',
    samplePhrase: '“Selected for Tech Placement Interview. Pay Rs. 2,499 registration fee today.”',
    narrative: 'Exploits high-stakes job search anxiety. Demands advance verification or training fees. Legitimate corporate recruiters never require payment to interview candidates.',
    defense: 'Never pay fees for recruitment tests. Cross-verify job notifications directly on verified corporate career portals.',
    color: 'border-amber-500/30 text-amber-400 bg-amber-950/20'
  },
  {
    id: 'electricity',
    icon: Zap,
    title: 'Electricity Bill Disconnection Panic',
    target: 'Households, Small Business Owners & Elderly',
    tactic: 'Immediate Coercive Blackout Fear',
    samplePhrase: '“Your power will be disconnected tonight at 9:30 PM from substation. Call officer.”',
    narrative: 'Sent during late afternoon hours to prevent victims from contacting state electricity offices. Instructs downloading an APK or remote desktop app (AnyDesk/QuickSupport) to drain accounts.',
    defense: 'State electricity boards send formal letters or standard SMS without personal mobile phone numbers. Never install third-party APK links.',
    color: 'border-amber-500/30 text-amber-400 bg-amber-950/20'
  },
  {
    id: 'upi',
    icon: CreditCard,
    title: 'UPI Reverse PIN / QR Code Traps',
    target: 'Online Sellers, OLX users, Young Consumers',
    tactic: 'Greed / Confusion of Transaction Flow',
    samplePhrase: '“Scan this QR code and enter your UPI PIN to receive your lottery / OLX payment.”',
    narrative: 'Exploits widespread misunderstanding of UPI architecture. Fraudsters claim that entering a 4-digit or 6-digit PIN is necessary to credit money into the victim’s account.',
    defense: 'GOLDEN RULE: You NEVER need to enter your UPI PIN to RECEIVE money. Entering your PIN always withdraws funds.',
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
  },
  {
    id: 'kyc',
    icon: Building2,
    title: 'Aadhaar / PAN Bank KYC Suspension',
    target: 'Bank Account Holders & Senior Citizens',
    tactic: 'Account Block Threat + Regulatory Pretext',
    samplePhrase: '“SBI/HDFC Alert: Your bank profile is suspended. Update PAN immediately.”',
    narrative: 'Impersonates public sector and private banks, claiming compliance with RBI mandates. Directs users to convincing phishing portals mimicking netbanking login screens.',
    defense: 'Banks never send SMS containing unverified third-party domains (.xyz, .top, .tk). Always log in directly via official bank mobile apps.',
    color: 'border-rose-500/30 text-rose-400 bg-rose-950/20'
  },
  {
    id: 'challan',
    icon: Smartphone,
    title: 'Traffic Challan APK Download Fraud',
    target: 'Vehicle Owners & Commuters',
    tactic: 'Court / Legal Penalty Intimidation',
    samplePhrase: '“E-Challan pending against your vehicle. Download challan_receipt.apk to pay.”',
    narrative: 'Circulates SMS pretending to be Parivahan or Traffic Police. The attached APK contains banking trojans that intercept SMS OTPs in real-time.',
    defense: 'Always check traffic challans exclusively on echallan.parivahan.gov.in. Never sideload .apk files from SMS links.',
    color: 'border-purple-500/30 text-purple-400 bg-purple-950/20'
  }
];

export default function BharatShieldPage() {
  const [selectedVector, setSelectedVector] = useState(SCAM_VECTORS[0]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Dna className="w-4 h-4" />
            BharatShield™ Cognitive Threat Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Contextual Scam DNA & Regional Threat Profiling
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Moving beyond blind binary scores. BharatShield identifies the psychological manipulation lever, targeted demographic, and localized Indian fraud signatures to foster proactive cyber hygiene.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 shrink-0"
        >
          <span>Why BharatShield is Different</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Paradigm Visual Comparison Card */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
          Paradigm Evolution
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-2">
            <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Traditional Phishing Detectors
            </div>
            <p className="text-xs text-slate-300">
              Only outputs a raw number (e.g. 82% Phishing). No explanation of the social engineering tactic, intended victim, or localized Indian context.
            </p>
            <div className="text-[11px] font-mono text-rose-300 pt-1">
              Result: High user anxiety, low educational awareness.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-2 shadow-lg shadow-emerald-950/20">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              PhishGuard AI + BharatShield
            </div>
            <p className="text-xs text-slate-200">
              Produces: <strong>Risk Score + Scam DNA + Target Identification + Actionable Local Guidance + 1930 Helpline link</strong>.
            </p>
            <div className="text-[11px] font-mono text-emerald-300 pt-1">
              Result: Explainable awareness, immediate incident response.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Regional Scam DNA Vector Explorer */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            Common Indian Social-Engineering Vectors
          </h2>
          <p className="text-xs text-slate-400">
            Select an archetype to inspect its DNA signature, psychological trigger, and defensive rules.
          </p>
        </div>

        {/* Vector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {SCAM_VECTORS.map((vec) => {
            const Icon = vec.icon;
            const isSelected = selectedVector.id === vec.id;
            return (
              <button
                key={vec.id}
                onClick={() => setSelectedVector(vec)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? `${vec.color} ring-1 ring-emerald-500 shadow-md`
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Icon className="w-5 h-5 mb-2" />
                <div>
                  <div className="text-xs font-bold line-clamp-1">{vec.title}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{vec.target}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Vector Deep Dive Card */}
        <div className="p-6 rounded-2xl glass-card border border-slate-700 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Scam DNA Archetype Inspection
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {selectedVector.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                Target: {selectedVector.target}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Psychological Trigger & Tactic:
                </span>
                <p className="text-xs text-white font-semibold mt-1">
                  {selectedVector.tactic}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Frequent Scam Bait Phrase:
                </span>
                <div className="mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-amber-300 italic">
                  {selectedVector.samplePhrase}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Explainable Scam Narrative:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {selectedVector.narrative}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Actionable Defense Guideline
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedVector.defense}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4" />
                  Emergency Financial Fraud Response: 1930
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Victims of financial cyber fraud should report within the golden hour to freeze unauthorized recipient bank accounts immediately.
                </p>
                <div className="pt-1">
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold"
                  >
                    National Cyber Crime Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhyBharatShieldModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
