'use client';

import React from 'react';
import { MixedWordsQuestion } from '@aep/types';
import { Shuffle, Sparkles, HelpCircle, Flame, CheckCircle2 } from 'lucide-react';

interface Props {
  question: MixedWordsQuestion;
  isAnswerRevealed: boolean;
}

export function MixedWordsView({ question, isAnswerRevealed }: Props) {
  // If scrambledLetters array is provided use it, otherwise derive from title/acceptableAnswers
  const letters = question.scrambledLetters && question.scrambledLetters.length > 0
    ? question.scrambledLetters
    : (question.acceptableAnswers?.[0] || 'الرياض').split('').sort(() => Math.random() - 0.5);

  const displayOriginal = question.originalWord || question.acceptableAnswers?.[0] || '';

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 max-w-4xl mx-auto py-2">
      {/* Category and Engine Badge */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Shuffle className="w-3.5 h-3.5" />
          <span>تحدي الحروف المبعثرة</span>
        </span>
        {question.category && (
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-slate-300 text-xs font-bold">
            {question.category}
          </span>
        )}
        <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black font-mono">
          ★ {question.points || 120} نقطة
        </span>
      </div>

      {/* Main Question Title */}
      <div className="text-center px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-md">
          {question.title}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-300/90 font-bold mt-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>اكتب الكلمة الصحيحة كاملة في الشات الآن لتفوز بالنقاط!</span>
        </p>
      </div>

      {/* 3D Glowing Scrambled Letter Tiles */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-2 px-2 max-w-3xl">
        {letters.map((char, idx) => (
          <div
            key={`${char}-${idx}`}
            className="group relative w-14 h-16 sm:w-20 sm:h-24 rounded-2xl bg-gradient-to-b from-[#143329] via-[#0d221b] to-[#081611] border-2 border-emerald-400/60 text-white font-black text-2xl sm:text-4xl shadow-[0_10px_25px_rgba(0,0,0,0.7),0_0_20px_rgba(16,185,129,0.35)] flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 cursor-default"
          >
            {/* Top Gloss Highlight */}
            <div className="absolute top-1 inset-x-2 h-1/3 rounded-t-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            
            {/* Order index pill */}
            <span className="absolute top-1 right-1.5 text-[9px] font-mono font-bold text-emerald-400/60">
              {idx + 1}
            </span>

            {/* Letter Character */}
            <span className="relative z-10 text-white font-black drop-shadow-[0_2px_10px_rgba(16,185,129,0.8)]">
              {char}
            </span>

            {/* Bottom Glow Bar */}
            <div className="absolute bottom-1 inset-x-3 h-0.5 rounded-full bg-emerald-400/50 group-hover:bg-emerald-300" />
          </div>
        ))}
      </div>

      {/* Bottom Solution Panel (Hidden / Revealed) */}
      <div className={`w-full max-w-lg p-5 rounded-3xl transition-all duration-500 border text-center ${
        isAnswerRevealed
          ? 'bg-gradient-to-b from-emerald-950/90 to-slate-950/90 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)] scale-105'
          : 'bg-[#101222]/80 border-white/10 backdrop-blur-xl'
      }`}>
        <div className="flex items-center justify-center gap-2 text-xs font-black mb-1.5">
          {isAnswerRevealed ? (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>الكلمة الصحيحة المؤكدة:</span>
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>الحل محجوب أثناء وقت المسابقة</span>
            </span>
          )}
        </div>

        <div className="text-2xl sm:text-3xl font-black tracking-wider">
          {isAnswerRevealed ? (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 font-black animate-in zoom-in-95">
              {displayOriginal}
            </span>
          ) : (
            <span className="font-mono text-slate-500 tracking-[0.4em]">
              ••••••••••
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
