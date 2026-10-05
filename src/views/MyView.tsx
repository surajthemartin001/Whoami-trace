import React from 'react';
import { UserProfile, AnalyticsData } from '../types';
import { LyraAvatar } from '../components/LyraAvatar';
import {
  User,
  Shield,
  Clock,
  Sparkles,
  Download,
  Settings,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';

interface MyViewProps {
  user: UserProfile;
  analytics: AnalyticsData;
  onOpenSettings: () => void;
  onOpenLyra: () => void;
}

export const MyView: React.FC<MyViewProps> = ({
  user,
  analytics,
  onOpenSettings,
  onOpenLyra,
}) => {
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `who_am_i_${user.displayName.replace(/\s+/g, '_')}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Profile Header with Elegant Minimalist Typography & LYRA Fairy Companion */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Personal Identity & Direction
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            {user.displayName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {user.email}
            </span>
            {user.phone && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {user.phone}
                </span>
              </>
            )}
          </div>
        </div>

        {/* LYRA Fairy Avatar Companion */}
        <div
          onClick={onOpenLyra}
          className="p-4 rounded-3xl bg-indigo-950/30 border border-indigo-500/30 hover:border-indigo-500/60 transition cursor-pointer flex items-center gap-3 shadow-lg"
          title="Talk with LYRA"
        >
          <LyraAvatar state="idle" size="md" />
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span>LYRA AI</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200">
                Companion
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Primary Language: {user.preferredLanguage}</p>
          </div>
        </div>
      </div>

      {/* Profile Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-slate-400 text-[11px]">Primary Trajectory</span>
          <div className="font-bold text-sm text-white">Robotics & Physical AI</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-slate-400 text-[11px]">Current Intensity</span>
          <div className="font-bold text-sm text-indigo-400">{user.currentIntensity.name}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-slate-400 text-[11px]">Consistency Streak</span>
          <div className="font-bold text-sm text-amber-400">{analytics.streakDays} Days</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-slate-400 text-[11px]">Success Track Health</span>
          <div className="font-bold text-sm text-emerald-400 font-mono">{analytics.trackScore}% (Optimal)</div>
        </div>
      </div>

      {/* Permissions & Security Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Security & Active Device Permissions</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Isolated Account Workspace</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span>Microphone (Voice)</span>
            <span className={user.permissions.microphone ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {user.permissions.microphone ? 'Active ✓' : 'Disabled'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span>Camera (Video Call)</span>
            <span className={user.permissions.camera ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {user.permissions.camera ? 'Active ✓' : 'Disabled'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span>Notifications</span>
            <span className={user.permissions.notifications ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {user.permissions.notifications ? 'Active ✓' : 'Disabled'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span>File & Notes Storage</span>
            <span className={user.permissions.files ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {user.permissions.files ? 'Active ✓' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={handleExportData}
            className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Personal Learning Data (JSON)</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 transition"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Manage Intensity & Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
