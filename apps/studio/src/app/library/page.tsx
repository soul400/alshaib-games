'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { GAME_ENGINE_SECTIONS, importContentFromRawData, generateAIQuestions, WHAT_DO_THEY_SAY_BANK, NATIONAL_DAY_96_BANK } from '@aep/content-library';
import { AnyQuestion, ImportReport, EngineType, ImageTransformStyle, WhatDoTheySayAnswer, NationalDayQuestion, NationalDay96ActivityId } from '@aep/types';
import { getImageStyleCSS } from '@aep/game-engines';
import { 
  Database, FileSpreadsheet, Wand2, Upload, CheckCircle2, 
  BrainCircuit, Grid, Image as ImageIcon, Video, Volume2, 
  Shuffle, Smile, UserCheck, Plus, Trash2, FileUp, Music, FileCheck, Sparkles, HelpCircle,
  Edit2, Save, X, Layers, Flag, MapPin, Search, Edit3, Link2, ChevronLeft
} from 'lucide-react';

import { saveQuestionsToStorage as persistQuestions, loadQuestionsFromStorage } from '../../utils/aepStorage';
import { transformToCaricatureCanvas } from '../../utils/caricatureProcessor';

const IMAGE_EFFECTS_LIST: { id: ImageTransformStyle; label: string }[] = [
  { id: 'caricature', label: '🎭 كاريكاتير Caricature' },
  { id: 'blur', label: 'تغبيش Blur' },
  { id: 'pixel', label: 'بكسل Pixel' },
  { id: 'sketch', label: 'رسم Sketch' },
  { id: 'mosaic', label: 'موزاييك Mosaic' },
  { id: 'black-shadow', label: 'ظل أسود Shadow' },
  { id: 'comic-style', label: 'كوميك Comic' },
  { id: 'cartoon', label: 'كرتون Cartoon' },
  { id: 'half-image', label: 'نصف صورة Half' },
  { id: 'normal', label: 'بدون تأثير Normal' }
];

