'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Tv, Gamepad2, Layers, Database, Sliders, Trophy, 
  Users, BarChart3, Settings, Volume2, Plus, Sparkles, ChevronLeft, Flag
} from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navigationSections = [
    {
      title: 'STUDIO',
      items: [
        { href: '/', label: 'الرئيسية (Command Center)', icon: Tv, exact: true },
        { href: '/national-day-96', label: 'فعاليات اليوم الوطني 96 🇸🇦', icon: Flag, badge: '96' },
        { href: '/play', label: 'الألعاب والمسابقات', icon: Gamepad2 },
        { href: '/shows', label: 'إدارة العروض', icon: Layers },
        { href: '/library', label: 'بنك الأسئلة والمحتوى', icon: Database },
      ]
    },
    {
      title: 'LIVE',
      items: [
        { href: '/host-desk', label: 'غرفة التحكم (Host Desk)', icon: Sliders, badge: 'CONTROL' },
        { href: '/leaderboard', label: 'لوحة الصدارة المباشرة', icon: Trophy },
        { href: '/players', label: 'اللاعبون وسجلات الفوز', icon: Users },
        { href: '/analytics', label: 'تحليلات الأداء والتفاعل', icon: BarChart3 },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { href: '/sound-fx', label: 'المؤثرات الصوتية', icon: Volume2 },
        { href: '/settings', label: 'إعدادات المنصة', icon: Settings },
      ]
    }
  ];

  const isLinkActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== '/';
  };

  return (
    <aside className="w-[72px] shrink-0 bg-[#0B0E14] border-l border-[#262C3A] flex flex-col items-center justify-between py-4 sticky top-0 h-screen z-40 hidden lg:flex select-none">
      
      {/* TOP SECTION: BRAND LOGO */}
      <div className="flex flex-col items-center gap-4 w-full">
        <Link 
          href="/" 
          className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1A1D27] to-[#0E1017] border border-[#8B5CF6]/40 p-1 flex items-center justify-center group hover:scale-105 transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)]"
          title="الشايب — Broadcast Game OS"
        >
          <img
            src="/alshaib-logo.png"
            alt="الشايب"
            className="w-full h-full object-cover rounded-xl"
          />
          <span className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#D6A84F] rounded-full border-2 border-[#08090C]" />
        </Link>

        {/* FAST ACTION: CREATE SHOW */}
        <Link
          href="/shows"
          className="w-10 h-10 rounded-xl bg-[#D6A84F] hover:bg-[#E5BE6C] text-[#08090C] flex items-center justify-center shadow-[0_4px_15px_rgba(214,168,79,0.25)] transition-all hover:scale-110 active:scale-95"
          title="إنشاء عرض جديد"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </Link>
      </div>

      {/* CENTER SECTION: NAVIGATION ICONS */}
      <div className="flex flex-col items-center gap-5 w-full my-auto">
        {navigationSections.map((section, sIdx) => (
          <div key={section.title} className="flex flex-col items-center gap-1.5 w-full">
            {sIdx > 0 && <div className="w-6 h-[1px] bg-[#1F2433] my-1" />}
            
            {section.items.map((item) => {
              const active = isLinkActive(item.href, item.exact);
              const Icon = item.icon;

              return (
                <div key={item.href} className="relative group w-full flex justify-center">
                  <Link
                    href={item.href}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                      active
                        ? 'bg-[#D6A84F]/15 text-[#D6A84F] border border-[#8B5CF6]/40 shadow-[0_0_15px_rgba(214,168,79,0.1)]'
                        : 'text-slate-400 hover:text-white hover:bg-[#12141C] border border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>

                  {/* HIGH CONTRAST SOLID FLYOUT LABEL */}
                  <div className="absolute right-[68px] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#161922] border border-[#282E40] text-white text-xs font-bold whitespace-nowrap shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-[#EF4444]/20 text-[#EF4444] text-[9px] font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* BOTTOM SECTION: PROFILE AVATAR */}
      <div className="flex flex-col items-center gap-2 w-full pt-3 border-t border-[#1F2433]">
        <Link 
          href="/settings"
          className="w-10 h-10 rounded-xl bg-[#12141C] border border-[#282E40] hover:border-[#D6A84F]/50 flex items-center justify-center overflow-hidden transition-all group"
          title="الإعدادات وحساب المضيف"
        >
          <img
            src="/alshaib-logo.png"
            alt="soul80813"
            className="w-full h-full object-cover rounded-lg"
          />
        </Link>
      </div>
    </aside>
  );
}
