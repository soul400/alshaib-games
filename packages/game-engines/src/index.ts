import { 
  AlphabetTile, 
  AnyQuestion, 
  BaseQuestion, 
  ImageTransformStyle, 
  VaultConfig, 
  VaultPuzzle, 
  VaultPuzzleType, 
  VaultQuestion,
  BombPlayer,
  BombPlayerStatus,
  BombPowerUpType,
  BombPowerUp,
  BombConfig,
  BombDifficultyPreset,
  BombPassQuestion,
  BombInstance,
  ReactPlayer,
  ReactQuestion,
  ReactConfig,
  ReactPrompt,
  NumberDigitType
} from '@aep/types';

/**
 * Converts Arabic-Indic numerals (٠-٩) to standard digits (0-9)
 */
export function convertArabicIndicDigits(text: string): string {
  if (!text) return '';
  const arabicIndicMap: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  return text.replace(/[٠-٩]/g, d => arabicIndicMap[d] || d);
}

// Reverence and honorary phrases to automatically strip from answers and candidate comments
const REVERENCE_PHRASES_REGEX = /\b(رضي\s+الله\s+(عنه|عنها|عنهم|عنهما)|رضوان\s+الله\s+عليهم|صلى\s+الله\s+عليه\s+وسلم|عليه\s+(الصلاة\s+والسلام|السلام)|عليها\s+السلام|عليهم\s+السلام|كرم\s+الله\s+وجهه|رحمه\s+الله|رحمها\s+الله|رحمهم\s+الله|قدس\s+سره)\b/gi;

// Unit / Date / Context words that can be omitted when answering numbers or years
const UNIT_CONTEXT_WORDS_REGEX = /\b(في\s+عام|عام|سنة|سنه|سنوات|سنين|اعوام|هجري|هجريه|هجرية|هـ|ميلادي|ميلاديه|ميلادية|م|قبل\s+الميلاد|ق\s*م|يوم|ايام|شهر|اشهر|شهور|مرة|مرات|ساعة|ساعات|دقيقة|دقائق)\b/gi;

// Words that cannot stand alone as a valid single-word answer
const GENERIC_STOP_WORDS = new Set(['بن', 'ابن', 'ابو', 'ابي', 'ام', 'عبد', 'الله', 'من', 'عن', 'في', 'هو', 'هي', 'ذو', 'ذي', 'ذا', 'على', 'الى', 'ال']);

// Arabic Number Word Map (1 to 20, tens, hundreds)
const NUMBER_TO_ARABIC_WORDS: Record<number, string[]> = {
  0: ['صفر'],
  1: ['واحد', 'واحده', 'احد', 'احدى'],
  2: ['اثنان', 'اثنين', 'اثنتان', 'اثنتين'],
  3: ['ثلاث', 'ثلاثة', 'ثلاثه', 'تلاتة', 'تلاته', 'تلات'],
  4: ['اربع', 'اربعة', 'اربعه'],
  5: ['خمس', 'خمسة', 'خمسه'],
  6: ['ست', 'ستة', 'سته'],
  7: ['سبع', 'سبعة', 'سبعه'],
  8: ['ثمان', 'ثمانية', 'ثمانيه', 'تمانية', 'تمانيه', 'تمنية'],
  9: ['تسع', 'تسعة', 'تسعه'],
  10: ['عشر', 'عشرة', 'عشره'],
  11: ['احد عشر', 'احدى عشرة', 'احداعشر', 'حداعش', 'حداشر', 'احدعشر', 'احد عشرة'],
  12: ['اثنا عشر', 'اثني عشر', 'اثناعشر', 'اثنيعشر', 'تناعش', 'اتناعش', 'اثنتا عشرة'],
  13: ['ثلاثة عشر', 'ثلاثةعشر', 'تلاتاشر', 'ثلاث عشر', 'ثلاثة عشرة'],
  14: ['اربعة عشر', 'اربعةعشر', 'اربعتاشر', 'اربع عشر', 'اربعة عشرة'],
  15: ['خمسة عشر', 'خمسةعشر', 'خمسطاشر', 'خمس عشر', 'خمسة عشرة'],
  16: ['ستة عشر', 'ستةعشر', 'ستاشر', 'ست عشر', 'ستة عشرة'],
  17: ['سبعة عشر', 'سبعةعشر', 'سبعتاشر', 'سبع عشر', 'سبعة عشرة'],
  18: ['ثمانية عشر', 'ثمانيةعشر', 'تمنتاشر', 'ثماني عشر', 'ثمانية عشرة'],
  19: ['تسعة عشر', 'تسعةعشر', 'تسعتاشر', 'تسع عشر', 'تسعة عشرة'],
  20: ['عشرون', 'عشرين'],
  30: ['ثلاثون', 'ثلاثين'],
  40: ['اربعون', 'اربعين'],
  50: ['خمسون', 'خمسين'],
  60: ['ستون', 'ستين'],
  70: ['سبعون', 'سبعين'],
  80: ['ثمانون', 'ثمانين'],
  90: ['تسعون', 'تسعين'],
  100: ['مئة', 'مائة', 'مية', 'ميه', 'مئه'],
  200: ['مئتان', 'مئتين', 'مائتان', 'مائتين', 'ميتين'],
  1000: ['الف', 'ألف']
};

/**
 * Smart Arabic & English Answer Normalizer
 * Strips Tashkeel, Hamzas, Tatweel, punctuation, emojis, stickers, reverence phrases, and "ال" / "وال" / "بال" / "لل" prefixes.
 * Normalizes ة/ه, ى/ي, ظ/ض, trims whitespace and preserves clean word boundaries.
 */
export function normalizeAnswer(text: string): string {
  if (!text) return '';
  
  // 1. Strip reverence / honorary phrases
  let str = text.replace(REVERENCE_PHRASES_REGEX, ' ');

  str = convertArabicIndicDigits(str.trim().toLowerCase());

  // 2. Remove Tashkeel (Arabic Diacritics: َ ً ُ ٌ ِ ٍ ْ ّ)
  str = str.replace(/[\u064B-\u065F\u0670]/g, '');

  // 3. Remove Tatweel (Kashida ـ)
  str = str.replace(/\u0640/g, '');

  // 4. Normalize Hamzas (أ, إ, آ, ٱ, ء -> ا | ئ -> ي | ؤ -> و)
  str = str.replace(/[أإآٱء]/g, 'ا');
  str = str.replace(/ئ/g, 'ي');
  str = str.replace(/ؤ/g, 'و');

  // 5. Normalize Teh Marbuta and Alef Maksura (ة -> ه, ى -> ي)
  str = str.replace(/ة/g, 'ه');
  str = str.replace(/ى/g, 'ي');

  // 6. Normalize common phonetic substitutions (ظ -> ض)
  str = str.replace(/ظ/g, 'ض');

  // 7. Remove all emojis, symbols, punctuation, and stickers, keeping only valid Arabic/Latin letters, digits, and spaces
  str = str.replace(/[^\w\s\u0600-\u06FF]/gi, ' ');

  // 8. Remove "ال" / "وال" / "بال" / "فال" / "كال" / "لل" prefixes cleanly from start of each word
  str = str
    .split(/\s+/)
    .filter(Boolean)
    .map(word => {
      let w = word.replace(/^لل/g, '');
      w = w.replace(/^[وفبك]?ال/g, '');
      return w;
    })
    .filter(Boolean)
    .join(' ');

  return str.trim();
}

/**
 * Calculates Levenshtein Distance between two normalized strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Expands a full compound Arabic answer (names, titles, numbers with units) into all valid identifying sub-answers.
 * Examples:
 * - "٩ سنوات" -> ["9 سنوات", "9", "تسعة", "تسع", "تسعه", "سنوات"]
 * - "في عام ٢٠٤ هجري" -> ["في عام 204 هجري", "204", "عام 204", "204 هجري"]
 * - "١١ سنة" -> ["11 سنة", "11", "احد عشر", "احداعشر", "حداعش"]
 * - "عبدالله بن مسعود رضي الله عنه" -> ["عبدالله بن مسعود", "ابن مسعود", "مسعود", "عبدالله"]
 * - "يوسف بن تاشفين" -> ["يوسف بن تاشفين", "ابن تاشفين", "تاشفين", "يوسف"]
 * - "منصور بن عكرمة" -> ["منصور بن عكرمة", "ابن عكرمة", "عكرمة", "منصور"]
 * - "الأسود العنسي" -> ["الاسود العنسي", "الاسود", "العنسي"]
 */
