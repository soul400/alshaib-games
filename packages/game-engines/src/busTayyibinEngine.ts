import { 
  BusCategory, 
  BusGameConfig, 
  BusGameMode, 
  BusLetterDifficulty, 
  BusLetterInfo, 
  BusPlayer, 
  PlayerAnswer 
} from '@aep/types';

// ══════════════════════════════════════════════════════════════
// 🔤 1. ARABIC LETTERS & DIFFICULTY WEIGHTS
// ══════════════════════════════════════════════════════════════

export const BUS_LETTERS: BusLetterInfo[] = [
  { letter: 'م', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'س', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'ب', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'ع', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'ك', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'ف', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'ن', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'ر', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'ح', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'د', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'ل', weight: 1.0, difficulty: 'EASY', enabled: true },
  { letter: 'ت', weight: 0.9, difficulty: 'EASY', enabled: true },
  { letter: 'ي', weight: 0.9, difficulty: 'EASY', enabled: true },
  { letter: 'ق', weight: 0.8, difficulty: 'NORMAL', enabled: true },
  { letter: 'ش', weight: 0.8, difficulty: 'NORMAL', enabled: true },
  { letter: 'ص', weight: 0.8, difficulty: 'NORMAL', enabled: true },
  { letter: 'ط', weight: 0.8, difficulty: 'NORMAL', enabled: true },
  { letter: 'ه', weight: 0.8, difficulty: 'NORMAL', enabled: true },
  { letter: 'و', weight: 0.8, difficulty: 'NORMAL', enabled: true },
  { letter: 'ز', weight: 0.8, difficulty: 'NORMAL', enabled: true },
  { letter: 'ج', weight: 0.8, difficulty: 'NORMAL', enabled: true },
  { letter: 'خ', weight: 0.8, difficulty: 'NORMAL', enabled: true },
  { letter: 'ا', weight: 0.8, difficulty: 'NORMAL', enabled: true },
  { letter: 'ث', weight: 0.5, difficulty: 'HARD', enabled: true },
  { letter: 'ذ', weight: 0.5, difficulty: 'HARD', enabled: true },
  { letter: 'ض', weight: 0.4, difficulty: 'HARD', enabled: true },
  { letter: 'غ', weight: 0.5, difficulty: 'HARD', enabled: true },
  { letter: 'ظ', weight: 0.3, difficulty: 'EXTREME', enabled: true }
];

// ══════════════════════════════════════════════════════════════
// 📋 2. DEFAULT 6 CORE CATEGORIES
// ══════════════════════════════════════════════════════════════

export const DEFAULT_BUS_CATEGORIES: BusCategory[] = [
  { id: 'boy', name: 'ولد', icon: '👦', order: 1, enabled: true },
  { id: 'girl', name: 'بنت', icon: '👧', order: 2, enabled: true },
  { id: 'animal', name: 'حيوان', icon: '🐾', order: 3, enabled: true },
  { id: 'plant', name: 'نبات', icon: '🌱', order: 4, enabled: true },
  { id: 'inanimate', name: 'جماد', icon: '🧱', order: 5, enabled: true },
  { id: 'country', name: 'بلاد', icon: '🌍', order: 6, enabled: true }
];

export const DEFAULT_BUS_CONFIG: BusGameConfig = {
  mode: 'CLASSIC',
  durationSeconds: 30,
  difficulty: 'EASY',
  joinKeyword: 'العب',
  finishKeyword: 'تم',
  uniquePoints: 10,
  duplicatePoints: 5,
  wrongPoints: 0,
  incompleteFinishPenalty: 5,
  minPlayers: 1,
  maxPlayers: 500,
  categories: DEFAULT_BUS_CATEGORIES,
  soundEnabled: true
};

// ══════════════════════════════════════════════════════════════
// 🧹 3. ARABIC NORMALIZATION HELPER
// ══════════════════════════════════════════════════════════════

export function normalizeBusWord(raw: string): string {
  if (!raw) return '';

  let str = raw.trim().toLowerCase();

  // Convert Arabic-Indic numerals
  const easternMap: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  str = str.replace(/[٠-٩]/g, d => easternMap[d] || d);

  // Normalize Alef, Taa Marbuta, Yaa
  str = str
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '') // Remove Harakat/Tashkeel
    .replace(/[^\w\s\u0600-\u06FF]/gi, ' ') // Remove punctuation
    .replace(/\s+/g, ' ')
    .trim();

  return str;
}

