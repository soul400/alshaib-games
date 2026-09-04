'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MysteryRouletteQuestion, 
  MysteryRoulettePlayer, 
  MysteryRouletteCard, 
  MysteryRouletteGamePhase 
} from '@aep/types';
import { useStudioStore } from '../../store/useStudioStore';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { extractAllSeatNumbersFromComment } from '@aep/game-engines';
import { 
  Play, RotateCcw, Volume2, VolumeX, Users, 
  Trophy, Skull, Sparkles, Flame, Shield, 
  Disc3, UserPlus, HelpCircle, Target, Zap, Crown, Check
} from 'lucide-react';

interface Props {
  question?: MysteryRouletteQuestion;
  isAnswerRevealed?: boolean;
}

export function MysteryRouletteView({ question }: Props) {
  const { liveComments, tiktokEngine } = useStudioStore();
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  // Game Engine Core State Machine
  const [phase, setPhase] = useState<MysteryRouletteGamePhase>('IDLE');
  const [players, setPlayers] = useState<MysteryRoulettePlayer[]>([]);
  const [cards, setCards] = useState<MysteryRouletteCard[]>([]);
  const [currentHunter, setCurrentHunter] = useState<MysteryRoulettePlayer | null>(null);
  const [targetedCard, setTargetedCard] = useState<MysteryRouletteCard | null>(null);
  const [eliminatedVictim, setEliminatedVictim] = useState<MysteryRoulettePlayer | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [winner, setWinner] = useState<MysteryRoulettePlayer | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Wheel Spin State
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Synchronous State Guard & Refs for Real-Time Comment Processing
  const registeredUserIds = useRef<Set<string>>(new Set());
  const processedCommentIds = useRef<Set<string>>(new Set());
  const cardsRef = useRef<MysteryRouletteCard[]>([]);
  cardsRef.current = cards;
  const playersRef = useRef<MysteryRoulettePlayer[]>([]);
  playersRef.current = players;
  const phaseRef = useRef<MysteryRouletteGamePhase>(phase);
  phaseRef.current = phase;
  const currentHunterRef = useRef<MysteryRoulettePlayer | null>(currentHunter);
  currentHunterRef.current = currentHunter;

  // Mount Guard
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Helper: Shuffle Array (Fisher-Yates)
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ══════════════════════════════════════════════════════════════
  // 1. REGISTRATION LISTENER ('العب' in Chat)
  // ══════════════════════════════════════════════════════════════
  const processRegistrationComment = useCallback((c: any) => {
    if (!c) return;
    const rawText = (c.comment || c.commentText || '').trim().toLowerCase();
    const normText = rawText.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');

    const isMatch = normText.includes('العب') || normText.includes('لعب') || normText.includes('play') || normText.includes('شارك');

    if (isMatch) {
      const uid = String(c.userId || c.username || `user-${Date.now()}`).toLowerCase();
      if (!registeredUserIds.current.has(uid)) {
        registeredUserIds.current.add(uid);
        const newPlayer: MysteryRoulettePlayer = {
          id: `mr-p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: uid,
          username: c.username || `@user_${Math.floor(Math.random() * 900 + 100)}`,
          displayName: c.displayName || c.authorName || c.username || 'متسابق تيك توك',
          avatarUrl: c.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
          joinedAt: Date.now(),
          status: 'ACTIVE'
        };
        setPlayers(prev => [...prev, newPlayer]);
        if (!isAudioMuted) soundFX.play('score_update');
      }
    }
  }, [isAudioMuted]);

  useEffect(() => {
    if (phase !== 'REGISTRATION') return;

    liveComments.forEach(c => processRegistrationComment(c));

    if (tiktokEngine) {
      const handleEngineComment = (c: any) => processRegistrationComment(c);
      tiktokEngine.onComment(handleEngineComment);
      return () => tiktokEngine.offComment(handleEngineComment);
    }
  }, [phase, liveComments, tiktokEngine, processRegistrationComment]);

  // Host Tool: 1-Click Add Test Participants
  const handleAddMockParticipants = (count: number = 6) => {
    const arabNames = ['سلطان', 'نورة', 'فهد', 'ريما', 'عبدالله', 'سارة', 'ياسر', 'منيرة', 'خالد', 'أحمد', 'مشاعل', 'بندر', 'فيصل', 'عمر', 'خلود'];
    const newItems: MysteryRoulettePlayer[] = [];

    for (let i = 0; i < count; i++) {
      const name = arabNames[Math.floor(Math.random() * arabNames.length)];
      const num = Math.floor(Math.random() * 9000 + 1000);
      const uid = `mock-${Date.now()}-${i}-${num}`;

      if (!registeredUserIds.current.has(uid)) {
        registeredUserIds.current.add(uid);
        newItems.push({
          id: `mr-p-${Date.now()}-${i}`,
          userId: uid,
          username: `@${name.toLowerCase()}_${num}`,
          displayName: `${name} ${num.toString().substring(0, 2)}`,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
          joinedAt: Date.now(),
          status: 'ACTIVE'
        });
      }
    }

    setPlayers(prev => [...prev, ...newItems]);
    if (!isAudioMuted) soundFX.play('score_update');
  };

  // ══════════════════════════════════════════════════════════════
  // 2. SETUP MYSTERY CARDS WITH RANDOMLY RESHUFFLED NUMBERS
  // ══════════════════════════════════════════════════════════════
  const setupMysteryCardsForRound = useCallback((activePotentialVictims: MysteryRoulettePlayer[]) => {
    // Generate distinct random numbers for each card (e.g. 1 to N shuffled)
    const numbersPool = shuffleArray(Array.from({ length: activePotentialVictims.length }, (_, i) => i + 1));
    const shuffledVictims = shuffleArray(activePotentialVictims);

    const generatedCards: MysteryRouletteCard[] = shuffledVictims.map((player, idx) => ({
      id: `card-r${roundNumber}-${player.id}`,
      cardNumber: numbersPool[idx],
      player,
      isFlipped: false,
      isEliminated: false
    }));

    // Sort cards by card number ascending so they are displayed neatly (1, 2, 3...)
    generatedCards.sort((a, b) => a.cardNumber - b.cardNumber);

    setCards(generatedCards);
  }, [roundNumber]);

  // ══════════════════════════════════════════════════════════════
  // 3. START GAME / ROULETTE SPIN FOR HUNTER SELECTION
  // ══════════════════════════════════════════════════════════════
  const handleStartGame = () => {
    const activePlayers = players.filter(p => p.status === 'ACTIVE');
    if (activePlayers.length < 2) {
      alert('تحتاج اللعبة إلى متسابقَين على الأقل للبدء!');
      return;
    }

    if (!isAudioMuted) soundFX.play('round_start');
    setRoundNumber(1);
    setPhase('READY');
    setWinner(null);
    setEliminatedVictim(null);
    setCurrentHunter(null);
    setTargetedCard(null);
  };

  const spinRouletteWheel = (activePlayers: MysteryRoulettePlayer[]) => {
    if (isSpinning || activePlayers.length < 2) return;

    setPhase('SPINNING');
    setIsSpinning(true);
    setTargetedCard(null);
    setEliminatedVictim(null);
    if (!isAudioMuted) soundFX.play('wheel_spin');

    // Randomly pick winning Hunter from active players
    const randomIndex = Math.floor(Math.random() * activePlayers.length);
    const selectedHunter = activePlayers[randomIndex];

    // Mathematical accuracy: calculate rotation so pointer at 12 o'clock points EXACTLY to the center of the selected slice
    const total = activePlayers.length;
    const sliceAngle = 360 / total;
    const midAngle = randomIndex * sliceAngle + (sliceAngle / 2);
    const desiredMod = (360 - midAngle) % 360;
    const currentMod = ((wheelRotation % 360) + 360) % 360;
    let delta = desiredMod - currentMod;
    if (delta <= 0) delta += 360;
    const extraSpins = 360 * 6; // 6 full rotations
    const targetRotation = wheelRotation + extraSpins + delta;

    setWheelRotation(targetRotation);

    // After spin finishes (3.5 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      setCurrentHunter(selectedHunter);
      setPhase('HUNTER_SELECTED');
      if (!isAudioMuted) soundFX.play('correct_answer');

      // Update player statuses: Hunter is active, potential victims setup cards
      const potentialVictims = activePlayers.filter(p => p.id !== selectedHunter.id);
      setupMysteryCardsForRound(potentialVictims);

      // Transition to CARD_SELECTION phase where Hunter selects a mystery card number
      setTimeout(() => {
        setPhase('CARD_SELECTION');
      }, 2500);
    }, 3500);
  };

  // ══════════════════════════════════════════════════════════════
  // 4. CARD SELECTION & 3D FLIP ELIMINATION ENGINE
  // ══════════════════════════════════════════════════════════════
  const handleSelectCardByNumber = useCallback((cardNumber: number) => {
    if (phaseRef.current !== 'CARD_SELECTION') return;

    const currentCards = [...cardsRef.current];
    const targetCard = currentCards.find(c => c.cardNumber === cardNumber && !c.isFlipped && !c.isEliminated);

    if (!targetCard) return;

    // Lock phase & set targeted card
    setPhase('FLIPPING_CARD');
    setTargetedCard(targetCard);
    if (!isAudioMuted) soundFX.play('box_open');

    // Trigger 3D Card Flip Animation (flip card 180deg to reveal victim)
    setTimeout(() => {
      targetCard.isFlipped = true;
      targetCard.isEliminated = true;
      setCards([...currentCards]);

      const victim = targetCard.player;
      setEliminatedVictim(victim);
      setPhase('REVEALED_VICTIM');
      if (!isAudioMuted) soundFX.play('wrong_answer');

      // Update Player Status to ELIMINATED
      setPlayers(prev => prev.map(p => {
        if (p.id === victim.id) {
          return {
            ...p,
            status: 'ELIMINATED',
            eliminatedInRound: roundNumber
          };
        }
        return p;
      }));

      // Check if Game Over or Next Round
      setTimeout(() => {
        const remainingAlive = playersRef.current.filter(p => p.id !== victim.id && p.status !== 'ELIMINATED');

        if (remainingAlive.length === 1) {
          // 🏆 CHAMPION WINNER!
          const champion = remainingAlive[0];
          setWinner(champion);
          setPhase('WINNER');
          if (!isAudioMuted) {
            soundFX.play('winner_announcement');
            soundFX.play('show_end');
          }
          triggerVisualEffect('confetti');

          if (tiktokEngine && champion.userId) {
            tiktokEngine.awardPoints({
              userId: champion.userId,
              username: champion.username,
              displayName: champion.displayName,
              avatarUrl: champion.avatarUrl,
              points: 2000
            });
          }
        } else {
          // Next Round: Prepare for next round without auto-spinning
          const nextRound = roundNumber + 1;
          setRoundNumber(nextRound);
          setCurrentHunter(null);
          setTargetedCard(null);
          setEliminatedVictim(null);
          setPhase('READY'); // Ready and waiting for host to spin wheel!
        }
      }, 3500);
    }, 1200);
  }, [roundNumber, isAudioMuted, tiktokEngine]);

  // Comment listener during CARD_SELECTION (Hunter types card number e.g. "7" in chat)
  const handleProcessHunterComment = useCallback((c: any) => {
    if (phaseRef.current !== 'CARD_SELECTION') return;
    if (!c) return;

    const commentId = c.id || `${c.userId}-${c.timestamp || Date.now()}`;
    if (processedCommentIds.current.has(commentId)) return;
    processedCommentIds.current.add(commentId);

    const uid = String(c.userId || '').toLowerCase();
    const uname = String(c.username || '').toLowerCase();
    const hunter = currentHunterRef.current;

    // Check if the comment comes from the current selected Hunter
    if (hunter) {
      const hunterUid = String(hunter.userId || '').toLowerCase();
      const hunterUname = String(hunter.username || '').toLowerCase();

      if (uid === hunterUid || uname === hunterUname || (hunterUid.startsWith('mock-') && true)) {
        const rawText = (c.comment || c.commentText || '').trim();
        const extractedNumbers = extractAllSeatNumbersFromComment(rawText);
        if (extractedNumbers && extractedNumbers.length > 0) {
          const chosenNumber = extractedNumbers[0];
          handleSelectCardByNumber(chosenNumber);
        }
      }
    }
  }, [handleSelectCardByNumber]);

  useEffect(() => {
    if (phase !== 'CARD_SELECTION') return;

    liveComments.forEach(c => handleProcessHunterComment(c));

    if (tiktokEngine) {
      const handleEngineComment = (c: any) => handleProcessHunterComment(c);
      tiktokEngine.onComment(handleEngineComment);
      return () => tiktokEngine.offComment(handleEngineComment);
    }
  }, [phase, liveComments, tiktokEngine, handleProcessHunterComment]);

  // Reset Game Helper
  const handleFullResetGame = () => {
    registeredUserIds.current.clear();
    processedCommentIds.current.clear();
    setPlayers([]);
    setCards([]);
    setRoundNumber(1);
    setCurrentHunter(null);
    setTargetedCard(null);
    setEliminatedVictim(null);
    setWinner(null);
    setPhase('IDLE');
  };

  // Stats
  const totalRegisteredCount = players.length;
  const alivePlayers = players.filter(p => p.status !== 'ELIMINATED');
  const aliveCount = alivePlayers.length;
  const eliminatedCount = totalRegisteredCount - aliveCount;

  if (!hasMounted) {
    return (
      <div className="w-full max-w-7xl min-h-[88vh] flex items-center justify-center p-6 rounded-3xl bg-[#08090C] border border-[#1E2240]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#D6A84F] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono font-bold text-slate-400">جاري تحميل حلبة الروليت الغامض...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl min-h-[88vh] flex flex-col items-center justify-between p-3 sm:p-6 text-white dir-rtl relative overflow-hidden rounded-3xl bg-[#08090C] border border-[#232736] shadow-[0_30px_100px_rgba(0,0,0,0.95)]">
      
      {/* Top Header Command Bar */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 z-20 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <HelpCircle className="w-6 h-6 animate-pulse text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>الروليت الغامض 🔮</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                MYSTERY ROULETTE
              </span>
            </h1>
            <span className="text-[11px] text-slate-400 font-bold">
              الجولة #{roundNumber} • {phase === 'SPINNING' ? '⚡ روليت الصياد يدور...' : phase === 'CARD_SELECTION' ? `🎯 الصياد (${currentHunter?.displayName}) يختار رقم بطاقة غامضة!` : 'إقصاء غامض بدون معرفة الضحية'}
            </span>
          </div>
        </div>

        {/* Audio Mute & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isAudioMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
          <button
            onClick={handleFullResetGame}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
            title="إعادة ضبط اللعبة بالكامل"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 🔴 MAIN SCREEN 1: REGISTRATION & LOBBY                        */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {(phase === 'IDLE' || phase === 'REGISTRATION') && (
        <div className="w-full flex-1 flex flex-col items-center justify-between gap-6 py-4 z-10">
          
          {/* Hero Banner */}
          <div className="flex flex-col items-center text-center gap-3 max-w-2xl mt-2">
            <div className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>بطاقات معدنية غامضة وإقصاء حماسي</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              🔮 الروليت الغامض
            </h2>
            <p className="text-sm text-slate-300 font-bold leading-relaxed">
              تريد المشاركة؟ اكتب كلمة <span className="text-amber-400 text-lg px-3 py-1 rounded-xl bg-amber-500/20 font-black border border-amber-400/40 mx-1">العب</span> في تعليقات البث المباشر للدخول فوراً!
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {phase === 'IDLE' && (
              <button
                onClick={() => setPhase('REGISTRATION')}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-lg flex items-center gap-3 shadow-[0_10px_35px_rgba(245,158,11,0.5)] hover:scale-105 transition-all cursor-pointer"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>فتح باب التسجيل في الشات</span>
              </button>
            )}

            {phase === 'REGISTRATION' && (
              <button
                onClick={handleStartGame}
                className="px-12 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-xl flex items-center gap-3 shadow-[0_10px_40px_rgba(16,185,129,0.5)] hover:scale-105 transition-all cursor-pointer animate-pulse"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>▶ بدء اللعبة ({players.length} متسابق)</span>
              </button>
            )}

            <button
              onClick={() => handleAddMockParticipants(6)}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>+ إضافة 6 مشاركين تجريبيين</span>
            </button>
          </div>

          {/* Registered Players Grid */}
          <div className="w-full p-6 rounded-3xl bg-[#121424] border border-[#232736] flex flex-col gap-4 max-h-[380px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">المتسابقون المسجلون ({players.length})</h3>
              </div>
              <span className="text-xs text-amber-300 font-mono font-black">
                {players.length >= 2 ? `✅ جاهز للبدء (${players.length} متسابق)` : '⚠️ بانتظار تسجيل متسابقَين على الأقل'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 overflow-y-auto pr-1">
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-[#181B30] border border-[#2B304D] flex flex-col items-center text-center gap-2 animate-in zoom-in-95"
                >
                  <div className="relative">
                    <img src={p.avatarUrl} alt={p.displayName} className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-amber-400 text-[10px] font-mono font-black flex items-center justify-center text-amber-300">
                      #{idx + 1}
                    </span>
                  </div>
                  <span className="text-xs font-black text-white truncate w-full">{p.displayName}</span>
                </div>
              ))}

              {players.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 text-sm font-bold">
                  لم يسجل أي متسابق بعد... اكتب كلمة <strong className="text-amber-400">"العب"</strong> في الشات!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 🔴 MAIN SCREEN 2: ACTIVE GAME ARENA (Roulette & Mystery Cards) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {phase !== 'IDLE' && phase !== 'REGISTRATION' && (
        <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center my-2">
          
          {/* LEFT SIDEBAR STATS (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="p-4 rounded-2xl bg-[#121424] border border-[#232736] shadow-lg flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
                <Users className="w-4 h-4 text-purple-400" />
                <span>المشاركون</span>
              </div>
              <span className="text-3xl font-black font-mono text-white">{totalRegisteredCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#121424] border border-emerald-500/30 shadow-lg flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold mb-1">
                <span>👤</span>
                <span>المتبقون</span>
              </div>
              <span className="text-3xl font-black font-mono text-emerald-400">{aliveCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#121424] border border-rose-500/30 shadow-lg flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-xs text-rose-300 font-bold mb-1">
                <Skull className="w-4 h-4 text-rose-400" />
                <span>المستبعدون</span>
              </div>
              <span className="text-3xl font-black font-mono text-rose-400">{eliminatedCount}</span>
            </div>
          </div>

          {/* 🎡 CENTER MAIN ARENA (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center relative min-h-[540px]">
            
            {/* TOP SPOTLIGHT BANNER */}
            <div className="w-full max-w-xl mb-4 z-30 flex flex-col items-center">
              <div className="w-full py-3 px-6 rounded-2xl bg-[#121424]/95 border border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.25)] flex items-center justify-between backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-mono font-black text-xs">
                    الجولة #{roundNumber}
                  </span>
                  <div>
                    {phase === 'SPINNING' ? (
                      <span className="text-xs font-black text-amber-300 animate-pulse flex items-center gap-1.5">
                        <Disc3 className="w-4 h-4 animate-spin" />
                        <span>روليت الصياد يدور...</span>
                      </span>
                    ) : currentHunter ? (
                      <div className="flex items-center gap-2">
                        <img src={currentHunter.avatarUrl} alt={currentHunter.displayName} className="w-7 h-7 rounded-full border border-amber-400 object-cover" />
                        <span className="text-xs font-black text-white">
                          الصياد: <strong className="text-amber-400">{currentHunter.displayName}</strong>
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-slate-300">الروليت الغامض</span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-mono font-bold text-amber-300">
                  {phase === 'CARD_SELECTION' ? (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 animate-bounce">
                      🎯 اكتب رقم البطاقة في الشات!
                    </span>
                  ) : (
                    <span>🔮 {cards.length} بطاقات غامضة</span>
                  )}
                </div>
              </div>
            </div>

            {/* 🎡 1. PROFESSIONAL SVG ROULETTE WHEEL WITH UPRIGHT READABLE TEXT & SPIN BUTTON */}
            {(phase === 'READY' || phase === 'SPINNING' || phase === 'HUNTER_SELECTED') && (
              <div className="flex flex-col items-center justify-center my-2 relative animate-in zoom-in-95 w-full">
                {/* 🎯 SHARP GOLD POINTER ARROW (EXACT 12 O'CLOCK) */}
                <div className="w-0 h-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-t-[36px] border-t-amber-400 z-40 -mb-5 drop-shadow-[0_4px_18px_rgba(245,158,11,1)]" />

                {/* Outer Wheel Circle (Enlarged HD Size) */}
                <div className="relative flex items-center justify-center">
                  <div 
                    className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[500px] md:h-[500px] rounded-full border-4 border-amber-400 relative shadow-[0_0_80px_rgba(245,158,11,0.5)] transition-transform duration-[3500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                  >
                    <svg viewBox="0 0 500 500" className="w-full h-full rounded-full">
                      <defs>
                        {alivePlayers.map((player, idx) => (
                          <clipPath key={`clip-${player.id}`} id={`avatar-clip-${idx}`}>
                            <circle cx="0" cy="-10" r="20" />
                          </clipPath>
                        ))}
                      </defs>

                      {alivePlayers.map((player, idx) => {
                        const total = alivePlayers.length;
                        const sliceAngle = 360 / total;
                        const startAngle = idx * sliceAngle;
                        const endAngle = (idx + 1) * sliceAngle;
                        const midAngle = startAngle + sliceAngle / 2;

                        const radStart = (startAngle - 90) * (Math.PI / 180);
                        const radEnd = (endAngle - 90) * (Math.PI / 180);
                        const radMid = (midAngle - 90) * (Math.PI / 180);

                        const cx = 250;
                        const cy = 250;
                        const radius = 245;

                        const x1 = cx + radius * Math.cos(radStart);
                        const y1 = cy + radius * Math.sin(radStart);
                        const x2 = cx + radius * Math.cos(radEnd);
                        const y2 = cy + radius * Math.sin(radEnd);

                        const largeArc = sliceAngle > 180 ? 1 : 0;
                        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        const textDistance = 155;
                        const tx = cx + textDistance * Math.cos(radMid);
                        const ty = cy + textDistance * Math.sin(radMid);

                        let textRotation = midAngle;
                        if (midAngle > 90 && midAngle < 270) {
                          textRotation += 180;
                        }

                        const fillColors = ['#181A30', '#101222', '#1C2038', '#141628', '#221C30', '#191528'];
                        const fillColor = fillColors[idx % fillColors.length];

                        return (
                          <g key={player.id}>
                            <path d={pathData} fill={fillColor} stroke="#D6A84F" strokeWidth="2" strokeOpacity="0.7" />
                            <g transform={`translate(${tx}, ${ty}) rotate(${textRotation})`}>
                              <image
                                href={player.avatarUrl}
                                x="-20"
                                y="-30"
                                width="40"
                                height="40"
                                clipPath={`url(#avatar-clip-${idx})`}
                              />
                              <text
                                x="0"
                                y="24"
                                textAnchor="middle"
                                fill="#FFFFFF"
                                fontSize="13"
                                fontWeight="900"
                                fontFamily="sans-serif"
                                style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.9))' }}
                              >
                                {player.displayName.length > 12 ? `${player.displayName.substring(0, 10)}..` : player.displayName}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* 🎯 CENTRAL GOLD SPIN BUTTON HUB */}
                  <button
                    onClick={() => {
                      if (!isSpinning && alivePlayers.length >= 2) {
                        spinRouletteWheel(alivePlayers);
                      }
                    }}
                    disabled={isSpinning}
                    className={`absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm border-4 border-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.9)] flex flex-col items-center justify-center gap-1 z-30 transition-all ${
                      isSpinning ? 'opacity-80 scale-95 cursor-not-allowed' : 'hover:scale-110 cursor-pointer animate-pulse'
                    }`}
                  >
                    <Disc3 className={`w-7 h-7 text-slate-950 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span className="font-extrabold">{isSpinning ? 'يدور...' : 'تدوير 🎯'}</span>
                  </button>
                </div>

                {/* 🎯 PROMINENT ACTION BUTTON BELOW WHEEL */}
                <div className="mt-6 flex items-center gap-3 z-30">
                  <button
                    onClick={() => {
                      if (!isSpinning && alivePlayers.length >= 2) {
                        spinRouletteWheel(alivePlayers);
                      }
                    }}
                    disabled={isSpinning}
                    className={`px-12 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-2xl transition-all cursor-pointer ${
                      isSpinning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:scale-105 shadow-[0_8px_30px_rgba(245,158,11,0.6)]'
                    }`}
                  >
                    <Disc3 className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span>{isSpinning ? 'جارٍ دوران عجلة الروليت...' : '🎯 تدوير العجلة لاختيار الصياد (Start Spin)'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 🔮 2. MYSTERY CARDS GRID (Dark Metallic Obsidian Cards with Gold Numbers) */}
            {(phase === 'CARD_SELECTION' || phase === 'FLIPPING_CARD' || phase === 'REVEALED_VICTIM' || phase === 'NEXT_ROUND') && (
              <div className="w-full flex flex-col items-center gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl max-h-[460px] overflow-y-auto p-2">
                  {cards.map((card) => {
                    const isTarget = targetedCard?.id === card.id;

                    return (
                      <div
                        key={card.id}
                        onClick={() => {
                          if (phase === 'CARD_SELECTION') {
                            handleSelectCardByNumber(card.cardNumber);
                          }
                        }}
                        style={{ perspective: 1000 }}
                        className={`w-32 h-44 sm:w-36 sm:h-48 rounded-2xl cursor-pointer transition-all duration-500 relative select-none ${
                          card.isFlipped ? 'hover:scale-100' : 'hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                        }`}
                      >
                        <div 
                          className={`w-full h-full relative transition-transform duration-700 ${
                            card.isFlipped ? '[transform:rotateY(180deg)]' : ''
                          }`}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* 🔮 FRONT FACE: DARK METALLIC OBSIDIAN GOLD MYSTERY CARD */}
                          <div 
                            className={`absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-between p-3 bg-gradient-to-b from-[#141628] via-[#08090C] to-[#141628] [backface-visibility:hidden] overflow-hidden shadow-2xl ${
                              isTarget ? 'border-amber-400 ring-4 ring-amber-400/50 scale-105' : 'border-[#D6A84F]/60 hover:border-amber-300'
                            }`}
                          >
                            {/* Inner Metallic Gold Border Trim */}
                            <div className="absolute inset-1.5 rounded-xl border border-[#D6A84F]/30 pointer-events-none" />

                            {/* Background Watermark Question Mark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none font-black text-7xl text-[#D6A84F]">
                              ?
                            </div>

                            {/* Top Badge */}
                            <div className="z-10 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-[9px] font-mono font-black text-amber-300">
                              MYSTERY CARD
                            </div>

                            {/* Center: Large Sharp Gold Number */}
                            <div className="z-10 my-auto flex flex-col items-center">
                              <span className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2B2] via-[#E5BE6C] to-[#B38528] drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                                {card.cardNumber}
                              </span>
                            </div>

                            {/* Bottom Label */}
                            <div className="z-10 text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <HelpCircle className="w-3 h-3 text-amber-400" />
                              <span>بطاقة غامضة</span>
                            </div>
                          </div>

                          {/* 💥 BACK FACE: REVEALED VICTIM (Flipped 180deg) */}
                          <div 
                            className="absolute inset-0 rounded-2xl border-2 border-rose-500 bg-gradient-to-b from-rose-950 via-[#12080E] to-rose-950 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-between p-3 overflow-hidden shadow-2xl"
                          >
                            <div className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[9px] font-mono font-black text-rose-300">
                              مستبعد 💥
                            </div>

                            <div className="flex flex-col items-center gap-1 my-auto">
                              <img
                                src={card.player.avatarUrl}
                                alt={card.player.displayName}
                                className="w-14 h-14 rounded-full object-cover border-2 border-rose-500 shadow-md filter grayscale"
                              />
                              <span className="text-xs font-black text-white text-center truncate max-w-[110px]">
                                {card.player.displayName}
                              </span>
                            </div>

                            <div className="w-full py-1 rounded-xl bg-rose-600/30 text-rose-300 font-mono font-black text-[10px] text-center border border-rose-500/40">
                              تم الإقصاء
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR CONTROLS (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {phase === 'CARD_SELECTION' && (
              <div className="p-4 rounded-2xl bg-[#121424] border border-amber-500/30 flex flex-col gap-2.5 shadow-lg">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span>اختيار البطاقة الغامضة:</span>
                </div>
                <p className="text-[11px] text-slate-300 font-bold leading-relaxed">
                  عندما يكتب الصياد <strong className="text-amber-400">({currentHunter?.displayName})</strong> رقم البطاقة في الشات، سيتم فتحها فوراً!
                </p>

                {/* Host Manual Quick Select */}
                <div className="flex flex-col gap-1.5 mt-1 border-t border-white/10 pt-2">
                  <span className="text-[10px] text-slate-400 font-bold">أو اضغط على رقم البطاقة مباشرة:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cards.filter(c => !c.isFlipped && !c.isEliminated).map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCardByNumber(c.cardNumber)}
                        className="w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-400/40 text-xs font-mono font-black transition-all cursor-pointer flex items-center justify-center shadow-sm"
                      >
                        {c.cardNumber}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ❌ MODAL: REVEALED VICTIM BANNER                              */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {phase === 'REVEALED_VICTIM' && eliminatedVictim && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1C1428] via-[#14152A] to-[#1C1428] border-2 border-rose-500 shadow-[0_0_80px_rgba(244,63,94,0.6)] flex flex-col items-center text-center gap-4 max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-3xl text-rose-400 font-black shadow-lg">
              🔮
            </div>

            <div>
              <span className="text-xs font-mono font-black text-rose-400 uppercase tracking-widest block">
                انكشفت البطاقة الغامضة!
              </span>
              <h2 className="text-3xl font-black text-white mt-1">{eliminatedVictim.displayName}</h2>
            </div>

            <div className="relative">
              <img
                src={eliminatedVictim.avatarUrl}
                alt={eliminatedVictim.displayName}
                className="w-24 h-24 rounded-full object-cover border-4 border-rose-500 shadow-2xl filter grayscale"
              />
              <span className="absolute -bottom-2 -right-2 text-2xl">💥</span>
            </div>

            <p className="text-xs text-slate-300 font-bold">
              تم إقصاء المتسابق من المنافسة في <strong className="text-rose-400 font-mono">الجولة #{roundNumber}</strong>
            </p>

            <span className="text-[11px] text-amber-300 font-bold animate-pulse">
              جاري الانتقال للدور التالي خلال 3 ثوانٍ...
            </span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 🏆 MODAL: CHAMPION WINNER BANNER                              */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {phase === 'WINNER' && winner && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#282014] via-[#1A1409] to-[#282014] border-2 border-amber-400 shadow-[0_0_100px_rgba(245,158,11,0.7)] flex flex-col items-center text-center gap-4 max-w-md w-full">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl shadow-lg border-2 border-white/20 animate-bounce">
              👑
            </div>

            <div>
              <span className="text-xs font-mono font-black text-amber-300 uppercase tracking-widest block">
                بطل الروليت الغامض 🔮
              </span>
              <h2 className="text-3xl font-black text-white mt-1">{winner.displayName}</h2>
            </div>

            <div className="relative">
              <img
                src={winner.avatarUrl}
                alt={winner.displayName}
                className="w-28 h-28 rounded-full object-cover border-4 border-amber-400 shadow-2xl ring-4 ring-amber-400/40"
              />
              <span className="absolute -bottom-2 -right-2 text-3xl">🏆</span>
            </div>

            <div className="px-6 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-sm font-mono">
              +2,000 نقطة فوز 💎
            </div>

            <button
              onClick={handleFullResetGame}
              className="mt-2 px-8 py-3 rounded-xl gold-cta-button text-xs font-black cursor-pointer shadow-lg"
            >
              لعبة جديدة 🔄
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
