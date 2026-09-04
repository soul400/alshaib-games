'use client';

import React from 'react';
import { AudioChallengeQuestion } from '@aep/types';

interface Props {
  question: AudioChallengeQuestion;
  isAnswerRevealed: boolean;
}

export function AudioChallengeView({ question, isAnswerRevealed }: Props) {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Answer Reveal Box (No duplicate title, badge, or second audio player) */}
      <div className="w-full max-w-md p-3.5 rounded-2xl glass-panel text-center border border-amber-500/30">
        <p className="text-slate-400 text-xs mb-1">الإجابة المطلوبة للمذيع:</p>
        <p className="text-xl font-extrabold text-amber-400 font-mono">
          {isAnswerRevealed ? question.acceptableAnswers.join(' / ') : '••••••••••••••••'}
        </p>
      </div>
    </div>
  );
}
