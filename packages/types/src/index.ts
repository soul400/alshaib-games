export type EngineType =
  | 'quiz'
  | 'alphabet'
  | 'image-puzzle'
  | 'video-challenge'
  | 'audio-challenge'
  | 'mixed-words'
  | 'symbol-puzzle'
  | 'character'
  | 'what-do-they-say'
  | 'hunter-roulette'
  | 'mystery-roulette'
  | 'musical-chairs'
  | 'the-vault'
  | 'bomb-pass'
  | 'react'
  | 'memory-match'
  | 'capitals'
  | 'bus-tayyibin'
  | 'squid-game';

export type ImageTransformStyle =
  | 'normal'
  | 'cartoon'
  | 'pixel'
  | 'blur'
  | 'sketch'
  | 'mosaic'
  | 'black-shadow'
  | 'half-image'
  | 'comic-style'
  | 'caricature';

export type SoundEffectType =
  | 'round_start'
  | 'countdown_tick'
  | 'time_up'
  | 'correct_answer'
  | 'wrong_answer'
  | 'winner_announcement'
  | 'score_update'
  | 'round_transition'
  | 'reveal_question'
  | 'box_open'
  | 'wheel_spin'
  | 'show_end'
  | 'lock_click'
  | 'lock_clack'
  | 'security_alarm'
  | 'lockdown'
  | 'pin_error'
  | 'vault_open'
  | 'digit_reveal'
  | 'bonus_reveal'
  | 'gear_rotate'
  | 'bomb_tick'
  | 'bomb_danger_tick'
  | 'bomb_transfer'
  | 'bomb_impact'
  | 'bomb_explosion'
  | 'bomb_fake_click'
  | 'shield_protect'
  | 'freeze_tick'
  | 'slot_tick'
  | 'card_flip'
  | 'card_match'
  | 'card_miss'
  | 'round_complete'
  | 'doll_turn'
  | 'danger_reveal'
  | 'elimination_laser';

export type VisualEffectType =
  | 'confetti'
  | 'fireworks'
  | 'sparkles'
  | 'glow'
  | 'spotlight'
  | 'card_flip_3d'
  | 'winner_card';

export interface BaseQuestion {
  id: string;
  engineType: EngineType;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimitSeconds: number;
  acceptableAnswers: string[];
  hint?: string;
  tags?: string[];
}

export interface QuizQuestion extends BaseQuestion {
  engineType: 'quiz';
  options?: string[];
  isMultipleChoice: boolean;
}

export interface AlphabetTile {
  letter: string;
  question: BaseQuestion;
  isAnswered: boolean;
  answeredBy?: string;
}

export interface ImagePuzzleQuestion extends BaseQuestion {
  engineType: 'image-puzzle';
  imageUrl: string;
  transformStyle: ImageTransformStyle;
}

export interface VideoChallengeQuestion extends BaseQuestion {
  engineType: 'video-challenge';
  videoUrl: string;
  startOffsetSeconds?: number;
  pauseAtSeconds?: number;
}

export interface AudioChallengeQuestion extends BaseQuestion {
  engineType: 'audio-challenge';
  audioUrl: string;
  audioType: 'animals' | 'celebrities' | 'instruments' | 'countries' | 'nature' | 'custom';
}

export interface MixedWordsQuestion extends BaseQuestion {
  engineType: 'mixed-words';
  originalWord: string;
  scrambledLetters: string[];
}

export interface SymbolPuzzleQuestion extends BaseQuestion {
  engineType: 'symbol-puzzle';
  emojis: string[];
  iconCategory: string;
}

export interface CharacterQuestion extends BaseQuestion {
  engineType: 'character';
  characterName: string;
  imageUrl: string;
  transformStyle: ImageTransformStyle;
}

export interface AlphabetQuestion extends BaseQuestion {
  engineType: 'alphabet';
  letter?: string;
}

