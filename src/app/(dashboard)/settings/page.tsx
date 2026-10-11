'use client';

import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Bell, 
  Key, 
  ShieldCheck, 
  Check, 
  Copy, 
  Save
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, studentSafetyMode, setStudentSafetyMode } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [scanAlerts, setScanAlerts] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);

  const demoApiKey = 'pg_live_98a72bf108c4e320d7596a1e';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(demoApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    toast.success('API key copied');
  };

  const handleSavePreferences = () => {
    toast.success('Preferences updated successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Banner */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              System Settings & Preferences
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Preferences
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure Student Safety Mode, threat alert thresholds, and demo API credentials.
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <User className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">Analyst Account Profile</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">User Name</span>
            <span className="font-semibold text-white mt-0.5 block">{user?.name || 'Ansh Bhardwaj'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Email Address</span>
            <span className="font-semibold text-white mt-0.5 block">{user?.email || 'demo@phishguard.ai'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Assigned Role</span>
            <span className="font-mono font-bold text-cyan-400 mt-0.5 block">{user?.role || 'USER'}</span>
          </div>
        </div>
      </div>

      {/* Student Safety Mode Card */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Student Safety Mode</h2>
              <p className="text-xs text-slate-400">Tailored protection for campus and academic environments</p>
            </div>
          </div>

          <button
            onClick={() => {
              setStudentSafetyMode(!studentSafetyMode);
              toast.success(`Student Safety Mode ${!studentSafetyMode ? 'Activated' : 'Deactivated'}`);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              studentSafetyMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {studentSafetyMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          When active, PhishGuard AI prioritizes strict flags for campus recruitment fees, unverified internship registration links, scholarship advance-fee frauds, and hackathon credential collectors.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Bell className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white">Telemetry & Alerts</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">Critical Threat Popups</div>
              <div className="text-[11px] text-slate-400">Display immediate alerts when risk score exceeds 75</div>
            </div>
            <input
              type="checkbox"
              checked={scanAlerts}
              onChange={(e) => setScanAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 bg-slate-800 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">Analyst Queue Triage Notifications</div>
              <div className="text-[11px] text-slate-400">Notify when new scans require review in the triage band (35–70)</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 bg-slate-800 border-slate-700"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition"
          >
            <Save className="w-3.5 h-3.5" />
            Save Preferences
          </button>
        </div>
      </div>

      {/* API Key Demo Card */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Key className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white">Developer API Key (Demo)</h2>
        </div>

        <p className="text-xs text-slate-400">
          Use this bearer token to query the PhishGuard static heuristic analysis endpoint from external microservices or browser extensions.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={demoApiKey}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
          />
          <button
            onClick={handleCopyKey}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Key
          </button>
        </div>
      </div>

      {/* Enterprise Deployment & Standards */}
      <div className="p-5 rounded-2xl bg-[#0b0e17] border border-white/[0.08] text-center space-y-1.5">
        <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          PhishGuard AI Enterprise Security Platform • Version 4.2.0 (Production)
        </div>
        <p className="text-[11px] text-slate-400">
          Engineered for SOC-2 Type II & ISO-27001 Alignment • Autonomous Cognitive Threat Defense
        </p>
      </div>
    </div>
  );
}
