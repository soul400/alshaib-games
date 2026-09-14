'use client';

import React from 'react';
import { QuizQuestion } from '@aep/types';
import { CheckCircle2, BookOpen, Sparkles } from 'lucide-react';

interface Props {
  question: QuizQuestion;
  isAnswerRevealed: boolean;
}

export function QuizEngineView({ question, isAnswerRevealed }: Props) {
  const hasAnswers = question && Array.isArray(question.acceptableAnswers) && question.acceptableAnswers.length > 0;

  return (
    <div className="w-full flex flex-col items-center select-none">
      {question.options && question.options.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 w-full max-w-4xl">
          {question.options.map((opt, idx) => {
            const isCorrect = isAnswerRevealed && question.acceptableAnswers?.some(ans => ans.includes(opt) || opt.includes(ans));
            const letter = String.fromCharCode(65 + idx);
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 flex items-center justify-between font-extrabold text-base sm:text-lg select-none ${
                  isCorrect
                    ? 'tv-option-card-correct scale-[1.02]'
                    : 'tv-option-card text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black font-mono shadow-md border ${
                    isCorrect
                      ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                      : 'bg-[#161B26] text-[#06B6D4] border-[#06B6D4]/40'
                  }`}>
                    {letter}
                  </span>
                  <span className="leading-relaxed tracking-tight text-[#E2E8F0] font-black">{opt}</span>
                </div>
                {isCorrect && (
                  <div className="flex items-center gap-1.5 text-emerald-300 font-mono">
                    <CheckCircle2 className="w-6 h-6 animate-bounce text-emerald-400" />
                    <span className="text-xs font-black hidden sm:inline">إجابة صحيحة ✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : hasAnswers ? (
        <div className="w-full max-w-xl p-8 rounded-3xl tv-show-question-banner text-center shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#06B6D4]" />
            <p className="text-slate-300 text-xs font-bold font-mono">اكتب إجابتك مباشرة في شات البث للفوز بالنقاط:</p>
          </div>
          <div className="py-4 px-8 rounded-2xl bg-black/60 border border-[#06B6D4]/40 inline-block shadow-inner">
            <p className="text-2xl sm:text-4xl font-black text-[#06B6D4] tracking-wider">
              {isAnswerRevealed ? question.acceptableAnswers.join(' / ') : '••••••••••••••••'}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg p-6 rounded-3xl glass-broadcast-panel text-center border border-amber-500/30 bg-amber-500/10 flex flex-col items-center gap-2 shadow-xl">
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
