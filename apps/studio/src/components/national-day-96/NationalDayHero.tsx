'use client';

import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Trophy, Users, Clock, Flame, Shield, ArrowLeft, Star, Heart } from 'lucide-react';

interface Props {
  onStartActivity: (activityId?: string) => void;
  onViewDedications: () => void;
  onViewLeaderboard: () => void;
  totalParticipants: number;
  totalNationalPoints: number;
}

export function NationalDayHero({
  onStartActivity,
  onViewDedications,
  onViewLeaderboard,
  totalParticipants,
  totalNationalPoints
}: Props) {
  // Countdown to 23 September (Saudi National Day)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 23,
    hours: 8,
    minutes: 45,
    seconds: 12
  });

  useEffect(() => {
    const targetDate = new Date(new Date().getFullYear(), 8, 23, 0, 0, 0); // Sep 23
    const timer = setInterval(() => {
      const now = new Date();
      let diff = targetDate.getTime() - now.getTime();
      if (diff < 0) {
        // Next year or day of celebration
        diff = Math.abs(diff);
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-[#03150A] border-2 border-[#00A859]/60 shadow-[0_25px_90px_rgba(0,0,0,0.95)] p-6 sm:p-12 mb-8">
      
      {/* 🌟 Background Layer 1: Authentic Saudi Riyadh Skyline & Fireworks Celebration Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none filter saturate-150 contrast-125"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85')`
        }}
      />

      {/* 🌟 Background Layer 2: Festive Radiant Light Beams & Multi-Color Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#004D25]/85 via-[#02180C]/90 to-[#020C06] pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#00A859]/30 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#C69214]/25 rounded-full filter blur-3xl pointer-events-none" />

      {/* 🌟 Background Layer 3: GEA-Style Sadu & Islamic Geometric Watermark */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#FFE79A_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-6">
        
        {/* Top Celebration Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#082915]/95 border-2 border-[#00A859]/60 shadow-[0_0_30px_rgba(0,168,89,0.5)] backdrop-blur-md">
          <span className="text-base animate-bounce">🇸🇦</span>
          <span className="text-xs sm:text-sm font-black font-mono text-[#FFE79A] tracking-wide">
            المهرجان الرقمي لليوم الوطني السعودي 96 • عزّنا بطبعنا
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#00A859] animate-ping" />
        </div>

        {/* Main Headline */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#E2D4B7] to-[#C69214] tracking-tight leading-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
            نحلم ونحقق • مجدنا 96
          </h1>
          <p className="text-base sm:text-xl text-[#FFE79A]/95 font-bold max-w-2xl leading-relaxed drop-shadow-md">
            منصة الفعاليات والمسابقات التفاعلية المباشرة للبث والتنافس الثقافي والمعرفي بروح الهوية الوطنية
          </p>
        </div>

        {/* ⏱️ National Day Countdown Bar */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-lg my-2">
          {[
            { label: 'يوم', val: timeLeft.days },
            { label: 'ساعة', val: timeLeft.hours },
            { label: 'دقيقة', val: timeLeft.minutes },
            { label: 'ثانية', val: timeLeft.seconds }
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 rounded-2xl bg-[#082113]/90 border border-[#006C35]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center backdrop-blur-md"
            >
              <span className="text-2xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-[#E2D4B7]">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#00A859] font-mono mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-4 flex-wrap justify-center mt-2">
          <button
            onClick={() => onStartActivity()}
            className="px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-[#006C35] via-[#00A859] to-[#006C35] text-white font-black text-base sm:text-lg flex items-center gap-3 shadow-[0_10px_35px_rgba(0,168,89,0.5)] hover:scale-105 transition-all cursor-pointer border border-[#E2D4B7]/30"
          >
            <Play className="w-5 h-5 fill-current text-[#E2D4B7]" />
            <span>ابدأ المشاركة في البث 🚀</span>
          </button>

          <button
            onClick={onViewDedications}
            className="px-6 py-4 rounded-2xl bg-[#0A2616] hover:bg-[#0E351F] border border-[#00A859]/50 text-[#E2D4B7] font-black text-sm sm:text-base flex items-center gap-2.5 transition-all cursor-pointer shadow-lg"
          >
            <Heart className="w-5 h-5 text-rose-400 fill-current" />
            <span>إهداءات الجمهور 💚</span>
          </button>

          <button
            onClick={onViewLeaderboard}
            className="px-6 py-4 rounded-2xl bg-[#1A180C] hover:bg-[#262210] border border-[#C69214]/50 text-[#E2D4B7] font-black text-sm sm:text-base flex items-center gap-2.5 transition-all cursor-pointer shadow-lg"
          >
            <Trophy className="w-5 h-5 text-[#C69214]" />
            <span>لوحة الأبطال 🏆</span>
          </button>
        </div>

        {/* Live Quick Stats Bar */}
        <div className="w-full pt-6 mt-4 border-t border-[#006C35]/30 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#00A859]">
              8 فعاليات
            </span>
            <span className="text-xs text-[#E2D4B7]/70 font-bold">مسابقات وطنية متنوعة</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#C69214]">
              +{totalNationalPoints.toLocaleString()}
            </span>
            <span className="text-xs text-[#E2D4B7]/70 font-bold">إجمالي النقاط الوطنية</span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
              {totalParticipants.toLocaleString()}
            </span>
            <span className="text-xs text-[#E2D4B7]/70 font-bold">مشارك في البث المباشر</span>
          </div>
        </div>

      </div>
    </div>
  );
}
