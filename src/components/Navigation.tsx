import React from 'react';
import {
  Home,
  Target,
  FolderUp,
  Calendar,
  Play,
  RotateCcw,
  HelpCircle,
  BarChart3,
  Cpu,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';
import { LyraAvatar } from './LyraAvatar';
import { LyraMood } from '../types';

export type NavigationSection =
  | 'HOME'
  | 'GOALS'
  | 'RESOURCES'
  | 'PLAN'
  | 'PRACTICE'
  | 'REVISION'
  | 'QUESTIONS'
  | 'ANALYTICS'
  | 'LYRA'
  | 'MY'
  | 'NEXORA'
  | 'SETTINGS';

interface NavigationProps {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
  onOpenLyra: () => void;
  trackScore: number;
  lyraMood?: LyraMood;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  onSelectSection,
  onOpenLyra,
  lyraMood = 'HAPPY',
}) => {
  const primaryNavItems: { id: NavigationSection; label: string; icon: React.FC<any> }[] = [
    { id: 'HOME', label: 'Home', icon: Home },
    { id: 'GOALS', label: 'Goals', icon: Target },
    { id: 'RESOURCES', label: 'Resources', icon: FolderUp },
    { id: 'PLAN', label: 'Plan', icon: Calendar },
    { id: 'PRACTICE', label: 'Practice', icon: Play },
    { id: 'REVISION', label: 'Revision', icon: RotateCcw },
    { id: 'QUESTIONS', label: 'Questions', icon: HelpCircle },
    { id: 'ANALYTICS', label: 'Analytics', icon: BarChart3 },
    { id: 'NEXORA', label: 'NEXORA', icon: Cpu },
    { id: 'MY', label: 'My', icon: User },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop / Tablet Header Nav Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectSection('HOME')}
              className="flex items-center gap-2 group text-left"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
                WHO AM I?
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    active
                      ? item.id === 'NEXORA'
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                        : 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* LYRA Quick Summon Action Button with Mood Indicator */}
          <button
            onClick={onOpenLyra}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-indigo-500/40 hover:border-indigo-400 text-white text-xs font-bold transition shadow-[0_0_12px_rgba(99,102,241,0.25)]"
          >
            <LyraAvatar state="idle" mood={lyraMood} size="sm" showBadge={false} />
            <div className="flex items-center gap-1.5 text-left">
              <span>LYRA</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-normal">
                {lyraMood}
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Fixed Nav Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
        {[
          { id: 'HOME', label: 'Home', icon: Home },
          { id: 'GOALS', label: 'Goals', icon: Target },
          { id: 'PLAN', label: 'Plan', icon: Calendar },
          { id: 'PRACTICE', label: 'Practice', icon: Play },
          { id: 'NEXORA', label: 'NEXORA', icon: Cpu },
          { id: 'MY', label: 'Profile', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const active = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id as NavigationSection)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
                active ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        {/* Mobile LYRA Floating button */}
        <button
          onClick={onOpenLyra}
          className="p-2 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center -mt-4 border-2 border-slate-950"
          title="Open LYRA AI"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </nav>
    </>
  );
};
