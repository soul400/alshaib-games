'use client';

import React from 'react';
import { 
  QuizQuestion, 
  ImagePuzzleQuestion, 
  VideoChallengeQuestion, 
  AudioChallengeQuestion, 
  MixedWordsQuestion, 
  SymbolPuzzleQuestion, 
  CharacterQuestion, 
  WhatDoTheySayQuestion,
  CapitalsQuestion
} from '@aep/types';
import { HelpCircle, MessageSquare, Image, Flag, Volume2, Video, Shuffle, Smile, CheckCircle2, Sparkles, VolumeX } from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// 1. QUIZ TEMPLATE (الثقافة العامة والاختيار من متعدد)
// ══════════════════════════════════════════════════════════════
export function QuizTemplate({ question, isAnswerRevealed }: { question: QuizQuestion; isAnswerRevealed?: boolean }) {
  return (
    <div className="w-full flex flex-col items-center gap-6 my-2 text-center dir-rtl select-none">
      {/* Question Hero Title */}
      <h2 className="text-2xl sm:text-4xl font-black font-display text-white max-w-3xl leading-relaxed drop-shadow-md">
        {question.title}
      </h2>

      {/* Multiple Choice Options Grid (If Available) */}
      {question.options && question.options.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-2">
          {question.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isCorrect = isAnswerRevealed && question.acceptableAnswers.some(a => a.toLowerCase() === opt.toLowerCase());

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-right font-bold text-sm flex items-center gap-3 transition-all ${
                  isCorrect
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                    : 'bg-[#121426] border-[#232736] text-white'
                }`}
              >
                <span className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                  {letter}
                </span>
                <span className="flex-1 truncate">{opt}</span>
              </div>
            );
          })}
        </div>
      ) : (
        /* Open Answer Prompt */
        <div className="px-6 py-2.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-black font-mono flex items-center gap-2 animate-pulse mt-2">
          <MessageSquare className="w-4 h-4" />
          <span>اكتب الإجابة مباشرة في تعليقات البث!</span>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 2. OPEN QUESTION TEMPLATE (الأسئلة المفتوحة المباشرة في الشات)
// ══════════════════════════════════════════════════════════════
export function OpenQuestionTemplate({ questionTitle }: { questionTitle: string }) {
  return (
    <div className="w-full flex flex-col items-center gap-6 my-2 text-center dir-rtl select-none">
      <div className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-black">
        سؤال الجولة المفتوح 💬
      </div>

      <h2 className="text-2xl sm:text-4xl font-black font-display text-white max-w-3xl leading-relaxed drop-shadow-md">
        {questionTitle}
      </h2>

      <div className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-sm flex items-center gap-2 shadow-lg animate-bounce mt-2">
        <Sparkles className="w-4 h-4" />
        <span>اكتب إجابتك الآن في الشات للفوز فورا!</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 3. IMAGE QUESTION TEMPLATE (ألغاز الصور والتأثيرات - Hero Image)
// ══════════════════════════════════════════════════════════════
export function ImageQuestionTemplate({ question }: { question: ImagePuzzleQuestion }) {
  return (
    <div className="w-full flex flex-col items-center gap-4 my-1 text-center dir-rtl select-none">
      {/* Hero Image Presentation */}
      <div className="relative max-w-md w-full h-56 sm:h-64 rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-[0_10px_40px_rgba(0,0,0,0.8)] bg-slate-900">
        <img
          src={question.imageUrl}
          alt={question.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[10px] font-mono font-black text-amber-300 flex items-center gap-1">
          <Image className="w-3 h-3 text-amber-400" />
          <span>تأثير الصورة: {question.transformStyle || 'Normal'}</span>
        </div>
      </div>

      <h3 className="text-lg sm:text-2xl font-black text-white max-w-2xl">{question.title}</h3>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 4. GEOGRAPHY & CAPITALS TEMPLATE (العواصم والأعلام الجغرافية الكبيرة)
// ══════════════════════════════════════════════════════════════
export function GeographyTemplate({ question }: { question: CapitalsQuestion | CharacterQuestion }) {
  const isFlag = 'flagUrl' in question && question.flagUrl;

  return (
    <div className="w-full flex flex-col items-center gap-4 my-1 text-center dir-rtl select-none">
      {isFlag ? (
        <div className="w-48 h-32 sm:w-56 sm:h-36 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-slate-900 p-1">
          <img src={(question as any).flagUrl} alt="" className="w-full h-full object-cover rounded-xl" />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border-2 border-cyan-400/50 text-cyan-300 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          🏛️
        </div>
      )}

      <h2 className="text-2xl sm:text-4xl font-black font-display text-white max-w-2xl">
        {question.title}
      </h2>

      <div className="px-6 py-2 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-mono font-black text-xs">
        اكتب اسم الدولة أو العاصمة في الشات
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 5. ALPHABET TEMPLATE (شبكة الحروف العربية)
// ══════════════════════════════════════════════════════════════
export function AlphabetTemplate({ letter, questionTitle }: { letter: string; questionTitle: string }) {
  return (
    <div className="w-full flex flex-col items-center gap-4 my-2 text-center dir-rtl select-none">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-5xl sm:text-6xl flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.5)] border-2 border-white/30 font-display">
        {letter}
      </div>

      <h2 className="text-xl sm:text-3xl font-black text-white max-w-2xl leading-relaxed">
        {questionTitle}
      </h2>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 6. MIXED WORDS TEMPLATE (الكلمات المبعثرة)
// ══════════════════════════════════════════════════════════════
export function MixedWordsTemplate({ question }: { question: MixedWordsQuestion }) {
  const letters = question.scrambledLetters || [];

  return (
    <div className="w-full flex flex-col items-center gap-6 my-2 text-center dir-rtl select-none">
      <div className="flex items-center gap-2 font-mono font-black text-xs text-emerald-400">
        <Shuffle className="w-4 h-4" />
        <span>أعد ترتيب الحروف المبعثرة لمعرفة الكلمة:</span>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap max-w-xl">
        {letters.map((l, idx) => (
          <div
            key={idx}
            className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-gradient-to-b from-[#181B30] to-[#0E1020] border-2 border-emerald-400/60 text-emerald-300 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg font-display"
          >
            {l}
          </div>
        ))}
      </div>

      <h3 className="text-sm font-bold text-slate-300">{question.title}</h3>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 7. WHAT DO THEY SAY TEMPLATE (وش يقولون؟ - الاستبيان الاجتماعي)
// ══════════════════════════════════════════════════════════════
export function WhatDoTheySayTemplate({ question }: { question: WhatDoTheySayQuestion }) {
  return (
    <div className="w-full flex flex-col items-center gap-5 my-2 text-center dir-rtl select-none">
      <div className="px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black font-mono">
        استبيان "وش يقولون؟" 💬
      </div>

      <h2 className="text-2xl sm:text-4xl font-black font-display text-white max-w-3xl leading-relaxed">
        {question.title}
      </h2>

      <div className="px-8 py-3 rounded-2xl bg-[#121424] border border-amber-400/40 text-amber-300 font-black text-sm">
        أكثر الإجابات الكبرى شيوعاً تتوزع في الجدول
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 8. AUDIO & VIDEO MEDIA TEMPLATE (التحديات الصوتية والمرئية)
// ══════════════════════════════════════════════════════════════
export function MediaQuestionTemplate({ title, isAudio = true, mediaUrl }: { title: string; isAudio?: boolean; mediaUrl?: string }) {
  return (
    <div className="w-full flex flex-col items-center gap-5 my-2 text-center dir-rtl select-none">
      {isAudio ? (
        <div className="w-full max-w-md p-6 rounded-3xl bg-[#121424] border border-amber-400/40 flex flex-col items-center gap-3 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl border border-amber-400/30 animate-pulse">
            <Volume2 className="w-7 h-7" />
          </div>
          {/* Animated Waveform Visualizer */}
          <div className="flex items-end justify-center gap-1.5 h-10 w-full my-1">
            {[40, 75, 30, 90, 55, 100, 45, 80, 60, 35, 85, 50].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="w-1.5 bg-amber-400 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg h-56 rounded-3xl overflow-hidden border-2 border-rose-500/50 shadow-2xl bg-black">
          {mediaUrl ? (
            <video src={mediaUrl} controls autoPlay loop className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs">
              <Video className="w-8 h-8" />
            </div>
          )}
        </div>
      )}

      <h2 className="text-xl sm:text-3xl font-black text-white max-w-2xl">{title}</h2>
    </div>
  );
}
