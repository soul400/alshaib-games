'use client';

import React, { useState, useRef } from 'react';
import { NationalDayQuestion, NationalDay96ActivityId } from '@aep/types';
import { 
  Sparkles, Layers, Plus, Check, Trash2, Edit3, 
  HelpCircle, Search, Filter, Bot, ShieldAlert, CheckCircle2, Clock,
  Image as ImageIcon, Upload, Link2, X, Save
} from 'lucide-react';
import { NATIONAL_DAY_ACTIVITIES } from './NationalDayActivityGrid';

interface Props {
  questions: NationalDayQuestion[];
  onAddQuestion: (q: Partial<NationalDayQuestion>) => void;
  onUpdateQuestion: (id: string, updates: Partial<NationalDayQuestion>) => void;
  onDeleteQuestion: (id: string) => void;
  onApproveReviewQuestion: (id: string) => void;
}

export function NationalDayContentLibrary({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onApproveReviewQuestion
}: Props) {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'REVIEW'>('ACTIVE');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // AI Generator state
  const [aiCategory, setAiCategory] = useState<string>('تاريخ');
  const [aiActivity, setAiActivity] = useState<NationalDay96ActivityId>('saudi-great');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiCount, setAiCount] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Manual Add / Edit Form state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<NationalDayQuestion | null>(null);
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [newAlternatives, setNewAlternatives] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('تاريخ الملوك');
  const [newPoints, setNewPoints] = useState<number>(1);
  const [newActivityId, setNewActivityId] = useState<NationalDay96ActivityId>('saudi-great');
  const [newMediaUrl, setNewMediaUrl] = useState<string>('');
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered lists
  const filtered = questions.filter(q => {
    const matchesStatus = q.status === activeTab;
    const matchesActivity = selectedActivity === 'all' || q.activityId === selectedActivity;
    const matchesSearch = !searchQuery || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesActivity && matchesSearch;
  });

  const reviewCount = questions.filter(q => q.status === 'REVIEW').length;

  // Activity counts for sidebar
  const activityCounts = NATIONAL_DAY_ACTIVITIES.filter(a => !a.hidden).map(a => ({
    ...a,
    count: questions.filter(q => q.activityId === a.id && q.status === 'ACTIVE').length
  }));

  // AI Question Generation Simulation into REVIEW Queue
  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedSamples: Array<Partial<NationalDayQuestion>> = [
        {
          activityId: aiActivity,
          category: `الذكاء الاصطناعي - ${aiCategory}`,
          question: `سؤال ذكي مولد حول ${aiCategory}: ما هو المعلم أو الحدث الوطني المرتبط بهذه الفئة؟`,
          correctAnswer: 'المملكة العربية السعودية',
          acceptableAnswers: ['المملكة العربية السعودية', 'السعودية', 'Saudi Arabia'],
          difficulty: aiDifficulty,
          points: 1,
          timeLimitSeconds: 15,
          explanation: 'تم التوليد بواسطة الذكاء الاصطناعي للمراجعة والاعتماد.',
          status: 'REVIEW',
          usedCount: 0,
          createdAt: Date.now()
        },
        {
          activityId: aiActivity,
          category: `رؤية 2030 - ${aiCategory}`,
          question: `ما هو المستهدف الرئيسي لقطاع ${aiCategory} ضمن مبادرات رؤية 2030؟`,
          correctAnswer: 'الاستدامة والابتكار',
          acceptableAnswers: ['الاستدامة', 'الابتكار', 'الاستدامة والابتكار'],
          difficulty: aiDifficulty,
          points: 1,
          timeLimitSeconds: 15,
          explanation: 'تم التوليد آلياً لمراجعة المسؤول.',
          status: 'REVIEW',
          usedCount: 0,
          createdAt: Date.now()
        }
      ];

      generatedSamples.slice(0, aiCount).forEach(item => onAddQuestion(item));
      setIsGenerating(false);
      setActiveTab('REVIEW');
    }, 900);
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingQuestion(null);
    setNewQuestionText('');
    setNewAnswer('');
    setNewAlternatives('');
    setNewCategory('تاريخ الملوك');
    setNewPoints(1);
    setNewActivityId('saudi-great');
    setNewMediaUrl('');
    setImageUploadMode('url');
    setShowAddModal(true);
  };

  // Open Edit Modal
  const openEditModal = (q: NationalDayQuestion) => {
    setEditingQuestion(q);
    setNewQuestionText(q.question);
    setNewAnswer(q.correctAnswer);
    setNewAlternatives(q.acceptableAnswers.filter(a => a !== q.correctAnswer).join('، '));
    setNewCategory(q.category);
    setNewPoints(q.points);
    setNewActivityId(q.activityId);
    setNewMediaUrl(q.mediaUrl || '');
    setImageUploadMode(q.mediaUrl ? 'url' : 'url');
    setShowAddModal(true);
  };

  // Handle file upload → convert to base64 data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة (PNG, JPG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setNewMediaUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newAnswer.trim()) return;

    const alts = newAlternatives
      .split(/[,،]/)
      .map(s => s.trim())
      .filter(Boolean);

    const questionData: Partial<NationalDayQuestion> = {
      activityId: newActivityId,
      category: newCategory,
      question: newQuestionText.trim(),
      correctAnswer: newAnswer.trim(),
      acceptableAnswers: [newAnswer.trim(), ...alts],
      difficulty: 'medium',
      points: Number(newPoints) || 1,
      timeLimitSeconds: 15,
      mediaUrl: newMediaUrl.trim() || undefined,
      mediaType: newMediaUrl.trim() ? 'image' : undefined,
      status: 'ACTIVE',
      usedCount: 0,
      createdAt: Date.now()
    };

    if (editingQuestion) {
      // Update existing question
      onUpdateQuestion(editingQuestion.id, questionData);
    } else {
      // Add new question
      onAddQuestion(questionData);
    }

    setNewQuestionText('');
    setNewAnswer('');
    setNewAlternatives('');
    setNewMediaUrl('');
    setEditingQuestion(null);
    setShowAddModal(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 my-6">
      
      {/* Header & Main Controls */}
      <div className="w-full flex items-center justify-between border-b border-[#006C35]/40 pb-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#004D25] to-[#00A859] flex items-center justify-center text-white font-black shadow-md border border-[#E2D4B7]/30">
            <Layers className="w-5 h-5 text-[#E2D4B7]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>بنك الأسئلة والمولد الذكي</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#C69214]/20 text-[#E2D4B7] border border-[#C69214]/40 font-mono">
                {questions.length} أسئلة موثقة
              </span>
            </h2>
            <span className="text-xs text-[#E2D4B7]/70 font-bold">
              إدارة محتوى فعاليات اليوم الوطني والأسئلة المولدة بالذكاء الاصطناعي
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#006C35] to-[#00A859] text-white font-black text-xs flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سؤال يدوياً</span>
          </button>
        </div>
      </div>

      {/* 🤖 AI QUESTION GENERATOR BOX */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#041F10] via-[#082915] to-[#041F10] border border-[#00A859]/50 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#C69214]" />
            <h3 className="text-sm font-black text-white">
              توليد أسئلة وطنية ذكية (AI Question Generator)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 font-bold bg-[#004D25]/60 px-3 py-1 rounded-full border border-[#00A859]/30">
            ⚠️ أي سؤال يتم توليده يدخل في قائمة المراجعة (Review Queue) أولاً
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#E2D4B7]">الفعالية المستهدفة</label>
            <select
              value={aiActivity}
              onChange={e => setAiActivity(e.target.value as NationalDay96ActivityId)}
              className="px-3 py-2 rounded-xl bg-[#020D06] border border-white/10 text-white text-xs font-bold focus:border-[#00A859] outline-none"
            >
              {NATIONAL_DAY_ACTIVITIES.filter(a => !a.hidden).map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#E2D4B7]">الفئة والتصنيف</label>
            <input
              type="text"
              value={aiCategory}
              onChange={e => setAiCategory(e.target.value)}
              placeholder="تاريخ، جغرافيا، مشاريع، فن..."
              className="px-3 py-2 rounded-xl bg-[#020D06] border border-white/10 text-white text-xs font-bold focus:border-[#00A859] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#E2D4B7]">مستوى الصعوبة</label>
            <select
              value={aiDifficulty}
              onChange={e => setAiDifficulty(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-[#020D06] border border-white/10 text-white text-xs font-bold focus:border-[#00A859] outline-none"
            >
              <option value="easy">سهل (نقطة واحدة)</option>
              <option value="medium">متوسط (نقطة واحدة)</option>
              <option value="hard">صعب (نقطة واحدة)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-[#C69214] hover:bg-[#D4A122] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{isGenerating ? 'جاري التوليد...' : 'توليد بالذكاء الاصطناعي'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Quick Stats */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {activityCounts.filter(a => a.count > 0).map(a => (
          <button
            key={a.id}
            onClick={() => setSelectedActivity(a.id === selectedActivity ? 'all' : a.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
              selectedActivity === a.id
                ? 'bg-[#006C35] text-white border-[#00A859] shadow-md'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            {a.title} ({a.count})
          </button>
        ))}
      </div>

      {/* Tabs & Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-[#081B10] p-1.5 rounded-2xl border border-[#006C35]/50">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'bg-gradient-to-r from-[#006C35] to-[#00A859] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            الأسئلة النشطة في البث ({questions.filter(q => q.status === 'ACTIVE').length})
          </button>

          <button
            onClick={() => setActiveTab('REVIEW')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REVIEW'
                ? 'bg-gradient-to-r from-[#006C35] to-[#00A859] text-white shadow-md'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>قائمة المراجعة والاعتماد ({reviewCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث في الأسئلة..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-9 pl-3 py-2 rounded-xl bg-[#081B10] border border-white/10 text-white text-xs font-bold outline-none w-48 focus:border-[#00A859]"
            />
          </div>

          <select
            value={selectedActivity}
            onChange={e => setSelectedActivity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#081B10] border border-white/10 text-white text-xs font-bold outline-none"
          >
            <option value="all">جميع الفعاليات</option>
            {NATIONAL_DAY_ACTIVITIES.filter(a => !a.hidden).map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Table / List */}
      <div className="rounded-3xl bg-[#081B10] border border-[#006C35]/50 overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex gap-3 flex-1">
                {/* Image thumbnail */}
                {q.mediaUrl && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-[#00A859]/40">
                    <img src={q.mediaUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#004D25] text-[#00A859] border border-[#00A859]/30">
                      {q.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-slate-300">
                      {q.difficulty} • +{q.points} نقطة
                    </span>
                    {q.mediaUrl && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        صورة
                      </span>
                    )}
                    {q.status === 'REVIEW' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        بانتظار المراجعة
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-white">
                    {q.question}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-[#E2D4B7]/80 font-bold flex-wrap">
                    <span className="text-[#00A859]">الإجابة النموذجية: {q.correctAnswer}</span>
                    {q.acceptableAnswers?.length > 1 && (
                      <span className="text-slate-400">
                        (البدائل: {q.acceptableAnswers.filter(a => a !== q.correctAnswer).join(' ، ')})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {q.status === 'REVIEW' && (
                  <button
                    onClick={() => onApproveReviewQuestion(q.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>قبول ونشر</span>
                  </button>
                )}

                <button
                  onClick={() => openEditModal(q)}
                  className="p-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 transition-all cursor-pointer"
                  title="تعديل السؤال"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteQuestion(q.id)}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                  title="حذف السؤال"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm font-bold">
              لا توجد أسئلة تطابق الفلاتر المحددة...
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-[#081B10] border border-[#00A859]/60 max-w-lg w-full flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">
                {editingQuestion ? '✏️ تعديل السؤال' : '➕ إضافة سؤال وطني جديد'}
              </h3>
              <button
                onClick={() => { setShowAddModal(false); setEditingQuestion(null); }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#E2D4B7]">الفعالية</label>
                <select
                  value={newActivityId}
                  onChange={e => setNewActivityId(e.target.value as NationalDay96ActivityId)}
                  className="px-3 py-2 rounded-xl bg-[#020D06] border border-white/10 text-white text-xs font-bold outline-none"
                >
                  {NATIONAL_DAY_ACTIVITIES.filter(a => !a.hidden).map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#E2D4B7]">التصنيف</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="مثال: تاريخ الملوك، رؤية 2030، جغرافيا..."
                  className="px-3 py-2 rounded-xl bg-[#020D06] border border-white/10 text-white text-xs font-bold outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#E2D4B7]">نص السؤال</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: من هو الملك الذي أطلق رؤية السعودية 2030؟"
                  value={newQuestionText}
                  onChange={e => setNewQuestionText(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#020D06] border border-white/10 text-white text-xs font-bold outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#E2D4B7]">الإجابة النموذجية</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الملك سلمان"
                  value={newAnswer}
                  onChange={e => setNewAnswer(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#020D06] border border-white/10 text-white text-xs font-bold outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#E2D4B7]">إجابات بديلة مقبولة (مفصولة بفواصل)</label>
                <input
                  type="text"
                  placeholder="مثال: الملك سلمان بن عبدالعزيز، خادم الحرمين"
                  value={newAlternatives}
                  onChange={e => setNewAlternatives(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#020D06] border border-white/10 text-white text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#E2D4B7]">النقاط</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newPoints}
                    onChange={e => setNewPoints(Number(e.target.value))}
                    className="px-3 py-2 rounded-xl bg-[#020D06] border border-white/10 text-white text-xs font-bold outline-none"
                  />
                </div>
              </div>

              {/* 🖼️ Image Upload Section */}
              <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#020D06] border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#E2D4B7] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#C69214]" />
                    صورة مع السؤال (اختياري)
                  </label>
                  <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('url')}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all ${
                        imageUploadMode === 'url' ? 'bg-[#006C35] text-white' : 'text-slate-400'
                      }`}
                    >
                      <Link2 className="w-3 h-3 inline ml-1" />
                      رابط
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('file')}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all ${
                        imageUploadMode === 'file' ? 'bg-[#006C35] text-white' : 'text-slate-400'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline ml-1" />
                      من الجهاز
                    </button>
                  </div>
                </div>

                {imageUploadMode === 'url' ? (
                  <input
                    type="url"
                    placeholder="الصق رابط الصورة هنا... (https://...)"
                    value={newMediaUrl}
                    onChange={e => setNewMediaUrl(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#030F08] border border-white/10 text-white text-xs font-bold outline-none focus:border-[#00A859]"
                    dir="ltr"
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-white/20 hover:border-[#00A859]/50 text-xs font-bold text-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-white/5"
                    >
                      <Upload className="w-4 h-4 text-[#C69214]" />
                      <span>اضغط لاختيار صورة من الجهاز</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">PNG, JPG, WEBP • الحد الأقصى 5 ميجابايت</span>
                  </div>
                )}

                {/* Image Preview */}
                {newMediaUrl && (
                  <div className="relative mt-1">
                    <img
                      src={newMediaUrl}
                      alt="معاينة الصورة"
                      className="w-full max-h-40 object-contain rounded-xl border border-[#00A859]/40"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setNewMediaUrl('')}
                      className="absolute top-2 left-2 p-1 rounded-full bg-rose-500/80 text-white hover:bg-rose-600 transition-all cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingQuestion(null); }}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#006C35] to-[#00A859] text-white font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingQuestion ? 'حفظ التعديلات' : 'حفظ ونشر'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
