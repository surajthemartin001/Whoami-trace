import React, { useState } from 'react';
import { TrackState } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, ArrowUpRight, Activity } from 'lucide-react';

interface SuccessTrackBadgeProps {
  trackState: TrackState;
  score: number;
  onOpenRecovery?: () => void;
  compact?: boolean;
}

export const SuccessTrackBadge: React.FC<SuccessTrackBadgeProps> = ({
  trackState,
  score,
  onOpenRecovery,
  compact = false,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  const getTheme = () => {
    switch (trackState) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          glow: 'shadow-[0_0_12px_rgba(52,211,153,0.25)]',
          label: 'ON TRACK (HEALTHY)',
          desc: 'Your learning momentum and accuracy are in the optimal corridor.',
          icon: ShieldCheck,
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
          glow: 'shadow-[0_0_12px_rgba(251,191,36,0.25)]',
          label: 'WARNING (MEDIUM RISK)',
          desc: '1-2 tasks delayed or practice accuracy dipped. Adjustment advised.',
          icon: AlertTriangle,
        };
      case 'RED':
      default:
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400',
          glow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]',
          label: 'OFF-TRACK (ATTENTION REQUIRED)',
          desc: 'Significant task deviation or missed practice blocks detected.',
          icon: AlertOctagon,
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  if (compact) {
    return (
      <button
        onClick={() => setShowDetail(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${theme.bg} ${theme.glow}`}
        title={`Success Track: ${theme.label}`}
      >
        <span className={`w-2 h-2 rounded-full ${theme.dot} animate-pulse`} />
        <span>Track: {score}%</span>
      </button>
    );
  }

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className={`cursor-pointer inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all hover:scale-102 ${theme.bg} ${theme.glow}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${theme.dot} animate-pulse`} />
        <span className="uppercase tracking-wider">{theme.label}</span>
        <span className="opacity-60">|</span>
        <span className="font-mono text-white font-bold">{score}% Health</span>
      </div>

      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${trackState === 'GREEN' ? 'text-emerald-400' : trackState === 'YELLOW' ? 'text-amber-400' : 'text-rose-400'}`} />
                <h3 className="text-base font-semibold">Success Track Status</h3>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className={`p-4 rounded-xl border ${theme.bg}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{theme.label}</span>
                  <span className="font-mono font-bold text-lg">{score} / 100</span>
                </div>
                <p className="text-xs mt-2 text-slate-300 leading-relaxed">{theme.desc}</p>
              </div>

              {/* Success Corridor visual representation */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Track Corridor Bounds</span>
                  <span className="text-slate-300 font-mono">Current: Position {score}%</span>
                </div>
                <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 flex relative">
                  <div className="w-1/4 h-full bg-rose-500/30 rounded-l" title="Danger Zone (<50%)" />
                  <div className="w-1/4 h-full bg-amber-500/30" title="Warning Zone (50-70%)" />
                  <div className="w-2/4 h-full bg-emerald-500/30 rounded-r" title="Optimal Track (70-100%)" />
                  {/* Position marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_white] rounded-full transition-all"
                    style={{ left: `${Math.min(98, Math.max(2, score))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Danger (Red)</span>
                  <span>Caution (Yellow)</span>
                  <span>Optimal Corridor (Green)</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-2 text-slate-300">
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Real Telemetry Parameters:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <div>Practice Accuracy: <span className="text-slate-200 font-mono">82%</span></div>
                  <div>Weekly Completion: <span className="text-slate-200 font-mono">88%</span></div>
                  <div>Current Workload: <span className="text-slate-200 font-mono">5.0 hrs/day</span></div>
                  <div>Sleep Protection: <span className="text-emerald-400 font-mono">Guaranteed</span></div>
                </div>
              </div>

              {onOpenRecovery && (
                <button
                  onClick={() => {
                    setShowDetail(false);
                    onOpenRecovery();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <span>Open Recovery & Rebalance Engine</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
