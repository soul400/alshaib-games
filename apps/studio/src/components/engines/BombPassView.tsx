'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  BombPlayer, 
  BombPlayerStatus, 
  BombPassQuestion, 
  BombConfig, 
  BombDifficultyPreset, 
  BombInstance, 
  BombPowerUp, 
  TikTokLiveComment 
} from '@aep/types';
import { 
  parseBombPassCommand, 
  getBombDurationForRound, 
  generateMockBombPlayers, 
  generateBombPassQuestion 
} from '@aep/game-engines';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { tiktokEngine } from '@aep/tiktok-live';
import { useStudioStore } from '../../store/useStudioStore';
import { 
  Flame, 
  Shield, 
  RefreshCw, 
  Snowflake, 
  Users, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Volume2, 
  VolumeX, 
  Skull, 
  Trophy, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  UserPlus, 
  ChevronRight, 
  Clock, 
  ArrowRightLeft,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface BombPassViewProps {
  question?: BombPassQuestion;
  onUpdateQuestion?: (updated: BombPassQuestion) => void;
  onGameEnd?: (winner: BombPlayer) => void;
  isHost?: boolean;
}

export const BombPassView: React.FC<BombPassViewProps> = ({
  question: propQuestion,
  onUpdateQuestion,
  onGameEnd,
  isHost = true
}) => {
  // ─────────────────────────────────────────────────────────────
  // 1. GAME STATE INITIALIZATION & DEFENSIVE GUARDS
  // ─────────────────────────────────────────────────────────────
  const initialSession = useMemo(() => {
    const fallback = generateBombPassQuestion();
    if (!propQuestion || propQuestion.engineType !== 'bomb-pass') {
      return fallback;
    }
    return {
      ...fallback,
      ...propQuestion,
      players: Array.isArray(propQuestion.players) ? propQuestion.players : fallback.players || [],
      activeBombs: Array.isArray(propQuestion.activeBombs) ? propQuestion.activeBombs : fallback.activeBombs || [],
      config: propQuestion.config || fallback.config
    };
  }, [propQuestion]);

  const [phase, setPhase] = useState<BombPassQuestion['phase']>(initialSession.phase || 'LOBBY');
  const [currentRound, setCurrentRound] = useState<number>(initialSession.currentRound || 1);
  const [players, setPlayers] = useState<BombPlayer[]>(initialSession.players || []);
  const [activeBombs, setActiveBombs] = useState<BombInstance[]>(initialSession.activeBombs || []);
  const [config, setConfig] = useState<BombConfig>(initialSession.config || generateBombPassQuestion().config);
  const [winner, setWinner] = useState<BombPlayer | undefined>(initialSession.winner);

  // Sync if parent prop updates
  useEffect(() => {
    if (propQuestion && propQuestion.engineType === 'bomb-pass') {
      if (Array.isArray(propQuestion.players)) setPlayers(propQuestion.players);
      if (Array.isArray(propQuestion.activeBombs)) setActiveBombs(propQuestion.activeBombs);
      if (propQuestion.phase) setPhase(propQuestion.phase);
      if (propQuestion.currentRound) setCurrentRound(propQuestion.currentRound);
      if (propQuestion.config) setConfig(propQuestion.config);
      if (propQuestion.winner) setWinner(propQuestion.winner);
    }
  }, [propQuestion]);

  // UI / Animation States
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(0);
  const [countdownStartSec, setCountdownStartSec] = useState<number>(3);
  const [transferringNotice, setTransferringNotice] = useState<{ from: string; to: string } | null>(null);
  const [lastEliminatedPlayer, setLastEliminatedPlayer] = useState<BombPlayer | null>(null);
  const [fakeSurviveNotice, setFakeSurviveNotice] = useState<BombPlayer | null>(null);
  const [commandFeedback, setCommandFeedback] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showHostPanel, setShowHostPanel] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Dynamic Profile Number Mapping State & Shuffle Trigger
  const [playerNumberMapping, setPlayerNumberMapping] = useState<Record<string, number>>({});
  const [isNumberShuffling, setIsNumberShuffling] = useState<boolean>(false);

  // Command Cooldown Protection Map (tiktokUserId -> timestamp)
  const lastCommandTimeRef = useRef<Map<string, number>>(new Map());

  // Store live comments subscription
  const { liveComments } = useStudioStore();
  const processedCommentIdsRef = useRef<Set<string>>(new Set());

  // ─────────────────────────────────────────────────────────────
  // 2. HELPER SELECTORS
  // ─────────────────────────────────────────────────────────────
  const alivePlayers = useMemo(() => {
    const list = Array.isArray(players) ? players : [];
    return list.filter(p => p && (p.status === 'ALIVE' || p.status === 'HOLDING_BOMB' || p.status === 'PROTECTED'));
  }, [players]);

  // ─────────────────────────────────────────────────────────────
  // DYNAMIC PROFILE NUMBER SHUFFLE (When <= 4 Alive Players remain)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'ROUND_ACTIVE') return;
    const alive = players.filter(p => p && (p.status === 'ALIVE' || p.status === 'HOLDING_BOMB' || p.status === 'PROTECTED'));

    // When 4 or fewer players remain (and at least 2): shuffle numbers every 5 seconds!
    if (alive.length <= 4 && alive.length >= 2) {
      const shuffle = () => {
        const count = alive.length;
        const nums = Array.from({ length: count }, (_, i) => i + 1);
        for (let i = nums.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        const mapping: Record<string, number> = {};
        alive.forEach((p, idx) => {
          mapping[p.id] = nums[idx];
        });
        setPlayerNumberMapping(mapping);
        setIsNumberShuffling(true);
        if (!isMuted) soundFX.play('slot_tick', 0.4);
        setTimeout(() => setIsNumberShuffling(false), 700);
      };

      shuffle();
      const interval = setInterval(shuffle, 5000);
      return () => clearInterval(interval);
    } else {
      const mapping: Record<string, number> = {};
      alive.forEach((p, idx) => {
        mapping[p.id] = idx + 1;
      });
      setPlayerNumberMapping(mapping);
    }
  }, [phase, players, isMuted, currentRound]);

  const eliminatedPlayers = useMemo(() => {
    const list = Array.isArray(players) ? players : [];
    return list.filter(p => p && p.status === 'ELIMINATED');
  }, [players]);

  const currentBomb = (Array.isArray(activeBombs) && activeBombs[0]) ? activeBombs[0] : null;
  const currentHolder = useMemo(() => {
    if (!currentBomb) return null;
    const list = Array.isArray(players) ? players : [];
    return list.find(p => p && p.id === currentBomb.holderId) || null;
  }, [currentBomb, players]);

  // Sync back to parent if provided
  useEffect(() => {
    if (onUpdateQuestion) {
      onUpdateQuestion({
        ...initialSession,
        phase,
        currentRound,
        players,
        activeBombs,
        config,
        winner
      });
    }
  }, [phase, currentRound, players, activeBombs, config, winner, initialSession, onUpdateQuestion]);

  // Set TikTok engine current engine type to bomb-pass to prevent trivia hijack
  useEffect(() => {
    tiktokEngine.setActiveQuestion('BOMB_PASS_LIVE', [], 0, 'bomb-pass');
  }, []);

  const STREAM_GRACE_PERIOD_SEC = 5;

  // ─────────────────────────────────────────────────────────────
  // 3. SERVER-AUTHORITATIVE TIMER LOOP (Visible Time + Hidden 5s Grace Buffer)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'ROUND_ACTIVE' || !currentBomb || isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const visibleTarget = currentBomb.visibleExpiresAt || currentBomb.expiresAt;
      const visibleRemaining = Math.max(0, visibleTarget - now);
      setTimeRemainingMs(visibleRemaining);

      // Play tick sound effects
      if (!isMuted) {
        if (visibleRemaining > 0) {
          if (visibleRemaining <= 3000) {
            // Play urgent danger alarm
            if (Math.floor(visibleRemaining / 250) % 2 === 0) {
              soundFX.play('bomb_danger_tick', 0.6);
            }
          } else if (visibleRemaining % 1000 < 60) {
            soundFX.play('bomb_tick', 0.4);
          }
        } else if (now < currentBomb.expiresAt) {
          // Inside hidden grace buffer after visible clock hit 0: thrilling rapid danger tick
          if (Math.floor((currentBomb.expiresAt - now) / 200) % 2 === 0) {
            soundFX.play('bomb_danger_tick', 0.7);
          }
        }
      }

      // Detonate Bomb when actual expiresAt (with hidden 5s latency buffer) finishes
      if (now >= currentBomb.expiresAt) {
        clearInterval(interval);
        handleBombExpiration(currentBomb);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [phase, currentBomb, isPaused, isMuted]);

  // ─────────────────────────────────────────────────────────────
  // 4. BOMB EXPIRATION & EXPLOSION HANDLER
  // ─────────────────────────────────────────────────────────────
  const handleBombExpiration = useCallback((bomb: BombInstance) => {
    const holder = players.find(p => p.id === bomb.holderId);
    if (!holder) return;

    // Check if it's a FAKE Bomb
    if (bomb.type === 'FAKE') {
      if (!isMuted) soundFX.play('bomb_fake_click', 0.9);
      setFakeSurviveNotice(holder);
      setPhase('SURVIVAL');

      setTimeout(() => {
        setFakeSurviveNotice(null);
        // Start next bomb in current round with random player
        assignNewBomb(players.filter(p => p.status === 'ALIVE' || p.status === 'HOLDING_BOMB'));
      }, 3000);
      return;
    }

    // REAL BOMB: Check if player has Shield Power-Up
    const shieldIndex = holder.powerUps.findIndex(p => p.type === 'SHIELD' && p.charges > 0);
    if (shieldIndex >= 0) {
      if (!isMuted) soundFX.play('shield_protect', 0.9);
      // Consume shield
      const updatedPowerUps = [...holder.powerUps];
      updatedPowerUps[shieldIndex].charges -= 1;
      if (updatedPowerUps[shieldIndex].charges <= 0) {
        updatedPowerUps.splice(shieldIndex, 1);
      }

      setPlayers(prev => prev.map(p => p.id === holder.id ? {
        ...p,
        status: 'ALIVE',
        powerUps: updatedPowerUps,
        statistics: { ...p.statistics, shieldsUsed: p.statistics.shieldsUsed + 1 }
      } : p));

      setCommandFeedback({ text: `🛡️ انكسر درع حماية اللاعب ${holder.displayName} ونجا من الانفجار!` });

      setTimeout(() => {
        assignNewBomb(players.filter(p => p.status !== 'ELIMINATED'));
      }, 2000);
      return;
    }

    // EXPLOSION & ELIMINATION
    if (!isMuted) soundFX.play('bomb_explosion', 1.0);
    setLastEliminatedPlayer(holder);
    setPhase('EXPLOSION');

    const updatedPlayers = players.map(p => {
      if (p.id === holder.id) {
        return {
          ...p,
          status: 'ELIMINATED' as BombPlayerStatus,
          eliminatedAt: Date.now(),
          statistics: { ...p.statistics, eliminations: p.statistics.eliminations + 1 }
        };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    setActiveBombs([]);

    setTimeout(() => {
      setLastEliminatedPlayer(null);
      checkRoundAndGameOverState(updatedPlayers);
    }, 2800);
  }, [players, isMuted]);

  // ─────────────────────────────────────────────────────────────
  // 5. ROUND ADVANCEMENT & WINNER CHECK
  // ─────────────────────────────────────────────────────────────
  const checkRoundAndGameOverState = useCallback((currentPlayersList: BombPlayer[]) => {
    const remainingAlive = currentPlayersList.filter(p => p.status === 'ALIVE' || p.status === 'HOLDING_BOMB' || p.status === 'PROTECTED');

    // WINNER CONDITION: Only 1 survivor remains!
    if (remainingAlive.length === 1) {
      const soleSurvivor = remainingAlive[0];
      const crownedWinner: BombPlayer = {
        ...soleSurvivor,
        status: 'WINNER',
        statistics: {
          ...soleSurvivor.statistics,
          gamesWon: soleSurvivor.statistics.gamesWon + 1,
          roundsSurvived: currentRound
        }
      };

      setWinner(crownedWinner);
      setPhase('GAME_OVER');
      if (!isMuted) soundFX.play('winner_announcement', 1.0);
      triggerVisualEffect('confetti');
      if (onGameEnd) onGameEnd(crownedWinner);
      return;
    }

    // NO SURVIVORS (Edge case)
    if (remainingAlive.length === 0) {
      setPhase('GAME_OVER');
      return;
    }

    // Continue to next round or next bomb
    setCurrentRound(r => r + 1);
    setPhase('ROUND_TRANSITION');

    setTimeout(() => {
      assignNewBomb(remainingAlive);
    }, 2000);
  }, [currentRound, isMuted, onGameEnd]);

  // ─────────────────────────────────────────────────────────────
  // 6. ATOMIC BOMB ASSIGNMENT (Hidden 5-Second Stream Delay Buffer)
  // ─────────────────────────────────────────────────────────────
  const assignNewBomb = useCallback((eligiblePlayers: BombPlayer[]) => {
    if (eligiblePlayers.length === 0) return;

    // Pick random alive player
    const chosenIndex = Math.floor(Math.random() * eligiblePlayers.length);
    const chosenHolder = eligiblePlayers[chosenIndex];

    const rawDuration = getBombDurationForRound(eligiblePlayers.length, config.difficultyPreset, config);
    const visibleDurationSec = rawDuration;
    // Internal hidden duration has 5 extra seconds for broadcast delay
    const totalDurationSec = visibleDurationSec + STREAM_GRACE_PERIOD_SEC;
    const isFake = Math.random() < config.fakeBombChance;
    const now = Date.now();

    const newBomb: BombInstance = {
      bombId: `bomb-${Date.now()}`,
      holderId: chosenHolder.id,
      startedAt: now,
      holderReceivedAt: now,
      visibleDurationSeconds: visibleDurationSec,
      visibleExpiresAt: now + (visibleDurationSec * 1000),
      expiresAt: now + (totalDurationSec * 1000),
      durationSeconds: totalDurationSec,
      type: isFake ? 'FAKE' : 'REAL',
      isFrozen: false
    };

    // Update players status
    setPlayers(prev => prev.map(p => {
      if (p.id === chosenHolder.id) {
        return {
          ...p,
          status: 'HOLDING_BOMB',
          statistics: { ...p.statistics, bombsReceived: p.statistics.bombsReceived + 1 }
        };
      }
      if (p.status === 'HOLDING_BOMB') {
        return { ...p, status: 'ALIVE' };
      }
      return p;
    }));

    setActiveBombs([newBomb]);
    setTimeRemainingMs(visibleDurationSec * 1000);
    setPhase('ROUND_ACTIVE');
    if (!isMuted) soundFX.play('round_start', 0.7);
  }, [config, isMuted]);

  // ─────────────────────────────────────────────────────────────
  // 7. ATOMIC BOMB TRANSFER EXECUTION (Hidden 5-Second Stream Delay Buffer)
  // ─────────────────────────────────────────────────────────────
  const executeBombTransfer = useCallback((fromPlayer: BombPlayer, toPlayer: BombPlayer) => {
    if (phase !== 'ROUND_ACTIVE' || !currentBomb) return;

    const now = Date.now();
    const visibleTarget = currentBomb.visibleExpiresAt || currentBomb.expiresAt;
    const remainingVisibleSec = Math.max(0, Math.floor((visibleTarget - now) / 1000));
    
    // Give new recipient at least 3-6s visible countdown + the hidden 5s stream grace period
    const newVisibleSec = Math.max(3, Math.min(remainingVisibleSec, config.maxBombTime));
    const totalDurationSec = newVisibleSec + STREAM_GRACE_PERIOD_SEC;

    const updatedBomb: BombInstance = {
      ...currentBomb,
      holderId: toPlayer.id,
      startedAt: now,
      holderReceivedAt: now,
      visibleDurationSeconds: newVisibleSec,
      visibleExpiresAt: now + (newVisibleSec * 1000),
      expiresAt: now + (totalDurationSec * 1000),
      durationSeconds: totalDurationSec,
      isFrozen: false
    };

    setPlayers(prev => prev.map(p => {
      if (p.id === fromPlayer.id) {
        return {
          ...p,
          status: 'ALIVE',
          statistics: { ...p.statistics, bombTransfers: p.statistics.bombTransfers + 1 }
        };
      }
      if (p.id === toPlayer.id) {
        return {
          ...p,
          status: 'HOLDING_BOMB',
          statistics: { ...p.statistics, bombsReceived: p.statistics.bombsReceived + 1 }
        };
      }
      return p;
    }));

    setActiveBombs([updatedBomb]);
    setTimeRemainingMs(newVisibleSec * 1000);

    // Visual & Sound Feedback
    setTransferringNotice({ from: fromPlayer.displayName, to: toPlayer.displayName });
    if (!isMuted) {
      soundFX.play('bomb_transfer', 0.7);
      setTimeout(() => soundFX.play('bomb_impact', 0.8), 250);
    }

    setTimeout(() => {
      setTransferringNotice(null);
    }, 1800);
  }, [phase, currentBomb, config, isMuted]);

  // ─────────────────────────────────────────────────────────────
  // 8. TIKTOK LIVE COMMENTS & COMMAND PROCESSOR
  // ─────────────────────────────────────────────────────────────
  const handleIncomingComment = useCallback((comment: TikTokLiveComment) => {
    // 1. Check if user is trying to join the Lobby
    if (phase === 'LOBBY') {
      const parsed = parseBombPassCommand(comment.comment, null, players, playerNumberMapping);
      if (parsed.type === 'JOIN_LOBBY') {
        // Prevent duplicate joining by tiktokUserId
        if (players.some(p => p.tiktokUserId === comment.userId)) return;

        const newPlayer: BombPlayer = {
          id: `bp-${Date.now()}-${comment.userId}`,
          playerId: `bp-${Date.now()}-${comment.userId}`,
          tiktokUserId: comment.userId,
          tiktokUsername: comment.username,
          displayName: comment.displayName || comment.username || 'مشارك',
          avatarUrl: comment.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
          status: 'ALIVE',
          joinedAt: Date.now(),
          powerUps: [],
          statistics: {
            gamesPlayed: 1,
            gamesWon: 0,
            roundsSurvived: 0,
            bombTransfers: 0,
            bombsReceived: 0,
            eliminations: 0,
            shieldsUsed: 0,
            swapsUsed: 0,
            freezesUsed: 0
          }
        };

        setPlayers(prev => [...prev, newPlayer]);
        if (!isMuted) soundFX.play('lock_click', 0.5);
        return;
      }
    }

    // 2. Active Game Command Verification
    if (phase !== 'ROUND_ACTIVE' || !currentHolder || !currentBomb) return;

    // Verify commenter is the CURRENT BOMB HOLDER by tiktokUserId!
    if (comment.userId !== currentHolder.tiktokUserId && comment.username !== currentHolder.tiktokUsername) {
      // Ignored: Non-bomb-holder attempted to pass
      return;
    }

    // Rate Limiting Cooldown (1.2s per holder)
    const now = Date.now();
    const lastCmd = lastCommandTimeRef.current.get(comment.userId) || 0;
    if (now - lastCmd < 1000) {
      return; // Anti-spam ignored
    }
    lastCommandTimeRef.current.set(comment.userId, now);

    // Parse the command against all players with dynamic playerNumberMapping
    const parsed = parseBombPassCommand(comment.comment, currentHolder, players, playerNumberMapping);

    // Handle Errors
    if (parsed.error) {
      setCommandFeedback({ text: `❌ ${parsed.error}`, isError: true });
      if (!isMuted) soundFX.play('pin_error', 0.6);
      setTimeout(() => setCommandFeedback(null), 2000);
      return;
    }

    // 3. Command: FREEZE POWER-UP
    if (parsed.type === 'USE_FREEZE') {
      const freezeIndex = currentHolder.powerUps.findIndex(p => p.type === 'FREEZE' && p.charges > 0);
      if (freezeIndex < 0) {
        setCommandFeedback({ text: `❌ ليس لديك قدرة التجميد!`, isError: true });
        return;
      }

      // Apply Freeze (add 3.5s to expiresAt)
      if (!isMuted) soundFX.play('freeze_tick', 0.8);
      const updatedPowerUps = [...currentHolder.powerUps];
      updatedPowerUps[freezeIndex].charges -= 1;
      if (updatedPowerUps[freezeIndex].charges <= 0) updatedPowerUps.splice(freezeIndex, 1);

      setActiveBombs(prev => prev.map(b => ({
        ...b,
        expiresAt: b.expiresAt + 3500
      })));

      setPlayers(prev => prev.map(p => p.id === currentHolder.id ? {
        ...p,
        powerUps: updatedPowerUps,
        statistics: { ...p.statistics, freezesUsed: p.statistics.freezesUsed + 1 }
      } : p));

      setCommandFeedback({ text: `⏱️ قام ${currentHolder.displayName} بتجميد الوقت 3 ثوانٍ!` });
      setTimeout(() => setCommandFeedback(null), 2500);
      return;
    }

    // 4. Command: BOMB TRANSFER or SWAP
    if (parsed.targetPlayer && (parsed.type === 'TRANSFER' || parsed.type === 'USE_SWAP')) {
      executeBombTransfer(currentHolder, parsed.targetPlayer);
      setCommandFeedback({ 
        text: `🧨 مرر ${currentHolder.displayName} القنبلة إلى ${parsed.targetPlayer.displayName}!` 
      });
      setTimeout(() => setCommandFeedback(null), 2000);
    }
  }, [phase, currentHolder, currentBomb, players, isMuted, executeBombTransfer]);

  // Hook into live comments stream from store
  useEffect(() => {
    if (!Array.isArray(liveComments) || liveComments.length === 0) return;

    liveComments.forEach(comment => {
      if (comment && comment.id && !processedCommentIdsRef.current.has(comment.id)) {
        processedCommentIdsRef.current.add(comment.id);
        handleIncomingComment(comment);
      }
    });
  }, [liveComments, handleIncomingComment]);

  // Hook into direct tiktokEngine comments
  useEffect(() => {
    const handleDirectComment = (comment: TikTokLiveComment) => {
      if (!processedCommentIdsRef.current.has(comment.id)) {
        processedCommentIdsRef.current.add(comment.id);
        handleIncomingComment(comment);
      }
    };

    tiktokEngine.onComment(handleDirectComment);
    return () => {
      tiktokEngine.offComment(handleDirectComment);
    };
  }, [handleIncomingComment]);

  // ─────────────────────────────────────────────────────────────
  // 9. HOST ACTIONS & CONTROLS
  // ─────────────────────────────────────────────────────────────
  const handleStartGame = () => {
    if (players.length < 2) {
      // Add mock players automatically if less than 2
      const mocks = generateMockBombPlayers(8);
      setPlayers(mocks);
      startCountdownSequence(mocks);
    } else {
      startCountdownSequence(players);
    }
  };

  const startCountdownSequence = (startingPlayers: BombPlayer[]) => {
    setPhase('STARTING');
    setCountdownStartSec(3);
    if (!isMuted) soundFX.play('countdown_tick', 0.8);

    let sec = 3;
    const countInterval = setInterval(() => {
      sec -= 1;
      setCountdownStartSec(sec);
      if (sec > 0) {
        if (!isMuted) soundFX.play('countdown_tick', 0.8);
      } else {
        clearInterval(countInterval);
        setCurrentRound(1);
        assignNewBomb(startingPlayers);
      }
    }, 1000);
  };

  const handleAddMockPlayers = (count: number = 5) => {
    const newMocks = generateMockBombPlayers(count);
    setPlayers(prev => [...prev, ...newMocks]);
    if (!isMuted) soundFX.play('lock_clack', 0.6);
  };

  const handleForceBombTransfer = (targetPlayer: BombPlayer) => {
    if (!currentHolder) return;
    executeBombTransfer(currentHolder, targetPlayer);
  };

  const handleResetGame = () => {
    setPhase('LOBBY');
    setCurrentRound(1);
    setActiveBombs([]);
    setWinner(undefined);
    setPlayers(prev => prev.map(p => ({ ...p, status: 'ALIVE' })));
  };

  // ─────────────────────────────────────────────────────────────
  // 10. DYNAMIC TYPOGRAPHY HELPER FOR DISPLAY NAMES
  // ─────────────────────────────────────────────────────────────
  const getNameTypographyClass = (name: string, isSpotlight: boolean = false) => {
    const len = name.length;
    if (isSpotlight) {
      if (len <= 8) return 'text-3xl sm:text-4xl font-black';
      if (len <= 15) return 'text-2xl sm:text-3xl font-black';
      return 'text-xl sm:text-2xl font-bold line-clamp-2';
    }
    if (len <= 7) return 'text-sm sm:text-base font-black';
    if (len <= 14) return 'text-xs sm:text-sm font-bold line-clamp-1';
    return 'text-[11px] font-bold line-clamp-2 leading-tight';
  };

  // Format milliseconds to `00:07.4`
  const formattedTime = useMemo(() => {
    const totalSec = Math.floor(timeRemainingMs / 1000);
    const tenths = Math.floor((timeRemainingMs % 1000) / 100);
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${m}:${s}.${tenths}`;
  }, [timeRemainingMs]);

  const isDangerTime = timeRemainingMs > 0 && timeRemainingMs <= 3000;

  return (
    <div className={`relative w-full h-full min-h-[90vh] bg-[#070913] text-white flex flex-col justify-between overflow-hidden select-none font-sans ${
      phase === 'EXPLOSION' ? 'animate-screen-shake' : ''
    }`}>
      
      {/* ── BACKGROUND CYBERNETIC MESH & GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-red-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-amber-600/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />
      </div>

      {/* ── 1. TOP HEADER & HUD BAR ── */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Game Logo & Round Badge */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-white/20 animate-pulse">
            <Flame className="w-6 h-6 text-yellow-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-200">
                BOMB PASS
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                Live Action
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">القنبلة الموقوتة • الجولة {currentRound}</p>
          </div>
        </div>

        {/* Live Status Counters */}
        <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">الأحياء:</span>
            <span className="font-bold text-cyan-300 text-base">{alivePlayers.length}</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <Skull className="w-4 h-4 text-rose-400" />
            <span className="text-slate-400">المقصيون:</span>
            <span className="font-bold text-rose-400 text-base">{eliminatedPlayers.length}</span>
          </div>

          {/* Quick Host Panel Toggle & Audio */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition"
              title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {isHost && (
              <button
                onClick={() => setShowHostPanel(!showHostPanel)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition shadow"
              >
                <Settings className="w-4 h-4" />
                <span>لوحة التحكم</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. CENTER STAGE / ACTIVE BOMB SPOTLIGHT ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-3 max-w-7xl mx-auto w-full">
        
        {/* LOBBY VIEW */}
        {phase === 'LOBBY' && (
          <div className="flex flex-col items-center text-center gap-6 max-w-xl animate-in zoom-in-95">
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-b from-red-600/30 to-amber-600/10 border-2 border-red-500/50 flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.3)] animate-bounce">
                <span className="text-6xl">💣</span>
              </div>
              <div className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full bg-red-600 text-white font-mono font-black text-xs shadow">
                جاهز
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-yellow-200 to-amber-400">
                بانتظار انضمام المشاركين
              </h2>
              <p className="text-slate-300 text-sm max-w-md leading-relaxed">
                اكتب <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold font-mono">العب</span> أو <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold font-mono">انضم</span> في تعليقات البث المباشر للدخول فوراً!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleStartGame}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-lg shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:scale-105 transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>بدء الجولة الحماسية 🔥</span>
              </button>

              <button
                onClick={() => handleAddMockPlayers(5)}
                className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-slate-200 font-bold hover:bg-white/15 transition text-sm"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>+5 لاعبين تجريبيين</span>
              </button>
            </div>
          </div>
        )}

        {/* 3-2-1 COUNTDOWN */}
        {phase === 'STARTING' && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-50">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest animate-pulse">
              THE BOMB IS ABOUT TO DROP
            </span>
            <div className="text-8xl sm:text-9xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-red-500 shadow-2xl animate-ping">
              {countdownStartSec}
            </div>
            <p className="text-slate-400 text-sm font-bold">استعد لتمرير القنبلة بالمنشن عبر الشات!</p>
          </div>
        )}

        {/* ACTIVE ROUND: SPOTLIGHT CARD + DANGER TIMER */}
        {(phase === 'ROUND_ACTIVE' || phase === 'BOMB_TRANSFERRING' || phase === 'SURVIVAL') && currentHolder && (
          <div className="w-full flex flex-col items-center gap-4 my-auto">
            
            {/* Spotlight Card */}
            <div className={`relative flex flex-col items-center p-6 sm:p-8 rounded-3xl transition-all duration-300 max-w-md w-full border-2 ${
              isDangerTime 
                ? 'bg-red-950/60 border-red-500 animate-bomb-danger bomb-card-danger-glow' 
                : 'bg-gradient-to-b from-[#181B2E] to-[#0E101D] border-red-500/50 bomb-card-holder-glow'
            }`}>
              
              {/* Flame / Siren Tag */}
              <div className="absolute -top-3.5 px-4 py-1 rounded-full bg-red-600 text-white font-mono font-black text-xs shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-yellow-300 animate-fuse-spark" />
                <span>حامل القنبلة الحالي 💣</span>
              </div>

              {/* Avatar + Bomb Badge */}
              <div className="relative my-2">
                <img
                  src={currentHolder.avatarUrl}
                  alt={currentHolder.displayName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-red-500 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-black border-2 border-amber-400 flex items-center justify-center text-xl shadow-lg animate-bounce">
                  💣
                </div>
              </div>

              {/* Player Display Name (NEVER USERNAME) */}
              <div className="text-center w-full mt-2">
                <h3 className={`text-yellow-200 tracking-wide text-center ${getNameTypographyClass(currentHolder.displayName, true)}`}>
                  {currentHolder.displayName}
                </h3>
              </div>

              {/* Server-Authoritative Timer Display */}
              <div className={`mt-4 px-6 py-2 rounded-2xl font-mono font-black text-3xl sm:text-4xl tracking-wider border shadow-inner transition-colors ${
                isDangerTime
                  ? 'bg-red-600 text-white border-red-300 animate-pulse'
                  : 'bg-black/60 text-red-400 border-red-500/30'
              }`}>
                {formattedTime}
              </div>

              {/* Live Instructions for Current Bomb Holder */}
              <div className="mt-3 text-center">
                <p className="text-xs sm:text-sm font-bold text-slate-300">
                  مرر القنبلة بكتابة <span className="text-amber-300 font-mono font-black text-sm sm:text-base">رقم اللاعب (1، 2، 3)</span> أو <span className="text-yellow-300 font-mono font-black">@الاسم</span> في الشات فوراً!
                </p>
              </div>

              {/* Active Power-Ups Badges on Holder */}
              {currentHolder.powerUps.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  {currentHolder.powerUps.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1 shadow"
                      title={p.description}
                    >
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Transfer Notification Banner */}
            {transferringNotice && (
              <div className="px-5 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2 shadow-lg">
                <ArrowRightLeft className="w-4 h-4 text-amber-400 animate-spin" />
                <span>انتقلت القنبلة من <b>{transferringNotice.from}</b> إلى <b>{transferringNotice.to}</b>! 🚀</span>
              </div>
            )}

            {/* Fake Bomb Survival Reveal */}
            {fakeSurviveNotice && (
              <div className="px-6 py-3 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-sm sm:text-base font-black flex items-center gap-2 animate-in zoom-in-95 shadow-2xl">
                <span>😏 كانت قنبلة وهمية (Fake Bomb)! نجا <b>{fakeSurviveNotice.displayName}</b> من الانفجار!</span>
              </div>
            )}

            {/* Command Feedback Notice */}
            {commandFeedback && (
              <div className={`px-4 py-1.5 rounded-xl text-xs font-bold animate-in fade-in ${
                commandFeedback.isError
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                  : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
              }`}>
                {commandFeedback.text}
              </div>
            )}
          </div>
        )}

        {/* EXPLOSION & ELIMINATION OVERLAY */}
        {phase === 'EXPLOSION' && lastEliminatedPlayer && (
          <div className="flex flex-col items-center text-center gap-4 animate-in zoom-in-90 duration-200">
            <div className="text-8xl sm:text-9xl animate-ping">💥</div>
            <div className="space-y-1">
              <h2 className="text-4xl sm:text-5xl font-black text-rose-500 tracking-tight">
                انفجرت القنبلة! 💣💥
              </h2>
              <p className="text-2xl font-bold text-yellow-300">
                تم إقصاء {lastEliminatedPlayer.displayName} من اللعبة!
              </p>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-mono text-slate-400">
              يتبقى {alivePlayers.length} مشاركين في المنافسة...
            </div>
          </div>
        )}

        {/* WINNER CORONATION SCREEN */}
        {phase === 'GAME_OVER' && winner && (
          <div className="flex flex-col items-center text-center gap-5 max-w-lg p-8 rounded-3xl bg-gradient-to-b from-[#1E1B4B]/80 to-[#0F172A]/90 border-2 border-amber-400 shadow-[0_0_80px_rgba(245,158,11,0.3)] animate-in zoom-in-95">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-amber-400 overflow-hidden shadow-2xl">
                <img src={winner.avatarUrl} alt={winner.displayName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-2 text-4xl animate-bounce">👑</div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                LAST SURVIVOR • بطل القنبلة الموقوتة
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500">
                {winner.displayName}
              </h2>
            </div>

            {/* Survivor Statistics Breakdown */}
            <div className="grid grid-cols-3 gap-2.5 w-full font-mono text-xs mt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-slate-400">الجولات</span>
                <span className="text-lg font-black text-amber-300">{winner.statistics.roundsSurvived}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-slate-400">التمريرات</span>
                <span className="text-lg font-black text-cyan-300">{winner.statistics.bombTransfers}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-slate-400">استلام القنبلة</span>
                <span className="text-lg font-black text-rose-300">{winner.statistics.bombsReceived}</span>
              </div>
            </div>

            <button
              onClick={handleResetGame}
              className="mt-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base shadow-lg hover:scale-105 transition"
            >
              بدء لعبة جديدة 🔄
            </button>
          </div>
        )}
      </main>

      {/* ── 3. PARTICIPANTS GRID (CLEAR CARDS WITH PROMINENT NUMBERS WITHOUT #) ── */}
      <section className="relative z-10 w-full px-4 sm:px-8 py-4 border-t border-white/15 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="flex items-center gap-2 font-bold">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>المشاركون في اللعبة ({(players || []).length}) • الأحياء: <b className="text-emerald-400">{alivePlayers.length}</b></span>
              {alivePlayers.length <= 4 && alivePlayers.length >= 2 && phase === 'ROUND_ACTIVE' && (
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-amber-400/50 text-amber-300 font-bold text-[10px] animate-pulse flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
                  <span>حماس الذروة: الأرقام تتغير كل 5 ثوانٍ! 🔀</span>
                </span>
              )}
            </span>
            <span className="text-[11px] text-amber-300 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-400/20">
              💡 اكتب رقم المتسابق في الشات لتمرير القنبلة فوراً
            </span>
          </div>

          {/* Responsive High-Contrast Cards Grid with Top Padding so badges are never clipped */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3.5 max-h-60 overflow-y-auto pt-4 pb-3 px-2">
            {(players || []).map((player) => {
              if (!player) return null;
              const isHolder = currentHolder?.id === player.id;
              const isEliminated = player.status === 'ELIMINATED';
              const hasShield = Array.isArray(player.powerUps) && player.powerUps.some(p => p.type === 'SHIELD' && p.charges > 0);
              const aliveIndex = !isEliminated ? alivePlayers.findIndex(ap => ap.id === player.id) + 1 : -1;
              const displayNumber = !isEliminated ? (playerNumberMapping[player.id] || (aliveIndex > 0 ? aliveIndex : null)) : null;

              return (
                <div
                  key={player.id}
                  onClick={() => isHost && phase === 'ROUND_ACTIVE' && !isEliminated && !isHolder && handleForceBombTransfer(player)}
                  className={`relative flex flex-col items-center p-2.5 rounded-2xl border-2 transition-all duration-200 text-center ${
                    isHolder
                      ? 'bg-red-950/80 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.7)] scale-105 z-10'
                      : isEliminated
                      ? 'bg-black/50 border-white/5 opacity-30 grayscale'
                      : hasShield
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'bg-white/[0.07] border-white/15 hover:bg-white/15 hover:border-amber-400/50 cursor-pointer shadow-lg'
                  }`}
                >
                  {/* Dynamic High-Contrast Number Badge (Shuffles every 5s when <= 4 alive) */}
                  {displayNumber && !isEliminated && (
                    <div className={`absolute -top-2.5 -left-2 min-w-[28px] h-7 px-1.5 rounded-xl text-slate-950 font-mono font-black text-xs sm:text-sm flex items-center justify-center border-2 border-yellow-100 z-20 transition-all duration-300 ${
                      alivePlayers.length <= 4
                        ? (isNumberShuffling 
                            ? 'bg-gradient-to-tr from-rose-500 to-amber-300 scale-125 shadow-[0_0_20px_rgba(239,68,68,1)] ring-2 ring-white animate-spin' 
                            : 'bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.9)] scale-110')
                        : 'bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-105'
                    }`}>
                      {displayNumber}
                    </div>
                  )}

                  {/* Status Indicator Icon */}
                  {isHolder && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-lg animate-bounce border border-yellow-300">
                      💣
                    </span>
                  )}
                  {hasShield && !isHolder && !isEliminated && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs shadow border border-cyan-200">
                      🛡️
                    </span>
                  )}
                  {isEliminated && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-800 text-rose-400 flex items-center justify-center text-xs shadow border border-white/10">
                      ☠️
                    </span>
                  )}

                  {/* Avatar */}
                  <img
                    src={player.avatarUrl}
                    alt={player.displayName}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 shadow-md ${
                      isHolder ? 'border-red-400' : 'border-white/20'
                    }`}
                  />

                  {/* Display Name Clear & High Contrast */}
                  <span className={`w-full mt-1.5 font-black text-xs sm:text-sm truncate text-white drop-shadow`}>
                    {player.displayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. HOST CONTROL DRAWER ── */}
      {showHostPanel && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-[#0E101D] border-l border-white/15 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">لوحة تحكم المضيف</h3>
              </div>
              <button
                onClick={() => setShowHostPanel(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">إجراءات الجولة</label>
              <div className="grid grid-cols-2 gap-2">
                {phase === 'LOBBY' ? (
                  <button
                    onClick={handleStartGame}
                    className="col-span-2 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>بدء اللعبة</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className="py-2 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-bold text-xs flex items-center justify-center gap-1"
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{isPaused ? 'استئناف' : 'إيقاف مؤقت'}</span>
                    </button>
                    <button
                      onClick={handleResetGame}
                      className="py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة ضبط</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Difficulty Preset */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">مستوى الصعوبة</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['EASY', 'NORMAL', 'HARD', 'CHAOS'] as BombDifficultyPreset[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setConfig(prev => ({ ...prev, difficultyPreset: p }))}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition ${
                      config.difficultyPreset === p
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Fake Bomb Chance Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-bold">نسبة القنبلة الوهمية (Fake Bomb)</span>
                <span className="text-amber-300 font-black">{Math.round(config.fakeBombChance * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.30"
                step="0.05"
                value={config.fakeBombChance}
                onChange={(e) => setConfig(prev => ({ ...prev, fakeBombChance: parseFloat(e.target.value) }))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Mock Players Generator */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">توليد مشاركين تجريبيين</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddMockPlayers(5)}
                  className="flex-1 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-cyan-500/25 transition"
                >
                  +5 مشاركين
                </button>
                <button
                  onClick={() => handleAddMockPlayers(10)}
                  className="flex-1 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-cyan-500/25 transition"
                >
                  +10 مشاركين
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] font-mono text-slate-500">RecruitOS • Interactive Game Engine v2.5</p>
          </div>
        </div>
      )}

    </div>
  );
};
