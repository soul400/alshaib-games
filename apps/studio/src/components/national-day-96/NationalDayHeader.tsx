'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Trophy, Home, Radio, HelpCircle, Layers, Flame, ArrowLeft } from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onAirActivityTitle?: string;
  isLive?: boolean;
}

export function NationalDayHeader({ activeTab, onSelectTab, onAirActivityTitle, isLive }: Props) {
  return (
    <header className="w-full bg-[#051109]/95 border-b border-[#006C35]/40 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold"
            title="العودة للرئيسية"
          >
            <ArrowLeft className="w-4 h-4 rotate-180 text-emerald-400" />
            <span className="hidden sm:inline">منصة الشايب</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#004D25] via-[#006C35] to-[#00A859] flex items-center justify-center text-white font-black shadow-[0_0_25px_rgba(0,168,89,0.5)] border border-[#E2D4B7]/30">
              <span className="text-xl drop-shadow-md">🇸🇦</span>
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#C69214] text-slate-950 text-[9px] font-black font-mono border border-white/40">
                96
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#E2D4B7] to-[#C69214]">
                  اليوم الوطني السعودي 96
                </h1>
                {isLive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 animate-pulse font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    <span>ON-AIR</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#E2D4B7]/80 font-bold block">
                {onAirActivityTitle ? `مباشر الآن: ${onAirActivityTitle}` : 'احتفل • شارك • نافس • اترك بصمتك'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#081B10] p-1.5 rounded-2xl border border-[#006C35]/50 overflow-x-auto shadow-inner">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#006C35] to-[#00A859] text-white shadow-[0_0_15px_rgba(0,168,89,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E2D4B7]" />
            <span>الفعاليات</span>
          </button>

          <button
            onClick={() => onSelectTab('arena')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'arena'
                ? 'bg-gradient-to-r from-[#006C35] to-[#00A859] text-white shadow-[0_0_15px_rgba(0,168,89,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span>شاشة البث (Arena)</span>
          </button>

          <button
            onClick={() => onSelectTab('dedications')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dedications'
                ? 'bg-gradient-to-r from-[#006C35] to-[#00A859] text-white shadow-[0_0_15px_rgba(0,168,89,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-xs">💚</span>
            <span>إهداءات وطنية</span>
          </button>

          <button
            onClick={() => onSelectTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-[#006C35] to-[#00A859] text-white shadow-[0_0_15px_rgba(0,168,89,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-[#C69214]" />
            <span>لوحة الصدارة</span>
          </button>

          <button
            onClick={() => onSelectTab('library')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'library'
                ? 'bg-gradient-to-r from-[#006C35] to-[#00A859] text-white shadow-[0_0_15px_rgba(0,168,89,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>بنك الأسئلة والمولد</span>
          </button>
        </div>

      </div>
    </header>
  );
}
