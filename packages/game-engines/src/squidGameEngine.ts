import { 
  SquidGameConfig, 
  SquidGameQuestion, 
  SquidPlayer, 
  SquidRiskLevel,
  SquidWinMode 
} from '@aep/types';
import { convertArabicIndicDigits } from './index';

export const DEFAULT_SQUID_CONFIG: SquidGameConfig = {
  winningSteps: 10,
  choiceDurationSeconds: 15,
  riskLevel: 'normal',
  winMode: 'first_to_finish',
  allowJoinMidGame: false,
  resultDisplayDurationSeconds: 6,
  soundEnabled: true
};

/**
 * Parses user comments to find a valid choice between 1 and 5.
 * Handles Arabic digits (١-٥), standard digits (1-5), Arabic words (واحد، اثنين، ثلاثة، اربعة، خمسة).
 * Rejects numbers outside 1-5 or compound messages.
 */
export function parseSquidChoice(commentText: string): number | null {
  if (!commentText) return null;

  // 1. Trim and convert Arabic-Indic digits (١, ٢, ٣, ٤, ٥) to standard (1, 2, 3, 4, 5)
  let clean = convertArabicIndicDigits(commentText.trim());

  // 2. Direct single digit match
  if (/^[1-5]$/.test(clean)) {
    return parseInt(clean, 10);
  }

  // 3. Match isolated single digit within comment (e.g. "#4" or "رقم 3" or "[2]")
  const isolatedMatch = clean.match(/(?:^|\s|[#№[(])([1-5])(?:\s|$|[\])])/);
  if (isolatedMatch && isolatedMatch[1]) {
    return parseInt(isolatedMatch[1], 10);
  }

  // 4. Arabic word matches
  const normalizedText = clean
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();

  if (/^(واحد|1|one)$/.test(normalizedText)) return 1;
  if (/^(اثنين|اثنان|تنين|2|two)$/.test(normalizedText)) return 2;
  if (/^(ثلاثه|ثلاث|تلاته|تلات|3|three)$/.test(normalizedText)) return 3;
  if (/^(اربعه|اربع|4|four)$/.test(normalizedText)) return 4;
  if (/^(خمسه|خمس|5|five)$/.test(normalizedText)) return 5;

  return null;
}

/**
 * Generates the Danger Number (1 to 5) for a round based on risk settings and player choice distribution.
 */
export function determineSquidDangerNumber(
  roundNumber: number,
  riskLevel: SquidRiskLevel,
  playerChoices: (number | null)[]
): number {
  const validChoices = playerChoices.filter((c): c is number => c !== null && c >= 1 && c <= 5);
  const getRandom1To5 = () => Math.floor(Math.random() * 5) + 1;

  if (riskLevel === 'easy') {
    return getRandom1To5();
  }

  if (riskLevel === 'normal') {
    const roll = Math.random() * 100;
    if (roll < 12) return 1;
    if (roll < 28) return 2;
    if (roll < 50) return 3;
    if (roll < 75) return 4;
    return 5;
  }

  if (riskLevel === 'hard') {
    const roll = Math.random() * 100;
    if (roll < 10) return 1;
    if (roll < 22) return 2;
    if (roll < 35) return 3;
    if (roll < 68) return 4;
    return 5;
  }

  if (riskLevel === 'extreme') {
    if (validChoices.length > 0) {
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      validChoices.forEach(c => { counts[c] = (counts[c] || 0) + 1; });
      let mostPicked = 5;
      let maxCount = -1;
      for (let n = 5; n >= 1; n--) {
        if (counts[n] > maxCount) {
          maxCount = counts[n];
          mostPicked = n;
        }
      }
      if (Math.random() < 0.7 && maxCount > 0) {
        return mostPicked;
      }
    }
    return Math.random() < 0.5 ? 4 : 5;
  }

  return getRandom1To5();
}

/**
 * Generate Mock Players for Testing and Broadcast Demo Mode
 */
export function generateMockSquidPlayers(count: number = 20, winningSteps: number = 10): SquidPlayer[] {
  const arabNames = [
    'سعود', 'محمد', 'أحمد', 'خالد', 'عبدالله', 
    'فهد', 'عمر', 'ريم', 'ياسر', 'منيرة', 
    'نورة', 'علي', 'حسين', 'سلطان', 'فيصل', 
    'مشعل', 'دلال', 'شهد', 'هند', 'بندر',
    'ماجد', 'تركي', 'سارة', 'طلال', 'منصور'
  ];

  const players: SquidPlayer[] = [];

  for (let i = 0; i < count; i++) {
    const name = arabNames[i % arabNames.length];
    const num = Math.floor(Math.random() * 900 + 100);
    const userId = `squid-mock-${i + 1}-${Date.now()}`;
    const initialStep = Math.min(winningSteps - 1, Math.floor(Math.random() * 2));

    players.push({
      id: `p-${i + 1}`,
      userId,
      username: `@${name.toLowerCase()}_${num}`,
      displayName: `${name} ${num.toString().substring(0, 2)}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      currentStep: initialStep,
      targetSteps: winningSteps,
      lastChoice: null,
      status: 'ACTIVE',
      isAlive: true,
      joinedAt: Date.now() - (count - i) * 1000,
      roundsSurvived: 0
    });
  }

  return players;
}

/**
 * Generates the default Squid Game Question structure
 */
export function generateSquidQuestion(): SquidGameQuestion {
  return {
    id: `squid-q-${Date.now()}`,
    engineType: 'squid-game',
    title: 'لعبة «الحبار» — Squid Survival',
    category: 'بقاء وتحدي خطوات',
    difficulty: 'medium',
    points: 500,
    timeLimitSeconds: 15,
    acceptableAnswers: ['1', '2', '3', '4', '5'],
    config: { ...DEFAULT_SQUID_CONFIG }
  };
}
