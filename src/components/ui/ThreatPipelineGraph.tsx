'use client';

import React, { useState } from 'react';
import { ShieldCheck, Cpu, Dna, Lock, Radio } from 'lucide-react';

const PIPELINE_NODES = [
  {
    id: 'ingest',
    name: 'Ingestion Gate',
    metric: '94,200 req/s',
    latency: '0.4ms',
    status: 'ACTIVE',
    icon: Lock,
    detail: 'Air-gapped static parser extracts URL tokens, headers, and payload structure without executing code.'
  },
  {
    id: 'lexical',
    name: 'Lexical Decomposition',
    metric: '128 Signatures',
    latency: '1.2ms',
    status: 'ACTIVE',
    icon: Cpu,
    detail: 'Evaluates Shannon entropy, brand typosquats (g1thub, paypa1), homoglyphs, and TLD reputation.'
  },
  {
    id: 'cognitive',
    name: 'BharatShield™ Scam DNA',
    metric: '5 Regional Vectors',
    latency: '2.1ms',
    status: 'ACTIVE',
    icon: Dna,
    detail: 'Cognitive behavioral engine identifying victim profiles, urgency levers, and localized fraud archetypes.'
  },
  {
    id: 'triage',
    name: 'Consensus & Triage',
    metric: '0.04% FP Rate',
    latency: '0.8ms',
    status: 'VERIFIED',
    icon: ShieldCheck,
    detail: 'Auto-certifies clean/critical targets; routes 35–70 borderline scores to the human analyst queue.'
  }
];

export function ThreatPipelineGraph() {
  const [activeNode, setActiveNode] = useState(0);
  const current = PIPELINE_NODES[activeNode];

  return (
    <div className="rounded-3xl glass-card border border-white/[0.08] p-6 sm:p-8 space-y-6">
      {/* Header with live status pulse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Autonomous Threat Pipeline Architecture
            </h3>
            <p className="text-xs text-slate-400">
              Real-time heuristic stream with microsecond latency benchmarks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-mono font-semibold text-emerald-400">
            GLOBAL HEALTH: 100% OPERATIONAL
          </span>
        </div>
      </div>

      {/* Interactive Node Path */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {PIPELINE_NODES.map((node, idx) => {
          const Icon = node.icon;
          const isSelected = idx === activeNode;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(idx)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-indigo-950/20 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'border-white/[0.06] bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl border ${isSelected ? 'border-amber-500/30 bg-amber-500/15 text-amber-300' : 'border-slate-800 bg-slate-850 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {node.latency}
                </span>
              </div>

              <div className="text-xs font-bold text-white">{node.name}</div>
              <div className="text-[11px] font-mono text-amber-400/90 mt-1">{node.metric}</div>

              {/* Progress shimmer line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800">
                {isSelected && (
                  <div className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 animate-pulse" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Node Forensic Deep Dive */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
              Selected Stage:
            </span>
            <span className="text-sm font-bold text-white">
              {current.name}
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {current.detail}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-xs font-mono">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block uppercase">Stage Throughput</span>
            <strong className="text-white text-xs">{current.metric}</strong>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block uppercase">Execution SLA</span>
            <strong className="text-emerald-400 text-xs">{current.latency}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