export type HunterGamePhase =
  | 'IDLE'                 // Initial state before registration starts
  | 'REGISTERING'          // Comments with 'العب' are registered dynamically
  | 'LOCKED'               // Registration closed & immutable participant list
  | 'SPINNING'             // Wheel animation spinning
  | 'WINNER_REVEALED'      // Selected Shooter revealed (5s banner)
  | 'TARGET_SELECTION'     // Shooter picks target in chat (30s countdown)
  | 'HUNTER_SCENE'         // Shotgun animation (Loaded vs Empty)
  | 'SURVIVED'             // Target survived
  | 'ELIMINATED'           // Target eliminated
  | 'REVIVED'              // Player revived from elimination gate
  | 'GAME_OVER';           // Only 1 survivor left (Winner!)

export interface HunterRouletteParticipant {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isAlive: boolean;
  registeredAt: number;
}

export interface HunterRouletteQuestion extends BaseQuestion {
  engineType: 'hunter-roulette';
  phase: HunterGamePhase;
  participants: HunterRouletteParticipant[];
  currentShooter?: HunterRouletteParticipant;
  currentTarget?: HunterRouletteParticipant;
  isLoadedShot?: boolean;
  roundNumber: number;
  winner?: HunterRouletteParticipant;
}

export type MysteryRouletteGamePhase =
  | 'IDLE'
  | 'REGISTRATION'
  | 'READY'
  | 'SPINNING'
  | 'HUNTER_SELECTED'
  | 'CARD_SELECTION'
  | 'FLIPPING_CARD'
  | 'REVEALED_VICTIM'
  | 'NEXT_ROUND'
  | 'WINNER';

export interface MysteryRoulettePlayer {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  status: 'ACTIVE' | 'ELIMINATED' | 'HUNTER' | 'WINNER';
  joinedAt: number;
  eliminatedInRound?: number;
}

export interface MysteryRouletteCard {
  id: string;
  cardNumber: number;
  player: MysteryRoulettePlayer;
  isFlipped: boolean;
  isEliminated: boolean;
}

export interface MysteryRouletteQuestion extends BaseQuestion {
  engineType: 'mystery-roulette';
  phase?: MysteryRouletteGamePhase;
  roundNumber?: number;
}

export type VaultGamePhase =
  | 'IDLE'                   // Ready state before registration
  | 'REGISTRATION'           // Accepting "العب" in comments
  | 'REGISTRATION_LOCKED'    // Registration closed
  | 'INTRO'                  // Cinematic brief
  | 'PUZZLE_ACTIVE'          // Active digit puzzle solving
  | 'DIGIT_REVEALED'         // Solver spotlight & lock open
  | 'FINAL_CODE'             // All digits known - sprint for full PIN
  | 'LOCKDOWN'               // Security lockdown on spam
  | 'VAULT_OPENING'          // Cinematic unlock sequence
  | 'WINNER_REVEAL'          // Winner spotlight
  | 'BONUS_VAULT'            // 3 mini-vaults A, B, C choice
  | 'GAME_COMPLETE'          // Summary & replay
  | 'TIMEOUT'
  | 'GAME_PAUSED'
  | 'GAME_CANCELLED';

export type VaultSecurityLevel = 'NORMAL' | 'WARNING' | 'ALERT' | 'CRITICAL' | 'LOCKDOWN';

export interface VaultParticipant {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  registeredAt: number;
  solvedPuzzlesCount: number;
}

export type VaultPuzzleType =
  | 'math'
  | 'sequence'
  | 'pattern'
  | 'visual_count'
  | 'logic'
  | 'clue'
  | 'visual_equation'
  | 'crack_code'
  | 'math_riddle'
  | 'matrix_math';

export interface VaultEquationRow {
  items: string[];
  operators: ('+' | '-' | '×' | '÷')[];
  result: number | string;
}

export interface VaultCrackClue {
  code: string[];
  verdict: string;
  status: 'CORRECT_PLACE' | 'WRONG_PLACE' | 'ALL_WRONG';
}

export interface VaultPuzzle {
  id: string;
  stageNumber: number;
  targetDigitIndex: number;
  type: VaultPuzzleType;
  title: string;
  question: string;
  visualData?: {
    grid?: string[][];
    sequence?: (number | string)[];
    clues?: string[];
    formula?: string;
    symbol?: string;
    equationRows?: VaultEquationRow[];
    crackClues?: VaultCrackClue[];
    matrixNumbers?: { top: number; left: number; right: number; center: number | string };
  };
  correctAnswer: string;
  hints: string[];
  timeLimitSeconds: number;
  solvedBy?: {
    userId: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    timestamp: number;
  };
}

