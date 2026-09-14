'use client';

import React from 'react';
import { AnyQuestion, GameRound } from '@aep/types';
import { QuizEngineView } from '../engines/QuizEngineView';
import { AlphabetEngineView } from '../engines/AlphabetEngineView';
import { ImagePuzzleView } from '../engines/ImagePuzzleView';
import { VideoChallengeView } from '../engines/VideoChallengeView';
import { AudioChallengeView } from '../engines/AudioChallengeView';
import { MixedWordsView } from '../engines/MixedWordsView';
import { SymbolPuzzleView } from '../engines/SymbolPuzzleView';
import { CharacterEngineView } from '../engines/CharacterEngineView';
import { HunterRouletteView } from '../engines/HunterRouletteView';
import { MusicalChairsView } from '../engines/MusicalChairsView';
import { WhatDoTheySayView } from '../engines/WhatDoTheySayView';
import { MemoryMatchView } from '../engines/MemoryMatchView';
import { CapitalsEngineView } from '../engines/CapitalsEngineView';
import { BusTayyibinView } from '../engines/BusTayyibinView';
import { SquidGameView } from '../engines/SquidGameView';
import { ViewerRaceView } from '../engines/ViewerRaceView';
import { getImageStyleCSS } from '@aep/game-engines';
import { Clock, HelpCircle, Flame, Eye, Radio, ArrowLeft, Sparkles } from 'lucide-react';

interface Props {
  currentRound: GameRound;
  currentQuestion: AnyQuestion;
  timeRemainingSeconds: number;
  isAnswerRevealed: boolean;
  isTimerRunning: boolean;
  onRevealAnswer?: () => void;
  onNextQuestion?: () => void;
}

