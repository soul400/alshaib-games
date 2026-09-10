'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  ViewerRaceQuestion, 
  ViewerRacePhase, 
  ViewerRacer, 
  ViewerRaceConfig,
  TikTokLiveComment
} from '@aep/types';
import { 
  DEFAULT_RACE_CONFIG,
  isRaceJoinComment,
  isRaceBoostComment,
  generateMockRacers,
  updateRacersPhysics,
  calculateCameraDirector,
  RACER_COLORS
} from '@aep/game-engines';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { useStudioStore } from '../../store/useStudioStore';
import { 
  Trophy, Users, Clock, Play, RotateCcw, Settings, 
  Sparkles, Volume2, VolumeX, Zap, Flame, UserPlus, 
  Eye, RefreshCw, Flag, Award, ChevronRight, Gauge, Radio
} from 'lucide-react';

interface Props {
  question?: ViewerRaceQuestion;
  isAnswerRevealed?: boolean;
}

export function ViewerRaceView({ question: propQuestion }: Props) {
  const { liveComments, tiktokEngine } = useStudioStore();

  // 1. CONFIGURATION & STATE
  const [config, setConfig] = useState<ViewerRaceConfig>(() => ({
    ...DEFAULT_RACE_CONFIG,
    ...(propQuestion?.config || {})
  }));

  const [phase, setPhase] = useState<ViewerRacePhase>('LOBBY');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [racers, setRacers] = useState<ViewerRacer[]>([]);
  const [winner, setWinner] = useState<ViewerRacer | null>(null);

  // Clocks and Timers
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(config.lobbyDurationSeconds);
  const [cameraX, setCameraX] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [cameraShake, setCameraShake] = useState<boolean>(false);

  // Settings & Host Controls
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [raceEvents, setRaceEvents] = useState<{ id: string; text: string; time: string; icon: string }[]>([]);

  // Canvas Refs & Animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const phaseRef = useRef<ViewerRacePhase>(phase);
  phaseRef.current = phase;

  // Track & Viewport dimensions
  const TRACK_TOTAL_WIDTH = 3800; // Total canvas track width in pixels
  const TRACK_HEIGHT = 520;       // Track canvas height
  const [avatarImages, setAvatarImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Deduplication
  const registeredUserIdsRef = useRef<Set<string>>(new Set());
  const processedCommentIdsRef = useRef<Set<string>>(new Set());
  const previousLeaderIdRef = useRef<string | null>(null);

  // Sound helper
  const playSound = useCallback((type: any, vol: number = 0.8) => {
    if (!isMuted && config.soundEnabled) {
      soundFX.play(type, vol);
    }
  }, [isMuted, config.soundEnabled]);

  // Event Log Ticker
  const addRaceEvent = useCallback((text: string, icon: string = '🏇') => {
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setRaceEvents(prev => [{ id: `${Date.now()}-${Math.random()}`, text, time, icon }, ...prev.slice(0, 5)]);
  }, []);

  // Preload Avatar Image
  const loadAvatar = useCallback((url: string) => {
    if (!url || avatarImages.has(url)) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      setAvatarImages(prev => new Map(prev).set(url, img));
    };
  }, [avatarImages]);

  // 2. JOIN HANDLER (Comment-Only Entry)
  const handlePlayerJoin = useCallback((comment: TikTokLiveComment) => {
    if (phaseRef.current !== 'LOBBY') return;

    const userKey = (comment.userId || comment.username || '').toLowerCase().trim();
    if (!userKey || registeredUserIdsRef.current.has(userKey)) return;

    if (racers.length >= config.maxRacers) return;

    registeredUserIdsRef.current.add(userKey);
    const lane = racers.length;
    const color = RACER_COLORS[lane % RACER_COLORS.length];
    const baseSpeed = 16 + Math.random() * 4.5;

    const newRacer: ViewerRacer = {
      id: `racer-${Date.now()}-${Math.random()}`,
      userId: userKey,
      username: comment.username,
      displayName: comment.displayName || comment.username,
      avatarUrl: comment.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userKey}`,
      lane,
      color,
      progress: 0,
      distanceMeters: 0,
      speed: baseSpeed,
      baseSpeed,
      boostTimer: 0,
      stumbleTimer: 0,
      rank: racers.length + 1,
      isBot: false,
      cheerCount: 0,
      joinedAt: Date.now()
    };

    loadAvatar(newRacer.avatarUrl);
    setRacers(prev => [...prev, newRacer]);
    addRaceEvent(`انضم ${newRacer.displayName} إلى خط الانطلاق!`, '🏇');
    playSound('lock_click', 0.4);
  }, [racers.length, config.maxRacers, loadAvatar, addRaceEvent, playSound]);

  // 3. LISTEN TO TIKTOK LIVE CHAT
  useEffect(() => {
    if (!liveComments || liveComments.length === 0) return;

    liveComments.forEach(comment => {
      if (processedCommentIdsRef.current.has(comment.id)) return;
      processedCommentIdsRef.current.add(comment.id);

      // Check Join in Lobby
      if (phaseRef.current === 'LOBBY') {
        if (isRaceJoinComment(comment.comment)) {
          handlePlayerJoin(comment);
        }
      }

      // Check Chat Turbo Cheer during Race
      if (phaseRef.current === 'RACING' || phaseRef.current === 'FINAL_STRETCH') {
        if (config.chatBoostEnabled && isRaceBoostComment(comment.comment)) {
          const userKey = (comment.userId || comment.username || '').toLowerCase().trim();
          // Boost matching racer if active
          setRacers(prev => prev.map(racer => {
            if (racer.userId === userKey || racer.username.toLowerCase() === userKey) {
              addRaceEvent(`⚡ شعللها ${racer.displayName} بتشجيع الشات!`, '🔥');
              playSound('race_turbo', 0.6);
              return {
                ...racer,
                boostTimer: Math.max(racer.boostTimer, 2.5),
                cheerCount: racer.cheerCount + 1
              };
            }
            return racer;
          }));
        }
      }
    });
  }, [liveComments, handlePlayerJoin, config.chatBoostEnabled, addRaceEvent, playSound]);

  // 4. ADD MOCK RACERS FOR DEMO
  const addDemoRacers = useCallback((count: number = 8) => {
    if (phase !== 'LOBBY') return;
    const availableSlots = config.maxRacers - racers.length;
    const toAdd = Math.min(count, Math.max(0, availableSlots));
    if (toAdd <= 0) return;

    const mocks = generateMockRacers(toAdd, config.trackLengthMeters).map((m, idx) => ({
      ...m,
      lane: racers.length + idx,
      color: RACER_COLORS[(racers.length + idx) % RACER_COLORS.length]
    }));

    mocks.forEach(m => {
      registeredUserIdsRef.current.add(m.userId);
      loadAvatar(m.avatarUrl);
    });

    setRacers(prev => [...prev, ...mocks]);
    addRaceEvent(`تمت إضافة ${toAdd} متسابقين إلى خط البداية!`, '👥');
    playSound('box_open', 0.6);
  }, [phase, config.maxRacers, racers.length, config.trackLengthMeters, loadAvatar, addRaceEvent, playSound]);

  // 5. START RACE WORKFLOW
  const startCountdown = useCallback(() => {
    if (racers.length < 2) {
      addDemoRacers(8);
    }
    setPhase('COUNTDOWN');
    setTimeRemainingSeconds(config.countdownDurationSeconds);
    playSound('countdown_tick', 0.7);
    addRaceEvent('انتبهوا.. العد التنازلي للسباق بدأ!', '⏱️');
  }, [racers.length, addDemoRacers, config.countdownDurationSeconds, playSound, addRaceEvent]);

  // Reset Race to Lobby
  const resetRace = useCallback(() => {
    setPhase('LOBBY');
    setWinner(null);
    setTimeRemainingSeconds(config.lobbyDurationSeconds);
    setCameraX(0);
    setZoomLevel(1.0);
    previousLeaderIdRef.current = null;
    registeredUserIdsRef.current.clear();
    setRacers([]);
    addRaceEvent('تم فتح التسجيل لسباق جديد! اكتب «العب» للمشاركة.', '🚩');
  }, [config.lobbyDurationSeconds, addRaceEvent]);

  // 6. TIMER TICK (Lobby, Countdown, Cooldown)
  useEffect(() => {
    if (phase !== 'LOBBY' && phase !== 'COUNTDOWN' && phase !== 'COOLDOWN') return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          if (phaseRef.current === 'LOBBY') {
            if (racers.length >= 2) {
              startCountdown();
            } else {
              addDemoRacers(6);
              startCountdown();
            }
            return 0;
          }

          if (phaseRef.current === 'COUNTDOWN') {
            setPhase('RACING');
            playSound('race_horn', 0.9);
            playSound('horse_gallop', 0.6);
            addRaceEvent('🏁 انطلق السباق الكبير! يا سرعهم!', '⚡');
            return 0;
          }

          if (phaseRef.current === 'COOLDOWN') {
            resetRace();
            return config.lobbyDurationSeconds;
          }

          return 0;
        }

        if (phaseRef.current === 'COUNTDOWN') {
          playSound('countdown_tick', 0.7);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, racers.length, startCountdown, addDemoRacers, playSound, addRaceEvent, resetRace, config.lobbyDurationSeconds]);

  // 7. 60 FPS CANVAS GAME LOOP & PHYSICS
  useEffect(() => {
    let animationId: number;

    const renderLoop = (timestamp: number) => {
      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      const canvas = canvasRef.current;
      if (!canvas) {
        animationId = requestAnimationFrame(renderLoop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationId = requestAnimationFrame(renderLoop);
        return;
      }

      const viewportW = canvas.width;
      const viewportH = canvas.height;

      // Update Physics during active race
      if (phaseRef.current === 'RACING' || phaseRef.current === 'FINAL_STRETCH') {
        setRacers(prevRacers => {
          const { updatedRacers, newFinishers } = updateRacersPhysics(
            prevRacers,
            delta,
            config.trackLengthMeters,
            config
          );

          // Check Leader Change for Overtake effect & event
          const currentLeader = updatedRacers[0];
          if (currentLeader && currentLeader.id !== previousLeaderIdRef.current) {
            if (previousLeaderIdRef.current !== null && currentLeader.progress > 5 && currentLeader.progress < 95) {
              playSound('overtake_swoosh', 0.7);
              addRaceEvent(`🔥 ${currentLeader.displayName} يخطف الصدارة ويتجاوز الجميع!`, '⚡');
            }
            previousLeaderIdRef.current = currentLeader.id;
          }

          // Check if Leader entered Final Stretch (> 80%)
          if (currentLeader && currentLeader.progress >= 80 && phaseRef.current === 'RACING') {
            setPhase('FINAL_STRETCH');
            addRaceEvent('🚨 الأمتار الأخيرة! اشتعلت المنافسة على المركز الأول!', '🏁');
          }

          // Handle Winner Finish
          if (newFinishers.length > 0 && !winner) {
            const firstPlace = newFinishers[0];
            setWinner(firstPlace);
            setPhase('WINNER');
            playSound('photo_finish', 0.9);
            playSound('winner_announcement', 0.85);
            triggerVisualEffect('confetti');
            triggerVisualEffect('fireworks');
            setCameraShake(true);
            setTimeout(() => setCameraShake(false), 800);

            // Award points to top 3 in TikTok leaderboard
            if (tiktokEngine) {
              tiktokEngine.awardPoints({
                userId: firstPlace.userId,
                username: firstPlace.username,
                displayName: firstPlace.displayName,
                avatarUrl: firstPlace.avatarUrl,
                points: 500
              });
            }

            addRaceEvent(`🏆 البطل ${firstPlace.displayName} يفوز بالمركز الأول!`, '👑');

            // 10 seconds celebration then cooldown
            setTimeout(() => {
              setPhase('COOLDOWN');
              setTimeRemainingSeconds(6);
            }, 9000);
          }

          return updatedRacers;
        });
      }

      // Calculate Camera Director Position
      const cam = calculateCameraDirector(
        racers,
        cameraX,
        TRACK_TOTAL_WIDTH,
        viewportW,
        config.cameraMode
      );
      setCameraX(cam.cameraX);
      setZoomLevel(cam.zoom);

      // ── DRAWING CANVAS SCENE ──
      ctx.clearRect(0, 0, viewportW, viewportH);
      ctx.save();

      // Screen Shake
      if (cameraShake) {
        const shakeX = (Math.random() - 0.5) * 10;
        const shakeY = (Math.random() - 0.5) * 10;
        ctx.translate(shakeX, shakeY);
      }

      // Camera Viewport Transform (Zoom + Pan)
      ctx.scale(cam.zoom, cam.zoom);
      ctx.translate(-cam.cameraX, 0);

      // 1. Draw Turf / Dirt Track Background
      const laneHeight = 56;
      const trackTop = 70;
      const activeTrackHeight = Math.max(TRACK_HEIGHT - 120, racers.length * laneHeight + 40);

      // Grass gradient top/bottom borders
      const bgGrad = ctx.createLinearGradient(0, 0, 0, viewportH);
      bgGrad.addColorStop(0, '#0F2617');
      bgGrad.addColorStop(0.12, '#183820');
      bgGrad.addColorStop(0.2, '#3E2718');
      bgGrad.addColorStop(0.85, '#2D1B10');
      bgGrad.addColorStop(0.95, '#183820');
      bgGrad.addColorStop(1, '#0F2617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, TRACK_TOTAL_WIDTH + 600, viewportH);

      // Dirt Track Arena
      const dirtGrad = ctx.createLinearGradient(0, trackTop, 0, trackTop + activeTrackHeight);
      dirtGrad.addColorStop(0, '#5A3D28');
      dirtGrad.addColorStop(0.5, '#48301F');
      dirtGrad.addColorStop(1, '#3A2618');
      ctx.fillStyle = dirtGrad;
      ctx.fillRect(0, trackTop, TRACK_TOTAL_WIDTH + 400, activeTrackHeight);

      // Track Lanes & Distances Markings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 10]);

      for (let i = 0; i <= Math.max(racers.length, 6); i++) {
        const y = trackTop + i * laneHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(TRACK_TOTAL_WIDTH + 400, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Distance markers (25%, 50%, 75%)
      const markers = [
        { label: '🏁 START', pct: 0.02, color: '#10B981' },
        { label: '25% ⚡', pct: 0.25, color: 'rgba(255,255,255,0.4)' },
        { label: '50% ⚡ النصف', pct: 0.50, color: 'rgba(255,255,255,0.5)' },
        { label: '75% 🔥 الحسم', pct: 0.75, color: '#F59E0B' },
        { label: '🏆 FINISH LINE', pct: 0.96, color: '#EF4444' }
      ];

      markers.forEach(m => {
        const markerX = m.pct * TRACK_TOTAL_WIDTH;
        ctx.strokeStyle = m.color;
        ctx.lineWidth = m.pct > 0.9 ? 12 : 3;
        ctx.beginPath();
        ctx.moveTo(markerX, trackTop);
        ctx.lineTo(markerX, trackTop + activeTrackHeight);
        ctx.stroke();

        ctx.fillStyle = m.color;
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(m.label, markerX, trackTop - 12);
      });

      // Checkerboard finish line pattern
      const finishX = 0.96 * TRACK_TOTAL_WIDTH;
      const checkSize = 12;
      for (let cy = trackTop; cy < trackTop + activeTrackHeight; cy += checkSize) {
        ctx.fillStyle = Math.floor(cy / checkSize) % 2 === 0 ? '#FFFFFF' : '#000000';
        ctx.fillRect(finishX, cy, checkSize, checkSize);
        ctx.fillStyle = Math.floor(cy / checkSize) % 2 === 0 ? '#000000' : '#FFFFFF';
        ctx.fillRect(finishX + checkSize, cy, checkSize, checkSize);
      }

      // 2. Draw Racers (Horses + Avatars + Nameplates + FX)
      racers.forEach((racer) => {
        const racerX = Math.min(
          TRACK_TOTAL_WIDTH * 0.97,
          (racer.progress / 100) * (TRACK_TOTAL_WIDTH * 0.94) + 60
        );
        const racerY = trackTop + racer.lane * laneHeight + laneHeight * 0.5;

        // Draw Dust Trail Particles behind racer
        if (phaseRef.current === 'RACING' || phaseRef.current === 'FINAL_STRETCH') {
          for (let d = 0; d < 3; d++) {
            const dustX = racerX - 35 - Math.random() * 25;
            const dustY = racerY + (Math.random() - 0.5) * 16;
            const dustR = 3 + Math.random() * 5;
            ctx.fillStyle = racer.boostTimer > 0 ? 'rgba(255, 120, 0, 0.45)' : 'rgba(210, 180, 140, 0.35)';
            ctx.beginPath();
            ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw Turbo Flame Glow if boosted
        if (racer.boostTimer > 0) {
          ctx.save();
          const flameGrad = ctx.createRadialGradient(racerX, racerY, 10, racerX, racerY, 45);
          flameGrad.addColorStop(0, 'rgba(255, 150, 0, 0.8)');
          flameGrad.addColorStop(0.6, 'rgba(255, 40, 0, 0.4)');
          flameGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.arc(racerX, racerY, 45, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Dynamic Gallop Animation bobbing
        const gallopOffset = Math.sin(timestamp * 0.015 + racer.lane) * 4;

        // Horse Body & Jockey Silhouette
        ctx.save();
        ctx.translate(racerX, racerY + gallopOffset);

        // Horse Body
        ctx.fillStyle = racer.color;
        ctx.beginPath();
        ctx.ellipse(0, 4, 22, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Horse Head
        ctx.beginPath();
        ctx.ellipse(18, -4, 8, 12, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Horse Legs (animated gallop lines)
        const legPhase = Math.sin(timestamp * 0.02 + racer.lane);
        ctx.strokeStyle = racer.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(16 + legPhase * 8, 22);
        ctx.moveTo(-10, 10);
        ctx.lineTo(-14 - legPhase * 8, 22);
        ctx.stroke();

        // 3. Jockey / Player Circular Avatar
        const avatarRadius = 17;
        const avatarY = -22;

        ctx.save();
        ctx.beginPath();
        ctx.arc(0, avatarY, avatarRadius + 2.5, 0, Math.PI * 2);
        ctx.fillStyle = racer.rank === 1 ? '#FFD700' : racer.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Clip and Draw Avatar Image
        ctx.beginPath();
        ctx.arc(0, avatarY, avatarRadius, 0, Math.PI * 2);
        ctx.clip();

        const img = avatarImages.get(racer.avatarUrl);
        if (img) {
          ctx.drawImage(img, -avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        } else {
          ctx.fillStyle = '#1E293B';
          ctx.fillRect(-avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(racer.displayName.charAt(0), 0, avatarY + 4);
        }
        ctx.restore();

        // Rank Badge
        ctx.fillStyle = racer.rank === 1 ? '#FFD700' : racer.rank === 2 ? '#E2E8F0' : racer.rank === 3 ? '#CD7F32' : 'rgba(0,0,0,0.7)';
        ctx.beginPath();
        ctx.arc(14, avatarY - 8, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = racer.rank <= 3 ? '#000000' : '#FFFFFF';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${racer.rank}`, 14, avatarY - 4);

        // Player Nameplate
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.roundRect(-42, 18, 84, 16, 5);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10.5px sans-serif';
        ctx.textAlign = 'center';
        const truncatedName = racer.displayName.length > 10 ? racer.displayName.substring(0, 9) + '..' : racer.displayName;
        ctx.fillText(truncatedName, 0, 30);

        ctx.restore();
      });

      ctx.restore();

      animationId = requestAnimationFrame(renderLoop);
    };

    animationId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationId);
  }, [racers, cameraX, cameraShake, avatarImages, config, winner, playSound, addRaceEvent, tiktokEngine]);

  // Top 5 Racers Leaderboard
  const topRacers = useMemo(() => {
    return [...racers].sort((a, b) => a.rank - b.rank).slice(0, 5);
  }, [racers]);

  return (
    <div className="w-full flex flex-col items-center bg-[#07090E] rounded-3xl overflow-hidden border border-[#1E2538] shadow-2xl relative select-none">
      {/* ── TOP AAA RACING BROADCAST HEADER ── */}
      <div className="w-full bg-gradient-to-r from-[#0C101A] via-[#111726] to-[#0C101A] px-5 py-3 border-b border-[#1E2538] flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-wide">سباق المشاهدين الكبير</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                GRAND PRIX
              </span>
            </div>
            <p className="text-xs text-slate-400">
              اكتب في الشات <span className="text-amber-400 font-bold">«العب»</span> أو <span className="text-amber-400 font-bold">«1»</span> للمشاركة فوراً في السباق!
            </p>
          </div>
        </div>

        {/* Center Round / Live Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>LIVE RACETRACK</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold font-mono">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{racers.length} متسابق</span>
          </div>
        </div>

        {/* Right Host Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            title="الإعدادات والتحكم"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── MAIN INTERACTIVE RACETRACK CANVAS AREA ── */}
      <div className="w-full relative h-[480px] sm:h-[530px] bg-[#0A0D14] overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={1280}
          height={520}
          className="w-full h-full object-cover block"
        />

        {/* ── DRAMATIC OVERLAYS BY PHASE ── */}

        {/* 1. LOBBY WAITING OVERLAY */}
        {phase === 'LOBBY' && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center z-30 p-6 pointer-events-none">
            <div className="p-6 rounded-3xl bg-slate-900/95 border border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center max-w-md w-full pointer-events-auto">
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2 inline-block font-mono">
                REGISTRATION OPEN
              </span>
              <h3 className="text-2xl font-black text-white mb-1">تسجيل المشاهدين مفتوح!</h3>
              <p className="text-xs text-slate-300 mb-4">
                اكتب في تعليقات البث: <span className="text-amber-400 font-extrabold text-sm">العب</span> أو <span className="text-amber-400 font-extrabold text-sm">1</span> للنزول بالخيل
              </p>

              {/* Countdown Progress Ring */}
              <div className="flex items-center justify-center gap-3 my-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-amber-400 font-mono">{timeRemainingSeconds}</span>
                  <span className="text-[9px] text-slate-400 font-bold">ثانية</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">المتسابقون الجاهزون: {racers.length}</p>
                  <p className="text-xs text-slate-400">سيبدأ السباق تلقائياً فور انتهاء الوقت</p>
                </div>
              </div>

              {/* Quick Host Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => addDemoRacers(6)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>إضافة متسابقين (+6)</span>
                </button>
                <button
                  onClick={startCountdown}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-lg transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>انطلاق فوري</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. DRAMATIC COUNTDOWN OVERLAY */}
        {phase === 'COUNTDOWN' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30 pointer-events-none">
            <div className="text-center animate-bounce">
              <span className="text-8xl sm:text-9xl font-black text-amber-400 font-mono tracking-tighter drop-shadow-[0_0_35px_rgba(245,158,11,0.8)]">
                {timeRemainingSeconds > 0 ? timeRemainingSeconds : 'GO! 🏇'}
              </span>
              <p className="text-xl font-black text-white mt-4 tracking-widest uppercase font-mono">
                {timeRemainingSeconds > 0 ? 'استعدوا للانطلاق..' : 'انطلقوا بأقصى سرعة!'}
              </p>
            </div>
          </div>
        )}

        {/* 3. WINNER CELEBRATION MODAL */}
        {phase === 'WINNER' && winner && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center z-40 p-4">
            <div className="p-7 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-500 shadow-[0_0_60px_rgba(245,158,11,0.5)] text-center max-w-sm w-full animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 shadow-[0_0_30px_rgba(245,158,11,0.8)] mb-3 relative">
                <img
                  src={winner.avatarUrl}
                  alt={winner.displayName}
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute -top-3 -right-2 bg-amber-400 text-black p-1 rounded-full shadow-lg">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono uppercase inline-block mb-1">
                CHAMPION OF THE RACE
              </span>
              <h2 className="text-2xl font-black text-white mb-1">{winner.displayName}</h2>
              <p className="text-xs text-slate-400 mb-4">{winner.username}</p>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-around mb-5">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">النقاط المكتسبة</p>
                  <p className="text-lg font-black text-amber-400 font-mono">+500 PTS</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">المركز النهائي</p>
                  <p className="text-lg font-black text-white font-mono">1st 🥇</p>
                </div>
              </div>

              <button
                onClick={resetRace}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                سباق جديد 🏇
              </button>
            </div>
          </div>
        )}

        {/* ── LIVE BROADCAST HUD OVERLAYS ── */}

        {/* Left Live Leaderboard Drawer */}
        <div className="absolute top-4 left-4 z-20 w-48 sm:w-56 bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
            <span className="text-[11px] font-black text-amber-400 flex items-center gap-1 font-mono">
              <Trophy className="w-3.5 h-3.5" />
              TOP 5 LEADERBOARD
            </span>
            <span className="text-[10px] text-slate-400 font-bold font-mono">LIVE</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {topRacers.map((r, idx) => (
              <div
                key={r.id}
                className={`flex items-center justify-between p-1.5 rounded-xl border text-xs transition-all ${
                  idx === 0
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                    : 'bg-white/5 border-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-black text-[10px] ${
                    idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="truncate font-bold text-[11px] max-w-[85px] sm:max-w-[105px]">
                    {r.displayName}
                  </span>
                </div>
                <span className="font-mono font-black text-[11px] text-cyan-300">
                  {Math.floor(r.progress)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Live Race Event Ticker */}
        <div className="absolute bottom-3 right-4 left-4 z-20 flex items-center justify-between bg-black/70 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black font-mono shrink-0">
              RACE FEED
            </span>
            <p className="text-xs text-white font-bold truncate">
              {raceEvents[0]?.text || 'المتسابقون يتأهبون على خط الانطلاق..'}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0 text-xs font-mono font-bold text-slate-400">
            <span>TRACK: {config.trackLengthMeters}M</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
      </div>

      {/* ── HOST CONTROLS DRAWER / MODAL ── */}
      {isSettingsOpen && (
        <div className="w-full bg-[#0C101A] border-t border-[#1E2538] p-4 flex flex-wrap items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={startCountdown}
              disabled={phase !== 'LOBBY'}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs disabled:opacity-40 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>بدء السباق</span>
            </button>

            <button
              onClick={() => addDemoRacers(6)}
              disabled={phase !== 'LOBBY'}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs disabled:opacity-40 flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
              <span>إضافة بوتات (+6)</span>
            </button>

            <button
              onClick={resetRace}
              className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط السباق</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={config.chatBoostEnabled}
                onChange={(e) => setConfig(prev => ({ ...prev, chatBoostEnabled: e.target.checked }))}
                className="rounded accent-amber-500"
              />
              <span>تفعيل توربو الشات («اسرع»)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={config.comebackMechanicEnabled}
                onChange={(e) => setConfig(prev => ({ ...prev, comebackMechanicEnabled: e.target.checked }))}
                className="rounded accent-amber-500"
              />
              <span>ميكانيكا العودة (Comeback)</span>
            </label>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-slate-400 hover:text-white text-xs underline"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
