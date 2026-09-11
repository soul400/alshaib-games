import { 
  ViewerRaceConfig, 
  ViewerRaceQuestion, 
  ViewerRacer 
} from '@aep/types';
import { convertArabicIndicDigits } from './index';

export const DEFAULT_RACE_CONFIG: ViewerRaceConfig = {
  trackLengthMeters: 600,
  lobbyDurationSeconds: 0, // Manual start mode by default
  manualStart: true,
  countdownDurationSeconds: 3,
  maxRacers: 24,
  chatBoostEnabled: true,
  comebackMechanicEnabled: true,
  soundEnabled: true,
  cameraMode: 'smart_cinematic'
};

export const RACER_COLORS = [
  '#FF3B30', // أحمر ناري
  '#007AFF', // أزرق ملكي
  '#34C759', // أخضر زمردي
  '#FF9500', // برتقالي ساطع
  '#AF52DE', // بنفسجي ملكي
  '#5856D6', // نيلي غامق
  '#FF2D55', // وردي نيون
  '#00C7BE', // فيروزي بحري
  '#FFD60A', // ذهبي لامع
  '#32ADE6', // سماوي أطلس
  '#A2845E', // برونزي فروسي
  '#E056FD', // أرجواني ساطع
  '#F0932B', // عنبري دافئ
  '#6AB04C', // فستقي نضر
  '#22A6B3', // أزرق مائل للخضرة
  '#BE2EDD'  // ماجنتا غامق
];

/**
 * Checks whether a chat comment represents an entry to the race.
 * Accepts: "العب", "1", "شارك", "سباق", "ادخل", "يلا", "join", "play", "race", "حياك"
 */
export function isRaceJoinComment(commentText: string): boolean {
  if (!commentText || typeof commentText !== 'string') return false;

  const clean = convertArabicIndicDigits(commentText.trim())
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\w\s\u0600-\u06FF]/gi, '');

  if (/^(العب|1|شارك|سباق|ادخل|يلا|انا|سجل|تم|join|play|race|go)$/.test(clean)) {
    return true;
  }

  // Also match comments starting with explicit entry words
  if (/^(العب|شارك|ادخل|سجلني)\b/.test(clean)) {
    return true;
  }

  return false;
}

/**
 * Checks whether a chat comment is a live cheer/boost for racers.
 * Viewers typing: "اسرع", "سبرنت", "شد", "دوس", "turbo", "boost", "شعللها"
 */
export function isRaceBoostComment(commentText: string): boolean {
  if (!commentText || typeof commentText !== 'string') return false;

  const clean = convertArabicIndicDigits(commentText.trim())
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\w\s\u0600-\u06FF]/gi, '');

  return /^(اسرع|سبرنت|شد|دوس|توربو|بوست|شعللها|turbo|boost|faster|speed)$/.test(clean);
}

/**
 * Generates realistic Arabic mock racers for testing or live stream demo mode
 */
export function generateMockRacers(count: number = 16, trackLengthMeters: number = 600): ViewerRacer[] {
  const arabNames = [
    'سعود الشمري', 'محمد العتيبي', 'أحمد القحطاني', 'خالد الدوسري', 
    'عبدالله العنزي', 'فهد المطيري', 'سلطان الحربي', 'فيصل الغامدي', 
    'عمر الزهراني', 'ياسر الشهري', 'تركي السبيعي', 'ماجد الخالدي', 
    'طلال الرشيدي', 'منصور البقمي', 'بندر الهذلي', 'مشعل العسيري',
    'سارة آل سعود', 'نورة التميمي', 'ريم الهاجري', 'دلال الشريف'
  ];

  const racers: ViewerRacer[] = [];

  for (let i = 0; i < count; i++) {
    const name = arabNames[i % arabNames.length];
    const userId = `viewer-mock-${i + 1}-${Date.now()}`;
    const baseSpeed = 16 + Math.random() * 5; // 16-21 m/s

    racers.push({
      id: `racer-${i + 1}`,
      userId,
      username: `@${name.split(' ')[0].toLowerCase()}_${i + 1}`,
      displayName: name,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      lane: i,
      color: RACER_COLORS[i % RACER_COLORS.length],
      progress: 0,
      distanceMeters: 0,
      speed: baseSpeed,
      baseSpeed,
      boostTimer: 0,
      stumbleTimer: 0,
      rank: i + 1,
      isBot: true,
      cheerCount: 0,
      joinedAt: Date.now() - (count - i) * 800
    });
  }

  return racers;
}

/**
 * Advances physics of racers for one delta-time frame:
 * - Natural speed micro-variations
 * - Random sprint bursts & slight stumbling
 * - Comeback mechanic (trailers get high-torque boosts)
 * - Chat boost consumption
 */
