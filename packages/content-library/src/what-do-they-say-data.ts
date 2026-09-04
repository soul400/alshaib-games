import { WhatDoTheySayQuestion } from '@aep/types';

export const WHAT_DO_THEY_SAY_BANK: WhatDoTheySayQuestion[] = [
  {
    id: 'wdts-1',
    engineType: 'what-do-they-say',
    title: 'اذكر شيئاً يفعله الناس أول ما يصحون من النوم؟',
    category: 'عادات واجتماعي',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'الجوال والتطبيقات',
        emoji: '📱',
        points: 45,
        aliases: ['الجوال', 'جوال', 'تلفون', 'التلفون', 'الهاتف', 'هاتف', 'الموبايل', 'موبايل', 'جوالي', 'ايفون', 'iphone', 'واتساب', 'سناب', 'تيك توك'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'الصلاة والذكر',
        emoji: '🕌',
        points: 35,
        aliases: ['الصلاة', 'صلاة', 'صلاة الفجر', 'الفجر', 'يصلي', 'الاذكار', 'اذكار', 'الدعاء', 'دعاء', 'الوضوء', 'وضوء', 'يتوضى'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'شرب القهوة',
        emoji: '☕',
        points: 28,
        aliases: ['القهوة', 'قهوة', 'كوفي', 'كافيه', 'اسبريسو', 'قهوة عربي', 'قهوة سوداء', 'شاي', 'الشاي'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'غسيل الوجه والأسنان',
        emoji: '🧼',
        points: 22,
        aliases: ['يغسل وجهه', 'غسيل الوجه', 'غسل الوجه', 'يفرش اسنانه', 'فرشاة الاسنان', 'المغسلة', 'الحمام', 'يغسل', 'اسنانه'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'يرجع ينام / يتثاوب',
        emoji: '😴',
        points: 18,
        aliases: ['يرجع ينام', 'النوم', 'ينام', 'يكمل نومته', 'غفوة', 'منبه ثاني', 'يتكاسل', 'يتمدد', 'يتثاوب', 'كسل'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'تناول الفطور',
        emoji: '🍳',
        points: 15,
        aliases: ['الفطور', 'فطور', 'يفطر', 'اكل', 'فطور الصباح', 'ساندوتش', 'بيض', 'توست'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'الاستحمام والشاور',
        emoji: '🚿',
        points: 12,
        aliases: ['يتروش', 'شاور', 'استحمام', 'الترويش', 'يتروش', 'يسبح', 'دش', 'الحمام'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'التشيك على الساعة',
        emoji: '⏰',
        points: 10,
        aliases: ['يشيك الساعة', 'الساعة', 'الوقت', 'كم الساعة', 'المنبه', 'يشوف الوقت', 'يطفي المنبه'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'فتح الستائر والنوافذ',
        emoji: '🪟',
        points: 8,
        aliases: ['يفتح الستائر', 'الستارة', 'الستائر', 'الشباك', 'النور', 'يشغل النور', 'يفتح الشباك', 'ضوء الشمس'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'التجهيز للدوام / المدرسة',
        emoji: '👔',
        points: 7,
        aliases: ['يجهز للدوام', 'الدوام', 'يلبس', 'الملابس', 'يبدل', 'يجهز نفسه', 'الجامعة', 'المدرسة', 'العمل', 'يطلع للدوام'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-2',
    engineType: 'what-do-they-say',
    title: 'شيء غالبًا يكون موجودًا في مجلس الرجال؟',
    category: 'سعودي وخليجي',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'القهوة العربية',
        emoji: '☕',
        points: 45,
        aliases: ['القهوة', 'قهوة', 'قهوة عربي', 'فناجيل', 'الفناجيل', 'فنجال', 'قهوة سعودية'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'التمر والقدوع',
        emoji: '🌴',
        points: 35,
        aliases: ['التمر', 'تمر', 'رطب', 'قدوع', 'القدوع', 'سكري', 'خلاص'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'الشاي والنعناع',
        emoji: '🫖',
        points: 28,
        aliases: ['الشاي', 'شاي', 'بيالات', 'شاهي', 'شاي كرك', 'شاي نعناع', 'براد الشاي'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'العود والبخور',
        emoji: '🪵',
        points: 22,
        aliases: ['العود', 'عود', 'بخور', 'البخور', 'مبخرة', 'المبخرة', 'دخون', 'عطر'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'الجوالات والشواحن',
        emoji: '📱',
        points: 18,
        aliases: ['الجوالات', 'جوالات', 'جوال', 'شاحن', 'شواحن', 'الافياش', 'تلفونات'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'شاشة التلفزيون',
        emoji: '📺',
        points: 15,
        aliases: ['التلفزيون', 'تلفزيون', 'شاشة', 'الشاشة', 'الرسيفر', 'مباراة', 'ريموت'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'الدلة والاباريق',
        emoji: '🫖',
        points: 12,
        aliases: ['الدلة', 'دلة', 'دلال', 'الدلال', 'دلة رسلان', 'ابريق'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'الكنبات والمراكي',
        emoji: '🛋️',
        points: 10,
        aliases: ['الكنبات', 'كنب', 'المراكي', 'مركاة', 'مساند', 'جلسة ارضية', 'سجاد', 'فرشة'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'المكيف والهواء',
        emoji: '❄️',
        points: 8,
        aliases: ['المكيف', 'مكيف', 'سبليت', 'تبريد', 'مروحة', 'مكيف مركزي'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'الماء والعصائر',
        emoji: '💧',
        points: 7,
        aliases: ['الماء', 'موية', 'الموية', 'ماء', 'عصير', 'عصائر', 'كرتون موية'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-3',
    engineType: 'what-do-they-say',
    title: 'شيء تأخذه معك دائماً عندما تخرج من البيت؟',
    category: 'عادات واجتماعي',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'الجوال',
        emoji: '📱',
        points: 45,
        aliases: ['الجوال', 'جوال', 'تلفون', 'التلفون', 'الهاتف', 'موبايل'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'مفاتيح البيت / السيارة',
        emoji: '🔑',
        points: 35,
        aliases: ['المفاتيح', 'مفاتيح', 'مفتاح', 'المفتاح', 'مفتاح السيارة', 'مفتاح البيت', 'سويتش'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'المحفظة والبطاقات',
        emoji: '👛',
        points: 28,
        aliases: ['المحفظة', 'محفظة', 'بوك', 'البوك', 'فلوس', 'الفلوس', 'كاش', 'بطاقة البنك', 'مدى'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'النظارة الشمسية / الطبية',
        emoji: '🕶️',
        points: 22,
        aliases: ['النظارة', 'نظارة', 'نظارات', 'نظارة شمسية', 'نظارات شمسية', 'نظارة طبية'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'شاحن متنقل (باور بانك)',
        emoji: '🔋',
        points: 18,
        aliases: ['الشاحن', 'شاحن', 'باور بانك', 'باوربانك', 'شاحن سفري', 'سلك شاحن'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'العطر والبخور',
        emoji: '🧴',
        points: 15,
        aliases: ['العطر', 'عطر', 'عطور', 'بخور', 'عود', 'معطر'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'ساعة اليد',
        emoji: '⌚',
        points: 12,
        aliases: ['الساعة', 'ساعة', 'ساعة يد', 'ساعة ابل', 'ساعة ذكية'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'بطاقة الهوية / الرخصة',
        emoji: '🪪',
        points: 10,
        aliases: ['الهوية', 'بطاقة الهوية', 'الرخصة', 'رخصة القيادة', 'اثبات', 'اثبات شخصية', 'الاقامة'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'العلك والمصاص',
        emoji: '🍬',
        points: 8,
        aliases: ['العلك', 'علك', 'لبان', 'حلاو', 'حلاوة', 'نعناع', 'علكة'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'سماعات الأذن',
        emoji: '🎧',
        points: 7,
        aliases: ['السماعات', 'سماعات', 'سماعة', 'ايربودز', 'airpods', 'سماعة بلوتوث'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-4',
    engineType: 'what-do-they-say',
    title: 'مسلسل سعودي يتذكره الناس ويعرفونه جيداً؟',
    category: 'مسلسلات وسينما',
    difficulty: 'medium',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'طاش ما طاش',
        emoji: '🎬',
        points: 45,
        aliases: ['طاش ما طاش', 'طاش', 'طاش ماطاش', 'طاش 18', 'ناصر وعبدالله'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'شباب البومب',
        emoji: '💥',
        points: 35,
        aliases: ['شباب البومب', 'البومب', 'عامر', 'فيصل العيسى', 'شباب بومب'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'سيلفي',
        emoji: '📸',
        points: 28,
        aliases: ['سيلفي', 'مسلسل سيلفي', 'سيلفي 1', 'سيلفي 2', 'سيلفي 3', 'ناصر القصبي'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'بيني وبينك',
        emoji: '🤝',
        points: 22,
        aliases: ['بيني وبينك', 'مناحي', 'مفرح', 'حسن عسيري', 'فايز المالكي', 'بيني و بينك'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'العاصوف',
        emoji: '🌪️',
        points: 18,
        aliases: ['العاصوف', 'عاصوف', 'العاصوف 1', 'العاصوف 2', 'خالد الطيان'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'واي فاي',
        emoji: '📶',
        points: 15,
        aliases: ['واي فاي', 'واي فاي 1', 'واي فاي 2', 'wifi'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'سكتم بكتم',
        emoji: '🤫',
        points: 12,
        aliases: ['سكتم بكتم', 'دحيم', 'فايز المالكي', 'سكتم'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'كلام الناس',
        emoji: '🗣️',
        points: 10,
        aliases: ['كلام الناس', 'مسلسل كلام الناس', 'حسن عسيري'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'غشمشم',
        emoji: '🤠',
        points: 8,
        aliases: ['غشمشم', 'رشيد عساف', 'فهد الحيان', 'هزار'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'مخرج 7',
        emoji: '🛣️',
        points: 7,
        aliases: ['مخرج 7', 'مخرج سبعة', 'مخرج7', 'ناصر القصبي'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-5',
    engineType: 'what-do-they-say',
    title: 'ممثل مصري اشتهر بأدوار الكوميديا في السينما والتلفزيون؟',
    category: 'مسلسلات وسينما',
    difficulty: 'medium',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'عادل إمام',
        emoji: '👑',
        points: 45,
        aliases: ['عادل امام', 'عادل إمام', 'الزعيم', 'الزعيم عادل امام'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'محمد هنيدي',
        emoji: '🎭',
        points: 35,
        aliases: ['محمد هنيدي', 'هنيدي', 'محمد هنيدى', 'هنيدى'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'إسماعيل ياسين',
        emoji: '🎩',
        points: 28,
        aliases: ['اسماعيل ياسين', 'إسماعيل ياسين', 'اسماعيل يس', 'سمعة'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'أحمد حلمي',
        emoji: '👓',
        points: 22,
        aliases: ['احمد حلمي', 'أحمد حلمي', 'حلمي', 'حلمى', 'احمد حلمى'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'سمير غانم',
        emoji: '🌟',
        points: 18,
        aliases: ['سمير غانم', 'فطوطة', 'سموره'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'محمد سعد (اللمبي)',
        emoji: '🤪',
        points: 15,
        aliases: ['محمد سعد', 'اللمبي', 'لمبي', 'اللمبى', 'بوحة', 'عوكل'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'فؤاد المهندس',
        emoji: '📻',
        points: 12,
        aliases: ['فؤاد المهندس', 'فواد المهندس', 'المهندس', 'عمو فؤاد'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'علاء ولي الدين',
        emoji: ' الناظر',
        points: 10,
        aliases: ['علاء ولي الدين', 'علاء ولى الدين', 'علاء ولي', 'الناظر صلاح الدين'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'هاني رمزي',
        emoji: '😄',
        points: 8,
        aliases: ['هاني رمزي', 'هانى رمزى', 'هاني رمزى'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'شيكو / أحمد فهمي',
        emoji: '🕺',
        points: 7,
        aliases: ['شيكو', 'احمد فهمي', 'هشام ماجد', 'فهمي', 'الثلاثي'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-6',
    engineType: 'what-do-they-say',
    title: 'أكثر شيء يضيع وقت الناس يومياً؟',
    category: 'عادات واجتماعي',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'السوشيال ميديا والتطبيقات',
        emoji: '📲',
        points: 45,
        aliases: ['السوشيال ميديا', 'سوشيال ميديا', 'برامج التواصل', 'التواصل الاجتماعي', 'الجوال', 'تصفح الجوال', 'الانترنت', 'النت'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'التيك توك والبثوث',
        emoji: '🎵',
        points: 35,
        aliases: ['التيك توك', 'تيك توك', 'tiktok', 'الفيديوهات القصيرة', 'ريلز', 'شورتس', 'البثوث'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'النوم الزائد والكسل',
        emoji: '🛏️',
        points: 28,
        aliases: ['النوم', 'نوم', 'النوم الزائد', 'الكسل', 'التسويف', 'التاجيل', 'التأجيل', 'التمدد'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'التلفزيون والمسلسلات',
        emoji: '📺',
        points: 22,
        aliases: ['التلفزيون', 'تلفزيون', 'المسلسلات', 'مسلسلات', 'الافلام', 'افلام', 'نتفلكس', 'شاهد', 'netflix'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'زحمة الشوارع والسيارات',
        emoji: '🚗',
        points: 18,
        aliases: ['الزحمة', 'زحمة', 'زحمة الشوارع', 'السيارة', 'المشاوير', 'الطريق', 'اشارات المرور'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'ألعاب الفيديو والبلايستيشن',
        emoji: '🎮',
        points: 15,
        aliases: ['العاب الفيديو', 'الالعاب', 'بلايستيشن', 'سوني', 'ببجي', 'فيفا', 'كود', 'السوني', 'العاب الجوال'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'التفكير الزائد والقلق',
        emoji: '💭',
        points: 12,
        aliases: ['التفكير الزائد', 'تفكير', 'التفكير', 'اوفر ثينك', 'القلق', 'الهواجيس', 'السرحان'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'السوالف والمكالمات الطويلة',
        emoji: '🗣️',
        points: 10,
        aliases: ['السوالف', 'سوالف', 'المكالمات', 'الحش', 'القيل والقال', 'الكلام الفاضي', 'جلسات الكوفي'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'التسوق والشراء أونلاين',
        emoji: '🛍️',
        points: 8,
        aliases: ['التسوق', 'تسوق', 'المول', 'المولات', 'الشراء اونلاين', 'شي ان', 'تطبيقات التوصيل', 'امازون'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'الانتظار في الطوابير والمواعيد',
        emoji: '⏳',
        points: 7,
        aliases: ['الانتظار', 'انتظار', 'المواعيد', 'السرا', 'الطابور', 'المستشفى', 'المطاعم'],
        isRevealed: false
      }
    ]
  },

  // ========== QUESTION 7: أكلات شعبية سعودية ==========
  {
    id: 'wdts-7',
    engineType: 'what-do-they-say',
    title: 'اذكر أكلة شعبية سعودية مشهورة يعرفها الجميع؟',
    category: 'طعام وأكلات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'الكبسة',
        emoji: '🍚',
        points: 45,
        aliases: ['الكبسة', 'كبسة', 'كبسه', 'كبسة لحم', 'كبسة دجاج', 'كبسة حاشي', 'رز بلحم', 'رز كبسة'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'المندي',
        emoji: '🍖',
        points: 35,
        aliases: ['المندي', 'مندي', 'مندي لحم', 'مندي دجاج', 'مندي حاشي', 'المندي اليمني'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'الجريش',
        emoji: '🥣',
        points: 28,
        aliases: ['الجريش', 'جريش', 'جريشة', 'هريسة', 'الهريسة', 'هريس'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'المطبق',
        emoji: '🥟',
        points: 22,
        aliases: ['المطبق', 'مطبق', 'مطبق جبن', 'مطبق لحم', 'مطبق بيض', 'مطبق موز'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'القرصان',
        emoji: '🫓',
        points: 18,
        aliases: ['القرصان', 'قرصان', 'قرص', 'القرص', 'مرقوق', 'المرقوق'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'المعصوب',
        emoji: '🍌',
        points: 15,
        aliases: ['المعصوب', 'معصوب', 'معصوبة', 'معصوب موز', 'المعصوبة'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'السليق',
        emoji: '🥛',
        points: 12,
        aliases: ['السليق', 'سليق', 'رز سليق', 'رز ابيض بحليب'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'الحنيذ',
        emoji: '🔥',
        points: 10,
        aliases: ['الحنيذ', 'حنيذ', 'حنيذ لحم', 'اللحم المحنذ', 'محنذ'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'العصيدة',
        emoji: '🍯',
        points: 8,
        aliases: ['العصيدة', 'عصيدة', 'عصيده', 'عصيدة تمر'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'المرقوق',
        emoji: '🍲',
        points: 7,
        aliases: ['المرقوق', 'مرقوق', 'مراصيع', 'المراصيع', 'رقاق'],
        isRevealed: false
      }
    ]
  },

  // ========== QUESTION 8: تطبيقات يستخدمها الناس يومياً ==========
  {
    id: 'wdts-8',
    engineType: 'what-do-they-say',
    title: 'اذكر تطبيق على الجوال يستخدمه الناس كل يوم؟',
    category: 'تقنية وتكنولوجيا',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'واتساب',
        emoji: '💬',
        points: 45,
        aliases: ['واتساب', 'واتس اب', 'واتس', 'الواتس', 'whatsapp', 'واتسب', 'وتساب'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'تيك توك',
        emoji: '🎵',
        points: 35,
        aliases: ['تيك توك', 'تيكتوك', 'tiktok', 'التيك توك', 'تك توك'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'سناب شات',
        emoji: '👻',
        points: 28,
        aliases: ['سناب شات', 'سناب', 'snapchat', 'السناب', 'سنابي', 'snap'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'إنستقرام',
        emoji: '📸',
        points: 22,
        aliases: ['انستقرام', 'انستا', 'instagram', 'الانستا', 'انستغرام', 'انستجرام'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'يوتيوب',
        emoji: '▶️',
        points: 18,
        aliases: ['يوتيوب', 'youtube', 'اليوتيوب', 'يوتوب'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'تويتر / إكس',
        emoji: '🐦',
        points: 15,
        aliases: ['تويتر', 'twitter', 'اكس', 'x', 'التويتر', 'تويتري'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'هنقرستيشن / توصيل الطلبات',
        emoji: '🛵',
        points: 12,
        aliases: ['هنقرستيشن', 'جاهز', 'مرسول', 'توصيل', 'ذا شفز', 'كريم', 'اوبر ايتس', 'طلبات'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'أبشر',
        emoji: '🏛️',
        points: 10,
        aliases: ['ابشر', 'أبشر', 'توكلنا', 'نفاذ', 'تطبيقات حكومية'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'خرائط قوقل',
        emoji: '🗺️',
        points: 8,
        aliases: ['خرائط قوقل', 'قوقل ماب', 'الخرائط', 'google maps', 'خرائط', 'الملاحة'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'تلقرام',
        emoji: '✈️',
        points: 7,
        aliases: ['تلقرام', 'تليقرام', 'telegram', 'التلقرام', 'تلجرام'],
        isRevealed: false
      }
    ]
  },

  // ========== QUESTION 9: أشياء تذكرك بالطفولة ==========
  {
    id: 'wdts-9',
    engineType: 'what-do-they-say',
    title: 'اذكر شيئاً يذكّرك بأيام الطفولة؟',
    category: 'ذكريات واجتماعي',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'ألعاب الحارة والشارع',
        emoji: '⚽',
        points: 45,
        aliases: ['لعب الحارة', 'الحارة', 'الشارع', 'كورة', 'طقة', 'استغماية', 'سبع حجار', 'الغميضة', 'الحجلة', 'لعب بره', 'الملعب'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'بيت الجد والجدة',
        emoji: '🏠',
        points: 35,
        aliases: ['بيت جدي', 'الجد', 'الجدة', 'جدي', 'جدتي', 'بيت الجد', 'بيت العائلة', 'دار الجد'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'البقالة والحلويات',
        emoji: '🍬',
        points: 28,
        aliases: ['البقالة', 'بقالة', 'الدكان', 'حلاوة', 'حلويات', 'شيبس', 'بسكويت', 'ابو ريال', 'شبس'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'كرتون الأطفال',
        emoji: '📺',
        points: 22,
        aliases: ['كرتون', 'الكرتون', 'سبيستون', 'ماجد', 'غرندايزر', 'كونان', 'دراغون بول', 'ابطال الديجيتال', 'توم وجيري', 'سالي'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'ألعاب الأتاري والبلايستيشن',
        emoji: '🎮',
        points: 18,
        aliases: ['اتاري', 'بلايستيشن', 'سيقا', 'نينتندو', 'العاب الفيديو', 'بلاي ستيشن', 'سوبر ماريو', 'سوني'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'العيدية والعيد',
        emoji: '🎉',
        points: 15,
        aliases: ['العيد', 'العيدية', 'عيدية', 'عيد الفطر', 'ملابس العيد', 'حق العيد'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'المدرسة والطابور الصباحي',
        emoji: '🏫',
        points: 12,
        aliases: ['المدرسة', 'الطابور', 'الطابور الصباحي', 'الفسحة', 'المقصف', 'زملاء المدرسة', 'الباص'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'ركوب الدراجة / السيكل',
        emoji: '🚲',
        points: 10,
        aliases: ['الدراجة', 'سيكل', 'السيكل', 'بسكليت', 'دراجة هوائية', 'عجلة'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'الآيسكريم والبوظة',
        emoji: '🍦',
        points: 8,
        aliases: ['ايسكريم', 'بوظة', 'جيلاتي', 'ايس كريم', 'السندويتش الازرق', 'الحليب المثلج', 'ساندوتش ايسكريم'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'القصص والحكايات قبل النوم',
        emoji: '📖',
        points: 7,
        aliases: ['قصص', 'القصص', 'حكايات', 'حواديت', 'قصة قبل النوم', 'كان يا مكان'],
        isRevealed: false
      }
    ]
  },

  // ========== QUESTION 10: ماركات سيارات منتشرة في السعودية ==========
  {
    id: 'wdts-10',
    engineType: 'what-do-they-say',
    title: 'اذكر ماركة سيارة منتشرة في شوارع السعودية؟',
    category: 'سيارات ومواصلات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'تويوتا',
        emoji: '🚗',
        points: 45,
        aliases: ['تويوتا', 'toyota', 'كامري', 'هايلكس', 'لاندكروزر', 'كورولا', 'يارس', 'افالون', 'شاص', 'ربع'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'هيونداي',
        emoji: '🚙',
        points: 35,
        aliases: ['هيونداي', 'hyundai', 'هونداي', 'اكسنت', 'النترا', 'سوناتا', 'توسان', 'كريتا'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'شيفروليه / جمس',
        emoji: '🏎️',
        points: 28,
        aliases: ['شيفروليه', 'شفروليه', 'جمس', 'chevrolet', 'gmc', 'تاهو', 'يوكن', 'سلفرادو', 'سوبربان', 'كابرس'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'فورد',
        emoji: '🛻',
        points: 22,
        aliases: ['فورد', 'ford', 'اكسبلورر', 'اكسبدشن', 'فكتوريا', 'توروس', 'ايدج'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'نيسان',
        emoji: '🚘',
        points: 18,
        aliases: ['نيسان', 'nissan', 'باترول', 'ددسن', 'صني', 'التيما', 'ماكسيما', 'اكستيرا'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'مرسيدس',
        emoji: '✨',
        points: 15,
        aliases: ['مرسيدس', 'mercedes', 'بنز', 'مرسيدس بنز', 'اس كلاس', 'سي كلاس'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'بي ام دبليو',
        emoji: '🏁',
        points: 12,
        aliases: ['بي ام', 'bmw', 'بي ام دبليو', 'بمو', 'البي ام'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'لكزس',
        emoji: '💎',
        points: 10,
        aliases: ['لكزس', 'lexus', 'اي اس', 'ال اس', 'جي اكس'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'كيا',
        emoji: '🚐',
        points: 8,
        aliases: ['كيا', 'kia', 'سيراتو', 'اوبتيما', 'سبورتاج', 'ريو'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'جيب / دودج',
        emoji: '🏔️',
        points: 7,
        aliases: ['جيب', 'jeep', 'دودج', 'dodge', 'رانجلر', 'شارجر', 'تشالنجر', 'تشيروكي'],
        isRevealed: false
      }
    ]
  },

  // ========== QUESTION 11: لاعب كرة قدم سعودي مشهور ==========
  {
    id: 'wdts-11',
    engineType: 'what-do-they-say',
    title: 'اذكر لاعب كرة قدم سعودي يعرفه أغلب الناس؟',
    category: 'رياضة وكرة قدم',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'ماجد عبدالله',
        emoji: '⭐',
        points: 45,
        aliases: ['ماجد عبدالله', 'ماجد', 'ماجد عبد الله', 'الاسطورة', 'اسطورة الكرة السعودية'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'سامي الجابر',
        emoji: '🌟',
        points: 35,
        aliases: ['سامي الجابر', 'سامي', 'الجابر', 'صاروخ'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'ياسر القحطاني',
        emoji: '🦅',
        points: 28,
        aliases: ['ياسر القحطاني', 'ياسر', 'القحطاني', 'ابو قحط', 'سنايبر'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'سعيد العويران',
        emoji: '🎯',
        points: 22,
        aliases: ['سعيد العويران', 'العويران', 'سعيد', 'هدف العويران', 'الهدف التاريخي'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'نواف التمياط',
        emoji: '💫',
        points: 18,
        aliases: ['نواف التمياط', 'نواف', 'التمياط', 'ابو نواف'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'محمد الدعيع',
        emoji: '🧤',
        points: 15,
        aliases: ['محمد الدعيع', 'الدعيع', 'حارس المنتخب'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'فهد الهريفي',
        emoji: '🔥',
        points: 12,
        aliases: ['فهد الهريفي', 'الهريفي', 'فهد', 'شبح الحارة'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'سالم الدوسري',
        emoji: '🇸🇦',
        points: 10,
        aliases: ['سالم الدوسري', 'سالم', 'الدوسري', 'ابو سالم'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'محمد كنو',
        emoji: '👟',
        points: 8,
        aliases: ['محمد كنو', 'كنو'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'يوسف الثنيان',
        emoji: '🏆',
        points: 7,
        aliases: ['يوسف الثنيان', 'الثنيان', 'يوسف'],
        isRevealed: false
      }
    ]
  },

  // ========== QUESTION 12: أشياء يفعلها الناس في الزواجات ==========
  {
    id: 'wdts-12',
    engineType: 'what-do-they-say',
    title: 'اذكر شيئاً يفعله الناس عادةً في حفلات الزواج؟',
    category: 'مناسبات واجتماعي',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'الرقص والتمايل',
        emoji: '💃',
        points: 45,
        aliases: ['الرقص', 'يرقصون', 'رقص', 'العرضة', 'الدحة', 'المزمار', 'يخبطون', 'يطربون', 'الشيلة'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'التصوير والسنابات',
        emoji: '📱',
        points: 35,
        aliases: ['التصوير', 'يصورون', 'سنابات', 'سناب', 'السيلفي', 'فيديو', 'صور', 'تصوير'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'الأكل والعشاء',
        emoji: '🍖',
        points: 28,
        aliases: ['الاكل', 'العشاء', 'الذبايح', 'الرز', 'الكبسة', 'البوفيه', 'اكل', 'ياكلون', 'المندي'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'السلام على العريس وأهله',
        emoji: '🤝',
        points: 22,
        aliases: ['السلام', 'يسلمون', 'المباركة', 'مبروك', 'الف مبروك', 'التهنئة', 'يباركون', 'السلام على العريس'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'لبس البشت أو الثوب الجديد',
        emoji: '👔',
        points: 18,
        aliases: ['البشت', 'بشت', 'الثوب', 'ثوب جديد', 'الشماغ', 'يتأنقون', 'تفصيل', 'ثوب مكوي'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'التطييب والعطور',
        emoji: '🌸',
        points: 15,
        aliases: ['العطر', 'عطر', 'التطييب', 'بخور', 'عود', 'البخور', 'المسك', 'دهن عود'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'شرب القهوة والشاي',
        emoji: '☕',
        points: 12,
        aliases: ['القهوة', 'الشاي', 'قهوة', 'شاي', 'الضيافة', 'يشربون', 'فناجيل'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'المعاريس يطلعون على المسرح',
        emoji: '🎤',
        points: 10,
        aliases: ['المسرح', 'المنصة', 'الكوشة', 'فرقة', 'الفرقة', 'الطبال', 'زفة', 'الزفة'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'إعطاء العريس فلوس (النقطة)',
        emoji: '💰',
        points: 8,
        aliases: ['النقطة', 'فلوس', 'هدية', 'نقطة', 'المعاريس', 'ينقطون', 'كاش'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'الطلعة بدري / التسحب من العرس',
        emoji: '🚪',
        points: 7,
        aliases: ['الطلعة بدري', 'يطلعون بدري', 'التسحب', 'يمشون', 'يسحبون', 'مشوا بدري', 'قبل العشاء'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-13',
    engineType: 'what-do-they-say',
    title: 'اذكر شيئاً يفعله السائقون عندما يقفون في زحمة السير؟',
    category: 'عادات ويوميات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'الجوال وتصفح التطبيقات',
        emoji: '📱',
        points: 45,
        aliases: ['الجوال', 'جوال', 'تلفون', 'واتساب', 'سناب', 'تيك توك', 'تصفح', 'انستقرام', 'تويتر', 'اكس', 'الرسائل', 'يشوف الجوال'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'تشغيل الموسيقى / البودكاست / الراديو',
        emoji: '🎵',
        points: 35,
        aliases: ['اغاني', 'اغنية', 'شيلات', 'شيلة', 'بودكاست', 'الراديو', 'راديو', 'موسيقى', 'قران', 'سماع', 'يسمع', 'الصوت'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'التعديل في المراية (الشماغ / المكياج)',
        emoji: '🪞',
        points: 28,
        aliases: ['المراية', 'يعدل شماغه', 'الشماغ', 'العقال', 'المكياج', 'تعدل شعرها', 'المرايا', 'يشوف شكله', 'مكياج', 'رووج'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'شرب القهوة أو الماء أو الأكل',
        emoji: '☕',
        points: 22,
        aliases: ['القهوة', 'قهوة', 'كوفي', 'شاي', 'يشرب موية', 'موية', 'ماء', 'اكل', 'سناك', 'ياكل', 'شرب', 'شوكولاته'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'التلفت ومراقبة السيارات المجاورة',
        emoji: '👀',
        points: 18,
        aliases: ['يطالع الناس', 'يشوف السيارات', 'التلفت', 'يناظر', 'يشوف اللي جنبه', 'مراقبة الناس', 'يطالع', 'الفضول'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'استخدام بوري السيارة (المنبه)',
        emoji: '📢',
        points: 15,
        aliases: ['البوري', 'بوري', 'الهرن', 'هرن', 'يدق بوري', 'تنبيه', 'ازعاج', 'يضرب بوري', 'كلاكس'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'التدخين أو الفيب',
        emoji: '🚬',
        points: 12,
        aliases: ['دخان', 'يدخن', 'سجائر', 'فيب', 'شيشة الكترونية', 'شيشة', 'سيجارة'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'التثاؤب أو الاسترخاء والتمدد',
        emoji: '🥱',
        points: 10,
        aliases: ['يتثاوب', 'تثاؤب', 'يتمدد', 'ينعس', 'النوم', 'يريح', 'يتكاسل', 'استرخاء'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'فتح النافذة / الشباك',
        emoji: '🪟',
        points: 8,
        aliases: ['يفتح الشباك', 'القزاز', 'النافذة', 'ينزل القزاز', 'شباك', 'هواء', 'يشم هواء'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'محاولة التجاوز وتغيير المسار',
        emoji: '🚗',
        points: 7,
        aliases: ['يسقط', 'يغير مسار', 'تغيير المسار', 'يدور مخرج', 'يسقط على السيارات', 'تجاوز', 'يلف', 'يحاول يهرب'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-14',
    engineType: 'what-do-they-say',
    title: 'عذر مشهور يقوله الشخص إذا تأخر عن موعد أو دوام؟',
    category: 'مواقف وطرف',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'زحمة الطريق والشارع',
        emoji: '🚗',
        points: 45,
        aliases: ['الزحمة', 'زحمة', 'زحمة الشارع', 'زحمة الطريق', 'الشارع واقف', 'خط زحمة', 'حادث بالطريق', 'الدائري واقف'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'راحت علي نومة / ما رن المنبه',
        emoji: '⏰',
        points: 35,
        aliases: ['راحت علي نومة', 'المنبه', 'ما دق المنبه', 'نمت', 'نومة', 'ما صحيت', 'ما سمعت المنبه', 'النوم', 'كنت نايم'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'ما لقيت موقف للسيارة',
        emoji: '🅿️',
        points: 28,
        aliases: ['الموقف', 'مواقف', 'مافي موقف', 'ادور موقف', 'زحمة مواقف', 'المواقف فل', 'ما حصلت موقف', 'موقف'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'عطل أو بنشر في السيارة',
        emoji: '🔧',
        points: 22,
        aliases: ['بنشر', 'السيارة خربت', 'السيارة ما اشتغلت', 'البطارية', 'عطل', 'كفر', 'بنشرت', 'حرارة السيارة'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'ظرف عائلي مفاجئ',
        emoji: '👨‍👩‍👧',
        points: 18,
        aliases: ['ظرف عائلي', 'الاهل', 'ظرف طارئ', 'مشوار عائلي', 'وديت الاهل', 'الوالدة', 'الوالد', 'ظروف', 'شغل عائلي'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'كنت تعبان أو مريض',
        emoji: '🤒',
        points: 15,
        aliases: ['تعبان', 'مريض', 'تعب', 'المستشفى', 'مستوصف', 'صداع', 'بطني يعورني', 'سخونة', 'كنت تعبان'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'نسيت الأغراض / المفاتيح ورجعت',
        emoji: '🔑',
        points: 12,
        aliases: ['نسيت المفتاح', 'المفاتيح', 'نسيت الجوال', 'نسيت اغراضي', 'رجعت البيت', 'نسيت المحفظة', 'نسيت اللابتوب'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'إشارة حمراء أو تفتيش أمني',
        emoji: '🚦',
        points: 10,
        aliases: ['اشارة', 'الاشارات', 'تفتيش', 'نقطة تفتيش', 'المرور', 'ساهر', 'وقفني المرور', 'طابور الاشارة'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'كنت في مكالمة أو اجتماع مهم',
        emoji: '📞',
        points: 8,
        aliases: ['مكالمة', 'اجتماع', 'اتصال مهم', 'مكالمة عمل', 'المدير كلمني', 'مكالمة طويلة', 'مكالمه'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'ضيعت الطريق / اللوكيشن غلط',
        emoji: '🗺️',
        points: 7,
        aliases: ['ضيعت', 'اللوكيشن غلط', 'الماب', 'قوقل ماب وداني غلط', 'ضيعت الوصف', 'ما دليت المكان', 'الشارع مقفل'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-15',
    engineType: 'what-do-they-say',
    title: 'أكلة أو مشروب شعبي يشتهر به الشتاء والجمعات؟',
    category: 'طعام ومأكولات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'الحنيني',
        emoji: '🍯',
        points: 45,
        aliases: ['الحنيني', 'حنيني', 'حنيني بالتمر', 'الحنيني بالزبدة', 'الحنيني القصيمي'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'المرقوق والقرصان',
        emoji: '🍲',
        points: 35,
        aliases: ['مرقوق', 'المرقوق', 'قرصان', 'القرصان', 'مرقوق باللحم', 'قرصان بالخضار', 'مطازيز', 'المطازيز'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'السليق الطائفي',
        emoji: '🍚',
        points: 28,
        aliases: ['سليق', 'السليق', 'سليق طائفي', 'سليق بالدجاج', 'سليق باللحم', 'سليق بالحليب'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'الكستناء (أبو فروة)',
        emoji: '🌰',
        points: 22,
        aliases: ['ابو فروة', 'كستناء', 'ابوفروة', 'الكستناء', 'كستنا', 'ابو فروه', 'شوي ابو فروة'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'شاي الكرك والزنجبيل والحليب',
        emoji: '☕',
        points: 18,
        aliases: ['كرك', 'الكرك', 'شاي كرك', 'حليب زنجبيل', 'زنجبيل', 'شاي بالزنجبيل', 'حليب بالزعفران', 'حليب بالهيل'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'الجريش',
        emoji: '🥣',
        points: 15,
        aliases: ['جريش', 'الجريش', 'جريش احمر', 'جريش ابيض', 'الجريش الكويتي', 'الجريش النجدي'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'القشد الملكي',
        emoji: '🍮',
        points: 12,
        aliases: ['قشد', 'القشد', 'قشد بالتمر', 'قشد بالبسكوت', 'القشطة', 'عفوسة'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'الكبسة والمظبي على الحطب',
        emoji: '🍗',
        points: 10,
        aliases: ['كبسة', 'الكبسة', 'مظبي', 'مندي', 'مضغوط', 'كبسة حاشي', 'كبسة لحم', 'رز ولحم'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'المصابيب والمراصيع',
        emoji: '🥞',
        points: 8,
        aliases: ['مصابيب', 'المصابيب', 'مراصيع', 'المراصيع', 'بان كيك شعبي', 'مصابيب بالعسل', 'مصابيب بالسمن'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'شوربة الشوفان / العدس الساخنة',
        emoji: '🥣',
        points: 7,
        aliases: ['شوربة', 'الشوربة', 'شوربة عدس', 'شوربة شوفان', 'شوربة كويكر', 'شوربة لحم', 'شوربه'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-16',
    engineType: 'what-do-they-say',
    title: 'مكان يذهب إليه الناس لتغيير جو في عطلة نهاية الأسبوع (الويكند)؟',
    category: 'أماكن وترفيه',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'الكافيهات والمقاهي',
        emoji: '☕',
        points: 45,
        aliases: ['كافيه', 'كوفي', 'الكافيهات', 'المقاهي', 'قهوة', 'كافيهات', 'مقهى', 'كوفيهات'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'المطاعم والعشاء',
        emoji: '🍔',
        points: 35,
        aliases: ['المطاعم', 'مطعم', 'عشاء', 'غداء', 'بوفيه', 'مطاعم', 'مطعم جديد', 'البرقر'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'المولات والأسواق',
        emoji: '🛍️',
        points: 28,
        aliases: ['المول', 'مول', 'السوق', 'المولات', 'الاسواق', 'تسوق', 'بوليفارد', 'رد سي', 'النخيل مول'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'البر والكشتة والمخيمات',
        emoji: '⛺',
        points: 22,
        aliases: ['البر', 'كشتة', 'كشته', 'مخيم', 'المخيم', 'الطعوس', 'الثمامة', 'رحله برية', 'الصحراء'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'البحر والكورنيش والشاطئ',
        emoji: '🌊',
        points: 18,
        aliases: ['البحر', 'بحر', 'الكورنيش', 'كورنيش', 'الشاطئ', 'شاطئ', 'واجهة بحرية', 'الهاف مون', 'شاطئ الغروب'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'الشاليهات والاستراحات',
        emoji: '🏡',
        points: 15,
        aliases: ['شاليه', 'الشاليه', 'استراحة', 'الاستراحة', 'شاليهات', 'استراحات', 'مزرعة', 'المزرعة', 'مسبح'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'السينما والأفلام',
        emoji: '🎬',
        points: 12,
        aliases: ['سينما', 'السينما', 'فلم', 'فيلم', 'افلام', 'فوكس سينما', 'موفيز', 'صالات السينما'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'الحدائق العامة والمنتزهات',
        emoji: '🌳',
        points: 10,
        aliases: ['حديقة', 'الحديقة', 'منتزه', 'المنتزه', 'حدائق', 'الممشى', 'ممشى', 'حديقة الملك عبدالله'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'بيت الأهل والجمعة العائلية',
        emoji: '👨‍👩‍👧‍👦',
        points: 8,
        aliases: ['بيت الاهل', 'بيت الجد', 'الاهل', 'جمعة الاهل', 'بيت ابوي', 'بيت امي', 'العائلة', 'الجمعة'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'السفر لمدينة ثانية (سياحة محلية)',
        emoji: '✈️',
        points: 7,
        aliases: ['سفر', 'السفر', 'الشرقية', 'جدة', 'الرياض', 'ابها', 'العلا', 'الطائف', 'طيارة', 'سياحة'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-17',
    engineType: 'what-do-they-say',
    title: 'شيء ينساه الناس كثيراً في الفندق أو أثناء السفر؟',
    category: 'سفر ويوميات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'شاحن الجوال وسلك الشاحن',
        emoji: '🔌',
        points: 45,
        aliases: ['الشاحن', 'شاحن', 'سلك الشاحن', 'شاحن الجوال', 'فيش', 'توصيلة', 'الفيش', 'راس الشاحن', 'سلك'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'النظارة الشمسية أو الطبية',
        emoji: '🕶️',
        points: 35,
        aliases: ['النظارة', 'نظارة', 'نظارات', 'النظارة الشمسية', 'نظارة شمسية', 'نظارة طبية', 'نظارتي'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'الملابس في الدولاب أو الحمام',
        emoji: '👕',
        points: 28,
        aliases: ['الملابس', 'ملابس', 'ثوب', 'جاكيت', 'قميص', 'بجامة', 'فستان', 'الملابس بالدولاب', 'الشماغ'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'فرشاة ومعجون الأسنان',
        emoji: '🪥',
        points: 22,
        aliases: ['فرشاة الاسنان', 'فرشة اسنان', 'معجون', 'المعجون', 'فرشة', 'فرشاة', 'ادوات الحمام'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'العطر ومستحضرات التجميل',
        emoji: '🧴',
        points: 18,
        aliases: ['العطر', 'عطر', 'المكياج', 'مكياج', 'كريم', 'شامبو', 'عطور', 'لوشن', 'مستحضرات'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'ساعة اليد والمجوهرات',
        emoji: '⌚',
        points: 15,
        aliases: ['الساعة', 'ساعة', 'خاتم', 'سلسال', 'ذهب', 'اكسسوارات', 'مجوهرات', 'حلق', 'اسوارة'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'سماعات الأذن (إيربودز)',
        emoji: '🎧',
        points: 12,
        aliases: ['سماعات', 'السماعة', 'سماعة', 'ايربودز', 'airpods', 'سماعات البلوتوث', 'سماعة اذن'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'كرت الغرفة أو المفاتيح',
        emoji: '💳',
        points: 10,
        aliases: ['كرت الغرفة', 'المفتاح', 'بطاقة الغرفة', 'الكرت', 'مفتاح الغرفة', 'كرت الفندق', 'مفاتيح'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'الجوازات والوثائق والمحفظة',
        emoji: '🛂',
        points: 8,
        aliases: ['الجواز', 'جواز السفر', 'المحفظة', 'بطاقات', 'الهوية', 'الاوراق', 'وثائق', 'الباسبور'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'مخدة أو وسادة السفر',
        emoji: '🛋️',
        points: 7,
        aliases: ['المخدة', 'مخدة', 'وسادة', 'مخدة الرقبة', 'بطانية', 'مفرش'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-18',
    engineType: 'what-do-they-say',
    title: 'حركة أو عادة يفعلها الشخص إذا كان متوتراً أو ينتظر خبراً مهماً؟',
    category: 'نفسي واجتماعي',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'هز الرجل أو القدم باستمرار',
        emoji: '🦵',
        points: 45,
        aliases: ['يهز رجله', 'هز الرجل', 'هز القدم', 'يهز ساقه', 'تحريك الرجل', 'رجله تهتز', 'يهز'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'قضم وأكل الأظافر',
        emoji: '💅',
        points: 35,
        aliases: ['ياكل اظافره', 'قضم الاظافر', 'عض الاظافر', 'اظافره', 'يعض اصابعه', 'نتف الاظافر'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'تكرار فتح وقفل الجوال بدون هدف',
        emoji: '📱',
        points: 28,
        aliases: ['يشوف الجوال', 'يفتح الجوال', 'يقفل الجوال', 'تصفح الجوال', 'يشيك الجوال', 'يمسك التلفون'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'المشي والرايح والجاي (دوران في المكان)',
        emoji: '🚶‍♂️',
        points: 22,
        aliases: ['يمشي', 'رايح جاي', 'يمشي بالغرفة', 'المشي', 'يدور في مكانه', 'حركة كثيرة', 'يتحرك'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'اللعب بالشعر أو اللحية أو الشارب',
        emoji: '🧔',
        points: 18,
        aliases: ['يلعب بشعره', 'يلمس لحيته', 'اللحية', 'الشارب', 'الشعر', 'يفرك لحيته', 'يمسك شعره'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'النقر بالقلم أو الأصابع على الطاولة',
        emoji: '🖊️',
        points: 15,
        aliases: ['يطقطق بالقلم', 'النقر', 'يطقطق بالاصابع', 'يطق الطاولة', 'دق القلم', 'صوت القلم'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'شرب الماء بكثرة أو ريقه ينشف',
        emoji: '💧',
        points: 12,
        aliases: ['يشرب موية', 'شرب الماء', 'موية', 'ينشف ريقه', 'يبلع ريقه', 'عطش', 'يشرب ماء'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'فرك ومسح اليدين (تعرق اليدين)',
        emoji: '🤲',
        points: 10,
        aliases: ['يفرك يديه', 'مسح اليدين', 'عرق اليد', 'يدينه تعرق', 'فرك اليدين', 'يمسك يدينه'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'التنهد وأخذ أنفاس عميقة',
        emoji: '😮‍💨',
        points: 8,
        aliases: ['يتنهد', 'تنهد', 'ياخذ نفس', 'تنفس عميق', 'زفير', 'شهيق', 'يتحسر'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'النظر في الساعة بشكل متكرر',
        emoji: '⌚',
        points: 7,
        aliases: ['يشوف الساعة', 'يناظر الساعة', 'الساعة', 'كم باقي', 'الوقت', 'يشيك الوقت'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-19',
    engineType: 'what-do-they-say',
    title: 'طلب أو غرض تطلبه الأم من أولادها وهي جالسة في الصالة؟',
    category: 'عائلة ويوميات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'كوب ماء بارد',
        emoji: '🥛',
        points: 45,
        aliases: ['موية', 'كاس موية', 'ماء', 'كوب ماء', 'مويه', 'جيب موية', 'كاس ماء بارد', 'ماء بارد'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'ريموت التلفزيون أو المكيف',
        emoji: '📺',
        points: 35,
        aliases: ['الريموت', 'ريموت', 'ريموت التلفزيون', 'ريموت المكيف', 'قصري التلفزيون', 'طفي التلفزيون', 'التحكم'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'الجوال أو شاحن الجوال',
        emoji: '📱',
        points: 28,
        aliases: ['الجوال', 'جوالي', 'الشاحن', 'شاحن', 'جيبي جوالي', 'شاحن الجوال', 'التلفون', 'وين جوالي'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'نظارة القراءة',
        emoji: '👓',
        points: 22,
        aliases: ['النظارة', 'نظارتي', 'نظارة القراءة', 'نظارة', 'جيبي نظارتي', 'وين نظارتي'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'فنجان قهوة أو بيالة شاي',
        emoji: '☕',
        points: 18,
        aliases: ['قهوة', 'شاي', 'فنجان قهوة', 'بيالة شاي', 'الدلة', 'شاهي', 'صب لي قهوة', 'جيبي الشاي'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'تسكير الباب أو إطفاء النور',
        emoji: '🚪',
        points: 15,
        aliases: ['صك الباب', 'سكر الباب', 'طفي النور', 'اقفل الباب', 'طفي اللمبة', 'النور', 'الباب'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'علبة المناديل',
        emoji: '🧻',
        points: 12,
        aliases: ['مناديل', 'كلينكس', 'علبة مناديل', 'فاين', 'منديل', 'جيبي مناديل'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'الدواء أو المسكن أو البندول',
        emoji: '💊',
        points: 10,
        aliases: ['الدواء', 'دوا', 'حبوب الضغط', 'بندول', 'مسكن', 'فيتامين', 'علاجي', 'العلاج'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'غرض من المطبخ أو الثلاجة',
        emoji: '🍳',
        points: 8,
        aliases: ['المطبخ', 'من الثلاجة', 'صحن', 'ملعقة', 'فاكهة', 'تمر', 'حلى', 'اكل'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'مقص أو خيط وإبرة',
        emoji: '✂️',
        points: 7,
        aliases: ['المقص', 'مقص', 'خيط', 'ابرة', 'خياطة', 'قصاصة اظافر'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-20',
    engineType: 'what-do-they-say',
    title: 'أول شيء يفعله السائق أول ما يركب سيارته قبل أن يتحرك؟',
    category: 'سيارات ويوميات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'ربط حزام الأمان',
        emoji: '🪢',
        points: 45,
        aliases: ['الحزام', 'حزام الامان', 'يربط الحزام', 'ربط الحزام', 'حزام'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'تشغيل المكيف',
        emoji: '❄️',
        points: 35,
        aliases: ['المكيف', 'يشغل المكيف', 'مكيف', 'تبريد', 'تشغيل مكيف', 'يهوي'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'شبك الجوال بالبلوتوث / تشغيل الصوت',
        emoji: '📱',
        points: 28,
        aliases: ['بلوتوث', 'يشبك البلوتوث', 'يشغل اغنية', 'كار بلاي', 'carplay', 'الصوتيات', 'الشاشة', 'الموسيقى'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'تثبيت الجوال في الحامل / الشاحن',
        emoji: '🔌',
        points: 22,
        aliases: ['يحط الجوال بالقاعدة', 'حامل الجوال', 'المسكة', 'شاحن', 'يشحن الجوال', 'يحط الجوال'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'تعديل المرايات ومقعد السائق',
        emoji: '🪞',
        points: 18,
        aliases: ['يعدل المرايات', 'المرايا', 'المرتبة', 'يعدل الكرسي', 'المقعد', 'وزنية الكرسي', 'المراية'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'تشغيل الخريطة (قوقل ماب / ويز)',
        emoji: '🗺️',
        points: 15,
        aliases: ['قوقل ماب', 'الخريطة', 'ماب', 'اللوكيشن', 'google maps', 'waze', 'يشغل الخريطة', 'تحديد المسار'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'لبس النظارة الشمسية',
        emoji: '🕶️',
        points: 12,
        aliases: ['النظارة', 'يلبس النظارة', 'نظارة شمسية', 'نظارة', 'النظارات'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'قول دعاء الركوب / التسمية',
        emoji: '🤲',
        points: 10,
        aliases: ['دعاء الركوب', 'بسم الله', 'الدعاء', 'التسمية', 'يدعو', 'ذكر الله', 'سبحان الذي سخر لنا هذا'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'إقفال الأبواب (السنترلوك)',
        emoji: '🔒',
        points: 8,
        aliases: ['يقفل الباب', 'سنتر لوك', 'تامين الابواب', 'قفل البيبان', 'الابواب'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'تنزيل الجلنط / وضع القير في D',
        emoji: '⚙️',
        points: 7,
        aliases: ['الجلنط', 'ينزل الجلنط', 'القير', 'فرامل اليد', 'يدعس فرامل', 'يحط القير D'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-21',
    engineType: 'what-do-they-say',
    title: 'رسالة أو صورة تراها دائماً في قروبات العائلة بالواتساب؟',
    category: 'تواصل واجتماعي',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'أذكار الصباح والمساء وأدعية',
        emoji: '🤲',
        points: 45,
        aliases: ['اذكار', 'الاذكار', 'دعاء', 'ادعية', 'اذكار الصباح', 'اذكار المساء', 'ايات قرانية', 'قران'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'صباح الخير ومساء الخير (مع صور ورد)',
        emoji: '🌹',
        points: 35,
        aliases: ['صباح الخير', 'مساء الخير', 'صور ورد', 'وردة', 'فنجان قهوة وورد', 'تصبيحات', 'يسعد صباحكم'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'تهنئة يوم الجمعة (جمعة مباركة)',
        emoji: '🕌',
        points: 28,
        aliases: ['جمعة مباركة', 'يوم الجمعة', 'تهنئة الجمعة', 'سورة الكهف', 'الجمعة', 'جمعتكم طيبة'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'نصائح طبية ومقاطع علاج وتغذية',
        emoji: '🩺',
        points: 22,
        aliases: ['نصائح طبية', 'علاج', 'طب بديل', 'فوائد الثوم والليمون', 'خلطة', 'دكتور', 'صحة', 'فيديو طبي'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'أخبار العائلة والمناسبات (زواج / مولود)',
        emoji: '🎉',
        points: 18,
        aliases: ['اخبار العائلة', 'زواج', 'مولود', 'مبروك', 'عزيمة', 'عرس', 'تهاني', 'مناسبة', 'تخرج'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'تحذيرات وإشاعات وروابط واتساب',
        emoji: '⚠️',
        points: 15,
        aliases: ['اشاعات', 'تحذير', 'انتبهوا', 'روابط', 'احذروا من هذا الرقم', 'اخبار واتساب', 'اشاعة'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'صور وفيديوهات أطفال العائلة',
        emoji: '👶',
        points: 12,
        aliases: ['صور بزارين', 'الاطفال', 'فيديو بزر', 'صور الصغار', 'حركات اطفال', 'بيبي'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'صور الفطور والطبخ والجمعات',
        emoji: '🍳',
        points: 10,
        aliases: ['صور فطور', 'طبخات', 'اكل', 'سفرة الغداء', 'كشتة', 'جمعة اليوم', 'حلى'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'ملصقات وستيكرات مضحكة',
        emoji: '😂',
        points: 8,
        aliases: ['ستيكرات', 'ملصقات', 'ستيكر', 'ضحك', 'ميمز', 'ملصق'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'موقع ولوكيشن اجتماع أو استراحة',
        emoji: '📍',
        points: 7,
        aliases: ['لوكيشن', 'الموقع', 'موقع الاستراحة', 'وينكم', 'رابط المكان', 'خريطة'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-22',
    engineType: 'what-do-they-say',
    title: 'نشاط أو لعبة يلعبها الشباب في الاستراحة أو الكشتة؟',
    category: 'ألعاب وشباب',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'لعبة البلوت',
        emoji: '♠️',
        points: 45,
        aliases: ['بلوت', 'البلوت', 'ورقة', 'لعب بلوت', 'صن وحكم', 'سكة', 'كبوت'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'الشواء والطبخ وإعداد العشاء',
        emoji: '🥩',
        points: 35,
        aliases: ['شواء', 'الشوي', 'طبخ', 'عشاء', 'مضغوط', 'كبسة', 'برقر شوي', 'تقطيع لحم'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'البلايستيشن ولعبة فيفا / FC',
        emoji: '🎮',
        points: 28,
        aliases: ['بلايستيشن', 'فيفا', 'سوني', 'fifa', 'fc24', 'fc25', 'playstation', 'بطولة فيفا', 'العاب سوني'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'السوالف والقصص والمواقف المضحكة',
        emoji: '🗣️',
        points: 22,
        aliases: ['سوالف', 'قصص', 'طقطقة', 'ضحك', 'سالفة', 'جلسة سوالف', 'حش', 'مواقف'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'كرة القدم أو البادل',
        emoji: '⚽',
        points: 18,
        aliases: ['كورة', 'كرة قدم', 'بادل', 'ملعب', 'مباراة', 'لعب كورة', 'تحدي بادل', 'طائرة'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'إشعال شبّة النار والشاي والقهوة',
        emoji: '🔥',
        points: 15,
        aliases: ['شبة النار', 'شبة نار', 'الحطب', 'شاي جمر', 'قهوة على الجمر', 'نار', 'دلة'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'ألعاب الورق والكوتشينة (أونو / تريكس)',
        emoji: '🃏',
        points: 12,
        aliases: ['اونو', 'uno', 'تريكس', 'كوتشينة', 'هند', 'باصرة', 'العاب ورق', 'جاكارو'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'ألعاب التخمين والألغاز والأسئلة',
        emoji: '🧠',
        points: 10,
        aliases: ['الغاز', 'مسابقات', 'تخمين', 'لعبة بدون كلام', 'اسئلة ثقافية', 'مين انا', 'وش يقولون'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'مشاهدة مباريات كرة القدم في الشاشة',
        emoji: '📺',
        points: 8,
        aliases: ['مباراة', 'مباريات', 'دوري روشن', 'دوري الابطال', 'الهلال والنصر', 'الكلاسيكو', 'كورة بالتلفزيون'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'السباحة في المسبح',
        emoji: '🏊‍♂️',
        points: 7,
        aliases: ['مسبح', 'سباحة', 'يسبحون', 'نط في المسبح', 'المسبح', 'تحدي سباحة'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-23',
    engineType: 'what-do-they-say',
    title: 'شيء يحب الناس تصويره ونشره في السناب أو الإنستقرام؟',
    category: 'سوشيال ميديا',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'فنجان القهوة والحلى',
        emoji: '☕',
        points: 45,
        aliases: ['القهوة', 'كوفي', 'فنجان قهوة', 'حلى', 'سويت', 'لاتيه', 'كيكة', 'كوب قهوة', 'ستاربكس'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'أطباق المطاعم والأكل الفاخر',
        emoji: '🍽️',
        points: 35,
        aliases: ['الاكل', 'مطعم', 'عشاء', 'سفرة', 'اكل مطاعم', 'غداء', 'برقر', 'ستيك', 'تصوير الاكل'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'السفر والمطارات والمناظر الطبيعية',
        emoji: '✈️',
        points: 28,
        aliases: ['السفر', 'المطار', 'طيارة', 'تذكرة', 'جواز', 'بحر', 'طبيعة', 'غيوم', 'امطار', 'مطر'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'قيادة السيارة والشارع مع أغنية',
        emoji: '🚗',
        points: 22,
        aliases: ['السيارة', 'الدركسون', 'يسوق', 'خط', 'الشارع', 'شاشة السيارة', 'سواقة', 'اغنية بالسيارة'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'الكشخة والملابس (الأوتفت)',
        emoji: '👗',
        points: 18,
        aliases: ['كشخة', 'الملابس', 'اووتفت', 'outfit', 'شياكة', 'ثوب العيد', 'فستان', 'مراية اللبس', 'سيلفي'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'الحفلات والمناسبات والزواجات',
        emoji: '🎊',
        points: 15,
        aliases: ['حفلة', 'زواج', 'عرس', 'يوم ميلاد', 'مناسبة', 'تخرج', 'كيكة ميلاد', 'بارتي'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'التسوق والمشتريات والماركات',
        emoji: '🛍️',
        points: 12,
        aliases: ['تسوق', 'اكياس الماركات', 'مشتريات', 'شوبنق', 'بوكسات', 'هدايا', 'هدية', 'انبوكسنق'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'غروب الشمس والشروق والسماء',
        emoji: '🌅',
        points: 10,
        aliases: ['غروب', 'الغروب', 'شروق', 'الشمس', 'السماء', 'القمر', 'منظر طبيعي', 'شمس'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'الأطفال وحركاتهم اللطيفة',
        emoji: '👶',
        points: 8,
        aliases: ['الاطفال', 'بزران', 'طفل', 'ضحك اطفال', 'حركات بزر', 'بيبي'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'تمارين الجيم والنادي والرياضة',
        emoji: '💪',
        points: 7,
        aliases: ['الجيم', 'نادي', 'تمارين', 'حديد', 'رياضة', 'عضلات', 'سيلفي الجيم', 'بروتين'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-24',
    engineType: 'what-do-they-say',
    title: 'سبب يجعل الشخص يرفض أو يتجاهل الرد على المكالمة فوراً؟',
    category: 'مواقف ويوميات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'الجوال صامت وما سمع الاتصال',
        emoji: '🔕',
        points: 45,
        aliases: ['صامت', 'الجوال صامت', 'ما سمعته', 'ما سمعت', 'كان صامت', 'بدون صوت', 'ما انتبهت'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'نائم أو مسترخي في السرير',
        emoji: '😴',
        points: 35,
        aliases: ['نايم', 'كنت نايم', 'النوم', 'في السرير', 'نعسان', 'نومة', 'منسدح'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'يقود السيارة في الطريق',
        emoji: '🚗',
        points: 28,
        aliases: ['يسوق', 'قاعد اسوق', 'في الطريق', 'سواقة', 'بالسيارة', 'مشغول بالخط'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'رقم غريب أو غير مسجل في الأسماء',
        emoji: '❓',
        points: 22,
        aliases: ['رقم غريب', 'ما اعرف الرقم', 'مو مسجل', 'رقم مجهول', 'مندوب', 'تسويق', 'سبام'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'في اجتماع عمل أو حصة / محاضرة',
        emoji: '👔',
        points: 18,
        aliases: ['اجتماع', 'في الدوام', 'محاضرة', 'كلاس', 'حصة', 'المدير عندي', 'شغل'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'ماله خلق يتكلم أو يسولف (كسل اجتماعي)',
        emoji: '🤐',
        points: 15,
        aliases: ['مالي خلق', 'ماله خلق', 'طفشان', 'مو مروق', 'ما يبي يكلم احد', 'كسل', 'تعبان نفسيا'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'جالس مع ناس أو في عزيمة ومناسبة',
        emoji: '👥',
        points: 12,
        aliases: ['مع ناس', 'في مجلس', 'في عزيمة', 'عند ضيوف', 'جالس مع ضيوف', 'بين اخوياي', 'عشاء'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'الجوال في الشاحن وبعيد عنه',
        emoji: '🔌',
        points: 10,
        aliases: ['في الشاحن', 'الجوال بعيد', 'نسيته بغرفة ثانية', 'يشحن', 'الجوال بالشاحن'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'في مكان عام صاخب أو إزعاج شديد',
        emoji: '📢',
        points: 8,
        aliases: ['ازعاج', 'مكان عام', 'صوت عالي', 'ما يسمع', 'في السوق', 'دوشة'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'الشخص المتصل ثقيل دم أو بيطلب طلب',
        emoji: '🙄',
        points: 7,
        aliases: ['نشبة', 'بيطلب سلف', 'ثقيل طينة', 'بيطلب خدمة', 'غثيث', 'ما احبه', 'شخص يطلب'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-25',
    engineType: 'what-do-they-say',
    title: 'مشروب يفضله الناس في الصيف للشعور بالانتعاش؟',
    category: 'مشروبات وطعام',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'عصير الليمون بالنعناع',
        emoji: '🍋',
        points: 45,
        aliases: ['ليمون بالنعناع', 'ليمون نعناع', 'عصير ليمون', 'ليموناضة', 'ليمون بالنعناع مثلج'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'الموهيتو بنكهاته (توت / فراولة / رمان)',
        emoji: '🍹',
        points: 35,
        aliases: ['موهيتو', 'المهيتو', 'موهيتو توت', 'موهيتو فراولة', 'موهيتو باشن فروت', 'موهيتو ازرق', 'سفن اب ونكهة'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'القهوة الباردة (آيس دريب / آيس سبانش / آيس لاتيه)',
        emoji: '🧊',
        points: 28,
        aliases: ['ايس كوفي', 'ايس دريب', 'ايس سبانش', 'ايس لاتيه', 'قهوة باردة', 'v60 بارد', 'كولد برو', 'ايس وايت موكا'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'عصير البطيخ (الحبحب) البارد',
        emoji: '🍉',
        points: 22,
        aliases: ['بطيخ', 'حبحب', 'عصير بطيخ', 'عصير حبحب', 'جح', 'عصير جح'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'الماء المثلج والبارد',
        emoji: '💧',
        points: 18,
        aliases: ['موية باردة', 'ماء بارد', 'ماء مثلج', 'مويه مثلجه', 'ماء', 'موية'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'عصير البرتقال الطازج البارد',
        emoji: '🍊',
        points: 15,
        aliases: ['برتقال', 'عصير برتقال', 'برتقال فرش', 'برتقال طازج', 'عصير برتقال مثلج'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'المشروبات الغازية مع الثلج والليمون',
        emoji: '🥤',
        points: 12,
        aliases: ['غازيات', 'بيبسي', 'كولا', 'سفن اب', 'حمضيات', 'مشروب غازي مع ثلج', 'ميرندا'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'الآيس تي (شاي مثلج بالخوخ / الليمون)',
        emoji: '🧋',
        points: 10,
        aliases: ['ايس تي', 'شاي مثلج', 'ice tea', 'ايس تي خوخ', 'شاي بارد'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'عصير المانجو الطبيعي',
        emoji: '🥭',
        points: 8,
        aliases: ['مانجو', 'عصير مانجو', 'مانجا', 'عصير مانجا', 'مانجو مثلج'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'السلاش والسموذي المثلج',
        emoji: '🍧',
        points: 7,
        aliases: ['سلاش', 'سموذي', 'مشروب سلاش', 'فرابيه', 'ثلج مجروش'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-26',
    engineType: 'what-do-they-say',
    title: 'عذر أو تصرف يفعله الشخص للهروب من عزيمة أو طلعة لا يريد الذهاب إليها؟',
    category: 'مواقف وطرف',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'يقول: عندي شغل أو موعد سابق مرتبط فيه',
        emoji: '💼',
        points: 45,
        aliases: ['عندي شغل', 'مرتبط بموعد', 'عندي موعد', 'عندي التزام', 'مشغول', 'والله مرتبط'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'يقول: تعبان ومريض ومصدع',
        emoji: '🤒',
        points: 35,
        aliases: ['تعبان', 'مريض', 'راسي يوجعني', 'مصدع', 'بطني يعورني', 'مفلوز', 'سخونة'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'يقول: عندي ظرف عائلي / جمعة أهل',
        emoji: '👨‍👩‍👧',
        points: 28,
        aliases: ['ظرف عائلي', 'جمعة اهل', 'مع الوالدة', 'مع الوالد', 'مشوار للاهل', 'مع اهلي', 'عزيمة اهل'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'يتأخر في الرد لساعات ويقول: "توني أشوف الرسالة!"',
        emoji: '⌛',
        points: 22,
        aliases: ['توني اشوف الرسالة', 'تاخر بالرد', 'ما شفت رسالتك', 'توني اقراها', 'كان الجوال صامت', 'نسيت ارد'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'يقول: برا الرياض / مسافر برا المدينة',
        emoji: '🛫',
        points: 18,
        aliases: ['مسافر', 'برا المدينة', 'ماني بالرياض', 'في الشرقية', 'في جدة', 'في المطار', 'طلعت برا'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'يقول: السيارة في الورشة / خربانة وما عندي مواصلات',
        emoji: '🚗',
        points: 15,
        aliases: ['السيارة خربانة', 'بالورشة', 'ما عندي سيارة', 'السيارة ما تشتغل', 'السيارة مع اخوي'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'يحضر متأخراً ويتسحب ويمشي بعد 10 دقائق',
        emoji: '🏃‍♂️',
        points: 12,
        aliases: ['يجي ويمشي بدري', 'يسحب', 'يتسحب', 'يقعد شوي ويمشي', 'يمر يسلم ويمشي', 'طلعة سريعة'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'يضع الجوال نمط الطيران ولا يرد أبداً',
        emoji: '✈️',
        points: 10,
        aliases: ['نمط طيران', 'يطفي الجوال', 'يقفل الخط', 'ما يرد', 'سحب عليهم', 'تجاهل'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'يقول: عندي دوام بدري بكرة ولازم أنام',
        emoji: '😴',
        points: 8,
        aliases: ['دوام بدري', 'عندي دوام', 'بنام بدري', 'عندي اختبار', 'بصحى بدري', 'لازم انام'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'يوعدهم بطلعة ثانية للتعويض (تصريفة)',
        emoji: '🤝',
        points: 7,
        aliases: ['الجايات اكثر', 'نعوضكم', 'المرة الجاية علي', 'ان شاء الله المرة الجاية', 'خلها يوم ثاني'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-27',
    engineType: 'what-do-they-say',
    title: 'أول شيء يفعله الموظف فور نزول الراتب في حسابه البنكي؟',
    category: 'مال ويوميات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      {
        rank: 1,
        title: 'سداد الفواتير (كهرباء / ماء / إنترنت)',
        emoji: '🧾',
        points: 45,
        aliases: ['الفواتير', 'سداد الفواتير', 'الكهرباء', 'النت', 'الجوال', 'سداد', 'فاتورة الجوال', 'الماء'],
        isRevealed: false
      },
      {
        rank: 2,
        title: 'سداد الأقساط والقروض والبطاقة الائتمانية',
        emoji: '💳',
        points: 35,
        aliases: ['الاقساط', 'القرض', 'قسط السيارة', 'الفيزا', 'البطاقة الائتمانية', 'سداد القرض', 'قسط التمويل', 'تابي وتمارا'],
        isRevealed: false
      },
      {
        rank: 3,
        title: 'العزيمة والذهاب لمطعم فاخر أو كافيه',
        emoji: '🥩',
        points: 28,
        aliases: ['عشاء فاخر', 'مطعم فخم', 'يعزم نفسه', 'عزيمة', 'كوفي فخم', 'مطعم غالي', 'يدلع نفسه'],
        isRevealed: false
      },
      {
        rank: 4,
        title: 'التسوق وشراء الملابس والأجهزة',
        emoji: '🛍️',
        points: 22,
        aliases: ['تسوق', 'يشتري ملابس', 'سوق', 'شراء اغراض', 'يشتري ايفون', 'شوبنق', 'اجهزة'],
        isRevealed: false
      },
      {
        rank: 5,
        title: 'تحويل مصروف للأهل أو الوالدين',
        emoji: '👨‍👩‍👧',
        points: 18,
        aliases: ['مصروف الاهل', 'يحول لامي', 'يحول لابوي', 'مصروف البيت', 'تحويل للاهل', 'فلوس لامي'],
        isRevealed: false
      },
      {
        rank: 6,
        title: 'الادخار أو الاستثمار في الأسهم والصناديق',
        emoji: '📈',
        points: 15,
        aliases: ['ادخار', 'يوفر', 'استثمار', 'اسهم', 'صناديق', 'يحط بالادخار', 'توفير'],
        isRevealed: false
      },
      {
        rank: 7,
        title: 'شراء مقاضي البيت والثلاجة والسوبرماركت',
        emoji: '🛒',
        points: 12,
        aliases: ['مقاضي البيت', 'سوبرماركت', 'المقاضي', 'اغراض البيت', 'التموينات', 'الثلاجة'],
        isRevealed: false
      },
      {
        rank: 8,
        title: 'التخطيط لسفرة أو حجز رحلة ويكند',
        emoji: '✈️',
        points: 10,
        aliases: ['حجز طيران', 'تذاكر', 'سفرة', 'يحجز فندق', 'حجز سفر', 'سياحة'],
        isRevealed: false
      },
      {
        rank: 9,
        title: 'سداد إيجار البيت أو الشقة',
        emoji: '🏠',
        points: 8,
        aliases: ['الايجار', 'ايجار البيت', 'سداد الايجار', 'ايجار الشقة', 'منصة ايجار'],
        isRevealed: false
      },
      {
        rank: 10,
        title: 'شراء عطر فخم أو مكافأة لنفسه',
        emoji: '🎁',
        points: 7,
        aliases: ['عطر', 'يشتري عطر', 'هدية لنفسه', 'مكافأة', 'ساعة', 'يدلع روحه'],
        isRevealed: false
      }
    ]
  },
  {
    id: 'wdts-21',
    engineType: 'what-do-they-say',
    title: 'اذكر شيئاً يحرص الشخص على تأكيده قبل الخروج من المنزل؟',
    category: 'عادات واجتماعي',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      { rank: 1, title: 'الجوال والمحفظة', emoji: '📱', points: 45, aliases: ['الجوال', 'جوال', 'محفظه', 'بوك', 'تلفون', 'الهاتف', 'المحفظة'], isRevealed: false },
      { rank: 2, title: 'إطفاء المكيفات والكهرباء', emoji: '❄️', points: 35, aliases: ['اطفاء المكيف', 'طفي المكيفات', 'المكيفات', 'الانوار', 'طفي الكهرباء', 'الكهرباء'], isRevealed: false },
      { rank: 3, title: 'إغلاق أبواب البيت', emoji: '🔑', points: 28, aliases: ['قفل الباب', 'قفل الابواب', 'سكر الباب', 'مفتاح', 'المفاتيح', 'الباب'], isRevealed: false },
      { rank: 4, title: 'رش العطر', emoji: '🧴', points: 22, aliases: ['العطر', 'تتعطر', 'يعطر', 'عطر', 'نسيم'], isRevealed: false },
      { rank: 5, title: 'التشيك على المظهر والمراية', emoji: '🪞', points: 18, aliases: ['المراية', 'شكل الشماغ', 'العقال', 'العباية', 'النظارة', 'مظهر'], isRevealed: false },
      { rank: 6, title: 'أخذ مفاتيح السيارة', emoji: '🚗', points: 15, aliases: ['مفتاح السيارة', 'السويتش', 'مفتاح الموتر', 'السيارة'], isRevealed: false },
      { rank: 7, title: 'التأكد من النظارة أو الساعة', emoji: '🕶️', points: 12, aliases: ['النظارة', 'النظارات', 'الساعة', 'ساعتي'], isRevealed: false },
      { rank: 8, title: 'التأكد من وجود باور بنك / شاحن', emoji: '🔋', points: 10, aliases: ['شاحن', 'باوربنك', 'الشاحن', 'باور بنك'], isRevealed: false },
      { rank: 9, title: 'التأكد من تعبئة قارورة الماء', emoji: '🍾', points: 8, aliases: ['موية', 'قارورة موية', 'ماء', 'مطارة'], isRevealed: false },
      { rank: 10, title: 'إطعام الأليف / القطوة', emoji: '🐈', points: 7, aliases: ['القطوة', 'اكل القطة', 'القطة', 'العصافير'], isRevealed: false }
    ]
  },
  {
    id: 'wdts-22',
    engineType: 'what-do-they-say',
    title: 'أشياء تحرص على أخذها معك في الرحلة البرية (الكشتة)؟',
    category: 'رحلات وكشتات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      { rank: 1, title: 'عِزبة القهوة والشاي', emoji: '☕', points: 45, aliases: ['العزبة', 'عزبة القهوة', 'الشاي والقهوة', 'الدلة', 'معاميل القهوة', 'القهوة'], isRevealed: false },
      { rank: 2, title: 'الحطب والفحم', emoji: '🪵', points: 35, aliases: ['الحطب', 'فحم', 'الضو', 'النار', 'حطب'], isRevealed: false },
      { rank: 3, title: 'الخيمة والفرشة', emoji: '⛺', points: 28, aliases: ['خيمة', 'الفرشة', 'فرشات', 'زولية', 'الخيام', 'طربال'], isRevealed: false },
      { rank: 4, title: 'كشافات وإضاءة', emoji: '🔦', points: 22, aliases: ['كشاف', 'إضاءة', 'لمبات', 'لمبة', 'ماطور كهرباء'], isRevealed: false },
      { rank: 5, title: 'مقاضي العشاء والمشويات', emoji: '🥩', points: 18, aliases: ['اللحم', 'الدجاج', 'المقاضي', 'شبكة المشاوي', 'عشاء'], isRevealed: false },
      { rank: 6, title: 'الثلاجة والثلج', emoji: '🧊', points: 15, aliases: ['ثلاجة الرحلات', 'الثلج', 'كولر', 'حافظة الثلج'], isRevealed: false },
      { rank: 7, title: 'صندوق الإسعافات والأدوية', emoji: '🩹', points: 12, aliases: ['إسعافات', 'بندول', 'مسكن', 'مراهم'], isRevealed: false },
      { rank: 8, title: 'وسائد وبطانيات', emoji: '🛌', points: 10, aliases: ['مخاد', 'بطانية', 'نوم', 'فراش'], isRevealed: false },
      { rank: 9, title: 'مناديل وصابون', emoji: '🧼', points: 8, aliases: ['مناديل', 'صابون', 'منظفات', 'محارم'], isRevealed: false },
      { rank: 10, title: 'ألعاب وبلوت', emoji: '🃏', points: 7, aliases: ['بلوت', 'ورقة', 'العاب', 'كوتشينة', 'ضومنة'], isRevealed: false }
    ]
  },
  {
    id: 'wdts-23',
    engineType: 'what-do-they-say',
    title: 'أكثر الأشياء التي تسبب زحمة أو كركبة في غرفة النوم؟',
    category: 'بيت وحياة',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      { rank: 1, title: 'الملابس المتراكمة على الكرسي', emoji: '👕', points: 45, aliases: ['الملابس', 'ملابس على الكرسي', 'كرسي الملابس', 'ثياب', 'غسيل'], isRevealed: false },
      { rank: 2, title: 'الشواحن والأسلاك', emoji: '🔌', points: 35, aliases: ['أسلاك', 'شواحن', 'سلك الشاحن', 'التوصيلة', 'شاحن الجوال'], isRevealed: false },
      { rank: 3, title: 'الكراتين وأكياس التسوق', emoji: '🛍️', points: 28, aliases: ['أكياس', 'كراتين', 'أكياس السوق', 'مشتريات', 'كيس'], isRevealed: false },
      { rank: 4, title: 'الأحذية عند المدخل', emoji: '👟', points: 22, aliases: ['جزام', 'أحذية', 'الجزم', 'النعال', 'جزامة'], isRevealed: false },
      { rank: 5, title: 'الإكسسوارات والعطور على التسريحة', emoji: '🧴', points: 18, aliases: ['التسريحة', 'عطورات', 'ميك اب', 'مكياج', 'عطر'], isRevealed: false },
      { rank: 6, title: 'الأوراق والمستندات', emoji: '📄', points: 15, aliases: ['أوراق', 'مستندات', 'فواتير', 'كتب'], isRevealed: false },
      { rank: 7, title: 'الأكواب وفناجين القهوة الفارغة', emoji: '☕', points: 12, aliases: ['كوب', 'كاسات', 'فناجين', 'كاسات موية', 'بيالة'], isRevealed: false },
      { rank: 8, title: 'ألعاب الأطفال', emoji: '🧸', points: 10, aliases: ['ألعاب', 'العاب اطفال', 'لعبه'], isRevealed: false },
      { rank: 9, title: 'الوسائد الإضافية', emoji: '🛋️', points: 8, aliases: ['مخاد زيادة', 'وسائد', 'مخدات'], isRevealed: false },
      { rank: 10, title: 'حقائب السفر', emoji: '🧳', points: 7, aliases: ['شنطة سفر', 'شنط', 'حقيبة'], isRevealed: false }
    ]
  },
  {
    id: 'wdts-24',
    engineType: 'what-do-they-say',
    title: 'أشياء يطلبها الزبون دائماً في مقهى القهوة المختصة؟',
    category: 'قهوة وحياة',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      { rank: 1, title: 'فلات وايت / سبانيش لاتيه', emoji: '☕', points: 45, aliases: ['فلات وايت', 'سبانيش لاتيه', 'لاتيه', 'سبانيش'], isRevealed: false },
      { rank: 2, title: 'V60 أو دريب كوفي', emoji: '☕', points: 35, aliases: ['v60', 'مقطرة', 'دريب', 'امريكانو', 'تقطير'], isRevealed: false },
      { rank: 3, title: 'كيكة الحليب / تيراميسو', emoji: '🍰', points: 28, aliases: ['كيكة الحليب', 'تيراميسو', 'كيكة', 'حلى', 'كيك'], isRevealed: false },
      { rank: 4, title: 'كرواسون / مخبوزات', emoji: '🥐', points: 22, aliases: ['كرواسون', 'كرواسون جبن', 'مخبوزات', 'بان كيك'], isRevealed: false },
      { rank: 5, title: 'حليب الشوفان أو حليب لوز', emoji: '🥛', points: 18, aliases: ['حليب شوفان', 'شوفان', 'حليب لوز', 'حليب قليل الدسم'], isRevealed: false },
      { rank: 6, title: 'آيس دريب / آيس امريكانو', emoji: '🧊', points: 15, aliases: ['ايس امريكانو', 'ايس دريب', 'بارد', 'قهوة باردة'], isRevealed: false },
      { rank: 7, title: 'كوكيز دافئ', emoji: '🍪', points: 12, aliases: ['كوكيز', 'كوكيز شوكولاته', 'بسكويت'], isRevealed: false },
      { rank: 8, title: 'ماتشا بارد', emoji: '🍵', points: 10, aliases: ['ماتشا', 'ما تشا', 'ماتشا لاتيه'], isRevealed: false },
      { rank: 9, title: 'قارورة موية', emoji: '🍾', points: 8, aliases: ['موية', 'ماء', 'قارورة موية'], isRevealed: false },
      { rank: 10, title: 'خصم أو تطبيق المقهى', emoji: '🏷️', points: 7, aliases: ['خصم', 'تطبيق', 'كود', 'ابلكيشن'], isRevealed: false }
    ]
  },
  {
    id: 'wdts-25',
    engineType: 'what-do-they-say',
    title: 'أكثر الأعذار استخداماً عند التأخر عن المواعيد؟',
    category: 'مواعيد وعادات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      { rank: 1, title: 'زحمة الطريق والسير', emoji: '🚗', points: 45, aliases: ['الزحمة', 'زحمة الطريق', 'الزحام', 'الطريق زحمة', 'الشارع واقف'], isRevealed: false },
      { rank: 2, title: 'ما لقيت موقف للسيارة', emoji: '🅿️', points: 35, aliases: ['ما لقيت موقف', 'مواقف', 'البحث عن موقف', 'غلبني الموقف'], isRevealed: false },
      { rank: 3, title: 'المنبه ما اشتغل / راحت علي نومة', emoji: '⏰', points: 28, aliases: ['راحت علي نومة', 'المنبه', 'نمت', 'نومة'], isRevealed: false },
      { rank: 4, title: 'كان عندي ظرف طارئ', emoji: '🚨', points: 22, aliases: ['ظرف طارئ', 'جاني ظرف', 'مشكلة طارئة', 'حادث'], isRevealed: false },
      { rank: 5, title: 'ضيعت مفتاح السيارة أو البوك', emoji: '🔑', points: 18, aliases: ['ضيعت المفتاح', 'ضاعت المفاتيح', 'المفظة', 'البوك'], isRevealed: false },
      { rank: 6, title: 'شغل في الدوام ما خلص', emoji: '💼', points: 15, aliases: ['الدوام', 'المدير مسكني', 'اجتماع طارئ'], isRevealed: false },
      { rank: 7, title: 'الجوال طفى شحن', emoji: '📱', points: 12, aliases: ['طفي الجوال', 'بطارية الجوال', 'ما فيه شحن'], isRevealed: false },
      { rank: 8, title: 'كان في حادث في الشارع', emoji: '💥', points: 10, aliases: ['حادث', 'حادث بالشارع', 'ساهر', 'نجم'], isRevealed: false },
      { rank: 9, title: 'تأخرت باللبس والتجهيز', emoji: '👔', points: 8, aliases: ['تأخرت باللبس', 'الثوب ما تجهز', 'المكياج'], isRevealed: false },
      { rank: 10, title: 'الموقع خطأ في الجي بي اس', emoji: '📍', points: 7, aliases: ['الموقع خطا', 'قوقل ماب', 'ما عرفت المكان'], isRevealed: false }
    ]
  },
  {
    id: 'wdts-26',
    engineType: 'what-do-they-say',
    title: 'أشياء تجلب السعادة والبهجة لأي شخص فوراً؟',
    category: 'مشاعر وسعادة',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      { rank: 1, title: 'نزول الراتب / رسالة إيداع', emoji: '💰', points: 45, aliases: ['الراتب', 'نزول الراتب', 'تم ايداع', 'فلوس', 'المبلغ'], isRevealed: false },
      { rank: 2, title: 'كوب قهوة مخمخة', emoji: '☕', points: 35, aliases: ['القهوة', 'كوب قهوة', 'كوفي', 'كافيه'], isRevealed: false },
      { rank: 3, title: 'كلمة حلوة / مدح غير متوقع', emoji: '💌', points: 28, aliases: ['كلمة حلوة', 'مدح', 'كلام جميل', 'إطراء', 'دعوة'], isRevealed: false },
      { rank: 4, title: 'سفرة أو حجز رحلة جديدة', emoji: '✈️', points: 22, aliases: ['سفر', 'تذاكر سفر', 'سفرة', 'السفر'], isRevealed: false },
      { rank: 5, title: 'هدية ومفاجأة من شخص تحبه', emoji: '🎁', points: 18, aliases: ['هدية', 'هدايا', 'مفاجأة', 'بوكس'], isRevealed: false },
      { rank: 6, title: 'مطر وأجواء غائمة جبارة', emoji: '🌧️', points: 15, aliases: ['المطر', 'مطر', 'جو زوين', 'الأجواء'], isRevealed: false },
      { rank: 7, title: 'أكلة تحبها أو مطعم جديد', emoji: '🍕', points: 12, aliases: ['أكل حلو', 'مطعم', 'شاورما', 'برجر', 'اكلة'], isRevealed: false },
      { rank: 8, title: 'إجازة رسمية أو ويكند طويل', emoji: '🎉', points: 10, aliases: ['إجازة', 'الويكند', 'ويكند', 'عطلة'], isRevealed: false },
      { rank: 9, title: 'شحن الجوال 100%', emoji: '🔋', points: 8, aliases: ['فل شحن', 'شاحن', 'الجوال فول'], isRevealed: false },
      { rank: 10, title: 'انخفاض الوزن أو رشاقة', emoji: '🏋️', points: 7, aliases: ['نقص وزني', 'دايت', 'لياقة'], isRevealed: false }
    ]
  },
  {
    id: 'wdts-27',
    engineType: 'what-do-they-say',
    title: 'أشياء يشتريها الشخص ولما يرجع البيت يكتشف أنه ما يحتاجها؟',
    category: 'تسوق وعادات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      { rank: 1, title: 'أجهزة رياضية منزلية', emoji: '🏋️', points: 45, aliases: ['جهاز رياضي', 'سير مشي', 'سيكل', 'اثقال'], isRevealed: false },
      { rank: 2, title: 'ملابس مقاسها مو ضابط', emoji: '👕', points: 35, aliases: ['بلوزة', 'ثوب', 'بنطلون', 'مقاس غلط', 'ملابس'], isRevealed: false },
      { rank: 3, title: 'أدوات ومعدات مطبخ غريبة', emoji: '🍳', points: 28, aliases: ['قلاية', 'قطاعة', 'جهاز مطبخ', 'صانعة كريب'], isRevealed: false },
      { rank: 4, title: 'عروض تخفيضات السوبرماركت الزائدة', emoji: '🛒', points: 22, aliases: ['عروض', 'اغراض السوبرماركت', 'مقاضي زيادة'], isRevealed: false },
      { rank: 5, title: 'عطورات عشوائية من العروض', emoji: '🧴', points: 18, aliases: ['عطور رخيصة', 'عطر ما عجبني', 'عطور'], isRevealed: false },
      { rank: 6, title: 'ألعاب إلكترونية ما يلعبها', emoji: '🎮', points: 15, aliases: ['سيدي سوني', 'شريط', 'لعبة'], isRevealed: false },
      { rank: 7, title: 'نوتات ودفاتر تشجيعية', emoji: '📓', points: 12, aliases: ['دفتر', 'نوتة', 'اجندة'], isRevealed: false },
      { rank: 8, title: 'شواحن وكوابل زيادة', emoji: '🔌', points: 10, aliases: ['سلك شاحن', 'كابل', 'اسلاك'], isRevealed: false },
      { rank: 9, title: 'كتب ومجلات ما يقرأها', emoji: '📚', points: 8, aliases: ['رواية', 'كتب', 'كتاب'], isRevealed: false },
      { rank: 10, title: 'إكسسوارات للسيارة', emoji: '🚗', points: 7, aliases: ['تعليقة سيارة', 'اكسسوار سيارة'], isRevealed: false }
    ]
  },
  {
    id: 'wdts-28',
    engineType: 'what-do-they-say',
    title: 'أكثر الوجبات الشعبية المحبوبة في التجمعات العائلية بالخليج؟',
    category: 'أكلات ومجتمع',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      { rank: 1, title: 'الكبسة / المكبوس', emoji: '🍚', points: 45, aliases: ['كبسة', 'مكبوس', 'الرز', 'رز ولحم', 'الكبسة السعودية'], isRevealed: false },
      { rank: 2, title: 'المندي والمظبي', emoji: '🍗', points: 35, aliases: ['مندي', 'مظبي', 'الرز المندي', 'لحم مندي'], isRevealed: false },
      { rank: 3, title: 'الجريش والمطازيز', emoji: '🍲', points: 28, aliases: ['جريش', 'مطازيز', 'قرصان', 'مرقوق'], isRevealed: false },
      { rank: 4, title: 'الشاورما والمشويات', emoji: '🥙', points: 22, aliases: ['شاورما', 'مشاوي', 'مشويات', 'كباب'], isRevealed: false },
      { rank: 5, title: 'المفطح والذبيحة', emoji: '🐑', points: 18, aliases: ['مفطح', 'ذبيحة', 'قعود', 'خروف'], isRevealed: false },
      { rank: 6, title: 'الحنيني والمصابيب', emoji: '🥞', points: 15, aliases: ['حنيني', 'مصابيب', 'قشد', 'عريكة'], isRevealed: false },
      { rank: 7, title: 'البرياني والبخاري', emoji: '🍛', points: 12, aliases: ['برياني', 'رز بخاري', 'بخاري'], isRevealed: false },
      { rank: 8, title: 'سمك ومأكولات بحرية', emoji: '🐟', points: 10, aliases: ['سمك', 'صيادية', 'روبيان', 'مالح'], isRevealed: false },
      { rank: 9, title: 'فطائر ومعجنات', emoji: '🥐', points: 8, aliases: ['معجنات', 'فطاير', 'بيتزا'], isRevealed: false },
      { rank: 10, title: 'أطباق الحلى واللقيمات', emoji: '🍯', points: 7, aliases: ['لقيمات', 'حلى', 'كيكة', 'بقلاوة'], isRevealed: false }
    ]
  },
  {
    id: 'wdts-29',
    engineType: 'what-do-they-say',
    title: 'أشياء يضيعها الشخص باستمرار في البيت؟',
    category: 'بيت وعادات',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      { rank: 1, title: 'ريموت التلفزيون أو المكيف', emoji: '📺', points: 45, aliases: ['الريموت', 'ريموت التلفزيون', 'ريموت المكيف', 'ريموت'], isRevealed: false },
      { rank: 2, title: 'مفتاح السيارة أو البيت', emoji: '🔑', points: 35, aliases: ['مفتاح', 'المفاتيح', 'السويتش', 'مفتاح الموتر'], isRevealed: false },
      { rank: 3, title: 'النظارة الطبية أو الشمسية', emoji: '👓', points: 28, aliases: ['النظارات', 'النظارة', 'نظارتي'], isRevealed: false },
      { rank: 4, title: 'سلك الشاحن / التوصيلة', emoji: '🔌', points: 22, aliases: ['شاحن', 'الشواحن', 'سلك الشاحن'], isRevealed: false },
      { rank: 5, title: 'الجوال وهو على الصامت', emoji: '📱', points: 18, aliases: ['جوالي', 'الجوال', 'التلفون', 'جوال'], isRevealed: false },
      { rank: 6, title: 'المفظة والبطاقات', emoji: '💳', points: 15, aliases: ['البوك', 'المحفظة', 'بطاقة الصراف'], isRevealed: false },
      { rank: 7, title: 'فردة الشراب الأخرى', emoji: '🧦', points: 12, aliases: ['شراب', 'الشراب', 'الجوارب'], isRevealed: false },
      { rank: 8, title: 'سماعة الأيربودز', emoji: '🎧', points: 10, aliases: ['سماعة', 'ايربودز', 'airpods'], isRevealed: false },
      { rank: 9, title: 'مقص الأظافر / المشط', emoji: '✂️', points: 8, aliases: ['مقص', 'المشط', 'مقص الاظافر'], isRevealed: false },
      { rank: 10, title: 'العطر المفضل', emoji: '🧴', points: 7, aliases: ['عطري', 'العطر'], isRevealed: false }
    ]
  },
  {
    id: 'wdts-30',
    engineType: 'what-do-they-say',
    title: 'أكثر الكلمات التي تتردد في شات المجموعات العائلية (الواتساب)؟',
    category: 'عائلة وتواصل',
    difficulty: 'easy',
    points: 200,
    totalScore: 200,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers: [
      { rank: 1, title: 'صباح الخير ومساء الخير', emoji: '☀️', points: 45, aliases: ['صباح الخير', 'مساء الخير', 'يسعد صباحكم', 'صباح الورد'], isRevealed: false },
      { rank: 2, title: 'جزاك الله خير / الله يجزاك خير', emoji: '🤲', points: 35, aliases: ['جزاك الله خير', 'الله يجزاك خير', 'جزاكم الله خير'], isRevealed: false },
      { rank: 3, title: 'جمعة مباركة', emoji: '🕌', points: 28, aliases: ['جمعة مباركة', 'طابت جمعتكم', 'جمعة طيبة'], isRevealed: false },
      { rank: 4, title: 'دعوات وشفاء للمريض', emoji: '🤲', points: 22, aliases: ['الله يشافيه', 'طهور', 'الف سلامة', 'شفاء'], isRevealed: false },
      { rank: 5, title: 'صور ومقاطع وتبريكات', emoji: '📸', points: 18, aliases: ['مبروك', 'الف مبروك', 'صور', 'تهنئة'], isRevealed: false },
      { rank: 6, title: 'مين بيجي اليوم؟ / وين المجتمعين؟', emoji: '🏠', points: 15, aliases: ['مين بيمشي', 'المجتمعين', 'الاستراحة', 'البيت'], isRevealed: false },
      { rank: 7, title: 'جيب معك موية / مقاضي', emoji: '🛒', points: 12, aliases: ['جيب معك', 'لا تنسى', 'مقاضي'], isRevealed: false },
      { rank: 8, title: 'ارسل اللوكيشن / الموقع', emoji: '📍', points: 10, aliases: ['ارسل اللوكيشن', 'الموقع', 'ماب'], isRevealed: false },
      { rank: 9, title: 'الله يحفظكم ويسلمكم', emoji: '❤️', points: 8, aliases: ['الله يحفظكم', 'تسلم', 'حياكم الله'], isRevealed: false },
      { rank: 10, title: 'متى الموعد؟ / كم الساعة؟', emoji: '⏰', points: 7, aliases: ['متى الاجتماع', 'الوقت', 'كم الساعة'], isRevealed: false }
    ]
  }
];

export function generateWhatDoTheySayQuestion(title: string, rawAnswers: { title: string; points?: number; emoji?: string; aliases?: string[] }[]): WhatDoTheySayQuestion {
  const DEFAULT_POINTS = [45, 35, 28, 22, 18, 15, 12, 10, 8, 7];
  
  const answers = rawAnswers.slice(0, 10).map((ans, idx) => ({
    rank: idx + 1,
    title: ans.title,
    emoji: ans.emoji || '✨',
    points: ans.points || DEFAULT_POINTS[idx] || 10,
    aliases: ans.aliases && ans.aliases.length > 0 ? ans.aliases : [ans.title],
    isRevealed: false
  }));

  // Pad to 10 if fewer provided
  while (answers.length < 10) {
    const idx = answers.length;
    answers.push({
      rank: idx + 1,
      title: `إجابة شائعة #${idx + 1}`,
      emoji: '🎯',
      points: DEFAULT_POINTS[idx] || 5,
      aliases: [`إجابة ${idx + 1}`, `اجابة ${idx + 1}`],
      isRevealed: false
    });
  }

  const total = answers.reduce((s, a) => s + a.points, 0);

  return {
    id: `wdts-${Date.now()}`,
    engineType: 'what-do-they-say',
    title,
    category: 'اجتماعي وعادات',
    difficulty: 'easy',
    points: total,
    totalScore: total,
    timeLimitSeconds: 60,
    acceptableAnswers: [],
    phase: 'PLAYING',
    mode: 'SOLO',
    answers
  };
}
