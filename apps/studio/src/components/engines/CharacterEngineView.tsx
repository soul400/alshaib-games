'use client';

import React from 'react';
import { CharacterQuestion } from '@aep/types';
import { Flag, Globe2, Sparkles } from 'lucide-react';

interface Props {
  question: CharacterQuestion;
  isAnswerRevealed: boolean;
}

export function CharacterEngineView({ question, isAnswerRevealed }: Props) {
  const flagUrl = question.imageUrl || (question as any).flagUrl || '';
  const primaryName = question.characterName || question.acceptableAnswers?.[0] || 'الدولة';
  const alternativeAnswers = question.acceptableAnswers || [];

  return (
    <div className="w-full flex flex-col items-center gap-4 py-2">
      {/* Premium Flag Display Card (Crisp, High-Contrast & True Colors) */}
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center p-3 sm:p-4 bg-[#0F1322] group transition-all duration-300">
        {/* Decorative Corner Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-black flex items-center gap-1.5 backdrop-blur-md z-10">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <span>عَلَم دَوْلَة</span>
        </div>

        {/* Flag Image Display - Pristine Colors (No Filters, Overlays or Tint) */}
        {flagUrl ? (
          <div className="w-full h-60 sm:h-68 flex items-center justify-center p-3 rounded-2xl bg-[#080B14] border border-white/10 shadow-inner">
            <img
              src={flagUrl}
              alt={primaryName}
              style={{ filter: 'none', mixBlendMode: 'normal', opacity: 1 }}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="w-full h-60 sm:h-68 flex flex-col items-center justify-center gap-2 text-slate-500 bg-[#080B14] rounded-2xl">
            <Flag className="w-12 h-12 text-slate-600 animate-pulse" />
            <span className="text-xs font-semibold">جارِ تحميل صورة العلم...</span>
          </div>
        )}
      </div>

      {/* Answer Reveal Section */}
      <div className="w-full max-w-md p-4 rounded-2xl glass-panel text-center border-2 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] bg-slate-900/60 backdrop-blur-md">
        <p className="text-slate-400 text-xs font-extrabold mb-1.5 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>اسم الدولة الصحيح / المقبول:</span>
        </p>

        {isAnswerRevealed ? (
          <div className="flex flex-col items-center gap-1.5 animate-fade-in">
            <span className="text-2xl font-black text-amber-300 tracking-tight drop-shadow-[0_0_12px_rgba(252,211,77,0.5)]">
              {primaryName}
            </span>
            {alternativeAnswers.length > 1 && (
              <p className="text-xs text-cyan-300/80 font-medium">
                الإجابات المقبولة: {alternativeAnswers.join(' • ')}
              </p>
            )}
          </div>
        ) : (
          <span className="text-2xl font-black text-slate-600 tracking-widest font-mono select-none">
            ••••••••••••••••
          </span>
        )}
      </div>
    </div>
  );
}
