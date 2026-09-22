'use client';

import React from 'react';
import { Trophy, Crown, Sparkles, Star, Award, CheckCircle2, ArrowRight, Users } from 'lucide-react';
import { NationalDayQuestion } from '@aep/types';

interface Props {
  winner: {
    displayName: string;
    username: string;
    avatarUrl: string;
    points: number;
    answerTime?: number;
    team?: {
      id: 'falcons' | 'lavender';
      name: string;
      color?: string;
    };
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
  const isFalcon = winner.team?.id === 'falcons';
  const isLavender = winner.team?.id === 'lavender';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Spotlight Halo Beam */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isLavender ? 'bg-purple-600/30' : 'bg-[#00A859]/30'
      }`} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C69214]/25 rounded-full blur-3xl pointer-events-none" />

      <div className={`relative z-10 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0A2616] via-[#051A0E] to-[#020D07] border-3 shadow-[0_0_90px_rgba(198,146,20,0.6)] flex flex-col items-center text-center max-w-md w-full gap-5 ${
        isLavender 
          ? 'border-purple-400/80 from-[#1F0C2B] via-[#100619] to-[#08020D]' 
          : 'border-[#C69214]'
      }`}>
        
        {/* Crown Badge */}
        <div className={`w-16 h-16 rounded-3xl text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(198,146,20,0.8)] -mt-16 border-2 border-white animate-bounce ${
          isLavender
            ? 'bg-gradient-to-tr from-purple-400 to-pink-200 text-purple-950 shadow-[0_0_35px_rgba(192,132,252,0.8)]'
            : 'bg-gradient-to-tr from-[#C69214] to-[#FFE79A]'
        }`}>
          <Crown className="w-8 h-8 fill-current" />
        </div>

        {/* Title & Team Badge */}
        <div className="flex flex-col items-center gap-2">
          {winner.team ? (
            <div className={`px-5 py-1.5 rounded-full text-xs font-black font-mono border shadow-md flex items-center gap-2 animate-pulse ${
              isFalcon
                ? 'bg-emerald-900/60 border-emerald-400/80 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-purple-900/60 border-purple-400/80 text-purple-200 shadow-[0_0_20px_rgba(192,132,252,0.4)]'
            }`}>
              <span>{isFalcon ? '🦅' : '🌸'}</span>
              <span>نقطة مستحقة لـ {winner.team.name}</span>
            </div>
          ) : (
            <span className="px-4 py-1 rounded-full bg-[#C69214]/20 border border-[#C69214]/50 text-[#E2D4B7] text-xs font-mono font-black mb-1 inline-block">
              إجابة صحيحة وفوز وطني 🇸🇦
            </span>
          )}

          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
            {winner.team ? `فوز ${winner.team.name}!` : 'تتويج بطل الجولة!'}
          </h2>
        </div>

        {/* Winner Avatar & Name */}
        <div className="flex flex-col items-center gap-2 my-2">
          <div className="relative">
            <div className={`absolute -inset-3 rounded-full blur-md animate-pulse ${
              isLavender 
                ? 'bg-gradient-to-tr from-purple-500 to-pink-500' 
                : 'bg-gradient-to-tr from-[#00A859] to-[#C69214]'
            }`} />
            <img
              src={winner.avatarUrl}
              alt={winner.displayName}
              className={`relative w-24 h-24 rounded-full object-cover border-4 shadow-2xl bg-slate-900 ${
                isLavender ? 'border-purple-300' : 'border-[#C69214]'
              }`}
            />
            <span className="absolute -bottom-1 -right-1 text-2xl">
              {isFalcon ? '🦅' : isLavender ? '🌸' : '🥇'}
            </span>
          </div>

          <h3 className="text-xl font-black text-white">{winner.displayName}</h3>
          <span className="text-xs font-mono text-[#00A859] font-bold">@{winner.username}</span>
        </div>

        {/* Points & Correct Answer */}
        <div className="w-full p-4 rounded-2xl bg-[#031208]/90 border border-[#006C35]/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold">الإجابة المعتمدة:</span>
            <span className="font-black text-[#00A859] text-sm">{question.correctAnswer}</span>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-2">
            <span className="text-slate-400 font-bold text-xs">
              {winner.team ? `رصيد ${winner.team.name}:` : 'النقاط المكتسبة:'}
            </span>
            <span className={`text-lg font-black font-mono ${
              isLavender ? 'text-purple-300' : 'text-[#C69214]'
            }`}>
              +{winner.points} نقطة
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="w-full flex items-center gap-3 mt-2">
          <button
            onClick={onNextQuestion}
            className={`flex-1 py-3.5 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer border ${
              isLavender
                ? 'bg-gradient-to-r from-purple-700 to-pink-600 border-purple-300/40 shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                : 'bg-gradient-to-r from-[#006C35] to-[#00A859] border-[#E2D4B7]/30 shadow-[0_0_25px_rgba(0,168,89,0.4)]'
            }`}
          >
            <span>السؤال التالي</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
}
