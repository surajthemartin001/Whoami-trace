import React, { useState } from 'react';
import { IntensityMode, IntensityConfig } from '../types';
import { StorageService } from '../services/storage';
import { ShieldAlert, Award, Clock, ArrowRight, CheckCircle, XCircle, Loader2, X } from 'lucide-react';

interface ReassessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIntensityChanged: (newConfig: IntensityConfig) => void;
}

export const ReassessmentModal: React.FC<ReassessmentModalProps> = ({
  isOpen,
  onClose,
  onIntensityChanged,
}) => {
  const profile = StorageService.getUserProfile();
  const [targetMode, setTargetMode] = useState<IntensityMode>('tiger');
  const [targetLockDuration, setTargetLockDuration] = useState<7 | 30>(30);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<{
    unlocked: boolean;
    score: number;
    reason: string;
    weakAreas: string[];
    strongAreas: string[];
  } | null>(null);

  // Challenge questions tailored to discipline, systems rigor, workload capacity
  const challengeQuestions = [
    {
      q: 'You miss 3 consecutive daily practice sessions due to unexpected client work. According to the WHO AM I? Recovery principle, what is the optimal course of action?',
      options: [
        'Distribute missed practice over the subsequent 5–7 days while protecting the 7-hour sleep window',
        'Cram all missed hours into tomorrow by sleeping only 3 hours',
        'Abandon the goal completely and reset all progress counters',
        'Ignore the missed work and pretend accuracy is unaffected',
      ],
      correct: 0,
      topic: 'Discipline & Recovery Management',
    },
    {
      q: 'In Tiger Mode (16–18 hrs/day extreme immersion), what is the non-negotiable minimum continuous sleep duration enforced by WHO AM I? to prevent neuro-cognitive degradation and enable memory consolidation?',
      options: [
        '6 hours (Strict non-negotiable sleep lock for neuro-glymphatic recovery and synaptic consolidation)',
        '0 hours (Zero sleep, study 24 hours continuously without stopping)',
        '1 hour fragmented into 10-minute micro-naps',
        '12 hours uninterrupted sleeping during daytime',
      ],
      correct: 0,
      topic: 'Tiger Extreme Sustainability & Circadian Rules',
    },
    {
      q: 'When scaling up a robotics neural perception stack to run at 60 FPS on edge Jetson hardware, what architectural constraint takes priority over model parameter size?',
      options: [
        'Deterministic inference latency and thermal throttling headroom',
        'Using maximum uncompressed FP64 float precision',
        'Running python multiprocessing with unbounded queues',
        'Disabling all cooling fans to reduce power draw',
      ],
      correct: 0,
      topic: 'Advanced Systems Knowledge',
    },
    {
      q: 'Why does WHO AM I? enforce a 7-day or 30-day lock on intensity modes?',
      options: [
        'To prevent emotional mode-hopping and build stable circadian neuro-plasticity habits',
        'To restrict users from learning faster',
        'Because the cloud servers cannot handle mode changes',
        'As an arbitrary gamification penalty',
      ],
      correct: 0,
      topic: 'Intensity Understanding',
    },
    {
      q: 'Assertion (A): High-intensity cognitive learning without spaced active recall leads to rapid Ebbinghaus forgetting curve decay.\nReason (R): Synaptic consolidation requires sleep-dependent replay and intermittent retrieval testing.',
      options: [
        'Both (A) and (R) are true, and (R) is the correct explanation of (A)',
        'Both (A) and (R) are true, but (R) is NOT the correct explanation',
        '(A) is true, but (R) is false',
        '(A) is false, but (R) is true',
      ],
      correct: 0,
      topic: 'Cognitive Science & Revision',
    },
  ];

  if (!isOpen) return null;

  const handleStartExam = () => {
    setAssessmentStarted(true);
    setCurrentIndex(0);
    setAnswers({});
    setEvalResult(null);
  };

  const handleFinishAssessment = async () => {
    setIsEvaluating(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([idx, ans]) => ({
        questionId: `q_${idx}`,
        answer: ans,
        correctOptionIndex: challengeQuestions[Number(idx)].correct,
        topic: challengeQuestions[Number(idx)].topic,
      }));

      const res = await fetch('/api/gemini/reassess-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentMode: profile.currentIntensity.name,
          requestedMode: targetMode.toUpperCase(),
          answers: formattedAnswers,
          totalQuestions: challengeQuestions.length,
        }),
      });

      const data = await res.json();
      setEvalResult({
        unlocked: data.unlocked,
        score: data.scorePercentage,
        reason: data.reason,
        weakAreas: data.weakAreas || [],
        strongAreas: data.strongAreas || [],
      });

      if (data.unlocked) {
        const modeDataMap = {
          turtle: { name: 'Turtle Mode', badge: '🐢 Steady', daily: 2, weekly: 12, desc: 'Consistent 2 hrs/day foundation.' },
          rabbit: { name: 'Rabbit Mode', badge: '🐇 Agile', daily: 4, weekly: 24, desc: 'Balanced 4 hrs/day learning.' },
          cheetah: { name: 'Cheetah Mode', badge: '⚡ High Momentum', daily: 5, weekly: 30, desc: 'Aggressive 5 hrs/day momentum.' },
          tiger: { name: 'Tiger Mode', badge: '🐅 Extreme Immersion (16–18h)', daily: 17, weekly: 102, desc: 'Extreme 16–18 hrs/day immersion with non-negotiable 6h sleep lock.' },
        };
        const selected = modeDataMap[targetMode];
        const updatedConfig: IntensityConfig = {
          mode: targetMode,
          name: selected.name,
          badge: selected.badge,
          dailyHours: selected.daily,
          weeklyHours: selected.weekly,
          description: selected.desc,
          lockDurationDays: targetLockDuration,
          lockedUntil: new Date(Date.now() + targetLockDuration * 24 * 60 * 60 * 1000).toISOString(),
          isLocked: true,
        };

        const updatedUser = { ...profile, currentIntensity: updatedConfig };
        StorageService.saveUserProfile(updatedUser);
        onIntensityChanged(updatedConfig);
      }
    } catch {
      setEvalResult({
        unlocked: false,
        score: 60,
        reason: 'Network evaluation failed. Please try again.',
        weakAreas: ['Recovery Planning'],
        strongAreas: ['Systems Architecture'],
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Intensity Mode Unlock / Reassess</h3>
              <p className="text-xs text-slate-400">Strict AI-evaluated assessment for early lock change</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!assessmentStarted ? (
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
              <span className="font-semibold text-white">Current Mode: {profile.currentIntensity.name}</span>
              <p className="mt-1 text-amber-400/90">
                Lock expires in: {Math.max(0, Math.ceil((new Date(profile.currentIntensity.lockedUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days.
                Early unlock requires passing a rigorous 50-60 MCQ dynamic test proving readiness and workload discipline.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Select Desired Intensity Mode:</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { mode: 'turtle', label: 'Turtle (2h/day)' },
                  { mode: 'rabbit', label: 'Rabbit (4h/day)' },
                  { mode: 'cheetah', label: 'Cheetah (5h/day)' },
                  { mode: 'tiger', label: 'Tiger (16–18h/day)' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setTargetMode(item.mode as IntensityMode)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                      targetMode === item.mode
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">New Lock Duration:</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => setTargetLockDuration(7)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                    targetLockDuration === 7
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  7-Day Lock
                </button>
                <button
                  onClick={() => setTargetLockDuration(30)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                    targetLockDuration === 30
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  30-Day Lock
                </button>
              </div>
            </div>

            <button
              onClick={handleStartExam}
              className="w-full mt-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg"
            >
              <span>Begin Dynamic Unlock Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : !evalResult ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Assessment Question {currentIndex + 1} of {challengeQuestions.length}</span>
              <span className="font-mono text-indigo-400">{challengeQuestions[currentIndex].topic}</span>
            </div>

            <h4 className="text-sm font-semibold text-slate-100 leading-relaxed">
              {challengeQuestions[currentIndex].q}
            </h4>

            <div className="space-y-2 mt-3">
              {challengeQuestions[currentIndex].options.map((opt, oIdx) => {
                const isSelected = answers[currentIndex] === oIdx;
                return (
                  <div
                    key={oIdx}
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentIndex]: oIdx }))}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-mono font-bold shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="py-2 px-4 rounded-xl bg-slate-800 text-xs disabled:opacity-40"
              >
                Previous
              </button>

              {currentIndex < challengeQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  disabled={answers[currentIndex] === undefined}
                  className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white disabled:opacity-40 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleFinishAssessment}
                  disabled={isEvaluating || answers[currentIndex] === undefined}
                  className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition"
                >
                  {isEvaluating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Submit for AI Evaluation</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Evaluation Results */
          <div className="mt-4 space-y-4">
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                evalResult.unlocked
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}
            >
              {evalResult.unlocked ? (
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">
                    {evalResult.unlocked ? 'Early Unlock Approved!' : 'Unlock Criteria Not Met'}
                  </span>
                  <span className="font-mono font-bold text-base">{evalResult.score}% Score</span>
                </div>
                <p className="mt-1 leading-relaxed text-slate-300">{evalResult.reason}</p>
              </div>
            </div>

            {evalResult.weakAreas.length > 0 && (
              <div className="text-xs space-y-1">
                <span className="text-slate-400 font-medium">Areas Requiring Further Discipline:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {evalResult.weakAreas.map((w, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-rose-300 font-mono text-[11px]">
                      • {w}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              Close & Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
