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
        <div className="grid grid-cols-2 gap-3.5 w-full max-w-2xl">
          {question.options.map((opt, idx) => {
            const isCorrect = isAnswerRevealed && question.acceptableAnswers?.some(ans => ans.includes(opt) || opt.includes(ans));
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between font-extrabold text-base ${
                  isCorrect
                    ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200 shadow-[0_6px_20px_rgba(16,217,160,0.3)] scale-[1.03]'
                    : 'glass-arena-card text-white border-white/10 hover:border-cyan-400/40 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center text-xs font-black text-cyan-300">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />}
              </div>
            );
          })}
        </div>
      ) : hasAnswers ? (
        <div className="w-full max-w-lg p-4 rounded-2xl glass-arena-card text-center border border-white/10">
          <p className="text-slate-400 text-xs mb-1">الإجابة المطلوبة (اكتب في الشات):</p>
          <p className="text-xl font-black text-cyan-300">
            {isAnswerRevealed ? question.acceptableAnswers.join(' / ') : '•••••••••••••'}
          </p>
        </div>
      ) : (
        <div className="w-full max-w-lg p-6 rounded-2xl glass-arena-card text-center border border-amber-500/30 bg-amber-500/10 flex flex-col items-center gap-2">
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
