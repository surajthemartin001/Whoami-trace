import React, { useState } from 'react';
import { Resource } from '../types';
import {
  FolderUp,
  FileText,
  Book,
  Globe,
  Upload,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ResourcesViewProps {
  resources: Resource[];
  onOpenImport: () => void;
  onOpenLyraPrompt: (prompt: string) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  onOpenImport,
  onOpenLyraPrompt,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = resources.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Resource Knowledge Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Import PDFs, books, syllabi, and notes. The Resource Agent extracts concepts, detects dependencies, and maps them directly to your curriculum.
          </p>
        </div>

        <button
          onClick={onOpenImport}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md"
        >
          <Upload className="w-4 h-4" />
          <span>Import & Customize</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'pdf', 'notes', 'pyq', 'external'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-full capitalize transition font-medium text-xs ${
              filterType === t
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t === 'all' ? 'All Resources' : t}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-3 transition shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-indigo-300">
                  {res.type}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">{res.dateAdded}</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{res.title}</h3>
              {res.contentPreview && (
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{res.contentPreview}</p>
              )}

              {/* Extracted Concepts */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Mapped Topics:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {res.extractedTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-slate-300"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>{res.conceptsCount} Concepts</span>
                <span>•</span>
                <span>{res.questionsCount} Questions</span>
              </div>

              <button
                onClick={() =>
                  onOpenLyraPrompt(
                    `इस resource (${res.title}) से 20 targeted practice questions बनाओ।`
                  )
                }
                className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px] font-medium"
              >
                <Sparkles className="w-3 h-3" />
                <span>Create Practice</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* External Educational Sources Notice */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Connect open educational sources, verified syllabi, and public catalogs (PW / LNF Open APIs) without paywall circumvention.
          </span>
        </div>
        <button
          onClick={onOpenImport}
          className="text-indigo-400 hover:underline flex items-center gap-1 whitespace-nowrap"
        >
          <span>Connect Connector</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
