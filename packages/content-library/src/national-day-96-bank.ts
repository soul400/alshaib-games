import { NationalDayQuestion } from '@aep/types';
import { isAnswerMatch } from '@aep/game-engines';

/**
 * 🇸🇦 NATIONAL DAY 96 QUESTION BANK (بنك أسئلة اليوم الوطني السعودي 96)
 * 79 سؤال لمسابقة "السعودية العظمى" — المسابقة الثقافية الوطنية الكبرى 🏆
 */
export const NATIONAL_DAY_96_BANK: NationalDayQuestion[] = [
  {
    id: 'sg-001', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'من هو مؤسس المملكة العربية السعودية وموحدها؟',
    correctAnswer: 'الملك عبدالعزيز',
    acceptableAnswers: ['الملك عبدالعزيز', 'عبدالعزيز', 'ابن سعود', 'الملك عبدالعزيز بن عبدالرحمن', 'عبدالعزيز بن عبدالرحمن'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-002', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'ما الكنية الشهيرة للملك عبدالعزيز؟',
    correctAnswer: 'أبو تركي',
    acceptableAnswers: ['أبو تركي', 'ابو تركي'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-003', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'من هو أول ملوك المملكة العربية السعودية؟',
    correctAnswer: 'الملك عبدالعزيز',
    acceptableAnswers: ['الملك عبدالعزيز', 'عبدالعزيز', 'ابن سعود'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-004', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'من تولى الحكم بعد الملك عبدالعزيز؟',
    correctAnswer: 'الملك سعود',
    acceptableAnswers: ['الملك سعود', 'سعود', 'الملك سعود بن عبدالعزيز'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-005', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'من تولى الحكم بعد الملك سعود؟',
    correctAnswer: 'الملك فيصل',
    acceptableAnswers: ['الملك فيصل', 'فيصل', 'الملك فيصل بن عبدالعزيز'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-006', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'من تولى الحكم بعد الملك فيصل؟',
    correctAnswer: 'الملك خالد',
    acceptableAnswers: ['الملك خالد', 'خالد', 'الملك خالد بن عبدالعزيز'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-007', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'من تولى الحكم بعد الملك خالد؟',
    correctAnswer: 'الملك فهد',
    acceptableAnswers: ['الملك فهد', 'فهد', 'الملك فهد بن عبدالعزيز'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-008', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'من تولى الحكم بعد الملك فهد؟',
    correctAnswer: 'الملك عبدالله',
    acceptableAnswers: ['الملك عبدالله', 'عبدالله', 'الملك عبدالله بن عبدالعزيز'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-009', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'من هو خادم الحرمين الشريفين الملك الحالي؟',
    correctAnswer: 'الملك سلمان',
    acceptableAnswers: ['الملك سلمان', 'سلمان', 'الملك سلمان بن عبدالعزيز', 'خادم الحرمين الشريفين'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-010', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'من هو ولي العهد الأمير الحالي للمملكة؟',
    correctAnswer: 'الأمير محمد بن سلمان',
    acceptableAnswers: ['الأمير محمد بن سلمان', 'محمد بن سلمان', 'ولي العهد', 'MBS'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-011', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'من هو أول من حمل لقب خادم الحرمين الشريفين رسميًا؟',
    correctAnswer: 'الملك فهد',
    acceptableAnswers: ['الملك فهد', 'فهد', 'الملك فهد بن عبدالعزيز'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-012', activityId: 'saudi-great', category: 'تاريخ الملوك',
    question: 'ما اللقب الذي يُمنح لملك المملكة العربية السعودية؟',
    correctAnswer: 'خادم الحرمين الشريفين',
    acceptableAnswers: ['خادم الحرمين الشريفين', 'خادم الحرمين'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-013', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'في أي عام تم توحيد المملكة العربية السعودية؟',
    correctAnswer: '1932',
    acceptableAnswers: ['1932', '١٩٣٢'],
    numberAnswer: 1932,
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-014', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'في أي يوم من شهر سبتمبر يُحتفل باليوم الوطني السعودي؟',
    correctAnswer: '23',
    acceptableAnswers: ['23', '٢٣', '23 سبتمبر'],
    numberAnswer: 23,
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-015', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'كم عدد المناطق الإدارية في المملكة العربية السعودية؟',
    correctAnswer: '13',
    acceptableAnswers: ['13', '١٣', 'ثلاث عشرة', 'ثلاثة عشر'],
    numberAnswer: 13,
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-016', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'في أي عام تمت استعادة الرياض على يد الملك عبدالعزيز؟',
    correctAnswer: '1902',
    acceptableAnswers: ['1902', '١٩٠٢'],
    numberAnswer: 1902,
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-017', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'في أي عام تم اكتشاف النفط في المملكة؟',
    correctAnswer: '1938',
    acceptableAnswers: ['1938', '١٩٣٨'],
    numberAnswer: 1938,
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-018', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما اسم أول حقل نفطي اكتُشف في المملكة؟',
    correctAnswer: 'حقل الدمام',
    acceptableAnswers: ['حقل الدمام', 'الدمام', 'بئر الدمام'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-019', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما اسم الشركة الوطنية للنفط في المملكة العربية السعودية؟',
    correctAnswer: 'أرامكو',
    acceptableAnswers: ['أرامكو', 'ارامكو', 'أرامكو السعودية', 'Saudi Aramco'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-020', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما اسم أول جامعة أُنشئت في المملكة؟',
    correctAnswer: 'جامعة الملك سعود',
    acceptableAnswers: ['جامعة الملك سعود', 'الملك سعود'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-021', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما اسم أول خط سكة حديد ربط الرياض بالدمام؟',
    correctAnswer: 'خط سكة حديد الرياض-الدمام',
    acceptableAnswers: ['خط سكة حديد الرياض-الدمام', 'سكة حديد الرياض الدمام', 'خط الرياض الدمام', 'الرياض الدمام'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-022', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما اسم أول مطار دولي افتُتح في المملكة؟',
    correctAnswer: 'مطار الظهران',
    acceptableAnswers: ['مطار الظهران', 'الظهران'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-023', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما القناة التلفزيونية الأولى التي بثت رسمياً في المملكة؟',
    correctAnswer: 'القناة السعودية الأولى',
    acceptableAnswers: ['القناة السعودية الأولى', 'القناة السعودية', 'القناة الاولى', 'السعودية الأولى'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-024', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما العملة الرسمية للمملكة العربية السعودية؟',
    correctAnswer: 'الريال السعودي',
    acceptableAnswers: ['الريال السعودي', 'الريال', 'ريال'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-025', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما هو أطول برج في المملكة العربية السعودية؟',
    correctAnswer: 'برج جدة',
    acceptableAnswers: ['برج جدة', 'جدة تاور', 'Jeddah Tower'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-026', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما أكبر مدينة من حيث عدد السكان في المملكة؟',
    correctAnswer: 'الرياض',
    acceptableAnswers: ['الرياض'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-027', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما المنطقة التي تقع فيها مدينة أبها؟',
    correctAnswer: 'عسير',
    acceptableAnswers: ['عسير', 'منطقة عسير'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-028', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما المنطقة التي تُعرف بمنطقة النخيل والتمور في المملكة؟',
    correctAnswer: 'القصيم',
    acceptableAnswers: ['القصيم', 'منطقة القصيم'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-029', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما الصحراء الكبرى التي تغطي جزءاً واسعاً من جنوب المملكة؟',
    correctAnswer: 'الربع الخالي',
    acceptableAnswers: ['الربع الخالي', 'صحراء الربع الخالي'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-030', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما هي أكبر صحراء رملية في العالم الموجودة في المملكة؟',
    correctAnswer: 'الربع الخالي',
    acceptableAnswers: ['الربع الخالي', 'صحراء الربع الخالي'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-031', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما البحر الذي يحد المملكة من الغرب؟',
    correctAnswer: 'البحر الأحمر',
    acceptableAnswers: ['البحر الأحمر', 'الاحمر', 'البحر الاحمر'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-032', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما الخليج الذي يحد المملكة من الشرق؟',
    correctAnswer: 'الخليج العربي',
    acceptableAnswers: ['الخليج العربي', 'الخليج'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-033', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما اسم النشيد الوطني السعودي؟',
    correctAnswer: 'سارعي للمجد والعلياء',
    acceptableAnswers: ['سارعي للمجد والعلياء', 'سارعي', 'النشيد الوطني', 'سارعي للمجد'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-034', activityId: 'saudi-great', category: 'جغرافيا',
    question: 'ما المدينة التي أصبحت عاصمة المملكة العربية السعودية؟',
    correctAnswer: 'الرياض',
    acceptableAnswers: ['الرياض'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-035', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما اسم الأسرة التي ينتمي إليها الملك عبدالعزيز؟',
    correctAnswer: 'آل سعود',
    acceptableAnswers: ['آل سعود', 'ال سعود', 'أسرة آل سعود'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-036', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما اسم الدولة التي انتهت باستعادة الملك عبدالعزيز للرياض وبدأ بعدها مشروع توحيد المملكة؟',
    correctAnswer: 'الدولة السعودية الثانية',
    acceptableAnswers: ['الدولة السعودية الثانية', 'السعودية الثانية'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-037', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'من هو القائد الذي قاد عملية استعادة الرياض؟',
    correctAnswer: 'الملك عبدالعزيز',
    acceptableAnswers: ['الملك عبدالعزيز', 'عبدالعزيز', 'ابن سعود'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-038', activityId: 'saudi-great', category: 'العلم والشعار',
    question: 'ما اللون الأساسي للعلم السعودي؟',
    correctAnswer: 'الأخضر',
    acceptableAnswers: ['الأخضر', 'اخضر', 'الاخضر', 'أخضر'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-039', activityId: 'saudi-great', category: 'العلم والشعار',
    question: 'ماذا كُتب على العلم السعودي؟',
    correctAnswer: 'الشهادة',
    acceptableAnswers: ['الشهادة', 'لا اله الا الله', 'لا إله إلا الله محمد رسول الله', 'الشهادتين'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-040', activityId: 'saudi-great', category: 'العلم والشعار',
    question: 'ما الرمز الموجود أسفل الشهادة على العلم السعودي؟',
    correctAnswer: 'السيف',
    acceptableAnswers: ['السيف', 'سيف'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-041', activityId: 'saudi-great', category: 'العلم والشعار',
    question: 'ما الخط المستخدم في كتابة الشهادة على العلم السعودي؟',
    correctAnswer: 'خط الثلث',
    acceptableAnswers: ['خط الثلث', 'الثلث'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-042', activityId: 'saudi-great', category: 'العلم والشعار',
    question: 'ماذا يرمز إليه السيف في العلم السعودي؟',
    correctAnswer: 'العدل',
    acceptableAnswers: ['العدل', 'العدالة'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-043', activityId: 'saudi-great', category: 'العلم والشعار',
    question: 'ماذا يرمز إليه اللون الأخضر في العلم السعودي؟',
    correctAnswer: 'النماء',
    acceptableAnswers: ['النماء', 'الاسلام', 'الإسلام'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-044', activityId: 'saudi-great', category: 'العلم والشعار',
    question: 'ما العنصر الموجود فوق السيفين في شعار المملكة؟',
    correctAnswer: 'النخلة',
    acceptableAnswers: ['النخلة', 'نخلة'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-045', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'ما المناسبة الوطنية التي تحتفي بتوحيد المملكة؟',
    correctAnswer: 'اليوم الوطني',
    acceptableAnswers: ['اليوم الوطني', 'اليوم الوطني السعودي'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-046', activityId: 'saudi-great', category: 'العلم والشعار',
    question: 'ما الرمز الذي لا يُنكس في العلم السعودي احترامًا لما يحمله من الشهادة؟',
    correctAnswer: 'العلم السعودي',
    acceptableAnswers: ['العلم السعودي', 'العلم', 'علم السعودية'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-047', activityId: 'saudi-great', category: 'رؤية 2030',
    question: 'ما الرؤية الوطنية التي تقود التحول الاقتصادي والاجتماعي في المملكة؟',
    correctAnswer: 'رؤية السعودية 2030',
    acceptableAnswers: ['رؤية السعودية 2030', 'رؤية 2030', 'رؤيه 2030', '2030'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-048', activityId: 'saudi-great', category: 'رؤية 2030',
    question: 'من صاحب رؤية السعودية 2030؟',
    correctAnswer: 'الأمير محمد بن سلمان',
    acceptableAnswers: ['الأمير محمد بن سلمان', 'محمد بن سلمان', 'ولي العهد'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-049', activityId: 'saudi-great', category: 'مشاريع كبرى',
    question: 'ما المدينة المستقبلية التي تقع في شمال غرب المملكة؟',
    correctAnswer: 'نيوم',
    acceptableAnswers: ['نيوم', 'NEOM'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-050', activityId: 'saudi-great', category: 'مشاريع كبرى',
    question: 'ما المشروع الحضري الطولي الشهير ضمن نيوم؟',
    correctAnswer: 'ذا لاين',
    acceptableAnswers: ['ذا لاين', 'ذ لاين', 'The Line', 'THE LINE'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-051', activityId: 'saudi-great', category: 'مشاريع كبرى',
    question: 'ما المشروع في نيوم الذي يركز على السياحة والجبل والطبيعة؟',
    correctAnswer: 'تروجينا',
    acceptableAnswers: ['تروجينا', 'Trojena'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-052', activityId: 'saudi-great', category: 'مشاريع كبرى',
    question: 'ما الجزيرة الفاخرة التابعة لمشروع نيوم؟',
    correctAnswer: 'سندالة',
    acceptableAnswers: ['سندالة', 'Sindalah'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-053', activityId: 'saudi-great', category: 'مشاريع كبرى',
    question: 'ما المنطقة الصناعية وإعادة تعريف الصناعات النظيفة في نيوم؟',
    correctAnswer: 'أوكساغون',
    acceptableAnswers: ['أوكساغون', 'اوكساغون', 'Oxagon'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-054', activityId: 'saudi-great', category: 'مشاريع كبرى',
    question: 'ما المدينة التي تحتضن مشروع القدية؟',
    correctAnswer: 'الرياض',
    acceptableAnswers: ['الرياض'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-055', activityId: 'saudi-great', category: 'تراث ومعالم',
    question: 'ما الموقع الأثري الشهير في العلا الذي يحمل واجهات صخرية نبطية؟',
    correctAnswer: 'الحِجر',
    acceptableAnswers: ['الحجر', 'الحِجر', 'مدائن صالح'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-056', activityId: 'saudi-great', category: 'تراث ومعالم',
    question: 'ما الاسم الآخر الشهير للحِجر؟',
    correctAnswer: 'مدائن صالح',
    acceptableAnswers: ['مدائن صالح'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-057', activityId: 'saudi-great', category: 'مشاريع كبرى',
    question: 'ما المشروع الذي يركز على تطوير وسط الرياض كوجهة حضرية عالمية؟',
    correctAnswer: 'المربع الجديد',
    acceptableAnswers: ['المربع الجديد', 'New Murabba'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-058', activityId: 'saudi-great', category: 'مشاريع كبرى',
    question: 'ما المشروع الذي يرتبط بالوجهة التراثية العالمية في الدرعية؟',
    correctAnswer: 'بوابة الدرعية',
    acceptableAnswers: ['بوابة الدرعية', 'Diriyah Gate'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-059', activityId: 'saudi-great', category: 'مشاريع كبرى',
    question: 'ما المشروع الذي يجمع بين الرياضة والترفيه والفنون في الرياض؟',
    correctAnswer: 'مشروع القدية',
    acceptableAnswers: ['مشروع القدية', 'القدية', 'Qiddiya'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-060', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'من هو مؤسس الدولة السعودية الأولى؟',
    correctAnswer: 'الإمام محمد بن سعود',
    acceptableAnswers: ['الإمام محمد بن سعود', 'محمد بن سعود', 'الامام محمد بن سعود'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-061', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'من هو مؤسس الدولة السعودية الثانية؟',
    correctAnswer: 'الإمام تركي بن عبدالله',
    acceptableAnswers: ['الإمام تركي بن عبدالله', 'تركي بن عبدالله', 'الامام تركي بن عبدالله'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-062', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'من هو الإمام الذي ارتبط اسمه بالسيف الأجرب؟',
    correctAnswer: 'الإمام تركي بن عبدالله',
    acceptableAnswers: ['الإمام تركي بن عبدالله', 'تركي بن عبدالله'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-063', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'من هو مؤسس مدينة الدرعية من أسلاف الأسرة السعودية؟',
    correctAnswer: 'مانع المريدي',
    acceptableAnswers: ['مانع المريدي', 'مانع'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-064', activityId: 'saudi-great', category: 'تاريخ وطني',
    question: 'من هو الإمام الذي جعل الدرعية عاصمة للدولة السعودية الأولى؟',
    correctAnswer: 'الإمام محمد بن سعود',
    acceptableAnswers: ['الإمام محمد بن سعود', 'محمد بن سعود'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-065', activityId: 'saudi-great', category: 'تراث ومعالم',
    question: 'ما الوادي الذي تقع الدرعية على ضفافه؟',
    correctAnswer: 'وادي حنيفة',
    acceptableAnswers: ['وادي حنيفة', 'حنيفة'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-066', activityId: 'saudi-great', category: 'تراث ومعالم',
    question: 'ما اللقب المرتبط بالدرعية بسبب موقعها على وادي حنيفة؟',
    correctAnswer: 'العوجا',
    acceptableAnswers: ['العوجا'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-067', activityId: 'saudi-great', category: 'تراث ومعالم',
    question: 'ما القصر التاريخي في جدة الذي شهد توقيع اتفاقية مهمة للتنقيب عن النفط؟',
    correctAnswer: 'قصر خزام',
    acceptableAnswers: ['قصر خزام', 'خزام'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-068', activityId: 'saudi-great', category: 'جغرافيا',
    question: 'ما المدينة التي تُعرف تاريخيًا بأنها بوابة مكة؟',
    correctAnswer: 'جدة',
    acceptableAnswers: ['جدة', 'جده'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-069', activityId: 'saudi-great', category: 'تراث ومعالم',
    question: 'ما الواحة السعودية المدرجة في قائمة التراث العالمي لليونسكو؟',
    correctAnswer: 'واحة الأحساء',
    acceptableAnswers: ['واحة الأحساء', 'الأحساء', 'الاحساء'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-070', activityId: 'saudi-great', category: 'تراث ومعالم',
    question: 'ما المنطقة التي تشتهر بفنون النقوش الصخرية المدرجة في اليونسكو؟',
    correctAnswer: 'حائل',
    acceptableAnswers: ['حائل', 'حايل', 'منطقة حائل'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-071', activityId: 'saudi-great', category: 'تراث ومعالم',
    question: 'ما الموقع الثقافي الذي يقع في منطقة نجران ومدرج في قائمة التراث العالمي؟',
    correctAnswer: 'حِمى الثقافية',
    acceptableAnswers: ['حمى الثقافية', 'حِمى الثقافية', 'حمى'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-072', activityId: 'saudi-great', category: 'جغرافيا',
    question: 'ما المنطقة التي تقع فيها جبال السروات ومدينة أبها؟',
    correctAnswer: 'عسير',
    acceptableAnswers: ['عسير', 'منطقة عسير'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-073', activityId: 'saudi-great', category: 'تراث ومعالم',
    question: 'ما المدينة التي تشتهر بقرية رجال ألمع التراثية؟',
    correctAnswer: 'رجال ألمع',
    acceptableAnswers: ['رجال ألمع', 'رجال المع', 'رجال ألمع'],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-074', activityId: 'saudi-great', category: 'جغرافيا',
    question: 'ما المدينة التي تضم برج المملكة الشهير؟',
    correctAnswer: 'الرياض',
    acceptableAnswers: ['الرياض'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-075', activityId: 'saudi-great', category: 'جغرافيا',
    question: 'ما المدينة التي يقع فيها المسجد الحرام؟',
    correctAnswer: 'مكة المكرمة',
    acceptableAnswers: ['مكة المكرمة', 'مكة', 'مكه'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-076', activityId: 'saudi-great', category: 'جغرافيا',
    question: 'ما المدينة التي يقع فيها المسجد النبوي؟',
    correctAnswer: 'المدينة المنورة',
    acceptableAnswers: ['المدينة المنورة', 'المدينة', 'المدينه المنوره'],
    difficulty: 'easy', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-077', activityId: 'saudi-great', category: 'تراث ومعالم',
    question: 'ما الموقع الأثري الذي يحمل اسمًا مرتبطًا بمملكة عربية قديمة في جنوب الجزيرة؟',
    correctAnswer: 'قرية الفاو',
    acceptableAnswers: ['قرية الفاو', 'الفاو'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sg-078', activityId: 'saudi-great', category: 'رؤية 2030',
    question: 'ما الشركة الوطنية التابعة لصندوق الاستثمارات العامة والمتخصصة في تطوير المجتمعات السكنية؟',
    correctAnswer: 'روشن',
    acceptableAnswers: ['روشن', 'ROSHN'],
    difficulty: 'hard', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },

  // ══════════════════════════════════════════════════════════════
  // 🔢 أرقام الوطن — مسابقة الأرقام والتواريخ (37 سؤال)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sn-001', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'في أي عام أُعلنت المملكة العربية السعودية بهذا الاسم؟',
    correctAnswer: '1932م',
    acceptableAnswers: ["1932م", "1932", "١٩٣٢", "عام 1932", "سنة 1932"],
    numberAnswer: 1932, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-002', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'في أي عام استعاد الملك عبدالعزيز مدينة الرياض؟',
    correctAnswer: '1902م',
    acceptableAnswers: ["1902م", "1902", "١٩٠٢", "عام 1902", "سنة 1902"],
    numberAnswer: 1902, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-003', activityId: 'saudi-numbers', category: 'تواريخ الملوك',
    question: 'كم عدد ملوك السعودية منذ توحيد المملكة حتى الملك سلمان؟',
    correctAnswer: '7 ملوك',
    acceptableAnswers: ["7 ملوك", "7", "٧", "سبعة", "سبع"],
    numberAnswer: 7, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-004', activityId: 'saudi-numbers', category: 'تواريخ الملوك',
    question: 'في أي عام تولى الملك سلمان الحكم؟',
    correctAnswer: '2015م',
    acceptableAnswers: ["2015م", "2015", "٢٠١٥", "عام 2015", "سنة 2015"],
    numberAnswer: 2015, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-005', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'في أي عام بدأ تطبيق نظام المناطق الحالي؟',
    correctAnswer: '1992م',
    acceptableAnswers: ["1992م", "1992", "١٩٩٢", "عام 1992", "سنة 1992"],
    numberAnswer: 1992, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-006', activityId: 'saudi-numbers', category: 'تقسيم إداري',
    question: 'كم منطقة إدارية تضم السعودية؟',
    correctAnswer: '13 منطقة',
    acceptableAnswers: ["13 منطقة", "13", "١٣", "ثلاثة عشر", "ثلاث عشرة", "ثلاثتعش"],
    numberAnswer: 13, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-007', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'في أي يوم تحتفل السعودية باليوم الوطني؟',
    correctAnswer: '23 سبتمبر',
    acceptableAnswers: ["23 سبتمبر", "23", "٢٣", "ثلاثة وعشرون", "ثلاث وعشرين", "23-9", "23/9"],
    numberAnswer: 23, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-008', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'ما رقم اليوم الوطني الذي احتفلت به المملكة في 2025؟',
    correctAnswer: '95',
    acceptableAnswers: ["95", "٩٥", "خمسة وتسعون", "خمسة وتسعين"],
    numberAnswer: 95, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-009', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'في أي عام أصبح اسم البلاد «المملكة العربية السعودية»؟',
    correctAnswer: '1932م',
    acceptableAnswers: ["1932م", "1932", "١٩٣٢", "عام 1932", "سنة 1932"],
    numberAnswer: 1932, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-010', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'كم عامًا استمر توحيد المملكة منذ استرداد الرياض حتى إعلان المملكة؟',
    correctAnswer: '30 عامًا تقريبًا',
    acceptableAnswers: ["30 عامًا تقريبًا", "30 عامًا", "30", "٣٠", "ثلاثون", "ثلاثين"],
    numberAnswer: 30, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-011', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'في أي عام بدأ الملك عبدالعزيز رحلة استعادة الرياض؟',
    correctAnswer: '1902م',
    acceptableAnswers: ["1902م", "1902", "١٩٠٢", "عام 1902", "سنة 1902"],
    numberAnswer: 1902, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-012', activityId: 'saudi-numbers', category: 'تواريخ الملوك',
    question: 'في أي عام توفي الملك عبدالعزيز؟',
    correctAnswer: '1953م',
    acceptableAnswers: ["1953م", "1953", "١٩٥٣", "عام 1953", "سنة 1953"],
    numberAnswer: 1953, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-013', activityId: 'saudi-numbers', category: 'تواريخ الملوك',
    question: 'في أي عام توفي الملك سعود؟',
    correctAnswer: '1969م',
    acceptableAnswers: ["1969م", "1969", "١٩٦٩", "عام 1969", "سنة 1969"],
    numberAnswer: 1969, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-014', activityId: 'saudi-numbers', category: 'تواريخ الملوك',
    question: 'في أي عام توفي الملك فيصل؟',
    correctAnswer: '1975م',
    acceptableAnswers: ["1975م", "1975", "١٩٧٥", "عام 1975", "سنة 1975"],
    numberAnswer: 1975, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-015', activityId: 'saudi-numbers', category: 'تواريخ الملوك',
    question: 'في أي عام توفي الملك خالد؟',
    correctAnswer: '1982م',
    acceptableAnswers: ["1982م", "1982", "١٩٨٢", "عام 1982", "سنة 1982"],
    numberAnswer: 1982, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-016', activityId: 'saudi-numbers', category: 'تواريخ الملوك',
    question: 'في أي عام توفي الملك فهد؟',
    correctAnswer: '2005م',
    acceptableAnswers: ["2005م", "2005", "٢٠٠٥", "عام 2005", "سنة 2005"],
    numberAnswer: 2005, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-017', activityId: 'saudi-numbers', category: 'تواريخ الملوك',
    question: 'في أي عام توفي الملك عبدالله؟',
    correctAnswer: '2015م',
    acceptableAnswers: ["2015م", "2015", "٢٠١٥", "عام 2015", "سنة 2015"],
    numberAnswer: 2015, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-018', activityId: 'saudi-numbers', category: 'تواريخ الملوك',
    question: 'كم سنة استمر حكم الملك فهد تقريبًا؟',
    correctAnswer: '23 سنة',
    acceptableAnswers: ["23 سنة", "23", "٢٣", "ثلاثة وعشرون", "ثلاث وعشرين"],
    numberAnswer: 23, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-019', activityId: 'saudi-numbers', category: 'تواريخ الملوك',
    question: 'كم سنة استمر حكم الملك عبدالله؟',
    correctAnswer: '10 سنوات',
    acceptableAnswers: ["10 سنوات", "10", "١٠", "عشرة", "عشر"],
    numberAnswer: 10, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-020', activityId: 'saudi-numbers', category: 'مساحات ومناطق',
    question: 'كم تبلغ مساحة السعودية تقريبًا؟',
    correctAnswer: 'أكثر من 2 مليون كم²',
    acceptableAnswers: ["أكثر من 2 مليون كم²", "2 مليون", "2", "٢", "اثنين", "اثنان", "مليونين", "اكثر من مليونين", "أكثر من 2 مليون"],
    numberAnswer: 2, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-021', activityId: 'saudi-numbers', category: 'تقسيم إداري',
    question: 'كم منطقة إدارية توجد في السعودية؟',
    correctAnswer: '13',
    acceptableAnswers: ["13", "١٣", "ثلاثة عشر", "ثلاث عشرة", "ثلاثتعش"],
    numberAnswer: 13, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-022', activityId: 'saudi-numbers', category: 'تقسيم إداري',
    question: 'كم منطقة إدارية تطل على البحر الأحمر؟',
    correctAnswer: '5 مناطق',
    acceptableAnswers: ["5 مناطق", "5", "٥", "خمسة", "خمس"],
    numberAnswer: 5, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-023', activityId: 'saudi-numbers', category: 'مساحات ومناطق',
    question: 'كم تبلغ مساحة المنطقة الشرقية تقريبًا؟',
    correctAnswer: '540 ألف كم²',
    acceptableAnswers: ["540 ألف كم²", "540 ألف", "540", "٥٤٠", "540 الف", "540 الف كم"],
    numberAnswer: 540, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-024', activityId: 'saudi-numbers', category: 'مساحات ومناطق',
    question: 'كم تبلغ مساحة منطقة الباحة تقريبًا؟',
    correctAnswer: '12 ألف كم²',
    acceptableAnswers: ["12 ألف كم²", "12 ألف", "12", "١٢", "اثنا عشر", "اثني عشر", "اثناعش", "12 الف", "12 الف كم"],
    numberAnswer: 12, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-025', activityId: 'saudi-numbers', category: 'مساحات ومناطق',
    question: 'كم تبلغ مساحة منطقة الرياض تقريبًا؟',
    correctAnswer: '380 ألف كم²',
    acceptableAnswers: ["380 ألف كم²", "380 ألف", "380", "٣٨٠", "380 الف", "380 الف كم"],
    numberAnswer: 380, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-026', activityId: 'saudi-numbers', category: 'مساحات ومناطق',
    question: 'كم تبلغ مساحة منطقة المدينة المنورة تقريبًا؟',
    correctAnswer: '150 ألف كم²',
    acceptableAnswers: ["150 ألف كم²", "150 ألف", "150", "١٥٠", "150 الف", "150 الف كم"],
    numberAnswer: 150, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-027', activityId: 'saudi-numbers', category: 'مساحات ومناطق',
    question: 'كم تبلغ مساحة منطقة القصيم تقريبًا؟',
    correctAnswer: '73 ألف كم²',
    acceptableAnswers: ["73 ألف كم²", "73 ألف", "73", "٧٣", "73 الف", "73 الف كم"],
    numberAnswer: 73, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-028', activityId: 'saudi-numbers', category: 'مساحات ومناطق',
    question: 'كم تبلغ مساحة منطقة حائل تقريبًا؟',
    correctAnswer: '120 ألف كم²',
    acceptableAnswers: ["120 ألف كم²", "120 ألف", "120", "١٢٠", "120 الف", "120 الف كم"],
    numberAnswer: 120, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-029', activityId: 'saudi-numbers', category: 'مساحات ومناطق',
    question: 'كم تبلغ مساحة منطقة عسير تقريبًا؟',
    correctAnswer: '80 ألف كم²',
    acceptableAnswers: ["80 ألف كم²", "80 ألف", "80", "٨٠", "80 الف", "80 الف كم"],
    numberAnswer: 80, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-030', activityId: 'saudi-numbers', category: 'إحصاءات ومعالم',
    question: 'كم عدد المطارات الدولية والإقليمية في السعودية وفق إحصاءات 2024؟',
    correctAnswer: '29 مطارًا',
    acceptableAnswers: ["29 مطارًا", "29", "٢٩", "تسعة وعشرون", "تسع وعشرين"],
    numberAnswer: 29, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-031', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'كم موقعًا سعوديًا يوجد في قائمة التراث العالمي لليونسكو؟',
    correctAnswer: '8',
    acceptableAnswers: ["8", "٨", "ثمانية", "ثمان"],
    numberAnswer: 8, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-032', activityId: 'saudi-numbers', category: 'إحصاءات ومعالم',
    question: 'كم مدفنًا نبطيًا تقريبًا في موقع الحِجر؟',
    correctAnswer: '111 مدفنًا',
    acceptableAnswers: ["111 مدفنًا", "111", "١١١", "مائة واحد عشر", "مية واثنعش"],
    numberAnswer: 111, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-033', activityId: 'saudi-numbers', category: 'تقسيم إداري',
    question: 'كم محافظة تتبع منطقة الرياض؟',
    correctAnswer: '22 محافظة',
    acceptableAnswers: ["22 محافظة", "22", "٢٢", "اثنان وعشرون", "اثنين وعشرين"],
    numberAnswer: 22, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-034', activityId: 'saudi-numbers', category: 'تقسيم إداري',
    question: 'كم محافظة تتبع المنطقة الشرقية؟',
    correctAnswer: '13 محافظة',
    acceptableAnswers: ["13 محافظة", "13", "١٣", "ثلاثة عشر", "ثلاث عشرة", "ثلاثتعش"],
    numberAnswer: 13, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-035', activityId: 'saudi-numbers', category: 'تقسيم إداري',
    question: 'كم محافظة تتبع منطقة القصيم؟',
    correctAnswer: '13 محافظة',
    acceptableAnswers: ["13 محافظة", "13", "١٣", "ثلاثة عشر", "ثلاث عشرة", "ثلاثتعش"],
    numberAnswer: 13, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-036', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'في أي عام صدر نظام المناطق الذي شكل التقسيم الإداري الحديث؟',
    correctAnswer: '1992م',
    acceptableAnswers: ["1992م", "1992", "١٩٩٢", "عام 1992", "سنة 1992"],
    numberAnswer: 1992, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sn-037', activityId: 'saudi-numbers', category: 'أرقام وتواريخ',
    question: 'في أي عام تأسست الدولة السعودية الأولى؟',
    correctAnswer: '1727م',
    acceptableAnswers: ["1727م", "1727", "١٧٢٧", "عام 1727", "سنة 1727"],
    numberAnswer: 1727, difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },

  // ══════════════════════════════════════════════════════════════
  // 📸 صور ربوع بلادي — تحدي كشف الصور والمعالم (38 سؤال مع صور)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ls-001', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'المتحف الوطني السعودي',
    acceptableAnswers: ["المتحف الوطني السعودي"],
    mediaUrl: '/national-day-96/landscapes/land-001.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-002', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'باب مكة - سور جدة',
    acceptableAnswers: ["باب مكة - سور جدة", "باب مكة", "سور جدة", "باب مكه - سور جده", "باب مكه", "سور جده"],
    mediaUrl: '/national-day-96/landscapes/land-002.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-003', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'برج مجدول',
    acceptableAnswers: ["برج مجدول", "مجدول", "Majdoul Tower"],
    mediaUrl: '/national-day-96/landscapes/land-003.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-004', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'بوليفارد وورلد',
    acceptableAnswers: ["بوليفارد وورلد", "بوليفارد", "Boulevard", "Boulevard World"],
    mediaUrl: '/national-day-96/landscapes/land-004.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-005', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'بيت نصيف',
    acceptableAnswers: ["بيت نصيف", "نصيف"],
    mediaUrl: '/national-day-96/landscapes/land-005.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-006', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'تروجينا',
    acceptableAnswers: ["تروجينا", "Trojena", "نيوم"],
    mediaUrl: '/national-day-96/landscapes/land-006.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-007', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'جبل القارة',
    acceptableAnswers: ["جبل القارة", "القارة", "جبل القاره", "القاره", "الأحساء"],
    mediaUrl: '/national-day-96/landscapes/land-007.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-008', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'جبل طويق',
    acceptableAnswers: ["جبل طويق", "طويق"],
    mediaUrl: '/national-day-96/landscapes/land-008.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-009', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'جدة التاريخية - البلد',
    acceptableAnswers: ["جدة التاريخية - البلد", "جدة التاريخية", "البلد", "جده التاريخيه - البلد", "جده التاريخيه"],
    mediaUrl: '/national-day-96/landscapes/land-009.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-010', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'جزر فرسان',
    acceptableAnswers: ["جزر فرسان", "فرسان", "جزيرة فرسان", "جازان"],
    mediaUrl: '/national-day-96/landscapes/land-010.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-011', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'جزيرة شورى',
    acceptableAnswers: ["جزيرة شورى", "شورى", "جزيره شورى", "جزيرة شوري", "شوري"],
    mediaUrl: '/national-day-96/landscapes/land-011.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-012', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'حي البيجيري',
    acceptableAnswers: ["حي البيجيري", "البيجيري", "البجيري", "حي البجيري", "مطل البجيري", "الدرعية"],
    mediaUrl: '/national-day-96/landscapes/land-012.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-013', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'حي طريف',
    acceptableAnswers: ["حي طريف", "طريف", "حي الطريف", "الدرعية"],
    mediaUrl: '/national-day-96/landscapes/land-013.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-014', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'ذا لاين',
    acceptableAnswers: ["ذا لاين", "The Line", "لاين", "نيوم"],
    mediaUrl: '/national-day-96/landscapes/land-014.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-015', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'سندالة',
    acceptableAnswers: ["سندالة", "سنداله", "Sindalah", "نيوم"],
    mediaUrl: '/national-day-96/landscapes/land-015.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-016', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'سوق عكاظ',
    acceptableAnswers: ["سوق عكاظ", "عكاظ"],
    mediaUrl: '/national-day-96/landscapes/land-016.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-017', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'صخرة الفيل',
    acceptableAnswers: ["صخرة الفيل", "الفيل", "صخره الفيل", "جبل الفيل"],
    mediaUrl: '/national-day-96/landscapes/land-017.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-018', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قاعة مرايا',
    acceptableAnswers: ["قاعة مرايا", "مرايا", "قاعه مرايا", "مسرح مرايا", "العلا"],
    mediaUrl: '/national-day-96/landscapes/land-018.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-019', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قرية الفاو الأثرية',
    acceptableAnswers: ["قرية الفاو الأثرية", "الفاو الأثرية", "قريه الفاو الأثريه", "قرية الفاو الاثرية", "الفاو الأثريه", "الفاو الاثرية"],
    mediaUrl: '/national-day-96/landscapes/land-019.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-020', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قرية المفتاحة',
    acceptableAnswers: ["قرية المفتاحة", "المفتاحة", "قريه المفتاحه", "المفتاحه", "ابها"],
    mediaUrl: '/national-day-96/landscapes/land-020.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-021', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قرية رجال ألمع',
    acceptableAnswers: ["قرية رجال ألمع", "رجال ألمع", "قريه رجال ألمع", "قرية رجال المع", "رجال المع", "المع"],
    mediaUrl: '/national-day-96/landscapes/land-021.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-022', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قصر القشلة',
    acceptableAnswers: ["قصر القشلة", "القشلة", "قصر القشله", "القشله"],
    mediaUrl: '/national-day-96/landscapes/land-022.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-023', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قصر المربع',
    acceptableAnswers: ["قصر المربع", "المربع"],
    mediaUrl: '/national-day-96/landscapes/land-023.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-024', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قصر المصمك',
    acceptableAnswers: ["قصر المصمك", "المصمك", "حصن المصمك"],
    mediaUrl: '/national-day-96/landscapes/land-024.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-025', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قصر خزام',
    acceptableAnswers: ["قصر خزام", "خزام"],
    mediaUrl: '/national-day-96/landscapes/land-025.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-026', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قصر سلوى',
    acceptableAnswers: ["قصر سلوى", "سلوى", "قصر سلوي", "سلوي"],
    mediaUrl: '/national-day-96/landscapes/land-026.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-027', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قصر شبرا',
    acceptableAnswers: ["قصر شبرا", "شبرا"],
    mediaUrl: '/national-day-96/landscapes/land-027.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-028', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قلعة أعيرف',
    acceptableAnswers: ["قلعة أعيرف", "أعيرف", "قلعه أعيرف", "قلعة اعيرف", "اعيرف"],
    mediaUrl: '/national-day-96/landscapes/land-028.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-029', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قلعة زعبل',
    acceptableAnswers: ["قلعة زعبل", "زعبل", "قلعه زعبل"],
    mediaUrl: '/national-day-96/landscapes/land-029.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-030', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'قلعة مارد',
    acceptableAnswers: ["قلعة مارد", "مارد", "قلعه مارد"],
    mediaUrl: '/national-day-96/landscapes/land-030.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-031', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'مدائن صالح',
    acceptableAnswers: ["مدائن صالح", "الحجر", "الحِجر", "العلا"],
    mediaUrl: '/national-day-96/landscapes/land-031.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-032', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'مدينة الألعاب المائية - أكواباريا',
    acceptableAnswers: ["مدينة الألعاب المائية - أكواباريا", "مدينة الألعاب المائية", "الألعاب المائية", "أكواباريا", "مدينه الألعاب المائيه - أكواباريا", "مدينة الالعاب المائية - اكواباريا", "مدينه الألعاب المائيه", "مدينة الالعاب المائية", "الألعاب المائيه", "الالعاب المائية", "اكواباريا"],
    mediaUrl: '/national-day-96/landscapes/land-032.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-033', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'مدينة الملك عبدالله الاقتصادية',
    acceptableAnswers: ["مدينة الملك عبدالله الاقتصادية", "الملك عبدالله الاقتصادية", "مدينه الملك عبدالله الاقتصاديه", "مدينة الملك عبداللة الاقتصادية", "الملك عبدالله الاقتصاديه", "الملك عبداللة الاقتصادية"],
    mediaUrl: '/national-day-96/landscapes/land-033.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-034', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'مركز إثراء',
    acceptableAnswers: ["مركز إثراء", "إثراء", "مركز اثراء", "اثراء", "مركز الملك عبدالعزيز الثقافي"],
    mediaUrl: '/national-day-96/landscapes/land-034.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-035', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'منتجع شيبارة',
    acceptableAnswers: ["منتجع شيبارة", "شيبارة", "منتجع شيباره", "شيباره", "البحر الاحمر"],
    mediaUrl: '/national-day-96/landscapes/land-035.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-036', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'منطقة ذا جروفز',
    acceptableAnswers: ["منطقة ذا جروفز", "ذا جروفز", "منطقه ذا جروفز"],
    mediaUrl: '/national-day-96/landscapes/land-036.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-037', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'منطقة سمحان',
    acceptableAnswers: ["منطقة سمحان", "سمحان", "منطقه سمحان"],
    mediaUrl: '/national-day-96/landscapes/land-037.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'ls-038', activityId: 'landscapes', category: 'معالم ومناطق',
    question: 'ما اسم هذا المعلم أو الموقع الشهير في الصورة؟ 📸',
    correctAnswer: 'نادي جدة لليخوت',
    acceptableAnswers: ["نادي جدة لليخوت", "جدة لليخوت", "نادي جده لليخوت", "جده لليخوت"],
    mediaUrl: '/national-day-96/landscapes/land-038.jpeg', mediaType: 'image',
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },

  // ══════════════════════════════════════════════════════════════
  // 🐎 تراثنا الأصيل — الخيل والإبل والقهوة والزي (80 سؤال)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sh-001', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما اسم المهرجان السعودي السنوي الذي يُعنى بجمال الإبل وثقافتها؟',
    correctAnswer: 'مهرجان الملك عبدالعزيز للإبل',
    acceptableAnswers: ["مهرجان الملك عبدالعزيز للإبل", "الملك عبدالعزيز للإبل", "مهرجان الملك عبدالعزيز للابل", "الملك عبدالعزيز للابل", "مهرجان الملك عبدالعزيز", "مهرجان الإبل", "مهرجان الابل", "مزاين الملك عبدالعزيز"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-002', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ماذا تسمى المسابقات التي يتم فيها تقييم جمال الإبل؟',
    correctAnswer: 'مزاين الإبل',
    acceptableAnswers: ["مزاين الإبل", "مزاين الابل"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-003', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما اسم المسابقة التي تعتمد على قدرة الإبل على قطع المسافات؟',
    correctAnswer: 'الهجيج',
    acceptableAnswers: ["الهجيج", "هجيج"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-004', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما اسم السباقات التي تتنافس فيها الإبل على السرعة؟',
    correctAnswer: 'سباقات الهجن',
    acceptableAnswers: ["سباقات الهجن"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-005', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما اللون الذي يُطلق على الإبل البيضاء في مسابقات المزاين؟',
    correctAnswer: 'الوضح',
    acceptableAnswers: ["الوضح", "وضح"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-006', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما الاسم الذي يطلق على الإبل ذات اللون الداكن في فئات المزاين؟',
    correctAnswer: 'المجاهيم',
    acceptableAnswers: ["المجاهيم", "مجاهيم"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-007', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما اسم المسابقة التي تعتمد على تجميع النقاط من نتائج المنافسات المختلفة؟',
    correctAnswer: 'الشداد',
    acceptableAnswers: ["الشداد", "شداد"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-008', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما الاسم الذي يطلق على الجمل الذي يُستخدم للتناسل وإنتاج الإبل؟',
    correctAnswer: 'الفحل',
    acceptableAnswers: ["الفحل", "فحل"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-009', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما اسم الموقع الذي يقام فيه مهرجان الملك عبدالعزيز للإبل؟',
    correctAnswer: 'الصياهد',
    acceptableAnswers: ["الصياهد", "صياهد"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-010', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما اسم الجهة السعودية المتخصصة بالإبل وتنظم مهرجان الملك عبدالعزيز للإبل؟',
    correctAnswer: 'نادي الإبل',
    acceptableAnswers: ["نادي الإبل", "نادي الابل"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-011', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما الاسم الذي أطلق سابقًا على منافسات جمال الإبل قبل تغيير اسم المهرجان؟',
    correctAnswer: 'جائزة الملك عبدالعزيز لمزايين الإبل',
    acceptableAnswers: ["جائزة الملك عبدالعزيز لمزايين الإبل", "جائزة الملك عبدالعزيز لمزايين الابل"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-012', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما الفئة التي تكون المشاركة فيها برأس واحد؟',
    correctAnswer: 'الفردي',
    acceptableAnswers: ["الفردي", "فردي"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-013', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما الاسم الذي يطلق على الإبل الصغيرة من فئات المشاركة؟',
    correctAnswer: 'المفاريد',
    acceptableAnswers: ["المفاريد", "مفاريد"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-014', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما الاسم الذي يطلق على فئة من أعمار الإبل المشاركة في المهرجان؟',
    correctAnswer: 'دق',
    acceptableAnswers: ["دق"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-015', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما الاسم الذي يطلق على الفئة العمرية الأكبر في تصنيف الإبل؟',
    correctAnswer: 'جل',
    acceptableAnswers: ["جل"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-016', activityId: 'saudi-heritage', category: 'الخيل والفروسية',
    question: 'ماذا يسمى الشخص الذي يمتطي الخيل ويمارس هذه الرياضة؟',
    correctAnswer: 'الفارس',
    acceptableAnswers: ["الفارس", "فارس"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-017', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما اسم الرياضة التي يتجاوز فيها الفارس حواجز مرتفعة بواسطة جواده؟',
    correctAnswer: 'قفز الحواجز',
    acceptableAnswers: ["قفز الحواجز"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-018', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما اسم الرياضة التي يؤدي فيها الجواد حركات محددة بدقة وانضباط؟',
    correctAnswer: 'الترويض',
    acceptableAnswers: ["الترويض", "ترويض"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-019', activityId: 'saudi-heritage', category: 'الخيل والفروسية',
    question: 'ما اسم الرياضة التي يجمع فيها الفارس بين ركوب الخيل واستخدام السلاح للرماية؟',
    correctAnswer: 'الرماية على ظهر الخيل',
    acceptableAnswers: ["الرماية على ظهر الخيل", "رماية على ظهر الخيل", "الرماية علي ظهر الخيل", "رماية علي ظهر الخيل"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-020', activityId: 'saudi-heritage', category: 'الخيل والفروسية',
    question: 'ما الاسم الذي يطلق على السلالة الأصيلة المشهورة بتاريخها الطويل في الجزيرة العربية؟',
    correctAnswer: 'الخيل العربي',
    acceptableAnswers: ["الخيل العربي", "خيل العربي"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-021', activityId: 'saudi-heritage', category: 'الخيل والفروسية',
    question: 'ما اسم الجهة السعودية التي تنظم سباقات الخيل؟',
    correctAnswer: 'نادي سباقات الخيل',
    acceptableAnswers: ["نادي سباقات الخيل"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-022', activityId: 'saudi-heritage', category: 'الخيل والفروسية',
    question: 'ما الاسم السابق للجهة السعودية المنظمة لسباقات الخيل قبل تغيير مسماها؟',
    correctAnswer: 'نادي الفروسية',
    acceptableAnswers: ["نادي الفروسية", "نادي الفروسيه"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-023', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما اسم السباق الدولي الكبير الذي يقام في الرياض؟',
    correctAnswer: 'كأس السعودية',
    acceptableAnswers: ["كأس السعودية", "كأس السعوديه", "كاس السعودية"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-024', activityId: 'saudi-heritage', category: 'الخيل والفروسية',
    question: 'ما اسم الكأس المرتبط بالملك المؤسس ويعد من أبرز سباقات الخيل السعودية؟',
    correctAnswer: 'كأس المؤسس',
    acceptableAnswers: ["كأس المؤسس", "كاس المؤسس"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-025', activityId: 'saudi-heritage', category: 'الخيل والفروسية',
    question: 'ما اسم الميدان الرئيسي الذي تقام عليه أبرز سباقات الخيل في الرياض؟',
    correctAnswer: 'ميدان الملك عبدالعزيز',
    acceptableAnswers: ["ميدان الملك عبدالعزيز"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-026', activityId: 'saudi-heritage', category: 'الخيل والفروسية',
    question: 'في أي مدينة يقع الميدان الآخر الذي يستضيف سباقات نادي سباقات الخيل؟',
    correctAnswer: 'الطائف',
    acceptableAnswers: ["الطائف", "طائف"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-027', activityId: 'saudi-heritage', category: 'الخيل والفروسية',
    question: 'ما اسم الرياضة التي تستخدم فيها الخيل للتنقل والمنافسة مع المحافظة على التحكم والدقة؟',
    correctAnswer: 'الفروسية',
    acceptableAnswers: ["الفروسية", "فروسية", "الفروسيه", "فروسيه"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-028', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ماذا يسمى الشخص المتخصص في تربية الصقور وتدريبها؟',
    correctAnswer: 'الصقار',
    acceptableAnswers: ["الصقار", "صقار"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-029', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ماذا تسمى رحلات الصيد باستخدام الطيور الجارحة المدربة؟',
    correctAnswer: 'المقناص',
    acceptableAnswers: ["المقناص", "مقناص"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-030', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما اسم المرحلة التي يتم فيها تجهيز الطير وتأهيله قبل موسم الصيد؟',
    correctAnswer: 'الدعو',
    acceptableAnswers: ["الدعو", "دعو"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-031', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما الاسم الذي يطلق على فترة بقاء الطير لدى صاحبه خارج موسم الصيد؟',
    correctAnswer: 'المقيض',
    acceptableAnswers: ["المقيض", "مقيض"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-032', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما الأداة التي توضع على رأس الصقر لحجب الرؤية؟',
    correctAnswer: 'البرقع',
    acceptableAnswers: ["البرقع", "برقع"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-033', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما الأداة التي تربط بها رجل الصقر أثناء التعامل معه؟',
    correctAnswer: 'السبوق',
    acceptableAnswers: ["السبوق", "سبوق"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-034', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما الاسم الذي يطلق على المكان الذي يقف عليه الصقر؟',
    correctAnswer: 'الوكر',
    acceptableAnswers: ["الوكر", "وكر"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-035', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما الأداة التي يستخدمها الصقار لتدريب الطير على الانقضاض والعودة؟',
    correctAnswer: 'الملواح',
    acceptableAnswers: ["الملواح", "ملواح"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-036', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما الاسم الذي يطلق على الأداة المستخدمة لتثبيت الصقر أثناء بعض مراحل التعامل معه؟',
    correctAnswer: 'الدس',
    acceptableAnswers: ["الدس"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-037', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اسم المهرجان السعودي المتخصص بالصقور؟',
    correctAnswer: 'مهرجان الملك عبدالعزيز للصقور',
    acceptableAnswers: ["مهرجان الملك عبدالعزيز للصقور", "الملك عبدالعزيز للصقور"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-038', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما اسم التراث الذي أدرجته اليونسكو عام 2021 ويرتبط بتدريب الطيور الجارحة والصيد بها؟',
    correctAnswer: 'الصقارة',
    acceptableAnswers: ["الصقارة", "صقارة", "الصقاره", "صقاره"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-039', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما اسم الأداة التي يستخدمها الصقار لحمل مستلزمات القنص؟',
    correctAnswer: 'المخلا',
    acceptableAnswers: ["المخلا", "مخلا"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-040', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما اسم الوعاء التقليدي الذي تُحضّر وتُقدّم فيه القهوة؟',
    correctAnswer: 'الدلة',
    acceptableAnswers: ["الدلة", "دلة", "الدله", "دله"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-041', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما اسم الوعاء الصغير الذي تقدم فيه القهوة للضيف؟',
    correctAnswer: 'الفنجان',
    acceptableAnswers: ["الفنجان", "فنجان"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-042', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما الأداة التي تستخدم لتحميص حبوب القهوة؟',
    correctAnswer: 'المحماس',
    acceptableAnswers: ["المحماس", "محماس"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-043', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما الأداة التي تستخدم لطحن حبوب القهوة يدويًا؟',
    correctAnswer: 'النجر',
    acceptableAnswers: ["النجر", "نجر"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-044', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما الأداة التي تستخدم لدق حبوب القهوة وإصدار الصوت المعروف في المجلس؟',
    correctAnswer: 'المهباش',
    acceptableAnswers: ["المهباش", "مهباش"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-045', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما الأداة التي تستخدم لتنقية القهوة من بقايا البن؟',
    correctAnswer: 'المصفاة',
    acceptableAnswers: ["المصفاة", "مصفاة", "المصفاه", "مصفاه"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-046', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما الأداة التي تستخدم لتبريد حبوب القهوة بعد تحميصها؟',
    correctAnswer: 'المبرد',
    acceptableAnswers: ["المبرد", "مبرد"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-047', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما الاسم الذي يطلق على مجموعة الأدوات المستخدمة في إعداد القهوة؟',
    correctAnswer: 'المعاميل',
    acceptableAnswers: ["المعاميل", "معاميل"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-048', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما الوعاء الذي تستخدمه بعض طرق إعداد القهوة في مراحل الطبخ؟',
    correctAnswer: 'المطباخة',
    acceptableAnswers: ["المطباخة", "مطباخة", "المطباخه", "مطباخه"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-049', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما الأداة التي تحفظ فيها مكونات مرتبطة بإعداد القهوة؟',
    correctAnswer: 'المبهارة',
    acceptableAnswers: ["المبهارة", "مبهارة", "المبهاره", "مبهاره"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-050', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما الاسم الذي يطلق على أشهر رمز من رموز الكرم وحسن الضيافة في تقديم القهوة؟',
    correctAnswer: 'الدلة',
    acceptableAnswers: ["الدلة", "دلة", "الدله", "دله"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-051', activityId: 'saudi-heritage', category: 'القهوة السعودية',
    question: 'ما الاسم الذي أطلقته السعودية رسميًا على مشروبها التراثي المرتبط بالضيافة؟',
    correctAnswer: 'القهوة السعودية',
    acceptableAnswers: ["القهوة السعودية", "قهوة السعودية", "القهوة السعوديه", "قهوة السعوديه", "القهوة", "قهوة سعودية", "قهوة عربية", "القهوة العربية"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-052', activityId: 'saudi-heritage', category: 'الفنون الشعبية',
    question: 'ما اسم المسكن التقليدي المرتبط بحياة البادية والمصنوع من المنسوجات التقليدية؟',
    correctAnswer: 'بيت الشعر',
    acceptableAnswers: ["بيت الشعر"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-053', activityId: 'saudi-heritage', category: 'الحرف والأسواق',
    question: 'ما اسم الحرفة التقليدية التي تستخدم في نسج المنسوجات البدوية؟',
    correctAnswer: 'السدو',
    acceptableAnswers: ["السدو", "سدو", "حرفة السدو", "نسيج السدو"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-054', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما اسم الأداة الخشبية التي تستخدم في عملية النسيج التقليدي؟',
    correctAnswer: 'النول',
    acceptableAnswers: ["النول", "نول"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-055', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما الأداة الخشبية التي تُلف حولها الألياف قبل استخدامها في النسج؟',
    correctAnswer: 'التغزالة',
    acceptableAnswers: ["التغزالة", "تغزالة", "التغزاله", "تغزاله"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-056', activityId: 'saudi-heritage', category: 'الإبل والمزاين',
    question: 'ما المادة الحيوانية التي يمكن أن تستخدم في صناعة بعض منسوجات بيت الشعر؟',
    correctAnswer: 'وبر الإبل',
    acceptableAnswers: ["وبر الإبل", "وبر الابل"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-057', activityId: 'saudi-heritage', category: 'الحرف والأسواق',
    question: 'ما الاسم الذي يطلق على المرأة التي تمارس حرفة النسج التقليدية؟',
    correctAnswer: 'ناسجة السدو',
    acceptableAnswers: ["ناسجة السدو", "سدو", "حرفة السدو", "نسيج السدو"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-058', activityId: 'saudi-heritage', category: 'الحرف والأسواق',
    question: 'ما المنظمة الدولية التي أدرجت السدو ضمن التراث الثقافي غير المادي؟',
    correctAnswer: 'اليونسكو',
    acceptableAnswers: ["اليونسكو", "يونسكو"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-059', activityId: 'saudi-heritage', category: 'الحرف والأسواق',
    question: 'في أي عام أدرج السدو ضمن قائمة التراث الثقافي غير المادي؟',
    correctAnswer: '2020',
    acceptableAnswers: ["2020"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-060', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما غطاء الرأس الذي يثبت عادة بواسطة العقال؟',
    correctAnswer: 'الغترة',
    acceptableAnswers: ["الغترة", "غترة", "الغتره", "غتره"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-061', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما القطعة التي توضع فوق غطاء الرأس لتثبيته؟',
    correctAnswer: 'العقال',
    acceptableAnswers: ["العقال", "عقال"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-062', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اللباس الرجالي الفضفاض الذي يرتدى فوق الملابس في المناسبات؟',
    correctAnswer: 'البشت',
    acceptableAnswers: ["البشت", "بشت"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-063', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما الاسم الآخر الشائع للبشت في عدد من مناطق السعودية؟',
    correctAnswer: 'المشلح',
    acceptableAnswers: ["المشلح", "مشلح"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-064', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اللباس الذي يشبه الثوب ويتميز بفتحة أمامية وأحيانًا بفتحتين جانبيتين؟',
    correctAnswer: 'الدقلة',
    acceptableAnswers: ["الدقلة", "دقلة", "الدقله", "دقله"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-065', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما الاسم الآخر للدقلة في بعض المناطق؟',
    correctAnswer: 'الزبون',
    acceptableAnswers: ["الزبون", "زبون"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-066', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اللباس الشتوي المصنوع من فراء الأغنام أو الماعز؟',
    correctAnswer: 'الفروة',
    acceptableAnswers: ["الفروة", "فروة", "الفروه", "فروه"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-067', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اسم اللباس الذي كان يلبس فوق الثوب وله أكمام طويلة مثلثة في وسط المملكة؟',
    correctAnswer: 'المردون',
    acceptableAnswers: ["المردون", "مردون"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-068', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اسم الرداء الذي يرتديه قارعو الطبول ضمن الزي التقليدي للعرضة؟',
    correctAnswer: 'الفرملية - الدامر',
    acceptableAnswers: ["الفرملية - الدامر", "الفرملية", "الدامر", "فرملية - الدامر", "الفرمليه"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-069', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اسم الرداء الأبيض الخفيف المرتبط بزي العرضة وبعض المرافقين؟',
    correctAnswer: 'الصاية',
    acceptableAnswers: ["الصاية", "صاية", "الصايه", "صايه"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-070', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اسم الزي النسائي الجنوبي الذي يغطي كامل الجسد ويُطرز بألوان مختلفة؟',
    correctAnswer: 'الصدرة - السدرة',
    acceptableAnswers: ["الصدرة - السدرة", "الصدرة", "السدرة", "صدرة - السدرة", "الصدرة - السدره", "الصدره", "السدره", "صدرة - السدره"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-071', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما اسم غطاء الرأس النسائي المعروف في عدد من مناطق المملكة؟',
    correctAnswer: 'الشيلة',
    acceptableAnswers: ["الشيلة", "شيلة", "الشيله", "شيله"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-072', activityId: 'saudi-heritage', category: 'تراث وأصالة',
    question: 'ما اسم المنديل النسائي الأسود الذي يطوى بشكل مثلث؟',
    correctAnswer: 'المقرونة',
    acceptableAnswers: ["المقرونة", "مقرونة", "المقرونه", "مقرونه"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-073', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اسم غطاء الرأس النسائي الذي كان معروفًا في بعض أزياء شمال المملكة؟',
    correctAnswer: 'الشمبر',
    acceptableAnswers: ["الشمبر", "شمبر"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-074', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اسم اللباس النسائي الذي كان معروفًا في المنطقة الوسطى ويصنع من القماش الشفاف للصغيرات؟',
    correctAnswer: 'المخنق',
    acceptableAnswers: ["المخنق", "مخنق"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-075', activityId: 'saudi-heritage', category: 'الحرف والأسواق',
    question: 'ما اسم المهرجان التراثي والثقافي الذي ارتبط تاريخيًا بقرية الجنادرية؟',
    correctAnswer: 'مهرجان الجنادرية',
    acceptableAnswers: ["مهرجان الجنادرية", "الجنادرية", "مهرجان الجنادريه", "الجنادريه"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-076', activityId: 'saudi-heritage', category: 'الحرف والأسواق',
    question: 'ما اسم السوق التاريخي الذي تحول إلى فعالية ثقافية وتراثية شهيرة في السعودية؟',
    correctAnswer: 'سوق عكاظ',
    acceptableAnswers: ["سوق عكاظ", "عكاظ", "سوق عكاظ التاريخي"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-077', activityId: 'saudi-heritage', category: 'الفنون الشعبية',
    question: 'ما اسم الفن الشعبي الذي يجمع الشعر والطبول والرقص بالسيوف؟',
    correctAnswer: 'العرضة السعودية',
    acceptableAnswers: ["العرضة السعودية", "عرضة السعودية", "العرضة السعوديه", "عرضة السعوديه", "العرضة", "العرضه", "عرضة سعودية", "العرضة النجدية"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-078', activityId: 'saudi-heritage', category: 'الفنون الشعبية',
    question: 'ما الاسم الآخر المعروف للفن الشعبي الذي نشأ في نجد ويؤدى في المناسبات؟',
    correctAnswer: 'العرضة النجدية',
    acceptableAnswers: ["العرضة النجدية", "عرضة النجدية", "العرضة النجديه", "عرضة النجديه"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-079', activityId: 'saudi-heritage', category: 'الأزياء التراثية',
    question: 'ما اسم الفن الشعبي الحجازي الذي يعتمد على الطبول والعصي؟',
    correctAnswer: 'المزمار',
    acceptableAnswers: ["المزمار", "مزمار", "فن المزمار", "لعبة المزمار"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  {
    id: 'sh-080', activityId: 'saudi-heritage', category: 'الفنون الشعبية',
    question: 'ما اسم الفن المرتبط بزخرفة الجدران الداخلية في منطقة عسير؟',
    correctAnswer: 'القط العسيري',
    acceptableAnswers: ["القط العسيري", "قط العسيري", "القط", "قط عسيري", "فن القط", "النقش العسيري"],
    difficulty: 'medium', points: 1, timeLimitSeconds: 15, status: 'ACTIVE', usedCount: 0, createdAt: Date.now()
  },
  // 🗣️ 80 أسئلة تحدي اللهجات السعودية (شمال، جنوب، غرب، شرق)
  {
    id: 'nd96-dialect-1',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "مشوين"؟',
    correctAnswer: 'بعد شوي',
    acceptableAnswers: ["بعد شوي", "عقب شوي", "بعد قليل", "البعد شوي", "العقب شوي", "البعد قليل"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: بعد شوي، بعد قليل، عقب شوي',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-2',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "حلولات"؟',
    correctAnswer: 'يا ليت',
    acceptableAnswers: ["ليت", "أتمنى", "الليت", "يا ليت", "الأتمنى", "اليا ليت"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: يا ليت، ليت، أتمنى',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-3',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "اتسفت"؟',
    correctAnswer: 'ادخل',
    acceptableAnswers: ["خش", "ادخل", "الخش", "الادخل", "تعال ادخل", "التعال ادخل"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: ادخل، تعال ادخل، خش',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-4',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "ينذخ"؟',
    correctAnswer: 'يفتخر',
    acceptableAnswers: ["يفتخر", "يتبختر", "يتفاخر", "اليفتخر", "اليتبختر", "اليتفاخر"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: يفتخر، يتفاخر، يتبختر',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-5',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "قوه"؟',
    correctAnswer: 'يلا',
    acceptableAnswers: ["هيا", "يلا", "تعال", "خلنا", "الهيا", "اليلا", "التعال", "الخلنا"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: يلا، هيا، تعال، خلنا',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-6',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "اقضب"؟',
    correctAnswer: 'أمسك',
    acceptableAnswers: ["خذ", "أمسك", "الخذ", "امسكه", "الأمسك", "الامسكه", "حافظ عليه", "الحافظ عليه"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: أمسك، خذ، امسكه، حافظ عليه',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-7',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "شدوق"؟',
    correctAnswer: 'خدود',
    acceptableAnswers: ["خد", "الخد", "خدود", "وجنة", "الخدود", "الوجنة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: خدود، خد، وجنة',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-8',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "انفهتس"؟',
    correctAnswer: 'ابتعد',
    acceptableAnswers: ["وخر", "ابعد", "ابتعد", "الوخر", "تنحَّ", "الابعد", "الابتعد", "التنحَّ"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: ابتعد، ابعد، وخر، تنحَّ',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-9',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "ينود"؟',
    correctAnswer: 'ينعس',
    acceptableAnswers: ["ينعس", "الينعس", "يبي ينام", "اليبي ينام", "يجيه النوم", "اليجيه النوم"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: ينعس، يجيه النوم، يبي ينام',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-10',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "انجضع"؟',
    correctAnswer: 'تمدد',
    acceptableAnswers: ["نم", "النم", "تمدد", "انسدح", "استلقِ", "التمدد", "الانسدح", "الاستلقِ"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: تمدد، استلقِ، نم، انسدح',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-11',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "شليل"؟',
    correctAnswer: 'أسفل الثوب',
    acceptableAnswers: ["ذيل الثوب", "طرف الثوب", "أسفل الثوب", "الذيل الثوب", "الطرف الثوب", "الأسفل الثوب"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: أسفل الثوب، طرف الثوب، ذيل الثوب',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-12',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "اجف"؟',
    correctAnswer: 'سكر شوي',
    acceptableAnswers: ["سكر شوي", "أغلق شوي", "قفل جزئي", "السكر شوي", "الأغلق شوي", "القفل جزئي"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: سكر شوي، أغلق شوي، قفل جزئي',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-13',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "دنّه"؟',
    correctAnswer: 'بكى',
    acceptableAnswers: ["بكى", "ناح", "يبكي", "البكى", "الناح", "اليبكي"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: بكى، يبكي، ناح',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-14',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "ذروق"؟',
    correctAnswer: 'جبان',
    acceptableAnswers: ["جبان", "خواف", "يخاف", "الجبان", "الخواف", "اليخاف"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: جبان، خواف، يخاف',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-15',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "رزفة"؟',
    correctAnswer: 'حفلة',
    acceptableAnswers: ["حفلة", "احتفال", "الحفلة", "الاحتفال", "عرض شعبي", "العرض شعبي"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: حفلة، احتفال، عرض شعبي',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-16',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "غميضة"؟',
    correctAnswer: 'حسافة',
    acceptableAnswers: ["حسافة", "الحسافة", "يا خسارة", "يا للأسف", "اليا خسارة", "اليا للأسف"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: حسافة، يا خسارة، يا للأسف',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-17',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "قرمبع"؟',
    correctAnswer: 'خربان',
    acceptableAnswers: ["قديم", "خربان", "مهترئ", "القديم", "متهالك", "الخربان", "المهترئ", "المتهالك"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: خربان، مهترئ، متهالك، قديم',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-18',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "صلاعة"؟',
    correctAnswer: 'ترمس',
    acceptableAnswers: ["ترمس", "قهوة", "الترمس", "القهوة", "دلة الشاي", "الدلة الشاي", "إناء المشروب", "الإناء المشروب"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: ترمس، دلة الشاي/القهوة، إناء المشروب',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-19',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "وشوله"؟',
    correctAnswer: 'ليش',
    acceptableAnswers: ["ليش", "الليش", "لماذا", "اللماذا", "وش السبب", "الوش السبب"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: ليش، لماذا، وش السبب',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-20',
    activityId: 'challenge-96',
    category: 'المنطقة الشمالية',
    question: 'ما معنى هذه الكلمة: "يدوج"؟',
    correctAnswer: 'يتمشى',
    acceptableAnswers: ["يلف", "اليلف", "يتجول", "يتمشى", "يفرفر", "اليتجول", "اليتمشى", "اليفرفر"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشمالية: يتمشى، يفرفر، يلف، يتجول',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-21',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "في القرنه"؟',
    correctAnswer: 'في الزاوية',
    acceptableAnswers: ["في الركن", "الفي الركن", "في الزاوية", "الفي الزاوية", "هناك بالزاوية", "الهناك بالزاوية"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: في الزاوية، هناك بالزاوية، في الركن',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-22',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "القابلة"؟',
    correctAnswer: 'بكرة بالليل',
    acceptableAnswers: ["غدًا مساءً", "بكرة بالليل", "ليلة الجاية", "الغدًا مساءً", "البكرة بالليل", "الليلة الجاية"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: بكرة بالليل، غدًا مساءً، الليلة الجاية',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-23',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "تلايط"؟',
    correctAnswer: 'انطم',
    acceptableAnswers: ["اخرس", "اسكت", "انطم", "الاخرس", "الاسكت", "الانطم", "لا تتكلم", "اللا تتكلم"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: انطم، اسكت، اخرس، لا تتكلم',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-24',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "الوحد"؟',
    correctAnswer: 'الشيء',
    acceptableAnswers: ["شيء", "غرض", "حاجة", "الشيء", "الغرض", "الحاجة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: الشيء، الغرض، الحاجة',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-25',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "قِر"؟',
    correctAnswer: 'اهدأ',
    acceptableAnswers: ["اركد", "اهدأ", "الاركد", "الاهدأ", "خلك هادي", "الخلك هادي"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: اهدأ، اركد، خلك هادي',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-26',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "امس"؟',
    correctAnswer: 'اهدأ',
    acceptableAnswers: ["بس", "وقف", "البس", "اهدأ", "الوقف", "الاهدأ"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: اهدأ، بس، وقف',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-27',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "ضوّيت"؟',
    correctAnswer: 'رجعت',
    acceptableAnswers: ["رجعت", "رديت", "عُدت", "الرجعت", "الرديت", "العُدت"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: رجعت، عُدت، رديت',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-28',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "هاك"؟',
    correctAnswer: 'خذ',
    acceptableAnswers: ["خذ", "الخذ", "امسك", "تفضل", "الامسك", "التفضل"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: خذ، تفضل، امسك',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-29',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "يرزا"؟',
    correctAnswer: 'يضر',
    acceptableAnswers: ["يضر", "يأذي", "اليضر", "يضرّك", "اليأذي", "اليضرّك"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: يضر، يأذي، يضرّك',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-30',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "نِثِق"؟',
    correctAnswer: 'جهّز',
    acceptableAnswers: ["خلص", "جهّز", "حضّر", "الخلص", "الجهّز", "الحضّر"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: جهّز، حضّر، خلص',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-31',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "يقفر"؟',
    correctAnswer: 'يطالع',
    acceptableAnswers: ["يطالع", "يناظر", "اليطالع", "اليناظر", "يلقي نظرة", "اليلقي نظرة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: يطالع، يناظر، يلقي نظرة',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-32',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "جِهمه"؟',
    correctAnswer: 'الصباح بدري',
    acceptableAnswers: ["فجر", "الفجر", "صباح بدري", "أول الصباح", "الصباح بدري", "الأول الصباح"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: الصباح بدري، الفجر، أول الصباح',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-33',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "المح"؟',
    correctAnswer: 'انظر',
    acceptableAnswers: ["شوف", "انظر", "طالع", "الشوف", "الانظر", "الطالع"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: انظر، شوف، طالع',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-34',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "اش قومك؟"؟',
    correctAnswer: 'وش فيك؟',
    acceptableAnswers: ["وش فيك؟", "ماذا بك؟", "الوش فيك؟", "الماذا بك؟", "وش صاير لك؟", "الوش صاير لك؟"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: وش فيك؟، وش صاير لك؟، ماذا بك؟',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-35',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "اشبلاك؟"؟',
    correctAnswer: 'وش فيك؟',
    acceptableAnswers: ["وش فيك؟", "وش بلاك؟", "الوش فيك؟", "الوش بلاك؟", "وش اللي صاير لك؟", "الوش اللي صاير لك؟"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: وش فيك؟، وش بلاك؟، وش اللي صاير لك؟',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-36',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "أصّه"؟',
    correctAnswer: 'اسكت',
    acceptableAnswers: ["بس", "اسكت", "البس", "انطم", "الاسكت", "الانطم"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: اسكت، انطم، بس',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-37',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "أقْدا"؟',
    correctAnswer: 'أحسن',
    acceptableAnswers: ["أجاد", "أحسن", "ضبطها", "الأجاد", "الأحسن", "الضبطها"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: أحسن، أجاد، ضبطها',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-38',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "إحُوث"؟',
    correctAnswer: 'أسرع',
    acceptableAnswers: ["عجل", "أسرع", "العجل", "استعجل", "الأسرع", "الاستعجل"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: أسرع، استعجل، عجل',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-39',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "إستاخر"؟',
    correctAnswer: 'تنحَّ',
    acceptableAnswers: ["وخر", "ابعد", "افسح", "الوخر", "تنحَّ", "الابعد", "الافسح", "التنحَّ"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: تنحَّ، ابعد، وخر، افسح',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-40',
    activityId: 'challenge-96',
    category: 'المنطقة الجنوبية',
    question: 'ما معنى هذه الكلمة: "أم طبَق"؟',
    correctAnswer: 'سلحفاة',
    acceptableAnswers: ["سلحفاة", "السلحفاة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الجنوبية: سلحفاة، السلحفاة',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-41',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "دحين"؟',
    correctAnswer: 'الحين',
    acceptableAnswers: ["آن", "حين", "الآن", "الحين", "هالحين", "الهالحين"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: الحين، الآن، هالحين',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-42',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "فين"؟',
    correctAnswer: 'وين',
    acceptableAnswers: ["أين", "وين", "الأين", "الوين", "في أي مكان", "الفي أي مكان"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: وين، أين، في أي مكان',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-43',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "لسّه"؟',
    correctAnswer: 'باقي',
    acceptableAnswers: ["باقي", "للحين", "الباقي", "الللحين", "إلى الآن", "الإلى الآن"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: باقي، إلى الآن، للحين',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-44',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "يا واد"؟',
    correctAnswer: 'يا ولد',
    acceptableAnswers: ["يا فتى", "يا ولد", "يا رجال", "اليا فتى", "اليا ولد", "اليا رجال"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: يا ولد، يا رجال، يا فتى',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-45',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "زيح"؟',
    correctAnswer: 'وخر',
    acceptableAnswers: ["وخر", "ابعد", "الوخر", "تنحَّ", "الابعد", "التنحَّ"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: وخر، ابعد، تنحَّ',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-46',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "ذلوان"؟',
    correctAnswer: 'الآن',
    acceptableAnswers: ["آن", "حين", "الآن", "الحين", "هالحين", "الهالحين"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: الآن، الحين، هالحين',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-47',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "انشدوها"؟',
    correctAnswer: 'اسألوها',
    acceptableAnswers: ["اسألوها", "الاسألوها", "استفسروا منها", "الاستفسروا منها", "خذوا منها الخبر", "الخذوا منها الخبر"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: اسألوها، استفسروا منها، خذوا منها الخبر',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-48',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "بهواك"؟',
    correctAnswer: 'براحتك',
    acceptableAnswers: ["براحتك", "لي تبيه", "البراحتك", "على كيفك", "اللي تبيه", "العلى كيفك"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: براحتك، على كيفك، اللي تبيه',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-49',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "يوايق"؟',
    correctAnswer: 'يطالع',
    acceptableAnswers: ["يلمح", "يطالع", "يناظر", "اليلمح", "اليطالع", "اليناظر"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: يطالع، يناظر، يلمح',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-50',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "بشكه"؟',
    correctAnswer: 'جمعة',
    acceptableAnswers: ["جمعة", "الجمعة", "متجمعين", "مجتمعين", "المتجمعين", "المجتمعين"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: جمعة، مجتمعين، متجمعين',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-51',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "صرد"؟',
    correctAnswer: 'تبلل',
    acceptableAnswers: ["ابتل", "تبلل", "الابتل", "التبلل", "تشرب موية", "التشرب موية"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: تبلل، ابتل، تشرب موية',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-52',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "استيتا"؟',
    correctAnswer: 'أختي الكبيرة',
    acceptableAnswers: ["أختي الكبرى", "أختي الكبيرة", "الأختي الكبرى", "الأختي الكبيرة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: أختي الكبيرة، أختي الكبرى',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-53',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "محزق"؟',
    correctAnswer: 'ضيق',
    acceptableAnswers: ["ضيق", "ماسك", "الضيق", "الماسك", "ملزق على الجسم", "الملزق على الجسم"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: ضيق، ماسك، ملزق على الجسم',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-54',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "أندر"؟',
    correctAnswer: 'اخرج',
    acceptableAnswers: ["اخرج", "اطلع", "الاخرج", "الاطلع", "اطلع برا", "الاطلع برا"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: اخرج، اطلع، اطلع برا',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-55',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "هيكو"؟',
    correctAnswer: 'يلا',
    acceptableAnswers: ["هيا", "يلا", "الهيا", "اليلا", "خلنا نمشي", "الخلنا نمشي"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: يلا، هيا، خلنا نمشي',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-56',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "مجاغه"؟',
    correctAnswer: 'بطيء',
    acceptableAnswers: ["بطيء", "متأخر", "البطيء", "المتأخر", "ما ينجز", "الما ينجز"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: بطيء، متأخر، ما ينجز',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-57',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "حبحب"؟',
    correctAnswer: 'بطيخ',
    acceptableAnswers: ["بطيخ", "بطيخة", "البطيخ", "البطيخة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: بطيخ، بطيخة',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-58',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "سخفني"؟',
    correctAnswer: 'أحزنني',
    acceptableAnswers: ["أحزنني", "ضايقني", "الأحزنني", "الضايقني", "كسر خاطري", "الكسر خاطري"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: أحزنني، ضايقني، كسر خاطري',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-59',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "بكّاش"؟',
    correctAnswer: 'كذاب',
    acceptableAnswers: ["كذاب", "الكذاب", "ما ينصدق", "الما ينصدق", "كثير الكذب", "الكثير الكذب"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: كذاب، كثير الكذب، ما ينصدق',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-60',
    activityId: 'challenge-96',
    category: 'المنطقة الغربية',
    question: 'ما معنى هذه الكلمة: "الحدّه"؟',
    correctAnswer: 'الشارع',
    acceptableAnswers: ["برا", "خارج", "شارع", "البرا", "الخارج", "الشارع"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الغربية: الشارع، برا، الخارج',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-61',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "زرنوق"؟',
    correctAnswer: 'ممر ضيق',
    acceptableAnswers: ["ممر", "زقاق", "الممر", "الزقاق", "ممر ضيق", "الممر ضيق"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: ممر ضيق، زقاق، ممر',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-62',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "كمچة / كمشة"؟',
    correctAnswer: 'ملعقة',
    acceptableAnswers: ["معلقة", "ملعقة", "المعلقة", "الملعقة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: ملعقة، معلقة',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-63',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "شبقة"؟',
    correctAnswer: 'مضاربة',
    acceptableAnswers: ["عراك", "هوشة", "العراك", "الهوشة", "مضاربة", "المضاربة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: مضاربة، عراك، هوشة',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-64',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "نشاف"؟',
    correctAnswer: 'منديل',
    acceptableAnswers: ["منديل", "كلينكس", "المنديل", "الكلينكس", "منديل ورقي", "المنديل ورقي"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: منديل، كلينكس، منديل ورقي',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-65',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "مطنقّر"؟',
    correctAnswer: 'زعلان',
    acceptableAnswers: ["مكشر", "زعلان", "المكشر", "متضايق", "الزعلان", "المتضايق"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: زعلان، مكشر، متضايق',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-66',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "مهفتج"؟',
    correctAnswer: 'مستعجل',
    acceptableAnswers: ["مرجوج", "ملخبط", "مندفع", "مستعجل", "المرجوج", "الملخبط", "المندفع", "المستعجل"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: مستعجل، مندفع، مرجوج، ملخبط',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-67',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "طرطور"؟',
    correctAnswer: 'ضعيف شخصية',
    acceptableAnswers: ["تابع", "التابع", "ضعيف شخصية", "ما له كلمة", "الضعيف شخصية", "الما له كلمة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: ضعيف شخصية، تابع، ما له كلمة',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-68',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "غناتي"؟',
    correctAnswer: 'حبيبتي',
    acceptableAnswers: ["حبيبتي", "عزيزتي", "الحبيبتي", "العزيزتي", "يا غالية", "اليا غالية"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: حبيبتي، عزيزتي، يا غالية',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-69',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "ولاويه"؟',
    correctAnswer: 'ليش',
    acceptableAnswers: ["ليش", "الليش", "لماذا", "اللماذا", "وش السبب", "الوش السبب"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: ليش، لماذا، وش السبب',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-70',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "جرفلي"؟',
    correctAnswer: 'ملخبط',
    acceptableAnswers: ["ملخبط", "الملخبط", "غير مرتب", "الغير مرتب", "شكله مو حلو", "الشكله مو حلو"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: ملخبط، غير مرتب، شكله مو حلو',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-71',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "معصقل"؟',
    correctAnswer: 'نحيف',
    acceptableAnswers: ["نحيف", "هزيل", "النحيف", "الهزيل", "ضعيف البنية", "الضعيف البنية"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: نحيف، هزيل، ضعيف البنية',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-72',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "هبابه"؟',
    correctAnswer: 'شوي',
    acceptableAnswers: ["شوي", "قليل", "الشوي", "القليل", "مقدار بسيط", "المقدار بسيط"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: شوي، قليل، مقدار بسيط',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-73',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "غميضة"؟',
    correctAnswer: 'حسافة',
    acceptableAnswers: ["حسافة", "الحسافة", "يا خسارة", "يا للأسف", "اليا خسارة", "اليا للأسف"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: حسافة، يا خسارة، يا للأسف',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-74',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "زغطة"؟',
    correctAnswer: 'حازوقة',
    acceptableAnswers: ["فواق", "الفواق", "حازوقة", "الحازوقة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: حازوقة، فواق',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-75',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "زتت"؟',
    correctAnswer: 'أسرع',
    acceptableAnswers: ["عجل", "أسرع", "العجل", "استعجل", "الأسرع", "الاستعجل"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: أسرع، استعجل، عجل',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-76',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "بعفاق"؟',
    correctAnswer: 'حازوقة',
    acceptableAnswers: ["فواق", "الفواق", "حازوقة", "الحازوقة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: حازوقة، فواق',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-77',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "مقحام"؟',
    correctAnswer: 'قفل الباب',
    acceptableAnswers: ["مزلاج", "المزلاج", "قفل الباب", "سكرة الباب", "القفل الباب", "السكرة الباب"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: قفل الباب، مزلاج، سكرة الباب',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-78',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "رچية"؟',
    correctAnswer: 'بالوعة',
    acceptableAnswers: ["مصرف", "المصرف", "بالوعة", "البالوعة", "مجرى التصريف", "المجرى التصريف"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: بالوعة، مصرف، مجرى التصريف',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-79',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "ماصخ"؟',
    correctAnswer: 'بدون ملح',
    acceptableAnswers: ["بدون ملح", "البدون ملح", "قليل الملح", "ما فيه طعم", "القليل الملح", "الما فيه طعم"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: بدون ملح، قليل الملح، ما فيه طعم',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },
  {
    id: 'nd96-dialect-80',
    activityId: 'challenge-96',
    category: 'المنطقة الشرقية',
    question: 'ما معنى هذه الكلمة: "وايد"؟',
    correctAnswer: 'كثير',
    acceptableAnswers: ["كثير", "الكثير", "مرة كثير", "المرة كثير", "بكمية كبيرة", "البكمية كبيرة"],
    difficulty: 'medium',
    points: 1,
    timeLimitSeconds: 15,
    explanation: 'المعنى في المنطقة الشرقية: كثير، مرة كثير، بكمية كبيرة',
    status: 'ACTIVE',
    usedCount: 0,
    createdAt: Date.now()
  },

];

/**
 * Filter questions by National Day Activity ID
 */
export function getNationalDayQuestionsByActivity(activityId: string): NationalDayQuestion[] {
  return NATIONAL_DAY_96_BANK.filter(q => q.activityId === activityId && q.status === 'ACTIVE');
}

/**
 * Helper to normalize Arabic / English numbers & letters for accurate live chat scoring
 */
export function normalizeNationalDayAnswer(raw: string): string {
  if (!raw) return '';
  
  // Convert Eastern Arabic numerals to standard Western digits
  const easternToArabicNumerals: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };

  let str = raw.trim().toLowerCase();
  str = str.replace(/[٠-٩]/g, (char) => easternToArabicNumerals[char] || char);

  // Normalize Arabic letters
  str = str
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '') // Remove tashkeel
    .replace(/[^\w\s\d\u0600-\u06FF]/gi, '') // Remove punctuation
    .replace(/\s+/g, ' ');

  return str.trim();
}

/**
 * Robust Smart Answer Matcher for National Day Chat Responses
 * Uses the platform-wide advanced fuzzy and segment normalization engine
 */
export function isNationalDayAnswerMatch(userComment: string, question: NationalDayQuestion): boolean {
  if (!userComment || !question) return false;

  // 1. Direct number match
  if (question.numberAnswer !== undefined) {
    const normUser = normalizeNationalDayAnswer(userComment);
    const numRegex = new RegExp(`\\b${question.numberAnswer}\\b`);
    if (numRegex.test(normUser) || normUser === String(question.numberAnswer)) {
      return true;
    }
  }

  const acceptable = question.acceptableAnswers && question.acceptableAnswers.length > 0
    ? question.acceptableAnswers
    : [question.correctAnswer];

  // 2. Advanced site-wide smart matcher from @aep/game-engines
  if (isAnswerMatch(userComment, acceptable)) {
    return true;
  }

  // 3. Normalized containment fallback
  const normUser = normalizeNationalDayAnswer(userComment);
  for (const acc of acceptable) {
    const normAcc = normalizeNationalDayAnswer(acc);
    if (!normAcc) continue;
    if (normUser === normAcc || (normAcc.length >= 3 && normUser.includes(normAcc))) {
      return true;
    }
  }

  return false;
}
