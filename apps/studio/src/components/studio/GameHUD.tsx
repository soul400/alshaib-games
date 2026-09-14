'use client';

import React from 'react';
import { 
  Trophy, Clock, Sparkles, AlertTriangle, Skull, 
  Flame, CheckCircle2, Shield, Radio, Volume2, Home
} from 'lucide-react';
import Link from 'next/link';

export type HUDPhase = 
  | 'WAITING' 
  | 'COUNTDOWN' 
  | 'ACTIVE' 
  | 'DANGER' 
  | 'FINAL_STRETCH' 
  | 'ELIMINATED' 
  | 'WINNER' 
  | 'COOLDOWN';

export interface GameHUDProps {
  phase: HUDPhase;
  gameTitle: string;
  gameCategory?: string;
  roundNumber?: number;
  timeRemainingSeconds?: number;
  totalTimeSeconds?: number;
  isUrgent?: boolean;
  activePlayersCount?: number;
  totalPlayersCount?: number;
  liveStatusText?: string;
  onTimerTick?: () => void;
  controls?: React.ReactNode;
  showHomeButton?: boolean;
  children?: React.ReactNode;
}

/**
 * Radial & Segmented Broadcast Timer
 */
export function BroadcastRadialTimer({ 
  timeRemaining = 0, 
  totalTime = 30, 
  size = 54, 
  strokeWidth = 4 
}: { 
  timeRemaining: number; 
  totalTime?: number; 
  size?: number; 
  strokeWidth?: number; 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.max(0, Math.min(1, totalTime > 0 ? timeRemaining / totalTime : 0));
  const strokeDashoffset = circumference - (progress * circumference);
  const isUrgent = timeRemaining <= 5 && timeRemaining > 0;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isUrgent ? '#EF4444' : '#D6A84F'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-mono font-black text-xs sm:text-sm ${isUrgent ? 'text-rose-500 animate-pulse' : 'text-[#D6A84F]'}`}>
          {timeRemaining}
        </span>
      </div>
    </div>
  );
}

/**
 * Broadcast Phase Transition Overlay Banner
 */
export function PhaseTransitionBanner({ 
  phase, 
  customMessage 
}: { 
  phase: HUDPhase; 
  customMessage?: string; 
}) {
  if (phase === 'ACTIVE') return null;

  switch (phase) {
    case 'COUNTDOWN':
      return (
        <div className="w-full py-2.5 px-6 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center gap-3 animate-pulse shadow-[0_0_30px_rgba(245,158,11,0.25)]">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="font-display font-black text-sm tracking-wide">
            {customMessage || '⏱️ استعدوا.. جاري بدء التحدي!'}
          </span>
        </div>
      );

    case 'DANGER':
    case 'FINAL_STRETCH':
      return (
        <div className="w-full py-2.5 px-6 rounded-2xl bg-rose-600/25 border border-rose-500/50 text-rose-200 flex items-center justify-center gap-3 animate-pulse shadow-[0_0_35px_rgba(239,68,68,0.35)]">
          <Flame className="w-5 h-5 text-rose-400" />
          <span className="font-display font-black text-sm tracking-wide">
            {customMessage || '🚨 مرحلة الحسم القصوى! التحدي مشتعل الآن!'}
          </span>
        </div>
      );

    case 'WAITING':
      return (
        <div className="w-full py-2.5 px-6 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 flex items-center justify-center gap-3 shadow-sm">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-display font-extrabold text-sm">
            {customMessage || '💬 باب الانضمام مفتوح عبر تعليقات البث المباشر'}
          </span>
        </div>
      );

    case 'WINNER':
      return (
        <div className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-amber-500/30 border border-amber-400/60 text-amber-200 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(214,168,79,0.3)] animate-in zoom-in-95">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="font-display font-black text-base tracking-wide">
            {customMessage || '👑 حُسم التحدي! تهانينا للبطل الفائز!'}
          </span>
        </div>
      );

    default:
      return null;
  }
}

/**
 * Universal Broadcast Game HUD
 */
export function GameHUD({
  phase,
  gameTitle,
  gameCategory,
  roundNumber,
  timeRemainingSeconds = 0,
  totalTimeSeconds = 30,
  isUrgent = false,
  activePlayersCount,
  totalPlayersCount,
  liveStatusText,
  controls,
  showHomeButton = true,
  children
}: GameHUDProps) {
  return (
    <div className="w-full flex flex-col gap-3 z-30 select-none">
      <div className="w-full px-5 py-3.5 rounded-3xl bg-[#0F111A]/95 border border-[#D6A84F]/30 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4 shadow-[0_15px_45px_rgba(0,0,0,0.85)]">
        {/* Left: Brand / Game Identifier */}
        <div className="flex items-center gap-3">
          {showHomeButton && (
            <Link 
              href="/" 
              className="p-2.5 rounded-2xl bg-[#161922] text-[#D6A84F] border border-white/10 hover:border-[#D6A84F]/50 hover:bg-[#1C202F] transition-all flex items-center justify-center shadow-sm"
              title="الصفحة الرئيسية"
            >
              <Home className="w-4 h-4" />
            </Link>
          )}

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D6A84F] to-[#E5BE6C] text-slate-950 flex items-center justify-center font-black shadow-[0_0_20px_rgba(214,168,79,0.35)] shrink-0">
            <Trophy className="w-5 h-5 fill-current" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-black text-base sm:text-xl text-white tracking-tight">
                {gameTitle}
              </h1>
              {gameCategory && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#D6A84F]/15 text-[#D6A84F] border border-[#D6A84F]/30 uppercase">
                  {gameCategory}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-0.5">
              {roundNumber && (
                <span>الجولة رقم #{roundNumber}</span>
              )}
              {liveStatusText && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{liveStatusText}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center / Right: Players Telemetry & Timer */}
        <div className="flex items-center gap-4">
          {activePlayersCount !== undefined && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-slate-300">
              <span>👥 المتبقون:</span>
              <strong className="text-[#D6A84F]">{activePlayersCount}</strong>
              {totalPlayersCount ? <span className="text-slate-500">/ {totalPlayersCount}</span> : null}
            </div>
          )}

          {timeRemainingSeconds > 0 && (
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-mono font-bold text-slate-400 hidden md:inline">
                الوقت:
              </span>
              <BroadcastRadialTimer 
                timeRemaining={timeRemainingSeconds} 
                totalTime={totalTimeSeconds} 
              />
            </div>
          )}

          {/* Integrated Control Buttons */}
          {controls && (
            <div className="flex items-center gap-2 flex-wrap">
              {controls}
            </div>
          )}
        </div>
      </div>

      <PhaseTransitionBanner phase={phase} />

      {children}
    </div>
  );
}