export interface VaultConfig {
  vaultName: string;
  pinLength: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible';
  totalGameDurationSeconds: number;
  puzzleTimeLimitSeconds: number;
  hintsEnabled: boolean;
  bonusVaultEnabled: boolean;
  lockdownDurationSeconds: number;
  maxFailedAttemptsBeforeLockdown: number;
}

export type BonusVaultPrize = 'GRAND_PRIZE' | 'MYSTERY_BOX' | 'EMPTY_VAULT';

export interface VaultQuestion extends BaseQuestion {
  engineType: 'the-vault';
  phase: VaultGamePhase;
  securityLevel: VaultSecurityLevel;
  pinLength: number;
  revealedDigits: (string | null)[];
  currentStageIndex: number;
  puzzles: VaultPuzzle[];
  participants: VaultParticipant[];
  failedPinAttemptsCount: number;
  winner?: {
    participant: VaultParticipant;
    submittedPin: string;
    timestamp: number;
  };
  bonusPrizeChosen?: {
    choice: 'A' | 'B' | 'C';
    prize: BonusVaultPrize;
    prizeLabel: string;
  };
}

// ══════════════════════════════════════════════════════════════
// 🪑 MUSICAL CHAIRS — LIVE INTERACTIVE GAME TYPES
// ══════════════════════════════════════════════════════════════

export type MusicalChairsPlayerStatus = 'ACTIVE' | 'SEATED' | 'ELIMINATED' | 'WINNER';

export type MusicalChairsGamePhase =
  | 'IDLE'
  | 'REGISTRATION'
  | 'READY'
  | 'COUNTDOWN'
  | 'MUSIC_PLAYING'
  | 'MUSIC_STOPPED'
  | 'SEAT_CLAIMING'
  | 'SEATS_LOCKED'
  | 'ELIMINATION'
  | 'NEXT_ROUND'
  | 'FINAL_ROUND'
  | 'WINNER'
  | 'PAUSED';

export interface MusicalChairsPlayer {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  joinedAt: number;
  status: MusicalChairsPlayerStatus;
  currentSeatNumber?: number;
  claimedAt?: number;
  eliminationRound?: number;
  eliminatedAt?: number;
  seatsClaimedCount?: number;
}

export interface MusicalChairsSeat {
  seatId: string;
  seatNumber: number; // 2-digit number (10 to 99)
  status: 'AVAILABLE' | 'CLAIMED' | 'LOCKED';
  playerId?: string;
  player?: MusicalChairsPlayer;
  claimedAt?: number;
}

export interface MusicalChairsClaimLog {
  id: string;
  roundNumber: number;
  playerId: string;
  playerName: string;
  avatarUrl?: string;
  seatNumber: number;
  commentText: string;
  receivedAt: number;
  result: 'CLAIMED' | 'REJECTED_TAKEN' | 'REJECTED_INVALID' | 'REJECTED_ALREADY_SEATED' | 'REJECTED_DURING_MUSIC';
}

export interface MusicalChairsQuestion extends BaseQuestion {
  engineType: 'musical-chairs' | 'the-vault';
  musicDurationSeconds?: number;
  musicTrack?: string;
}

// ══════════════════════════════════════════════════════════════
// 🧨 BOMB PASS — LIVE GAME TYPES
// ══════════════════════════════════════════════════════════════

export type BombPlayerStatus =
  | 'WAITING'
  | 'ALIVE'
  | 'HOLDING_BOMB'
  | 'PROTECTED'
  | 'ELIMINATED'
  | 'WINNER';

export type BombPowerUpType = 'SHIELD' | 'SWAP' | 'FREEZE' | 'DOUBLE_BOMB';

export interface BombPowerUp {
  id: string;
  type: BombPowerUpType;
  name: string;
  icon: string;
  description: string;
  charges: number;
}