export default function LibraryPage() {
  const [questions, setQuestions] = useState<AnyQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<'sections' | 'questions' | 'national-day' | 'add' | 'import' | 'ai'>('sections');
  const [selectedEngineFilter, setSelectedEngineFilter] = useState<EngineType | 'all'>('all');

  // 🇸🇦 Saudi National Day 96 State in Library
  const [ndQuestions, setNdQuestions] = useState<NationalDayQuestion[]>([]);
  const [selectedNdActivity, setSelectedNdActivity] = useState<string>('challenge-96');
  const [ndRegionFilter, setNdRegionFilter] = useState<string>('all');
  const [ndSearchQuery, setNdSearchQuery] = useState<string>('');

  // National Day Add / Edit Modal State
  const [isNdModalOpen, setIsNdModalOpen] = useState<boolean>(false);
  const [editingNdQuestion, setEditingNdQuestion] = useState<NationalDayQuestion | null>(null);
  const [modalQText, setModalQText] = useState<string>('');
  const [modalQRegion, setModalQRegion] = useState<string>('المنطقة الشمالية');
  const [modalQAnswer, setModalQAnswer] = useState<string>('');
  const [modalQSynonyms, setModalQSynonyms] = useState<string>('');
  const [modalQActivity, setModalQActivity] = useState<NationalDay96ActivityId>('challenge-96');
  const [modalQMediaUrl, setModalQMediaUrl] = useState<string>('');
  const ndFileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Custom Question Form State
  const [newTitle, setNewTitle] = useState('');
  const [newEngineType, setNewEngineType] = useState<EngineType>('quiz');
  const [newCategory, setNewCategory] = useState('عام');
  const [newAcceptableAnswers, setNewAcceptableAnswers] = useState('');
  const [newPoints, setNewPoints] = useState(100);
  const [newTimeLimit, setNewTimeLimit] = useState(25);
  
  // Uploaded Media States (Images, Videos, Audio, Filter Effect)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedTransformStyle, setSelectedTransformStyle] = useState<ImageTransformStyle>('blur');

  const [rawInput, setRawInput] = useState('');
  const [importReport, setImportReport] = useState<ImportReport | null>(null);
  const [excelImportStatus, setExcelImportStatus] = useState<string | null>(null);
  const [aiTopic, setAiTopic] = useState('');

  // Edit WDTS Answer Modal State
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editAnswers, setEditAnswers] = useState<WhatDoTheySayAnswer[]>([]);

  // Load saved questions from IndexedDB / localStorage on mount
  useEffect(() => {
    loadQuestionsFromStorage().then(loaded => {
      if (Array.isArray(loaded)) {
        // Automatically purge any old preset quiz questions
        let cleaned = loaded.filter(q => q && !q.id?.startsWith('quiz-q'));

        // Auto-seed what-do-they-say bank or merge any newly added questions
        const existingIds = new Set(cleaned.map(q => q.id));
        const missingDefaults = WHAT_DO_THEY_SAY_BANK.filter(q => !existingIds.has(q.id));
        if (missingDefaults.length > 0) {
          cleaned = [...cleaned, ...missingDefaults];
        }

        setQuestions(cleaned);
        if (cleaned.length !== loaded.length || missingDefaults.length > 0) {
          persistQuestions(cleaned);
        }
      }
    }).catch(err => {
      console.warn('Failed to load questions:', err);
    });

    // Load National Day Questions
    try {
      const savedNd = localStorage.getItem('aep_nd96_custom_questions');
      if (savedNd) {
        const parsed = JSON.parse(savedNd);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(q => q.id));
          const missingBank = NATIONAL_DAY_96_BANK.filter(q => !existingIds.has(q.id));
          setNdQuestions([...parsed, ...missingBank]);
          return;
        }
      }
    } catch (_) {}
    setNdQuestions(NATIONAL_DAY_96_BANK);
  }, []);

  // Save questions to IndexedDB & localStorage whenever updated
  const saveQuestionsToStorage = (updatedQuestions: AnyQuestion[]) => {
    setQuestions(updatedQuestions);
    persistQuestions(updatedQuestions);
  };

  // Save National Day questions to state and localStorage
  const saveNdQuestions = (updated: NationalDayQuestion[]) => {
    setNdQuestions(updated);
    try {
      localStorage.setItem('aep_nd96_custom_questions', JSON.stringify(updated));
    } catch (_) {}
  };

  const handleOpenAddNdModal = () => {
    setEditingNdQuestion(null);
    setModalQText('');
    setModalQRegion(selectedNdActivity === 'challenge-96' ? 'المنطقة الشمالية' : 'عام');
    setModalQAnswer('');
    setModalQSynonyms('');
    setModalQActivity(selectedNdActivity as NationalDay96ActivityId);
    setModalQMediaUrl('');
    setIsNdModalOpen(true);
  };

  const handleOpenEditNdModal = (q: NationalDayQuestion) => {
    setEditingNdQuestion(q);
    setModalQText(q.question);
    setModalQRegion(q.category);
    setModalQAnswer(q.correctAnswer);
    setModalQSynonyms((q.acceptableAnswers || []).filter(a => a !== q.correctAnswer).join(' ، '));
    setModalQActivity(q.activityId);
    setModalQMediaUrl(q.mediaUrl || '');
    setIsNdModalOpen(true);
  };

  const handleSaveNdModal = () => {
    if (!modalQText.trim() || !modalQAnswer.trim()) return;

    const altList = modalQSynonyms
      ? modalQSynonyms.split(/[,،؛;]/).map(s => s.trim()).filter(Boolean)
      : [];
    const allAcceptable = Array.from(new Set([modalQAnswer.trim(), ...altList]));

    if (editingNdQuestion) {
      const updated = ndQuestions.map(q => {
        if (q.id === editingNdQuestion.id) {
          return {
            ...q,
            question: modalQText.trim(),
            category: modalQRegion.trim(),
            correctAnswer: modalQAnswer.trim(),
            acceptableAnswers: allAcceptable,
            activityId: modalQActivity,
            mediaUrl: modalQMediaUrl.trim() || undefined,
            mediaType: modalQMediaUrl.trim() ? ('image' as const) : undefined
          };
        }
        return q;
      });
      saveNdQuestions(updated);
    } else {
      const newEntry: NationalDayQuestion = {
        id: `nd96-q-${Date.now()}`,
        activityId: modalQActivity,
        category: modalQRegion.trim() || 'عام',
        question: modalQText.trim(),
        correctAnswer: modalQAnswer.trim(),
        acceptableAnswers: allAcceptable,
        difficulty: 'medium',
        points: 1,
        timeLimitSeconds: 15,
        mediaUrl: modalQMediaUrl.trim() || undefined,
        mediaType: modalQMediaUrl.trim() ? ('image' as const) : undefined,
        status: 'ACTIVE',
        usedCount: 0,
        createdAt: Date.now()
      };
      saveNdQuestions([newEntry, ...ndQuestions]);
    }

    setIsNdModalOpen(false);
  };

  const handleDeleteNdQuestion = (id: string) => {
    const updated = ndQuestions.filter(q => q.id !== id);
    saveNdQuestions(updated);
  };

  const handleNdImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setModalQMediaUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Flag': return <Flag className="w-6 h-6 text-[#FFE79A]" />;
      case 'BrainCircuit': return <BrainCircuit className="w-6 h-6" />;
      case 'Grid': return <Grid className="w-6 h-6" />;
      case 'Image': return <ImageIcon className="w-6 h-6" />;
      case 'Video': return <Video className="w-6 h-6" />;
      case 'Volume2': return <Volume2 className="w-6 h-6" />;
      case 'Shuffle': return <Shuffle className="w-6 h-6" />;
      case 'Smile': return <Smile className="w-6 h-6" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6" />;
      case 'MessageSquareQuestion': return <HelpCircle className="w-6 h-6" />;
      default: return <BrainCircuit className="w-6 h-6" />;
    }
  };

  // Handle Excel File Upload (.xlsx / .xls) taking ONLY Question & Answer from each row
  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert Sheet to Array of Arrays
        const sheetData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const extractedQuestions: AnyQuestion[] = [];
        let count = 0;

        // Detect if first row is a header
        const firstRow = sheetData[0];
        const isHeader = firstRow && (
          String(firstRow[0] || '').includes('سؤال') || 
          String(firstRow[0] || '').includes('حرف') || 
          String(firstRow[0] || '').includes('كلمة') ||
          String(firstRow[0] || '').includes('رمز') ||
          String(firstRow[0] || '').includes('عنوان') ||
          String(firstRow[0] || '').toLowerCase().includes('question') ||
          String(firstRow[0] || '').toLowerCase().includes('letter') ||
          String(firstRow[0] || '').toLowerCase().includes('word')
        );
        const startIdx = isHeader ? 1 : 0;

        const ENGINE_CATEGORIES: Record<string, string> = {
          'quiz': 'ثقافة وعلوم',
          'alphabet': 'لغة وحروف',
          'image-puzzle': 'بصريات ومعالم',
          'video-challenge': 'سينما وفيديو',
          'audio-challenge': 'أصوات وتأثيرات',
          'mixed-words': 'كلمات ولغة',
          'symbol-puzzle': 'رموز وإيموجي',
          'character': 'تاريخ وشخصيات',
          'what-do-they-say': 'ثقافة ومجتمع'
        };

        for (let idx = startIdx; idx < sheetData.length; idx++) {
          const row = sheetData[idx];
          if (!row || row.length === 0) continue;

          const col1 = String(row[0] || '').trim();
          const col2 = String(row[1] || '').trim();
          const col3 = String(row[2] || '').trim();

          if (!col1) continue;

          count++;
          const category = ENGINE_CATEGORIES[newEngineType] || 'عام';

          switch (newEngineType) {
            case 'mixed-words': {
              // 1 column: الكلمة فقط
              extractedQuestions.push({
                id: `excel-${Date.now()}-${count}`,
                engineType: 'mixed-words',
                title: `أعد ترتيب الحروف لتكوين الكلمة الصحيحة`,
                originalWord: col1,
                scrambledLetters: col1.split('').sort(() => Math.random() - 0.5),
                category,
                difficulty: 'medium',
                points: 120,
                timeLimitSeconds: 30,
                acceptableAnswers: [col1]
              } as any);
              break;
            }
            case 'alphabet': {
              // 3 columns: الحرف | السؤال | الجواب
              if (col2 && col3) {
                const answers = col3.split(';').map(a => a.trim()).filter(Boolean);
                extractedQuestions.push({
                  id: `excel-${Date.now()}-${count}`,
                  engineType: 'alphabet',
                  letter: col1,
                  title: col2,
                  category,
                  difficulty: 'medium',
                  points: 100,
                  timeLimitSeconds: 25,
                  acceptableAnswers: answers
                } as any);
              }
              break;
            }
            case 'symbol-puzzle': {
              // 2 columns: الرموز/الإيموجي | الجواب
              if (col2) {
                const emojis = col1.split(/\s+/).filter(Boolean);
                const answers = col2.split(';').map(a => a.trim()).filter(Boolean);
                extractedQuestions.push({
                  id: `excel-${Date.now()}-${count}`,
                  engineType: 'symbol-puzzle',
                  title: `ما الذي تمثله هذه الرموز: ${col1}`,
                  emojis,
                  iconCategory: 'custom',
                  category,
                  difficulty: 'medium',
                  points: 150,
                  timeLimitSeconds: 25,
                  acceptableAnswers: answers
                } as any);
              }
              break;
            }
            default: {
              // 2 columns: السؤال | الجواب (quiz, image-puzzle, video-challenge, audio-challenge, character)
              if (col2) {
                const answers = col2.split(';').map(a => a.trim()).filter(Boolean);
                extractedQuestions.push({
                  id: `excel-${Date.now()}-${count}`,
                  engineType: newEngineType || 'quiz',
                  title: col1,
                  category,
                  difficulty: 'medium',
                  points: 100,
                  timeLimitSeconds: 25,
                  acceptableAnswers: answers
                } as any);
              }
              break;
            }
          }
        }

        const newAllQuestions = [...extractedQuestions, ...questions];
        saveQuestionsToStorage(newAllQuestions);
        const engineLabel = GAME_ENGINE_SECTIONS.find(s => s.id === newEngineType)?.title || newEngineType;
        setExcelImportStatus(`✅ تم استخراج وتخزين ${extractedQuestions.length} عنصر لقسم "${engineLabel}" من ملف (${file.name}) بنجاح!`);
        setActiveTab('questions');
      } catch (err: any) {
        setExcelImportStatus(`خطأ في قراءة ملف الإكسل: ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Handle local image file upload from computer
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImageUrl(event.target?.result as string);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Handle local video file upload from computer
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedVideoUrl(event.target?.result as string);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Handle local audio file upload from computer
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedAudioUrl(event.target?.result as string);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Create & Save New Question
  const handleAddQuestion = () => {
    if (!newTitle.trim() || !newAcceptableAnswers.trim()) return;

    const answersList = newAcceptableAnswers.split(';').map(a => a.trim()).filter(Boolean);

    const defaultPoints = [45, 35, 28, 22, 18, 15, 12, 10, 8, 7];
    const createdQuestion: any = {
      id: `custom-${Date.now()}`,
      engineType: newEngineType,
      title: newTitle,
      category: newCategory || 'عام',
      difficulty: 'medium',
      points: Number(newPoints) || (newEngineType === 'what-do-they-say' ? 200 : 100),
      timeLimitSeconds: Number(newTimeLimit) || 25,
      acceptableAnswers: answersList,
      imageUrl: uploadedImageUrl || undefined,
      videoUrl: uploadedVideoUrl || undefined,
      audioUrl: uploadedAudioUrl || undefined,
      transformStyle: selectedTransformStyle,
      ...(newEngineType === 'what-do-they-say' ? {
        totalScore: 200,
        phase: 'PLAYING',
        mode: 'SOLO',
        answers: answersList.slice(0, 10).map((rawEntry, idx) => {
          // Each entry can have comma-separated aliases: "الجوال,التلفون,الهاتف"
          const parts = rawEntry.split(',').map(p => p.trim()).filter(Boolean);
          const mainTitle = parts[0] || rawEntry;
          return {
            rank: idx + 1,
            title: mainTitle,
            emoji: '✨',
            points: defaultPoints[idx] || 10,
            aliases: parts.length > 1 ? parts : [mainTitle],
            isRevealed: false
          };
        })
      } : {})
    };

    const newAll = [createdQuestion, ...questions];
    saveQuestionsToStorage(newAll);

    // Reset Form
    setNewTitle('');
    setNewAcceptableAnswers('');
    setUploadedImageUrl(null);
    setUploadedVideoUrl(null);
    setUploadedAudioUrl(null);
    setUploadedFileName(null);
    setActiveTab('questions');
  };

  const handleDeleteQuestion = (id: string) => {
    const newAll = questions.filter(q => q.id !== id);
    saveQuestionsToStorage(newAll);
  };

  // Open edit modal for a what-do-they-say question
  const handleOpenEditWDTS = (questionId: string) => {
    const q = questions.find(q => q.id === questionId) as any;
    if (!q || !q.answers) return;
    setEditingQuestionId(questionId);
    setEditAnswers(q.answers.map((a: WhatDoTheySayAnswer) => ({ ...a, aliases: [...(a.aliases || [])] })));
  };

  // Update a single answer's title and auto-regenerate aliases
  const handleEditAnswerTitle = (idx: number, newTitle: string) => {
    setEditAnswers(prev => {
      const updated = [...prev];
      const old = updated[idx];
      // Replace old title in aliases with new title, keeping other manual aliases
      const newAliases = (old.aliases || []).map(a => a === old.title ? newTitle : a);
      // Ensure the new title is in aliases
      if (!newAliases.includes(newTitle)) {
        newAliases.unshift(newTitle);
      }
      updated[idx] = { ...old, title: newTitle, aliases: newAliases };
      return updated;
    });
  };

  // Update aliases directly (comma-separated input)
  const handleEditAnswerAliases = (idx: number, aliasesStr: string) => {
    setEditAnswers(prev => {
      const updated = [...prev];
      const ans = updated[idx];
      const newAliases = aliasesStr.split(',').map(a => a.trim()).filter(Boolean);
      // Ensure the title is always included
      if (!newAliases.includes(ans.title)) {
        newAliases.unshift(ans.title);
      }
      updated[idx] = { ...ans, aliases: newAliases };
      return updated;
    });
  };

  // Update answer emoji
  const handleEditAnswerEmoji = (idx: number, newEmoji: string) => {
    setEditAnswers(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], emoji: newEmoji };
      return updated;
    });
  };

  // Update answer points
  const handleEditAnswerPoints = (idx: number, newPoints: number) => {
    setEditAnswers(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], points: newPoints };
      return updated;
    });
  };

  // Save edited answers back to storage
  const handleSaveEditWDTS = () => {
    if (!editingQuestionId) return;
    const updatedQuestions = questions.map(q => {
      if (q.id === editingQuestionId) {
        const totalScore = editAnswers.reduce((s, a) => s + a.points, 0);
        return { ...q, answers: editAnswers, totalScore, points: totalScore } as any;
      }
      return q;
    });
    saveQuestionsToStorage(updatedQuestions);
    setEditingQuestionId(null);
    setEditAnswers([]);
  };

  const handleClearAllQuestions = () => {
    saveQuestionsToStorage([]);
    setExcelImportStatus(null);
  };

  const handleImport = () => {
    if (!rawInput.trim()) return;
    const { questions: newQ, report } = importContentFromRawData(rawInput, rawInput.startsWith('[') ? 'json' : 'csv');
    const newAll = [...newQ, ...questions];
    saveQuestionsToStorage(newAll);
    setImportReport(report);
  };

  const handleAIGenerate = () => {
    if (!aiTopic.trim()) return;
    const newAIQ = generateAIQuestions(aiTopic, 3);
    const newAll = [...newAIQ, ...questions];
    saveQuestionsToStorage(newAll);
  };

  const filteredQuestions = selectedEngineFilter === 'all'
    ? questions
    : questions.filter(q => q.engineType === selectedEngineFilter);

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel-glow border border-emerald-400/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-[0_0_25px_rgba(16,185,129,0.6)]">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">إدارة واستيراد ملفات الإكسل والميديا (Content Library)</h2>
            <p className="text-xs text-emerald-300">رفع ملفات Excel (.xlsx / .xls) وتخزينها دائماً، وتحميل الصور والفيديو والصوت من الكمبيوتر</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sections' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'glass-panel text-slate-300'
            }`}
          >
            الأقسام الثمانية
          </button>
          <button
            onClick={() => setActiveTab('national-day')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'national-day' 
                ? 'bg-gradient-to-r from-[#006C35] to-[#00A859] text-white shadow-[0_0_20px_rgba(0,168,89,0.5)] border border-[#FFE79A]/50' 
                : 'glass-panel text-[#FFE79A] border border-[#00A859]/40 hover:bg-[#006C35]/20'
            }`}
          >
            <Flag className="w-4 h-4 text-[#FFE79A]" />
            <span>فعاليات اليوم الوطني 96</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/50 text-emerald-300 font-mono font-bold">
              {ndQuestions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'questions' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'glass-panel text-slate-300'
            }`}
          >
            بنك الأسئلة ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'add' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'glass-panel text-cyan-300 border border-cyan-400/40'
            }`}
          >
            + إضافة سؤال وميديا من الجهاز
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'import' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'glass-panel text-slate-300'
            }`}
          >
            📊 رفع ملف إكسل Excel
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ai' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'glass-panel text-slate-300'
            }`}
          >
            توليد AI
          </button>
        </div>
      </div>

      {/* Tab 1: Section Breakdown */}
      {activeTab === 'sections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GAME_ENGINE_SECTIONS.map((sec) => {
            const secQuestionsCount = sec.id === 'national-day-96'
              ? ndQuestions.length
              : questions.filter(q => q.engineType === sec.id).length;

            return (
              <div key={sec.id} className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sec.badgeColor} text-white flex items-center justify-center shadow-md`}>
                      {getIconComponent(sec.icon)}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {sec.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-lg">{sec.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{sec.description}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-white/10 pt-3 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>عدد الأسئلة المضافة:</span>
                    <strong className="text-white font-mono font-black text-sm">{secQuestionsCount} أسئلة</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>النقاط الموصى بها:</span>
                    <strong className="text-amber-300 font-mono">+{sec.avgPoints}</strong>
                  </div>

                  <button
                    onClick={() => {
                      if (sec.id === 'national-day-96') {
                        setActiveTab('national-day');
                        return;
                      }
                      setSelectedEngineFilter(sec.id);
                      setActiveTab('questions');
                    }}
                    className="mt-2 w-full py-2 rounded-xl bg-white/10 text-cyan-300 font-bold hover:bg-white/20 transition-all text-center cursor-pointer"
                  >
                    استعراض أسئلة هذا القسم ➔
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: 🇸🇦 بنك فعاليات اليوم الوطني 96 */}
      {activeTab === 'national-day' && (() => {
        const ND_ACTIVITIES_LIST = [
          { id: 'challenge-96', title: 'تحدي اللهجات 🗣️', icon: '🗣️' },
          { id: 'saudi-great', title: 'السعودية العظمى 🏆', icon: '🏆' },
          { id: 'saudi-numbers', title: 'أرقام الوطن 🔢', icon: '🔢' },
          { id: 'landscapes', title: 'صور ربوع بلادي 📸', icon: '📸' },
          { id: 'national-map', title: 'خريطة الوطن 🗺️', icon: '🗺️' },
          { id: 'saudi-heritage', title: 'تراثنا الأصيل 🐎', icon: '🐎' },
          { id: 'saudi-screen', title: 'السعودية على الشاشة 🎬', icon: '🎬' },
          { id: 'national-voice', title: 'صوت الوطن 🎤', icon: '🎤' },
        ];

        const filteredNdQuestions = ndQuestions.filter(q => {
          const matchesActivity = selectedNdActivity === 'all' || q.activityId === selectedNdActivity;
          const matchesRegion = ndRegionFilter === 'all' || q.category === ndRegionFilter;
          const matchesSearch = !ndSearchQuery ||
            q.question.toLowerCase().includes(ndSearchQuery.toLowerCase()) ||
            q.correctAnswer.toLowerCase().includes(ndSearchQuery.toLowerCase()) ||
            q.category.toLowerCase().includes(ndSearchQuery.toLowerCase()) ||
            (q.acceptableAnswers && q.acceptableAnswers.some(a => a.toLowerCase().includes(ndSearchQuery.toLowerCase())));
          return matchesActivity && matchesRegion && matchesSearch;
        });

        const currentActivityName = ND_ACTIVITIES_LIST.find(a => a.id === selectedNdActivity)?.title || 'المسابقة';

        return (
          <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
            {/* Top Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#031D0F] via-[#052915] to-[#031D0F] border-2 border-[#00A859]/60 shadow-[0_10px_40px_rgba(0,168,89,0.3)] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C69214] via-[#FFE79A] to-[#C69214] flex items-center justify-center text-slate-950 font-black shadow-[0_0_30px_rgba(198,146,20,0.6)]">
                  <Flag className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00A859]/20 text-[#00A859] border border-[#00A859]/40 font-mono">
                      NATIONAL DAY 96 QUESTION BANK
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C69214]/20 text-[#FFE79A] border border-[#C69214]/40">
                      إجمالي {ndQuestions.length} سؤال
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    بنك أسئلة وتحديات فعاليات اليوم الوطني 96 🇸🇦
                  </h3>
                  <p className="text-xs text-[#E2D4B7]/80">
                    تصفح وتعديل أسئلة مسابقات اليوم الوطني، تعديل الكلمات والمعاني، وإرفاق الصور لكل سؤال لتظهر مباشرة في البث.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenAddNdModal}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#006C35] to-[#00A859] text-white font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#FFE79A]/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ إضافة سؤال جديد للمسابقة</span>
                </button>
              </div>
            </div>

            {/* Sub-Filters: Activities Bar */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#E2D4B7]">اختر المسابقة لاستعراض وتعديل أسئلتها:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {ND_ACTIVITIES_LIST.map(act => {
                  const count = ndQuestions.filter(q => q.activityId === act.id).length;
                  const isSelected = selectedNdActivity === act.id;

                  return (
                    <button
                      key={act.id}
                      onClick={() => {
                        setSelectedNdActivity(act.id);
                        setNdRegionFilter('all');
                      }}
                      className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-black border transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#006C35] to-[#00A859] text-white border-[#FFE79A] shadow-[0_0_20px_rgba(0,168,89,0.5)] scale-105'
                          : 'bg-black/40 text-slate-300 border-white/10 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <span>{act.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        isSelected ? 'bg-black/30 text-[#FFE79A]' : 'bg-white/5 text-slate-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dialects Region Filter (if challenge-96 is selected) */}
            {selectedNdActivity === 'challenge-96' && (
              <div className="p-4 rounded-2xl bg-[#04190D] border border-[#006C35]/50 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📍</span>
                  <span className="text-xs font-black text-white">تصفية حسب المنطقة واللهجة:</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: 'كافة المناطق', count: ndQuestions.filter(q => q.activityId === 'challenge-96').length },
                    { id: 'المنطقة الشمالية', label: '📍 الشمالية', count: ndQuestions.filter(q => q.activityId === 'challenge-96' && q.category === 'المنطقة الشمالية').length },
                    { id: 'المنطقة الجنوبية', label: '📍 الجنوبية', count: ndQuestions.filter(q => q.activityId === 'challenge-96' && q.category === 'المنطقة الجنوبية').length },
                    { id: 'المنطقة الغربية', label: '📍 الغربية', count: ndQuestions.filter(q => q.activityId === 'challenge-96' && q.category === 'المنطقة الغربية').length },
                    { id: 'المنطقة الشرقية', label: '📍 الشرقية', count: ndQuestions.filter(q => q.activityId === 'challenge-96' && q.category === 'المنطقة الشرقية').length }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setNdRegionFilter(r.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        ndRegionFilter === r.id
                          ? 'bg-[#00A859] text-slate-950 border-white font-black shadow-md'
                          : 'bg-black/40 text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {r.label} ({r.count})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search & Actions Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن كلمة، سؤال، إجابة، أو تصنيف..."
                  value={ndSearchQuery}
                  onChange={e => setNdSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-[#04190D] border border-white/10 text-white text-xs font-bold outline-none focus:border-[#00A859] shadow-inner"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#E2D4B7] font-bold">
                  المعروض: <strong className="text-white font-mono">{filteredNdQuestions.length}</strong> سؤال في {currentActivityName}
                </span>
              </div>
            </div>

            {/* Questions Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNdQuestions.map(q => (
                <div
                  key={q.id}
                  className="p-5 rounded-3xl bg-[#051C0E]/90 border border-[#006C35]/50 shadow-xl flex flex-col justify-between gap-4 hover:border-[#00A859] transition-all group"
                >
                  <div className="flex flex-col gap-2.5">
                    {/* Card Header with Region / Category Badge */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-[#004D25] text-[#FFE79A] border border-[#00A859]/40 flex items-center gap-1 shadow-sm">
                          <span>📍</span>
                          <span>{q.category}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-slate-300">
                          +{q.points} نقطة
                        </span>
                      </div>

                      {q.mediaUrl && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>صورة مرفقة</span>
                        </span>
                      )}
                    </div>

                    {/* Question Text */}
                    <h4 className="text-base sm:text-lg font-black text-white leading-relaxed">
                      {q.question}
                    </h4>

                    {/* Image Preview if Attached */}
                    {q.mediaUrl && (
                      <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-[#00A859]/40 bg-black/60 shadow-md">
                        <img src={q.mediaUrl} alt="صورة السؤال" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Answers Box */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[#00A859] font-black">✓ الجواب النموذجي:</span>
                        <span className="text-white font-bold">{q.correctAnswer}</span>
                      </div>
                      {q.acceptableAnswers && q.acceptableAnswers.length > 1 && (
                        <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-300">
                          <span className="text-slate-400">المرادفات المقبولة:</span>
                          <span>{q.acceptableAnswers.filter(a => a !== q.correctAnswer).join(' ، ')}</span>
                        </div>
                      )}
                      {q.explanation && (
                        <div className="text-[11px] text-[#E2D4B7]/70 mt-1 border-t border-white/5 pt-1">
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <button
                      onClick={() => handleOpenEditNdModal(q)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل السؤال والصورة</span>
                    </button>

                    <button
                      onClick={() => handleDeleteNdQuestion(q.id)}
                      className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                      title="حذف السؤال"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredNdQuestions.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3 bg-[#04190D] rounded-3xl border border-white/10">
                  <Database className="w-10 h-10 text-slate-600" />
                  <span className="text-sm font-bold">لا توجد أسئلة تطابق البحث أو التصفية الحالية</span>
                  <button
                    onClick={handleOpenAddNdModal}
                    className="px-4 py-2 rounded-xl bg-[#006C35] text-white text-xs font-bold"
                  >
                    + إضافة سؤال جديد الآن
                  </button>
                </div>
              )}
            </div>

            {/* 🌟 EDIT / ADD NATIONAL DAY QUESTION MODAL */}
            {isNdModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="relative w-full max-w-2xl rounded-3xl bg-[#041E10] border-2 border-[#00A859] p-6 sm:p-8 flex flex-col gap-5 shadow-[0_0_80px_rgba(0,168,89,0.4)] text-white max-h-[90vh] overflow-y-auto">
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#006C35] text-[#FFE79A] flex items-center justify-center font-black">
                        <Flag className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">
                          {editingNdQuestion ? 'تعديل سؤال اليوم الوطني' : 'إضافة سؤال جديد لليوم الوطني'}
                        </h3>
                        <span className="text-xs text-[#E2D4B7]/70">تعديل الكلمة، المعنى، المنطقة، وإرفاق الصورة</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsNdModalOpen(false)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 text-xs">
                    {/* Activity & Region */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-[#E2D4B7]">المسابقة الوطنية:</label>
                        <select
                          value={modalQActivity}
                          onChange={e => setModalQActivity(e.target.value as any)}
                          className="p-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-bold outline-none focus:border-[#00A859]"
                        >
                          {ND_ACTIVITIES_LIST.map(a => (
                            <option key={a.id} value={a.id}>{a.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-[#E2D4B7]">المنطقة / التصنيف (يظهر فوق السؤال):</label>
                        <input
                          type="text"
                          value={modalQRegion}
                          onChange={e => setModalQRegion(e.target.value)}
                          placeholder="المنطقة الشمالية، الجنوبية، الغربية، الشرقية..."
                          className="p-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-bold outline-none focus:border-[#00A859]"
                        />
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-[#E2D4B7]">نص السؤال:</label>
                      <input
                        type="text"
                        value={modalQText}
                        onChange={e => setModalQText(e.target.value)}
                        placeholder='مثال: ما معنى هذه الكلمة: "مشوين"؟'
                        className="p-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm font-black outline-none focus:border-[#00A859]"
                      />
                    </div>

                    {/* Answers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-[#00A859]">الإجابة الصحيحة النموذجية:</label>
                        <input
                          type="text"
                          value={modalQAnswer}
                          onChange={e => setModalQAnswer(e.target.value)}
                          placeholder="مثال: بعد شوي"
                          className="p-2.5 rounded-xl bg-black/60 border border-emerald-500/50 text-emerald-300 font-bold outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-300">المرادفات المقبولة (فصل بفاصلة):</label>
                        <input
                          type="text"
                          value={modalQSynonyms}
                          onChange={e => setModalQSynonyms(e.target.value)}
                          placeholder="مثال: بعد قليل، عقب شوي"
                          className="p-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-bold outline-none focus:border-[#00A859]"
                        />
                      </div>
                    </div>

                    {/* Image Attachment (File upload OR URL) */}
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#FFE79A] flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4" />
                          <span>إرفاق صورة توضيحية مع السؤال (تظهر تحت السؤال أثناء المسابقة):</span>
                        </span>
                        {modalQMediaUrl && (
                          <button
                            onClick={() => setModalQMediaUrl('')}
                            className="text-rose-400 hover:text-rose-300 text-xs font-bold"
                          >
                            إزالة الصورة
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={modalQMediaUrl}
                          onChange={e => setModalQMediaUrl(e.target.value)}
                          placeholder="أدخل رابط الصورة (URL)..."
                          className="p-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono outline-none focus:border-[#00A859]"
                        />

                        <label className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-slate-300 hover:text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
                          <Upload className="w-4 h-4 text-[#00A859]" />
                          <span>اختر صورة من جهازك</span>
                          <input
                            type="file"
                            accept="image/*"
                            ref={ndFileInputRef}
                            onChange={handleNdImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Live Image Preview */}
                      {modalQMediaUrl && (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#00A859]/50 bg-black/80 flex items-center justify-center">
                          <img src={modalQMediaUrl} alt="معاينة الصورة" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                    <button
                      onClick={() => setIsNdModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSaveNdModal}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#006C35] to-[#00A859] text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#FFE79A]/30"
                    >
                      حفظ السؤال في البنك
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        );
      })()}

      {/* Tab 2: Add Custom Question with Media File Upload */}
      {activeTab === 'add' && (
        <div className="p-6 rounded-3xl glass-panel border border-cyan-400/40 flex flex-col gap-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Plus className="w-6 h-6 text-cyan-400" />
              <span>إضافة سؤال جديد وتعيين الصور أو الفيديوهات أو الصوتيات من الكمبيوتر</span>
            </h3>
            <span className="text-xs text-cyan-300 font-bold">LOCAL MEDIA UPLOADER</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">نوع مسابقة السؤال:</label>
              <select
                value={newEngineType}
                onChange={(e) => setNewEngineType(e.target.value as EngineType)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 font-bold outline-none"
              >
                {GAME_ENGINE_SECTIONS.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">تصنيف السؤال (Category):</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="مثال: جغرافيا، سينما، رياضة..."
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-300 font-bold block mb-1">نص السؤال:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="أدخل عنوان أو نص السؤال هنا..."
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-black text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-300 font-bold block mb-1">
                {newEngineType === 'what-do-they-say'
                  ? 'الإجابات العشر (فصل بالفاصلة المنقوطة ; من الأكثر شيوعاً للأقل):'
                  : 'الإجابات المقبولة (فصل بالفاصلة المنقوطة ; للإجابات البديلة):'}
              </label>
              {newEngineType === 'what-do-they-say' && (
                <p className="text-[10px] text-amber-300 mb-2 font-bold">
                  💡 أدخل 10 إجابات مفصولة بـ ; — سيتم توزيع النقاط تلقائياً (45, 35, 28, 22, 18, 15, 12, 10, 8, 7 = 200 نقطة)
                  <br />لإضافة بدائل/مرادفات لكل إجابة، استخدم الفاصلة , مثال: الجوال,التلفون,الهاتف;الصلاة,يصلي,الفجر
                </p>
              )}
              <input
                type="text"
                value={newAcceptableAnswers}
                onChange={(e) => setNewAcceptableAnswers(e.target.value)}
                placeholder={newEngineType === 'what-do-they-say'
                  ? 'الجوال,التلفون;الصلاة,يصلي;القهوة,كوفي;غسيل الوجه;ينام;الفطور;يتروش;الساعة;الستائر;يجهز'
                  : 'مثال: الرياض; مدينة الرياض'}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-emerald-300 font-bold outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">النقاط المستحقة:</label>
              <input
                type="number"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-amber-300 font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">المهلة الزمنية (بالثواني):</label>
              <input
                type="number"
                value={newTimeLimit}
                onChange={(e) => setNewTimeLimit(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold outline-none"
              />
            </div>
          </div>

          {/* Media File Upload Section */}
          <div className="p-4 rounded-2xl bg-white/5 border border-cyan-500/30 flex flex-col gap-4">
            <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
              <FileUp className="w-5 h-5 text-cyan-400" />
              <span>تحميل الميديا للسؤال من الكمبيوتر مباشرة (صور / فيديو / صوت)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="p-4 rounded-2xl glass-panel border border-purple-400/40 flex flex-col items-center justify-center gap-2 hover:bg-purple-500/20 cursor-pointer transition-all">
                <ImageIcon className="w-7 h-7 text-purple-400" />
                <span className="font-extrabold text-white text-xs">تحميل صورة من الجهاز</span>
                <span className="text-[10px] text-slate-400">PNG, JPG, WEBP</span>
                <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
              </label>

              <label className="p-4 rounded-2xl glass-panel border border-rose-400/40 flex flex-col items-center justify-center gap-2 hover:bg-rose-500/20 cursor-pointer transition-all">
                <Video className="w-7 h-7 text-rose-400" />
                <span className="font-extrabold text-white text-xs">تحميل فيديو من الجهاز</span>
                <span className="text-[10px] text-slate-400">MP4, WEBM, MOV</span>
                <input type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
              </label>

              <label className="p-4 rounded-2xl glass-panel border border-amber-400/40 flex flex-col items-center justify-center gap-2 hover:bg-amber-500/20 cursor-pointer transition-all">
                <Music className="w-7 h-7 text-amber-400" />
                <span className="font-extrabold text-white text-xs">تحميل صوت من الجهاز</span>
                <span className="text-[10px] text-slate-400">MP3, WAV, OGG</span>
                <input type="file" accept="audio/*" onChange={handleAudioFileUpload} className="hidden" />
              </label>
            </div>

            {uploadedFileName && (
              <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-between text-xs text-cyan-300">
                <span className="font-bold">📁 تم إرفاق الملف: {uploadedFileName}</span>
                <button
                  onClick={() => {
                    setUploadedImageUrl(null);
                    setUploadedVideoUrl(null);
                    setUploadedAudioUrl(null);
                    setUploadedFileName(null);
                  }}
                  className="text-rose-400 hover:underline font-bold"
                >
                  إزالة الملف
                </button>
              </div>
            )}

            {uploadedImageUrl && (
              <div className="flex flex-col items-center gap-4 mt-2 p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40">
                {/* Dynamic Natural Aspect Ratio Image Preview (Fits any uploaded image size) */}
                <div className="relative w-full max-w-md max-h-[380px] rounded-3xl overflow-hidden glass-panel border-4 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center p-1 bg-black/40">
                  <img
                    src={uploadedImageUrl}
                    alt="Preview"
                    style={getImageStyleCSS(selectedTransformStyle)}
                    className="w-full h-auto max-h-[360px] object-contain rounded-2xl transition-all duration-500"
                  />
                  <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] text-purple-300 font-bold border border-purple-400/40 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>تأثير: {IMAGE_EFFECTS_LIST.find(s => s.id === selectedTransformStyle)?.label}</span>
                  </div>
                </div>

                {/* Quick Convert to Caricature Art Button */}
                <button
                  type="button"
                  onClick={async () => {
                    if (uploadedImageUrl) {
                      const caricatureArt = await transformToCaricatureCanvas(uploadedImageUrl);
                      setUploadedImageUrl(caricatureArt);
                      setSelectedTransformStyle('caricature');
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-black text-xs hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                >
                  <Wand2 className="w-4 h-4 text-yellow-300 animate-spin" />
                  <span>🎭 تحويل الصورة تلقائياً إلى رسم كاريكاتيري مثل النموذج المرفق</span>
                </button>

                {/* Effect Selection Buttons */}
                <div className="w-full flex flex-col gap-2">
                  <label className="text-slate-300 font-extrabold text-xs text-center">اختر التأثير البصري المطلوب تطبيقه على الصورة:</label>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {IMAGE_EFFECTS_LIST.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedTransformStyle(st.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedTransformStyle === st.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.8)] scale-105'
                            : 'glass-panel text-slate-300 hover:text-white border border-white/10'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {uploadedVideoUrl && (
              <div className="relative w-full max-w-md max-h-[380px] rounded-3xl overflow-hidden glass-panel border-4 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.5)] mx-auto flex items-center justify-center p-1 bg-black/90">
                <video src={uploadedVideoUrl} controls className="w-full h-auto max-h-[360px] object-contain rounded-2xl" />
              </div>
            )}

            {uploadedAudioUrl && (
              <div className="w-full p-2 rounded-xl bg-slate-900 border border-amber-400/40">
                <audio src={uploadedAudioUrl} controls className="w-full" />
              </div>
            )}
          </div>

          <button
            onClick={handleAddQuestion}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>حفظ وإضافة السؤال لبنك الأسئلة والمحفظة الدائمة</span>
          </button>
        </div>
      )}

      {/* Tab 3: Questions List */}
      {activeTab === 'questions' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 font-bold">تصفية الأسئلة حسب القسم:</span>
              <select
                value={selectedEngineFilter}
                onChange={(e) => setSelectedEngineFilter(e.target.value as any)}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 font-bold text-xs outline-none"
              >
                <option value="all">جميع الأقسام ({questions.length})</option>
                {GAME_ENGINE_SECTIONS.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {selectedEngineFilter !== 'all' && filteredQuestions.length > 0 && (
                <button
                  onClick={() => {
                    const remaining = questions.filter(q => q.engineType !== selectedEngineFilter);
                    saveQuestionsToStorage(remaining);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>تفريغ أسئلة هذا القسم ({filteredQuestions.length})</span>
                </button>
              )}

              {questions.length > 0 && (
                <button
                  onClick={handleClearAllQuestions}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف جميع الأسئلة</span>
                </button>
              )}
            </div>
          </div>

          {excelImportStatus && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{excelImportStatus}</span>
            </div>
          )}

          {filteredQuestions.length === 0 ? (
            <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center flex flex-col items-center justify-center gap-3">
              <Database className="w-12 h-12 text-slate-500" />
              <h3 className="text-lg font-black text-white">مكتبة الأسئلة فارغة حالياً (0 أسئلة)</h3>
              <p className="text-xs text-slate-400">قم برفع ملف إكسل (.xlsx / .xls) وسوف تُحفظ دائماً على الجهاز ولن تضيع عند التحديث.</p>
              
              <div className="flex items-center gap-3 mt-2">
                <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-lg">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>رفع ملف إكسل Excel (.xlsx)</span>
                  <input type="file" accept=".xlsx, .xls, .csv" onChange={handleExcelFileUpload} className="hidden" />
                </label>

                <button
                  onClick={() => setActiveTab('add')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة سؤال من الجهاز</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuestions.map((q) => (
                <div key={q.id} className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          {q.engineType}
                        </span>
                        {(q as any).letter && (
                          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg">
                            {(q as any).letter}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {q.engineType === 'what-do-they-say' && (
                          <button
                            onClick={() => handleOpenEditWDTS(q.id)}
                            className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 font-bold text-xs flex items-center gap-1 transition-all"
                            title="تعديل الإجابات والبدائل"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>تعديل الإجابات</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-white text-base">{q.title}</h4>
                    
                    {/* WhatDoTheySay: Show 10 Answers with Points & Aliases */}
                    {q.engineType === 'what-do-they-say' && (q as any).answers ? (
                      <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-[10px] text-amber-300 font-bold">🧠 الإجابات العشر ({(q as any).totalScore || 200} نقطة):</span>
                        {((q as any).answers as WhatDoTheySayAnswer[]).map((ans: WhatDoTheySayAnswer, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px]">
                            <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-black text-[10px] shrink-0">
                              {String(ans.rank || idx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm">{ans.emoji || '✨'}</span>
                            <span className="font-bold text-white flex-1 truncate">{ans.title}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-black text-[10px] shrink-0">
                              +{ans.points}
                            </span>
                          </div>
                        ))}
                        <details className="mt-1">
                          <summary className="text-[10px] text-slate-400 cursor-pointer hover:text-slate-200 font-bold">عرض البدائل والمرادفات المقبولة...</summary>
                          <div className="mt-1 flex flex-col gap-1 text-[10px]">
                            {((q as any).answers as WhatDoTheySayAnswer[]).map((ans: WhatDoTheySayAnswer, idx: number) => (
                              <div key={idx} className="text-slate-400">
                                <span className="text-amber-300 font-bold">{ans.title}:</span>{' '}
                                {(ans.aliases || []).join(' • ')}
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    ) : (
                      <p className="text-xs text-cyan-300 font-bold">الإجابة المقبولة: {q.acceptableAnswers.join(' / ')}</p>
                    )}
                  </div>

                  {/* Attached Media Display - Perfect Square Image Frame with Filter */}
                  {(q as any).imageUrl && (
                    <div className="relative w-36 h-36 aspect-square rounded-2xl overflow-hidden glass-panel border-2 border-purple-400/50 shadow-md mx-auto flex items-center justify-center">
                      <img
                        src={(q as any).imageUrl}
                        alt={q.title}
                        style={getImageStyleCSS((q as any).transformStyle || 'normal')}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {(q as any).videoUrl && (
                    <div className="w-full rounded-xl overflow-hidden border border-rose-400/40">
                      <video src={(q as any).videoUrl} controls className="w-full max-h-36 bg-black" />
                    </div>
                  )}

                  {(q as any).audioUrl && (
                    <div className="w-full p-2 rounded-xl bg-slate-900 border border-amber-400/40">
                      <audio src={(q as any).audioUrl} controls className="w-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Excel / CSV / JSON Direct File Uploader & Text Importer */}
      {activeTab === 'import' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-6 max-w-4xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
              <span>رفع ملفات الإكسل Excel حسب نوع القسم</span>
            </h3>
            <span className="text-xs text-emerald-300 font-bold">SMART EXCEL UPLOADER</span>
          </div>

          {/* Step 1: Choose Engine Type */}
          <div className="flex flex-col gap-3">
            <h4 className="font-extrabold text-white text-sm">الخطوة 1: اختر نوع القسم قبل رفع الملف</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {GAME_ENGINE_SECTIONS.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setNewEngineType(sec.id as EngineType)}
                  className={`p-3 rounded-xl text-xs font-bold transition-all text-right ${
                    newEngineType === sec.id
                      ? `bg-gradient-to-r ${sec.badgeColor} text-white shadow-lg scale-[1.03]`
                      : 'glass-panel text-slate-300 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Format Instructions */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-cyan-500/30">
            <h4 className="font-extrabold text-cyan-300 text-sm flex items-center gap-2">
              📋 الخطوة 2: طريقة ترتيب ملف الإكسل لقسم «{GAME_ENGINE_SECTIONS.find(s => s.id === newEngineType)?.title}»
            </h4>

            {newEngineType === 'quiz' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-300">عمودين: <strong className="text-white">السؤال</strong> و <strong className="text-white">الجواب</strong></p>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-blue-600/30 text-white"><th className="p-2 text-right">العمود A (السؤال)</th><th className="p-2 text-right">العمود B (الجواب)</th></tr></thead>
                    <tbody className="text-slate-300">
                      <tr className="border-t border-white/5"><td className="p-2">ما عاصمة السعودية؟</td><td className="p-2">الرياض</td></tr>
                      <tr className="border-t border-white/5"><td className="p-2">كم عدد قارات العالم؟</td><td className="p-2">7</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {newEngineType === 'alphabet' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-300">ثلاثة أعمدة: <strong className="text-white">الحرف</strong> و <strong className="text-white">السؤال</strong> و <strong className="text-white">الجواب</strong></p>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-cyan-600/30 text-white"><th className="p-2 text-right">العمود A (الحرف)</th><th className="p-2 text-right">العمود B (السؤال)</th><th className="p-2 text-right">العمود C (الجواب)</th></tr></thead>
                    <tbody className="text-slate-300">
                      <tr className="border-t border-white/5"><td className="p-2 font-black text-cyan-300">أ</td><td className="p-2">ما هي عاصمة السعودية؟</td><td className="p-2">الرياض</td></tr>
                      <tr className="border-t border-white/5"><td className="p-2 font-black text-cyan-300">ب</td><td className="p-2">ما أكبر بحر مغلق؟</td><td className="p-2">بحر قزوين</td></tr>
                      <tr className="border-t border-white/5"><td className="p-2 font-black text-cyan-300">ت</td><td className="p-2">ما عملة تركيا؟</td><td className="p-2">الليرة</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {newEngineType === 'mixed-words' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-300">عمود واحد فقط: <strong className="text-white">الكلمة</strong> (يتم تبعثر الحروف تلقائياً)</p>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-emerald-600/30 text-white"><th className="p-2 text-right">العمود A (الكلمة)</th></tr></thead>
                    <tbody className="text-slate-300">
                      <tr className="border-t border-white/5"><td className="p-2">فراشة</td></tr>
                      <tr className="border-t border-white/5"><td className="p-2">حاسوب</td></tr>
                      <tr className="border-t border-white/5"><td className="p-2">مستشفى</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {newEngineType === 'symbol-puzzle' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-300">عمودين: <strong className="text-white">الرموز / الإيموجي</strong> و <strong className="text-white">الجواب</strong></p>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-pink-600/30 text-white"><th className="p-2 text-right">العمود A (الرموز)</th><th className="p-2 text-right">العمود B (الجواب)</th></tr></thead>
                    <tbody className="text-slate-300">
                      <tr className="border-t border-white/5"><td className="p-2">🦁 👑</td><td className="p-2">الأسد الملك</td></tr>
                      <tr className="border-t border-white/5"><td className="p-2">❄️ 👸</td><td className="p-2">ملكة الثلج</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {newEngineType === 'image-puzzle' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-300">عمودين: <strong className="text-white">السؤال (وصف الصورة)</strong> و <strong className="text-white">الجواب</strong> — يتم رفع الصور بعد الاستيراد من قسم "إضافة سؤال"</p>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-purple-600/30 text-white"><th className="p-2 text-right">العمود A (السؤال)</th><th className="p-2 text-right">العمود B (الجواب)</th></tr></thead>
                    <tbody className="text-slate-300">
                      <tr className="border-t border-white/5"><td className="p-2">ما هذا المعلم السياحي؟</td><td className="p-2">برج إيفل</td></tr>
                      <tr className="border-t border-white/5"><td className="p-2">ما اسم هذه المدينة؟</td><td className="p-2">دبي</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {newEngineType === 'video-challenge' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-300">عمودين: <strong className="text-white">السؤال</strong> و <strong className="text-white">الجواب</strong> — يتم رفع الفيديوهات بعد الاستيراد من قسم "إضافة سؤال"</p>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-red-600/30 text-white"><th className="p-2 text-right">العمود A (السؤال)</th><th className="p-2 text-right">العمود B (الجواب)</th></tr></thead>
                    <tbody className="text-slate-300">
                      <tr className="border-t border-white/5"><td className="p-2">ما اسم هذا الفيلم؟</td><td className="p-2">تايتنك</td></tr>
                      <tr className="border-t border-white/5"><td className="p-2">من يغني هذه الأغنية؟</td><td className="p-2">محمد عبده</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {newEngineType === 'audio-challenge' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-300">عمودين: <strong className="text-white">السؤال</strong> و <strong className="text-white">الجواب</strong> — يتم رفع المقاطع الصوتية بعد الاستيراد من قسم "إضافة سؤال"</p>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-amber-600/30 text-white"><th className="p-2 text-right">العمود A (السؤال)</th><th className="p-2 text-right">العمود B (الجواب)</th></tr></thead>
                    <tbody className="text-slate-300">
                      <tr className="border-t border-white/5"><td className="p-2">لمن هذا الصوت؟</td><td className="p-2">أم كلثوم</td></tr>
                      <tr className="border-t border-white/5"><td className="p-2">ما اسم هذه الآلة الموسيقية؟</td><td className="p-2">العود</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {newEngineType === 'character' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-300">عمودين: <strong className="text-white">السؤال (وصف الشخصية)</strong> و <strong className="text-white">الجواب</strong> — يتم رفع الصور بعد الاستيراد من قسم "إضافة سؤال"</p>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-indigo-600/30 text-white"><th className="p-2 text-right">العمود A (السؤال)</th><th className="p-2 text-right">العمود B (الجواب)</th></tr></thead>
                    <tbody className="text-slate-300">
                      <tr className="border-t border-white/5"><td className="p-2">من هذه الشخصية التاريخية؟</td><td className="p-2">صلاح الدين</td></tr>
                      <tr className="border-t border-white/5"><td className="p-2">من هذا العالم؟</td><td className="p-2">ابن سينا</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Upload */}
          <div className="p-6 rounded-3xl glass-arena-glow border-2 border-emerald-400/50 flex flex-col items-center justify-center gap-4 text-center">
            <FileSpreadsheet className="w-14 h-14 text-emerald-400" />
            <div>
              <h4 className="text-base font-black text-white">الخطوة 3: رفع ملف الإكسل لقسم «{GAME_ENGINE_SECTIONS.find(s => s.id === newEngineType)?.title}»</h4>
              <p className="text-xs text-slate-300 mt-1">تأكد أن الملف مرتب بالشكل الموضح أعلاه، ثم ارفعه هنا</p>
            </div>

            <label className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <Upload className="w-5 h-5" />
              <span>اختر ملف إكسل (.xlsx / .xls) وارفعه الآن</span>
              <input type="file" accept=".xlsx, .xls, .csv" onChange={handleExcelFileUpload} className="hidden" />
            </label>
          </div>

          {excelImportStatus && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{excelImportStatus}</span>
            </div>
          )}

          {/* Raw Text CSV/JSON fallback area */}
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <h4 className="font-extrabold text-white text-xs">أو لصق محتوى CSV / JSON نصياً:</h4>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="السؤال,الجواب..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:border-emerald-400 outline-none"
            />

            <button
              onClick={handleImport}
              className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>استيراد النص الملصق</span>
            </button>
          </div>

          {importReport && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>تقرير الاستيراد: تم استيراد {importReport.importedCount} سؤالاً بنجاح!</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: AI Generator */}
      {activeTab === 'ai' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-4 max-w-2xl">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            <span>مولد الأسئلة بالذكاء الاصطناعي (AI Question Generator)</span>
          </h3>

          <div>
            <label className="text-xs text-slate-400 font-bold block mb-1">الموضوع أو المجال المطلوبة الأسئلة فيه:</label>
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="مثال: تاريخ السعودية، سينما، جغرافيا..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold focus:border-purple-400 outline-none"
            />
          </div>

          <button
            onClick={handleAIGenerate}
            className="py-3 rounded-xl bg-purple-600 text-white font-black text-xs hover:bg-purple-500 transition-all flex items-center justify-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>توليد الأسئلة الآن</span>
          </button>
        </div>
      )}

      {/* Edit WDTS Answers Modal */}
      {editingQuestionId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.3)]">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">تعديل الإجابات والبدائل — وش يقولون؟</h3>
                  <p className="text-xs text-amber-300/80">عند تعديل نص الإجابة يتم تحديث البدائل تلقائياً، ويمكنك إضافة بدائل إضافية مفصولة بفواصل</p>
                </div>
              </div>
              <button
                onClick={() => { setEditingQuestionId(null); setEditAnswers([]); }}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - 10 Answers List */}
            <div className="p-6 overflow-y-auto flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-400/20 p-3 rounded-2xl">
                <span className="text-xs text-slate-300 font-bold">
                  السؤال: <span className="text-white font-black">{questions.find(q => q.id === editingQuestionId)?.title}</span>
                </span>
                <span className="text-xs text-amber-300 font-mono font-black">
                  المجموع: {editAnswers.reduce((s, a) => s + (Number(a.points) || 0), 0)} نقطة
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {editAnswers.map((ans, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-3 items-start md:items-center">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-mono font-black text-xs shrink-0">
                      #{String(ans.rank || idx + 1).padStart(2, '0')}
                    </span>

                    {/* Emoji Input */}
                    <div className="w-16 shrink-0">
                      <input
                        type="text"
                        value={ans.emoji || '✨'}
                        onChange={(e) => handleEditAnswerEmoji(idx, e.target.value)}
                        className="w-full text-center p-2 rounded-xl bg-black/40 border border-white/10 text-lg outline-none focus:border-amber-400"
                        title="رمز الإيموجي"
                      />
                    </div>

                    {/* Title Input */}
                    <div className="flex-1 w-full">
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">الإجابة الأساسية:</label>
                      <input
                        type="text"
                        value={ans.title}
                        onChange={(e) => handleEditAnswerTitle(idx, e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-bold text-xs outline-none focus:border-amber-400"
                        placeholder="نص الإجابة..."
                      />
                    </div>

                    {/* Points Input */}
                    <div className="w-24 shrink-0">
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">النقاط:</label>
                      <input
                        type="number"
                        value={ans.points}
                        onChange={(e) => handleEditAnswerPoints(idx, Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-amber-300 font-mono font-black text-xs outline-none focus:border-amber-400 text-center"
                      />
                    </div>

                    {/* Aliases Input */}
                    <div className="flex-[1.5] w-full">
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">البدائل والمرادفات المقبولة (مفصولة بفواصل ,):</label>
                      <input
                        type="text"
                        value={(ans.aliases || []).join(', ')}
                        onChange={(e) => handleEditAnswerAliases(idx, e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-cyan-300 font-bold text-xs outline-none focus:border-cyan-400"
                        placeholder="بديل 1, بديل 2, مرادف..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
              <button
                onClick={() => { setEditingQuestionId(null); setEditAnswers([]); }}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-all"
              >
                إلغاء
              </button>

              <button
                onClick={handleSaveEditWDTS}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات في بنك الأسئلة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
