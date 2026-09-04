'use client';

import React from 'react';
import { PlayerScore } from '@aep/types';
import { Trophy, Crown, Medal, Award, Sparkles, Star } from 'lucide-react';

export type WinnerCardVariant = 'ROUND_WINNER' | 'GAME_WINNER' | 'CHAMPION' | 'TOP3_PODIUM';

interface WinnerCardProps {
  player: PlayerScore | { displayName: string; avatarUrl: string; points: number; username?: string; rank?: number };
  variant?: WinnerCardVariant;
  rank?: number;
  gameTitle?: string;
  className?: string;
  onClick?: () => void;
}

export function WinnerCard({
  player,
  variant = 'ROUND_WINNER',
  rank = 1,
  gameTitle,
  className = '',
  onClick
}: WinnerCardProps) {
  const displayName = player.displayName || (player as any).username || 'متسابق تيك توك';
  const avatarUrl = player.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
  const points = Number((player as any)?.points ?? (player as any)?.score ?? 0) || 0;

  // Render Variant A: Round Winner
  if (variant === 'ROUND_WINNER') {
    return (
      <div 
        onClick={onClick}
        className={`p-4 rounded-2xl bg-gradient-to-b from-[#16182E] to-[#0D0F1D] border border-amber-400/40 shadow-[0_8px_25px_rgba(245,158,11,0.25)] flex items-center justify-between gap-3 text-white transition-all hover:scale-[1.02] ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img src={avatarUrl} alt={displayName} className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md" />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">
              ✓
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold text-amber-300">فائز الجولة ✨</span>
            <h4 className="text-sm font-black text-white truncate max-w-[140px]">{displayName}</h4>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-base font-black font-mono text-amber-400">+{points.toLocaleString()}</span>
          <span className="text-[10px] font-bold text-slate-400 font-mono">نقطة</span>
        </div>
      </div>
    );
  }

  // Render Variant B: Game Winner
  if (variant === 'GAME_WINNER') {
    return (
      <div 
        onClick={onClick}
        className={`p-5 rounded-3xl bg-gradient-to-b from-[#1E2038] via-[#101224] to-[#1E2038] border-2 border-yellow-400/60 shadow-[0_12px_40px_rgba(234,179,8,0.35)] flex flex-col items-center text-center gap-3 text-white transition-all hover:scale-[1.03] ${className}`}
      >
        <div className="px-3 py-1 rounded-full bg-yellow-400 text-slate-950 font-black text-[10px] font-mono flex items-center gap-1.5 shadow-md">
          <Trophy className="w-3.5 h-3.5" />
          <span>بطل اللعبة</span>
        </div>

        <div className="relative">
          <img src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-full object-cover border-3 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
          <span className="absolute -bottom-2 right-1/2 translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 border border-yellow-400 text-yellow-300 text-[10px] font-mono font-black">
            #1
          </span>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-lg font-black text-white truncate max-w-[180px]">{displayName}</h3>
          {gameTitle && <span className="text-[10px] font-mono text-slate-400">{gameTitle}</span>}
        </div>

        <div className="w-full py-2 rounded-xl bg-white/5 border border-yellow-400/30 flex items-center justify-center gap-1.5 font-mono">
          <span className="text-xs text-slate-300 font-bold">النقاط:</span>
          <span className="text-base font-black text-yellow-400">{points.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  // Render Variant C: Champion
  if (variant === 'CHAMPION') {
    return (
      <div 
        onClick={onClick}
        className={`p-6 rounded-3xl bg-gradient-to-b from-[#241E12] via-[#120F08] to-[#241E12] border-2 border-amber-400 shadow-[0_15px_60px_rgba(245,158,11,0.5)] flex flex-col items-center text-center gap-4 text-white relative overflow-hidden transition-all hover:scale-[1.03] ${className}`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />

        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs font-mono shadow-lg flex items-center gap-1.5">
          <Crown className="w-4 h-4" />
          <span>👑 CHAMPION OF THE SEASON</span>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-amber-400/20 blur-md animate-pulse" />
          <img src={avatarUrl} alt={displayName} className="relative w-28 h-28 rounded-full object-cover border-4 border-amber-400 shadow-2xl" />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-black text-white drop-shadow-md">{displayName}</h2>
          <span className="text-xs font-mono text-amber-300/90 font-bold">بطل التنافس المباشر</span>
        </div>

        <div className="px-6 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-black text-lg">
          +{points.toLocaleString()} نقطة فوز 💎
        </div>
      </div>
    );
  }

  // Render Variant D: Top 3 Podium Card
  const isRank1 = rank === 1;
  const isRank2 = rank === 2;
  const rankBorder = isRank1 ? 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)]' : isRank2 ? 'border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.2)]' : 'border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.2)]';
  const rankBadgeBg = isRank1 ? 'bg-amber-400 text-slate-950' : isRank2 ? 'bg-slate-200 text-slate-950' : 'bg-amber-700 text-white';

  return (
    <div 
      onClick={onClick}
      className={`p-3 sm:p-4 rounded-2xl bg-[#121426] border ${rankBorder} flex items-center justify-between gap-3 text-white transition-all hover:scale-[1.02] ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shadow-md ${rankBadgeBg}`}>
          #{rank}
        </span>
        <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover border border-white/20" />
        <span className="text-xs font-black text-white truncate max-w-[120px]">{displayName}</span>
      </div>

      <div className="flex items-center gap-1 font-mono text-xs font-black text-amber-300">
        <span>{points.toLocaleString()}</span>
        <span className="text-[9px] text-slate-400 font-normal">نقطة</span>
      </div>
    </div>
  );
}
