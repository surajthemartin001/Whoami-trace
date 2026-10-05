import React, { useState } from 'react';
import { NEXORAProject } from '../types';
import { StorageService } from '../services/storage';
import {
  Cpu,
  Layers,
  Sparkles,
  Shield,
  Briefcase,
  Plus,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface NexoraViewProps {
  onOpenLyraPrompt: (prompt: string) => void;
}

export const NexoraView: React.FC<NexoraViewProps> = ({ onOpenLyraPrompt }) => {
  const [projects, setProjects] = useState<NEXORAProject[]>(StorageService.getNexoraProjects());
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = projects.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      const updatedM = p.milestones.map((m) =>
        m.id === milestoneId ? { ...m, done: !m.done } : m
      );
      const doneCount = updatedM.filter((m) => m.done).length;
      const progress = Math.round((doneCount / Math.max(1, updatedM.length)) * 100);
      return { ...p, milestones: updatedM, progress };
    });
    setProjects(updated);
    StorageService.saveNexoraProjects(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-purple-300 font-bold">
              NEXORA • Advanced Technology & Venture Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Autonomous Robotics & Systems Venture
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The private engineering sandbox designed to bridge personal learning into physical AI architectures, hardware intellectual property, and a scalable robotics venture.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800/80">
          <button
            onClick={() =>
              onOpenLyraPrompt(
                'NEXORA Project AETHER-IV के लिए LiDAR sensor fusion और motor torque curves का technical analysis करें।'
              )
            }
            className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEXORA AI Technical Review</span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        {['all', 'Robotics', 'Cybersecurity', 'AI Systems', 'Hardware/Embedded', 'Venture & Leadership'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full transition font-medium whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Venture Pillars' : cat}
            </button>
          )
        )}
      </div>

      {/* Projects List */}
      <div className="space-y-5">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 space-y-4 transition shadow-xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {project.category}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    Stage: {project.stage}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">{project.title}</h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-purple-400">{project.progress}% Complete</span>
                <div className="w-28 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{project.description}</p>

            {/* Technical Specifications */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Hardware & System Architecture Specs:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {project.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Venture Milestones */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Venture Milestones:
              </span>
              <div className="space-y-1.5">
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(project.id, m.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                      m.done
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {m.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className={m.done ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {m.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
