'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStudioStore } from '../../store/useStudioStore';
import { GAME_ENGINE_SECTIONS, getQuestionsByEngine } from '@aep/content-library';
import { EngineType, GameRound, EntertainmentShow } from '@aep/types';
import { 
  Layers, Plus, Sparkles, Trash2, Play, Check, 
  PlusCircle, Sliders, Clock, Trophy, HelpCircle, 
  Flame, Gamepad2, ArrowRight, Settings2, CheckCircle2,
  Save, FolderOpen, Copy, RotateCcw, AlertCircle, RefreshCw
} from 'lucide-react';

interface SavedShowItem {
  id: string;
  name: string;
  savedAt: string;
  roundsCount: number;
  questionsTotal: number;
  data: EntertainmentShow;
}

const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function ShowsBuilderPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const { show, setShow } = useStudioStore();

  const [showTitle, setShowTitle] = useState(show.title);
  const [showDescription, setShowDescription] = useState(show.description);
  const [isSaved, setIsSaved] = useState(false);
  const [isAddingRound, setIsAddingRound] = useState(false);

  // Saved Shows Management
  const [savedShowsList, setSavedShowsList] = useState<SavedShowItem[]>([]);
  const [newShowModalOpen, setNewShowModalOpen] = useState(false);
  const [newShowNameInput, setNewShowNameInput] = useState('');

  // New Round Form State
  const [newRoundTitle, setNewRoundTitle] = useState('تحدي الأسئلة الثقافية');
  const [newRoundEngine, setNewRoundEngine] = useState<EngineType>('capitals');
  const [newRoundQuestionsCount, setNewRoundQuestionsCount] = useState<number>(5);
  const [newRoundTimeLimit, setNewRoundTimeLimit] = useState<number>(30);
  const [newRoundPoints, setNewRoundPoints] = useState<number>(100);

  // Quick Multi-Game Selector State
  const [selectedQuickEngines, setSelectedQuickEngines] = useState<Record<string, { enabled: boolean; questionsCount: number; points: number }>>({
    'viewer-race': { enabled: true, questionsCount: 1, points: 500 },
    'squid-game': { enabled: true, questionsCount: 1, points: 500 },
    'capitals': { enabled: true, questionsCount: 5, points: 100 },
    'memory-match': { enabled: true, questionsCount: 3, points: 200 },
    'bomb-pass': { enabled: true, questionsCount: 3, points: 500 },
    'quiz': { enabled: true, questionsCount: 5, points: 100 },
    'what-do-they-say': { enabled: true, questionsCount: 4, points: 200 }
  });

  // Load Saved Shows from LocalStorage on mount
  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const storedList = localStorage.getItem('aep_saved_shows_list');
        if (storedList) {
          const parsed = JSON.parse(storedList);
          if (Array.isArray(parsed)) {
            setSavedShowsList(parsed);
          }
        }
      } catch (e) {
        console.error('Error loading saved shows list', e);
      }
    }
  }, []);

  // Sync title & description with store
  useEffect(() => {
    if (show) {
      setShowTitle(show.title);
      setShowDescription(show.description);
    }
  }, [show.id]);

  // Save current active show
  const handleSaveCurrentShow = () => {
    const updatedShow: EntertainmentShow = {
      ...show,
      title: showTitle,
      description: showDescription,
      updatedAt: new Date().toISOString()
    };
    setShow(updatedShow);

    // Also update in saved shows list if it exists
    if (typeof window !== 'undefined') {
      try {
        const currentList: SavedShowItem[] = JSON.parse(localStorage.getItem('aep_saved_shows_list') || '[]');
        const existingIdx = currentList.findIndex(s => s.id === updatedShow.id);
        const totalQ = updatedShow.rounds.reduce((sum, r) => sum + (r.questionsCount || r.questions.length || 1), 0);

        const showItem: SavedShowItem = {
          id: updatedShow.id,
          name: updatedShow.title,
          savedAt: new Date().toLocaleDateString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          roundsCount: updatedShow.rounds.length,
          questionsTotal: totalQ,
          data: updatedShow
        };

        let newList: SavedShowItem[];
        if (existingIdx >= 0) {
          newList = [...currentList];
          newList[existingIdx] = showItem;
        } else {
          newList = [showItem, ...currentList];
        }

        localStorage.setItem('aep_saved_shows_list', JSON.stringify(newList));
        setSavedShowsList(newList);
      } catch (e) {
        console.error('Error saving show to list', e);
      }
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Create and save as a brand new show (e.g. "عرض 1", "عرض 2")
  const handleCreateNewNamedShow = () => {
    const name = newShowNameInput.trim() || `عرض ${savedShowsList.length + 1}`;
    const newId = `show-${Date.now()}`;
    const defaultRoundQuestions = shuffleArray(getQuestionsByEngine('capitals')).slice(0, 5);

    const newShowObj: EntertainmentShow = {
      id: newId,
      title: name,
      description: `عرض ترفيهي مباشر ومسابقات تفاعلية تم إنشاؤه في ${new Date().toLocaleDateString('ar-SA')}`,
      theme: {
        primaryColor: '#D6A84F',
        accentColor: '#E5BE6C',
        darkBg: '#08090C',
        glassmorphism: false,
        fontFamily: 'Cairo, sans-serif'
      },
      rounds: [
        {
          id: `round-${Date.now()}-1`,
          title: 'تحدي عواصم العالم 🏛️',
          engineType: 'capitals',
          questionsCount: 5,
          questions: defaultRoundQuestions,
          timeLimitPerQuestionSeconds: 30,
          pointsPerQuestion: 100,
          roundOrder: 1
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setShow(newShowObj);
    setShowTitle(newShowObj.title);
    setShowDescription(newShowObj.description);

    // Save into saved shows list
    const showItem: SavedShowItem = {
      id: newId,
      name: newShowObj.title,
      savedAt: new Date().toLocaleDateString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      roundsCount: 1,
      questionsTotal: 5,
      data: newShowObj
    };

    const newList = [showItem, ...savedShowsList];
    if (typeof window !== 'undefined') {
      localStorage.setItem('aep_saved_shows_list', JSON.stringify(newList));
    }
    setSavedShowsList(newList);
    setNewShowNameInput('');
    setNewShowModalOpen(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Load a previously saved show
  const handleLoadSavedShow = (showItem: SavedShowItem) => {
    setShow(showItem.data);
    setShowTitle(showItem.data.title);
    setShowDescription(showItem.data.description);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Delete a saved show from vault
  const handleDeleteSavedShow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا العرض المحفوظ؟')) {
      const newList = savedShowsList.filter(s => s.id !== id);
      setSavedShowsList(newList);
      if (typeof window !== 'undefined') {
        localStorage.setItem('aep_saved_shows_list', JSON.stringify(newList));
      }
    }
  };

  // Add a single configured round (with pre-populated questions)
  const handleAddRound = () => {
    const title = newRoundTitle.trim() || 'قسم جديد';
    const rawQs = getQuestionsByEngine(newRoundEngine);
    const allQs = newRoundEngine === 'what-do-they-say' ? rawQs : shuffleArray(rawQs);
    const count = Math.max(1, Number(newRoundQuestionsCount) || 5);
    const selectedQs = allQs.slice(0, count);

    const newRound: GameRound = {
      id: `round-${Date.now()}`,
      title,
      engineType: newRoundEngine,
      questionsCount: count,
      questions: selectedQs.length > 0 ? selectedQs : allQs,
      timeLimitPerQuestionSeconds: Number(newRoundTimeLimit) || 30,
      pointsPerQuestion: Number(newRoundPoints) || 100,
      roundOrder: show.rounds.length + 1
    };

    const updatedShow: EntertainmentShow = {
      ...show,
      rounds: [...show.rounds, newRound]
    };

    setShow(updatedShow);
    setNewRoundTitle('');
    setIsAddingRound(false);
  };

  // Update existing round questions count / points
  const handleUpdateRoundConfig = (roundId: string, field: 'questionsCount' | 'timeLimitPerQuestionSeconds' | 'pointsPerQuestion', value: number) => {
    const updatedShow: EntertainmentShow = {
      ...show,
      rounds: show.rounds.map(r => {
        if (r.id === roundId) {
          const updated = { ...r, [field]: value };
          if (field === 'questionsCount') {
            const rawQs = getQuestionsByEngine(r.engineType);
            const allQs = r.engineType === 'what-do-they-say' ? rawQs : shuffleArray(rawQs);
            updated.questions = allQs.slice(0, value);
          }
          return updated;
        }
        return r;
      })
    };
    setShow(updatedShow);
  };

  const handleDeleteRound = (roundId: string) => {
    if (show.rounds.length <= 1) {
      alert('يجب أن يحتوي العرض على قسم أو جولة واحدة على الأقل!');
      return;
    }
    const updatedShow: EntertainmentShow = {
      ...show,
      rounds: show.rounds.filter(r => r.id !== roundId)
    };
    setShow(updatedShow);
  };

  // Reshuffle questions for a single round from the question bank
  const handleReshuffleRoundQuestions = (roundId: string) => {
    const updatedShow: EntertainmentShow = {
      ...show,
      rounds: show.rounds.map(r => {
        if (r.id === roundId) {
          const count = r.questionsCount || r.questions.length || 5;
          const rawQs = getQuestionsByEngine(r.engineType);
          const freshQs = (r.engineType === 'what-do-they-say' ? rawQs : shuffleArray(rawQs)).slice(0, count);
          return {
            ...r,
            questions: freshQs
          };
        }
        return r;
      })
    };
    setShow(updatedShow);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  // Reshuffle ALL questions across ALL rounds in current show
  const handleReshuffleAllShowQuestions = () => {
    const updatedShow: EntertainmentShow = {
      ...show,
      rounds: show.rounds.map(r => {
        const count = r.questionsCount || r.questions.length || 5;
        const rawQs = getQuestionsByEngine(r.engineType);
        const freshQs = (r.engineType === 'what-do-they-say' ? rawQs : shuffleArray(rawQs)).slice(0, count);
        return {
          ...r,
          questions: freshQs
        };
      })
    };
    setShow(updatedShow);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  // Quick Multi-Game Preset Applier (with populated questions)
  const handleApplyMultiGamePreset = () => {
    const newRounds: GameRound[] = [];
    let order = 1;

    Object.entries(selectedQuickEngines).forEach(([engineKey, cfg]) => {
      if (cfg.enabled) {
        const engineInfo = GAME_ENGINE_SECTIONS.find(s => s.id === engineKey);
        const allQs = shuffleArray(getQuestionsByEngine(engineKey as EngineType));
        const count = cfg.questionsCount || 5;
        const selectedQs = allQs.slice(0, count);

        newRounds.push({
          id: `round-${Date.now()}-${order}`,
          title: engineInfo?.title || engineKey,
          engineType: engineKey as EngineType,
          questionsCount: count,
          questions: selectedQs.length > 0 ? selectedQs : allQs,
          timeLimitPerQuestionSeconds: 30,
          pointsPerQuestion: cfg.points,
          roundOrder: order++
        });
      }
    });

    if (newRounds.length === 0) {
      alert('يرجى تحديد لعبة واحدة على الأقل من القائمة!');
      return;
    }

    const updatedShow: EntertainmentShow = {
      ...show,
      rounds: newRounds
    };

    setShow(updatedShow);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Calculate Show Totals
  const totalQuestions = show.rounds.reduce((sum, r) => sum + (r.questionsCount || r.questions.length || 1), 0);
  const totalEstimatedSeconds = show.rounds.reduce((sum, r) => sum + ((r.questionsCount || 1) * (r.timeLimitPerQuestionSeconds || 30)), 0);
  const totalEstimatedMinutes = Math.max(1, Math.round(totalEstimatedSeconds / 60));
  const totalAvailablePoints = show.rounds.reduce((sum, r) => sum + ((r.questionsCount || 1) * (r.pointsPerQuestion || 100)), 0);

  if (!hasMounted) {
    return <div className="p-8 text-center text-slate-400 font-mono">جاري تحميل إدارة العروض...</div>;
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-16 select-none">
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* 1. TOP HEADER & PERSISTENCE CONTROLS                    */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#0F1117] border border-[#232736] shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D6A84F]/15 text-[#D6A84F] border border-[#D6A84F]/40 flex items-center justify-center font-black shadow-lg">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-2xl text-white tracking-tight">
                إدارة العروض الترفيهية (Show Builder)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                حفظ دائم متصل
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              إنشاء وحفظ العروض التلفزيونية وتخصيص أسئلة وجولات كل لعبة بدقة.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewShowModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-[#161922] hover:bg-[#1F2433] border border-[#282E40] text-[#D6A84F] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>حفظ كعرض جديد (مثال: عرض 1)</span>
          </button>

          <button
            onClick={handleSaveCurrentShow}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'تم الحفظ في الذاكرة ✅' : 'حفظ التعديلات 💾'}</span>
          </button>

          <Link
            href="/play"
            className="px-6 py-3 rounded-2xl gold-cta-button flex items-center gap-2 text-xs font-black shadow-xl cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>بدء العرض المباشر ▶</span>
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 2. SAVED SHOWS VAULT STRIP (عروضك المحفوظة)             */}
      {/* ═══════════════════════════════════════════════════════ */}
      {savedShowsList.length > 0 && (
        <div className="p-5 rounded-3xl bg-[#0B0D13] border border-[#1F2433] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#D6A84F] flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              <span>مكتبة العروض المحفوظة ({savedShowsList.length} عروض):</span>
            </span>
            <span className="text-[11px] text-slate-400">انقر على أي عرض لتحميله وتفعيله فوراً</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {savedShowsList.map((item) => {
              const isCurrent = show.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleLoadSavedShow(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative group ${
                    isCurrent 
                      ? 'bg-[#161922] border-[#D6A84F] shadow-[0_0_20px_rgba(214,168,79,0.15)]' 
                      : 'bg-[#0F1117] border-[#232736] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-xs text-white truncate max-w-[150px]">
                      {item.name}
                    </span>
                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#D6A84F]/20 text-[#D6A84F] text-[9px] font-bold border border-[#D6A84F]/40">
                        مفعّل الآن
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleDeleteSavedShow(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="حذف العرض"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{item.roundsCount} أقسام • {item.questionsTotal} سؤال</span>
                    <span>{item.savedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 3. LIVE SHOW INTELLIGENCE SUMMARY BAR                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#232736] flex flex-col gap-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">أقسام وجولات العرض</span>
          <span className="font-mono text-2xl font-black text-white">{show.rounds.length} ألعاب</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#D6A84F]/40 flex flex-col gap-1 shadow-[0_0_20px_rgba(214,168,79,0.1)]">
          <span className="text-[10px] font-mono text-[#D6A84F] uppercase font-bold">إجمالي الأسئلة في العرض</span>
          <span className="font-mono text-2xl font-black text-[#D6A84F]">{totalQuestions} سؤال / جولة</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#232736] flex flex-col gap-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">المدة التقديرية للعرض</span>
          <span className="font-mono text-2xl font-black text-cyan-300">~{totalEstimatedMinutes} دقيقة</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#232736] flex flex-col gap-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">إجمالي النقاط المتاحة</span>
          <span className="font-mono text-2xl font-black text-emerald-400">+{totalAvailablePoints}★</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 4. MAIN BUILDER GRID (SHOW SETTINGS + ROUNDS CONFIG)   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── SHOW IDENTITY FORM (4 Cols) ──────────────────── */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0F1117] border border-[#232736] flex flex-col gap-4">
            <h2 className="font-display font-black text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D6A84F]" />
              <span>هوية وبيانات العرض الحالي</span>
            </h2>

            <div className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1.5">اسم العرض الترفيهي:</label>
                <input
                  type="text"
                  value={showTitle}
                  onChange={(e) => setShowTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#12141C] border border-[#282E40] text-white font-bold focus:border-[#D6A84F] outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1.5">وصف العرض والجوائز:</label>
                <textarea
                  value={showDescription}
                  onChange={(e) => setShowDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#12141C] border border-[#282E40] text-white font-bold focus:border-[#D6A84F] outline-none resize-none transition-all"
                />
              </div>

              <button
                onClick={handleSaveCurrentShow}
                className="mt-1 w-full py-3 rounded-xl bg-[#161922] hover:bg-[#1F2433] border border-[#282E40] text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSaved ? <Check className="w-4 h-4 text-[#10B981]" /> : null}
                <span>{isSaved ? 'تم حفظ التعديلات بنجاح! ✅' : 'حفظ بيانات العرض 💾'}</span>
              </button>
            </div>
          </div>

          {/* QUICK MULTI-GAME SHOW BUILDER PRESET */}
          <div className="p-6 rounded-3xl bg-[#0F1117] border border-[#232736] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#1F2433] pb-2.5">
              <h3 className="font-display font-black text-sm text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-[#D6A84F]" />
                <span>توليد عرض سريع متعدد الألعاب</span>
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              حدد الألعاب المطلوبة وعدد أسئلتها لتوليد كافة أقسام العرض فوراً:
            </p>

            <div className="flex flex-col gap-3">
              {[
                { id: 'capitals', label: '🏛️ تحدي عواصم العالم', defaultQuestions: 5, defaultPoints: 100 },
                { id: 'memory-match', label: '🧠 لعبة الذاكرة', defaultQuestions: 3, defaultPoints: 200 },
                { id: 'bomb-pass', label: '🧨 القنبلة الموقوتة', defaultQuestions: 3, defaultPoints: 500 },
                { id: 'quiz', label: '🎓 المسابقات الثقافية', defaultQuestions: 5, defaultPoints: 100 },
                { id: 'what-do-they-say', label: '💬 وش يقولون؟', defaultQuestions: 4, defaultPoints: 200 },
                { id: 'hunter-roulette', label: '🎯 روليت الصياد', defaultQuestions: 2, defaultPoints: 300 },
                { id: 'mystery-roulette', label: '🔮 الروليت الغامض', defaultQuestions: 2, defaultPoints: 2000 },
                { id: 'musical-chairs', label: '🪑 الكراسي الموسيقية', defaultQuestions: 2, defaultPoints: 400 },
              ].map((item) => {
                const isChecked = selectedQuickEngines[item.id]?.enabled || false;
                const count = selectedQuickEngines[item.id]?.questionsCount ?? item.defaultQuestions;

                return (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all flex flex-col gap-2 ${
                      isChecked ? 'bg-[#12141C] border-[#D6A84F]/40' : 'bg-[#0A0D14] border-[#1F2433] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-white">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            setSelectedQuickEngines(prev => ({
                              ...prev,
                              [item.id]: {
                                enabled: e.target.checked,
                                questionsCount: prev[item.id]?.questionsCount ?? item.defaultQuestions,
                                points: prev[item.id]?.points ?? item.defaultPoints
                              }
                            }));
                          }}
                          className="w-4 h-4 rounded text-[#D6A84F] focus:ring-0 cursor-pointer accent-[#D6A84F]"
                        />
                        <span>{item.label}</span>
                      </label>

                      {isChecked && (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">الأسئلة:</span>
                          <input
                            type="number"
                            min={1}
                            max={30}
                            value={count}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value) || 1);
                              setSelectedQuickEngines(prev => ({
                                ...prev,
                                [item.id]: { ...prev[item.id], questionsCount: val }
                              }));
                            }}
                            className="w-14 p-1 rounded-lg bg-[#161922] border border-[#282E40] text-center font-mono font-black text-xs text-[#D6A84F]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={handleApplyMultiGamePreset}
                className="mt-2 w-full py-3 rounded-xl gold-cta-button text-xs font-black cursor-pointer shadow-lg"
              >
                تطبيق وإنشاء العرض المجمع 🚀
              </button>
            </div>
          </div>
        </div>

        {/* ── CONFIGURED ROUNDS & QUESTIONS LIST (8 Cols) ───── */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0F1117] border border-[#232736] flex flex-col gap-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1F2433] pb-3">
            <div>
              <h2 className="font-display font-black text-lg text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#D6A84F]" />
                <span>أقسام العرض وتوزيع الأسئلة ({show.rounds.length} أقسام)</span>
              </h2>
              <p className="text-xs text-slate-400">حدد عدد الأسئلة ومدة الوقت والنقاط لكل قسم على حدة</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReshuffleAllShowQuestions}
                className="px-3.5 py-2 rounded-xl bg-[#161922] hover:bg-[#1F2433] border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="سحب وتجديد أسئلة عشوائية جديدة لجميع أقسام العرض"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تجديد أسئلة العرض 🔀</span>
              </button>

              <button
                onClick={() => setIsAddingRound(true)}
                className="px-4 py-2 rounded-xl bg-[#161922] hover:bg-[#1F2433] border border-[#282E40] text-[#D6A84F] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ إضافة قسم ولعبة جديدة</span>
              </button>
            </div>
          </div>

          {/* Add Round Inline Form Drawer */}
          {isAddingRound && (
            <div className="p-5 rounded-2xl bg-[#12141C] border border-[#D6A84F]/50 flex flex-col gap-4 animate-in zoom-in-95 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1F2433] pb-2">
                <span className="text-xs font-black text-[#D6A84F]">إضافة قسم ولعبة جديدة للعرض:</span>
                <span className="text-[10px] text-slate-400">تخصيص تفصيلي للأسئلة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">عنوان القسم:</label>
                  <input
                    type="text"
                    placeholder="مثال: جولة العواصم السريعة"
                    value={newRoundTitle}
                    onChange={(e) => setNewRoundTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#08090C] border border-[#282E40] text-white font-bold outline-none focus:border-[#D6A84F]"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">نوع اللعبة / المحرك:</label>
                  <select
                    value={newRoundEngine}
                    onChange={(e) => {
                      const eng = e.target.value as EngineType;
                      setNewRoundEngine(eng);
                      const s = GAME_ENGINE_SECTIONS.find(sec => sec.id === eng);
                      if (s) setNewRoundTitle(s.title);
                    }}
                    className="w-full p-2.5 rounded-xl bg-[#08090C] border border-[#282E40] text-[#D6A84F] font-bold outline-none"
                  >
                    {GAME_ENGINE_SECTIONS.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Questions, Time & Points Setting */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">عدد الأسئلة في هذا القسم:</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newRoundQuestionsCount}
                    onChange={(e) => setNewRoundQuestionsCount(parseInt(e.target.value) || 5)}
                    className="w-full p-2.5 rounded-xl bg-[#08090C] border border-[#282E40] text-white font-bold outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">الوقت لكل سؤال:</label>
                  {newRoundEngine === 'memory-match' || newRoundEngine === 'what-do-they-say' ? (
                    <div className="w-full p-2.5 rounded-xl bg-[#08090C] border border-[#282E40] text-amber-400 font-bold text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>بدون مؤقت (ينتهي باكتمال الحل)</span>
                    </div>
                  ) : (
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={newRoundTimeLimit}
                      onChange={(e) => setNewRoundTimeLimit(parseInt(e.target.value) || 30)}
                      className="w-full p-2.5 rounded-xl bg-[#08090C] border border-[#282E40] text-white font-bold outline-none font-mono"
                    />
                  )}
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">النقاط لكل إجابة صحيحة:</label>
                  <input
                    type="number"
                    min={10}
                    max={2000}
                    step={50}
                    value={newRoundPoints}
                    onChange={(e) => setNewRoundPoints(parseInt(e.target.value) || 100)}
                    className="w-full p-2.5 rounded-xl bg-[#08090C] border border-[#282E40] text-[#D6A84F] font-bold outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 text-xs pt-2">
                <button
                  onClick={() => setIsAddingRound(false)}
                  className="px-4 py-2 rounded-xl bg-[#161922] text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddRound}
                  className="px-6 py-2 rounded-xl gold-cta-button text-xs font-black cursor-pointer shadow-md"
                >
                  إضافة القسم للعرض ✅
                </button>
              </div>
            </div>
          )}

          {/* List of Configured Show Rounds with Question Controls */}
          <div className="flex flex-col gap-3">
            {show.rounds.map((round, idx) => {
              const qCount = round.questionsCount || round.questions.length || 5;
              const timeLimit = round.timeLimitPerQuestionSeconds || 30;
              const points = round.pointsPerQuestion || 100;
              const isUntimed = round.engineType === 'memory-match' || round.engineType === 'what-do-they-say';

              return (
                <div 
                  key={round.id} 
                  className="p-4 sm:p-5 rounded-2xl bg-[#12141C] border border-[#1F2433] hover:border-[#D6A84F]/40 transition-all flex flex-col gap-3 group"
                >
                  {/* Round Header & Engine Name */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#D6A84F]/10 text-[#D6A84F] border border-[#D6A84F]/30 flex items-center justify-center font-black text-xs font-mono">
                        #{idx + 1}
                      </span>
                      <div>
                        <h3 className="font-display font-black text-sm text-white">
                          {round.title}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400">
                          المحرك: <strong className="text-[#D6A84F]">{round.engineType}</strong> • ({round.questions?.length || qCount} أسئلة محملة)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReshuffleRoundQuestions(round.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#161922] hover:bg-[#1F2433] text-[#00F0FF] border border-[#00F0FF]/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="سحب أسئلة عشوائية جديدة من البنك لهذا القسم"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>تجديد الأسئلة 🔀</span>
                      </button>

                      <Link
                        href={`/play?engine=${round.engineType}`}
                        className="px-3.5 py-1.5 rounded-xl bg-[#D6A84F]/15 hover:bg-[#D6A84F] text-[#D6A84F] hover:text-[#08090C] border border-[#D6A84F]/40 text-xs font-black transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>تشغيل الجولة</span>
                      </Link>

                      <button 
                        onClick={() => handleDeleteRound(round.id)}
                        className="p-2 rounded-xl bg-[#161922] text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 border border-[#282E40] transition-all cursor-pointer"
                        title="حذف الجولة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Per-Round Interactive Controls (Questions Count / Time Limit / Points) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#1F2433] text-xs">
                    {/* Questions Count Selector */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#08090C] border border-[#232736]">
                      <span className="text-slate-400 font-medium">عدد الأسئلة:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={qCount}
                          onChange={(e) => handleUpdateRoundConfig(round.id, 'questionsCount', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-14 p-1 rounded-lg bg-[#161922] border border-[#282E40] text-center font-mono font-bold text-[#D6A84F] text-xs"
                        />
                        <span className="text-slate-400 text-[10px]">سؤال</span>
                      </div>
                    </div>

                    {/* Time Limit Selector or Untimed Notice */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#08090C] border border-[#232736]">
                      <span className="text-slate-400 font-medium">الوقت:</span>
                      {isUntimed ? (
                        <span className="text-[11px] font-bold text-amber-400">
                          ⏳ حتى اكتمال الإجابات
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={timeLimit}
                            onChange={(e) => handleUpdateRoundConfig(round.id, 'timeLimitPerQuestionSeconds', parseInt(e.target.value) || 30)}
                            className="p-1 rounded-lg bg-[#161922] border border-[#282E40] text-center font-mono font-bold text-white text-xs"
                          >
                            <option value={10}>10 ثوانٍ</option>
                            <option value={15}>15 ثانية</option>
                            <option value={20}>20 ثانية</option>
                            <option value={30}>30 ثانية</option>
                            <option value={45}>45 ثانية</option>
                            <option value={60}>60 ثانية</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Points Selector */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#08090C] border border-[#232736]">
                      <span className="text-slate-400 font-medium">النقاط:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={10}
                          max={2000}
                          step={50}
                          value={points}
                          onChange={(e) => handleUpdateRoundConfig(round.id, 'pointsPerQuestion', parseInt(e.target.value) || 100)}
                          className="w-16 p-1 rounded-lg bg-[#161922] border border-[#282E40] text-center font-mono font-bold text-emerald-400 text-xs"
                        />
                        <span className="text-slate-400 text-[10px]">نقطة</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 5. MODAL: CREATE NEW NAMED SHOW (عرض جديد)              */}
      {/* ═══════════════════════════════════════════════════════ */}
      {newShowModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0F1117] border border-[#D6A84F]/50 shadow-2xl flex flex-col gap-4">
            <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D6A84F]" />
              <span>إنشاء وحفظ عرض ترفيهي جديد</span>
            </h3>

            <p className="text-xs text-slate-300">
              أدخل اسم العرض ليتم حفظه في مكتبتك الدائمة (مثلاً: عرض 1، سهرة الخميس، تحدي العمالقة):
            </p>

            <input
              type="text"
              placeholder="مثال: عرض 1"
              value={newShowNameInput}
              onChange={(e) => setNewShowNameInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#12141C] border border-[#282E40] text-white font-bold text-sm outline-none focus:border-[#D6A84F]"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNewShowModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#161922] text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateNewNamedShow}
                className="px-6 py-2.5 rounded-xl gold-cta-button text-xs font-black cursor-pointer shadow-lg"
              >
                إنشاء وحفظ العرض 🚀
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
