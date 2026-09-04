import { MemoryCard, MemoryCategory, MemoryImageAsset, MemoryMatchConfig, MemoryMatchQuestion } from '@aep/types';

/**
 * ══════════════════════════════════════════════════════════════
 * 🧠 MEMORY MATCH LIVE — BROADCAST-GRADE APPROVED IMAGE ASSETS
 * ══════════════════════════════════════════════════════════════
 * High-resolution, centered, high-contrast, uncluttered images
 * Status must be 'APPROVED' for production live broadcast.
 */
export const MEMORY_IMAGE_LIBRARY: MemoryImageAsset[] = [
  // ── 1. حيوانات (ANIMALS) ──
  {
    id: 'anim-1',
    name: 'أسد',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-2',
    name: 'نمر',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-3',
    name: 'فيل',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-4',
    name: 'زرافة',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-5',
    name: 'جمل',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-6',
    name: 'باندا',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-7',
    name: 'دب',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-8',
    name: 'بطريق',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-9',
    name: 'حصان',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-10',
    name: 'ذئب',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-11',
    name: 'صقر',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'anim-12',
    name: 'غزال',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },

  // ── 2. أعلام دول (FLAGS) ──
  {
    id: 'flag-sa',
    name: 'السعودية',
    category: 'flags',
    image: 'https://flagcdn.com/w320/sa.png',
    thumbnail: 'https://flagcdn.com/w160/sa.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-eg',
    name: 'مصر',
    category: 'flags',
    image: 'https://flagcdn.com/w320/eg.png',
    thumbnail: 'https://flagcdn.com/w160/eg.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-ae',
    name: 'الإمارات',
    category: 'flags',
    image: 'https://flagcdn.com/w320/ae.png',
    thumbnail: 'https://flagcdn.com/w160/ae.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-kw',
    name: 'الكويت',
    category: 'flags',
    image: 'https://flagcdn.com/w320/kw.png',
    thumbnail: 'https://flagcdn.com/w160/kw.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-qa',
    name: 'قطر',
    category: 'flags',
    image: 'https://flagcdn.com/w320/qa.png',
    thumbnail: 'https://flagcdn.com/w160/qa.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-jp',
    name: 'اليابان',
    category: 'flags',
    image: 'https://flagcdn.com/w320/jp.png',
    thumbnail: 'https://flagcdn.com/w160/jp.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-fr',
    name: 'فرنسا',
    category: 'flags',
    image: 'https://flagcdn.com/w320/fr.png',
    thumbnail: 'https://flagcdn.com/w160/fr.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-gb',
    name: 'بريطانيا',
    category: 'flags',
    image: 'https://flagcdn.com/w320/gb.png',
    thumbnail: 'https://flagcdn.com/w160/gb.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-br',
    name: 'البرازيل',
    category: 'flags',
    image: 'https://flagcdn.com/w320/br.png',
    thumbnail: 'https://flagcdn.com/w160/br.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-es',
    name: 'إسبانيا',
    category: 'flags',
    image: 'https://flagcdn.com/w320/es.png',
    thumbnail: 'https://flagcdn.com/w160/es.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-om',
    name: 'عمان',
    category: 'flags',
    image: 'https://flagcdn.com/w320/om.png',
    thumbnail: 'https://flagcdn.com/w160/om.png',
    status: 'APPROVED'
  },
  {
    id: 'flag-kr',
    name: 'كوريا الجنوبية',
    category: 'flags',
    image: 'https://flagcdn.com/w320/kr.png',
    thumbnail: 'https://flagcdn.com/w160/kr.png',
    status: 'APPROVED'
  },

  // ── 3. معالم سياحية (LANDMARKS) ──
  {
    id: 'land-1',
    name: 'برج خليفة',
    category: 'landmarks',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'land-2',
    name: 'الأهرامات',
    category: 'landmarks',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'land-3',
    name: 'برج إيفل',
    category: 'landmarks',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'land-4',
    name: 'ساعة بيغ بن',
    category: 'landmarks',
    image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'land-5',
    name: 'تاج محل',
    category: 'landmarks',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'land-6',
    name: 'برج المملكة',
    category: 'landmarks',
    image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'land-7',
    name: 'مدائن صالح',
    category: 'landmarks',
    image: 'https://images.unsplash.com/photo-1578895210405-907db486c111?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1578895210405-907db486c111?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'land-8',
    name: 'الكولوسيوم',
    category: 'landmarks',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'land-9',
    name: 'تمثال الحرية',
    category: 'landmarks',
    image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'land-10',
    name: 'سور الصين',
    category: 'landmarks',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },

  // ── 4. مأكولات (FOOD) ──
  {
    id: 'food-1',
    name: 'كبسة سعودية',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'food-2',
    name: 'مندي لحم',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'food-3',
    name: 'شاورما',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'food-4',
    name: 'كنافة',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'food-5',
    name: 'فلافل',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1558030006-450675393462?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'food-6',
    name: 'برجر',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'food-7',
    name: 'بيتزا',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'food-8',
    name: 'سمبوسة',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'food-9',
    name: 'تمر وحلى',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'food-10',
    name: 'مشاوي',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },

  // ── 5. مشروبات (DRINKS) ──
  {
    id: 'drink-1',
    name: 'قهوة عربية',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'drink-2',
    name: 'شاي كرك',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'drink-3',
    name: 'موهيتو توت',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'drink-4',
    name: 'عصير برتقال',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'drink-5',
    name: 'آيس دريب',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'drink-6',
    name: 'ليمون نعناع',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'drink-7',
    name: 'عصير مانجو',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  },
  {
    id: 'drink-8',
    name: 'شاي نعناع',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=150&auto=format&fit=crop&q=80',
    status: 'APPROVED'
  }
];

