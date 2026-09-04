'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStudioStore } from '../../store/useStudioStore';
import { Radio, Play, Square, Users, MessageSquare, Trophy, Settings, RotateCcw, LogOut, Heart } from 'lucide-react';
import { LiveRoomStatus } from '@aep/tiktok-live';
import { authManager, UserProfile, VALID_USERS } from '../../utils/authManager';
import { DonationModal } from './DonationModal';

export function TopHeaderLiveBar() {
  const { liveComments, leaderboard, resetLeaderboard, tiktokEngine } = useStudioStore();
  const [roomStatus, setRoomStatus] = useState<LiveRoomStatus | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeDonationUser, setActiveDonationUser] = useState<string>('shayeb');
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    setCurrentUser(authManager.getCurrentUser());
    setActiveDonationUser(authManager.getActiveDonationUser());

    const handleAuth = () => {
      setCurrentUser(authManager.getCurrentUser());
      setActiveDonationUser(authManager.getActiveDonationUser());
    };
    window.addEventListener('aep:auth-change', handleAuth);
    window.addEventListener('aep:donation-change', handleAuth);
    return () => {
      window.removeEventListener('aep:auth-change', handleAuth);
      window.removeEventListener('aep:donation-change', handleAuth);
    };
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
    <>
      <header className="w-full bg-[#08090C] border-b border-[#1F2433] px-4 sm:px-5 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-4 select-none flex-wrap">
        
        {/* LEFT / TITLE: BREADCRUMB COMMAND */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-[#D6A84F] transition-colors">
            <span className="font-display font-black text-sm tracking-tight">الشايب</span>
            <span className="text-slate-500 text-xs font-mono">/</span>
            <span className="text-xs text-slate-300 font-bold">Studio Command</span>
          </Link>
        </div>

        {/* CENTER & RIGHT: LIVE STATUS & DIRECT CONTROLS */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {isLive ? (
            // ON-AIR LIVE COMMAND METRICS
            <div className="flex items-center gap-3 sm:gap-4 bg-[#12141C] border border-[#EF4444]/30 px-3.5 py-1.5 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.15)]">
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
                <span className="hidden sm:inline">أوفلاين (جاهز للبث)</span>
              </div>

              <Link
                href="/tiktok-live"
                className="px-3.5 py-1.5 rounded-xl bg-[#D6A84F] hover:bg-[#E5BE6C] text-[#08090C] text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_2px_10px_rgba(214,168,79,0.2)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>بدء بث</span>
              </Link>
            </div>
          )}

          {/* 💎 DONATION LINK QUICK SETTINGS BUTTON */}
          <button
            onClick={() => setIsDonationModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/40 text-amber-300 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="تغيير واختيار رابط الدعم المعروض في البث"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span className="hidden sm:inline">رابط الدعم:</span>
            <span className="text-white underline font-mono text-[11px]">
              {VALID_USERS[activeDonationUser]?.profile?.displayName || 'الشايب'}
            </span>
          </button>

          {/* USER ACCOUNT BADGE & LOGOUT */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-[#12141F] border border-white/10 px-2.5 py-1 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xs">
                {currentUser.username === 'shayeb' ? '🎙️' : currentUser.username === 'ashley' ? '🌸' : '⚙️'}
              </div>
              <span className="text-xs font-black text-white hidden md:inline">
                {currentUser.displayName}
              </span>
              <button
                onClick={() => authManager.logout()}
                className="text-slate-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
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

      {/* DONATION MODAL POPUP */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </>
  );
}
