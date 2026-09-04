'use client';

import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { Trophy, Crown, Medal, Award, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';

export default function LeaderboardPage() {
  const { leaderboard, resetLeaderboard, tiktokEngine } = useStudioStore();
  const roomStatus = tiktokEngine ? tiktokEngine.getRoomStatus() : null;

  // Only show players who actually scored points
  const scoredLeaderboard = leaderboard.filter(p => p.score > 0);
  const top3 = scoredLeaderboard.slice(0, 3);
  const rest = scoredLeaderboard.slice(3);

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-arena-card border border-white/10 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">لوحة المتصدرين الحقيقية للبث (Real Live Leaderboard)</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 backdrop-blur-md ${
                roomStatus?.isOnline
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}>
                <span>{roomStatus?.isOnline ? `🟢 بث أونلاين: @${roomStatus.username}` : '🔴 غير متصل'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">ترتيب الأبطال الحقيقيين والفائزين بأولى الإجابات الصحيحة في شات TikTok LIVE</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('هل أنت تأكد من رغبتك في تصفير لوحة الصدارة وإعادة كافة النقاط للصفر؟')) {
                resetLeaderboard();
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/15 text-rose-300 hover:text-white border border-rose-500/30 hover:bg-rose-600/30 font-extrabold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تصفير لوحة الصدارة</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-extrabold text-xs backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>عدد المتصدرين بالنقاط: <strong className="text-white font-mono text-sm">{scoredLeaderboard.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Empty Leaderboard Notice if no correct answers yet */}
      {scoredLeaderboard.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center gap-4 glass-arena-card rounded-3xl border border-white/10 my-4 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Trophy className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">لا يوجد متصدرون حتى الآن</h3>
            <p className="text-slate-300 text-xs mt-1 max-w-md">
              عند بدء تشغيل الأسئلة وإرسال الجمهور للإجابة الصحيحة في شات TikTok LIVE المباشر، سيتم احتساب النقاط (5، 4، 3، 2، 1) وتتويج الأبطال الثلاثة الأوائل هنا تلقائياً!
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-2">
            {/* 2nd Place */}
            {top3[1] ? (
              <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col items-center gap-3 text-center order-2 md:order-1 mt-6 backdrop-blur-xl">
                <Medal className="w-10 h-10 text-slate-300" />
                <img src={top3[1].avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'} alt={top3[1].displayName} className="w-16 h-16 rounded-full border-2 border-slate-300 object-cover" />
                <h3 className="text-lg font-black text-white">{top3[1].displayName}</h3>
                <span className="text-xs font-mono text-slate-400">{top3[1].username}</span>
                <span className="px-3 py-1 rounded-full bg-slate-300/15 text-slate-200 border border-slate-300/30 font-mono font-black text-sm">
                  {top3[1].score} ★ (المركز الثاني)
                </span>
              </div>
            ) : (
              <div className="p-6 rounded-3xl glass-arena-card border border-white/5 flex flex-col items-center gap-2 text-center order-2 md:order-1 opacity-50 mt-6 backdrop-blur-xl">
                <Medal className="w-8 h-8 text-slate-600" />
                <span className="text-xs text-slate-500 font-bold">المركز الثاني بانتظار الفائز...</span>
              </div>
            )}

            {/* 1st Place (Champion) */}
            {top3[0] && (
              <div className="p-6 rounded-3xl gold-winner-card border border-amber-400/60 flex flex-col items-center gap-3 text-center order-1 md:order-2 shadow-lg">
                <Crown className="w-12 h-12 text-amber-400 animate-bounce drop-shadow-md" />
                <img src={top3[0].avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'} alt={top3[0].displayName} className="w-20 h-20 rounded-full border-4 border-amber-400 object-cover" />
                <h3 className="text-xl font-black text-amber-300 gold-text-glow">{top3[0].displayName}</h3>
                <span className="text-xs font-mono text-amber-200">{top3[0].username}</span>
                <span className="px-4 py-1.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/50 font-mono font-black text-base">
                  {top3[0].score} ★ (🏆 بطل البث)
                </span>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] ? (
              <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col items-center gap-3 text-center order-3 mt-8 backdrop-blur-xl">
                <Award className="w-10 h-10 text-amber-600" />
                <img src={top3[2].avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'} alt={top3[2].displayName} className="w-16 h-16 rounded-full border-2 border-amber-600 object-cover" />
                <h3 className="text-lg font-black text-white">{top3[2].displayName}</h3>
                <span className="text-xs font-mono text-slate-400">{top3[2].username}</span>
                <span className="px-3 py-1 rounded-full bg-amber-700/15 text-amber-400 border border-amber-600/30 font-mono font-black text-sm">
                  {top3[2].score} ★ (المركز الثالث)
                </span>
              </div>
            ) : (
              <div className="p-6 rounded-3xl glass-arena-card border border-white/5 flex flex-col items-center gap-2 text-center order-3 opacity-50 mt-8 backdrop-blur-xl">
                <Award className="w-8 h-8 text-slate-600" />
                <span className="text-xs text-slate-500 font-bold">المركز الثالث بانتظار الفائز...</span>
              </div>
            )}
          </div>

          {/* Rest of Leaderboard Table */}
          {rest.length > 0 && (
            <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-4 backdrop-blur-xl">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>باقي تصفية المتصدرين المعروضين</span>
              </h3>

              <div className="divide-y divide-white/5 font-bold text-xs">
                {rest.map((p, idx) => (
                  <div key={p.userId || p.username || `player-${idx}`} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-black text-slate-400 w-6">#{p.rank}</span>
                      <img src={p.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'} alt={p.displayName} className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                      <div>
                        <h4 className="font-extrabold text-white">{p.displayName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{p.username}</span>
                      </div>
                    </div>

                    <span className="font-mono font-black text-amber-300 text-sm">{p.score} ★</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
