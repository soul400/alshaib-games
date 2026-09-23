'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  NationalDayQuestion, NationalDay96ActivityId, TikTokLiveComment 
} from '@aep/types';
import { 
  Trophy, Sparkles, Clock, Play, Pause, RotateCcw, 
  ChevronRight, ChevronLeft, Eye, Volume2, VolumeX, CheckCircle2, 
  HelpCircle, Star, Tv, Smartphone, Send, Radio, Compass, Binary, Film, Flame, Mic, Image as ImageIcon,
  Users, User, Swords, Shield, Infinity as InfinityIcon, ArrowRight, Check, RefreshCw
} from 'lucide-react';
import { soundFX } from '@aep/audio-visual-fx';
import { isNationalDayAnswerMatch } from '@aep/content-library';
import { NationalDayMapChallenge } from './NationalDayMapChallenge';
import { NationalDayWinnerModal } from './NationalDayWinnerModal';

interface Props {
  activityId: NationalDay96ActivityId;
  activityTitle: string;
  questions: NationalDayQuestion[];
  liveComments: TikTokLiveComment[];
  onWinnerClaim: (winner: {
    userId: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    points: number;
  }, question: NationalDayQuestion) => void;
  onExitArena: () => void;
}

interface TeamMember {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  team: 'falcons' | 'lavender';
}

/** Detect if comment text indicates a team selection or switch */
function detectTeamChoice(text: string): 'falcons' | 'lavender' | null {
  if (!text) return null;
  const clean = text.trim().toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

  if (clean.includes('صقور') || clean.includes('صقر') || clean.includes('الصقور')) {
    return 'falcons';
  }
  if (clean.includes('خزامي') || clean.includes('خزامى') || clean.includes('الخزامي') || clean.includes('الخزامى')) {
    return 'lavender';
  }
  return null;
}