/**
 * Checks if a word starts with the target letter (allowing optional 'ال' prefix)
 */
export function wordStartsWithLetter(word: string, targetLetter: string): boolean {
  const normWord = normalizeBusWord(word);
  const normTarget = normalizeBusWord(targetLetter);

  if (!normWord || !normTarget) return false;

  // Direct start
  if (normWord.startsWith(normTarget)) return true;

  // 'ال' prefix start (e.g. الموز under م)
  if (normWord.startsWith('ال') && normWord.slice(2).startsWith(normTarget)) {
    return true;
  }

  return false;
}

// ══════════════════════════════════════════════════════════════
// 📚 4. COMPREHENSIVE ARABIC DICTIONARY & VALIDATION SETS
// ══════════════════════════════════════════════════════════════

export const ARABIC_DICTIONARY: Record<string, string[]> = {
  // 👦 الأولاد
  boy: [
    'محمد', 'احمد', 'محمود', 'مصطفى', 'ماجد', 'مروان', 'مازن', 'مهند', 'مالك', 'منصور', 'معاذ', 'مبارك', 'مساعد', 'مشاري', 'مطلق', 'متعب', 'مسفر', 'مؤيد', 'مقبل',
    'سعد', 'سعود', 'سلمان', 'سلطان', 'سالم', 'سامي', 'سليمان', 'سهيل', 'سعيد', 'سراج', 'سيف', 'سامر', 'سفيان',
    'علي', 'عمر', 'عبدالله', 'عبدالرحمن', 'عبدالعزيز', 'عبدالملك', 'عبدالمجيد', 'عثمان', 'عمار', 'عامر', 'عادل', 'عصام', 'عدنان', 'عقيل', 'عباس', 'عمران',
    'خالد', 'خليل', 'خلف', 'خطاب', 'خزعل', 'خميس',
    'فهد', 'فيصل', 'فارس', 'فراس', 'فؤاد', 'فواز', 'فادي', 'فريد', 'فلاح', 'فاروق',
    'بدر', 'بندر', 'باسم', 'بشير', 'براء', 'باسل', 'بلال', 'بشار', 'بكر',
    'تركي', 'تميم', 'تامر', 'طارق', 'طلال', 'طاهر', 'طه', 'ظافر',
    'راشد', 'ريان', 'رامي', 'رضا', 'رياض', 'رائد', 'رمزي', 'رستم',
    'ياسر', 'يوسف', 'يحيى', 'يعقوب', 'يزيد', 'يمان', 'يونس', 'ياسين',
    'نايف', 'ناصر', 'نواف', 'نادر', 'نبيل', 'نزار', 'نجيب', 'نورس',
    'حسن', 'حسين', 'حمد', 'حمزة', 'حسام', 'حازم', 'حاتم', 'حبيب', 'حيدر',
    'ابراهيم', 'اسماعيل', 'ايمن', 'امير', 'انس', 'اكرم', 'ادهم', 'انور', 'اسامة', 'اياد'
  ],

  // 👧 البنات
  girl: [
    'مريم', 'منى', 'منيرة', 'مها', 'مي', 'ميساء', 'ملاك', 'مرام', 'ميسون', 'منال', 'مروة', 'مديحة', 'مهرة', 'مايا', 'ميرنا', 'منار', 'مودة',
    'سارة', 'سلمى', 'سعاد', 'سمر', 'سهى', 'سوسن', 'سما', 'سحر', 'سناء', 'سلطانة', 'سندس', 'سميرة', 'سيرين', 'سهام',
    'نورة', 'نوف', 'نجلاء', 'ندى', 'نهى', 'نورا', 'نسرين', 'نوال', 'نادية', 'نرمين', 'نعمة', 'نوران', 'ناهد',
    'فاطمة', 'فريدة', 'فرح', 'فوزية', 'فاتن', 'فدوى', 'فيروز', 'فايزة',
    'ريم', 'رنا', 'رند', 'رهف', 'ريما', 'روان', 'رشا', 'رحاب', 'رقية', 'رغد', 'رانيا', 'ريحانة', 'رجاء',
    'هند', 'هيا', 'هدى', 'هناء', 'هلا', 'هالة', 'هاجر', 'همسة', 'هديل',
    'عائشة', 'عبير', 'عفاف', 'عهود', 'علا', 'علياء', 'عنود', 'عزيزة', 'عذاري',
    'ليلى', 'لمى', 'لطيفة', 'لبنى', 'لين', 'لينا', 'لجين', 'لمياء', 'لولوة',
    'ياسمين', 'يسرى', 'يارا', 'يمامة', 'يقين',
    'دلال', 'ديما', 'دانة', 'دانية', 'دعاء', 'درة', 'دارين',
    'امل', 'اميرة', 'اسماء', 'ايمان', 'اروى', 'ايات', 'احلام', 'اسيل', 'افنان', 'انوار', 'ابتسام', 'الهام'
  ],

  // 🐾 الحيوانات
  animal: [
    'ماعز', 'مهر', 'مها', 'موشي', 'ماموث', 'مدرع', 'مكاك',
    'اسد', 'ارنب', 'افعى', 'اخطبوط', 'ابل', 'ابن اوى', 'ايقوانا',
    'نمر', 'نسر', 'نورس', 'نحلة', 'نملة', 'نعامة', 'ناقة', 'نمس',
    'فهد', 'فيل', 'فار', 'فراشة', 'فقمة', 'فرس النهر', 'فلامنجو',
    'حصان', 'حمار', 'حوت', 'حرباء', 'حمامة', 'حلزون', 'حشرة',
    'كلب', 'كنغر', 'كوالا', 'كروان', 'كبش', 'كركدن',
    'دب', 'دلفين', 'ديك', 'دودة', 'دجاجة', 'دراج',
    'ثعلب', 'ثور', 'ثعبان',
    'ذئب', 'ذباب',
    'صقر', 'صرصور', 'ضفدع', 'ضبع', 'ضب',
    'طاووس', 'طائر', 'طوقان', 'ظبي',
    'غزال', 'غراب', 'غوريلا',
    'قرد', 'قط', 'قنفذ', 'قرش', 'قمري',
    'زرافة', 'زنبور', 'زرزور',
    'جمل', 'جراد', 'جاموس', 'جندب',
    'خروف', 'خنزير', 'خفاش', 'خلد',
    'يمامة', 'يعسوب', 'يربوع'
  ],

  // 🌱 النباتات والفواكه والخضار
  plant: [
    'موز', 'مانجو', 'مشمش', 'ملفوف', 'ميرمية', 'مورينجا', 'مردقوش', 'مسك الروم', 'مرمية',
    'تفاح', 'تمر', 'تين', 'توت', 'ترمس', 'تونة الشوك',
    'برتقال', 'بطيخ', 'بصل', 'باذنجان', 'بقدونس', 'بامية', 'بندق', 'بازلاء', 'بابايا', 'بنفسج', 'بيلسان',
    'عنب', 'عدس', 'عليق', 'عرعر', 'عصفر', 'عناب',
    'ليمون', 'لوبيا', 'لوز', 'لافندر', 'لوتس', 'لفت',
    'فراولة', 'فستق', 'فلفل', 'فول', 'فجل', 'فطر',
    'رمان', 'ريحان', 'راوند', 'رشاد', 'رز',
    'خيار', 'خوخ', 'خس', 'خرشوف', 'خردل', 'خزامى',
    'جزر', 'جوز', 'جرجير', 'جريب فروت', 'جوافة', 'جلنار',
    'طماطم', 'طرخون', 'طلح',
    'قرنبيط', 'قرع', 'قرفة', 'قمح', 'قصب السكر', 'قورو',
    'زيتون', 'زعتر', 'زنجبيل', 'زعفران', 'زنبق',
    'شاي', 'شمندر', 'شمام', 'شمر', 'شيبث',
    'يقطين', 'يانسون', 'ياسمين', 'يوكا',
    'افوكادو', 'اناناس', 'ارز', 'اقحوان', 'اوركيد'
  ],

  // 🧱 الجماد والأدوات
  inanimate: [
    'مفتاح', 'مكتب', 'مرآة', 'مصباح', 'مروحة', 'مقص', 'مسطرة', 'ملعقة', 'مطرقة', 'منشار', 'مدفع', 'منشفة', 'مغناطيس', 'مذياع', 'مسبحة', 'محفظة', 'مظلة',
    'سيارة', 'ساعة', 'سكين', 'سرير', 'سفينة', 'سياج', 'سلك', 'سبورة', 'سجادة', 'سيف', 'ستارة', 'سلسلة', 'سلم',
    'باب', 'بيت', 'برج', 'برميل', 'بوصلة', 'بندقية', 'بلورة', 'بطاقة', 'بساط', 'براد',
    'قلم', 'قارب', 'قصر', 'قفل', 'قبعة', 'قفل', 'قطار', 'قناع', 'قارورة', 'قميص',
    'طاولة', 'طائرة', 'طوق', 'طوبة', 'طبلة', 'طاحونة', 'طفاية',
    'كتاب', 'كرسي', 'كوب', 'كرة', 'كاميرا', 'كمبيوتر', 'كابل', 'كشاف', 'كيس',
    'درج', 'دفتر', 'دبوس', 'دولاب', 'درع', 'دراجة', 'دلة', 'دلو',
    'حقيبة', 'حبل', 'حجر', 'حذاء', 'حزام', 'حاسوب', 'حائط',
    'نافذة', 'نظارة', 'نفق', 'ناقوس', 'نول', 'نرد',
    'هاتف', 'هرم', 'هيكل', 'هاون',
    'لوحة', 'لمبة', 'لحاف', 'لوح',
    'فأس', 'فنجان', 'فرن', 'فستان', 'فانوس',
    'عرش', 'عصا', 'عجلة', 'عمارة', 'علم',
    'جرار', 'جسر', 'جرس', 'جدار', 'جريدة', 'جهاز',
    'ابرة', 'اريكة', 'انبوب', 'ابريق', 'اسطوانة'
  ],

  // 🌍 البلاد والمدن والعواصم
  country: [
    'مصر', 'موريتانيا', 'مدريد', 'مسقط', 'مراكش', 'مكسيكو', 'موسكو', 'ماليزيا', 'المغرب', 'مانيلا', 'مقديشو', 'موناكو', 'مالي', 'مالطا', 'ميونخ', 'ملبورن', 'مكة', 'المدينة',
    'سعودية', 'السعودية', 'سوريا', 'سودان', 'السودان', 'سويسرا', 'سويد', 'السويد', 'سلطنة عمان', 'سنغافورة', 'سول', 'سراييفو', 'سلوفاكيا', 'سلوفينيا', 'سيدني',
    'كويت', 'الكويت', 'قطر', 'كندا', 'كوبا', 'كينيا', 'كرواتيا', 'كولومبيا', 'كييف', 'كوالالمبور', 'كازاخستان', 'كابول',
    'بحرين', 'البحرين', 'برازيل', 'البرازيل', 'بلجيكا', 'بريطانيا', 'بغداد', 'بيروت', 'برلين', 'باريس', 'بكين', 'بانكوك', 'بوخارست', 'بودابست', 'برتغال', 'بولندا',
    'عراق', 'العراق', 'عمان', 'عمان', 'الامارات', 'امريكا', 'المانيا', 'اندونيسيا', 'ايطاليا', 'اسبانيا', 'استراليا', 'الارجنتين', 'الجزائر', 'اثينا', 'انقرة',
    'فرنسا', 'فلسطين', 'فنلندا', 'فيتنام', 'فنزويلا', 'فرانكفورت', 'فيينا',
    'تونس', 'تركيا', 'تشاد', 'تايلاند', 'طوكيو', 'طرابلس', 'طهران', 'تايبيه',
    'يمن', 'اليمن', 'يونان', 'اليونان', 'يابان', 'اليابان', 'يريفان',
    'روسيا', 'رياض', 'الرياض', 'روما', 'رباط', 'الرباط', 'رومانيا', 'رواندا',
    'هند', 'الهند', 'هولندا', 'هنغاريا', 'هلسنكي', 'هانوي',
    'لبنان', 'ليبيا', 'لندن', 'لشبونة', 'لوكسمبورغ', 'ليما',
    'نيجيريا', 'نرويج', 'النرويج', 'نيودلهي', 'نيروبي', 'نيوزيلندا', 'النمسا',
    'دبي', 'الدوحة', 'دمشق', 'دبلن', 'دنمارك', 'الدانمارك'
  ]
};

