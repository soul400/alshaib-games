'use client';

import React from 'react';
import { SymbolPuzzleQuestion } from '@aep/types';

interface Props {
  question: SymbolPuzzleQuestion;
  isAnswerRevealed: boolean;
}

export function SymbolPuzzleView({ question, isAnswerRevealed }: Props) {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Answer Reveal Box (No duplicate title, badge, or second emoji card box) */}
      <div className="w-full max-w-md p-3.5 rounded-2xl glass-panel text-center border border-pink-500/30">
        <p className="text-slate-400 text-xs mb-1">حل اللغز (اسم الفيلم / المثل / الدولة):</p>
        <p className="text-xl font-black text-pink-300 font-mono">
          {isAnswerRevealed ? question.acceptableAnswers.join(' / ') : '••••••••••••••••'}
        </p>
      </div>
    </div>
  );
}
