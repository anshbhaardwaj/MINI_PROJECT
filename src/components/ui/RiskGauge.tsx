'use client';

import React from 'react';

interface RiskGaugeProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

export function RiskGauge({ score, size = 180, showLabel = true }: RiskGaugeProps) {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));

  // Determine risk category and color
  let color = '#10b981'; // emerald
  let label = 'Safe';
  let desc = 'Minimal phishing indicators detected';
  let glowClass = 'glow-emerald';

  if (clampedScore >= 75) {
    color = '#ef4444'; // red
    label = 'Critical Risk';
    desc = 'Immediate danger. High confidence phishing attack';
    glowClass = 'glow-red';
  } else if (clampedScore >= 50) {
    color = '#f97316'; // orange
    label = 'High Risk';
    desc = 'Dangerous threat patterns detected';
    glowClass = 'shadow-[0_0_20px_rgba(249,115,22,0.3)]';
  } else if (clampedScore >= 25) {
    color = '#f59e0b'; // amber
    label = 'Suspicious';
    desc = 'Anomalies detected. Exercise caution';
    glowClass = 'shadow-[0_0_20px_rgba(245,158,11,0.3)]';
  }

  // Semi-circle SVG calculation
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className={`relative flex items-center justify-center p-2 rounded-full ${glowClass}`} style={{ width: size, height: size * 0.65 }}>
        <svg
          width={size}
          height={size * 0.65}
          viewBox={`0 0 ${size} ${size * 0.65}`}
          className="overflow-visible"
        >
          {/* Background Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Gradient Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-tight" style={{ color }}>
            {clampedScore}
          </span>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">
            / 100 Threat Index
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3">
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${color}1a`,
              color: color,
              border: `1px solid ${color}40`,
            }}
          >
            {label}
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
            {desc}
          </p>
        </div>
      )}
    </div>
  );
}
