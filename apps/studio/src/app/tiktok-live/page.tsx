'use client';

import React, { useState, useEffect } from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { LiveRoomStatus } from '@aep/tiktok-live';
import { MessageSquare, Radio, CheckCircle2, Flame, RefreshCw, Users, AlertCircle, ExternalLink, ShieldCheck, Play, Pause, Sparkles } from 'lucide-react';

export default function TikTokLivePage() {
  const { liveComments, tiktokEngine } = useStudioStore();
  const [channelInput, setChannelInput] = useState('soul80813');
  const [roomStatus, setRoomStatus] = useState<LiveRoomStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aep_tiktok_channel');
      if (saved) {
        setChannelInput(saved === 'sou180813' ? 'soul80813' : saved);
      }
    }
    if (tiktokEngine) {
      setRoomStatus(tiktokEngine.getRoomStatus());
    }
  }, [tiktokEngine]);

  // Subscribe to live status changes automatically
  useEffect(() => {
    if (tiktokEngine) {
      const handleStatus = (status: LiveRoomStatus) => {
        setRoomStatus(status);
      };
      tiktokEngine.onStatus(handleStatus);
      return () => {
        tiktokEngine.offStatus(handleStatus);
      };
    }
  }, [tiktokEngine]);

  const handleConnectAndCheckLive = async () => {
    const cleanName = channelInput.trim().replace(/^@/, '');
    if (!cleanName) return;

    setChannelInput(cleanName);
    setIsChecking(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('aep_tiktok_channel', cleanName);
      }
      if (tiktokEngine) {
        // Disconnect first to ensure clean state
        tiktokEngine.disconnect();
        const status = await tiktokEngine.connect(cleanName);
        setRoomStatus(status);
      }
    } catch (e) {
      console.warn('Connection check error:', e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleToggleSimulation = () => {
    if (!tiktokEngine) return;
    if (isSimulating) {
      tiktokEngine.stopSimulation();
      setIsSimulating(false);
    } else {
      tiktokEngine.startSimulation();
      setIsSimulating(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-arena-card border border-white/10 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-red-600 text-white flex items-center justify-center font-black shadow-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">تكامل TikTok LIVE المباشر (Real Connector)</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 backdrop-blur-md ${
                roomStatus?.isOnline || isSimulating
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              }`}>
                <Radio className="w-3 h-3 animate-pulse" />
                <span>{roomStatus?.isOnline ? '🟢 البث المباشر أونلاين' : isSimulating ? '🧪 البث التجريبي فعال' : '🔴 غير متصل أوفلاين'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">الربط واستعلام حالة البث المباشر للحساب، استقبال تعليقات الجمهور ومطابقة الإجابات آلياً</p>
          </div>
        </div>

        {/* Live Channel Connect Form & Simulation Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <span className="absolute right-3 top-3 text-slate-400 font-bold text-xs">@</span>
            <input
              type="text"
              value={channelInput}
              onChange={(e) => setChannelInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isChecking) {
                  handleConnectAndCheckLive();
                }
              }}
              placeholder="اسم حساب TikTok..."
              className="w-full pr-8 pl-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono font-bold focus:border-pink-400 outline-none transition-all"
            />
          </div>

          <button
            onClick={handleConnectAndCheckLive}
            disabled={isChecking}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 text-white font-extrabold text-xs shadow-md hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'جاري الفحص...' : 'فحص والربط بالبث'}</span>
          </button>

          {/* Simulation Toggle Button for Testing anytime */}
          <button
            onClick={handleToggleSimulation}
            className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 border border-amber-400'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isSimulating ? 'إيقاف التجريبي' : 'تشغيل البث التجريبي 🧪'}</span>
          </button>
        </div>
      </div>

      {/* Real Live Stream Room Verification Card */}
      {hasMounted && roomStatus && (
        <div className={`p-6 rounded-3xl glass-arena-card border flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl ${
          roomStatus.isOnline || isSimulating ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-rose-500/20 bg-rose-500/5'
        }`}>
          <div className="flex items-center gap-4">
            <img
              src={roomStatus.avatarUrl || '/alshaib-logo.png'}
              alt={roomStatus.username || channelInput}
              className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-md"
            />

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-white text-lg">@{roomStatus.username || channelInput}</h4>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  roomStatus.isOnline || isSimulating ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {isSimulating ? '🟢 وضع المحاكاة والبث التجريبي يعمل بنجاح' : roomStatus.statusText}
                </span>
              </div>
              {roomStatus.title && <p className="text-xs text-slate-300 mt-0.5">{roomStatus.title}</p>}
            </div>
          </div>

          {(roomStatus.isOnline || isSimulating) && (
            <div className="flex items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>المشاهدون الحالية: <strong className="text-white font-mono">{roomStatus.viewerCount || (isSimulating ? 1284 : 0)}</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>معرف الغرفة: <strong className="text-cyan-300 font-mono">{roomStatus.roomId || 'room-live'}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Guidance Card if offline */}
      {roomStatus && !roomStatus.isOnline && !isSimulating && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              نصيحة: إذا لم تكن طالع بث مباشر على TikTok الآن، يمكنك الضغط على <strong>"تشغيل البث التجريبي 🧪"</strong> في الأعلى لتوليد تعليقات وإجابات تجريبية واختبار اللعبة مباشرة!
            </span>
          </div>
          <button
            onClick={handleToggleSimulation}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-sm hover:scale-105 transition-all"
          >
            بدء التجريبي الآن 🚀
          </button>
        </div>
      )}

      {/* Stream Feed Console */}
      <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-4 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-md font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-pink-400" />
            <span>تدفق تعليقات البث اللحظية (Real Chat Stream)</span>
          </h3>
          <span className="text-xs text-slate-400">إجمالي التعليقات المستلمة: <strong className="text-cyan-400 font-mono">{liveComments.length}</strong></span>
        </div>

        {liveComments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold glass-arena-card rounded-2xl border border-white/8 flex flex-col items-center gap-3">
            <MessageSquare className="w-10 h-10 text-slate-600 animate-pulse" />
            <span>في انتظار استقبال تعليقات البث أو تشغيل البث التجريبي...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {liveComments.map((c) => (
              <div key={c.id} className="p-3 rounded-2xl bg-white/5 border border-white/8 flex items-start gap-3 text-xs hover:border-pink-400/40 transition-all">
                <img
                  src={c.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                  alt={c.displayName}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
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
