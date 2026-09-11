'use client';

import React from 'react';
import { CapitalsQuestion } from '@aep/types';
import { Landmark, Globe, CheckCircle2, Sparkles, MapPin, Flag } from 'lucide-react';

interface Props {
  question: CapitalsQuestion;
  isAnswerRevealed: boolean;
}

export function CapitalsEngineView({ question, isAnswerRevealed }: Props) {
  const capitals = question.capitals || [question.correctAnswer];
  const primaryCapital = capitals[0];
  const otherCapitals = capitals.slice(1);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4 select-none">
      
      {/* 1. Country & Flag Display Area */}
      <div className="flex flex-col items-center gap-4">
        {question.flagUrl && (
          <div className="relative w-40 h-28 sm:w-52 sm:h-32 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.85)] border-2 border-white/20 bg-[#08090C] group hover:scale-105 transition-transform duration-300 ring-4 ring-[#D6A84F]/30">
            <img
              src={question.flagUrl}
              alt={question.countryName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-2 inset-x-0 flex justify-center">
              <span className="px-3 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[11px] font-black text-amber-300 border border-white/10">
                {question.countryName}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 px-5 py-2 rounded-full glass-broadcast-panel border border-white/15 text-xs font-mono font-bold text-slate-200 shadow-md">
          <Globe className="w-4 h-4 text-[#D6A84F] animate-spin-slow" />
          <span>القارة: <strong className="text-white font-extrabold">{question.continent || 'عالمية'}</strong></span>
        </div>
      </div>

      {/* 2. Answer State: Hidden vs Revealed */}
      <div className="w-full max-w-xl">
        {!isAnswerRevealed ? (
          <div className="p-7 rounded-3xl glass-broadcast-panel border-2 border-dashed border-[#D6A84F]/40 flex flex-col items-center justify-center gap-3.5 text-center shadow-inner relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D6A84F]/20 to-[#E5BE6C]/10 border border-[#D6A84F]/40 text-[#D6A84F] flex items-center justify-center animate-broadcast-pulse shadow-[0_0_25px_rgba(214,168,79,0.3)]">
              <Landmark className="w-7 h-7" />
            </div>
            <div>
              <span className="font-display font-black text-base text-white block tracking-wide">
                اكتب اسم العاصمة في الشات المباشر 💬
              </span>
              <span className="text-xs text-slate-300 font-medium mt-1 inline-block">
                (نظام التعرف الذكي يقبل العواصم الإدارية والاقتصادية والتاريخية)
              </span>
            </div>
          </div>
        ) : (
          <div className="p-7 rounded-3xl glass-broadcast-panel-gold border-2 border-[#D6A84F] rim-glow-gold flex flex-col items-center justify-center gap-4.5 text-center animate-in zoom-in-95 spotlight-sweep relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-mono font-black text-[#D6A84F] uppercase tracking-widest">
              <Sparkles className="w-4.5 h-4.5 text-[#D6A84F] animate-spin" />
              <span>الإجابة الصحيحة المعتمدة</span>
            </div>

            {/* Primary Capital Badge */}
            <div className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#D6A84F] via-[#F3CE7E] to-[#D6A84F] text-[#08090C] font-display font-black text-2xl sm:text-3xl shadow-[0_10px_35px_rgba(214,168,79,0.5)] flex items-center gap-3 scale-100 hover:scale-105 transition-transform">
              <MapPin className="w-7 h-7 fill-current" />
              <span className="tracking-wide">{primaryCapital}</span>
            </div>

            {/* Other Recognized Capitals (e.g. Administrative / Economic) */}
            {otherCapitals.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-xs font-bold text-slate-300">عواصم أخرى معتمدة في النظام:</span>
                {otherCapitals.map((cap, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-[#161922]/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono shadow-sm"
                  >
                    ✓ {cap}
                  </span>
                ))}
              </div>
            )}

            {/* Notes if available */}
            {question.notes && (
              <p className="text-xs text-slate-200 font-medium bg-black/40 border border-white/10 px-4 py-2 rounded-xl mt-1">
                ℹ️ {question.notes}
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