// ══════════════════════════════════════════════════════════════
// 🔍 5. BUS COMMENT PARSER ENGINE
// ══════════════════════════════════════════════════════════════

export interface ParsedBusComment {
  isJoinCommand: boolean;
  isFinishCommand: boolean;
  extractedAnswers: Record<string, string>; // categoryId -> extracted word
  rawTokens: string[];
}

export function parseBusComment(
  rawComment: string,
  categories: BusCategory[],
  config: BusGameConfig = DEFAULT_BUS_CONFIG
): ParsedBusComment {
  const norm = normalizeBusWord(rawComment);
  const result: ParsedBusComment = {
    isJoinCommand: false,
    isFinishCommand: false,
    extractedAnswers: {},
    rawTokens: []
  };

  if (!norm) return result;

  const joinKw = normalizeBusWord(config.joinKeyword || 'العب');
  const finishKw = normalizeBusWord(config.finishKeyword || 'تم');

  // Check Join Command
  if (norm === joinKw || norm.includes(joinKw) || norm === 'لعب' || norm === 'دخول' || norm === 'اشترك') {
    result.isJoinCommand = true;
  }

  // Check Finish Command
  if (norm === finishKw || norm === 'تمم' || norm === 'خلصت' || norm === 'تمت' || norm.startsWith('تم ') || norm.endsWith(' تم')) {
    result.isFinishCommand = true;
  }

  // If comment is just a command, stop here
  if (result.isJoinCommand && norm.split(' ').length <= 2) return result;

  // 1. Check Numbered / Labeled Format (e.g. "1: محمد 2: مريم" or "1 محمد 2 مريم")
  const numberedPattern = /(?:^|\s)(?:[1-6]|ولد|بنت|حيوان|نبات|جماد|بلاد)[:\-\s]+([^\d1-6:]+)/gi;
  const matches = [...rawComment.matchAll(/(?:([1-6]|ولد|بنت|حيوان|نبات|جماد|بلاد)[:\-\s]+)?([\u0600-\u06FF\w]+)/g)];

  const categoryMap: Record<string, string> = {
    '1': 'boy', 'ولد': 'boy',
    '2': 'girl', 'بنت': 'girl',
    '3': 'animal', 'حيوان': 'animal',
    '4': 'plant', 'نبات': 'plant',
    '5': 'inanimate', 'جماد': 'inanimate',
    '6': 'country', 'بلاد': 'country'
  };

  // Check if explicit numbered matches exist
  let hasExplicitIndexing = false;
  matches.forEach(m => {
    const key = m[1]?.trim();
    const val = m[2]?.trim();
    if (key && categoryMap[key] && val) {
      const catId = categoryMap[key];
      result.extractedAnswers[catId] = val;
      hasExplicitIndexing = true;
    }
  });

  // 2. If no explicit indexing, treat as ordered space-separated word list: "محمد مريم ماعز موز مفتاح مصر"
  if (!hasExplicitIndexing) {
    const tokens = rawComment
      .replace(/[^\u0600-\u06FF\w\s]/g, ' ')
      .split(/\s+/)
      .map(t => t.trim())
      .filter(t => t.length > 0 && t !== joinKw && t !== finishKw);

    result.rawTokens = tokens;

    // Map sequentially to available enabled categories
    const sortedCats = [...categories].filter(c => c.enabled).sort((a, b) => a.order - b.order);
    tokens.slice(0, sortedCats.length).forEach((token, idx) => {
      const cat = sortedCats[idx];
      if (cat && token) {
        result.extractedAnswers[cat.id] = token;
      }
    });
  }

  return result;
}

