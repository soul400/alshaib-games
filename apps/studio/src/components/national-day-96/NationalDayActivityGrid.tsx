'use client';

import React from 'react';
import { 
  Trophy, Binary, Heart, Image as ImageIcon, Map, Archive, 
  Film, Zap, Flame, Mic, Play, Sparkles, Star, ArrowRight 
} from 'lucide-react';
import { NationalDay96ActivityId } from '@aep/types';

export interface ActivityCardInfo {
  id: NationalDay96ActivityId;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  icon: any;
  image: string;
  questionsCount: number;
  pointsPerCorrect: number;
  modeDescription: string;
  hidden?: boolean;
}

export const NATIONAL_DAY_ACTIVITIES: ActivityCardInfo[] = [
  {
    id: 'saudi-great',
    title: 'السعودية العظمى',
    subtitle: 'المسابقة الثقافية الوطنية الكبرى 🏆',
    tagline: 'تاريخ • ملوك • مناطق • رؤية 2030 • مشاريع كبرى',
    badge: '01 • ثقافة وهوية',
    badgeColor: 'bg-[#00A859]/20 text-[#00A859] border-[#00A859]/40',
    icon: Trophy,
    image: '/national-day-96/saudi-great-full.png',
    questionsCount: 78,
    pointsPerCorrect: 1,
    modeDescription: 'السؤال يظهر على الشاشة والإجابة الأولى من تعليقات البث تكسب النقاط مباشرة.'
  },
  {
    id: 'saudi-numbers',
    title: 'أرقام الوطن',
    subtitle: 'مسابقة الأرقام والتواريخ 🔢',
    tagline: 'أرقام وإحصاءات وتواريخ مع تطبيع الأرقام الذكي',
    badge: '02 • أرقام وتواريخ',
    badgeColor: 'bg-[#C69214]/20 text-[#C69214] border-[#C69214]/40',
    icon: Binary,
    image: '/national-day-96/saudi-numbers-full.png',
    questionsCount: 37,
    pointsPerCorrect: 1,
    modeDescription: 'تطبيع الأرقام الذكي (٩٦ / 96 / 1932) يضمن احتساب الإجابة الصحيحة بأي لغة.'
  },
  {
    id: 'national-dedications',
    title: 'إهداءات وطنية',
    subtitle: 'رسائل وإهداءات الجمهور 💚',
    tagline: 'المباشرة وباقة البث التلفزيونية',
    badge: '03 • تفاعل وبث',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: Heart,
    image: '/national-day-96/national-dedications-full.png',
    questionsCount: 12,
    pointsPerCorrect: 1,
    modeDescription: 'باقة بث تلفزيونية كاملة تعرض رسائل المتابعين كفواصل احتفالية 8-12 ثانية.'
  },
  {
    id: 'landscapes',
    title: 'صور ربوع بلادي',
    subtitle: 'تحدي الصور والمعالم 📸',
    tagline: 'والمناطق التاريخية والسياحية',
    badge: '04 • تحدي بصري',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: ImageIcon,
    image: '/national-day-96/landscapes-full.png',
    questionsCount: 38,
    pointsPerCorrect: 1,
    modeDescription: 'صور عالية الدقة تظهر تدريجياً، وأسرع مشاهد يكتب اسم المعلم يكسب النقاط.'
  },
  {
    id: 'national-map',
    title: 'خريطة الوطن',
    subtitle: 'تحدي مناطق ومدن 🗺️',
    tagline: 'المملكة التفاعلي ثلاثي الأبعاد',
    badge: '05 • خريطة وجغرافيا',
    badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
    icon: Map,
    image: '/national-day-96/national-map-full.png',
    questionsCount: 0,
    pointsPerCorrect: 1,
    modeDescription: 'تمييز بصري لمناطق الـ 13 على خريطة المملكة مع اختبارات للمدن والمواقع.'
  },
  {
    id: 'memory-archive',
    title: 'ذاكرة وطن',
    subtitle: 'أرشيف وتاريخ المملكة 🏛️',
    tagline: 'المصور والوثائق النادرة',
    badge: '06 • أرشيف وتاريخ',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    icon: Archive,
    image: '/national-day-96/memory-archive-full.png',
    questionsCount: 0,
    pointsPerCorrect: 1,
    modeDescription: 'أسئلة أرشيفية وثائقية نادرة بأسلوب تلفزيوني توثيقي راقٍ.',
    hidden: true
  },
  {
    id: 'challenge-96',
    title: 'تحدي 96',
    subtitle: 'جولات السرعة الخاطفة ⚡',
    tagline: '5 - 10 ثوانٍ حماسية',
    badge: '07 • سرعة البرق',
    badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
    icon: Zap,
    image: '/national-day-96/challenge-96-full.png',
    questionsCount: 0,
    pointsPerCorrect: 1,
    modeDescription: 'جولات خاطفة وسريعة تشتعل فيها التعليقات خلال ثوانٍ معدودة.'
  },
  {
    id: 'saudi-heritage',
    title: 'تراثنا الأصيل',
    subtitle: 'الخيل والإبل والقهوة 🐎',
    tagline: 'والزي التراثي الأصيل',
    badge: '08 • تراث وأصالة',
    badgeColor: 'bg-[#E2D4B7]/20 text-[#E2D4B7] border-[#E2D4B7]/40',
    icon: Flame,
    image: '/national-day-96/saudi-heritage-full.png',
    questionsCount: 80,
    pointsPerCorrect: 1,
    modeDescription: 'مسابقة في التراث الشعبي والعادات والتقاليد والأكلات والموروث الشعبي.'
  }
];