export interface BombPlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  roundsSurvived: number;
  bombTransfers: number;
  bombsReceived: number;
  eliminations: number;
  shieldsUsed: number;
  swapsUsed: number;
  freezesUsed: number;
}

export interface BombPlayer {
  id: string;
  playerId: string;
  tiktokUserId: string;
  tiktokUsername: string; // Used internally only, never shown in UI
  displayName: string;    // The ONLY name displayed in UI
  avatarUrl: string;
  status: BombPlayerStatus;
  joinedAt: number;
  eliminatedAt?: number;
  powerUps: BombPowerUp[];
  statistics: BombPlayerStats;
  isDisconnected?: boolean;
}

export type BombPassPhase =
  | 'LOBBY'
  | 'STARTING'
  | 'ROUND_ACTIVE'
  | 'ROUND_TRANSITION'
  | 'BOMB_TRANSFERRING'
  | 'EXPLOSION'
  | 'SURVIVAL'
  | 'GAME_OVER';

export type BombType = 'REAL' | 'FAKE';

export type BombDifficultyPreset = 'EASY' | 'NORMAL' | 'HARD' | 'CHAOS';

export interface BombInstance {
  bombId: string;
  holderId: string;
  startedAt: number;
  expiresAt: number;
  durationSeconds: number;
  visibleDurationSeconds?: number;
  visibleExpiresAt?: number;
  type: BombType;
  isFrozen: boolean;
  frozenAt?: number;
  frozenRemainingMs?: number;
  holderReceivedAt?: number;
}

export interface BombConfig {
  playersLimit: number;
  minBombTime: number;
  maxBombTime: number;
  fakeBombChance: number; // 0.0 to 1.0 (e.g. 0.15 = 15%)
  powerUpsEnabled: boolean;
  chaosEventsEnabled: boolean;
  doubleBombEnabled: boolean;
  difficultyPreset: BombDifficultyPreset;
  disconnectGracePeriodSec: number;
}

export interface BombPassQuestion extends BaseQuestion {
  engineType: 'bomb-pass';
  phase: BombPassPhase;
  currentRound: number;
  players: BombPlayer[];
  activeBombs: BombInstance[];
  config: BombConfig;
  winner?: BombPlayer;
}

// ════════════════════════════════════════════════════════════════════
// ⚡ REACT ENGINE INTERFACES (تحدي التركيز والاستجابة)
// ════════════════════════════════════════════════════════════════════

export type ReactStageMode =
  | 'TUTORIAL'
  | 'FOCUS'
  | 'SPEED'
  | 'CHAIN'
  | 'MEMORY'
  | 'DECEPTION'
  | 'SILENCE'
  | 'FINAL';

export type NumberDigitType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUADRUPLE';

export interface NumberGuessPrompt {
  id: string;
  questionNumber: number; // 1 to 5
  title: string;          // "خمن الرقم"
  digitType: NumberDigitType;
  digitsCount: number;    // 1, 2, 3, or 4
  minNumber: number;      // e.g. 10
  maxNumber: number;      // e.g. 99
  secretNumber: number;   // The secret target number to guess
  secretNumberString: string;
  points: number;         // e.g. 150
  timeLimitSec: number;   // e.g. 30
  hintRange?: string;     // e.g. "بين 10 و 99"
  descriptionHint?: string; // "رقم ثنائي مكون من خانتين"
}

export interface ReactPrompt {
  id: string;
  roundNumber: number;
  stageMode: ReactStageMode;
  stageTitle: string;
  symbols: string[];
  expectedWords: string[];
  displayedDistractorWord?: string;
  timeLimitSec: number;
  isSilenceRule?: boolean;
  memoryConcealAfterSec?: number;
  descriptionHint?: string;
  // Number Guessing support
  digitType?: NumberDigitType;
  digitsCount?: number;
  minNumber?: number;
  maxNumber?: number;
  points?: number;
  secretNumber?: number;
  secretNumberString?: string;
}

