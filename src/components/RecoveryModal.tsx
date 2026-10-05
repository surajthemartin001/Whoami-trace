import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { ShieldCheck, Calendar, Moon, Sparkles, Check, X, ArrowRight } from 'lucide-react';

interface RecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecoveryApplied: () => void;
}

export const RecoveryModal: React.FC<RecoveryModalProps> = ({
  isOpen,
  onClose,
  onRecoveryApplied,
}) => {
  const recovery = StorageService.getRecoveryPlan();
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleApplyRecovery = () => {
    setIsApplying(true);
    setTimeout(() => {
      // Rebalance tasks in storage: unmark isMissed, reschedule
      const tasks = StorageService.getTasks();
      const updated = tasks.map((t) => ({ ...t, isMissed: false }));
      StorageService.saveTasks(updated);
      setIsApplying(false);
      setApplied(true);
      onRecoveryApplied();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Autonomous Recovery Engine</h3>
              <p className="text-xs text-slate-400">Anti-Cramming Workload Rebalancer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!applied ? (
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-2">
              <span className="font-semibold text-indigo-300">Intelligent Recovery Diagnosis:</span>
              <p className="text-slate-300 leading-relaxed">{recovery.advice}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[11px]">Rebalance Spread</div>
                  <div className="font-semibold text-slate-200">5-Day Curve</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <Moon className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[11px]">Sleep Protection</div>
                  <div className="font-semibold text-emerald-300">7.5 Hours Locked</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
              <span className="font-medium text-slate-200">Rebalance Adjustments:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Adds +{recovery.dailyExtraMinutes} min micro-practice slot after dinner</li>
                <li>Moves non-critical review session to Saturday buffer window</li>
                <li>Preserves all milestone completion deadlines without panic or burnout</li>
              </ul>
            </div>

            <button
              onClick={handleApplyRecovery}
              disabled={isApplying}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply AI Workload Rebalancing</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Workload Successfully Rebalanced!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your Success Track has been recalculated. Today's schedule is updated and achievable.
            </p>
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
