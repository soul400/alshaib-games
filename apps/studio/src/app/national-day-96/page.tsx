'use client';

import React, { useState, useEffect } from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { 
  NationalDayQuestion, NationalDay96ActivityId, NationalDayDedication, 
  NationalDayLeaderboardEntry 
} from '@aep/types';
import { 
  NATIONAL_DAY_96_BANK, getNationalDayQuestionsByActivity 
} from '@aep/content-library';
import { soundFX } from '@aep/audio-visual-fx';

import { NationalDayHeader } from '../../components/national-day-96/NationalDayHeader';
import { NationalDayHero } from '../../components/national-day-96/NationalDayHero';
import { NationalDayActivityGrid, NATIONAL_DAY_ACTIVITIES } from '../../components/national-day-96/NationalDayActivityGrid';
import { NationalDayLiveArena } from '../../components/national-day-96/NationalDayLiveArena';
import { NationalDayDedications } from '../../components/national-day-96/NationalDayDedications';
import { NationalDayLeaderboard } from '../../components/national-day-96/NationalDayLeaderboard';
import { NationalDayContentLibrary } from '../../components/national-day-96/NationalDayContentLibrary';

// Initial Mock Seed Data for Dedications
const INITIAL_DEDICATIONS: NationalDayDedication[] = [
  {
    id: 'ded-1',
    userId: 'u-1',
    username: 'fهد_الشمري',
    displayName: 'فهد الشمري',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    message: 'دمت يا وطني فخراً وعزاً، ورايتك خفاقة في سماء المجد 🇸🇦💚',
    selectedNumber: 1,
    timestamp: Date.now() - 60000,
    status: 'APPROVED'
  },
  {
    id: 'ded-2',
    userId: 'u-2',
    username: 'سارة_العتيبي',
    displayName: 'سارة العتيبي',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    message: '96 عاماً من الشموخ والعطاء.. نحلم ونحقق كل عام والمملكة بألف خير 🇸🇦',
    selectedNumber: 2,
    timestamp: Date.now() - 120000,
    status: 'APPROVED'
  },
  {
    id: 'ded-3',
    userId: 'u-3',
    username: 'عبدالله_الدوسري',
    displayName: 'عبدالله الدوسري',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    message: 'كل عام ووطننا وقيادتنا وشعبنا العظيم في أمن ورخاء وازدهار مستمر 💚',
    selectedNumber: 3,
    timestamp: Date.now() - 180000,
    status: 'APPROVED'
  }
];

// Initial National Day Season Leaderboard Seed (clean empty by default)
const INITIAL_LEADERBOARD: NationalDayLeaderboardEntry[] = [];

