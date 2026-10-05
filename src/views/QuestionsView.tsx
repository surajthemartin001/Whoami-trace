import React, { useState } from 'react';
import { Question } from '../types';
import { StorageService } from '../services/storage';
import {
  Search,
  Filter,
  Play,
  HelpCircle,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface QuestionsViewProps {
  onStartSession: (questions: Question[], title: string) => void;
  onOpenImport: () => void;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  onStartSession,
  onOpenImport,
}) => {
  const allQuestions = StorageService.getQuestions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [pyqOnly, setPyqOnly] = useState(false);

  const filtered = allQuestions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchesPyq = !pyqOnly || q.isPYQ;
    return matchesSearch && matchesDiff && matchesPyq;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Question Bank & PYQ Repository</h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable, deduplicated question catalog spanning verified exam PYQs, imported PDFs, and structured scenarios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStartSession(filtered, `Practice Set (${filtered.length} Questions)`)}
            disabled={filtered.length === 0}
            className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Practice Filtered ({filtered.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions, topics, sensors, or security exploits..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button
            onClick={() => setPyqOnly(!pyqOnly)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition whitespace-nowrap ${
              pyqOnly
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {pyqOnly ? '★ Showing PYQs Only' : 'Filter PYQ Only'}
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filtered.map((q, idx) => (
          <div
            key={q.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-3 transition shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300">
                  {q.domain}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                  {q.difficulty}
                </span>
                {q.isPYQ && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    Exam PYQ {q.examYear}
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-500 font-mono">Topic: {q.topic}</span>
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
              {q.question}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              {q.options.map((opt, oIdx) => (
                <div
                  key={oIdx}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    oIdx === q.correctOptionIndex
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 font-medium'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded bg-slate-800 text-[10px] font-mono flex items-center justify-center font-bold shrink-0">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span className="truncate">{opt}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 truncate max-w-sm">
                Source: {q.source || 'Curated WHO AM I? Engine'}
              </span>

              <button
                onClick={() => onStartSession([q], `Question Drill: ${q.topic}`)}
                className="text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Practice Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-xs text-slate-500 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto opacity-40 text-indigo-400" />
            <p>No questions matched your search criteria.</p>
            <button
              onClick={onOpenImport}
              className="text-indigo-400 hover:underline font-semibold"
            >
              Import new question PDFs or question sheets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
