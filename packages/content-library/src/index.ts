import { AnyQuestion, BaseQuestion, EngineType, ImportReport } from '@aep/types';
import { 
  normalizeAnswer, 
  generateVaultQuestion, 
  generateBombPassQuestion, 
  generateReactQuestion, 
  generateMusicalChairsQuestion,
  generateSquidQuestion
} from '@aep/game-engines';
import { WORLD_FLAGS_QUESTIONS } from './flags-data';
import { ALPHABET_QUESTION_BANK, AlphabetBankQuestion } from './alphabet-data';
import { WHAT_DO_THEY_SAY_BANK, generateWhatDoTheySayQuestion } from './what-do-they-say-data';
import { MEMORY_IMAGE_LIBRARY, generateMemoryCardsForRound, generateMemoryMatchQuestion } from './memory-match-data';
import { CAPITALS_DATA, generateCapitalsQuestion, generateCapitalsRoundQuestions, isCapitalAnswerCorrect, normalizeCapitalAnswer } from './capitals-data';
import { NATIONAL_DAY_96_BANK, getNationalDayQuestionsByActivity, normalizeNationalDayAnswer, isNationalDayAnswerMatch } from './national-day-96-bank';

export { 
  generateBombPassQuestion, 
  generateReactQuestion, 
  generateWhatDoTheySayQuestion, 
  generateMusicalChairsQuestion, 
  generateVaultQuestion, 
  generateMemoryMatchQuestion, 
  generateMemoryCardsForRound,
  generateCapitalsQuestion,
  generateCapitalsRoundQuestions,
  generateSquidQuestion,
  isCapitalAnswerCorrect,
  normalizeCapitalAnswer,
  NATIONAL_DAY_96_BANK,
  getNationalDayQuestionsByActivity,
  normalizeNationalDayAnswer,
  isNationalDayAnswerMatch
};

export { ALPHABET_QUESTION_BANK, WHAT_DO_THEY_SAY_BANK, MEMORY_IMAGE_LIBRARY, CAPITALS_DATA };
export type { AlphabetBankQuestion };

export interface GameEngineSectionInfo {
  id: EngineType;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  category: string;
  questionsCount: number;
  avgPoints: number;
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
  badgeColor: string;
}

/**
 * Detailed Metadata for the Game Engine Sections
 */
