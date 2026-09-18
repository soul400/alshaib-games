'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { LiveRoomStatus } from '@aep/tiktok-live';
import type { AEPRealtimeEvent, AEPGatewayHealthMetrics } from '@aep/types';
import {
  MessageSquare,
  Radio,
  RefreshCw,
  Users,
  ShieldCheck,
  Play,
  Pause,
  Sparkles,
  Activity,
  Zap,
  Gift,
  Heart,
  UserPlus,
  Share2,
  AlertTriangle,
  Power,
  RotateCw,
} from 'lucide-react';

export default function TikTokLivePage() {
  const { liveComments, tiktokEngine } = useStudioStore();
  const [channelInput, setChannelInput] = useState('soul80813');
  const [roomStatus, setRoomStatus] = useState<LiveRoomStatus | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<AEPGatewayHealthMetrics | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [eventFilter, setEventFilter] = useState<'ALL' | 'CHAT' | 'GIFT' | 'LIKE' | 'FOLLOW' | 'SYSTEM'>('ALL');
  const [recentEvents, setRecentEvents] = useState<AEPRealtimeEvent[]>([]);

  // Fetch health metrics periodically
  const fetchHealthMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/tiktok-live/health');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setHealthMetrics(json.data);
        }
      }
    } catch (_) {}
  }, []);

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

    fetchHealthMetrics();
    const interval = setInterval(fetchHealthMetrics, 3000);
    return () => clearInterval(interval);
  }, [tiktokEngine, fetchHealthMetrics]);

  // Subscribe to live status changes and raw events
  useEffect(() => {
    if (tiktokEngine) {
      const handleStatus = (status: LiveRoomStatus) => {
        setRoomStatus(status);
      };
      const handleEvent = (ev: AEPRealtimeEvent) => {
        setRecentEvents((prev) => [ev, ...prev.slice(0, 49)]);
      };

      tiktokEngine.onStatus(handleStatus);
      if (typeof (tiktokEngine as any).onEvent === 'function') {
        (tiktokEngine as any).onEvent(handleEvent);
      }

      return () => {
        tiktokEngine.offStatus(handleStatus);
        if (typeof (tiktokEngine as any).offEvent === 'function') {
          (tiktokEngine as any).offEvent(handleEvent);
        }
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
        const status = await tiktokEngine.connect(cleanName);
        setRoomStatus(status);
        fetchHealthMetrics();
      }
    } catch (e) {
      console.warn('Connection check error:', e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleForceReconnect = async () => {
    setIsChecking(true);
    try {
      await fetch('/api/tiktok-live/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reconnect' }),
      });
      if (tiktokEngine) {
        await tiktokEngine.connect(channelInput);
      }
      fetchHealthMetrics();
    } catch (e) {
      console.warn('Reconnect error:', e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/tiktok-live/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' }),
      });
      if (tiktokEngine) {
        tiktokEngine.disconnect();
      }
      fetchHealthMetrics();
    } catch (e) {
      console.warn('Disconnect error:', e);
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

  // Filter events
  const filteredEvents = recentEvents.filter((ev) => {
    if (eventFilter === 'ALL') return true;
    if (eventFilter === 'CHAT') return ev.type === 'chat';
    if (eventFilter === 'GIFT') return ev.type === 'gift';
    if (eventFilter === 'LIKE') return ev.type === 'like';
    if (eventFilter === 'FOLLOW') return ev.type === 'follow' || ev.type === 'share';
    if (eventFilter === 'SYSTEM') return ev.type === 'connection_state' || ev.type === 'room_update' || ev.type === 'ping';
    return true;
  });

  const getStatusBadge = () => {
    const isOnline = roomStatus?.isOnline || healthMetrics?.isOnline;
    const status = healthMetrics?.status || roomStatus?.connectionState || (isOnline ? 'STREAMING' : 'OFFLINE');

    if (isOnline || isSimulating) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>{isSimulating ? '🧪 بث تجريبي نشط' : `🟢 ${status}`}</span>
        </span>
      );
    }

    if (status === 'CONNECTING' || status === 'RECONNECTING' || status === 'BACKOFF') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          <span>⏳ {status}</span>
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40">
        <Power className="w-3.5 h-3.5 text-rose-400" />
        <span>🔴 أوفلاين (غير متصل)</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-arena-card border border-white/10 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-red-600 text-white flex items-center justify-center font-black shadow-lg shadow-pink-500/20">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white tracking-tight">
                بوابة أحداث TikTok LIVE الموثوقة (AEP Gateway)
              </h2>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1">
              اتصال خادم دائم، توزيع أحداث متعدد الأجهزة، إزالة التكرار والتطبيع اللغوي العربي الفوري
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-52">
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
            <span>{isChecking ? 'جاري الاتصال...' : 'ربط البث'}</span>
          </button>

          <button
            onClick={handleForceReconnect}
            disabled={isChecking}
            title="إعادة تشغيل جلسة الاتصال"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleDisconnect}
            title="إيقاف الاتصال"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition-all cursor-pointer"
          >
            <Power className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleSimulation}
            className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 border border-amber-400'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isSimulating ? 'إيقاف التجريبي' : 'بث تجريبي 🧪'}</span>
          </button>
        </div>
      </div>

      {/* Gateway Metrics HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl glass-arena-card border border-white/10 flex flex-col gap-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> سرعة الأحداث
          </span>
          <span className="text-xl font-black text-white font-mono">
            {healthMetrics?.eventsPerSecond ?? 0} <span className="text-xs text-cyan-400">حدث/ث</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-arena-card border border-white/10 flex flex-col gap-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> إجمالي المستلم
          </span>
          <span className="text-xl font-black text-white font-mono">
            {healthMetrics?.totalEventsReceived ?? liveComments.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-arena-card border border-white/10 flex flex-col gap-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> المشتركون بالبوابة
          </span>
          <span className="text-xl font-black text-white font-mono">
            {healthMetrics?.activeSubscribers ?? 1} <span className="text-xs text-indigo-400">شاشات</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-arena-card border border-white/10 flex flex-col gap-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> مشاهدو التيك توك
          </span>
          <span className="text-xl font-black text-white font-mono">
            {roomStatus?.viewerCount ?? (isSimulating ? 1420 : 0)}
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-arena-card border border-white/10 flex flex-col gap-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-rose-400" /> محاولات إعادة الربط
          </span>
          <span className="text-xl font-black text-white font-mono">
            {healthMetrics?.reconnectAttempts ?? 0}
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-arena-card border border-white/10 flex flex-col gap-1">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-400" /> ذاكرة التخزين المؤقت
          </span>
          <span className="text-xl font-black text-white font-mono">
            {healthMetrics?.bufferSize ?? 0} <span className="text-xs text-pink-400">حدث</span>
          </span>
        </div>
      </div>

      {/* Room Status Banner */}
      {hasMounted && roomStatus && (
        <div
          className={`p-6 rounded-3xl glass-arena-card border flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl ${
            roomStatus.isOnline || isSimulating
              ? 'border-emerald-400/30 bg-emerald-500/10'
              : 'border-rose-500/20 bg-rose-500/5'
          }`}
        >
          <div className="flex items-center gap-4">
            <img
              src={roomStatus.avatarUrl || '/alshaib-logo.png'}
              alt={roomStatus.username || channelInput}
              className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-white text-lg">@{roomStatus.username || channelInput}</h4>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    roomStatus.isOnline || isSimulating ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {isSimulating ? '🟢 وضع المحاكاة والبث التجريبي يعمل بنجاح' : roomStatus.statusText}
                </span>
              </div>
              {roomStatus.title && <p className="text-xs text-slate-300 mt-0.5">{roomStatus.title}</p>}
            </div>
          </div>

          {(roomStatus.isOnline || isSimulating) && (
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>
                  معرف الغرفة: <strong className="text-cyan-300 font-mono">{roomStatus.roomId || 'room-live'}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Offline Advice Banner */}
      {roomStatus && !roomStatus.isOnline && !isSimulating && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              نصيحة: إذا لم تكن طالع بث مباشر على TikTok الآن، اضغط على <strong>"بث تجريبي 🧪"</strong> في الأعلى لتوليد تعليقات حية واختبار سير الألعاب بدون بث حقيقي!
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

      {/* Real-time Event Inspector */}
      <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <h3 className="text-md font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pink-400" />
            <span>مستكشف الأحداث اللحظي (Real-Time Event Stream)</span>
          </h3>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
            {(['ALL', 'CHAT', 'GIFT', 'LIKE', 'FOLLOW', 'SYSTEM'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setEventFilter(filter)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  eventFilter === filter
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {filter === 'ALL' && 'الكل'}
                {filter === 'CHAT' && 'تعليقات'}
                {filter === 'GIFT' && 'هدايا'}
                {filter === 'LIKE' && 'إعجابات'}
                {filter === 'FOLLOW' && 'متابعات ومشاركات'}
                {filter === 'SYSTEM' && 'النظام'}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 && liveComments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold glass-arena-card rounded-2xl border border-white/8 flex flex-col items-center gap-3">
            <MessageSquare className="w-10 h-10 text-slate-600 animate-pulse" />
            <span>في انتظار استقبال أحداث البث المباشر أو تشغيل البث التجريبي...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredEvents.length > 0
              ? filteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/8 flex items-start gap-3 text-xs hover:border-pink-400/40 transition-all"
                  >
                    {ev.type === 'chat' && (
                      <>
                        <img
                          src={ev.payload.avatarUrl}
                          alt={ev.payload.nickname}
                          className="w-9 h-9 rounded-full object-cover border border-white/20"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-white truncate">{ev.payload.nickname}</span>
                            <span className="text-[10px] text-pink-300 font-mono">#{ev.seq}</span>
                          </div>
                          <p className="text-slate-200 font-semibold mt-1 break-words bg-white/5 p-2 rounded-xl border border-white/5">
                            {ev.payload.comment}
                          </p>
                        </div>
                      </>
                    )}

                    {ev.type === 'gift' && (
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-amber-300">{ev.payload.nickname}</span>
                            <span className="text-[10px] text-amber-400 font-mono">💎 {ev.payload.totalDiamonds}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] mt-0.5">
                            أرسل هدية: <strong>{ev.payload.giftName}</strong> ×{ev.payload.repeatCount}
                          </p>
                        </div>
                      </div>
                    )}

                    {ev.type === 'like' && (
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0">
                          <Heart className="w-5 h-5 fill-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-rose-300">{ev.payload.nickname}</span>
                          <p className="text-slate-300 text-[11px] mt-0.5">
                            ضغط إعجاب (+{ev.payload.likeCount})
                          </p>
                        </div>
                      </div>
                    )}

                    {ev.type === 'follow' && (
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-indigo-300">{ev.payload.nickname}</span>
                          <p className="text-slate-300 text-[11px] mt-0.5">تابع البث للتو! ✨</p>
                        </div>
                      </div>
                    )}

                    {ev.type === 'share' && (
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-cyan-300">{ev.payload.nickname}</span>
                          <p className="text-slate-300 text-[11px] mt-0.5">شارك البث 🚀</p>
                        </div>
                      </div>
                    )}

                    {ev.type === 'connection_state' && (
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-blue-300">حالة الاتصال</span>
                          <p className="text-slate-300 text-[11px] mt-0.5">{ev.payload.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              : liveComments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/8 flex items-start gap-3 text-xs hover:border-pink-400/40 transition-all"
                  >
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
