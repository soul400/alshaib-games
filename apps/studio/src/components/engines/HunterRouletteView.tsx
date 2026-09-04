'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HunterRouletteQuestion, HunterRouletteParticipant, HunterGamePhase } from '@aep/types';
import { useStudioStore } from '../../store/useStudioStore';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { 
  Crosshair, Users, Play, Lock, RefreshCw, Trophy, Skull, ShieldCheck, 
  Clock, Flame, Sparkles, AlertTriangle, Target, Crown, Volume2, CheckCircle, UserPlus, Plus,
  Activity, BarChart3
} from 'lucide-react';

interface Props {
  question: HunterRouletteQuestion;
  isAnswerRevealed?: boolean;
}

// Preset color palette for Fortune Wheel Slices
const SLICE_COLORS = [
  '#7C3AED', '#F59E0B', '#00D9FF', '#EF4444', '#10B981', '#EC4899', 
  '#6366F1', '#D97706', '#0284C7', '#DC2626', '#059669', '#DB2777'
];

export function HunterRouletteView({ question }: Props) {
  const { liveComments, tiktokEngine } = useStudioStore();

  const [phase, setPhase] = useState<HunterGamePhase>('IDLE');
  const [participants, setParticipants] = useState<HunterRouletteParticipant[]>([]);
  const [currentShooter, setCurrentShooter] = useState<HunterRouletteParticipant | null>(null);
  const [currentTarget, setCurrentTarget] = useState<HunterRouletteParticipant | null>(null);
  const [isLoadedShot, setIsLoadedShot] = useState<boolean | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [winner, setWinner] = useState<HunterRouletteParticipant | null>(null);

  // Wheel Physics Rotation Angle
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // 🎯 Realistic 6-Chamber Revolver Cylinder State
  const [cylinderChamber, setCylinderChamber] = useState<number>(0);
  const [consecutiveBlanks, setConsecutiveBlanks] = useState<number>(0);

  // 🔓 Rare Revive Gate State (بوابة الإحياء النادرة)
  const [isReviveGateOpen, setIsReviveGateOpen] = useState<boolean>(false);
  const [reviveCountUsed, setReviveCountUsed] = useState<number>(0);
  const [revivedPlayer, setRevivedPlayer] = useState<HunterRouletteParticipant | null>(null);

  // 🎡 Anti-consecutive shooter selection tracking (max 2 times in a row)
  const lastSelectedShooterIdRef = useRef<string | null>(null);
  const consecutiveShooterCountRef = useRef<number>(0);

  const registeredUserIds = useRef<Set<string>>(new Set());
  const shotExecutedThisRound = useRef<boolean>(false);
  const targetSelectionStartedAtRef = useRef<number>(0);

  // Helper to normalize Arabic digits
  const normalizeArabicDigits = (str: string) => {
    return str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  };

  // Helper to process incoming comments for "العب" registration
  const processRegistrationComment = useCallback((c: any) => {
    if (!c) return;
    const rawText = (c.comment || c.commentText || '').trim().toLowerCase();
    
    // Arabic Normalization: (أ/إ/آ -> ا, ة -> ه, ى -> ي)
    const normText = rawText.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
    
    const isMatch = normText.includes('العب') || normText.includes('لعب') || normText.includes('play') || normText.includes('شارك');

    if (isMatch) {
      const uid = String(c.userId || c.username || `user-${Date.now()}`).toLowerCase();
      if (!registeredUserIds.current.has(uid)) {
        registeredUserIds.current.add(uid);
        const newP: HunterRouletteParticipant = {
          id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: uid,
          username: c.username || `@user_${Math.floor(Math.random() * 900 + 100)}`,
          displayName: c.displayName || c.authorName || c.username || 'متسابق تيك توك',
          avatarUrl: c.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
          isAlive: true,
          registeredAt: Date.now()
        };
        setParticipants(prev => [...prev, newP]);
        soundFX.play('score_update');
      }
    }
  }, []);

  // 1. Comment Listener for Registration ('العب')
  useEffect(() => {
    if (phase !== 'REGISTERING') return;

    // Scan existing store comments
    liveComments.forEach(c => processRegistrationComment(c));

    // Direct subscription to TikTok live engine comments
    if (tiktokEngine) {
      const handleEngineComment = (c: any) => {
        processRegistrationComment(c);
      };
      tiktokEngine.onComment(handleEngineComment);
      return () => {
        tiktokEngine.offComment(handleEngineComment);
      };
    }
  }, [phase, liveComments, tiktokEngine, processRegistrationComment]);

  // Manual Test Helpers: Add Mock Participants with 1-click
  const handleAddMockParticipant = (count: number = 1) => {
    const arabNames = ['أحمد', 'محمد', 'سارَة', 'خالد', 'عبدالله', 'فهد', 'عمر', 'ريم', 'ياسر', 'منيرة', 'سعود', 'نورة', 'علي', 'حسين', 'سلطان'];
    
    for (let i = 0; i < count; i++) {
      const randIdx = Math.floor(Math.random() * arabNames.length);
      const name = arabNames[randIdx];
      const num = Math.floor(Math.random() * 9000 + 1000);
      const uid = `mock-${Date.now()}-${i}-${num}`;
      
      if (!registeredUserIds.current.has(uid)) {
        registeredUserIds.current.add(uid);
        const newP: HunterRouletteParticipant = {
          id: `p-${Date.now()}-${i}`,
          userId: uid,
          username: `@${name.toLowerCase()}_${num}`,
          displayName: `${name} ${num.toString().substring(0, 2)}`,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
          isAlive: true,
          registeredAt: Date.now()
        };
        setParticipants(prev => [...prev, newP]);
      }
    }
    soundFX.play('score_update');
  };

  // 2. Start Registration
  const handleStartRegistration = () => {
    setPhase('REGISTERING');
    soundFX.play('round_start');
  };

  // 3. Lock Registration & Move to Wheel Phase
  const handleLockRegistration = () => {
    if (participants.length < 2) {
      alert('يجب انضمام متسابقين على الأقل للبدء! اضغط "+ إضافة مشاركين تجريبيين" أو اكتب "العب" في الشات.');
      return;
    }
    shotExecutedThisRound.current = false;
    setPhase('LOCKED');
    soundFX.play('box_open');
  };

  // 4. Spin Fortune Wheel (Anti-consecutive: max 2 in a row per person)
  const handleSpinRoulette = () => {
    const alivePlayers = participants.filter(p => p.isAlive);
    if (alivePlayers.length <= 1) {
      if (alivePlayers.length === 1) {
        setWinner(alivePlayers[0]);
        setPhase('GAME_OVER');
      }
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setPhase('SPINNING');
    shotExecutedThisRound.current = false;
    soundFX.play('wheel_spin');

    // Rule: Prevent selecting the same person more than 2 times in a row
    let eligibleShooters = alivePlayers;
    if (alivePlayers.length > 1 && lastSelectedShooterIdRef.current && consecutiveShooterCountRef.current >= 2) {
      const filtered = alivePlayers.filter(p => p.id !== lastSelectedShooterIdRef.current);
      if (filtered.length > 0) {
        eligibleShooters = filtered;
      }
    }

    // Pick random winner from eligible pool
    const selectedWinner = eligibleShooters[Math.floor(Math.random() * eligibleShooters.length)];
    const winnerIndex = alivePlayers.findIndex(p => p.id === selectedWinner.id);

    // Track consecutive selection
    if (lastSelectedShooterIdRef.current === selectedWinner.id) {
      consecutiveShooterCountRef.current += 1;
    } else {
      lastSelectedShooterIdRef.current = selectedWinner.id;
      consecutiveShooterCountRef.current = 1;
    }

    // Calculate Slice Angle
    const sliceAngle = 360 / alivePlayers.length;
    const sliceCenterAngle = winnerIndex * sliceAngle + sliceAngle / 2;

    // Pointer is at Top (270 degrees in SVG coordinates)
    const targetDeg = wheelRotation + 2520 + (270 - sliceCenterAngle - (wheelRotation % 360));
    setWheelRotation(targetDeg);

    // After 5.2 seconds (matching transition duration)
    setTimeout(() => {
      setIsSpinning(false);
      setCurrentShooter(selectedWinner);
      setPhase('WINNER_REVEALED');
      soundFX.play('winner_announcement');
      triggerVisualEffect('confetti');

      // 🔓 Check Rare Revive Gate Condition:
      // Must have eliminated players, aliveCount strictly > 3, and reviveCountUsed < 2 (max 2 per game)
      const currentEliminated = participants.filter(p => !p.isAlive);
      const canTriggerRevive = currentEliminated.length > 0 && alivePlayers.length > 3 && reviveCountUsed < 2;
      const willTriggerRevive = canTriggerRevive && Math.random() < 0.35; // ~35% rare chance

      setIsReviveGateOpen(willTriggerRevive);

      // Auto-transition to Target Selection after 4 seconds reveal banner
      setTimeout(() => {
        setPhase('TARGET_SELECTION');
        if (willTriggerRevive) {
          soundFX.play('winner_card');
        }
      }, 4000);

    }, 5200);
  };

  // 5. 100% Manual Target Selection (User chooses directly by clicking victim card or chat)
  const handleManualTargetSelect = useCallback((target: HunterRouletteParticipant) => {
    if (shotExecutedThisRound.current) return;
    shotExecutedThisRound.current = true;
    executeShotSequence(target);
  }, []);

  // 6. Revive Eliminated Player Action (إعادة لاعب إلى المنافسة)
  const handleRevivePlayer = useCallback((targetToRevive: HunterRouletteParticipant) => {
    if (shotExecutedThisRound.current) return;
    shotExecutedThisRound.current = true;
    setIsReviveGateOpen(false);
    setReviveCountUsed(r => r + 1);
    setRevivedPlayer(targetToRevive);
    setPhase('REVIVED');

    soundFX.play('winner_announcement');
    triggerVisualEffect('confetti');

    // Revive in participants array
    setParticipants(prev => {
      return prev.map(p => {
        if (p.id === targetToRevive.id) {
          return { ...p, isAlive: true };
        }
        return p;
      });
    });

    // Transition to next round after 4.5 seconds celebration
    setTimeout(() => {
      setRoundNumber(r => r + 1);
      shotExecutedThisRound.current = false;
      setRevivedPlayer(null);
      setPhase('LOCKED');
    }, 4500);
  }, []);

  // 7. Comment Listener for Target Selection & Revive (الصياد يكتب رقم الضحية أو أمر الإحياء في الشات)
  useEffect(() => {
    if (phase !== 'TARGET_SELECTION' || !currentShooter) return;

    // Record the exact time we entered TARGET_SELECTION to ignore all historical comments
    targetSelectionStartedAtRef.current = Date.now();

    const handleTargetComment = (c: any) => {
      if (!c) return;
      if (shotExecutedThisRound.current) return;

      // 🛡️ Strict filter: Ignore any comment from before this target selection started
      if (c.timestamp && c.timestamp < targetSelectionStartedAtRef.current - 500) {
        return;
      }

      const raw = (c.comment || c.commentText || c.text || '').trim();
      if (!raw) return;

      const norm = normalizeArabicDigits(raw.toLowerCase())
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .trim();

      // 🎯 SENDER CHECK:
      // If shooter is a real participant (not mock), ONLY their comments can choose the target!
      const isRealShooter = currentShooter && !currentShooter.userId.startsWith('mock-');
      const commentUid = String(c.userId || c.username || '').toLowerCase().replace('@', '');
      const shooterUid = String(currentShooter.userId || currentShooter.username || '').toLowerCase().replace('@', '');
      const shooterUsername = String(currentShooter.username || '').toLowerCase().replace('@', '');

      const isFromHunter = isRealShooter && (
        commentUid === shooterUid || 
        commentUid === shooterUsername ||
        (c.username && c.username.toLowerCase().replace('@', '') === shooterUsername)
      );

      // If it's a real shooter and the comment is from someone else, ignore it completely
      if (isRealShooter && !isFromHunter) {
        return;
      }

      const availableTargets = participants.filter(p => p.isAlive && p.id !== currentShooter.id);
      const eliminatedList = participants.filter(p => !p.isAlive);

      // 1. Check Revive Command if Revive Gate is Open
      if (isReviveGateOpen && eliminatedList.length > 0) {
        const isReviveKw = norm.includes('احياء') || norm.includes('اعادة') || norm.includes('انقاذ') || norm.includes('ارجاع') || norm.includes('revive') || norm.includes('قلب');

        if (isReviveKw) {
          const numMatch = norm.match(/\d+/);
          if (numMatch) {
            const idx = parseInt(numMatch[0], 10) - 1;
            if (idx >= 0 && idx < eliminatedList.length) {
              handleRevivePlayer(eliminatedList[idx]);
              return;
            }
          }

          const targetElim = eliminatedList.find(p => 
            norm.includes(p.displayName.toLowerCase()) || 
            norm.includes(p.username.toLowerCase().replace('@', ''))
          );
          if (targetElim) {
            handleRevivePlayer(targetElim);
            return;
          }

          // Fallback: If written "احياء" without number, revive the first eliminated
          if (eliminatedList.length > 0) {
            handleRevivePlayer(eliminatedList[0]);
            return;
          }
        }
      }

      // 2. Check Hunt / Target Selection by Number (e.g. "3", "صيد 3", "#3", "الضحية 3")
      // Standalone single number or prefixed with target keywords
      const standaloneNumMatch = norm.match(/^(?:صيد|هدف|ضحية|اختار|رقم)?\s*#?(\d+)$/);
      if (standaloneNumMatch) {
        const targetIdx = parseInt(standaloneNumMatch[1], 10) - 1;
        if (targetIdx >= 0 && targetIdx < availableTargets.length) {
          handleManualTargetSelect(availableTargets[targetIdx]);
          return;
        }
      }

      // Match by exact name or username
      const targetByName = availableTargets.find(p => {
        const pName = p.displayName.toLowerCase();
        const pUser = p.username.toLowerCase().replace('@', '');
        return norm === pName || norm === pUser || norm === `@${pUser}`;
      });
      if (targetByName) {
        handleManualTargetSelect(targetByName);
        return;
      }
    };

    // ⚡ ONLY listen to incoming live stream comments via event emitter.
    // NEVER replay the old liveComments buffer from the past!
    if (tiktokEngine) {
      tiktokEngine.onComment(handleTargetComment);
      return () => {
        tiktokEngine.offComment(handleTargetComment);
      };
    }
  }, [phase, currentShooter, participants, isReviveGateOpen, tiktokEngine, handleManualTargetSelect, handleRevivePlayer]);

  // Optional Random Quick Pick Button for Host
  const handleRandomQuickPick = () => {
    if (!currentShooter || phase !== 'TARGET_SELECTION') return;
    if (shotExecutedThisRound.current) return;
    const aliveTargets = participants.filter(p => p.isAlive && p.id !== currentShooter.id);
    if (aliveTargets.length > 0) {
      const randomTarget = aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
      handleManualTargetSelect(randomTarget);
    }
  };

  // 6. Realistic 6-Chamber Weapon Execution
  const executeShotSequence = (target: HunterRouletteParticipant) => {
    setCurrentTarget(target);
    setPhase('HUNTER_SCENE');

    // 🎯 Improved Realistic Gun Logic:
    // Guarantees a hit within at most 3 shots (impossible to get 6 blanks in a row!)
    let isLoaded = false;
    if (consecutiveBlanks >= 2) {
      isLoaded = true; // Guaranteed live bullet after 2 consecutive blanks
    } else {
      // Dynamic escalating probability: 45% on 1st shot, 70% on 2nd shot
      const bulletChance = 0.45 + (consecutiveBlanks * 0.25);
      isLoaded = Math.random() < bulletChance;
    }

    if (isLoaded) {
      setConsecutiveBlanks(0);
    } else {
      setConsecutiveBlanks(b => b + 1);
    }
    setCylinderChamber(c => (c + 1) % 6);
    setIsLoadedShot(isLoaded);

    setTimeout(() => {
      if (isLoaded) {
        soundFX.play('wrong_answer'); // Gunshot BOOM
        triggerVisualEffect('fireworks');
        setPhase('ELIMINATED');
        
        // Eliminate ONLY the exact target by ID
        setParticipants(prev => {
          return prev.map(p => {
            if (p.id === target.id) {
              return { ...p, isAlive: false };
            }
            return p;
          });
        });
      } else {
        soundFX.play('correct_answer'); // Blank Click sound
        setPhase('SURVIVED');
      }

      // After 4 seconds, check if game should continue or end
      setTimeout(() => {
        setParticipants(currentList => {
          const alive = currentList.filter(p => p.isAlive);
          if (alive.length <= 1) {
            if (alive.length === 1) {
              setWinner(alive[0]);
              setPhase('GAME_OVER');
              soundFX.play('show_end');
              triggerVisualEffect('confetti');
            }
          } else {
            // Continue to next round
            setRoundNumber(r => r + 1);
            shotExecutedThisRound.current = false;
            setPhase('LOCKED');
          }
          return currentList;
        });
      }, 4000);

    }, 3000);
  };

  const aliveParticipants = participants.filter(p => p.isAlive);
  const totalCount = participants.length;
  const aliveCount = aliveParticipants.length;
  const eliminatedCount = totalCount - aliveCount;

  return (
    <div className="w-full max-w-6xl min-h-[85vh] flex flex-col items-center justify-between p-4 sm:p-6 text-white dir-rtl relative overflow-hidden rounded-3xl bg-[#0E0F20]/90 border border-[#202242] shadow-[0_30px_90px_rgba(0,0,0,0.9)]">

      {/* 🔴 PAGE 1: REGISTRATION SCREEN (شاشة تسجيل المشاركين) */}
      {(phase === 'IDLE' || phase === 'REGISTERING') && (
        <div className="w-full flex-1 flex flex-col items-center justify-between gap-6 py-4">
          
          {/* Header Banner */}
          <div className="flex flex-col items-center text-center gap-3 max-w-2xl">
            <div className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black font-mono">
              🎮 لعبة البقاء والإقصاء للمباشر
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              روليت الصياد 🎯
            </h1>
            <p className="text-sm text-slate-300 font-bold">
              اكتب كلمة <span className="text-amber-400 text-lg px-2 py-0.5 rounded-lg bg-amber-500/20 font-black border border-amber-400/40">العب</span> في تعليقات البث المباشر للانضمام التلقائي!
            </p>
          </div>

          {/* Action Button & Test Helpers */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {phase === 'IDLE' && (
              <button
                onClick={handleStartRegistration}
                className="px-10 py-4 rounded-2xl gold-cta-button text-white font-black text-base flex items-center gap-3 shadow-[0_10px_35px_rgba(245,158,11,0.5)] hover:scale-105 transition-all cursor-pointer"
              >
                <Play className="w-6 h-6 fill-white" />
                <span>بدء التسجيل الآن</span>
              </button>
            )}

            {phase === 'REGISTERING' && (
              <div className="px-6 py-2.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xs flex items-center gap-2 animate-pulse font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>جاري مراقبة الشات واستقبال المشاركين كلمة "العب"...</span>
              </div>
            )}

            {/* Quick Test Participant Join Buttons */}
            <button
              onClick={() => handleAddMockParticipant(1)}
              className="px-4 py-2.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-extrabold flex items-center gap-1.5 hover:bg-purple-500/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>+ مشارك تجريبي</span>
            </button>
            <button
              onClick={() => handleAddMockParticipant(10)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-extrabold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>+ 10 مشاركين</span>
            </button>
          </div>

          {/* Participants Counter & Grid Container (Supports 100+ players) */}
          <div className="w-full p-6 rounded-3xl bg-[#121326] border border-[#1E2038] flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between border-b border-[#1E2038] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="font-black text-sm text-white font-mono">المشاركون المسجلون</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-black border border-purple-400/30 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>المسجلون: {totalCount}</span>
                </span>
              </div>
            </div>

            {participants.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 text-slate-500 text-xs">
                <Users className="w-12 h-12 text-slate-600 animate-pulse" />
                <span>لم ينضم أحد بعد... اضغط "+ مشارك تجريبي" أو اكتب "العب" في الشات</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-10 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center text-center gap-1.5 animate-in zoom-in-95 ${
                      p.isAlive 
                        ? 'bg-[#16172E] border-[#202242]' 
                        : 'bg-rose-950/30 border-rose-500/30 opacity-40'
                    }`}
                  >
                    <img
                      src={p.avatarUrl}
                      alt={p.displayName}
                      className={`w-10 h-10 rounded-full object-cover border ${
                        p.isAlive ? 'border-amber-400/40' : 'border-rose-500/40 grayscale'
                      }`}
                    />
                    <span className="font-extrabold text-white text-[10px] truncate w-full">{p.displayName}</span>
                    <span className="text-[8px] text-slate-400 font-mono truncate w-full">@{p.username}</span>
                    {!p.isAlive && (
                      <span className="text-[8px] text-rose-400 font-black">💀 أُقصي</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Action Button: Lock Registration */}
          <button
            onClick={handleLockRegistration}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 text-white font-black text-sm flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
          >
            <Lock className="w-5 h-5" />
            <span>إغلاق التسجيل وبدء اللعبة 🔒</span>
          </button>
        </div>
      )}

      {/* 🔴 PAGE 2: PROFESSIONAL ROULETTE WHEEL SCREEN (شاشة عجلة الروليت الاحترافية) */}
      {(phase === 'LOCKED' || phase === 'SPINNING' || phase === 'WINNER_REVEALED') && (
        <div className="w-full flex-1 flex flex-col items-center justify-between gap-4 py-2 relative">
          
          {/* Top Status Header with Comprehensive Live Counters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full border-b border-[#1E2038] pb-3 gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-amber-400 font-mono">🎡 عجلة الصياد الاحترافية</h2>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black font-mono border border-amber-500/30">
                الجولة #{roundNumber}
              </span>
            </div>

            {/* Live Stats Badges Bar (Header Bar) */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-black font-mono border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>المشاركون: {totalCount}</span>
              </span>

              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-black font-mono border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>المتبقون: {aliveCount}</span>
              </span>

              <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-black font-mono border border-rose-500/40 flex items-center gap-1.5 shadow-sm">
                <Skull className="w-3.5 h-3.5 text-rose-400" />
                <span>المقصيون: {eliminatedCount}</span>
              </span>
            </div>
          </div>

          {/* 📊 FLOATING LIVE STATS HUD CARDS (أعلى اليمين واليسار بجانب العجلة) */}
          
          {/* Right Side: Live Counters Panel (أعلى اليمين) */}
          <div className="hidden lg:flex flex-col gap-2.5 absolute top-16 right-2 z-20 w-52 p-4 rounded-2xl bg-[#121326]/95 border border-[#202242] shadow-[0_12px_35px_rgba(0,0,0,0.7)] backdrop-blur-md animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#202242] pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-white font-mono">لوحة المشاركين</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            
            {/* 1. Total Participants */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200">عدد المشاركين</span>
              </div>
              <span className="text-base font-black font-mono text-purple-300">{totalCount}</span>
            </div>

            {/* 2. Remaining / Alive */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200">عدد المتبقين</span>
              </div>
              <span className="text-base font-black font-mono text-emerald-400">{aliveCount}</span>
            </div>

            {/* 3. Eliminated */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-300">
                  <Skull className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200">عدد المقصيين</span>
              </div>
              <span className="text-base font-black font-mono text-rose-400">{eliminatedCount}</span>
            </div>
          </div>

          {/* Left Side: Game Status & Survival Rate Panel (أعلى اليسار) */}
          <div className="hidden lg:flex flex-col gap-2.5 absolute top-16 left-2 z-20 w-52 p-4 rounded-2xl bg-[#121326]/95 border border-[#202242] shadow-[0_12px_35px_rgba(0,0,0,0.7)] backdrop-blur-md animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#202242] pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-black text-white font-mono">حالة الصمود</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold">ROULETTE</span>
            </div>
            
            {/* Round Number */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200">الجولة</span>
              </div>
              <span className="text-base font-black font-mono text-amber-400">#{roundNumber}</span>
            </div>

            {/* Survival Percentage */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200">نسبة البقاء</span>
              </div>
              <span className="text-base font-black font-mono text-cyan-300">
                {totalCount > 0 ? Math.round((aliveCount / totalCount) * 100) : 100}%
              </span>
            </div>

            {/* Phase Status */}
            <div className="p-2 rounded-xl bg-[#16172E] border border-[#202242] text-center">
              <span className="text-[10px] font-mono text-slate-400 font-bold block">الحالة الحالية</span>
              <span className="text-xs font-black text-purple-300 font-mono mt-0.5 block">
                {phase === 'LOCKED' ? '⏳ بانتظار الدوران' : phase === 'SPINNING' ? '🎡 جاري الدوران...' : '👑 تم كشف الصياد'}
              </span>
            </div>
          </div>

          {/* 🎡 ROULETTE WHEEL CONTAINER (Grand Sized Wheel for Live Stream) */}
          <div className="relative w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] lg:w-[680px] lg:h-[680px] xl:w-[720px] xl:h-[720px] flex items-center justify-center my-2 sm:my-3 transition-all duration-300">
            
            {/* Top Golden Pointer Pin (ريشة العجلة الذهبية المكبرة) */}
            <div className="absolute -top-8 sm:-top-12 z-30 flex flex-col items-center filter drop-shadow-[0_8px_25px_rgba(245,158,11,1)]">
              <div className="w-12 sm:w-16 h-14 sm:h-20 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 [clip-path:polygon(50%_100%,0%_0%,100%_0%)]" />
              <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-amber-200 border-2 border-white -mt-13 sm:-mt-19 shadow-inner" />
            </div>

            {/* Glowing Outer Wheel Frame */}
            <div className="w-full h-full rounded-full border-[10px] sm:border-[16px] md:border-[20px] border-[#25284A] p-2 sm:p-3 md:p-4 bg-[#0C0D1C] shadow-[0_0_120px_rgba(124,58,237,0.65),0_0_40px_rgba(245,158,11,0.3)] flex items-center justify-center relative overflow-hidden">
              
              {/* Rotating SVG Wheel */}
              <div
                className="w-full h-full rounded-full transition-transform duration-[5000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full rounded-full">
                  {aliveParticipants.map((p, i) => {
                    const N = aliveParticipants.length;
                    const sliceAngle = 360 / N;
                    const startAngle = i * sliceAngle;
                    const endAngle = (i + 1) * sliceAngle;

                    const rad1 = (startAngle * Math.PI) / 180;
                    const rad2 = (endAngle * Math.PI) / 180;

                    const x1 = 100 + 100 * Math.cos(rad1);
                    const y1 = 100 + 100 * Math.sin(rad1);
                    const x2 = 100 + 100 * Math.cos(rad2);
                    const y2 = 100 + 100 * Math.sin(rad2);

                    const largeArc = sliceAngle > 180 ? 1 : 0;
                    const color = SLICE_COLORS[i % SLICE_COLORS.length];

                    // Text Angle
                    const midAngle = startAngle + sliceAngle / 2;
                    const textRad = (midAngle * Math.PI) / 180;
                    const textX = 100 + 64 * Math.cos(textRad);
                    const textY = 100 + 64 * Math.sin(textRad);

                    const fontSize = N > 30 ? '4.5' : N > 18 ? '6' : N > 10 ? '8' : '10';

                    return (
                      <g key={p.id}>
                        {/* Slice Sector */}
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={color}
                          stroke="#0E0F20"
                          strokeWidth="1.5"
                        />
                        {/* Player Name Text along slice */}
                        <text
                          x={textX}
                          y={textY}
                          fill="#FFFFFF"
                          fontSize={fontSize}
                          fontWeight="900"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.95))' }}
                          transform={`rotate(${midAngle + 180}, ${textX}, ${textY})`}
                        >
                          {p.displayName.length > 10 ? p.displayName.substring(0, 9) + '..' : p.displayName}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Center Golden Shield Badge */}
              <div className="absolute w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-2 shadow-[0_0_50px_rgba(245,158,11,0.8)] flex items-center justify-center z-20">
                <div className="w-full h-full rounded-full bg-[#0E0F20] flex flex-col items-center justify-center text-amber-400">
                  <Crosshair className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 animate-spin-slow" />
                </div>
              </div>

            </div>
          </div>

          {/* Spin Button */}
          {phase === 'LOCKED' && (
            <button
              onClick={handleSpinRoulette}
              disabled={isSpinning}
              className="px-16 py-4 sm:py-5 rounded-2xl purple-cta-button text-white font-black text-xl sm:text-2xl flex items-center gap-3 shadow-[0_10px_50px_rgba(124,58,237,0.7)] hover:scale-105 transition-all cursor-pointer z-10"
            >
              <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8 animate-spin" />
              <span>ابدأ الدوران 🎡</span>
            </button>
          )}

          {/* Floating Glassmorphism Winner Banner (المستطيل الزجاجي العائم بعد الثبات) */}
          {phase === 'WINNER_REVEALED' && currentShooter && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-in zoom-in-95">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#181935]/90 via-[#121328]/90 to-[#181935]/90 border-2 border-amber-400 shadow-[0_0_80px_rgba(245,158,11,0.6)] flex flex-col items-center text-center gap-4 max-w-md w-full">
                <div className="px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-black uppercase">
                  🎯 تم اختيار الصياد!
                </div>

                <div className="relative">
                  <img
                    src={currentShooter.avatarUrl}
                    alt={currentShooter.displayName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.8)]"
                  />
                  <span className="absolute -top-3 -right-3 text-3xl">👑</span>
                </div>

                <div>
                  <h2 className="text-3xl font-black text-white">{currentShooter.displayName}</h2>
                  <span className="text-sm font-mono text-amber-300 font-bold block">@{currentShooter.username}</span>
                </div>

                <span className="text-xs text-slate-300 font-bold mt-2 animate-pulse">
                  انتقال لقائمة الضحايا خلال 5 ثوانٍ...
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 🔴 PAGE 3: VICTIMS GRID & MANUAL TARGET SELECTION & REVIVE GATE */}
      {phase === 'TARGET_SELECTION' && currentShooter && (
        <div className="w-full flex-1 flex flex-col items-center justify-between gap-5 py-3 animate-in zoom-in-95">
          
          {/* ⚡ Rare Surprise Revive Gate Banner (بوابة الإحياء المفاجئة) */}
          {isReviveGateOpen && (
            <div className="w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-purple-950/90 to-emerald-950/90 border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                  🔓
                </div>
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] font-mono uppercase shadow-sm">
                      ⚡ حدث نادر جداً!
                    </span>
                    <h2 className="text-lg font-black text-emerald-300">بوابة الإحياء فُتحت الآن!</h2>
                  </div>
                  <span className="text-xs text-white font-bold mt-0.5">
                    الصياد <span className="text-amber-400 font-black">{currentShooter.displayName}</span> لديه خياران: كتابة رقم الضحية للاصطياد 🎯 أو كتابة <span className="text-emerald-300 underline font-black">«احياء [رقم]»</span> لإعادة لاعب مستبعد! ❤️
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/30 text-emerald-200 text-xs font-mono font-black border border-emerald-400/50">
                  فرصة إحياء متاحة (1) ❤️
                </span>
              </div>
            </div>
          )}

          {/* Header Bar with Target Selection Instructions */}
          <div className="w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#14152A] via-rose-950/40 to-[#14152A] border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={currentShooter.avatarUrl}
                  alt={currentShooter.displayName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                />
                <span className="absolute -top-1.5 -right-1.5 text-base">👑</span>
              </div>
              <div className="flex flex-col text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-300/80 font-mono font-bold">الصياد:</span>
                  <h2 className="text-xl font-black text-amber-400">{currentShooter.displayName}</h2>
                </div>
                <span className="text-xs text-slate-200 font-bold mt-0.5">
                  اكتب رقم الضحية في الشات (مثال: <span className="text-amber-400 font-black px-1.5 py-0.5 rounded bg-amber-400/20">1</span> أو <span className="text-amber-400 font-black px-1.5 py-0.5 rounded bg-amber-400/20">3</span>) أو اضغط على بطاقتها مباشرة!
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-black border border-emerald-500/40">
                  الأحياء: {aliveCount}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-mono font-black border border-rose-500/40">
                  المستبعدون: {eliminatedCount}
                </span>
              </div>

              <button
                onClick={handleRandomQuickPick}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>🎲 صيد عشوائي</span>
              </button>
            </div>
          </div>

          {/* 🎯 LIST 1: ACTIVE VICTIMS (قائمة الضحايا والأحياء مع أرقام وصور ضخمة وواضحة جداً) */}
          <div className="w-full p-4 sm:p-6 rounded-3xl bg-[#121326]/95 border border-[#1E2038] shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Crosshair className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-white">قائمة الضحايا المتاحين للاستهداف</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-black">
                المتاحون: {aliveParticipants.filter(p => p.id !== currentShooter.id).length} ضحية
              </span>
            </div>

            {/* Grid of Victims: Highly Visible VIP Broadcast Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-1">
              {aliveParticipants
                .filter(p => p.id !== currentShooter.id)
                .map((p, idx) => {
                  const targetNumber = idx + 1;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleManualTargetSelect(p)}
                      className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-[#191B38] to-[#0E1022] border-2 border-[#25284E] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all flex flex-col items-center text-center gap-3 cursor-pointer group hover:-translate-y-1.5 relative overflow-visible"
                    >
                      {/* 🌟 ULTRA-CLEAR BROADCAST GOLD NUMBER MEDALLION */}
                      <div className="absolute -top-3.5 -right-3.5 w-11 h-11 rounded-2xl bg-gradient-to-tr from-yellow-300 via-amber-400 to-amber-600 text-slate-950 font-black font-mono flex items-center justify-center border-2 border-[#0B0C1E] shadow-[0_4px_16px_rgba(245,158,11,0.7)] z-20 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        <span className="text-lg font-black tracking-tight leading-none">#{targetNumber}</span>
                      </div>

                      {/* 📸 ENLARGED HIGH-DEFINITION AVATAR */}
                      <div className="relative mt-1">
                        <img
                          src={p.avatarUrl}
                          alt={p.displayName}
                          className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-3 border-amber-400/80 group-hover:border-rose-500 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:shadow-[0_0_25px_rgba(244,63,94,0.5)]"
                        />
                        <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                          <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-black shadow-sm">
                            الهدف {targetNumber}
                          </span>
                        </div>
                      </div>

                      {/* Player Names with High Contrast */}
                      <div className="w-full min-w-0 mt-1">
                        <span className="font-black text-white text-sm block truncate group-hover:text-amber-300 transition-colors">
                          {p.displayName}
                        </span>
                        <span className="text-[11px] font-mono text-cyan-300 font-bold block truncate mt-0.5">
                          @{p.username.replace('@', '')}
                        </span>
                      </div>

                      {/* Prominent Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManualTargetSelect(p);
                        }}
                        className="w-full py-2 rounded-xl text-xs font-black bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-[0_4px_12px_rgba(225,29,72,0.4)] group-hover:shadow-[0_6px_20px_rgba(225,29,72,0.6)] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>صيد #{targetNumber}</span>
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 💀 LIST 2: ELIMINATED / FALLEN PLAYERS (قائمة المستبعدين الاحترافية) */}
          <div className="w-full p-4 sm:p-5 rounded-3xl bg-[#0B0C1A] border border-[#1A1C32] flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-black text-slate-300 font-mono">قائمة المستبعدين (المقصيون)</h3>
              </div>
              <span className="text-xs text-rose-400 font-mono font-bold">
                المستبعدون: {participants.filter(p => !p.isAlive).length} لاعب
              </span>
            </div>

            {participants.filter(p => !p.isAlive).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 p-1">
                {participants
                  .filter(p => !p.isAlive)
                  .map((p, idx) => {
                    const elimNumber = idx + 1;
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 relative ${
                          isReviveGateOpen
                            ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 cursor-pointer'
                            : 'bg-[#111222] border-white/10 opacity-75'
                        }`}
                        onClick={() => {
                          if (isReviveGateOpen) {
                            handleRevivePlayer(p);
                          }
                        }}
                      >
                        {/* Eliminated Number Badge: Large & High Contrast */}
                        <div className={`absolute -top-3 -right-3 w-9 h-9 rounded-xl font-black font-mono flex items-center justify-center border-2 border-[#0B0C1E] shadow-md z-10 ${
                          isReviveGateOpen
                            ? 'bg-gradient-to-tr from-emerald-400 to-green-300 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                            : 'bg-slate-700 text-slate-200'
                        }`}>
                          <span className="text-sm font-black">#{elimNumber}</span>
                        </div>

                        <div className="relative mt-1">
                          <img
                            src={p.avatarUrl}
                            alt={p.displayName}
                            className={`w-16 h-16 rounded-xl object-cover border-2 shadow-md ${
                              isReviveGateOpen
                                ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                : 'grayscale contrast-125 border-slate-600'
                            }`}
                          />
                          {!isReviveGateOpen && (
                            <span className="absolute -bottom-1 -right-1 text-sm bg-black/80 rounded-full p-0.5">💀</span>
                          )}
                        </div>

                        <div className="w-full min-w-0">
                          <span className="font-black text-slate-200 text-xs block truncate">{p.displayName}</span>
                          <span className="text-[10px] font-mono text-slate-400 block truncate">@{p.username.replace('@', '')}</span>
                        </div>

                        {isReviveGateOpen ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRevivePlayer(p);
                            }}
                            className="w-full py-1.5 rounded-lg text-[11px] font-black bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 transition-all shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-bounce flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>❤️ إحياء #{elimNumber}</span>
                          </button>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono text-rose-300 bg-rose-950/60 border border-rose-500/30 font-bold">
                            💀 تم الإقصاء
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-4 px-3 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-xs text-slate-400 font-bold font-mono">
                🛡️ لا يوجد أي لاعب مستبعد حتى الآن — جميع المتسابقين صامدون
              </div>
            )}
          </div>

        </div>
      )}

      {/* 🔴 CINEMATIC REVIVE SCENE (مشهد الإحياء والعودة للمنافسة) */}
      {phase === 'REVIVED' && revivedPlayer && (
        <div className="w-full flex-1 flex flex-col items-center justify-center text-center gap-6 py-8 animate-in zoom-in-95">
          <div className="px-6 py-2 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono uppercase tracking-widest animate-pulse">
            ✨ حدث نادر: عودة إلى الحياة! ✨
          </div>

          <div className="relative">
            <img
              src={revivedPlayer.avatarUrl}
              alt={revivedPlayer.displayName}
              className="w-36 h-36 rounded-full object-cover border-4 border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.8)] animate-pulse"
            />
            <span className="absolute -top-3 -right-3 text-5xl">❤️</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              تم إحياء <span className="text-emerald-400">{revivedPlayer.displayName}</span>!
            </h1>
            <span className="text-sm font-mono text-cyan-300 font-bold">@{revivedPlayer.username}</span>
            <span className="text-xs text-emerald-300 font-bold bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-500/40 mt-2">
              🎉 عاد اللاعب رسمياً إلى المنافسة برقم جديد في قائمة الصامدين!
            </span>
          </div>
        </div>
      )}

      {/* 🔴 PAGE 4: CINEMATIC HUNTER SCENE (مشهد الصياد والرمي السينمائي VEO 3) */}
      {(phase === 'HUNTER_SCENE' || phase === 'SURVIVED' || phase === 'ELIMINATED') && currentTarget && (
        <div className="w-full flex-1 flex flex-col items-center justify-between gap-6 py-6 relative overflow-hidden">
          
          {/* Top Weapon Status & Live Counters */}
          <div className="flex items-center justify-between w-full border-b border-[#1E2038] pb-3 z-10 flex-wrap gap-2">
            <span className="font-black text-rose-400 font-mono text-base uppercase flex items-center gap-2">
              <Crosshair className="w-5 h-5 animate-pulse" />
              <span>مشهد الصياد والتنفيذ السينمائي</span>
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {/* 🎯 6-Chamber Revolver Cylinder HUD */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-amber-400/30">
                <span className="text-[11px] font-mono text-amber-300 font-bold ml-1">مخزن السلاح:</span>
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const isCurrent = cylinderChamber === idx;
                  return (
                    <span
                      key={idx}
                      title={`حجرة #${idx + 1}`}
                      className={`w-3 h-3 rounded-full border transition-all ${
                        isCurrent
                          ? 'bg-amber-400 border-white shadow-[0_0_8px_#F59E0B] scale-110'
                          : idx < cylinderChamber
                          ? 'bg-rose-500/60 border-rose-400'
                          : 'bg-white/20 border-white/30'
                      }`}
                    />
                  );
                })}
              </div>

              <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-mono font-black border border-purple-500/30">
                المشاركون: {totalCount}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-black border border-emerald-500/30">
                الأحياء: {aliveCount}
              </span>
              <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-mono font-black border border-rose-500/30">
                المقصيون: {eliminatedCount}
              </span>
              <span className="px-4 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                {isLoadedShot === true ? '🔴 طلقة محملة' : isLoadedShot === false ? '⚪ بندقية فارغة' : '⏳ جاري التوجيه...'}
              </span>
            </div>
          </div>

          {/* Cinematic Duel Display with VEO 3 Style Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full flex-1 my-4 relative">
            
            {/* Flying Bullet Visual FX (عند الإطلاق والطلقة محملة) */}
            {phase === 'ELIMINATED' && (
              <div className="absolute top-1/2 left-1/4 right-1/4 h-2 z-30 pointer-events-none flex items-center justify-end">
                <div className="w-12 h-3 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 rounded-full shadow-[0_0_20px_#F59E0B] animate-bullet-flight" />
              </div>
            )}

            {/* Hunter Side with Official Character Image (Flipped Horizontally to face Victim on Left) */}
            <div className="flex flex-col items-center text-center gap-4 p-6 rounded-3xl bg-[#16172E] border border-[#202242] shadow-2xl relative overflow-hidden group">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <img
                  src="/hunter-character.png"
                  alt="الصياد"
                  className={`w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] -scale-x-100 transition-transform ${
                    phase === 'ELIMINATED'
                      ? 'animate-recoil'
                      : phase === 'SURVIVED'
                      ? 'animate-click-recoil'
                      : 'animate-pulse'
                  }`}
                />
                
                {/* Muzzle Flash FX on Rifle Barrel (Left Side since image is flipped) */}
                {phase === 'ELIMINATED' && (
                  <div className="absolute top-16 left-2 w-20 h-20 bg-gradient-to-r from-amber-400 via-red-500 to-yellow-300 rounded-full blur-sm animate-ping opacity-90 z-20" />
                )}
                
                {/* Blank Click Smoke FX */}
                {phase === 'SURVIVED' && (
                  <div className="absolute top-16 left-2 text-xs font-mono font-black text-slate-400 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full animate-bounce">
                    💨 *Click*
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-black text-white text-xl">الصياد {currentShooter?.displayName}</h3>
                <span className="text-xs text-amber-400 font-extrabold block mt-1">
                  {phase === 'HUNTER_SCENE' && 'يوجه البندقية بدقة نحو الضحية...'}
                  {phase === 'ELIMINATED' && '🔥 أطلق النار وحصل الانفجار!'}
                  {phase === 'SURVIVED' && '💨 ضغط الزناد والبندقية كانت فارغة!'}
                </span>
              </div>
            </div>

            {/* Target Side */}
            <div className={`flex flex-col items-center text-center gap-4 p-8 rounded-3xl transition-all shadow-2xl relative ${
              phase === 'ELIMINATED'
                ? 'bg-rose-950/60 border-2 border-rose-600 animate-shake'
                : phase === 'SURVIVED'
                ? 'bg-emerald-950/60 border-2 border-emerald-500'
                : 'bg-[#16172E] border border-[#202242]'
            }`}>
              <div className="relative">
                <img
                  src={currentTarget.avatarUrl}
                  alt={currentTarget.displayName}
                  className={`w-32 h-32 rounded-full object-cover border-4 transition-all ${
                    phase === 'ELIMINATED' ? 'border-rose-600 scale-95' : 'border-rose-500 shadow-2xl'
                  }`}
                />
                
                {/* Target Scope Ring Overlay */}
                {phase === 'HUNTER_SCENE' && (
                  <div className="absolute inset-0 border-4 border-dashed border-rose-500 rounded-full animate-spin-slow" />
                )}

                {/* Explosion FX */}
                {phase === 'ELIMINATED' && (
                  <div className="absolute inset-0 bg-black/85 rounded-full flex flex-col items-center justify-center text-5xl text-rose-500 animate-pulse border-2 border-rose-500">
                    💥
                    <span className="text-[10px] font-black text-rose-400 font-mono mt-1">DESTROYED</span>
                  </div>
                )}

                {/* Shield FX on Survived */}
                {phase === 'SURVIVED' && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-black text-white text-xl">{currentTarget.displayName}</h3>
                <span className="text-xs font-mono text-slate-400 block">@{currentTarget.username}</span>
              </div>
            </div>

          </div>

          {/* Shot Outcome Banner */}
          {phase === 'SURVIVED' && (
            <div className="w-full py-4 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xl font-black text-center animate-in zoom-in shadow-lg">
              💨 لقد نجوت! البندقية كانت فارغة من الرصاص!
            </div>
          )}

          {phase === 'ELIMINATED' && (
            <div className="w-full py-4 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xl font-black text-center animate-in zoom-in shadow-lg">
              💀 تم إقصاء اللاعب {currentTarget.displayName} وتدمير البروفايل!
            </div>
          )}

        </div>
      )}

      {/* 🔴 GRAND FINALE: GAME OVER (الفائز الأخير للصمود) */}
      {phase === 'GAME_OVER' && winner && (
        <div className="w-full flex-1 flex flex-col items-center justify-center text-center gap-6 py-8 animate-in zoom-in">
          <span className="px-6 py-2 rounded-full text-sm font-black bg-amber-500/30 text-amber-300 border border-amber-400/50 font-mono tracking-widest uppercase">
            🏆 الفائز ببطولة روليت الصياد 🏆
          </span>

          <div className="relative">
            <img
              src={winner.avatarUrl}
              alt={winner.displayName}
              className="w-40 h-40 rounded-full object-cover border-4 border-amber-400 shadow-[0_0_60px_rgba(245,158,11,0.8)]"
            />
            <span className="absolute -top-4 -right-4 text-6xl">👑</span>
          </div>

          <div>
            <h1 className="text-4xl font-black text-white">{winner.displayName}</h1>
            <span className="text-base font-mono text-amber-400 font-bold block mt-1">@{winner.username}</span>
            <span className="text-sm text-emerald-400 font-black block mt-3">👑 آخر لاعب صامد في روليت الصياد!</span>
          </div>

          {/* Final Game Stats Summary */}
          <div className="flex items-center gap-4 my-2">
            <span className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-mono font-black border border-purple-500/30">
              إجمالي المشاركين: {totalCount}
            </span>
            <span className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-mono font-black border border-rose-500/30">
              إجمالي المقصيين: {totalCount - 1}
            </span>
            <span className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-mono font-black border border-amber-500/30">
              الجولات: {roundNumber}
            </span>
          </div>

          <button
            onClick={() => {
              setPhase('IDLE');
              setParticipants([]);
              registeredUserIds.current.clear();
              shotExecutedThisRound.current = false;
              setRoundNumber(1);
              setWinner(null);
              setCurrentShooter(null);
              setCurrentTarget(null);
              setIsLoadedShot(null);
              setWheelRotation(0);
              setIsReviveGateOpen(false);
              setReviveCountUsed(0);
              setRevivedPlayer(null);
            }}
            className="px-10 py-4 rounded-2xl gold-cta-button text-white font-black text-sm transition-all hover:scale-105 cursor-pointer mt-4"
          >
            بدء لعبة جديدة 🔄
          </button>
        </div>
      )}

    </div>
  );
}