export interface ReactPlayer {
  id: string;
  tiktokUserId: string;
  tiktokUsername: string;
  displayName: string;
  avatarUrl: string;
  score: number;
  hearts: number; // Max 10
  isEliminated: boolean;
  combo: number;
  maxCombo: number;
  totalCorrect: number;
  totalWrong: number;
  fastestReactionMs: number;
  lastAnswerStatus?: 'CORRECT' | 'WRONG' | 'LATE' | 'SILENCE_BROKEN' | 'OUT_OF_HEARTS';
  lastGuess?: number;
  lastGuessDiff?: 'HIGHER' | 'LOWER';
}

export type ReactGamePhase =
  | 'INSTRUCTIONS'
  | 'COUNTDOWN'
  | 'ROUND_ACTIVE'
  | 'ROUND_RECAP'
  | 'GAME_OVER';

export interface ReactConfig {
  maxHearts: number; // Defaults to 10
  difficultySpeed: 'SLOW' | 'NORMAL' | 'FAST';
  enableMemoryStage: boolean;
  enableDeceptionStage: boolean;
  enableSilenceStage: boolean;
  totalRounds: number;
}

export interface ReactQuestion extends BaseQuestion {
  engineType: 'react';
  phase: ReactGamePhase;
  currentRoundNumber: number;
  totalRounds: number; // Defaults to 5
  players: ReactPlayer[];
  currentPrompt: ReactPrompt | null;
  config: ReactConfig;
  winner?: ReactPlayer;
  usedSecretNumbers?: number[];
}

// ════════════════════════════════════════════════════════════════════
// 🧠 وش يقولون؟ — WHAT DO THEY SAY? INTERFACES
// ════════════════════════════════════════════════════════════════════

export interface WhatDoTheySayRevealer {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  revealedAt: number;
  team?: 'RED' | 'BLUE';
}

export interface WhatDoTheySayAnswer {
  rank: number;              // 1 to 10
  title: string;             // e.g. "الجوال"
  emoji?: string;            // e.g. "📱"
  points: number;            // e.g. 45
  aliases: string[];         // e.g. ["جوال", "تلفون", "الهاتف", "الموبايل", "ايفون"]
  isRevealed: boolean;
  revealedBy?: WhatDoTheySayRevealer;
}

export type WhatDoTheySayMode = 'SOLO' | 'TEAM';
export type WhatDoTheySayPhase = 'INTRO' | 'PLAYING' | 'ROUND_SUMMARY' | 'GAME_OVER';

export interface WhatDoTheySayQuestion extends BaseQuestion {
  engineType: 'what-do-they-say';
  totalScore: number;       // Always 200
  answers: WhatDoTheySayAnswer[]; // Exactly 10 answers
  mode?: WhatDoTheySayMode;
  phase?: WhatDoTheySayPhase;
  redTeamScore?: number;
  blueTeamScore?: number;
}

// ══════════════════════════════════════════════════════════════
// 🧠 MEMORY MATCH LIVE — GAME TYPES
// ══════════════════════════════════════════════════════════════

export type MemoryCategory = 'animals' | 'flags' | 'landmarks' | 'food' | 'drinks' | 'random';

export type MemoryMatchPhase =
  | 'IDLE'
  | 'ROUND_SETUP'
  | 'MEMORIZE'
  | 'HIDE'
  | 'ACTIVE_GAME'
  | 'ROUND_COMPLETE'
  | 'RESULTS'
  | 'GAME_OVER'
  | 'PAUSED';

export interface MemoryImageAsset {
  id: string;
  name: string;
  category: MemoryCategory;
  image: string;
  thumbnail?: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'DISABLED';
  createdAt?: string;
  updatedAt?: string;
}

export interface MemoryCard {
  id: string;
  roundId: string;
  position: number;        // 1 to 16
  imageId: string;
  pairId: number;          // 1 to 8 (each pair shares the same pairId)
  title: string;
  imageUrl: string;
  category: MemoryCategory;
  isRevealed: boolean;
  isMatched: boolean;
  matchedBy?: {
    playerId: string;
    displayName: string;
    avatarUrl: string;
  };
  matchedAt?: number;
}

export interface MemoryPlayer {
  playerId: string;
  tiktokUserId?: string;
  displayName: string;
  avatarUrl: string;
  roundScore: number;
  totalScore: number;
  pairsFound: number;
  lastAttemptAt?: number;
}

