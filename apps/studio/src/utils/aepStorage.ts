'use client';

import { AnyQuestion, EngineType } from '@aep/types';

const DB_NAME = 'AEP_STUDIO_DB';
const DB_VERSION = 1;
const STORE_NAME = 'questions';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject('IndexedDB not supported');
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Save questions to IndexedDB & localStorage
 */
export async function saveQuestionsToStorage(questions: AnyQuestion[]): Promise<void> {
  // 1. Try localStorage first (stripping huge media data URLs if needed for safety)
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aep_questions_db', JSON.stringify(questions));
    }
  } catch (err) {
    console.warn('localStorage quota exceeded, saving to IndexedDB only:', err);
  }

  // 2. Save full payload to IndexedDB (supports large media files & unlimited quota)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        let pending = questions.length;
        if (pending === 0) resolve();
        questions.forEach(q => {
          const addReq = store.put(q);
          addReq.onsuccess = () => {
            pending--;
            if (pending === 0) resolve();
          };
          addReq.onerror = () => reject(addReq.error);
        });
      };
      clearReq.onerror = () => reject(clearReq.error);
    });
  } catch (err) {
    console.warn('IndexedDB save warning:', err);
  }
}

/**
 * Load questions synchronously from localStorage first, then asynchronously from IndexedDB
 */
export function getStoredQuestionsSync(): AnyQuestion[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('aep_questions_db');
      if (saved && saved.trim()) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Filter out old legacy preset quiz questions
            return parsed.filter(q => q && !q.id?.startsWith('quiz-q'));
          }
        } catch (e) {
          console.warn('Invalid JSON in localStorage aep_questions_db:', e);
        }
      }
    }
  } catch (err) {
    console.warn('getStoredQuestionsSync error:', err);
  }
  return [];
}

/**
 * Load questions from IndexedDB (with fallback to localStorage)
 */
export async function loadQuestionsFromStorage(): Promise<AnyQuestion[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const questions: AnyQuestion[] = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
    if (questions && questions.length > 0) {
      // Filter out old legacy preset quiz questions
      const cleaned = questions.filter(q => q && !q.id?.startsWith('quiz-q'));
      if (cleaned.length !== questions.length) {
        saveQuestionsToStorage(cleaned);
      }
      return cleaned;
    }
  } catch (err) {
    console.warn('IndexedDB load warning, falling back to localStorage:', err);
  }
  return getStoredQuestionsSync();
}

/**
 * Get stored questions matching specific engine type
 */
export function getEngineQuestionsSync(engineType: EngineType): AnyQuestion[] {
  const all = getStoredQuestionsSync();
  return all.filter(q => q && q.engineType === engineType);
}

/**
 * Clear all questions for a specific engine type
 */
export async function clearEngineQuestions(engineType: EngineType): Promise<AnyQuestion[]> {
  const all = await loadQuestionsFromStorage();
  const remaining = all.filter(q => q && q.engineType !== engineType);
  await saveQuestionsToStorage(remaining);
  return remaining;
}