interface Props {
  onSelectActivity: (activityId: NationalDay96ActivityId) => void;
}

export function NationalDayActivityGrid({ onSelectActivity }: Props) {
  const visibleActivities = NATIONAL_DAY_ACTIVITIES.filter(act => !act.hidden);

  return (
    <div className="w-full flex flex-col gap-6 my-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#006C35]/40 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#004D25] to-[#00A859] flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(0,168,89,0.4)] border border-[#E2D4B7]/30">
            <Sparkles className="w-5 h-5 text-[#E2D4B7]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>فعاليات ومسابقات اليوم الوطني 96</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#C69214]/20 text-[#E2D4B7] border border-[#C69214]/40 font-mono">
                {visibleActivities.length} ACTIVITIES
              </span>
            </h2>
            <span className="text-xs text-[#E2D4B7]/70 font-bold">
              اختر الفعالية لبدء البث المباشر والتفاعل الفوري مع الجمهور
            </span>
          </div>
        </div>
      </div>

      {/* Grid of the Custom Authentic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleActivities.map((act) => {
          return (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act.id)}
              className="group relative rounded-3xl bg-[#041A0E] border-2 border-[#006C35]/60 hover:border-[#00A859] p-3 flex flex-col justify-between gap-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,168,89,0.4)] cursor-pointer overflow-hidden shadow-2xl backdrop-blur-xl"
            >
              {/* Authentic Card Image Crop Container */}
              <div className="relative w-full aspect-[256/341] rounded-2xl overflow-hidden shadow-md bg-[#020D06] flex items-center justify-center border border-[#E2D4B7]/20">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-100 contrast-105"
                />

                {/* Hover Quick Play Overlay */}
                <div className="absolute inset-0 bg-[#004D25]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#006C35] to-[#00A859] border-2 border-[#FFE79A] shadow-[0_0_25px_rgba(0,168,89,0.8)] flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 fill-current text-[#FFE79A] ml-0.5" />
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-slate-950/90 border border-[#00A859] text-xs font-black text-[#FFE79A] shadow-lg">
                    بدء البث المباشر 🚀
                  </span>
                </div>

                {/* Points Pill Badge */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#082915]/90 border border-[#00A859]/60 text-white font-mono font-black text-[10px] shadow-md flex items-center gap-1 backdrop-blur-md">
                  <Star className="w-3 h-3 text-[#FFE79A] fill-current" />
                  <span>+{act.pointsPerCorrect} نقطة</span>
                </div>
              </div>

              {/* Card Action Button */}
              <button className="w-full py-2 rounded-xl bg-gradient-to-r from-[#006C35] via-[#00A859] to-[#006C35] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md group-hover:scale-[1.02] transition-all border border-[#E2D4B7]/25 cursor-pointer">
                <span>تشغيل {act.title}</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180 text-[#FFE79A]" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