export function updateRacersPhysics(
  racers: ViewerRacer[],
  deltaSeconds: number,
  trackLengthMeters: number,
  config: ViewerRaceConfig
): { updatedRacers: ViewerRacer[]; newFinishers: ViewerRacer[] } {
  const newFinishers: ViewerRacer[] = [];
  const currentLeaderDistance = Math.max(...racers.map(r => r.distanceMeters), 0);

  const updatedRacers = racers.map(racer => {
    if (racer.progress >= 100) {
      return racer; // Already finished
    }

    // Base speed influenced dynamically by racer's tap/like engagement
    const likes = racer.likesCount || 0;
    // Every 5 likes gives an extra burst up to +50% speed
    const tapSpeedMultiplier = 1 + Math.min(0.6, likes * 0.025);
    let currentSpeed = racer.baseSpeed * tapSpeedMultiplier;

    // 1. One-time Short Distance Boost (+45% speed for ~1.6 seconds, covering short distance)
    let boostTimer = Math.max(0, racer.boostTimer - deltaSeconds);
    if (boostTimer > 0) {
      currentSpeed *= 1.45; // Exactly 45% speed surge
    }

    // 2. Stumble / Obstacle handling
    let stumbleTimer = Math.max(0, racer.stumbleTimer - deltaSeconds);
    if (stumbleTimer > 0) {
      currentSpeed *= 0.75; // slight stumble
    }

    // 3. Realistic natural gallop noise
    const naturalNoise = (Math.random() - 0.48) * 2.5;
    currentSpeed += naturalNoise;

    // 4. Comeback (Rubberbanding) Mechanic for trailing racers
    if (config.comebackMechanicEnabled && currentLeaderDistance - racer.distanceMeters > 45) {
      // 25% chance per frame check to trigger catchup adrenaline
      if (Math.random() < 0.04 && boostTimer <= 0) {
        boostTimer = 2.2;
      }
    }

    // 5. Random Mini-Stumbles (rare, keeps race unpredictable)
    if (Math.random() < 0.008 && stumbleTimer <= 0 && boostTimer <= 0 && racer.progress < 90) {
      stumbleTimer = 1.4;
    }

    // Ensure speed never dips below 8 m/s
    currentSpeed = Math.max(8, currentSpeed);

    // Calculate advance
    const distanceMeters = Math.min(trackLengthMeters, racer.distanceMeters + currentSpeed * deltaSeconds);
    const progress = Math.min(100, (distanceMeters / trackLengthMeters) * 100);

    const updated: ViewerRacer = {
      ...racer,
      distanceMeters,
      progress,
      speed: currentSpeed,
      boostTimer,
      stumbleTimer
    };

    if (progress >= 100 && !racer.finishTime) {
      updated.finishTime = Date.now();
      newFinishers.push(updated);
    }

    return updated;
  });

  // Calculate live ranks based on distance
  const sorted = [...updatedRacers].sort((a, b) => {
    if (a.finishTime && b.finishTime) return a.finishTime - b.finishTime;
    if (a.finishTime) return -1;
    if (b.finishTime) return 1;
    return b.distanceMeters - a.distanceMeters;
  });

  sorted.forEach((r, idx) => {
    r.rank = idx + 1;
    if (r.progress >= 100 && !r.finishedRank) {
      r.finishedRank = idx + 1;
    }
  });

  return { updatedRacers: sorted, newFinishers };
}

/**
 * Calculates Camera Director position:
 * Follows leader smoothly with lead ahead offset and dynamic zoom
 */
export function calculateCameraDirector(
  racers: ViewerRacer[],
  currentCameraX: number,
  trackWidthPixels: number,
  viewportWidth: number,
  mode: ViewerRaceConfig['cameraMode']
): { cameraX: number; zoom: number; targetRacer?: ViewerRacer } {
  if (racers.length === 0) {
    return { cameraX: 0, zoom: 1 };
  }

  const leader = racers.find(r => r.rank === 1) || racers[0];
  const secondPlace = racers.find(r => r.rank === 2);

  // Leader's pixel position along track width
  const leaderX = (leader.progress / 100) * trackWidthPixels;

  if (mode === 'wide_track') {
    return { cameraX: 0, zoom: 0.85, targetRacer: leader };
  }

  // Camera targets 35% into the screen so lead space is visible ahead
  const desiredX = leaderX - viewportWidth * 0.35;
  const clampedDesiredX = Math.max(0, Math.min(trackWidthPixels - viewportWidth, desiredX));

  // Lerp smoothing (linear interpolation)
  const cameraX = currentCameraX + (clampedDesiredX - currentCameraX) * 0.08;

  // Zoom logic:
  // Final stretch (progress > 85%) zooms in dynamically on the duel!
  let zoom = 1.0;
  if (leader.progress > 85) {
    zoom = 1.18; // Close-up photo-finish tension
  } else if (secondPlace && Math.abs(leader.distanceMeters - secondPlace.distanceMeters) < 10) {
    zoom = 1.08; // Neck and neck battle
  }

  return { cameraX, zoom, targetRacer: leader };
}

/**
 * Creates default Viewer Race question metadata
 */
export function generateViewerRaceQuestion(): ViewerRaceQuestion {
  return {
    id: `race-q-${Date.now()}`,
    engineType: 'viewer-race',
    title: 'سباق المشاهدين الكبير — AL-SHAIB Viewer Race',
    category: 'سباق وتحدي جماهيري',
    difficulty: 'medium',
    points: 500,
    timeLimitSeconds: 20,
    acceptableAnswers: ['العب', '1', 'شارك', 'سباق'],
    config: { ...DEFAULT_RACE_CONFIG }
  };
}
