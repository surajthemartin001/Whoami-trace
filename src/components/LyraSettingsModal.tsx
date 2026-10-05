import React, { useState } from 'react';
import {
  LyraConfig,
  LyraMood,
  LyraPersonalityPreset,
  LyraPersonalitySliders,
  LyraVoiceProvider,
  LyraMemoryItem,
} from '../types';
import { StorageService, DEFAULT_LYRA_CONFIG } from '../services/storage';
import { LyraAvatar } from './LyraAvatar';
import {
  Sliders,
  Smile,
  Volume2,
  Brain,
  Globe,
  Radio,
  Sparkles,
  Check,
  Play,
  RotateCcw,
  Trash2,
  Plus,
  Shield,
  X,
  Loader2,
  Key,
} from 'lucide-react';

interface LyraSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LyraConfig;
  onSaveConfig: (updated: LyraConfig) => void;
}

export const LyraSettingsModal: React.FC<LyraSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'personality' | 'mood' | 'voice' | 'speech' | 'memory'>('mood');
  const [currentConfig, setCurrentConfig] = useState<LyraConfig>({ ...config });
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTestingCustomApi, setIsTestingCustomApi] = useState(false);
  const [newMemoryKey, setNewMemoryKey] = useState('');
  const [newMemoryValue, setNewMemoryValue] = useState('');

  if (!isOpen) return null;

  // Preset slider configurations
  const applyPreset = (preset: LyraPersonalityPreset) => {
    let sliders: LyraPersonalitySliders;
    switch (preset) {
      case 'PLAYFUL':
        sliders = { warmth: 90, humor: 85, energy: 90, directness: 60, verbosity: 55, formality: 20, encouragement: 85 };
        break;
      case 'COACH':
        sliders = { warmth: 75, humor: 40, energy: 90, directness: 85, verbosity: 40, formality: 45, encouragement: 95 };
        break;
      case 'PROFESSIONAL':
        sliders = { warmth: 60, humor: 25, energy: 65, directness: 90, verbosity: 40, formality: 80, encouragement: 70 };
        break;
      case 'GENIUS':
        sliders = { warmth: 50, humor: 30, energy: 70, directness: 95, verbosity: 35, formality: 60, encouragement: 65 };
        break;
      case 'FRIENDLY':
      default:
        sliders = { warmth: 85, humor: 60, energy: 75, directness: 60, verbosity: 45, formality: 30, encouragement: 85 };
        break;
    }

    setCurrentConfig((prev) => ({
      ...prev,
      personalityPreset: preset,
      sliders,
    }));
  };

  const handleSliderChange = (key: keyof LyraPersonalitySliders, value: number) => {
    setCurrentConfig((prev) => ({
      ...prev,
      personalityPreset: 'CUSTOM',
      sliders: { ...prev.sliders, [key]: value },
    }));
  };

  const handlePreviewVoice = async (sampleStyle: 'normal' | 'question' | 'friendly' | 'focused' = 'friendly') => {
    setPreviewPlaying(true);
    try {
      const res = await fetch('/api/lyra/preview-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceName: currentConfig.voice.voiceName,
          sampleStyle,
        }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audio.onended = () => setPreviewPlaying(false);
        audio.play();
      } else {
        // Native fallback
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(data.text);
          u.lang = currentConfig.language === 'English' ? 'en-US' : 'hi-IN';
          u.rate = currentConfig.voice.speed;
          u.pitch = currentConfig.voice.pitch;
          u.onend = () => setPreviewPlaying(false);
          window.speechSynthesis.speak(u);
        } else {
          setPreviewPlaying(false);
        }
      }
    } catch {
      setPreviewPlaying(false);
    }
  };

  const handleTestCustomApi = async () => {
    setIsTestingCustomApi(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/lyra/test-custom-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerName: currentConfig.voice.customApiConfig?.providerName || 'Custom Provider',
          voiceId: currentConfig.voice.customApiConfig?.voiceId || 'LYRA-Custom-01',
        }),
      });
      const data = await res.json();
      setTestResult(data.message || 'Connection verified.');
    } catch {
      setTestResult('Unable to reach custom voice endpoint.');
    } finally {
      setIsTestingCustomApi(false);
    }
  };

  const handleAddMemory = () => {
    if (!newMemoryKey.trim() || !newMemoryValue.trim()) return;
    const item: LyraMemoryItem = {
      id: `mem_${Date.now()}`,
      key: newMemoryKey.trim(),
      value: newMemoryValue.trim(),
      category: 'learning_preference',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCurrentConfig((prev) => ({
      ...prev,
      memories: [...prev.memories, item],
    }));
    setNewMemoryKey('');
    setNewMemoryValue('');
  };

  const handleDeleteMemory = (id: string) => {
    setCurrentConfig((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
  };

  const handleSave = () => {
    StorageService.saveLyraConfig(currentConfig);
    onSaveConfig(currentConfig);
    onClose();
  };

  const handleReset = () => {
    setCurrentConfig(DEFAULT_LYRA_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full h-[90vh] max-h-[820px] flex flex-col overflow-hidden text-white shadow-2xl relative">
        {/* Header with Avatar & Live Expression Preview */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3.5">
            <LyraAvatar state={previewPlaying ? 'speaking' : 'idle'} mood={currentConfig.currentMood} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">LYRA Personalization Suite</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Mood: {currentConfig.currentMood}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tune personality, conversational mood, voice parameters, and memory.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Strip */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'mood', label: 'Mood System', icon: Smile },
            { id: 'personality', label: 'Personality Sliders', icon: Sliders },
            { id: 'voice', label: 'Voice & Provider', icon: Volume2 },
            { id: 'speech', label: 'Speech Controls', icon: Radio },
            { id: 'memory', label: 'Personalization Memory', icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: MOOD SYSTEM */}
          {activeTab === 'mood' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Select Conversational Mood</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Changes presentation style, humor, and response pacing without changing factual calculations.
                  </p>
                </div>

                {/* Adaptive Mood Toggle */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                  <span className="text-slate-300 font-medium">Adaptive Mood:</span>
                  <button
                    onClick={() =>
                      setCurrentConfig((prev) => ({ ...prev, adaptiveMood: !prev.adaptiveMood }))
                    }
                    className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold transition ${
                      currentConfig.adaptiveMood
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {currentConfig.adaptiveMood ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Mood Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    id: 'HAPPY',
                    name: 'HAPPY (Default)',
                    badge: '✨ Cheerful & Enthusiastic',
                    desc: 'Positive, energetic, expressive and warmly supportive on every task.',
                    example: '"Hey Suraj! Great momentum today, let\'s tackle algorithms together!"',
                    color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
                  },
                  {
                    id: 'PLAYFUL',
                    name: 'PLAYFUL',
                    badge: '😄 Light Jokes & Teasing',
                    desc: 'Casual humor, friendly jokes, and lively conversational reactions.',
                    example: '"Okay, that\'s an ambitious plan 😄. Let\'s see if your calendar agrees with you!"',
                    color: 'border-pink-500/40 bg-pink-950/20 text-pink-300',
                  },
                  {
                    id: 'CALM',
                    name: 'CALM',
                    badge: '🌿 Composed & Patient',
                    desc: 'Soft, unhurried, patient pacing. Ideal for unwinding or analyzing mistakes without pressure.',
                    example: '"Let\'s slow this down and look at the actual situation first."',
                    color: 'border-teal-500/40 bg-teal-950/20 text-teal-300',
                  },
                  {
                    id: 'FOCUSED',
                    name: 'FOCUSED',
                    badge: '🎯 Direct & Concise',
                    desc: 'Execution-driven, minimal chatter, sharp clarity on goals and immediate tasks.',
                    example: '"You have 3 hours today. We should prioritize algorithms and the pending practice set."',
                    color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
                  },
                  {
                    id: 'MOTIVATOR',
                    name: 'MOTIVATOR',
                    badge: '🚀 Relentless Encouragement',
                    desc: 'High-octane drive, inspires consistency, and pushes through cognitive fatigue.',
                    example: '"Consistency is where champions are built, Suraj! 1% daily compounding creates mastery."',
                    color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
                  },
                  {
                    id: 'SERIOUS',
                    name: 'SERIOUS',
                    badge: '📊 Analytical & Professional',
                    desc: 'Strictly objective, formal, and critical on milestones and timeline feasibility.',
                    example: '"Your current timeline is not realistic under the available weekly hours."',
                    color: 'border-slate-600 bg-slate-950 text-slate-300',
                  },
                ].map((m) => {
                  const isSelected = currentConfig.currentMood === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setCurrentConfig((prev) => ({ ...prev, currentMood: m.id as LyraMood }))}
                      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                        isSelected
                          ? `${m.color} ring-1 ring-white/20 shadow-lg`
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{m.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] font-mono opacity-80 block">{m.badge}</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
                      <p className="text-[11px] italic text-slate-400/90 pt-1 border-t border-slate-800/60">
                        {m.example}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PERSONALITY PRESETS & SLIDERS */}
          {activeTab === 'personality' && (
            <div className="space-y-6 text-xs">
              <div>
                <h4 className="text-sm font-bold text-white">Personality Presets</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(['FRIENDLY', 'PLAYFUL', 'COACH', 'PROFESSIONAL', 'GENIUS', 'CUSTOM'] as const).map(
                    (preset) => (
                      <button
                        key={preset}
                        onClick={() => applyPreset(preset)}
                        className={`px-3 py-1.5 rounded-xl border font-semibold transition ${
                          currentConfig.personalityPreset === preset
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {preset}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Fine-Tuning Personality Weights (0–100%)
                </span>

                {[
                  { key: 'warmth', label: 'Warmth & Empathy', desc: 'Friendly tone and welcoming presence' },
                  { key: 'humor', label: 'Humor & Wit', desc: 'Frequency of light jokes and witty remarks' },
                  { key: 'energy', label: 'Conversational Energy', desc: 'Liveliness and dynamic expression' },
                  { key: 'directness', label: 'Directness & Candor', desc: 'How straightforwardly tasks are stated' },
                  { key: 'verbosity', label: 'Verbosity / Length', desc: 'Concise short bullets vs descriptive answers' },
                  { key: 'formality', label: 'Formality Level', desc: 'Casual conversational vs structured language' },
                  { key: 'encouragement', label: 'Encouragement Drive', desc: 'Motivational reinforcement and praise' },
                ].map((slider) => {
                  const val = currentConfig.sliders[slider.key as keyof LyraPersonalitySliders];
                  return (
                    <div key={slider.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{slider.label}</span>
                        <span className="font-mono text-indigo-400 font-bold">{val}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={val}
                        onChange={(e) =>
                          handleSliderChange(slider.key as keyof LyraPersonalitySliders, Number(e.target.value))
                        }
                        className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500">{slider.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: VOICE & PROVIDER */}
          {activeTab === 'voice' && (
            <div className="space-y-5 text-xs">
              <div>
                <h4 className="text-sm font-bold text-white">Voice Provider Architecture</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multi-provider abstraction: switch between Cloud TTS, Native Browser, or External API.
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { id: 'cloud_tts', label: 'Cloud TTS (Gemini/Studio)' },
                    { id: 'native_browser', label: 'Native Browser Voice' },
                    { id: 'custom_api', label: 'Custom Voice API' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        setCurrentConfig((prev) => ({
                          ...prev,
                          voice: { ...prev.voice, provider: p.id as LyraVoiceProvider },
                        }))
                      }
                      className={`p-2.5 rounded-xl border font-semibold transition text-center ${
                        currentConfig.voice.provider === p.id
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Name Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium">Select Voice Character</label>
                  <select
                    value={currentConfig.voice.voiceName}
                    onChange={(e) =>
                      setCurrentConfig((prev) => ({
                        ...prev,
                        voice: { ...prev.voice, voiceName: e.target.value },
                      }))
                    }
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Kore">Kore (Warm, Melodic, Futuristic)</option>
                    <option value="Zephyr">Zephyr (Bright, Crisp, Intelligent)</option>
                    <option value="Puck">Puck (Energetic, Playful, Agile)</option>
                    <option value="Charon">Charon (Calm, Deep, Measured)</option>
                    <option value="Fenrir">Fenrir (Authoritative, Focused)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Speaking Speed ({currentConfig.voice.speed}x)</label>
                  <input
                    type="range"
                    min="0.75"
                    max="1.5"
                    step="0.05"
                    value={currentConfig.voice.speed}
                    onChange={(e) =>
                      setCurrentConfig((prev) => ({
                        ...prev,
                        voice: { ...prev.voice, speed: Number(e.target.value) },
                      }))
                    }
                    className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer mt-3"
                  />
                </div>
              </div>

              {/* Custom Voice API Settings */}
              {currentConfig.voice.provider === 'custom_api' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold">
                    <Key className="w-4 h-4" />
                    <span>External Custom Voice Credentials</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400">Provider Service Name</label>
                      <input
                        type="text"
                        value={currentConfig.voice.customApiConfig?.providerName || 'ElevenLabs / Custom REST'}
                        onChange={(e) =>
                          setCurrentConfig((prev) => ({
                            ...prev,
                            voice: {
                              ...prev.voice,
                              customApiConfig: {
                                ...(prev.voice.customApiConfig || {
                                  providerName: '',
                                  apiKeyMasked: 'sk-••••••••••••••••',
                                  voiceId: 'v1_lyra_01',
                                  modelId: 'tts-v2',
                                  isConnected: true,
                                }),
                                providerName: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400">Custom Voice ID</label>
                      <input
                        type="text"
                        value={currentConfig.voice.customApiConfig?.voiceId || '21m00Tcm4TlvDq8ikWAM'}
                        onChange={(e) =>
                          setCurrentConfig((prev) => ({
                            ...prev,
                            voice: {
                              ...prev.voice,
                              customApiConfig: {
                                ...(prev.voice.customApiConfig || {
                                  providerName: 'Custom',
                                  apiKeyMasked: 'sk-••••••••••••••••',
                                  voiceId: '',
                                  modelId: 'tts-v2',
                                  isConnected: true,
                                }),
                                voiceId: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleTestCustomApi}
                      disabled={isTestingCustomApi}
                      className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition"
                    >
                      {isTestingCustomApi && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Test Connection</span>
                    </button>
                    {testResult && <span className="text-[11px] text-emerald-400 font-mono">{testResult}</span>}
                  </div>
                </div>
              )}

              {/* Voice Preview Controls */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-indigo-300">Voice Multi-Style Preview</span>
                  <p className="text-[11px] text-slate-400">Listen to sample cadence, pitch, and mood pacing.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePreviewVoice('friendly')}
                    disabled={previewPlaying}
                    className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Friendly Sample</span>
                  </button>
                  <button
                    onClick={() => handlePreviewVoice('focused')}
                    disabled={previewPlaying}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
                  >
                    <span>Focused Sample</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPEECH CONTROLS */}
          {activeTab === 'speech' && (
            <div className="space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white">Live Conversation & Speech Controls</h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200">Auto Speak Responses</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Read LYRA responses out loud automatically.</p>
                  </div>
                  <button
                    onClick={() =>
                      setCurrentConfig((prev) => ({
                        ...prev,
                        voice: { ...prev.voice, autoSpeak: !prev.voice.autoSpeak },
                      }))
                    }
                    className={`px-3 py-1 rounded-lg font-mono font-bold text-[11px] transition ${
                      currentConfig.voice.autoSpeak
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {currentConfig.voice.autoSpeak ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200">Barge-in / Interruptible</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Stop LYRA speaking when user begins talking.</p>
                  </div>
                  <button
                    onClick={() =>
                      setCurrentConfig((prev) => ({
                        ...prev,
                        voice: { ...prev.voice, interruptible: !prev.voice.interruptible },
                      }))
                    }
                    className={`px-3 py-1 rounded-lg font-mono font-bold text-[11px] transition ${
                      currentConfig.voice.interruptible
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {currentConfig.voice.interruptible ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200">Continuous Voice Conversation</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Keep microphone listening after each response.</p>
                  </div>
                  <button
                    onClick={() =>
                      setCurrentConfig((prev) => ({
                        ...prev,
                        voice: { ...prev.voice, continuousMode: !prev.voice.continuousMode },
                      }))
                    }
                    className={`px-3 py-1 rounded-lg font-mono font-bold text-[11px] transition ${
                      currentConfig.voice.continuousMode
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {currentConfig.voice.continuousMode ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PERSONALIZATION MEMORY */}
          {activeTab === 'memory' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Personalization Memory</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    User-approved communication preferences and learning style context remembered by LYRA.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setCurrentConfig((prev) => ({ ...prev, memoryEnabled: !prev.memoryEnabled }))
                  }
                  className={`px-3 py-1 rounded-lg font-mono font-bold text-[11px] transition ${
                    currentConfig.memoryEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentConfig.memoryEnabled ? 'MEMORY ACTIVE' : 'DISABLED'}
                </button>
              </div>

              {/* Memory List */}
              <div className="space-y-2">
                {currentConfig.memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-indigo-300">{mem.key}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {mem.category}
                        </span>
                      </div>
                      <p className="text-slate-300 mt-0.5 text-[11px]">{mem.value}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Delete memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Memory */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-300 text-xs">Add Custom User Preference to Memory</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Preference Key (e.g. Explanation Depth)"
                    value={newMemoryKey}
                    onChange={(e) => setNewMemoryKey(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Description (e.g. Skip basics, go straight to math)"
                    value={newMemoryValue}
                    onChange={(e) => setNewMemoryValue(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <button
                  onClick={handleAddMemory}
                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save to Memory</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Reset & Save Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset LYRA Preferences</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md"
            >
              Save Lyra Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
