'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudioStore } from '../store/useStudioStore';
import { 
  Play, Sparkles, Trophy, Users, Flame, Clock, 
  ArrowLeft, Plus, Gamepad2, Layers, Brain, Flag, 
  HelpCircle, Shuffle, Grid, Smile, Image as ImageIcon, 
  Video, Volume2, Binary, Crosshair, Armchair, Bomb, Zap, Bus, Skull
} from 'lucide-react';

export default function CategorizedGamesCommandCenter() {
  const { leaderboard, tiktokEngine, liveComments } = useStudioStore();
  const roomStatus = tiktokEngine ? tiktokEngine.getRoomStatus() : null;
  const [activeTab, setActiveTab] = useState<string>('all');

  // ══════════════════════════════════════════════════════════════
  // COMPLETE MASTER GAME CATALOG GROUPED BY SECTION
  // ══════════════════════════════════════════════════════════════
  
  // 1. ألعاب البث التفاعلية والأكشن
  const interactiveGames = [
    {
      id: 'viewer-race',
      title: 'VIEWER RACE GRAND PRIX',
      arabicTitle: 'سباق المشاهدين 🏇',
      tagline: 'سباق خيول جماهيري ملحمي — اكتب «العب» في الشات لدخول الخيل، والمشاهدون يعززون سرعتك بتعليقات الدعم والتكبيس',
      badge: 'جديد وحصري 🏇',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      accentColor: '#F59E0B',
      icon: Trophy,
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=85',
      isHero: true
    },
    {
      id: 'squid-game',
      title: 'SQUID SURVIVAL',
      arabicTitle: 'لعبة «الحبار» 🦑',
      tagline: 'تحدي خطوات ونجاة تفاعلي للبث المباشر — اختر 1-5 في الشات وتجنب رقم الخطر مع الدمية',
      badge: 'جديد وحصري 🦑',
      badgeColor: 'bg-[#F43F5E]/20 text-[#F43F5E] border-[#F43F5E]/40',
      accentColor: '#F43F5E',
      icon: Skull,
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=85',
      isHero: true
    },
    {
      id: 'bus-tayyibin',
      title: 'BUS AL-TAYYIBIN',
      arabicTitle: 'باص الطيبين 🚌',
      tagline: 'ولد • بنت • حيوان • نبات • جماد • بلاد — التعليقات هي ورقة الإجابة مع كلمة «تم»',
      badge: 'مباشر 🚌',
      badgeColor: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
      accentColor: '#10B981',
      icon: Bus,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=85',
      isHero: false
    },
    {
      id: 'memory-match',
      title: 'MEMORY MATCH LIVE',
      arabicTitle: 'لعبة الذاكرة التفاعلية 🧠',
      tagline: '16 بطاقة • 8 أزواج • تفاعل فوري من الشات (1-3)',
      badge: 'تفاعل جماعي',
      badgeColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40',
      accentColor: '#8B5CF6',
      icon: Brain,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'bomb-pass',
      title: 'BOMB PASS',
      arabicTitle: 'القنبلة الموقوتة 🧨',
      tagline: 'مرر القنبلة عبر الشات قبل الانفجار والإقصاء الفوري',
      badge: 'أكشن وبقاء',
      badgeColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#DC2626]/40',
      accentColor: '#DC2626',
      icon: Bomb,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'hunter-roulette',
      title: 'HUNTER ROULETTE',
      arabicTitle: 'روليت الصياد 🎯',
      tagline: 'عجلة الحظ الدائرية وتحدي الأسئلة بين المشاهدين',
      badge: 'روليت وإقصاء',
      badgeColor: 'bg-[#059669]/20 text-[#059669] border-[#059669]/40',
      accentColor: '#059669',
      icon: Crosshair,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'mystery-roulette',
      title: 'MYSTERY ROULETTE',
      arabicTitle: 'الروليت الغامض 🔮',
      tagline: 'بطاقات غامضة بأرقام عشوائية بدون صور، اختيار الصياد يحدد الإقصاء',
      badge: 'غموض وتحدي 🔮',
      badgeColor: 'bg-[#D6A84F]/20 text-[#D6A84F] border-[#D6A84F]/40',
      accentColor: '#D6A84F',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'musical-chairs',
      title: 'MUSICAL CHAIRS',
      arabicTitle: 'الكراسي الموسيقية 🪑',
      tagline: 'تسابق لحجز الكرسي الشاغر فور توقف الموسيقى',
      badge: 'سرعة وتحدي',
      badgeColor: 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/40',
      accentColor: '#2563EB',
      icon: Armchair,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'react',
      title: 'GUESS THE NUMBER',
      arabicTitle: 'تخمين الأرقام 🔢',
      tagline: 'سباق الذكاء لكشف الخانات والأرقام السرية المخفية',
      badge: 'ذكاء وتخمين',
      badgeColor: 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40',
      accentColor: '#06B6D4',
      icon: Binary,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85'
    }
  ];

  // 2. المسابقات الثقافية والاجتماعية
  const culturalGames = [
    {
      id: 'capitals',
      title: 'WORLD CAPITALS CHALLENGE',
      arabicTitle: 'تحدي عواصم العالم 🏛️',
      tagline: 'ما هي عاصمة الدولة؟ تعرّف ذكي يقبل العواصم الإدارية والاقتصادية والتاريخية',
      badge: 'عواصم العالم الكبرى',
      badgeColor: 'bg-[#D6A84F]/20 text-[#D6A84F] border-[#D6A84F]/40',
      accentColor: '#D6A84F',
      icon: HelpCircle,
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'quiz',
      title: 'TRIVIA QUIZ SHOW',
      arabicTitle: 'المسابقات الثقافية العامة 🎓',
      tagline: 'أسئلة ثقافية وعلمية متنوعة بنظام الاختيار من متعدد والإجابة المباشرة',
      badge: '100 نقطة للسؤال',
      badgeColor: 'bg-[#D6A84F]/20 text-[#D6A84F] border-[#D6A84F]/40',
      accentColor: '#D6A84F',
      icon: Brain,
      image: '/game-covers/quiz.jpg'
    },
    {
      id: 'what-do-they-say',
      title: 'WHAT DO THEY SAY?',
      arabicTitle: 'وش يقولون؟ — استطلاع الناس 💬',
      tagline: 'تحدي معرفة أكثر 10 إجابات وأمثال شيوعاً بين الناس مع 200 نقطة',
      badge: 'استطلاع اجتماعي',
      badgeColor: 'bg-[#F97316]/20 text-[#F97316] border-[#F97316]/40',
      accentColor: '#F97316',
      icon: HelpCircle,
      image: '/game-covers/media-challenge.jpg'
    },
    {
      id: 'character',
      title: 'WORLD FLAGS & LANDMARKS',
      arabicTitle: 'أعلام ومعالم دول العالم 🏳️',
      tagline: '195 دولة! تعرّف على الأعلام والمعالم الجغرافية واكتب اسم الدولة',
      badge: '195 دولة مسجلة',
      badgeColor: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40',
      accentColor: '#3B82F6',
      icon: Flag,
      image: '/game-covers/world-flags.jpg'
    }
  ];

  // 3. الألغاز واللغة والذكاء البصري
  const puzzleGames = [
    {
      id: 'mixed-words',
      title: 'SCRAMBLED WORDS',
      arabicTitle: 'الكلمات المبعثرة 🔀',
      tagline: 'تبعثر ذكي لحروف الكلمة على خلايا سداسية لإعادة ترتيبها في الشات',
      badge: 'تحدي لغوي',
      badgeColor: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
      accentColor: '#10B981',
      icon: Shuffle,
      image: 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'alphabet',
      title: 'ARABIC ALPHABET GRID',
      arabicTitle: 'شبكة الحروف العربية 🔤',
      tagline: 'شبكة سداسية تفاعلية تضم الحروف من أ إلى ي مع بنك أسئلة مخصص',
      badge: '28 حرف عربي',
      badgeColor: 'bg-[#14B8A6]/20 text-[#14B8A6] border-[#14B8A6]/40',
      accentColor: '#14B8A6',
      icon: Grid,
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'symbol-puzzle',
      title: 'EMOJI & SYMBOL PUZZLE',
      arabicTitle: 'ألغاز الرموز والإيموجي 😀',
      tagline: 'توليفات ورموز إيموجي مبتكرة لتمثيل أسماء الأفلام والأمثال والدول',
      badge: 'فك تشفير الرموز',
      badgeColor: 'bg-[#EC4899]/20 text-[#EC4899] border-[#EC4899]/40',
      accentColor: '#EC4899',
      icon: Smile,
      image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'image-puzzle',
      title: 'VISUAL IMAGE PUZZLE',
      arabicTitle: 'ألغاز الصور والتأثيرات 🖼️',
      tagline: 'كشف الصور المشفرة بتأثيرات البكسل، التمويه، والظلال تدريجياً',
      badge: 'تحدي بصري',
      badgeColor: 'bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/40',
      accentColor: '#A855F7',
      icon: ImageIcon,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85'
    }
  ];

  // 4. تحديات الوسائط والصوت والفيديو
  const mediaGames = [
    {
      id: 'video-challenge',
      title: 'LIVE VIDEO CHALLENGES',
      arabicTitle: 'تحديات مقاطع الفيديو 🎬',
      tagline: 'عرض مقاطع فيديو تفاعلية وإيقاف مؤقت لاستقبال إجابات المشاهدين',
      badge: 'تحدي سينمائي',
      badgeColor: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40',
      accentColor: '#EF4444',
      icon: Video,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'audio-challenge',
      title: 'AUDIO WAVES CHALLENGES',
      arabicTitle: 'التحديات والموجات الصوتية 🔊',
      tagline: 'التعرف على أصوات المشاهير، الطيور، والآلات عبر موجات ترددية تفاعلية',
      badge: 'تحدي سمعي',
      badgeColor: 'bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/40',
      accentColor: '#EAB308',
      icon: Volume2,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=85'
    }
  ];

  const totalGamesCount = interactiveGames.length + culturalGames.length + puzzleGames.length + mediaGames.length;

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-20 select-none">
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* 🇸🇦 GRAND ENTRANCE: SAUDI NATIONAL DAY 96 EXPERIENCE     */}
      {/* 💡 يتم تفعيل هذا المتغير (true) لإظهار البنر فور الجاهزية  */}
      {/* ═══════════════════════════════════════════════════════ */}
      {false && (
        <Link
          href="/national-day-96"
          className="group relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#02180C] via-[#052915] to-[#02180C] border-2 border-[#00A859]/70 p-6 sm:p-8 shadow-[0_15px_50px_rgba(0,168,89,0.3)] hover:shadow-[0_20px_70px_rgba(0,168,89,0.5)] transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer"
        >
          {/* Background glow and subtle Sadu pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-[#C69214]/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00A859]/20 rounded-full filter blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#004D25] via-[#006C35] to-[#00A859] flex items-center justify-center text-white text-3xl sm:text-4xl shadow-[0_0_30px_rgba(0,168,89,0.6)] border-2 border-[#E2D4B7]/40 shrink-0 group-hover:scale-105 transition-transform">
              🇸🇦
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#C69214] text-slate-950 font-black text-xs font-mono shadow-sm">
                  مهرجان اليوم الوطني 96 🇸🇦
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00A859]/20 text-[#00A859] border border-[#00A859]/40 text-[10px] font-mono font-black">
                  8 فعاليات ومسابقات
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2D4B7] to-[#FFE79A]">
                فعاليات اليوم الوطني السعودي 96
              </h2>

              <p className="text-xs sm:text-sm text-[#E2D4B7]/90 font-bold">
                مسابقات ثقافية • أرقام الوطن • إهداءات وطنية • ربوع بلادي • خريطة المملكة • لوحة صدارة الأبطال
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10 shrink-0">
            <span className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#006C35] via-[#00A859] to-[#006C35] text-white font-black text-sm sm:text-base flex items-center gap-2 shadow-[0_10px_30px_rgba(0,168,89,0.5)] group-hover:scale-105 transition-all border border-[#E2D4B7]/40">
              <Sparkles className="w-4 h-4 text-[#FFE79A] fill-current" />
              <span>دخول المهرجان الرقمي</span>
              <ArrowLeft className="w-4 h-4 text-white" />
            </span>
          </div>
        </Link>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 🌟 1. CINEMA BROADCAST SPOTLIGHT HERO (ORBIT/ONYX STYLE) */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-[#161B26] border border-[#262C3A] shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        {/* Background Atmosphere Image with Dynamic Gradient Fades */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85"
            alt="سباق المشاهدين"
            className="w-full h-full object-cover object-center opacity-30 scale-105 filter blur-[2px] transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[#08090C]/90 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-3xl text-right">
            {/* Ticker Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#8B5CF6] font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(214,168,79,0.2)]">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>AL-SHAIB BROADCAST STUDIO OS</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[11px] font-mono font-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{totalGamesCount} محرك ألعاب تفاعلي متزامن</span>
              </span>

              {roomStatus?.isOnline ? (
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>بث مباشر نشط الآن</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-mono font-bold">
                  وضع الاستعداد (Standby)
                </span>
              )}
            </div>

            {/* Spotlight Title & Story */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider block">
                ⭐ اللعبة المميزة لهذا الأسبوع
              </span>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                سباق المشاهدين 🏇 (VIEWER RACE)
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
                سباق خيول جماهيري ملحمي — كل متسابق في مسار مستقل، وكاميرا ذكية تتبع الصدارة حتى خط النهاية مع تسريع 45% بتفاعل التكبيس والشات الفعلي!
              </p>
            </div>

            {/* Realtime Live Telemetry Strip */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>1-10 متسابقين • تفاعل تكبيس حي</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>تشغيل فوري بضغطة زر</span>
              </span>
            </div>

            {/* Launch CTAs */}
            <div className="flex items-center gap-3.5 pt-2 flex-wrap">
              <Link
                href="/play?engine=viewer-race"
                className="px-8 py-4 rounded-2xl btn-hyper-violet text-sm sm:text-base flex items-center gap-2.5 font-cairo hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>إطلاق سباق المشاهدين الآن 🏇</span>
              </Link>

              <Link
                href="/host-desk"
                className="px-6 py-4 rounded-2xl bg-[#161B26] hover:bg-[#1E2433] border border-[#262C3A] hover:border-[#06B6D4] text-white text-sm font-cairo flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>غرفة التحكم (Host Desk)</span>
                <ArrowLeft className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Quick Highlight Cards (Right Rail) */}
          <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
            <span className="text-xs font-mono font-bold text-slate-400">⚡ ألعاب سريعة مفضلة للبث:</span>
            
            <Link
              href="/play?engine=squid-game"
              className="p-3.5 rounded-2xl bg-[#12141F]/90 border border-white/10 hover:border-[#F43F5E]/60 transition-all flex items-center justify-between group hover:bg-[#181B2B]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-400 group-hover:scale-110 transition-transform">
                  <Skull className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0 text-right">
                  <span className="text-xs font-black text-white truncate group-hover:text-rose-400 transition-colors">
                    لعبة «الحبار» 🦑
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    بقاء وإقصاء فوري
                  </span>
                </div>
              </div>
              <Play className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors shrink-0 mr-2" />
            </Link>

            <Link
              href="/play?engine=hunter-roulette"
              className="p-3.5 rounded-2xl bg-[#12141F]/90 border border-white/10 hover:border-[#059669]/60 transition-all flex items-center justify-between group hover:bg-[#181B2B]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Crosshair className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0 text-right">
                  <span className="text-xs font-black text-white truncate group-hover:text-emerald-400 transition-colors">
                    روليت الصياد 🎯
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    عجلة الحظ وتحدي الرصاص
                  </span>
                </div>
              </div>
              <Play className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0 mr-2" />
            </Link>

            <Link
              href="/play?engine=memory-match"
              className="p-3.5 rounded-2xl bg-[#12141F]/90 border border-white/10 hover:border-[#8B5CF6]/60 transition-all flex items-center justify-between group hover:bg-[#181B2B]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 text-purple-400 group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0 text-right">
                  <span className="text-xs font-black text-white truncate group-hover:text-purple-400 transition-colors">
                    لعبة الذاكرة 🧠
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    تفاعل فوري من الشات
                  </span>
                </div>
              </div>
              <Play className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors shrink-0 mr-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 2. SECTION 1: ألعاب البث التفاعلية والأكشن              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#1F2433] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center font-black">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white flex items-center gap-2">
                <span>ألعاب البث المباشر التفاعلية والأكشن</span>
                <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-mono font-black uppercase">
                  ● LIVE ACTION
                </span>
              </h2>
              <p className="text-xs text-slate-400">ألعاب بقاء وإقصاء ومطابقة جماعية تعتمد على تعليقات الشات المباشرة 100%.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#D6A84F]">{interactiveGames.length} ألعاب</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {interactiveGames.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className="group relative rounded-3xl master-game-card flex flex-col overflow-hidden"
              >
                {/* Poster Artwork */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-65 group-hover:opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black border backdrop-blur-md ${game.badgeColor}`}>
                      {game.badge}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">{game.title}</span>
                    <h3 className="font-display font-black text-sm text-white group-hover:text-[#D6A84F] transition-colors leading-snug drop-shadow-sm">
                      {game.arabicTitle}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {game.tagline}
                    </p>
                  </div>

                  <Link
                    href={`/play?engine=${game.id}`}
                    className="w-full py-2.5 rounded-xl bg-[#161B26] hover:bg-[#8B5CF6] text-white border border-[#262C3A] hover:border-[#8B5CF6] font-cairo font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>ابدأ اللعبة فوراً</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 3. SECTION 2: المسابقات الثقافية والبرامج التلفزيونية     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[#2A2F45] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#06B6D4] text-white flex items-center justify-center font-black shadow-[0_0_25px_rgba(214,168,79,0.35)]">
              <Trophy className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl text-white flex items-center gap-3">
                <span>المسابقات الثقافية والبرامج التلفزيونية</span>
                <span className="px-3 py-1 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40 text-xs font-mono font-black uppercase shadow-sm">
                  ● TV QUIZ SHOWS
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">تحديات أسئلة ومعلومات عامة واستطلاعات رأي كبرى بنظام استوديو البث التلفزيوني الفاخر.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-black text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/30 px-3.5 py-1.5 rounded-xl">{culturalGames.length} ألعاب تلفزيونية</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {culturalGames.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-3xl cultural-gold-card flex flex-col overflow-hidden shadow-2xl hover:scale-[1.02] transition-all"
            >
              {/* Premium TV Show Poster with Dynamic Gold Ambient */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C12] via-[#0A0C12]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-60" />
                
                {/* Category & Points Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black bg-[#D6A84F]/25 text-[#FFE79A] border border-[#D6A84F]/50 backdrop-blur-md shadow-md">
                    {game.badge}
                  </span>
                </div>

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/60 text-slate-300 border border-white/10 backdrop-blur-md">
                    LIVE ARENA
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#D6A84F] font-black uppercase tracking-wider block">{game.title}</span>
                  <h3 className="font-display font-black text-lg text-white group-hover:text-[#D6A84F] transition-colors leading-snug drop-shadow-md">
                    {game.arabicTitle}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {game.tagline}
                  </p>
                </div>

                <Link
                  href={`/play?engine=${game.id}`}
                  className="w-full py-3 rounded-2xl btn-cyber-cyan text-xs flex items-center justify-center gap-2 font-cairo shadow-[0_8px_25px_rgba(6,182,212,0.35)] transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>دخول المسابقة فوراً</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 4. SECTION 3: الألغاز واللغة والذكاء البصري             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#1F2433] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center font-black">
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white flex items-center gap-2">
                <span>ألعاب الألغاز واللغة والذكاء البصري</span>
                <span className="px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#10B981] text-[10px] font-mono font-black uppercase">
                  ● WORD & VISUAL PUZZLES
                </span>
              </h2>
              <p className="text-xs text-slate-400">شبكات حروف تفاعلية، كلمات مبعثرة، وفك شفرات الرموز والصور المخفية.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#D6A84F]">{puzzleGames.length} ألعاب</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {puzzleGames.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-3xl master-game-card flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-transparent to-transparent" />
                
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black border ${game.badgeColor}`}>
                    {game.badge}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">{game.title}</span>
                  <h3 className="font-display font-black text-sm text-white group-hover:text-[#10B981] transition-colors leading-snug">
                    {game.arabicTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {game.tagline}
                  </p>
                </div>

                <Link
                  href={`/play?engine=${game.id}`}
                  className="w-full py-2.5 rounded-xl bg-[#161B26] hover:bg-[#8B5CF6] text-white border border-[#262C3A] hover:border-[#8B5CF6] font-cairo font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>بدء اللغز</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 5. SECTION 4: تحديات الوسائط والصوت والفيديو            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#1F2433] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] flex items-center justify-center font-black">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white flex items-center gap-2">
                <span>تحديات الوسائط والصوت والفيديو</span>
                <span className="px-2 py-0.5 rounded-md bg-[#EF4444]/20 text-[#EF4444] text-[10px] font-mono font-black uppercase">
                  ● MEDIA & BROADCAST
                </span>
              </h2>
              <p className="text-xs text-slate-400">مقاطع سينمائية وموجات صوتية مسجلة لاختبار سرعة بديهة الجمهور.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#D6A84F]">{mediaGames.length} ألعاب</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {mediaGames.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-3xl master-game-card flex flex-col sm:flex-row overflow-hidden"
            >
              <div className="relative aspect-video sm:w-1/2 overflow-hidden bg-black shrink-0">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-l from-[#0F1117] via-transparent to-transparent" />
                
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black border ${game.badgeColor}`}>
                    {game.badge}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">{game.title}</span>
                  <h3 className="font-display font-black text-base text-white group-hover:text-[#D6A84F] transition-colors leading-snug">
                    {game.arabicTitle}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {game.tagline}
                  </p>
                </div>

                <Link
                  href={`/play?engine=${game.id}`}
                  className="w-full py-2.5 rounded-xl bg-[#161B26] hover:bg-[#06B6D4] text-white hover:text-[#0B0E14] border border-[#262C3A] hover:border-[#06B6D4] font-cairo font-black text-xs flex items-center justify-center gap-2 transition-all shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>بدء التحدي</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