export interface MemoryAttempt {
  id: string;
  roundId: string;
  playerId: string;
  displayName: string;
  avatarUrl: string;
  positionA: number;
  positionB: number;
  rawComment: string;
  normalizedComment: string;
  timestamp: number;
  result: 'MATCH' | 'MISS' | 'INVALID' | 'IGNORED' | 'CLAIMED';
}

export interface MemoryMatchConfig {
  memorizeDurationSec: 5 | 10 | 15 | 20;
  category: MemoryCategory;
  pointsPerPair: number;
  resultsDurationSec: number;
  totalCards: number;
  totalPairs: number;
}

export interface MemoryMatchQuestion extends BaseQuestion {
  engineType: 'memory-match';
  phase: MemoryMatchPhase;
  currentRoundNumber: number;
  config: MemoryMatchConfig;
  cards: MemoryCard[];
  players: MemoryPlayer[];
  activeAttempts: MemoryAttempt[];
  winner?: MemoryPlayer;
}

export interface CapitalsQuestion extends BaseQuestion {
  engineType: 'capitals';
  countryName: string;
  flagUrl?: string;
  continent?: string;
  capitals: string[];
  notes?: string;
}

export type AnyQuestion =
  | QuizQuestion
  | AlphabetQuestion
  | ImagePuzzleQuestion
  | VideoChallengeQuestion
  | AudioChallengeQuestion
  | MixedWordsQuestion
  | SymbolPuzzleQuestion
  | CharacterQuestion
  | WhatDoTheySayQuestion
  | HunterRouletteQuestion
  | MysteryRouletteQuestion
  | VaultQuestion
  | BombPassQuestion
  | ReactQuestion
  | MemoryMatchQuestion
  | CapitalsQuestion;


export interface GameRound {
  id: string;
  title: string;
  engineType: EngineType;
  questionsCount?: number;
  questions: AnyQuestion[];
  alphabetTiles?: AlphabetTile[];
  timeLimitPerQuestionSeconds: number;
  pointsPerQuestion: number;
  backgroundMusic?: string;
  roundOrder: number;
  customConfig?: Record<string, any>;
}

export interface ShowTheme {
  primaryColor: string;
  accentColor: string;
  darkBg: string;
  glassmorphism: boolean;
  fontFamily: string;
  logoUrl?: string;
}

export interface EntertainmentShow {
  id: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  theme: ShowTheme;
  rounds: GameRound[];
  soundtrackUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerScore {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  correctAnswersCount: number;
  rank: number;
  badge?: string;
  lastCorrectAnswer?: string;
}

export interface TikTokLiveComment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  comment: string;
  timestamp: number;
}

export interface WinnerAnnouncement {
  player: PlayerScore;
  questionTitle: string;
  correctAnswer: string;
  pointsEarned: number;
  timestamp: number;
}

export interface HostControlState {
  currentShowId: string | null;
  currentRoundIndex: number;
  currentQuestionIndex: number;
  isPlaying: boolean;
  isTimerRunning: boolean;
  timeRemainingSeconds: number;
  isAnswerRevealed: boolean;
  activeOverlay: 'none' | 'leaderboard' | 'winner' | 'alphabet-grid' | 'show-intro' | 'show-outro';
  backgroundMusicPlaying: boolean;
  volume: number;
  currentWinner: WinnerAnnouncement | null;
}

export interface ImportReport {
  totalRows: number;
  importedCount: number;
  skippedCount: number;
  duplicatesRemoved: number;
  cleanedErrors: string[];
  importTimestamp: string;
}

// ══════════════════════════════════════════════════════════════
// 🇸🇦 SAUDI NATIONAL DAY 96 — TYPES & DATA MODELS
// ══════════════════════════════════════════════════════════════

