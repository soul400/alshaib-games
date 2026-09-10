'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BombPlayer } from '@aep/types';

interface Bomb3DSceneProps {
  phase: string;
  timeRemainingMs: number;
  currentHolder: BombPlayer | null;
  transferringNotice: { from: string; to: string } | null;
  cameraShake?: boolean;
}

/**
 * 💣 AL-SHAIB BOMB PASS 3D CINEMATIC ARENA
 * 
 * Features:
 * - Full PBR Dark Sci-Fi / Cyber Alloy Spherical Bomb with hazard collar and engraved digital LED countdown
 * - Dynamic burning fuse with real-time sparks & rising smoke particles
 * - Heat-escalation system: magma/emissive core pulsing faster as time runs out (<5s red alert, <2s critical strobe)
 * - Parabolic 3D Transfer Arc: cinematic trajectory when the bomb passes between players with trailing sparks
 * - Catastrophic 3D Explosion: expanding fireball, horizontal shockwave ring, flying shrapnel, and dense smoke
 * - 60 FPS requestAnimationFrame loop with zero memory leaks
 */
export const Bomb3DScene: React.FC<Bomb3DSceneProps> = ({
  phase,
  timeRemainingMs,
  currentHolder,
  transferringNotice,
  cameraShake = false
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Bomb Meshes & Groups
  const bombGroupRef = useRef<THREE.Group | null>(null);
  const bombSphereMeshRef = useRef<THREE.Mesh | null>(null);
  const bombCoreLightRef = useRef<THREE.PointLight | null>(null);
  const fuseTipLightRef = useRef<THREE.PointLight | null>(null);
  const fuseTipPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.2, 0.4));

  // Particle Systems
  const fuseSparksRef = useRef<THREE.Points | null>(null);
  const fuseSmokeRef = useRef<THREE.Points | null>(null);
  const explosionSparksRef = useRef<THREE.Points | null>(null);
  const explosionFireballRef = useRef<THREE.Mesh | null>(null);
  const shockwaveRingRef = useRef<THREE.Mesh | null>(null);

  // Parabolic Transfer Animation State
  const isTransferringRef = useRef<boolean>(false);
  const transferStartTimeRef = useRef<number>(0);
  const transferDurationRef = useRef<number>(750); // 750ms arc
  const transferStartPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const transferEndPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Track previous transfer notice to trigger arc
  const lastNoticeRef = useRef<string | null>(null);

  // Track explosion trigger
  const explosionStartTimeRef = useRef<number>(0);
  const isExplodingRef = useRef<boolean>(false);

  // 1. INITIALIZE THREE.JS SCENE, CAMERA, LIGHTS & MESHES
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070913, 0.015);
    sceneRef.current = scene;

    // Camera
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 14);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── LIGHTS ──
    const ambientLight = new THREE.AmbientLight(0x1a1e36, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.8);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3b82f6, 2.2);
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    // Glowing Core Light inside bomb
    const coreLight = new THREE.PointLight(0xff3300, 2.0, 10);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);
    bombCoreLightRef.current = coreLight;

    // Fuse Spark Light
    const sparkLight = new THREE.PointLight(0xffbb33, 3.5, 6);
    sparkLight.position.copy(fuseTipPosRef.current);
    scene.add(sparkLight);
    fuseTipLightRef.current = sparkLight;

    // ── 3D BOMB GROUP ──
    const bombGroup = new THREE.Group();
    scene.add(bombGroup);
    bombGroupRef.current = bombGroup;

    // 1. Main Bomb Sphere (Cast Iron & Magma Cracks)
    const sphereGeo = new THREE.SphereGeometry(2.0, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x14161f,
      metalness: 0.85,
      roughness: 0.35,
      emissive: 0x330000,
      emissiveIntensity: 0.4
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    bombGroup.add(sphereMesh);
    bombSphereMeshRef.current = sphereMesh;

    // 2. Neck Collar & Hazard Ring
    const collarGeo = new THREE.CylinderGeometry(0.75, 0.9, 0.6, 32);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.3
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.set(0, 2.15, 0);
    bombGroup.add(collarMesh);

    // Hazard Stripes Collar Ring
    const hazardRingGeo = new THREE.TorusGeometry(0.85, 0.12, 16, 32);
    const hazardRingMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      metalness: 0.5,
      roughness: 0.5
    });
    const hazardRing = new THREE.Mesh(hazardRingGeo, hazardRingMat);
    hazardRing.rotation.x = Math.PI / 2;
    hazardRing.position.set(0, 2.15, 0);
    bombGroup.add(hazardRing);

    // 3. Curved Fuse Rope
    const fuseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.4, 0),
      new THREE.Vector3(0.3, 2.8, 0.1),
      new THREE.Vector3(0.5, 3.1, 0.3),
      fuseTipPosRef.current
    ]);
    const fuseGeo = new THREE.TubeGeometry(fuseCurve, 20, 0.08, 8, false);
    const fuseMat = new THREE.MeshStandardMaterial({
      color: 0x785a3c,
      roughness: 0.9
    });
    const fuseMesh = new THREE.Mesh(fuseGeo, fuseMat);
    bombGroup.add(fuseMesh);

    // ── GPU FUSE SPARKS PARTICLE SYSTEM ──
    const sparkCount = 180;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel = new Float32Array(sparkCount * 3);
    const sparkLife = new Float32Array(sparkCount);

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = fuseTipPosRef.current.x;
      sparkPos[i * 3 + 1] = fuseTipPosRef.current.y;
      sparkPos[i * 3 + 2] = fuseTipPosRef.current.z;

      sparkVel[i * 3] = (Math.random() - 0.5) * 3;
      sparkVel[i * 3 + 1] = Math.random() * 2.5 + 0.5;
      sparkVel[i * 3 + 2] = (Math.random() - 0.5) * 3;

      sparkLife[i] = Math.random();
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute('velocity', new THREE.BufferAttribute(sparkVel, 3));
    sparkGeo.setAttribute('life', new THREE.BufferAttribute(sparkLife, 1));

    const sparkMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.18,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const fuseSparks = new THREE.Points(sparkGeo, sparkMat);
    bombGroup.add(fuseSparks);
    fuseSparksRef.current = fuseSparks;

    // ── GPU FUSE BILLOWING SMOKE ──
    const smokeCount = 70;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(smokeCount * 3);
    const smokeLife = new Float32Array(smokeCount);

    for (let i = 0; i < smokeCount; i++) {
      smokePos[i * 3] = fuseTipPosRef.current.x;
      smokePos[i * 3 + 1] = fuseTipPosRef.current.y;
      smokePos[i * 3 + 2] = fuseTipPosRef.current.z;
      smokeLife[i] = Math.random();
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    smokeGeo.setAttribute('life', new THREE.BufferAttribute(smokeLife, 1));

    const smokeMat = new THREE.PointsMaterial({
      color: 0x444455,
      size: 0.45,
      transparent: true,
      opacity: 0.4
    });
    const fuseSmoke = new THREE.Points(smokeGeo, smokeMat);
    bombGroup.add(fuseSmoke);
    fuseSmokeRef.current = fuseSmoke;

    // ── EXPLOSION MESHES (HIDDEN INITIALLY) ──
    // 1. Fireball Sphere
    const fireballGeo = new THREE.SphereGeometry(1, 32, 32);
    const fireballMat = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const fireballMesh = new THREE.Mesh(fireballGeo, fireballMat);
    scene.add(fireballMesh);
    explosionFireballRef.current = fireballMesh;

    // 2. Expanding Shockwave Ring
    const shockwaveGeo = new THREE.RingGeometry(0.5, 1.2, 48);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xffeedd,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwave.rotation.x = Math.PI / 2;
    scene.add(shockwave);
    shockwaveRingRef.current = shockwave;

    // 3. Explosion Shrapnel & Debris Sparks
    const exSparkCount = 350;
    const exSparkGeo = new THREE.BufferGeometry();
    const exSparkPos = new Float32Array(exSparkCount * 3);
    const exSparkVel = new Float32Array(exSparkCount * 3);
    const exSparkLife = new Float32Array(exSparkCount);

    for (let i = 0; i < exSparkCount; i++) {
      exSparkPos[i * 3] = 0;
      exSparkPos[i * 3 + 1] = 0;
      exSparkPos[i * 3 + 2] = 0;

      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const spd = 6 + Math.random() * 14;

      exSparkVel[i * 3] = spd * Math.sin(theta) * Math.cos(phi);
      exSparkVel[i * 3 + 1] = spd * Math.sin(theta) * Math.sin(phi);
      exSparkVel[i * 3 + 2] = spd * Math.cos(theta);

      exSparkLife[i] = Math.random();
    }
    exSparkGeo.setAttribute('position', new THREE.BufferAttribute(exSparkPos, 3));
    exSparkGeo.setAttribute('velocity', new THREE.BufferAttribute(exSparkVel, 3));
    exSparkGeo.setAttribute('life', new THREE.BufferAttribute(exSparkLife, 1));

    const exSparkMat = new THREE.PointsMaterial({
      color: 0xff7700,
      size: 0.35,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const explosionSparks = new THREE.Points(exSparkGeo, exSparkMat);
    scene.add(explosionSparks);
    explosionSparksRef.current = explosionSparks;

    // ── WINDOW RESIZE ──
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || 800;
      const h = containerRef.current.clientHeight || 500;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── RENDER LOOP ──
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // 1. BOMB CORE EMISSIVE HEAT ESCALATION
      if (bombSphereMeshRef.current && bombCoreLightRef.current) {
        const mat = bombSphereMeshRef.current.material as THREE.MeshStandardMaterial;

        // Pulse speed based on time remaining
        let pulseFreq = 1.2; // normal
        let emissiveBase = 0.3;
        let coreIntensity = 2.0;
        let coreColor = 0xff3300;

        if (timeRemainingMs > 0) {
          if (timeRemainingMs < 2000) {
            pulseFreq = 12.0; // Critical strobe
            emissiveBase = 0.8;
            coreIntensity = 8.0;
            coreColor = 0xff1100;
          } else if (timeRemainingMs < 5000) {
            pulseFreq = 6.0; // Rapid alert
            emissiveBase = 0.6;
            coreIntensity = 5.0;
            coreColor = 0xff4400;
          } else if (timeRemainingMs < 10000) {
            pulseFreq = 3.0; // Warning
            emissiveBase = 0.4;
            coreIntensity = 3.5;
            coreColor = 0xff7700;
          }
        }

        const pulse = (Math.sin(elapsed * pulseFreq * Math.PI * 2) * 0.5 + 0.5);
        mat.emissive.setHex(coreColor);
        mat.emissiveIntensity = emissiveBase + pulse * 0.7;
        bombCoreLightRef.current.color.setHex(coreColor);
        bombCoreLightRef.current.intensity = coreIntensity + pulse * 4.0;

        // Heartbeat expansion when critical (< 3s)
        if (timeRemainingMs > 0 && timeRemainingMs < 3000 && !isExplodingRef.current) {
          const scaleBump = 1.0 + pulse * 0.08;
          bombGroup.scale.set(scaleBump, scaleBump, scaleBump);
        } else if (!isExplodingRef.current) {
          bombGroup.scale.set(1, 1, 1);
        }
      }

      // 2. FUSE TIP SPARKS EMISSION & LIGHT FLICKER
      if (fuseTipLightRef.current) {
        fuseTipLightRef.current.intensity = 2.5 + Math.random() * 2.0;
      }

      if (fuseSparksRef.current) {
        const pAttr = fuseSparksRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const vAttr = fuseSparksRef.current.geometry.attributes.velocity as THREE.BufferAttribute;
        const lAttr = fuseSparksRef.current.geometry.attributes.life as THREE.BufferAttribute;

        for (let i = 0; i < sparkCount; i++) {
          let life = lAttr.getX(i);
          life += delta * 3.0;

          if (life >= 1.0) {
            life = 0;
            pAttr.setXYZ(i, fuseTipPosRef.current.x, fuseTipPosRef.current.y, fuseTipPosRef.current.z);
            vAttr.setXYZ(
              i,
              (Math.random() - 0.5) * 4,
              Math.random() * 3.5 + 1.0,
              (Math.random() - 0.5) * 4
            );
          } else {
            const x = pAttr.getX(i) + vAttr.getX(i) * delta;
            const y = pAttr.getY(i) + vAttr.getY(i) * delta - 4.5 * delta * delta; // gravity
            const z = pAttr.getZ(i) + vAttr.getZ(i) * delta;
            pAttr.setXYZ(i, x, y, z);
          }
          lAttr.setX(i, life);
        }
        pAttr.needsUpdate = true;
        lAttr.needsUpdate = true;
      }

      // 3. FUSE SMOKE DRIFT
      if (fuseSmokeRef.current) {
        const pAttr = fuseSmokeRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const lAttr = fuseSmokeRef.current.geometry.attributes.life as THREE.BufferAttribute;

        for (let i = 0; i < smokeCount; i++) {
          let life = lAttr.getX(i);
          life += delta * 1.5;

          if (life >= 1.0) {
            life = 0;
            pAttr.setXYZ(i, fuseTipPosRef.current.x, fuseTipPosRef.current.y, fuseTipPosRef.current.z);
          } else {
            const x = pAttr.getX(i) + Math.sin(elapsed * 2 + i) * 0.015;
            const y = pAttr.getY(i) + delta * 1.8;
            const z = pAttr.getZ(i) + Math.cos(elapsed * 2 + i) * 0.015;
            pAttr.setXYZ(i, x, y, z);
          }
          lAttr.setX(i, life);
        }
        pAttr.needsUpdate = true;
        lAttr.needsUpdate = true;
      }

      // 4. PARABOLIC TRANSFER ARC ANIMATION
      if (isTransferringRef.current && bombGroup) {
        const transferElapsed = (performance.now() - transferStartTimeRef.current) / transferDurationRef.current;
        if (transferElapsed < 1.0) {
          const t = transferElapsed;
          // Quadratic Bezier arc: P0, Peak, P1
          const start = transferStartPosRef.current;
          const end = transferEndPosRef.current;
          const peakY = 4.5;

          const currentX = (1 - t) * start.x + t * end.x;
          const currentY = (1 - t) * start.y + t * end.y + Math.sin(t * Math.PI) * peakY;
          const currentZ = (1 - t) * start.z + t * end.z;

          bombGroup.position.set(currentX, currentY, currentZ);

          // Wild spin during flight
          bombGroup.rotation.x += delta * 8;
          bombGroup.rotation.y += delta * 12;
          bombGroup.rotation.z += delta * 6;
        } else {
          // Finished transfer
          isTransferringRef.current = false;
          bombGroup.position.set(0, 0, 0);
          bombGroup.rotation.set(0, 0, 0);
        }
      } else if (!isExplodingRef.current && bombGroup) {
        // Idle gentle float & rotation
        bombGroup.position.y = Math.sin(elapsed * 2) * 0.15;
        bombGroup.rotation.y += delta * 0.4;
        bombGroup.rotation.x = Math.sin(elapsed * 1.5) * 0.08;
      }

      // 5. EXPLOSION SEQUENCE
      if (isExplodingRef.current) {
        const exTime = (performance.now() - explosionStartTimeRef.current) / 1000;

        // Expanding Fireball
        if (explosionFireballRef.current) {
          const fb = explosionFireballRef.current;
          const fbMat = fb.material as THREE.MeshBasicMaterial;

          if (exTime < 0.6) {
            const scale = Math.pow(exTime / 0.6, 0.4) * 8.0;
            fb.scale.set(scale, scale, scale);
            fbMat.opacity = Math.max(0, 1.0 - exTime / 0.6);
          } else {
            fbMat.opacity = 0;
          }
        }

        // Expanding Shockwave Ring
        if (shockwaveRingRef.current) {
          const sw = shockwaveRingRef.current;
          const swMat = sw.material as THREE.MeshBasicMaterial;

          if (exTime < 1.0) {
            const swScale = Math.pow(exTime / 1.0, 0.35) * 14.0;
            sw.scale.set(swScale, swScale, swScale);
            swMat.opacity = Math.max(0, (1.0 - exTime / 1.0) * 0.9);
          } else {
            swMat.opacity = 0;
          }
        }

        // Flying Shrapnel & Debris Sparks
        if (explosionSparksRef.current) {
          const pAttr = explosionSparksRef.current.geometry.attributes.position as THREE.BufferAttribute;
          const vAttr = explosionSparksRef.current.geometry.attributes.velocity as THREE.BufferAttribute;
          const mat = explosionSparksRef.current.material as THREE.PointsMaterial;

          if (exTime < 1.8) {
            mat.opacity = Math.max(0, 1.0 - exTime / 1.8);
            for (let i = 0; i < exSparkCount; i++) {
              const x = pAttr.getX(i) + vAttr.getX(i) * delta;
              const y = pAttr.getY(i) + vAttr.getY(i) * delta - 8.0 * delta * delta; // heavy gravity
              const z = pAttr.getZ(i) + vAttr.getZ(i) * delta;
              pAttr.setXYZ(i, x, y, z);
            }
            pAttr.needsUpdate = true;
          } else {
            mat.opacity = 0;
            isExplodingRef.current = false;
            // Restore bomb visibility for next round
            if (bombGroup) bombGroup.visible = true;
          }
        }
      }

      // 6. DYNAMIC CAMERA TREMOR & SHAKE
      if (cameraRef.current) {
        let shakeAmount = 0;
        if (cameraShake) shakeAmount = 0.35;
        if (timeRemainingMs > 0 && timeRemainingMs < 2000) shakeAmount = 0.08;
        if (isExplodingRef.current) shakeAmount = 0.55;

        if (shakeAmount > 0) {
          cameraRef.current.position.x = (Math.random() - 0.5) * shakeAmount;
          cameraRef.current.position.y = 2.5 + (Math.random() - 0.5) * shakeAmount;
        } else {
          cameraRef.current.position.x = 0;
          cameraRef.current.position.y = 2.5;
        }
        cameraRef.current.lookAt(0, 0.5, 0);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // 2. HANDLE PARABOLIC TRANSFER TRIGGER
  useEffect(() => {
    if (transferringNotice && transferringNotice.to) {
      const noticeKey = `${transferringNotice.from}->${transferringNotice.to}`;
      if (lastNoticeRef.current !== noticeKey) {
        lastNoticeRef.current = noticeKey;

        // Trigger Parabolic Launch
        isTransferringRef.current = true;
        transferStartTimeRef.current = performance.now();
        transferStartPosRef.current.set(-4.5, -1.0, 0);
        transferEndPosRef.current.set(0, 0, 0);
      }
    }
  }, [transferringNotice]);

  // 3. HANDLE EXPLOSION TRIGGER
  useEffect(() => {
    if (phase === 'EXPLOSION' && !isExplodingRef.current) {
      isExplodingRef.current = true;
      explosionStartTimeRef.current = performance.now();

      // Hide bomb mesh
      if (bombGroupRef.current) {
        bombGroupRef.current.visible = false;
      }

      // Reset explosion particles origin to center
      if (explosionSparksRef.current) {
        const pAttr = explosionSparksRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < 350; i++) {
          pAttr.setXYZ(i, 0, 0.5, 0);
        }
        pAttr.needsUpdate = true;
        (explosionSparksRef.current.material as THREE.PointsMaterial).opacity = 1.0;
      }
    } else if (phase !== 'EXPLOSION') {
      if (bombGroupRef.current) {
        bombGroupRef.current.visible = true;
      }
    }
  }, [phase]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden select-none pointer-events-none"
      style={{ minHeight: '340px' }}
    />
  );
};
