'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { HunterRouletteParticipant } from '@aep/types';

interface RouletteWheelCanvasProps {
  participants: HunterRouletteParticipant[];
  targetWinner: HunterRouletteParticipant | null;
  isSpinning: boolean;
  onSpinComplete?: (winner: HunterRouletteParticipant) => void;
  onPinClick?: () => void;
  size?: number; // diameter in pixels (e.g. 640)
  className?: string;
}

// Luxury Casino & Neon Jewel Tones
const SLICE_PALETTES = [
  { bg: '#581C87', accent: '#A855F7', text: '#F3E8FF' }, // Royal Amethyst
  { bg: '#064E3B', accent: '#10B981', text: '#D1FAE5' }, // Emerald Crown
  { bg: '#78350F', accent: '#F59E0B', text: '#FEF3C7' }, // Imperial Amber
  { bg: '#831843', accent: '#EC4899', text: '#FCE7F3' }, // Ruby Rose
  { bg: '#1E3A8A', accent: '#3B82F6', text: '#DBEAFE' }, // Sapphire Blue
  { bg: '#134E4A', accent: '#14B8A6', text: '#CCFBF1' }, // Deep Teal
  { bg: '#701A75', accent: '#D946EF', text: '#FAE8FF' }, // Neon Fuchsia
  { bg: '#991B1B', accent: '#EF4444', text: '#FEE2E2' }, // Crimson Fire
  { bg: '#312E81', accent: '#6366F1', text: '#E0E7FF' }, // Midnight Indigo
  { bg: '#713F12', accent: '#EAB308', text: '#FEF9C3' }, // Polished Gold
];

