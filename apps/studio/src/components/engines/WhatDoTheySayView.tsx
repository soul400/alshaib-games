'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WhatDoTheySayQuestion, WhatDoTheySayAnswer, WhatDoTheySayRevealer, WhatDoTheySayMode } from '@aep/types';
import { useStudioStore } from '../../store/useStudioStore';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { isAnswerMatch, normalizeAnswer } from '@aep/game-engines';
import { 
  Trophy, Sparkles, CheckCircle2, Eye, EyeOff, Users, Flag, Flame, 
  HelpCircle, RefreshCw, Send, ArrowRight, ArrowLeft, Star, Award, Shield, User,
  ChevronLeft, ChevronRight, Check, Radio
} from 'lucide-react';

interface Props {
  question: WhatDoTheySayQuestion;
  isAnswerRevealed?: boolean;
}

export function WhatDoTheySayView({ question }: Props) {
  const { liveComments, tiktokEngine, controlState, nextQuestion } = useStudioStore();

  const [answers, setAnswers] = useState<WhatDoTheySayAnswer[]>(() => {
    return question?.answers?.map(a => ({ ...a })) || [];
  });

  const [mode, setMode] = useState<WhatDoTheySayMode>('SOLO');
  const [redTeamScore, setRedTeamScore] = useState<number>(0);
  const [blueTeamScore, setBlueTeamScore] = useState<number>(0);
  const [lastRevealedAnswer, setLastRevealedAnswer] = useState<WhatDoTheySayAnswer | null>(null);
  const [manualInput, setManualInput] = useState<string>('');

  const processedCommentIds = useRef<Set<string>>(new Set());

  // Reset when question changes & mark all existing comments as already processed so history is ignored
  useEffect(() => {
    if (question?.answers) {
      setAnswers(question.answers.map(a => ({ ...a, isRevealed: false, revealedBy: undefined })));
      setLastRevealedAnswer(null);
      processedCommentIds.current.clear();

      // Pre-mark all comments currently in store so old history is never evaluated
      if (liveComments && liveComments.length > 0) {
        liveComments.forEach(c => {
          if (c) {
            const cid = c.id || `${c.userId}-${c.timestamp || Date.now()}`;
            processedCommentIds.current.add(cid);
          }
        });
      }
    }
  }, [question?.id]);

  // Process an answer candidate (from chat or manual input)
  const handleCheckAnswerCandidate = useCallback((candidateText: string, authorInfo?: { userId: string; username: string; displayName: string; avatarUrl: string }) => {
    if (!candidateText || !candidateText.trim()) return;

    // We collect side-effect data outside setAnswers, then run side effects after
    const pendingEffects: Array<{ revealer: WhatDoTheySayRevealer; points: number; team: 'RED' | 'BLUE'; revealedAns: WhatDoTheySayAnswer }> = [];

    setAnswers(prevAnswers => {
      let matchFound = false;
      const updated = prevAnswers.map(ans => {
        if (ans.isRevealed || matchFound) return ans;

        // Build list of target accepted variants
        const acceptableVariants = [ans.title, ...(ans.aliases || [])];

        if (isAnswerMatch(candidateText, acceptableVariants)) {
          matchFound = true;

          const assignedTeam: 'RED' | 'BLUE' = Math.random() > 0.5 ? 'RED' : 'BLUE';

          const revealer: WhatDoTheySayRevealer = {
            userId: authorInfo?.userId || `user-${Date.now()}`,
            username: authorInfo?.username || '@viewer',
            displayName: authorInfo?.displayName || authorInfo?.username || 'متابع البث',
            avatarUrl: authorInfo?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
            revealedAt: Date.now(),
            team: assignedTeam
          };

          const revealedAns: WhatDoTheySayAnswer = {
            ...ans,
            isRevealed: true,
            revealedBy: revealer
          };

          // Collect side effects to run AFTER setAnswers completes
          pendingEffects.push({ revealer, points: ans.points, team: assignedTeam, revealedAns });

          return revealedAns;
        }

        return ans;
      });

      return updated;
    });

    // Run all side effects OUTSIDE the state updater (deferred to next microtask)
    if (pendingEffects.length > 0) {
      setTimeout(() => {
        for (const effect of pendingEffects) {
          // Audio & Visual Effects
          soundFX.play('winner_announcement');
          triggerVisualEffect('confetti');
          setLastRevealedAnswer(effect.revealedAns);

          // Award points to player on the persistent leaderboard
          if (tiktokEngine && effect.revealer.userId !== 'host') {
            tiktokEngine.awardPoints({
              userId: effect.revealer.userId,
              username: effect.revealer.username,
              displayName: effect.revealer.displayName,
              avatarUrl: effect.revealer.avatarUrl,
              points: effect.points
            });
          }

          // Update Team Scores if in TEAM mode
          if (effect.team === 'RED') {
            setRedTeamScore(s => s + effect.points);
          } else {
            setBlueTeamScore(s => s + effect.points);
          }

          // Clear banner spotlight after 4.5s
          setTimeout(() => {
            setLastRevealedAnswer(null);
          }, 4500);
        }
      }, 0);
    }
  }, [tiktokEngine]);

  // Listen to incoming TikTok Live comments exclusively via direct real-time callback
  useEffect(() => {
    if (!tiktokEngine) return;

    const handleIncomingComment = (commentObj: any) => {
      if (!commentObj) return;
      const commentText = (commentObj.comment || commentObj.commentText || '').trim();
      if (!commentText) return;

      const commentId = commentObj.id || `${commentObj.userId}-${commentObj.timestamp || Date.now()}`;
      if (processedCommentIds.current.has(commentId)) return;
      processedCommentIds.current.add(commentId);

      handleCheckAnswerCandidate(commentText, {
        userId: commentObj.userId,
        username: commentObj.username,
        displayName: commentObj.displayName || commentObj.username,
        avatarUrl: commentObj.avatarUrl
      });
    };

    tiktokEngine.onComment(handleIncomingComment);
    return () => {
      tiktokEngine.offComment(handleIncomingComment);
    };
  }, [tiktokEngine, handleCheckAnswerCandidate]);

  // Host manual reveal single card
  const handleHostRevealAnswer = (rank: number) => {
    setAnswers(prev => prev.map(a => {
      if (a.rank === rank) {
        soundFX.play('score_update');
        return {
          ...a,
          isRevealed: true,
          revealedBy: a.revealedBy || {
            userId: 'host',
            username: '@host',
            displayName: 'مقدم البث 🎙️',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
            revealedAt: Date.now()
          }
        };
      }
      return a;
    }));
  };

  // Host Reveal All
  const handleRevealAll = () => {
    soundFX.play('show_end');
    triggerVisualEffect('confetti');
    setAnswers(prev => prev.map(a => ({
      ...a,
      isRevealed: true,
      revealedBy: a.revealedBy || {
        userId: 'host',
        username: '@host',
        displayName: 'كشف جماعي',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
        revealedAt: Date.now()
      }
    })));
  };

  // Host Reset
  const handleReset = () => {
    setAnswers(prev => prev.map(a => ({ ...a, isRevealed: false, revealedBy: undefined })));
    setLastRevealedAnswer(null);
    setRedTeamScore(0);
    setBlueTeamScore(0);
    processedCommentIds.current.clear();
  };

  const totalPoints = answers.reduce((sum, a) => sum + a.points, 200);
  const discoveredPoints = answers.filter(a => a.isRevealed).reduce((sum, a) => sum + a.points, 0);
  const revealedCount = answers.filter(a => a.isRevealed).length;
  const isAllRevealed = revealedCount === answers.length && answers.length > 0;

  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);

  // Stable ref so the interval always calls the latest nextQuestion without re-creating the effect
  const nextQuestionRef = useRef(nextQuestion);
  nextQuestionRef.current = nextQuestion;

  // When all 10 answers are revealed, trigger fanfare and auto-transition after 4 seconds
  useEffect(() => {
    if (!isAllRevealed) {
      setAutoNextCountdown(null);
      return;
    }

    soundFX.play('show_end');
    triggerVisualEffect('confetti');
    let count = 4;
    setAutoNextCountdown(count);

    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        setAutoNextCountdown(null);
        // Call nextQuestion outside any setState updater
        nextQuestionRef.current();
      } else {
        setAutoNextCountdown(count);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isAllRevealed]);

  // Split 10 answers into 2 columns of 5
  const column1 = answers.slice(0, 5);
  const column2 = answers.slice(5, 10);

  return (
    <div className="w-full max-w-6xl flex flex-col items-center justify-between p-4 sm:p-6 text-white dir-rtl relative overflow-hidden rounded-3xl bg-[#08090C] border border-[#232736] shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
      
      {/* 🌟 2026 AMBIENT SOVEREIGN GOLD LIGHTING */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D6A84F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D6A84F]/5 rounded-full blur-3xl pointer-events-none" />

      {/* 🔴 HEADER BAR: Title, Total 200 PTS, Mode Toggle */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between border-b border-[#232736] pb-4 gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D6A84F] via-[#E8C77B] to-[#B38734] flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(214,168,79,0.4)] text-slate-950 font-black">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>وش يقولون؟</span>
                <span className="text-sm font-mono text-[#D6A84F] font-bold">WHAT DO THEY SAY?</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#D6A84F]/20 text-[#D6A84F] border border-[#D6A84F]/40 font-mono">
                TOP 10
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              توقع الإجابات الأكثر شيوعاً بين الناس • أول من يكتب الإجابة في الشات يفتح البطاقة ويكسب النقاط!
            </p>
          </div>
        </div>

        {/* Score Gauge & Mode Selector */}
        <div className="flex items-center gap-3">
          {/* Mode Switch (Solo vs Team) */}
          <div className="flex items-center bg-[#0F1117] p-1 rounded-xl border border-[#232736]">
            <button
              onClick={() => setMode('SOLO')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                mode === 'SOLO'
                  ? 'bg-gradient-to-r from-[#D6A84F] to-[#E8C77B] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              فردي (SOLO)
            </button>
            <button
              onClick={() => setMode('TEAM')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                mode === 'TEAM'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              فرق (TEAMS)
            </button>
          </div>

          {/* Total 200 Score Pill */}
          <div className="px-4 py-2 rounded-2xl bg-[#0F1117] border border-[#D6A84F]/40 flex items-center gap-2.5 shadow-lg">
            <Trophy className="w-5 h-5 text-[#D6A84F]" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-400">مجموع النقاط</span>
              <span className="text-base font-black font-mono text-[#D6A84F] leading-none">200 PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔴 TEAM SCORES BAR (If in Team Mode) */}
      {mode === 'TEAM' && (
        <div className="w-full grid grid-cols-2 gap-4 my-2 z-10">
          <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_10px_#F43F5E]" />
              <span className="font-black text-xs text-rose-300">الفريق الأحمر</span>
            </div>
            <span className="font-mono font-black text-xl text-rose-400">{redTeamScore} PTS</span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_#3B82F6]" />
              <span className="font-black text-xs text-blue-300">الفريق الأزرق</span>
            </div>
            <span className="font-mono font-black text-xl text-blue-400">{blueTeamScore} PTS</span>
          </div>
        </div>
      )}

      {/* 🔴 MAIN HERO QUESTION BANNER */}
      <div className="w-full my-4 p-6 sm:p-8 rounded-3xl bg-[#0F1117] border-2 border-[#D6A84F]/40 shadow-[0_15px_50px_rgba(0,0,0,0.8)] text-center relative overflow-hidden backdrop-blur-xl z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="px-3.5 py-1 rounded-full bg-[#D6A84F]/15 text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-mono font-black">
            {question?.category || 'استطلاع الجمهور والمجتمع'}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 text-xs font-mono font-bold">
            #{question?.id || 'WDTS'}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-snug tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] mt-2">
          {question?.title || 'اذكر شيئًا يفعله الشخص عند الاستعداد للكشتة والرحلات البرية؟'}
        </h2>

        {/* Discovery Progress Counter */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161922] border border-[#232736]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D6A84F] animate-pulse" />
            <span className="text-xs font-bold text-slate-300">
              تم اكتشاف: <strong className="text-[#D6A84F] font-mono text-sm">{revealedCount} / 10</strong> إجابات
            </span>
            <span className="text-xs text-slate-500 font-mono">({discoveredPoints} / 200 نقطة)</span>
          </div>
        </div>
      </div>

      {/* 🔴 10 CARDS ARENA BOARD (2 Columns of 5 Cards) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 my-2 z-10">
        
        {/* Column 1 (01 to 05) */}
        <div className="flex flex-col gap-3">
          {column1.map((ans) => (
            <div
              key={ans.rank}
              className={`w-full p-3.5 sm:p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden flex items-center justify-between group ${
                ans.isRevealed
                  ? 'bg-gradient-to-r from-[#161922] via-[#1A1E2C] to-[#161922] border-[#D6A84F] shadow-[0_8px_30px_rgba(214,168,79,0.25)] animate-in zoom-in-95'
                  : 'bg-[#0F1117] border-[#232736] hover:border-[#D6A84F]/50 hover:bg-[#161922]'
              }`}
            >
              {/* Left Side: Rank Badge + Answer / Mystery Bar */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Rank Badge Number */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm font-mono shrink-0 shadow-inner ${
                  ans.isRevealed
                    ? 'bg-gradient-to-br from-[#D6A84F] to-[#B38734] text-slate-950 font-black border border-[#FFE8A3]'
                    : 'bg-[#161922] text-slate-400 border border-[#232736]'
                }`}>
                  {String(ans.rank).padStart(2, '0')}
                </div>

                {ans.isRevealed ? (
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{ans.emoji || '✨'}</span>
                      <span className="text-base sm:text-lg font-black text-white truncate">
                        {ans.title}
                      </span>
                    </div>

                    {ans.revealedBy && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <img
                          src={ans.revealedBy.avatarUrl}
                          alt={ans.revealedBy.displayName}
                          className="w-4 h-4 rounded-full object-cover border border-[#D6A84F]"
                        />
                        <span className="text-[11px] font-bold text-[#D6A84F] truncate">
                          {ans.revealedBy.displayName}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <div className="h-4 w-3/4 rounded-md bg-[#161922] animate-pulse border border-[#232736]" />
                  </div>
                )}
              </div>

              {/* Right Side: Points Badge / Host Reveal */}
              <div className="flex items-center gap-2 shrink-0">
                {ans.isRevealed ? (
                  <div className="px-3.5 py-1.5 rounded-xl bg-[#D6A84F]/20 border border-[#D6A84F]/50 text-[#D6A84F] font-mono font-black text-sm shadow-md">
                    +{ans.points}
                  </div>
                ) : (
                  <button
                    onClick={() => handleHostRevealAnswer(ans.rank)}
                    title="كشف يدوي للمقدم"
                    className="px-3 py-1 rounded-xl bg-white/5 hover:bg-[#D6A84F]/20 text-slate-500 hover:text-[#D6A84F] border border-white/5 hover:border-[#D6A84F]/40 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    ?? PTS
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Column 2 (06 to 10) */}
        <div className="flex flex-col gap-3">
          {column2.map((ans) => (
            <div
              key={ans.rank}
              className={`w-full p-3.5 sm:p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden flex items-center justify-between group ${
                ans.isRevealed
                  ? 'bg-gradient-to-r from-[#161922] via-[#1A1E2C] to-[#161922] border-[#D6A84F] shadow-[0_8px_30px_rgba(214,168,79,0.25)] animate-in zoom-in-95'
                  : 'bg-[#0F1117] border-[#232736] hover:border-[#D6A84F]/50 hover:bg-[#161922]'
              }`}
            >
              {/* Left Side: Rank Badge + Answer / Mystery Bar */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Rank Badge Number */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm font-mono shrink-0 shadow-inner ${
                  ans.isRevealed
                    ? 'bg-gradient-to-br from-[#D6A84F] to-[#B38734] text-slate-950 font-black border border-[#FFE8A3]'
                    : 'bg-[#161922] text-slate-400 border border-[#232736]'
                }`}>
                  {String(ans.rank).padStart(2, '0')}
                </div>

                {ans.isRevealed ? (
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{ans.emoji || '✨'}</span>
                      <span className="text-base sm:text-lg font-black text-white truncate">
                        {ans.title}
                      </span>
                    </div>

                    {ans.revealedBy && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <img
                          src={ans.revealedBy.avatarUrl}
                          alt={ans.revealedBy.displayName}
                          className="w-4 h-4 rounded-full object-cover border border-[#D6A84F]"
                        />
                        <span className="text-[11px] font-bold text-[#D6A84F] truncate">
                          {ans.revealedBy.displayName}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <div className="h-4 w-3/4 rounded-md bg-[#161922] animate-pulse border border-[#232736]" />
                  </div>
                )}
              </div>

              {/* Right Side: Points Badge / Host Reveal */}
              <div className="flex items-center gap-2 shrink-0">
                {ans.isRevealed ? (
                  <div className="px-3.5 py-1.5 rounded-xl bg-[#D6A84F]/20 border border-[#D6A84F]/50 text-[#D6A84F] font-mono font-black text-sm shadow-md">
                    +{ans.points}
                  </div>
                ) : (
                  <button
                    onClick={() => handleHostRevealAnswer(ans.rank)}
                    title="كشف يدوي للمقدم"
                    className="px-3 py-1 rounded-xl bg-white/5 hover:bg-[#D6A84F]/20 text-slate-500 hover:text-[#D6A84F] border border-white/5 hover:border-[#D6A84F]/40 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    ?? PTS
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 🔴 CINEMATIC POPUP MODAL: ANSWER FOUND! (لحظة اكتشاف إجابة جديدة) */}
      {lastRevealedAnswer && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-300 pointer-events-none">
          <div className="p-8 rounded-3xl bg-[#0F1117] border-2 border-[#D6A84F] shadow-[0_0_80px_rgba(214,168,79,0.7)] flex flex-col items-center text-center gap-4 max-w-md w-full animate-bounce-short">
            <div className="px-4 py-1.5 rounded-full bg-[#D6A84F]/20 text-[#D6A84F] border border-[#D6A84F]/40 text-xs font-mono font-black uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D6A84F] animate-spin" />
              <span>إجابة صحيحة جديدة! #{lastRevealedAnswer.rank}</span>
            </div>

            <div className="text-6xl my-1">{lastRevealedAnswer.emoji || '🎯'}</div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">{lastRevealedAnswer.title}</h2>
              <div className="inline-block mt-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-[#D6A84F] to-[#B38734] text-slate-950 font-mono font-black text-2xl shadow-lg">
                +{lastRevealedAnswer.points} نقطة
              </div>
            </div>

            {lastRevealedAnswer.revealedBy && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#161922] border border-[#232736] w-full justify-center mt-2">
                <img
                  src={lastRevealedAnswer.revealedBy.avatarUrl}
                  alt={lastRevealedAnswer.revealedBy.displayName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#D6A84F]"
                />
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-slate-400 font-bold">أول من كتب الإجابة:</span>
                  <span className="text-sm font-black text-white">{lastRevealedAnswer.revealedBy.displayName}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔴 ALL 10 DISCOVERED VICTORY BANNER WITH AUTO-TRANSITION */}
      {isAllRevealed && (
        <div className="w-full my-3 p-5 rounded-3xl bg-[#0F1117] border-2 border-[#D6A84F] shadow-[0_0_40px_rgba(214,168,79,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in z-20">
          <div className="flex items-center gap-3 text-right">
            <span className="text-4xl animate-bounce">🏆</span>
            <div>
              <h3 className="text-lg font-black text-white">كفووو! تم كشف جميع الإجابات الـ10 واكتمل السؤال!</h3>
              <p className="text-xs text-[#D6A84F] font-bold flex items-center gap-1.5 flex-wrap">
                <span>تم توزيع الـ200 نقطة كاملة على الفائزين • جاري الانتقال للسؤال التالي تلقائياً خلال</span>
                <span className="font-mono text-slate-950 font-black text-sm px-2.5 py-0.5 rounded-lg bg-[#D6A84F] inline-block shadow-inner">
                  {autoNextCountdown !== null ? autoNextCountdown : 0} ثوانٍ
                </span>
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              soundFX.play('button_click');
              nextQuestion();
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D6A84F] to-[#E8C77B] text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(214,168,79,0.6)] flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>الانتقال الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 🔴 HOST ACTION CONTROLS & MANUAL TEST INPUT */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between border-t border-[#232736] pt-4 mt-2 gap-3 z-10">
        
        {/* Test Manual Answer Input for Host */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualInput.trim()) {
              handleCheckAnswerCandidate(manualInput, {
                userId: 'host-tester',
                username: '@host',
                displayName: 'مقدم البث 🎙️',
                avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
              });
              setManualInput('');
            }
          }}
          className="flex items-center gap-2 flex-1 w-full sm:max-w-md"
        >
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="اكتب إجابة لتجربتها يدوياً أو دع الشات يشارك..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#0F1117] border border-[#232736] text-xs font-bold text-white placeholder-slate-500 outline-none focus:border-[#D6A84F] transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#D6A84F] hover:bg-[#E8C77B] text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إرسال</span>
          </button>
        </form>

        {/* Host Reveal All & Reset Buttons & Next Question */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRevealAll}
            className="px-4 py-2 rounded-xl bg-[#161922] hover:bg-[#1C202F] text-slate-300 hover:text-white border border-[#232736] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>كشف الكل</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة اللعبة</span>
          </button>

          <button
            onClick={() => {
              soundFX.play('button_click');
              nextQuestion();
            }}
            className="px-4 py-2 rounded-xl bg-[#D6A84F]/20 hover:bg-[#D6A84F]/30 text-[#D6A84F] border border-[#D6A84F]/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>السؤال التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
