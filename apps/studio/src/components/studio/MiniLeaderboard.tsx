'use client';

import React from 'react';
import { PlayerScore } from '@aep/types';
import { Trophy, Crown } from 'lucide-react';

interface MiniLeaderboardProps {
  leaderboard: PlayerScore[];
  maxItems?: number;
  className?: string;
}

export function MiniLeaderboard({
  leaderboard,
  maxItems = 5,
  className = ''
}: MiniLeaderboardProps) {
  const getScore = (p: any): number => {
    if (!p) return 0;
    return Number(p.score ?? p.points ?? 0) || 0;
  };

  const sorted = [...leaderboard].sort((a, b) => getScore(b) - getScore(a)).slice(0, maxItems);

  return (
    <div className={`p-3 rounded-2xl bg-[#0F111E]/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col gap-2 dir-rtl select-none ${className}`}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
          <Trophy className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>المتصدرون</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-bold">{sorted.length} متسابق</span>
      </div>

      <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[180px] pr-0.5">
        {sorted.map((player, idx) => {
          const rank = idx + 1;
          const isTop1 = rank === 1;

          return (
            <div
              key={player.userId || (player as any).id || `mini-p-${idx}`}
              className={`p-1.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all ${
                isTop1 
                  ? 'bg-amber-500/15 border-amber-400/40 text-white font-black' 
                  : 'bg-white/5 border-white/10 text-slate-300 font-bold'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono font-black text-[10px] shrink-0 ${
                  isTop1 ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-400'
                }`}>
                  {isTop1 ? '👑' : `#${rank}`}
                </span>
                <img src={player.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/15" />
                <span className="truncate max-w-[90px]">{player.displayName}</span>
              </div>

              <span className="font-mono font-black text-amber-300 text-[11px] shrink-0">
                +{getScore(player).toLocaleString()}
              </span>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="py-3 text-center text-[10px] text-slate-500 font-bold">
            بانتظار النقاط...
          </div>
        )}
      </div>
    </div>
  );
}
