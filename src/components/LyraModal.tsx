import React, { useState, useEffect, useRef } from 'react';
import { LyraAvatar, LyraAvatarState } from './LyraAvatar';
import { LyraMessage, LyraConfig, LyraMood } from '../types';
import { StorageService } from '../services/storage';
import { LyraSettingsModal } from './LyraSettingsModal';
import {
  Mic,
  MicOff,
  Video,
  Send,
  Sparkles,
  Zap,
  Brain,
  Globe,
  Sliders,
  Smile,
  Volume2,
  X,
  Play,
  Check,
  ChevronDown,
} from 'lucide-react';

interface LyraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction?: (action: any) => void;
  initialMessage?: string;
}

export const LyraModal: React.FC<LyraModalProps> = ({
  isOpen,
  onClose,
  onExecuteAction,
  initialMessage = '',
}) => {
  const [lyraConfig, setLyraConfig] = useState<LyraConfig>(StorageService.getLyraConfig());
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);

  const [messages, setMessages] = useState<LyraMessage[]>([
    {
      id: 'm_welcome',
      role: 'assistant',
      text: StorageService.getLyraGreeting(lyraConfig.currentMood, 'Suraj'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState(initialMessage);
  const [avatarState, setAvatarState] = useState<LyraAvatarState>('idle');
  const [selectedLanguage, setSelectedLanguage] = useState<'Hindi' | 'Hinglish' | 'English'>(
    lyraConfig.language || 'Hindi'
  );
  const [aiMode, setAiMode] = useState<'standard' | 'fast' | 'thinking' | 'search'>('standard');
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, avatarState]);

  // Sync config from storage when modal opens
  useEffect(() => {
    if (isOpen) {
      const cfg = StorageService.getLyraConfig();
      setLyraConfig(cfg);
      setSelectedLanguage(cfg.language);
    }
  }, [isOpen]);

  // Setup Web Speech Recognition for voice interaction
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'English' ? 'en-US' : 'hi-IN';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (event.results[event.results.length - 1].isFinal) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isVoiceCall && isListening) {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
          }
        }
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage, isVoiceCall]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setAvatarState('idle');
    } else {
      // Natural interruption: stop currently playing audio if interruptible
      if (lyraConfig.voice.interruptible && activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if ('speechSynthesis' in window && lyraConfig.voice.interruptible) {
        window.speechSynthesis.cancel();
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setAvatarState('listening');
        } catch {
          setIsListening(false);
        }
      } else {
        alert('Voice input is not supported in this browser. Please use text input.');
      }
    }
  };

  const handleSelectQuickMood = (m: LyraMood) => {
    const updated: LyraConfig = { ...lyraConfig, currentMood: m };
    setLyraConfig(updated);
    StorageService.saveLyraConfig(updated);
    setShowMoodDropdown(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    // Natural interruption: halt audio
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const userMsg: LyraMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setAvatarState('thinking');

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: selectedLanguage,
          mood: lyraConfig.currentMood,
          sliders: lyraConfig.sliders,
          adaptiveMood: lyraConfig.adaptiveMood,
          memories: lyraConfig.memoryEnabled ? lyraConfig.memories : [],
          mode: aiMode,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();
      setAvatarState('typing');

      setTimeout(() => {
        const assistantMsg: LyraMessage = {
          id: `msg_${Date.now()}_a`,
          role: 'assistant',
          text: data.text || 'मैं समझ गई। आपके अनुरोध पर कार्य किया जा रहा है।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: data.action,
          modelUsed: data.modelUsed,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setAvatarState('speaking');

        // Play voice response if in call OR autoSpeak is enabled
        if (isVoiceCall || isVideoCall || lyraConfig.voice.autoSpeak) {
          speakText(assistantMsg.text);
        } else {
          setTimeout(() => setAvatarState('idle'), 2000);
        }
      }, lyraConfig.voice.pauseBeforeResponseMs || 300);
    } catch {
      setAvatarState('error');
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}_err`,
          role: 'assistant',
          text: 'सम्पर्क में तकनीकी बाधा आई। आप ऑफ़लाइन प्रश्नों और अभ्यास का उपयोग जारी रख सकते हैं।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTimeout(() => setAvatarState('idle'), 2500);
    }
  };

  const speakText = async (text: string) => {
    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName: lyraConfig.voice.voiceName || 'Kore',
        }),
      });
      const data = await res.json();

      if (data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audio.playbackRate = lyraConfig.voice.speed || 1.0;
        audio.volume = (lyraConfig.voice.volume || 90) / 100;
        activeAudioRef.current = audio;

        audio.onplay = () => setAvatarState('speaking');
        audio.onended = () => {
          activeAudioRef.current = null;
          setAvatarState(isListening ? 'listening' : 'idle');
          if (lyraConfig.voice.continuousMode && isVoiceCall && recognitionRef.current && !isListening) {
            toggleListening();
          }
        };
        audio.play();
      } else {
        // Fallback to browser speech synthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = selectedLanguage === 'English' ? 'en-US' : 'hi-IN';
          utterance.rate = lyraConfig.voice.speed || 1.0;
          utterance.pitch = lyraConfig.voice.pitch || 1.0;
          utterance.onend = () => {
            setAvatarState(isListening ? 'listening' : 'idle');
          };
          window.speechSynthesis.speak(utterance);
        } else {
          setAvatarState('idle');
        }
      }
    } catch {
      setAvatarState('idle');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl h-[92vh] max-h-[820px] flex flex-col overflow-hidden shadow-2xl relative">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <LyraAvatar state={avatarState} mood={lyraConfig.currentMood} size="sm" showBadge />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white tracking-wide">LYRA</h3>

                  {/* QUICK MOOD SWITCHER DROPDOWN */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMoodDropdown(!showMoodDropdown)}
                      className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 hover:bg-indigo-500/30 transition"
                      title="Quick Change Mood"
                    >
                      <span>Mood: {lyraConfig.currentMood}</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>

                    {showMoodDropdown && (
                      <div className="absolute top-full left-0 mt-1.5 w-44 bg-slate-900 border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1 text-xs">
                        {(['HAPPY', 'PLAYFUL', 'CALM', 'FOCUSED', 'MOTIVATOR', 'SERIOUS'] as LyraMood[]).map(
                          (m) => (
                            <button
                              key={m}
                              onClick={() => handleSelectQuickMood(m)}
                              className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center justify-between text-[11px] transition ${
                                lyraConfig.currentMood === m
                                  ? 'bg-indigo-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <span>{m}</span>
                              {lyraConfig.currentMood === m && <Check className="w-3 h-3" />}
                            </button>
                          )
                        )}
                        <div className="pt-1 border-t border-slate-800 flex items-center justify-between px-2 text-[10px] text-slate-400">
                          <span>Adaptive:</span>
                          <span className={lyraConfig.adaptiveMood ? 'text-emerald-400' : 'text-slate-500'}>
                            {lyraConfig.adaptiveMood ? 'ON' : 'OFF'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {avatarState === 'thinking'
                    ? 'Wand waving: Synthesizing thoughts...'
                    : avatarState === 'speaking'
                    ? 'Speaking response...'
                    : avatarState === 'listening'
                    ? 'Listening actively...'
                    : `Active in ${lyraConfig.currentMood.toLowerCase()} mode`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Language dropdown */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-200 outline-hidden"
              >
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Hinglish">Hinglish</option>
                <option value="English">English</option>
              </select>

              {/* Voice Call Mode Button */}
              <button
                onClick={() => {
                  setIsVoiceCall(!isVoiceCall);
                  setIsVideoCall(false);
                  if (!isVoiceCall) {
                    toggleListening();
                  } else {
                    if (recognitionRef.current) recognitionRef.current.stop();
                    setIsListening(false);
                  }
                }}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
                  isVoiceCall
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Voice Call Mode"
              >
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Voice Call</span>
              </button>

              {/* Video Call Avatar Mode Button */}
              <button
                onClick={() => {
                  setIsVideoCall(!isVideoCall);
                  setIsVoiceCall(false);
                }}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
                  isVideoCall
                    ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Interactive Avatar Video Call"
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Video Call</span>
              </button>

              {/* LYRA Settings Modal Shortcut */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
                title="LYRA Personality & Voice Settings"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition ml-0.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Intelligence Mode Bar */}
          <div className="px-5 py-2 bg-slate-950/40 border-b border-slate-800/70 flex items-center justify-between text-xs overflow-x-auto gap-2">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Model Engine:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setAiMode('standard')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition ${
                  aiMode === 'standard'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
                title="gemini-3.5-flash for balanced assistance"
              >
                <Sparkles className="w-3 h-3" />
                <span>Standard (Flash)</span>
              </button>
              <button
                onClick={() => setAiMode('fast')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition ${
                  aiMode === 'fast'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
                title="gemini-3.1-flash-lite for ultra low-latency"
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>Fast (Lite)</span>
              </button>
              <button
                onClick={() => setAiMode('thinking')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition ${
                  aiMode === 'thinking'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
                title="gemini-3.1-pro-preview with ThinkingLevel.HIGH"
              >
                <Brain className="w-3 h-3 text-purple-300" />
                <span>High Thinking</span>
              </button>
              <button
                onClick={() => setAiMode('search')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition ${
                  aiMode === 'search'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
                title="gemini-3.5-flash with Google Search Grounding"
              >
                <Globe className="w-3 h-3 text-cyan-300" />
                <span>Search Grounded</span>
              </button>
            </div>
          </div>

          {/* Large Fairy Avatar Call Canvas if in call mode */}
          {(isVoiceCall || isVideoCall) && (
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/40 p-6 flex flex-col items-center justify-center border-b border-slate-800 shrink-0 relative overflow-hidden">
              <LyraAvatar state={avatarState} mood={lyraConfig.currentMood} size={isVideoCall ? 'xl' : 'lg'} />

              <div className="mt-3 text-center">
                <h4 className="text-base font-semibold text-white">LYRA Live Assistant</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isListening ? '🎙️ Listening actively — Speak naturally in Hindi or English' : 'Mic paused (Click mic to resume)'}
                </p>
              </div>

              {/* Audio Waveform Simulator */}
              <div className="flex items-center gap-1 h-6 mt-3">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      avatarState === 'speaking' || (isListening && avatarState === 'listening')
                        ? 'bg-indigo-400 animate-pulse'
                        : 'bg-slate-700 h-1.5'
                    }`}
                    style={{
                      height:
                        avatarState === 'speaking' || isListening
                          ? `${Math.max(6, Math.sin(i * 0.8) * 22 + 6)}px`
                          : '6px',
                    }}
                  />
                ))}
              </div>

              {/* In-Call Controls */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={toggleListening}
                  className={`p-3 rounded-full text-white transition ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  }`}
                  title={isListening ? 'Turn Listening OFF' : 'Turn Listening ON'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => {
                    setIsVoiceCall(false);
                    setIsVideoCall(false);
                    if (recognitionRef.current) recognitionRef.current.stop();
                    setIsListening(false);
                    setAvatarState('idle');
                  }}
                  className="px-4 py-2 bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-200 text-xs font-semibold rounded-full transition"
                >
                  End Call
                </button>
              </div>
            </div>
          )}

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && <LyraAvatar state="idle" mood={lyraConfig.currentMood} size="sm" showBadge={false} />}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-slate-800/80 text-slate-200 border border-slate-700/80 rounded-tl-xs shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    {/* Render Embedded Action if LYRA outputted one */}
                    {m.action && (
                      <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Action: {m.action.type || 'Recommended Step'}</span>
                        </div>
                        <button
                          onClick={() => onExecuteAction && onExecuteAction(m.action)}
                          className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Execute
                        </button>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400/80 mt-1.5 text-right font-mono">
                      {m.timestamp} {m.modelUsed && `• ${m.modelUsed}`}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing/Thinking indicator */}
            {(avatarState === 'thinking' || avatarState === 'typing') && (
              <div className="flex gap-3 justify-start items-center text-xs text-indigo-400">
                <LyraAvatar state={avatarState} mood={lyraConfig.currentMood} size="sm" showBadge={false} />
                <div className="bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>
                    {avatarState === 'thinking' ? 'LYRA is synthesizing reasoning...' : 'LYRA is typing...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Prompts */}
          <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800/80 flex gap-2 overflow-x-auto text-xs scrollbar-none">
            <button
              onClick={() => handleSendMessage('इस PDF से 25 hard MCQ बनाओ।')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap text-[11px] border border-slate-700/60 transition"
            >
              🎯 25 Hard MCQ बनाओ
            </button>
            <button
              onClick={() => handleSendMessage('मेरे लिए आज का realistic plan बनाओ।')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap text-[11px] border border-slate-700/60 transition"
            >
              📅 Realistic Daily Plan
            </button>
            <button
              onClick={() => handleSendMessage('Robotics sensors chapter practice शुरू करो।')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap text-[11px] border border-slate-700/60 transition"
            >
              🤖 Sensors Chapter Pack
            </button>
            <button
              onClick={() => handleSendMessage('Success track check करो और recovery सलाह दो।')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap text-[11px] border border-slate-700/60 transition"
            >
              🛡️ Track Status & Recovery
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                selectedLanguage === 'Hindi'
                  ? `LYRA (${lyraConfig.currentMood.toLowerCase()}) से पूछें...`
                  : `Ask LYRA (${lyraConfig.currentMood.toLowerCase()}) anything...`
              }
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-hidden focus:border-indigo-500 placeholder-slate-500"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || avatarState === 'thinking'}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition flex items-center justify-center shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Lyra Settings Modal */}
      <LyraSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        config={lyraConfig}
        onSaveConfig={(updated) => setLyraConfig(updated)}
      />
    </>
  );
};
