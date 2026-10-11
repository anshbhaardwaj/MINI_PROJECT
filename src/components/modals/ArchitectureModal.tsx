'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Dna, 
  Database, 
  UserCheck, 
  X, 
  CheckCircle2 
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ARCHITECTURE_STEPS = [
  {
    id: 'ui',
    icon: Layers,
    title: '1. User Interface',
    subtitle: 'Next.js App Router (Client)',
    description: 'Responsive, accessible interface crafted with Tailwind CSS and Framer Motion. Zero malicious execution guarantee.',
    details: [
      'Text and metadata only input collection',
      'Never preloads, executes, renders, or pings candidate URLs',
      'Immediate client-side input validation with Zod schemas',
      'Presets and one-click testing payloads for demoing'
    ],
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20'
  },
  {
    id: 'api',
    icon: Lock,
    title: '2. Secure API Layer',
    subtitle: 'Next.js Server Routes & Auth Guards',
    description: 'Enforces token verification, rate-limiting, and defensive sanitization before payload ingestion.',
    details: [
      'In-memory sliding-window scan rate-limiting',
      'Strict input sanitization escaping HTML & script injection',
      'JWT session validation via HTTP-only cookies',
      'Role-based permissions (User vs Admin Analyst)'
    ],
    color: 'border-blue-500/40 text-blue-400 bg-blue-950/20'
  },
  {
    id: 'engines',
    icon: Cpu,
    title: '3. Analysis Engine',
    subtitle: 'URL & Email Heuristics',
    description: 'Dual-engine static analyzer parsing lexical, structural, and behavioral indicators without web requests.',
    details: [
      'URL Analyzer: Typosquatting, Punycode/homoglyphs, Shannon entropy, IP-host literals, suspicious TLDs',
      'Email Analyzer: Sender domain spoofing, reply-to discrepancies, SPF/DKIM headers',
      'Social Engineering lexicon: urgency, coercive deadlines, credential demands'
    ],
    color: 'border-purple-500/40 text-purple-400 bg-purple-950/20'
  },
  {
    id: 'dna',
    icon: Dna,
    title: '4. BharatShield Scam DNA',
    subtitle: 'Contextual Fraud Profiling',
    description: 'Novel behavioral categorization engine specifically mapped to Indian fraud vectors and psychological levers.',
    details: [
      'Scam DNA profiling: Placement scams, Electricity disconnections, UPI QR traps, Aadhaar/PAN KYC update fraud',
      'Target identification: Students, Job Seekers, Senior Citizens, Small Business Owners',
      'Explainable scam narrative generation in plain, transparent language',
      'Immediate 1930 Cybercrime Helpline guidance'
    ],
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
  },
  {
    id: 'db',
    icon: Database,
    title: '5. Database Layer',
    subtitle: 'Prisma ORM + PostgreSQL / SQLite',
    description: 'Persistent relational storage for full audit logs, scan telemetry, user profiles, and review queues.',
    details: [
      'Normalized schema: User, Scan, ScanReview, UserPreference',
      'Preserves original payloads, parsed indicators, and complete Scam DNA objects',
      'Audit log tracking reviewer ID, decisions, timestamps, and notes'
    ],
    color: 'border-amber-500/40 text-amber-400 bg-amber-950/20'
  },
  {
    id: 'admin',
    icon: UserCheck,
    title: '6. Human-in-the-Loop Review',
    subtitle: 'Analyst Queue & Analytics',
    description: 'Borderline scans (scores 35–70) trigger a human review workflow to eliminate false positives in enterprise deployments.',
    details: [
      'Automated "Needs Review" tagging for ambiguous risk scores',
      'Admin approval actions: Verified Threat, False Positive, Approved Safe, Escalate',
      'Live aggregations on threat trends and false positive rates',
      'Exportable PDF compliance reports for auditing'
    ],
    color: 'border-rose-500/40 text-rose-400 bg-rose-950/20'
  }
];

export function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const current = ARCHITECTURE_STEPS[activeStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                System Architecture & Data Flow
              </h2>
              <p className="text-xs text-slate-400">
                End-to-End Pipeline • Defense-in-Depth • Explainable AI
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual Data Flow Diagram */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-3">
              Data Flow Pipeline (Click node to inspect)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {ARCHITECTURE_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isSelected = idx === activeStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`flex flex-col items-center text-center p-3 rounded-lg border transition-all ${
                      isSelected
                        ? `${step.color} shadow-lg ring-1 ring-cyan-500`
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-semibold line-clamp-1">{step.title}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{step.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Details */}
          <div className={`p-5 rounded-xl border ${current.color} transition-all`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-cyan-400">
                  Detailed Layer Specification
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {current.title}: {current.subtitle}
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  {current.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Key Technical Capabilities & Guarantees:
              </h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {current.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security & Academic Defense-in-Depth Callout */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                Zero Execution Safe
              </div>
              <p className="text-[11px] text-slate-400">
                Candidate URLs are never pinged or loaded. All features are parsed statically in memory.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-1">
                <Dna className="w-4 h-4" />
                Explainable DNA
              </div>
              <p className="text-[11px] text-slate-400">
                Transparent risk math without black-box opacity. Clear reasons and social manipulation tags.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                <UserCheck className="w-4 h-4" />
                Human-in-the-Loop
              </div>
              <p className="text-[11px] text-slate-400">
                Uncertain scores (35–70) enter an enterprise analyst queue for verified accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-[#0b1120]">
          <span className="text-xs text-slate-400 font-mono">
            PhishGuard Architecture Specification • SOC-2 Type II & ISO-27001 Alignment
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition font-bold"
          >
            Close Pipeline Diagram
          </button>
        </div>
      </div>
    </div>
  );
}
