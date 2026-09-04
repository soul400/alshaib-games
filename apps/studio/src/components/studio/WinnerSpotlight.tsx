'use client';

import React, { useEffect, useState } from 'react';
import { PlayerScore } from '@aep/types';
import { Trophy, Crown, Medal, Sparkles, Star, Flame, Award } from 'lucide-react';
import { triggerVisualEffect } from '@aep/audio-visual-fx';

interface WinnerSpotlightProps {
  winner: PlayerScore | { displayName: string; avatarUrl: string; points: number; username?: string };
  title?: string;
  gameTitle?: string;
  subtitle?: string;
  onClose?: () => void;
  autoCloseSeconds?: number;
  variant?: 'ROUND_WINNER' | 'GAME_WINNER' | 'CHAMPION' | 'TOP3_PODIUM';
}

export function WinnerSpotlight({
  winner,
  title = 'الفائز بالجولة',
  gameTitle = 'AL-SHAIB ENTERTAINMENT',
  subtitle = 'CHAMPION OF THE ROUND',
  onClose,
  autoCloseSeconds = 8,
  variant = 'ROUND_WINNER'
}: WinnerSpotlightProps) {
  const [animStage, setAnimStage] = useState<number>(0);
  const [displayPoints, setDisplayPoints] = useState<number>(0);

  const targetPoints = Number((winner as any)?.points ?? (winner as any)?.score ?? 0) || 0;
  const displayName = winner.displayName || (winner as any).username || 'متسابق تيك توك';
  const avatarUrl = winner.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

  useEffect(() => {
    // 0 -> 300ms: Backdrop & Spotlight Beam
    setAnimStage(1);

    // 300 -> 700ms: Avatar Halo Pop-in
    const t1 = setTimeout(() => setAnimStage(2), 350);

    // 700 -> 1000ms: Display Name Reveal
    const t2 = setTimeout(() => setAnimStage(3), 750);

    // 1000 -> 1400ms: Score Count-up
    const t3 = setTimeout(() => {
      setAnimStage(4);
      let curr = 0;
      const step = Math.max(1, Math.ceil(targetPoints / 25));
      const counterTimer = setInterval(() => {
        curr += step;
        if (curr >= targetPoints) {
          setDisplayPoints(targetPoints);
          clearInterval(counterTimer);
        } else {
          setDisplayPoints(curr);
        }
      }, 30);
    }, 1100);

    // 1400 -> 2000ms: Confetti & Particles
    const t4 = setTimeout(() => {
      setAnimStage(5);
      triggerVisualEffect('confetti');
    }, 1450);

    // Auto close timer if provided
    let tClose: any;
    if (autoCloseSeconds && onClose) {
      tClose = setTimeout(() => {
        onClose();
      }, autoCloseSeconds * 1000);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (tClose) clearTimeout(tClose);
    };
  }, [targetPoints, autoCloseSeconds, onClose]);

  // Variant Badge Styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'CHAMPION':
        return {
          badgeText: '👑 بطل الموسم النهائي',
          badgeBg: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950',
          borderColor: 'border-amber-400',
          glowShadow: 'shadow-[0_0_120px_rgba(245,158,11,0.75)]',
          icon: <Crown className="w-8 h-8 text-amber-300 animate-bounce" />
        };
      case 'GAME_WINNER':
        return {
          badgeText: '🏆 فائز اللعبة 🏆',
          badgeBg: 'bg-gradient-to-r from-yellow-500 to-amber-400 text-slate-950',
          borderColor: 'border-yellow-400',
          glowShadow: 'shadow-[0_0_90px_rgba(234,179,8,0.65)]',
          icon: <Trophy className="w-7 h-7 text-yellow-300 animate-pulse" />
        };
      case 'TOP3_PODIUM':
        return {
          badgeText: '⭐ المتصدر الأول',
          badgeBg: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
          borderColor: 'border-purple-400',
          glowShadow: 'shadow-[0_0_80px_rgba(168,85,247,0.6)]',
          icon: <Medal className="w-7 h-7 text-purple-300" />
        };
      default:
        return {
          badgeText: '✨ فائز الجولة',
          badgeBg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-400/40',
          borderColor: 'border-amber-400/60',
          glowShadow: 'shadow-[0_0_60px_rgba(245,158,11,0.45)]',
          icon: <Award className="w-6 h-6 text-amber-400" />
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 dir-rtl select-none overflow-hidden animate-in fade-in duration-300">
      
      {/* Background Cinematic Light Beams & Particle Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Vertical Top Spotlight Beam */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[800px] bg-gradient-to-b from-amber-500/25 via-amber-400/10 to-transparent blur-3xl rounded-full opacity-80" />
        {/* Parallax Radial Glow Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-amber-500/20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-amber-400/10" />
      </div>

      {/* Main Spotlight Container */}
      <div className={`relative z-10 w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#141628]/95 via-[#0A0C16]/98 to-[#141628]/95 border-2 ${vStyles.borderColor} ${vStyles.glowShadow} flex flex-col items-center text-center gap-6 backdrop-blur-2xl transition-all duration-700`}>
        
        {/* Close Button if requested */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer z-20"
            title="إغلاق"
          >
            ✕
          </button>
        )}

        {/* Top Game Identity Badge */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[11px] font-mono font-black tracking-widest text-slate-400 uppercase">
            {gameTitle}
          </span>
          <div className={`px-5 py-1.5 rounded-full font-black text-xs sm:text-sm font-mono shadow-lg flex items-center gap-2 ${vStyles.badgeBg}`}>
            {vStyles.icon}
            <span>{title || vStyles.badgeText}</span>
          </div>
        </div>

        {/* 🌟 HERO WINNER AVATAR PRESENTATION */}
        <div className={`relative transition-all duration-700 ${animStage >= 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          
          {/* Animated Gold Ring Halo Behind Avatar */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 animate-spin-slow opacity-80 blur-md pointer-events-none" />
          <div className="absolute -inset-2 rounded-full bg-slate-950 pointer-events-none" />

          {/* Avatar Image */}
          <img
            src={avatarUrl}
            alt={displayName}
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.6)] bg-slate-900"
          />

          {/* Crown / Trophy Overlay Badge */}
          <div className="absolute -bottom-2 right-1/2 translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-xl border-2 border-slate-950 flex items-center gap-1 font-mono">
            <span>WINNER</span>
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        {/* 🌟 HERO PLAYER NAME (Big Bold Arabic Display Name) */}
        <div className={`flex flex-col items-center gap-1 transition-all duration-500 ${animStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
            {displayName}
          </h2>
          <span className="text-xs font-mono font-bold text-amber-300/80">
            {subtitle}
          </span>
        </div>

        {/* 🌟 HERO SCORE COUNTER */}
        <div className={`w-full py-3.5 px-6 rounded-2xl bg-white/5 border border-amber-400/30 flex items-center justify-between transition-all duration-500 ${animStage >= 4 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
          <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>إجمالي النقاط المكتسبة:</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
            +{displayPoints.toLocaleString()} <span className="text-sm font-bold text-amber-400">نقطة</span>
          </span>
        </div>

        {/* Bottom Banner Ray Accent */}
        <div className="w-full pt-2 flex items-center justify-center gap-2 text-[10px] font-mono font-black text-slate-400 tracking-widest uppercase border-t border-white/10">
          <span>✦ ✦ ✦</span>
          <span>CHAMPION OF THE ARENA</span>
          <span>✦ ✦ ✦</span>
        </div>

      </div>
    </div>
  );
}