// ══════════════════════════════════════════════════════════════
// ⚖️ 6. ANSWER VALIDATION ENGINE
// ══════════════════════════════════════════════════════════════

export function validateBusAnswer(
  rawWord: string,
  categoryId: string,
  requiredLetter: string
): { isValid: boolean; normalized: string; reason?: string } {
  if (!rawWord || !rawWord.trim()) {
    return { isValid: false, normalized: '', reason: 'إجابة فارغة' };
  }

  const normalized = normalizeBusWord(rawWord);

  // 1. Check if word starts with required letter
  if (!wordStartsWithLetter(normalized, requiredLetter)) {
    return { 
      isValid: false, 
      normalized, 
      reason: `الكلمة لا تبدأ بحرف (${requiredLetter})` 
    };
  }

  // 2. Check dictionary validation
  const dict = ARABIC_DICTIONARY[categoryId] || [];
  const cleanWordNoAl = normalized.startsWith('ال') ? normalized.slice(2) : normalized;

  // Exact match in curated dictionary
  const inDict = dict.some(w => {
    const normW = normalizeBusWord(w);
    const normWNoAl = normW.startsWith('ال') ? normW.slice(2) : normW;
    return normW === normalized || normWNoAl === cleanWordNoAl;
  });

  // If in curated dictionary, it's 100% valid
  if (inDict) {
    return { isValid: true, normalized };
  }

  // Dynamic heuristic: If valid letter start and length >= 2 letters, accept as valid Arabic vocabulary
  if (cleanWordNoAl.length >= 2 && /^[\u0600-\u06FF]+$/.test(cleanWordNoAl)) {
    return { isValid: true, normalized };
  }

  return { isValid: false, normalized, reason: 'كلمة غير معروفة' };
}

