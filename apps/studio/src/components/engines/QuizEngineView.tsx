'use client';

import React from 'react';
import { QuizQuestion } from '@aep/types';
import { CheckCircle2, BookOpen } from 'lucide-react';

interface Props {
  question: QuizQuestion;
  isAnswerRevealed: boolean;
}

export function QuizEngineView({ question, isAnswerRevealed }: Props) {
  const hasAnswers = question && Array.isArray(question.acceptableAnswers) && question.acceptableAnswers.length > 0;

  return (
    <div className="w-full flex flex-col items-center">
      {question.options && question.options.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
          {question.options.map((opt, idx) => {
            const isCorrect = isAnswerRevealed && question.acceptableAnswers?.some(ans => ans.includes(opt) || opt.includes(ans));
            const letter = String.fromCharCode(65 + idx);
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between font-extrabold text-base sm:text-lg select-none ${
                  isCorrect
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-[1.03] ring-2 ring-emerald-400/50'
                    : 'glass-broadcast-panel text-white hover:border-[#D6A84F]/50 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black font-mono border ${
                    isCorrect
                      ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                      : 'bg-white/10 text-[#D6A84F] border-[#D6A84F]/30'
                  }`}>
                    {letter}
                  </span>
                  <span className="leading-relaxed tracking-tight">{opt}</span>
                </div>
                {isCorrect && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 animate-bounce" />
                    <span className="text-xs font-black font-mono hidden sm:inline">صح ✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : hasAnswers ? (
        <div className="w-full max-w-xl p-6 rounded-3xl glass-broadcast-panel text-center border border-white/15 shadow-2xl">
          <p className="text-slate-400 text-xs mb-2 font-bold font-mono">الإجابة المطلوبة (اكتب في الشات مباشرة):</p>
          <div className="py-3 px-6 rounded-2xl bg-black/40 border border-[#D6A84F]/30 inline-block">
            <p className="text-2xl sm:text-3xl font-black text-[#D6A84F] tracking-wide">
              {isAnswerRevealed ? question.acceptableAnswers.join(' / ') : '••••••••••••••••'}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg p-6 rounded-3xl glass-broadcast-panel text-center border border-amber-500/30 bg-amber-500/10 flex flex-col items-center gap-2">
          <BookOpen className="w-8 h-8 text-amber-400 animate-pulse" />
          <p className="text-amber-300 font-bold text-sm">
            لا توجد أسئلة مضافة في قسم المسابقات الثقافية حالياً.
          </p>
          <span className="text-xs text-slate-300">
            يمكنك رفع ملف Excel / CSV أو إضافة الأسئلة يدوياً من صفحة المكتبة 📚
          </span>
        </div>
      )}
    </div>
  );
}
