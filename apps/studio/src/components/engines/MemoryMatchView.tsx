'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MemoryCard, 
  MemoryCategory, 
  MemoryMatchConfig, 
  MemoryMatchPhase, 
  MemoryPlayer, 
  MemoryAttempt, 
  TikTokLiveComment,
  MemoryImageAsset
} from '@aep/types';
import { generateMemoryCardsForRound, MEMORY_IMAGE_LIBRARY } from '@aep/content-library';
import { parseMemoryMatchCommand } from '@aep/game-engines';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { useStudioStore } from '../../store/useStudioStore';
import { 
  Brain, 
  Sparkles, 
  Trophy, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Square, 
  Flame, 
  Users, 
  CheckCircle2, 
  Eye, 
  Volume2, 
  VolumeX, 
  Crown,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface Props {
  onGameEnd?: (winner: MemoryPlayer) => void;
}

export function MemoryMatchView({ onGameEnd }: Props) {
  const { liveComments, tiktokEngine } = useStudioStore();
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const toggleMute = () => setIsMuted(prev => !prev);

  // ══════════════════════════════════════════════════════════════
  // 1. GAME STATE MACHINE
  // ══════════════════════════════════════════════════════════════
  const [phase, setPhase] = useState<MemoryMatchPhase>('IDLE');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [config, setConfig] = useState<MemoryMatchConfig>({
    memorizeDurationSec: 5,
    category: 'random',
    pointsPerPair: 2,
    resultsDurationSec: 10,
    totalCards: 16,
    totalPairs: 8
  });

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [players, setPlayers] = useState<MemoryPlayer[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<MemoryAttempt[]>([]);
  const [tempRevealedPos, setTempRevealedPos] = useState<number[]>([]);
  const [missedPair, setMissedPair] = useState<{ posA: number; posB: number } | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(5);
  const [resultsCountdown, setResultsCountdown] = useState<number>(10);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [latestMatchNotice, setLatestMatchNotice] = useState<{ playerName: string; cardTitle: string; avatarUrl: string } | null>(null);
  const [winner, setWinner] = useState<MemoryPlayer | null>(null);
  const [selectedHostCard, setSelectedHostCard] = useState<number | null>(null);

  // Anti-spam and lock refs
  const lastProcessedCommentTimeRef = useRef<number>(0);
  const playerRateLimitRef = useRef<Map<string, number>>(new Map());
  const isTransitioningRoundRef = useRef<boolean>(false);
  const roundIdRef = useRef<string>(`round-${Date.now()}`);

  // Calculate pairs found
  const pairsFoundCount = cards.filter(c => c.isMatched).length / 2;
  const isRoundFinished = pairsFoundCount >= 8 && cards.length === 16;

  // ══════════════════════════════════════════════════════════════
  // 2. ROUND INITIALIZATION & CARDS SETUP
  // ══════════════════════════════════════════════════════════════
  const startNewRound = useCallback((roundNum: number, cat: MemoryCategory = config.category, memorizeSec = config.memorizeDurationSec) => {
    isTransitioningRoundRef.current = false;
    const newRoundId = `round-${Date.now()}-${roundNum}`;
    roundIdRef.current = newRoundId;

    const newCards = generateMemoryCardsForRound(newRoundId, cat);
    setCards(newCards);
    setRoundNumber(roundNum);
    setTempRevealedPos([]);
    setMissedPair(null);
    setLatestMatchNotice(null);
    setCountdownSeconds(memorizeSec);

    // Reset round scores for players while preserving totalScore & pairsFound
    setPlayers(prev => prev.map(p => ({ ...p, roundScore: 0 })));

    // Begin Memorize Phase
    setPhase('MEMORIZE');
    if (!isMuted) soundFX.play('round_start', 0.8);
  }, [config.category, config.memorizeDurationSec, isMuted]);

  // ══════════════════════════════════════════════════════════════
  // 3. MEMORIZE PHASE COUNTDOWN TIMER
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (phase !== 'MEMORIZE' || isPaused) return;

    const interval = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Transition to ACTIVE_GAME
          setPhase('ACTIVE_GAME');
          if (!isMuted) soundFX.play('lock_click', 0.8);
          return 0;
        }

        if (!isMuted && prev <= 4) {
          soundFX.play('countdown_tick', 0.6);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isPaused, isMuted]);

  // ══════════════════════════════════════════════════════════════
  // 4. RESULTS PHASE 10-SECOND COUNTDOWN & AUTO-NEXT ROUND
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (phase !== 'RESULTS' || isPaused) return;

    setResultsCountdown(config.resultsDurationSec);

    const interval = setInterval(() => {
      setResultsCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Automatically trigger next round
          startNewRound(roundNumber + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isPaused, config.resultsDurationSec, roundNumber, startNewRound]);

  // ══════════════════════════════════════════════════════════════
  // 5. ATOMIC PAIR MATCHING ENGINE
  // ══════════════════════════════════════════════════════════════
  const processPairAttempt = useCallback((posA: number, posB: number, playerInfo: { id: string; name: string; avatarUrl: string }) => {
    if (phase !== 'ACTIVE_GAME' || isPaused) return;

    // Find card A and card B
    const cardA = cards.find(c => c.position === posA);
    const cardB = cards.find(c => c.position === posB);

    if (!cardA || !cardB) return;

    // Strict validation: Already matched cards cannot be chosen again
    if (cardA.isMatched || cardB.isMatched) return;

    // Check if both cards form a valid pair!
    const isMatch = cardA.pairId === cardB.pairId;

    if (isMatch) {
      // 🎯 SUCCESSFUL MATCH (+2 Points)
      const now = Date.now();
      const updatedCards = cards.map(c => {
        if (c.position === posA || c.position === posB) {
          return {
            ...c,
            isRevealed: true,
            isMatched: true,
            matchedBy: {
              playerId: playerInfo.id,
              displayName: playerInfo.name,
              avatarUrl: playerInfo.avatarUrl
            },
            matchedAt: now
          };
        }
        return c;
      });

      setCards(updatedCards);

      // Update Player Scores
      setPlayers(prev => {
        const existingIdx = prev.findIndex(p => p.playerId === playerInfo.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            displayName: playerInfo.name,
            avatarUrl: playerInfo.avatarUrl || updated[existingIdx].avatarUrl,
            roundScore: updated[existingIdx].roundScore + config.pointsPerPair,
            totalScore: updated[existingIdx].totalScore + config.pointsPerPair,
            pairsFound: updated[existingIdx].pairsFound + 1,
            lastAttemptAt: now
          };
          return updated;
        } else {
          const newPlayer: MemoryPlayer = {
            playerId: playerInfo.id,
            displayName: playerInfo.name,
            avatarUrl: playerInfo.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
            roundScore: config.pointsPerPair,
            totalScore: config.pointsPerPair,
            pairsFound: 1,
            lastAttemptAt: now
          };
          return [...prev, newPlayer];
        }
      });

      // Sound and visual feedback
      if (!isMuted) soundFX.play('correct_answer', 0.9);
      setLatestMatchNotice({
        playerName: playerInfo.name,
        cardTitle: cardA.title,
        avatarUrl: playerInfo.avatarUrl
      });

      setTimeout(() => setLatestMatchNotice(null), 2500);

      // Check if all 8 pairs are now completed!
      const newMatchedCount = updatedCards.filter(c => c.isMatched).length / 2;
      if (newMatchedCount >= 8 && !isTransitioningRoundRef.current) {
        isTransitioningRoundRef.current = true;
        setPhase('ROUND_COMPLETE');
        if (!isMuted) soundFX.play('winner_announcement', 1.0);
        triggerVisualEffect('confetti');

        // Transition to Results screen after 2 seconds
        setTimeout(() => {
          setPhase('RESULTS');
        }, 2200);
      }
    } else {
      // ❌ WRONG PAIR: Preview cards briefly for 1.2s with soft error FX then flip back
      setMissedPair({ posA, posB });
      setTempRevealedPos([posA, posB]);
      if (!isMuted) soundFX.play('wrong_answer', 0.5);

      setTimeout(() => {
        setMissedPair(null);
        setTempRevealedPos([]);
      }, 1200);
    }
  }, [phase, isPaused, cards, config.pointsPerPair, isMuted, triggerVisualEffect]);

  // Auto-start game when mounted in live arena
  useEffect(() => {
    if (phase === 'IDLE') {
      const timer = setTimeout(() => {
        handleStartGame();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // ══════════════════════════════════════════════════════════════
  // 6. REAL-TIME COMMENT STREAM LISTENER
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (phase !== 'ACTIVE_GAME' || isPaused || !Array.isArray(liveComments) || liveComments.length === 0) return;

    // Filter all new comments that arrived after the last processed timestamp
    const unprocessed = liveComments.filter(c => c.timestamp > lastProcessedCommentTimeRef.current);
    if (unprocessed.length === 0) return;

    // Update last processed timestamp to newest comment timestamp
    lastProcessedCommentTimeRef.current = Math.max(...unprocessed.map(c => c.timestamp));

    // Process each incoming comment from oldest to newest in batch
    unprocessed.slice().reverse().forEach(comment => {
      const now = Date.now();
      const lastUserAttempt = playerRateLimitRef.current.get(comment.userId) || 0;
      if (now - lastUserAttempt < 600) return;
      playerRateLimitRef.current.set(comment.userId, now);

      // Parse comment (format: "1-3", "1 - 3", "5-12", "١-٣", "1 و 3", "1 3")
      const parsed = parseMemoryMatchCommand(comment.comment);
      if (!parsed.isValid || !parsed.posA || !parsed.posB) return;

      // Process attempt
      processPairAttempt(parsed.posA, parsed.posB, {
        id: comment.userId,
        name: comment.displayName || comment.username || 'مشارك',
        avatarUrl: comment.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'
      });
    });
  }, [liveComments, phase, isPaused, processPairAttempt]);

  // ══════════════════════════════════════════════════════════════
  // 7. HOST MANUAL CLICK SIMULATION & TESTING
  // ══════════════════════════════════════════════════════════════
  const handleHostCardClick = (pos: number) => {
    if (phase !== 'ACTIVE_GAME') return;
    const clickedCard = cards.find(c => c.position === pos);
    if (!clickedCard || clickedCard.isMatched) return;

    if (selectedHostCard === null) {
      setSelectedHostCard(pos);
      setTempRevealedPos([pos]);
      if (!isMuted) soundFX.play('lock_click', 0.4);
    } else if (selectedHostCard === pos) {
      setSelectedHostCard(null);
      setTempRevealedPos([]);
    } else {
      const posA = selectedHostCard;
      const posB = pos;
      setSelectedHostCard(null);
      processPairAttempt(posA, posB, {
        id: 'host-player',
        name: 'المقدم 🎙️',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'
      });
    }
  };

  // ══════════════════════════════════════════════════════════════
  // 8. HOST CONTROL ACTIONS
  // ══════════════════════════════════════════════════════════════
  const handleStartGame = () => {
    startNewRound(1, config.category, config.memorizeDurationSec);
  };

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleSkipRound = () => {
    startNewRound(roundNumber + 1, config.category, config.memorizeDurationSec);
  };

  const handleStopGame = () => {
    const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
    const crowned = sorted[0] || {
      playerId: 'none',
      displayName: 'لا يوجد فائز',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
      roundScore: 0,
      totalScore: 0,
      pairsFound: 0
    };
    setWinner(crowned);
    setPhase('GAME_OVER');
    if (!isMuted) soundFX.play('winner_announcement', 1.0);
    triggerVisualEffect('confetti');
    if (onGameEnd) onGameEnd(crowned);
  };

  const handleResetToLobby = () => {
    setPhase('IDLE');
    setRoundNumber(1);
    setCards([]);
    setPlayers([]);
    setWinner(null);
  };

  // Sorted Leaderboard
  const sortedLeaderboard = [...players].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="w-full h-full min-h-screen bg-[#070913] text-white flex flex-col justify-between select-none relative overflow-hidden font-sans">
      
      {/* ── BACKGROUND LIGHTING AMBIENCE ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/15 blur-[120px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════
          1. BROADCAST TOP HUD (9:16 SAFE BAR)
      ══════════════════════════════════════════════════════════════ */}
      <header className="relative z-20 w-full px-4 sm:px-6 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-xl flex items-center justify-between">
        
        {/* Left: Round info & status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/40 text-xs font-black font-mono shadow-md flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-yellow-300" />
            <span>الجولة {roundNumber}</span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hidden sm:flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>الفئة: {
              config.category === 'animals' ? 'حيوانات' :
              config.category === 'flags' ? 'أعلام دول' :
              config.category === 'landmarks' ? 'معالم سياحية' :
              config.category === 'food' ? 'مأكولات' :
              config.category === 'drinks' ? 'مشروبات' : 'عشوائي منوع'
            }</span>
          </div>
        </div>

        {/* Center: Stage Status Message */}
        <div className="text-center">
          {phase === 'MEMORIZE' && (
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400 animate-pulse">
                🧠 تذكر أماكن الصور!
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-black font-mono font-black text-sm shadow-[0_0_15px_rgba(245,158,11,0.8)]">
                {countdownSeconds}s
              </span>
            </div>
          )}

          {phase === 'ACTIVE_GAME' && (
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300">
                🎯 اكتب رقمين في الشات (مثال: <span className="text-yellow-300 font-mono">1-3</span>)
              </span>
            </div>
          )}

          {phase === 'ROUND_COMPLETE' && (
            <span className="text-sm sm:text-base font-black text-emerald-400 animate-bounce">
              🎉 كفووو! تم كشف جميع الأزواج بنجاح!
            </span>
          )}

          {phase === 'RESULTS' && (
            <span className="text-sm sm:text-base font-black text-amber-300">
              📊 نتائج الجولة • الجولة القادمة خلال ({resultsCountdown}s)
            </span>
          )}

          {phase === 'IDLE' && (
            <span className="text-xs sm:text-sm font-bold text-slate-400">
              🎮 لوحة تحكم المقدم جاهزة لبدء الجولة
            </span>
          )}
        </div>

        {/* Right: Pairs tracker & audio toggle */}
        <div className="flex items-center gap-2">
          {phase === 'ACTIVE_GAME' && (
            <div className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-black flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>الأزواج: {pairsFoundCount} / 8</span>
            </div>
          )}

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          2. MAIN ARENA: 16-CARD BROADCAST GRID & LEADERBOARD
      ══════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto p-3 sm:p-5 flex flex-col items-center justify-center gap-4">
        
        {/* LOBBY / IDLE CONFIGURATION DESK */}
        {phase === 'IDLE' && (
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-purple-500/40 shadow-[0_0_60px_rgba(168,85,247,0.25)] backdrop-blur-2xl flex flex-col gap-6 text-center animate-in zoom-in-95">
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-xl flex items-center justify-center">
                <Brain className="w-9 h-9 text-yellow-300" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-yellow-200 to-amber-400">
                لعبة الذاكرة التفاعلية — MEMORY MATCH LIVE 🧠
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                16 بطاقة و8 أزواج صور. يشارك مئات المشاهدين في نفس اللحظة عبر الشات بكتابة رقمين (مثال: 1-3) لكسب النقاط!
              </p>
            </div>

            {/* 1. Memorize Duration Setting */}
            <div className="flex flex-col items-start gap-2 text-right w-full">
              <span className="text-xs font-mono font-bold text-amber-300">⏱️ مدة كشف الصور للمشاهدين:</span>
              <div className="grid grid-cols-4 gap-2 w-full">
                {([5, 10, 15, 20] as const).map(sec => (
                  <button
                    key={sec}
                    onClick={() => setConfig(prev => ({ ...prev, memorizeDurationSec: sec }))}
                    className={`py-2.5 rounded-xl font-mono font-bold text-sm transition-all border ${
                      config.memorizeDurationSec === sec
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {sec} ثوانٍ {sec === 5 && '⚡'}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Category Selection Setting */}
            <div className="flex flex-col items-start gap-2 text-right w-full">
              <span className="text-xs font-mono font-bold text-cyan-300">🖼️ فئة الصور:</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full">
                {([
                  { id: 'random', label: 'عشوائي' },
                  { id: 'animals', label: 'حيوانات' },
                  { id: 'flags', label: 'أعلام' },
                  { id: 'landmarks', label: 'معالم' },
                  { id: 'food', label: 'مأكولات' },
                  { id: 'drinks', label: 'مشروبات' }
                ] as const).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setConfig(prev => ({ ...prev, category: cat.id }))}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                      config.category === cat.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStartGame}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-black font-black text-base shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>بدء جولة الذاكرة المباشرة 🚀</span>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            3. THE 16 3D FLIP CARDS GRID (4x4 BROADCAST LAYOUT)
        ══════════════════════════════════════════════════════════════ */}
        {(phase === 'MEMORIZE' || phase === 'ACTIVE_GAME' || phase === 'ROUND_COMPLETE') && (
          <div className="w-full flex flex-col items-center gap-3">
            
            {/* Match Toast Floating Notice */}
            {latestMatchNotice && (
              <div className="absolute top-14 z-40 px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 border-2 border-emerald-300 text-white font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.9)] flex items-center gap-3 animate-in slide-in-from-top-4">
                <img src={latestMatchNotice.avatarUrl} alt="" className="w-7 h-7 rounded-full border border-white" />
                <span>🎯 كفو <b className="text-yellow-300">{latestMatchNotice.playerName}</b> كشف زوج ({latestMatchNotice.cardTitle}) وحصل على +2 نقطة!</span>
              </div>
            )}

            {/* Hype Tension Banner: 1 PAIR REMAINING! */}
            {phase === 'ACTIVE_GAME' && pairsFoundCount === 7 && (
              <div className="w-full max-w-md py-2 px-4 rounded-xl bg-gradient-to-r from-[#DC2626] via-[#F59E0B] to-[#DC2626] border border-amber-300 text-white font-mono font-black text-xs text-center uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.7)] animate-pulse flex items-center justify-center gap-2">
                <span>🔥</span>
                <span>بقي زوج أخير فقط! من الأسرع في حسم النقطتين؟ • 01 PAIR LEFT</span>
                <span>🔥</span>
              </div>
            )}

            {/* 4x4 Grid Container */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-2xl aspect-square p-2.5 rounded-3xl bg-[#08090C] border border-[#232736] shadow-2xl">
              {cards.map((card) => {
                const isTempRevealed = tempRevealedPos.includes(card.position);
                const isMissed = missedPair?.posA === card.position || missedPair?.posB === card.position;
                const isRevealed = phase === 'MEMORIZE' || card.isMatched || isTempRevealed;
                const isSelectedByHost = selectedHostCard === card.position;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleHostCardClick(card.position)}
                    className="relative w-full h-full cursor-pointer select-none [perspective:1000px]"
                  >
                    <div
                      className={`relative w-full h-full rounded-2xl sm:rounded-3xl transition-transform duration-500 [transform-style:preserve-3d] ${
                        isRevealed ? '[transform:rotateY(180deg)]' : ''
                      }`}
                    >
                      {/* ── CARD BACK (HIDDEN STATE: SHOWS LARGE BOLD NUMBER) ── */}
                      <div className={`absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl [backface-visibility:hidden] flex flex-col items-center justify-center p-2 border-2 transition-all duration-200 ${
                        isSelectedByHost
                          ? 'bg-amber-500/30 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.8)] scale-105'
                          : 'bg-gradient-to-br from-slate-900 via-[#131627] to-[#0A0D18] border-white/15 hover:border-amber-400/60 shadow-lg'
                      }`}>
                        {/* Number in Center */}
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center shadow-inner">
                          <span className="text-xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-500 drop-shadow">
                            {String(card.position).padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* ── CARD FRONT (REVEALED STATE: BROADCAST GRADE IMAGE & TITLE) ── */}
                      <div className={`absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden border-2 flex flex-col items-center justify-between p-1 sm:p-1.5 transition-all ${
                        card.isMatched
                          ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.6)]'
                          : isMissed
                          ? 'bg-rose-950/80 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.7)] animate-shake'
                          : 'bg-slate-900 border-yellow-400/80 shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                      }`}>
                        {/* Large Centered Image Container */}
                        <div className="relative w-full flex-1 rounded-xl sm:rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center">
                          <img
                            src={card.imageUrl}
                            alt={card.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                          />

                          {/* Matched Player Badge Overlay */}
                          {card.isMatched && card.matchedBy && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-1 text-center animate-in zoom-in-75">
                              <img
                                src={card.matchedBy.avatarUrl}
                                alt={card.matchedBy.displayName}
                                className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-emerald-400 object-cover shadow-lg"
                              />
                              <span className="text-[10px] sm:text-xs font-black text-emerald-300 truncate max-w-full mt-0.5">
                                {card.matchedBy.displayName}
                              </span>
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-mono font-black text-[9px] sm:text-[10px] shadow">
                                +2
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title Bar at bottom */}
                        <div className="w-full py-0.5 text-center truncate">
                          <span className="text-[10px] sm:text-xs font-extrabold text-white drop-shadow">
                            {card.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            4. RESULTS SCREEN (10-SECOND RECAP & LEADERBOARD + SMART QR)
        ══════════════════════════════════════════════════════════════ */}
        {phase === 'RESULTS' && (
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0F1117] border border-[#D6A84F]/60 shadow-[0_0_80px_rgba(214,168,79,0.2)] flex flex-col items-center gap-4 text-center animate-in zoom-in-95 select-none">
            
            <div className="flex items-center gap-2 text-[#D6A84F] font-mono font-black text-xs uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-[#D6A84F]" />
              <span>ROUND {roundNumber} SUMMARY • ملخص الجولة</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
              الصدارة الحالية في اللعبة 🏆
            </h3>

            {/* Top Players Table */}
            <div className="w-full flex flex-col gap-2 max-h-48 overflow-y-auto">
              {sortedLeaderboard.slice(0, 5).map((player, idx) => (
                <div
                  key={player.playerId}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    idx === 0
                      ? 'bg-[#D6A84F]/15 border-[#D6A84F]/60 shadow-[0_0_15px_rgba(214,168,79,0.15)]'
                      : 'bg-[#12141C] border-[#1F2433]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 font-mono font-black text-sm text-[#D6A84F]">#{idx + 1}</span>
                    <img src={player.avatarUrl} alt="" className="w-7 h-7 rounded-full border border-white/20 object-cover" />
                    <span className="font-bold text-xs text-white truncate max-w-[130px]">{player.displayName}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[11px] text-slate-400">{player.pairsFound} أزواج</span>
                    <span className="text-sm font-black text-[#D6A84F]">+{player.totalScore}★</span>
                  </div>
                </div>
              ))}

              {sortedLeaderboard.length === 0 && (
                <p className="text-xs text-slate-400 py-3">لم يتم تسجيل نقاط في هذه الجولة</p>
              )}
            </div>

            {/* SMART BROADCAST QR EMBED (Clean Post-Round Moment) */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#08090C] border border-[#D6A84F]/40 w-full">
              <div className="w-14 h-14 bg-white p-1 rounded-xl shrink-0 shadow-lg">
                <img src="/donation-qr.png" alt="QR" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white">شكراً لدعمكم للبث المباشر 💎</span>
                <span className="text-[10px] text-[#D6A84F] font-semibold">امسح كود QR للمساهمة في استمرار الفعاليات</span>
              </div>
            </div>

            {/* Visual Auto-Next Round Progress Bar */}
            <div className="w-full flex flex-col gap-1.5 mt-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>الجولة التالية تبدأ تلقائياً...</span>
                <span className="text-[#D6A84F] font-bold">{resultsCountdown}s</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D6A84F] to-[#E5BE6C] transition-all duration-1000"
                  style={{ width: `${(resultsCountdown / config.resultsDurationSec) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            5. FINAL GAME OVER & CORONATION SCREEN
        ══════════════════════════════════════════════════════════════ */}
        {phase === 'GAME_OVER' && winner && (
          <div className="w-full max-w-lg p-8 rounded-3xl bg-[#0F1117] border border-[#D6A84F] shadow-[0_0_100px_rgba(214,168,79,0.3)] flex flex-col items-center gap-5 text-center animate-in zoom-in-95 select-none">
            <div className="relative">
              <img src={winner.avatarUrl} alt="" className="w-24 h-24 rounded-full border-4 border-[#D6A84F] object-cover shadow-2xl" />
              <div className="absolute -top-3 -right-2 text-3xl animate-bounce">👑</div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#D6A84F] uppercase tracking-widest">
                GRAND CHAMPION • بطل مسابقة الذاكرة
              </span>
              <h2 className="font-display text-3xl font-black text-white">
                {winner.displayName}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full font-mono text-sm">
              <div className="p-3 rounded-2xl bg-[#12141C] border border-[#1F2433] flex flex-col items-center">
                <span className="text-slate-400 text-xs">الأزواج المكتشفة</span>
                <span className="text-xl font-black text-cyan-300">{winner.pairsFound}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#12141C] border border-[#1F2433] flex flex-col items-center">
                <span className="text-slate-400 text-xs">إجمالي النقاط</span>
                <span className="text-xl font-black text-[#D6A84F]">+{winner.totalScore}★</span>
              </div>
            </div>

            {/* Smart QR on Grand Champion Screen */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#08090C] border border-[#D6A84F]/40 w-full">
              <div className="w-14 h-14 bg-white p-1 rounded-xl shrink-0 shadow-lg">
                <img src="/donation-qr.png" alt="QR" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white">شكراً لمتابعتكم العرض 💎</span>
                <span className="text-[10px] text-[#D6A84F] font-semibold">ادعم استمرار جوائز البث المباشر</span>
              </div>
            </div>

            <button
              onClick={handleResetToLobby}
              className="mt-2 px-8 py-3.5 rounded-2xl gold-cta-button text-sm cursor-pointer"
            >
              بدء مسابقة جديدة 🔄
            </button>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════
          6. BROADCAST BOTTOM HUD & HOST CONTROLS DESK
      ══════════════════════════════════════════════════════════════ */}
      <footer className="relative z-20 w-full px-4 sm:px-6 py-3 bg-black/70 border-t border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Top 4 Mini Leaderboard Stream */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">المتصدرون:</span>
          {sortedLeaderboard.slice(0, 4).map((p, idx) => (
            <div key={p.playerId} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono shrink-0">
              <span className="text-amber-400 font-bold">#{idx + 1}</span>
              <img src={p.avatarUrl} alt="" className="w-4 h-4 rounded-full" />
              <span className="text-white font-bold truncate max-w-[80px]">{p.displayName}</span>
              <span className="text-yellow-300 font-black">{p.totalScore}</span>
            </div>
          ))}
          {sortedLeaderboard.length === 0 && (
            <span className="text-[11px] text-slate-500">في انتظار أول محاولة صحيحة...</span>
          )}
        </div>

        {/* Right: Host Action Controls */}
        <div className="flex items-center gap-2">
          {phase !== 'IDLE' && phase !== 'GAME_OVER' && (
            <>
              <button
                onClick={handleTogglePause}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold flex items-center gap-1.5 transition"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isPaused ? 'استئناف' : 'إيقاف مؤقت'}</span>
              </button>

              <button
                onClick={handleSkipRound}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <SkipForward className="w-3.5 h-3.5 text-cyan-400" />
                <span>تخطي الجولة</span>
              </button>

              <button
                onClick={handleStopGame}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Square className="w-3.5 h-3.5 fill-rose-300" />
                <span>إنهاء اللعبة</span>
              </button>
            </>
          )}

          {phase === 'IDLE' && (
            <button
              onClick={handleStartGame}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>بدء اللعبة</span>
            </button>
          )}
        </div>
      </footer>

      {/* PAUSE OVERLAY BANNER */}
      {isPaused && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-amber-400 text-center flex flex-col items-center gap-3 shadow-2xl">
            <Pause className="w-12 h-12 text-amber-400 animate-pulse" />
            <h2 className="text-2xl font-black text-white">GAME PAUSED • تم إيقاف اللعبة مؤقتاً</h2>
            <p className="text-xs text-slate-300">تم إيقاف العداد والمحاولات مؤقتاً بواسطة المقدم</p>
            <button
              onClick={handleTogglePause}
              className="mt-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-sm hover:scale-105 transition"
            >
              استئناف اللعب ▶️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