/** Fisher-Yates shuffle — returns a NEW shuffled array */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function NationalDayLiveArena({
  activityId,
  activityTitle,
  questions,
  liveComments,
  onWinnerClaim,
  onExitArena
}: Props) {
  // ══════════════════════════════════════════════════
  // 1. PRE-GAME LOBBY CONFIGURATION STATE
  // ══════════════════════════════════════════════════
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<'solo' | 'teams'>('teams');
  const [timerMode, setTimerMode] = useState<'timed' | 'untimed'>('untimed');

  // Teams State (Falcons 🦅 vs Lavender 🌸)
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember>>({});
  const [teamScores, setTeamScores] = useState<{ falcons: number; lavender: number }>({
    falcons: 0,
    lavender: 0
  });

  // Derived teams lists
  const falconsList = useMemo(() => 
    Object.values(teamMembers).filter(m => m.team === 'falcons'),
    [teamMembers]
  );
  const lavenderList = useMemo(() => 
    Object.values(teamMembers).filter(m => m.team === 'lavender'),
    [teamMembers]
  );

  // ══════════════════════════════════════════════════
  // 2. IN-GAME STATE
  // ══════════════════════════════════════════════════
  const shuffledQuestions = useMemo(() => shuffleArray(questions), [questions]);

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [isAllQuestionsFinished, setIsAllQuestionsFinished] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(15);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  
  const [currentWinner, setCurrentWinner] = useState<{
    displayName: string;
    username: string;
    avatarUrl: string;
    points: number;
    team?: {
      id: 'falcons' | 'lavender';
      name: string;
      color?: string;
    };
  } | null>(null);

  // Manual test comment inputs
  const [testComment, setTestComment] = useState<string>('');
  const [testUser, setTestUser] = useState<string>('متسابق البث التجريبي');

  const currentQ = shuffledQuestions[currentIdx] || null;

  // Mark current question as used
  useEffect(() => {
    if (isGameStarted && currentQ && !usedQuestionIds.has(currentQ.id)) {
      setUsedQuestionIds(prev => new Set(prev).add(currentQ.id));
    }
  }, [isGameStarted, currentQ]);

  // Reset/configure question on start or index change
  useEffect(() => {
    if (!isGameStarted || !currentQ || isAllQuestionsFinished) return;
    setIsAnswerRevealed(false);
    setCurrentWinner(null);

    if (timerMode === 'timed') {
      setTimeRemaining(currentQ.timeLimitSeconds || 15);
      setIsTimerRunning(true);
    } else {
      setTimeRemaining(0);
      setIsTimerRunning(false);
    }

    soundFX.play('round_start');
  }, [isGameStarted, currentIdx, timerMode, isAllQuestionsFinished]);

  // Timer Countdown (only runs when timerMode === 'timed')
  useEffect(() => {
    if (!isGameStarted || timerMode !== 'timed' || !isTimerRunning || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          soundFX.play('time_up');
          return 0;
        }
        if (prev <= 4) {
          soundFX.play('countdown_tick');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameStarted, timerMode, isTimerRunning, timeRemaining]);

  // ══════════════════════════════════════════════════
  // 3. LIVE COMMENT LISTENER (Teams Recruitment & Answers)
  // ══════════════════════════════════════════════════
  useEffect(() => {
    if (liveComments.length === 0) return;
    const latestComment = liveComments[0];
    if (!latestComment || !latestComment.comment) return;

    const commentText = latestComment.comment.trim();
    const userId = latestComment.userId || latestComment.username || `user-${Date.now()}`;
    const username = latestComment.username || 'viewer';
    const displayName = latestComment.displayName || username;
    const avatarUrl = latestComment.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    // A. Team Join or Switch (works before start in lobby AND during match)
    if (gameMode === 'teams') {
      const teamChoice = detectTeamChoice(commentText);
      if (teamChoice) {
        setTeamMembers(prev => {
          const existing = prev[userId] || prev[username];
          // If already in that same team, no action needed
          if (existing && existing.team === teamChoice) return prev;

          soundFX.play('score_update');
          return {
            ...prev,
            [userId]: {
              userId,
              username,
              displayName,
              avatarUrl,
              team: teamChoice
            },
            // Also store by username for reliable lookup
            [username]: {
              userId,
              username,
              displayName,
              avatarUrl,
              team: teamChoice
            }
          };
        });
      }
    }

    // B. Live Answer Matching (only during active game when answer not yet revealed)
    if (isGameStarted && currentQ && !isAnswerRevealed && !currentWinner && !isAllQuestionsFinished) {
      if (isNationalDayAnswerMatch(commentText, currentQ)) {
        // Resolve user team if in teams mode
        let userTeamObj: { id: 'falcons' | 'lavender'; name: string } | undefined = undefined;
        if (gameMode === 'teams') {
          const registered = teamMembers[userId] || teamMembers[username];
          if (registered) {
            userTeamObj = {
              id: registered.team,
              name: registered.team === 'falcons' ? 'فريق الصقور 🦅' : 'فريق الخزامى 🌸'
            };
          }
        }

        handleDeclareWinner({
          userId,
          username,
          displayName,
          avatarUrl,
          points: currentQ.points,
          team: userTeamObj
        });
      }
    }
  }, [liveComments, isGameStarted, currentQ, isAnswerRevealed, currentWinner, isAllQuestionsFinished, gameMode, teamMembers]);

  // Declare Round Winner
  const handleDeclareWinner = (winnerData: {
    userId: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    points: number;
    team?: {
      id: 'falcons' | 'lavender';
      name: string;
      color?: string;
    };
  }) => {
    if (!currentQ) return;
    setIsTimerRunning(false);
    setIsAnswerRevealed(true);
    setCurrentWinner(winnerData);
    soundFX.play('winner_announcement');

    // If Teams mode and winner has a team, increment team score
    if (gameMode === 'teams' && winnerData.team) {
      setTeamScores(prev => ({
        ...prev,
        [winnerData.team!.id]: prev[winnerData.team!.id] + winnerData.points
      }));
    }

    onWinnerClaim({
      userId: winnerData.userId,
      username: winnerData.username,
      displayName: winnerData.displayName,
      avatarUrl: winnerData.avatarUrl,
      points: winnerData.points
    }, currentQ);
  };

  // Manual Test Submission
  const handleManualTestComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testComment.trim()) return;
    const cleanComment = testComment.trim();

    // Check if test comment is team selection
    if (gameMode === 'teams') {
      const teamChoice = detectTeamChoice(cleanComment);
      if (teamChoice) {
        const uId = `test-${testUser.trim() || 'user'}`;
        setTeamMembers(prev => ({
          ...prev,
          [uId]: {
            userId: uId,
            username: testUser.trim() || 'متسابق تجريبي',
            displayName: testUser.trim() || 'متسابق تجريبي',
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${testUser}`,
            team: teamChoice
          }
        }));
        soundFX.play('score_update');
        setTestComment('');
        return;
      }
    }

    // Check if test comment is answer
    if (!currentQ || isAnswerRevealed) return;

    if (isNationalDayAnswerMatch(cleanComment, currentQ)) {
      const uId = `test-${testUser.trim() || 'user'}`;
      let userTeamObj: { id: 'falcons' | 'lavender'; name: string } | undefined = undefined;
      if (gameMode === 'teams') {
        const registered = teamMembers[uId] || teamMembers[testUser.trim()];
        if (registered) {
          userTeamObj = {
            id: registered.team,
            name: registered.team === 'falcons' ? 'فريق الصقور 🦅' : 'فريق الخزامى 🌸'
          };
        } else {
          // Default to falcons for test if none
          userTeamObj = { id: 'falcons', name: 'فريق الصقور 🦅' };
        }
      }

      handleDeclareWinner({
        userId: uId,
        username: testUser.trim() || 'test_player',
        displayName: testUser.trim() || 'متسابق تجريبي',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${testUser}`,
        points: currentQ.points,
        team: userTeamObj
      });
    } else {
      soundFX.play('wrong_answer');
    }
    setTestComment('');
  };

  // Quick manual add/switch for host in lobby
  const handleQuickAddTeamMember = (team: 'falcons' | 'lavender') => {
    const randomId = Math.floor(Math.random() * 900) + 100;
    const name = team === 'falcons' ? `صقر_${randomId}` : `خزامى_${randomId}`;
    setTeamMembers(prev => ({
      ...prev,
      [name]: {
        userId: `user-${name}`,
        username: name,
        displayName: name,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        team
      }
    }));
    soundFX.play('score_update');
  };

  // Switch team for specific member
  const handleSwitchMemberTeam = (userId: string) => {
    setTeamMembers(prev => {
      const current = prev[userId];
      if (!current) return prev;
      const nextTeam = current.team === 'falcons' ? 'lavender' : 'falcons';
      soundFX.play('card_flip');
      return {
        ...prev,
        [userId]: {
          ...current,
          team: nextTeam
        }
      };
    });
  };

  // Next / Prev Navigation
  const handleNextQuestion = useCallback(() => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= shuffledQuestions.length) {
      setIsAllQuestionsFinished(true);
      setIsTimerRunning(false);
      soundFX.play('show_end');
      return;
    }
    setCurrentIdx(nextIdx);
  }, [currentIdx, shuffledQuestions.length]);

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      setIsAllQuestionsFinished(false);
    }
  };

  // Progress stats
  const totalQuestions = shuffledQuestions.length;
  const questionsAnswered = usedQuestionIds.size;
  const progressPercent = totalQuestions > 0 ? Math.round((questionsAnswered / totalQuestions) * 100) : 0;

  // ══════════════════════════════════════════════════
  // 🌟 PRE-GAME LOBBY SCREEN (عرض الخيارات قبل بدء المسابقة)
  // ══════════════════════════════════════════════════
  if (!isGameStarted) {
    return (
      <div className="w-full flex flex-col items-center gap-6 my-4 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Lobby Card */}
        <div className="w-full max-w-4xl p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#041D0F] via-[#03140A] to-[#020A05] border-2 border-[#00A859]/70 shadow-[0_20px_80px_rgba(0,168,89,0.25)] flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#006C35]/40 pb-5 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C69214] via-[#FFE79A] to-[#C69214] flex items-center justify-center text-slate-950 font-black shadow-[0_0_30px_rgba(198,146,20,0.6)]">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#00A859]/20 text-[#00A859] border border-[#00A859]/40 font-mono">
                    ROUND SETUP • إعدادات الجولة
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow">
                  تجهيز مسابقة: {activityTitle}
                </h2>
                <p className="text-xs text-[#E2D4B7]/80 font-bold">
                  اختر نظام التنافس وطريقة احتساب الوقت لبدء البث المباشر
                </p>
              </div>
            </div>

            <button
              onClick={onExitArena}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer border border-white/10"
            >
              ← العودة للفعاليات
            </button>
          </div>

          {/* 🎛️ OPTION 1: نظام التنافس (فردي أم فريقين) */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#006C35] text-[#FFE79A] flex items-center justify-center text-xs">1</span>
              <span>نظام التنافس في المسابقة:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option: سباق فردي */}
              <div
                onClick={() => {
                  setGameMode('solo');
                  soundFX.play('card_flip');
                }}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 relative ${
                  gameMode === 'solo'
                    ? 'bg-gradient-to-b from-[#092916] to-[#04160B] border-[#00A859] shadow-[0_0_25px_rgba(0,168,89,0.4)] scale-[1.02]'
                    : 'bg-black/30 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-black text-base">
                    <User className="w-5 h-5 text-[#C69214]" />
                    <span>سباق فردي</span>
                  </div>
                  {gameMode === 'solo' && (
                    <span className="w-6 h-6 rounded-full bg-[#00A859] text-slate-950 flex items-center justify-center text-xs font-black">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  كل متسابق في البث ينافس باسمه الفردي مباشرة، وأسرع مشاهد مجيب يحصل على النقطة.
                </p>
              </div>

              {/* Option: فريقين (الصقور vs الخزامى) */}
              <div
                onClick={() => {
                  setGameMode('teams');
                  soundFX.play('card_flip');
                }}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 relative ${
                  gameMode === 'teams'
                    ? 'bg-gradient-to-b from-[#180A26] to-[#0B0412] border-purple-400 shadow-[0_0_25px_rgba(192,132,252,0.4)] scale-[1.02]'
                    : 'bg-black/30 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-black text-base">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span>تحدي فريقين: الصقور 🦅 ضد الخزامى 🌸</span>
                  </div>
                  {gameMode === 'teams' && (
                    <span className="w-6 h-6 rounded-full bg-purple-400 text-slate-950 flex items-center justify-center text-xs font-black">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  ينضم المتابعون عبر الشات بكتابة «الصقور» أو «الخزامى»، وتُجمع نقاط الإجابات لحساب الفريق الفائز.
                </p>
              </div>
            </div>
          </div>

          {/* 🦅🌸 INTERACTIVE TEAMS RECRUITMENT LOBBY (shown if gameMode === 'teams') */}
          {gameMode === 'teams' && (
            <div className="flex flex-col gap-4 p-5 rounded-3xl bg-black/40 border border-[#006C35]/50 shadow-inner">
              
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📢</span>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      غرفة انضمام الفرق التفاعلية في شات البث
                    </h3>
                    <span className="text-xs text-[#E2D4B7]/80">
                      يكفي أن يكتب المشاهد في التعليقات اسم الفريق للانضمام، ويمكنه التغيير في أي وقت قبل البدء!
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickAddTeamMember('falcons')}
                    className="px-3 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all cursor-pointer"
                    title="إضافة متسابق تجريبي للصقور"
                  >
                    + تجربة للصقور
                  </button>
                  <button
                    onClick={() => handleQuickAddTeamMember('lavender')}
                    className="px-3 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer"
                    title="إضافة متسابق تجريبي للخزامى"
                  >
                    + تجربة للخزامى
                  </button>
                </div>
              </div>

              {/* Two Teams Cards Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 🦅 TEAM 1: FALCONS (فريق الصقور) */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0A2616] via-[#05170D] to-[#020D07] border-2 border-[#00A859] shadow-[0_0_20px_rgba(0,168,89,0.3)] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🦅</span>
                      <div>
                        <h4 className="text-base font-black text-emerald-300">فريق الصقور</h4>
                        <span className="text-[11px] text-slate-300 font-mono">اكتب «الصقور» أو «صقور»</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-black text-xs">
                      {falconsList.length} متسابق
                    </span>
                  </div>

                  {/* Members List */}
                  <div className="w-full min-h-[90px] max-h-[140px] overflow-y-auto p-3 rounded-xl bg-black/50 border border-white/5 flex flex-wrap gap-2 content-start">
                    {falconsList.map(member => (
                      <div 
                        key={member.userId} 
                        className="px-2.5 py-1 rounded-xl bg-emerald-900/50 border border-emerald-500/40 text-white flex items-center gap-2 text-xs hover:border-purple-400 cursor-pointer transition-colors group"
                        onClick={() => handleSwitchMemberTeam(member.userId)}
                        title="انقر لنقله إلى فريق الخزامى"
                      >
                        <img src={member.avatarUrl} alt={member.displayName} className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-bold truncate max-w-[90px]">{member.displayName}</span>
                        <RefreshCw className="w-3 h-3 text-slate-400 group-hover:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    {falconsList.length === 0 && (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs py-4">
                        بانتظار انضمام الصقور من شات البث...
                      </div>
                    )}
                  </div>
                </div>

                {/* 🌸 TEAM 2: LAVENDER (فريق الخزامى) */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#240C33] via-[#15061F] to-[#0A0210] border-2 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.3)] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🌸</span>
                      <div>
                        <h4 className="text-base font-black text-purple-300">فريق الخزامى</h4>
                        <span className="text-[11px] text-slate-300 font-mono">اكتب «الخزامى» أو «خزامى»</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-black text-xs">
                      {lavenderList.length} متسابق
                    </span>
                  </div>

                  {/* Members List */}
                  <div className="w-full min-h-[90px] max-h-[140px] overflow-y-auto p-3 rounded-xl bg-black/50 border border-white/5 flex flex-wrap gap-2 content-start">
                    {lavenderList.map(member => (
                      <div 
                        key={member.userId} 
                        className="px-2.5 py-1 rounded-xl bg-purple-900/50 border border-purple-500/40 text-white flex items-center gap-2 text-xs hover:border-emerald-400 cursor-pointer transition-colors group"
                        onClick={() => handleSwitchMemberTeam(member.userId)}
                        title="انقر لنقله إلى فريق الصقور"
                      >
                        <img src={member.avatarUrl} alt={member.displayName} className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-bold truncate max-w-[90px]">{member.displayName}</span>
                        <RefreshCw className="w-3 h-3 text-slate-400 group-hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    {lavenderList.length === 0 && (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs py-4">
                        بانتظار انضمام الخزامى من شات البث...
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <div className="text-[11px] text-[#E2D4B7]/70 text-center font-bold">
                💡 ملاحظة: إذا كتب نفس المستخدم اسم الفريق الآخر في أي لحظة، ينتقل فريقه فورياً!
              </div>

            </div>
          )}

          {/* ⏱️ OPTION 2: نظام الوقت (بوقت أم بدون وقت) */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#006C35] text-[#FFE79A] flex items-center justify-center text-xs">2</span>
              <span>طريقة احتساب الوقت للسؤال:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option: بدون وقت (مفتوح) */}
              <div
                onClick={() => {
                  setTimerMode('untimed');
                  soundFX.play('card_flip');
                }}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 relative ${
                  timerMode === 'untimed'
                    ? 'bg-gradient-to-b from-[#092916] to-[#04160B] border-[#00A859] shadow-[0_0_25px_rgba(0,168,89,0.4)] scale-[1.02]'
                    : 'bg-black/30 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-black text-base">
                    <InfinityIcon className="w-5 h-5 text-[#00A859]" />
                    <span>بدون وقت (مفتوح حتى الجواب)</span>
                  </div>
                  {timerMode === 'untimed' && (
                    <span className="w-6 h-6 rounded-full bg-[#00A859] text-slate-950 flex items-center justify-center text-xs font-black">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  السؤال يبقى مستمراً في البث بدون عداد تنازلي، وفور إجابة أي فريق/متسابق بالجواب الصحيح يتم إظهار الحل وإعلان الفائز مباشرة.
                </p>
              </div>

              {/* Option: بوقت (مؤقت تنازلي) */}
              <div
                onClick={() => {
                  setTimerMode('timed');
                  soundFX.play('card_flip');
                }}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 relative ${
                  timerMode === 'timed'
                    ? 'bg-gradient-to-b from-[#092916] to-[#04160B] border-[#00A859] shadow-[0_0_25px_rgba(0,168,89,0.4)] scale-[1.02]'
                    : 'bg-black/30 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-black text-base">
                    <Clock className="w-5 h-5 text-[#C69214]" />
                    <span>كل سؤال بوقت (مؤقت 15 ثانية)</span>
                  </div>
                  {timerMode === 'timed' && (
                    <span className="w-6 h-6 rounded-full bg-[#00A859] text-slate-950 flex items-center justify-center text-xs font-black">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  عداد تنازلي رقمي مع أصوات تكتكة ونهاية الوقت لكل سؤال لزيادة الحماس والسرعة.
                </p>
              </div>
            </div>
          </div>

          {/* 🚀 START COMPETITION BUTTON */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsGameStarted(true);
                soundFX.play('round_start');
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#006C35] via-[#00A859] to-[#006C35] text-white font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(0,168,89,0.6)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-2 border-[#FFE79A]/40"
            >
              <span>🚀 بدء المسابقة الآن</span>
              <span className="text-xs font-normal opacity-90 px-3 py-1 rounded-full bg-black/20 border border-white/10">
                {gameMode === 'teams' ? 'تحدي الصقور ضد الخزامى' : 'سباق فردي'} • {timerMode === 'untimed' ? 'بدون وقت' : 'مؤقت تنازلي'}
              </span>
            </button>
          </div>

        </div>

      </div>
    );
  }

  // ══════════════════════════════════════════════════
  // 🏆 ALL QUESTIONS FINISHED SCREEN
  // ══════════════════════════════════════════════════
  if (isAllQuestionsFinished) {
    const isFalconsWinner = teamScores.falcons > teamScores.lavender;
    const isLavenderWinner = teamScores.lavender > teamScores.falcons;
    const isTie = teamScores.falcons === teamScores.lavender;

    return (
      <div className="w-full flex flex-col items-center gap-6 my-8">
        <div className="w-full max-w-3xl p-10 rounded-3xl bg-gradient-to-b from-[#041D0F] via-[#082915] to-[#041D0F] border-2 border-[#00A859]/60 shadow-[0_20px_80px_rgba(0,168,89,0.3)] flex flex-col items-center text-center gap-6">
          
          {/* Trophy */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#C69214] via-[#FFE79A] to-[#C69214] flex items-center justify-center shadow-[0_0_60px_rgba(198,146,20,0.5)] animate-bounce">
            <Trophy className="w-12 h-12 text-slate-900" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE79A] via-white to-[#FFE79A]">
            🏆 انتهت المسابقة بنجاح!
          </h2>

          {/* Teams Result Announcement */}
          {gameMode === 'teams' && (
            <div className="w-full p-6 rounded-2xl bg-black/40 border border-[#00A859]/50 flex flex-col items-center gap-4">
              <span className="text-xs font-mono font-black text-[#E2D4B7]">
                النتيجة النهائية للمواجهة
              </span>
              
              <div className="flex items-center justify-center gap-6 text-xl sm:text-2xl font-black">
                <div className={`p-4 rounded-2xl border ${isFalconsWinner ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  🦅 الصقور: {teamScores.falcons} نقطة
                </div>
                <span className="text-slate-500 font-mono">VS</span>
                <div className={`p-4 rounded-2xl border ${isLavenderWinner ? 'bg-purple-950/80 border-purple-400 text-purple-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  🌸 الخزامى: {teamScores.lavender} نقطة
                </div>
              </div>

              <div className="text-lg font-black text-[#FFE79A] mt-2">
                {isFalconsWinner && '👑 بطل الجولة: فريق الصقور 🦅 تهانينا!'}
                {isLavenderWinner && '👑 بطل الجولة: فريق الخزامى 🌸 تهانينا!'}
                {isTie && '🤝 تعادل بطولي رائع بين الفريقين!'}
              </div>
            </div>
          )}
          
          <p className="text-base text-[#E2D4B7] font-bold leading-relaxed max-w-md">
            تمت الإجابة على جميع أسئلة مسابقة <strong className="text-[#00A859]">{activityTitle}</strong>.
            <br />
            عدد الأسئلة الكلي: <strong className="text-[#FFE79A]">{totalQuestions} سؤال</strong>
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
            <button
              onClick={() => {
                setCurrentIdx(0);
                setUsedQuestionIds(new Set());
                setIsAllQuestionsFinished(false);
                setIsGameStarted(false);
                setTeamScores({ falcons: 0, lavender: 0 });
              }}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#006C35] to-[#00A859] text-white font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>إعادة ضبط وتكرار المسابقة</span>
            </button>

            <button
              onClick={onExitArena}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm cursor-pointer transition-all"
            >
              العودة للقائمة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No questions available
  if (!currentQ) {
    return (
      <div className="w-full py-20 text-center text-white flex flex-col items-center gap-4">
        <span className="text-xl font-bold">لا توجد أسئلة لهذه الفعالية حالياً</span>
        <button onClick={onExitArena} className="px-6 py-2 rounded-xl bg-[#006C35] text-white text-xs font-bold">
          العودة للقائمة
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 my-2">
      
      {/* 📺 TOP BROADCAST CONTROL BAR */}
      <div className="w-full max-w-5xl flex items-center justify-between bg-[#05140C] p-3 rounded-2xl border border-[#006C35]/50 flex-wrap gap-2 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGameStarted(false)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer border border-white/10"
            title="إعادة ضبط إعدادات الجولة والفرق"
          >
            ⚙️ إعدادات الجولة
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-[#004D25] text-[#00A859] border border-[#00A859]/30 text-xs font-black font-mono">
              {activityTitle}
            </span>

            {gameMode === 'teams' ? (
              <span className="px-2 py-0.5 rounded-lg bg-purple-900/40 text-purple-300 border border-purple-500/30 text-[11px] font-black font-mono">
                فريقين (صقور ضد خزامى)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-black font-mono">
                سباق فردي
              </span>
            )}

            <span className="text-xs font-black text-white font-mono">
              سؤال #{currentIdx + 1} من {totalQuestions}
            </span>

            {/* Progress bar */}
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#00A859] to-[#C69214] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Aspect Ratio & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#020D06] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                aspectRatio === '16:9' ? 'bg-[#006C35] text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>16:9 شاشة عريضة</span>
            </button>

            <button
              onClick={() => setAspectRatio('9:16')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                aspectRatio === '9:16' ? 'bg-[#006C35] text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16 عمودي</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🎪 MAIN BROADCAST ARENA SCREEN */}
      <div 
        className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#041D0F] via-[#021008] to-[#05170D] border-2 border-[#00A859]/60 shadow-[0_20px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between p-6 sm:p-8 text-white transition-all duration-500 ${
          aspectRatio === '16:9' ? 'max-w-5xl aspect-video min-h-[500px]' : 'max-w-md min-h-[640px] aspect-[9/16]'
        }`}
      >
        {/* Background Atmospheric Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00A859]/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#C69214]/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. ARENA TOP HUD (Teams Score, Category, Timer) */}
        <div className="w-full flex items-center justify-between z-10 flex-wrap gap-2">
          
          {/* Category or Teams Score */}
          <div className="flex items-center gap-2">
            {gameMode === 'teams' ? (
              <div className="flex items-center gap-2 bg-[#020A05]/90 border border-white/10 p-1.5 rounded-2xl shadow-lg backdrop-blur-md">
                {/* Falcons Score */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-black">
                  <span>🦅 الصقور:</span>
                  <span className="font-mono text-sm text-[#FFE79A]">{teamScores.falcons}</span>
                </div>

                <span className="text-[10px] text-slate-500 font-mono font-bold">VS</span>

                {/* Lavender Score */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-black">
                  <span>🌸 الخزامى:</span>
                  <span className="font-mono text-sm text-pink-300">{teamScores.lavender}</span>
                </div>
              </div>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full bg-[#082915] border border-[#00A859]/50 text-xs font-black font-mono text-[#E2D4B7] shadow-md">
                🇸🇦 {currentQ.category}
              </span>
            )}
          </div>

          {/* Timer Display (Timed Countdown OR Open Untimed) */}
          <div className="flex items-center gap-2">
            {timerMode === 'timed' ? (
              <div className={`px-4 py-1.5 rounded-2xl border flex items-center gap-2 shadow-lg backdrop-blur-md transition-all ${
                timeRemaining <= 4 && isTimerRunning
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_25px_rgba(244,63,94,0.6)]'
                  : 'bg-[#051C0E]/90 border-[#00A859]/60 text-white'
              }`}>
                <Clock className="w-4 h-4 text-[#C69214]" />
                <span className="text-xl sm:text-2xl font-black font-mono">
                  00:{String(timeRemaining).padStart(2, '0')}
                </span>
              </div>
            ) : (
              /* Untimed Open Indicator */
              <div className="px-3.5 py-1.5 rounded-2xl border border-emerald-500/50 bg-[#004D25]/70 text-emerald-200 flex items-center gap-2 shadow-[0_0_20px_rgba(0,168,89,0.3)] backdrop-blur-md">
                <InfinityIcon className="w-4 h-4 text-[#FFE79A] animate-pulse" />
                <span className="text-xs font-black font-mono">
                  بدون وقت (مفتوح)
                </span>
              </div>
            )}

            <span className="px-3 py-1.5 rounded-xl bg-[#C69214]/20 border border-[#C69214]/50 text-[#E2D4B7] text-xs font-mono font-black">
              +{currentQ.points} نقطة
            </span>
          </div>
        </div>

        {/* 2. CENTER STAGE: QUESTION & MEDIA DISPLAY */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto my-auto gap-4 w-full h-full flex-1">
          
          {/* 🗺️ SPLIT SCREEN FOR MAP CHALLENGE */}
          {currentQ.mediaType === 'map-province' ? (
            <div className={`w-full h-full flex items-center justify-between gap-6 animate-in zoom-in-95 ${
              aspectRatio === '16:9' ? 'flex-row' : 'flex-col'
            }`}>
              
              {/* Map half */}
              <div className={`flex items-center justify-center relative p-3 rounded-3xl bg-[#04190D]/80 border border-[#006C35]/60 shadow-xl ${
                aspectRatio === '16:9' ? 'w-1/2 h-full max-h-[420px]' : 'w-full aspect-[800/650]'
              }`}>
                <NationalDayMapChallenge
                  targetProvince={currentQ.targetProvince}
                  isAnswerRevealed={isAnswerRevealed}
                />
              </div>

              {/* Question half */}
              <div className={`flex flex-col justify-center items-center text-right p-6 sm:p-8 rounded-3xl bg-[#052110]/95 border-2 border-[#00A859]/70 shadow-[0_15px_45px_rgba(0,0,0,0.9)] backdrop-blur-xl gap-4 ${
                aspectRatio === '16:9' ? 'w-1/2 min-h-[320px]' : 'w-full'
              }`}>
                
                <div className="w-full flex items-center justify-between border-b border-[#00A859]/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#004D25] text-[#00A859] border border-[#00A859]/40 text-xs font-black font-mono">
                      تحدي خريطة الوطن 🗺️
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-[#FFE79A] px-2.5 py-0.5 rounded-full bg-[#C69214]/20 border border-[#C69214]/40">
                    +{currentQ.points} نقطة
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2D4B7] to-[#FFE79A] leading-relaxed drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] text-center my-auto">
                  {currentQ.question}
                </h2>

                {isAnswerRevealed ? (
                  <div className="w-full flex flex-col gap-2 animate-bounce">
                    <div className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#006C35] to-[#00A859] border-2 border-[#FFE79A] shadow-[0_0_30px_rgba(0,168,89,0.7)] text-white text-base sm:text-lg font-black font-mono text-center">
                      ✓ الإجابة: {currentQ.correctAnswer}
                    </div>

                    {currentWinner && (
                      <div className="w-full py-2 px-3 rounded-xl bg-black/60 border border-white/20 text-center text-xs font-bold text-[#FFE79A]">
                        {currentWinner.team ? (
                          <span>🎉 نقطة لـ {currentWinner.team.name} بواسطة @{currentWinner.username}</span>
                        ) : (
                          <span>🎉 الفائز بالجولة: @{currentWinner.username}</span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full py-2 px-4 rounded-xl bg-black/40 border border-white/10 text-center text-xs font-bold text-slate-300">
                    اكتب اسم المنطقة المحددة باللون الذهبي في شات البث 💬
                  </div>
                )}

              </div>

            </div>
          ) : (
            /* 🏆 STANDARD QUESTION LAYOUT */
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              {/* 📍 Region / Category Badge directly ABOVE question */}
              {currentQ.category && (
                <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#006C35]/80 via-[#0A3D1E]/90 to-[#006C35]/80 border-2 border-[#FFE79A]/60 shadow-[0_0_25px_rgba(0,168,89,0.5)] flex items-center gap-2 animate-in zoom-in-95">
                  <span className="text-sm">📍</span>
                  <span className="text-sm sm:text-base font-black text-[#FFE79A] font-mono tracking-wide drop-shadow">
                    {currentQ.category}
                  </span>
                </div>
              )}

              {/* Question Text */}
              <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2D4B7] to-[#FFE79A] leading-relaxed drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
                {currentQ.question}
              </h2>

              {/* 📸 Media: Image directly BELOW question */}
              {Boolean(currentQ.mediaUrl) && (
                <div className="relative w-full max-w-xl h-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-[#00A859]/70 shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in zoom-in-95 bg-[#020D06] flex items-center justify-center my-2">
                  <img src={currentQ.mediaUrl} alt="صورة السؤال" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Revealed Answer Banner */}
              {isAnswerRevealed && (
                <div className="flex flex-col items-center gap-2 animate-bounce">
                  <div className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#006C35] to-[#00A859] border-2 border-[#E2D4B7] shadow-[0_0_35px_rgba(0,168,89,0.7)] text-white text-lg sm:text-xl font-black font-mono">
                    ✓ الإجابة: {currentQ.correctAnswer}
                  </div>

                  {currentWinner && (
                    <div className="px-6 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs font-bold text-[#FFE79A]">
                      {currentWinner.team ? (
                        <span>🎉 نقطة لـ {currentWinner.team.name} بواسطة @{currentWinner.username}</span>
                      ) : (
                        <span>🎉 الفائز بالجولة: @{currentWinner.username}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* 3. ARENA BOTTOM HUD */}
        <div className="w-full flex items-center justify-between z-10 pt-4 border-t border-white/10 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-[#00A859] flex items-center gap-1">
              <Radio className="w-4 h-4 text-rose-500 animate-ping" />
              <span>البث متصل:</span>
            </span>
            <span className="text-xs text-slate-300 font-bold">
              {gameMode === 'teams' 
                ? 'اكتب الإجابة في التعليقات لحساب نقطة لفريقك!' 
                : 'اكتب الإجابة في التعليقات لأول فائز!'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-black flex items-center gap-1 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C69214]" />
              <span>{isAnswerRevealed ? 'إخفاء الإجابة' : 'كشف الإجابة'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 🎮 4. STREAMER / HOST CONTROL DESK */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Host Live Game Controls */}
        <div className="p-4 rounded-2xl bg-[#081B10] border border-[#006C35]/50 flex items-center justify-between gap-3 shadow-lg flex-wrap">
          <div className="flex items-center gap-2">
            {timerMode === 'timed' && (
              <>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    isTimerRunning
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'إيقاف العداد' : 'تشغيل العداد'}</span>
                </button>

                <button
                  onClick={() => setTimeRemaining(currentQ?.timeLimitSeconds || 15)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all cursor-pointer"
                  title="إعادة ضبط الوقت"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}

            {timerMode === 'untimed' && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <InfinityIcon className="w-3.5 h-3.5 text-[#FFE79A]" />
                <span>مفتوح بدون وقت</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevQuestion}
              disabled={currentIdx === 0}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#006C35] to-[#00A859] text-white text-xs font-black flex items-center gap-1 shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <span>{currentIdx >= totalQuestions - 1 ? 'إنهاء المسابقة' : 'السؤال التالي'}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Chat Testing Box */}
        <form onSubmit={handleManualTestComment} className="p-4 rounded-2xl bg-[#081B10] border border-[#006C35]/50 flex items-center gap-2 shadow-lg">
          <input
            type="text"
            placeholder={gameMode === 'teams' ? "اكتب 'الصقور' أو 'الخزامى' أو الجواب الصحيح..." : "اكتب إجابة تجريبية لاختبار احتساب الفائز..."}
            value={testComment}
            onChange={e => setTestComment(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-[#030F08] border border-white/10 text-white text-xs font-bold focus:border-[#00A859] outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#C69214] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إرسال</span>
          </button>
        </form>

      </div>

      {/* 🏆 WINNER CROWNING MODAL */}
      {currentWinner && currentQ && (
        <NationalDayWinnerModal
          winner={currentWinner}
          question={currentQ}
          onNextQuestion={handleNextQuestion}
          onClose={() => setCurrentWinner(null)}
        />
      )}

    </div>
  );
}