export const RouletteWheelCanvas: React.FC<RouletteWheelCanvasProps> = ({
  participants,
  targetWinner,
  isSpinning,
  onSpinComplete,
  onPinClick,
  size = 640,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const avatarImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Physics animation state refs (avoid React re-render overhead)
  const currentAngleRef = useRef<number>(0); // in radians
  const angularVelocityRef = useRef<number>(0);
  const spinStartTimeRef = useRef<number>(0);
  const spinDurationRef = useRef<number>(5500); // 5.5 seconds spin lifecycle
  const startAngleRef = useRef<number>(0);
  const totalTargetRotationRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const animFrameIdRef = useRef<number | null>(null);

  // Flipper Pin Elastic Physics
  const pinAngleRef = useRef<number>(0); // deflection angle in radians
  const pinVelocityRef = useRef<number>(0);
  const lastPegIndexRef = useRef<number>(-1);

  // Particles for final lock & sparks
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    alpha: number;
    life: number;
    maxLife: number;
  }>>([]);

  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [pulseGlow, setPulseGlow] = useState<boolean>(false);

  // Preload avatars into memory
  useEffect(() => {
    participants.forEach((p) => {
      if (p.avatarUrl && !avatarImagesRef.current.has(p.id)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = p.avatarUrl;
        img.onload = () => {
          avatarImagesRef.current.set(p.id, img);
        };
      }
    });
  }, [participants]);

  // Compute exact target stopping angle for the selected winner
  const computeTargetAngle = useCallback((winner: HunterRouletteParticipant): number => {
    const N = participants.length;
    if (N === 0) return 0;
    const winnerIndex = participants.findIndex(p => p.id === winner.id);
    if (winnerIndex === -1) return 0;

    const sliceAngle = (2 * Math.PI) / N;
    // Pin is at the top (-PI / 2 radians, or 270 degrees)
    // The slice is centered at winnerIndex * sliceAngle + sliceAngle / 2
    const targetSliceCenter = winnerIndex * sliceAngle + sliceAngle / 2;
    const pinPositionAngle = (3 * Math.PI) / 2; // top

    // We want: (wheelAngle + targetSliceCenter) % (2*PI) === pinPositionAngle
    // So targetFinalAngle = pinPositionAngle - targetSliceCenter
    let offset = (pinPositionAngle - targetSliceCenter) % (2 * Math.PI);
    if (offset < 0) offset += 2 * Math.PI;

    // Add 6 to 9 full grand rotations (spins) for cinematic high speed
    const grandSpins = Math.floor(7 + Math.random() * 2) * 2 * Math.PI;
    return currentAngleRef.current + grandSpins + (offset - (currentAngleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  }, [participants]);

  // Handle spin trigger
  useEffect(() => {
    if (isSpinning && targetWinner && !isAnimatingRef.current) {
      setHasCompleted(false);
      setPulseGlow(false);
      isAnimatingRef.current = true;
      spinStartTimeRef.current = performance.now();
      startAngleRef.current = currentAngleRef.current;
      totalTargetRotationRef.current = computeTargetAngle(targetWinner);
      lastPegIndexRef.current = -1;
    }
  }, [isSpinning, targetWinner, computeTargetAngle]);

  // Spawn celebration particles
  const spawnWinParticles = (centerX: number, centerY: number, radius: number) => {
    const colors = ['#F59E0B', '#FCD34D', '#EF4444', '#8B5CF6', '#10B981', '#FFFFFF', '#D97706'];
    const newParticles = [];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      newParticles.push({
        x: centerX + Math.cos(angle) * (radius * 0.9),
        y: centerY + Math.sin(angle) * (radius * 0.9),
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed - (2 + Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 5,
        alpha: 1,
        life: 0,
        maxLife: 50 + Math.random() * 40
      });
    }
    particlesRef.current = newParticles;
  };

  // ─────────────────────────────────────────────────────────────
  // MAIN 60 FPS RENDER & PHYSICS LOOP
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = (time: number) => {
      if (!running) return;

      const N = participants.length;
      const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
      const displayWidth = size;
      const displayHeight = size;

      // Ensure canvas resolution matches high-DPI screens
      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const centerX = displayWidth / 2;
      const centerY = displayHeight / 2;
      const outerRadius = displayWidth * 0.46;
      const wheelRadius = displayWidth * 0.40;

      // ── 1. UPDATE PHYSICS & EASING ──
      if (isAnimatingRef.current) {
        const elapsed = time - spinStartTimeRef.current;
        const duration = spinDurationRef.current;

        if (elapsed < duration) {
          const t = Math.min(1, elapsed / duration);

          // Custom Multi-Stage Easing:
          // 0.0 - 0.15: Smooth Acceleration (ease-in quad)
          // 0.15 - 0.70: High-speed rotation
          // 0.70 - 0.96: Exponential drag deceleration
          // 0.96 - 1.00: Micro-bounce & elastic settle
          let progress = 0;
          if (t < 0.15) {
            // Acceleration
            const p = t / 0.15;
            progress = (p * p) * 0.18;
          } else if (t < 0.96) {
            // Deceleration curve (cubic-bezier-like smooth stop)
            const p = (t - 0.15) / 0.81;
            const easeOut = 1 - Math.pow(1 - p, 3.8);
            progress = 0.18 + easeOut * 0.82;
          } else {
            // Micro-bounce at final stop
            const p = (t - 0.96) / 0.04;
            const bounce = Math.sin(p * Math.PI) * 0.003;
            progress = 1.0 - bounce;
          }

          const targetDistance = totalTargetRotationRef.current - startAngleRef.current;
          currentAngleRef.current = startAngleRef.current + targetDistance * progress;

          // Compute angular velocity for pin clicks & motion blur
          angularVelocityRef.current = (targetDistance * (1 - t)) * 0.002;
        } else {
          // Completed! Lock in target angle exactly
          currentAngleRef.current = totalTargetRotationRef.current;
          angularVelocityRef.current = 0;
          isAnimatingRef.current = false;
          setHasCompleted(true);
          setPulseGlow(true);
          spawnWinParticles(centerX, centerY, wheelRadius);

          if (targetWinner && onSpinComplete) {
            onSpinComplete(targetWinner);
          }
        }
      }

      // ── 2. PIN ELASTIC PHYSICS (Flipper Pin Collision with Pegs) ──
      if (N > 0) {
        const sliceAngle = (2 * Math.PI) / N;
        const normalizedAngle = (currentAngleRef.current) % (2 * Math.PI);
        const topAngle = (3 * Math.PI) / 2; // Pin is at 270 deg (top)
        const currentRelativeSlice = Math.floor(((topAngle - normalizedAngle + 4 * Math.PI) % (2 * Math.PI)) / sliceAngle);

        if (currentRelativeSlice !== lastPegIndexRef.current) {
          lastPegIndexRef.current = currentRelativeSlice;
          // Kick the pin forward based on wheel speed
          const kickStrength = Math.min(0.55, Math.max(0.12, angularVelocityRef.current * 0.15));
          pinAngleRef.current = kickStrength;
          if (onPinClick) onPinClick();
        }
      }

      // Spring physics to return pin to center 0
      const springK = 0.35;
      const damping = 0.72;
      const springForce = -springK * pinAngleRef.current;
      pinVelocityRef.current = (pinVelocityRef.current + springForce) * damping;
      pinAngleRef.current += pinVelocityRef.current;

      // ── 3. DRAW LUXURY OUTER METALLIC FRAME & LED PEGS ──
      // Outer shadow & rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0B0D19';
      ctx.shadowColor = pulseGlow ? '#F59E0B' : 'rgba(124, 58, 237, 0.5)';
      ctx.shadowBlur = pulseGlow ? 45 : 25;
      ctx.fill();

      // Metallic Gold / Titanium gradient ring
      const ringGrad = ctx.createLinearGradient(centerX - outerRadius, centerY - outerRadius, centerX + outerRadius, centerY + outerRadius);
      ringGrad.addColorStop(0, '#D6A84F');
      ringGrad.addColorStop(0.25, '#785A28');
      ringGrad.addColorStop(0.5, '#FCE7A2');
      ringGrad.addColorStop(0.75, '#5A431E');
      ringGrad.addColorStop(1, '#D6A84F');

      ctx.lineWidth = outerRadius - wheelRadius;
      ctx.strokeStyle = ringGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, (outerRadius + wheelRadius) / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Peripheral Diamond / LED Studs (36 lights around the rim)
      const numStuds = 36;
      for (let s = 0; s < numStuds; s++) {
        const sAngle = (s * 2 * Math.PI) / numStuds + (isAnimatingRef.current ? time * 0.003 : 0);
        const sX = centerX + Math.cos(sAngle) * ((outerRadius + wheelRadius) / 2);
        const sY = centerY + Math.sin(sAngle) * ((outerRadius + wheelRadius) / 2);

        ctx.beginPath();
        ctx.arc(sX, sY, 3.5, 0, Math.PI * 2);
        const isLit = (s + Math.floor(time * 0.02)) % 3 === 0 || pulseGlow;
        ctx.fillStyle = isLit ? '#FFE28A' : '#45351A';
        ctx.shadowColor = isLit ? '#F59E0B' : 'transparent';
        ctx.shadowBlur = isLit ? 10 : 0;
        ctx.fill();
      }
      ctx.restore();

      // ── 4. DRAW ROTATING WHEEL SLICES & PLAYER CARDS ──
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentAngleRef.current);

      if (N > 0) {
        const sliceAngle = (2 * Math.PI) / N;

        for (let i = 0; i < N; i++) {
          const startA = i * sliceAngle;
          const endA = (i + 1) * sliceAngle;
          const midA = startA + sliceAngle / 2;
          const participant = participants[i];
          const palette = SLICE_PALETTES[i % SLICE_PALETTES.length];
          const isWinnerSlice = targetWinner && targetWinner.id === participant.id && hasCompleted;

          // Sector fill
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, wheelRadius, startA, endA);
          ctx.closePath();

          // Gradient fill along sector
          const sectorGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, wheelRadius);
          if (isWinnerSlice) {
            sectorGrad.addColorStop(0, '#F59E0B');
            sectorGrad.addColorStop(0.7, '#D97706');
            sectorGrad.addColorStop(1, '#FEF3C7');
          } else {
            sectorGrad.addColorStop(0, palette.bg);
            sectorGrad.addColorStop(0.75, palette.bg);
            sectorGrad.addColorStop(1, palette.accent);
          }
          ctx.fillStyle = sectorGrad;
          ctx.fill();

          // Sector borders (dark lines)
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#181A2E';
          ctx.stroke();
          ctx.restore();

          // Draw Content along radial midA
          ctx.save();
          ctx.rotate(midA);

          // Outer slice distance
          const avatarDistance = wheelRadius * 0.72;
          const nameDistance = wheelRadius * 0.44;

          // Circular Avatar Image
          const avatarSize = N > 24 ? 20 : N > 16 ? 26 : N > 10 ? 34 : 42;
          const img = avatarImagesRef.current.get(participant.id);

          ctx.save();
          ctx.beginPath();
          ctx.arc(avatarDistance, 0, avatarSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, avatarDistance - avatarSize / 2, -avatarSize / 2, avatarSize, avatarSize);
          } else {
            // Fallback colorful avatar with initial
            ctx.fillStyle = palette.accent;
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `bold ${Math.max(10, avatarSize * 0.45)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(participant.displayName.charAt(0) || '👤', avatarDistance, 0);
          }
          ctx.restore();

          // Avatar Gold Ring Border
          ctx.beginPath();
          ctx.arc(avatarDistance, 0, avatarSize / 2 + 1, 0, Math.PI * 2);
          ctx.lineWidth = isWinnerSlice ? 3 : 1.5;
          ctx.strokeStyle = isWinnerSlice ? '#FFE28A' : '#FFFFFF';
          ctx.stroke();

          // Participant Display Name
          ctx.save();
          ctx.translate(nameDistance, 0);
          ctx.fillStyle = isWinnerSlice ? '#000000' : '#FFFFFF';
          const fontSize = N > 30 ? 7 : N > 20 ? 9 : N > 12 ? 11 : 13;
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Truncate name cleanly
          let cleanName = participant.displayName;
          if (cleanName.length > (N > 20 ? 8 : 12)) {
            cleanName = cleanName.slice(0, N > 20 ? 7 : 11) + '…';
          }

          // Subtle text shadow for high broadcast legibility
          if (!isWinnerSlice) {
            ctx.shadowColor = 'rgba(0,0,0,0.85)';
            ctx.shadowBlur = 4;
          }
          ctx.fillText(cleanName, 0, 0);
          ctx.restore();

          // Perimeter boundary peg (Gold pin at the slice edge)
          ctx.save();
          ctx.beginPath();
          ctx.arc(wheelRadius, 0, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FCE7A2';
          ctx.fill();
          ctx.restore();

          ctx.restore();
        }
      }

      ctx.restore(); // End Rotating Wheel

      // ── 5. DRAW LUXURY CENTER HUB / CROWN MEDALLION ──
      ctx.save();
      const hubRadius = wheelRadius * 0.22;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubRadius, 0, Math.PI * 2);

      const hubGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, hubRadius);
      hubGrad.addColorStop(0, '#FFE89E');
      hubGrad.addColorStop(0.4, '#D6A84F');
      hubGrad.addColorStop(0.8, '#855E1C');
      hubGrad.addColorStop(1, '#4A340F');
      ctx.fillStyle = hubGrad;
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 20;
      ctx.fill();

      // Inner Hub Ring & Emblem
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubRadius * 0.75, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.max(12, hubRadius * 0.45)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👑', centerX, centerY - 1);
      ctx.restore();

      // ── 6. DRAW REALISTIC SPRING FLIPPER PIN (AT THE TOP) ──
      ctx.save();
      const pinTopX = centerX;
      const pinTopY = centerY - outerRadius - 10;
      const pinLength = outerRadius - wheelRadius + 24;

      ctx.translate(pinTopX, pinTopY);
      ctx.rotate(pinAngleRef.current); // Apply elastic deflection

      // Pointer Needle (Teardrop / Triangle shape)
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.lineTo(0, pinLength);
      ctx.closePath();

      const pinGrad = ctx.createLinearGradient(-10, 0, 10, pinLength);
      pinGrad.addColorStop(0, '#FFE89E');
      pinGrad.addColorStop(0.5, '#F59E0B');
      pinGrad.addColorStop(1, '#B45309');
      ctx.fillStyle = pinGrad;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 15;
      ctx.fill();

      // Needle mounting bolt
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#78350F';
      ctx.stroke();
      ctx.restore();

      // ── 7. DRAW CELEBRATION PARTICLES (POST-LOCK) ──
      if (particlesRef.current.length > 0) {
        ctx.save();
        for (let pIdx = particlesRef.current.length - 1; pIdx >= 0; pIdx--) {
          const p = particlesRef.current[pIdx];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // gravity
          p.life += 1;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          if (p.life >= p.maxLife) {
            particlesRef.current.splice(pIdx, 1);
          }
        }
        ctx.restore();
      }

      ctx.restore(); // Top Restore

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [participants, size, targetWinner, pulseGlow, hasCompleted, onPinClick, onSpinComplete]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <canvas
        ref={canvasRef}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          maxWidth: '100%',
          maxHeight: '100%',
          aspectRatio: '1 / 1'
        }}
        className="transition-transform duration-500 hover:scale-[1.01]"
      />
    </div>
  );
};
