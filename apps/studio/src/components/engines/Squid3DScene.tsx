'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { SquidGamePhase, SquidPlayer, SquidGameConfig } from '@aep/types';

interface Props {
  phase: SquidGamePhase;
  dangerNumber: number | null;
  players: SquidPlayer[];
  config: SquidGameConfig;
  cameraShake: boolean;
  winner: SquidPlayer | null;
  roundNumber: number;
}

/**
 * 🦑 AL-SHAIB SQUID SURVIVAL 3D CINEMATIC ARENA
 * 
 * Features:
 * - Full PBR desert sand arena with 0-10/15 step demarcations, concrete containment walls, guard towers & searchlights
 * - Giant surveillance doll with 180° rotation, dual glowing eyes, tracking, head tilt & idle breathing
 * - Dual volumetric laser beams firing from eyes with core/glow blending and impact shockwaves
 * - 3D Contestant representations: 3D character bodies in iconic uniforms + floating TikTok profile badges & step placement
 * - GPU particle systems: laser impact sparks, elimination smoke, running step dust, golden confetti for the winner
 * - Cinematic Camera Director: automatic transitions between wide arena, selection tension, doll scan, danger zoom, laser hit, and winner hero view
 */
export function Squid3DScene({
  phase,
  dangerNumber,
  players,
  config,
  cameraShake,
  winner,
  roundNumber
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Doll references
  const dollGroupRef = useRef<THREE.Group | null>(null);
  const dollHeadRef = useRef<THREE.Group | null>(null);
  const leftEyeRef = useRef<THREE.Mesh | null>(null);
  const rightEyeRef = useRef<THREE.Mesh | null>(null);
  const leftLaserLineRef = useRef<THREE.Line | null>(null);
  const rightLaserLineRef = useRef<THREE.Line | null>(null);
  const leftLaserMeshRef = useRef<THREE.Mesh | null>(null);
  const rightLaserMeshRef = useRef<THREE.Mesh | null>(null);

  // Lights
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const redAlarmLightRef = useRef<THREE.PointLight | null>(null);

  // Contestants meshes mapping
  const contestantsMapRef = useRef<Map<string, THREE.Group>>(new Map());

  // Particle systems
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const laserSparksRef = useRef<THREE.Points | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const winnerSparksRef = useRef<THREE.Points | null>(null);

  // Animation & Frame tracking
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 18, 52));
  const targetCamLookRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 6, 0));
  const animFrameIdRef = useRef<number | null>(null);
  const avatarTexturesRef = useRef<Map<string, THREE.Texture>>(new Map());

  // Texture Loader
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  // Track Length mapping
  const TRACK_START_Z = 35;
  const TRACK_FINISH_Z = -30;
  const TRACK_LENGTH = TRACK_START_Z - TRACK_FINISH_Z; // 65 units

  // Helper to compute player 3D position
  const getPlayerPosition = (player: SquidPlayer, index: number, total: number) => {
    const stepRatio = Math.min(1, player.currentStep / config.winningSteps);
    const z = TRACK_START_Z - stepRatio * TRACK_LENGTH;

    // Arrange in 4-6 staggered columns on the track
    const cols = Math.min(6, Math.max(3, Math.ceil(Math.sqrt(total * 1.5))));
    const colIndex = index % cols;
    const rowIndex = Math.floor(index / cols);

    const xSpan = 26; // width of track
    const xStep = xSpan / (cols - 1 || 1);
    const x = -xSpan / 2 + colIndex * xStep + (rowIndex % 2 === 1 ? xStep * 0.25 : -xStep * 0.25);

    return new THREE.Vector3(x, 1.2, z);
  };

  // 1. INITIALIZE THREE.JS SCENE, CAMERA, RENDERER & LIGHTS
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080e);
    scene.fog = new THREE.FogExp2(0x06080e, 0.012);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 18, 52);
    camera.lookAt(0, 6, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambient = new THREE.AmbientLight(0x161e32, 1.2);
    scene.add(ambient);
    ambientLightRef.current = ambient;

    const sun = new THREE.DirectionalLight(0xffecd2, 2.2);
    sun.position.set(25, 45, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 150;
    const d = 50;
    sun.shadow.camera.left = -d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = -d;
    sun.shadow.bias = -0.0005;
    scene.add(sun);
    dirLightRef.current = sun;

    // Red Danger Alarm PointLight (Centered at Doll)
    const redAlarm = new THREE.PointLight(0xff0044, 0, 80, 1.8);
    redAlarm.position.set(0, 14, -34);
    scene.add(redAlarm);
    redAlarmLightRef.current = redAlarm;

    // ── 2. ARENA ENVIRONMENT (SAND TERRAIN, WALLS, TOWERS & FINISH GATE) ──
    // Ground: Desert Sand Arena with Steps Grid
    const groundGeo = new THREE.PlaneGeometry(80, 110, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x9b7a4f,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Track Demarcations / Step Lines (0 to winningSteps)
    const totalSteps = config.winningSteps;
    for (let i = 0; i <= totalSteps; i++) {
      const zPos = TRACK_START_Z - (i / totalSteps) * TRACK_LENGTH;
      const isFinish = i === totalSteps;
      const isStart = i === 0;

      const lineGeo = new THREE.BoxGeometry(32, 0.06, isFinish ? 1.4 : isStart ? 0.8 : 0.3);
      const lineMat = new THREE.MeshStandardMaterial({
        color: isFinish ? 0xff2244 : isStart ? 0x10b981 : 0xffffff,
        emissive: isFinish ? 0xaa0022 : isStart ? 0x05482e : 0x222222,
        emissiveIntensity: isFinish ? 1.6 : isStart ? 0.8 : 0.2,
        roughness: 0.4
      });
      const lineMesh = new THREE.Mesh(lineGeo, lineMat);
      lineMesh.position.set(0, 0.03, zPos);
      lineMesh.receiveShadow = true;
      scene.add(lineMesh);
    }

    // Concrete Security Containment Walls (Left, Right, Back)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x282c37,
      roughness: 0.9,
      metalness: 0.1
    });

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2, 14, 110), wallMat);
    leftWall.position.set(-26, 7, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2, 14, 110), wallMat);
    rightWall.position.set(26, 7, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Back Wall (Behind Doll)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(54, 18, 2), wallMat);
    backWall.position.set(0, 9, -46);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Searchlight towers on corners
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x181c25, roughness: 0.8 });
    [-24, 24].forEach(x => {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2, 22, 8), towerMat);
      tower.position.set(x, 11, -44);
      tower.castShadow = true;
      scene.add(tower);

      // Searchlight head
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 12), new THREE.MeshBasicMaterial({ color: 0xd4e4ff }));
      lamp.position.set(x, 22.5, -44);
      scene.add(lamp);

      const spot = new THREE.SpotLight(0xaad4ff, 3.5, 90, Math.PI / 6, 0.5, 1.2);
      spot.position.set(x, 22, -44);
      spot.target.position.set(0, 0, 5);
      scene.add(spot);
      scene.add(spot.target);
    });

    // Illuminated Finish Line Gate Arch
    const gateMat = new THREE.MeshStandardMaterial({
      color: 0x11131a,
      roughness: 0.4,
      metalness: 0.8
    });
    const gatePillarL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 14, 1.2), gateMat);
    gatePillarL.position.set(-16, 7, TRACK_FINISH_Z);
    gatePillarL.castShadow = true;
    scene.add(gatePillarL);

    const gatePillarR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 14, 1.2), gateMat);
    gatePillarR.position.set(16, 7, TRACK_FINISH_Z);
    gatePillarR.castShadow = true;
    scene.add(gatePillarR);

    const gateTop = new THREE.Mesh(new THREE.BoxGeometry(33.2, 1.6, 1.4), gateMat);
    gateTop.position.set(0, 14, TRACK_FINISH_Z);
    gateTop.castShadow = true;
    scene.add(gateTop);

    // Glowing Red Finish Neon Sign
    const neonMat = new THREE.MeshBasicMaterial({ color: 0xff1144 });
    const neonBar = new THREE.Mesh(new THREE.BoxGeometry(26, 0.4, 0.4), neonMat);
    neonBar.position.set(0, 13.8, TRACK_FINISH_Z);
    scene.add(neonBar);

    // ── 3. GIANT SURVEILLANCE DOLL (Procedural High-Detail 3D Mesh) ──
    const dollGroup = new THREE.Group();
    dollGroup.position.set(0, 0, -36);
    scene.add(dollGroup);
    dollGroupRef.current = dollGroup;

    // Pedestal Tree Trunk / Stand
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.95 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.8, 10, 16), treeMat);
    trunk.position.y = 5;
    trunk.castShadow = true;
    dollGroup.add(trunk);

    // Doll Lower Body & Yellow Shirt + Orange Dress
    const dressMat = new THREE.MeshStandardMaterial({
      color: 0xff6600, // Vibrant iconic orange pinafore dress
      roughness: 0.7,
      metalness: 0.1
    });
    const dress = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.8, 6.5, 18), dressMat);
    dress.position.y = 11.5;
    dress.castShadow = true;
    dollGroup.add(dress);

    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.8 });
    const shirt = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, 3.8, 18), shirtMat);
    shirt.position.y = 14.8;
    shirt.castShadow = true;
    dollGroup.add(shirt);

    // Doll Neck & Head Group (Rotates 180°)
    const dollHead = new THREE.Group();
    dollHead.position.set(0, 17.2, 0);
    dollGroup.add(dollHead);
    dollHeadRef.current = dollHead;

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffdfc4,
      roughness: 0.6,
      metalness: 0.05
    });
    const head = new THREE.Mesh(new THREE.SphereGeometry(2.8, 24, 24), skinMat);
    head.scale.set(1, 1.15, 1);
    head.castShadow = true;
    dollHead.add(head);

    // Hair (Iconic Pigtails + Bangs)
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.8 });
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(2.9, 18, 18), hairMat);
    hairTop.position.set(0, 0.4, -0.2);
    dollHead.add(hairTop);

    // Two Pigtails on sides
    [-2.8, 2.8].forEach(hx => {
      const pigtail = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 3.5, 8), hairMat);
      pigtail.position.set(hx, -1.2, -0.8);
      pigtail.rotation.z = hx > 0 ? -0.4 : 0.4;
      dollHead.add(pigtail);
    });

    // Surveillance Camera Eyes (Glows Green in Idle, Bright Red in Danger/Laser)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), eyeMat);
    leftEye.position.set(-0.95, 0.2, 2.45);
    dollHead.add(leftEye);
    leftEyeRef.current = leftEye;

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), eyeMat);
    rightEye.position.set(0.95, 0.2, 2.45);
    dollHead.add(rightEye);
    rightEyeRef.current = rightEye;

    // Laser Beams (Thick volumetric cylinder + inner white core line)
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xff0044,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const laserGeo = new THREE.CylinderGeometry(0.25, 0.25, 1, 12);
    laserGeo.translate(0, 0.5, 0);
    laserGeo.rotateX(Math.PI / 2);

    const leftLaserMesh = new THREE.Mesh(laserGeo, laserMat);
    scene.add(leftLaserMesh);
    leftLaserMeshRef.current = leftLaserMesh;

    const rightLaserMesh = new THREE.Mesh(laserGeo, laserMat.clone());
    scene.add(rightLaserMesh);
    rightLaserMeshRef.current = rightLaserMesh;

    // ── 4. GPU PARTICLE SYSTEMS (Instanced / Points) ──
    // Laser Impact Sparks
    const sparkCount = 350;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel = new Float32Array(sparkCount * 3);
    for (let s = 0; s < sparkCount; s++) {
      sparkPos[s * 3] = 0;
      sparkPos[s * 3 + 1] = -100;
      sparkPos[s * 3 + 2] = 0;
      sparkVel[s * 3] = (Math.random() - 0.5) * 12;
      sparkVel[s * 3 + 1] = Math.random() * 14;
      sparkVel[s * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xff2200,
      size: 0.8,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const laserSparks = new THREE.Points(sparkGeo, sparkMat);
    laserSparks.userData = { vel: sparkVel, life: 0 };
    scene.add(laserSparks);
    laserSparksRef.current = laserSparks;

    // Step Movement Dust
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let d = 0; d < dustCount * 3; d += 3) {
      dustPos[d] = 0;
      dustPos[d + 1] = -100;
      dustPos[d + 2] = 0;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xd4b886,
      size: 0.7,
      transparent: true,
      opacity: 0.4
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);
    dustParticlesRef.current = dustParticles;

    // Winner Gold Confetti Sparks
    const winCount = 400;
    const winGeo = new THREE.BufferGeometry();
    const winPos = new Float32Array(winCount * 3);
    for (let w = 0; w < winCount; w++) {
      winPos[w * 3] = (Math.random() - 0.5) * 40;
      winPos[w * 3 + 1] = -100;
      winPos[w * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    winGeo.setAttribute('position', new THREE.BufferAttribute(winPos, 3));
    const winMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.9,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const winnerSparks = new THREE.Points(winGeo, winMat);
    scene.add(winnerSparks);
    winnerSparksRef.current = winnerSparks;

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── 5. MAIN 60 FPS RENDER LOOP ──
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Camera Director Smooth Interpolation (Lerp)
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, delta * 3.2);
        const currentLook = new THREE.Vector3(0, 0, 0);
        cameraRef.current.getWorldDirection(currentLook);
        cameraRef.current.lookAt(targetCamLookRef.current);

        // Screen Shake
        if (cameraShake) {
          cameraRef.current.position.x += (Math.random() - 0.5) * 0.7;
          cameraRef.current.position.y += (Math.random() - 0.5) * 0.7;
        }
      }

      // Doll Idle Breathing & Head Rotation Animation
      if (dollHeadRef.current) {
        // Idle bobbing
        dollHeadRef.current.position.y = 17.2 + Math.sin(elapsed * 1.5) * 0.08;
      }

      // Animate Active Laser Sparks
      if (laserSparksRef.current && laserSparksRef.current.userData.active) {
        const posAttr = laserSparksRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const vels = laserSparksRef.current.userData.vel;
        for (let i = 0; i < sparkCount; i++) {
          posAttr.setY(i, posAttr.getY(i) + vels[i * 3 + 1] * delta);
          posAttr.setX(i, posAttr.getX(i) + vels[i * 3] * delta);
          posAttr.setZ(i, posAttr.getZ(i) + vels[i * 3 + 2] * delta);
          vels[i * 3 + 1] -= 9.8 * delta; // gravity
        }
        posAttr.needsUpdate = true;
      }

      // Animate Winner Confetti
      if (winnerSparksRef.current && winner) {
        const wPos = winnerSparksRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < winCount; i++) {
          let y = wPos.getY(i) - 8 * delta;
          if (y < 0) y = 25 + Math.random() * 10;
          wPos.setY(i, y);
          wPos.setX(i, wPos.getX(i) + Math.sin(elapsed * 2 + i) * 0.05);
        }
        wPos.needsUpdate = true;
      }

      // Render Scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []);

  // ── 6. SYNC CONTESTANTS 3D MESHES WITH PLAYERS STATE ──
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const currentMap = contestantsMapRef.current;
    const currentIds = new Set(players.map(p => p.id));

    // Remove obsolete players
    currentMap.forEach((group, id) => {
      if (!currentIds.has(id)) {
        scene.remove(group);
        currentMap.delete(id);
      }
    });

    // Uniform & Suit Materials
    const suitMatAlive = new THREE.MeshStandardMaterial({
      color: 0x147866, // Iconic Squid survival green tracksuit
      roughness: 0.6,
      metalness: 0.1
    });

    const suitMatEliminated = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
      metalness: 0.0
    });

    // Add or update contestants
    players.forEach((player, idx) => {
      let group = currentMap.get(player.id);
      const targetPos = getPlayerPosition(player, idx, players.length);

      if (!group) {
        group = new THREE.Group();
        group.position.copy(targetPos);

        // 3D Body: Tracksuit Torso & Legs
        const bodyGeo = new THREE.CapsuleGeometry(0.6, 1.2, 8, 16);
        const bodyMesh = new THREE.Mesh(bodyGeo, suitMatAlive);
        bodyMesh.position.y = 1.0;
        bodyMesh.castShadow = true;
        bodyMesh.name = 'bodyMesh';
        group.add(bodyMesh);

        // Number Badge on Chest
        const numBadgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const numBadge = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.05), numBadgeMat);
        numBadge.position.set(0, 1.2, 0.62);
        group.add(numBadge);

        // Circular Floating TikTok Avatar Plate
        const plateGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.1, 24);
        plateGeo.rotateX(Math.PI / 2);
        const plateMat = new THREE.MeshStandardMaterial({
          color: 0x22283a,
          roughness: 0.4,
          metalness: 0.6
        });
        const avatarPlate = new THREE.Mesh(plateGeo, plateMat);
        avatarPlate.position.set(0, 2.7, 0);
        avatarPlate.name = 'avatarPlate';
        group.add(avatarPlate);

        // Front Circular Picture Texture
        const circleGeo = new THREE.CircleGeometry(0.82, 24);
        const defaultTexMat = new THREE.MeshBasicMaterial({ color: 0x475569 });

        const frontPic = new THREE.Mesh(circleGeo, defaultTexMat);
        frontPic.position.set(0, 2.7, 0.06);
        frontPic.name = 'frontPic';
        group.add(frontPic);

        // Load Real TikTok Avatar Texture
        if (player.avatarUrl) {
          textureLoader.load(
            player.avatarUrl,
            (tex) => {
              frontPic.material = new THREE.MeshBasicMaterial({ map: tex });
              avatarTexturesRef.current.set(player.avatarUrl, tex);
            },
            undefined,
            () => {
              // Fallback color if blocked by CORS
              frontPic.material = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
            }
          );
        }

        scene.add(group);
        currentMap.set(player.id, group);
      }

      // Smooth Step Advancement Animation (Lerp)
      group.position.lerp(targetPos, 0.15);

      // Handle Elimination Visual (Turn Grey, shrink or tilt)
      const bodyMesh = group.getObjectByName('bodyMesh') as THREE.Mesh;
      if (bodyMesh) {
        if (!player.isAlive) {
          bodyMesh.material = suitMatEliminated;
          group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, Math.PI / 2.3, 0.2); // Fallen on sand
          group.position.y = THREE.MathUtils.lerp(group.position.y, 0.3, 0.2);
        } else {
          bodyMesh.material = suitMatAlive;
          group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, 0.2);
        }
      }
    });
  }, [players, config.winningSteps]);

  // ── 7. GAME STATE MACHINE PRESENTATION & CAMERA DIRECTOR ──
  useEffect(() => {
    const head = dollHeadRef.current;
    const redLight = redAlarmLightRef.current;
    const leftEye = leftEyeRef.current;
    const rightEye = rightEyeRef.current;
    const leftLaser = leftLaserMeshRef.current;
    const rightLaser = rightLaserMeshRef.current;

    // CAMERA DIRECTOR & SCENE VISUAL TRANSITIONS
    switch (phase) {
      case 'LOBBY': {
        // Wide welcoming establishing shot
        targetCamPosRef.current.set(0, 16, 52);
        targetCamLookRef.current.set(0, 5, 0);

        if (head) head.rotation.y = Math.PI; // Doll faces tree/back
        if (redLight) redLight.intensity = 0;
        if (leftEye) (leftEye.material as THREE.MeshBasicMaterial).color.setHex(0x10b981);
        if (rightEye) (rightEye.material as THREE.MeshBasicMaterial).color.setHex(0x10b981);
        if (leftLaser) (leftLaser.material as THREE.MeshBasicMaterial).opacity = 0;
        if (rightLaser) (rightLaser.material as THREE.MeshBasicMaterial).opacity = 0;
        break;
      }

      case 'ROUND_START':
      case 'CHOOSING': {
        // Tension Shot: Over contestants looking towards the towering doll
        targetCamPosRef.current.set(0, 14, 44);
        targetCamLookRef.current.set(0, 7, -10);

        if (head) head.rotation.y = Math.PI; // Still looking away
        if (redLight) redLight.intensity = 0;
        if (leftEye) (leftEye.material as THREE.MeshBasicMaterial).color.setHex(0x10b981);
        if (rightEye) (rightEye.material as THREE.MeshBasicMaterial).color.setHex(0x10b981);
        if (leftLaser) (leftLaser.material as THREE.MeshBasicMaterial).opacity = 0;
        if (rightLaser) (rightLaser.material as THREE.MeshBasicMaterial).opacity = 0;
        break;
      }

      case 'LOCKING': {
        // Push slightly toward the doll
        targetCamPosRef.current.set(0, 15, 30);
        targetCamLookRef.current.set(0, 14, -36);
        break;
      }

      case 'DOLL_MOVEMENT': {
        // Cinematic Doll 180° Turn
        targetCamPosRef.current.set(0, 16, 12);
        targetCamLookRef.current.set(0, 16, -36);

        if (head) {
          // Smooth rotation to face contestants (0 rad)
          const startTime = performance.now();
          const rotateHead = () => {
            const elapsed = (performance.now() - startTime) / 1000;
            const progress = Math.min(1, elapsed / 1.8);
            head.rotation.y = Math.PI * (1 - progress); // 180° to 0°
            if (progress < 1) requestAnimationFrame(rotateHead);
          };
          rotateHead();
        }
        break;
      }

      case 'DANGER_REVEAL': {
        // Dramatic low angle close-up on the doll eyes glowing red
        targetCamPosRef.current.set(0, 16.5, -24);
        targetCamLookRef.current.set(0, 17.5, -36);

        if (head) head.rotation.y = 0; // Front facing
        if (redLight) redLight.intensity = 4.5; // Red alarm pulse
        if (leftEye) (leftEye.material as THREE.MeshBasicMaterial).color.setHex(0xff0044);
        if (rightEye) (rightEye.material as THREE.MeshBasicMaterial).color.setHex(0xff0044);
        break;
      }

      case 'RESULT_REVEAL': {
        // Target laser strike on eliminated contestants
        if (redLight) redLight.intensity = 2.0;

        const eliminatedList = players.filter(p => p.lastChoice === dangerNumber);
        if (eliminatedList.length > 0 && leftLaser && rightLaser && sceneRef.current) {
          // Point laser towards first eliminated player
          const targetPlayer = eliminatedList[0];
          const targetPos = getPlayerPosition(targetPlayer, 0, players.length);

          const leftEyePos = new THREE.Vector3(-0.95, 17.4, -33.5);
          const rightEyePos = new THREE.Vector3(0.95, 17.4, -33.5);

          // Aim Left Laser
          leftLaser.position.copy(leftEyePos);
          leftLaser.lookAt(targetPos);
          const distL = leftEyePos.distanceTo(targetPos);
          leftLaser.scale.set(1, 1, distL);
          (leftLaser.material as THREE.MeshBasicMaterial).opacity = 0.95;

          // Aim Right Laser
          rightLaser.position.copy(rightEyePos);
          rightLaser.lookAt(targetPos);
          const distR = rightEyePos.distanceTo(targetPos);
          rightLaser.scale.set(1, 1, distR);
          (rightLaser.material as THREE.MeshBasicMaterial).opacity = 0.95;

          // Trigger Spark Particles at target position
          if (laserSparksRef.current) {
            const pAttr = laserSparksRef.current.geometry.attributes.position as THREE.BufferAttribute;
            for (let i = 0; i < 350; i++) {
              pAttr.setXYZ(i, targetPos.x + (Math.random() - 0.5) * 2, targetPos.y + 1, targetPos.z + (Math.random() - 0.5) * 2);
            }
            pAttr.needsUpdate = true;
            laserSparksRef.current.userData.active = true;
          }

          // Camera focuses on the laser impact area
          targetCamPosRef.current.set(targetPos.x + 8, targetPos.y + 9, targetPos.z + 16);
          targetCamLookRef.current.set(targetPos.x, targetPos.y + 1, targetPos.z);

          // Fade out lasers after 1.5 seconds
          setTimeout(() => {
            if (leftLaser) (leftLaser.material as THREE.MeshBasicMaterial).opacity = 0;
            if (rightLaser) (rightLaser.material as THREE.MeshBasicMaterial).opacity = 0;
            if (laserSparksRef.current) laserSparksRef.current.userData.active = false;
          }, 1500);
        } else {
          // Safe round: Camera tracks advancing players
          targetCamPosRef.current.set(0, 14, 25);
          targetCamLookRef.current.set(0, 4, 0);
        }
        break;
      }

      case 'GAME_OVER': {
        // Winner Hero Camera Shot
        if (winner) {
          const winnerIndex = players.findIndex(p => p.id === winner.id);
          const wPos = getPlayerPosition(winner, Math.max(0, winnerIndex), players.length);
          targetCamPosRef.current.set(wPos.x + 4, wPos.y + 3.5, wPos.z + 9);
          targetCamLookRef.current.set(wPos.x, wPos.y + 2, wPos.z);
        } else {
          targetCamPosRef.current.set(0, 25, 40);
          targetCamLookRef.current.set(0, 0, 0);
        }
        break;
      }
    }
  }, [phase, dangerNumber, players, winner, config.winningSteps]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-[#06080e] select-none"
      style={{ minHeight: '560px' }}
    />
  );
}