export const GAME_ENGINE_SECTIONS: GameEngineSectionInfo[] = [
  {
    id: 'squid-game',
    title: 'لعبة «الحبار» 🦑',
    titleEn: 'Squid Survival Live Action',
    description: 'تحدي خطوات ونجاة تفاعلي للبث المباشر: اختر رقمك (1-5) في الشات، تجنب رقم الخطر مع حركة الدمية وكن أول الواصلين لخط النهاية!',
    icon: 'Skull',
    category: 'بقاء وأكشن',
    questionsCount: 1,
    avgPoints: 500,
    recommendedDifficulty: 'hard',
    badgeColor: 'from-pink-600 via-purple-600 to-rose-600'
  },
  {
    id: 'bus-tayyibin',
    title: 'باص الطيبين 🚌',
    titleEn: 'Bus Al-Tayyibin (Word Battle)',
    description: 'لعبة ولد، بنت، حيوان، نبات، جماد، بلاد التفاعلية للبث المباشر مع حساب النقاط والفريد والمكرر وكلمة «تم».',
    icon: 'Bus',
    category: 'كلمات وتحدي',
    questionsCount: 28,
    avgPoints: 60,
    recommendedDifficulty: 'easy',
    badgeColor: 'from-emerald-500 via-green-600 to-teal-600'
  },
  {
    id: 'capitals',
    title: 'تحدي عواصم العالم 🏛️',
    titleEn: 'World Capitals Challenge',
    description: 'تحدي معرفة عواصم دول العالم الكبرى والعربية مع دعم العواصم المتعددة والتعرف الذكي.',
    icon: 'Landmark',
    category: 'عواصم وجغرافيا',
    questionsCount: CAPITALS_DATA.length,
    avgPoints: 100,
    recommendedDifficulty: 'easy',
    badgeColor: 'from-amber-500 to-yellow-400'
  },
  {
    id: 'quiz',
    title: 'المسابقات الثقافية العامة',
    titleEn: 'Trivia Quiz Engine',
    description: 'أسئلة ثقافية وعلمية متنوعة مع دعم الاختيار من متعدد والإجابات المباشرة السريعة.',
    icon: 'BrainCircuit',
    category: 'ثقافة وعلوم',
    questionsCount: 0,
    avgPoints: 100,
    recommendedDifficulty: 'easy',
    badgeColor: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'character',
    title: 'أعلام دول العالم 🏳️',
    titleEn: 'World Flags Challenge',
    description: 'تعرّف على أعلام جميع دول العالم! اكتب اسم الدولة بالعربي في الشات للفوز بالنقاط.',
    icon: 'Flag',
    category: 'أعلام ودول',
    questionsCount: 195,
    avgPoints: 100,
    recommendedDifficulty: 'medium',
    badgeColor: 'from-indigo-600 to-blue-600'
  },
  {
    id: 'image-puzzle',
    title: 'ألغاز الصور والتأثيرات',
    titleEn: 'AI Image Puzzle Engine',
    description: 'تحويل وتأطير الصور المرفوعة بتأثيرات (Blur, Pixel, Sketch, Mosaic, Black Shadow, Comic Style).',
    icon: 'Image',
    category: 'بصريات ومعالم',
    questionsCount: 0,
    avgPoints: 200,
    recommendedDifficulty: 'medium',
    badgeColor: 'from-purple-600 to-pink-500'
  },
  {
    id: 'alphabet',
    title: 'شبكة الحروف العربية',
    titleEn: 'Arabic Alphabet Grid',
    description: 'شبكة تفاعلية للحروف العربية (أ - ي) تسمح باختيار أي حرف لفتح سؤال خاص.',
    icon: 'Grid',
    category: 'لغة وحروف',
    questionsCount: 28,
    avgPoints: 150,
    recommendedDifficulty: 'medium',
    badgeColor: 'from-cyan-500 to-teal-400'
  },
  {
    id: 'symbol-puzzle',
    title: 'ألغاز الإيموجي والرموز',
    titleEn: 'Emoji & Symbol Puzzle Engine',
    description: 'تركيبات رموز الإيموجي للتعرف على أسماء الأفلام والأمثال الشعبية والدول.',
    icon: 'Smile',
    category: 'رموز وإيموجي',
    questionsCount: 0,
    avgPoints: 150,
    recommendedDifficulty: 'medium',
    badgeColor: 'from-pink-600 to-rose-400'
  },
  {
    id: 'what-do-they-say',
    title: 'وش يقولون؟ — WHAT DO THEY SAY?',
    titleEn: 'What Do They Say? Social Survey',
    description: 'لعبة اجتماعية جماعية لمعرفة أكثر 10 إجابات شيوعاً بين الناس وتوزيع 200 نقطة لكل سؤال.',
    icon: 'MessageSquareQuestion',
    category: 'ثقافة ومجتمع',
    questionsCount: WHAT_DO_THEY_SAY_BANK.length,
    avgPoints: 200,
    recommendedDifficulty: 'easy',
    badgeColor: 'from-amber-500 via-orange-500 to-rose-500'
  },
  {
    id: 'video-challenge',
    title: 'تحديات مقاطع الفيديو',
    titleEn: 'Live Video Challenge Engine',
    description: 'عرض مقاطع فيديو تفاعلية من الكمبيوتر وإيقاف العرض مؤقتاً لاستقبال إجابات الجمهور.',
    icon: 'Video',
    category: 'سينما وفيديو',
    questionsCount: 0,
    avgPoints: 200,
    recommendedDifficulty: 'medium',
    badgeColor: 'from-red-600 to-rose-500'
  },
  {
    id: 'audio-challenge',
    title: 'التحديات الصوتية',
    titleEn: 'Audio Challenge Engine',
    description: 'تحميل مقاطع صوتية من الجهاز للمشاهير والآلات الموسيقية مع الموجات الترددية.',
    icon: 'Volume2',
    category: 'أصوات وتأثيرات',
    questionsCount: 0,
    avgPoints: 150,
    recommendedDifficulty: 'easy',
    badgeColor: 'from-amber-500 to-yellow-400'
  },
  {
    id: 'mixed-words',
    title: 'الكلمات المبعثرة التلقائية',
    titleEn: 'Scrambled Words Engine',
    description: 'تبعثر أوتوماتيكي ذكي لحروف الكلمة لإعادة ترتيبها في الشات المباشر.',
    icon: 'Shuffle',
    category: 'كلمات ولغة',
    questionsCount: 0,
    avgPoints: 120,
    recommendedDifficulty: 'easy',
    badgeColor: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'hunter-roulette',
    title: 'روليت الصياد 🎯',
    titleEn: "Hunter's Roulette Engine",
    description: 'لعبة البقاء والإقصاء للبث المباشر: روليت لاختيار الصياد ثم اختيار ضحية من الشات وإطلاق النار!',
    icon: 'Crosshair',
    category: 'روليت وبقاء',
    questionsCount: 1,
    avgPoints: 0,
    recommendedDifficulty: 'hard',
    badgeColor: 'from-amber-600 to-rose-600'
  },
  {
    id: 'mystery-roulette',
    title: 'الروليت الغامض 🔮',
    titleEn: 'Mystery Roulette Engine',
    description: 'روليت الإقصاء الغامض: اختيار الصياد ثم استهداف بطاقات سوداء وذهبية غامضة بأرقام عشوائية تتغير في كل لفة دون معرفة الهوية!',
    icon: 'HelpCircle',
    category: 'روليت وغموض',
    questionsCount: 1,
    avgPoints: 2000,
    recommendedDifficulty: 'hard',
    badgeColor: 'from-amber-500 via-yellow-400 to-amber-600'
  },
  {
    id: 'musical-chairs',
    title: 'الكراسي الموسيقية 🪑',
    titleEn: 'MUSICAL CHAIRS Live Action',
    description: 'تحدي السرعة والجلوس على الكراسي: استمع للموسيقى، وعند التوقف تسابق لكتابة رقم الكرسي العشوائي في الشات قبل إقصائك!',
    icon: 'Armchair',
    category: 'سرعة وتحدي',
    questionsCount: 1,
    avgPoints: 2000,
    recommendedDifficulty: 'hard',
    badgeColor: 'from-amber-500 to-yellow-400'
  },
  {
    id: 'bomb-pass',
    title: 'القنبلة الموقوتة 🧨',
    titleEn: 'BOMB PASS Live Action',
    description: 'لعبة البقاء والتمرير السريع: تمرير القنبلة الموقوتة بين المشاركين عبر الشات قبل انفجارها وإقصاء الحامل!',
    icon: 'Bomb',
    category: 'أكشن وبقاء',
    questionsCount: 1,
    avgPoints: 1500,
    recommendedDifficulty: 'hard',
    badgeColor: 'from-red-600 to-amber-600'
  },
  {
    id: 'react',
    title: 'تخمين الأرقام 🔢',
    titleEn: 'GUESS THE NUMBER Engine',
    description: 'تحدي تخمين الرقم السري: أرقام فردية، ثنائية، ثلاثية، ورباعية مع 3 قلوب محاولات لكل لاعب و5 أسئلة بالجولة!',
    icon: 'Binary',
    category: 'تخمين وذكاء',
    questionsCount: 1,
    avgPoints: 2000,
    recommendedDifficulty: 'medium',
    badgeColor: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'memory-match',
    title: 'لعبة الذاكرة التفاعلية 🧠',
    titleEn: 'MEMORY MATCH LIVE',
    description: 'لعبة الذاكرة الجماعية للبث المباشر: 16 بطاقة و8 أزواج صور. احفظ الأماكن واكتب رقمين في الشات (مثال: 1-3) لكسب النقاط!',
    icon: 'Brain',
    category: 'ذاكرة وتفاعل',
    questionsCount: 1,
    avgPoints: 200,
    recommendedDifficulty: 'medium',
    badgeColor: 'from-violet-600 via-purple-600 to-indigo-600'
  }
];