export function expandAcceptableSegments(rawAnswer: string): string[] {
  const norm = normalizeAnswer(rawAnswer);
  if (!norm) return [];

  const segments = new Set<string>();
  segments.add(norm);

  // 1. NUMBER EXPANSION (e.g. "9 سنوات", "في عام 204 هجري", "11 سنة")
  const digitsInText = norm.match(/\d+/g);
  if (digitsInText) {
    for (const dStr of digitsInText) {
      const num = parseInt(dStr, 10);
      segments.add(dStr); // The pure number itself e.g. "9", "204", "11"

      // Add Arabic written word representations (e.g. 9 -> "تسعة", "تسع", 11 -> "احد عشر")
      if (NUMBER_TO_ARABIC_WORDS[num]) {
        for (const w of NUMBER_TO_ARABIC_WORDS[num]) {
          segments.add(normalizeAnswer(w));
        }
      }

      // Add number + stripped unit combinations
      const strippedUnits = norm.replace(UNIT_CONTEXT_WORDS_REGEX, ' ').trim();
      const normStripped = normalizeAnswer(strippedUnits);
      if (normStripped && normStripped !== norm) {
        segments.add(normStripped);
      }
    }
  }

  // Also check if text is a number written in words (e.g. "تسعة" or "تسع سنوات")
  for (const [num, wordForms] of Object.entries(NUMBER_TO_ARABIC_WORDS)) {
    const hasWordForm = wordForms.some(w => {
      const normW = normalizeAnswer(w);
      const tokens = norm.split(/\s+/);
      return tokens.includes(normW);
    });

    if (hasWordForm) {
      segments.add(num); // Add digit equivalent e.g. "9"
      for (const w of wordForms) {
        segments.add(normalizeAnswer(w));
      }
    }
  }

  const tokens = norm.split(/\s+/).filter(Boolean);
  if (tokens.length <= 1) {
    return Array.from(segments);
  }

  // 2. Add consecutive sub-phrases (2 to 4 words)
  for (let len = 2; len <= Math.min(tokens.length, 4); len++) {
    for (let i = 0; i <= tokens.length - len; i++) {
      const subPhrase = tokens.slice(i, i + len).join(' ');
      const subTokens = subPhrase.split(' ');
      if (subTokens.every(t => GENERIC_STOP_WORDS.has(t))) continue;
      segments.add(subPhrase);
    }
  }

  // 3. Identify Kunyas: "ابو [اسم]", "ام [اسم]", "ابن [اسم]"
  for (let i = 0; i < tokens.length - 1; i++) {
    if (['ابو', 'ابي', 'ام', 'ابن'].includes(tokens[i])) {
      const kunya = `${tokens[i]} ${tokens[i + 1]}`;
      segments.add(kunya);
      if (tokens[i + 1].length >= 3 && !GENERIC_STOP_WORDS.has(tokens[i + 1])) {
        segments.add(tokens[i + 1]);
      }
    }
  }

  // 4. Identify Patronymics / Nasab: e.g. "[اسم1] بن [اسم2]" (e.g. "عبدالله بن مسعود", "يوسف بن تاشفين", "منصور بن عكرمة")
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === 'بن' && i > 0 && i < tokens.length - 1) {
      const name1 = tokens[i - 1];
      const name2 = tokens[i + 1];

      // "ابن [اسم2]" (e.g. "ابن مسعود", "ابن تاشفين", "ابن عكرمة")
      segments.add(`ابن ${name2}`);

      // "[اسم2]" alone (e.g. "مسعود", "تاشفين", "عكرمة")
      if (name2.length >= 3 && !GENERIC_STOP_WORDS.has(name2)) {
        segments.add(name2);
      }

      // "[اسم1]" alone (e.g. "يوسف", "منصور", "عبدالله")
      if (name1.length >= 3 && !GENERIC_STOP_WORDS.has(name1)) {
        segments.add(name1);
      }

      // Compound with "عبد الله"
      if (i + 2 < tokens.length && tokens[i + 1] === 'عبد' && tokens[i + 2] === 'الله') {
        segments.add(`${name1} بن عبد الله`);
        segments.add(`${name1} بن عبدالله`);
        segments.add(`${name1} عبد الله`);
        segments.add(`${name1} عبدالله`);
      } else {
        segments.add(`${name1} بن ${name2}`);
        segments.add(`${name1} ${name2}`);
      }
    }
  }

  // Filter out any segment that is purely a single stop word or too short
  return Array.from(segments).filter(s => {
    const sTokens = s.split(' ');
    if (sTokens.length === 1 && (GENERIC_STOP_WORDS.has(sTokens[0]) || (sTokens[0].length < 3 && !/^\d+$/.test(sTokens[0])))) {
      return false;
    }
    return true;
  });
}

/**
 * Checks if candidate answer matches acceptable answers using:
 * 1. Exact normalized match & Segment-expanded matches
 * 2. Token inclusion (e.g. "الجواب هو الرياض" contains "رياض")
 * 3. Near-match / Fuzzy match with Levenshtein distance (typo tolerance e.g. "رياص", "عومير بن عبدالله", "باريسس")
 * 4. Multi-word and composite Arabic name matching
 */
