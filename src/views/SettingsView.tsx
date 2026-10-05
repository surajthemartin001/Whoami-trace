import React from 'react';
import { UserProfile, IntensityConfig, LyraConfig, LyraMood } from '../types';
import { StorageService } from '../services/storage';
import { LyraAvatar } from '../components/LyraAvatar';
import {
  ShieldAlert,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Sliders,
  Volume2,
  Smile,
  Brain,
  Radio,
  ArrowRight,
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  onUserUpdated: (u: UserProfile) => void;
  onOpenReassessment: () => void;
  lyraConfig: LyraConfig;
  onUpdateLyraConfig: (c: LyraConfig) => void;
  onOpenLyraSettings: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUserUpdated,
  onOpenReassessment,
  lyraConfig,
  onUpdateLyraConfig,
  onOpenLyraSettings,
}) => {
  const current = user.currentIntensity;
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(current.lockedUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const handleUpdateLanguage = (lang: 'Hindi' | 'English' | 'Hinglish') => {
    const updatedUser = { ...user, preferredLanguage: lang };
    StorageService.saveUserProfile(updatedUser);
    onUserUpdated(updatedUser);

    const updatedLyra = { ...lyraConfig, language: lang };
    StorageService.saveLyraConfig(updatedLyra);
    onUpdateLyraConfig(updatedLyra);
  };

  const handleQuickMoodChange = (mood: LyraMood) => {
    const updated = { ...lyraConfig, currentMood: mood };
    StorageService.saveLyraConfig(updated);
    onUpdateLyraConfig(updated);
  };

  const handleToggleAdaptive = () => {
    const updated = { ...lyraConfig, adaptiveMood: !lyraConfig.adaptiveMood };
    StorageService.saveLyraConfig(updated);
    onUpdateLyraConfig(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">System Settings & Intensity Architecture</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure workload intensity, circadian lock duration, early reassessment, and LYRA's personality, mood & voice system.
        </p>
      </div>

      {/* LYRA ADVANCED CUSTOMIZATION HUB */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <LyraAvatar state="idle" mood={lyraConfig.currentMood} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">LYRA Personality, Mood & Voice Suite</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Mood: {lyraConfig.currentMood}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Natural, warm, expressive AI companion with multi-provider voice and adaptive mood intelligence.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenLyraSettings}
            className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md shrink-0"
          >
            <Sliders className="w-4 h-4" />
            <span>Open Advanced Lyra Settings</span>
          </button>
        </div>

        {/* Quick Mood Controls */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Active Conversational Mood
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Adaptive Mood:</span>
              <button
                onClick={handleToggleAdaptive}
                className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold transition ${
                  lyraConfig.adaptiveMood ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {lyraConfig.adaptiveMood ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
            {(['HAPPY', 'PLAYFUL', 'CALM', 'FOCUSED', 'MOTIVATOR', 'SERIOUS'] as LyraMood[]).map((m) => {
              const active = lyraConfig.currentMood === m;
              return (
                <button
                  key={m}
                  onClick={() => handleQuickMoodChange(m)}
                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition text-center ${
                    active
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice & Memory Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Voice Engine:</span>
            </div>
            <div className="font-semibold text-slate-200">
              {lyraConfig.voice.voiceName} ({lyraConfig.voice.provider === 'cloud_tts' ? 'Cloud TTS 24kHz' : 'Browser/Custom'})
            </div>
            <span className="text-[10px] text-slate-500">Speed: {lyraConfig.voice.speed}x • Auto-Speak: {lyraConfig.voice.autoSpeak ? 'ON' : 'OFF'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Personality Preset:</span>
            </div>
            <div className="font-semibold text-purple-300">{lyraConfig.personalityPreset}</div>
            <span className="text-[10px] text-slate-500">Warmth: {lyraConfig.sliders.warmth}% • Humor: {lyraConfig.sliders.humor}%</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <Brain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Personalization Memory:</span>
            </div>
            <div className="font-semibold text-emerald-300">
              {lyraConfig.memoryEnabled ? `${lyraConfig.memories.length} Preferences Stored` : 'Disabled'}
            </div>
            <span className="text-[10px] text-slate-500">Zero sensitive data stored</span>
          </div>
        </div>
      </div>

      {/* Active Intensity Lock Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                <Lock className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-semibold">
                Circadian Habit Safeguard Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {current.name} • {current.lockDurationDays}-Day Lock
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Mode is locked for {current.lockDurationDays} days to build consistent neuro-cognitive habits.
              Remaining: <span className="font-bold text-white font-mono">{daysRemaining} days</span>.
            </p>
          </div>

          <button
            onClick={onOpenReassessment}
            className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-lg shrink-0"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock / Reassess Early</span>
          </button>
        </div>

        {/* Intensity Modes Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          {[
            {
              id: 'turtle',
              name: 'Turtle Mode',
              hours: '2 hrs/day',
              desc: 'Sustainable, low-pressure foundation.',
              active: current.mode === 'turtle',
            },
            {
              id: 'rabbit',
              name: 'Rabbit Mode',
              hours: '4 hrs/day',
              desc: 'Balanced, consistent weekly progress.',
              active: current.mode === 'rabbit',
            },
            {
              id: 'cheetah',
              name: 'Cheetah Mode',
              hours: '5 hrs/day',
              desc: 'High momentum with structured safeguards.',
              active: current.mode === 'cheetah',
            },
            {
              id: 'tiger',
              name: 'Tiger Mode',
              hours: '16–18 hrs/day',
              desc: 'Extreme Immersion & Relentless Execution. 6h sleep non-negotiable.',
              active: current.mode === 'tiger',
            },
          ].map((mode) => (
            <div
              key={mode.id}
              className={`p-4 rounded-2xl border transition space-y-2 ${
                mode.active
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                  : 'bg-slate-950 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>{mode.name}</span>
                {mode.active && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500 text-white">
                    CURRENT
                  </span>
                )}
              </div>
              <div className="font-mono text-indigo-400 font-semibold">{mode.hours}</div>
              <p className="text-[11px] text-slate-400">{mode.desc}</p>
            </div>
          ))}
        </div>

        {/* Lock Duration Info */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Configured Lock Cycle: {current.lockDurationDays} Days (7-day or 30-day selectable upon reassessment).</span>
          <span className="text-slate-300 font-mono">Until {new Date(current.lockedUntil).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg text-xs">
        <h3 className="text-sm font-bold text-white">Language & Localization</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-400 font-medium">LYRA Primary Conversational Language</label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {(['Hindi', 'Hinglish', 'English'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => handleUpdateLanguage(l)}
                  className={`py-2 px-3 rounded-xl border font-semibold transition ${
                    user.preferredLanguage === l
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {l === 'Hindi' ? 'हिंदी (Hindi)' : l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium">Audio Output Engine</label>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 mt-1.5 flex items-center justify-between">
              <span>gemini-3.8-flash-lite-tts (Native WAV 24kHz)</span>
              <span className="text-emerald-400 font-mono">Ready ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
