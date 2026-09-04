import { CapitalsQuestion } from '@aep/types';

/**
 * ══════════════════════════════════════════════════════════════
 * 🏛️ WORLD CAPITALS DATABASE — بنك أسئلة عواصم دول العالم
 * ══════════════════════════════════════════════════════════════
 * أسئلة عواصم لكافة الدول الكبرى والعربية مع التعرف الذكي:
 * - يدعم العواصم الإدارية والاقتصادية والتشريعية المتعددة.
 * - يدعم كتابات بديلة بالحروف والهمزات وبدون "الـ".
 */

export interface CapitalEntry {
  id: string;
  country: string;
  countryAliases: string[];
  capitals: string[];
  acceptableAnswers: string[];
  flagCode: string;
  continent: string;
  notes?: string;
}

export const CAPITALS_DATA: CapitalEntry[] = [
  // ── 1. العالم العربي (ALL ARAB COUNTRIES) ──
  {
    id: 'cap-sa',
    country: 'المملكة العربية السعودية',
    countryAliases: ['السعودية', 'سعودية', 'المملكه العربيه السعوديه'],
    capitals: ['الرياض'],
    acceptableAnswers: ['الرياض', 'رياض', 'riyadh'],
    flagCode: 'sa',
    continent: 'آسيا'
  },
  {
    id: 'cap-eg',
    country: 'جمهورية مصر العربية',
    countryAliases: ['مصر', 'جمهوريه مصر العربيه'],
    capitals: ['القاهرة', 'العاصمة الإدارية الجديدة'],
    acceptableAnswers: ['القاهرة', 'القاهره', 'قاهرة', 'قاهره', 'العاصمة الإدارية', 'العاصمة الادارية', 'العاصمه الاداريه', 'cairo'],
    flagCode: 'eg',
    continent: 'أفريقيا',
    notes: 'القاهرة هي العاصمة التاريخية، والعاصمة الإدارية الجديدة'
  },
  {
    id: 'cap-ae',
    country: 'الإمارات العربية المتحدة',
    countryAliases: ['الإمارات', 'الامارات', 'دولة الإمارات'],
    capitals: ['أبوظبي', 'دبي'],
    acceptableAnswers: ['أبوظبي', 'ابوظبي', 'أبو ظبي', 'ابو ظبي', 'دبي', 'abudhabi', 'abu dhabi', 'dubai'],
    flagCode: 'ae',
    continent: 'آسيا',
    notes: 'أبوظبي العاصمة الاتحادية، ودبي العاصمة الاقتصادية'
  },
  {
    id: 'cap-kw',
    country: 'دولة الكويت',
    countryAliases: ['الكويت', 'كويت'],
    capitals: ['مدينة الكويت'],
    acceptableAnswers: ['الكويت', 'كويت', 'مدينة الكويت', 'مدينه الكويت', 'kuwait', 'kuwait city'],
    flagCode: 'kw',
    continent: 'آسيا'
  },
  {
    id: 'cap-qa',
    country: 'دولة قطر',
    countryAliases: ['قطر'],
    capitals: ['الدوحة'],
    acceptableAnswers: ['الدوحة', 'الدوحه', 'دوحة', 'دوحه', 'doha'],
    flagCode: 'qa',
    continent: 'آسيا'
  },
  {
    id: 'cap-bh',
    country: 'مملكة البحرين',
    countryAliases: ['البحرين', 'بحرين'],
    capitals: ['المنامة'],
    acceptableAnswers: ['المنامة', 'المنامه', 'منامة', 'منامه', 'manama'],
    flagCode: 'bh',
    continent: 'آسيا'
  },
  {
    id: 'cap-om',
    country: 'سلطنة عمان',
    countryAliases: ['عمان', 'سلطنة عُمان', 'عُمان'],
    capitals: ['مسقط'],
    acceptableAnswers: ['مسقط', 'muscat'],
    flagCode: 'om',
    continent: 'آسيا'
  },
  {
    id: 'cap-jo',
    country: 'المملكة الأردنية الهاشمية',
    countryAliases: ['الأردن', 'الاردن', 'أردن', 'اردن'],
    capitals: ['عمان'],
    acceptableAnswers: ['عمان', 'عمّان', 'amman'],
    flagCode: 'jo',
    continent: 'آسيا'
  },
  {
    id: 'cap-iq',
    country: 'جمهورية العراق',
    countryAliases: ['العراق', 'عراق'],
    capitals: ['بغداد'],
    acceptableAnswers: ['بغداد', 'baghdad'],
    flagCode: 'iq',
    continent: 'آسيا'
  },
  {
    id: 'cap-sy',
    country: 'الجمهورية العربية السورية',
    countryAliases: ['سوريا', 'سورية'],
    capitals: ['دمشق'],
    acceptableAnswers: ['دمشق', 'الشام', 'damascus'],
    flagCode: 'sy',
    continent: 'آسيا'
  },
  {
    id: 'cap-lb',
    country: 'الجمهورية اللبنانية',
    countryAliases: ['لبنان'],
    capitals: ['بيروت'],
    acceptableAnswers: ['بيروت', 'beirut'],
    flagCode: 'lb',
    continent: 'آسيا'
  },
  {
    id: 'cap-ps',
    country: 'دولة فلسطين',
    countryAliases: ['فلسطين'],
    capitals: ['القدس الشريف'],
    acceptableAnswers: ['القدس', 'القدس الشريف', 'قدس', 'jerusalem'],
    flagCode: 'ps',
    continent: 'آسيا'
  },
  {
    id: 'cap-ye',
    country: 'الجمهورية اليمنية',
    countryAliases: ['اليمن', 'يمن'],
    capitals: ['صنعاء', 'عدن'],
    acceptableAnswers: ['صنعاء', 'صنعا', 'عدن', 'sanaa', 'aden'],
    flagCode: 'ye',
    continent: 'آسيا',
    notes: 'صنعاء العاصمة الدستورية، وعدن العاصمة المؤقتة'
  },
  {
    id: 'cap-sd',
    country: 'جمهورية السودان',
    countryAliases: ['السودان', 'سودان'],
    capitals: ['الخرطوم', 'بورتسودان'],
    acceptableAnswers: ['الخرطوم', 'خرطوم', 'بورتسودان', 'بورت سودان', 'khartoum', 'port sudan'],
    flagCode: 'sd',
    continent: 'أفريقيا',
    notes: 'الخرطوم العاصمة الرسمية، وبورتسودان المقر الإداري الحالي'
  },
  {
    id: 'cap-ma',
    country: 'المملكة المغربية',
    countryAliases: ['المغرب', 'مغرب'],
    capitals: ['الرباط', 'الدار البيضاء'],
    acceptableAnswers: ['الرباط', 'رباط', 'الدار البيضاء', 'الدار البيضا', 'كازابلانكا', 'rabat', 'casablanca'],
    flagCode: 'ma',
    continent: 'أفريقيا',
    notes: 'الرباط العاصمة السياسية، والدار البيضاء العاصمة الاقتصادية'
  },
  {
    id: 'cap-dz',
    country: 'الجمهورية الجزائرية',
    countryAliases: ['الجزائر', 'جزائر'],
    capitals: ['الجزائر'],
    acceptableAnswers: ['الجزائر', 'مدينة الجزائر', 'جزائر', 'algiers'],
    flagCode: 'dz',
    continent: 'أفريقيا'
  },
  {
    id: 'cap-tn',
    country: 'الجمهورية التونسية',
    countryAliases: ['تونس'],
    capitals: ['تونس'],
    acceptableAnswers: ['تونس', 'مدينة تونس', 'tunis'],
    flagCode: 'tn',
    continent: 'أفريقيا'
  },
  {
    id: 'cap-ly',
    country: 'دولة ليبيا',
    countryAliases: ['ليبيا'],
    capitals: ['طرابلس', 'بنغازي'],
    acceptableAnswers: ['طرابلس', 'طرابلس الغرب', 'بنغازي', 'tripoli', 'benghazi'],
    flagCode: 'ly',
    continent: 'أفريقيا',
    notes: 'طرابلس العاصمة، وبنغازي العاصمة الاقتصادية والثانية'
  },
  {
    id: 'cap-mr',
    country: 'الجمهورية الإسلامية الموريتانية',
    countryAliases: ['موريتانيا', 'موريتانيا'],
    capitals: ['نواكشوط'],
    acceptableAnswers: ['نواكشوط', 'انواكشوط', 'nouakchott'],
    flagCode: 'mr',
    continent: 'أفريقيا'
  },
  {
    id: 'cap-so',
    country: 'جمهورية الصومال',
    countryAliases: ['الصومال', 'صومال'],
    capitals: ['مقديشو'],
    acceptableAnswers: ['مقديشو', 'مقديشيو', 'mogadishu'],
    flagCode: 'so',
    continent: 'أفريقيا'
  },
  {
    id: 'cap-dj',
    country: 'جمهورية جيبوتي',
    countryAliases: ['جيبوتي'],
    capitals: ['مدينة جيبوتي'],
    acceptableAnswers: ['جيبوتي', 'مدينة جيبوتي', 'djibouti'],
    flagCode: 'dj',
    continent: 'أفريقيا'
  },
  {
    id: 'cap-km',
    country: 'جمهورية جزر القمر',
    countryAliases: ['جزر القمر'],
    capitals: ['موروني'],
    acceptableAnswers: ['موروني', 'moroni'],
    flagCode: 'km',
    continent: 'أفريقيا'
  },

  // ── 2. الدول الكبرى وقارات العالم (MAJOR WORLD POWERS) ──
  {
    id: 'cap-us',
    country: 'الولايات المتحدة الأمريكية',
    countryAliases: ['أمريكا', 'امريكا', 'الولايات المتحدة', 'اميركا'],
    capitals: ['واشنطن العاصمة', 'نيويورك'],
    acceptableAnswers: ['واشنطن', 'واشنطن دي سي', 'واشنطن العاصمة', 'نيويورك', 'washington', 'washington dc', 'new york'],
    flagCode: 'us',
    continent: 'أمريكا الشمالية',
    notes: 'واشنطن العاصمة الفيدرالية، ونيويورك العاصمة الاقتصادية'
  },
  {
    id: 'cap-gb',
    country: 'المملكة المتحدة (بريطانيا)',
    countryAliases: ['بريطانيا', 'المملكة المتحدة', 'انجلترا', 'إنجلترا'],
    capitals: ['لندن'],
    acceptableAnswers: ['لندن', 'london'],
    flagCode: 'gb',
    continent: 'أوروبا'
  },
  {
    id: 'cap-fr',
    country: 'فرنسا',
    countryAliases: ['الجمهورية الفرنسية'],
    capitals: ['باريس'],
    acceptableAnswers: ['باريس', 'paris'],
    flagCode: 'fr',
    continent: 'أوروبا'
  },
  {
    id: 'cap-de',
    country: 'ألمانيا',
    countryAliases: ['المانيا', 'جمهورية ألمانيا الاتحادية'],
    capitals: ['برلين', 'فرانكفورت'],
    acceptableAnswers: ['برلين', 'فرانكفورت', 'berlin', 'frankfurt'],
    flagCode: 'de',
    continent: 'أوروبا',
    notes: 'برلين العاصمة السياسية، وفرانكفورت العاصمة المالية'
  },
  {
    id: 'cap-it',
    country: 'إيطاليا',
    countryAliases: ['ايطاليا'],
    capitals: ['روما', 'ميلانو'],
    acceptableAnswers: ['روما', 'ميلانو', 'ميلان', 'rome', 'milan'],
    flagCode: 'it',
    continent: 'أوروبا',
    notes: 'روما العاصمة الرسمية، وميلانو العاصمة الاقتصادية والموضة'
  },
  {
    id: 'cap-es',
    country: 'إسبانيا',
    countryAliases: ['اسبانيا', 'مملكة إسبانيا'],
    capitals: ['مدريد', 'برشلونة'],
    acceptableAnswers: ['مدريد', 'برشلونة', 'برشلونه', 'madrid', 'barcelona'],
    flagCode: 'es',
    continent: 'أوروبا'
  },
  {
    id: 'cap-ru',
    country: 'روسيا الاتحادية',
    countryAliases: ['روسيا'],
    capitals: ['موسكو', 'سانت بطرسبرغ'],
    acceptableAnswers: ['موسكو', 'سانت بطرسبرغ', 'سانت بطرسبورغ', 'بطرسبرغ', 'moscow', 'saint petersburg'],
    flagCode: 'ru',
    continent: 'أوروبا / آسيا',
    notes: 'موسكو العاصمة الرسمية، وسانت بطرسبرغ العاصمة الشمالية والتاريخية'
  },
  {
    id: 'cap-cn',
    country: 'جمهورية الصين الشعبية',
    countryAliases: ['الصين', 'صين'],
    capitals: ['بكين', 'شنغهاي'],
    acceptableAnswers: ['بكين', 'بيجين', 'شنغهاي', 'شانغهاي', 'beijing', 'shanghai'],
    flagCode: 'cn',
    continent: 'آسيا',
    notes: 'بكين العاصمة السياسية، وشنغهاي العاصمة الاقتصادية'
  },
  {
    id: 'cap-jp',
    country: 'اليابان',
    countryAliases: ['دولة اليابان'],
    capitals: ['طوكيو'],
    acceptableAnswers: ['طوكيو', 'tokyo'],
    flagCode: 'jp',
    continent: 'آسيا'
  },
  {
    id: 'cap-kr',
    country: 'كوريا الجنوبية',
    countryAliases: ['كوريا', 'جنوب كوريا'],
    capitals: ['سيول'],
    acceptableAnswers: ['سيول', 'سول', 'seoul'],
    flagCode: 'kr',
    continent: 'آسيا'
  },
  {
    id: 'cap-kp',
    country: 'كوريا الشمالية',
    countryAliases: ['شمال كوريا'],
    capitals: ['بيونغ يانغ'],
    acceptableAnswers: ['بيونغ يانغ', 'بيونغيانغ', 'بيونجيانج', 'pyongyang'],
    flagCode: 'kp',
    continent: 'آسيا'
  },
  {
    id: 'cap-in',
    country: 'جمهورية الهند',
    countryAliases: ['الهند', 'هند'],
    capitals: ['نيودلهي', 'مومباي'],
    acceptableAnswers: ['نيودلهي', 'دلهي', 'نيو دلهي', 'مومباي', 'بومباي', 'new delhi', 'delhi', 'mumbai'],
    flagCode: 'in',
    continent: 'آسيا',
    notes: 'نيودلهي العاصمة الرسمية، ومومباي العاصمة المالية والسينمائية'
  },
  {
    id: 'cap-pk',
    country: 'جمهورية باكستان الإسلامية',
    countryAliases: ['باكستان'],
    capitals: ['إسلام أباد', 'كراتشي'],
    acceptableAnswers: ['إسلام أباد', 'اسلام اباد', 'إسلام آباد', 'اسلام آباد', 'كراتشي', 'islamabad', 'karachi'],
    flagCode: 'pk',
    continent: 'آسيا',
    notes: 'إسلام أباد العاصمة الاتحادية، وكراتشي العاصمة الاقتصادية السابقة'
  },
  {
    id: 'cap-tr',
    country: 'الجمهورية التركية',
    countryAliases: ['تركيا'],
    capitals: ['أنقرة', 'إسطنبول'],
    acceptableAnswers: ['أنقرة', 'انقرة', 'أنقره', 'انقره', 'إسطنبول', 'اسطنبول', 'استانبول', 'ankara', 'istanbul'],
    flagCode: 'tr',
    continent: 'آسيا / أوروبا',
    notes: 'أنقرة العاصمة السياسية، وإسطنبول العاصمة التاريخية والاقتصادية الكبرى'
  },
  {
    id: 'cap-br',
    country: 'جمهورية البرازيل الاتحادية',
    countryAliases: ['البرازيل', 'برازيل'],
    capitals: ['برازيليا', 'ريو دي جانيرو', 'ساو باولو'],
    acceptableAnswers: ['برازيليا', 'برازيليا', 'ريو دي جانيرو', 'ريو', 'ساو باولو', 'brasilia', 'rio de janeiro', 'sao paulo'],
    flagCode: 'br',
    continent: 'أمريكا الجنوبية',
    notes: 'برازيليا العاصمة الفيدرالية، وريو العاصمة القديمة، وساو باولو الاقتصادية'
  },
  {
    id: 'cap-ca',
    country: 'كندا',
    countryAliases: ['دولة كندا'],
    capitals: ['أوتاوا', 'تورونتو', 'مونتريال'],
    acceptableAnswers: ['أوتاوا', 'اوتاوا', 'تورونتو', 'تورنتو', 'مونتريال', 'ottawa', 'toronto', 'montreal'],
    flagCode: 'ca',
    continent: 'أمريكا الشمالية',
    notes: 'أوتاوا العاصمة الفيدرالية، وتورونتو العاصمة الاقتصادية'
  },
  {
    id: 'cap-au',
    country: 'أستراليا',
    countryAliases: ['استراليا'],
    capitals: ['كانبرا', 'سيدني', 'ملبورن'],
    acceptableAnswers: ['كانبرا', 'كانبيرا', 'سيدني', 'ملبورن', 'canberra', 'sydney', 'melbourne'],
    flagCode: 'au',
    continent: 'أوقيانوسيا',
    notes: 'كانبرا العاصمة الوطنية، وسيدني وملبورن المدينتان الأكبر'
  },
  {
    id: 'cap-ar',
    country: 'الأرجنتين',
    countryAliases: ['الارجنتين', 'أرجنتين'],
    capitals: ['بوينس آيرس'],
    acceptableAnswers: ['بوينس آيرس', 'بوينس ايرس', 'بوينس ايريس', 'buenos aires'],
    flagCode: 'ar',
    continent: 'أمريكا الجنوبية'
  },
  {
    id: 'cap-mx',
    country: 'الولايات المكسيكية المتحدة',
    countryAliases: ['المكسيك', 'مكسيك'],
    capitals: ['مكسيكو سيتي'],
    acceptableAnswers: ['مكسيكو سيتي', 'مدينة المكسيك', 'مكسيكو', 'mexico city'],
    flagCode: 'mx',
    continent: 'أمريكا الشمالية'
  },
  {
    id: 'cap-id',
    country: 'جمهورية إندونيسيا',
    countryAliases: ['إندونيسيا', 'اندونيسيا'],
    capitals: ['جاكرتا', 'نوسانتارا'],
    acceptableAnswers: ['جاكرتا', 'نوسانتارا', 'jakarta', 'nusantara'],
    flagCode: 'id',
    continent: 'آسيا',
    notes: 'جاكرتا العاصمة التاريخية، ونوسانتارا العاصمة المستقبلية الجديدة'
  },
  {
    id: 'cap-my',
    country: 'ماليزيا',
    countryAliases: ['اتحاد ماليزيا'],
    capitals: ['كوالالمبور', 'بوتراجايا'],
    acceptableAnswers: ['كوالالمبور', 'كوالا لمبور', 'بوتراجايا', 'بوتراجايا', 'kuala lumpur', 'putrajaya'],
    flagCode: 'my',
    continent: 'آسيا',
    notes: 'كوالالمبور العاصمة الملكية والاقتصادية، وبوتراجايا المقر الإداري للحكومة'
  },
  {
    id: 'cap-ir',
    country: 'الجمهورية الإسلامية الإيرانية',
    countryAliases: ['إيران', 'ايران'],
    capitals: ['طهران'],
    acceptableAnswers: ['طهران', 'tehran'],
    flagCode: 'ir',
    continent: 'آسيا'
  },
  {
    id: 'cap-za',
    country: 'جمهورية جنوب أفريقيا',
    countryAliases: ['جنوب أفريقيا', 'جنوب افريقيا'],
    capitals: ['بريتوريا', 'كيب تاون', 'بلومفونتين', 'جوهانسبرغ'],
    acceptableAnswers: ['بريتوريا', 'كيب تاون', 'كيبتاون', 'بلومفونتين', 'جوهانسبرغ', 'جوهانسبورغ', 'pretoria', 'cape town', 'bloemfontein', 'johannesburg'],
    flagCode: 'za',
    continent: 'أفريقيا',
    notes: 'بريتوريا (التنفيذية)، كيب تاون (التشريعية)، بلومفونتين (القضائية)، وجوهانسبرغ (الاقتصادية)'
  },
  {
    id: 'cap-nl',
    country: 'مملكة هولندا',
    countryAliases: ['هولندا'],
    capitals: ['أمستردام', 'لاهاي'],
    acceptableAnswers: ['أمستردام', 'امستردام', 'لاهاي', 'لا هاى', 'amsterdam', 'the hague', 'den haag'],
    flagCode: 'nl',
    continent: 'أوروبا',
    notes: 'أمستردام العاصمة الدستورية، ولاهاي مقر الحكومة والبرلمان والملك'
  },
  {
    id: 'cap-ch',
    country: 'سويسرا',
    countryAliases: ['الاتحاد السويسري'],
    capitals: ['برن', 'جنيف', 'زيورخ'],
    acceptableAnswers: ['برن', 'جنيف', 'زيورخ', 'bern', 'geneva', 'zurich'],
    flagCode: 'ch',
    continent: 'أوروبا',
    notes: 'برن العاصمة الفيدرالية الفعلية، وزيورخ العاصمة المالية، وجنيف الدولية'
  },
  {
    id: 'cap-se',
    country: 'السويد',
    countryAliases: ['مملكة السويد'],
    capitals: ['ستوكهولم'],
    acceptableAnswers: ['ستوكهولم', 'ستوكهلم', 'stockholm'],
    flagCode: 'se',
    continent: 'أوروبا'
  },
  {
    id: 'cap-no',
    country: 'النرويج',
    countryAliases: ['مملكة النرويج'],
    capitals: ['أوسلو'],
    acceptableAnswers: ['أوسلو', 'اوسلو', 'oslo'],
    flagCode: 'no',
    continent: 'أوروبا'
  },
  {
    id: 'cap-dk',
    country: 'الدنمارك',
    countryAliases: ['مملكة الدنمارك'],
    capitals: ['كوبنهاغن'],
    acceptableAnswers: ['كوبنهاغن', 'كوبنهاجن', 'كوبنهاقن', 'copenhagen'],
    flagCode: 'dk',
    continent: 'أوروبا'
  },
  {
    id: 'cap-be',
    country: 'بلجيكا',
    countryAliases: ['مملكة بلجيكا'],
    capitals: ['بروكسل'],
    acceptableAnswers: ['بروكسل', 'بروكسيل', 'brussels'],
    flagCode: 'be',
    continent: 'أوروبا'
  },
  {
    id: 'cap-at',
    country: 'النمسا',
    countryAliases: ['جمهورية النمسا'],
    capitals: ['فيينا'],
    acceptableAnswers: ['فيينا', 'فينا', 'vienna'],
    flagCode: 'at',
    continent: 'أوروبا'
  },
  {
    id: 'cap-pt',
    country: 'البرتغال',
    countryAliases: ['الجمهورية البرتغالية'],
    capitals: ['لشبونة'],
    acceptableAnswers: ['لشبونة', 'لشبونه', 'lisbon'],
    flagCode: 'pt',
    continent: 'أوروبا'
  },
  {
    id: 'cap-gr',
    country: 'اليونان',
    countryAliases: ['الجمهورية الهيلينية'],
    capitals: ['أثينا'],
    acceptableAnswers: ['أثينا', 'اثينا', 'athens'],
    flagCode: 'gr',
    continent: 'أوروبا'
  },
  {
    id: 'cap-pl',
    country: 'بولندا',
    countryAliases: ['جمهورية بولندا'],
    capitals: ['وارسو'],
    acceptableAnswers: ['وارسو', 'وارسو', 'warsaw'],
    flagCode: 'pl',
    continent: 'أوروبا'
  },
  {
    id: 'cap-ua',
    country: 'أوكرانيا',
    countryAliases: ['اوكرانيا'],
    capitals: ['كييف'],
    acceptableAnswers: ['كييف', 'kyiv', 'kiev'],
    flagCode: 'ua',
    continent: 'أوروبا'
  },
  {
    id: 'cap-th',
    country: 'تايلاند',
    countryAliases: ['مملكة تايلاند'],
    capitals: ['بانكوك'],
    acceptableAnswers: ['بانكوك', 'bangkok'],
    flagCode: 'th',
    continent: 'آسيا'
  },
  {
    id: 'cap-vn',
    country: 'فيتنام',
    countryAliases: ['جمهورية فيتنام'],
    capitals: ['هانوي', 'هو تشي منه'],
    acceptableAnswers: ['هانوي', 'هو تشي منه', 'hanoi', 'ho chi minh'],
    flagCode: 'vn',
    continent: 'آسيا'
  },
  {
    id: 'cap-ph',
    country: 'الفلبين',
    countryAliases: ['جمهورية الفلبين'],
    capitals: ['مانيلا'],
    acceptableAnswers: ['مانيلا', 'manila'],
    flagCode: 'ph',
    continent: 'آسيا'
  },
  {
    id: 'cap-ng',
    country: 'نيجيريا',
    countryAliases: ['جمهورية نيجيريا الاتحادية'],
    capitals: ['أبوجا', 'لاغوس'],
    acceptableAnswers: ['أبوجا', 'ابوجا', 'لاغوس', 'لاجوس', 'abuja', 'lagos'],
    flagCode: 'ng',
    continent: 'أفريقيا',
    notes: 'أبوجا العاصمة الرسمية، ولاغوس العاصمة الاقتصادية والسابقة'
  },
  {
    id: 'cap-et',
    country: 'إثيوبيا',
    countryAliases: ['اثيوبيا', 'جمهورية إثيوبيا'],
    capitals: ['أديس أبابا'],
    acceptableAnswers: ['أديس أبابا', 'اديس ابابا', 'اديس أبابا', 'addis ababa'],
    flagCode: 'et',
    continent: 'أفريقيا'
  },
  {
    id: 'cap-ke',
    country: 'كينيا',
    countryAliases: ['جمهورية كينيا'],
    capitals: ['نيروبي'],
    acceptableAnswers: ['نيروبي', 'nairobi'],
    flagCode: 'ke',
    continent: 'أفريقيا'
  },
  {
    id: 'cap-gh',
    country: 'غانا',
    countryAliases: ['جمهورية غانا'],
    capitals: ['أكرا'],
    acceptableAnswers: ['أكرا', 'اكرا', 'accra'],
    flagCode: 'gh',
    continent: 'أفريقيا'
  },
  {
    id: 'cap-ci',
    country: 'كوت ديفوار (ساحل العاج)',
    countryAliases: ['ساحل العاج', 'كوت ديفوار'],
    capitals: ['ياموسوكرو', 'أبيدجان'],
    acceptableAnswers: ['ياموسوكرو', 'أبيدجان', 'ابيدجان', 'yamoussoukro', 'abidjan'],
    flagCode: 'ci',
    continent: 'أفريقيا',
    notes: 'ياموسوكرو العاصمة السياسية، وأبيدجان العاصمة الاقتصادية والمقر الحكومي'
  },
  {
    id: 'cap-tz',
    country: 'تنزانيا',
    countryAliases: ['جمهورية تنزانيا الاتحادية'],
    capitals: ['دودوما', 'دار السلام'],
    acceptableAnswers: ['دودوما', 'دار السلام', 'دارالسلام', 'dodoma', 'dar es salaam'],
    flagCode: 'tz',
    continent: 'أفريقيا',
    notes: 'دودوما العاصمة التشريعية، ودار السلام العاصمة الاقتصادية والتاريخية'
  },
  {
    id: 'cap-sn',
    country: 'السنغال',
    countryAliases: ['جمهورية السنغال'],
    capitals: ['داكار'],
    acceptableAnswers: ['داكار', 'دكار', 'dakar'],
    flagCode: 'sn',
    continent: 'أفريقيا'
  },
  {
    id: 'cap-co',
    country: 'كولومبيا',
    countryAliases: ['جمهورية كولومبيا'],
    capitals: ['بوغوتا'],
    acceptableAnswers: ['بوغوتا', 'بوجوتا', 'bogota'],
    flagCode: 'co',
    continent: 'أمريكا الجنوبية'
  },
  {
    id: 'cap-cl',
    country: 'تشيلي',
    countryAliases: ['جمهورية تشيلي'],
    capitals: ['سانتياغو'],
    acceptableAnswers: ['سانتياغو', 'سانتياجو', 'santiago'],
    flagCode: 'cl',
    continent: 'أمريكا الجنوبية'
  },
  {
    id: 'cap-pe',
    country: 'بيرو',
    countryAliases: ['جمهورية بيرو'],
    capitals: ['ليما'],
    acceptableAnswers: ['ليما', 'lima'],
    flagCode: 'pe',
    continent: 'أمريكا الجنوبية'
  },
  {
    id: 'cap-ve',
    country: 'فنزويلا',
    countryAliases: ['جمهورية فنزويلا البوليفارية'],
    capitals: ['كاراكاس'],
    acceptableAnswers: ['كاراكاس', 'كراكاس', 'caracas'],
    flagCode: 've',
    continent: 'أمريكا الجنوبية'
  },
  {
    id: 'cap-bo',
    country: 'بوليفيا',
    countryAliases: ['دولة بوليفيا'],
    capitals: ['سوكري', 'لا باز'],
    acceptableAnswers: ['سوكري', 'لا باز', 'لاباز', 'sucre', 'la paz'],
    flagCode: 'bo',
    continent: 'أمريكا الجنوبية',
    notes: 'سوكري العاصمة الدستورية والقضائية، ولاباز مقر الحكومة والبرلمان'
  },
  {
    id: 'cap-kz',
    country: 'كازاخستان',
    countryAliases: ['جمهورية كازاخستان'],
    capitals: ['أستانا', 'ألماتي'],
    acceptableAnswers: ['أستانا', 'استانا', 'نور سلطان', 'نورسلطان', 'ألماتي', 'الماتي', 'astana', 'almaty'],
    flagCode: 'kz',
    continent: 'آسيا',
    notes: 'أستانا العاصمة الرسمية، وألماتي العاصمة الاقتصادية والسابقة'
  },
  {
    id: 'cap-uz',
    country: 'أوزبكستان',
    countryAliases: ['اوزبكستان'],
    capitals: ['طشقند'],
    acceptableAnswers: ['طشقند', 'tashkent'],
    flagCode: 'uz',
    continent: 'آسيا'
  },
  {
    id: 'cap-az',
    country: 'أذربيجان',
    countryAliases: ['اذربيجان'],
    capitals: ['باكو'],
    acceptableAnswers: ['باكو', 'baku'],
    flagCode: 'az',
    continent: 'آسيا'
  },
  {
    id: 'cap-ge',
    country: 'جورجيا',
    countryAliases: ['دولة جورجيا'],
    capitals: ['تبليسي'],
    acceptableAnswers: ['تبليسي', 'tbilisi'],
    flagCode: 'ge',
    continent: 'أوروبا / آسيا'
  },
  {
    id: 'cap-bd',
    country: 'بنغلاديش',
    countryAliases: ['بنجلاديش', 'بنغلادش'],
    capitals: ['دكا'],
    acceptableAnswers: ['دكا', 'داكا', 'dhaka'],
    flagCode: 'bd',
    continent: 'آسيا'
  },
  {
    id: 'cap-lk',
    country: 'سريلانكا',
    countryAliases: ['سري لانكا', 'سيلان'],
    capitals: ['كولومبو', 'سري جاياواردنابورا كوتي'],
    acceptableAnswers: ['كولومبو', 'سري جاياواردنابورا كوتي', 'كوتي', 'colombo'],
    flagCode: 'lk',
    continent: 'آسيا',
    notes: 'كولومبو العاصمة الاقتصادية والتجارية، وسري جاياواردنابورا كوتي الإدارية'
  }
];

