'use client';

import { useSyncExternalStore, useCallback, useEffect } from 'react';
import { 
  EntertainmentShow, 
  HostControlState, 
  PlayerScore, 
  TikTokLiveComment, 
  WinnerAnnouncement,
  AnyQuestion,
  EngineType
} from '@aep/types';
import { TikTokLiveEngine } from '@aep/tiktok-live';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { getQuestionsByEngine, GAME_ENGINE_SECTIONS } from '@aep/content-library';
import { loadQuestionsFromStorage, getEngineQuestionsSync } from '../utils/aepStorage';

const emptyFallbackQuestion: AnyQuestion = {
  id: 'empty-1',
  engineType: 'quiz',
  title: 'لا توجد أسئلة مضافة بعد - يرجى رفع أو إضافة الأسئلة من المكتبة 📚',
  category: 'ثقافة وعلوم',
  difficulty: 'easy',
  points: 100,
  timeLimitSeconds: 30,
  acceptableAnswers: []
} as any;

const defaultShow: EntertainmentShow = {
  id: 'show-default',
  title: 'منصة الشايب للترفيه - Al-Shaib Entertainment',
  description: 'المنصة الرسمية المباشرة للعروض المسلية والمسابقات التفاعلية وصناع المحتوى',
  theme: {
    primaryColor: '#0066FF',
    accentColor: '#00F0FF',
    darkBg: '#0A0F1D',
    glassmorphism: true,
    fontFamily: 'Cairo, sans-serif'
  },
  rounds: [
    {
      id: 'round-1',
      title: 'الجولة الأولى: المسابقات الثقافية',
      engineType: 'quiz',
      questions: getQuestionsByEngine('quiz'),
      timeLimitPerQuestionSeconds: 25,
      pointsPerQuestion: 100,
      roundOrder: 1
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// ══════════════════════════════════════════════════════════════════
// 🚀 SINGLETON GLOBAL STATE & REACTIVE STORE
// ══════════════════════════════════════════════════════════════════
interface StudioStoreState {
  show: EntertainmentShow;
  controlState: HostControlState;
  autoMode: boolean;
  liveComments: TikTokLiveComment[];
  leaderboard: PlayerScore[];
  correctAnswersThisQuestion: Array<{ playerName: string; answer: string; rank: number; points: number }>;
}

let globalTikTokEngine: TikTokLiveEngine | null = null;
let globalEngineInitialized = false;

function getGlobalTikTokEngine(): TikTokLiveEngine {
  if (!globalTikTokEngine) {
    globalTikTokEngine = new TikTokLiveEngine();
  }
  return globalTikTokEngine;
}

let globalState: StudioStoreState = {
  show: defaultShow,
  controlState: {
    currentShowId: defaultShow.id,
    currentRoundIndex: 0,
    currentQuestionIndex: 0,
    isPlaying: false,
    isTimerRunning: false,
    timeRemainingSeconds: 30,
    isAnswerRevealed: false,
    activeOverlay: 'none',
    backgroundMusicPlaying: false,
    volume: 0.8,
    currentWinner: null
  },
  autoMode: true,
  liveComments: [],
  leaderboard: [],
  correctAnswersThisQuestion: []
};

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach(listener => listener());
}

function updateGlobalState(updater: (prev: StudioStoreState) => StudioStoreState) {
  globalState = updater(globalState);
  notifyListeners();
}

function setGlobalControlState(updater: (prev: HostControlState) => HostControlState) {
  updateGlobalState(prev => ({
    ...prev,
    controlState: updater(prev.controlState)
  }));
}

function extractAcceptableAnswers(question: AnyQuestion): string[] {
  if (!question) return [];
  const list: string[] = [];

  if (Array.isArray(question.acceptableAnswers) && question.acceptableAnswers.length > 0) {
    list.push(...question.acceptableAnswers);
  }
  if (Array.isArray((question as any).capitals) && (question as any).capitals.length > 0) {
    list.push(...(question as any).capitals);
  }
  if ((question as any).answer) list.push(String((question as any).answer));
  if ((question as any).correctAnswer) list.push(String((question as any).correctAnswer));
  if ((question as any).characterName) list.push(String((question as any).characterName));
  if ((question as any).الإجابة) list.push(String((question as any).الإجابة));
  if ((question as any).الاجابة) list.push(String((question as any).الاجابة));
  if ((question as any).الجواب) list.push(String((question as any).الجواب));
  if ((question as any).الصحيحة) list.push(String((question as any).الصحيحة));

  return Array.from(new Set(list.map(s => String(s).trim()).filter(Boolean)));
}

// Global Single Timer Loop
let globalTimerInterval: any = null;
let globalAutoFlowTimer: any = null;

function ensureGlobalTimerRunning() {
  if (globalTimerInterval) return;

  globalTimerInterval = setInterval(() => {
    const { controlState, show } = globalState;
    const currentQ = show.rounds[controlState.currentRoundIndex]?.questions[controlState.currentQuestionIndex];

    // Bypass timer for games that end on complete solving (e.g. what-do-they-say, memory-match)
    const isUntimedGame = currentQ?.engineType === 'what-do-they-say' || currentQ?.engineType === 'memory-match';
    if (isUntimedGame) return;

    if (controlState.isTimerRunning && controlState.timeRemainingSeconds > 0) {
      setGlobalControlState(prev => {
        if (prev.timeRemainingSeconds <= 1) {
          soundFX.play('time_up');
          getGlobalTikTokEngine().setAcceptingAnswers(false);
          return {
            ...prev,
            timeRemainingSeconds: 0,
            isTimerRunning: false,
            isAnswerRevealed: true
          };
        }
        return {
          ...prev,
          timeRemainingSeconds: prev.timeRemainingSeconds - 1
        };
      });
    }
  }, 1000);
}

// Global Engine Initializer
function initGlobalEngineOnce() {
  if (globalEngineInitialized || typeof window === 'undefined') return;
  globalEngineInitialized = true;

  // Restore Active Show from LocalStorage
  try {
    const savedShow = localStorage.getItem('aep_active_show');
    if (savedShow) {
      const parsed = JSON.parse(savedShow);
      if (parsed && Array.isArray(parsed.rounds) && parsed.rounds.length > 0) {
        parsed.rounds = parsed.rounds.map((r: GameRound) => {
          if (r.engineType === 'what-do-they-say' || !r.questions || r.questions.length === 0) {
            const allQs = getQuestionsByEngine(r.engineType);
            const count = r.questionsCount || allQs.length;
            r.questions = allQs.slice(0, count);
          }
          return r;
        });
        globalState.show = parsed;
        globalState.controlState.currentShowId = parsed.id;
      }
    }
  } catch (e) {
    console.error('Error loading saved show from localStorage', e);
  }

  const engine = getGlobalTikTokEngine();
  globalState = {
    ...globalState,
    liveComments: engine.getComments(),
    leaderboard: engine.getLeaderboard()
  };

  engine.onComment((_comment) => {
    updateGlobalState(prev => ({
      ...prev,
      liveComments: engine.getComments()
    }));
  });

  const winnerDelayRef = { current: null as any };

  engine.onWinner((winner: WinnerAnnouncement) => {
    setGlobalControlState(prev => ({ ...prev, currentWinner: winner }));
    updateGlobalState(prev => ({ ...prev, leaderboard: engine.getLeaderboard() }));

    if (winnerDelayRef.current) clearTimeout(winnerDelayRef.current);
    winnerDelayRef.current = setTimeout(() => {
      soundFX.play('winner_announcement');
      triggerVisualEffect('confetti');
      engine.setAcceptingAnswers(false);
      setGlobalControlState(prev => ({
        ...prev,
        activeOverlay: 'winner',
        isTimerRunning: false,
        isAnswerRevealed: true
      }));
      updateGlobalState(prev => ({ ...prev, leaderboard: engine.getLeaderboard() }));
    }, 10000);
  });

  engine.onCorrectAnswer((data) => {
    updateGlobalState(prev => ({
      ...prev,
      leaderboard: engine.getLeaderboard(),
      correctAnswersThisQuestion: [
        ...prev.correctAnswersThisQuestion,
        {
          playerName: data.player.displayName || data.player.username,
          answer: data.player.lastCorrectAnswer || '',
          rank: data.rank,
          points: data.pointsEarned
        }
      ]
    }));
  });

  const targetChannel = localStorage.getItem('aep_tiktok_channel') || 'soul80813';
  engine.connect(targetChannel).catch(() => {});

  ensureGlobalTimerRunning();
}

let lastSyncedQuestionKey = '';

function advanceToNextQuestion() {
  const engine = getGlobalTikTokEngine();
  engine.setAcceptingAnswers(true);
  updateGlobalState(prev => ({ ...prev, correctAnswersThisQuestion: [] }));

  const r = globalState.show.rounds[globalState.controlState.currentRoundIndex];
  const qList = r?.questions || [];

  if (r && qList.length > 0 && globalState.controlState.currentQuestionIndex < qList.length - 1) {
    soundFX.play('round_transition');
    const nextQ = qList[globalState.controlState.currentQuestionIndex + 1];
    setGlobalControlState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      timeRemainingSeconds: nextQ?.timeLimitSeconds || 30,
      isAnswerRevealed: false,
      currentWinner: null,
      activeOverlay: 'none',
      isTimerRunning: prev.isPlaying
    }));
  } else if (globalState.controlState.currentRoundIndex < globalState.show.rounds.length - 1) {
    soundFX.play('round_transition');
    const nextR = globalState.show.rounds[globalState.controlState.currentRoundIndex + 1];
    setGlobalControlState(prev => ({
      ...prev,
      currentRoundIndex: prev.currentRoundIndex + 1,
      currentQuestionIndex: 0,
      timeRemainingSeconds: nextR?.questions[0]?.timeLimitSeconds || 30,
      isAnswerRevealed: false,
      currentWinner: null,
      activeOverlay: 'none',
      isTimerRunning: prev.isPlaying
    }));
  }
}

