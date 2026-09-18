'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MusicalChairsQuestion, 
  MusicalChairsPlayer, 
  MusicalChairsSeat, 
  MusicalChairsClaimLog, 
  MusicalChairsGamePhase 
} from '@aep/types';
import { useStudioStore } from '../../store/useStudioStore';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { 
  generateMusicalChairsSeats, 
  extractSeatNumberFromComment,
  extractAllSeatNumbersFromComment
} from '@aep/game-engines';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Music, Users, 
  Trophy, Skull, Sparkles, Flame, Clock, Radio, Shield, 
  CheckCircle2, XCircle, AlertTriangle, Disc3, Settings, 
  Zap, Award, Crown, Check, ChevronRight, UserPlus
} from 'lucide-react';

interface Props {
  question?: MusicalChairsQuestion;
  isAnswerRevealed?: boolean;
}

const MUSIC_TRACKS = [
  { id: 'hype-arena', name: '🎵 Hype Arena (حماسي)', tempo: 128 },
  { id: 'final-rush', name: '⚡ Final Rush (تسارع)', tempo: 140 },
  { id: 'neon-race', name: '🏎️ Neon Race (سباق نيون)', tempo: 132 },
  { id: 'last-seat', name: '🔥 Last Seat (المقعد الأخير)', tempo: 145 },
  { id: 'game-on', name: '🎮 Game On (تحدي)', tempo: 125 }
];

const SEAT_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', 
  '#06B6D4', '#6366F1', '#D946EF', '#F97316', '#14B8A6'
];