/**
 * Normalizes user comments for smart capital recognition.
 */
export function normalizeCapitalAnswer(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, '') // remove arabic tashkeel
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/^ال/g, '') // remove leading 'al-'
    .replace(/^(عاصمة|عاصمه)\s+/g, '') // remove prefix 'capital'
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'؛،]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if a live comment matches any of the acceptable capital answers.
 */
export function isCapitalAnswerCorrect(userComment: string, acceptableAnswers: string[]): boolean {
  const normUser = normalizeCapitalAnswer(userComment);
  if (!normUser || normUser.length < 2) return false;

  return acceptableAnswers.some(ans => {
    const normAns = normalizeCapitalAnswer(ans);
    if (!normAns) return false;

    // Exact normalized match
    if (normUser === normAns) return true;

    // Direct token containment for multi-word comments
    if (normUser.includes(normAns) || normAns.includes(normUser)) {
      // Prevent false positives on tiny words
      if (normAns.length >= 3 && normUser.length >= 3) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Generates a full CapitalsQuestion model ready for the Live Stage.
 */
export function generateCapitalsQuestion(entry?: CapitalEntry): CapitalsQuestion {
  const selected = entry || CAPITALS_DATA[Math.floor(Math.random() * CAPITALS_DATA.length)];
  const flagUrl = `https://flagcdn.com/w320/${selected.flagCode}.png`;

  return {
    id: `cap-${selected.id}-${Date.now()}`,
    engineType: 'capitals',
    title: `ما هي عاصمة ${selected.country}؟ 🏛️`,
    category: 'عواصم ودول العالم',
    countryName: selected.country,
    flagUrl,
    continent: selected.continent,
    capitals: selected.capitals,
    acceptableAnswers: selected.acceptableAnswers,
    points: 100,
    timeLimitSeconds: 30,
    notes: selected.notes
  };
}

/**
 * Generates an array of shuffled questions for a game round.
 */
export function generateCapitalsRoundQuestions(count: number = 10): CapitalsQuestion[] {
  const shuffled = [...CAPITALS_DATA].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, Math.min(count, shuffled.length));
  return picked.map(item => generateCapitalsQuestion(item));
}
