'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  BusCategory, 
  BusGameConfig, 
  BusGameMode, 
  BusLetterDifficulty, 
  BusPhase, 
  BusPlayer, 
  BusQuestion, 
  BusRoundState,
  PlayerAnswer 
} from '@aep/types';
import { 
  BUS_LETTERS, 
  DEFAULT_BUS_CATEGORIES, 
  DEFAULT_BUS_CONFIG, 
  calculateBusRoundScores, 
  generateMockBusPlayers, 
  normalizeBusWord, 
  parseBusComment, 
  selectRandomBusLetter, 
  validateBusAnswer 
} from '@aep/game-engines';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { useStudioStore } from '../../store/useStudioStore';
import { 
  Bus, Trophy, Users, Clock, Play, RotateCcw, Settings, 
  CheckCircle2, XCircle, AlertTriangle, Sparkles, Volume2, 
  VolumeX, Shield, Zap, ChevronRight, Crown, Flame, 
  Lock, ArrowRight, Star, Award, Check, UserPlus, FastForward,
  Layers, Shuffle
} from 'lucide-react';

interface Props {
  question?: BusQuestion;
  isAnswerRevealed?: boolean;
}

export function BusTayyibinView({ question: propQuestion }: Props) {
  const { liveComments, tiktokEngine } = useStudioStore();

  // ─────────────────────────────────────────────────────────────
  // 1. CONFIGURATION & STATE
  // ─────────────────────────────────────────────────────────────
  const [config, setConfig] = useState<BusGameConfig>(() => ({
    ...DEFAULT_BUS_CONFIG,
    ...(propQuestion?.config || {})
  }));

  const [phase, setPhase] = useState<BusPhase>('REGISTRATION');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [requiredLetter, setRequiredLetter] = useState<string>('م');
  const [cyclingLetter, setCyclingLetter] = useState<string>('م');
  
  // Timer & Clocks
  const [timeRemaining, setTimeRemaining] = useState<number>(config.durationSeconds);
  const roundStartTimeRef = useRef<number>(Date.now());

  // Players & Round State
  const [players, setPlayers] = useState<BusPlayer[]>([]);
  const [finishCaller, setFinishCaller] = useState<BusRoundState['finishCaller']>();
  const [falseFinishAlert, setFalseFinishAlert] = useState<{ player: BusPlayer; count: number } | null>(null);

  // Validation Phase Category Tracker & Control Moderation
  const [validatingCatIndex, setValidatingCatIndex] = useState<number>(0);
  const [rejectedAnswers, setRejectedAnswers] = useState<Record<string, string[]>>({});
  const [categoryStats, setCategoryStats] = useState<Record<string, { answer: string; count: number; isUnique: boolean; isRejected: boolean; players: string[] }[]>>({});

  // Activity Log Ticker (last 5 important events)
  const [activityLogs, setActivityLogs] = useState<{ id: string; text: string; time: string; icon: string }[]>([]);

  // Host Drawer & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ARENA' | 'LEADERBOARD'>('ARENA');

  // Processed comments set to prevent double processing
  const processedCommentIdsRef = useRef<Set<string>>(new Set());
  const userLastSubmissionTimeRef = useRef<Map<string, number>>(new Map());

  // Active categories
  const categories = useMemo(() => config.categories.filter(c => c.enabled), [config.categories]);
  const currentValidatingCategory = categories[validatingCatIndex] || categories[0];

  // Add activity log item
  const addLog = useCallback((text: string, icon: string = '✓') => {
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLogs(prev => [{ id: `${Date.now()}-${Math.random()}`, text, time, icon }, ...prev.slice(0, 5)]);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2. ROUND CONTROLLER & LIFECYCLE
  // ─────────────────────────────────────────────────────────────

  // Start New Round -> Open Registration Phase (No timer, host clicks start)
  const startRegistration = useCallback(() => {
    setPhase('REGISTRATION');
    setFinishCaller(undefined);
    setFalseFinishAlert(null);
    setValidatingCatIndex(0);
    setRejectedAnswers({});
    setCategoryStats({});
    processedCommentIdsRef.current.clear();
    userLastSubmissionTimeRef.current.clear();

    soundFX.play('round_start');
    addLog('🚌 فُتح باب التسجيل! اكتب «العب» للدخول', '🚌');
  }, [addLog]);

  // Toggle Accept / Reject Answer by Host Control
  const toggleRejectAnswer = useCallback((catId: string, answerWord: string) => {
    setRejectedAnswers(prev => {
      const currentList = prev[catId] || [];
      const isAlreadyRejected = currentList.includes(answerWord);
      const updatedList = isAlreadyRejected
        ? currentList.filter(w => w !== answerWord)
        : [...currentList, answerWord];

      const nextRejected = { ...prev, [catId]: updatedList };

      setPlayers(currPlayers => {
        const { updatedPlayers, categoryStats: newStats } = calculateBusRoundScores(
          currPlayers,
          categories,
          config,
          nextRejected
        );
        setCategoryStats(newStats);
        return updatedPlayers;
      });

      if (isAlreadyRejected) {
        soundFX.play('score_update');
        addLog(`✅ تم إعادة اعتماد (${answerWord}) لتصنيف (${currentValidatingCategory.name})`, '✓');
      } else {
        soundFX.play('wrong_answer');
        addLog(`❌ تم رفض (${answerWord}) لتصنيف (${currentValidatingCategory.name}) وإعطاء 0 نقاط`, '⚠️');
      }

      return nextRejected;
    });
  }, [categories, config, currentValidatingCategory, addLog]);

  // Letter Reveal Slot Machine Animation
  const startLetterReveal = useCallback(() => {
    setPhase('LETTER_REVEAL');
    soundFX.play('wheel_spin');

    const selected = selectRandomBusLetter(config.difficulty);
    setRequiredLetter(selected.letter);

    let cycleCount = 0;
    const maxCycles = 20;
    const cycleInterval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * BUS_LETTERS.length);
      setCyclingLetter(BUS_LETTERS[randomIdx].letter);
      cycleCount++;

      if (cycleCount >= maxCycles) {
        clearInterval(cycleInterval);
        setCyclingLetter(selected.letter);
        soundFX.play('digit_reveal');
        triggerVisualEffect('confetti');
        
        // Start Active Round after 1.5 seconds of letter display
        setTimeout(() => {
          startActiveRound(selected.letter);
        }, 1500);
      }
    }, 80);
  }, [config.difficulty]);

  // Start Active Game Round
  const startActiveRound = useCallback((letter: string) => {
    setPhase('ACTIVE');
    setTimeRemaining(config.durationSeconds);
    roundStartTimeRef.current = Date.now();
    soundFX.play('round_start');
    addLog(`🔤 بدأت الجولة على حرف (${letter})!`, '⚡');
  }, [config.durationSeconds, addLog]);

  // Active Round Timer
  useEffect(() => {
    if (phase !== 'ACTIVE') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          lockRound('TIME_UP');
          return 0;
        }
        if (prev <= 10) {
          soundFX.play('countdown_tick');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Lock Round (Called on Time Up or Valid "تم")
  const lockRound = useCallback((reason: 'TIME_UP' | 'FINISHED') => {
    setPhase('LOCKED');
    soundFX.play(reason === 'FINISHED' ? 'winner_card' : 'time_up');

    if (reason === 'TIME_UP') {
      addLog('⏰ انتهى الوقت المحدد للجولة!', '🚨');
    }

    // Move to Validation phase after 2 seconds
    setTimeout(() => {
      startValidation();
    }, 2500);
  }, [addLog]);

  // Start Validation Phase
  const startValidation = useCallback(() => {
    setPhase('VALIDATING');
    setValidatingCatIndex(0);

    // Calculate all scores and unique/duplicate stats
    setPlayers(currentPlayers => {
      const { updatedPlayers, categoryStats: calculatedStats } = calculateBusRoundScores(
        currentPlayers,
        categories,
        config
      );
      setCategoryStats(calculatedStats);
      return updatedPlayers;
    });

    soundFX.play('card_flip');
  }, [categories, config]);

  // Advance Validation to next category or Results
  const nextValidationStep = useCallback(() => {
    soundFX.play('score_update');
    setValidatingCatIndex(prev => {
      if (prev + 1 < categories.length) {
        return prev + 1;
      } else {
        // Validation complete -> Show Results
        setPhase('RESULTS');
        soundFX.play('winner_announcement');
        triggerVisualEffect('confetti');
        return prev;
      }
    });
  }, [categories.length]);

  // ─────────────────────────────────────────────────────────────
  // 3. TIKTOK LIVE COMMENT INGESTION & PROCESSING
  // ─────────────────────────────────────────────────────────────

  const processIncomingComment = useCallback((comment: any) => {
    if (!comment) return;

    const rawText = (comment.comment || comment.commentText || comment.text || '').trim();
    if (!rawText) return;

    const commentId = comment.id || `${comment.userId || comment.username}_${rawText}_${Math.floor((comment.timestamp || Date.now()) / 400)}`;
    if (processedCommentIdsRef.current.has(commentId)) return;
    processedCommentIdsRef.current.add(commentId);

    const userId = String(comment.userId || comment.username || `user-${Date.now()}`);
    const username = comment.username ? (comment.username.startsWith('@') ? comment.username : `@${comment.username}`) : `@user_${Math.floor(Math.random() * 900 + 100)}`;
    const displayName = comment.displayName || comment.authorName || comment.username || 'متسابق تيك توك';
    const avatarUrl = comment.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const now = Date.now();

    const parsed = parseBusComment(rawText, categories, config);

    // ─────────────────────────────────────────────────────────
    // Phase 1: REGISTRATION -> "العب"
    // ─────────────────────────────────────────────────────────
    if (phase === 'REGISTRATION') {
      const normText = normalizeBusWord(rawText);
      const joinKw = normalizeBusWord(config.joinKeyword || 'العب');
      const isJoin = parsed.isJoinCommand || normText.includes(joinKw) || normText.includes('العب') || normText.includes('لعب') || normText.includes('play') || normText.includes('دخول') || normText.includes('اشترك') || normText.includes('شارك');

      if (isJoin) {
        setPlayers(prev => {
          if (prev.some(p => p.userId === userId || p.username.toLowerCase() === username.toLowerCase())) {
            return prev;
          }

          const newPlayer: BusPlayer = {
            userId,
            username,
            displayName,
            avatarUrl,
            joinedAt: now,
            answers: {},
            roundScore: 0,
            totalScore: 0,
            validAnswers: 0,
            uniqueAnswers: 0,
            duplicateAnswers: 0
          };

          addLog(`${username} انضم للباص 🚌`, '👤');
          soundFX.play('score_update');
          return [...prev, newPlayer];
        });
      }
      return;
    }

    // ─────────────────────────────────────────────────────────
    // Phase 2: ACTIVE ROUND -> Parse Answers & "تم" Command
    // ─────────────────────────────────────────────────────────
    if (phase === 'ACTIVE') {
      // Check "تم" Finish Command
      if (parsed.isFinishCommand) {
        setPlayers(prev => {
          let playerIndex = prev.findIndex(p => p.userId === userId || p.username.toLowerCase() === username.toLowerCase());
          if (playerIndex === -1) return prev;

          const player = prev[playerIndex];
          const validCount = Object.values(player.answers).filter(a => a.status === 'valid').length;
          const requiredCount = categories.length;

          if (validCount >= requiredCount) {
            // Valid 6/6 Finish! Lock round immediately
            const finishData = {
              userId: player.userId,
              username: player.username,
              displayName: player.displayName,
              avatarUrl: player.avatarUrl,
              calledAt: now,
              validCount,
              totalCategories: requiredCount,
              success: true
            };

            setFinishCaller(finishData);
            player.finishedAt = now;
            player.isFinisher = true;

            addLog(`✅ ${player.username} قال تم وأنهى الجولة!`, '🏆');
            lockRound('FINISHED');
          } else {
            // False / Incomplete "تم" (Penalty -5 points)
            player.hasIncompleteFinishPenalty = true;
            setFalseFinishAlert({ player, count: validCount });
            soundFX.play('wrong_answer');
            addLog(`🚨 ${player.username} قال تم غير مكتملة (${validCount}/${requiredCount})`, '⚠️');

            setTimeout(() => setFalseFinishAlert(null), 4000);
          }

          return [...prev];
        });
        return;
      }

      // Parse & Accumulate Category Answers
      if (Object.keys(parsed.extractedAnswers).length > 0) {
        setPlayers(prev => {
          let playerIndex = prev.findIndex(p => p.userId === userId || p.username.toLowerCase() === username.toLowerCase());
          let updatedList = [...prev];

          if (playerIndex === -1) {
            const autoJoinedPlayer: BusPlayer = {
              userId,
              username,
              displayName,
              avatarUrl,
              joinedAt: now,
              answers: {},
              roundScore: 0,
              totalScore: 0,
              validAnswers: 0,
              uniqueAnswers: 0,
              duplicateAnswers: 0
            };
            updatedList.push(autoJoinedPlayer);
            playerIndex = updatedList.length - 1;
          }

          const targetPlayer = updatedList[playerIndex];

          // Validate and update each extracted category answer
          Object.entries(parsed.extractedAnswers).forEach(([catId, rawWord]) => {
            const validation = validateBusAnswer(rawWord, catId, requiredLetter);
            const catObj = categories.find(c => c.id === catId);

            targetPlayer.answers[catId] = {
              categoryId: catId,
              categoryName: catObj?.name || catId,
              raw: rawWord,
              normalized: validation.normalized,
              submittedAt: now,
              status: validation.isValid ? 'valid' : 'invalid',
              score: 0
            };
          });

          const newValidCount = Object.values(targetPlayer.answers).filter(a => a.status === 'valid').length;
          targetPlayer.validAnswers = newValidCount;

          addLog(`${targetPlayer.username} أرسل إجابات (${newValidCount}/${categories.length})`, '✍️');
          soundFX.play('score_update');

          return updatedList;
        });
      }
    }
  }, [categories, config, phase, requiredLetter, lockRound, addLog]);

  // Subscribe to live comments from store & live TikTok engine
  useEffect(() => {
    // 1. Process comments in store array
    if (liveComments && liveComments.length > 0) {
      liveComments.forEach(c => processIncomingComment(c));
    }

    // 2. Direct real-time stream subscription from TikTok engine
    if (tiktokEngine) {
      const handleEngineComment = (c: any) => {
        processIncomingComment(c);
      };
      tiktokEngine.onComment(handleEngineComment);
      return () => {
        tiktokEngine.offComment(handleEngineComment);
      };
    }
  }, [liveComments, tiktokEngine, processIncomingComment]);

  // ─────────────────────────────────────────────────────────────
  // 4. TEST / DEMO PLAYERS SIMULATION
  // ─────────────────────────────────────────────────────────────
  const handleAddMockPlayers = () => {
    const mock = generateMockBusPlayers(requiredLetter, 8);
    setPlayers(mock);
    soundFX.play('card_match');
    addLog('👥 تمت إضافة 8 لاعبين تجريبيين', '✨');
  };

  // ─────────────────────────────────────────────────────────────
  // 5. RENDER PHASE VIEWS
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="w-full flex flex-col gap-6 select-none" dir="rtl">
      
      {/* 🚌 TOP BROADCAST HEADER */}
      <div className="w-full flex items-center justify-between p-4 rounded-3xl bg-[#09150E] border-2 border-[#00A859]/60 shadow-2xl backdrop-blur-xl flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#004D25] via-[#006C35] to-[#00A859] flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(0,168,89,0.6)] border-2 border-[#FFE79A]/40">
            🚌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                باص الطيبين
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#C69214]/20 text-[#FFE79A] border border-[#C69214]/40">
                {config.mode} MODE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#00A859]/20 text-[#00A859] border border-[#00A859]/40">
                الجولة {roundNumber}
              </span>
            </div>
            <p className="text-xs text-[#E2D4B7]/80 font-bold">
              ولد • بنت • حيوان • نبات • جماد • بلاد — التعليقات هي ورقة الإجابة!
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Mock Players Generator */}
          <button
            onClick={handleAddMockPlayers}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            title="إضافة 8 متسابقين تجريبيين للاختبار"
          >
            <UserPlus className="w-4 h-4 text-[#FFE79A]" />
            <span>لاعبين تجريبيين</span>
          </button>

          {/* Quick Start / Restart Button */}
          {phase === 'REGISTRATION' ? (
            <button
              onClick={startLetterReveal}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#006C35] via-[#00A859] to-[#006C35] text-white text-xs font-black flex items-center gap-2 shadow-[0_0_25px_rgba(0,168,89,0.7)] hover:scale-105 transition-all border border-[#FFE79A]/40 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-[#FFE79A]" />
              <span>ابدأ الجولة 🚀 {players.length > 0 ? `(${players.length})` : ''}</span>
            </button>
          ) : (
            <button
              onClick={startRegistration}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>إعادة فتح التسجيل</span>
            </button>
          )}

          {/* Settings Toggle */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all cursor-pointer"
            title="إعدادات اللعبة"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STAGE ARENA VIEW (TV GAME SHOW DISPLAY)                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#041E10] via-[#02140A] to-[#010C06] border-2 border-[#00A859]/50 shadow-[0_20px_80px_rgba(0,0,0,0.95)] p-6 sm:p-10 flex flex-col items-center justify-between min-h-[580px] overflow-hidden text-white">
        
        {/* Ambient Lights & Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00A859]/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#C69214]/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* 🚨 FALSE "تم" PENALTY WARNING BANNER */}
        {falseFinishAlert && (
          <div className="absolute top-4 inset-x-8 z-40 animate-in slide-in-from-top duration-300">
            <div className="p-4 rounded-2xl bg-rose-950/95 border-2 border-rose-500 shadow-[0_10px_40px_rgba(244,63,94,0.6)] flex items-center justify-between text-white backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-400 animate-bounce" />
                <div>
                  <h4 className="text-sm font-black text-rose-200">
                    🚨 محاولة «تم» غير مكتملة! ({falseFinishAlert.player.displayName})
                  </h4>
                  <p className="text-xs text-rose-300 font-bold">
                    الإجابات المكتملة: {falseFinishAlert.count} من {categories.length} • تم تطبيق عقوبة -{config.incompleteFinishPenalty} نقاط وتستمر الجولة!
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-black font-mono">
                -{config.incompleteFinishPenalty} PTS
              </span>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PHASE 1: REGISTRATION ("اكتب العب" + عرض المتسابقين)        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {phase === 'REGISTRATION' && (
          <div className="w-full flex flex-col items-center justify-between gap-6 my-auto text-center max-w-3xl animate-in zoom-in-95 py-2">
            
            {/* Header Status & Keyword */}
            <div className="flex flex-col items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-[#00A859]/20 border border-[#00A859] text-xs font-mono font-black text-[#FFE79A] animate-pulse">
                ● باب التسجيل مفتوح الآن • REGISTRATION OPEN
              </span>

              <div className="px-8 py-3.5 rounded-3xl bg-[#082915]/90 border-2 border-[#FFE79A] shadow-[0_10px_40px_rgba(0,168,89,0.5)] backdrop-blur-xl flex items-center gap-3">
                <span className="text-sm text-[#E2D4B7] font-bold">للدخول إلى الجولة اكتب في الشات:</span>
                <span className="text-2xl sm:text-3xl font-black text-[#FFE79A] tracking-wider font-mono">
                  « {config.joinKeyword || 'العب'} »
                </span>
              </div>
            </div>

            {/* Registered Players Carousel / Grid */}
            <div className="w-full flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-[#FFE79A]">
                  <Users className="w-4 h-4 text-[#00A859]" />
                  <span>المتسابقون المشاركون ({players.length})</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {players.length === 0 ? 'بانتظار انضمام اللاعبين...' : 'جاهزون للانطلاق 🚀'}
                </span>
              </div>

              {players.length > 0 ? (
                <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-2 rounded-2xl bg-black/40 border border-white/10">
                  {players.map((p, idx) => (
                    <div
                      key={p.userId}
                      className="p-2.5 rounded-xl bg-[#082915]/90 border border-[#00A859]/60 flex items-center gap-2.5 shadow-md animate-in zoom-in-90"
                    >
                      <img
                        src={p.avatarUrl}
                        alt={p.displayName}
                        className="w-9 h-9 rounded-full object-cover border border-[#FFE79A]"
                      />
                      <div className="flex flex-col text-right overflow-hidden">
                        <span className="text-xs font-black text-white truncate max-w-[100px]">
                          {p.displayName}
                        </span>
                        <span className="text-[10px] font-mono text-[#00A859] truncate max-w-[100px]">
                          {p.username}
                        </span>
                      </div>
                      <Check className="w-4 h-4 text-[#00A859] mr-auto flex-shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full py-10 rounded-2xl bg-black/30 border border-dashed border-white/15 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <span className="text-3xl animate-bounce">🚌</span>
                  <p className="text-xs font-bold text-[#E2D4B7]">
                    في انتظار المتسابقين... اكتب <strong className="text-[#FFE79A]">«العب»</strong> في الشات للدخول الفوري!
                  </p>
                </div>
              )}
            </div>

            {/* Big Launch Button for Host */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <button
                onClick={startLetterReveal}
                className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-[#006C35] via-[#00A859] to-[#006C35] text-white font-black text-sm sm:text-base flex items-center gap-3 shadow-[0_10px_35px_rgba(0,168,89,0.8)] hover:scale-105 active:scale-95 transition-all border-2 border-[#FFE79A] cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current text-[#FFE79A]" />
                <span>ابدأ الجولة الآن 🚀 {players.length > 0 ? `(${players.length} لاعب جاهز)` : ''}</span>
              </button>
              <span className="text-[11px] text-slate-400 font-medium">
                اضغط «ابدأ الجولة» عندما يكتمل انضمام المتسابقين المطلوبين
              </span>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PHASE 3: LETTER REVEAL (SLOT MACHINE)                       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {phase === 'LETTER_REVEAL' && (
          <div className="flex flex-col items-center justify-center gap-6 my-auto text-center animate-in zoom-in-90">
            <span className="text-sm font-black text-[#E2D4B7] animate-pulse">
              جاري اختيار الحرف عشوائياً...
            </span>

            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#00A859] via-[#FFE79A] to-[#C69214] opacity-90 blur-2xl animate-pulse" />
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-[#082915] border-4 border-[#FFE79A] flex items-center justify-center shadow-[0_0_60px_rgba(0,168,89,0.9)]">
                <span className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFE79A] to-[#C69214] drop-shadow-2xl">
                  {cyclingLetter}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PHASE 4: ACTIVE ROUND / LOCKED PHASE                        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {(phase === 'ACTIVE' || phase === 'LOCKED') && (
          <div className="w-full flex flex-col justify-between gap-6 my-auto">
            
            {/* Top Stage Bar: Letter, Timer, Finish State */}
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-4">
              {/* Selected Letter Spotlight */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#082915] border-2 border-[#FFE79A] flex items-center justify-center text-3xl font-black text-[#FFE79A] shadow-[0_0_20px_rgba(0,168,89,0.6)]">
                  {requiredLetter}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#E2D4B7]/70 font-bold block">حرف الجولة</span>
                  <span className="text-lg font-black text-white">الحرف: {requiredLetter}</span>
                </div>
              </div>

              {/* Digital Countdown Timer */}
              <div className="flex items-center gap-2.5">
                <div className={`px-5 py-2 rounded-2xl border-2 flex items-center gap-2 shadow-xl backdrop-blur-md ${
                  timeRemaining <= 10
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-[#082915]/90 border-[#00A859] text-white'
                }`}>
                  <Clock className="w-5 h-5 text-[#FFE79A]" />
                  <span className="text-2xl font-black font-mono tracking-wider">
                    00:{String(timeRemaining).padStart(2, '0')}
                  </span>
                </div>

                {/* Force Lock / Finish by Host */}
                {phase === 'ACTIVE' && (
                  <button
                    onClick={() => lockRound('TIME_UP')}
                    className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>إغلاق الجولة</span>
                  </button>
                )}
              </div>
            </div>

            {/* 🎯 6 CATEGORIES CARDS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 my-auto">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl bg-[#082915]/80 border border-[#00A859]/50 shadow-lg flex flex-col items-center text-center gap-2 group hover:border-[#FFE79A] transition-colors"
                >
                  <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#FFE79A]">
                      {idx + 1}. {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      يبدأ بـ ({requiredLetter})
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Instructions / Winner Banner */}
            {finishCaller ? (
              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#004D25] via-[#006C35] to-[#004D25] border-2 border-[#FFE79A] shadow-2xl flex items-center justify-between text-white animate-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <img 
                    src={finishCaller.avatarUrl} 
                    alt={finishCaller.displayName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FFE79A] shadow-md"
                  />
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-1.5">
                      <span>🏆 {finishCaller.displayName} قال «تم» أولاً!</span>
                    </h4>
                    <span className="text-xs text-[#FFE79A] font-mono">
                      اكتملت 6/6 إجابات • جاري التحقق من النتائج...
                    </span>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-[#082915] text-[#FFE79A] text-xs font-black font-mono border border-[#FFE79A]/40">
                  LOCKED 🔒
                </span>
              </div>
            ) : (
              <div className="w-full p-3.5 rounded-2xl bg-[#041D0E]/90 border border-white/10 flex items-center justify-between text-xs text-[#E2D4B7] flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span>اكتب إجاباتك في تعليق واحد مفصول بمسافات، وعندما تنتهي اكتب: <strong className="text-[#FFE79A] font-mono">تم ✅</strong></span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-mono">
                  <span>👥 {players.length} لاعب</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PHASE 5: THEATRICAL VALIDATION (CATEGORY BY CATEGORY)        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {phase === 'VALIDATING' && currentValidatingCategory && (
          <div className="w-full flex flex-col gap-5 my-auto animate-in zoom-in-95">
            
            {/* Header: Validating Category */}
            <div className="w-full flex items-center justify-between border-b border-[#00A859]/40 pb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentValidatingCategory.icon}</span>
                <div>
                  <span className="text-[10px] font-mono text-[#FFE79A] font-black">
                    التحقق والاعتماد • التصنيف {validatingCatIndex + 1} من {categories.length}
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    تصنيف ({currentValidatingCategory.name}) بحرف «{requiredLetter}»
                  </h3>
                  <span className="text-xs text-[#E2D4B7]/70 font-medium">
                    💡 يمكنك رفض أي إجابة خاطئة بالضغط على «رفض» وسيتم تصفير نقاطها وإعادة احتساب نقاط باقي اللاعبين فوراً
                  </span>
                </div>
              </div>

              <button
                onClick={nextValidationStep}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#006C35] via-[#00A859] to-[#006C35] text-white text-xs font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all border border-[#FFE79A]/40 cursor-pointer"
              >
                <span>{validatingCatIndex + 1 < categories.length ? 'التصنيف التالي' : 'عرض النتائج النهائية 🏆'}</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>

            {/* Answer Uniqueness & Control Moderation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-72 overflow-y-auto pr-1">
              {(categoryStats[currentValidatingCategory.id] || []).length > 0 ? (
                categoryStats[currentValidatingCategory.id].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-md transition-all ${
                      stat.isRejected
                        ? 'bg-rose-950/80 border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)] opacity-80'
                        : stat.isUnique
                        ? 'bg-[#092915]/90 border-[#FFE79A] shadow-[0_0_15px_rgba(255,231,154,0.3)]'
                        : 'bg-[#061B0E]/80 border-white/10 text-slate-300'
                    }`}
                  >
                    <div className="flex flex-col overflow-hidden">
                      <span className={`text-base font-black ${
                        stat.isRejected ? 'line-through text-rose-300' : 'text-white'
                      }`}>
                        {stat.answer}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px]" title={stat.players.join('، ')}>
                        {stat.players.slice(0, 2).join('، ')}{stat.players.length > 2 ? ` و+${stat.players.length - 2}` : ''}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {/* Score Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                        stat.isRejected
                          ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                          : stat.isUnique
                          ? 'bg-[#FFE79A] text-slate-950 shadow-sm'
                          : 'bg-white/10 text-slate-300'
                      }`}>
                        {stat.isRejected
                          ? '❌ مرفوض (0)'
                          : stat.isUnique
                          ? `👤 فريد +${config.uniquePoints}`
                          : `👥 ${stat.count} لاعبين +${config.duplicatePoints}`}
                      </span>

                      {/* Control Accept / Reject Toggle Button */}
                      <button
                        onClick={() => toggleRejectAnswer(currentValidatingCategory.id, stat.answer)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                          stat.isRejected
                            ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40'
                            : 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40'
                        }`}
                      >
                        {stat.isRejected ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>اعتماد ✓</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-400" />
                            <span>رفض ✕</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-slate-400 font-bold">
                  لا توجد إجابات صحيحة في هذا التصنيف
                </div>
              )}
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PHASE 6: RESULTS & PODIUM                                   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {phase === 'RESULTS' && (
          <div className="w-full flex flex-col gap-6 my-auto animate-in zoom-in-95">
            
            <div className="text-center flex flex-col items-center gap-1">
              <span className="text-xs font-mono font-black text-[#FFE79A]">ROUND {roundNumber} SUMMARY</span>
              <h2 className="text-3xl font-black text-white">🏆 نتائج الجولة</h2>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto w-full">
              {players.slice(0, 3).map((player, idx) => (
                <div
                  key={player.userId}
                  className={`p-5 rounded-3xl border flex flex-col items-center text-center gap-3 shadow-2xl relative ${
                    idx === 0
                      ? 'bg-gradient-to-b from-[#0A331B] to-[#041B0E] border-[#FFE79A] scale-105 shadow-[0_0_30px_rgba(255,231,154,0.4)]'
                      : 'bg-[#041B0E]/80 border-white/10'
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={player.avatarUrl} 
                      alt={player.displayName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#FFE79A] shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 text-xl">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white truncate max-w-[160px]">
                      {player.displayName}
                    </h3>
                    <span className="text-xs font-mono text-[#00A859]">
                      {player.username}
                    </span>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[10px] font-mono">
                    <span className="text-[#FFE79A]">فريد: {player.uniqueAnswers}</span>
                    <span className="text-slate-400">مكرر: {player.duplicateAnswers}</span>
                  </div>

                  <span className="px-4 py-1.5 rounded-full bg-[#FFE79A] text-slate-950 font-black text-sm font-mono shadow-md">
                    +{player.roundScore} نقطة
                  </span>
                </div>
              ))}
            </div>

            {/* Next Round Button */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setRoundNumber(prev => prev + 1);
                  startRegistration();
                }}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#006C35] via-[#00A859] to-[#006C35] text-white text-sm font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer border border-[#FFE79A]/40"
              >
                <span>بدء الجولة التالية 🚀</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. LIVE ACTIVITY TICKER & HOST DRAWER                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Live Activity Ticker */}
        <div className="p-4 rounded-2xl bg-[#06170D] border border-white/10 flex flex-col gap-2.5">
          <span className="text-xs font-black text-[#FFE79A] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#00A859]" />
            <span>آخر أحداث الشات المباشر</span>
          </span>

          <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
            {activityLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-white font-medium flex items-center gap-1.5">
                  <span>{log.icon}</span>
                  <span>{log.text}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Standings Widget */}
        <div className="p-4 rounded-2xl bg-[#06170D] border border-white/10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#FFE79A] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#C69214]" />
              <span>ترتيب البطولة التراكمي ({players.length} لاعب)</span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
            {players.slice(0, 5).map((p, idx) => (
              <div key={p.userId} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#FFE79A] font-bold">#{idx + 1}</span>
                  <span className="text-white font-bold">{p.displayName}</span>
                </div>
                <span className="font-mono text-[#00A859] font-black">{p.totalScore} نقطة</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. HOST CONFIGURATION DRAWER / MODAL                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#052413] to-[#021108] border-2 border-[#00A859] p-6 shadow-2xl flex flex-col gap-5 text-white">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#FFE79A]" />
                <span>إعدادات باص الطيبين</span>
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Game Mode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#E2D4B7]">وضع اللعبة:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['CLASSIC', 'SPEED', 'LAST_BUS', 'GOLDEN_BUS'] as BusGameMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setConfig(prev => ({ ...prev, mode: m }))}
                    className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      config.mode === m
                        ? 'bg-[#00A859] text-white border-[#FFE79A]'
                        : 'bg-white/5 text-slate-300 border-white/10'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#E2D4B7]">مدة الجولة (ثوانٍ):</label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 20, 30, 45].map(sec => (
                  <button
                    key={sec}
                    onClick={() => setConfig(prev => ({ ...prev, durationSeconds: sec }))}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      config.durationSeconds === sec
                        ? 'bg-[#C69214] text-slate-950 border-white'
                        : 'bg-white/5 text-slate-300 border-white/10'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#E2D4B7]">صعوبة الحروف:</label>
              <div className="grid grid-cols-4 gap-2">
                {(['EASY', 'NORMAL', 'HARD', 'EXTREME'] as BusLetterDifficulty[]).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setConfig(prev => ({ ...prev, difficulty: diff }))}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      config.difficulty === diff
                        ? 'bg-[#00A859] text-white border-[#FFE79A]'
                        : 'bg-white/5 text-slate-300 border-white/10'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#E2D4B7]">كلمة الدخول:</label>
                <input
                  type="text"
                  value={config.joinKeyword}
                  onChange={e => setConfig(prev => ({ ...prev, joinKeyword: e.target.value }))}
                  className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#E2D4B7]">كلمة الإنهاء:</label>
                <input
                  type="text"
                  value={config.finishKeyword}
                  onChange={e => setConfig(prev => ({ ...prev, finishKeyword: e.target.value }))}
                  className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#00A859] text-white text-xs font-black shadow-md cursor-pointer hover:bg-[#00C066] transition-colors"
            >
              حفظ الإعدادات ✓
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
