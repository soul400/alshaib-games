import { NationalDayQuestion } from '@aep/types';

/**
 * 🇸🇦 NATIONAL DAY 96 QUESTION BANK (بنك أسئلة اليوم الوطني السعودي 96)
 * Empty initial bank ready for custom user input and live generation.
 */
export const NATIONAL_DAY_96_BANK: NationalDayQuestion[] = [];

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
    .replace(/[ًٌٍَُِّْ]/g, '') // Remove tashkeel
    .replace(/[^\w\s\d\u0600-\u06FF]/gi, '') // Remove punctuation
    .replace(/\s+/g, ' ');

  return str.trim();
}

/**
 * Robust Answer Matcher for National Day Chat Responses
 */
export function isNationalDayAnswerMatch(userComment: string, question: NationalDayQuestion): boolean {
  if (!userComment || !question) return false;
  const normUser = normalizeNationalDayAnswer(userComment);

  // Check direct number match
  if (question.numberAnswer !== undefined) {
    const numRegex = new RegExp(`\\b${question.numberAnswer}\\b`);
    if (numRegex.test(normUser) || normUser === String(question.numberAnswer)) {
      return true;
    }
  }

  // Check acceptable answers
  for (const acc of question.acceptableAnswers) {
    const normAcc = normalizeNationalDayAnswer(acc);
    if (!normAcc) continue;

    if (normUser === normAcc || normUser.includes(normAcc) || normAcc.includes(normUser)) {
      return true;
    }
  }

  return false;
}
