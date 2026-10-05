import React from 'react';
import { LyraMood } from '../types';

export type LyraAvatarState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'typing' | 'completed' | 'error';

interface LyraAvatarProps {
  state?: LyraAvatarState;
  mood?: LyraMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const LyraAvatar: React.FC<LyraAvatarProps> = ({
  state = 'idle',
  mood = 'HAPPY',
  size = 'md',
  showBadge = true,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  const getMoodAura = () => {
    switch (mood) {
      case 'PLAYFUL':
        return 'from-pink-500/25 to-purple-500/25';
      case 'CALM':
        return 'from-teal-500/20 to-cyan-500/20';
      case 'FOCUSED':
        return 'from-indigo-600/30 to-blue-500/30';
      case 'MOTIVATOR':
        return 'from-amber-500/30 to-rose-500/25';
      case 'SERIOUS':
        return 'from-slate-500/25 to-indigo-700/25';
      case 'HAPPY':
      default:
        return 'from-indigo-500/25 to-emerald-500/25';
    }
  };

  const getWandColor = () => {
    if (state === 'error') return '#f87171';
    if (state === 'listening') return '#38bdf8';
    if (state === 'thinking' || state === 'typing') return '#c084fc';
    if (state === 'speaking') return '#34d399';

    switch (mood) {
      case 'PLAYFUL':
        return '#f472b6'; // pink
      case 'CALM':
        return '#2dd4bf'; // teal
      case 'FOCUSED':
        return '#6366f1'; // indigo
      case 'MOTIVATOR':
        return '#fbbf24'; // amber
      case 'SERIOUS':
        return '#94a3b8'; // slate
      case 'HAPPY':
      default:
        return '#818cf8'; // indigo
    }
  };

  const isWandActive = state === 'thinking' || state === 'typing' || state === 'speaking';

  // Facial mouth shape based on state and mood
  const renderMouth = () => {
    if (state === 'speaking') {
      return <ellipse cx="50" cy="39" rx="2" ry="1.5" fill="#4338ca" className="animate-pulse" />;
    }
    switch (mood) {
      case 'PLAYFUL':
        return <path d="M 47 38 Q 50 42 53 39" fill="none" stroke="#4338ca" strokeWidth="1" strokeLinecap="round" />;
      case 'CALM':
        return <path d="M 48 39 Q 50 40.5 52 39" fill="none" stroke="#4338ca" strokeWidth="0.8" strokeLinecap="round" />;
      case 'FOCUSED':
        return <line x1="48" y1="39" x2="52" y2="39" stroke="#4338ca" strokeWidth="1" strokeLinecap="round" />;
      case 'SERIOUS':
        return <line x1="47.5" y1="39" x2="52.5" y2="39" stroke="#312e81" strokeWidth="1.1" strokeLinecap="round" />;
      case 'MOTIVATOR':
        return <path d="M 47 38.5 Q 50 42.5 53 38.5" fill="none" stroke="#4338ca" strokeWidth="1.1" strokeLinecap="round" />;
      case 'HAPPY':
      default:
        return <path d="M 47.5 38.5 Q 50 41.5 52.5 38.5" fill="none" stroke="#4338ca" strokeWidth="0.9" strokeLinecap="round" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${className} ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      title={`LYRA AI (${state} • Mood: ${mood})`}
    >
      {/* Outer energy aura / lightning ring influenced by mood and state */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
          state === 'thinking' || state === 'typing'
            ? 'animate-pulse bg-gradient-to-r from-purple-500/35 to-indigo-500/35 blur-md scale-125'
            : state === 'speaking'
            ? 'animate-ping bg-emerald-500/20 blur-sm scale-110'
            : state === 'listening'
            ? 'animate-pulse bg-cyan-500/20 blur-sm scale-115'
            : `bg-gradient-to-tr ${getMoodAura()} blur-xs`
        }`}
      />

      {/* Fairy Visual Representation (SVG) */}
      <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(129,140,248,0.45)]"
        >
          <defs>
            {/* Sparkle filter glow */}
            <filter id="wandGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="fairyWings" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="fairyBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#a5b4fc" />
            </linearGradient>
          </defs>

          {/* Left Wing with subtle fluttering */}
          <g
            className={`origin-[45px_45px] transition-transform duration-300 ${
              state === 'speaking' || state === 'listening' ? 'animate-bounce' : ''
            }`}
          >
            <path
              d="M 45 45 C 20 20, 5 35, 12 55 C 20 75, 42 55, 45 45 Z"
              fill="url(#fairyWings)"
              className="opacity-80"
            />
          </g>

          {/* Right Wing */}
          <g
            className={`origin-[55px_45px] transition-transform duration-300 ${
              state === 'speaking' || state === 'listening' ? 'animate-bounce' : ''
            }`}
          >
            <path
              d="M 55 45 C 80 20, 95 35, 88 55 C 80 75, 58 55, 55 45 Z"
              fill="url(#fairyWings)"
              className="opacity-80"
            />
          </g>

          {/* Fairy Gown / Body */}
          <path
            d="M 46 45 Q 50 42 54 45 L 60 72 Q 50 78 40 72 Z"
            fill="url(#fairyBody)"
            className="opacity-90"
          />

          {/* Fairy Head */}
          <circle cx="50" cy="35" r="9" fill="#ffffff" />

          {/* Futuristic Halo / Diadem with Mood Tint */}
          <ellipse
            cx="50"
            cy="27"
            rx="11"
            ry="3.5"
            fill="none"
            stroke={getWandColor()}
            strokeWidth="1.6"
            className="opacity-85"
          />

          {/* Fairy Face elements (Stylized futuristic eyes) */}
          {mood === 'PLAYFUL' ? (
            <>
              {/* Playful wink: left eye curve, right eye open */}
              <path d="M 46 35 Q 47.5 33.5 49 35" fill="none" stroke="#312e81" strokeWidth="1.1" strokeLinecap="round" />
              <circle cx="53" cy="35" r="1.3" fill="#312e81" />
            </>
          ) : (
            <>
              <circle cx="47" cy="35" r="1.2" fill="#312e81" />
              <circle cx="53" cy="35" r="1.2" fill="#312e81" />
            </>
          )}

          {/* Dynamic Mood-Driven Mouth Expression */}
          {renderMouth()}

          {/* Glowing Wand with Star-like Sparkling tip */}
          <g
            className={`origin-[55px_50px] transition-transform duration-500 ${
              isWandActive ? 'rotate-12 animate-pulse' : ''
            }`}
          >
            {/* Wand shaft */}
            <line
              x1="54"
              y1="48"
              x2="72"
              y2="28"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Glowing wand star tip */}
            <g transform="translate(72, 28)">
              {/* Star-like 4-point sparkle */}
              <path
                d="M 0 -6 L 1.8 -1.8 L 6 0 L 1.8 1.8 L 0 6 L -1.8 1.8 L -6 0 L -1.8 -1.8 Z"
                fill={getWandColor()}
                filter="url(#wandGlow)"
              />
              <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
            </g>
          </g>

          {/* Sparkle particle trail when active */}
          {isWandActive && (
            <g className="animate-ping">
              <circle cx="78" cy="22" r="1.5" fill="#fbcfe8" />
              <circle cx="83" cy="26" r="1.2" fill="#bae6fd" />
              <circle cx="70" cy="18" r="1" fill="#fed7aa" />
            </g>
          )}
        </svg>
      </div>

      {/* Status indicator dot / badge */}
      {showBadge && size !== 'sm' && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-950 transition-colors duration-300 ${
            state === 'listening'
              ? 'bg-sky-400 animate-pulse'
              : state === 'thinking' || state === 'typing'
              ? 'bg-purple-400 animate-spin'
              : state === 'speaking'
              ? 'bg-emerald-400 animate-pulse'
              : state === 'error'
              ? 'bg-rose-500'
              : mood === 'PLAYFUL'
              ? 'bg-pink-400'
              : mood === 'MOTIVATOR'
              ? 'bg-amber-400'
              : mood === 'CALM'
              ? 'bg-teal-400'
              : 'bg-indigo-400'
          }`}
        />
      )}
    </div>
  );
};