export type NationalDay96ActivityId =
  | 'saudi-great'         // 🏆 السعودية العظمى (ثقافية عامة)
  | 'saudi-numbers'       // 🔢 أرقام الوطن (أرقام وتواريخ)
  | 'national-dedications'// 💚 إهداءات وطنية (رسائل الجمهور)
  | 'landscapes'          // 📸 صور ربوع بلادي (تحدي الصور والمعالم)
  | 'national-map'        // 🗺️ خريطة الوطن (خمن المنطقة والمدينة)
  | 'memory-archive'      // 🏛️ ذاكرة وطن (تاريخ وأرشيف)
  | 'saudi-screen'        // 🎬 السعودية على الشاشة (فن وسينما)
  | 'challenge-96'        // ⚡ تحدي 96 (جولات سريعة 5-10 ثوانٍ)
  | 'saudi-heritage'      // 🐎 تراثنا (خيل، إبل، قهوة، أزياء)
  | 'national-voice';     // 🎤 صوت الوطن (أصوات ومعالم صوتية)

export interface NationalDayQuestion {
  id: string;
  activityId: NationalDay96ActivityId;
  category: string;
  question: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimitSeconds: number;
  explanation?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'map-province' | 'none';
  targetProvince?: string;
  numberAnswer?: number;
  source?: string;
  status: 'ACTIVE' | 'REVIEW' | 'ARCHIVED';
  usedCount: number;
  createdAt: number;
}

export interface NationalDayDedication {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  message: string;
  selectedNumber: number;
  timestamp: number;
  status: 'PENDING' | 'APPROVED' | 'BROADCASTED' | 'REJECTED';
}

export interface NationalDayLeaderboardEntry {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  nationalPoints: number;
  correctAnswersCount: number;
  winsCount: number;
  rank: number;
  favoriteActivity?: string;
}

export interface NationalDaySettings {
  currentActivity: NationalDay96ActivityId;
  questionTimeSeconds: number;
  roundTimeSeconds: number;
  autoNext: boolean;
  soundFxEnabled: boolean;
  theme: 'deep-emerald' | 'sovereign-gold' | 'desert-sand';
}

// ══════════════════════════════════════════════════════════════
// 🚌 باص الطيبين (BUS AL-TAYYIBIN) — TIKTOK LIVE WORD BATTLE TYPES
// ══════════════════════════════════════════════════════════════

export type BusPhase =
  | 'IDLE'            // انتظار بدء الجولة
  | 'REGISTRATION'    // فترة تسجيل اللاعبين بكلمة «العب» (3-5 ثوانٍ)
  | 'LETTER_REVEAL'   // كشف الحرف بطريقة سينمائية
  | 'ACTIVE'          // الجولة نشطة واستقبال الإجابات
  | 'LOCKED'          // إغلاق الجولة فور وصول أول «تم» صالحة أو انتهاء الوقت
  | 'VALIDATING'      // مرحلة التحقق الترفيهية تصنيفاً تلو الآخر
  | 'RESULTS'         // عرض نتائج وتصنيفات الجولة
  | 'LEADERBOARD';    // لوحة الصدارة التراكمية

export type BusGameMode =
  | 'CLASSIC'         // 30 ثانية - فريد 10 / مكرر 5 / خاطئ 0
  | 'SPEED'           // 10-15 ثانية خاطفة دون اشتراط «تم»
  | 'LAST_BUS'        // تصفيات إقصائية (80 -> 50 -> 25 -> 10 -> 3)
  | 'GOLDEN_BUS';     // باص ذهبي: فريد 20 / مكرر 0

export type BusLetterDifficulty = 'EASY' | 'NORMAL' | 'HARD' | 'EXTREME';

export interface BusCategory {
  id: string;
  name: string;
  icon: string;
  order: number;
  enabled: boolean;
  validationSet?: string[];
}

export interface PlayerAnswer {
  categoryId: string;
  categoryName: string;
  raw: string;
  normalized: string;
  submittedAt: number;
  status: 'pending' | 'valid' | 'duplicate' | 'invalid' | 'unknown';
  score: number;
  duplicateCount?: number;
}

export interface BusPlayer {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  joinedAt: number;
  answers: Record<string, PlayerAnswer>;
  roundScore: number;
  totalScore: number;
  validAnswers: number;
  uniqueAnswers: number;
  duplicateAnswers: number;
  finishedAt?: number;
  isFinisher?: boolean;
  hasIncompleteFinishPenalty?: boolean;
  eliminated?: boolean;
}

