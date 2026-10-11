import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRiskColor(level: string): string {
  switch (level) {
    case 'SAFE': return 'text-emerald-500';
    case 'SUSPICIOUS': return 'text-amber-500';
    case 'HIGH_RISK': return 'text-orange-500';
    case 'CRITICAL': return 'text-red-500';
    default: return 'text-slate-500';
  }
}

export function getRiskBgColor(level: string): string {
  switch (level) {
    case 'SAFE': return 'bg-emerald-500/10 border-emerald-500/20';
    case 'SUSPICIOUS': return 'bg-amber-500/10 border-amber-500/20';
    case 'HIGH_RISK': return 'bg-orange-500/10 border-orange-500/20';
    case 'CRITICAL': return 'bg-red-500/10 border-red-500/20';
    default: return 'bg-slate-500/10 border-slate-500/20';
  }
}

export function getRiskLabel(level: string): string {
  switch (level) {
    case 'SAFE': return 'Safe';
    case 'SUSPICIOUS': return 'Suspicious';
    case 'HIGH_RISK': return 'High Risk';
    case 'CRITICAL': return 'Critical';
    default: return 'Unknown';
  }
}

export function getScoreLevel(score: number): string {
  if (score <= 24) return 'SAFE';
  if (score <= 49) return 'SUSPICIOUS';
  if (score <= 74) return 'HIGH_RISK';
  return 'CRITICAL';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
