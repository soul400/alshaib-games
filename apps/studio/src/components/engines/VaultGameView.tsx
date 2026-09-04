'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  VaultQuestion, 
  VaultParticipant, 
  VaultGamePhase, 
  VaultSecurityLevel,
  VaultPuzzle,
  BonusVaultPrize
} from '@aep/types';
import { useStudioStore } from '../../store/useStudioStore';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { 
  normalizeAnswer, 
  isAnswerMatch, 
  normalizePinAttempt, 
  generateRandomPin, 
  generateVaultPuzzles 
} from '@aep/game-engines';
import { 
  Lock, Unlock, Shield, ShieldAlert, ShieldCheck, Trophy, Sparkles, 
  Clock, Users, Play, Pause, RefreshCw, AlertTriangle, Key, 
  Flame, Gift, CheckCircle, XCircle, Zap, FastForward, HelpCircle,
  Eye, Cpu, ChevronRight, UserPlus
} from 'lucide-react';

interface Props {
  question?: VaultQuestion;
}

export function VaultGameView({ question }: Props) {
  const { liveComments, tiktokEngine } = useStudioStore();

  // ══════════════════════════════════════════════════════════
  // State Machine & Core Game Engine State
  // ══════════════════════════════════════════════════════════
  const [phase, setPhase] = useState<VaultGamePhase>('IDLE');
  const [securityLevel, setSecurityLevel] = useState<VaultSecurityLevel>('NORMAL');
  const [pinLength, setPinLength] = useState<number>(6);
  
  // Authoritative Secret Session Data (kept secure)
  const secretPinRef = useRef<string>('739214');
  const [puzzles, setPuzzles] = useState<VaultPuzzle[]>([]);
  const [revealedDigits, setRevealedDigits] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [participants, setParticipants] = useState<VaultParticipant[]>([]);
  
  // Solvers & Spotlight
  const [currentSolver, setCurrentSolver] = useState<{
    participant: VaultParticipant;
    stageIndex: number;
    digit: string;
  } | null>(null);

  // Timers & Countdown
  const [gameTimer, setGameTimer] = useState<number>(180); // 3 mins total
  const [stageTimer, setStageTimer] = useState<number>(25); // per puzzle
  const [visualCountdown, setVisualCountdown] = useState<number>(5); // 5s initial observation for visual puzzles
  const [finalSprintTimer, setFinalSprintTimer] = useState<number>(20); // final PIN sprint
  const [lockdownTimer, setLockdownTimer] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Hints
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1); // -1 = none, 0 = hint 1, 1 = hint 2

  // Security & Rate Limiting
  const [failedAttemptsCount, setFailedAttemptsCount] = useState<number>(0);
  const [lastAttemptStatus, setLastAttemptStatus] = useState<'IDLE' | 'CORRECT' | 'DENIED'>('IDLE');
  const lastUserAttemptTimes = useRef<Map<string, number>>(new Map()); // user rate-limit (2s)
  const registeredUserIds = useRef<Set<string>>(new Set());
  const finalCodeStartedAt = useRef<number>(0);

  // Winner & Bonus Vault
  const [winner, setWinner] = useState<{
    participant: VaultParticipant;
    submittedPin: string;
    timestamp: number;
  } | null>(null);

  const [bonusPrizes, setBonusPrizes] = useState<Record<'A' | 'B' | 'C', { prize: BonusVaultPrize; label: string; icon: string }>>({
    A: { prize: 'GRAND_PRIZE', label: '🏆 الجائزة الكبرى: 5,000 عملة', icon: '💎' },
    B: { prize: 'MYSTERY_BOX', label: '🎁 صندوق المفاجآت السري', icon: '📦' },
    C: { prize: 'EMPTY_VAULT', label: '💨 خزينة فارغة!', icon: '💨' }
  });
  const [bonusChoice, setBonusChoice] = useState<'A' | 'B' | 'C' | null>(null);

  // Vault Door Physical Animations
  const [vaultDoorState, setVaultDoorState] = useState<'LOCKED' | 'UNLOCKING' | 'OPEN'>('LOCKED');
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // ══════════════════════════════════════════════════════════
  // 1. Initialize Fresh Vault Session
  // ══════════════════════════════════════════════════════════
  const initNewSession = (customLength: number = 6) => {
    const newPin = generateRandomPin(customLength);
    secretPinRef.current = newPin;
    const newPuzzles = generateVaultPuzzles(newPin, { pinLength: customLength });
    
    setPinLength(customLength);
    setPuzzles(newPuzzles);
    setRevealedDigits(new Array(customLength).fill(null));
    setCurrentStageIndex(0);
    setPhase('IDLE');
    setSecurityLevel('NORMAL');
    setGameTimer(180);
    setStageTimer(25);
    setFinalSprintTimer(20);
    setLockdownTimer(0);
    setFailedAttemptsCount(0);
    setWinner(null);
    setBonusChoice(null);
    setCurrentSolver(null);
    setActiveHintIndex(-1);
    setVaultDoorState('LOCKED');
    setLastAttemptStatus('IDLE');
    registeredUserIds.current.clear();
    lastUserAttemptTimes.current.clear();
    setParticipants([]);

    // Randomize bonus prizes placement
    const prizeTypes: { prize: BonusVaultPrize; label: string; icon: string }[] = [
      { prize: 'GRAND_PRIZE', label: '🏆 الجائزة الكبرى: 5,000 عملة', icon: '💎' },
      { prize: 'MYSTERY_BOX', label: '🎁 صندوق المفاجآت السري', icon: '📦' },
      { prize: 'EMPTY_VAULT', label: '💨 خزينة فارغة!', icon: '💨' }
    ];
    prizeTypes.sort(() => Math.random() - 0.5);
    setBonusPrizes({
      A: prizeTypes[0],
      B: prizeTypes[1],
      C: prizeTypes[2]
    });
  };

  useEffect(() => {
    initNewSession(6);
  }, []);

  // ══════════════════════════════════════════════════════════
  // 2. Registration Handler (TikTok "العب")
  // ══════════════════════════════════════════════════════════
  const processRegistrationComment = (c: any) => {
    if (!c) return;
    const rawText = (c.comment || c.commentText || '').trim().toLowerCase();
    const norm = normalizeAnswer(rawText);
    const isMatch = norm.includes('العب') || norm.includes('لعب') || norm.includes('play') || rawText.includes('العب');

    if (isMatch) {
      const uid = String(c.userId || c.username || `user-${Date.now()}`).toLowerCase();
      if (!registeredUserIds.current.has(uid)) {
        registeredUserIds.current.add(uid);
        const newP: VaultParticipant = {
          id: `vp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: uid,
          username: c.username || `@user_${Math.floor(Math.random() * 900 + 100)}`,
          displayName: c.displayName || c.authorName || c.username || 'مقتحم الخزينة',
          avatarUrl: c.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
          registeredAt: Date.now(),
          solvedPuzzlesCount: 0
        };
        setParticipants(prev => [...prev, newP]);
        soundFX.play('score_update', 0.5);
      }
    }
  };

  // Mock participants adder for test mode
  const handleAddMockParticipants = (count: number = 1) => {
    const arabNames = ['أحمد', 'فيصل', 'سارة', 'خالد', 'عبدالله', 'ريم', 'منيرة', 'فهد', 'عمر', 'سلطان'];
    for (let i = 0; i < count; i++) {
      const name = arabNames[Math.floor(Math.random() * arabNames.length)];
      const num = Math.floor(Math.random() * 9000 + 1000);
      const uid = `mock-${Date.now()}-${i}-${num}`;
      if (!registeredUserIds.current.has(uid)) {
        registeredUserIds.current.add(uid);
        setParticipants(prev => [
          ...prev,
          {
            id: `vp-mock-${Date.now()}-${i}`,
            userId: uid,
            username: `@${name.toLowerCase()}_${num}`,
            displayName: `${name} ${num.toString().substring(0, 2)}`,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
            registeredAt: Date.now(),
            solvedPuzzlesCount: 0
          }
        ]);
      }
    }
    soundFX.play('score_update', 0.6);
  };

  // ══════════════════════════════════════════════════════════
  // 3. Visual Observation Countdown & State Transitions
  // ══════════════════════════════════════════════════════════

  // Reset 5s visual observation countdown when entering any puzzle stage
  useEffect(() => {
    if (phase === 'PUZZLE_ACTIVE') {
      const isVisual = currentPuzzle?.type === 'visual_count' || currentPuzzle?.type === 'memory';
      setVisualCountdown(isVisual ? 5 : 0);
      setActiveHintIndex(-1);
    }
  }, [phase, currentStageIndex]);

  // Visual Puzzle 5s Observation Countdown Timer
  useEffect(() => {
    if (isPaused || phase !== 'PUZZLE_ACTIVE' || visualCountdown <= 0) return;

    const interval = setInterval(() => {
      setVisualCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          soundFX.play('reveal_question', 0.8);
          return 0;
        }
        soundFX.play('countdown_tick', 0.4);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isPaused, visualCountdown]);

  // Lockdown Timer
  useEffect(() => {
    if (phase !== 'LOCKDOWN' || lockdownTimer <= 0) return;

    const interval = setInterval(() => {
      setLockdownTimer(prev => {
        if (prev <= 1) {
          setPhase('FINAL_CODE');
          setSecurityLevel('ALERT');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, lockdownTimer]);

  // ══════════════════════════════════════════════════════════
  // 4. Puzzle Stage Solver & Transition Logic
  // ══════════════════════════════════════════════════════════
  const handleStageSolved = (solverParticipant: VaultParticipant, answer: string) => {
    if (phase !== 'PUZZLE_ACTIVE') return;

    const currentPuzzle = puzzles[currentStageIndex];
    if (!currentPuzzle) return;

    const targetDigit = secretPinRef.current[currentStageIndex];

    // Reveal Digit in State
    setRevealedDigits(prev => {
      const next = [...prev];
      next[currentStageIndex] = targetDigit;
      return next;
    });

    // Update solver participant stats
    setParticipants(prev =>
      prev.map(p =>
        p.userId === solverParticipant.userId
          ? { ...p, solvedPuzzlesCount: p.solvedPuzzlesCount + 1 }
          : p
      )
    );

    // Spotlight solver
    setCurrentSolver({
      participant: solverParticipant,
      stageIndex: currentStageIndex,
      digit: targetDigit
    });

    setPhase('DIGIT_REVEALED');
    soundFX.play('lock_click', 0.9);
    setTimeout(() => soundFX.play('digit_reveal', 0.8), 200);

    // After 3.5s transition to next stage or FINAL_CODE
    setTimeout(() => {
      setCurrentSolver(null);
      setActiveHintIndex(-1);
      const nextStage = currentStageIndex + 1;

      if (nextStage >= pinLength) {
        // All digits revealed! Move to FINAL_CODE sprint
        setPhase('FINAL_CODE');
        finalCodeStartedAt.current = Date.now();
        setFinalSprintTimer(25);
        soundFX.play('security_alarm', 0.7);
      } else {
        setCurrentStageIndex(nextStage);
        setStageTimer(25);
        setPhase('PUZZLE_ACTIVE');
        soundFX.play('gear_rotate', 0.6);
      }
    }, 3500);
  };

  const handleStageTimeExpired = () => {
    const targetDigit = secretPinRef.current[currentStageIndex];
    setRevealedDigits(prev => {
      const next = [...prev];
      next[currentStageIndex] = targetDigit;
      return next;
    });

    setPhase('DIGIT_REVEALED');
    soundFX.play('lock_clack', 0.7);

    setTimeout(() => {
      setActiveHintIndex(-1);
      const nextStage = currentStageIndex + 1;
      if (nextStage >= pinLength) {
        setPhase('FINAL_CODE');
        finalCodeStartedAt.current = Date.now();
        setFinalSprintTimer(25);
        soundFX.play('security_alarm', 0.7);
      } else {
        setCurrentStageIndex(nextStage);
        setStageTimer(25);
        setPhase('PUZZLE_ACTIVE');
      }
    }, 2800);
  };

  // ══════════════════════════════════════════════════════════
  // 5. Final PIN Validation & Cinematic Opening
  // ══════════════════════════════════════════════════════════
  const handleFinalPinSubmitted = (participant: VaultParticipant, submittedPin: string, commentTimestamp: number) => {
    if (phase !== 'FINAL_CODE') return;

    // Ignore comments sent prior to FINAL_CODE start
    if (commentTimestamp < finalCodeStartedAt.current - 500) return;

    // Rate Limit (1 attempt per 2s per user)
    const now = Date.now();
    const lastAttempt = lastUserAttemptTimes.current.get(participant.userId) || 0;
    if (now - lastAttempt < 2000) return;
    lastUserAttemptTimes.current.set(participant.userId, now);

    const cleanAttempt = normalizePinAttempt(submittedPin);
    const targetPin = secretPinRef.current;

    if (cleanAttempt === targetPin) {
      // ═════════════════════════════════════════════════════
      // 🎉 FIRST VALID FINAL PIN! WINNER SECURED!
      // ═════════════════════════════════════════════════════
      setWinner({
        participant,
        submittedPin: cleanAttempt,
        timestamp: Date.now()
      });

      setLastAttemptStatus('CORRECT');
      setPhase('VAULT_OPENING');
      setVaultDoorState('UNLOCKING');

      // ── Cinematic Opening Sequence ──
      // 1. Locks click rapidly
      soundFX.play('lock_click', 0.9);
      setTimeout(() => soundFX.play('lock_clack', 0.9), 300);
      setTimeout(() => soundFX.play('gear_rotate', 0.8), 600);
      setTimeout(() => {
        soundFX.play('vault_open', 1.0);
        setVaultDoorState('OPEN');
        triggerVisualEffect('confetti');
      }, 1200);

      // 2. Transition to Winner Reveal after 4 seconds
      setTimeout(() => {
        setPhase('WINNER_REVEAL');
        soundFX.play('winner_announcement', 1.0);
      }, 4200);

    } else {
      // ❌ INVALID FINAL PIN ATTEMPT
      setLastAttemptStatus('DENIED');
      soundFX.play('pin_error', 0.8);
      
      // Screen shake effect
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 600);

      // Security escalation
      setFailedAttemptsCount(c => {
        const nextCount = c + 1;
        if (nextCount >= 5) {
          setSecurityLevel('LOCKDOWN');
          setPhase('LOCKDOWN');
          setLockdownTimer(10);
          soundFX.play('lockdown', 1.0);
        } else if (nextCount >= 4) {
          setSecurityLevel('CRITICAL');
          soundFX.play('security_alarm', 0.7);
        } else if (nextCount >= 2) {
          setSecurityLevel('ALERT');
        } else {
          setSecurityLevel('WARNING');
        }
        return nextCount;
      });

      setTimeout(() => setLastAttemptStatus('IDLE'), 1500);
    }
  };

  // ══════════════════════════════════════════════════════════
  // 6. Bonus Vault Choice Handler (A, B, C)
  // ══════════════════════════════════════════════════════════
  const handleBonusVaultSelect = (choice: 'A' | 'B' | 'C') => {
    if (phase !== 'BONUS_VAULT' || bonusChoice) return;

    setBonusChoice(choice);
    soundFX.play('box_open', 0.9);
    setTimeout(() => {
      soundFX.play('bonus_reveal', 1.0);
      triggerVisualEffect('confetti');
    }, 600);
  };

  // ══════════════════════════════════════════════════════════
  // 7. TikTok Comments Router
  // ══════════════════════════════════════════════════════════
  const handleIncomingComment = (commentObj: any) => {
    if (!commentObj) return;
    const text = (commentObj.comment || commentObj.commentText || '').trim();
    const commentTime = commentObj.timestamp || Date.now();
    const uid = String(commentObj.userId || commentObj.username || '').toLowerCase();

    // 1. REGISTRATION PHASE
    if (phase === 'REGISTRATION') {
      processRegistrationComment(commentObj);
      return;
    }

    // Lookup participant
    let player = participants.find(p => p.userId === uid);
    if (!player) {
      // Auto-register active participants if game is running
      player = {
        id: `vp-${uid}`,
        userId: uid,
        username: commentObj.username || `@user_${uid.substring(0, 5)}`,
        displayName: commentObj.displayName || commentObj.username || 'مشارك البث',
        avatarUrl: commentObj.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
        registeredAt: Date.now(),
        solvedPuzzlesCount: 0
      };
    }

    // ═══════════════════════════════════════════════════════
    // 2. MID-GAME DIRECT PIN GUESSING (Anytime during the game!)
    // ═══════════════════════════════════════════════════════
    const possibleFullPin = normalizePinAttempt(text);
    if (possibleFullPin.length === pinLength && (phase === 'PUZZLE_ACTIVE' || phase === 'DIGIT_REVEALED' || phase === 'FINAL_CODE')) {
      if (possibleFullPin === secretPinRef.current) {
        // 🎉 Correct Full PIN Guessed mid-game -> Immediate Victory!
        setRevealedDigits(secretPinRef.current.split(''));
        handleFinalPinSubmitted(player, possibleFullPin, commentTime);
        return;
      } else if (phase === 'FINAL_CODE') {
        handleFinalPinSubmitted(player, possibleFullPin, commentTime);
        return;
      }
    }

    // 3. PUZZLE SOLVING PHASE
    if (phase === 'PUZZLE_ACTIVE') {
      const currentPuzzle = puzzles[currentStageIndex];
      if (currentPuzzle) {
        const cleanText = text.replace(/[٠-٩۰-۹]/g, (ch: string) => normalizePinAttempt(ch));
        const isMatch = isAnswerMatch(cleanText, [currentPuzzle.correctAnswer, currentPuzzle.correctAnswer.toLowerCase()]);
        
        if (isMatch || cleanText === currentPuzzle.correctAnswer) {
          handleStageSolved(player, currentPuzzle.correctAnswer);
        }
      }
      return;
    }

    // 4. BONUS VAULT PHASE
    if (phase === 'BONUS_VAULT' && !bonusChoice) {
      const cleanUpper = text.trim().toUpperCase();
      if (cleanUpper === 'A' || cleanUpper === 'أ' || cleanUpper === 'ا') handleBonusVaultSelect('A');
      else if (cleanUpper === 'B' || cleanUpper === 'ب') handleBonusVaultSelect('B');
      else if (cleanUpper === 'C' || cleanUpper === 'ج') handleBonusVaultSelect('C');
    }
  };

  // Subscribe to real TikTok live comments
  useEffect(() => {
    if (tiktokEngine) {
      tiktokEngine.onComment(handleIncomingComment);
      return () => tiktokEngine.offComment(handleIncomingComment);
    }
  }, [phase, currentStageIndex, participants, bonusChoice]);

  // Also scan recent store liveComments
  useEffect(() => {
    if (liveComments.length > 0) {
      const latest = liveComments[0];
      handleIncomingComment(latest);
    }
  }, [liveComments]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPuzzle = puzzles[currentStageIndex];

  // ══════════════════════════════════════════════════════════
  // RENDER UI
  // ══════════════════════════════════════════════════════════
  return (
    <div className={`relative w-full max-w-7xl mx-auto min-h-[85vh] flex flex-col justify-between p-4 sm:p-6 rounded-3xl overflow-hidden vault-metal-surface text-white select-none ${screenShake ? 'animate-shake' : ''}`}>
      
      {/* ── BACKGROUND INDUSTRIAL GRIDS & LASERS ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${securityLevel === 'LOCKDOWN' || securityLevel === 'CRITICAL' ? 'animate-alarm-red opacity-100' : 'opacity-0'}`} />

      {/* ══════════════════════════════════════════════════════
          TOP COMMAND STRIP: STATUS & PARTICIPANTS
         ══════════════════════════════════════════════════════ */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F111E]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
        {/* Left: Vault Title & Security */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border transition-all ${
            securityLevel === 'LOCKDOWN' || securityLevel === 'CRITICAL'
              ? 'bg-rose-600/30 border-rose-500 text-rose-400 animate-pulse'
              : securityLevel === 'ALERT'
              ? 'bg-amber-600/30 border-amber-500 text-amber-400'
              : 'bg-cyan-600/20 border-cyan-500/40 text-cyan-400'
          }`}>
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                خزينة الأسرار
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">THE VAULT</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">حالة الأمان:</span>
              <span className={`font-black uppercase px-2 py-0.5 rounded text-[10px] ${
                securityLevel === 'LOCKDOWN' ? 'bg-red-500 text-white font-bold animate-pulse' :
                securityLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                securityLevel === 'ALERT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                SECURITY: {securityLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Stage Progress Tracker */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: pinLength }).map((_, idx) => {
            const isSolved = revealedDigits[idx] !== null;
            const isCurrent = idx === currentStageIndex && phase === 'PUZZLE_ACTIVE';
            return (
              <div
                key={idx}
                className={`w-9 h-11 sm:w-11 sm:h-13 rounded-xl border flex flex-col items-center justify-center font-mono font-black transition-all ${
                  isSolved
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-lock-unlocked'
                    : isCurrent
                    ? 'bg-amber-950/70 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 animate-pulse'
                    : 'bg-[#151828] border-white/10 text-slate-500'
                }`}
              >
                <span className="text-[9px] text-slate-400">#{idx + 1}</span>
                <span className="text-base sm:text-lg font-bold">
                  {isSolved ? revealedDigits[idx] : isCurrent ? '?' : '🔒'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Status Badge & Participants */}
        <div className="flex items-center gap-3">
          {/* Players Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-slate-300">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>{participants.length}</span>
            <span className="text-slate-500 hidden sm:inline">مشارك</span>
          </div>

          {/* Live Status Badge (Timer Free) */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono font-black text-xs sm:text-sm shadow-sm">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>مباشر • مفتوحة للتحدي</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MAIN STAGE ARENA: MULTI-PHASE VIEWS
         ══════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4">

        {/* ── PHASE 1: IDLE / REGISTRATION ── */}
        {(phase === 'IDLE' || phase === 'REGISTRATION') && (
          <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6 p-6 sm:p-8 rounded-3xl bg-[#121422]/90 border border-white/15 backdrop-blur-2xl shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-500 to-amber-600 flex items-center justify-center text-black font-black shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              <Lock className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">خزينة الأسرار المغلقة 🔐</h2>
              <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
                {phase === 'IDLE' 
                  ? 'اضغط "بدء التسجيل" لفتح استقبال تعليقات الجمهور في تيك توك لايف للبدء بمهمة فتح الخزينة!'
                  : 'اكتب في تعليقات البث المباشر كلمة (العب) للانضمام فوراً ومساعدة الفريق في حل شفرة الـ PIN!'}
              </p>
            </div>

            {/* Live Registration Comment Banner */}
            <div className="w-full p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-right">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                <div>
                  <span className="text-xs text-cyan-300 font-bold block">طريقة المشاركة في TikTok LIVE:</span>
                  <span className="text-base font-black text-white font-mono">اكتب: "العب" في التعليقات</span>
                </div>
              </div>
              <div className="text-left font-mono">
                <span className="text-2xl font-black text-yellow-400">{participants.length}</span>
                <span className="text-xs text-slate-400 block">لاعبين جاهزين</span>
              </div>
            </div>

            {/* Participants Avatar Stream Grid */}
            <div className="w-full max-h-40 overflow-y-auto flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-black/40 border border-white/5">
              {participants.length === 0 ? (
                <div className="text-xs text-slate-500 py-4 flex items-center gap-2">
                  <Users className="w-4 h-4 animate-pulse" />
                  <span>في انتظار دخول أول مشارك...</span>
                </div>
              ) : (
                participants.map(p => (
                  <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs animate-in zoom-in">
                    <img src={p.avatarUrl} alt={p.displayName} className="w-6 h-6 rounded-full object-cover border border-amber-400/40" />
                    <span className="font-bold text-white max-w-[90px] truncate">{p.displayName}</span>
                  </div>
                ))
              )}
            </div>

            {/* Host Controls for Registration */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-2">
              {phase === 'IDLE' ? (
                <button
                  onClick={() => {
                    setPhase('REGISTRATION');
                    soundFX.play('round_start');
                  }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-base shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>بدء التسجيل واستقبال الشات 🚀</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (participants.length === 0) {
                      handleAddMockParticipants(5);
                    }
                    setPhase('INTRO');
                    soundFX.play('security_warning');
                    setTimeout(() => {
                      setPhase('PUZZLE_ACTIVE');
                      soundFX.play('gear_rotate');
                    }, 3000);
                  }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-base shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-5 h-5 fill-current" />
                  <span>إغلاق التسجيل وبدء اللعبة 🔐</span>
                </button>
              )}

              {/* Add Mock Participant Test Button */}
              <button
                onClick={() => handleAddMockParticipants(5)}
                className="px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-slate-300 text-xs font-bold hover:bg-white/15 transition-all cursor-pointer flex items-center gap-2"
                title="إضافة 5 مشاركين تجريبيين للتجربة بدون لايف"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>+ 5 مشاركين تجريبيين</span>
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE 2: INTRO BRIEFING ── */}
        {phase === 'INTRO' && (
          <div className="w-full max-w-2xl flex flex-col items-center text-center gap-6 p-8 rounded-3xl bg-[#0E101D] border-2 border-yellow-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-500 text-yellow-400 flex items-center justify-center font-black animate-spin-slow">
              <Key className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white">تأهبوا لاقتحام الخزينة! 🚨</h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              الخزينة مؤمّنة برمز <span className="font-bold text-yellow-400">{pinLength} أرقام</span>. تعاونوا في الشات لحل كل لغز واكتشاف كل رقم!
            </p>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-4 py-2 rounded-xl border border-cyan-500/30">
              <Zap className="w-4 h-4 animate-bounce" />
              <span>جاري تحميل أقفال المرحلة الأولى...</span>
            </div>
          </div>
        )}

        {/* ── PHASE 3: ACTIVE PUZZLE SOLVING & DIGIT REVEAL ── */}
        {(phase === 'PUZZLE_ACTIVE' || phase === 'DIGIT_REVEALED') && currentPuzzle && (
          <div className="w-full max-w-4xl flex flex-col gap-6 items-center">
            
            {/* Center Massive Vault Lock Display */}
            <div className="w-full rounded-3xl bg-[#101221]/95 border border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative flex flex-col items-center">
              
              {/* Header: Stage Badge & Stage Countdown */}
              <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 font-mono font-black text-xs">
                    المرحلة {currentStageIndex + 1} من {pinLength}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">{currentPuzzle.title}</h3>
                </div>

                {/* Stage Status Badge */}
                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-1.5 rounded-xl font-mono font-bold text-xs bg-white/5 border border-white/10 text-cyan-300 flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>في انتظار الحل...</span>
                  </div>
                </div>
              </div>

              {/* Question Text / 5s Observation Notice */}
              <div className="text-center my-2 min-h-[60px] flex items-center justify-center">
                {visualCountdown > 0 ? (
                  <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95">
                    <div className="px-5 py-2 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 text-yellow-300 font-mono font-black text-sm sm:text-base flex items-center gap-2.5 shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-pulse">
                      <Eye className="w-5 h-5 text-yellow-400" />
                      <span>👀 احفظ تفاصيل ورموز الخزينة جيداً! سيظهر السؤال بعد: 0{visualCountdown} ثوانٍ</span>
                    </div>
                    <p className="text-sm text-slate-300 font-medium">
                      ركّز في أماكن وتكرار الرموز المعروضة في الأسفل...
                    </p>
                  </div>
                ) : (
                  <p className="text-lg sm:text-2xl font-black text-amber-300 tracking-wide whitespace-pre-line leading-relaxed animate-in zoom-in-95 duration-300">
                    {currentPuzzle.question}
                  </p>
                )}
              </div>

              {/* Dynamic Visual Content depending on Puzzle Type */}
              <div className="w-full my-4 flex items-center justify-center">
                {/* Visual Grid Count (Shows during 5s observation, then DISAPPEARS completely) */}
                {currentPuzzle.type === 'visual_count' && currentPuzzle.visualData?.grid && (
                  visualCountdown > 0 ? (
                    <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
                      <div className="grid grid-cols-3 gap-3.5 p-5 rounded-3xl bg-black/70 border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.4)] scale-105 transition-all">
                        {currentPuzzle.visualData.grid.flat().map((symbol, idx) => (
                          <div 
                            key={idx} 
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl sm:text-4xl shadow-md animate-pulse"
                          >
                            {symbol}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 animate-pulse">
                        ⏳ احفظ الصورة جيداً! ستختفي خلال {visualCountdown} ثوانٍ...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-[#181B2E] to-[#0E101D] border-2 border-amber-500/40 shadow-2xl animate-in zoom-in-95 text-center gap-3 max-w-sm w-full">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400 text-amber-300 flex items-center justify-center text-3xl font-black shadow-inner">
                        🔒
                      </div>
                      <div className="text-base font-black text-yellow-300">اختفت الصورة من الشاشة! 🧠</div>
                      <p className="text-xs text-slate-300">اختبر قوة تركيزك وأجب من ذاكرتك الآن في الشات</p>
                      <div className="flex gap-2 mt-1">
                        {['❓', '❓', '❓'].map((q, i) => (
                          <span key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-bold text-slate-400 font-mono">
                            {q}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* ── CRACK THE CODE PUZZLE (تحدي فك الشفرة والقرائن الرقمية) ── */}
                {currentPuzzle.type === 'crack_code' && currentPuzzle.visualData?.crackClues && (
                  <div className="w-full max-w-lg flex flex-col gap-2.5 p-5 rounded-3xl bg-gradient-to-b from-[#181B2E] to-[#0E101D] border-2 border-cyan-500/50 shadow-2xl animate-in zoom-in-95">
                    <div className="w-full text-center pb-2 border-b border-white/10 flex items-center justify-center gap-2">
                      <Key className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">🔐 قرائن فك شفرة الخزينة</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {currentPuzzle.visualData.crackClues.map((clue, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 gap-3"
                        >
                          {/* 3 Code Digits */}
                          <div className="flex items-center gap-2">
                            {clue.code.map((d, dIdx) => (
                              <span
                                key={dIdx}
                                className="w-9 h-11 sm:w-11 sm:h-13 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-white shadow-inner"
                              >
                                {d}
                              </span>
                            ))}
                          </div>

                          {/* Verdict Badge */}
                          <div className="flex items-center gap-1.5 text-right">
                            <span className={`text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-xl border ${
                              clue.status === 'CORRECT_PLACE'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : clue.status === 'WRONG_PLACE'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}>
                              {clue.verdict}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── MATRIX / TRIANGLE MATH PUZZLE (مصفوفة الأرقام الذكية) ── */}
                {currentPuzzle.type === 'matrix_math' && currentPuzzle.visualData?.matrixNumbers && (
                  <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-gradient-to-b from-[#181B2E] to-[#0E101D] border-2 border-cyan-500/50 shadow-2xl animate-in zoom-in-95">
                    {/* Top Number */}
                    <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center font-mono font-black text-2xl text-cyan-300 shadow">
                      {currentPuzzle.visualData.matrixNumbers.top}
                    </div>

                    {/* Middle Row: Left, Center (?), Right */}
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center font-mono font-black text-2xl text-cyan-300 shadow">
                        {currentPuzzle.visualData.matrixNumbers.left}
                      </div>

                      {/* Center ? */}
                      <div className="w-16 h-16 rounded-2xl bg-amber-400 text-black border-2 border-amber-300 flex items-center justify-center font-mono font-black text-3xl shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-bounce">
                        {currentPuzzle.visualData.matrixNumbers.center}
                      </div>

                      <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center font-mono font-black text-2xl text-cyan-300 shadow">
                        {currentPuzzle.visualData.matrixNumbers.right}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── MATH RIDDLE CARD (فوازير الأرقام) ── */}
                {currentPuzzle.type === 'math_riddle' && (
                  <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181B2E] to-[#0E101D] border-2 border-amber-400/40 shadow-2xl flex items-center gap-3 animate-in zoom-in-95 max-w-lg">
                    <Sparkles className="w-8 h-8 text-yellow-400 shrink-0 animate-pulse" />
                    <p className="text-base sm:text-lg font-black text-yellow-200 leading-relaxed text-right">
                      {currentPuzzle.question}
                    </p>
                  </div>
                )}

                {/* ── VISUAL EQUATION PUZZLE (ألغاز معادلات الرموز للعباقرة - مثل الصور 2 و 3) ── */}
                {currentPuzzle.type === 'visual_equation' && currentPuzzle.visualData?.equationRows && (
                  <div className="w-full max-w-xl flex flex-col gap-2.5 p-5 rounded-3xl bg-gradient-to-b from-[#181B2E] to-[#0E101D] border-2 border-amber-400/50 shadow-2xl animate-in zoom-in-95">
                    <div className="w-full text-center pb-2 border-b border-white/10 flex items-center justify-center gap-2">
                      <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider">🌟 ألغاز رياضيات للعباقرة</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {currentPuzzle.visualData.equationRows.map((row, rIdx) => {
                        const isFinalRow = rIdx === currentPuzzle.visualData!.equationRows!.length - 1;
                        return (
                          <div
                            key={rIdx}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${
                              isFinalRow
                                ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-[1.02]'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            {/* Items & Operators */}
                            <div className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl">
                              {row.items.map((item, iIdx) => (
                                <React.Fragment key={iIdx}>
                                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow">
                                    {item}
                                  </span>
                                  {iIdx < row.operators.length && (
                                    <span className={`font-black font-mono text-xl sm:text-2xl ${
                                      row.operators[iIdx] === '×' ? 'text-amber-400' : 'text-slate-300'
                                    }`}>
                                      {row.operators[iIdx]}
                                    </span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>

                            {/* Equals Sign & Result */}
                            <div className="flex items-center gap-3">
                              <span className="text-xl sm:text-2xl font-black text-slate-400 font-mono">=</span>
                              <div className={`px-4 py-1.5 rounded-xl font-mono font-black text-xl sm:text-2xl ${
                                isFinalRow
                                  ? 'bg-amber-400 text-black shadow-lg animate-bounce'
                                  : 'bg-white/10 text-cyan-300 border border-white/10'
                              }`}>
                                {row.result}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Math / Sequence Display */}
                {(currentPuzzle.type === 'math' || currentPuzzle.type === 'sequence' || currentPuzzle.type === 'pattern') && (
                  <div className="px-6 py-4 rounded-2xl bg-black/60 border border-cyan-500/30 text-2xl sm:text-4xl font-mono font-black text-cyan-300 laser-pin-text shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    {currentPuzzle.visualData?.formula || currentPuzzle.visualData?.sequence?.join('   ➔   ') || '?'}
                  </div>
                )}
              </div>

              {/* Dynamic Hints Bar (Shown after 5s observation & after hint timers) */}
              {visualCountdown === 0 && activeHintIndex >= 0 && (
                <div className="w-full max-w-lg p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <HelpCircle className="w-4 h-4 shrink-0 text-yellow-400" />
                  <span>💡 تلميح: {currentPuzzle.hints[activeHintIndex]}</span>
                </div>
              )}

              {/* Real-time Instructions for Viewers */}
              <div className="mt-4 text-xs font-mono text-slate-400 flex items-center gap-2">
                {visualCountdown > 0 ? (
                  <span className="text-yellow-400 font-bold">⏳ احفظ الرموز... يتبقى {visualCountdown} ثوانٍ على ظهور السؤال!</span>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>أرسل إجابة هذا اللغز مباشرة في تعليقات تيك توك لايف!</span>
                  </>
                )}
              </div>
            </div>

            {/* ── Solver Spotlight Banner Overlay ── */}
            {phase === 'DIGIT_REVEALED' && currentSolver && (
              <div className="w-full max-w-2xl p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-teal-950 border-2 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-between gap-4 animate-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <img src={currentSolver.participant.avatarUrl} alt={currentSolver.participant.displayName} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] font-black uppercase">🔓 لغز محلول</span>
                      <h4 className="font-black text-lg text-white">{currentSolver.participant.displayName}</h4>
                    </div>
                    <span className="text-xs text-emerald-300 font-mono">اكتشف رقم القفل #{currentSolver.stageIndex + 1}!</span>
                  </div>
                </div>

                <div className="text-center font-mono px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
                  <span className="text-xs text-slate-300 block">الرقم المكتشف</span>
                  <span className="text-3xl font-black text-emerald-300">{currentSolver.digit}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE 4: FINAL CODE SPRINT (ALL DIGITS KNOWN) ── */}
        {phase === 'FINAL_CODE' && (
          <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6 p-8 rounded-3xl bg-gradient-to-b from-[#1C0F17] to-[#0E0F1F] border-2 border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.4)] animate-in zoom-in-95">
            
            {/* Alarm Header */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500 text-red-400 flex items-center justify-center font-black animate-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest block animate-pulse">🚨 FINAL CODE SPRINT</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">الـ PIN مكتمل بالكامل! اكتب الرمز الآن!</h2>
              </div>
            </div>

            {/* Revealed 6 Digits Display Box */}
            <div className="flex items-center justify-center gap-3 p-4 sm:p-6 rounded-2xl bg-black/70 border border-red-500/50 shadow-inner">
              {revealedDigits.map((d, idx) => (
                <div key={idx} className="w-12 h-16 sm:w-16 sm:h-20 rounded-xl bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center text-3xl sm:text-5xl font-mono font-black text-emerald-300 laser-pin-text shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  {d}
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="w-full p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-center">
              <p className="text-base sm:text-lg font-black text-yellow-300 mb-1">
                أول شخص يرسل الرمز الكامل للـ PIN في تعليقات تيك توك يفوز بالخزينة فوراً!
              </p>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-300">
                <Sparkles className="w-4 h-4" />
                <span>الخزينة جاهزة لاستقبال الرمز النهائي...</span>
              </div>
            </div>

            {/* Access Denied / Invalid PIN Warning Display */}
            {lastAttemptStatus === 'DENIED' && (
              <div className="px-6 py-2 rounded-xl bg-red-600 text-white font-black text-sm flex items-center gap-2 animate-bounce">
                <XCircle className="w-5 h-5" />
                <span>❌ رمز خاطئ! تم رفع مستوى الإنذار الأمني</span>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE 5: LOCKDOWN STATE ── */}
        {phase === 'LOCKDOWN' && (
          <div className="w-full max-w-2xl flex flex-col items-center text-center gap-6 p-8 rounded-3xl bg-red-950/90 border-4 border-red-600 shadow-[0_0_80px_rgba(220,38,38,0.8)] animate-alarm-red">
            <div className="w-20 h-20 rounded-3xl bg-red-600 flex items-center justify-center text-white font-black shadow-2xl animate-bounce">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-white">إغلاق أمني مؤقت — LOCKDOWN 🔴</h2>
            <p className="text-sm text-red-200 max-w-md">
              تم إيقاف استقبال الـ PIN مؤقتاً بسبب تكرار المحاولات الخاطئة! ستفتح الخزينة بعد قليل.
            </p>
            <div className="text-4xl font-mono font-black text-white">
              00:{lockdownTimer.toString().padStart(2, '0')}
            </div>
          </div>
        )}

        {/* ── PHASE 6: VAULT OPENING CINEMATIC ── */}
        {phase === 'VAULT_OPENING' && (
          <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6 p-8 rounded-3xl bg-[#090A15] border-2 border-amber-400 shadow-[0_0_80px_rgba(245,158,11,0.6)] animate-in zoom-in">
            <div className={`w-28 h-28 rounded-full border-4 border-yellow-400 flex items-center justify-center text-yellow-300 ${vaultDoorState === 'OPEN' ? 'animate-gold-burst' : 'animate-gear-spin'}`}>
              <Unlock className="w-14 h-14" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-yellow-400 gold-text-glow">
              ACCESS GRANTED — تم فتح الخزينة! 🔓
            </h2>
            <p className="text-slate-300 text-sm font-mono">
              الأقفال الميكانيكية تفتح واحداً تلو الآخر...
            </p>
          </div>
        )}

        {/* ── PHASE 7: WINNER REVEAL ── */}
        {phase === 'WINNER_REVEAL' && winner && (
          <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6 p-8 rounded-3xl bg-gradient-to-b from-[#1C1608] to-[#0A0D1A] border-2 border-yellow-400 shadow-[0_0_80px_rgba(245,158,11,0.7)] animate-in zoom-in">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-black font-black shadow-[0_0_40px_rgba(245,158,11,0.8)] animate-bounce">
              <Trophy className="w-12 h-12 fill-current" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest block mb-1">👑 THE VAULT HEIST CHAMPION</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">{winner.participant.displayName}</h2>
              <span className="text-sm font-mono text-slate-400">{winner.participant.username}</span>
            </div>

            <img src={winner.participant.avatarUrl} alt={winner.participant.displayName} className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 shadow-2xl" />

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-sm flex items-center gap-4">
              <div>
                <span className="text-xs text-slate-400 block">الرمز الصحيح</span>
                <span className="text-xl font-bold text-emerald-400">{winner.submittedPin}</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-xs text-slate-400 block">ألغاز تم حلها</span>
                <span className="text-xl font-bold text-yellow-400">{winner.participant.solvedPuzzlesCount}</span>
              </div>
            </div>

            {/* Next: Move to Bonus Vault Button */}
            <button
              onClick={() => {
                setPhase('BONUS_VAULT');
                soundFX.play('box_open');
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-base shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              <span>الانتقال لخزينة المكافأة الذهبية (Bonus Vault) 🏦</span>
            </button>
          </div>
        )}

        {/* ── PHASE 8: BONUS VAULT (A, B, C) ── */}
        {phase === 'BONUS_VAULT' && (
          <div className="w-full max-w-4xl flex flex-col items-center text-center gap-6 p-6 sm:p-8 rounded-3xl bg-[#0F111E] border border-yellow-500/40 shadow-2xl animate-in zoom-in">
            <div>
              <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest block mb-1">🏦 BONUS VAULT SELECTION</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">اختر خزينتك الإضافية يا بطل! (A أو B أو C)</h2>
              <p className="text-xs text-slate-400 mt-1">اكتب الحرف المفضل في تعليقات التيك توك لايف لكشف الجائزة!</p>
            </div>

            {/* 3 Interactive Safes A, B, C */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full my-4">
              {(['A', 'B', 'C'] as ('A' | 'B' | 'C')[]).map((boxKey) => {
                const isSelected = bonusChoice === boxKey;
                const prize = bonusPrizes[boxKey];

                return (
                  <button
                    key={boxKey}
                    onClick={() => handleBonusVaultSelect(boxKey)}
                    disabled={bonusChoice !== null}
                    className={`relative p-6 rounded-3xl border-2 flex flex-col items-center justify-between gap-4 transition-all min-h-[220px] ${
                      isSelected
                        ? 'bg-gradient-to-b from-yellow-950 to-amber-950 border-yellow-400 scale-105 shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-in zoom-in'
                        : bonusChoice !== null
                        ? 'bg-black/40 border-white/10 opacity-60'
                        : 'bg-[#161828] border-white/15 hover:border-yellow-400 hover:scale-102 cursor-pointer shadow-xl'
                    }`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-mono font-black text-xl text-yellow-400">
                      {boxKey}
                    </span>

                    <div className="text-5xl my-2">
                      {isSelected ? prize.icon : '🔐'}
                    </div>

                    <div>
                      {isSelected ? (
                        <div className="font-black text-sm text-yellow-300 animate-in fade-in">
                          {prize.label}
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">خزينة مغلقة</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Game Complete Action */}
            {bonusChoice && (
              <button
                onClick={() => setPhase('GAME_COMPLETE')}
                className="px-8 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-black text-sm hover:bg-white/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>إنهاء الجولة وعرض التقرير الكامل</span>
              </button>
            )}
          </div>
        )}

        {/* ── PHASE 9: GAME COMPLETE / TIMEOUT ── */}
        {(phase === 'GAME_COMPLETE' || phase === 'TIMEOUT') && (
          <div className="w-full max-w-2xl flex flex-col items-center text-center gap-6 p-8 rounded-3xl bg-[#111322] border border-white/15 shadow-2xl animate-in zoom-in">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
              {phase === 'TIMEOUT' ? '⌛' : '🏆'}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {phase === 'TIMEOUT' ? 'انتهى وقت الخزينة دون فتحها!' : 'اكتملت مهمة الخزينة بنجاح! 👑'}
            </h2>

            <div className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs text-slate-300 flex justify-around">
              <div>
                <span className="text-slate-500 block">الرمز السري الحقيقي</span>
                <span className="text-lg font-bold text-yellow-400">{secretPinRef.current}</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-slate-500 block">إجمالي المشاركين</span>
                <span className="text-lg font-bold text-cyan-400">{participants.length}</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-slate-500 block">الفائز</span>
                <span className="text-lg font-bold text-emerald-400">{winner?.participant.displayName || 'لا يوجد'}</span>
              </div>
            </div>

            <button
              onClick={() => initNewSession(pinLength)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-base shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>بدء لعبة خزينة جديدة 🔄</span>
            </button>
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════
          BOTTOM STREAMER COMMAND BAR
         ══════════════════════════════════════════════════════ */}
      <div className="relative z-20 w-full flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0B0D18]/90 border border-white/10 backdrop-blur-xl text-xs">
        {/* Left: Streamer quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 transition-all flex items-center gap-1.5"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isPaused ? 'استئناف' : 'إيقاف مؤقت'}</span>
          </button>

          {phase === 'PUZZLE_ACTIVE' && (
            <button
              onClick={() => handleStageTimeExpired()}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 transition-all flex items-center gap-1.5"
              title="تخطي اللغز الحالي وكشف الرقم"
            >
              <FastForward className="w-3.5 h-3.5 text-yellow-400" />
              <span>تخطي اللغز</span>
            </button>
          )}
        </div>

        {/* Right: Reset Session Button */}
        <button
          onClick={() => initNewSession(pinLength)}
          className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>إعادة تعيين الجلسة</span>
        </button>
      </div>

    </div>
  );
}