/**
 * Generates 16 shuffled cards (8 matching pairs) for a new round
 */
export function generateMemoryCardsForRound(roundId: string, category: MemoryCategory = 'random'): MemoryCard[] {
  let eligibleAssets = MEMORY_IMAGE_LIBRARY.filter(a => a.status === 'APPROVED');
  if (category !== 'random') {
    const categoryAssets = eligibleAssets.filter(a => a.category === category);
    if (categoryAssets.length >= 8) {
      eligibleAssets = categoryAssets;
    }
  }

  // Shuffle pool of available assets
  const shuffledAssets = [...eligibleAssets].sort(() => Math.random() - 0.5);
  
  // Pick 8 unique image assets
  const selected8Assets = shuffledAssets.slice(0, 8);

  // If pool had fewer than 8, pad from any category
  while (selected8Assets.length < 8) {
    const fallback = MEMORY_IMAGE_LIBRARY.find(a => !selected8Assets.some(s => s.id === a.id)) || MEMORY_IMAGE_LIBRARY[0];
    selected8Assets.push(fallback);
  }

  // Duplicate each asset to create 8 matching pairs (16 total cards)
  const raw16Cards: Array<{ asset: MemoryImageAsset; pairId: number }> = [];
  selected8Assets.forEach((asset, idx) => {
    const pairId = idx + 1; // 1 to 8
    raw16Cards.push({ asset, pairId });
    raw16Cards.push({ asset, pairId });
  });

  // Fisher-Yates shuffle 16 cards so positions 1 to 16 are completely randomized
  for (let i = raw16Cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [raw16Cards[i], raw16Cards[j]] = [raw16Cards[j], raw16Cards[i]];
  }

  // Create final MemoryCard instances assigned to positions 1..16
  return raw16Cards.map((item, index) => ({
    id: `card-${roundId}-${index + 1}`,
    roundId,
    position: index + 1,
    imageId: item.asset.id,
    pairId: item.pairId,
    title: item.asset.name,
    imageUrl: item.asset.image,
    category: item.asset.category,
    isRevealed: false,
    isMatched: false
  }));
}

/**
 * Generates an initial MemoryMatchQuestion model
 */
export function generateMemoryMatchQuestion(partialConfig?: Partial<MemoryMatchConfig>): MemoryMatchQuestion {
  const config: MemoryMatchConfig = {
    memorizeDurationSec: 10,
    category: 'random',
    pointsPerPair: 2,
    resultsDurationSec: 10,
    totalCards: 16,
    totalPairs: 8,
    ...partialConfig
  };

  const initialRoundId = `round-${Date.now()}`;
  const cards = generateMemoryCardsForRound(initialRoundId, config.category);

  return {
    id: `mem-${Date.now()}`,
    engineType: 'memory-match',
    title: 'لعبة الذاكرة التفاعلية — MEMORY MATCH LIVE',
    category: 'ألعاب تفاعلية وبث مباشر',
    difficulty: 'easy',
    points: 16,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'IDLE',
    currentRoundNumber: 1,
    config,
    cards,
    players: [],
    activeAttempts: []
  };
}
