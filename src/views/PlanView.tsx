import React, { useState } from 'react';
import { PlanTask, UserProfile } from '../types';
import { StorageService } from '../services/storage';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Shield,
  Loader2,
  RotateCcw,
} from 'lucide-react';

interface PlanViewProps {
  user: UserProfile;
  tasks: PlanTask[];
  onTasksUpdated: (tasks: PlanTask[]) => void;
  onOpenRecovery: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  user,
  tasks,
  onTasksUpdated,
  onOpenRecovery,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'longterm'>('daily');
  const [dailyHours, setDailyHours] = useState(user.dailyAvailableHours);
  const [daysPerWeek, setDaysPerWeek] = useState(user.daysAvailablePerWeek);
  const [deadlineDays, setDeadlineDays] = useState(60);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [unrealisticWarning, setUnrealisticWarning] = useState<string | null>(null);

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    StorageService.saveTasks(updated);
    onTasksUpdated(updated);
  };

  const handleRegeneratePlan = async () => {
    setIsGeneratingPlan(true);
    setUnrealisticWarning(null);

    try {
      const res = await fetch('/api/gemini/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availableDailyHours: dailyHours,
          daysAvailablePerWeek: daysPerWeek,
          deadlineDays,
          goals: ['Autonomous Robotics Physical AI', 'Advanced Systems Cybersecurity'],
        }),
      });

      const data = await res.json();

      if (data.isRealistic === false && data.unrealisticReason) {
        setUnrealisticWarning(data.unrealisticReason);
      }

      if (data.dailySchedule && Array.isArray(data.dailySchedule)) {
        const newTasks: PlanTask[] = data.dailySchedule.map((s: any, idx: number) => ({
          id: `task_gen_${Date.now()}_${idx}`,
          title: s.activity,
          type: s.type || 'learn',
          timeSlot: s.timeSlot || '10:00 - 11:30',
          durationMinutes: s.durationMinutes || 60,
          completed: false,
          date: new Date().toISOString().slice(0, 10),
          priority: 'High',
        }));

        StorageService.saveTasks(newTasks);
        onTasksUpdated(newTasks);
      }
    } catch {
      // Keep existing
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Time Architecture & Planning</h1>
          <p className="text-xs text-slate-400 mt-1">
            Realistic, circadian-safe scheduling. Generates sustainable long-term, weekly, and daily rhythms with zero blind cramming.
          </p>
        </div>

        <button
          onClick={handleRegeneratePlan}
          disabled={isGeneratingPlan}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md"
        >
          {isGeneratingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Re-Plan with Planning Agent</span>
        </button>
      </div>

      {/* Unrealistic Deadline Warning Notice if flagged by AI */}
      {unrealisticWarning && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold text-white">Unrealistic Deadline Detected:</span>
            <p className="mt-1 leading-relaxed text-amber-400/90">{unrealisticWarning}</p>
          </div>
        </div>
      )}

      {/* Planning Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="font-medium text-slate-300">Daily Dedicated Hours</label>
          <select
            value={dailyHours}
            onChange={(e) => setDailyHours(Number(e.target.value))}
            className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
          >
            <option value={2}>2 hrs / day (Turtle)</option>
            <option value={4}>4 hrs / day (Rabbit)</option>
            <option value={5}>5 hrs / day (Cheetah)</option>
            <option value={7}>7 hrs / day (Tiger Standard)</option>
            <option value={16}>16 hrs / day (Tiger Extreme Immersion)</option>
            <option value={18}>18 hrs / day (Tiger Relentless Ceiling - 6h Sleep Lock)</option>
          </select>
        </div>

        <div>
          <label className="font-medium text-slate-300">Days Active per Week</label>
          <select
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
          >
            <option value={5}>5 days (2 days full rest/buffer)</option>
            <option value={6}>6 days (1 day rest/buffer)</option>
            <option value={7}>7 days (Strict micro-breaks)</option>
          </select>
        </div>

        <div>
          <label className="font-medium text-slate-300">Target Milestone Horizon</label>
          <select
            value={deadlineDays}
            onChange={(e) => setDeadlineDays(Number(e.target.value))}
            className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
          >
            <option value={30}>30 Days (Sprint)</option>
            <option value={60}>60 Days (Quarterly Objective)</option>
            <option value={90}>90 Days (Deep Mastery)</option>
            <option value={180}>180 Days (Long-term Venture)</option>
          </select>
        </div>
      </div>

      {/* Tabs: Daily | Weekly | Long-Term */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['daily', 'weekly', 'longterm'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            {tab === 'daily' ? "Today's Execution" : tab === 'weekly' ? 'Weekly Rhythm' : 'Long-Term Trajectory'}
          </button>
        ))}
      </div>

      {activeTab === 'daily' && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="font-mono text-indigo-400">{task.timeSlot}</span>
                    <span>•</span>
                    <span className="capitalize">{task.type}</span>
                    <span>•</span>
                    <span>{task.durationMinutes} mins</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  task.priority === 'High'
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {task.priority}
              </span>
            </div>
          ))}

          {/* Biological / Rest Guarantee */}
          <div className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
            dailyHours >= 16
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
              : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
          }`}>
            <Shield className={`w-4 h-4 shrink-0 ${dailyHours >= 16 ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span>
              {dailyHours >= 16 ? (
                <>
                  <strong>Tiger Extreme Protocol ({dailyHours}h):</strong> Non-negotiable 6.0 hours continuous sleep locked for neuro-glymphatic memory consolidation. Strict 15-min ultradian breaks enforced every 90 minutes.
                </>
              ) : (
                <>
                  <strong>Circadian Rule:</strong> Plans strictly respect 7.5 hours of sleep, meal periods, and physical breaks. No inhuman schedules permitted.
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
            <div key={day} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-white">
                <span>{day}</span>
                <span className="font-mono text-indigo-400">{dailyHours} hrs</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {i % 2 === 0
                  ? 'Core Perception, LiDAR point clouds & Kalman derivation'
                  : 'Targeted MCQs, ROP chain exploitation & Spaced Revision'}
              </p>
            </div>
          ))}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs opacity-75">
            <div className="flex items-center justify-between font-semibold text-slate-300">
              <span>Sunday (Rest & Buffer)</span>
              <span className="font-mono text-emerald-400">Rest</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Protected buffer day. Used solely for light revision or emergency recovery rebalancing if needed.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'longterm' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">6-Month Strategic Milestone Map</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">Phase 1: Foundations & Sensor Fusion Math</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Target: Nov 2026</p>
              </div>
              <span className="text-emerald-400 font-mono font-semibold">Done ✓</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/40 flex items-center justify-between">
              <div>
                <span className="font-semibold text-indigo-200">Phase 2: Embedded RTOS & Quadruped Motor Architecture</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Target: Dec 2026</p>
              </div>
              <span className="text-indigo-400 font-mono font-semibold">Active (Cheetah)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between opacity-80">
              <div>
                <span className="font-semibold text-slate-300">Phase 3: Visual SLAM, Gait Dynamics & Edge AI Deployment</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Target: April 2027</p>
              </div>
              <span className="text-slate-500 font-mono">Upcoming</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