const serverSnapshot: StudioStoreState = {
  show: defaultShow,
  controlState: {
    currentShowId: defaultShow.id,
    currentRoundIndex: 0,
    currentQuestionIndex: 0,
    isPlaying: false,
    isTimerRunning: false,
    timeRemainingSeconds: 30,
    isAnswerRevealed: false,
    activeOverlay: 'none',
    backgroundMusicPlaying: false,
    volume: 0.8,
    currentWinner: null
  },
  autoMode: true,
  liveComments: [],
  leaderboard: [],
  correctAnswersThisQuestion: []
};

// ══════════════════════════════════════════════════════════════════
// 🎮 STORE HOOK (Unified Singleton across whole App)
// ══════════════════════════════════════════════════════════════════
export function useStudioStore() {
  const state = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => globalState,
    () => serverSnapshot
  );

  // Initialize once safely on client side
  useEffect(() => {
    if (!globalEngineInitialized) {
      initGlobalEngineOnce();
    }
  }, []);

  const { show, controlState, autoMode, liveComments, leaderboard, correctAnswersThisQuestion } = state;

  const currentRound = show.rounds[controlState.currentRoundIndex] || show.rounds[0];
  const activeEngineType: EngineType = currentRound?.engineType || 'quiz';
  const enginePresetFallback = getQuestionsByEngine(activeEngineType)?.[0] || emptyFallbackQuestion;
  const currentQuestion: AnyQuestion = currentRound?.questions?.[controlState.currentQuestionIndex] || enginePresetFallback;

  // 🎯 Sync active question to TikTok engine ONLY when question ID or engineType changes (prevents wiping answered user list mid-round)
  useEffect(() => {
    if (!currentQuestion) return;
    const qKey = `${currentQuestion.id || currentQuestion.title}-${activeEngineType}`;
    if (lastSyncedQuestionKey === qKey) return;
    lastSyncedQuestionKey = qKey;

    const engine = getGlobalTikTokEngine();
    if (engine) {
      const validAnswers = extractAcceptableAnswers(currentQuestion);
      engine.setActiveQuestion(
        currentQuestion.title,
        validAnswers,
        currentQuestion.points || 100,
        activeEngineType
      );
    }
  }, [currentQuestion?.id, currentQuestion?.title, activeEngineType]);

  // 🚀 Global Auto-Flow State Machine (for General Trivia, Country Flags, Puzzles, etc.)
  useEffect(() => {
    if (globalAutoFlowTimer) {
      clearTimeout(globalAutoFlowTimer);
      globalAutoFlowTimer = null;
    }

    if (!autoMode) return;

    // Step 1: Winner Overlay displayed -> Wait 5s -> Show Leaderboard
    if (controlState.activeOverlay === 'winner' && controlState.currentWinner) {
      globalAutoFlowTimer = setTimeout(() => {
        setGlobalControlState(prev => ({
          ...prev,
          activeOverlay: 'leaderboard'
        }));
      }, 5000);
    }

    // Step 2: Leaderboard Overlay displayed and answer revealed -> Wait 7s -> Auto-advance to Next Question
    if (controlState.activeOverlay === 'leaderboard' && controlState.isAnswerRevealed) {
      globalAutoFlowTimer = setTimeout(() => {
        setGlobalControlState(prev => ({
          ...prev,
          activeOverlay: 'none'
        }));
        advanceToNextQuestion();
      }, 7000);
    }

    // Step 3: Time ran out without winner -> Wait 3.5s -> Show Leaderboard
    if (controlState.isAnswerRevealed && controlState.activeOverlay === 'none' && !controlState.currentWinner) {
      globalAutoFlowTimer = setTimeout(() => {
        setGlobalControlState(prev => ({
          ...prev,
          activeOverlay: 'leaderboard'
        }));
      }, 3500);
    }

    return () => {
      if (globalAutoFlowTimer) {
        clearTimeout(globalAutoFlowTimer);
        globalAutoFlowTimer = null;
      }
    };
  }, [controlState.activeOverlay, controlState.currentWinner, controlState.isAnswerRevealed, autoMode]);

  // Actions
  const setShow = useCallback((showOrUpdater: EntertainmentShow | ((prev: EntertainmentShow) => EntertainmentShow)) => {
    updateGlobalState(prev => {
      let nextShow = typeof showOrUpdater === 'function' ? showOrUpdater(prev.show) : showOrUpdater;
      
      // Guarantee each round has populated questions
      if (nextShow && Array.isArray(nextShow.rounds)) {
        nextShow = {
          ...nextShow,
          rounds: nextShow.rounds.map((r: GameRound) => {
            if (!r.questions || r.questions.length === 0) {
              const allQs = getQuestionsByEngine(r.engineType);
              const count = r.questionsCount || 5;
              return {
                ...r,
                questions: allQs.slice(0, count)
              };
            }
            return r;
          })
        };
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('aep_active_show', JSON.stringify(nextShow));
        } catch (e) {
          console.error('Failed to save show to localStorage', e);
        }
      }

      return {
        ...prev,
        show: nextShow,
        controlState: {
          ...prev.controlState,
          currentShowId: nextShow.id
        }
      };
    });
  }, []);

  const setControlState = useCallback((controlOrUpdater: HostControlState | ((prev: HostControlState) => HostControlState)) => {
    setGlobalControlState(prev => (typeof controlOrUpdater === 'function' ? controlOrUpdater(prev) : controlOrUpdater));
  }, []);

  const setAutoMode = useCallback((val: boolean) => {
    updateGlobalState(prev => ({ ...prev, autoMode: val }));
  }, []);

  const startRound = useCallback(() => {
    soundFX.play('round_start');
    setGlobalControlState(prev => ({
      ...prev,
      isPlaying: true,
      isTimerRunning: true,
      timeRemainingSeconds: currentQuestion?.timeLimitSeconds || 30,
      isAnswerRevealed: false,
      currentWinner: null
    }));
  }, [currentQuestion]);

  const pauseRound = useCallback(() => {
    setGlobalControlState(prev => ({ ...prev, isTimerRunning: false }));
  }, []);

  const resumeRound = useCallback(() => {
    setGlobalControlState(prev => ({ ...prev, isTimerRunning: true }));
  }, []);

  const revealAnswer = useCallback(() => {
    soundFX.play('reveal_question');
    getGlobalTikTokEngine().setAcceptingAnswers(false);
    setGlobalControlState(prev => ({ ...prev, isAnswerRevealed: true, isTimerRunning: false }));
  }, []);

  const nextQuestion = useCallback(() => {
    advanceToNextQuestion();
  }, []);

  const toggleOverlay = useCallback((overlayName: HostControlState['activeOverlay']) => {
    soundFX.play('score_update');
    setGlobalControlState(prev => ({
      ...prev,
      activeOverlay: prev.activeOverlay === overlayName ? 'none' : overlayName
    }));
  }, []);

  const playSoundEffect = useCallback((effectType: any) => {
    soundFX.play(effectType);
    if (effectType === 'winner_announcement' || effectType === 'show_end') {
      triggerVisualEffect('confetti');
    }
  }, []);

  const resetLeaderboard = useCallback(() => {
    const engine = getGlobalTikTokEngine();
    engine.resetLeaderboard();
    updateGlobalState(prev => ({ ...prev, leaderboard: [] }));
  }, []);

  const loadEngineQuestions = useCallback((engineType: EngineType) => {
    const shuffle = <T,>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const storedForEngine = getEngineQuestionsSync(engineType);
    const rawQs = storedForEngine.length > 0 ? storedForEngine : getQuestionsByEngine(engineType);
    const questions = engineType === 'what-do-they-say' ? [...rawQs] : shuffle(rawQs);
    const engineInfo = GAME_ENGINE_SECTIONS.find(s => s.id === engineType) || GAME_ENGINE_SECTIONS[0];

    updateGlobalState(prev => ({
      ...prev,
      show: {
        ...prev.show,
        rounds: [
          {
            id: `round-${engineType}`,
            title: engineInfo.title,
            engineType: engineType,
            questions: questions,
            timeLimitPerQuestionSeconds: 30,
            pointsPerQuestion: 100,
            roundOrder: 1
          }
        ]
      },
      controlState: {
        ...prev.controlState,
        currentRoundIndex: 0,
        currentQuestionIndex: 0,
        timeRemainingSeconds: questions[0]?.timeLimitSeconds || 30,
        isAnswerRevealed: false,
        currentWinner: null
      }
    }));

    // Async reload from storage
    loadQuestionsFromStorage().then(allStored => {
      const filtered = allStored.filter(q => q && q.engineType === engineType);
      if (filtered.length > 0) {
        updateGlobalState(prev => ({
          ...prev,
          show: {
            ...prev.show,
            rounds: [
              {
                id: `round-${engineType}`,
                title: engineInfo.title,
                engineType: engineType,
                questions: engineType === 'what-do-they-say' ? filtered : shuffle(filtered),
                timeLimitPerQuestionSeconds: 30,
                pointsPerQuestion: 100,
                roundOrder: 1
              }
            ]
          }
        }));
      }
    });
  }, []);

  const isCurrentRoundComplete = controlState.isAnswerRevealed && 
    currentRound?.questions && controlState.currentQuestionIndex >= currentRound.questions.length - 1;

  const isShowComplete = isCurrentRoundComplete && 
    controlState.currentRoundIndex >= show.rounds.length - 1;

  return {
    show,
    setShow,
    controlState,
    setControlState,
    currentRound,
    currentQuestion,
    liveComments,
    leaderboard,
    correctAnswersThisQuestion,
    resetLeaderboard,
    autoMode,
    setAutoMode,
    startRound,
    pauseRound,
    resumeRound,
    revealAnswer,
    nextQuestion,
    toggleOverlay,
    playSoundEffect,
    loadEngineQuestions,
    tiktokEngine: getGlobalTikTokEngine(),
    isCurrentRoundComplete,
    isShowComplete
  };
}
