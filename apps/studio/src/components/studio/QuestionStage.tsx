'use client';

import React from 'react';
import { AnyQuestion, EngineType } from '@aep/types';
import { Clock, HelpCircle, Sparkles, CheckCircle2, XCircle, Trophy } from 'lucide-react';

export type QuestionStageState =
  | 'IDLE'
  | 'QUESTION_READY'
  | 'COUNTDOWN'
  | 'ACTIVE'
  | 'ANSWER_RECEIVED'
  | 'CORRECT'
  | 'WRONG'
  | 'REVEAL'
  | 'RESULT'
  | 'NEXT';

interface QuestionStageProps {
  question?: AnyQuestion | null;
  state?: QuestionStageState;
  timeRemainingSeconds?: number;
  totalTimeSeconds?: number;
  questionNumber?: number;
  totalQuestions?: number;
  firstCorrectPlayerName?: string;
  firstCorrectAvatarUrl?: string;
  revealedAnswerText?: string;
  onAddQuestionsClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function QuestionStage({
  question,
  state = 'ACTIVE',
  timeRemainingSeconds = 30,
  totalTimeSeconds = 30,
  questionNumber = 1,
  totalQuestions = 10,
  firstCorrectPlayerName,
  firstCorrectAvatarUrl,
  revealedAnswerText,
  onAddQuestionsClick,
  children,
  className = ''
}: QuestionStageProps) {
  // Empty State
  if (!question || state === 'IDLE') {
    return (
      <div className="w-full min-h-[380px] rounded-3xl bg-[#0C0E1A] border border-[#222644] p-8 flex flex-col items-center justify-center text-center gap-4 dir-rtl select-none shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 flex items-center justify-center text-2xl shadow-lg">
          <HelpCircle className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">لا توجد أسئلة محملة في هذا القسم</h3>
          <p className="text-xs text-slate-400 font-bold mt-1">اختر ألعابك المفضلة من مكتبة المحتوى أو محرر العروض لتوليد الأسئلة فوراً.</p>
        </div>
        {onAddQuestionsClick && (
          <button
            onClick={onAddQuestionsClick}
            className="px-6 py-2.5 rounded-xl gold-cta-button text-xs font-black shadow-lg cursor-pointer"
          >
            + إضافة أسئلة من المكتبة ✨
          </button>
        )}
      </div>
    );
  }

  // Timer Progress Status (Normal > 50%, Warning 25-50%, Danger < 25%)
  const percentage = Math.max(0, Math.min(100, (timeRemainingSeconds / totalTimeSeconds) * 100));
  const isDanger = percentage < 25;
  const isWarning = percentage >= 25 && percentage < 50;

  const timerColor = isDanger 
    ? 'text-rose-400 border-rose-500 bg-rose-950/80 animate-pulse' 
    : isWarning 
    ? 'text-amber-400 border-amber-500 bg-amber-950/80' 
    : 'text-emerald-400 border-emerald-500/40 bg-emerald-950/50';

  const progressBg = isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-400';

  return (
    <div className={`w-full flex flex-col items-center justify-between p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#121426] via-[#090B16] to-[#121426] border border-[#232742] shadow-[0_20px_80px_rgba(0,0,0,0.9)] dir-rtl select-none relative overflow-hidden ${className}`}>
      
      {/* 1. TOP BROADCAST HEADER (Question Number, Category & Timer) */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono font-black text-xs">
            {String(questionNumber).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
          </span>
          <div>
            <span className="text-xs font-bold text-slate-400 block">{question.category || 'مسابقة البث المباشر'}</span>
            <span className="text-[10px] font-mono text-amber-400 font-bold">+{question.points || 100} نقطة</span>
          </div>
        </div>

        {/* ⏱️ CIRCULAR COUNTDOWN TIMER WIDGET */}
        <div className={`px-4 py-1.5 rounded-2xl border flex items-center gap-2 transition-all font-mono font-black text-lg ${timerColor}`}>
          <Clock className="w-4 h-4 animate-spin-slow" />
          <span>00:{String(timeRemainingSeconds).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden my-2 z-10">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${progressBg}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 2. CENTER CONTENT SLOT (Custom Question Template / Media / Options) */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-4 z-10">
        {children}
      </div>

      {/* 3. BOTTOM BROADCAST STATE BANNER */}
      {/* FIRST CORRECT ANSWER SPOTLIGHT (State: ANSWER_RECEIVED or CORRECT) */}
      {(state === 'ANSWER_RECEIVED' || state === 'CORRECT') && firstCorrectPlayerName && (
        <div className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0A1A14] to-emerald-950 border border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-between animate-in zoom-in-95 z-20">
          <div className="flex items-center gap-3">
            {firstCorrectAvatarUrl && (
              <img src={firstCorrectAvatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-md" />
            )}
            <div>
              <span className="text-[10px] font-mono font-black text-emerald-400 uppercase block">⚡ أول إجابة صحيحة من الشات!</span>
              <span className="text-base font-black text-white">{firstCorrectPlayerName}</span>
            </div>
          </div>
          <span className="text-lg font-black font-mono text-emerald-300">+{question.points || 100} نقطة</span>
        </div>
      )}

      {/* ANSWER REVEAL BANNER (State: REVEAL) */}
      {state === 'REVEAL' && revealedAnswerText && (
        <div className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-950 via-[#1A1608] to-amber-950 border border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-between animate-in zoom-in-95 z-20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">الإجابة المعلنة رسمياً:</span>
            <strong className="text-base font-black text-amber-300">{revealedAnswerText}</strong>
          </div>
        </div>
      )}

    </div>
  );
}
