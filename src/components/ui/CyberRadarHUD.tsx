'use client';

import React from 'react';

interface CyberRadarHUDProps {
  score?: number;
  level?: string;
  isScanning?: boolean;
}

export function CyberRadarHUD({ score = 75, level = 'CRITICAL', isScanning = false }: CyberRadarHUDProps) {
  let ringColor = 'rgba(245, 158, 11, 0.4)';
  let accentColor = '#f59e0b'; // Warm Champagne Amber

  if (score >= 75) {
    ringColor = 'rgba(244, 63, 94, 0.4)';
    accentColor = '#f43f5e'; // Rose / Crimson
  } else if (score >= 50) {
    ringColor = 'rgba(249, 115, 22, 0.4)';
    accentColor = '#f97316'; // Coral
  } else if (score >= 25) {
    ringColor = 'rgba(245, 158, 11, 0.4)';
    accentColor = '#f59e0b'; // Amber
  } else {
    ringColor = 'rgba(16, 185, 129, 0.4)';
    accentColor = '#10b981'; // Emerald
  }

  return (
    <div className="relative w-44 h-44 rounded-full flex items-center justify-center p-2 select-none">
      {/* Outer Rotating Tactical Compass Ring */}
      <div 
        className="absolute inset-0 rounded-full border border-dashed border-amber-500/25 animate-[spin_24s_linear_infinite]"
      />

      {/* Outer Hexagonal Tech Ring */}
      <div 
        className="absolute inset-2 rounded-full border border-slate-800"
      />

      {/* Concentric Sonar Rings */}
      <div 
        className="absolute w-28 h-28 rounded-full border"
        style={{ borderColor: ringColor }}
      />
      <div 
        className="absolute w-16 h-16 rounded-full border border-slate-800"
      />

      {/* Crosshair Lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-amber-500/15" />
        <div className="absolute h-full w-[1px] bg-amber-500/15" />
      </div>

      {/* Rotating Radar Sweep Cone */}
      <div 
        className={`absolute inset-0 rounded-full pointer-events-none ${
          isScanning ? 'animate-[spin_1.5s_linear_infinite]' : 'animate-[spin_6s_linear_infinite]'
        }`}
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${accentColor}26 360deg)`,
        }}
      />

      {/* Radar Threat Blips */}
      <div className="absolute top-10 right-12 w-2 h-2 rounded-full bg-rose-400 animate-ping" />
      <div className="absolute bottom-12 left-10 w-1.5 h-1.5 rounded-full bg-amber-400" />
      <div className="absolute top-14 left-16 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60" />

      {/* Center Target Core */}
      <div 
        className="relative z-10 w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-lg backdrop-blur-sm"
        style={{
          backgroundColor: `${accentColor}14`,
          border: `1.5px solid ${accentColor}`,
          boxShadow: `0 0 16px ${accentColor}30`,
        }}
      >
        <span className="text-xs font-mono font-extrabold text-white leading-none">
          {score}
        </span>
        <span className="text-[8px] font-mono uppercase text-slate-300 mt-0.5">
          {level?.slice(0, 4)}
        </span>
      </div>

      {/* HUD Corner Tech Markers */}
      <div className="absolute top-1 left-2 text-[9px] font-mono text-amber-400/80">
        TELEMETRY.01
      </div>
      <div className="absolute bottom-1 right-2 text-[9px] font-mono text-emerald-400/80">
        SENSOR: ACTIVE
      </div>
    </div>
  );
}