/**
 * Initial Preset Questions Database
 */
export const SAMPLE_QUESTIONS: AnyQuestion[] = [
  // ═══════════════════════════════════════════
  // 1. المسابقات الثقافية العامة (quiz) - ترفع وتدار يدوياً من المكتبة
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // 2. ألغاز الصور والتأثيرات (image-puzzle)
  // ═══════════════════════════════════════════
  {
    id: 'img-q1',
    engineType: 'image-puzzle',
    title: 'ما هو المعلم العالمي الشهير الظاهر في هذه الصورة؟',
    category: 'معالم وآثار',
    difficulty: 'medium',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['برج ايفل', 'برج إيفل', 'إيفل', 'ايفل'],
    imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
    transformStyle: 'pixel'
  },
  {
    id: 'img-q2',
    engineType: 'image-puzzle',
    title: 'تعرّف على هذا الحيوان الصحراوي العربي الملقب بسفينة الصحراء؟',
    category: 'طبيعة وحيوانات',
    difficulty: 'easy',
    points: 100,
    timeLimitSeconds: 30,
    acceptableAnswers: ['الجمل', 'جمل', 'الناقة', 'إبل', 'ابل'],
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800',
    transformStyle: 'sketch'
  },
  {
    id: 'img-q3',
    engineType: 'image-puzzle',
    title: 'ما اسم المعلم التاريخي الفرعوني الظاهر في الصورة؟',
    category: 'معالم وآثار',
    difficulty: 'medium',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['الأهرامات', 'الاهرامات', 'أهرامات مصر', 'الأهرامات المصرية', 'أبو الهول', 'ابو الهول'],
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
    transformStyle: 'blur'
  },
  {
    id: 'img-q4',
    engineType: 'image-puzzle',
    title: 'ما هي هذه الفاكهة الاستوائية المشهورة بتأثير الظل الأسود؟',
    category: 'مأكولات وطبيعة',
    difficulty: 'easy',
    points: 100,
    timeLimitSeconds: 30,
    acceptableAnswers: ['الموز', 'موز', 'موزه'],
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
    transformStyle: 'black-shadow'
  },

  // ═══════════════════════════════════════════
  // 3. تحديات مقاطع الفيديو (video-challenge)
  // ═══════════════════════════════════════════
  {
    id: 'vid-q1',
    engineType: 'video-challenge',
    title: 'شاهد مقطع الفيديو المباشر: ما هو الموضوع الأساسي المعروض؟',
    category: 'فيديو وطبيعة',
    difficulty: 'medium',
    points: 200,
    timeLimitSeconds: 30,
    acceptableAnswers: ['الفضاء', 'الكون', 'الأرض', 'فضاء', 'نجوم'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'vid-q2',
    engineType: 'video-challenge',
    title: 'تحدي الفيديو: ما اسم الشخصية الكرتونية الرئيسية الظاهرة في هذا المقطع؟',
    category: 'رسوم متحركة',
    difficulty: 'easy',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['أرنب', 'الارنب', 'ارنب', 'الأرنب'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },

  // ═══════════════════════════════════════════
  // 4. التحديات الصوتية (audio-challenge)
  // ═══════════════════════════════════════════
  {
    id: 'aud-q1',
    engineType: 'audio-challenge',
    title: 'استمع للمقطع الصوتي: ما هي الآلة الموسيقية الرئيسية التي تعزف في هذا المقطع؟',
    category: 'أصوات وآلات',
    difficulty: 'medium',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['بيانو', 'البيانو', 'جيتار', 'الكمان'],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    audioType: 'instruments'
  },
  {
    id: 'aud-q2',
    engineType: 'audio-challenge',
    title: 'استمع للمؤثر الصوتي: ما هو الصوت الظاهر في التسجيل؟',
    category: 'أصوات وطبيعة',
    difficulty: 'easy',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['موسيقى', 'نغمات', 'عزف'],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    audioType: 'nature'
  },

  // ═══════════════════════════════════════════
  // 5. الكلمات المبعثرة التلقائية (mixed-words)
  // ═══════════════════════════════════════════
  {
    id: 'mix-q1',
    engineType: 'mixed-words',
    title: 'رتب الحروف التالية لمعرفة اسم العاصمة: [ ض • ا • ل • ي • ر • ا ]',
    category: 'كلمات ولغة',
    difficulty: 'easy',
    points: 120,
    timeLimitSeconds: 30,
    acceptableAnswers: ['الرياض', 'رياض'],
    originalWord: 'الرياض',
    scrambledLetters: ['ض', 'ا', 'ل', 'ي', 'ر', 'ا']
  },
  {
    id: 'mix-q2',
    engineType: 'mixed-words',
    title: 'رتب الحروف التالية لمعرفة اسم الدولة: [ د • ي • س • ة • و • ا • ع • ل ]',
    category: 'كلمات ولغة',
    difficulty: 'easy',
    points: 120,
    timeLimitSeconds: 30,
    acceptableAnswers: ['السعودية', 'سعودية', 'المملكة العربية السعودية'],
    originalWord: 'السعودية',
    scrambledLetters: ['د', 'ي', 'س', 'ة', 'و', 'ا', 'ع', 'ل']
  },
  {
    id: 'mix-q3',
    engineType: 'mixed-words',
    title: 'رتب الحروف التالية لمعرفة اسم العاصمة: [ هـ • ا • ق • ة • ر • ل • ا ]',
    category: 'كلمات ولغة',
    difficulty: 'medium',
    points: 120,
    timeLimitSeconds: 30,
    acceptableAnswers: ['القاهرة', 'قاهرة'],
    originalWord: 'القاهرة',
    scrambledLetters: ['هـ', 'ا', 'ق', 'ة', 'ر', 'ل', 'ا']
  },
  {
    id: 'mix-q4',
    engineType: 'mixed-words',
    title: 'رتب الحروف التالية لمعرفة اسم البحر: [ ح • م • أ • ر • ل • ا ]',
    category: 'كلمات ولغة',
    difficulty: 'medium',
    points: 120,
    timeLimitSeconds: 30,
    acceptableAnswers: ['الأحمر', 'الاحمر', 'بحر الأحمر', 'البحر الاحمر', 'البحر الأحمر'],
    originalWord: 'البحر الأحمر',
    scrambledLetters: ['ح', 'م', 'أ', 'ر', 'ل', 'ا']
  },
  {
    id: 'mix-q5',
    engineType: 'mixed-words',
    title: 'رتب الحروف التالية لمعرفة اسم كوكب في المجموعة الشمسية: [ ت • ر • م • ي • ش • ا • ل ]',
    category: 'علوم وفضاء',
    difficulty: 'medium',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['المشتري', 'المشتري'],
    originalWord: 'المشتري',
    scrambledLetters: ['ت', 'ر', 'م', 'ي', 'ش', 'ا', 'ل']
  },
  {
    id: 'mix-q6',
    engineType: 'mixed-words',
    title: 'رتب الحروف التالية لمعرفة اسم أسرع حيوان بري: [ ف • د • هـ • ل • ا ]',
    category: 'حيوانات وطبيعة',
    difficulty: 'easy',
    points: 120,
    timeLimitSeconds: 30,
    acceptableAnswers: ['الفهد', 'فهد'],
    originalWord: 'الفهد',
    scrambledLetters: ['ف', 'د', 'هـ', 'ل', 'ا']
  },

  // ═══════════════════════════════════════════
  // 6. ألغاز الإيموجي والرموز (symbol-puzzle)
  // ═══════════════════════════════════════════
  {
    id: 'sym-q1',
    engineType: 'symbol-puzzle',
    title: 'ما اسم الدولة المشار إليها بهذه الرموز؟ 🇸🇦 🌴 🐪',
    category: 'رموز وإيموجي',
    difficulty: 'easy',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['السعودية', 'سعودية', 'المملكة العربية السعودية'],
    emojis: ['🇸🇦', '🌴', '🐪'],
    iconCategory: 'دول'
  },
  {
    id: 'sym-q2',
    engineType: 'symbol-puzzle',
    title: 'ما اسم الفيلم الشهير المشار إليه بهذه الرموز؟ 🦁 👑 🌅',
    category: 'رموز وإيموجي',
    difficulty: 'medium',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['الأسد الملك', 'الاسد الملك', 'أسد الملك', 'سيمبا'],
    emojis: ['🦁', '👑', '🌅'],
    iconCategory: 'أفلام'
  },
  {
    id: 'sym-q3',
    engineType: 'symbol-puzzle',
    title: 'ما اسم الفيلم العالمي المشار إليه بهذه الرموز؟ 🚢 🧊 🌊',
    category: 'رموز وإيموجي',
    difficulty: 'medium',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['تايتنيك', 'تايتانيك', 'تيتانيك'],
    emojis: ['🚢', '🧊', '🌊'],
    iconCategory: 'أفلام'
  },
  {
    id: 'sym-q4',
    engineType: 'symbol-puzzle',
    title: 'ما البطولة الرياضية المشار إليها بهذه الرموز؟ ⚽ 🏆 🇶🇦',
    category: 'رموز وإيموجي',
    difficulty: 'easy',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['كأس العالم', 'مونديال قطر', 'كاس العالم', 'كأس العالم قطر'],
    emojis: ['⚽', '🏆', '🇶🇦'],
    iconCategory: 'رياضة'
  },
  {
    id: 'sym-q5',
    engineType: 'symbol-puzzle',
    title: 'ما هي الدولة المشهورة بهذه المأكولات؟ 🍕 🍝 🇮🇹',
    category: 'رموز وإيموجي',
    difficulty: 'easy',
    points: 150,
    timeLimitSeconds: 30,
    acceptableAnswers: ['إيطاليا', 'ايطاليا'],
    emojis: ['🍕', '🍝', '🇮🇹'],
    iconCategory: 'دول'
  }
];

export function getQuestionsByEngine(engineType: EngineType): AnyQuestion[] {
  if (engineType === 'squid-game') {
    return [generateSquidQuestion()];
  }
  if (engineType === 'bus-tayyibin') {
    return [
      {
        id: 'bus-main',
        engineType: 'bus-tayyibin',
        title: 'باص الطيبين — ولد، بنت، حيوان، نبات، جماد، بلاد',
        category: 'كلمات وتحدي',
        difficulty: 'easy',
        points: 60,
        timeLimitSeconds: 30,
        acceptableAnswers: []
      } as AnyQuestion
    ];
  }
  if (engineType === 'react') {
    return [generateReactQuestion() as AnyQuestion];
  }
  if (engineType === 'bomb-pass') {
    return [generateBombPassQuestion() as AnyQuestion];
  }
  if (engineType === 'musical-chairs' || engineType === 'the-vault') {
    return [generateMusicalChairsQuestion() as AnyQuestion];
  }
  if (engineType === 'hunter-roulette') {
    return [
      {
        id: 'hunter-main',
        engineType: 'hunter-roulette',
        title: 'روليت الصياد - لعبة البقاء والإقصاء',
        category: 'روليت وبقاء',
        difficulty: 'hard',
        points: 0,
        timeLimitSeconds: 30,
        acceptableAnswers: [],
        phase: 'IDLE',
        participants: [],
        roundNumber: 1
      } as AnyQuestion
    ];
  }
  if (engineType === 'mystery-roulette') {
    return [
      {
        id: 'mystery-main',
        engineType: 'mystery-roulette',
        title: 'الروليت الغامض - بطاقات الأرقام وإقصاء الهوية',
        category: 'روليت وغموض',
        difficulty: 'hard',
        points: 2000,
        timeLimitSeconds: 30,
        acceptableAnswers: [],
        phase: 'IDLE',
        roundNumber: 1
      } as AnyQuestion
    ];
  }
  if (engineType === 'character') {
    return WORLD_FLAGS_QUESTIONS as AnyQuestion[];
  }
  if (engineType === 'alphabet') {
    const allAlphabetQs: AnyQuestion[] = [];
    Object.entries(ALPHABET_QUESTION_BANK).forEach(([letter, list]) => {
      list.forEach(q => {
        allAlphabetQs.push({
          id: `alph-${q.id}`,
          engineType: 'alphabet',
          letter: q.letter,
          title: q.title,
          category: 'حروف',
          difficulty: 'medium',
          points: q.points || 100,
          timeLimitSeconds: 30,
          acceptableAnswers: q.acceptableAnswers
        } as any);
      });
    });
    return allAlphabetQs;
  }
  if (engineType === 'what-do-they-say') {
    return [...WHAT_DO_THEY_SAY_BANK].reverse() as AnyQuestion[];
  }
  if (engineType === 'memory-match') {
    return [generateMemoryMatchQuestion()];
  }
  if (engineType === 'capitals') {
    return generateCapitalsRoundQuestions(30);
  }
  if (engineType === 'quiz') {
    const quizQs: AnyQuestion[] = [];
    Object.values(ALPHABET_QUESTION_BANK).forEach(list => {
      list.forEach(q => {
        quizQs.push({
          id: `quiz-${q.id}`,
          engineType: 'quiz',
          title: q.title,
          category: 'ثقافة عامة',
          difficulty: 'medium',
          points: q.points || 100,
          timeLimitSeconds: 30,
          acceptableAnswers: q.acceptableAnswers
        } as any);
      });
    });
    return quizQs;
  }
  const filtered = SAMPLE_QUESTIONS.filter(q => q.engineType === engineType);
  return filtered.length > 0 ? filtered : getQuestionsByEngine('capitals');
}

/**
 * Smart Importer: Imports Excel/CSV/JSON raw text or array
 */
export function importContentFromRawData(rawData: string | any[], format: 'csv' | 'json' | 'excel'): { questions: AnyQuestion[]; report: ImportReport } {
  const errors: string[] = [];
  let parsedItems: any[] = [];
  let duplicatesRemoved = 0;

  try {
    if (typeof rawData === 'string') {
      if (format === 'json') {
        parsedItems = JSON.parse(rawData);
      } else {
        const lines = rawData.split(/\r?\n/).filter(line => line.trim());
        if (lines.length > 0) {
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            const obj: any = {};
            headers.forEach((h, idx) => {
              obj[h] = cols[idx] || '';
            });
            parsedItems.push(obj);
          }
        }
      }
    } else if (Array.isArray(rawData)) {
      parsedItems = rawData;
    }
  } catch (err: any) {
    errors.push(`خطأ في صيغة الملف: ${err.message}`);
  }

  const validQuestions: AnyQuestion[] = [];
  const seenTitles = new Set<string>();

  parsedItems.forEach((item, index) => {
    const rawTitle = item.title || item.question || item.السؤال || '';
    const titleStr = String(rawTitle).trim();
    if (!titleStr) {
      errors.push(`الصف ${index + 1}: تم تجاهله لعدم وجود نص السؤال`);
      return;
    }

    // Ignore questions containing visual phrases unsuitable for text broadcast
    const FORBIDDEN_PHRASES = ['كما في الصورة', 'بالشكل التالي', 'في الصورة', 'الصورة التالية'];
    if (FORBIDDEN_PHRASES.some(phrase => titleStr.includes(phrase))) {
      errors.push(`الصف ${index + 1}: تم استبعاده لتضمنه عبارة غير مناسبة للبث (مثل "في الصورة" أو "بالشكل التالي")`);
      return;
    }

    const normTitle = normalizeAnswer(titleStr);
    if (seenTitles.has(normTitle)) {
      duplicatesRemoved++;
      return;
    }
    seenTitles.add(normTitle);

    const answersRaw = item.answers || item.acceptableAnswers || item.الإجابة || item.answer || '';
    const acceptableAnswers: string[] = Array.isArray(answersRaw) 
      ? answersRaw 
      : String(answersRaw).split(';').map(a => a.trim()).filter(Boolean);

    if (acceptableAnswers.length === 0) {
      errors.push(`الصف ${index + 1}: تم استبعاده لعدم توفر إجابة صحيحة`);
      return;
    }

    const q: AnyQuestion = {
      id: `imported-${Date.now()}-${index}`,
      engineType: (item.engineType || item.type || 'quiz') as EngineType,
      title,
      category: item.category || item.التصنيف || 'عام',
      difficulty: item.difficulty || 'medium',
      points: Number(item.points) || 100,
      timeLimitSeconds: Number(item.timeLimitSeconds) || 25,
      acceptableAnswers,
      imageUrl: item.imageUrl || item.image || item.الصورة,
      videoUrl: item.videoUrl || item.video || item.الفيديو,
      audioUrl: item.audioUrl || item.audio || item.الصوت
    } as BaseQuestion as AnyQuestion;

    validQuestions.push(q);
  });

  const report: ImportReport = {
    totalRows: parsedItems.length,
    importedCount: validQuestions.length,
    skippedCount: parsedItems.length - validQuestions.length,
    duplicatesRemoved,
    cleanedErrors: errors,
    importTimestamp: new Date().toISOString()
  };

  return { questions: validQuestions, report };
}

/**
 * AI Question Generator Simulator
 */
export function generateAIQuestions(topic: string, count: number = 3): AnyQuestion[] {
  const generated: AnyQuestion[] = [];
  
  for (let i = 1; i <= count; i++) {
    generated.push({
      id: `ai-gen-${Date.now()}-${i}`,
      engineType: 'quiz',
      title: `سؤال عن ${topic}: ما هي الفكرة المحورية؟ (${i})`,
      category: topic,
      difficulty: i % 2 === 0 ? 'hard' : 'medium',
      points: 150,
      timeLimitSeconds: 20,
      acceptableAnswers: ['الإجابة الصحيحة', 'الصح'],
      isMultipleChoice: true,
      options: ['الإجابة الصحيحة', 'خيار 2', 'خيار 3', 'خيار 4']
    } as BaseQuestion as AnyQuestion);
  }

  return generated;
}
