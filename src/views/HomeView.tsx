import React, { useMemo } from 'react';
import { UserProfile, Goal, PlanTask, AnalyticsData, LyraMood } from '../types';
import { SuccessTrackBadge } from '../components/SuccessTrackBadge';
import { LyraAvatar } from '../components/LyraAvatar';
import { StorageService } from '../services/storage';
import {
  Play,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText,
  RotateCcw,
  Compass,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface HomeViewProps {
  user: UserProfile;
  goals: Goal[];
  tasks: PlanTask[];
  analytics: AnalyticsData;
  onNavigate: (section: string) => void;
  onOpenLyra: () => void;
  onOpenImport: () => void;
  onOpenPractice: () => void;
  onOpenRecovery: () => void;
  onTaskToggle: (taskId: string) => void;
  lyraMood?: LyraMood;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  goals,
  tasks,
  analytics,
  onNavigate,
  onOpenLyra,
  onOpenImport,
  onOpenPractice,
  onOpenRecovery,
  onTaskToggle,
  lyraMood = 'HAPPY',
}) => {
  const currentGoal = goals[0] || null;
  const missedTasks = tasks.filter((t) => !t.completed && t.isMissed);
  const nextTask = tasks.find((t) => !t.completed) || tasks[0];

  const contextualGreeting = useMemo(() => {
    return StorageService.getLyraGreeting(lyraMood, user.displayName, analytics.trackState);
  }, [lyraMood, user.displayName, analytics.trackState]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner: Greeting, Success Track status, and LYRA Fairy */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono text-indigo-400 font-semibold tracking-wider">
                WHO AM I? • Personal OS
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">{user.currentIntensity.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-indigo-200">{user.displayName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Target: <span className="font-semibold text-white">{currentGoal?.title || 'Physical AI & Robotics Mastery'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SuccessTrackBadge
              trackState={analytics.trackState}
              score={analytics.trackScore}
              onOpenRecovery={onOpenRecovery}
            />

            <button
              onClick={onOpenLyra}
              className="p-1 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition flex items-center gap-2 pr-3"
              title="Summon LYRA"
            >
              <LyraAvatar state="idle" size="sm" showBadge={false} />
              <span className="text-xs font-semibold text-indigo-300 hidden md:inline">Ask LYRA</span>
            </button>
          </div>
        </div>

        {/* LYRA Intelligent Briefing Alert with Mood-Aware Contextual Greeting */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60">
          <div className="flex items-center gap-2.5 text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong className="text-white font-medium">LYRA ({lyraMood}):</strong> {contextualGreeting}
            </span>
          </div>

          {missedTasks.length > 0 ? (
            <button
              onClick={onOpenRecovery}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{missedTasks.length} Delayed • Rebalance</span>
            </button>
          ) : (
            <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3 h-3" /> All tasks on track ✓
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Actions</h2>
          <span className="text-[11px] text-slate-500">Fast Execution Engine</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onOpenPractice}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition text-left flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Target Practice</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Start 25 MCQ pack</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('QUESTIONS')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition text-left flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">PYQ Bank</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Exam questions & solutions</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('REVISION')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition text-left flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Spaced Revision</div>
              <p className="text-[11px] text-slate-400 mt-0.5">2 concepts due today</p>
            </div>
          </button>

          <button
            onClick={onOpenImport}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition text-left flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Import & Customize</div>
              <p className="text-[11px] text-slate-400 mt-0.5">PDF, OCR, question packs</p>
            </div>
          </button>
        </div>
      </div>

      {/* Two Column Section: Immediate Priority & Today's Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Immediate Priority Card & Goal Progress */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                What Should I Do Now?
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">
                ACTIVE
              </span>
            </div>

            {nextTask ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-indigo-400 font-mono font-medium">{nextTask.timeSlot}</span>
                  <h4 className="text-sm font-semibold text-white mt-1 leading-snug">{nextTask.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <span>{nextTask.durationMinutes} mins</span>
                    <span>•</span>
                    <span className="capitalize">{nextTask.type} block</span>
                  </div>
                </div>

                <button
                  onClick={onOpenPractice}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Play className="w-4 h-4" />
                  <span>Execute Next Activity</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400">All planned blocks for today completed!</p>
            )}
          </div>

          {/* Current Goal Snapshot */}
          {currentGoal && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Primary Milestone
                </span>
                <button
                  onClick={() => onNavigate('GOALS')}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{currentGoal.title}</h4>
                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span className="font-mono text-white font-bold">{currentGoal.progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${currentGoal.progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>Target: {currentGoal.targetDate}</span>
                <span className="text-indigo-400 font-medium">Domain: {currentGoal.domain}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Today's Priorities & Schedule */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Today's Realistic Schedule</h3>
            </div>
            <button
              onClick={() => onNavigate('PLAN')}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onTaskToggle(task.id)}
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
                      className={`text-xs sm:text-sm font-medium ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono">{task.timeSlot}</span>
                      <span>•</span>
                      <span className="capitalize">{task.type}</span>
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
          </div>

          {/* Sleep and Break Guarantee Note */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>🛡️ Cognitive Safeguard: Minimum 7.5 hrs sleep & scheduled meal buffers protected.</span>
            <span className="text-emerald-400 font-mono">Protected ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
