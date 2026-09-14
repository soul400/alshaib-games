'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStudioStore } from '../store/useStudioStore';
import { 
  Play, Sparkles, Trophy, Users, Flame, Clock, 
  ArrowLeft, Gamepad2, Brain, Flag, 
  HelpCircle, Shuffle, Grid, Smile, Image as ImageIcon, 
  Video, Volume2, Binary, Crosshair, Armchair, Bomb, Bus, Skull,
  Radio, Compass, MessageSquare, Award, ArrowUpRight
} from 'lucide-react';

export default function CategorizedGamesCommandCenter() {
  const { tiktokEngine } = useStudioStore();
  const roomStatus = tiktokEngine ? tiktokEngine.getRoomStatus() : null;
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Master Games Catalog with clean local artwork paths in /games/art/
  const allGames = useMemo(() => [
    // 1. ألعاب البث والأكشن التفاعلية
    {
      id: 'viewer-race',
      category: 'action',
      categoryName: 'أكشن وتحدي جماهيري',
      categoryBadge: 'بث مباشر 🏇',
      title: 'VIEWER RACE GRAND PRIX',
      arabicTitle: 'سباق المشاهدين 🏇',
      tagline: 'سباق خيول جماهيري ملحمي — اكتب «العب» لدخول الحلبة والتكبيس يسرّع خيلك 45%',
      badge: 'حصري للبث 🏇',
      badgeColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40',
      accentColor: '#8B5CF6',
      icon: Trophy,
      image: '/games/art/viewer-race.jpg',
      featured: true,
      playerCount: '1-10 متسابقين',
      speed: 'تكبيس وتعليقات حية'
    },
    {
      id: 'squid-game',
      category: 'action',
      categoryName: 'أكشن وتحدي جماهيري',
      categoryBadge: 'بقاء وإقصاء 🦑',
      title: 'SQUID SURVIVAL',
      arabicTitle: 'لعبة الحبار 🦑',
      tagline: 'تحدي خطوات وبقاء حي للمشاهدين — اختر 1-5 في الشات وتفادَ رقم الخطر مع الدمية',
      badge: 'بقاء مباشر 🦑',
      badgeColor: 'bg-[#FF2E54]/20 text-[#FF2E54] border-[#FF2E54]/40',
      accentColor: '#FF2E54',
      icon: Skull,
      image: '/games/art/squid-game.jpg',
      featured: true,
      playerCount: 'جمهور مفتوح',
      speed: 'إقصاء فوري'
    },
    {
      id: 'bus-tayyibin',
      category: 'action',
      categoryName: 'أكشن وتحدي جماهيري',
      categoryBadge: 'بث كلاسيكي 🚌',
      title: 'BUS AL-TAYYIBIN',
      arabicTitle: 'باص الطيبين 🚌',
      tagline: 'ولد • بنت • حيوان • نبات • جماد • بلاد — التعليقات هي ورقة الإجابة المباشرة',
      badge: 'مباشر 🚌',
      badgeColor: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
      accentColor: '#10B981',
      icon: Bus,
      image: '/games/art/bus-tayyibin.jpg',
      playerCount: 'شات تفاعلي',
      speed: 'سرعة البديهة'
    },
    {
      id: 'bomb-pass',
      category: 'action',
      categoryName: 'أكشن وتحدي جماهيري',
      categoryBadge: 'أكشن سريع 🧨',
      title: 'BOMB PASS',
      arabicTitle: 'القنبلة الموقوتة 🧨',
      tagline: 'مرر القنبلة عبر منشن الشات قبل انتهاء العد التنازلي والانفجار الفوري',
      badge: 'أكشن وبقاء',
      badgeColor: 'bg-[#FF2E54]/20 text-[#FF2E54] border-[#FF2E54]/40',
      accentColor: '#FF2E54',
      icon: Bomb,
      image: '/games/art/bomb-pass.jpg',
      playerCount: '2-16 لاعب',
      speed: 'عد تنازلي مرعب'
    },
    {
      id: 'hunter-roulette',
      category: 'action',
      categoryName: 'أكشن وتحدي جماهيري',
      categoryBadge: 'عجلة الحظ 🎯',
      title: 'HUNTER ROULETTE',
      arabicTitle: 'روليت الصياد 🎯',
      tagline: 'عجلة الحظ الدائرية وتحديات الأسئلة المصيرية بين اللاعبين مع فرص نجاة متوازنة',
      badge: 'روليت وإقصاء',
      badgeColor: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
      accentColor: '#10B981',
      icon: Crosshair,
      image: '/games/art/hunter-roulette.jpg',
      playerCount: '2-12 لاعب',
      speed: 'دوران فيزيائي'
    },
    {
      id: 'mystery-roulette',
      category: 'action',
      categoryName: 'أكشن وتحدي جماهيري',
      categoryBadge: 'غموض وتحدي 🔮',
      title: 'MYSTERY ROULETTE',
      arabicTitle: 'الروليت الغامض 🔮',
      tagline: 'بطاقات غامضة مشفرة بأرقام عشوائية بدون صور، قرار الصياد يحسم المصير',
      badge: 'غموض نقي 🔮',
      badgeColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40',
      accentColor: '#8B5CF6',
      icon: Sparkles,
      image: '/games/art/mystery-roulette.jpg',
      playerCount: '2-8 لاعبين',
      speed: 'اختيار أعمى'
    },
    {
      id: 'musical-chairs',
      category: 'action',
      categoryName: 'أكشن وتحدي جماهيري',
      categoryBadge: 'سرعة استجابة 🪑',
      title: 'MUSICAL CHAIRS',
      arabicTitle: 'الكراسي الموسيقية 🪑',
      tagline: 'تسابق فوراً لحجز الكرسي الشاغر في الشات لحظة توقف المؤثرات الموسيقية',
      badge: 'سرعة وتحدي',
      badgeColor: 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40',
      accentColor: '#06B6D4',
      icon: Armchair,
      image: '/games/art/musical-chairs.jpg',
      playerCount: '4-20 لاعب',
      speed: 'استجابة سريعة'
    },
    {
      id: 'react',
      category: 'action',
      categoryName: 'أكشن وتحدي جماهيري',
      categoryBadge: 'تخمين وأرقام 🔢',
      title: 'GUESS THE NUMBER',
      arabicTitle: 'تخمين الأرقام 🔢',
      tagline: 'سباق الذكاء لكشف الخانات والأرقام السرية المشفرة قبل المنافسين',
      badge: 'ذكاء وتخمين',
      badgeColor: 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40',
      accentColor: '#06B6D4',
      icon: Binary,
      image: '/games/art/react.jpg',
      playerCount: 'شات مفتوح',
      speed: 'محاولات فورية'
    },

    // 2. المسابقات والبرامج التلفزيونية
    {
      id: 'quiz',
      category: 'tv-quiz',
      categoryName: 'المسابقات والبرامج التلفزيونية',
      categoryBadge: 'استوديو المسابقات 🎓',
      title: 'TRIVIA QUIZ SHOW',
      arabicTitle: 'المسابقات الثقافية الكبرى 🎓',
      tagline: 'بنك أسئلة تلفزيوني ضخم متعدد الخيارات مع كشف الإجابة بالأنيميشن وعد تنازلي',
      badge: '100 نقطة للسؤال',
      badgeColor: 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40',
      accentColor: '#06B6D4',
      icon: Brain,
      image: '/games/art/quiz.jpg',
      featured: true,
      playerCount: 'كل المتابعين',
      speed: 'نظام نقاط تلفزيوني'
    },
    {
      id: 'capitals',
      category: 'tv-quiz',
      categoryName: 'المسابقات والبرامج التلفزيونية',
      categoryBadge: 'جغرافيا وعواصم 🏛️',
      title: 'WORLD CAPITALS CHALLENGE',
      arabicTitle: 'تحدي عواصم العالم 🏛️',
      tagline: 'ما هي عاصمة الدولة المعروضة؟ محرك ذكي يقبل كل الصيغ والأسماء المعربة والتاريخية',
      badge: 'عواصم العالم 🏛️',
      badgeColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40',
      accentColor: '#8B5CF6',
      icon: HelpCircle,
      image: '/games/art/capitals.jpg',
      playerCount: 'شات حي',
      speed: 'تطابق فوري'
    },
    {
      id: 'what-do-they-say',
      category: 'tv-quiz',
      categoryName: 'المسابقات والبرامج التلفزيونية',
      categoryBadge: 'استطلاع رأي 💬',
      title: 'WHAT DO THEY SAY?',
      arabicTitle: 'وش يقولون؟ — استطلاع الناس 💬',
      tagline: 'تحدي معرفة أشهر 10 إجابات وأمثال متداولة في الشارع العربي بنقاط مضاعفة',
      badge: 'استطلاع اجتماعي',
      badgeColor: 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40',
      accentColor: '#06B6D4',
      icon: HelpCircle,
      image: '/games/art/what-do-they-say.jpg',
      playerCount: 'شات مفتوح',
      speed: '200 نقطة للإجابة'
    },
    {
      id: 'character',
      category: 'tv-quiz',
      categoryName: 'المسابقات والبرامج التلفزيونية',
      categoryBadge: 'أعلام ومعالم 🏳️',
      title: 'WORLD FLAGS & LANDMARKS',
      arabicTitle: 'أعلام ومعالم دول العالم 🏳️',
      tagline: '195 دولة مسجلة! تعرّف على الأعلام والمعالم الجغرافية واكتب اسم الدولة أولاً',
      badge: '195 دولة مسجلة',
      badgeColor: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
      accentColor: '#10B981',
      icon: Flag,
      image: '/games/art/character.jpg',
      playerCount: 'جمهور البث',
      speed: 'مؤقت 30 ثانية'
    },

    // 3. الألغاز والذكاء واللغة
    {
      id: 'memory-match',
      category: 'puzzles',
      categoryName: 'الألغاز والذكاء واللغة',
      categoryBadge: 'ذاكرة بصرية 🧠',
      title: 'MEMORY MATCH LIVE',
      arabicTitle: 'لعبة الذاكرة التفاعلية 🧠',
      tagline: '16 بطاقة هولوغرافية • 8 أزواج متطابقة • تفاعل صوتي ورقمي من الشات لكشف الأزواج',
      badge: 'تفاعل جماعي',
      badgeColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40',
      accentColor: '#8B5CF6',
      icon: Brain,
      image: '/games/art/memory-match.jpg',
      playerCount: 'شات حي (1-16)',
      speed: 'تركيز فائق'
    },
    {
      id: 'mixed-words',
      category: 'puzzles',
      categoryName: 'الألغاز والذكاء واللغة',
      categoryBadge: 'تحدي لغوي 🔀',
      title: 'SCRAMBLED WORDS',
      arabicTitle: 'الكلمات المبعثرة 🔀',
      tagline: 'تبعثر ديناميكي للحروف على خلايا سداسية مضيئة لإعادة تركيبها بالشات بسرعة',
      badge: 'تحدي لغوي',
      badgeColor: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
      accentColor: '#10B981',
      icon: Shuffle,
      image: '/games/art/mixed-words.jpg',
      playerCount: 'جمهور البث',
      speed: 'سرعة كتابة'
    },
    {
      id: 'alphabet',
      category: 'puzzles',
      categoryName: 'الألغاز والذكاء واللغة',
      categoryBadge: 'شبكة الحروف 🔤',
      title: 'ARABIC ALPHABET GRID',
      arabicTitle: 'شبكة الحروف العربية 🔤',
      tagline: 'شبكة سداسية تضم 28 حرفاً عربياً متصلاً ببنك أسئلة ثقافية مخصص لكل حرف',
      badge: '28 حرف عربي',
      badgeColor: 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40',
      accentColor: '#06B6D4',
      icon: Grid,
      image: '/games/art/alphabet.jpg',
      playerCount: 'المشاهدين كافة',
      speed: 'اختيار الحرف'
    },
    {
      id: 'symbol-puzzle',
      category: 'puzzles',
      categoryName: 'الألغاز والذكاء واللغة',
      categoryBadge: 'رموز وإيموجي 😀',
      title: 'EMOJI & SYMBOL PUZZLE',
      arabicTitle: 'ألغاز الرموز والإيموجي 😀',
      tagline: 'تراكيب إيموجي مبتكرة ترمز لأسماء أفلام ومسلسلات وأمثال عربية شهيرة',
      badge: 'فك شفرة الإيموجي',
      badgeColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40',
      accentColor: '#8B5CF6',
      icon: Smile,
      image: '/games/art/symbol-puzzle.jpg',
      playerCount: 'شات تفاعلي',
      speed: 'ذكاء وترابط'
    },
    {
      id: 'image-puzzle',
      category: 'puzzles',
      categoryName: 'الألغاز والذكاء واللغة',
      categoryBadge: 'كشف بصري 🖼️',
      title: 'VISUAL IMAGE PUZZLE',
      arabicTitle: 'ألغاز الصور والتأثيرات 🖼️',
      tagline: 'كشف تدريجي لصورة مخفية عبر إزالة تأثيرات البكسل والضبابية ثانية بثانية',
      badge: 'تحدي بصري',
      badgeColor: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
      accentColor: '#10B981',
      icon: ImageIcon,
      image: '/games/art/image-puzzle.jpg',
      playerCount: 'جمهور البث',
      speed: 'كشف تدريجي'
    },

    // 4. الوسائط والصوت والفيديو
    {
      id: 'video-challenge',
      category: 'media',
      categoryName: 'الوسائط والصوت والفيديو',
      categoryBadge: 'تحدي سينمائي 🎬',
      title: 'LIVE VIDEO CHALLENGES',
      arabicTitle: 'تحديات مقاطع الفيديو 🎬',
      tagline: 'بث مقاطع فيديو ومواقف كوميدية مع إيقاف مفاجئ لطرح السؤال على الشات',
      badge: 'تحدي سينمائي',
      badgeColor: 'bg-[#FF2E54]/20 text-[#FF2E54] border-[#FF2E54]/40',
      accentColor: '#FF2E54',
      icon: Video,
      image: '/games/art/video-challenge.jpg',
      playerCount: 'كل المتابعين',
      speed: 'ملاحظة دقيقة'
    },
    {
      id: 'audio-challenge',
      category: 'media',
      categoryName: 'الوسائط والصوت والفيديو',
      categoryBadge: 'موجات صوتية 🔊',
      title: 'AUDIO WAVES CHALLENGES',
      arabicTitle: 'التحديات والموجات الصوتية 🔊',
      tagline: 'التعرف على أصوات المشاهير، الطيور، المؤثرات والآلات عبر موجات تفاعلية',
      badge: 'تحدي سمعي',
      badgeColor: 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40',
      accentColor: '#06B6D4',
      icon: Volume2,
      image: '/games/art/audio-challenge.jpg',
      playerCount: 'شات البث',
      speed: 'أذن موسيقية'
    }
  ], []);

  // Filtered games based on active category tab
  const filteredGames = useMemo(() => {
    if (selectedCategory === 'all') return allGames;
    return allGames.filter(g => g.category === selectedCategory);
  }, [allGames, selectedCategory]);

  // Spotlight featured game (default to Viewer Race)
  const heroGame = allGames[0];

  const categories = [
    { id: 'all', label: 'جميع الألعاب', icon: Gamepad2, count: allGames.length },
    { id: 'action', label: 'ألعاب البث والأكشن', icon: Flame, count: allGames.filter(g => g.category === 'action').length },
    { id: 'tv-quiz', label: 'المسابقات والبرامج', icon: Trophy, count: allGames.filter(g => g.category === 'tv-quiz').length },
    { id: 'puzzles', label: 'الألغاز والذكاء', icon: Brain, count: allGames.filter(g => g.category === 'puzzles').length },
    { id: 'media', label: 'الوسائط والصوت', icon: Video, count: allGames.filter(g => g.category === 'media').length },
  ];

  return (
    <div className="flex flex-col gap-10 w-full max-w-7xl mx-auto pb-24 select-none text-right font-readex" dir="rtl">
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* 1. CINEMATIC HERO SPOTLIGHT: BROADCAST ARENA            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-[#262C3A] bg-[#161B26] shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
        {/* Background Ambient Key Artwork */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroGame.image}
            alt={heroGame.arabicTitle}
            className="w-full h-full object-cover object-center opacity-30 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#161B26]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#161B26]/90 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#8B5CF6]/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Hero Grid Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left / Main Details */}
          <div className="flex flex-col gap-5 max-w-2xl">
            
            {/* Status Pills */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#8B5CF6] font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>AL-SHAIB BROADCAST STUDIO OS</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[11px] font-mono font-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span>{allGames.length} محرك ألعاب متزامن</span>
              </span>

              {roomStatus?.isOnline ? (
                <span className="px-3 py-1 rounded-full bg-[#FF2E54]/20 text-[#FF2E54] border border-[#FF2E54]/40 text-[11px] font-mono font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF2E54] animate-ping" />
                  <span>بث مباشر متصل الآن</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-[#262C3A] text-[#94A3B8] text-[11px] font-mono font-bold">
                  وضع الاستعداد (Standby)
                </span>
              )}
            </div>

            {/* Spotlight Header */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-[#06B6D4] tracking-wider block">
                ⭐ اللعبة المميزة في الواجهة الرئيسية
              </span>
              <h1 className="font-cairo font-black text-3xl sm:text-5xl text-[#F8FAFC] tracking-tight leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                {heroGame.arabicTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#94A3B8] font-normal leading-relaxed">
                {heroGame.tagline}
              </p>
            </div>

            {/* Realtime Live Specs Strip */}
            <div className="flex items-center gap-4 text-xs text-[#94A3B8] pt-1 font-mono flex-wrap">
              <span className="flex items-center gap-2 bg-[#0B0E14]/60 px-3.5 py-1.5 rounded-xl border border-[#262C3A]">
                <Users className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-[#F8FAFC]">{heroGame.playerCount}</span>
              </span>
              <span className="flex items-center gap-2 bg-[#0B0E14]/60 px-3.5 py-1.5 rounded-xl border border-[#262C3A]">
                <Clock className="w-4 h-4 text-[#06B6D4]" />
                <span className="text-[#F8FAFC]">{heroGame.speed}</span>
              </span>
              <span className="flex items-center gap-2 bg-[#0B0E14]/60 px-3.5 py-1.5 rounded-xl border border-[#262C3A]">
                <Radio className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#F8FAFC]">تفاعل فوري مع الشات</span>
              </span>
            </div>

            {/* Launch CTAs */}
            <div className="flex items-center gap-4 pt-3 flex-wrap">
              <Link
                href={`/play?engine=${heroGame.id}`}
                className="px-8 py-4 rounded-2xl btn-hyper-violet text-sm sm:text-base flex items-center gap-3 font-cairo cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>إطلاق {heroGame.arabicTitle} فوراً</span>
              </Link>

              <Link
                href="/host-desk"
                className="px-6 py-4 rounded-2xl bg-[#161B26] hover:bg-[#1E2433] border border-[#262C3A] hover:border-[#06B6D4] text-[#F8FAFC] text-sm font-cairo flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>غرفة المذيع (Host Desk)</span>
                <ArrowLeft className="w-4 h-4 text-[#94A3B8]" />
              </Link>
            </div>
          </div>

          {/* Right Spotlight Poster Frame */}
          <div className="w-full sm:w-80 lg:w-96 rounded-3xl overflow-hidden border-2 border-[#262C3A] bg-[#0B0E14] relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] group shrink-0">
            <div className="aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden relative">
              <img
                src={heroGame.image}
                alt={heroGame.arabicTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161B26] via-transparent to-transparent" />
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-[#8B5CF6]/30 text-[#8B5CF6] border border-[#8B5CF6]/50 backdrop-blur-md shadow-lg">
                  {heroGame.badge}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-[#161B26] border-t border-[#262C3A] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-mono text-[#94A3B8]">المحرك المختار</span>
                <span className="font-cairo font-bold text-sm text-[#F8FAFC]">{heroGame.arabicTitle}</span>
              </div>
              <Link
                href={`/play?engine=${heroGame.id}`}
                className="px-4 py-2 rounded-xl btn-cyber-cyan text-xs font-cairo font-bold flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>دخول</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 2. CATEGORY DISCOVERY NAVIGATION                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 border-b border-[#262C3A] pb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-cairo font-black text-2xl text-[#F8FAFC] flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-[#06B6D4]" />
              <span>مكتبة الألعاب التفاعلية</span>
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              اختر التصنيف لاستكشاف المحركات التفاعلية المصممة خصيصاً للمذيع واستوديوهات البث المباشر.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/30 px-3.5 py-1.5 rounded-xl">
            {filteredGames.length} من أصل {allGames.length} ألعاب
          </span>
        </div>

        {/* Tactical Filter Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-cairo font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white border border-[#8B5CF6] shadow-[0_4px_20px_rgba(139,92,246,0.4)]'
                    : 'bg-[#161B26] text-[#94A3B8] border border-[#262C3A] hover:border-[#8B5CF6]/50 hover:text-[#F8FAFC]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                <span>{cat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#0B0E14] text-[#94A3B8]'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 3. INTERACTIVE GAME CARDS GRID (70% ART RATIO)           */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game) => {
          const Icon = game.icon;
          return (
            <Link
              key={game.id}
              href={`/play?engine=${game.id}`}
              className="group relative rounded-3xl master-game-card flex flex-col overflow-hidden cursor-pointer"
            >
              {/* Cinematic Artwork Poster (Dominant 65-75% Area) */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#0B0E14]">
                <img
                  src={game.image}
                  alt={game.arabicTitle}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B26] via-[#161B26]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14]/70 via-transparent to-transparent opacity-60" />

                {/* Badges on Top */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black border backdrop-blur-md shadow-md ${game.badgeColor}`}>
                    {game.badge}
                  </span>
                </div>

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#0B0E14]/70 text-[#94A3B8] border border-[#262C3A] backdrop-blur-md">
                    {game.categoryBadge}
                  </span>
                </div>

                {/* Quick Player Specs overlay at bottom edge of artwork */}
                <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-[11px] font-mono text-[#94A3B8] bg-[#0B0E14]/70 backdrop-blur-md px-3 py-1 rounded-xl border border-[#262C3A]/60">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span className="text-[#F8FAFC]">{game.playerCount}</span>
                  </span>
                  <span className="text-[#94A3B8] text-[10px]">{game.speed}</span>
                </div>
              </div>

              {/* Card Meta & Bottom CTA */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4 bg-[#161B26]">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[#06B6D4] font-bold uppercase tracking-wider block">
                    {game.title}
                  </span>
                  <h3 className="font-cairo font-black text-lg text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors leading-snug drop-shadow-sm flex items-center justify-between">
                    <span>{game.arabicTitle}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#8B5CF6] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-all" />
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                    {game.tagline}
                  </p>
                </div>

                {/* Action Launch Bar */}
                <div className="w-full py-3 rounded-2xl bg-[#0B0E14] group-hover:bg-[#8B5CF6] text-[#F8FAFC] border border-[#262C3A] group-hover:border-[#8B5CF6] font-cairo font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>دخول اللعبة فوراً</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 4. HOW IT WORKS: ENTERTAINMENT IN 4 STEPS               */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-[#262C3A] bg-[#161B26] p-6 sm:p-10 flex flex-col gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-bold text-[#8B5CF6] tracking-wider">
            🎮 تجربة بث لا مثيل لها
          </span>
          <h2 className="font-cairo font-black text-2xl sm:text-3xl text-[#F8FAFC]">
            كيف تلعب وتشارك في البث التفاعلي؟
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            أربع خطوات سهلة تبدأ من تفعيل البث وحتى تتويج الفائزين أمام آلاف المتابعين على الهواء مباشرة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'افتح البث المباشر',
              desc: 'ابدأ البث على TikTok وافتح منصة AL-SHAIB Games Studio من نفس المتصفح أو شاشة العرض.',
              icon: Radio,
              color: '#8B5CF6'
            },
            {
              step: '02',
              title: 'اختر اللعبة المناسبة',
              desc: 'تصفح قائمة الألعاب وانقر على اللعبة التي تناسب مزاج جمهورك وتحديات البث الحالية.',
              icon: Gamepad2,
              color: '#06B6D4'
            },
            {
              step: '03',
              title: 'المشاهدون يشاركون بالشات',
              desc: 'يكتب الجمهور الإجابات والأرقام في تعليقات البث، ويقرأ المحرك ردودهم بالملي ثانية تلقائياً.',
              icon: MessageSquare,
              color: '#10B981'
            },
            {
              step: '04',
              title: 'تتويج الفائز بالصدارة',
              desc: 'تُحدث لوحة الصدارة فورياً بالنقاط وتُطلق المؤثرات الصوتية وشاشات التتويج البث المباشر.',
              icon: Award,
              color: '#FF2E54'
            }
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-5 rounded-2xl bg-[#0B0E14] border border-[#262C3A] flex flex-col gap-3 relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono font-black text-xl text-[#262C3A] group-hover:text-[#94A3B8] transition-colors">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-cairo font-black text-base text-[#F8FAFC]">{s.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 5. LIVE BROADCAST ARCHITECTURE FLOW                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-[#262C3A] bg-[#161B26] p-6 sm:p-10 flex flex-col gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-bold text-[#06B6D4] tracking-wider">
            ⚡ الدورة التفاعلية الفورية (Real-time Feedback Loop)
          </span>
          <h2 className="font-cairo font-black text-2xl sm:text-3xl text-[#F8FAFC]">
            محرك البث التفاعلي المتكامل
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            هندسة ذكية تربط جمهورك بشاشة الاستوديو في أجزاء من الثانية بدون الحاجة لأي تطبيقات إضافية للمشاهد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {[
            {
              title: '1. شاشة البث (OBS)',
              desc: 'عرض مسرح اللعبة أو نافذة اللعب المتجاوبة بأعلى وضوح سينمائي.',
              badge: 'بث 60FPS',
              color: '#8B5CF6'
            },
            {
              title: '2. شات المشاهدين',
              desc: 'استقبال آلاف التعليقات والتكبيس بدون أي تأخير عبر خوادم الاتصال.',
              badge: 'قراءة فورية',
              color: '#06B6D4'
            },
            {
              title: '3. محرك الألعاب (Studio)',
              desc: 'تحليل الإجابات الصحيحة والخيارات عبر آلة الحالات (State Machine).',
              badge: 'تحليل دقيق',
              color: '#10B981'
            },
            {
              title: '4. شاشة التتويج والنتيجة',
              desc: 'عرض اسم الفائز فوراً مع نقاط الصدارة والمؤثرات الاحتفالية المدوية.',
              badge: 'فوز فوري',
              color: '#FF2E54'
            }
          ].map((node, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0B0E14] border border-[#262C3A] flex flex-col gap-2.5 relative"
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold"
                  style={{ backgroundColor: `${node.color}20`, color: node.color, border: `1px solid ${node.color}40` }}
                >
                  {node.badge}
                </span>
                <span className="text-[10px] font-mono text-[#94A3B8]">المرحلة {idx + 1}</span>
              </div>
              <h4 className="font-cairo font-black text-base text-[#F8FAFC]">{node.title}</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{node.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 6. FINAL CALL TO ACTION: READY TO STREAM                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#8B5CF6]/50 bg-gradient-to-r from-[#161B26] via-[#1E2433] to-[#161B26] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_60px_rgba(139,92,246,0.3)]">
        <div className="flex flex-col gap-3 text-right max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 text-xs font-mono font-black w-fit">
            🚀 منصة استوديو الألعاب التفاعلية الأولى
          </span>
          <h2 className="font-cairo font-black text-2xl sm:text-4xl text-[#F8FAFC] leading-snug">
            جاهز لإشعال الحماس في بثك القادم؟
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            اختر أي لعبة الآن، شارك الشاشة على OBS أو TikTok Live Studio، وشاهد كيف يتفاعل الآلاف مع كل سؤال وتحدٍ!
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 flex-wrap">
          <Link
            href="/play?engine=viewer-race"
            className="px-8 py-4 rounded-2xl btn-hyper-violet text-sm font-cairo font-black flex items-center gap-2.5 shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ابدأ اللعب الآن</span>
          </Link>
          <Link
            href="/host-desk"
            className="px-6 py-4 rounded-2xl bg-[#0B0E14] hover:bg-[#161B26] border border-[#262C3A] hover:border-[#06B6D4] text-[#F8FAFC] text-sm font-cairo font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>لوحة المذيع</span>
            <ArrowLeft className="w-4 h-4 text-[#94A3B8]" />
          </Link>
        </div>
      </div>

    </div>
  );
}
