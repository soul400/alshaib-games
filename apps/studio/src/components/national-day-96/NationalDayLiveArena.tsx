'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  NationalDayQuestion, NationalDay96ActivityId, TikTokLiveComment 
} from '@aep/types';
import { 
  Trophy, Sparkles, Clock, Play, Pause, RotateCcw, 
  ChevronRight, ChevronLeft, Eye, Volume2, VolumeX, CheckCircle2, 
  HelpCircle, Star, Tv, Smartphone, Send, Radio, Compass, Binary, Film, Flame, Mic, Image as ImageIcon
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
  // Shuffle questions once on mount / when questions array changes
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
  } | null>(null);

  // Manual test answer input
  const [testComment, setTestComment] = useState<string>('');
  const [testUser, setTestUser] = useState<string>('متسابق البث التجريبي');

  const currentQ = shuffledQuestions[currentIdx] || null;

  // Mark current question as used on mount
  useEffect(() => {
    if (currentQ && !usedQuestionIds.has(currentQ.id)) {
      setUsedQuestionIds(prev => new Set(prev).add(currentQ.id));
    }
  }, [currentQ]);

  // Initialize timer on question change
  useEffect(() => {
    if (!currentQ || isAllQuestionsFinished) return;
    setTimeRemaining(currentQ.timeLimitSeconds || 15);
    setIsAnswerRevealed(false);
    setIsTimerRunning(true);
    setCurrentWinner(null);
    soundFX.play('round_start');
  }, [currentIdx, isAllQuestionsFinished]);

  // Timer Tick
  useEffect(() => {
    if (!isTimerRunning || timeRemaining <= 0) return;

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
  }, [isTimerRunning, timeRemaining]);

  // Listen to Live TikTok Comments
  useEffect(() => {
    if (!currentQ || isAnswerRevealed || currentWinner || liveComments.length === 0 || isAllQuestionsFinished) return;

    const latestComment = liveComments[0];
    if (!latestComment || !latestComment.comment) return;

    if (isNationalDayAnswerMatch(latestComment.comment, currentQ)) {
      handleDeclareWinner({
        userId: latestComment.userId || `user-${Date.now()}`,
        username: latestComment.username || 'viewer',
        displayName: latestComment.displayName || latestComment.username || 'مشارك البث',
        avatarUrl: latestComment.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${latestComment.username}`,
        points: currentQ.points
      });
    }
  }, [liveComments, currentQ, isAnswerRevealed, currentWinner, isAllQuestionsFinished]);

  const handleDeclareWinner = (winnerData: {
    userId: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    points: number;
  }) => {
    if (!currentQ) return;
    setIsTimerRunning(false);
    setIsAnswerRevealed(true);
    setCurrentWinner(winnerData);
    soundFX.play('winner_announcement');
    onWinnerClaim(winnerData, currentQ);
  };

  const handleManualTestComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testComment.trim() || !currentQ || isAnswerRevealed) return;

    if (isNationalDayAnswerMatch(testComment.trim(), currentQ)) {
      handleDeclareWinner({
        userId: `test-${Date.now()}`,
        username: 'test_player',
        displayName: testUser.trim() || 'متسابق تجريبي',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${testUser}`,
        points: currentQ.points
      });
    } else {
      soundFX.play('wrong_answer');
    }
    setTestComment('');
  };

  const handleNextQuestion = useCallback(() => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= shuffledQuestions.length) {
      // All questions finished!
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
  // 🏆 ALL QUESTIONS FINISHED SCREEN
  // ══════════════════════════════════════════════════
  if (isAllQuestionsFinished) {
    return (
      <div className="w-full flex flex-col items-center gap-6 my-8">
        <div className="w-full max-w-3xl p-10 rounded-3xl bg-gradient-to-b from-[#041D0F] via-[#082915] to-[#041D0F] border-2 border-[#00A859]/60 shadow-[0_20px_80px_rgba(0,168,89,0.3)] flex flex-col items-center text-center gap-6">
          
          {/* Trophy */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#C69214] via-[#FFE79A] to-[#C69214] flex items-center justify-center shadow-[0_0_60px_rgba(198,146,20,0.5)] animate-bounce">
            <Trophy className="w-12 h-12 text-slate-900" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE79A] via-white to-[#FFE79A]">
            🏆 تم الانتهاء من جميع الأسئلة!
          </h2>
          
          <p className="text-base text-[#E2D4B7] font-bold leading-relaxed max-w-md">
            أحسنتم! تمت الإجابة على جميع أسئلة مسابقة <strong className="text-[#00A859]">{activityTitle}</strong> بنجاح.
            <br />
            عدد الأسئلة الكلي: <strong className="text-[#FFE79A]">{totalQuestions} سؤال</strong>
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
            <button
              onClick={() => {
                setCurrentIdx(0);
                setUsedQuestionIds(new Set());
                setIsAllQuestionsFinished(false);
              }}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#006C35] to-[#00A859] text-white font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>إعادة المسابقة من البداية</span>
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
            onClick={onExitArena}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            ← إنهاء الفعالية
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-[#004D25] text-[#00A859] border border-[#00A859]/30 text-xs font-black font-mono">
              {activityTitle}
            </span>
            <span className="text-xs font-black text-white font-mono">
              سؤال #{currentIdx + 1} من {totalQuestions}
            </span>
            {/* Progress bar */}
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#00A859] to-[#C69214] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Aspect Ratio & Sound */}
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
              <span>9:16 تيك توك عمودي</span>
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

        {/* 1. ARENA TOP HUD (Category, Timer, Points) */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-[#082915] border border-[#00A859]/50 text-xs font-black font-mono text-[#E2D4B7] shadow-md">
              🇸🇦 {currentQ.category}
            </span>
          </div>

          {/* Big Digital Timer */}
          <div className="flex items-center gap-2">
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
                  <div className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#006C35] to-[#00A859] border-2 border-[#FFE79A] shadow-[0_0_30px_rgba(0,168,89,0.7)] text-white text-base sm:text-lg font-black font-mono text-center animate-bounce">
                    ✓ الإجابة: {currentQ.correctAnswer}
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
              {/* Question Text */}
              <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2D4B7] to-[#FFE79A] leading-relaxed drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
                {currentQ.question}
              </h2>

              {/* Media: Image below question */}
              {currentQ.mediaType === 'image' && currentQ.mediaUrl && (
                <div className="relative w-full max-w-md h-52 rounded-2xl overflow-hidden border-2 border-[#00A859]/60 shadow-2xl animate-in zoom-in-95">
                  <img src={currentQ.mediaUrl} alt="صورة السؤال" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Revealed Answer Banner */}
              {isAnswerRevealed && (
                <div className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#006C35] to-[#00A859] border-2 border-[#E2D4B7] shadow-[0_0_35px_rgba(0,168,89,0.7)] text-white text-lg sm:text-xl font-black font-mono animate-bounce">
                  ✓ الإجابة: {currentQ.correctAnswer}
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
              اكتب الإجابة في التعليقات لأول فائز!
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
            placeholder="اكتب إجابة تجريبية لاختبار احتساب الفائز..."
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
