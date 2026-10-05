import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { StorageService } from '../services/storage';
import {
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
  X,
} from 'lucide-react';

interface PracticeSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  title?: string;
  onFinish?: (score: number, total: number) => void;
}

export const PracticeSessionModal: React.FC<PracticeSessionModalProps> = ({
  isOpen,
  onClose,
  questions,
  title = 'Practice Session',
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(questions.length * 90);
  const [isCompleted, setIsCompleted] = useState(false);
  const [deepExplanation, setDeepExplanation] = useState<any>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setUserAnswers({});
      setCheckedQuestions({});
      setIsCompleted(false);
      setDeepExplanation(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isCompleted]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const selectedAnswer = userAnswers[currentIndex];
  const isChecked = checkedQuestions[currentIndex] || isCompleted;

  const handleSelectOption = (idx: number) => {
    if (isChecked) return;
    if (currentQ.type === 'multiple_mcq') {
      const existing = (userAnswers[currentIndex] as number[]) || [];
      const updated = existing.includes(idx)
        ? existing.filter((i) => i !== idx)
        : [...existing, idx];
      setUserAnswers((prev) => ({ ...prev, [currentIndex]: updated }));
    } else {
      setUserAnswers((prev) => ({ ...prev, [currentIndex]: idx }));
    }
  };

  const handleCheckAnswer = () => {
    setCheckedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
    // Record attempt
    const isCorrect =
      currentQ.type === 'multiple_mcq'
        ? Array.isArray(userAnswers[currentIndex]) &&
          userAnswers[currentIndex].length === (currentQ.correctIndices?.length || 0) &&
          userAnswers[currentIndex].every((val: number) => currentQ.correctIndices?.includes(val))
        : userAnswers[currentIndex] === currentQ.correctOptionIndex;

    StorageService.recordAttempt({
      id: `att_${Date.now()}`,
      questionId: currentQ.id,
      userOptionIndex: userAnswers[currentIndex],
      isCorrect,
      timeTakenSeconds: 30,
      timestamp: new Date().toISOString(),
      topic: currentQ.topic,
      domain: currentQ.domain,
    });
  };

  const handleSaveToRevision = (q: Question) => {
    const saved = StorageService.getSavedQuestions();
    if (!saved.some((s) => s.question.id === q.id)) {
      StorageService.saveSavedQuestions([
        {
          id: `saved_${Date.now()}`,
          question: q,
          savedAt: new Date().toISOString(),
          revisionDue: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          repetitionStage: 1,
        },
        ...saved,
      ]);
    }
    setSavedQuestionIds((prev) => [...prev, q.id]);
  };

  const handleFetchDeepExplanation = async (q: Question) => {
    setIsLoadingExplanation(true);
    try {
      const res = await fetch('/api/gemini/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          userAnswer:
            typeof selectedAnswer === 'number' ? q.options[selectedAnswer] : 'Not answered',
          correctAnswer: q.options[q.correctOptionIndex],
          options: q.options,
          topic: q.topic,
        }),
      });
      const data = await res.json();
      setDeepExplanation(data);
    } catch {
      setDeepExplanation({
        analysis: q.explanation,
        whyOthersWrong: q.wrongOptionsExplanation || 'Distractor options violate underlying principles.',
        keyConcept: q.relatedConcept || q.topic,
      });
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleSubmitExam = () => {
    setIsCompleted(true);
    let correct = 0;
    questions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (q.type === 'multiple_mcq') {
        if (
          Array.isArray(ans) &&
          ans.length === (q.correctIndices?.length || 0) &&
          ans.every((val) => q.correctIndices?.includes(val))
        ) {
          correct++;
        }
      } else {
        if (ans === q.correctOptionIndex) correct++;
      }
    });

    if (onFinish) {
      onFinish(correct, questions.length);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden text-white shadow-2xl relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold tracking-wide">{title}</h3>
            <span className="text-xs text-slate-400">
              Question {currentIndex + 1} of {questions.length} • {currentQ.topic}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-indigo-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Palette Navigation Strip */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
          {questions.map((_, idx) => {
            const answered = userAnswers[idx] !== undefined;
            const active = currentIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setDeepExplanation(null);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition shrink-0 ${
                  active
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                    : answered
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isCompleted ? (
            <div>
              {/* Question Meta tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {currentQ.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {currentQ.difficulty}
                </span>
                {currentQ.isPYQ && (
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    PYQ {currentQ.examYear}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h4 className="text-base sm:text-lg font-semibold leading-relaxed text-slate-100">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="mt-5 space-y-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected =
                    currentQ.type === 'multiple_mcq'
                      ? Array.isArray(selectedAnswer) && selectedAnswer.includes(oIdx)
                      : selectedAnswer === oIdx;

                  let optClass = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200';

                  if (isChecked) {
                    const isCorrect =
                      currentQ.type === 'multiple_mcq'
                        ? currentQ.correctIndices?.includes(oIdx)
                        : currentQ.correctOptionIndex === oIdx;

                    if (isCorrect) {
                      optClass = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-rose-950/40 border-rose-500/60 text-rose-200';
                    }
                  } else if (isSelected) {
                    optClass = 'bg-indigo-950/50 border-indigo-500 text-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.2)]';
                  }

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${optClass}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-xs sm:text-sm leading-relaxed flex-1">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons: Check Answer, Save to Revision, Deep Explanation */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {!isChecked ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={selectedAnswer === undefined}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold transition"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFetchDeepExplanation(currentQ)}
                        disabled={isLoadingExplanation}
                        className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>{isLoadingExplanation ? 'Analyzing...' : 'Deep AI Explanation'}</span>
                      </button>

                      <button
                        onClick={() => handleSaveToRevision(currentQ)}
                        className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                          savedQuestionIds.includes(currentQ.id)
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{savedQuestionIds.includes(currentQ.id) ? 'Saved' : 'Save to Revision'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentIndex((prev) => Math.max(0, prev - 1));
                      setDeepExplanation(null);
                    }}
                    disabled={currentIndex === 0}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
                      setDeepExplanation(null);
                    }}
                    disabled={currentIndex === questions.length - 1}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Standard Explanation block when answer is checked */}
              {isChecked && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Solution Explanation:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                  {currentQ.wrongOptionsExplanation && (
                    <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                      <span className="font-semibold text-slate-300">Why options differ: </span>
                      {currentQ.wrongOptionsExplanation}
                    </p>
                  )}
                </div>
              )}

              {/* Deep AI Explanation Drawer/Panel */}
              {deepExplanation && (
                <div className="mt-4 p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>LYRA Deep Pedagogical Insight:</span>
                  </div>
                  <p className="text-xs text-purple-100 leading-relaxed">{deepExplanation.analysis}</p>
                  {deepExplanation.whyOthersWrong && (
                    <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="font-semibold text-rose-300">Why other options fail:</span>
                      <p className="mt-1 whitespace-pre-line text-slate-400">{deepExplanation.whyOthersWrong}</p>
                    </div>
                  )}
                  {deepExplanation.similarQuestion && (
                    <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="font-semibold text-indigo-300">Targeted Retention Question:</span>
                      <p className="mt-1 text-slate-300">{deepExplanation.similarQuestion}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Exam Completion Summary */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Session Completed!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                All responses have been logged to your adaptive profile. Weak and mastered topics updated automatically.
              </p>

              <button
                onClick={onClose}
                className="mt-4 py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isCompleted && (
          <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {Object.keys(userAnswers).length} of {questions.length} answered
            </span>
            <button
              onClick={handleSubmitExam}
              className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md"
            >
              Finish & Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
