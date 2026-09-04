'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudioStore } from '../../store/useStudioStore';
import { soundFX } from '@aep/audio-visual-fx';
import { SoundEffectType, EngineType } from '@aep/types';
import { 
  Sliders, Play, Pause, Eye, Volume2, Trophy, 
  Radio, Sparkles, MessageSquare, Users, Check, Flame, 
  ChevronRight, RefreshCw, Crown, Zap, ShieldAlert
} from 'lucide-react';
import { StageArena } from '../../components/studio/StageArena';
import { GAME_ENGINE_SECTIONS } from '@aep/content-library';

export default function ProfessionalHostDeskControlRoom() {
  const [hasMounted, setHasMounted] = useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const {
    controlState,
    currentRound,
    currentQuestion,
    liveComments,
    leaderboard,
    correctAnswersThisQuestion,
    startRound,
    pauseRound,
    resumeRound,
    revealAnswer,
    nextQuestion,
    toggleOverlay,
    loadEngineQuestions,
    playSoundEffect,
    tiktokEngine
  } = useStudioStore();

  const [selectedEngine, setSelectedEngine] = useState<EngineType>(currentQuestion?.engineType || 'memory-match');
  const roomStatus = tiktokEngine ? tiktokEngine.getRoomStatus() : null;
  const isOnline = Boolean(roomStatus?.isOnline);

  const gameList: { id: EngineType; title: string; subtitle: string; icon: string; accent: string }[] = [
    { id: 'capitals', title: 'تحدي عواصم العالم', subtitle: 'دول كبرى وعربية', icon: '🏛️', accent: '#D6A84F' },
    { id: 'memory-match', title: 'لعبة الذاكرة', subtitle: '16 بطاقة • 8 أزواج', icon: '🧠', accent: '#8B5CF6' },
    { id: 'bomb-pass', title: 'القنبلة الموقوتة', subtitle: 'مرر قبل الانفجار', icon: '🧨', accent: '#DC2626' },
    { id: 'hunter-roulette', title: 'روليت الصياد', subtitle: 'عجلة الحظ الدائرية', icon: '🎯', accent: '#059669' },
    { id: 'mystery-roulette', title: 'الروليت الغامض', subtitle: 'بطاقات أرقام وإقصاء غامض', icon: '🔮', accent: '#D6A84F' },
    { id: 'musical-chairs', title: 'الكراسي الموسيقية', subtitle: 'بقاء وإقصاء فوري', icon: '🪑', accent: '#2563EB' },
    { id: 'react', title: 'تخمين الأرقام', subtitle: 'كشف الخانات المخفية', icon: '🔢', accent: '#06B6D4' },
    { id: 'quiz', title: 'المسابقات الثقافية', subtitle: 'أسئلة وتحديات معلومات', icon: '🎓', accent: '#D6A84F' },
  ];

  const soundboardEvents: { label: string; type: SoundEffectType; color: string }[] = [
    { label: 'بدء الجولة 🔔', type: 'round_start', color: 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/40' },
    { label: 'إجابة صحيحة ✨', type: 'correct_answer', color: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40' },
    { label: 'إجابة خاطئة ❌', type: 'wrong_answer', color: 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/40' },
    { label: 'تتويج البطل 🏆', type: 'winner_announcement', color: 'bg-[#D6A84F]/20 text-[#D6A84F] border-[#D6A84F]/40' },
    { label: 'انتهاء الوقت ⏳', type: 'time_up', color: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40' },
    { label: 'نهاية العرض 🎉', type: 'show_end', color: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40' },
  ];

  const handleSwitchEngine = (engine: EngineType) => {
    setSelectedEngine(engine);
    loadEngineQuestions(engine);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-[1600px] mx-auto pb-12 select-none">
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* TOP HEADER: MASTER BROADCAST STATUS & CONTROLS         */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F1117] border border-[#232736] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#D6A84F]/10 border border-[#D6A84F]/30 text-[#D6A84F] flex items-center justify-center font-black">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display font-black text-xl text-white">غرفة التحكم التلفزيونية (HOST DESK)</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black flex items-center gap-1.5 ${
                isOnline 
                  ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#EF4444] animate-ping' : 'bg-slate-500'}`} />
                <span>{isOnline ? 'ON-AIR DIRECT' : 'STANDBY (OFFLINE)'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">التحكم المركزي بالبث، ترتيب الألعاب، توجيه الأسئلة، ومراقبة تفاعل الشات فوراً</p>
          </div>
        </div>

        {/* TOP QUICK ACTION: OPEN STANDALONE BROADCAST ARENA */}
        <div className="flex items-center gap-3">
          <Link
            href={`/play?engine=${selectedEngine}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-[#161922] hover:bg-[#1F2433] border border-[#282E40] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>فتح شاشة البث (9:16 Arena) ↗</span>
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 3-COLUMN MASTER PRODUCTION GRID                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ── COLUMN 1: GAME QUEUE (3 Cols) ────────────────── */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#232736] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#1F2433] pb-2.5">
              <h2 className="font-display font-black text-sm text-white flex items-center gap-2">
                <span>📋</span>
                <span>قائمة الألعاب (GAME QUEUE)</span>
              </h2>
              <span className="text-[10px] font-mono text-[#D6A84F] font-bold">6 ألعاب</span>
            </div>

            <div className="flex flex-col gap-2">
              {gameList.map((game) => {
                const isSelected = selectedEngine === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => handleSwitchEngine(game.id)}
                    className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#161922] border-[#D6A84F] shadow-[0_0_15px_rgba(214,168,79,0.15)]'
                        : 'bg-[#12141C] border-[#1F2433] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{game.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-display font-bold text-xs text-white">
                          {game.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {game.subtitle}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 rounded bg-[#D6A84F]/20 text-[#D6A84F] text-[9px] font-mono font-bold">
                        نشط
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SOUND TRIGGER MATRIX */}
          <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#232736] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#1F2433] pb-2">
              <h3 className="font-display font-black text-xs text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#D6A84F]" />
                <span>مؤثرات الصوت الفورية (AUDIO FX)</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {soundboardEvents.map((evt) => (
                <button
                  key={evt.type}
                  onClick={() => playSoundEffect(evt.type)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${evt.color}`}
                >
                  {evt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── COLUMN 2: LIVE PREVIEW & CONTROLS (6 Cols) ───── */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {/* STAGE PREVIEW CANVAS */}
          <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#232736] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#1F2433] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-[#D6A84F] uppercase">
                  شاشة المعاينة الحية (LIVE PREVIEW)
                </span>
                <span className="text-xs text-slate-400">• {currentQuestion?.title}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                100% REALTIME
              </span>
            </div>

            {/* Embedded Live Stage */}
            <div className="w-full min-h-[380px] rounded-xl bg-[#08090C] border border-[#1F2433] p-4 flex items-center justify-center overflow-hidden">
              <StageArena
                currentRound={currentRound}
                currentQuestion={currentQuestion}
                timeRemainingSeconds={controlState.timeRemainingSeconds}
                isAnswerRevealed={controlState.isAnswerRevealed}
                isTimerRunning={controlState.isTimerRunning}
                onRevealAnswer={revealAnswer}
                onNextQuestion={nextQuestion}
              />
            </div>

            {/* MASTER BROADCAST ACTION STRIP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {!controlState.isPlaying ? (
                <button
                  onClick={startRound}
                  className="py-3.5 px-4 rounded-xl gold-cta-button flex items-center justify-center gap-2 text-xs font-black cursor-pointer shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>بدء الجولة ▶</span>
                </button>
              ) : (
                <button
                  onClick={controlState.isTimerRunning ? pauseRound : resumeRound}
                  className="py-3.5 px-4 rounded-xl bg-[#F59E0B] text-slate-950 flex items-center justify-center gap-2 text-xs font-black cursor-pointer shadow-lg hover:bg-amber-400 transition-all"
                >
                  {controlState.isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{controlState.isTimerRunning ? 'إيقاف مؤقت ⏸' : 'استئناف ▶'}</span>
                </button>
              )}

              <button
                onClick={revealAnswer}
                className="py-3.5 px-4 rounded-xl bg-[#161922] hover:bg-[#1F2433] border border-[#282E40] text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>كشف الإجابة 👁</span>
              </button>

              <button
                onClick={nextQuestion}
                className="py-3.5 px-4 rounded-xl bg-[#161922] hover:bg-[#1F2433] border border-[#282E40] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>السؤال التالي ➡</span>
              </button>

              <button
                onClick={() => toggleOverlay('leaderboard')}
                className="py-3.5 px-4 rounded-xl bg-[#D6A84F]/10 hover:bg-[#D6A84F]/20 border border-[#D6A84F]/30 text-[#D6A84F] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>لوحة الصدارة 🏆</span>
              </button>
            </div>
          </div>

          {/* QUESTION METADATA INTEL */}
          <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#232736] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs border-b border-[#1F2433] pb-2">
              <span className="text-slate-400 font-bold">الإجابات المقبولة تلقائياً:</span>
              <span className="font-mono text-[#10B981] font-bold">
                {currentQuestion?.acceptableAnswers?.join(' | ') || 'تلقائي حسب قواعد اللعبة'}
              </span>
            </div>
          </div>
        </div>

        {/* ── COLUMN 3: LIVE CHAT & INSTANT FEED (3 Cols) ──── */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          {/* REALTIME CHAT STREAM PARSER */}
          <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#232736] flex flex-col gap-3 min-h-[360px]">
            <div className="flex items-center justify-between border-b border-[#1F2433] pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#D6A84F]" />
                <h3 className="font-display font-black text-xs text-white">شات البث المباشر الحقيقي</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">
                {liveComments.length} تعليق
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[300px] flex flex-col gap-2 pr-0.5">
              {liveComments.length === 0 ? (
                <div className="text-center text-xs text-slate-500 py-12 flex flex-col items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-slate-600 animate-pulse" />
                  <span>في انتظار تعليقات مشاهدي البث...</span>
                </div>
              ) : (
                liveComments.slice(-10).reverse().map((c, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#12141C] border border-[#1F2433] text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-[#D6A84F] text-[11px] truncate">{c.nickname || c.uniqueId}:</span>
                      <span className="text-white truncate text-[11px]">{c.comment}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TOP PLAYERS INSTANT LEADERBOARD */}
          <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#232736] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#1F2433] pb-2">
              <h3 className="font-display font-black text-xs text-white flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#D6A84F]" />
                <span>أعلى المتصدرين في الجولة</span>
              </h3>
            </div>

            <div className="flex flex-col gap-1.5">
              {leaderboard.slice(0, 4).length === 0 ? (
                <span className="text-center text-xs text-slate-500 py-4">لا يوجد نقاط بعد</span>
              ) : (
                leaderboard.slice(0, 4).map((p, idx) => (
                  <div key={p.userId || idx} className="flex items-center justify-between p-2 rounded-xl bg-[#12141C] border border-[#1F2433] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#D6A84F] font-bold">#{idx + 1}</span>
                      <span className="font-bold text-white text-[11px] truncate max-w-[100px]">{p.displayName || p.username}</span>
                    </div>
                    <span className="font-mono text-[#D6A84F] font-black text-xs">+{p.score}★</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
