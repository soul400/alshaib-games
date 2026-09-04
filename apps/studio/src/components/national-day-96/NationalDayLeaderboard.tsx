'use client';

import React from 'react';
import { NationalDayLeaderboardEntry } from '@aep/types';
import { Trophy, Crown, Medal, Award, Flame, Star, Shield, Sparkles } from 'lucide-react';

interface Props {
  entries: NationalDayLeaderboardEntry[];
  onResetSeason?: () => void;
}

export function NationalDayLeaderboard({ entries, onResetSeason }: Props) {
  const sorted = [...entries].sort((a, b) => b.nationalPoints - a.nationalPoints);
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];
  const rest = sorted.slice(3, 15);

  return (
    <div className="w-full flex flex-col gap-8 my-6">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-[#006C35]/40 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C69214] to-[#FFE79A] flex items-center justify-center text-slate-950 font-black shadow-[0_0_25px_rgba(198,146,20,0.6)]">
            <Trophy className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>لوحة صدارة اليوم الوطني 96</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00A859]/20 text-[#00A859] border border-[#00A859]/40 font-mono">
                NATIONAL SEASON PODIUM
              </span>
            </h2>
            <span className="text-xs text-[#E2D4B7]/70 font-bold">
              أبطال البث المباشر وأصحاب أعلى النقاط الوطنية
            </span>
          </div>
        </div>

        {onResetSeason && (
          <button
            onClick={onResetSeason}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer"
          >
            تصفير موسم اليوم الوطني
          </button>
        )}
      </div>

      {/* 🏆 1. ROYAL PODIUM (Top 3 Champions) */}
      {top1 && (
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-end justify-center my-4">
          
          {/* 🥈 TOP 2 (Left / Silver) */}
          {top2 && (
            <div className="order-2 md:order-1 flex flex-col items-center p-6 rounded-3xl bg-gradient-to-b from-[#082113] to-[#04120A] border-2 border-slate-300/40 shadow-xl relative hover:scale-105 transition-transform duration-300">
              <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-mono font-black text-sm flex items-center justify-center -mt-10 mb-2 shadow-md border-2 border-white">
                2
              </div>

              <div className="relative mb-3">
                <img src={top2.avatarUrl} alt={top2.displayName} className="w-20 h-20 rounded-full object-cover border-3 border-slate-300 shadow-lg bg-slate-900" />
                <span className="absolute -bottom-1 -right-1 text-xl">🥈</span>
              </div>

              <h3 className="text-lg font-black text-white truncate max-w-[150px]">{top2.displayName}</h3>
              <span className="text-xs font-mono text-[#00A859] font-bold">@{top2.username}</span>

              <div className="mt-4 px-4 py-1.5 rounded-xl bg-slate-300/10 border border-slate-300/30 text-white font-mono font-black text-base">
                +{top2.nationalPoints.toLocaleString()} <span className="text-xs font-normal text-[#E2D4B7]">نقطة</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold mt-1.5">{top2.correctAnswersCount} إجابة صحيحة</span>
            </div>
          )}

          {/* 🥇 TOP 1 (Center / Sovereign Gold) */}
          <div className="order-1 md:order-2 flex flex-col items-center p-8 rounded-3xl bg-gradient-to-b from-[#1E1908] via-[#0E2C19] to-[#06150C] border-3 border-[#C69214] shadow-[0_0_60px_rgba(198,146,20,0.5)] relative scale-105 hover:scale-110 transition-transform duration-300 z-10">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#C69214] to-[#FFE79A] text-slate-950 font-mono font-black text-lg flex items-center justify-center -mt-13 mb-2 shadow-[0_0_20px_rgba(198,146,20,0.8)] border-2 border-white animate-bounce">
              <Crown className="w-6 h-6 fill-current" />
            </div>

            <div className="relative mb-3">
              <div className="absolute -inset-2 rounded-full bg-[#C69214]/40 blur-md animate-pulse" />
              <img src={top1.avatarUrl} alt={top1.displayName} className="relative w-24 h-24 rounded-full object-cover border-4 border-[#C69214] shadow-2xl bg-slate-900" />
              <span className="absolute -bottom-1 -right-1 text-2xl">🥇</span>
            </div>

            <span className="px-3 py-0.5 rounded-full bg-[#C69214]/20 border border-[#C69214]/40 text-[#E2D4B7] text-[10px] font-mono font-black mb-1">
              بطل اليوم الوطني 96 🇸🇦
            </span>
            <h3 className="text-xl font-black text-white truncate max-w-[180px]">{top1.displayName}</h3>
            <span className="text-xs font-mono text-[#00A859] font-bold">@{top1.username}</span>

            <div className="mt-4 px-6 py-2 rounded-2xl bg-gradient-to-r from-[#C69214] to-[#FFE79A] text-slate-950 font-mono font-black text-xl shadow-lg">
              +{top1.nationalPoints.toLocaleString()} نقطة
            </div>
            <span className="text-xs text-[#E2D4B7] font-bold mt-2">{top1.correctAnswersCount} إجابة صحيحة • {top1.winsCount} فوز</span>
          </div>

          {/* 🥉 TOP 3 (Right / Bronze) */}
          {top3 && (
            <div className="order-3 flex flex-col items-center p-6 rounded-3xl bg-gradient-to-b from-[#1F140A] to-[#0D0804] border-2 border-[#D97706]/40 shadow-xl relative hover:scale-105 transition-transform duration-300">
              <div className="w-8 h-8 rounded-full bg-[#D97706] text-white font-mono font-black text-sm flex items-center justify-center -mt-10 mb-2 shadow-md border-2 border-white">
                3
              </div>

              <div className="relative mb-3">
                <img src={top3.avatarUrl} alt={top3.displayName} className="w-20 h-20 rounded-full object-cover border-3 border-[#D97706] shadow-lg bg-slate-900" />
                <span className="absolute -bottom-1 -right-1 text-xl">🥉</span>
              </div>

              <h3 className="text-lg font-black text-white truncate max-w-[150px]">{top3.displayName}</h3>
              <span className="text-xs font-mono text-[#00A859] font-bold">@{top3.username}</span>

              <div className="mt-4 px-4 py-1.5 rounded-xl bg-[#D97706]/15 border border-[#D97706]/30 text-white font-mono font-black text-base">
                +{top3.nationalPoints.toLocaleString()} <span className="text-xs font-normal text-[#E2D4B7]">نقطة</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold mt-1.5">{top3.correctAnswersCount} إجابة صحيحة</span>
            </div>
          )}

        </div>
      )}

      {/* 📜 2. REST OF LEADERBOARD TABLE (Rank 4 - 15) */}
      <div className="w-full max-w-4xl mx-auto rounded-3xl bg-[#081B10] border border-[#006C35]/50 overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#05140C] border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-black text-[#E2D4B7] font-mono">قائمة الأبطال والمنافسين</span>
          <span className="text-[11px] text-slate-400 font-bold">{sorted.length} متسابق نشط</span>
        </div>

        <div className="divide-y divide-white/5">
          {rest.map((player, idx) => (
            <div
              key={player.userId}
              className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-[#004D25] text-[#E2D4B7] font-mono font-black text-xs flex items-center justify-center border border-[#00A859]/30">
                  #{idx + 4}
                </span>

                <img src={player.avatarUrl} alt={player.displayName} className="w-10 h-10 rounded-full object-cover border border-[#00A859]" />

                <div className="flex flex-col">
                  <span className="text-sm font-black text-white">{player.displayName}</span>
                  <span className="text-xs font-mono text-slate-400">@{player.username}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-[#E2D4B7]/70 font-bold hidden sm:inline">
                  {player.correctAnswersCount} إجابة
                </span>

                <span className="px-3.5 py-1 rounded-xl bg-[#004D25]/50 border border-[#00A859]/40 text-[#00A859] font-mono font-black text-sm">
                  +{player.nationalPoints.toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {sorted.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm font-bold">
              لا توجد نقاط مسجلة بعد... ابدأ الفعالية في البث المباشر!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
