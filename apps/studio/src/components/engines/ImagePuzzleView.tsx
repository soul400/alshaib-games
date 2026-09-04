'use client';

import React, { useState } from 'react';
import { ImagePuzzleQuestion, ImageTransformStyle } from '@aep/types';
import { getImageStyleCSS } from '@aep/game-engines';
import { Image as ImageIcon, Eye, Wand2 } from 'lucide-react';

interface Props {
  question: ImagePuzzleQuestion;
  isAnswerRevealed: boolean;
}

export function ImagePuzzleView({ question, isAnswerRevealed }: Props) {
  const [activeStyle, setActiveStyle] = useState<ImageTransformStyle>(question.transformStyle || 'blur');

  const stylesList: { id: ImageTransformStyle; label: string }[] = [
    { id: 'caricature', label: '🎭 كاريكاتير Caricature' },
    { id: 'blur', label: 'تغبيش Blur' },
    { id: 'pixel', label: 'بكسل Pixel' },
    { id: 'sketch', label: 'رسم Sketch' },
    { id: 'mosaic', label: 'موزاييك Mosaic' },
    { id: 'black-shadow', label: 'ظل أسود Shadow' },
    { id: 'comic-style', label: 'كوميك Comic' },
    { id: 'cartoon', label: 'كرتون Cartoon' },
    { id: 'half-image', label: 'نصف صورة Half' },
    { id: 'normal', label: 'أصلي Normal' }
  ];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Live Filter Selector for Host (No duplicate title, badge, or second image frame) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl">
        {stylesList.map((st) => (
          <button
            key={st.id}
            onClick={() => setActiveStyle(st.id)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeStyle === st.id
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.8)] scale-105'
                : 'glass-panel text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Answer Reveal Box */}
      <div className="w-full max-w-md p-3.5 rounded-2xl glass-panel text-center border border-purple-500/30">
        <p className="text-slate-400 text-xs mb-1">الإجابة المقبولة:</p>
        <p className="text-xl font-extrabold text-purple-300 font-mono">
          {isAnswerRevealed ? question.acceptableAnswers.join(' / ') : '••••••••••••••••'}
        </p>
      </div>
    </div>
  );
}
