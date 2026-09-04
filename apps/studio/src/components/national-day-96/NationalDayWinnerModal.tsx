'use client';

import React from 'react';
import { Trophy, Crown, Sparkles, Star, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { NationalDayQuestion } from '@aep/types';

interface Props {
  winner: {
    displayName: string;
    username: string;
    avatarUrl: string;
    points: number;
    answerTime?: number;
  };
  question: NationalDayQuestion;
  onNextQuestion: () => void;
  onClose: () => void;
}

export function NationalDayWinnerModal({
  winner,
  question,
  onNextQuestion,
  onClose
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Spotlight Halo Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00A859]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C69214]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0A2616] via-[#051A0E] to-[#020D07] border-3 border-[#C69214] shadow-[0_0_90px_rgba(198,146,20,0.6)] flex flex-col items-center text-center max-w-md w-full gap-5">
        
        {/* Crown Badge */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#C69214] to-[#FFE79A] text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(198,146,20,0.8)] -mt-16 border-2 border-white animate-bounce">
          <Crown className="w-8 h-8 fill-current" />
        </div>

        {/* Title */}
        <div>
          <span className="px-4 py-1 rounded-full bg-[#C69214]/20 border border-[#C69214]/50 text-[#E2D4B7] text-xs font-mono font-black mb-1 inline-block">
            إجابة صحيحة وفوز وطني 🇸🇦
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
            تتويج بطل الجولة!
          </h2>
        </div>

        {/* Winner Avatar & Name */}
        <div className="flex flex-col items-center gap-2 my-2">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#00A859] to-[#C69214] blur-md animate-pulse" />
            <img
              src={winner.avatarUrl}
              alt={winner.displayName}
              className="relative w-24 h-24 rounded-full object-cover border-4 border-[#C69214] shadow-2xl bg-slate-900"
            />
            <span className="absolute -bottom-1 -right-1 text-2xl">🥇</span>
          </div>

          <h3 className="text-xl font-black text-white">{winner.displayName}</h3>
          <span className="text-xs font-mono text-[#00A859] font-bold">@{winner.username}</span>
        </div>

        {/* Points & Correct Answer */}
        <div className="w-full p-4 rounded-2xl bg-[#031208] border border-[#006C35]/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold">الإجابة المعتمدة:</span>
            <span className="font-black text-[#00A859] text-sm">{question.correctAnswer}</span>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-2">
            <span className="text-slate-400 font-bold text-xs">النقاط المكتسبة:</span>
            <span className="text-lg font-black font-mono text-[#C69214]">+{winner.points} نقطة</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="w-full flex items-center gap-3 mt-2">
          <button
            onClick={onNextQuestion}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#006C35] to-[#00A859] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer border border-[#E2D4B7]/30"
          >
            <span>السؤال التالي</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
}