// ══════════════════════════════════════════════════════════════
// 🏆 7. ROUND SCORING & UNIQUE/DUPLICATE COMPARISON ENGINE
// ══════════════════════════════════════════════════════════════

export function calculateBusRoundScores(
  players: BusPlayer[],
  categories: BusCategory[],
  config: BusGameConfig = DEFAULT_BUS_CONFIG,
  rejectedAnswers: Record<string, string[]> = {}
): {
  updatedPlayers: BusPlayer[];
  categoryStats: Record<string, { answer: string; count: number; isUnique: boolean; isRejected: boolean; players: string[] }[]>;
} {
  const isGoldenBus = config.mode === 'GOLDEN_BUS';
  const uniquePts = isGoldenBus ? 20 : (config.uniquePoints ?? 10);
  const duplicatePts = isGoldenBus ? 0 : (config.duplicatePoints ?? 5);

  const updatedPlayers = players.map(p => ({
    ...p,
    roundScore: 0,
    validAnswers: 0,
    uniqueAnswers: 0,
    duplicateAnswers: 0,
    answers: { ...p.answers }
  }));

  const categoryStats: Record<string, { answer: string; count: number; isUnique: boolean; isRejected: boolean; players: string[] }[]> = {};

  // Analyze each category across all players
  categories.filter(c => c.enabled).forEach(cat => {
    const rejectedForThisCat = (rejectedAnswers[cat.id] || []).map(w => {
      const nw = normalizeBusWord(w);
      return nw.startsWith('ال') ? nw.slice(2) : nw;
    });

    // Map normalizedAnswer -> list of players who submitted it
    const validAnswerPlayerMap = new Map<string, BusPlayer[]>();
    const rejectedAnswerPlayerMap = new Map<string, BusPlayer[]>();

    updatedPlayers.forEach(player => {
      const ans = player.answers[cat.id];
      if (ans && ans.normalized) {
        const key = ans.normalized.startsWith('ال') ? ans.normalized.slice(2) : ans.normalized;
        const isManuallyRejected = rejectedForThisCat.includes(key);

        if (ans.status !== 'invalid' && !isManuallyRejected) {
          if (!validAnswerPlayerMap.has(key)) {
            validAnswerPlayerMap.set(key, []);
          }
          validAnswerPlayerMap.get(key)!.push(player);
        } else if (isManuallyRejected) {
          ans.status = 'invalid';
          ans.score = 0;
          if (!rejectedAnswerPlayerMap.has(key)) {
            rejectedAnswerPlayerMap.set(key, []);
          }
          rejectedAnswerPlayerMap.get(key)!.push(player);
        }
      }
    });

    const statsList: { answer: string; count: number; isUnique: boolean; isRejected: boolean; players: string[] }[] = [];

    // 1. Assign points for approved valid answers based on uniqueness
    validAnswerPlayerMap.forEach((playerList, answerKey) => {
      const count = playerList.length;
      const isUnique = count === 1;
      const score = isUnique ? uniquePts : duplicatePts;

      statsList.push({
        answer: answerKey,
        count,
        isUnique,
        isRejected: false,
        players: playerList.map(p => p.displayName)
      });

      playerList.forEach(player => {
        const playerAns = player.answers[cat.id];
        if (playerAns) {
          playerAns.status = isUnique ? 'valid' : 'duplicate';
          playerAns.score = score;
          playerAns.duplicateCount = count;

          player.roundScore += score;
          player.validAnswers += 1;
          if (isUnique) player.uniqueAnswers += 1;
          else player.duplicateAnswers += 1;
        }
      });
    });

    // 2. Include rejected answers in the stats list so the host can see them and un-reject if desired
    rejectedAnswerPlayerMap.forEach((playerList, answerKey) => {
      statsList.push({
        answer: answerKey,
        count: playerList.length,
        isUnique: false,
        isRejected: true,
        players: playerList.map(p => p.displayName)
      });

      playerList.forEach(player => {
        const playerAns = player.answers[cat.id];
        if (playerAns) {
          playerAns.status = 'invalid';
          playerAns.score = 0;
        }
      });
    });

    categoryStats[cat.id] = statsList.sort((a, b) => (a.isRejected === b.isRejected ? b.count - a.count : a.isRejected ? 1 : -1));
  });

  // Apply Incomplete Finish Penalty (-5 points)
  updatedPlayers.forEach(player => {
    if (player.hasIncompleteFinishPenalty) {
      player.roundScore = Math.max(0, player.roundScore - (config.incompleteFinishPenalty || 5));
    }
    player.totalScore += player.roundScore;
  });

  // Sort players by roundScore desc, uniqueAnswers desc, finish time asc
  updatedPlayers.sort((a, b) => {
    if (b.roundScore !== a.roundScore) return b.roundScore - a.roundScore;
    if (b.uniqueAnswers !== a.uniqueAnswers) return b.uniqueAnswers - a.uniqueAnswers;
    if (a.finishedAt && b.finishedAt) return a.finishedAt - b.finishedAt;
    return b.validAnswers - a.validAnswers;
  });

  return {
    updatedPlayers,
    categoryStats
  };
}