export function StageArena({
  currentRound,
  currentQuestion,
  timeRemainingSeconds,
  isAnswerRevealed,
  isTimerRunning,
  onRevealAnswer,
  onNextQuestion
}: Props) {
  const renderEngineView = () => {
    switch (currentQuestion.engineType) {
      case 'capitals':
        return <CapitalsEngineView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'bus-tayyibin':
        return <BusTayyibinView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'quiz':
        return <QuizEngineView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'musical-chairs':
      case 'the-vault':
        return <MusicalChairsView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'memory-match':
        return <MemoryMatchView />;
      case 'what-do-they-say':
        return <WhatDoTheySayView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'alphabet':
        return <AlphabetEngineView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'image-puzzle':
        return <ImagePuzzleView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'video-challenge':
        return <VideoChallengeView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'audio-challenge':
        return <AudioChallengeView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'mixed-words':
        return <MixedWordsView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'symbol-puzzle':
        return <SymbolPuzzleView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'character':
        return <CharacterEngineView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'squid-game':
        return <SquidGameView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'viewer-race':
        return <ViewerRaceView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      case 'hunter-roulette':
        return <HunterRouletteView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
      default:
        return <QuizEngineView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />;
    }
  };

  const formattedTime = String(timeRemainingSeconds).padStart(2, '0');
  const uploadedImg = (currentQuestion as any).imageUrl;
  const uploadedVid = (currentQuestion as any).videoUrl;
  const uploadedAud = (currentQuestion as any).audioUrl;

  // 🏇 Viewer Race, 🦑 Squid Survival & 🚌 Bus Al-Tayyibin have their own standalone TV Game Show stages
  if (currentQuestion.engineType === 'viewer-race') {
    return (
      <div className="w-full">
        <ViewerRaceView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />
      </div>
    );
  }

  if (currentQuestion.engineType === 'squid-game') {
    return (
      <div className="w-full">
        <SquidGameView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />
      </div>
    );
  }

  if (currentQuestion.engineType === 'bus-tayyibin') {
    return (
      <div className="w-full">
        <BusTayyibinView question={currentQuestion as any} isAnswerRevealed={isAnswerRevealed} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-between p-5 sm:p-7 rounded-3xl glass-broadcast-panel relative overflow-hidden shadow-2xl h-full min-h-[520px]">
      {/* Top Bar Header Badge Area with Broadcast Ticker Accent */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161922] border border-[#D6A84F]/40 text-[#D6A84F] font-black text-[11px] font-mono shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>ROUND 1</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161922] border border-white/15 text-slate-200 font-bold text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>{currentRound?.title || 'مسابقة البث المباشر التفاعلية'}</span>
          </div>
        </div>

        {/* Live Broadcast Indicator with Pulsing TV Dot */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-[11px] font-black font-mono shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
          <Radio className="w-3.5 h-3.5" />
          <span>● LIVE BROADCAST</span>
        </div>
      </div>

      {/* Center Stage Box - Full Width */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-4 z-10 gap-4">
        {/* For Full-Stage Engines (Bus Tayyibin, Alphabet, What Do They Say, Hunter Roulette, Memory Match), render engine view directly */}
        {currentQuestion.engineType === 'bus-tayyibin' ||
        currentQuestion.engineType === 'alphabet' || 
        currentQuestion.engineType === 'what-do-they-say' || 
        currentQuestion.engineType === 'hunter-roulette' || 
        currentQuestion.engineType === 'memory-match' ? (
          <div className="w-full max-w-full flex justify-center">
            {renderEngineView()}
          </div>
        ) : (
          <>
            {/* 🌟 Luxury Prime-Time TV Game Show Question Centerpiece */}
            <div className="w-full max-w-4xl p-7 sm:p-10 rounded-3xl tv-show-question-banner text-center relative overflow-hidden backdrop-blur-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)]">
              <div className="flex items-center justify-center gap-2.5 mb-4">
                <span className="px-3.5 py-1 rounded-full text-[11px] font-black bg-[#D6A84F]/15 text-[#D6A84F] border border-[#D6A84F]/40 font-mono tracking-wider uppercase shadow-sm">
                  السؤال رقم #{currentQuestion.id || '1'}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-400/30 font-mono shadow-sm">
                  +{currentQuestion.points || 100} نقطة
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-white leading-relaxed tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Custom Uploaded Media Preview */}
            {uploadedImg && currentQuestion.engineType !== 'character' && currentQuestion.engineType !== 'capitals' && (
              <div className="relative w-full max-w-xl max-h-[420px] rounded-3xl overflow-hidden glass-arena-card border border-purple-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] mx-auto flex items-center justify-center p-1 bg-black/60">
                <img
                  src={uploadedImg}
                  alt="Uploaded Media"
                  style={getImageStyleCSS((currentQuestion as any).transformStyle || 'normal')}
                  className="w-full h-auto max-h-[400px] object-contain rounded-2xl transition-all duration-500"
                />
              </div>
            )}

            {uploadedVid && currentQuestion.engineType === 'video-challenge' && (
              <div className="relative w-full max-w-xl max-h-[420px] rounded-3xl overflow-hidden glass-arena-card border border-rose-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] mx-auto flex items-center justify-center p-1 bg-black/90">
                <video src={uploadedVid} controls autoPlay className="w-full h-auto max-h-[400px] object-contain rounded-2xl" />
              </div>
            )}

            {(uploadedAud || (currentQuestion as any).audioUrl) && currentQuestion.engineType === 'audio-challenge' && (
              <div className="w-full max-w-md p-4 rounded-3xl bg-slate-900/90 border border-white/15 shadow-xl backdrop-blur-md">
                <audio src={uploadedAud || (currentQuestion as any).audioUrl} controls autoPlay className="w-full" />
              </div>
            )}

            {/* Symbol / Emoji Puzzle Display */}
            {currentQuestion.engineType === 'symbol-puzzle' && (
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 p-6 sm:p-10 rounded-3xl glass-arena-card border border-pink-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] my-2">
                {((currentQuestion as any).emojis || ['🦁', '👑']).map((emoji: string, idx: number) => (
                  <span key={idx} className="text-6xl sm:text-8xl hover:scale-110 transition-transform duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                    {emoji}
                  </span>
                ))}
              </div>
            )}

            {/* 👑 Prime-Time TV Game Show Action Controls & Gold Circular Countdown Timer */}
            <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-5 my-4">
              {/* Left: Reveal Answer Button (Broadcast Emerald / Gold Reveal) */}
              <button
                onClick={onRevealAnswer}
                className="flex-1 w-full py-4 px-6 rounded-2xl bg-[#161922] border border-[#D6A84F]/40 hover:bg-[#D6A84F]/15 hover:border-[#D6A84F] transition-all flex items-center justify-center gap-2.5 text-[#D6A84F] font-black text-base shadow-[0_8px_25px_rgba(214,168,79,0.15)] active:scale-95 cursor-pointer backdrop-blur-md"
              >
                <Eye className="w-5 h-5 text-[#D6A84F]" />
                <span>كشف الإجابة</span>
              </button>

              {/* Center: High-Tech Broadcast Circular Timer Ring in Sovereign Gold */}
              {(() => {
                const totalTime = currentQuestion.timeLimitSeconds || 30;
                const progress = timeRemainingSeconds / totalTime;
                const circumference = 2 * Math.PI * 54;
                const offset = circumference * (1 - progress);
                const minutes = Math.floor(timeRemainingSeconds / 60);
                const seconds = timeRemainingSeconds % 60;
                const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                const isLow = timeRemainingSeconds <= 5;
                const ringColor = isLow ? '#EF4444' : '#D6A84F';
                const glowColor = isLow ? 'rgba(239,68,68,0.7)' : 'rgba(214,168,79,0.5)';
                const textColor = isLow ? 'text-rose-400' : 'text-[#D6A84F]';

                return (
                  <div className={`relative w-36 h-36 shrink-0 flex items-center justify-center ${isLow && isTimerRunning ? 'animate-pulse' : ''}`}>
                    {/* Outer Glow Ring */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        boxShadow: `0 0 35px ${glowColor}, inset 0 0 20px ${glowColor}`,
                        transition: 'box-shadow 0.4s ease'
                      }}
                    />

                    {/* SVG Rings */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
                      <circle
                        cx="60" cy="60" r="54"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="7"
                      />
                      <circle
                        cx="60" cy="60" r="54"
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
                      />
                    </svg>

                    {/* Inner Dark Circle */}
                    <div className="absolute inset-2.5 rounded-full bg-gradient-to-b from-[#151926] via-[#0E111C] to-[#07090F] flex flex-col items-center justify-center border border-white/10 shadow-inner">
                      <span className={`text-3xl font-black font-mono tracking-wider ${textColor}`}
                        style={{ textShadow: `0 0 16px ${glowColor}`, transition: 'color 0.4s ease' }}
                      >
                        {displayTime}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold font-mono mt-0.5 tracking-widest uppercase">
                        {isTimerRunning ? 'LIVE TIMER' : timeRemainingSeconds === 0 ? 'TIME OUT' : 'PAUSED'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Right: Next Question Button (Sovereign Gold Gradient TV CTA) */}
              <button
                onClick={onNextQuestion}
                className="flex-1 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D6A84F] via-[#E5BE6C] to-[#B38734] text-slate-950 font-black text-base shadow-[0_10px_30px_rgba(214,168,79,0.4)] active:scale-95 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <span>السؤال التالي</span>
                <ArrowLeft className="w-5 h-5 text-slate-950" />
              </button>
            </div>

            {/* Engine View Container */}
            <div className="w-full max-w-full flex justify-center mt-2">
              {renderEngineView()}
            </div>
          </>
        )}
      </div>

      {/* Bottom Stage Ticker Info */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-3 z-10 font-bold">
        <div className="flex items-center gap-2 text-amber-400">
          <Flame className="w-4 h-4 text-amber-400" />
          <span className="font-mono">TikTok LIVE Interactive Stage</span>
        </div>
        <span>اكتب إجابتك في الشات مباشرة للفوز بالنقاط والمركز الأول 🔥</span>
      </div>
    </div>
  );
}