export function isAnswerMatch(candidate: string, acceptableAnswers: string[], thresholdScore: number = 0.84): boolean {
  if (!candidate || !acceptableAnswers || acceptableAnswers.length === 0) return false;

  // 1. IMMUNITY CHECK: Must contain at least one valid Arabic letter, Latin letter, or digit
  const hasValidAlphanumeric = /[\u0600-\u06FFa-zA-Z0-9]/.test(candidate);
  if (!hasValidAlphanumeric) {
    return false;
  }

  const normCandidate = normalizeAnswer(candidate);
  if (!normCandidate || normCandidate.length === 0) {
    return false;
  }

  const candTokens = normCandidate.split(/\s+/).filter(Boolean);
  if (candTokens.length === 0) {
    return false;
  }

  // Reject if candidate is ONLY a single generic stop word (e.g. just "بن" or "ابو" or "عبد")
  if (candTokens.length === 1 && GENERIC_STOP_WORDS.has(candTokens[0])) {
    return false;
  }

  // Expand all acceptable answers into their valid sub-segments
  const allTargetSegments: string[] = [];
  for (const acc of acceptableAnswers) {
    if (!acc) continue;
    const segments = expandAcceptableSegments(acc);
    allTargetSegments.push(...segments);
  }

  for (const targetSegment of allTargetSegments) {
    if (!targetSegment) continue;

    // A. EXACT MATCH (e.g. "ابو موسى" === "ابو موسى" or "اشعري" === "اشعري" or "كبسة" === "كبسة")
    if (normCandidate === targetSegment) {
      return true;
    }

    const segTokens = targetSegment.split(/\s+/).filter(Boolean);

    // B. SINGLE-WORD TARGET (e.g. "اشعري", "انصاري", "رياض", "عويمر", "كبسة", "جوال")
    if (segTokens.length === 1) {
      const targetWord = segTokens[0];

      // B.1 Exact token match in comment (e.g. "هو الاشعري" contains "اشعري", "اتوقع الجوال" contains "جوال")
      if (candTokens.includes(targetWord)) {
        return true;
      }

      // B.2 Strict Fuzzy Match only for words of length >= 4 (NO fuzzy matching on 2 or 3-letter words!)
      if (targetWord.length >= 4 && !/^\d+$/.test(targetWord)) {
        for (const token of candTokens) {
          if (token.length >= 4 && Math.abs(token.length - targetWord.length) <= 1) {
            const dist = levenshteinDistance(token, targetWord);
            if (dist === 1) {
              const maxLen = Math.max(token.length, targetWord.length);
              const similarity = 1 - (dist / maxLen);
              if (similarity >= thresholdScore) {
                return true;
              }
            }
          }
        }
      }
    } else {
      // C. MULTI-WORD TARGET (e.g. "ابو موسى", "عويمر بن عبد الله", "طاش ما طاش")
      // C.1 Full phrase contained in candidate (e.g. "اتوقع ابو موسى الاشعري" contains "ابو موسى")
      if (normCandidate.includes(targetSegment)) {
        return true;
      }

      // C.2 Direct fuzzy match on the whole multi-word string (handles e.g. "عومير بن عبدالله" vs "عويمر بن عبد الله")
      const candidateNoSpaces = normCandidate.replace(/\s+/g, '');
      const targetNoSpaces = targetSegment.replace(/\s+/g, '');
      if (Math.abs(candidateNoSpaces.length - targetNoSpaces.length) <= 2 && targetNoSpaces.length >= 6) {
        const fullDist = levenshteinDistance(candidateNoSpaces, targetNoSpaces);
        if (fullDist <= 1) {
          const maxLen = Math.max(candidateNoSpaces.length, targetNoSpaces.length);
          const fullSim = 1 - (fullDist / maxLen);
          if (fullSim >= thresholdScore) {
            return true;
          }
        }
      }

      // C.3 All tokens of target segment are present in candidate tokens
      const allTokensMatched = segTokens.every(tWord => candTokens.includes(tWord));
      if (allTokensMatched) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Mixed Words Engine: Scrambles the letters of a word
 */
export function scrambleWord(word: string): string[] {
  const cleanWord = word.trim();
  const letters = cleanWord.split('');
  
  // Fisher-Yates Shuffle
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  // Ensure scrambled result isn't identical to original if length > 2
  if (letters.join('') === cleanWord && cleanWord.length > 2) {
    return scrambleWord(word);
  }

  return letters;
}

/**
 * Alphabet Engine: Arabic Letters Grid Generator
 */
export const ARABIC_ALPHABET = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
];

export function initializeAlphabetGrid(questionsMap?: Record<string, BaseQuestion>): AlphabetTile[] {
  return ARABIC_ALPHABET.map((letter) => {
    const defaultQuestion: BaseQuestion = {
      id: `alphabet-${letter}`,
      engineType: 'alphabet',
      title: `سؤال بحرف (${letter})`,
      category: 'الحروف العربية',
      difficulty: 'medium',
      points: 100,
      timeLimitSeconds: 30,
      acceptableAnswers: [letter],
      hint: `تبدأ الإجابة بحرف ${letter}`
    };

    return {
      letter,
      question: questionsMap?.[letter] || defaultQuestion,
      isAnswered: false
    };
  });
}

/**
 * Image Puzzle & Character Engine Filter Style Helper
 */
export function getImageStyleCSS(style: ImageTransformStyle): React.CSSProperties {
  switch (style) {
    case 'pixel':
      return { filter: 'blur(12px) contrast(200%) hue-rotate(45deg)' };
    case 'blur':
      return { filter: 'blur(20px)' };
    case 'sketch':
      return { filter: 'grayscale(100%) contrast(300%) brightness(90%)' };
    case 'mosaic':
      return { filter: 'invert(80%) sepia(100%) saturate(300%)' };
    case 'black-shadow':
      return { filter: 'brightness(0%)' };
    case 'comic-style':
      return { filter: 'contrast(250%) saturate(200%) drop-shadow(4px 4px 10px blue)' };
    case 'cartoon':
      return { filter: 'saturate(250%) contrast(150%)' };
    case 'half-image':
      return { clipPath: 'inset(0 50% 0 0)' };
    case 'caricature':
      return { 
        filter: 'contrast(190%) saturate(220%) brightness(105%) sepia(15%) drop-shadow(0 0 10px rgba(0,0,0,0.8))',
        mixBlendMode: 'normal'
      };
    case 'normal':
    default:
      return {};
  }
}

/**
 * ══════════════════════════════════════════════════════════════
 * 🔐 THE VAULT: PIN & PUZZLE GENERATION ENGINE
 * ══════════════════════════════════════════════════════════════
 */

/**
 * Converts Eastern Arabic numerals (٠-٩) and Persian numerals to Western Arabic (0-9)
 * and strips any non-digit characters.
 */
export function normalizePinAttempt(text: string): string {
  if (!text) return '';
  
  const easternDigits: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
  };

  let clean = text.trim();
  clean = clean.replace(/[٠-٩۰-۹]/g, (ch) => easternDigits[ch] || ch);
  // Extract continuous digits only
  const digitsOnly = clean.replace(/\D/g, '');
  return digitsOnly;
}

/**
 * Generates a random N-digit PIN where each digit is 0-9
 */
export function generateRandomPin(length: number = 6): string {
  let pin = '';
  for (let i = 0; i < length; i++) {
    // Generate secure random digit
    const digit = Math.floor(Math.random() * 10);
    pin += digit.toString();
  }
  return pin;
}

/**
 * Generates an extensible set of validated, mathematically sound puzzles specifically
 * crafted so the solution yields each target PIN digit, including visual item equations.
 */
export function generateVaultPuzzles(pin: string, config?: Partial<VaultConfig>): VaultPuzzle[] {
  const digits = pin.split('').map(Number);
  const puzzles: VaultPuzzle[] = [];

  const ITEM_SETS = [
    { a: '🎧', b: '📱', c: '📻', name: 'أجهزة صوتية' },
    { a: '🏮', b: '💣', c: '🏰', name: 'معالم أثرية' },
    { a: '👑', b: '💎', c: '🔑', name: 'كنوز ملكية' },
    { a: '🚀', b: '🛸', c: '⭐', name: 'عناصر فضاء' },
    { a: '🔥', b: '⚡', c: '❄️', name: 'طاقات طبيعية' },
    { a: '🏆', b: '🥇', c: '🎯', name: 'جوائز وتحديات' },
    { a: '🍎', b: '🍌', c: '🍇', name: 'فواكه' }
  ];

  const PUZZLE_TYPE_ROTATION: VaultPuzzleType[] = [
    'visual_equation',
    'crack_code',
    'math_riddle',
    'visual_count',
    'matrix_math',
    'sequence'
  ];

  digits.forEach((targetDigit, stageIdx) => {
    const stageNum = stageIdx + 1;
    const stageType: VaultPuzzleType = PUZZLE_TYPE_ROTATION[stageIdx % PUZZLE_TYPE_ROTATION.length];
    const itemSet = ITEM_SETS[stageIdx % ITEM_SETS.length];

    let puzzle: VaultPuzzle;

    switch (stageType) {
      // ═══════════════════════════════════════════════════════
      // 1. VISUAL EQUATION (معادلات العباقرة الحقيقية بالرموز)
      // ═══════════════════════════════════════════════════════
      case 'visual_equation': {
        // High-level viral equation sets with realistic magnitudes
        // Row 1: A + A + A = 3A
        // Row 2: B + B + A = 2B + A
        // Row 3: C + C + B = 2C + B
        // Row 4: C + B × A = ?  (where targetDigit is the exact unit digit or exact answer)
        
        let aVal = 10;
        let bVal = 4;
        let cVal = 2;

        if (targetDigit === 0) {
          aVal = 10; bVal = 5; cVal = 0; // 0 + 5 * 10 = 50 -> unit digit 0
        } else if (targetDigit === 7) {
          aVal = 14; bVal = 2; cVal = 7; // 7 + 2 * 14 = 35 or tailored
        } else if (targetDigit === 8) {
          aVal = 12; bVal = 3; cVal = 8;
        } else if (targetDigit === 9) {
          aVal = 15; bVal = 4; cVal = 9;
        } else if (targetDigit === 5) {
          aVal = 20; bVal = 2; cVal = 5;
        } else if (targetDigit === 6) {
          aVal = 16; bVal = 3; cVal = 6;
        } else if (targetDigit === 4) {
          aVal = 8; bVal = 2; cVal = 4;
        } else if (targetDigit === 3) {
          aVal = 6; bVal = 2; cVal = 3;
        } else if (targetDigit === 2) {
          aVal = 10; bVal = 1; cVal = 2;
        } else {
          aVal = 5; bVal = 2; cVal = 1;
        }

        const r1 = aVal + aVal + aVal;
        const r2 = bVal + bVal + aVal;
        const r3 = cVal + cVal + bVal;
        // Exact target digit is cVal
        const equationRows = [
          { items: [itemSet.a, itemSet.a, itemSet.a], operators: ['+' as const, '+' as const], result: r1 },
          { items: [itemSet.b, itemSet.b, itemSet.a], operators: ['+' as const, '+' as const], result: r2 },
          { items: [itemSet.c, itemSet.c, itemSet.b], operators: ['+' as const, '+' as const], result: r3 },
          { items: [itemSet.c], operators: [] as ('+' | '-' | '×' | '÷')[], result: '?' }
        ];

        puzzle = {
          id: `vault-p-${stageNum}`,
          stageNumber: stageNum,
          targetDigitIndex: stageIdx,
          type: 'visual_equation',
          title: `لغز معادلات الرموز للعباقرة #${stageNum}`,
          question: `استنتج قيمة الرمز الأخير (${itemSet.c}) من نظام المعادلات أعلاه:`,
          visualData: { equationRows },
          correctAnswer: targetDigit.toString(),
          hints: [
            `ابدأ بحساب قيمة الرمز الأول (${itemSet.a}) بقسمة ${r1} على 3`,
            `عوض قيمة الرمز الأول في الصف الثاني لإيجاد الرمز الثاني`
          ],
          timeLimitSeconds: config?.puzzleTimeLimitSeconds || 30
        };
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 2. CRACK THE CODE (فك الشفرة والقرائن الرقمية)
      // ═══════════════════════════════════════════════════════
      case 'crack_code': {
        const d = targetDigit;
        const falseD1 = (d + 3) % 10;
        const falseD2 = (d + 7) % 10;
        const falseD3 = (d + 5) % 10;
        const falseD4 = (d + 2) % 10;

        const crackClues: VaultCrackClue[] = [
          {
            code: [d.toString(), falseD1.toString(), falseD2.toString()],
            verdict: 'رقم واحد صحيح وفي المكان الصحيح 🟢',
            status: 'CORRECT_PLACE'
          },
          {
            code: [falseD3.toString(), d.toString(), falseD4.toString()],
            verdict: 'رقم واحد صحيح ولكن في المكان الخطأ 🟡',
            status: 'WRONG_PLACE'
          },
          {
            code: [falseD1.toString(), falseD2.toString(), falseD4.toString()],
            verdict: 'جميع الأرقام في هذا السطر خاطئة تماماً 🔴',
            status: 'ALL_WRONG'
          }
        ];

        puzzle = {
          id: `vault-p-${stageNum}`,
          stageNumber: stageNum,
          targetDigitIndex: stageIdx,
          type: 'crack_code',
          title: `تحدي فك شفرة الخزينة بالقرائن #${stageNum}`,
          question: `حلل القرائن الرقمية الثلاث التالية لاستنتاج الرقم السري الصحيح:`,
          visualData: { crackClues },
          correctAnswer: d.toString(),
          hints: [
            `احذف الأرقام (${falseD1} و ${falseD2} و ${falseD4}) لأنها خاطئة كلياً حسب السطر الثالث`,
            `قارن الرقم المشترك بين السطر الأول والثاني لتأكيد الحل`
          ],
          timeLimitSeconds: config?.puzzleTimeLimitSeconds || 30
        };
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 3. HIGH-TIER MATH RIDDLES (فوازير الأرقام والذكاء الحسابي)
      // ═══════════════════════════════════════════════════════
      case 'math_riddle': {
        let riddleQuestion = '';
        if (targetDigit === 5) {
          riddleQuestion = 'عدد مكون من منزلة واحدة، إذا ضربته في نفسه وطرحت منه (15) كان الناتج مساوياً لضعف العدد نفسه.. فما هو العدد؟';
        } else if (targetDigit === 6) {
          riddleQuestion = 'عدد إذا ضربته في (6) ثم أضفت إليه (8) وقسمت الناتج على (4) كان الجواب (11).. فما هو هذا العدد؟';
        } else if (targetDigit === 7) {
          riddleQuestion = 'عدد أولي، إذا جمعته مع مربعه كان الناتج مساوياً لـ (56).. فما هو هذا العدد؟';
        } else if (targetDigit === 8) {
          riddleQuestion = 'إذا كان نصف ربع هذا العدد يساوي (1).. فما هو هذا العدد؟';
        } else if (targetDigit === 9) {
          riddleQuestion = 'عدد إذا ضربته في (7) ثم طرحت من الناتج (11) وقسمت على (2) كان الجواب مساوياً لـ (26).. فما هو هذا العدد؟';
        } else if (targetDigit === 4) {
          riddleQuestion = 'عدد إذا ربعته (ضربته في نفسه) وطرحت منه (7) كان الناتج مساوياً لـ (9).. فما هو العدد؟';
        } else if (targetDigit === 3) {
          riddleQuestion = 'عدد إذا كعّبته (ضربته في نفسه 3 مرات) ثم طرحت منه (7) كان الناتج (20).. فما هو العدد؟';
        } else if (targetDigit === 2) {
          riddleQuestion = 'ما هو العدد الزوجي الأولي الوحيد في عالم الرياضيات؟';
        } else if (targetDigit === 1) {
          riddleQuestion = 'ما هو العدد المحايد لعملية الضرب، والذي إذا ضرب في أي رقم لا يغير قيمته؟';
        } else {
          riddleQuestion = 'ما هو الرقم الوحيد في الرياضيات الذي إذا ضربته في أي عدد في الكون أصبح الناتج صفراً؟';
        }

        puzzle = {
          id: `vault-p-${stageNum}`,
          stageNumber: stageNum,
          targetDigitIndex: stageIdx,
          type: 'math_riddle',
          title: `فزورة الأذكياء والرياضيات #${stageNum}`,
          question: riddleQuestion,
          correctAnswer: targetDigit.toString(),
          hints: [
            'قم بصياغة المسألة كمعادلة رياضية بسيطة',
            targetDigit >= 5 ? 'العدد يقع في النصف الأعلى (5 إلى 9)' : 'العدد يقع في النصف الأدنى (0 إلى 4)'
          ],
          timeLimitSeconds: config?.puzzleTimeLimitSeconds || 25
        };
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 4. MATRIX / QUADRANT MATH (مصفوفة الأرقام الذكية)
      // ═══════════════════════════════════════════════════════
      case 'matrix_math': {
        const top = targetDigit + 4;
        const left = 7;
        const right = 3;
        // Rule: (Top + Left) - (Right + Center) = 8 => Center = (Top + Left) - Right - 8 = targetDigit
        // We do not leak the formula anywhere in text!

        puzzle = {
          id: `vault-p-${stageNum}`,
          stageNumber: stageNum,
          targetDigitIndex: stageIdx,
          type: 'matrix_math',
          title: `لغز مصفوفة الأرقام والأنماط #${stageNum}`,
          question: `اكتشف العلاقة الرياضية بين الأرقام المحيطة واستنتج الرقم المركزي المفقود ( ؟ ):`,
          visualData: {
            matrixNumbers: {
              top,
              left,
              right,
              center: '?'
            }
          },
          correctAnswer: targetDigit.toString(),
          hints: [
            `اجمع الرقمين العلوي والأيسر (${top} + ${left}) ثم ابحث عن العلاقة مع الرقم الأيمن (${right})`,
            targetDigit % 2 === 0 ? 'الرقم المفقود زوجي' : 'الرقم المفقود فردي'
          ],
          timeLimitSeconds: config?.puzzleTimeLimitSeconds || 25
        };
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 5. VISUAL COUNT (العد البصري مع الاختفاء بعد 5 ثوان)
      // ═══════════════════════════════════════════════════════
      case 'visual_count': {
        const targetSymbol = itemSet.a;
        const otherSymbols = [itemSet.b, itemSet.c, '🪙', '📦', '🎯', '💳', '🛡️'];

        const actualAnswer = targetDigit.toString();

        const grid: string[][] = [
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ];

        const positions: [number, number][] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) positions.push([r, c]);
        }
        positions.sort(() => Math.random() - 0.5);

        positions.forEach(([r, c], idx) => {
          if (idx < targetDigit) {
            grid[r][c] = targetSymbol;
          } else {
            grid[r][c] = otherSymbols[idx % otherSymbols.length];
          }
        });

        puzzle = {
          id: `vault-p-${stageNum}`,
          stageNumber: stageNum,
          targetDigitIndex: stageIdx,
          type: 'visual_count',
          title: `لغز الذاكرة والعد البصري #${stageNum}`,
          question: `كم مرة ظهر الرمز (${targetSymbol}) داخل شبكة الخزينة قبل اختفائها؟`,
          visualData: { grid, symbol: targetSymbol },
          correctAnswer: actualAnswer,
          hints: [
            `ركز في ذاكرتك على الرمز ${targetSymbol} ومواقعه`,
            targetDigit > 4 ? 'عدد الرموز كان أكثر من 4' : 'عدد الرموز كان 4 أو أقل'
          ],
          timeLimitSeconds: config?.puzzleTimeLimitSeconds || 25
        };
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 6. NON-TRIVIAL SEQUENCE (متتاليات ذكية وغير خطية)
      // ═══════════════════════════════════════════════════════
      case 'sequence':
      default: {
        let seq: (number | string)[] = [];
        let answer = targetDigit.toString();

        if (targetDigit === 7) {
          // Primes sequence: 2, 3, 5, [?]
          seq = [2, 3, 5, '?'];
          answer = '7';
        } else if (targetDigit === 8) {
          // Powers of 2: 1, 2, 4, [?]
          seq = [1, 2, 4, '?'];
          answer = '8';
        } else if (targetDigit === 9) {
          // Square sequence: 1, 4, [?]
          seq = [1, 4, '?'];
          answer = '9';
        } else if (targetDigit === 6) {
          // Multiplying by 2: 1.5, 3, [?]
          seq = [0, 2, 4, '?']; // even steps
          answer = '6';
        } else if (targetDigit === 5) {
          // Fibonacci: 1, 1, 2, 3, [?]
          seq = [1, 1, 2, 3, '?'];
          answer = '5';
        } else if (targetDigit === 4) {
          // Division by 2: 32, 16, 8, [?]
          seq = [32, 16, 8, '?'];
          answer = '4';
        } else if (targetDigit === 3) {
          // Alternating pattern: 12, 6, 6, [?]
          seq = [27, 9, '?'];
          answer = '3';
        } else if (targetDigit === 2) {
          // Differences: 20, 14, 9, 5, [?] (-6, -5, -4, -3)
          seq = [20, 14, 9, 5, '?'];
          answer = '2';
        } else if (targetDigit === 1) {
          // Division by 3: 81, 27, 9, 3, [?]
          seq = [81, 27, 9, 3, '?'];
          answer = '1';
        } else {
          // Decreasing differences: 12, 7, 3, 1, [?] (-5, -4, -2, -1)
          seq = [10, 6, 3, 1, '?'];
          answer = '0';
        }

        puzzle = {
          id: `vault-p-${stageNum}`,
          stageNumber: stageNum,
          targetDigitIndex: stageIdx,
          type: 'sequence',
          title: `متتالية الأنماط والذكاء #${stageNum}`,
          question: `اكتشف النمط الرياضي وأوجد الرقم التالي مكان علامة الاستفهام:\n${seq.join('  ➔  ')}`,
          visualData: { sequence: seq },
          correctAnswer: answer,
          hints: [
            'حلل الفوارق أو العمليات الحسابية بين الأعداد المتتالية',
            targetDigit % 2 === 0 ? 'الرقم المطلوب زوجي' : 'الرقم المطلوب فردي'
          ],
          timeLimitSeconds: config?.puzzleTimeLimitSeconds || 25
        };
        break;
      }
    }

    puzzles.push(puzzle);
  });

  return puzzles;
}

/**
 * Creates a complete Vault Question object for the AEP show store & play arena.
 */
export function generateVaultQuestion(config?: Partial<VaultConfig>): VaultQuestion {
  const pinLength = config?.pinLength || 6;
  const pin = generateRandomPin(pinLength);
  const puzzles = generateVaultPuzzles(pin, config);

  return {
    id: `vault-session-${Date.now()}`,
    engineType: 'the-vault',
    title: 'خزينة الأسرار — THE VAULT',
    category: 'ألغاز وأكشن',
    difficulty: config?.difficulty || 'hard',
    points: 1000,
    timeLimitSeconds: config?.totalGameDurationSeconds || 180,
    acceptableAnswers: [pin],
    phase: 'IDLE',
    securityLevel: 'NORMAL',
    pinLength,
    revealedDigits: new Array(pinLength).fill(null),
    currentStageIndex: 0,
    puzzles,
    participants: [],
    failedPinAttemptsCount: 0
  };
}

// ══════════════════════════════════════════════════════════════
// 🪑 MUSICAL CHAIRS — GAME ENGINE & SEAT NUMBER PARSER
// ══════════════════════════════════════════════════════════════

/**
 * Generates N unique 2-digit random numbers (10 to 99) for Musical Chairs seats.
 * Ensures numbers are unique within the round and do not repeat previous round numbers.
 */
export function generateMusicalChairsSeats(count: number, previousNumbers: number[] = []): number[] {
  if (count <= 0) return [];
  const prevSet = new Set(previousNumbers);
  const pool: number[] = [];

  // Build candidate pool from 1 to 99
  for (let n = 1; n <= 99; n++) {
    if (!prevSet.has(n)) {
      pool.push(n);
    }
  }

  // Fallback if pool is too small
  if (pool.length < count) {
    for (let n = 1; n <= 99; n++) {
      if (!pool.includes(n)) pool.push(n);
    }
  }

  // Fisher-Yates Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}

/**
 * Parses live TikTok comments for Musical Chairs seat numbers.
 * Supports:
 * - English digits: "1", "2", "5", "12", "chair 1", "1 🔥"
 * - Arabic digits: "١", "٢", "٣", "كرسي ١"
 * - Phrases: "كرسي 1", "ابغى 2", "اجلس 3", "رقم 1", "كرسي1"
 */
export function extractAllSeatNumbersFromComment(rawComment: string): number[] {
  if (!rawComment || !rawComment.trim()) return [];

  // 1. Normalize Eastern Arabic numerals (٠-٩) to Western Arabic (0-9)
  const easternToArabicNumerals: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };

  const normalized = rawComment.replace(/[٠-٩]/g, (char) => easternToArabicNumerals[char] || char);

  // 2. Extract all numbers (1 to 99) in order
  const numbers: number[] = [];
  const seen = new Set<number>();
  const digitRegex = /(?:\b|\D|^)([1-9][0-9]?)(?:\b|\D|$)/g;
  let m;
  
  // First try word/token boundary regex
  while ((m = digitRegex.exec(normalized)) !== null) {
    const num = parseInt(m[1], 10);
    if (num >= 1 && num <= 99 && !seen.has(num)) {
      seen.add(num);
      numbers.push(num);
    }
  }

  // Fallback: search any contiguous 1-2 digit sequences if boundary regex found nothing
  if (numbers.length === 0) {
    const fallbackRegex = /([1-9][0-9]?)/g;
    while ((m = fallbackRegex.exec(normalized)) !== null) {
      const num = parseInt(m[1], 10);
      if (num >= 1 && num <= 99 && !seen.has(num)) {
        seen.add(num);
        numbers.push(num);
      }
    }
  }

  return numbers;
}

export function extractSeatNumberFromComment(rawComment: string): number | null {
  const numbers = extractAllSeatNumbersFromComment(rawComment);
  return numbers.length > 0 ? numbers[0] : null;
}

/**
 * Creates initial Musical Chairs question structure
 */
export function generateMusicalChairsQuestion(): any {
  return {
    id: `musical-chairs-${Date.now()}`,
    engineType: 'musical-chairs',
    title: 'الكراسي الموسيقية — MUSICAL CHAIRS 🪑',
    category: 'سرعة وتحدي',
    difficulty: 'hard',
    points: 2000,
    timeLimitSeconds: 15,
    acceptableAnswers: [],
    musicDurationSeconds: 15,
    musicTrack: 'Hype Arena'
  };
}

// ══════════════════════════════════════════════════════════════
// 🧨 BOMB PASS — GAME ENGINE & COMMAND PARSER
// ══════════════════════════════════════════════════════════════

export interface ParsedBombCommand {
  type: 'TRANSFER' | 'USE_SWAP' | 'USE_FREEZE' | 'USE_SHIELD' | 'JOIN_LOBBY' | 'UNKNOWN';
  targetPlayer?: BombPlayer;
  rawText: string;
  error?: string;
}

/**
 * Parses live TikTok comments into structured Bomb Pass commands.
 * Handles @mentions, Arabic names, normalized search, and power-up keywords.
 */
export function parseBombPassCommand(
  commentText: string,
  currentHolder: BombPlayer | null,
  allPlayers: BombPlayer[],
  playerNumberMapping?: Record<string, number>
): ParsedBombCommand {
  if (!commentText || typeof commentText !== 'string') {
    return { type: 'UNKNOWN', rawText: '', error: 'تعليق فارغ' };
  }

  const raw = commentText.trim();
  const lower = raw.toLowerCase();
  const normalizedComment = normalizeAnswer(raw);

  // 1. Check for Join Lobby commands
  if (['العب', 'انضم', 'دخول', 'join', 'play'].includes(lower) || ['العب', 'انضم', 'دخول'].includes(normalizedComment)) {
    return { type: 'JOIN_LOBBY', rawText: raw };
  }

  // 2. Check for Freeze Power-up
  if (['تجميد', 'وقف', 'freeze', 'stop', 'جليد'].includes(lower) || ['تجميد', 'وقف', 'جليد'].includes(normalizedComment)) {
    return { type: 'USE_FREEZE', rawText: raw };
  }

  // 3. Check for Shield Power-up
  if (['درع', 'shield', 'حمايه', 'حماية'].includes(lower) || ['درع', 'حمايه'].includes(normalizedComment)) {
    return { type: 'USE_SHIELD', rawText: raw };
  }

  // 4. Check for Swap Power-up ("بدل @سالم", "swap @salem")
  const isSwap = lower.startsWith('بدل') || lower.startsWith('swap') || normalizedComment.startsWith('بدل');
  let targetQuery = raw;

  if (isSwap) {
    targetQuery = raw.replace(/^(بدل|swap)\s*/i, '').trim();
  }

  // Remove leading @ or punctuation
  targetQuery = targetQuery.replace(/^[@＠#]/, '').trim();
  const normalizedQuery = normalizeAnswer(targetQuery);

  if (!targetQuery) {
    return { type: 'UNKNOWN', rawText: raw, error: 'لم يتم تحديد اللاعب المستهدف' };
  }

  // 5. Target Resolution: Find target in ALIVE / HOLDING_BOMB players (excluding sender if possible)
  const alivePlayers = allPlayers.filter(p => p.status === 'ALIVE' || p.status === 'HOLDING_BOMB' || p.status === 'PROTECTED');

  let matchedTarget: BombPlayer | undefined = undefined;

  // Support 1: Fast Number Index matching (e.g. "2", "تمرير 2", "رقم 3", "٢")
  const easternToArabicNumerals: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  const numCleaned = targetQuery
    .replace(/[٠-٩]/g, (char) => easternToArabicNumerals[char] || char)
    .replace(/^(تمرير|مرر|pass|رقم)\s*/i, '')
    .trim();

  const playerIdx = parseInt(numCleaned, 10);
  if (!isNaN(playerIdx)) {
    if (playerNumberMapping) {
      matchedTarget = alivePlayers.find(p => playerNumberMapping[p.id] === playerIdx);
    } else if (playerIdx >= 1 && playerIdx <= alivePlayers.length) {
      matchedTarget = alivePlayers[playerIdx - 1];
    }
  }

  // Support 2: Direct match by username / displayName
  if (!matchedTarget) {
    matchedTarget = alivePlayers.find(p => 
      p.tiktokUsername.toLowerCase() === targetQuery.toLowerCase() ||
      p.displayName.toLowerCase() === targetQuery.toLowerCase()
    );
  }

  // Fallback: Normalized match on displayName or tiktokUsername
  if (!matchedTarget && normalizedQuery) {
    matchedTarget = alivePlayers.find(p => 
      normalizeAnswer(p.displayName) === normalizedQuery ||
      normalizeAnswer(p.tiktokUsername) === normalizedQuery
    );
  }

  // Fallback 2: Substring inclusion for long display names
  if (!matchedTarget && normalizedQuery.length >= 3) {
    matchedTarget = alivePlayers.find(p => 
      normalizeAnswer(p.displayName).includes(normalizedQuery) ||
      normalizeAnswer(p.tiktokUsername).includes(normalizedQuery)
    );
  }

  // Validate Target Status
  if (!matchedTarget) {
    // Check if target exists in eliminated players to give precise error
    const eliminated = allPlayers.find(p => 
      p.displayName.toLowerCase() === targetQuery.toLowerCase() ||
      normalizeAnswer(p.displayName) === normalizedQuery
    );
    if (eliminated) {
      return { 
        type: isSwap ? 'USE_SWAP' : 'TRANSFER', 
        rawText: raw, 
        error: 'اللاعب المستهدف تم إقصاؤه بالفعل' 
      };
    }
    return { 
      type: isSwap ? 'USE_SWAP' : 'TRANSFER', 
      rawText: raw, 
      error: 'اللاعب المستهدف غير موجود في الجولة' 
    };
  }

  // Validate self-targeting
  if (currentHolder && matchedTarget.id === currentHolder.id) {
    return { 
      type: isSwap ? 'USE_SWAP' : 'TRANSFER', 
      rawText: raw, 
      error: 'لا يمكنك استهداف نفسك!' 
    };
  }

  return {
    type: isSwap ? 'USE_SWAP' : 'TRANSFER',
    targetPlayer: matchedTarget,
    rawText: raw
  };
}

/**
 * Calculates dynamic bomb countdown timer duration based on remaining alive players and preset.
 */
export function getBombDurationForRound(
  aliveCount: number,
  preset: BombDifficultyPreset = 'NORMAL',
  config?: Partial<BombConfig>
): number {
  if (config?.minBombTime && config?.maxBombTime) {
    const min = config.minBombTime;
    const max = config.maxBombTime;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let min = 5;
  let max = 20;

  if (preset === 'EASY') {
    if (aliveCount > 20) { min = 10; max = 30; }
    else if (aliveCount > 10) { min = 8; max = 24; }
    else if (aliveCount > 5) { min = 6; max = 16; }
    else { min = 4; max = 10; }
  } else if (preset === 'HARD') {
    if (aliveCount > 20) { min = 4; max = 16; }
    else if (aliveCount > 10) { min = 3; max = 12; }
    else if (aliveCount > 5) { min = 3; max = 8; }
    else { min = 2; max = 5; }
  } else if (preset === 'CHAOS') {
    if (aliveCount > 10) { min = 2; max = 10; }
    else { min = 1; max = 6; }
  } else {
    // NORMAL
    if (aliveCount > 20) { min = 6; max = 22; }
    else if (aliveCount > 10) { min = 5; max = 18; }
    else if (aliveCount > 5) { min = 4; max = 12; }
    else { min = 3; max = 7; }
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MOCK_ARABIC_NAMES = [
  'أحمد الشهري', 'سالم الدوسري', 'محمد العتيبي', 'خالد الغامدي', 'ناصر القحطاني',
  'وليد الشمري', 'سعد الزهراني', 'عمر المطيري', 'فهد الحربي', 'بدر العنزي',
  'سلطان المالكي', 'عبدالله السبيعي', 'مشعل الرشيدي', 'يوسف الفهد', 'ريان الصالح',
  'فيصل النجدي', 'نايف الهلالي', 'طارق العمري', 'حمزة البلوشي', 'إبراهيم الصقر'
];

const MOCK_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
];

/**
 * Generates realistic mock players for testing and lobby bootstrapping.
 */
export function generateMockBombPlayers(count: number = 8): BombPlayer[] {
  const players: BombPlayer[] = [];
  const powerUpTypes: BombPowerUpType[] = ['SHIELD', 'SWAP', 'FREEZE'];

  for (let i = 0; i < count; i++) {
    const name = MOCK_ARABIC_NAMES[i % MOCK_ARABIC_NAMES.length];
    const avatar = MOCK_AVATARS[i % MOCK_AVATARS.length];
    const pId = `bp-mock-${Date.now()}-${i + 1}`;
    
    // Give 25% chance of starting with 1 random power-up
    const powerUps: BombPowerUp[] = [];
    if (Math.random() < 0.35) {
      const pType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      powerUps.push({
        id: `pw-${pId}-${pType}`,
        type: pType,
        name: pType === 'SHIELD' ? 'درع الحماية' : pType === 'SWAP' ? 'تبديل فوري' : 'تجميد المؤقت',
        icon: pType === 'SHIELD' ? '🛡️' : pType === 'SWAP' ? '🔄' : '⏱️',
        description: pType === 'SHIELD' ? 'يمتص انفجاراً واحداً' : pType === 'SWAP' ? 'تبديل القنبلة فوراً' : 'إيقاف الوقت 3 ثوانٍ',
        charges: 1
      });
    }

    players.push({
      id: pId,
      playerId: pId,
      tiktokUserId: `tt-uid-${1000 + i}`,
      tiktokUsername: `user_${1000 + i}`,
      displayName: name,
      avatarUrl: avatar,
      status: 'ALIVE',
      joinedAt: Date.now(),
      powerUps,
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
    });
  }

  return players;
}

/**
 * Creates initial BombPassQuestion state for AEP show session.
 */
export function generateBombPassQuestion(config?: Partial<BombConfig>): BombPassQuestion {
  const defaultConfig: BombConfig = {
    playersLimit: config?.playersLimit || 30,
    minBombTime: config?.minBombTime || 4,
    maxBombTime: config?.maxBombTime || 25,
    fakeBombChance: config?.fakeBombChance ?? 0.15,
    powerUpsEnabled: config?.powerUpsEnabled ?? true,
    chaosEventsEnabled: config?.chaosEventsEnabled ?? false,
    doubleBombEnabled: config?.doubleBombEnabled ?? false,
    difficultyPreset: config?.difficultyPreset || 'NORMAL',
    disconnectGracePeriodSec: config?.disconnectGracePeriodSec || 5
  };

  return {
    id: `bomb-pass-session-${Date.now()}`,
    engineType: 'bomb-pass',
    title: '🧨 لعبة القنبلة الموقوتة — BOMB PASS',
    category: 'ألعاب الأكشن والسرعة',
    difficulty: 'hard',
    points: 1500,
    timeLimitSeconds: 300,
    acceptableAnswers: [],
    phase: 'LOBBY',
    currentRound: 1,
    players: [],
    activeBombs: [],
    config: defaultConfig
  };
}

// ════════════════════════════════════════════════════════════════════
// ⚡ REACT ENGINE — OFFICIAL SYMBOLS & CONSTANTS (تحدي التركيز والاستجابة)
// ════════════════════════════════════════════════════════════════════

export interface ReactSymbolEntry {
  symbol: string;
  word: string;
  color: string;
  bgGlow: string;
  category: 'motion' | 'combat' | 'action' | 'special';
}

export const OFFICIAL_REACT_SYMBOLS: ReactSymbolEntry[] = [
  { symbol: '🟢', word: 'انطلق', color: '#10B981', bgGlow: 'rgba(16,185,129,0.3)', category: 'motion' },
  { symbol: '🔵', word: 'اقفز', color: '#3B82F6', bgGlow: 'rgba(59,130,246,0.3)', category: 'motion' },
  { symbol: '🟡', word: 'انتظر', color: '#EAB308', bgGlow: 'rgba(234,179,8,0.3)', category: 'action' },
  { symbol: '🟣', word: 'دور', color: '#A855F7', bgGlow: 'rgba(168,85,247,0.3)', category: 'motion' },
  { symbol: '🟠', word: 'اضرب', color: '#F97316', bgGlow: 'rgba(249,115,22,0.3)', category: 'combat' },
  { symbol: '🔺', word: 'توقف', color: '#EF4444', bgGlow: 'rgba(239,68,68,0.3)', category: 'action' },
  { symbol: '⭐', word: 'صفق', color: '#FACC15', bgGlow: 'rgba(250,204,21,0.3)', category: 'action' },
  { symbol: '🔥', word: 'أسرع', color: '#FF4D4D', bgGlow: 'rgba(255,77,77,0.3)', category: 'special' },
  { symbol: '🛡️', word: 'حماية', color: '#06B6D4', bgGlow: 'rgba(6,182,212,0.3)', category: 'combat' },
  { symbol: '👁️', word: 'راقب', color: '#8B5CF6', bgGlow: 'rgba(139,92,246,0.3)', category: 'special' },
];

export const SILENCE_REACT_SYMBOL: ReactSymbolEntry = {
  symbol: '⚫',
  word: 'صمت',
  color: '#64748B',
  bgGlow: 'rgba(100,116,139,0.3)',
  category: 'special'
};

export const DEFAULT_REACT_STAGES: ReactPrompt[] = [
  {
    id: 'stage-1',
    roundNumber: 1,
    stageMode: 'TUTORIAL',
    stageTitle: 'المرحلة 1: التدريب والتعلم',
    symbols: ['🟢'],
    expectedWords: ['انطلق'],
    timeLimitSec: 3.0,
    descriptionHint: 'تدريب تمهيدي — تذكر أن 🟢 = انطلق'
  },
  {
    id: 'stage-2',
    roundNumber: 2,
    stageMode: 'TUTORIAL',
    stageTitle: 'المرحلة 2: التدريب والتعلم',
    symbols: ['🔵'],
    expectedWords: ['اقفز'],
    timeLimitSec: 3.0,
    descriptionHint: 'تدريب تمهيدي — تذكر أن 🔵 = اقفز'
  },
  {
    id: 'stage-3',
    roundNumber: 3,
    stageMode: 'FOCUS',
    stageTitle: 'المرحلة 3: التركيز',
    symbols: ['🟣'],
    expectedWords: ['دور'],
    timeLimitSec: 2.5,
    descriptionHint: 'اختفت الكلمات المساعدة! اعتمد على ذاكرتك للرمز 🟣'
  },
  {
    id: 'stage-4',
    roundNumber: 4,
    stageMode: 'SPEED',
    stageTitle: 'المرحلة 4: السرعة المتسارعة',
    symbols: ['🔥'],
    expectedWords: ['أسرع'],
    timeLimitSec: 1.8,
    descriptionHint: 'الوقت يتناقص! تفاعل بأقصى سرعة مع الرمز 🔥'
  },
  {
    id: 'stage-5',
    roundNumber: 5,
    stageMode: 'SPEED',
    stageTitle: 'المرحلة 5: السرعة الفائقة',
    symbols: ['🛡️'],
    expectedWords: ['حماية'],
    timeLimitSec: 1.4,
    descriptionHint: 'رد فعل خاطف! الرمز 🛡️'
  },
  {
    id: 'stage-6',
    roundNumber: 6,
    stageMode: 'CHAIN',
    stageTitle: 'المرحلة 6: سلسلة الرموز الثلاثية',
    symbols: ['🟢', '🔵', '🟣'],
    expectedWords: ['انطلق', 'اقفز', 'دور'],
    timeLimitSec: 2.8,
    descriptionHint: 'اكتب الكلمات الثلاث بالترتيب الصحيح مفصولة بمسافة!'
  },
  {
    id: 'stage-7',
    roundNumber: 7,
    stageMode: 'MEMORY',
    stageTitle: 'المرحلة 7: تحدي الذاكرة المؤقتة',
    symbols: ['⭐', '🔥', '👁️'],
    expectedWords: ['صفق', 'أسرع', 'راقب'],
    timeLimitSec: 3.5,
    memoryConcealAfterSec: 1.8,
    descriptionHint: 'ستختفي الرموز بعد ثانيتين! احفظ الترتيب واكتبه'
  },
  {
    id: 'stage-8',
    roundNumber: 8,
    stageMode: 'DECEPTION',
    stageTitle: 'المرحلة 8: الخداع البصري (تأثير ستروب)',
    symbols: ['🟣'],
    expectedWords: ['دور'],
    displayedDistractorWord: 'انطلق',
    timeLimitSec: 2.0,
    descriptionHint: 'تحذير: تجاهل الكلمة المكتوبة بالأسفل واعتمد على الرمز فقط!'
  },
  {
    id: 'stage-9',
    roundNumber: 9,
    stageMode: 'SILENCE',
    stageTitle: 'المرحلة 9: قاعدة الصمت التام ⚫',
    symbols: ['⚫'],
    expectedWords: [],
    isSilenceRule: true,
    timeLimitSec: 2.5,
    descriptionHint: 'توقف تام! لا ترسل أي أمر حتى ينتهي المؤقت'
  },
  {
    id: 'stage-10',
    roundNumber: 10,
    stageMode: 'FINAL',
    stageTitle: 'المرحلة 10: النهائي الكبير — FINAL REACT ⚡',
    symbols: ['🔥', '🛡️', '⭐', '🔺'],
    expectedWords: ['أسرع', 'حماية', 'صفق', 'توقف'],
    timeLimitSec: 2.5,
    descriptionHint: 'السلسلة الرباعية الحاسمة! من يتوج بلقب بطل REACT 👑'
  }
];

/**
 * Normalizes Arabic text by removing tatweel, standardizing alef/hamza and teh marbuta.
 */
export function normalizeReactArabicText(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .replace(/[\u064B-\u065F\u0640]/g, '') // Remove tashkeel & tatweel
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ');
}

export interface ParseReactResult {
  isRecognizedGameWord: boolean;
  isCorrect: boolean;
  matchedWords: string[];
  isSilenceViolation: boolean;
  scoreEarned: number;
  isSpeedBonus: boolean;
}

/**
 * Validates player's comment against current React prompt.
 */
export function parseReactComment(
  commentText: string,
  prompt: ReactPrompt,
  reactionTimeMs: number
): ParseReactResult {
  const normalizedComment = normalizeReactArabicText(commentText);
  const commentTokens = normalizedComment.split(' ').filter(Boolean);

  // Check if comment contains any official game words
  const allOfficialNormalizedWords = [
    ...OFFICIAL_REACT_SYMBOLS.map(s => normalizeReactArabicText(s.word)),
    'صمت'
  ];

  const hasAnyGameWord = commentTokens.some(token => allOfficialNormalizedWords.includes(token));

  // 1. SILENCE RULE HANDLING
  if (prompt.isSilenceRule) {
    if (hasAnyGameWord) {
      return {
        isRecognizedGameWord: true,
        isCorrect: false,
        matchedWords: commentTokens,
        isSilenceViolation: true,
        scoreEarned: 0,
        isSpeedBonus: false
      };
    }
    // Normal chat during silence is ignored
    return {
      isRecognizedGameWord: false,
      isCorrect: true, // Silence maintained
      matchedWords: [],
      isSilenceViolation: false,
      scoreEarned: 100,
      isSpeedBonus: false
    };
  }

  // If not silence rule and has no recognized game words (e.g. "يلاااا", "ههههه"), ignore without penalty
  if (!hasAnyGameWord) {
    return {
      isRecognizedGameWord: false,
      isCorrect: false,
      matchedWords: [],
      isSilenceViolation: false,
      scoreEarned: 0,
      isSpeedBonus: false
    };
  }

  // 2. CHECK EXACT SEQUENCE MATCHING
  const expectedNormalized = prompt.expectedWords.map(w => normalizeReactArabicText(w));

  // For single symbol: player can write just the word
  // For chain/memory: must match exact tokens in order
  const isMatch = (
    commentTokens.length === expectedNormalized.length &&
    commentTokens.every((token, idx) => token === expectedNormalized[idx])
  ) || (
    expectedNormalized.length === 1 &&
    commentTokens.includes(expectedNormalized[0])
  );

  if (isMatch) {
    const totalTimeLimitMs = prompt.timeLimitSec * 1000;
    const isSpeedBonus = reactionTimeMs <= totalTimeLimitMs * 0.35; // Fast reaction within first 35%
    const scoreEarned = 100 + (isSpeedBonus ? 50 : 0);

    return {
      isRecognizedGameWord: true,
      isCorrect: true,
      matchedWords: commentTokens,
      isSilenceViolation: false,
      scoreEarned,
      isSpeedBonus
    };
  }

  // Player attempted a recognized game word but got it wrong
  return {
    isRecognizedGameWord: true,
    isCorrect: false,
    matchedWords: commentTokens,
    isSilenceViolation: false,
    scoreEarned: 0,
    isSpeedBonus: false
  };
}

/**
 * Generates mock players for instant testing of the REACT engine.
 */
export function generateMockReactPlayers(count: number = 15): ReactPlayer[] {
  const names = [
    'أحمد', 'سالم', 'محمد', 'خالد', 'ناصر', 'فهد', 'عمر', 'طارق', 'ياسر', 'سعود',
    'فيصل', 'عبدالله', 'راشد', 'ماجد', 'بدر', 'زياد', 'هشام', 'وليد', 'منصور', 'سامي'
  ];

  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  ];

  const players: ReactPlayer[] = [];

  for (let i = 0; i < count; i++) {
    const name = names[i % names.length] + (i >= names.length ? ` ${i + 1}` : '');
    const avatar = avatars[i % avatars.length];

    players.push({
      id: `react-p-${i + 1}`,
      tiktokUserId: `tt_user_${1000 + i}`,
      tiktokUsername: `user_${1000 + i}`,
      displayName: name,
      avatarUrl: avatar,
      score: 0,
      hearts: 10,
      isEliminated: false,
      combo: 0,
      maxCombo: 0,
      totalCorrect: 0,
      totalWrong: 0,
      fastestReactionMs: 9999
    });
  }

  return players;
}

/**
 * ══════════════════════════════════════════════════════════════
 * 🔢 GUESS THE NUMBER — GAME ENGINE & NUMBER GENERATOR
 * ══════════════════════════════════════════════════════════════
 */

export function generateSecretNumber(
  digitType: NumberDigitType,
  usedNumbers: Set<number> = new Set()
): number {
  let min = 1;
  let max = 9;

  switch (digitType) {
    case 'SINGLE':
      min = 1;
      max = 9;
      break;
    case 'DOUBLE':
      min = 10;
      max = 99;
      break;
    case 'TRIPLE':
      min = 100;
      max = 999;
      break;
    case 'QUADRUPLE':
      min = 1000;
      max = 9999;
      break;
    default:
      min = 10;
      max = 99;
  }

  // Generate unique number not present in usedNumbers
  let attempts = 0;
  let num = Math.floor(Math.random() * (max - min + 1)) + min;
  while (usedNumbers.has(num) && attempts < 500) {
    num = Math.floor(Math.random() * (max - min + 1)) + min;
    attempts++;
  }

  usedNumbers.add(num);
  return num;
}

export function generate5NumberGuessPrompts(existingUsedNumbers: Set<number> = new Set()): ReactPrompt[] {
  const used = new Set(existingUsedNumbers);

  const configs: { digitType: NumberDigitType; titleDesc: string; points: number; timeSec: number }[] = [
    { digitType: 'SINGLE', titleDesc: 'رقم فردي (أحادي) • من 1 إلى 9', points: 100, timeSec: 25 },
    { digitType: 'DOUBLE', titleDesc: 'رقم ثنائي (خانتين) • من 10 إلى 99', points: 150, timeSec: 30 },
    { digitType: 'TRIPLE', titleDesc: 'رقم ثلاثي (3 خانات) • من 100 إلى 999', points: 250, timeSec: 35 },
    { digitType: 'QUADRUPLE', titleDesc: 'رقم رباعي (4 خانات) • من 1000 إلى 9999', points: 400, timeSec: 40 },
    { digitType: 'TRIPLE', titleDesc: 'التحدي الحاسم • رقم ثلاثي من 100 إلى 999', points: 500, timeSec: 30 }
  ];

  return configs.map((cfg, index) => {
    const secNum = generateSecretNumber(cfg.digitType, used);
    const digitsCount = cfg.digitType === 'SINGLE' ? 1 : cfg.digitType === 'DOUBLE' ? 2 : cfg.digitType === 'TRIPLE' ? 3 : 4;
    const minNum = cfg.digitType === 'SINGLE' ? 1 : cfg.digitType === 'DOUBLE' ? 10 : cfg.digitType === 'TRIPLE' ? 100 : 1000;
    const maxNum = cfg.digitType === 'SINGLE' ? 9 : cfg.digitType === 'DOUBLE' ? 99 : cfg.digitType === 'TRIPLE' ? 999 : 9999;

    return {
      id: `num-guess-${index + 1}-${Date.now()}`,
      roundNumber: index + 1,
      stageMode: 'SINGLE',
      stageTitle: `السؤال ${index + 1} من 5`,
      symbols: [String(secNum)],
      expectedWords: [String(secNum)],
      timeLimitSec: cfg.timeSec,
      descriptionHint: cfg.titleDesc,
      digitType: cfg.digitType,
      digitsCount,
      minNumber: minNum,
      maxNumber: maxNum,
      secretNumber: secNum,
      secretNumberString: String(secNum)
    };
  });
}

export function parseNumberGuessComment(rawComment: string): number | null {
  if (!rawComment || typeof rawComment !== 'string') return null;
  const trimmed = rawComment.trim();
  if (!trimmed) return null;

  // Convert Eastern Arabic numerals (٠-٩) to Western (0-9)
  const easternToArabicNumerals: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };

  const normalized = trimmed.replace(/[٠-٩]/g, (char) => easternToArabicNumerals[char] || char);

  // 1. Direct digit matches (e.g. "287", "تخميني 287", "287!", "رقم: 50", "4")
  const digitMatches = normalized.match(/\d+/g);
  if (digitMatches && digitMatches.length > 0) {
    const num = parseInt(digitMatches[0], 10);
    if (!isNaN(num) && num >= 0 && num <= 99999) {
      return num;
    }
  }

  // 2. Exact standalone word numbers only (e.g. comment is strictly "تسعة" or "واحد", never inside phrases like "مافي احد")
  const standaloneWordNumbers: Record<string, number> = {
    'صفر': 0,
    'واحد': 1, 'واحدة': 1,
    'اثنين': 2, 'اثنان': 2,
    'ثلاثة': 3, 'ثلاث': 3, 'تلاتة': 3,
    'اربعة': 4, 'اربع': 4,
    'خمسة': 5, 'خمس': 5,
    'ستة': 6, 'ست': 6,
    'سبعة': 7, 'سبع': 7,
    'ثمانية': 8, 'ثمان': 8, 'تمانية': 8,
    'تسعة': 9, 'تسع': 9,
    'عشرة': 10, 'عشر': 10
  };

  const cleanLettersOnly = normalized.replace(/[^\u0600-\u06FF]/g, '').trim();
  if (cleanLettersOnly && standaloneWordNumbers[cleanLettersOnly] !== undefined) {
    return standaloneWordNumbers[cleanLettersOnly];
  }

  return null;
}

/**
 * Creates initial ReactQuestion (تخمين الأرقام) state for AEP show session.
 */
export function generateReactQuestion(config?: Partial<ReactConfig>): ReactQuestion {
  const initial5Prompts = generate5NumberGuessPrompts();
  const defaultConfig: ReactConfig = {
    maxHearts: config?.maxHearts || 10,
    difficultySpeed: config?.difficultySpeed || 'NORMAL',
    enableMemoryStage: config?.enableMemoryStage ?? true,
    enableDeceptionStage: config?.enableDeceptionStage ?? true,
    enableSilenceStage: config?.enableSilenceStage ?? true,
    totalRounds: 5
  };

  const usedNums = initial5Prompts.map(p => p.secretNumber).filter(Boolean) as number[];

  return {
    id: `num-guess-session-${Date.now()}`,
    engineType: 'react',
    title: '🔢 تخمين الأرقام — GUESS THE NUMBER',
    category: 'ألعاب التخمين والسرعة المباشرة',
    difficulty: 'medium',
    points: 2000,
    timeLimitSeconds: 180,
    acceptableAnswers: initial5Prompts[0]?.expectedWords || [],
    phase: 'INSTRUCTIONS',
    currentRoundNumber: 1,
    totalRounds: 5,
    players: [],
    currentPrompt: initial5Prompts[0],
    config: defaultConfig,
    usedSecretNumbers: usedNums
  };
}

// ══════════════════════════════════════════════════════════════
// 🧠 MEMORY MATCH LIVE — COMMENT COMMAND PARSER
// ══════════════════════════════════════════════════════════════

export interface ParsedMemoryMatchAttempt {
  isValid: boolean;
  posA?: number;
  posB?: number;
  normalizedComment: string;
  error?: string;
}

/**
 * Strict Input Validation for Memory Match Live Comments:
 * Accepts: "1-3", "1 - 3", "5-12", "7-16", "١-٣", "1 و 3", "1, 3", "01-08"
 * Validates: 1 <= posA <= 16, 1 <= posB <= 16, posA !== posB
 */
export function parseMemoryMatchCommand(rawComment: string): ParsedMemoryMatchAttempt {
  if (!rawComment || typeof rawComment !== 'string') {
    return { isValid: false, normalizedComment: '', error: 'تعليق فارغ' };
  }

  // Convert Arabic-Indic numbers (١, ٢, ٣) to ASCII numbers (1, 2, 3)
  let cleaned = convertArabicIndicDigits(rawComment.trim());

  // Replace any separator (dashes, slashes, commas, "+", "و", "مع", "and") between or around numbers with single dash "-"
  cleaned = cleaned.replace(/\s*(?:[-–—_,/+]|(?:\s*(?:و|مع|and)\s*))\s*/gi, '-');

  // Match pattern 1: e.g. "1-3", "1 - 3", "5-12", "١-٣"
  const pairRegex = /(?:^|\s|[#№]|[^\d])(\d{1,2})\s*-\s*(\d{1,2})(?:\s|$|[^\d])/;
  const match = cleaned.match(pairRegex);
  if (match) {
    const a = parseInt(match[1], 10);
    const b = parseInt(match[2], 10);
    return validateMemoryPair(a, b, rawComment);
  }

  // Match pattern 2: fallback to any 2 numbers found in the comment (e.g. "1 3", "افتراضي 5 و 12", "1 14")
  const allNumbers = cleaned.match(/\d{1,2}/g);
  if (allNumbers && allNumbers.length >= 2) {
    const a = parseInt(allNumbers[0], 10);
    const b = parseInt(allNumbers[1], 10);
    return validateMemoryPair(a, b, rawComment);
  }

  return { isValid: false, normalizedComment: rawComment, error: 'صيغة غير صحيحة، اكتب مثال: 1-3' };
}

function validateMemoryPair(a: number, b: number, rawComment: string): ParsedMemoryMatchAttempt {
  if (isNaN(a) || isNaN(b)) {
    return { isValid: false, normalizedComment: rawComment, error: 'أرقام غير صالحة' };
  }

  if (a === b) {
    return { isValid: false, normalizedComment: `${a}-${b}`, error: 'يجب اختيار بطاقتين مختلفتين' };
  }

  if (a < 1 || a > 16 || b < 1 || b > 16) {
    return { isValid: false, normalizedComment: `${a}-${b}`, error: 'الأرقام يجب أن تكون بين 1 و 16' };
  }

  return {
    isValid: true,
    posA: a,
    posB: b,
    normalizedComment: `${a}-${b}`
  };
}

// ══════════════════════════════════════════════════════════════
// 🚌 EXPORT BUS AL-TAYYIBIN ENGINE
// ══════════════════════════════════════════════════════════════
export * from './busTayyibinEngine';

// ══════════════════════════════════════════════════════════════
// 🦑 EXPORT SQUID SURVIVAL ENGINE
// ══════════════════════════════════════════════════════════════
export * from './squidGameEngine';



