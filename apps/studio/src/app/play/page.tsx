'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStudioStore } from '../../store/useStudioStore';
import { StageArena } from '../../components/studio/StageArena';
import { HunterRouletteView } from '../../components/engines/HunterRouletteView';
import { MysteryRouletteView } from '../../components/engines/MysteryRouletteView';
import { MusicalChairsView } from '../../components/engines/MusicalChairsView';
import { VaultGameView } from '../../components/engines/VaultGameView';
import { BombPassView } from '../../components/engines/BombPassView';
import { ReactGameView } from '../../components/engines/ReactGameView';
import { MemoryMatchView } from '../../components/engines/MemoryMatchView';
import { SquidGameView } from '../../components/engines/SquidGameView';
import { LeaderboardOverlay } from '../../components/studio/LeaderboardOverlay';
import { WinnerAnnouncementModal } from '../../components/studio/WinnerAnnouncementModal';
import { GAME_ENGINE_SECTIONS } from '@aep/content-library';
import { EngineType } from '@aep/types';
import { Play, Pause, Trophy, Zap, Hand, Home, Check, Crown, Medal, Flame, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';

function PlayArenaContent() {
  const searchParams = useSearchParams();
  const explicitEngineParam = searchParams.get('engine') as EngineType | null;
  const isOverlayMode = searchParams.get('overlay') === 'true';

  const {
    show,
    controlState,
    currentRound,
    currentQuestion,
    liveComments,
    leaderboard,
    correctAnswersThisQuestion,
    autoMode,
    setAutoMode,
    startRound,
    pauseRound,
    resumeRound,
    revealAnswer,
    nextQuestion,
    toggleOverlay,
    loadEngineQuestions,
    setControlState
  } = useStudioStore();

  const activeEngineType = explicitEngineParam || currentRound?.engineType || currentQuestion?.engineType || 'quiz';
  const activeEngineInfo = GAME_ENGINE_SECTIONS.find(s => s.id === activeEngineType) || GAME_ENGINE_SECTIONS[0];

  // Immediately load engine-specific questions ONLY if explicit ?engine= param is present
  useEffect(() => {
    if (explicitEngineParam) {
      loadEngineQuestions(explicitEngineParam);
    }
  }, [explicitEngineParam, loadEngineQuestions]);

  // Hide sidebar when on play page
  useEffect(() => {
    const sidebar = document.querySelector('aside');
    const footer = document.querySelector('footer');
    if (sidebar) sidebar.style.display = 'none';
    if (footer) footer.style.display = 'none';
    return () => {
      if (sidebar) sidebar.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  // ══════════════════════════════════════════════════════════════
  // DEDICATED LIVE ACTION ENGINE: 🦑 SQUID SURVIVAL (لعبة الحبار)
  // Renders as a dedicated 100vw/100vh standalone AAA live broadcast experience!
  // ══════════════════════════════════════════════════════════════
  if (explicitEngineParam === 'squid-game' || (!explicitEngineParam && (activeEngineType === 'squid-game' || currentQuestion?.engineType === 'squid-game'))) {
    return (
      <div className="w-full min-h-screen bg-[#07080C] flex flex-col select-none">
        {/* Fullscreen Dedicated Squid Game View */}
        <div className="flex-1 w-full">
          <SquidGameView question={currentQuestion as any} />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // DEDICATED LIVE ACTION ENGINE: 🧠 MEMORY MATCH LIVE (لعبة الذاكرة التفاعلية)
  // Renders as a dedicated 100vw/100vh standalone AAA live broadcast experience!
  // ══════════════════════════════════════════════════════════════
  if (explicitEngineParam === 'memory-match' || (!explicitEngineParam && currentQuestion?.engineType === 'memory-match')) {
    return (
      <div className="w-full min-h-screen bg-[#08090C] flex flex-col select-none">
        {/* Top Minimal Broadcast Command Header */}
        <div className="w-full px-5 py-2.5 flex items-center justify-between border-b border-[#1F2433] bg-[#08090C]/90 backdrop-blur-md z-30 shrink-0">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#D6A84F] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
            <h1 className="text-xs sm:text-sm font-display font-black text-white">MEMORY MATCH LIVE — لعبة الذاكرة</h1>
          </div>
        </div>

        {/* Fullscreen Dedicated Memory Match View */}
        <div className="flex-1 w-full flex items-center justify-center">
          <MemoryMatchView />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // DEDICATED LIVE ACTION ENGINE: ⚡ REACT (تحدي التركيز والاستجابة)
  // ══════════════════════════════════════════════════════════════
  if (activeEngineType === 'react' || currentQuestion?.engineType === 'react') {
    return (
      <div className="w-full h-screen max-h-screen overflow-hidden bg-[#08090C] flex flex-col select-none">
        {/* Top Minimal Broadcast Command Header */}
        <div className="w-full px-5 py-2.5 flex items-center justify-between border-b border-[#1F2433] bg-[#08090C]/90 backdrop-blur-md z-30 shrink-0">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#D6A84F] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
            <h1 className="text-xs sm:text-sm font-display font-black text-white">GUESS THE NUMBER — تخمين الأرقام</h1>
          </div>
        </div>

        {/* Fullscreen Dedicated React Game View */}
        <div className="flex-1 w-full overflow-hidden p-2 sm:p-3 flex flex-col justify-center">
          <ReactGameView question={currentQuestion as any} />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // DEDICATED LIVE ACTION ENGINE: BOMB PASS (القنبلة الموقوتة 🧨)
  // ══════════════════════════════════════════════════════════════
  if (activeEngineType === 'bomb-pass' || currentQuestion?.engineType === 'bomb-pass') {
    return (
      <div className="w-full min-h-screen bg-[#08090C] flex flex-col select-none">
        {/* Top Minimal Broadcast Command Header */}
        <div className="w-full px-5 py-2.5 flex items-center justify-between border-b border-[#1F2433] bg-[#08090C]/90 backdrop-blur-md z-30 shrink-0">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#D6A84F] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
            <h1 className="text-xs sm:text-sm font-display font-black text-white">BOMB PASS — القنبلة الموقوتة</h1>
          </div>
        </div>

        {/* Fullscreen Dedicated Bomb Pass View */}
        <div className="flex-1 w-full flex items-center justify-center">
          <BombPassView question={currentQuestion as any} />
        </div>
      </div>
    );
  }

  // 🔴 SPECIAL FULL SCREEN ENGINE: Hunter's Roulette (روليت الصياد)
  if (activeEngineType === 'hunter-roulette' || currentQuestion?.engineType === 'hunter-roulette') {
    return (
      <div className="w-full min-h-screen bg-[#08090C] flex flex-col select-none">
        {/* Top Minimal Broadcast Command Header */}
        <div className="w-full px-5 py-2.5 flex items-center justify-between border-b border-[#1F2433] bg-[#08090C]/90 backdrop-blur-md z-30 shrink-0">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#D6A84F] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping" />
            <h1 className="text-xs sm:text-sm font-display font-black text-white">HUNTER ROULETTE — روليت الصياد</h1>
          </div>
        </div>

        {/* Fullscreen Dedicated Hunter Roulette View */}
        <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4">
          <HunterRouletteView question={currentQuestion as any} />
        </div>
      </div>
    );
  }

  // 🔴 SPECIAL FULL SCREEN ENGINE: MYSTERY ROULETTE (الروليت الغامض 🔮)
  if (activeEngineType === 'mystery-roulette' || currentQuestion?.engineType === 'mystery-roulette') {
    return (
      <div className="w-full min-h-screen bg-[#08090C] flex flex-col select-none">
        {/* Top Minimal Broadcast Command Header */}
        <div className="w-full px-5 py-2.5 flex items-center justify-between border-b border-[#1F2433] bg-[#08090C]/90 backdrop-blur-md z-30 shrink-0">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#D6A84F] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#D6A84F] animate-ping" />
            <h1 className="text-xs sm:text-sm font-display font-black text-white">MYSTERY ROULETTE — الروليت الغامض</h1>
          </div>
        </div>

        {/* Fullscreen Dedicated Mystery Roulette View */}
        <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4">
          <MysteryRouletteView question={currentQuestion as any} />
        </div>
      </div>
    );
  }

  // 🔴 SPECIAL FULL SCREEN ENGINE: MUSICAL CHAIRS (الكراسي الموسيقية 🪑)
  if (activeEngineType === 'musical-chairs' || activeEngineType === 'the-vault' || currentQuestion?.engineType === 'musical-chairs' || currentQuestion?.engineType === 'the-vault') {
    return (
      <div className="w-full min-h-screen bg-[#08090C] flex flex-col select-none">
        {/* Top Minimal Broadcast Command Header */}
        <div className="w-full px-5 py-2.5 flex items-center justify-between border-b border-[#1F2433] bg-[#08090C]/90 backdrop-blur-md z-30 shrink-0">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#D6A84F] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
            <h1 className="text-xs sm:text-sm font-display font-black text-white">MUSICAL CHAIRS — الكراسي الموسيقية</h1>
          </div>
        </div>

        {/* Fullscreen Dedicated Musical Chairs View */}
        <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4">
          <MusicalChairsView question={currentQuestion as any} />
        </div>
      </div>
    );
  }

  if (isOverlayMode) {
    return (
      <div className="w-full min-h-screen bg-transparent p-4 flex flex-col items-center justify-center">
        <StageArena
          currentRound={currentRound}
          currentQuestion={currentQuestion}
          timeRemainingSeconds={controlState.timeRemainingSeconds}
          isAnswerRevealed={controlState.isAnswerRevealed}
          isTimerRunning={controlState.isTimerRunning}
        />
      </div>
    );
  }

  const top5 = leaderboard.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* Top Sovereign Gold Broadcast Command Strip Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-[#0F1117] border border-[#232736] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <Link href="/" className="px-3.5 py-2.5 rounded-2xl bg-[#161922] text-[#D6A84F] border border-[#232736] hover:bg-[#1C202F] transition-all flex items-center gap-2 text-xs font-black">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">الصفحة الرئيسية</span>
          </Link>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {activeEngineInfo.title}
            </h2>
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#D6A84F]/20 text-[#D6A84F] border border-[#D6A84F]/40 font-mono uppercase">
              {activeEngineInfo.category}
            </span>
          </div>
        </div>

        {/* 2026 Sovereign Gold Interactive Control Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {!controlState.isPlaying ? (
            <button
              onClick={startRound}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D6A84F] to-[#B38734] text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_8px_30px_rgba(214,168,79,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>بدء اللعبة</span>
            </button>
          ) : (
            <button
              onClick={controlState.isTimerRunning ? pauseRound : resumeRound}
              className="px-5 py-3 rounded-2xl bg-[#D6A84F] text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              {controlState.isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{controlState.isTimerRunning ? 'إيقاف مؤقت' : 'استئناف'}</span>
            </button>
          )}

          <button
            onClick={() => toggleOverlay('leaderboard')}
            className="px-4 py-3 rounded-2xl bg-[#161922] text-[#D6A84F] border border-[#232736] hover:border-[#D6A84F]/40 text-xs font-black flex items-center gap-2 cursor-pointer hover:bg-[#1C202F] transition-all shadow-md"
          >
            <Trophy className="w-4 h-4 text-[#D6A84F]" />
            <span>لوحة الصدارة</span>
          </button>

          <button
            onClick={() => setAutoMode(!autoMode)}
            className={`px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all border cursor-pointer shadow-md ${
              autoMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-400/40 hover:bg-rose-500/30'
            }`}
            title={autoMode ? 'تلقائي' : 'يدوي'}
          >
            {autoMode ? <Zap className="w-4 h-4" /> : <Hand className="w-4 h-4" />}
            <span>{autoMode ? 'تلقائي (AUTO)' : 'يدوي (MANUAL)'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Stage (3 cols) + Side Panels (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stage Arena - Main View */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <StageArena
            currentRound={currentRound}
            currentQuestion={currentQuestion}
            timeRemainingSeconds={controlState.timeRemainingSeconds}
            isAnswerRevealed={controlState.isAnswerRevealed}
            isTimerRunning={controlState.isTimerRunning}
            onRevealAnswer={revealAnswer}
            onNextQuestion={nextQuestion}
          />
        </div>

        {/* Side Panel: Leaderboard Top 5 + Correct Answers Feed */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Mini Leaderboard - Top 5 (Matching 2026 Broadcast Design) */}
          <div className="p-5 rounded-3xl bg-[#0F1117] border border-[#232736] flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#232736] pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#D6A84F]" />
                <h3 className="font-black text-sm text-white font-mono uppercase tracking-wider">لوحة الصدارة</h3>
              </div>
              <span className="text-[10px] text-[#D6A84F] font-bold bg-[#D6A84F]/10 px-2 py-0.5 rounded-full font-mono border border-[#D6A84F]/30">LIVE</span>
            </div>

            {top5.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-8 flex flex-col items-center gap-2">
                <Trophy className="w-8 h-8 text-slate-600 animate-pulse" />
                <span>في انتظار أبطال البث المباشر...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {top5.map((player, idx) => (
                  <div
                    key={player.userId || player.username || `player-${idx}`}
                    className={`flex items-center gap-3 p-3 rounded-2xl text-xs transition-all ${
                      idx === 0
                        ? 'bg-gradient-to-r from-[#161922] to-[#1A1E2C] border-2 border-[#D6A84F] shadow-[0_0_20px_rgba(214,168,79,0.3)]'
                        : 'bg-[#161922] border border-[#232736] hover:border-white/20'
                    }`}
                  >
                    <span className={`font-black text-base min-w-[24px] text-center ${
                      idx === 0 ? 'text-[#D6A84F]' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-400'
                    }`}>
                      {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                    </span>
                    <img
                      src={player.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                      alt={player.displayName}
                      className="w-8 h-8 rounded-full border border-[#D6A84F]/40 object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-white truncate block text-xs">{player.displayName || player.username}</span>
                    </div>
                    <span className="font-mono font-black text-[#D6A84F] text-sm">{player.score} ★</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Correct Answers Feed */}
          <div className="p-5 rounded-3xl bg-[#0F1117] border border-[#232736] flex-1 min-h-[220px] max-h-[360px] flex flex-col shadow-xl">
            <div className="flex items-center justify-between border-b border-[#232736] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-sm text-white font-mono uppercase tracking-wider">الإجابات الصحيحة</h3>
              </div>
              {correctAnswersThisQuestion.length > 0 && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-400/30 font-mono">
                  {correctAnswersThisQuestion.length}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-0.5">
              {correctAnswersThisQuestion.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-8 flex flex-col items-center gap-2">
                  <Medal className="w-8 h-8 text-slate-600 animate-pulse" />
                  <span>في انتظار استقبال الإجابات الصحيحة من الشات...</span>
                </div>
              ) : (
                correctAnswersThisQuestion.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 rounded-xl bg-[#161922] border border-[#232736] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">#{item.rank}</span>
                      <span className="font-bold text-white truncate max-w-[100px]">{item.playerName}</span>
                    </div>
                    <span className="font-mono text-[#D6A84F] font-bold text-xs">+{item.points} ★</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Global Overlays */}
      {controlState.activeOverlay === 'leaderboard' && (
        <LeaderboardOverlay leaderboard={leaderboard || []} onClose={() => toggleOverlay('none')} />
      )}
      {controlState.activeOverlay === 'winner' && controlState.currentWinner && (
        <WinnerAnnouncementModal winner={controlState.currentWinner} onClose={() => toggleOverlay('none')} />
      )}
    </div>
  );
}

export default function PlayArenaPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-[#090A15] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono font-bold text-slate-400">جاري تحميل استوديو البث...</span>
        </div>
      </div>
    }>
      <PlayArenaContent />
    </Suspense>
  );
}
