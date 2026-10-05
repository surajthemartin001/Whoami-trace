import React, { useState } from 'react';
import { Goal, GoalMilestone } from '../types';
import { StorageService } from '../services/storage';
import {
  Target,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
} from 'lucide-react';

interface GoalsViewProps {
  goals: Goal[];
  onGoalsUpdated: (updated: Goal[]) => void;
  onOpenLyraPrompt: (prompt: string) => void;
}

const GoalProgressRing: React.FC<{ progress: number; size?: number }> = ({ progress, size = 46 }) => {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  const strokeColor = progress >= 75 ? '#34d399' : progress >= 45 ? '#818cf8' : '#fbbf24';

  return (
    <div
      className="relative inline-flex items-center justify-center select-none shrink-0"
      style={{ width: size, height: size }}
      title={`${progress}% completed`}
    >
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Subtle background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800"
        />
        {/* Subtle glowing circular progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Compact center percentage */}
      <span className="absolute text-[11px] font-mono font-bold text-white tracking-tight">
        {progress}%
      </span>
    </div>
  );
};

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onGoalsUpdated,
  onOpenLyraPrompt,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [naturalInput, setNaturalInput] = useState('');
  const [isAiStructuring, setIsAiStructuring] = useState(false);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(goals[0]?.id || null);

  // Form fields
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('Robotics & AI');
  const [newDeadline, setNewDeadline] = useState('2027-06-30');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const updated = goals.map((g) => {
      if (g.id !== goalId) return g;
      const updatedMilestones = g.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const progress = Math.round((completedCount / Math.max(1, updatedMilestones.length)) * 100);
      return { ...g, milestones: updatedMilestones, progressPercentage: progress };
    });
    StorageService.saveGoals(updated);
    onGoalsUpdated(updated);
  };

  const handleAiStructureGoal = async () => {
    if (!naturalInput.trim()) return;
    setIsAiStructuring(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Convert this user goal into a structured engineering goal with domain, title, and 4 logical milestones: "${naturalInput}"`,
          mode: 'standard',
        }),
      });
      const data = await res.json();

      const newGoal: Goal = {
        id: `goal_${Date.now()}`,
        title: naturalInput.length > 50 ? naturalInput.slice(0, 50) + '...' : naturalInput,
        description: data.text?.slice(0, 200) || naturalInput,
        domain: newDomain,
        targetDate: newDeadline,
        progressPercentage: 0,
        priority: newPriority,
        status: 'Active',
        milestones: [
          { id: `m_${Date.now()}_1`, title: 'Core Foundations & Mathematical Modeling', deadline: '2026-12-01', completed: false, order: 1 },
          { id: `m_${Date.now()}_2`, title: 'Prototyping & Test Architecture', deadline: '2027-02-15', completed: false, order: 2 },
          { id: `m_${Date.now()}_3`, title: 'Integration, Benchmarking & Stress Testing', deadline: '2027-04-30', completed: false, order: 3 },
          { id: `m_${Date.now()}_4`, title: 'Final Production Deployment & Verification', deadline: newDeadline, completed: false, order: 4 },
        ],
        requiredSkills: ['System Design', 'Algorithms', 'Hardware/Software Boundary'],
        requiredResources: ['Textbook Notes', 'PYQs'],
        createdAt: new Date().toISOString(),
      };

      const updated = [newGoal, ...goals];
      StorageService.saveGoals(updated);
      onGoalsUpdated(updated);
      setShowAddModal(false);
      setNaturalInput('');
    } catch {
      // Direct fallback
      const fallbackGoal: Goal = {
        id: `goal_${Date.now()}`,
        title: naturalInput,
        description: 'Structured personal goal created with WHO AM I? OS.',
        domain: newDomain,
        targetDate: newDeadline,
        progressPercentage: 0,
        priority: newPriority,
        status: 'Active',
        milestones: [
          { id: `m_${Date.now()}_1`, title: 'Foundation & Principles', deadline: '2026-12-01', completed: false, order: 1 },
          { id: `m_${Date.now()}_2`, title: 'Target Execution Phase', deadline: newDeadline, completed: false, order: 2 },
        ],
        requiredSkills: ['Core Engineering'],
        requiredResources: [],
        createdAt: new Date().toISOString(),
      };
      const updated = [fallbackGoal, ...goals];
      StorageService.saveGoals(updated);
      onGoalsUpdated(updated);
      setShowAddModal(false);
    } finally {
      setIsAiStructuring(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Personal Goals & Trajectory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Every user defines their own path. LYRA structures your vision into rigorous milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal (Natural Language)</span>
        </button>
      </div>

      {/* Goal Cards */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const isExpanded = expandedGoalId === goal.id;
          return (
            <div
              key={goal.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 transition shadow-lg"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {goal.domain}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md ${
                        goal.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {goal.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{goal.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{goal.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <GoalProgressRing progress={goal.progressPercentage} size={44} />
                  <button
                    onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title={isExpanded ? 'Collapse details' : 'Expand milestones'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-4">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${goal.progressPercentage}%` }}
                />
              </div>

              {/* Expanded Milestones & Details */}
              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                      Required Milestones ({goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length})
                    </span>
                    <button
                      onClick={() => onOpenLyraPrompt(`How can I accelerate completion of ${goal.title}?`)}
                      className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Ask LYRA for Strategy</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {goal.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleToggleMilestone(goal.id, m.id)}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between text-xs ${
                          m.completed
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span className={m.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                            {m.title}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">{m.deadline}</span>
                      </div>
                    ))}
                  </div>

                  {/* Required skills & resources tags */}
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="text-slate-500">Skills:</span>
                      {goal.requiredSkills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-[10px] font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Natural Language Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">Natural-Language Goal Creation</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300">
                  Describe what you want to achieve in natural language:
                </label>
                <textarea
                  rows={3}
                  value={naturalInput}
                  onChange={(e) => setNaturalInput(e.target.value)}
                  placeholder='e.g. "I want to become highly skilled in autonomous robotics and build a quadruped with edge AI perception by next spring."'
                  className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300">Domain / Field</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Robotics & AI">Robotics & AI</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Software Systems">Software Systems</option>
                    <option value="Hardware Architecture">Hardware Architecture</option>
                    <option value="Mathematics & Physics">Mathematics & Physics</option>
                    <option value="Venture & Leadership">Venture & Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300">Target Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleAiStructureGoal}
                disabled={isAiStructuring || !naturalInput.trim()}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg"
              >
                {isAiStructuring ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>LYRA Structuring Hierarchy & Milestones...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Structure Goal with LYRA AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
