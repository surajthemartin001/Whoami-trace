import React, { useState } from 'react';
import { Question, QuestionPack } from '../types';
import { StorageService } from '../services/storage';
import {
  Play,
  Sliders,
  Sparkles,
  BookOpen,
  HelpCircle,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface PracticeViewProps {
  onStartSession: (questions: Question[], title: string) => void;
  onOpenLyraPrompt: (prompt: string) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  onStartSession,
  onOpenLyraPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'practice' | 'study' | 'book'>('practice');

  // Level 1: Field / Domain
  const [selectedDomain, setSelectedDomain] = useState('Robotics & AI');
  // Level 2: Subject & Topic
  const [selectedSubject, setSelectedSubject] = useState('Sensors & Perception');
  const [selectedTopic, setSelectedTopic] = useState('LiDAR & IMU Fusion');
  // Level 3: Practice Configuration
  const [questionCount, setQuestionCount] = useState(20);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Hard');
  const [sourceMix, setSourceMix] = useState<'mixed' | 'imported' | 'ai' | 'pyq' | 'weak_only'>('mixed');
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([
    'single_mcq',
    'multiple_mcq',
    'assertion_reason',
    'scenario',
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const toggleType = (t: string) => {
    setSelectedQuestionTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleLaunchPack = async (packType: string, overrideCount?: number) => {
    setIsGenerating(true);
    const count = overrideCount || questionCount;

    try {
      const res = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: selectedDomain,
          subject: selectedSubject,
          topic: selectedTopic,
          count,
          difficulty,
          questionTypes: selectedQuestionTypes,
          focusWeakAreas: sourceMix === 'weak_only',
        }),
      });

      const data = await res.json();
      const generatedQs: Question[] = data.questions || [];

      // Combine with local bank if needed
      const localBank = StorageService.getQuestions();
      const pool = [...generatedQs, ...localBank].slice(0, count);

      onStartSession(pool, `${selectedDomain}: ${selectedTopic} (${count} Questions)`);
    } catch {
      // Fallback from local storage
      const fallback = StorageService.getQuestions().slice(0, count);
      onStartSession(fallback, `${selectedDomain}: Practice Pack (${fallback.length} Questions)`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Adaptive Practice & Question Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Universal 3-level question customization across imported resources, AI generation, and PYQs.
          </p>
        </div>

        {/* Mode Switcher: Practice | Study | Book */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-2xl text-xs">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'practice'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Practice Mode
          </button>
          <button
            onClick={() => setActiveTab('study')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'study'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Study Mode
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'book'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Book Mode
          </button>
        </div>
      </div>

      {/* Preset Fast Packs */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2 px-1">
          Instant Question Packs
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleLaunchPack('quick_20', 20)}
            disabled={isGenerating}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition text-left group"
          >
            <div className="text-xs font-bold text-white group-hover:text-indigo-300">20-Question Sprint</div>
            <p className="text-[11px] text-slate-400 mt-1">High-yield concepts (15 min)</p>
          </button>

          <button
            onClick={() => handleLaunchPack('pack_50', 50)}
            disabled={isGenerating}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/60 transition text-left group"
          >
            <div className="text-xs font-bold text-white group-hover:text-purple-300">50-Question Pack</div>
            <p className="text-[11px] text-slate-400 mt-1">Comprehensive chapter drill</p>
          </button>

          <button
            onClick={() => {
              setSourceMix('weak_only');
              handleLaunchPack('weak_pack', 25);
            }}
            disabled={isGenerating}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/60 transition text-left group"
          >
            <div className="text-xs font-bold text-white group-hover:text-rose-300">Weak-Topic Targeted</div>
            <p className="text-[11px] text-slate-400 mt-1">Error patterns & missteps</p>
          </button>

          <button
            onClick={() => {
              setSourceMix('pyq');
              handleLaunchPack('pyq_pack', 30);
            }}
            disabled={isGenerating}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 transition text-left group"
          >
            <div className="text-xs font-bold text-white group-hover:text-amber-300">PYQ Exam Set</div>
            <p className="text-[11px] text-slate-400 mt-1">Verified past problems</p>
          </button>
        </div>
      </div>

      {/* 3-LEVEL CUSTOMIZATION ENGINE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">Three-Level Practice Customization</h2>
        </div>

        {/* LEVEL 1: FIELD / DOMAIN */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
            Level 1 — Field / Domain
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              'Robotics & AI',
              'Cybersecurity',
              'Systems Architecture',
              'Embedded C++',
              'Electronics & Hardware',
              'Mathematics & Physics',
              'Venture Engineering',
            ].map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  selectedDomain === domain
                    ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* LEVEL 2: SUBJECT / CHAPTER / TOPIC */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
            Level 2 — Subject / Chapter / Topic
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium">Subject / Chapter</label>
              <input
                type="text"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">Specific Topic / Subtopic</label>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* LEVEL 3: PRACTICE CONFIGURATION */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
            Level 3 — Practice Configuration
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-medium">Question Count</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value={10}>10 Questions</option>
                <option value={20}>20 Questions (Standard)</option>
                <option value={50}>50 Questions (Comprehensive)</option>
                <option value={60}>60 Questions (Exam Simulation)</option>
                <option value={100}>100 Questions (Mastery Drill)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-medium">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="Easy">Easy (Foundational)</option>
                <option value="Medium">Medium (Application)</option>
                <option value="Hard">Hard (Deep Reasoning & Edge Cases)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-medium">Question Source Mix</label>
              <select
                value={sourceMix}
                onChange={(e) => setSourceMix(e.target.value as any)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="mixed">Mixed (Imported + AI-Generated)</option>
                <option value="imported">Imported Resources Only</option>
                <option value="ai">AI-Generated Reasoning Only</option>
                <option value="pyq">Previous Year Questions Only</option>
                <option value="weak_only">Weak Topics & Past Mistakes Only</option>
              </select>
            </div>
          </div>

          {/* Question Types Checkbox Chips */}
          <div className="pt-2">
            <label className="text-slate-400 font-medium">Allowed Question Types:</label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {[
                { id: 'single_mcq', label: 'Single MCQ' },
                { id: 'multiple_mcq', label: 'Multiple Answer' },
                { id: 'assertion_reason', label: 'Assertion & Reason' },
                { id: 'scenario', label: 'Scenario / System' },
                { id: 'coding', label: 'Coding / Problem Solving' },
                { id: 'numerical', label: 'Numerical / Calculations' },
              ].map((item) => {
                const active = selectedQuestionTypes.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleType(item.id)}
                    className={`px-3 py-1 rounded-lg border transition ${
                      active
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <button
          onClick={() => handleLaunchPack('custom')}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-xl"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Synthesizing Tailored Question Pack...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Personalized Practice Pack ({questionCount} Questions)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
