'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStudioStore } from '../../store/useStudioStore';
import { Radio, Play, Square, Users, MessageSquare, Trophy, Settings, RotateCcw } from 'lucide-react';
import { LiveRoomStatus } from '@aep/tiktok-live';

export function TopHeaderLiveBar() {
  const { liveComments, leaderboard, resetLeaderboard, tiktokEngine } = useStudioStore();
  const [roomStatus, setRoomStatus] = useState<LiveRoomStatus | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (tiktokEngine) {
      setRoomStatus(tiktokEngine.getRoomStatus());
      const handleStatus = (status: LiveRoomStatus) => {
        setRoomStatus(status);
      };
      tiktokEngine.onStatus(handleStatus);
      return () => {
        tiktokEngine.offStatus(handleStatus);
      };
    }
  }, [tiktokEngine]);

  const isLive = Boolean(roomStatus?.isOnline);
  const totalViewers = hasMounted ? (roomStatus?.viewerCount || 0) : 0;
  const totalComments = hasMounted ? liveComments.length : 0;
  const totalPoints = hasMounted ? leaderboard.reduce((sum, p) => sum + p.score, 0) : 0;

  return (
    <header className="w-full bg-[#08090C] border-b border-[#1F2433] px-5 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-4 select-none">
      
      {/* LEFT / TITLE: BREADCRUMB COMMAND */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-[#D6A84F] transition-colors">
          <span className="font-display font-black text-sm tracking-tight">الشايب</span>
          <span className="text-slate-500 text-xs font-mono">/</span>
          <span className="text-xs text-slate-300 font-bold">Studio Command</span>
        </Link>
      </div>

      {/* CENTER & RIGHT: LIVE STATUS & DIRECT CONTROLS */}
      <div className="flex items-center gap-4">
        {isLive ? (
          // ON-AIR LIVE COMMAND METRICS
          <div className="flex items-center gap-4 bg-[#12141C] border border-[#EF4444]/30 px-3.5 py-1.5 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <div className="flex items-center gap-1.5 font-mono text-xs font-black text-[#EF4444]">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
              <span>● ON-AIR</span>
            </div>

            <div className="h-4 w-[1px] bg-[#232736]" />

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 font-mono">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">{totalViewers}</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">مشاهد</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 font-mono">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">{totalComments}</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">تعليق</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D6A84F] font-mono">
              <Trophy className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>+{totalPoints}</span>
            </div>

            <Link
              href="/host-desk"
              className="px-2.5 py-1 rounded-lg bg-[#EF4444] hover:bg-red-600 text-white text-[11px] font-black transition-all flex items-center gap-1"
            >
              <span>غرفة التحكم</span>
            </Link>
          </div>
        ) : (
          // OFFLINE READY STATE
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-xs font-bold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>أوفلاين (جاهز للبث)</span>
            </div>

            <Link
              href="/tiktok-live"
              className="px-3.5 py-1.5 rounded-xl bg-[#D6A84F] hover:bg-[#E5BE6C] text-[#08090C] text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_2px_10px_rgba(214,168,79,0.2)]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>بدء بث جديد</span>
            </Link>
          </div>
        )}

        {/* SETTINGS SHORTCUT */}
        <Link
          href="/settings"
          className="w-8 h-8 rounded-lg bg-[#0F1117] hover:bg-[#161922] border border-[#232736] text-slate-400 hover:text-white flex items-center justify-center transition-all"
          title="الإعدادات"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
