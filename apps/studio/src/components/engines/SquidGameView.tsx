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

  const [config, setConfig] = useState<SquidGameConfig>(() => ({
    ...DEFAULT_SQUID_CONFIG,
    ...(propQuestion?.config || {})
  }));

  const [phase, setPhase] = useState<SquidGamePhase>('LOBBY');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [players, setPlayers] = useState<SquidPlayer[]>([]);
  const [dangerNumber, setDangerNumber] = useState<number | null>(null);
  const [winner, setWinner] = useState<SquidPlayer | null>(null);

  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(config.choiceDurationSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cameraShake, setCameraShake] = useState<boolean>(false);

  const [activityLogs, setActivityLogs] = useState<{ id: string; text: string; time: string; icon: string }[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ALIVE' | 'ELIMINATED'>('ALIVE');

  const registeredUserIdsRef = useRef<Set<string>>(new Set());
  const processedCommentIdsRef = useRef<Set<string>>(new Set());
  const roundTimerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<SquidGamePhase>(phase);
  phaseRef.current = phase;

  const playSound = useCallback((type: any, vol: number = 0.8) => {
    if (!isMuted && config.soundEnabled) {
      soundFX.play(type, vol);
    }
  }, [isMuted, config.soundEnabled]);

  const addLog = useCallback((text: string, icon: string = 'ðŸ¦‘') => {
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLogs(prev => [{ id: `${Date.now()}-${Math.random()}`, text, time, icon }, ...prev.slice(0, 6)]);
  }, []);

  const alivePlayers = useMemo(() => players.filter(p => p.isAlive), [players]);
  const eliminatedPlayers = useMemo(() => players.filter(p => !p.isAlive), [players]);

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

  const processComment = useCallback((c: any) => {
    if (!c) return;
    const cid = String(c.id || `${c.userId}-${c.createTime || Date.now()}`);
    if (processedCommentIdsRef.current.has(cid)) return;
    processedCommentIdsRef.current.add(cid);

    const rawText = (c.comment || c.commentText || '').trim();
    const uid = String(c.userId || c.username || `user-${Date.now()}`).toLowerCase();

    const isRegisterKeyword = rawText.includes('Ø§Ù„Ø¹Ø¨') || rawText.includes('Ù„Ø¹Ø¨') || rawText.includes('Ø´Ø§Ø±Ùƒ') || rawText.toLowerCase().includes('play');
    
    if (isRegisterKeyword && (phaseRef.current === 'LOBBY' || (config.allowJoinMidGame && phaseRef.current !== 'LOCKING' && phaseRef.current !== 'DOLL_MOVEMENT' && phaseRef.current !== 'DANGER_REVEAL'))) {
      if (!registeredUserIdsRef.current.has(uid)) {
        registeredUserIdsRef.current.add(uid);
        const newPlayer: SquidPlayer = {
          id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: uid,
          username: c.username || `@user_${Math.floor(Math.random() * 900 + 100)}`,
          displayName: c.displayName || c.authorName || c.username || 'Ù…ØªØ³Ø§Ø¨Ù‚ Ø§Ù„Ø­Ø¨Ø§Ø±',
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
        addLog(`Ø§Ù†Ø¶Ù… Ø§Ù„Ù…ØªØ³Ø§Ø¨Ù‚ [${newPlayer.displayName}] Ù„Ù„Ù…Ø¶Ù…Ø§Ø±!`, 'ðŸ‘¤');
      }
      return;
    }

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
              addLog(`${p.displayName} Ø§Ø®ØªØ§Ø± Ø§Ù„Ø±Ù‚Ù… [ ${choice} ]`, 'ðŸŽ¯');
            }
          }
          return updated;
        });
      }
    }
  }, [config.allowJoinMidGame, config.winningSteps, playSound, addLog]);

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

  const clearAllTimers = useCallback(() => {
    if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
  }, []);

  const startNextRound = useCallback(() => {
    clearAllTimers();
    setDangerNumber(null);
    setCameraShake(false);

    setPlayers(prev => prev.map(p => ({
      ...p,
      lastChoice: null,
      status: p.isAlive ? 'CHOOSING' : 'ELIMINATED'
    })));

    setPhase('ROUND_START');
    playSound('round_start', 0.9);
    addLog(`ðŸš¨ Ø¨Ø¯Ø£Øª Ø§Ù„Ø¬ÙˆÙ„Ø© [${roundNumber}]! Ø§Ø³ØªØ¹Ø¯ÙˆØ§ Ù„Ù„Ø§Ø®ØªÙŠØ§Ø±`, 'ðŸ”¥');

    phaseTimeoutRef.current = setTimeout(() => {
      setPhase('CHOOSING');
      setTimeRemainingSeconds(config.choiceDurationSeconds);
      playSound('gear_rotate', 0.7);
    }, 2500);
  }, [clearAllTimers, roundNumber, config.choiceDurationSeconds, playSound, addLog]);

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

  const handleLockChoices = useCallback(() => {
    setPhase('LOCKING');
    playSound('time_up', 0.9);
    addLog('â›” Ø§Ù†ØªÙ‡Ù‰ ÙˆÙ‚Øª Ø§Ù„Ø§Ø®ØªÙŠØ§Ø±! Ø¬Ø§Ø±ÙŠ ØªØ­Ù„ÙŠÙ„ Ø§Ø®ØªÙŠØ§Ø±Ø§Øª Ø§Ù„Ù…ØªØ³Ø§Ø¨Ù‚ÙŠÙ†...', 'ðŸ”’');

    phaseTimeoutRef.current = setTimeout(() => {
      setPhase('DOLL_MOVEMENT');
      playSound('doll_turn', 1.0);
      addLog('ðŸ‘€ Ø§Ù„Ø¯Ù…ÙŠØ© ØªÙ„ØªÙØª Ù†Ø­Ùˆ Ø§Ù„Ù…Ø¶Ù…Ø§Ø± Ù„Ù„Ù…Ø³Ø­ Ø§Ù„Ø´Ø§Ù…Ù„...', 'ðŸ¤–');

      phaseTimeoutRef.current = setTimeout(() => {
        handleRevealDanger();
      }, 3500);
    }, 2000);
  }, [playSound, addLog]);

  const handleRevealDanger = useCallback(() => {
    const currentChoices = players.filter(p => p.isAlive).map(p => p.lastChoice);
    const danger = determineSquidDangerNumber(roundNumber, config.riskLevel, currentChoices);
    
    setDangerNumber(danger);
    setPhase('DANGER_REVEAL');
    setCameraShake(true);
    setTimeout(() => setCameraShake(false), 800);

    playSound('danger_reveal', 1.0);
    addLog(`âš ï¸ Ø±Ù‚Ù… Ø§Ù„Ø®Ø·Ø± Ø§Ù„Ù…Ø¹Ù„Ù† Ù‡Ùˆ [ ${danger} ]!`, 'âš¡');

    phaseTimeoutRef.current = setTimeout(() => {
      setPhase('RESULT_REVEAL');

      let elimCount = 0;
      let advCount = 0;
      let foundWinner: SquidPlayer | null = null;

      setPlayers(prevPlayers => {
        const updated = prevPlayers.map(p => {
          if (!p.isAlive) return p;

          if (p.lastChoice === danger) {
            elimCount++;
            return {
              ...p,
              status: 'DANGER' as const,
              isAlive: false,
              eliminatedAtRound: roundNumber
            };
          }

          if (p.lastChoice === null) {
            return {
              ...p,
              status: 'SAFE' as const,
              roundsSurvived: p.roundsSurvived + 1
            };
          }

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
        addLog(`â˜ ï¸ ØªÙ… Ø¥Ù‚ØµØ§Ø¡ ${elimCount} Ù„Ø§Ø¹Ø¨ÙŠÙ† Ù„Ø§Ø®ØªÙŠØ§Ø±Ù‡Ù… Ø±Ù‚Ù… Ø§Ù„Ø®Ø·Ø±!`, 'ðŸ’¥');
      } else {
        playSound('correct_answer', 0.8);
        addLog(`ðŸŸ¢ Ù†Ø¬Ø§ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…ØªØ³Ø§Ø¨Ù‚ÙŠÙ† ÙÙŠ Ù‡Ø°Ù‡ Ø§Ù„Ø¬ÙˆÙ„Ø© Ø¯ÙˆÙ† Ø£ÙŠ Ø¥Ù‚ØµØ§Ø¡!`, 'ðŸ›¡ï¸');
      }

      phaseTimeoutRef.current = setTimeout(() => {
        handleWinCheck(foundWinner);
      }, config.resultDisplayDurationSeconds * 1000);

    }, 2000);
  }, [players, roundNumber, config.riskLevel, config.winningSteps, config.resultDisplayDurationSeconds, playSound, addLog]);

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
        addLog('Ø§Ù†ØªÙ‡Øª Ø§Ù„Ø¬ÙˆÙ„Ø© Ù…Ø¹ Ø¥Ù‚ØµØ§Ø¡ Ø§Ù„Ø¬Ù…ÙŠØ¹!', 'âš ï¸');
        return;
      }
    }

    if (stillAlive.length === 0) {
      setPhase('GAME_OVER');
      playSound('wrong_answer', 1.0);
      addLog('ðŸ’€ Ø³Ù‚Ø· Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù„Ø§Ø¹Ø¨ÙŠÙ† ÙÙŠ Ø§Ù„ÙØ®! Ù„Ø§ ÙŠÙˆØ¬Ø¯ ÙØ§Ø¦Ø²', 'â˜ ï¸');
      return;
    }

    setPhase('ROUND_END');
    setRoundNumber(r => r + 1);
    addLog(`ðŸŽ‰ Ø§ÙƒØªÙ…Ù„Øª Ø§Ù„Ø¬ÙˆÙ„Ø©! Ø§Ù„Ø§Ø³ØªØ¹Ø¯Ø§Ø¯ Ù„Ù„Ø¬ÙˆÙ„Ø© Ø§Ù„ØªØ§Ù„ÙŠØ©...`, 'â³');

    phaseTimeoutRef.current = setTimeout(() => {
      startNextRound();
    }, 3000);
  }, [config.winMode, config.winningSteps, players, playSound, addLog, startNextRound]);

  const declareWinner = useCallback((winningPlayer: SquidPlayer) => {
    setWinner(winningPlayer);
    setPhase('GAME_OVER');
    playSound('winner_announcement', 1.0);
    triggerVisualEffect('confetti');
    triggerVisualEffect('fireworks');
    addLog(`ðŸ† Ø¨Ø·Ù„ Ø§Ù„Ø­Ø¨Ø§Ø±: [${winningPlayer.displayName}] ÙØ§Ø² Ø¨Ø§Ù„Ø³Ø¨Ø§Ù‚!`, 'ðŸ‘‘');

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
    addLog('ðŸ”„ ØªÙ… Ø¥Ø¹Ø§Ø¯Ø© ØªÙ‡ÙŠØ¦Ø© Ø§Ù„Ù„Ø¹Ø¨Ø© Ø¨Ø§Ù„ÙƒØ§Ù…Ù„ ÙˆØ§Ø³ØªØ¹Ø¯Ø§Ø¯ Ø§Ù„Ù„ÙˆØ¨ÙŠ', 'ðŸ”„');
  }, [clearAllTimers, config.choiceDurationSeconds, playSound, addLog]);

  const handleAddMockPlayers = useCallback((count: number = 10) => {
    const mockList = generateMockSquidPlayers(count, config.winningSteps);
    mockList.forEach(p => registeredUserIdsRef.current.add(p.userId));
    setPlayers(prev => [...prev, ...mockList]);
    playSound('score_update', 0.6);
    addLog(`ðŸ¤– ØªÙ… ØªÙˆÙ„ÙŠØ¯ [${count}] Ù…ØªØ³Ø§Ø¨Ù‚ ØªØ¬Ø±ÙŠØ¨ÙŠ (Demo Mode)`, 'ðŸ§ª');
  }, [config.winningSteps, playSound, addLog]);

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
    addLog('âš¡ ØªÙ… Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ø®ØªÙŠØ§Ø±Ø§Øª Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù„Ø§Ø¹Ø¨ÙŠÙ† Ø¢Ù„ÙŠØ§Ù‹ ÙÙŠ Ø§Ù„Ø´Ø§Øª', 'ðŸŽ²');
  }, [phase, playSound, addLog]);

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
    <div className={`w-full min-h-screen bg-[#07080C] text-white flex flex-col justify-between overflow-hidden relative select-none font-sans ${cameraShake ? 'animate-bounce' : ''}`}>
      
      {/* AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,25,40,0.6)_0%,rgba(7,8,12,0.95)_75%,rgba(5,6,9,1)_100%)]" />
        <div 
          className="absolute inset-x-0 bottom-0 h-[380px] opacity-15"
          style={{
            backgroundImage: 'linear-gradient(to right, #EC4899 1px, transparent 1px), linear-gradient(to top, #EC4899 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom'
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#F43F5E]/10 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* TOP BROADCAST BAR */}
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
                Ø§Ù„Ø­Ø¨Ø§Ø±
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/30">
                SQUID SURVIVAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              AL-SHAIB ENTERTAINMENT â€¢ ØªØ­Ø¯ÙŠ Ø®Ø·ÙˆØ§Øª ÙˆÙ†Ø¬Ø§Ø©
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121622] border border-[#22283A] text-xs font-black">
            <Flame className="w-4 h-4 text-[#F43F5E] animate-pulse" />
            <span>Ø§Ù„Ø¬ÙˆÙ„Ø© {roundNumber}</span>
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
              <span>Ø§Ù„Ù†Ø§Ø¬ÙˆÙ†: {alivePlayers.length}</span>
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
              <span>Ø§Ù„Ù…Ù‚ØµÙŠÙˆÙ†: {eliminatedPlayers.length}</span>
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
              title={isMuted ? 'ØªØ´ØºÙŠÙ„ Ø§Ù„ØµÙˆØª' : 'ÙƒØªÙ… Ø§Ù„ØµÙˆØª'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsSettingsOpen(s => !s)}
              className="p-2 rounded-xl bg-[#161B29] border border-[#2B344C] text-slate-300 hover:text-white hover:border-[#F43F5E] transition-all"
              title="Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù‡ÙˆØ³Øª"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN ARENA WORKSPACE */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-center gap-6 justify-between">
        
        {/* PARTICIPANTS & PROGRESS TRACK PANEL */}
        <section className="w-full lg:w-[360px] h-[280px] lg:h-[620px] rounded-3xl bg-[#0C0F19]/90 border border-[#1F2437] backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl shrink-0 order-2 lg:order-1">
          <div className="px-5 py-3.5 border-b border-[#1A1F30] flex items-center justify-between bg-[#0F1321]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#F43F5E]" />
              <h2 className="text-xs font-black tracking-wider uppercase text-slate-200">
                {activeTab === 'ALIVE' ? 'Ø§Ù„Ù…Ø´Ø§Ø±ÙƒÙˆÙ† ÙÙŠ Ø§Ù„Ù…Ø¶Ù…Ø§Ø±' : 'Ø³Ø¬Ù„ Ø§Ù„Ù…Ù‚ØµÙŠÙŠÙ†'}
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
                  <p className="text-xs font-bold">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø´Ø§Ø±ÙƒÙˆÙ† Ø­Ø§Ù„ÙŠØ§Ù‹</p>
                  <p className="text-[11px] text-slate-600 mt-1">Ø§ÙƒØªØ¨ Â«Ø§Ù„Ø¹Ø¨Â» ÙÙŠ Ø§Ù„Ø´Ø§Øª Ù„Ù„Ø§Ù†Ø¶Ù…Ø§Ù…</p>
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
                            <span>Ø§Ø®ØªÙŠØ§Ø±Ù‡:</span>
                            <span className="text-sm font-extrabold">{player.lastChoice}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-[#161B2A] px-2 py-1 rounded-lg border border-[#252D42]">
                            Ø¨Ø§Ù†ØªØ¸Ø§Ø± Ø§Ù„Ø§Ø®ØªÙŠØ§Ø±
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
                  <p className="text-xs font-bold">Ù„Ù… ÙŠØªÙ… Ø¥Ù‚ØµØ§Ø¡ Ø£ÙŠ Ù„Ø§Ø¹Ø¨ Ø­ØªÙ‰ Ø§Ù„Ø¢Ù†!</p>
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
                        <span className="absolute -bottom-1 -right-1 text-xs">â˜ ï¸</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-300 line-through">
                          {player.displayName}
                        </p>
                        <p className="text-[10px] text-red-400">
                          Ø£ÙÙ‚ØµÙŠ ÙÙŠ Ø§Ù„Ø¬ÙˆÙ„Ø© {player.eliminatedAtRound || 1}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      ÙˆØµÙ„: {player.currentStep} Ø®Ø·ÙˆØ§Øª
                    </span>
                  </div>
                ))
              )
            )}
          </div>
        </section>

        {/* CENTER STAGE ARENA */}
        <section className="flex-1 w-full flex flex-col items-center justify-center my-auto order-1 lg:order-2">
          
          {phase === 'LOBBY' && (
            <div className="w-full max-w-xl text-center flex flex-col items-center p-8 rounded-3xl bg-[#0D101C]/90 border border-[#232A40] shadow-2xl backdrop-blur-2xl">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#F43F5E] via-[#EC4899] to-[#8B5CF6] p-1 mb-5 shadow-[0_0_35px_rgba(244,63,94,0.4)] animate-pulse">
                <div className="w-full h-full bg-[#090B12] rounded-[22px] flex items-center justify-center">
                  <Skull className="w-10 h-10 text-[#F43F5E]" />
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                Ù„Ø¹Ø¨Ø© Â«Ø§Ù„Ø­Ø¨Ø§Ø±Â»
              </h2>
              <p className="text-sm font-semibold text-slate-300 mb-6 max-w-md">
                ØªØ­Ø¯ÙŠ Ø®Ø·ÙˆØ§Øª ÙˆÙ†Ø¬Ø§Ø© ØªÙØ§Ø¹Ù„ÙŠ Ù…Ø¨Ø§Ø´Ø± Ø£Ù…Ø§Ù… Ø§Ù„Ø¬Ù…Ù‡ÙˆØ±. Ø§Ø®ØªØ± Ø±Ù‚Ù…Ùƒ Ù…Ù† 1 Ø¥Ù„Ù‰ 5 ÙˆØªØ¬Ù†Ø¨ Ø±Ù‚Ù… Ø§Ù„Ø®Ø·Ø± Ù„Ù„ÙˆØµÙˆÙ„ Ù„Ù„Ù†Ù‡Ø§ÙŠØ©!
              </p>

              <div className="w-full p-4 rounded-2xl bg-[#141929] border border-[#2B3550] mb-6 flex items-center justify-center gap-3">
                <Radio className="w-5 h-5 text-[#F43F5E] animate-ping" />
                <span className="text-base sm:text-lg font-black text-white">
                  Ø§ÙƒØªØ¨ <span className="text-[#F43F5E] underline decoration-2 underline-offset-4">Â«Ø§Ù„Ø¹Ø¨Â»</span> ÙÙŠ Ø§Ù„Ø´Ø§Øª Ù„Ù„Ø¯Ø®ÙˆÙ„
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={startNextRound}
                  disabled={players.length === 0}
                  className={`px-8 py-3.5 rounded-2xl font-black text-base flex items-center gap-2 transition-all shadow-xl ${
                    players.length > 0
                      ? 'bg-gradient-to-r from-[#F43F5E] to-[#E11D48] text-white hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(244,63,94,0.4)]'
                      : 'bg-[#181D2D] text-slate-500 border border-[#2A334B] cursor-not-allowed'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Ø¨Ø¯Ø¡ Ø§Ù„Ù„Ø¹Ø¨Ø© ({players.length} Ù…Ø´Ø§Ø±Ùƒ)</span>
                </button>

                <button
                  onClick={() => handleAddMockPlayers(10)}
                  className="px-4 py-3.5 rounded-2xl bg-[#141928] border border-[#26304A] hover:border-[#F43F5E] text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-4 h-4 text-[#F43F5E]" />
                  <span>+10 ØªØ¬Ø±ÙŠØ¨ÙŠ (Demo)</span>
                </button>
              </div>
            </div>
          )}

          {phase !== 'LOBBY' && phase !== 'GAME_OVER' && (
            <div className="w-full flex flex-col items-center">
              
              {/* SURVEILLANCE DOLL MASCOT */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 mb-4 flex items-center justify-center">
                {(phase === 'DOLL_MOVEMENT' || phase === 'DANGER_REVEAL') && (
                  <div className="absolute inset-0 rounded-full border-2 border-[#EF4444]/60 animate-ping pointer-events-none" />
                )}

                <div 
                  className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-[#1E2337] via-[#141724] to-[#0A0D15] border-4 p-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center transition-all duration-700 relative ${
                    phase === 'DOLL_MOVEMENT' || phase === 'DANGER_REVEAL'
                      ? 'border-[#EF4444] shadow-[0_0_40px_rgba(239,68,68,0.5)] rotate-0 scale-105'
                      : 'border-[#38415C] rotate-180 scale-100 opacity-90'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-[#0D101C] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="flex items-center gap-6 mb-2">
                      <div 
                        className={`w-5 h-5 rounded-full transition-all duration-300 ${
                          phase === 'DOLL_MOVEMENT' || phase === 'DANGER_REVEAL'
                            ? 'bg-[#EF4444] shadow-[0_0_15px_#EF4444] animate-pulse'
                            : 'bg-[#10B981] shadow-[0_0_10px_#10B981]'
                        }`} 
                      />
                      <div 
                        className={`w-5 h-5 rounded-full transition-all duration-300 ${
                          phase === 'DOLL_MOVEMENT' || phase === 'DANGER_REVEAL'
                            ? 'bg-[#EF4444] shadow-[0_0_15px_#EF4444] animate-pulse'
                            : 'bg-[#10B981] shadow-[0_0_10px_#10B981]'
                        }`} 
                      />
                    </div>
                    <Crosshair className={`w-8 h-8 ${phase === 'DANGER_REVEAL' ? 'text-[#EF4444] animate-spin' : 'text-slate-600'}`} />
                  </div>

                  <span className={`absolute -bottom-2.5 px-3 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border shadow-md ${
                    phase === 'DOLL_MOVEMENT' || phase === 'DANGER_REVEAL'
                      ? 'bg-[#EF4444] text-white border-red-400 animate-pulse'
                      : 'bg-[#161B2B] text-slate-400 border-[#2F3952]'
                  }`}>
                    {phase === 'DOLL_MOVEMENT' ? 'ðŸ‘€ Ù…Ø³Ø­ ÙƒØ§Ø´Ù' : phase === 'DANGER_REVEAL' ? 'âš ï¸ ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ø®Ø·Ø±' : 'Ø§Ù„Ø¯Ù…ÙŠØ© ØªØ±Ø§Ù‚Ø¨ Ø§Ù„Ø®Ù„Ù'}
                  </span>
                </div>
              </div>

              {/* DANGER REVEAL BANNER */}
              {phase === 'DANGER_REVEAL' && dangerNumber !== null && (
                <div className="w-full max-w-lg mb-6 p-6 rounded-3xl bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#7F1D1D] border-2 border-red-500 text-center shadow-[0_0_60px_rgba(239,68,68,0.7)] animate-bounce">
                  <p className="text-xs font-black uppercase tracking-widest text-red-200 mb-1">
                    âš ï¸ Ø±Ù‚Ù… Ø§Ù„Ø®Ø·Ø± ÙÙŠ Ù‡Ø°Ù‡ Ø§Ù„Ø¬ÙˆÙ„Ø© âš ï¸
                  </p>
                  <div className="text-7xl font-black font-mono text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                    {dangerNumber}
                  </div>
                  <p className="text-sm font-bold text-red-100 mt-2">
                    ÙƒÙ„ Ù…Ù† Ø§Ø®ØªØ§Ø± Ø§Ù„Ø±Ù‚Ù… [{dangerNumber}] ÙŠØªÙ… Ø¥Ù‚ØµØ§Ø¤Ù‡ ÙÙˆØ±Ø§Ù‹!
                  </p>
                </div>
              )}

              {/* CHOOSING PHASE COUNTDOWN & OPTIONS */}
              {phase === 'CHOOSING' && (
                <div className="w-full max-w-2xl flex flex-col items-center">
                  <div className="text-center mb-4">
                    <p className="text-sm sm:text-base font-black text-slate-300 mb-1">
                      Ø§ÙƒØªØ¨ Ø±Ù‚Ù…Ùƒ Ù…Ù† <span className="text-[#F43F5E]">1 Ø¥Ù„Ù‰ 5</span> ÙÙŠ Ø§Ù„Ø´Ø§Øª
                    </p>
                    <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_25px_rgba(244,63,94,0.4)]">
                      00:{String(timeRemainingSeconds).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-5 gap-2 sm:gap-3 mb-4">
                    {[
                      { num: 1, label: 'Ø£Ù…Ø§Ù† ÙØ§Ø¦Ù‚', steps: '+1 Ø®Ø·ÙˆØ©', risk: 'Ù…Ù†Ø®ÙØ¶ Ø¬Ø¯Ø§Ù‹', color: 'border-emerald-500/40 from-emerald-950/40' },
                      { num: 2, label: 'Ø­Ø°Ø±', steps: '+2 Ø®Ø·ÙˆØ§Øª', risk: 'Ù…Ù†Ø®ÙØ¶', color: 'border-teal-500/40 from-teal-950/40' },
                      { num: 3, label: 'Ù…ØªÙˆØ§Ø²Ù†', steps: '+3 Ø®Ø·ÙˆØ§Øª', risk: 'Ù…ØªÙˆØ³Ø·', color: 'border-blue-500/40 from-blue-950/40' },
                      { num: 4, label: 'Ù…Ø®Ø§Ø·Ø±Ø©', steps: '+4 Ø®Ø·ÙˆØ§Øª', risk: 'Ù…Ø±ØªÙØ¹', color: 'border-amber-500/40 from-amber-950/40' },
                      { num: 5, label: 'Ù…Ø®Ø§Ø·Ø±Ø© Ù‚ØµÙˆÙ‰', steps: '+5 Ø®Ø·ÙˆØ§Øª', risk: 'Ù…Ø±ØªÙØ¹ Ø¬Ø¯Ø§Ù‹', color: 'border-rose-500/40 from-rose-950/40' }
                    ].map((item) => {
                      const count = choiceStats[item.num] || 0;
                      const percentage = totalChosenCount > 0 ? Math.round((count / totalChosenCount) * 100) : 0;

                      return (
                        <div
                          key={item.num}
                          className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-b to-[#0D101C] border flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-300 ${item.color} ${
                            count > 0 ? 'shadow-[0_0_20px_rgba(244,63,94,0.15)] scale-[1.02]' : 'opacity-70'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-400 mb-1">
                            {item.label}
                          </span>
                          <span className="text-3xl sm:text-4xl font-black font-mono text-white mb-1">
                            {item.num}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-white/10 text-white mb-2">
                            {item.steps}
                          </span>

                          <div className="w-full pt-2 border-t border-white/10 flex flex-col items-center">
                            <span className="text-[11px] font-mono font-bold text-white">
                              {count} Ù„Ø§Ø¹Ø¨
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
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
                      className="px-4 py-2 rounded-xl bg-[#151928] border border-[#27324A] hover:border-[#F43F5E] text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F43F5E]" />
                      <span>Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ø®ØªÙŠØ§Ø±Ø§Øª Ø§Ù„Ø´Ø§Øª (Demo)</span>
                    </button>
                    <button
                      onClick={handleLockChoices}
                      className="px-4 py-2 rounded-xl bg-[#F43F5E]/20 border border-[#F43F5E]/40 text-[#F43F5E] hover:bg-[#F43F5E]/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ø§Ø®ØªÙŠØ§Ø±Ø§Øª ÙÙˆØ±Ø§Ù‹</span>
                    </button>
                  </div>
                </div>
              )}

              {/* LOCKING PHASE */}
              {phase === 'LOCKING' && (
                <div className="p-6 rounded-3xl bg-[#121626] border border-[#27314B] text-center max-w-md shadow-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#F43F5E]/20 border border-[#F43F5E]/40 text-[#F43F5E] flex items-center justify-center mx-auto mb-3 animate-spin">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-1">
                    Ø£ØºÙ„Ù‚Øª Ø§Ù„Ø§Ø®ØªÙŠØ§Ø±Ø§Øª
                  </h3>
                  <p className="text-xs text-slate-300">
                    Ø¬Ø§Ø±ÙŠ ÙØ­Øµ ÙˆØªØ«Ø¨ÙŠØª Ø§Ø®ØªÙŠØ§Ø±Ø§Øª {totalChosenCount} Ù…ØªØ³Ø§Ø¨Ù‚ÙŠÙ†...
                  </p>
                </div>
              )}

              {/* RESULTS REVEAL SUMMARY */}
              {phase === 'RESULT_REVEAL' && (
                <div className="w-full max-w-xl p-6 rounded-3xl bg-[#0D111D]/95 border border-[#232B40] text-center shadow-2xl backdrop-blur-2xl">
                  <h3 className="text-xl font-black text-white mb-2">
                    Ù†ØªØ§Ø¦Ø¬ Ø§Ù„Ø¬ÙˆÙ„Ø© {roundNumber}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="p-4 rounded-2xl bg-[#0F1E19] border border-[#10B981]/40">
                      <p className="text-xs font-bold text-emerald-400 mb-1">ðŸŸ¢ Ø§Ù„Ù†Ø§Ø¬ÙˆÙ† ÙˆØ§Ù„Ù…ØªÙ‚Ø¯Ù…ÙˆÙ†</p>
                      <p className="text-3xl font-black font-mono text-emerald-300">
                        {alivePlayers.length}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#210D12] border border-[#EF4444]/40">
                      <p className="text-xs font-bold text-rose-400 mb-1">ðŸ”´ Ø§Ù„Ù…Ù‚ØµÙŠÙˆÙ† ÙÙŠ Ø§Ù„Ø®Ø·Ø±</p>
                      <p className="text-3xl font-black font-mono text-rose-300">
                        {eliminatedPlayers.filter(p => p.eliminatedAtRound === roundNumber).length}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">
                    Ø¬Ø§Ø±ÙŠ ÙØ­Øµ Ø®Ø· Ø§Ù„Ù†Ù‡Ø§ÙŠØ© ÙˆØ§Ù„ØªØ¬Ù‡ÙŠØ² Ù„Ù„Ø¬ÙˆÙ„Ø© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* GAME OVER / WINNER STAGE */}
          {phase === 'GAME_OVER' && (
            <div className="w-full max-w-xl text-center p-8 rounded-3xl bg-gradient-to-b from-[#161B2E] via-[#0E1220] to-[#0A0D16] border-2 border-[#D6A84F] shadow-[0_0_80px_rgba(214,168,79,0.3)] backdrop-blur-3xl animate-fadeIn">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#D6A84F] to-[#FFE28A] p-1 mx-auto mb-4 shadow-[0_0_40px_rgba(214,168,79,0.5)]">
                <div className="w-full h-full bg-[#0E111B] rounded-[22px] flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-[#D6A84F] animate-bounce" />
                </div>
              </div>

              <span className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-[#D6A84F]/20 text-[#D6A84F] border border-[#D6A84F]/40 mb-3 inline-block">
                CHAMPION OF SQUID SURVIVAL
              </span>

              {winner ? (
                <>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-1">
                    Ø§Ù„ÙØ§Ø¦Ø² Ø¨Ø§Ù„Ù„Ø¹Ø¨Ø©: {winner.displayName}
                  </h2>
                  <p className="text-sm text-slate-300 font-medium mb-6">
                    ÙˆØµÙ„ Ø¥Ù„Ù‰ Ø®Ø· Ø§Ù„Ù†Ù‡Ø§ÙŠØ© ({winner.currentStep} / {config.winningSteps} Ø®Ø·ÙˆØ§Øª) ÙˆÙ†Ø¬Ø§ Ù…Ù† ÙƒØ§ÙØ© Ø§Ù„Ø¬ÙˆÙ„Ø§Øª Ø¨Ù†Ø¬Ø§Ø­!
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <img
                      src={winner.avatarUrl}
                      alt={winner.displayName}
                      className="w-16 h-16 rounded-2xl border-2 border-[#D6A84F] shadow-lg"
                    />
                    <div className="text-right">
                      <p className="text-base font-black text-white">{winner.displayName}</p>
                      <p className="text-xs font-mono text-slate-400">{winner.username}</p>
                      <p className="text-xs font-bold text-[#D6A84F] mt-1">+1000 Ù†Ù‚Ø·Ø© ÙÙˆØ² ÙÙŠ Ù„ÙˆØ­Ø© Ø§Ù„ØµØ¯Ø§Ø±Ø©</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="my-6">
                  <h2 className="text-2xl font-black text-white mb-2">
                    Ø§Ù†ØªÙ‡Øª Ø§Ù„Ù„Ø¹Ø¨Ø© Ø¯ÙˆÙ† Ø£ÙŠ ÙØ§Ø¦Ø²!
                  </h2>
                  <p className="text-xs text-slate-400">
                    ØªÙ… Ø¥Ù‚ØµØ§Ø¡ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ø´Ø§Ø±ÙƒÙŠÙ† ÙÙŠ Ø±Ù‚Ù… Ø§Ù„Ø®Ø·Ø± Ø§Ù„Ø£Ø®ÙŠØ±.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetGame}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#D6A84F] to-[#E5BE6C] text-[#08090C] font-black text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                  <span>Ø¨Ø¯Ø¡ Ù„Ø¹Ø¨Ø© Ø¬Ø¯ÙŠØ¯Ø©</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* BOTTOM BAR: LIVE ACTIVITY TICKER */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-2.5 border-t border-[#181D2C] bg-[#0A0D15]/90 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400 overflow-hidden">
          <Activity className="w-4 h-4 text-[#F43F5E] shrink-0 animate-pulse" />
          <span className="font-bold text-slate-300 shrink-0">Ø¢Ø®Ø± Ø§Ù„ØªÙØ§Ø¹Ù„Ø§Øª:</span>
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
              <span className="text-slate-500">Ø¨Ø§Ù†ØªØ¸Ø§Ø± ØªÙØ§Ø¹Ù„ ÙˆØªØ¹Ù„ÙŠÙ‚Ø§Øª Ø§Ù„Ø¬Ù…Ù‡ÙˆØ± ÙÙŠ Ø§Ù„Ø´Ø§Øª...</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="px-3 py-1 rounded-xl bg-[#141826] border border-[#232A3E] text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isPaused ? 'Ø§Ø³ØªØ¦Ù†Ø§Ù' : 'Ø¥ÙŠÙ‚Ø§Ù Ù…Ø¤Ù‚Øª'}</span>
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
                <span>Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ù„Ø¹Ø¨Ø© Ø§Ù„Ø­Ø¨Ø§Ø± (Host Controls)</span>
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-7 h-7 rounded-xl bg-[#181E30] text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                âœ•
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-300">
              <div>
                <label className="block mb-1.5 text-slate-400">Ø®Ø·ÙˆØ§Øª Ø§Ù„ÙÙˆØ² Ù„Ø®Ø· Ø§Ù„Ù†Ù‡Ø§ÙŠØ©:</label>
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
                      {s} Ø®Ø·ÙˆØ§Øª
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400">Ù…Ø¯Ø© ÙˆÙ‚Øª Ø§Ù„Ø§Ø®ØªÙŠØ§Ø± (Ø«ÙˆØ§Ù†Ù):</label>
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
                      {d} Ø«
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400">ÙˆØ¶Ø¹ Ø§Ù„ÙÙˆØ²:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'first_to_finish', label: 'Ø£ÙˆÙ„ ÙˆØ§ØµÙ„ Ù„Ù„Ù†Ù‡Ø§ÙŠØ© ðŸ' },
                    { id: 'last_survivor', label: 'Ø¢Ø®Ø± Ù†Ø§Ø¬Ù Ø¹Ù„Ù‰ Ù‚ÙŠØ¯ Ø§Ù„Ø­ÙŠØ§Ø© ðŸ‘‘' }
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
                <label className="block mb-1.5 text-slate-400">Ù…Ø³ØªÙˆÙ‰ Ø§Ù„Ù…Ø®Ø§Ø·Ø±Ø© Ù„Ù„Ø®Ø·Ø±:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'easy', label: 'Ø³Ù‡Ù„' },
                    { id: 'normal', label: 'Ø¹Ø§Ø¯ÙŠ' },
                    { id: 'hard', label: 'ØµØ¹Ø¨' },
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
                <span>Ø§Ù„Ø³Ù…Ø§Ø­ Ø¨Ø¯Ø®ÙˆÙ„ Ù„Ø§Ø¹Ø¨ÙŠÙ† Ø¬Ø¯Ø¯ Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„Ù„Ø¹Ø¨Ø©:</span>
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
                Ø¥Ø¹Ø§Ø¯Ø© Ø¶Ø¨Ø· Ø§Ù„Ù„Ø¹Ø¨Ø©
              </button>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-2 rounded-xl bg-[#F43F5E] hover:bg-[#E11D48] text-white font-black transition-all"
              >
                Ø­ÙØ¸ ÙˆØ¥ØºÙ„Ø§Ù‚
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