export function MusicalChairsView({ question }: Props) {
  const { liveComments, tiktokEngine } = useStudioStore();
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  // Core Game State Machine
  const [phase, setPhase] = useState<MusicalChairsGamePhase>('IDLE');
  const [players, setPlayers] = useState<MusicalChairsPlayer[]>([]);
  const [seats, setSeats] = useState<MusicalChairsSeat[]>([]);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [eliminatedThisRound, setEliminatedThisRound] = useState<MusicalChairsPlayer | null>(null);
  const [winner, setWinner] = useState<MusicalChairsPlayer | null>(null);
  const [claimLogs, setClaimLogs] = useState<MusicalChairsClaimLog[]>([]);

  // Music & Host Settings
  const [selectedDuration, setSelectedDuration] = useState<number>(question?.musicDurationSeconds || 10);
  const [selectedTrack, setSelectedTrack] = useState<string>(question?.musicTrack || 'Hype Arena');
  const [musicTimeRemaining, setMusicTimeRemaining] = useState<number>(10);
  const [musicVolume, setMusicVolume] = useState<number>(0.8);
  const [sfxVolume, setSfxVolume] = useState<number>(1.0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Visual Arena Continuous Rotations
  const [chairsRotation, setChairsRotation] = useState<number>(0);
  const [playersOrbitRotation, setPlayersOrbitRotation] = useState<number>(0);
  const [isMusicPulsing, setIsMusicPulsing] = useState<boolean>(false);
  const [claimStartTime, setClaimStartTime] = useState<number>(0);
  const [fastestClaimMs, setFastestClaimMs] = useState<number | null>(null);

  // Mount Guard
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Synchronous State Guard & Refs for Real-Time Concurrency (Atomic Locking)
  const registeredUserIds = useRef<Set<string>>(new Set());
  const processedCommentIds = useRef<Set<string>>(new Set());
  const seatsRef = useRef<MusicalChairsSeat[]>([]);
  seatsRef.current = seats;
  const playersRef = useRef<MusicalChairsPlayer[]>([]);
  playersRef.current = players;
  const phaseRef = useRef<MusicalChairsGamePhase>(phase);
  phaseRef.current = phase;

  // Web Audio Synthesizer & YouTube Player References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicOscillatorsRef = useRef<any[]>([]);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);

  // ══════════════════════════════════════════════════════════════
  // 🎵 YOUTUBE & WEB AUDIO MUSIC CONTROLLER (https://youtu.be/TZE9gVF1QbA)
  // ══════════════════════════════════════════════════════════════
  const playYouTubeMusic = useCallback(() => {
    if (isAudioMuted) return;
    try {
      if (ytIframeRef.current?.contentWindow) {
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo' }),
          '*'
        );
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [musicVolume * 100] }),
          '*'
        );
      }
    } catch (e) {
      console.warn('YouTube audio error:', e);
    }
  }, [isAudioMuted, musicVolume]);

  const stopYouTubeMusic = useCallback(() => {
    try {
      if (ytIframeRef.current?.contentWindow) {
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo' }),
          '*'
        );
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
          '*'
        );
      }
    } catch (e) {
      console.warn('YouTube audio stop error:', e);
    }
  }, []);

  const startSynthMusic = useCallback(() => {
    playYouTubeMusic();
    if (isAudioMuted || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(musicVolume * 0.35, now);
      masterGain.connect(ctx.destination);

      // Bass Arpeggiator Beat Loop
      const bassNotes = [110, 130.81, 146.83, 164.81, 110, 146.83, 174.61, 196];
      const stepDuration = 0.22;
      const loopDuration = selectedDuration;

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sawtooth';

      for (let t = 0; t < loopDuration; t += stepDuration) {
        const noteIdx = Math.floor((t / stepDuration) % bassNotes.length);
        const freq = bassNotes[noteIdx];
        osc.frequency.setValueAtTime(freq, now + t);
        oscGain.gain.setValueAtTime(0.3, now + t);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + t + stepDuration * 0.9);
      }

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + loopDuration);

      musicOscillatorsRef.current.push({ osc, oscGain, masterGain });
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  }, [musicVolume, isAudioMuted, selectedDuration, playYouTubeMusic]);

  const stopSynthMusic = useCallback(() => {
    stopYouTubeMusic();
    try {
      musicOscillatorsRef.current.forEach(({ osc, masterGain }) => {
        try {
          if (masterGain && audioCtxRef.current) {
            masterGain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
          }
          osc.stop();
        } catch (_) {}
      });
      musicOscillatorsRef.current = [];
    } catch (_) {}
  }, [stopYouTubeMusic]);

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
        const newPlayer: MusicalChairsPlayer = {
          id: `mc-p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: uid,
          username: c.username || `@user_${Math.floor(Math.random() * 900 + 100)}`,
          displayName: c.displayName || c.authorName || c.username || 'متسابق تيك توك',
          avatarUrl: c.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
          joinedAt: Date.now(),
          status: 'ACTIVE',
          seatsClaimedCount: 0
        };
        setPlayers(prev => [...prev, newPlayer]);
        soundFX.play('score_update');
      }
    }
  }, []);

  // Comment listener during REGISTRATION
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
  const handleAddMockParticipants = (count: number = 5) => {
    const arabNames = ['سلطان', 'نورة', 'فهد', 'ريما', 'عبدالله', 'سارة', 'ياسر', 'منيرة', 'خالد', 'أحمد', 'مشاعل', 'بندر'];
    const newItems: MusicalChairsPlayer[] = [];

    for (let i = 0; i < count; i++) {
      const name = arabNames[Math.floor(Math.random() * arabNames.length)];
      const num = Math.floor(Math.random() * 9000 + 1000);
      const uid = `mock-${Date.now()}-${i}-${num}`;

      if (!registeredUserIds.current.has(uid)) {
        registeredUserIds.current.add(uid);
        newItems.push({
          id: `mc-p-${Date.now()}-${i}`,
          userId: uid,
          username: `@${name.toLowerCase()}_${num}`,
          displayName: `${name} ${num.toString().substring(0, 2)}`,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
          joinedAt: Date.now(),
          status: 'ACTIVE',
          seatsClaimedCount: 0
        });
      }
    }

    setPlayers(prev => [...prev, ...newItems]);
    soundFX.play('score_update');
  };

  // ══════════════════════════════════════════════════════════════
  // 2. START ROUND & CHAIRS GENERATION (chairs = players - 1)
  // ══════════════════════════════════════════════════════════════
  const setupRoundChairs = useCallback((activePlayers: MusicalChairsPlayer[], roundNum: number) => {
    const remainingCount = activePlayers.length;
    const seatCount = Math.max(1, remainingCount - 1);

    // Collect previous round numbers to guarantee fresh numbers
    const prevNumbers = seatsRef.current.map(s => s.seatNumber);
    const newNumbers = generateMusicalChairsSeats(seatCount, prevNumbers);

    const generatedSeats: MusicalChairsSeat[] = newNumbers.map((num, idx) => ({
      seatId: `seat-r${roundNum}-${idx}-${num}`,
      seatNumber: num,
      status: 'AVAILABLE'
    }));

    setSeats(generatedSeats);
    setEliminatedThisRound(null);
    setClaimLogs([]);
  }, []);

  // 3. START GAME FROM REGISTRATION
  const handleStartGame = () => {
    const activePlayers = players.filter(p => p.status === 'ACTIVE');
    if (activePlayers.length < 2) {
      alert('تحتاج اللعبة إلى لاعبين على الأقل للبدء! اضغط "+ إضافة مشاركين تجريبيين" أو اكتب "العب" في الشات.');
      return;
    }

    soundFX.play('round_start');
    setRoundNumber(1);
    setupRoundChairs(activePlayers, 1);
    setPhase('READY');

    // 3-second ready countdown -> start music
    setTimeout(() => {
      setPhase('COUNTDOWN');
      setTimeout(() => {
        startMusicPhase(1, activePlayers);
      }, 2500);
    }, 1500);
  };

  // 4. START MUSIC PLAYING PHASE
  const startMusicPhase = (roundNum: number, currentActivePlayers: MusicalChairsPlayer[]) => {
    setPhase('MUSIC_PLAYING');
    setIsMusicPulsing(true);
    setMusicTimeRemaining(selectedDuration);
    startSynthMusic();

    // Reset player round seated flags
    setPlayers(prev => prev.map(p => ({
      ...p,
      status: p.status === 'ELIMINATED' ? 'ELIMINATED' : 'ACTIVE',
      currentSeatNumber: undefined
    })));

    processedCommentIds.current.clear();
  };

  // Smooth High-FPS Rotations during MUSIC_PLAYING (Chairs rotate, Players orbit faster)
  useEffect(() => {
    if (phase !== 'MUSIC_PLAYING') return;

    let animFrame: number;
    let lastTime = performance.now();

    const animateRotation = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Chairs rotate at ~22 deg/sec, Players orbit faster at ~55 deg/sec
      setChairsRotation(r => (r + delta * 24) % 360);
      setPlayersOrbitRotation(r => (r + delta * 58) % 360);

      animFrame = requestAnimationFrame(animateRotation);
    };

    animFrame = requestAnimationFrame(animateRotation);
    return () => cancelAnimationFrame(animFrame);
  }, [phase]);

  // 5. MUSIC TIMER COUNTDOWN
  useEffect(() => {
    if (phase !== 'MUSIC_PLAYING') return;

    const timer = setInterval(() => {
      setMusicTimeRemaining(prev => {
        if (prev <= 5 && prev > 1) {
          soundFX.play('countdown_tick');
        }

        if (prev <= 1) {
          clearInterval(timer);
          triggerMusicStop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, selectedDuration]);

  // 6. TRIGGER MUSIC STOP -> SEAT CLAIMING WINDOW
  const triggerMusicStop = () => {
    stopSynthMusic();
    setIsMusicPulsing(false);
    setPhase('MUSIC_STOPPED');
    soundFX.play('time_up'); // Powerful impact sound
    triggerVisualEffect('confetti');

    const claimStart = Date.now();
    setClaimStartTime(claimStart);

    // Open claiming window (waits until ALL chairs are claimed)
    setTimeout(() => {
      setPhase('SEAT_CLAIMING');
    }, 400);
  };

  // ══════════════════════════════════════════════════════════════
  // 7. REAL-TIME ATOMIC SEAT CLAIMING (First Valid Comment Wins)
  // ══════════════════════════════════════════════════════════════
  const handleProcessClaimComment = useCallback((c: any) => {
    if (phaseRef.current !== 'SEAT_CLAIMING') return;
    if (!c) return;

    const commentId = c.id || `${c.userId}-${c.timestamp || Date.now()}`;
    if (processedCommentIds.current.has(commentId)) return;
    processedCommentIds.current.add(commentId);

    const rawText = (c.comment || c.commentText || '').trim();
    
    // Strict validation: comment must be INTENTIONALLY a seat number claim
    // Accept: pure numbers ("5", "١٢"), or seat keywords + number ("كرسي 5", "chair 3", "رقم 7")
    const normalizedForCheck = rawText.replace(/[٠-٩]/g, (ch: string) => {
      const map: Record<string, string> = {'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
      return map[ch] || ch;
    });
    const strippedText = normalizedForCheck.replace(/[\s\u200B\u200C\u200D\uFEFF]/g, '').replace(/[🪑💺🔥⚡❤️🎵✅👍🏻👍]/gu, '');
    const isPureNumber = /^[0-9]{1,2}$/.test(strippedText);
    const hasSeatKeyword = /كرسي|مقعد|seat|chair|رقم|اجلس|ابغى|ابي|أبي|أبغى/i.test(normalizedForCheck);
    
    if (!isPureNumber && !hasSeatKeyword) return; // Not a seat claim, ignore
    
    const extractedNumbers = extractAllSeatNumbersFromComment(rawText);
    if (!extractedNumbers || extractedNumbers.length === 0) return;

    const uid = String(c.userId || c.username || '').toLowerCase();
    const activePlayer = playersRef.current.find(p => p.userId === uid && p.status === 'ACTIVE');

    // Rule 1: Must be an active registered contestant
    if (!activePlayer) return;

    // Rule 2: Strict "One Chair Per Contestant" -> If already seated, ignore immediately!
    const currentSeats = [...seatsRef.current];
    const isAlreadySeated = currentSeats.some(s => s.playerId === activePlayer.id) || activePlayer.status === 'SEATED';
    if (isAlreadySeated) return;

    const now = Date.now();

    // Rule 3: Multiple numbers in comment -> Find the FIRST available seat among them!
    let claimedTargetSeat: MusicalChairsSeat | null = null;
    let claimedNumber: number | null = null;

    for (const num of extractedNumbers) {
      const seat = currentSeats.find(s => s.seatNumber === num && s.status === 'AVAILABLE');
      if (seat) {
        claimedTargetSeat = seat;
        claimedNumber = num;
        break; // Stop at the first available seat!
      }
    }

    // If none of the written numbers were available, log appropriate rejection
    if (!claimedTargetSeat || !claimedNumber) {
      const firstNum = extractedNumbers[0];
      const seatExists = currentSeats.some(s => s.seatNumber === firstNum);

      setClaimLogs(prev => [
        {
          id: `log-${Date.now()}-${Math.random()}`,
          roundNumber: roundNumber,
          playerId: activePlayer.id,
          playerName: activePlayer.displayName,
          avatarUrl: activePlayer.avatarUrl,
          seatNumber: firstNum,
          commentText: rawText,
          receivedAt: now,
          result: seatExists ? 'REJECTED_TAKEN' : 'REJECTED_INVALID'
        },
        ...prev.slice(0, 19)
      ]);
      return;
    }

    // ✅ ATOMIC SUCCESS CLAIM! Lock the first available seat to this player
    const claimSpeedMs = now - claimStartTime;
    if (fastestClaimMs === null || claimSpeedMs < fastestClaimMs) {
      setFastestClaimMs(claimSpeedMs);
    }

    claimedTargetSeat.status = 'CLAIMED';
    claimedTargetSeat.playerId = activePlayer.id;
    claimedTargetSeat.player = { ...activePlayer, status: 'SEATED', currentSeatNumber: claimedNumber };
    claimedTargetSeat.claimedAt = now;

    // Update Seat State
    setSeats([...currentSeats]);

    // Update Player Status to SEATED
    setPlayers(prev => prev.map(p => {
      if (p.id === activePlayer.id) {
        return {
          ...p,
          status: 'SEATED',
          currentSeatNumber: claimedNumber!,
          seatsClaimedCount: (p.seatsClaimedCount || 0) + 1
        };
      }
      return p;
    }));

    // Log Claim
    setClaimLogs(prev => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        roundNumber: roundNumber,
        playerId: activePlayer.id,
        playerName: activePlayer.displayName,
        avatarUrl: activePlayer.avatarUrl,
        seatNumber: claimedNumber!,
        commentText: rawText,
        receivedAt: now,
        result: 'CLAIMED'
      },
      ...prev.slice(0, 19)
    ]);

    soundFX.play('correct_answer');

    // Check if ALL seats are now filled
    const allFilled = currentSeats.every(s => s.status === 'CLAIMED');
    if (allFilled) {
      setTimeout(() => {
        lockSeatsAndEliminate();
      }, 500);
    }
  }, [claimStartTime, fastestClaimMs, roundNumber]);

  // Comment listener during SEAT_CLAIMING
  useEffect(() => {
    if (phase !== 'SEAT_CLAIMING') return;

    // Only process comments that arrived AFTER the claiming window opened
    const claimWindowStart = claimStartTime || Date.now();
    liveComments
      .filter(c => (c.timestamp || 0) >= claimWindowStart)
      .forEach(c => handleProcessClaimComment(c));

    if (tiktokEngine) {
      const handleEngineComment = (c: any) => handleProcessClaimComment(c);
      tiktokEngine.onComment(handleEngineComment);
      return () => tiktokEngine.offComment(handleEngineComment);
    }
  }, [phase, liveComments, tiktokEngine, handleProcessClaimComment, claimStartTime]);

  // ══════════════════════════════════════════════════════════════
  // 8. LOCK SEATS & ELIMINATION ENGINE
  // ══════════════════════════════════════════════════════════════
  const lockSeatsAndEliminate = () => {
    if (phaseRef.current === 'ELIMINATION' || phaseRef.current === 'WINNER') return;

    setPhase('SEATS_LOCKED');
    soundFX.play('box_open');

    // Find the player who did not get a seat
    const seatedPlayerIds = new Set(seatsRef.current.filter(s => s.status === 'CLAIMED' && s.playerId).map(s => s.playerId));
    const activeRemaining = playersRef.current.filter(p => p.status !== 'ELIMINATED');
    const unseatedPlayers = activeRemaining.filter(p => !seatedPlayerIds.has(p.id));
    // Only eliminate if exactly one player is unseated (normal case: chairs = players - 1)
    const unseatedPlayer = unseatedPlayers.length === 1 ? unseatedPlayers[0] : 
      unseatedPlayers.length > 1 ? unseatedPlayers[unseatedPlayers.length - 1] : null;

    setTimeout(() => {
      if (unseatedPlayer) {
        setEliminatedThisRound(unseatedPlayer);
        setPhase('ELIMINATION');
        soundFX.play('wrong_answer');

        // Mark player as ELIMINATED
        setPlayers(prev => prev.map(p => {
          if (p.id === unseatedPlayer.id) {
            return {
              ...p,
              status: 'ELIMINATED',
              eliminationRound: roundNumber,
              eliminatedAt: Date.now()
            };
          }
          return p;
        }));
      }

      // Check if Final Round or Game Over
      setTimeout(() => {
        const remainingAlive = playersRef.current.filter(p => p.id !== unseatedPlayer?.id && p.status !== 'ELIMINATED');

        if (remainingAlive.length === 1) {
          // 🏆 WE HAVE A CHAMPION!
          const champion = remainingAlive[0];
          setWinner(champion);
          setPhase('WINNER');
          soundFX.play('winner_announcement');
          soundFX.play('show_end');
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
          // Prepare Next Round
          const nextRoundNum = roundNumber + 1;
          setRoundNumber(nextRoundNum);
          setupRoundChairs(remainingAlive, nextRoundNum);

          if (remainingAlive.length === 2) {
            setPhase('FINAL_ROUND');
            soundFX.play('round_transition');
            setTimeout(() => {
              startMusicPhase(nextRoundNum, remainingAlive);
            }, 3500);
          } else {
            setPhase('NEXT_ROUND');
            setTimeout(() => {
              startMusicPhase(nextRoundNum, remainingAlive);
            }, 3000);
          }
        }
      }, 4000);
    }, 800);
  };

  // Manual Test Helper: Simulate Quick Claim for Mock Players
  const handleSimulateMockClaims = () => {
    if (phase !== 'SEAT_CLAIMING') return;
    const availableSeats = seats.filter(s => s.status === 'AVAILABLE');
    const activeUnseated = players.filter(p => p.status === 'ACTIVE');

    activeUnseated.slice(0, availableSeats.length).forEach((player, i) => {
      const targetSeat = availableSeats[i];
      if (targetSeat) {
        setTimeout(() => {
          handleProcessClaimComment({
            userId: player.userId,
            username: player.username,
            displayName: player.displayName,
            avatarUrl: player.avatarUrl,
            comment: `${targetSeat.seatNumber}`,
            timestamp: Date.now()
          });
        }, i * 300);
      }
    });
  };

  // Host Emergency Controls
  const handleEmergencyResetRound = () => {
    stopSynthMusic();
    const alive = players.filter(p => p.status !== 'ELIMINATED');
    setupRoundChairs(alive, roundNumber);
    setPhase('READY');
  };

  const handleFullResetGame = () => {
    stopSynthMusic();
    registeredUserIds.current.clear();
    processedCommentIds.current.clear();
    setPlayers([]);
    setSeats([]);
    setRoundNumber(1);
    setWinner(null);
    setEliminatedThisRound(null);
    setClaimLogs([]);
    setPhase('IDLE');
  };

  // Stats Calculations
  const totalRegisteredCount = players.length;
  const alivePlayers = players.filter(p => p.status !== 'ELIMINATED');
  const aliveCount = alivePlayers.length;
  const eliminatedCount = totalRegisteredCount - aliveCount;
  const currentSeatCount = seats.length;
  const claimedSeatCount = seats.filter(s => s.status === 'CLAIMED').length;

  if (!hasMounted) {
    return (
      <div className="w-full max-w-7xl min-h-[88vh] flex items-center justify-center p-6 rounded-3xl bg-[#090B17] border border-[#1E2240]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono font-bold text-slate-400">جاري تحميل ساحة الكراسي الموسيقية...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl min-h-[88vh] flex flex-col items-center justify-between p-4 sm:p-7 text-white dir-rtl relative overflow-hidden rounded-3xl glass-broadcast-panel border border-[#1E2240] shadow-[0_30px_100px_rgba(0,0,0,0.95)]">
      {/* Ambient Sovereign Lights */}
      <div className="absolute -top-32 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Header Command Bar */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 z-20 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <Disc3 className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>الكراسي الموسيقية</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                MUSICAL CHAIRS 🪑
              </span>
            </h1>
            <span className="text-[11px] text-slate-400 font-bold">
              الجولة #{roundNumber} • {phase === 'FINAL_ROUND' ? '🔥 الجولة النهائية' : phase === 'MUSIC_PLAYING' ? '🎵 الموسيقى تدور...' : phase === 'SEAT_CLAIMING' ? '⚡ احجز كرسيك بالرقم!' : 'استمع للموسيقى واحجز كرسيك بأسرع وقت'}
            </span>
          </div>
        </div>

        {/* Music Track & Volume Controls */}
        <div className="flex items-center gap-2">
          {/* Duration Selector */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400 ml-1" />
            {[10, 15, 20, 25, 30].map(dur => (
              <button
                key={dur}
                disabled={phase === 'MUSIC_PLAYING' || phase === 'SEAT_CLAIMING'}
                onClick={() => setSelectedDuration(dur)}
                className={`px-2 py-1 rounded-lg font-mono font-black text-[11px] transition-all cursor-pointer ${
                  selectedDuration === dur
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>

          {/* Mute Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isAudioMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
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
              <span>لعبة السرعة وردّة الفعل المباشرة</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              🪑 الكراسي الموسيقية
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
                <span>▶ بدء اللعبة ({players.length} لاعب)</span>
              </button>
            )}

            <button
              onClick={() => handleAddMockParticipants(5)}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>+ إضافة 5 مشاركين تجريبيين</span>
            </button>
          </div>

          {/* Registered Players Grid */}
          <div className="w-full p-6 rounded-3xl bg-[#121428] border border-[#1E2240] flex flex-col gap-4 max-h-[380px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">المتسابقون المسجلون ({players.length})</h3>
              </div>
              <span className="text-xs text-amber-300 font-mono font-black">
                {players.length >= 2 ? `✅ جاهز للبدء (${players.length} لاعب → ${players.length - 1} كراسي)` : '⚠️ بانتظار تسجيل لاعبين على الأقل'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 overflow-y-auto pr-1">
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-[#171932] border border-[#25284C] flex flex-col items-center text-center gap-2 animate-in zoom-in-95"
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
                  لم يسجل أي لاعب بعد... اكتب كلمة <strong className="text-amber-400">"العب"</strong> في الشات أو اضغط على الزر التجريبي أعلاه!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 🔴 MAIN SCREEN 2: FULL-WIDTH MAXIMIZED CIRCULAR ARENA          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {phase !== 'IDLE' && phase !== 'REGISTRATION' && (
        <div className="w-full flex-1 flex flex-col items-center justify-between gap-2 my-1 z-10">
          
          {/* ⏱️ TOP FLOATING TIMER / LIVE HUD BANNER */}
          <div className="w-full max-w-xl z-30 flex flex-col items-center">
            <div className={`w-full py-2.5 px-6 rounded-2xl flex items-center justify-between shadow-2xl border backdrop-blur-xl transition-all duration-300 ${
              phase === 'MUSIC_PLAYING'
                ? musicTimeRemaining <= 5
                  ? 'bg-rose-950/90 border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.6)] animate-pulse'
                  : 'bg-[#101228]/95 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                : phase === 'MUSIC_STOPPED' || phase === 'SEAT_CLAIMING'
                ? 'bg-rose-950/95 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.8)] scale-105'
                : 'bg-[#101228]/90 border-white/15'
            }`}>
              
              {/* Left: Round / State */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono font-black text-xs">
                  الجولة #{roundNumber}
                </span>
                <span className="text-xs font-black text-white">
                  {phase === 'MUSIC_PLAYING' ? (
                    <span className="flex items-center gap-1 text-amber-300">
                      <Music className="w-4 h-4 animate-bounce" />
                      <span>الموسيقى تدور...</span>
                    </span>
                  ) : phase === 'MUSIC_STOPPED' || phase === 'SEAT_CLAIMING' ? (
                    <span className="text-rose-300 animate-pulse font-black text-sm">
                      🛑 توقفت! احجز الآن!
                    </span>
                  ) : phase === 'READY' || phase === 'COUNTDOWN' ? (
                    <span className="text-amber-300">استعدوا...</span>
                  ) : phase === 'FINAL_ROUND' ? (
                    <span className="text-amber-400">🔥 الجولة النهائية</span>
                  ) : (
                    <span>الكراسي الموسيقية</span>
                  )}
                </span>
              </div>

              {/* Right: Big Digital Timer */}
              <div className="flex items-center gap-2">
                <span className={`text-3xl sm:text-4xl font-black font-mono tracking-widest ${
                  musicTimeRemaining <= 5 && phase === 'MUSIC_PLAYING' ? 'text-rose-400 animate-pulse' : 'text-white'
                }`}>
                  00:{String(musicTimeRemaining).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Sub-label banner during claiming */}
            {(phase === 'MUSIC_STOPPED' || phase === 'SEAT_CLAIMING') && (
              <div className="mt-1.5 px-6 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm font-mono animate-bounce shadow-xl">
                ⚡ اكتب رقم الكرسي في الشات بأسرع وقت!
              </div>
            )}
          </div>

          {/* 🟢 TOP HORIZONTAL LIVE CLAIMS FEED (سجل الحجز المباشر بالعرض) */}
          <div className="w-full max-w-4xl px-4 py-2 rounded-2xl bg-[#121428]/95 border border-white/15 flex items-center justify-between gap-3 overflow-x-auto my-1 z-20 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-mono font-black text-amber-300 whitespace-nowrap">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>سجل الحجز:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none flex-1">
              {claimLogs.slice(0, 10).map(log => (
                <div
                  key={log.id}
                  className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm ${
                    log.result === 'CLAIMED'
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <span className="font-extrabold">{log.playerName}</span>
                  <span className="font-mono font-black text-sm">
                    {log.result === 'CLAIMED' ? `🟢 ${log.seatNumber}` : `❌ ${log.seatNumber}`}
                  </span>
                </div>
              ))}
              {claimLogs.length === 0 && (
                <span className="text-[11px] text-slate-400 font-bold">بانتظار حجوزات الشات...</span>
              )}
            </div>
          </div>

          {/* 🎡 MAXIMIZED HD CIRCULAR ARENA */}
          <div className="w-full flex-1 flex items-center justify-center relative min-h-[580px] sm:min-h-[640px] md:min-h-[680px]">
            
            {/* 🎵 HIDDEN YOUTUBE PLAYER FOR https://youtu.be/TZE9gVF1QbA */}
            <iframe
              ref={ytIframeRef}
              src="https://www.youtube.com/embed/TZE9gVF1QbA?enablejsapi=1&autoplay=0&loop=1&playlist=TZE9gVF1QbA&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1"
              allow="autoplay"
              className="hidden pointer-events-none opacity-0 absolute -top-[9999px] -left-[9999px] w-1 h-1"
              title="Musical Chairs YouTube Music"
            />

            {/* Dynamic Radii Calculation (Massive Screen Utilization) */}
            {(() => {
              const total = seats.length;
              // Dynamic spacious radii
              const chairRadius = total === 1 ? 0 : total <= 3 ? 140 : total <= 6 ? 180 : total <= 9 ? 225 : 260;
              const outerRadius = chairRadius + (total === 1 ? 220 : total <= 6 ? 110 : 95);
              const cardWidthPx = total === 1 ? 135 : total <= 3 ? 115 : total <= 6 ? 98 : total <= 9 ? 82 : 72;
              const cardHeightPx = total === 1 ? 165 : total <= 3 ? 145 : total <= 6 ? 128 : total <= 9 ? 110 : 98;
              const numFontSize = total === 1 ? 'text-3xl sm:text-4xl' : total <= 3 ? 'text-2xl sm:text-3xl' : total <= 6 ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg';
              const chairEmojiSize = total === 1 ? 'text-4xl sm:text-5xl' : total <= 3 ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl';
              const seatedAvatarSize = total === 1 ? 'w-14 h-14' : total <= 3 ? 'w-12 h-12' : total <= 6 ? 'w-10 h-10' : 'w-8 h-8';

              return (
                <div 
                  style={{ width: `${outerRadius * 2 + 50}px`, height: `${outerRadius * 2 + 50}px` }}
                  className="relative flex items-center justify-center max-w-full max-h-full"
                >
                  {/* Outer Orbit Track Ring */}
                  <div 
                    style={{ width: `${outerRadius * 2}px`, height: `${outerRadius * 2}px` }}
                    className="absolute rounded-full border border-purple-500/25 bg-gradient-to-b from-purple-950/15 via-transparent to-purple-950/20 pointer-events-none shadow-[0_0_90px_rgba(139,92,246,0.15)]" 
                  />
                  
                  {/* Inner Chairs Track Ring (Only if multiple chairs) */}
                  {total > 1 && (
                    <div 
                      style={{ width: `${chairRadius * 2}px`, height: `${chairRadius * 2}px` }}
                      className="absolute rounded-full border border-cyan-500/25 pointer-events-none" 
                    />
                  )}

                  {/* 🏃 1. OUTER ORBIT: PARTICIPANT AVATARS */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform"
                    style={{ 
                      transform: `rotate(${playersOrbitRotation}deg)`,
                      transition: phase === 'MUSIC_PLAYING' ? 'none' : 'transform 0.5s ease-out'
                    }}
                  >
                    {alivePlayers.map((player, idx) => {
                      const totalP = alivePlayers.length;
                      const angleDeg = (idx * (360 / totalP)) - 90;
                      const angleRad = (angleDeg * Math.PI) / 180;
                      const x = outerRadius * Math.cos(angleRad);
                      const y = outerRadius * Math.sin(angleRad);

                      return (
                        <div
                          key={player.id}
                          style={{
                            transform: `translate(${x}px, ${y}px) rotate(${-playersOrbitRotation}deg)`
                          }}
                          className="absolute flex flex-col items-center gap-0.5 animate-in zoom-in-75 pointer-events-auto"
                        >
                          <div className="relative group">
                            <img
                              src={player.avatarUrl}
                              alt={player.displayName}
                              className="w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] bg-slate-900"
                            />
                            {player.status === 'SEATED' && (
                              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-[10px] flex items-center justify-center text-black font-black shadow-md">
                                ✓
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-lg bg-slate-900/90 border border-white/15 max-w-[85px] truncate shadow-sm">
                            {player.displayName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 🪑 2. INNER CIRCLE: MUSICAL CHAIRS (Completely Unobstructed & Huge) */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform"
                    style={{ 
                      transform: `rotate(${chairsRotation}deg)`,
                      transition: phase === 'MUSIC_PLAYING' ? 'none' : 'transform 0.5s ease-out'
                    }}
                  >
                    {seats.map((seat, index) => {
                      const angleDeg = total === 1 ? 0 : (index * (360 / total)) - 90;
                      const angleRad = (angleDeg * Math.PI) / 180;
                      const x = chairRadius * Math.cos(angleRad);
                      const y = chairRadius * Math.sin(angleRad);

                      const isClaimed = seat.status === 'CLAIMED';
                      const seatColor = SEAT_COLORS[index % SEAT_COLORS.length];
                      const showSeatNumbers = phase === 'MUSIC_STOPPED' || phase === 'SEAT_CLAIMING' || phase === 'SEATS_LOCKED' || phase === 'ELIMINATION' || phase === 'WINNER';

                      return (
                        <div
                          key={seat.seatId}
                          style={{
                            transform: `translate(${x}px, ${y}px) rotate(${-chairsRotation}deg)`,
                            width: `${cardWidthPx}px`,
                            height: `${cardHeightPx}px`,
                            borderColor: isClaimed ? '#10B981' : showSeatNumbers ? seatColor : '#F59E0B'
                          }}
                          className={`absolute rounded-2xl flex flex-col items-center justify-between p-1.5 shadow-2xl transition-all duration-300 pointer-events-auto ${
                            isClaimed
                              ? 'bg-emerald-950/95 border-2 sm:border-3 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.85)] scale-105'
                              : 'bg-[#0E1024]/95 border-2 sm:border-3 hover:scale-110 shadow-[0_12px_30px_rgba(0,0,0,0.85)]'
                          }`}
                        >
                          {/* 🌟 SEAT NUMBER BADGE (HD High Contrast for Mobile) */}
                          <div 
                            style={{ 
                              backgroundColor: isClaimed ? '#059669' : showSeatNumbers ? '#070814' : '#2A1040',
                              borderColor: isClaimed ? '#34D399' : showSeatNumbers ? seatColor : '#F59E0B'
                            }}
                            className={`px-1.5 py-1 rounded-xl border-2 text-white font-black font-mono ${numFontSize} shadow-lg w-full text-center tracking-wider drop-shadow-md transition-all duration-300`}
                          >
                            {isClaimed ? `✓ ${seat.seatNumber}` : showSeatNumbers ? seat.seatNumber : '❓'}
                          </div>

                          {/* Center: Chair Icon or Seated Winner Avatar */}
                          <div className="flex-1 flex items-center justify-center my-0.5 relative">
                            {isClaimed && seat.player ? (
                              <div className="relative animate-in zoom-in-95">
                                <img
                                  src={seat.player.avatarUrl}
                                  alt={seat.player.displayName}
                                  className={`${seatedAvatarSize} rounded-full object-cover border-2 border-emerald-400 shadow-md`}
                                />
                                <span className="absolute -bottom-1 -right-1 text-xs">🔒</span>
                              </div>
                            ) : (
                              <div className={`${chairEmojiSize} filter drop-shadow-md`}>
                                🪑
                              </div>
                            )}
                          </div>

                          {/* Bottom Player Display Name */}
                          <div className="w-full text-center truncate px-0.5">
                            {isClaimed && seat.player ? (
                              <span className="text-[9px] sm:text-[10px] font-black text-emerald-300 block truncate">
                                {seat.player.displayName}
                              </span>
                            ) : (
                              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-300 block">
                                متاح
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Test Helper: Quick Trigger Claims during testing */}
          {phase === 'SEAT_CLAIMING' && (
            <div className="z-30 flex items-center gap-2 my-2">
              <button
                onClick={handleSimulateMockClaims}
                className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-black transition-all cursor-pointer shadow-md"
              >
                ⚡ محاكاة حجز فوري للمشاركين التجريبيين
              </button>
            </div>
          )}

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ❌ MODAL: ELIMINATION BANNER (شاشة الإقصاء والخروج)             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {phase === 'ELIMINATION' && eliminatedThisRound && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1C1428] via-[#14152A] to-[#1C1428] border-2 border-rose-500 shadow-[0_0_80px_rgba(244,63,94,0.6)] flex flex-col items-center text-center gap-4 max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-3xl text-rose-400 font-black shadow-lg">
              ❌
            </div>

            <div>
              <span className="text-xs font-mono font-black text-rose-400 uppercase tracking-widest block">
                لم يحصل على كرسي
              </span>
              <h2 className="text-3xl font-black text-white mt-1">{eliminatedThisRound.displayName}</h2>
            </div>

            <div className="relative">
              <img
                src={eliminatedThisRound.avatarUrl}
                alt={eliminatedThisRound.displayName}
                className="w-24 h-24 rounded-full object-cover border-4 border-rose-500 shadow-2xl filter grayscale"
              />
              <span className="absolute -bottom-2 -right-2 text-2xl">💔</span>
            </div>

            <p className="text-xs text-slate-300 font-bold">
              خرج من المنافسة في <strong className="text-rose-400 font-mono">الجولة #{roundNumber}</strong>
            </p>

            <span className="text-[11px] text-amber-300 font-bold animate-pulse">
              انتقال للجولة التالية خلال 3 ثوانٍ...
            </span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 🏆 MODAL: CHAMPION WINNER BANNER (شاشة الفائز النهائي)         */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {phase === 'WINNER' && winner && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#241A0A] via-[#14152A] to-[#241A0A] border-4 border-amber-400 shadow-[0_0_120px_rgba(245,158,11,0.8)] flex flex-col items-center text-center gap-5 max-w-lg w-full">
            
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-lg">
              🏆
            </div>

            <div>
              <span className="px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-black uppercase tracking-widest">
                🥇 بطل الكراسي الموسيقية
              </span>
              <h2 className="text-4xl font-black text-white mt-2">{winner.displayName}</h2>
              <span className="text-sm font-mono text-amber-400 font-bold block">@{winner.username}</span>
            </div>

            <div className="relative">
              <img
                src={winner.avatarUrl}
                alt={winner.displayName}
                className="w-28 h-28 rounded-full object-cover border-4 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.9)]"
              />
              <span className="absolute -top-3 -right-3 text-3xl">👑</span>
            </div>

            {/* Victory Stats */}
            <div className="grid grid-cols-3 gap-2 w-full mt-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">المشاركون</span>
                <span className="text-sm font-black text-white font-mono">{totalRegisteredCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">الجولات</span>
                <span className="text-sm font-black text-amber-300 font-mono">{roundNumber}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">أسرع حجز</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{fastestClaimMs ? `${(fastestClaimMs / 1000).toFixed(2)}s` : '0.45s'}</span>
              </div>
            </div>

            {/* Reset / New Game Button */}
            <button
              onClick={handleFullResetGame}
              className="mt-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-base shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              🔄 بدء لعبة جديدة
            </button>
          </div>
        </div>
      )}

      {/* Bottom Host Quick Toolbar */}
      <div className="w-full flex items-center justify-between border-t border-white/10 pt-3 z-10 flex-wrap gap-2 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real Connector Live Engine Active</span>
        </div>

        <div className="flex items-center gap-2">
          {phase !== 'IDLE' && phase !== 'REGISTRATION' && (
            <>
              <button
                onClick={handleEmergencyResetRound}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة الجولة</span>
              </button>
              <button
                onClick={handleFullResetGame}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all cursor-pointer"
              >
                🛑 إنهاء اللعبة
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
