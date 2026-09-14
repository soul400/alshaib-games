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
import { ViewerRaceView } from '../../components/engines/ViewerRaceView';
import { LeaderboardOverlay } from '../../components/studio/LeaderboardOverlay';
import { WinnerAnnouncementModal } from '../../components/studio/WinnerAnnouncementModal';
import { GameHUD, HUDPhase } from '../../components/studio/GameHUD';
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
  // DEDICATED LIVE ACTION ENGINE: 🏇 VIEWER RACE GRAND PRIX (سباق المشاهدين)
  // Renders as a dedicated 100vw/100vh standalone AAA live broadcast experience!
  // ══════════════════════════════════════════════════════════════
  if (explicitEngineParam === 'viewer-race' || (!explicitEngineParam && (activeEngineType === 'viewer-race' || currentQuestion?.engineType === 'viewer-race'))) {
    return (
      <div className="w-full min-h-screen bg-[#07080C] flex flex-col select-none">
        {/* Fullscreen Dedicated Viewer Race View */}
        <div className="flex-1 w-full">
          <ViewerRaceView question={currentQuestion as any} />
        </div>
      </div>
    );
  }

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
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#10B981] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
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
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#10B981] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
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
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#10B981] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
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
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#10B981] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
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
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#10B981] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
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
            className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#232736] text-[#10B981] font-bold text-xs flex items-center gap-1.5 hover:bg-[#161922] transition-all"
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

  // Compute contextual broadcast HUD phase
  let hudPhase: HUDPhase = 'WAITING';
  if (controlState.activeOverlay === 'winner' || controlState.currentWinner) {
    hudPhase = 'WINNER';
  } else if (!controlState.isPlaying) {
    hudPhase = 'WAITING';
  } else if (controlState.timeRemainingSeconds <= 5 && controlState.timeRemainingSeconds > 0) {
    hudPhase = 'DANGER';
  } else {
    hudPhase = 'ACTIVE';
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-8 select-none">
      {/* 👑 UNIVERSAL BROADCAST GAME HUD STRIP */}
      {/* 👑 UNIVERSAL BROADCAST GAME HUD WITH UNIFIED CONTROLS (SINGLE SOVEREIGN HEADER) */}
      <GameHUD
        phase={hudPhase}
        gameTitle={activeEngineInfo.title}
        gameCategory={activeEngineInfo.category}
        roundNumber={1}
        timeRemainingSeconds={controlState.timeRemainingSeconds}
        totalTimeSeconds={currentQuestion?.timeLimitSeconds || 30}
        activePlayersCount={leaderboard.length}
        liveStatusText={controlState.isPlaying ? '● الجولة المباشرة نشطة' : 'في انتظار بدء الجولة'}
        showHomeButton={true}
        controls={
          <>
            {!controlState.isPlaying ? (
              <button
                onClick={startRound}
                className="px-5 py-2.5 rounded-2xl btn-hyper-violet text-xs flex items-center gap-2 font-cairo hover:scale-105 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>بدء اللعبة</span>
              </button>
            ) : (
              <button
                onClick={controlState.isTimerRunning ? pauseRound : resumeRound}
                className="px-4 py-2.5 rounded-2xl btn-cyber-cyan text-xs flex items-center gap-2 font-cairo hover:scale-105 transition-all cursor-pointer"
              >
                {controlState.isTimerRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{controlState.isTimerRunning ? 'إيقاف مؤقت' : 'استئناف'}</span>
              </button>
            )}

            <button
              onClick={() => toggleOverlay('leaderboard')}
              className="px-3.5 py-2.5 rounded-2xl bg-[#161B26] text-[#06B6D4] border border-[#262C3A] hover:border-[#06B6D4] text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-sm font-cairo"
            >
              <Trophy className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="hidden sm:inline">لوحة الصدارة</span>
            </button>

            <button
              onClick={() => setAutoMode(!autoMode)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all border cursor-pointer shadow-sm ${
                autoMode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40 hover:bg-rose-500/30'
              }`}
              title={autoMode ? 'تلقائي' : 'يدوي'}
            >
              {autoMode ? <Zap className="w-3.5 h-3.5" /> : <Hand className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{autoMode ? 'تلقائي' : 'يدوي'}</span>
            </button>
          </>
        }
      />

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

          {/* Mini Leaderboard - Top 5 (Matching Broadcast TV Design) */}
          <div className="p-5 rounded-3xl bg-[#161B26] border border-[#262C3A] rounded-3xl p-5 flex flex-col gap-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#10B981]" />
                <h3 className="font-black text-sm font-display text-white tracking-wider">لوحة الصدارة المباشرة</h3>
              </div>
              <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/15 px-2.5 py-0.5 rounded-full font-mono border border-[#10B981]/30 shadow-sm">LIVE</span>
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
      ? 'bg-[#10B981]/15 border border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.01]'
      : idx === 1 || idx === 2
      ? 'bg-[#06B6D4]/10 border border-[#06B6D4]/40'
      : 'bg-[#161B26] border border-[#262C3A]'
                    }`}
                  >
                    <span className={`font-black text-base min-w-[24px] text-center ${
                      idx === 0 ? 'text-[#10B981]' : idx === 1 || idx === 2 ? 'text-[#06B6D4]' : 'text-[#94A3B8]'
                    }`}>
                      {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                    </span>
                    <img
                      src={player.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                      alt={player.displayName}
                      className="w-9 h-9 rounded-full border border-[#D6A84F]/40 object-cover shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-white truncate block text-xs">{player.displayName || player.username}</span>
                    </div>
                    <span className="font-mono font-black text-[#10B981] text-sm">+{player.score} <span className="text-[10px] text-slate-400 font-normal">نقطة</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Correct Answers Feed */}
          <div className="p-5 rounded-3xl bg-[#161B26] border border-[#262C3A] rounded-3xl p-5 flex-1 min-h-[220px] max-h-[360px] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-sm font-display text-white tracking-wider">الإجابات الصحيحة</h3>
              </div>
              {correctAnswersThisQuestion.length > 0 && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-400/30 font-mono shadow-sm">
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
                  <div key={index} className="flex items-center justify-between p-2.5 rounded-xl bg-[#161922] border border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">#{item.rank}</span>
                      <span className="font-bold text-white truncate max-w-[100px]">{item.playerName}</span>
                    </div>
                    <span className="font-mono text-[#10B981] font-bold text-xs">+{item.points} ★</span>
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