export default function SaudiNationalDay96Page() {
  const { liveComments, tiktokEngine } = useStudioStore();
  const isTikTokConnected = tiktokEngine ? tiktokEngine.getRoomStatus()?.isConnected : false;

  // Active view tab: 'overview' | 'arena' | 'dedications' | 'leaderboard' | 'library'
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Currently selected game activity in the arena
  const [selectedActivityId, setSelectedActivityId] = useState<NationalDay96ActivityId>('saudi-great');

  // National Day State
  const [questions, setQuestions] = useState<NationalDayQuestion[]>(NATIONAL_DAY_96_BANK);
  const [dedications, setDedications] = useState<NationalDayDedication[]>(INITIAL_DEDICATIONS);
  const [leaderboard, setLeaderboard] = useState<NationalDayLeaderboardEntry[]>([]);

  // Load custom questions and leaderboard from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aep_nd96_custom_questions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Guarantee 1 point for all questions
          setQuestions(parsed.map(q => ({ ...q, points: 1 })));
        }
      }
    } catch (_) {}

    try {
      const savedLb = localStorage.getItem('aep_nd96_leaderboard');
      if (savedLb !== null) {
        const parsedLb = JSON.parse(savedLb);
        if (Array.isArray(parsedLb)) {
          setLeaderboard(parsedLb);
        }
      }
    } catch (_) {}
  }, []);

  // Play Sound FX on Tab Switch
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    soundFX.play('card_flip');
  };

  // Launch Activity into Arena
  const handleSelectActivity = (activityId: NationalDay96ActivityId) => {
    // Dedications section has its own dedicated tab
    if (activityId === 'national-dedications') {
      setActiveTab('dedications');
      soundFX.play('round_start');
      return;
    }
    setSelectedActivityId(activityId);
    setActiveTab('arena');
    soundFX.play('round_start');
  };

  // Handle Winner Claim & Point Award
  const handleWinnerClaim = (
    winner: { userId: string; username: string; displayName: string; avatarUrl: string; points: number },
    question: NationalDayQuestion
  ) => {
    setLeaderboard(prev => {
      let updated: NationalDayLeaderboardEntry[];
      const existing = prev.find(p => p.userId === winner.userId || p.username === winner.username);
      if (existing) {
        updated = prev.map(p => {
          if (p.userId === winner.userId || p.username === winner.username) {
            return {
              ...p,
              nationalPoints: p.nationalPoints + winner.points,
              correctAnswersCount: p.correctAnswersCount + 1,
              winsCount: p.winsCount + 1
            };
          }
          return p;
        });
      } else {
        const newEntry: NationalDayLeaderboardEntry = {
          userId: winner.userId,
          username: winner.username,
          displayName: winner.displayName,
          avatarUrl: winner.avatarUrl,
          nationalPoints: winner.points,
          correctAnswersCount: 1,
          winsCount: 1,
          rank: prev.length + 1
        };
        updated = [...prev, newEntry];
      }
      try {
        localStorage.setItem('aep_nd96_leaderboard', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  // Reset National Day Season Leaderboard to Zero
  const handleResetSeason = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('هل أنت متأكد من تصفير لوحة صدارة اليوم الوطني وإعادة كافة النقاط وسجل المتسابقين إلى الصفر؟');
      if (!confirmed) return;
    }
    setLeaderboard([]);
    try {
      localStorage.setItem('aep_nd96_leaderboard', JSON.stringify([]));
    } catch (_) {}
    soundFX.play('time_up');
  };

  // Dedication Handlers
  const handleAddDedication = (message: string, username: string, avatarUrl: string, selectedNumber?: number) => {
    const boxNum = selectedNumber || (dedications.length + 1);
    const newDed: NationalDayDedication = {
      id: `ded-${Date.now()}`,
      userId: `user-${Date.now()}`,
      username: username.startsWith('@') ? username : `@${username.replace(/\s+/g, '_')}`,
      displayName: username.replace(/^@/, ''),
      avatarUrl: avatarUrl,
      message: message,
      selectedNumber: boxNum,
      timestamp: Date.now(),
      status: 'APPROVED'
    };
    // Replace any existing dedication on the same box or prepend
    setDedications(prev => [newDed, ...prev.filter(d => d.selectedNumber !== boxNum)]);
    soundFX.play('score_update');
  };

  const handleApproveDedication = (id: string) => {
    setDedications(prev => prev.map(d => d.id === id ? { ...d, status: 'APPROVED' } : d));
  };

  const handleRejectDedication = (id: string) => {
    setDedications(prev => prev.filter(d => d.id !== id));
  };

  // Question Management Handlers with LocalStorage persistence
  const handleAddQuestion = (q: Partial<NationalDayQuestion>) => {
    const newQ: NationalDayQuestion = {
      id: `nd96-q-${Date.now()}`,
      activityId: q.activityId || 'saudi-great',
      category: q.category || 'عام',
      question: q.question || '',
      correctAnswer: q.correctAnswer || '',
      acceptableAnswers: q.acceptableAnswers || [q.correctAnswer || ''],
      difficulty: q.difficulty || 'medium',
      points: 1,
      timeLimitSeconds: q.timeLimitSeconds || 15,
      mediaUrl: q.mediaUrl,
      mediaType: q.mediaType,
      status: q.status || 'ACTIVE',
      usedCount: 0,
      createdAt: Date.now()
    };
    setQuestions(prev => {
      const updated = [newQ, ...prev];
      try { localStorage.setItem('aep_nd96_custom_questions', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });
  };

  const handleUpdateQuestion = (id: string, updates: Partial<NationalDayQuestion>) => {
    setQuestions(prev => {
      const updated = prev.map(q => q.id === id ? { ...q, ...updates } : q);
      try { localStorage.setItem('aep_nd96_custom_questions', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => {
      const updated = prev.filter(q => q.id !== id);
      try { localStorage.setItem('aep_nd96_custom_questions', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });
  };

  const handleApproveReviewQuestion = (id: string) => {
    setQuestions(prev => {
      const updated = prev.map(q => q.id === id ? { ...q, status: 'ACTIVE' as const } : q);
      try { localStorage.setItem('aep_nd96_custom_questions', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });
    soundFX.play('card_match');
  };

  // Filter current activity questions
  const currentActivityInfo = NATIONAL_DAY_ACTIVITIES.find(a => a.id === selectedActivityId) || NATIONAL_DAY_ACTIVITIES[0];
  const currentActivityQuestions = questions.filter(q => q.activityId === selectedActivityId && q.status === 'ACTIVE');

  const totalParticipants = leaderboard.length;
  const totalNationalPoints = leaderboard.reduce((acc, curr) => acc + curr.nationalPoints, 0);

  return (
    <div className="min-h-screen bg-[#031108] text-white flex flex-col selection:bg-[#00A859] selection:text-white relative overflow-hidden" dir="rtl">
      
      {/* 🌟 1. GLOBAL MULTI-LAYER FESTIVAL BACKGROUND */}
      {/* Layer 1: Ambient Riyadh Night Fireworks Texture */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-[0.08] mix-blend-screen pointer-events-none filter saturate-200 contrast-125"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1920&q=85')`
        }}
      />

      {/* Layer 2: Geometric Islamic / Sadu Gold Constellations */}
      <div className="fixed inset-0 opacity-[0.04] bg-[radial-gradient(#FFE79A_1.5px,transparent_1.5px)] [background-size:32px_32px] pointer-events-none" />

      {/* Layer 3: Dynamic Glowing Color Orbs (Emerald, Gold, Deep Green) */}
      <div className="fixed top-1/4 -right-40 w-[500px] h-[500px] bg-[#00A859]/15 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/3 -left-40 w-[500px] h-[500px] bg-[#C69214]/12 rounded-full filter blur-[140px] pointer-events-none" />
      
      {/* 🌟 2. Top Header */}
      <NationalDayHeader
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onAirActivityTitle={activeTab === 'arena' ? currentActivityInfo.title : undefined}
        isLive={isTikTokConnected}
      />

      {/* 🌟 2. Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        
        {/* TAB 1: OVERVIEW & ACTIVITIES */}
        {activeTab === 'overview' && (
          <>
            <NationalDayHero
              onStartActivity={(actId) => handleSelectActivity((actId as NationalDay96ActivityId) || 'saudi-great')}
              onViewDedications={() => handleSelectTab('dedications')}
              onViewLeaderboard={() => handleSelectTab('leaderboard')}
              totalParticipants={totalParticipants}
              totalNationalPoints={totalNationalPoints}
            />

            <NationalDayActivityGrid
              onSelectActivity={handleSelectActivity}
            />
          </>
        )}

        {/* TAB 2: LIVE BROADCAST ARENA */}
        {activeTab === 'arena' && (
          <NationalDayLiveArena
            activityId={selectedActivityId}
            activityTitle={currentActivityInfo.title}
            questions={currentActivityQuestions.length > 0 ? currentActivityQuestions : questions}
            liveComments={liveComments}
            onWinnerClaim={handleWinnerClaim}
            onExitArena={() => setActiveTab('overview')}
          />
        )}

        {/* TAB 3: NATIONAL DEDICATIONS */}
        {activeTab === 'dedications' && (
          <NationalDayDedications
            dedications={dedications}
            onAddDedication={handleAddDedication}
            onApproveDedication={handleApproveDedication}
            onRejectDedication={handleRejectDedication}
            isLiveBroadcast={isTikTokConnected}
          />
        )}

        {/* TAB 4: LEADERBOARD PODIUM */}
        {activeTab === 'leaderboard' && (
          <NationalDayLeaderboard
            entries={leaderboard}
            onResetSeason={handleResetSeason}
          />
        )}

        {/* TAB 5: CONTENT LIBRARY & AI GENERATOR */}
        {activeTab === 'library' && (
          <NationalDayContentLibrary
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onApproveReviewQuestion={handleApproveReviewQuestion}
          />
        )}

      </main>

    </div>
  );
}
