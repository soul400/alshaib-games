'use client';

import React from 'react';
import { PlayerScore } from '@aep/types';
import { Trophy, Crown, Medal, Flame, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

interface LiveLeaderboardProps {
  leaderboard: PlayerScore[];
  title?: string;
  subtitle?: string;
  isBroadcastClipMode?: boolean;
  maxItems?: number;
  className?: string;
}

export function LiveLeaderboard({
  leaderboard,
  title = 'المتصدرون الآن',
  subtitle = 'LIVE GAME RANKING',
  isBroadcastClipMode = false,
  maxItems = 10,
  className = ''
}: LiveLeaderboardProps) {
  const getScore = (p: any): number => {
    if (!p) return 0;
    return Number(p.score ?? p.points ?? 0) || 0;
  };

  const sorted = [...leaderboard].sort((a, b) => getScore(b) - getScore(a));
  const displayItems = sorted.slice(0, maxItems);
  const top1 = displayItems[0];
  const top2 = displayItems[1];
  const top3 = displayItems[2];
  const rest = displayItems.slice(3);

  return (
    <div className={`w-full flex flex-col gap-4 dir-rtl select-none ${className}`}>
      
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#06B6D4] text-white font-black flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Trophy className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{title}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30 font-mono">
                {subtitle}
              </span>
            </h3>
            <span className="text-[11px] text-slate-400 font-bold">تحديث الترتيب المباشر حسب إجمالي النقاط</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-xs font-mono font-bold text-[#10B981]">مباشر ⚡ LIVE</span>
        </div>
      </div>

      {/* 🌟 TOP 3 HERO PODIUM SECTION */}
      {displayItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-1">
          {/* #2 SILVER (Rendered on left in RTL if 3 items) */}
          {top2 ? (
            <div className="p-4 rounded-2xl bg-[#161B26] border border-[#06B6D4]/50 shadow-lg flex flex-col items-center text-center gap-2 order-2 sm:order-1">
              <div className="w-6 h-6 rounded-full bg-[#06B6D4] text-[#0B0E14] font-black text-xs flex items-center justify-center shadow-md font-mono">
                #2
              </div>
              <img src={top2.avatarUrl} alt={top2.displayName} className="w-14 h-14 rounded-full object-cover border-2 border-[#06B6D4] shadow-md" />
              <span className="text-xs font-black text-white truncate max-w-[120px]">{top2.displayName}</span>
              <span className="text-sm font-black font-mono text-[#06B6D4]">+{getScore(top2).toLocaleString()}</span>
            </div>
          ) : <div className="hidden sm:block order-1" />}

          {/* #1 HERO GOLD (Center - Biggest Prominence) */}
          {top1 && (
            <div className="p-5 rounded-3xl bg-[#161B26] border-2 border-[#10B981] shadow-[0_0_35px_rgba(16,185,129,0.35)] flex flex-col items-center text-center gap-2.5 order-1 sm:order-2 scale-105 z-10">
              <div className="px-3 py-0.5 rounded-full bg-[#10B981] text-slate-950 font-black text-[11px] font-mono flex items-center gap-1 shadow-md">
                <Crown className="w-3.5 h-3.5" />
                <span>#1 المتصدر</span>
              </div>
              <div className="relative">
                <img src={top1.avatarUrl} alt={top1.displayName} className="w-20 h-20 rounded-full object-cover border-2 border-[#10B981] shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
                <Sparkles className="w-5 h-5 text-[#10B981] absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-sm font-black text-white truncate max-w-[140px] drop-shadow-md">{top1.displayName}</span>
              <span className="text-lg font-black font-mono text-[#10B981]">+{getScore(top1).toLocaleString()} <span className="text-xs font-normal text-slate-400">نقطة</span></span>
            </div>
          )}

          {/* #3 BRONZE */}
          {top3 ? (
            <div className="p-4 rounded-2xl bg-[#161B26] border border-[#06B6D4]/30 shadow-lg flex flex-col items-center text-center gap-2 order-3">
              <div className="w-6 h-6 rounded-full bg-[#06B6D4]/70 text-[#0B0E14] font-black text-xs flex items-center justify-center shadow-md font-mono">
                #3
              </div>
              <img src={top3.avatarUrl} alt={top3.displayName} className="w-14 h-14 rounded-full object-cover border-2 border-[#06B6D4]/60 shadow-md" />
              <span className="text-xs font-black text-white truncate max-w-[120px]">{top3.displayName}</span>
              <span className="text-sm font-black font-mono text-[#06B6D4]">+{getScore(top3).toLocaleString()}</span>
            </div>
          ) : <div className="hidden sm:block order-3" />}
        </div>
      )}

      {/* REST OF RANKINGS (#4+) */}
      {rest.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {rest.map((player, idx) => {
            const actualRank = idx + 4;
            return (
              <div
                key={player.userId || (player as any).id || `player-${idx}`}
                className="p-3 rounded-2xl bg-[#161B26] border border-[#262C3A] hover:border-[#8B5CF6]/50 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-mono font-black text-xs flex items-center justify-center">
                    #{actualRank}
                  </span>
                  <img src={player.avatarUrl} alt={player.displayName} className="w-9 h-9 rounded-full object-cover border border-white/15" />
                  <span className="text-xs font-black text-white truncate max-w-[140px]">{player.displayName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-[#10B981]">+{getScore(player).toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 font-mono">نقطة</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {displayItems.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-xs font-bold bg-[#121424] rounded-2xl border border-[#232736]">
          بانتظار تسجيل النقاط وإجابات الجمهور...
        </div>
      )}

    </div>
  );
}
