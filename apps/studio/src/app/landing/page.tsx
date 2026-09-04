'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Play, Sparkles, Trophy, Users, Zap, Shield, 
  ArrowLeft, CheckCircle2, Radio, Gamepad2, Tv, Crown
} from 'lucide-react';

export default function MarketingLandingPage() {
  const steps = [
    {
      num: '01',
      title: 'اربط البث المباشر',
      desc: 'أدخل اسم حسابك في TikTok Live بنقرة واحدة وتزامن فوري بدون أي برامج خارجية معقدة.'
    },
    {
      num: '02',
      title: 'اختر المحرك المناسب',
      desc: 'مجموعة من ألعاب الذكاء، الذاكرة، الأكشن، وروليت البقاء المصممة لجمهور البث.'
    },
    {
      num: '03',
      title: 'أطلق الجولة بضغطة زر',
      desc: 'شاشة البث تعرض اللعبة بدقة 100vw × 100vh وتأثيرات سينمائية بدون أي سكرول.'
    },
    {
      num: '04',
      title: 'الجمهور يلعب من التعليقات',
      desc: 'تحليل فوري فائق السرعة لكافة تعليقات المشاهدين واحتساب النقاط والتتويج آلياً.'
    }
  ];

  const featuredGames = [
    {
      id: 'memory-match',
      title: 'MEMORY MATCH LIVE',
      arabic: 'لعبة الذاكرة التفاعلية',
      tag: '16 بطاقة • 8 أزواج',
      accent: '#8B5CF6',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'bomb-pass',
      title: 'BOMB PASS',
      arabic: 'القنبلة الموقوتة',
      tag: 'مرر القنبلة قبل الانفجار',
      accent: '#DC2626',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'hunter-roulette',
      title: 'HUNTER ROULETTE',
      arabic: 'روليت الصياد',
      tag: 'عجلة الحظ وتحدي الأسئلة',
      accent: '#059669',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'musical-chairs',
      title: 'MUSICAL CHAIRS',
      arabic: 'الكراسي الموسيقية',
      tag: 'ألعاب البقاء الإقصائية',
      accent: '#2563EB',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85'
    }
  ];

  return (
    <div className="min-h-screen bg-[#08090C] text-white flex flex-col selection:bg-[#D6A84F]/30 selection:text-[#D6A84F]">
      
      {/* ── TOP LUXURY NAVIGATION ─────────────────────────── */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1A1D27] to-[#0E1017] border border-[#D6A84F]/40 p-1 flex items-center justify-center">
            <img src="/alshaib-logo.png" alt="الشايب" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-base text-white tracking-tight">الشايب</span>
            <span className="text-[9px] font-mono text-[#D6A84F] tracking-wider uppercase">BROADCAST GAME OS</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#0F1117] hover:bg-[#161922] border border-[#232736] text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            دخول الاستوديو ➔
          </Link>
          <Link
            href="/play?engine=memory-match"
            className="px-5 py-2.5 rounded-xl gold-cta-button text-xs font-black"
          >
            تجربة لعبة حية ▶
          </Link>
        </div>
      </nav>

      {/* ── HERO BANNER ────────────────────────────────────── */}
      <header className="w-full max-w-5xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12141C] border border-[#D6A84F]/40 text-[#D6A84F] text-xs font-mono font-bold tracking-wider uppercase shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>THE WORLD&apos;S FIRST TIKTOK LIVE GAME OPERATING SYSTEM</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight leading-[1.15]">
          LIVE STREAMS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6A84F] via-[#E5BE6C] to-[#D6A84F]">
            JUST GOT INTERACTIVE.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
          حوّل مشاهدي البث المباشر إلى لاعبين ومتنافسين في ثوانٍ معدودة. نظام تشغيل تلفزيوني متكامل لإدارة المسابقات والتحديات الجماعية عبر تعليقات TikTok Live مباشرة.
        </p>

        <div className="flex items-center gap-4 pt-4 flex-wrap justify-center">
          <Link
            href="/"
            className="px-8 py-4 rounded-2xl gold-cta-button text-sm font-black flex items-center gap-2.5 shadow-2xl"
          >
            <Tv className="w-5 h-5" />
            <span>ابدأ إدارة عرضك الآن</span>
          </Link>
          <Link
            href="/host-desk"
            className="px-6 py-4 rounded-2xl bg-[#0F1117] hover:bg-[#161922] border border-[#232736] text-white text-sm font-bold flex items-center gap-2 transition-all"
          >
            <span>معاينة غرفة التحكم (Host Desk)</span>
          </Link>
        </div>
      </header>

      {/* ── 4-STEP HOW IT WORKS ────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 border-t border-[#1F2433]">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-[#D6A84F] font-black uppercase tracking-widest block mb-1">
            HOW IT WORKS • كيف تعمل المنصة
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            4 خطوات بسيطة لإشعال الحماس في بثك
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-3xl bg-[#0F1117] border border-[#232736] flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-[#D6A84F]/50 transition-all"
            >
              <span className="font-mono font-black text-4xl text-[#D6A84F]/30 group-hover:text-[#D6A84F] transition-colors">
                {step.num}
              </span>
              <div className="space-y-2">
                <h3 className="font-display font-black text-base text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED GAMES SHOWCASE ────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 border-t border-[#1F2433]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-mono text-[#D6A84F] font-black uppercase tracking-widest block mb-1">
              GAME ENGINE SHOWCASE
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              محركات ألعاب حية مصممة خصيصاً للبث
            </h2>
          </div>
          <Link href="/play" className="text-xs font-bold text-[#D6A84F] hover:underline">
            استعراض كافة الألعاب ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-3xl bg-[#0F1117] border border-[#232736] hover:border-[#D6A84F]/60 overflow-hidden flex flex-col shadow-2xl transition-all hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-transparent to-transparent" />
                <span 
                  className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black"
                  style={{ backgroundColor: `${game.accent}25`, color: game.accent, border: `1px solid ${game.accent}50` }}
                >
                  LIVE BROADCAST
                </span>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">{game.tag}</span>
                  <h3 className="font-display font-black text-base text-white group-hover:text-[#D6A84F] transition-colors">{game.arabic}</h3>
                </div>

                <Link
                  href={`/play?engine=${game.id}`}
                  className="w-full py-3 rounded-xl bg-[#161922] hover:bg-[#D6A84F] text-white hover:text-[#08090C] font-black text-xs flex items-center justify-center gap-2 transition-all border border-[#282E40] hover:border-[#D6A84F]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>بدء اللعبة 🚀</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="w-full border-t border-[#1F2433] bg-[#050608] py-8 px-6 mt-auto text-center text-xs text-slate-500 font-mono">
        <p>© 2026 AL-SHAIB ENTERTAINMENT • BROADCAST GAME OPERATING SYSTEM • ALL RIGHTS RESERVED</p>
      </footer>

    </div>
  );
}