// ══════════════════════════════════════════════════════════════
// 🎲 8. LETTER SELECTION UTILITIES (Seeded / Weighted)
// ══════════════════════════════════════════════════════════════

export function selectRandomBusLetter(
  difficulty: BusLetterDifficulty = 'EASY',
  excludedLetters: string[] = []
): BusLetterInfo {
  const allowed = BUS_LETTERS.filter(l => {
    if (!l.enabled) return false;
    if (excludedLetters.includes(l.letter)) return false;
    if (difficulty === 'EASY' && l.difficulty !== 'EASY') return false;
    if (difficulty === 'NORMAL' && (l.difficulty === 'HARD' || l.difficulty === 'EXTREME')) return false;
    if (difficulty === 'HARD' && l.difficulty === 'EXTREME') return false;
    return true;
  });

  const pool = allowed.length > 0 ? allowed : BUS_LETTERS;
  const randIdx = Math.floor(Math.random() * pool.length);
  return pool[randIdx] || BUS_LETTERS[0];
}

// ══════════════════════════════════════════════════════════════
// 👥 9. MOCK / SIMULATED LIVE PLAYERS GENERATOR (For Testing & Demo)
// ══════════════════════════════════════════════════════════════

export function generateMockBusPlayers(letter: string, count: number = 8): BusPlayer[] {
  const names = [
    { username: '@ali_alshammari', displayName: 'علي الشمري' },
    { username: '@sara_otb', displayName: 'سارة العتيبي' },
    { username: '@fهد_الغامدي', displayName: 'فهد الغامدي' },
    { username: '@nora_qahtani', displayName: 'نورة القحطاني' },
    { username: '@salem_dosari', displayName: 'سالم الدوسري' },
    { username: '@reem_shehri', displayName: 'ريم الشهري' },
    { username: '@khalid_mutairi', displayName: 'خالد المطيري' },
    { username: '@atheer_anzi', displayName: 'أثير العنزي' }
  ];

  const players: BusPlayer[] = [];

  names.slice(0, count).forEach((n, idx) => {
    const answers: Record<string, PlayerAnswer> = {};

    DEFAULT_BUS_CATEGORIES.forEach(cat => {
      const dict = ARABIC_DICTIONARY[cat.id] || [];
      const matchWords = dict.filter(w => wordStartsWithLetter(w, letter));
      const word = matchWords[idx % matchWords.length] || `${letter}${cat.name}`;

      answers[cat.id] = {
        categoryId: cat.id,
        categoryName: cat.name,
        raw: word,
        normalized: normalizeBusWord(word),
        submittedAt: Date.now() - (30000 - idx * 2000),
        status: 'valid',
        score: 0
      };
    });

    players.push({
      userId: `mock-bus-user-${idx + 1}`,
      username: n.username,
      displayName: n.displayName,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.displayName}`,
      joinedAt: Date.now() - 40000,
      answers,
      roundScore: 0,
      totalScore: 0,
      validAnswers: 6,
      uniqueAnswers: 0,
      duplicateAnswers: 0,
      finishedAt: idx === 0 ? Date.now() - 12000 : undefined,
      isFinisher: idx === 0
    });
  });

  return players;
}
