'use client';

import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { Users, Award, Shield, CheckCircle, Search, UserCheck, MessageSquare, Trophy, RotateCcw } from 'lucide-react';

export default function PlayersPage() {
  const { leaderboard, resetLeaderboard, liveComments, tiktokEngine } = useStudioStore();
  const roomStatus = tiktokEngine ? tiktokEngine.getRoomStatus() : null;

  // Only show players who have scored points (correct answers only)
  const scoredPlayers = leaderboard.filter(p => p.correctAnswersCount > 0);

  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPlayers = scoredPlayers.filter((p) =>
    p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-arena-card border border-white/10 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black shadow-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">إدارة وإحصائيات اللاعبين الحقيقية</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 backdrop-blur-md ${
                roomStatus?.isOnline
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}>
                <span>{roomStatus?.isOnline ? `🟢 بث مباشر: @${roomStatus.username}` : '🟡 في انتظار البث'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">يظهر فقط اللاعبون الذين أجابوا إجابات صحيحة من شات TikTok LIVE</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('هل أنت تأكد من رغبتك في تصفير النقاط وإلغاء لوحة المتصدرين؟')) {
                resetLeaderboard();
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/15 text-rose-300 hover:text-white border border-rose-500/30 hover:bg-rose-600/30 font-extrabold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تصفير النقاط واللاعبين</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-extrabold text-xs backdrop-blur-md">
            <Trophy className="w-4 h-4" />
            <span>اللاعبون الفائزون: <strong className="text-white font-mono text-sm">{scoredPlayers.length}</strong></span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-300 font-extrabold text-xs backdrop-blur-md">
            <CheckCircle className="w-4 h-4" />
            <span>إجمالي الإجابات الصحيحة: <strong className="text-white font-mono text-sm">{scoredPlayers.reduce((sum, p) => sum + p.correctAnswersCount, 0)}</strong></span>
          </div>
        </div>
      </div>

      {/* Players List Table */}
      <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span>قائمة المتنافسين الذين أجابوا إجابات صحيحة</span>
          </h3>

          <div className="relative w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث باسم اللاعب أو اليوزر..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-400 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3 glass-arena-card rounded-2xl border border-white/8 my-4">
            <Users className="w-12 h-12 text-slate-500 animate-pulse" />
            <p className="text-white font-extrabold text-lg">لا يوجد لاعبون أجابوا إجابات صحيحة حتى الآن</p>
            <p className="text-slate-400 text-xs max-w-md">
              عند بدء تشغيل الأسئلة وإرسال الجمهور للإجابات الصحيحة في شات TikTok LIVE، سيتم تسجيل أسمائهم ونقاطهم هنا تلقائياً.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-extrabold pb-3">
                  <th className="pb-3 pr-4">الترتيب</th>
                  <th className="pb-3">اللاعب (TikTok User)</th>
                  <th className="pb-3">اليوزر</th>
                  <th className="pb-3">الإجابات الصحيحة</th>
                  <th className="pb-3">آخر إجابة صحيحة</th>
                  <th className="pb-3">مجموع النقاط</th>
                  <th className="pb-3 pl-4">الشارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-bold">
                {filteredPlayers.map((player, idx) => (
                  <tr key={player.userId || player.username || `player-${idx}`} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-black text-cyan-300">#{player.rank}</td>
                    <td className="py-3.5 flex items-center gap-3">
                      <img src={player.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'} alt={player.displayName} className="w-8 h-8 rounded-full border border-cyan-400/40 object-cover" />
                      <span className="text-white font-extrabold">{player.displayName}</span>
                    </td>
                    <td className="py-3.5 font-mono text-pink-300">{player.username}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {player.correctAnswersCount} إجابات صحيحة
                      </span>
                    </td>
                    <td className="py-3.5 text-emerald-300 max-w-xs truncate font-mono">
                      {player.lastCorrectAnswer || '—'}
                    </td>
                    <td className="py-3.5 font-mono font-black text-amber-300 text-sm">{player.score} ★</td>
                    <td className="py-3.5 pl-4">
                      {player.badge ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-black">
                          {player.badge}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px]">فائز بالنقاط</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
