'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  SquidGameQuestion, 
  SquidGamePhase, 
  SquidPlayer, 
  SquidGameConfig, 
  SquidRiskLevel,
  SquidWinMode,
  TikTokLiveComment
} from '@aep/types';
import { 
  DEFAULT_SQUID_CONFIG, 
  determineSquidDangerNumber, 
  generateMockSquidPlayers, 
  parseSquidChoice 
} from '@aep/game-engines';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { useStudioStore } from '../../store/useStudioStore';
import { Squid3DScene } from './Squid3DScene';
import { 
  Skull, Trophy, Users, Clock, Play, Pause, RotateCcw, 
  Settings, AlertTriangle, Sparkles, Volume2, VolumeX, 
  ShieldAlert, Zap, ChevronRight, Crown, Flame, Check, 
  UserPlus, Radio, Activity, Eye, Crosshair, ArrowUpRight,
  HelpCircle, RefreshCw
} from 'lucide-react';

interface Props {
  question?: SquidGameQuestion;
  isAnswerRevealed?: boolean;
}

export function SquidGameView({ question: propQuestion }: Props) {
  const { liveComments, tiktokEngine } = useStudioStore();

  // 1. CONFIGURATION & STATE INITIALIZATION
  const [config, setConfig] = useState<SquidGameConfig>(() => ({
    ...DEFAULT_SQUID_CONFIG,
    ...(propQuestion?.config || {})
  }));

  const [phase, setPhase] = useState<SquidGamePhase>('LOBBY');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [players, setPlayers] = useState<SquidPlayer[]>([]);
  const [dangerNumber, setDangerNumber] = useState<number | null>(null);
  const [winner, setWinner] = useState<SquidPlayer | null>(null);

  // Time & Clocks
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(config.choiceDurationSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cameraShake, setCameraShake] = useState<boolean>(false);

  // Activity Log Ticker (Live events feed)
  const [activityLogs, setActivityLogs] = useState<{ id: string; text: string; time: string; icon: string }[]>([]);

  // Host Drawer & Audio
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ALIVE' | 'ELIMINATED'>('ALIVE');

  // Tracking and deduplication
  const registeredUserIdsRef = useRef<Set<string>>(new Set());
  const processedCommentIdsRef = useRef<Set<string>>(new Set());
  const roundTimerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<SquidGamePhase>(phase);
  phaseRef.current = phase;

  // Sound helper with mute toggle
  const playSound = useCallback((type: any, vol: number = 0.8) => {
    if (!isMuted && config.soundEnabled) {
      soundFX.play(type, vol);
    }
  }, [isMuted, config.soundEnabled]);

  // Add activity log
  const addLog = useCallback((text: string, icon: string = '🦑') => {
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLogs(prev => [{ id: `${Date.now()}-${Math.random()}`, text, time, icon }, ...prev.slice(0, 6)]);
  }, []);

  // 2. COMPUTED METRICS & SELECTORS
  const alivePlayers = useMemo(() => players.filter(p => p.isAlive), [players]);
  const eliminatedPlayers = useMemo(() => players.filter(p => !p.isAlive), [players]);

  // Distribution of choices (1-5) in the current round
  const choiceStats = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    alivePlayers.forEach(p => {
      if (p.lastChoice && p.lastChoice >= 1 && p.lastChoice <= 5) {
        counts[p.lastChoice] = (counts[p.lastChoice] || 0) + 1;
      }
    });
    return counts;
  }, [alivePlayers]);

  const totalChosenCount = useMemo(() => {
    return Object.values(choiceStats).reduce((a, b) => a + b, 0);
  }, [choiceStats]);

  // 3. REGISTRATION & COMMENT PROCESSOR
  const processComment = useCallback((c: any) => {
    if (!c) return;
    const cid = String(c.id || `${c.userId}-${c.createTime || Date.now()}`);
    if (processedCommentIdsRef.current.has(cid)) return;
    processedCommentIdsRef.current.add(cid);

    const rawText = (c.comment || c.commentText || '').trim();
    const uid = String(c.userId || c.username || `user-${Date.now()}`).toLowerCase();

    // 1. REGISTRATION PHASE or Mid-Game Join (word: "العب" / "شارك")
    const isRegisterKeyword = rawText.includes('العب') || rawText.includes('لعب') || rawText.includes('شارك') || rawText.toLowerCase().includes('play');
    
    if (isRegisterKeyword && (phaseRef.current === 'LOBBY' || (config.allowJoinMidGame && phaseRef.current !== 'LOCKING' && phaseRef.current !== 'DOLL_MOVEMENT' && phaseRef.current !== 'DANGER_REVEAL'))) {
      if (!registeredUserIdsRef.current.has(uid)) {
        registeredUserIdsRef.current.add(uid);
        const newPlayer: SquidPlayer = {
          id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: uid,
          username: c.username || `@user_${Math.floor(Math.random() * 900 + 100)}`,
          displayName: c.displayName || c.authorName || c.username || 'متسابق الحبار',
          avatarUrl: c.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
          currentStep: 0,
          targetSteps: config.winningSteps,
          lastChoice: null,
          status: 'ACTIVE',
          isAlive: true,
          joinedAt: Date.now(),
          roundsSurvived: 0
        };
        setPlayers(prev => [...prev, newPlayer]);
        playSound('score_update', 0.5);
        addLog(`انضم المتسابق [${newPlayer.displayName}] للمضمار!`, '👤');
      }
      return;
    }

    // 2. CHOOSING PHASE: Accept 1 to 5 from alive registered players ONLY
    if (phaseRef.current === 'CHOOSING') {
      const choice = parseSquidChoice(rawText);
      if (choice !== null) {
        setPlayers(prevPlayers => {
          let playerFound = false;
          const updated = prevPlayers.map(p => {
            if (p.userId === uid && p.isAlive) {
              playerFound = true;
              return {
                ...p,
                lastChoice: choice,
                status: 'LOCKED' as const
              };
            }
            return p;
          });

          if (playerFound) {
            playSound('lock_click', 0.4);
            const p = prevPlayers.find(pl => pl.userId === uid);
            if (p) {
              addLog(`${p.displayName} اختار الرقم [ ${choice} ]`, '🎯');
            }
          }
          return updated;
        });
      }
    }
  }, [config.allowJoinMidGame, config.winningSteps, playSound, addLog]);

  // Subscribe to comments
  useEffect(() => {
    liveComments.forEach(c => processComment(c));
    if (tiktokEngine) {
      const handleEngineComment = (c: any) => processComment(c);
      tiktokEngine.onComment(handleEngineComment);
      return () => {
        tiktokEngine.offComment(handleEngineComment);
      };
    }
  }, [liveComments, tiktokEngine, processComment]);

  // 4. GAME LIFECYCLE & STATE MACHINE
  const clearAllTimers = useCallback(() => {
    if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
  }, []);

  // START ROUND
  const startNextRound = useCallback(() => {
    clearAllTimers();
    setDangerNumber(null);
    setCameraShake(false);

    // Reset lastChoice for all alive players
    setPlayers(prev => prev.map(p => ({
      ...p,
      lastChoice: null,
      status: p.isAlive ? 'CHOOSING' : 'ELIMINATED'
    })));

    setPhase('ROUND_START');
    playSound('round_start', 0.9);
    addLog(`🚨 بدأت الجولة [${roundNumber}]! استعدوا للاختيار`, '🔥');

    // Transition to CHOOSING after 2.5s intro
    phaseTimeoutRef.current = setTimeout(() => {
      setPhase('CHOOSING');
      setTimeRemainingSeconds(config.choiceDurationSeconds);
      playSound('gear_rotate', 0.7);
    }, 2500);
  }, [clearAllTimers, roundNumber, config.choiceDurationSeconds, playSound, addLog]);

  // CHOOSING COUNTDOWN TICKER
  useEffect(() => {
    if (phase !== 'CHOOSING' || isPaused) return;

    roundTimerRef.current = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(roundTimerRef.current!);
          handleLockChoices();
          return 0;
        }
        if (prev <= 4) {
          playSound('bomb_danger_tick', 0.8);
        } else {
          playSound('countdown_tick', 0.3);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    };
  }, [phase, isPaused, playSound]);

  // LOCK CHOICES -> DOLL MOVEMENT
  const handleLockChoices = useCallback(() => {
    setPhase('LOCKING');
    playSound('time_up', 0.9);
    addLog('⛔ انتهى وقت الاختيار! جاري تحليل اختيارات المتسابقين...', '🔒');

    phaseTimeoutRef.current = setTimeout(() => {
      setPhase('DOLL_MOVEMENT');
      playSound('doll_turn', 1.0);
      addLog('👀 الدمية تلتفت نحو المضمار للمسح الشامل...', '🤖');

      phaseTimeoutRef.current = setTimeout(() => {
        handleRevealDanger();
      }, 3500);
    }, 2000);
  }, [playSound, addLog]);

  // REVEAL DANGER & RESOLVE ROUND
  const handleRevealDanger = useCallback(() => {
    const currentChoices = players.filter(p => p.isAlive).map(p => p.lastChoice);
    const danger = determineSquidDangerNumber(roundNumber, config.riskLevel, currentChoices);
    
    setDangerNumber(danger);
    setPhase('DANGER_REVEAL');
    setCameraShake(true);
    setTimeout(() => setCameraShake(false), 800);

    playSound('danger_reveal', 1.0);
    addLog(`⚠️ رقم الخطر المعلن هو [ ${danger} ]!`, '⚡');

    phaseTimeoutRef.current = setTimeout(() => {
      setPhase('RESULT_REVEAL');

      let elimCount = 0;
      let advCount = 0;
      let foundWinner: SquidPlayer | null = null;

      setPlayers(prevPlayers => {
        const updated = prevPlayers.map(p => {
          if (!p.isAlive) return p;

          // Case A: Player picked the danger number -> ELIMINATED!
          if (p.lastChoice === danger) {
            elimCount++;
            return {
              ...p,
              status: 'DANGER' as const,
              isAlive: false,
              eliminatedAtRound: roundNumber
            };
          }

          // Case B: Player didn't choose anything -> Safe but NO advance
          if (p.lastChoice === null) {
            return {
              ...p,
              status: 'SAFE' as const,
              roundsSurvived: p.roundsSurvived + 1
            };
          }

          // Case C: Player picked safe number -> ADVANCE by steps
          advCount++;
          const nextStep = p.currentStep + p.lastChoice;
          const isFinisher = nextStep >= config.winningSteps;

          if (isFinisher && !foundWinner) {
            foundWinner = {
              ...p,
              currentStep: config.winningSteps,
              status: 'FINISHED' as const,
              roundsSurvived: p.roundsSurvived + 1
            };
          }

          return {
            ...p,
            currentStep: Math.min(config.winningSteps, nextStep),
            status: isFinisher ? ('FINISHED' as const) : ('ADVANCED' as const),
            roundsSurvived: p.roundsSurvived + 1
          };
        });

        return updated;
      });

      if (elimCount > 0) {
        playSound('elimination_laser', 0.9);
        addLog(`☠️ تم إقصاء ${elimCount} لاعبين لاختيارهم رقم الخطر!`, '💥');
      } else {
        playSound('correct_answer', 0.8);
        addLog('🟢 نجا جميع المتسابقين في هذه الجولة دون أي إقصاء!', '🛡️');
      }

      // Check Win Condition after results display duration
      phaseTimeoutRef.current = setTimeout(() => {
        handleWinCheck(foundWinner);
      }, config.resultDisplayDurationSeconds * 1000);

    }, 2000);
  }, [players, roundNumber, config.riskLevel, config.winningSteps, config.resultDisplayDurationSeconds, playSound, addLog]);

  // WIN CHECK
  const handleWinCheck = useCallback((firstFinisher: SquidPlayer | null) => {
    if (config.winMode === 'first_to_finish' && firstFinisher) {
      declareWinner(firstFinisher);
      return;
    }

    const finishedP = players.find(p => p.currentStep >= config.winningSteps && p.isAlive);
    if (config.winMode === 'first_to_finish' && finishedP) {
      declareWinner(finishedP);
      return;
    }

    const stillAlive = players.filter(p => p.isAlive);
    if (config.winMode === 'last_survivor') {
      if (stillAlive.length === 1) {
        declareWinner(stillAlive[0]);
        return;
      }
      if (stillAlive.length === 0) {
        setPhase('ROUND_END');
        addLog('انتهت الجولة مع إقصاء الجميع!', '⚠️');
        return;
      }
    }

    if (stillAlive.length === 0) {
      setPhase('GAME_OVER');
      playSound('wrong_answer', 1.0);
      addLog('💀 سقط جميع اللاعبين في الفخ! لا يوجد فائز', '☠️');
      return;
    }

    setPhase('ROUND_END');
    setRoundNumber(r => r + 1);
    addLog('🎉 اكتملت الجولة! الاستعداد للجولة التالية...', '⏳');

    phaseTimeoutRef.current = setTimeout(() => {
      startNextRound();
    }, 3000);
  }, [config.winMode, config.winningSteps, players, playSound, addLog, startNextRound]);

  // DECLARE WINNER
  const declareWinner = useCallback((winningPlayer: SquidPlayer) => {
    setWinner(winningPlayer);
    setPhase('GAME_OVER');
    playSound('winner_announcement', 1.0);
    triggerVisualEffect('confetti');
    triggerVisualEffect('fireworks');
    addLog(`🏆 بطل الحبار: [${winningPlayer.displayName}] فاز بالسباق!`, '👑');

    if (tiktokEngine && winningPlayer.userId) {
      try {
        tiktokEngine.awardPoints({
          userId: winningPlayer.userId,
          username: winningPlayer.username,
          displayName: winningPlayer.displayName,
          avatarUrl: winningPlayer.avatarUrl,
          points: 1000
        });
      } catch (e) {
        console.warn('Error awarding points to engine:', e);
      }
    }
  }, [playSound, addLog, tiktokEngine]);

  // RESET GAME
  const handleResetGame = useCallback(() => {
    clearAllTimers();
    setPhase('LOBBY');
    setRoundNumber(1);
    setDangerNumber(null);
    setWinner(null);
    setTimeRemainingSeconds(config.choiceDurationSeconds);
    setCameraShake(false);
    registeredUserIdsRef.current.clear();
    processedCommentIdsRef.current.clear();

    setPlayers(prev => prev.map(p => ({
      ...p,
      currentStep: 0,
      lastChoice: null,
      status: 'ACTIVE' as const,
      isAlive: true,
      roundsSurvived: 0
    })));

    playSound('round_transition', 0.8);
    addLog('🔄 تم إعادة تهيئة اللعبة بالكامل واستعداد اللوبي', '🔄');
  }, [clearAllTimers, config.choiceDurationSeconds, playSound, addLog]);

  // DEMO MODE: ADD MOCK PLAYERS
  const handleAddMockPlayers = useCallback((count: number = 10) => {
    const mockList = generateMockSquidPlayers(count, config.winningSteps);
    mockList.forEach(p => registeredUserIdsRef.current.add(p.userId));
    setPlayers(prev => [...prev, ...mockList]);
    playSound('score_update', 0.6);
    addLog(`🤖 تم توليد [${count}] متسابق تجريبي (Demo Mode)`, '🧪');
  }, [config.winningSteps, playSound, addLog]);

  // DEMO MODE: SIMULATE CHOICES FOR ALIVE PLAYERS
  const handleSimulateChoices = useCallback(() => {
    if (phase !== 'CHOOSING') return;
    setPlayers(prev => prev.map(p => {
      if (!p.isAlive) return p;
      const roll = Math.random();
      let choice = 3;
      if (roll < 0.2) choice = 1;
      else if (roll < 0.4) choice = 2;
      else if (roll < 0.65) choice = 3;
      else if (roll < 0.85) choice = 4;
      else choice = 5;

      return {
        ...p,
        lastChoice: choice,
        status: 'LOCKED' as const
      };
    }));
    playSound('lock_click', 0.6);
    addLog('⚡ تم محاكاة اختيارات جميع اللاعبين آلياً في الشات', '🎲');
  }, [phase, playSound, addLog]);

  // PROGRESS TILES COMPONENT
  const renderProgressTiles = (current: number, target: number) => {
    const tiles = [];
    for (let i = 1; i <= target; i++) {
      const isReached = i <= current;
      tiles.push(
        <div
          key={i}
          className={`h-2.5 flex-1 rounded-sm transition-all duration-500 ${
            isReached
              ? 'bg-gradient-to-t from-[#EC4899] to-[#F43F5E] shadow-[0_0_8px_rgba(244,63,94,0.6)]'
              : 'bg-[#1E2230] border border-[#2B3145]'
          }`}
        />
      );
    }
    return <div className="flex items-center gap-1 w-full">{tiles}</div>;
  };

  return (
    <div dir="rtl" className={`w-full min-h-screen bg-[#07080C] text-white flex flex-col justify-between overflow-hidden relative select-none font-sans ${cameraShake ? 'animate-bounce' : ''}`}>
      
      {/* ── AMBIENT ATMOSPHERIC BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,25,40,0.6)_0%,rgba(7,8,12,0.95)_75%,rgba(5,6,9,1)_100%)]" />
        
        {/* Survival Grid Floor */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[380px] opacity-15"
          style={{
            backgroundImage: 'linear-gradient(to right, #EC4899 1px, transparent 1px), linear-gradient(to top, #EC4899 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom'
          }}
        />

        {/* Ambient Neon Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#F43F5E]/10 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* ── TOP BROADCAST BAR ── */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-3 flex items-center justify-between border-b border-[#1A1E2D] bg-[#0A0D15]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F43F5E] to-[#9333EA] p-0.5 shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#0E111B] rounded-[14px] flex items-center justify-center">
              <Skull className="w-5 h-5 text-[#F43F5E]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-wide text-white drop-shadow-md">
                الحبار
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/30">
                SQUID SURVIVAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              AL-SHAIB ENTERTAINMENT • تحدي خطوات ونجاة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121622] border border-[#22283A] text-xs font-black">
            <Flame className="w-4 h-4 text-[#F43F5E] animate-pulse" />
            <span>الجولة {roundNumber}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#121622] border border-[#22283A] rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('ALIVE')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'ALIVE' 
                  ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>الناجون: {alivePlayers.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('ELIMINATED')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'ELIMINATED' 
                  ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span>المقصيون: {eliminatedPlayers.length}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(m => !m)}
              className={`p-2 rounded-xl border transition-all ${
                isMuted 
                  ? 'bg-[#1F2433] border-[#363E56] text-slate-400' 
                  : 'bg-[#161B29] border-[#2B344C] text-[#F43F5E]'
              }`}
              title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsSettingsOpen(s => !s)}
              className="p-2 rounded-xl bg-[#161B29] border border-[#2B344C] text-slate-300 hover:text-white hover:border-[#F43F5E] transition-all"
              title="إعدادات الهوست"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN BROADCAST WORKSPACE ── */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-center gap-6 justify-between">
        
        {/* ── PARTICIPANTS & PROGRESS TRACK PANEL ── */}
        <section className="w-full lg:w-[360px] h-[280px] lg:h-[620px] rounded-3xl bg-[#0C0F19]/90 border border-[#1F2437] backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl shrink-0 order-2 lg:order-1">
          <div className="px-5 py-3.5 border-b border-[#1A1F30] flex items-center justify-between bg-[#0F1321]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#F43F5E]" />
              <h2 className="text-xs font-black tracking-wider uppercase text-slate-200">
                {activeTab === 'ALIVE' ? 'المشاركون في المضمار' : 'سجل المقصيين'}
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1B2133] text-slate-300 border border-[#2D364F]">
              {activeTab === 'ALIVE' ? alivePlayers.length : eliminatedPlayers.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {activeTab === 'ALIVE' ? (
              alivePlayers.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Skull className="w-10 h-10 mb-2 stroke-[1.5] text-slate-600" />
                  <p className="text-xs font-bold">لا يوجد مشاركون حالياً</p>
                  <p className="text-[11px] text-slate-600 mt-1">اكتب «العب» في الشات للانضمام</p>
                </div>
              ) : (
                alivePlayers.map((player) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      player.status === 'LOCKED'
                        ? 'bg-gradient-to-r from-[#171D2F] to-[#121624] border-[#F43F5E]/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        : player.status === 'SAFE' || player.status === 'ADVANCED'
                        ? 'bg-[#0E1A17] border-[#10B981]/40'
                        : 'bg-[#101422]/90 border-[#1D2336] hover:border-[#2D364F]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={player.avatarUrl}
                          alt={player.displayName}
                          className="w-8 h-8 rounded-xl object-cover border border-[#2C344E] bg-black/40 shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate drop-shadow-sm">
                            {player.displayName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">
                            {player.username}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {player.lastChoice !== null ? (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#F43F5E] to-[#E11D48] text-white font-black text-xs font-mono shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                            <span>اختياره:</span>
                            <span className="text-sm font-extrabold">{player.lastChoice}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-[#161B2A] px-2 py-1 rounded-lg border border-[#252D42]">
                            بانتظار الاختيار
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {player.currentStep} / {config.winningSteps}
                      </span>
                      {renderProgressTiles(player.currentStep, config.winningSteps)}
                    </div>
                  </div>
                ))
              )
            ) : (
              eliminatedPlayers.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <ShieldAlert className="w-10 h-10 mb-2 stroke-[1.5] text-slate-600" />
                  <p className="text-xs font-bold">لم يتم إقصاء أي لاعب حتى الآن!</p>
                </div>
              ) : (
                eliminatedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 rounded-2xl bg-[#140C0F] border border-[#EF4444]/30 flex items-center justify-between opacity-80"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={player.avatarUrl}
                          alt={player.displayName}
                          className="w-8 h-8 rounded-xl object-cover grayscale border border-red-900/50"
                        />
                        <span className="absolute -bottom-1 -right-1 text-xs">☠️</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-300 line-through">
                          {player.displayName}
                        </p>
                        <p className="text-[10px] text-red-400">
                          أُقصي في الجولة {player.eliminatedAtRound || 1}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      وصل: {player.currentStep} خطوات
                    </span>
                  </div>
                ))
              )
            )}
          </div>
        </section>

        {/* ── CENTER STAGE ARENA (3D CINEMATIC WebGL) ── */}
        <section className="flex-1 w-full min-h-[560px] lg:min-h-[620px] h-full rounded-3xl border border-[#1F253A] overflow-hidden relative shadow-2xl flex flex-col items-center justify-center order-1 lg:order-2 bg-[#06080E]">
          
          {/* 3D WebGL Scene */}
          <div className="absolute inset-0 z-0">
            <Squid3DScene
              phase={phase}
              dangerNumber={dangerNumber}
              players={players}
              config={config}
              cameraShake={cameraShake}
              winner={winner}
              roundNumber={roundNumber}
            />
          </div>

          {/* BROADCAST HUD OVERLAYS */}
          <div className="relative z-10 w-full h-full p-4 sm:p-6 flex flex-col items-center justify-between pointer-events-none">
            
            {/* Top Overlay Banner (Danger Reveal, Doll Movement, Locking) */}
            <div className="w-full flex flex-col items-center pointer-events-auto">
              {phase === 'DOLL_MOVEMENT' && (
                <div className="px-5 py-2 rounded-2xl bg-black/80 border border-red-500/60 backdrop-blur-md text-center shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse mb-3">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span>👀 الدمية تستدير وتفحص المتسابقين بالرادار...</span>
                  </div>
                </div>
              )}

              {/* DANGER REVEAL BANNER */}
              {phase === 'DANGER_REVEAL' && dangerNumber !== null && (
                <div className="w-full max-w-md p-5 rounded-3xl bg-gradient-to-r from-[#7F1D1D]/90 via-[#991B1B]/95 to-[#7F1D1D]/90 border-2 border-red-500 text-center shadow-[0_0_60px_rgba(239,68,68,0.8)] backdrop-blur-md animate-bounce mb-3">
                  <p className="text-xs font-black uppercase tracking-widest text-red-200 mb-1">
                    ⚠️ رقم الخطر في هذه الجولة ⚠️
                  </p>
                  <div className="text-6xl font-black font-mono text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                    {dangerNumber}
                  </div>
                  <p className="text-xs font-bold text-red-100 mt-1">
                    كل من اختار الرقم [{dangerNumber}] يتم استهدافه بليزر الدمية وإقصاؤه!
                  </p>
                </div>
              )}

              {/* LOCKING PHASE */}
              {phase === 'LOCKING' && (
                <div className="p-4 px-6 rounded-2xl bg-[#121626]/90 border border-[#27314B] text-center max-w-sm shadow-2xl backdrop-blur-md mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#F43F5E]/20 border border-[#F43F5E]/40 text-[#F43F5E] flex items-center justify-center mx-auto mb-2 animate-spin">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white mb-0.5">
                    أغلقت الاختيارات
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    جاري فحص وتثبيت اختيارات {totalChosenCount} متسابقين...
                  </p>
                </div>
              )}
            </div>

            {/* Center Overlays (LOBBY, RESULTS_REVEAL, GAME_OVER) */}
            <div className="w-full flex flex-col items-center justify-center my-auto pointer-events-auto">
              {phase === 'LOBBY' && (
                <div className="w-full max-w-lg text-center flex flex-col items-center p-6 sm:p-8 rounded-3xl bg-[#090C15]/85 border border-[#232A40]/80 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F43F5E] via-[#EC4899] to-[#8B5CF6] p-1 mb-4 shadow-[0_0_35px_rgba(244,63,94,0.4)] animate-pulse">
                    <div className="w-full h-full bg-[#090B12] rounded-[14px] flex items-center justify-center">
                      <Skull className="w-8 h-8 text-[#F43F5E]" />
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
                    لعبة «الحبار» — الساحة التفاعلية 3D
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-300 mb-5 max-w-sm">
                    تحدي خطوات ونجاة تفاعلي مباشر أمام الجمهور. اختر رقمك من 1 إلى 5 وتجنب رقم الخطر للوصول للنهاية!
                  </p>

                  <div className="w-full p-3.5 rounded-2xl bg-[#141929]/90 border border-[#2B3550] mb-5 flex items-center justify-center gap-3 shadow-inner">
                    <Radio className="w-4 h-4 text-[#F43F5E] animate-ping" />
                    <span className="text-sm sm:text-base font-black text-white">
                      اكتب <span className="text-[#F43F5E] underline decoration-2 underline-offset-4">«العب»</span> في الشات للدخول
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={startNextRound}
                      disabled={players.length === 0}
                      className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-xl ${
                        players.length > 0
                          ? 'bg-gradient-to-r from-[#F43F5E] to-[#E11D48] text-white hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(244,63,94,0.4)]'
                          : 'bg-[#181D2D] text-slate-500 border border-[#2A334B] cursor-not-allowed'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>بدء اللعبة ({players.length} مشارك)</span>
                    </button>

                    <button
                      onClick={() => handleAddMockPlayers(10)}
                      className="px-4 py-3 rounded-2xl bg-[#141928] border border-[#26304A] hover:border-[#F43F5E] text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <UserPlus className="w-4 h-4 text-[#F43F5E]" />
                      <span>+10 تجريبي (Demo)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* RESULTS REVEAL SUMMARY */}
              {phase === 'RESULT_REVEAL' && (
                <div className="w-full max-w-md p-5 rounded-3xl bg-[#0D111D]/90 border border-[#232B40] text-center shadow-2xl backdrop-blur-xl animate-fadeIn">
                  <h3 className="text-lg font-black text-white mb-2">
                    نتائج الجولة {roundNumber}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 my-3">
                    <div className="p-3 rounded-2xl bg-[#0F1E19]/80 border border-[#10B981]/40">
                      <p className="text-[11px] font-bold text-emerald-400 mb-0.5">🟢 الناجون والمتقدمون</p>
                      <p className="text-2xl font-black font-mono text-emerald-300">
                        {alivePlayers.length}
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#210D12]/80 border border-[#EF4444]/40">
                      <p className="text-[11px] font-bold text-rose-400 mb-0.5">🔴 المقصيون بالليزر</p>
                      <p className="text-2xl font-black font-mono text-rose-300">
                        {eliminatedPlayers.filter(p => p.eliminatedAtRound === roundNumber).length}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    جاري فحص خط النهاية والتجهيز للجولة القادمة...
                  </p>
                </div>
              )}

              {/* GAME OVER / WINNER STAGE */}
              {phase === 'GAME_OVER' && (
                <div className="w-full max-w-lg text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#161B2E]/95 via-[#0E1220]/95 to-[#0A0D16]/95 border-2 border-[#D6A84F] shadow-[0_0_80px_rgba(214,168,79,0.4)] backdrop-blur-2xl animate-fadeIn">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#D6A84F] to-[#FFE28A] p-1 mx-auto mb-3 shadow-[0_0_40px_rgba(214,168,79,0.5)]">
                    <div className="w-full h-full bg-[#0E111B] rounded-[22px] flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-[#D6A84F] animate-bounce" />
                    </div>
                  </div>

                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#D6A84F]/20 text-[#D6A84F] border border-[#D6A84F]/40 mb-2 inline-block">
                    CHAMPION OF SQUID SURVIVAL
                  </span>

                  {winner ? (
                    <>
                      <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
                        الفائز باللعبة: {winner.displayName}
                      </h2>
                      <p className="text-xs text-slate-300 font-medium mb-4">
                        وصل إلى خط النهاية ({winner.currentStep} / {config.winningSteps} خطوات) ونجا من كافة الجولات بنجاح!
                      </p>
                      
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <img
                          src={winner.avatarUrl}
                          alt={winner.displayName}
                          className="w-14 h-14 rounded-2xl border-2 border-[#D6A84F] shadow-lg"
                        />
                        <div className="text-right">
                          <p className="text-sm font-black text-white">{winner.displayName}</p>
                          <p className="text-[11px] font-mono text-slate-400">{winner.username}</p>
                          <p className="text-[11px] font-bold text-[#D6A84F] mt-0.5">+1000 نقطة فوز في لوحة الصدارة</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="my-4">
                      <h2 className="text-xl font-black text-white mb-1">
                        انتهت اللعبة دون أي فائز!
                      </h2>
                      <p className="text-xs text-slate-400">
                        تم إقصاء جميع المشاركين في رقم الخطر الأخير.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={handleResetGame}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D6A84F] to-[#E5BE6C] text-[#08090C] font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                      <span>بدء لعبة جديدة</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Overlay: CHOOSING PHASE COUNTDOWN & OPTIONS */}
            {phase === 'CHOOSING' && (
              <div className="pointer-events-auto w-full max-w-2xl flex flex-col items-center bg-black/60 p-3 sm:p-4 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
                <div className="text-center mb-2 flex items-center justify-between w-full px-4">
                  <p className="text-xs sm:text-sm font-black text-slate-200">
                    اكتب رقمك من <span className="text-[#F43F5E]">1 إلى 5</span> في الشات
                  </p>
                  <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]">
                    00:{String(timeRemainingSeconds).padStart(2, '0')}
                  </div>
                </div>

                <div className="w-full grid grid-cols-5 gap-1.5 sm:gap-2.5 mb-2.5">
                  {[
                    { num: 1, label: 'أمان فائق', steps: '+1 خطوة', risk: 'منخفض جداً', color: 'border-emerald-500/40 from-emerald-950/60 bg-emerald-950/40' },
                    { num: 2, label: 'حذر', steps: '+2 خطوات', risk: 'منخفض', color: 'border-teal-500/40 from-teal-950/60 bg-teal-950/40' },
                    { num: 3, label: 'متوازن', steps: '+3 خطوات', risk: 'متوسط', color: 'border-blue-500/40 from-blue-950/60 bg-blue-950/40' },
                    { num: 4, label: 'مخاطرة', steps: '+4 خطوات', risk: 'مرتفع', color: 'border-amber-500/40 from-amber-950/60 bg-amber-950/40' },
                    { num: 5, label: 'مخاطرة قصوى', steps: '+5 خطوات', risk: 'مرتفع جداً', color: 'border-rose-500/40 from-rose-950/60 bg-rose-950/40' }
                  ].map((item) => {
                    const count = choiceStats[item.num] || 0;
                    const percentage = totalChosenCount > 0 ? Math.round((count / totalChosenCount) * 100) : 0;

                    return (
                      <div
                        key={item.num}
                        className={`p-2 sm:p-3 rounded-2xl bg-gradient-to-b to-[#0D101C]/90 border flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-300 ${item.color} ${
                          count > 0 ? 'shadow-[0_0_20px_rgba(244,63,94,0.25)] scale-[1.02]' : 'opacity-80'
                        }`}
                      >
                        <span className="text-[9px] font-bold text-slate-300 mb-0.5">
                          {item.label}
                        </span>
                        <span className="text-2xl sm:text-3xl font-black font-mono text-white mb-0.5">
                          {item.num}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-white/10 text-white mb-1.5">
                          {item.steps}
                        </span>

                        <div className="w-full pt-1.5 border-t border-white/10 flex flex-col items-center">
                          <span className="text-[10px] font-mono font-bold text-white">
                            {count} لاعب
                          </span>
                          <span className="text-[8px] text-slate-400 font-mono">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSimulateChoices}
                    className="px-3 py-1.5 rounded-xl bg-[#151928] border border-[#27324A] hover:border-[#F43F5E] text-slate-300 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Sparkles className="w-3 h-3 text-[#F43F5E]" />
                    <span>محاكاة اختيارات الشات (Demo)</span>
                  </button>
                  <button
                    onClick={handleLockChoices}
                    className="px-3 py-1.5 rounded-xl bg-[#F43F5E]/20 border border-[#F43F5E]/40 text-[#F43F5E] hover:bg-[#F43F5E]/30 text-[11px] font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Clock className="w-3 h-3" />
                    <span>إغلاق الاختيارات فوراً</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      {/* BOTTOM BAR: LIVE ACTIVITY TICKER */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-2.5 border-t border-[#181D2C] bg-[#0A0D15]/90 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400 overflow-hidden">
          <Activity className="w-4 h-4 text-[#F43F5E] shrink-0 animate-pulse" />
          <span className="font-bold text-slate-300 shrink-0">آخر التفاعلات:</span>
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap text-slate-400 text-[11px]">
            {activityLogs.length > 0 ? (
              activityLogs.slice(0, 3).map(log => (
                <span key={log.id} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#141928] border border-[#232C42]">
                  <span>{log.icon}</span>
                  <span className="text-slate-200">{log.text}</span>
                  <span className="text-slate-500 text-[9px] font-mono">{log.time}</span>
                </span>
              ))
            ) : (
              <span className="text-slate-500">بانتظار تفاعل وتعليقات الجمهور في الشات...</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="px-3 py-1 rounded-xl bg-[#141826] border border-[#232A3E] text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isPaused ? 'استئناف' : 'إيقاف مؤقت'}</span>
          </button>
        </div>
      </footer>

      {/* HOST SETTINGS DRAWER */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0F1321] border border-[#242D45] shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-[#1E253A] pb-3 mb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#F43F5E]" />
                <span>إعدادات لعبة الحبار (Host Controls)</span>
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-7 h-7 rounded-xl bg-[#181E30] text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-300">
              <div>
                <label className="block mb-1.5 text-slate-400">خطوات الفوز لخط النهاية:</label>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 8, 10, 15, 20].map(s => (
                    <button
                      key={s}
                      onClick={() => setConfig(c => ({ ...c, winningSteps: s }))}
                      className={`py-2 rounded-xl border text-center font-bold font-mono transition-all ${
                        config.winningSteps === s
                          ? 'bg-[#F43F5E] text-white border-rose-400 shadow-md'
                          : 'bg-[#141928] border-[#252E44] text-slate-300'
                      }`}
                    >
                      {s} خطوات
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400">مدة وقت الاختيار (ثوانٍ):</label>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 10, 15, 20, 30].map(d => (
                    <button
                      key={d}
                      onClick={() => setConfig(c => ({ ...c, choiceDurationSeconds: d }))}
                      className={`py-2 rounded-xl border text-center font-bold font-mono transition-all ${
                        config.choiceDurationSeconds === d
                          ? 'bg-[#F43F5E] text-white border-rose-400 shadow-md'
                          : 'bg-[#141928] border-[#252E44] text-slate-300'
                      }`}
                    >
                      {d} ث
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400">وضع الفوز:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'first_to_finish', label: 'أول واصل للنهاية 🏁' },
                    { id: 'last_survivor', label: 'آخر ناجٍ على قيد الحياة 👑' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setConfig(c => ({ ...c, winMode: m.id as SquidWinMode }))}
                      className={`py-2.5 px-3 rounded-xl border text-center font-bold transition-all ${
                        config.winMode === m.id
                          ? 'bg-[#F43F5E] text-white border-rose-400'
                          : 'bg-[#141928] border-[#252E44] text-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400">مستوى المخاطرة للخطر:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'easy', label: 'سهل' },
                    { id: 'normal', label: 'عادي' },
                    { id: 'hard', label: 'صعب' },
                    { id: 'extreme', label: 'Extreme' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setConfig(c => ({ ...c, riskLevel: r.id as SquidRiskLevel }))}
                      className={`py-2 rounded-xl border text-center font-bold transition-all ${
                        config.riskLevel === r.id
                          ? 'bg-[#8B5CF6] text-white border-purple-400'
                          : 'bg-[#141928] border-[#252E44] text-slate-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141928] border border-[#232C42]">
                <span>السماح بدخول لاعبين جدد أثناء اللعبة:</span>
                <input
                  type="checkbox"
                  checked={config.allowJoinMidGame}
                  onChange={e => setConfig(c => ({ ...c, allowJoinMidGame: e.target.checked }))}
                  className="w-5 h-5 accent-[#F43F5E] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#1E253A] flex items-center justify-between">
              <button
                onClick={handleResetGame}
                className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 font-bold hover:bg-red-900/60 transition-all"
              >
                إعادة ضبط اللعبة
              </button>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-2 rounded-xl bg-[#F43F5E] hover:bg-[#E11D48] text-white font-black transition-all"
              >
                حفظ وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
