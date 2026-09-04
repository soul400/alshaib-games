'use client';

import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { BarChart3, TrendingUp, Users, MessageSquare, Target, Eye, Zap, Radio } from 'lucide-react';

export default function AnalyticsPage() {
  const { leaderboard, liveComments, tiktokEngine } = useStudioStore();
  const roomStatus = tiktokEngine ? tiktokEngine.getRoomStatus() : null;

  // Real-time calculations
  const totalViewers = roomStatus?.viewerCount || 0;
  const totalComments = liveComments.length;
  const totalCorrectAnswers = leaderboard.reduce((sum, p) => sum + p.correctAnswersCount, 0);
  const totalPointsDistributed = leaderboard.reduce((sum, p) => sum + p.score, 0);
  
  // Calculate dynamic real engagement percentage
  const uniqueUsersCount = new Set(liveComments.map((c) => c.userId)).size;
  const engagementRate = totalViewers > 0
    ? ((uniqueUsersCount / totalViewers) * 100).toFixed(1)
    : totalComments > 0 ? '100.0' : '0.0';

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-arena-card border border-white/10 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">إحصائيات وتحليلات البث اللحظية (Real Live Analytics)</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 backdrop-blur-md ${
                roomStatus?.isOnline
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}>
                <Radio className="w-3 h-3 animate-pulse" />
                <span>{roomStatus?.isOnline ? `🟢 بث مباشر: @${roomStatus.username}` : '🟡 غير متصل أوفلاين'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">مراقبة تفاعل المشاهدين الحقيقيين، معدل الإجابات الصحيحة، ونشاط شات TikTok LIVE الفعلي</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-extrabold text-xs backdrop-blur-md">
          <TrendingUp className="w-4 h-4" />
          <span>معدل التفاعل الفعلي: <strong className="text-white font-mono text-sm">{engagementRate}%</strong></span>
        </div>
      </div>

      {/* Analytics KPI Cards - 100% Real Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Real Live Viewer Count */}
        <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-2 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">المشاهدون الحالية في البث</span>
            <Eye className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono">{totalViewers}</span>
          <span className="text-[10px] text-cyan-400 font-bold">
            {roomStatus?.isOnline ? '🟢 البث مباشر الآن' : 'في انتظار بدء البث'}
          </span>
        </div>

        {/* Real Received Comments */}
        <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-2 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">التعليقات الحقيقية المستلمة</span>
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono">{totalComments}</span>
          <span className="text-[10px] text-emerald-400 font-bold">
            من <strong className="text-white font-mono">{uniqueUsersCount}</strong> متابع متفاعل في الشات
          </span>
        </div>

        {/* Real Correct Answers */}
        <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-2 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">الإجابات الصحيحة الفائزة</span>
            <Target className="w-5 h-5 text-rose-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono">{totalCorrectAnswers}</span>
          <span className="text-[10px] text-amber-400 font-bold">
            محتسبة تلقائياً من المحرك
          </span>
        </div>

        {/* Real Points Distributed */}
        <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-2 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">إجمالي النقاط الموزعة</span>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <span className="text-3xl font-black text-amber-300 font-mono">{totalPointsDistributed} ★</span>
          <span className="text-[10px] text-emerald-400 font-bold">نقاط تنازلية للمتسابقين الأسرع</span>
        </div>
      </div>

      {/* Real Live Comments Log in Analytics */}
      <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-4 backdrop-blur-xl">
        <h3 className="text-md font-black text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <span>آخر التعليقات المستلمة فعلياً من البث الحقيقي</span>
        </h3>

        {liveComments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-bold glass-arena-card rounded-2xl border border-white/8">
            لم يتم استقبال أي تعليقات حتى الآن في البث المباشر.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
            {liveComments.slice(0, 15).map((c) => (
              <div key={c.id} className="p-3 rounded-2xl bg-white/5 border border-white/8 flex items-start gap-3 text-xs">
                <img
                  src={c.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                  alt={c.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white truncate">{c.displayName}</span>
                    <span className="text-[10px] text-pink-300 font-mono">{c.username}</span>
                  </div>
                  <p className="text-slate-200 font-semibold mt-1 break-words bg-white/5 p-2 rounded-xl border border-white/5">
                    {c.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
