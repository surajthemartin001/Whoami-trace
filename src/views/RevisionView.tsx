import React, { useState } from 'react';
import { RevisionItem, SavedQuestion, Question } from '../types';
import { StorageService } from '../services/storage';
import {
  RotateCcw,
  Bookmark,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Play,
} from 'lucide-react';

interface RevisionViewProps {
  onStartRevisionSession: (questions: Question[]) => void;
  onOpenLyraPrompt: (prompt: string) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({
  onStartRevisionSession,
  onOpenLyraPrompt,
}) => {
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>(StorageService.getRevisionItems());
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>(StorageService.getSavedQuestions());

  const handleStartReview = () => {
    // Collect questions from saved items or generate from weak concepts
    const questions = savedQuestions.map((s) => s.question);
    if (questions.length > 0) {
      onStartRevisionSession(questions);
    } else {
      const fallback = StorageService.getQuestions().slice(0, 5);
      onStartRevisionSession(fallback);
    }
  };

  const handleRemoveSaved = (id: string) => {
    const updated = savedQuestions.filter((s) => s.id !== id);
    setSavedQuestions(updated);
    StorageService.saveSavedQuestions(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Active Spaced Revision Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated Leitner spaced repetition. Review weak concepts and saved book questions before memory decay.
          </p>
        </div>

        <button
          onClick={handleStartReview}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch Spaced Review ({savedQuestions.length > 0 ? savedQuestions.length : 5} Items)</span>
        </button>
      </div>

      {/* Spaced Intervals Pipeline Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-lg">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Spaced Repetition Stages (Memory Retention Index)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span>Stage 1 (24h)</span>
              <span className="font-mono text-indigo-400 font-bold">2 Due</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Immediate consolidation</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span>Stage 2 (3d)</span>
              <span className="font-mono text-emerald-400 font-bold">1 Due</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Intermittent recall</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span>Stage 3 (7d)</span>
              <span className="font-mono text-slate-400 font-bold">4 Stable</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Synaptic stabilization</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span>Stage 4 (30d)</span>
              <span className="font-mono text-purple-400 font-bold">12 Mastered</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Permanent retention</p>
          </div>
        </div>
      </div>

      {/* Two Columns: Due Today & Saved Questions Bank */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Due Concepts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Concepts Due for Active Recall</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">
              {revisionItems.length} CONCEPTS
            </span>
          </div>

          <div className="space-y-2.5">
            {revisionItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-slate-200">{item.conceptTitle}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{item.domain}</span>
                    <span>•</span>
                    <span className="font-mono text-indigo-400">Stage {item.stage}</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenLyraPrompt(`Explain concept: ${item.conceptTitle} and quiz me.`)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 transition"
                  title="LYRA Flashcard Quiz"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Saved Questions */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Bookmarked & Difficult Questions</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
              {savedQuestions.length} SAVED
            </span>
          </div>

          {savedQuestions.length > 0 ? (
            <div className="space-y-2.5">
              {savedQuestions.map((saved) => (
                <div
                  key={saved.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 line-clamp-2">
                      {saved.question.question}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>{saved.question.topic}</span>
                      <span>•</span>
                      <span className="text-emerald-400">Answer: {saved.question.options[saved.question.correctOptionIndex]}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveSaved(saved.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500 space-y-1">
              <Bookmark className="w-6 h-6 mx-auto opacity-40 text-indigo-400 mb-2" />
              <p>No questions bookmarked yet.</p>
              <p className="text-[11px] text-slate-600">
                Click "Save to Revision" during any practice or exam to review difficult questions here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
