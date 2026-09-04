'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ReactPlayer,
  ReactQuestion,
  ReactConfig,
  ReactPrompt,
  NumberDigitType
} from '@aep/types';
import {
  generate5NumberGuessPrompts,
  generateSecretNumber,
  parseNumberGuessComment,
  generateMockReactPlayers,
  generateReactQuestion
} from '@aep/game-engines';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { tiktokEngine } from '@aep/tiktok-live';
import { useStudioStore } from '../../store/useStudioStore';
import {
  Binary,
  Flame,
  Heart,
  Trophy,
  Users,
  HelpCircle,
  Play,
  RotateCcw,
  Settings,
  X,
  CheckCircle2,
  AlertTriangle,
  Skull,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  Crown,
  ChevronRight,
  Eye,
  Shield,
  Layers,
  Hash,
  ArrowUp,
  ArrowDown,
  UserPlus,
  Zap,
  Lock,
  Unlock,
  Radio,
  Sparkle,
  Infinity as InfinityIcon
} from 'lucide-react';

export type AttemptsMode = '10_HEARTS' | 'UNLIMITED';
const MAX_HEARTS_DEFAULT = 10;

interface GuessLog {
  id: string;
  questionNumber: number;
  playerId: string;
  playerName: string;
  avatarUrl: string;
  guessedNumber: number;
  secretNumber: number;
  isCorrect: boolean;
  hintDirection?: 'HIGHER' | 'LOWER';
  unlockedPositionIndex?: number;
  unlockedDigit?: string;
  heartsRemaining: number;
  isOutOfHearts: boolean;
  receivedAt: number;
}

interface ReactGameViewProps {
  question?: ReactQuestion;
  onUpdateQuestion?: (updated: ReactQuestion) => void;
  onGameEnd?: (winner: ReactPlayer) => void;
  isHost?: boolean;
}

