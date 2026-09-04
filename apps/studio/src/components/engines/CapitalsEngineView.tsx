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
          <div className="relative w-36 h-24 sm:w-44 sm:h-28 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-2 border-[#282E40] bg-[#08090C] group hover:scale-105 transition-transform duration-300">
            <img
              src={question.flagUrl}
              alt={question.countryName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161922] border border-[#282E40] text-xs font-mono font-bold text-slate-300">
          <Globe className="w-3.5 h-3.5 text-[#D6A84F]" />
          <span>القارة: <strong className="text-white">{question.continent || 'عالمية'}</strong></span>
        </div>
      </div>

      {/* 2. Answer State: Hidden vs Revealed */}
      <div className="w-full max-w-xl">
        {!isAnswerRevealed ? (
          <div className="p-6 rounded-3xl bg-[#08090C] border-2 border-dashed border-[#282E40] flex flex-col items-center justify-center gap-3 text-center shadow-inner">
            <div className="w-12 h-12 rounded-2xl bg-[#D6A84F]/10 border border-[#D6A84F]/30 text-[#D6A84F] flex items-center justify-center animate-pulse">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-black text-sm text-white block">
                اكتب اسم العاصمة في الشات المباشر 💬
              </span>
              <span className="text-xs text-slate-400 font-medium">
                (نظام التعرف الذكي يقبل العواصم الإدارية والاقتصادية والتاريخية)
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#0F1117] border-2 border-[#D6A84F] shadow-[0_0_50px_rgba(214,168,79,0.25)] flex flex-col items-center justify-center gap-4 text-center animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-xs font-mono font-black text-[#D6A84F] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#D6A84F]" />
              <span>الإجابة الصحيحة المعتمدة</span>
            </div>

            {/* Primary Capital Badge */}
            <div className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#D6A84F] to-[#E5BE6C] text-[#08090C] font-display font-black text-2xl sm:text-3xl shadow-xl flex items-center gap-3">
              <MapPin className="w-6 h-6 fill-current" />
              <span>{primaryCapital}</span>
            </div>

            {/* Other Recognized Capitals (e.g. Administrative / Economic) */}
            {otherCapitals.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-xs font-bold text-slate-400">عواصم أخرى معتمدة في النظام:</span>
                {otherCapitals.map((cap, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-[#161922] border border-[#282E40] text-emerald-400 text-xs font-bold font-mono"
                  >
                    ✓ {cap}
                  </span>
                ))}
              </div>
            )}

            {/* Notes if available */}
            {question.notes && (
              <p className="text-xs text-slate-300 font-medium bg-[#12141C] border border-[#1F2433] px-4 py-2 rounded-xl mt-1">
                ℹ️ {question.notes}
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