export interface BusLetterInfo {
  letter: string;
  weight: number;
  difficulty: BusLetterDifficulty;
  enabled: boolean;
}

export interface BusRoundState {
  roundId: string;
  roundNumber: number;
  phase: BusPhase;
  mode: BusGameMode;
  requiredLetter: string;
  categories: BusCategory[];
  players: BusPlayer[];
  startedAt: number;
  durationSeconds: number;
  endsAt: number;
  finishCaller?: {
    userId: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    calledAt: number;
    validCount: number;
    totalCategories: number;
    success: boolean;
  };
  currentValidatingCategoryIndex: number;
  totalParticipants: number;
  roundSeed?: string;
}

export interface BusGameConfig {
  mode: BusGameMode;
  durationSeconds: number;
  difficulty: BusLetterDifficulty;
  joinKeyword: string;
  finishKeyword: string;
  uniquePoints: number;
  duplicatePoints: number;
  wrongPoints: number;
  incompleteFinishPenalty: number;
  minPlayers: number;
  maxPlayers: number;
  categories: BusCategory[];
  soundEnabled: boolean;
}

export interface BusQuestion extends BaseQuestion {
  engineType: 'bus-tayyibin';
  config: BusGameConfig;
}

// ══════════════════════════════════════════════════════════════
// 🦑 لعبة «الحبار» (SQUID SURVIVAL) — LIVE BROADCAST GAME TYPES
// ══════════════════════════════════════════════════════════════

export type SquidGamePhase =
  | 'IDLE'               // قبل البداية
  | 'LOBBY'              // تسجيل اللاعبين عبر كلمة "العب" في الشات
  | 'ROUND_START'        // إعلان بداية الجولة
  | 'CHOOSING'           // عد تنازلي للاختيار (1-5) في الشات
  | 'LOCKING'            // إغلاق الاختيارات وجاري التحليل
  | 'DOLL_MOVEMENT'      // حركة والتفات الدمية
  | 'DANGER_REVEAL'      // كشف رقم الخطر
  | 'RESULT_REVEAL'      // ظهور نتائج اللاعبين (إقصاء أو تقدم)
  | 'ROUND_END'          // ملخص الجولة واستعداد للجولة التالية
  | 'GAME_OVER';         // شاشة تتويج الفائز النهائي

export type SquidPlayerStatus =
  | 'ACTIVE'             // نشط داخل اللعبة
  | 'CHOOSING'           // بانتظار إرسال رقمه
  | 'LOCKED'             // تم اعتماد اختياره
  | 'SAFE'               // آمن في هذه الجولة
  | 'ADVANCED'           // تقدم بخطوات إضافية
  | 'DANGER'             // سقط في رقم الخطر
  | 'ELIMINATED'         // تم إقصاؤه نهائياً
  | 'FINISHED';          // وصل لخط النهاية وفاز

export interface SquidPlayer {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  currentStep: number;
  targetSteps: number;
  lastChoice: number | null; // 1 to 5
  status: SquidPlayerStatus;
  isAlive: boolean;
  eliminatedAtRound?: number;
  joinedAt: number;
  roundsSurvived: number;
}

export type SquidRiskLevel = 'easy' | 'normal' | 'hard' | 'extreme';
export type SquidWinMode = 'first_to_finish' | 'last_survivor';

export interface SquidGameConfig {
  winningSteps: number;            // 5, 8, 10, 15, 20
  choiceDurationSeconds: number;   // 5, 10, 15, 20, 30
  riskLevel: SquidRiskLevel;
  winMode: SquidWinMode;
  allowJoinMidGame: boolean;
  resultDisplayDurationSeconds: number;
  soundEnabled: boolean;
}

export interface SquidRoundInfo {
  roundNumber: number;
  dangerNumber: number | null;
  startedAt: number;
  choiceDeadline: number;
  resolvedAt?: number;
  eliminatedCount: number;
  advancedCount: number;
}

export interface SquidGameQuestion extends BaseQuestion {
  engineType: 'squid-game';
  config: SquidGameConfig;
}


