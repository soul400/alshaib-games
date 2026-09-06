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

  // 🦑 Squid Survival & 🚌 Bus Al-Tayyibin have their own standalone TV Game Show stages
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
    <div className="w-full flex flex-col items-center justify-between p-5 sm:p-7 rounded-3xl bg-[#0F1117] relative overflow-hidden border border-[#232736] shadow-2xl h-full min-h-[500px]">
      {/* Top Bar Header Badge Area */}
      <div className="w-full flex items-center justify-between border-b border-[#1F2433] pb-3 z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161922] border border-[#282E40] text-[#D6A84F] font-bold text-[11px] font-mono">
            <Clock className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>ROUND 1</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161922] border border-[#282E40] text-slate-300 font-bold text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>{currentRound?.title || 'مسابقة البث المباشر'}</span>
          </div>
        </div>

        {/* Live Broadcast Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-[11px] font-black font-mono">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
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
            {/* Large Prominent AAA Esports Question Banner */}
            <div className="w-full max-w-4xl p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0C1226]/95 via-[#080D1F]/95 to-[#0C1226]/95 border border-purple-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.8)] text-center relative overflow-hidden backdrop-blur-2xl">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-3 inline-block font-mono uppercase">
                QUESTION #{currentQuestion.id || '1'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-snug tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
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

            {/* Action Controls & Countdown Timer Section */}
            <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-5 my-3">
              {/* Left: Reveal Answer Button */}
              <button
                onClick={onRevealAnswer}
                className="flex-1 w-full py-4 px-6 rounded-2xl bg-white/5 border border-cyan-400/40 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all flex items-center justify-center gap-2.5 text-cyan-200 font-black text-base shadow-[0_8px_25px_rgba(0,217,255,0.2)] active:scale-95 cursor-pointer backdrop-blur-md"
              >
                <Eye className="w-5 h-5 text-cyan-300" />
                <span>كشف الإجابة</span>
              </button>

              {/* Center: High-Tech AAA Esports Circular Timer Ring */}
              {(() => {
                const totalTime = currentQuestion.timeLimitSeconds || 30;
                const progress = timeRemainingSeconds / totalTime;
                const circumference = 2 * Math.PI * 54;
                const offset = circumference * (1 - progress);
                const minutes = Math.floor(timeRemainingSeconds / 60);
                const seconds = timeRemainingSeconds % 60;
                const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                const isLow = timeRemainingSeconds <= 5;
                const isMid = timeRemainingSeconds <= 10 && !isLow;
                const ringColor = isLow ? '#FF3B5C' : isMid ? '#F5B942' : '#00D9FF';
                const glowColor = isLow ? 'rgba(255,59,92,0.6)' : isMid ? 'rgba(245,185,66,0.5)' : 'rgba(0,217,255,0.5)';
                const textColor = isLow ? 'text-rose-400' : isMid ? 'text-amber-300' : 'text-white';

                return (
                  <div className={`relative w-40 h-40 shrink-0 flex items-center justify-center ${isLow && isTimerRunning ? 'animate-pulse' : ''}`}>
                    {/* Outer Glow Ring */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: `0 0 30px ${glowColor}, inset 0 0 20px ${glowColor}`,
                        transition: 'box-shadow 0.5s ease'
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
                        stroke="rgba(139,92,246,0.15)"
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
                        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                      />
                    </svg>

                    {/* Inner Dark Circle */}
                    <div className="absolute inset-3 rounded-full bg-gradient-to-b from-[#0F152C] via-[#090C1D] to-[#050714] flex flex-col items-center justify-center border border-white/10 shadow-inner">
                      <span className={`text-3xl font-black font-mono tracking-wider ${textColor}`}
                        style={{ textShadow: `0 0 16px ${glowColor}`, transition: 'color 0.5s ease' }}
                      >
                        {displayTime}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold font-mono mt-0.5 tracking-widest uppercase">
                        {isTimerRunning ? 'IN PROGRESS' : timeRemainingSeconds === 0 ? 'TIME UP' : 'PAUSED'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Right: Next Question Button */}
              <button
                onClick={onNextQuestion}
                className="flex-1 w-full py-4 px-6 rounded-2xl purple-cta-button text-white font-black text-base shadow-[0_8px_25px_rgba(124,58,237,0.4)] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>السؤال التالي</span>
                <ArrowLeft className="w-5 h-5 text-white" />
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
