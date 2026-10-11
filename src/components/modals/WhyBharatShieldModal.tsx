'use client';

import React from 'react';
import { 
  Dna, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  PhoneCall, 
  Zap, 
  GraduationCap, 
  Building2, 
  CreditCard 
} from 'lucide-react';

interface WhyBharatShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhyBharatShieldModal({ isOpen, onClose }: WhyBharatShieldModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Why BharatShield is Different
              </h2>
              <p className="text-xs text-slate-400">
                Beyond Binary Detection • Social Engineering & Contextual Scam Profiling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Mission Quote */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border border-emerald-500/30 text-slate-200 text-sm leading-relaxed">
            <p className="italic">
              &ldquo;Traditional phishing detectors primarily classify links as safe or unsafe. 
              <strong> BharatShield</strong> goes further by identifying the social-engineering tactic, intended victim group, and India-specific scam context. 
              This turns phishing detection into phishing awareness and helps users make safer decisions.&rdquo;
            </p>
          </div>

          {/* Visual Comparison Matrix */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Direct Paradigm Comparison
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Traditional Approach */}
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  Traditional Phishing Detectors
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Outputs a binary &quot;Safe&quot; or &quot;Phishing&quot; verdict with no context</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Ignores regional scam vectors (UPI QR fraud, Electricity disconnection)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Zero victim profiling (cannot identify targeted demographic groups or manipulation levers)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Does not provide local emergency resources or cyber helpline numbers</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-rose-500/20 text-[11px] text-rose-300/80 font-mono">
                  Output: [Score: 78% (Malicious)]
                </div>
              </div>

              {/* BharatShield Approach */}
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/15 space-y-3 shadow-lg shadow-emerald-950/20">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  PhishGuard AI with BharatShield
                </div>
                <div className="space-y-2 text-xs text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Risk Score + Scam DNA Breakdown:</strong> Explains the exact manipulation levers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>India-Specific Archetypes:</strong> Detects placement fees, Challan APKs, SBI KYC</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Target Identification:</strong> Flags whether students, job-seekers or seniors are targeted</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Actionable Safety & Helpline:</strong> Direct instructions and quick link to India&apos;s 1930 Helpline</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
                  Output: [Score + Scam DNA + Target + Narrative + 1930]
                </div>
              </div>
            </div>
          </div>

          {/* India-Specific Threat Vectors Handled */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Recognized Regional Scam Vectors
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <GraduationCap className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-white">Campus Placements</div>
                <div className="text-[10px] text-slate-400">Registration fee scams</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-white">Electricity Bill</div>
                <div className="text-[10px] text-slate-400">Tonight disconnection fear</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <CreditCard className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-white">UPI Reverse Traps</div>
                <div className="text-[10px] text-slate-400">PIN enter to receive cash</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <Building2 className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-white">Aadhaar/PAN KYC</div>
                <div className="text-[10px] text-slate-400">Bank account block threats</div>
              </div>
            </div>
          </div>

          {/* India 1930 Helpline Notice */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300">
                  India National Cybercrime Helpline: 1930
                </div>
                <div className="text-[11px] text-slate-300">
                  Report financial cyber fraud immediately within the golden hour at 1930 or cybercrime.gov.in
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-800 bg-[#0b1120]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
          >
            Acknowledge Directives
          </button>
        </div>
      </div>
    </div>
  );
}