export const ReactGameView: React.FC<ReactGameViewProps> = ({
  question: propQuestion,
  onUpdateQuestion,
  onGameEnd,
  isHost = true
}) => {
  // ─────────────────────────────────────────────────────────────
  // 1. SESSION & PROMPT SEQUENCER (5 Questions Untimed)
  // ─────────────────────────────────────────────────────────────
  const usedNumbersRef = useRef<Set<number>>(new Set());

  const [fivePrompts, setFivePrompts] = useState<ReactPrompt[]>(() => {
    const prompts = generate5NumberGuessPrompts();
    prompts.forEach(p => {
      if (p.secretNumber) usedNumbersRef.current.add(p.secretNumber);
    });
    return prompts;
  });

  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const currentPrompt = fivePrompts[currentPromptIndex] || fivePrompts[0];

  const [phase, setPhase] = useState<ReactQuestion['phase']>('INSTRUCTIONS');
  
  // 🎯 ATTEMPTS MODE: '10_HEARTS' (10 قلوب في كل سؤال) or 'UNLIMITED' (محاولات لا محدودة)
  const [attemptsMode, setAttemptsMode] = useState<AttemptsMode>('10_HEARTS');
  const attemptsModeRef = useRef<AttemptsMode>(attemptsMode);
  attemptsModeRef.current = attemptsMode;

  // Synchronous Map holds live player states atomically
  const [players, setPlayers] = useState<ReactPlayer[]>([]);
  const playersMapRef = useRef<Map<string, ReactPlayer>>(new Map());

  const [winner, setWinner] = useState<ReactPlayer | undefined>(undefined);
  const [roundWinner, setRoundWinner] = useState<{ player: ReactPlayer; guessedNumber: number } | null>(null);

  // Positional Digit Reveal State: Record<slotIndex, digitChar>
  const [revealedPositions, setRevealedPositions] = useState<Record<number, string>>({});
  const revealedPositionsRef = useRef<Record<number, string>>({});
  revealedPositionsRef.current = revealedPositions;

  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [guessLogs, setGuessLogs] = useState<GuessLog[]>([]);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  const phaseRef = useRef<ReactQuestion['phase']>(phase);
  phaseRef.current = phase;
  const currentPromptRef = useRef<ReactPrompt>(currentPrompt);
  currentPromptRef.current = currentPrompt;
  const processedCommentIds = useRef<Set<string>>(new Set());

  const { liveComments } = useStudioStore();

  // On mount: Claim 'react' engine mode on tiktokEngine so generic quiz scoring is silenced
  useEffect(() => {
    setHasMounted(true);
    // Ignore old historical comments from before page load
    liveComments.forEach(c => {
      if (c && c.id) processedCommentIds.current.add(c.id);
    });

    if (tiktokEngine) {
      tiktokEngine.setActiveQuestion('تخمين الأرقام', [], 150, 'react');
    }
  }, []);

  // Synchronize React UI state from synchronous Map
  const syncPlayersFromMap = useCallback(() => {
    setPlayers(Array.from(playersMapRef.current.values()));
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2. ATOMIC PLAYER REGISTRATION (Any viewer enters anytime!)
  // ─────────────────────────────────────────────────────────────
  const getOrCreatePlayer = useCallback((comment: any): ReactPlayer | null => {
    if (!comment) return null;
    const uid = String(comment.userId || comment.username || '').toLowerCase().trim();
    if (!uid) return null;

    let player = playersMapRef.current.get(uid);

    if (!player) {
      const cleanUser = String(comment.username || '').replace('@', '').toLowerCase();
      for (const p of playersMapRef.current.values()) {
        if (p.tiktokUserId === uid || (cleanUser && p.tiktokUsername.toLowerCase().replace('@', '') === cleanUser)) {
          player = p;
          break;
        }
      }
    }

    if (!player) {
      const cleanUsername = (comment.username || uid).replace('@', '');
      player = {
        id: `tt-${uid}-${Date.now()}`,
        tiktokUserId: uid,
        tiktokUsername: `@${cleanUsername}`,
        displayName: comment.displayName || comment.username || `مشارك ${playersMapRef.current.size + 1}`,
        avatarUrl: comment.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(uid)}`,
        score: 0,
        hearts: MAX_HEARTS_DEFAULT, // 10 Hearts default
        isEliminated: false,
        combo: 0,
        maxCombo: 0,
        totalCorrect: 0,
        totalWrong: 0,
        fastestReactionMs: 9999
      };
      playersMapRef.current.set(uid, player);
      syncPlayersFromMap();
    }

    return player;
  }, [syncPlayersFromMap]);

  // ─────────────────────────────────────────────────────────────
  // 3. START ROUND / QUESTION (Reset hearts if 10_HEARTS mode)
  // ─────────────────────────────────────────────────────────────
  const handleStartQuestion = useCallback((index: number) => {
    const prompt = fivePrompts[index];
    if (!prompt) return;

    setCurrentPromptIndex(index);
    setIsAnswerRevealed(false);
    setRevealedPositions({});
    revealedPositionsRef.current = {};
    setRoundWinner(null);
    setPhase('ROUND_ACTIVE');
    processedCommentIds.current.clear();

    // Silently mark react mode on tiktokEngine
    if (tiktokEngine) {
      tiktokEngine.setActiveQuestion('تخمين الأرقام', [], prompt.points || 150, 'react');
    }

    // Reset ALL current players' hearts back to 10 for each new question
    for (const [key, p] of playersMapRef.current.entries()) {
      playersMapRef.current.set(key, {
        ...p,
        hearts: MAX_HEARTS_DEFAULT,
        isEliminated: false,
        lastAnswerStatus: undefined,
        lastGuess: undefined,
        lastGuessDiff: undefined
      });
    }
    syncPlayersFromMap();

    soundFX.play('round_start');
  }, [fivePrompts, syncPlayersFromMap]);

  // ─────────────────────────────────────────────────────────────
  // 4. ATOMIC GUESS PROCESSING (Strict Number Match & Selected Mode)
  // ─────────────────────────────────────────────────────────────
  const processNumberGuess = useCallback((comment: any) => {
    if (!comment) return;

    const rawCommentText = (comment.comment || comment.commentText || '').trim();
    const commentId = comment.id || `${comment.userId || comment.username}_${rawCommentText}_${Math.floor((comment.timestamp || Date.now()) / 400)}`;

    if (processedCommentIds.current.has(commentId)) return;
    processedCommentIds.current.add(commentId);

    // 🌟 Instant Entry: Register ANY viewer commenting in the live stream immediately!
    const player = getOrCreatePlayer(comment);
    if (!player) return;

    // If round is not active, user is now registered and visible, nothing else to do
    if (phaseRef.current !== 'ROUND_ACTIVE') {
      return;
    }

    // Strict number parser (only evaluates if real digits/numbers are present)
    const guessedNum = parseNumberGuessComment(rawCommentText);
    if (guessedNum === null) {
      // General chat comment: Player registered, no penalty
      return;
    }

    const uid = player.tiktokUserId || player.id;
    const livePlayer = playersMapRef.current.get(uid) || player;

    // ⛔ RULE: In 10_HEARTS mode, if player has 0 hearts, REJECT guess immediately!
    const isLimitedMode = attemptsModeRef.current === '10_HEARTS';

    if (isLimitedMode && (livePlayer.hearts <= 0 || livePlayer.isEliminated)) {
      setGuessLogs(prev => [
        {
          id: `log-${Date.now()}-${Math.random()}`,
          questionNumber: currentPromptRef.current.roundNumber,
          playerId: livePlayer.id,
          playerName: livePlayer.displayName,
          avatarUrl: livePlayer.avatarUrl,
          guessedNumber: guessedNum,
          secretNumber: currentPromptRef.current.secretNumber || 0,
          isCorrect: false,
          heartsRemaining: 0,
          isOutOfHearts: true,
          receivedAt: Date.now()
        },
        ...prev.slice(0, 24)
      ]);
      return;
    }

    const secretNum = currentPromptRef.current.secretNumber;
    if (typeof secretNum !== 'number') return;

    const isCorrect = (guessedNum === secretNum);
    const pointsAwarded = currentPromptRef.current.points || 150;
    const secretStr = String(secretNum);
    const guessedStr = String(guessedNum);

    // 🎯 Positional Matching: ONLY compare slot by slot if lengths match and guess is NOT whole correct answer
    // ⛔ RULE: Maximum partial reveals is (digitsCount - 1). The last remaining digit is NEVER revealed until full correct answer!
    let unlockedPositionIndex: number | undefined = undefined;
    let unlockedDigit: string | undefined = undefined;
    let hasNewlyUnlockedSlot = false;
    const nextPositions = { ...revealedPositionsRef.current };

    if (!isCorrect && guessedStr.length === secretStr.length) {
      for (let i = 0; i < secretStr.length; i++) {
        if (guessedStr[i] === secretStr[i] && nextPositions[i] === undefined) {
          const currentRevealedCount = Object.keys(nextPositions).length;
          if (currentRevealedCount < secretStr.length - 1) {
            nextPositions[i] = secretStr[i];
            unlockedPositionIndex = i;
            unlockedDigit = secretStr[i];
            hasNewlyUnlockedSlot = true;
          }
        }
      }
    }

    if (hasNewlyUnlockedSlot) {
      revealedPositionsRef.current = nextPositions;
      setRevealedPositions(nextPositions);
      soundFX.play('digit_reveal');
      triggerVisualEffect('sparkles');
    }

    if (isCorrect) {
      // 🎉 WINNER OF THIS QUESTION!
      const winningPlayer: ReactPlayer = {
        ...livePlayer,
        score: livePlayer.score + pointsAwarded,
        totalCorrect: livePlayer.totalCorrect + 1,
        combo: livePlayer.combo + 1,
        maxCombo: Math.max(livePlayer.maxCombo, livePlayer.combo + 1),
        lastAnswerStatus: 'CORRECT',
        lastGuess: guessedNum
      };

      playersMapRef.current.set(uid, winningPlayer);
      syncPlayersFromMap();

      setRoundWinner({ player: winningPlayer, guessedNumber: guessedNum });
      setIsAnswerRevealed(true);
      setPhase('ROUND_RECAP');

      // Log success
      setGuessLogs(prev => [
        {
          id: `log-${Date.now()}-${Math.random()}`,
          questionNumber: currentPromptRef.current.roundNumber,
          playerId: winningPlayer.id,
          playerName: winningPlayer.displayName,
          avatarUrl: winningPlayer.avatarUrl,
          guessedNumber: guessedNum,
          secretNumber: secretNum,
          isCorrect: true,
          heartsRemaining: isLimitedMode ? winningPlayer.hearts : 999,
          isOutOfHearts: false,
          receivedAt: Date.now()
        },
        ...prev.slice(0, 24)
      ]);

      soundFX.play('correct_answer');
      triggerVisualEffect('confetti');
    } else {
      // ❌ WRONG GUESS
      const hintDir = guessedNum < secretNum ? 'HIGHER' : 'LOWER';

      if (isLimitedMode) {
        // DEDUCT 1 HEART (from 10 max)
        const newHearts = Math.max(0, livePlayer.hearts - 1);
        const isNowOut = newHearts <= 0;

        const updatedPlayer: ReactPlayer = {
          ...livePlayer,
          hearts: newHearts,
          isEliminated: isNowOut,
          combo: 0,
          totalWrong: livePlayer.totalWrong + 1,
          lastAnswerStatus: isNowOut ? 'OUT_OF_HEARTS' : 'WRONG',
          lastGuess: guessedNum,
          lastGuessDiff: hintDir
        };

        playersMapRef.current.set(uid, updatedPlayer);
        syncPlayersFromMap();

        setGuessLogs(prev => [
          {
            id: `log-${Date.now()}-${Math.random()}`,
            questionNumber: currentPromptRef.current.roundNumber,
            playerId: updatedPlayer.id,
            playerName: updatedPlayer.displayName,
            avatarUrl: updatedPlayer.avatarUrl,
            guessedNumber: guessedNum,
            secretNumber: secretNum,
            isCorrect: false,
            hintDirection: hintDir,
            unlockedPositionIndex,
            unlockedDigit,
            heartsRemaining: newHearts,
            isOutOfHearts: isNowOut,
            receivedAt: Date.now()
          },
          ...prev.slice(0, 24)
        ]);
      } else {
        // UNLIMITED ATTEMPTS MODE (لا محدود ∞)
        const updatedPlayer: ReactPlayer = {
          ...livePlayer,
          combo: 0,
          totalWrong: livePlayer.totalWrong + 1,
          lastAnswerStatus: 'WRONG',
          lastGuess: guessedNum,
          lastGuessDiff: hintDir
        };

        playersMapRef.current.set(uid, updatedPlayer);
        syncPlayersFromMap();

        setGuessLogs(prev => [
          {
            id: `log-${Date.now()}-${Math.random()}`,
            questionNumber: currentPromptRef.current.roundNumber,
            playerId: updatedPlayer.id,
            playerName: updatedPlayer.displayName,
            avatarUrl: updatedPlayer.avatarUrl,
            guessedNumber: guessedNum,
            secretNumber: secretNum,
            isCorrect: false,
            hintDirection: hintDir,
            unlockedPositionIndex,
            unlockedDigit,
            heartsRemaining: 999,
            isOutOfHearts: false,
            receivedAt: Date.now()
          },
          ...prev.slice(0, 24)
        ]);
      }

      soundFX.play('wrong_answer');
    }
  }, [getOrCreatePlayer, syncPlayersFromMap]);

  // ─────────────────────────────────────────────────────────────
  // 5. LIVE COMMENT LISTENERS (Direct Stream & Store Sync)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    liveComments.forEach(c => {
      const cId = c.id || `${c.userId}_${c.comment}_${c.timestamp}`;
      if (!processedCommentIds.current.has(cId)) {
        processNumberGuess(c);
      }
    });

    if (tiktokEngine) {
      const handleEngineComment = (c: any) => processNumberGuess(c);
      tiktokEngine.onComment(handleEngineComment);
      return () => tiktokEngine.offComment(handleEngineComment);
    }
  }, [liveComments, processNumberGuess]);

  // ─────────────────────────────────────────────────────────────
  // 6. NEXT QUESTION OR GAME OVER (5 Questions Total)
  // ─────────────────────────────────────────────────────────────
  const handleNextQuestion = () => {
    if (currentPromptIndex + 1 < fivePrompts.length) {
      handleStartQuestion(currentPromptIndex + 1);
    } else {
      // Finished all 5 questions -> Announce Winner Podium!
      const sorted = Array.from(playersMapRef.current.values()).sort((a, b) => b.score - a.score);
      const finalWinner = sorted[0];
      setWinner(finalWinner);
      setPhase('GAME_OVER');
      soundFX.play('winner_announcement');
      triggerVisualEffect('confetti');
      if (onGameEnd && finalWinner) {
        onGameEnd(finalWinner);
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 7. START BRAND NEW 5-QUESTION MATCH (Clean Reset)
  // ─────────────────────────────────────────────────────────────
  const handleRestartNewMatch = () => {
    const newPrompts = generate5NumberGuessPrompts(usedNumbersRef.current);
    newPrompts.forEach(p => {
      if (p.secretNumber) usedNumbersRef.current.add(p.secretNumber);
    });

    setFivePrompts(newPrompts);
    setCurrentPromptIndex(0);
    setPhase('INSTRUCTIONS');
    setWinner(undefined);
    setRoundWinner(null);
    setIsAnswerRevealed(false);
    setRevealedPositions({});
    revealedPositionsRef.current = {};
    setGuessLogs([]);
    processedCommentIds.current.clear();

    // Reset player scores and 10 hearts
    for (const [key, p] of playersMapRef.current.entries()) {
      playersMapRef.current.set(key, {
        ...p,
        score: 0,
        hearts: MAX_HEARTS_DEFAULT,
        isEliminated: false,
        combo: 0,
        totalCorrect: 0,
        totalWrong: 0,
        lastAnswerStatus: undefined,
        lastGuess: undefined,
        lastGuessDiff: undefined
      });
    }
    syncPlayersFromMap();

    soundFX.play('round_start');
  };

  // ─────────────────────────────────────────────────────────────
  // 8. TESTING HELPERS (Mock Guesses)
  // ─────────────────────────────────────────────────────────────
  const handleSimulateMockGuess = () => {
    if (phase !== 'ROUND_ACTIVE' || playersMapRef.current.size === 0) return;
    const isLimited = attemptsModeRef.current === '10_HEARTS';
    const activePlayers = Array.from(playersMapRef.current.values()).filter(p => !isLimited || p.hearts > 0);
    if (activePlayers.length === 0) return;

    const randomPlayer = activePlayers[Math.floor(Math.random() * activePlayers.length)];
    const sec = currentPrompt.secretNumber || 50;
    const isLuckyWin = Math.random() < 0.25;

    let guessed = isLuckyWin
      ? sec
      : Math.floor(Math.random() * ((currentPrompt.maxNumber || 99) - (currentPrompt.minNumber || 10) + 1)) + (currentPrompt.minNumber || 10);

    processNumberGuess({
      id: `mock-guess-${Date.now()}-${Math.random()}`,
      userId: randomPlayer.tiktokUserId || randomPlayer.id,
      username: randomPlayer.tiktokUsername,
      displayName: randomPlayer.displayName,
      avatarUrl: randomPlayer.avatarUrl,
      comment: String(guessed),
      timestamp: Date.now()
    });
  };

  const handleAddMockPlayers = (count = 5) => {
    const newMocks = generateMockReactPlayers(playersMapRef.current.size + count).slice(playersMapRef.current.size);
    newMocks.forEach(m => {
      m.hearts = MAX_HEARTS_DEFAULT;
      playersMapRef.current.set(m.tiktokUserId, m);
    });
    syncPlayersFromMap();
    soundFX.play('score_update');
  };

  if (!hasMounted) return null;

  // ─────────────────────────────────────────────────────────────
  // 9. RENDER SCREEN: 1. INSTRUCTIONS & LOBBY (Viewport Fitted)
  // ─────────────────────────────────────────────────────────────
  if (phase === 'INSTRUCTIONS') {
    return (
      <div className="w-full h-full max-h-full overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 text-center max-w-4xl mx-auto animate-in zoom-in-95 select-none" dir="rtl">
        {/* Top Floating Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-bounce mb-2.5 shrink-0">
          <Binary className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Live Broadcast Open Participation Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(16,185,129,0.25)] mb-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>الدخول مفتوح وتلقائي لجميع مشاهدي البث 🔴 (اكتب أي رقم أو تعليق للمشاركة في أي وقت!)</span>
        </div>

        {/* Game Title Clean Arabic / English Rows */}
        <div className="flex flex-col items-center gap-0.5 mb-2.5 shrink-0">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            تخمين الأرقام
          </h1>
          <span className="text-sm sm:text-base font-extrabold text-amber-400 font-mono tracking-widest uppercase">
            GUESS THE NUMBER 🔢
          </span>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mt-1">
            الرقم السري مخفي في الخانات... اكتب رقمك في الشات مباشرة! عند إصابة أي خانة صحيحة تفتح فوراً للجميع 🔓.
          </p>
        </div>

        {/* 🎛️ HOST ATTEMPTS MODE SELECTOR (10 Hearts vs Unlimited) */}
        <div className="flex items-center justify-center gap-2.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 mb-3 shrink-0">
          <span className="text-xs font-black text-slate-300 px-2">نظام المحاولات:</span>
          
          <button
            onClick={() => {
              setAttemptsMode('10_HEARTS');
              soundFX.play('score_update');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              attemptsMode === '10_HEARTS'
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] scale-105'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>10 قلوب لكل لاعب في كل سؤال</span>
          </button>

          <button
            onClick={() => {
              setAttemptsMode('UNLIMITED');
              soundFX.play('score_update');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              attemptsMode === 'UNLIMITED'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-105'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <InfinityIcon className="w-4 h-4 stroke-[2.5]" />
            <span>محاولات لا محدودة (مفتوح للجميع)</span>
          </button>
        </div>

        {/* 4 Digit Modes Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-2xl text-xs font-bold mb-3 shrink-0">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-1">
            <span className="text-amber-400 font-mono text-lg font-black">1 الخانة</span>
            <span className="text-white font-bold">أحادي (1 - 9)</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-1">
            <span className="text-cyan-400 font-mono text-lg font-black">2 خانتان</span>
            <span className="text-white font-bold">ثنائي (10 - 99)</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-1">
            <span className="text-purple-400 font-mono text-lg font-black">3 خانات</span>
            <span className="text-white font-bold">ثلاثي (100 - 999)</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-1">
            <span className="text-emerald-400 font-mono text-lg font-black">4 خانات</span>
            <span className="text-white font-bold">رباعي (1000 - 9999)</span>
          </div>
        </div>

        {/* Live Stream Participants Ribbon */}
        <div className="w-full max-w-2xl p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 mb-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>المشاركون المسجلون حالياً من البث:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-black">{players.length}</span>
          </div>

          {players.length > 0 ? (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs py-0.5">
              {players.slice(0, 8).map(p => (
                <img
                  key={p.id}
                  src={p.avatarUrl}
                  alt={p.displayName}
                  title={p.displayName}
                  className="w-7 h-7 rounded-full border border-amber-400/60 object-cover shadow"
                />
              ))}
              {players.length > 8 && (
                <span className="text-[10px] font-bold text-slate-400 px-1.5">+{players.length - 8}</span>
              )}
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">
              💬 أي تعليق في الشات يسجل المتسابق تلقائياً...
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={() => handleStartQuestion(0)}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-sm sm:text-base flex items-center gap-2.5 shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-105 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>بدء السؤال الأول (1 من 5)</span>
          </button>

          <button
            onClick={() => handleAddMockPlayers(5)}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="للتجربة والاختبار المحلي فقط"
          >
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>إضافة متسابقين تجريبيين (للاختبار)</span>
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 10. RENDER SCREEN: 2. GAME OVER & WINNER PODIUM (Viewport Fitted)
  // ─────────────────────────────────────────────────────────────
  if (phase === 'GAME_OVER') {
    const top3 = [...players].sort((a, b) => b.score - a.score).slice(0, 3);
    const champion = top3[0];

    return (
      <div className="w-full h-full max-h-full overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 text-center max-w-4xl mx-auto animate-in zoom-in-95 select-none" dir="rtl">
        <div className="space-y-1.5 mb-4 shrink-0">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-black flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.7)]">
            <Trophy className="w-8 h-8 fill-current animate-bounce" />
          </div>
          <span className="text-xs font-black text-amber-400 font-mono tracking-widest block uppercase">
            CHAMPIONSHIP PODIUM
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            إعلان بطل تحدي تخمين الأرقام! 🏆
          </h2>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 w-full max-w-xl my-3 shrink-0">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="relative">
                <img
                  src={top3[1].avatarUrl}
                  alt={top3[1].displayName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-300 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 text-xl">🥈</span>
              </div>
              <span className="font-extrabold text-white text-xs truncate max-w-[100px]">
                {top3[1].displayName}
              </span>
              <div className="w-full h-20 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700 border-t border-slate-400 flex flex-col items-center justify-center text-slate-200 shadow-lg">
                <span className="text-xs font-black font-mono">{top3[1].score} ★</span>
                <span className="text-[10px] font-bold text-slate-400">المركز الثاني</span>
              </div>
            </div>
          )}

          {/* 1st Place (Champion) */}
          {champion && (
            <div className="flex-1 flex flex-col items-center gap-2 -mt-4">
              <div className="relative">
                <Crown className="w-7 h-7 text-amber-300 absolute -top-6 left-1/2 -translate-x-1/2 animate-pulse" />
                <img
                  src={champion.avatarUrl}
                  alt={champion.displayName}
                  className="w-20 h-20 rounded-full object-cover border-3 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.9)] scale-105"
                />
                <span className="absolute -bottom-2 -right-2 text-2xl">👑</span>
              </div>
              <span className="font-black text-amber-300 text-sm truncate max-w-[120px]">
                {champion.displayName}
              </span>
              <div className="w-full h-28 rounded-t-2xl bg-gradient-to-t from-amber-600 to-yellow-500 border-t-2 border-amber-300 flex flex-col items-center justify-center text-slate-950 shadow-2xl">
                <span className="text-lg font-black font-mono">{champion.score} ★</span>
                <span className="text-[11px] font-black uppercase">البطل الأول 🥇</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="relative">
                <img
                  src={top3[2].avatarUrl}
                  alt={top3[2].displayName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-700 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 text-xl">🥉</span>
              </div>
              <span className="font-extrabold text-white text-xs truncate max-w-[100px]">
                {top3[2].displayName}
              </span>
              <div className="w-full h-16 rounded-t-2xl bg-gradient-to-t from-amber-950 to-amber-900 border-t border-amber-600 flex flex-col items-center justify-center text-amber-200 shadow-lg">
                <span className="text-xs font-black font-mono">{top3[2].score} ★</span>
                <span className="text-[9px] font-bold text-amber-400/80">المركز الثالث</span>
              </div>
            </div>
          )}
        </div>

        {/* Restart Button */}
        <button
          onClick={handleRestartNewMatch}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-[0_0_35px_rgba(245,158,11,0.7)] hover:scale-105 transition-all cursor-pointer shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>🔄 بدء مباراة جديدة (5 أسئلة جديدة غير مكررة)</span>
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 11. RENDER SCREEN: 3. BROADCAST STUDIO ARENA (Strict No-Scroll 16:9)
  // ─────────────────────────────────────────────────────────────
  const secStr = String(currentPrompt.secretNumber || '');
  const digitsCount = currentPrompt.digitsCount || secStr.length || 1;
  const revealedCount = Object.keys(revealedPositions).length;
  const isLimited = attemptsMode === '10_HEARTS';

  return (
    <div className="w-full h-full max-h-full overflow-hidden flex flex-col justify-between gap-2.5 max-w-[1700px] mx-auto select-none" dir="rtl">
      
      {/* ── 1. TOP BROADCAST CONTROL BAR (Compact Height ~50px) ── */}
      <header className="w-full px-4 py-2 rounded-2xl bg-[#0C0E20]/95 border border-white/10 shadow-xl backdrop-blur-xl flex items-center justify-between gap-3 shrink-0">
        
        {/* Left: 5 Questions Stage Track */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
            {fivePrompts.map((p, idx) => {
              const isCurrent = idx === currentPromptIndex;
              const isPassed = idx < currentPromptIndex;

              return (
                <button
                  key={idx}
                  onClick={() => handleStartQuestion(idx)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono font-black text-xs flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.8)] scale-105'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                  title={`السؤال ${idx + 1}`}
                >
                  {isPassed ? '✓' : idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-amber-400 font-mono">
                السؤال {currentPromptIndex + 1} من 5
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 border border-amber-400/30 text-amber-300">
                {currentPrompt.descriptionHint || `رقم من ${digitsCount} خانات`}
              </span>
            </div>
            <h2 className="text-sm font-black text-white leading-tight">
              تحدي تخمين الأرقام 🔢
            </h2>
          </div>
        </div>

        {/* Center: Live Status & Points & Mode Toggle Button */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono font-black text-xs flex items-center gap-1.5 shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>+{currentPrompt.points || 150} نقطة</span>
          </div>

          {/* Quick Attempts Mode Toggle for Host */}
          <button
            onClick={() => {
              const nextMode = attemptsMode === '10_HEARTS' ? 'UNLIMITED' : '10_HEARTS';
              setAttemptsMode(nextMode);
              soundFX.play('score_update');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isLimited
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                : 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            }`}
            title="انقر للتبديل بين 10 قلوب أو محاولات غير محدودة"
          >
            {isLimited ? (
              <>
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>10 قلوب لكل لاعب</span>
              </>
            ) : (
              <>
                <InfinityIcon className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                <span>محاولات لا محدودة</span>
              </>
            )}
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>مباشر 🔴</span>
          </div>
        </div>

        {/* Right: Host Actions */}
        <div className="flex items-center gap-2">
          {phase === 'ROUND_RECAP' ? (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <span>{currentPromptIndex + 1 >= 5 ? 'إعلان الفائز 🏆' : 'السؤال التالي ➔'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAnswerRevealed(true);
                setPhase('ROUND_RECAP');
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>كشف الحل</span>
            </button>
          )}

          <button
            onClick={handleSimulateMockGuess}
            className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            title="محاكاة تخمين عشوائي للاختبار"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تخمين تجريبي</span>
          </button>
        </div>

      </header>

      {/* ── 2. MAIN 3-COLUMN STUDIO GRID (Fills Remaining Viewport Exactly) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT COLUMN: LIVE CHAT GUESS FEED (3 Cols, Inner Scroll Only) */}
        <div className="lg:col-span-3 flex flex-col p-3 rounded-2xl bg-[#090B1A]/95 border border-white/10 shadow-xl backdrop-blur-xl h-full min-h-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 shrink-0">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>شات التخمينات المباشر</span>
            </h4>
            <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              {guessLogs.length} تفاعل
            </span>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 pr-1 text-xs">
            {guessLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4 space-y-1.5">
                <Flame className="w-6 h-6 text-slate-700 animate-pulse" />
                <span className="font-bold">في انتظار التخمينات...</span>
                <span className="text-[10px] text-amber-400/80 font-mono">اكتب رقمك في الشات مباشرة!</span>
              </div>
            ) : (
              guessLogs.map(log => (
                <div
                  key={log.id}
                  className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all animate-in fade-in-50 slide-in-from-top-1 ${
                    log.isCorrect
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : log.isOutOfHearts
                      ? 'bg-rose-950/40 border-rose-800/40 text-slate-400 opacity-60'
                      : 'bg-white/5 border-white/10 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={log.avatarUrl}
                      alt={log.playerName}
                      className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/10"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate max-w-[80px] font-bold text-[11px]">
                        {log.playerName}
                      </span>
                      {isLimited ? (
                        <span className="text-[9px] text-rose-400/80 font-mono">
                          {log.isOutOfHearts ? '💔 0/10' : `❤️ ${log.heartsRemaining}/10`}
                        </span>
                      ) : (
                        <span className="text-[9px] text-emerald-400/80 font-mono">
                          ♾️ غير محدود
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                    <span className={`px-2 py-0.5 rounded-md font-black text-xs ${
                      log.isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-black/80 text-white border border-white/20'
                    }`}>
                      {log.guessedNumber}
                    </span>

                    {log.isCorrect ? (
                      <span className="text-emerald-400 font-black text-[11px]">✓ فاز!</span>
                    ) : log.unlockedDigit !== undefined ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 text-[10px] font-black flex items-center gap-0.5 animate-pulse">
                        🔓 [{log.unlockedDigit}]
                      </span>
                    ) : log.isOutOfHearts ? (
                      <span className="text-rose-400 text-[10px] font-bold">💔 نفدت</span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400">
                        {log.hintDirection === 'HIGHER' ? '⬆️ أكبر' : '⬇️ أصغر'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CENTER COLUMN: MAIN ARENA & 3D DIGIT SLOTS (6 Cols, Perfectly Proportioned) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0B0E24] to-[#060814] border border-white/15 shadow-2xl backdrop-blur-2xl h-full min-h-0 overflow-hidden relative">
          
          {/* Cyber Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Top Title & Hint */}
          <div className="text-center space-y-1 z-10 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-wide shadow-md">
              <Sparkle className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentPrompt.descriptionHint || `رقم من ${digitsCount} خانات`}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
              خمن الرقم
            </h1>
            <p className="text-xs text-slate-300 font-semibold">
              {isLimited ? (
                <>اكتب رقمك في الشات مباشرة • لكل متسابق <strong>10 قلوب محاولات ❤️</strong>!</>
              ) : (
                <>اكتب رقمك في الشات مباشرة • <strong>محاولات غير محدودة ♾️</strong> للجميع!</>
              )}
            </p>
          </div>

          {/* CENTER 3D DIGIT SLOTS (Left-to-Right standard numerical direction) */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 my-2 z-10 w-full max-w-xl shrink-0" dir="ltr">
            {Array.from({ length: digitsCount }).map((_, digitIdx) => {
              const isFullyRevealed = isAnswerRevealed;
              const isSlotRevealed = revealedPositions[digitIdx] !== undefined;
              const displayChar = isFullyRevealed ? secStr[digitIdx] : (isSlotRevealed ? revealedPositions[digitIdx] : null);

              return (
                <div
                  key={digitIdx}
                  className={`relative flex-1 max-w-[150px] h-40 sm:h-48 lg:h-56 rounded-2xl flex flex-col items-center justify-center font-mono font-black shadow-2xl transition-all duration-500 ${
                    isFullyRevealed
                      ? 'bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-3 border-yellow-200 shadow-[0_0_40px_rgba(245,158,11,0.9)] scale-105 animate-in zoom-in-75'
                      : isSlotRevealed
                      ? 'bg-gradient-to-b from-emerald-500 via-teal-700 to-emerald-950 text-white border-3 border-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.8)] scale-105 animate-in zoom-in-90'
                      : 'bg-gradient-to-b from-[#131735] to-[#0A0D1F] text-amber-400/80 border-2 border-amber-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-pulse'
                  }`}
                >
                  {/* Top Gloss Flare */}
                  <div className="absolute top-1.5 inset-x-3 h-1/3 rounded-t-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                  {displayChar !== null ? (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-5xl sm:text-7xl lg:text-8xl drop-shadow-2xl font-black">
                        {displayChar}
                      </span>
                      {isSlotRevealed && !isFullyRevealed && (
                        <span className="text-[10px] font-mono font-black text-emerald-200 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-400/60 mt-1 shadow-md">
                          مكشوف ✓
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Lock className="w-9 h-9 lg:w-12 lg:h-12 text-amber-400/60 drop-shadow" />
                      <span className="text-3xl lg:text-4xl text-amber-300/40 font-mono font-black">?</span>
                    </div>
                  )}

                  {/* Digit index tag */}
                  <span className="absolute bottom-2 text-[10px] font-mono font-extrabold opacity-70">
                    الخانة {digitIdx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Live Banner & Winner Callout */}
          <div className="w-full max-w-lg z-10 shrink-0">
            {roundWinner ? (
              <div className="w-full p-3 rounded-xl bg-emerald-950/95 border-2 border-emerald-400 flex items-center justify-between gap-3 shadow-[0_0_30px_rgba(16,185,129,0.6)] animate-in zoom-in-95">
                <div className="flex items-center gap-2.5">
                  <img
                    src={roundWinner.player.avatarUrl}
                    alt={roundWinner.player.displayName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                  />
                  <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-300 block uppercase tracking-wider">
                      🎉 فائز السؤال!
                    </span>
                    <h4 className="text-xs font-black text-white">
                      {roundWinner.player.displayName}
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-emerald-400">
                      خمن الرقم الصحيح ({roundWinner.guessedNumber})
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs font-mono shadow-md">
                    +{currentPrompt.points || 150} ★
                  </span>
                </div>
              </div>
            ) : isAnswerRevealed ? (
              <div className="p-2.5 rounded-xl bg-rose-950/85 border border-rose-500/40 text-rose-300 text-xs font-bold text-center shadow-md">
                تم كشف الحل بواسطة المضيف! الرقم هو ({currentPrompt.secretNumber})
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 shadow-md">
                {isLimited ? (
                  <div className="flex items-center gap-1 text-rose-400 font-extrabold">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>10 قلوب لكل متسابق</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-emerald-400 font-extrabold">
                    <InfinityIcon className="w-4 h-4 stroke-[2.5]" />
                    <span>محاولات غير محدودة للجميع</span>
                  </div>
                )}
                <span className="text-slate-500">|</span>
                <span className="text-amber-300 text-[11px]">
                  {revealedCount > 0
                    ? `تم كشف ${revealedCount} من ${digitsCount} خانات 🔓`
                    : 'الخانات الصحيحة تفتح تلقائياً عند تخمينها!'}
                </span>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: PLAYERS & LIVE HEARTS/STATUS TRACKER (3 Cols, Inner Scroll Only) */}
        <div className="lg:col-span-3 flex flex-col p-3 rounded-2xl bg-[#090B1A]/95 border border-white/10 shadow-xl backdrop-blur-xl h-full min-h-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 shrink-0">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>المشاركون من البث ({players.length})</span>
            </h4>
            <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
              {isLimited ? `❤️ ${players.filter(p => p.hearts > 0).length} متنافس` : `♾️ نشط`}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 pr-1 text-xs">
            {players.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4 space-y-1.5">
                <Users className="w-6 h-6 text-slate-700 animate-pulse" />
                <span className="font-bold">بانتظار المشاركين من البث...</span>
                <span className="text-[10px] text-cyan-400/80 font-mono">اكتب في الشات في أي وقت للدخول فوراً!</span>
              </div>
            ) : (
              players.map((p) => {
                const isElim = isLimited && (p.hearts <= 0 || p.isEliminated);
                const heartsPercent = Math.max(0, Math.min(100, (p.hearts / MAX_HEARTS_DEFAULT) * 100));

                return (
                  <div
                    key={p.id}
                    className={`p-2 rounded-xl border flex flex-col gap-1.5 transition-all ${
                      isElim
                        ? 'bg-black/30 border-white/5 opacity-40 grayscale'
                        : 'bg-white/5 border-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={p.avatarUrl}
                          alt={p.displayName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-white truncate text-[11px]">
                            {p.displayName}
                          </span>
                          <span className="text-[9px] font-mono text-amber-400 font-bold">
                            {p.score} ★
                          </span>
                        </div>
                      </div>

                      {/* Mode-Specific Badge */}
                      {isLimited ? (
                        <div className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-black flex items-center gap-1 ${
                          isElim
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                            : p.hearts <= 3
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                            : 'bg-white/10 text-rose-400 border border-white/10'
                        }`}>
                          <Heart className={`w-3 h-3 ${p.hearts > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
                          <span>{p.hearts}/{MAX_HEARTS_DEFAULT}</span>
                        </div>
                      ) : (
                        <div className="px-2 py-0.5 rounded-md font-mono text-[10px] font-black flex items-center gap-1 bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                          <InfinityIcon className="w-3 h-3 stroke-[2.5]" />
                          <span>مفتوح</span>
                        </div>
                      )}
                    </div>

                    {/* Hearts Progress Bar (in 10_HEARTS mode) */}
                    {isLimited && (
                      <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isElim
                              ? 'bg-slate-700'
                              : p.hearts <= 3
                              ? 'bg-rose-500'
                              : p.hearts <= 6
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${heartsPercent}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
