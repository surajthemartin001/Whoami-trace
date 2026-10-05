import React from 'react';
import { AnalyticsData, UserProfile } from '../types';
import { SuccessTrackBadge } from '../components/SuccessTrackBadge';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  Activity,
} from 'lucide-react';

interface AnalyticsViewProps {
  analytics: AnalyticsData;
  user: UserProfile;
  onOpenRecovery: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  user,
  onOpenRecovery,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Performance & Track Telemetry</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real cognitive progress data. Grounded in actual practice attempts, task completions, and circadian discipline.
          </p>
        </div>

        <SuccessTrackBadge
          trackState={analytics.trackState}
          score={analytics.trackScore}
          onOpenRecovery={onOpenRecovery}
        />
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Practice Accuracy</span>
          <div className="text-xl font-bold font-mono text-emerald-400">{analytics.overallAccuracy}%</div>
          <p className="text-[10px] text-slate-500">Across {analytics.totalPracticeQuestions} solved problems</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Focused Learning Time</span>
          <div className="text-xl font-bold font-mono text-indigo-400">{analytics.totalStudyHours} hrs</div>
          <p className="text-[10px] text-slate-500">Logged deep work hours</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Active Rhythm Streak</span>
          <div className="text-xl font-bold font-mono text-amber-400">{analytics.streakDays} Days</div>
          <p className="text-[10px] text-slate-500">Consistent circadian habit</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Intensity Lock</span>
          <div className="text-xl font-bold text-white">{user.currentIntensity.name.split(' ')[0]}</div>
          <p className="text-[10px] text-indigo-400 font-mono">{user.currentIntensity.badge}</p>
        </div>
      </div>

      {/* Weekly Activity Bar Chart (Simple clean SVG) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">7-Day Study & Accuracy Distribution</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Daily Target: {user.dailyAvailableHours}h</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-6 items-end h-44 border-b border-slate-800 pb-2">
          {analytics.weeklyActivity.map((w) => {
            const heightPercent = Math.min(100, Math.round((w.hours / 7) * 100));
            return (
              <div key={w.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                  {w.hours}h ({w.accuracy}%)
                </span>
                <div className="w-full max-w-[36px] bg-slate-950 rounded-lg overflow-hidden h-full flex items-end p-0.5 border border-slate-800/80">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-md transition-all group-hover:from-indigo-500 group-hover:to-cyan-400"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-400 font-mono">{w.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak vs Strong Topics Diagnostic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong topics */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Mastered & High-Retention Topics</span>
          </div>
          <div className="space-y-2">
            {analytics.strongTopics.map((st, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="text-slate-200 font-medium">{st}</span>
                <span className="text-emerald-400 font-mono font-bold">85%+ Mastery</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak topics */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>High Misconception & Weak Topics</span>
          </div>
          <div className="space-y-2">
            {analytics.weakTopics.map((wt, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="text-slate-200 font-medium">{wt}</span>
                <span className="text-rose-400 font-mono font-semibold">Priority Revision</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
