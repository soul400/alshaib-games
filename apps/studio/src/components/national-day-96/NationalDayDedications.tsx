'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NationalDayDedication } from '@aep/types';
import { useStudioStore } from '../../store/useStudioStore';
import { 
  Heart, Sparkles, Volume2, VolumeX, Play, Pause, 
  Users, Check, X, Search, 
  Music, Radio, Award, Star, RefreshCw, Shuffle, Trash2,
  SkipForward, RotateCcw
} from 'lucide-react';
import { soundFX } from '@aep/audio-visual-fx';

interface NationalSong {
  id: string;
  filename: string;
  url: string;
  title: string;
  artist: string;
}

// 🇸🇦 13 OFFICIAL PRELOADED SAUDI NATIONAL SONGS
export const PRELOADED_NATIONAL_SONGS: NationalSong[] = [
  { id: 'saudis-great', filename: 'saudis-great.mp3', url: '/national-day-96/songs/saudis-great.mp3', title: 'سعوديون .. عظماء من بلد عظيم', artist: 'أغنية وطنية' },
  { id: 'hatha-ayed', filename: 'hatha-ayed.mp3', url: '/national-day-96/songs/hatha-ayed.mp3', title: 'هاتها - عايض (إثراء)', artist: 'عايض' },
  { id: 'najd-shamat', filename: 'najd-shamat.mp3', url: '/national-day-96/songs/najd-shamat.mp3', title: 'نجد شامت لأبو تركي', artist: 'يوم التأسيس' },
  { id: 'ana-al-saudi', filename: 'ana-al-saudi.mp3', url: '/national-day-96/songs/ana-al-saudi.mp3', title: 'أنا السعودي', artist: 'عباس إبراهيم' },
  { id: 'allah-yezz-al-dar', filename: 'allah-yezz-al-dar.mp3', url: '/national-day-96/songs/allah-yezz-al-dar.mp3', title: 'الله يعز الدار', artist: 'أغنية وطنية' },
  { id: 'dayem-maak-majed', filename: 'dayem-maak-majed.mp3', url: '/national-day-96/songs/dayem-maak-majed.mp3', title: 'دايم معك', artist: 'ماجد المهندس' },
  { id: 'dera-al-balad', filename: 'dera-al-balad.mp3', url: '/national-day-96/songs/dera-al-balad.mp3', title: 'درع البلد', artist: 'رابح صقر & راشد الماجد' },
  { id: 'ya-mohammed-rashed', filename: 'ya-mohammed-rashed.mp3', url: '/national-day-96/songs/ya-mohammed-rashed.mp3', title: 'يا محمد', artist: 'راشد الماجد' },
  { id: 'ramz-al-arab', filename: 'ramz-al-arab.mp3', url: '/national-day-96/songs/ramz-al-arab.mp3', title: 'رمز العرب (سمو ولي العهد)', artist: 'كورال الشرقية' },
  { id: 'asheqeenak-rashed', filename: 'asheqeenak-rashed.mp3', url: '/national-day-96/songs/asheqeenak-rashed.mp3', title: 'عاشقينك', artist: 'راشد الماجد' },
  { id: 'ghani-ya-wadi-hanifa', filename: 'ghani-ya-wadi-hanifa.mp3', url: '/national-day-96/songs/ghani-ya-wadi-hanifa.mp3', title: 'غني يا وادي حنيفة', artist: 'يوم التأسيس' },
  { id: 'ya-al-azeem-raslani', filename: 'ya-al-azeem-raslani.mp3', url: '/national-day-96/songs/ya-al-azeem-raslani.mp3', title: 'يالعظيم', artist: 'ماجد الرسلاني' },
  { id: 'yeheq-li-rashed', filename: 'yeheq-li-rashed.mp3', url: '/national-day-96/songs/yeheq-li-rashed.mp3', title: 'يحق لي', artist: 'راشد الماجد' }
];

interface Props {
  dedications: NationalDayDedication[];
  onAddDedication: (message: string, username: string, avatarUrl: string, selectedNumber?: number) => void;
  onApproveDedication: (id: string) => void;
  onRejectDedication: (id: string) => void;
  isLiveBroadcast?: boolean;
}

export function NationalDayDedications({
  dedications,
  onAddDedication,
  onApproveDedication,
  onRejectDedication,
  isLiveBroadcast
}: Props) {
  const { recentComments, leaderboard, isTikTokConnected } = useStudioStore();

  // Selected Box for assigning viewer (1 to 12)
  const [activeBoxModal, setActiveBoxModal] = useState<number | null>(null);
  
  // Fullscreen video celebration state
  const [activeFullscreenDedication, setActiveFullscreenDedication] = useState<NationalDayDedication | null>(null);
  const [fullscreenTimeRemaining, setFullscreenTimeRemaining] = useState<number>(20);

  // 🎵 1-to-1 Unique Song Mapping per Box (1 to 12) - No repetition!
  const [boxSongMap, setBoxSongMap] = useState<Record<number, number>>({
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
    9: 8,
    10: 9,
    11: 10,
    12: 11
  });

  // Active Selected Song Index
  const [selectedSongIndex, setSelectedSongIndex] = useState<number>(0);
  const selectedSong = PRELOADED_NATIONAL_SONGS[selectedSongIndex] || PRELOADED_NATIONAL_SONGS[0];
  
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);

  // Viewer search filter in selection modal
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [manualNameInput, setManualNameInput] = useState<string>('');

  // 12 Boxes State mapping (1 to 12)
  const boxes = Array.from({ length: 12 }, (_, i) => i + 1);

  // Find dedication assigned to a box number
  const getDedicationForBox = (num: number) => {
    return (dedications || []).find(d => d.selectedNumber === num);
  };

  // Get unique assigned song for a specific box
  const getSongForBox = (num: number): NationalSong => {
    const idx = boxSongMap[num] ?? ((num - 1) % PRELOADED_NATIONAL_SONGS.length);
    return PRELOADED_NATIONAL_SONGS[idx] || PRELOADED_NATIONAL_SONGS[0];
  };

  // Compile active stream viewers list (from recent TikTok comments + leaderboard)
  const streamViewers = React.useMemo(() => {
    const map = new Map<string, { username: string; displayName: string; avatarUrl: string }>();

    // From TikTok comments
    (recentComments || []).forEach(c => {
      if (c.username && !map.has(c.username)) {
        map.set(c.username, {
          username: c.username.startsWith('@') ? c.username : `@${c.username}`,
          displayName: c.displayName || c.username,
          avatarUrl: c.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}`
        });
      }
    });

    // From leaderboard players
    (leaderboard || []).forEach(p => {
      if (p.username && !map.has(p.username)) {
        map.set(p.username, {
          username: p.username.startsWith('@') ? p.username : `@${p.username}`,
          displayName: p.displayName || p.username,
          avatarUrl: p.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`
        });
      }
    });

    // Fallback sample viewers if none connected yet
    if (map.size === 0) {
      const sampleNames = ['عبدالله_الشمري', 'سارة_العتيبي', 'فهد_الغامدي', 'نورة_القحطاني', 'محمد_الدوسري', 'ريما_الشهري', 'خالد_المطيري', 'أثير_العنزي', 'سلطان_الرويلي', 'هند_الحربي', 'تركي_السهلي', 'منى_الغامدي'];
      sampleNames.forEach(name => {
        map.set(name, {
          username: `@${name}`,
          displayName: name.replace(/_/g, ' '),
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        });
      });
    }

    return Array.from(map.values());
  }, [recentComments, leaderboard]);

  // Filtered viewers
  const filteredViewers = streamViewers.filter(v => 
    v.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Audio Playback Controller
  const playNationalSong = (songUrl: string) => {
    try {
      if (!audioInstanceRef.current) {
        audioInstanceRef.current = new Audio();
      }
      const audio = audioInstanceRef.current;
      audio.src = songUrl;
      audio.muted = isAudioMuted;
      audio.currentTime = 0;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAudioPlaying(true);
          })
          .catch((err) => {
            console.warn('Audio play request was handled:', err);
            setIsAudioPlaying(false);
          });
      }
    } catch (e) {
      console.error('Audio initialization error:', e);
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioInstanceRef.current) {
      playNationalSong(selectedSong.url);
      return;
    }
    if (isAudioPlaying) {
      audioInstanceRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioInstanceRef.current.muted = isAudioMuted;
      audioInstanceRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
    }
  };

  const stopAudio = () => {
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current.currentTime = 0;
      setIsAudioPlaying(false);
    }
  };

  // Switch song for current box or preview
  const changeSong = (index: number) => {
    const nextIdx = (index + PRELOADED_NATIONAL_SONGS.length) % PRELOADED_NATIONAL_SONGS.length;
    setSelectedSongIndex(nextIdx);
    const nextSong = PRELOADED_NATIONAL_SONGS[nextIdx];
    
    // Update mapping for active box if in fullscreen
    if (activeFullscreenDedication) {
      setBoxSongMap(prev => ({
        ...prev,
        [activeFullscreenDedication.selectedNumber]: nextIdx
      }));
    }

    if (activeFullscreenDedication || isAudioPlaying) {
      playNationalSong(nextSong.url);
    }
  };

  // 🎲 RANDOM AUTO-DISTRIBUTION (Unique Viewers & Unique Songs per Box with No Repetition!)
  const handleRandomDistribution = () => {
    soundFX.play('card_match');

    // Shuffle viewers
    const shuffledViewers = [...streamViewers].sort(() => Math.random() - 0.5);

    // Shuffle unique song indices (0 to 12) without repetition
    const shuffledSongIndices = Array.from({ length: PRELOADED_NATIONAL_SONGS.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);

    const newSongMap: Record<number, number> = {};

    boxes.forEach((boxNum, idx) => {
      const viewer = shuffledViewers[idx % shuffledViewers.length];
      if (viewer) {
        const dedicationMsg = `إهداء إلى وطننا الغالي في يوم الوطن 🇸🇦`;
        onAddDedication(dedicationMsg, viewer.displayName, viewer.avatarUrl, boxNum);
      }
      newSongMap[boxNum] = shuffledSongIndices[idx];
    });

    setBoxSongMap(newSongMap);
  };

  // Clear all boxes
  const handleClearAllBoxes = () => {
    soundFX.play('button_click');
    (dedications || []).forEach(d => onRejectDedication(d.id));
  };

  // Handle Box Click
  const handleBoxClick = (boxNum: number) => {
    const existing = getDedicationForBox(boxNum);
    if (existing) {
      launchFullscreenCelebration(existing);
    } else {
      setActiveBoxModal(boxNum);
      soundFX.play('button_click');
    }
  };

  // Assign viewer to box
  const handleSelectViewer = (viewer: { username: string; displayName: string; avatarUrl: string }) => {
    if (!activeBoxModal) return;

    const dedicationMsg = `إهداء إلى وطننا الغالي في يوم الوطن 🇸🇦`;
    onAddDedication(dedicationMsg, viewer.displayName, viewer.avatarUrl, activeBoxModal);
    
    const newDed: NationalDayDedication = {
      id: `ded-${Date.now()}`,
      userId: `user-${Date.now()}`,
      username: viewer.username,
      displayName: viewer.displayName,
      avatarUrl: viewer.avatarUrl,
      message: dedicationMsg,
      selectedNumber: activeBoxModal,
      timestamp: Date.now(),
      status: 'APPROVED'
    };

    setActiveBoxModal(null);
    launchFullscreenCelebration(newDed);
  };

  // Manual custom viewer submission
  const handleManualViewerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNameInput.trim() || !activeBoxModal) return;

    const name = manualNameInput.trim();
    const handleSelect = {
      username: `@${name.replace(/\s+/g, '_')}`,
      displayName: name,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}-${Date.now()}`
    };

    handleSelectViewer(handleSelect);
    setManualNameInput('');
  };

  // Launch Fullscreen Video Celebration with the Box's Guaranteed Unique Song!
  const launchFullscreenCelebration = (dedication: NationalDayDedication) => {
    const songIndex = boxSongMap[dedication.selectedNumber] ?? ((dedication.selectedNumber - 1) % PRELOADED_NATIONAL_SONGS.length);
    setSelectedSongIndex(songIndex);
    const songToPlay = PRELOADED_NATIONAL_SONGS[songIndex] || PRELOADED_NATIONAL_SONGS[0];

    setActiveFullscreenDedication(dedication);
    setFullscreenTimeRemaining(20);
    soundFX.play('national_day_cheer');

    playNationalSong(songToPlay.url);
  };

  // Fullscreen Countdown Timer
  useEffect(() => {
    if (!activeFullscreenDedication) return;

    const timer = setInterval(() => {
      setFullscreenTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeFullscreenDedication]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-8 my-4 select-none">
      
      {/* 🎵 TOP CONTROL BAR: NATIONAL SONGS & RANDOM DISTRIBUTION */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between bg-[#041B0E]/95 p-4 rounded-3xl border-2 border-[#00A859]/60 shadow-2xl flex-wrap gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#004D25] via-[#006C35] to-[#00A859] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(0,168,89,0.5)] border border-[#E2D4B7]/30">
            💚
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>إهداءات اليوم الوطني 96</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black bg-[#C69214]/20 text-[#FFE79A] border border-[#C69214]/40">
                12 مربع • أغنية فريدة لكل رقم
              </span>
            </h2>
            <p className="text-xs text-[#E2D4B7]/80 font-bold">
              كل رقم من 1 إلى 12 مرتبط بأغنية وطنية فريدة ومستقلة لا تتكرر مع باقي الأرقام 🇸🇦
            </p>
          </div>
        </div>

        {/* Controls: Song Selector, Random Distribution, Clear */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* 🎲 Random Distribution Button (توزيع عشوائي) */}
          <button
            onClick={handleRandomDistribution}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#006C35] via-[#00A859] to-[#006C35] text-white text-xs font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all border border-[#FFE79A]/30 cursor-pointer"
            title="توزيع عشوائي فريد للمتابعين والأغاني على الـ 12 مربع"
          >
            <Shuffle className="w-4 h-4 text-[#FFE79A]" />
            <span>توزيع عشوائي 🎲</span>
          </button>

          {/* National Songs Selector Dropdown & Play Preview */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#082915] border border-[#00A859]/60">
            <button
              onClick={toggleAudioPlayback}
              className="p-1 rounded-lg hover:bg-white/10 text-[#FFE79A] transition-colors"
              title={isAudioPlaying ? 'إيقاف مؤقت' : 'تجربة تشغيل الأغنية'}
            >
              {isAudioPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400 fill-current" />}
            </button>

            <select
              value={selectedSongIndex}
              onChange={(e) => changeSong(Number(e.target.value))}
              className="bg-transparent text-xs font-black text-[#FFE79A] outline-none max-w-[180px] cursor-pointer"
            >
              {PRELOADED_NATIONAL_SONGS.map((song, idx) => (
                <option key={song.id} value={idx} className="bg-[#03150A] text-white">
                  {idx + 1}. {song.title}
                </option>
              ))}
            </select>
          </div>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => {
              const newMuted = !isAudioMuted;
              setIsAudioMuted(newMuted);
              if (audioInstanceRef.current) audioInstanceRef.current.muted = newMuted;
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
            title={isAudioMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Clear All Dedications */}
          {(dedications || []).length > 0 && (
            <button
              onClick={handleClearAllBoxes}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all cursor-pointer"
              title="تفريغ كافة المربعات"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 📦 12 NUMBERED DEDICATION BOXES (4 Columns Grid) */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {boxes.map((num) => {
          const dedication = getDedicationForBox(num);
          const assignedSong = getSongForBox(num);

          return (
            <div
              key={num}
              onClick={() => handleBoxClick(num)}
              className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,168,89,0.4)] shadow-2xl border-2 border-[#006C35]/60 hover:border-[#00A859] bg-[#03150A]"
            >
              {/* Box Frame Background (Image 1) */}
              <img 
                src="/national-day-96/dedication-box-frame.png" 
                alt={`إهداء ${num}`}
                className="absolute inset-0 w-full h-full object-cover filter brightness-105 contrast-110"
              />

              {/* Unique Song Tag Badge at the top of each Box */}
              <div className="absolute top-3 inset-x-3 flex justify-center z-20">
                <span className="px-2.5 py-0.5 rounded-full bg-[#041D0E]/95 border border-[#FFE79A]/40 text-[9px] font-black text-[#FFE79A] truncate max-w-[85%] shadow-md backdrop-blur-md">
                  🎵 {assignedSong.title}
                </span>
              </div>

              {/* Inside Box Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                
                {dedication ? (
                  /* Assigned Viewer State */
                  <div className="flex flex-col items-center gap-2 animate-in zoom-in-95 mt-4">
                    <div className="relative">
                      <img 
                        src={dedication.avatarUrl} 
                        alt={dedication.displayName}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#FFE79A] shadow-xl bg-slate-900"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00A859] border border-white text-white flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-xs sm:text-sm font-black text-white truncate max-w-[120px] drop-shadow-md">
                        {dedication.displayName}
                      </span>
                      <span className="text-[9px] font-mono text-[#FFE79A] font-bold">
                        {dedication.username}
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#006C35]/90 border border-[#FFE79A]/40 text-[9px] font-black text-white shadow-md flex items-center gap-1 group-hover:scale-105 transition-transform">
                      <Play className="w-2.5 h-2.5 fill-current text-[#FFE79A]" />
                      <span>عرض الإهداء</span>
                    </span>
                  </div>
                ) : (
                  /* Empty Number State */
                  <div className="flex flex-col items-center justify-center gap-1 my-auto mt-4">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFE79A] to-[#C69214] drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform">
                      {String(num).padStart(2, '0')}
                    </span>
                    
                    <span className="px-2.5 py-0.5 rounded-full bg-[#082915]/90 border border-[#00A859]/50 text-[9px] font-black text-[#E2D4B7] shadow-md group-hover:border-[#FFE79A] transition-colors">
                      + اختيار متابع
                    </span>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

      {/* 👥 VIEWER SELECTION MODAL (When Host clicks an empty Box) */}
      {activeBoxModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#052413] to-[#021108] border-2 border-[#00A859] p-6 shadow-[0_25px_90px_rgba(0,0,0,0.95)] flex flex-col gap-5 text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#00A859]/40 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-[#004D25] border border-[#FFE79A]/40 flex items-center justify-center text-sm font-black font-mono text-[#FFE79A]">
                  #{activeBoxModal}
                </span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    اختيار صاحب الإهداء للمربع {activeBoxModal}
                  </h3>
                  <span className="text-xs text-[#FFE79A] font-bold">
                    🎵 الأغنية المخصصة: {getSongForBox(activeBoxModal).title}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveBoxModal(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن اسم أو يوزر المتابع..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-[#03150A] border border-[#006C35] text-white text-xs font-bold outline-none focus:border-[#00A859]"
              />
            </div>

            {/* Viewers List */}
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              <span className="text-[11px] font-mono font-black text-[#FFE79A] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#00A859]" />
                <span>المتابعون المتواجدون في البث ({filteredViewers.length})</span>
              </span>

              {filteredViewers.map((viewer) => (
                <div
                  key={viewer.username}
                  onClick={() => handleSelectViewer(viewer)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-[#082915]/80 hover:bg-[#0E3D21] border border-white/5 hover:border-[#00A859] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={viewer.avatarUrl} 
                      alt={viewer.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-[#FFE79A] shadow-md bg-slate-900"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white group-hover:text-[#FFE79A] transition-colors">
                        {viewer.displayName}
                      </span>
                      <span className="text-[10px] font-mono text-[#00A859]">
                        {viewer.username}
                      </span>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#006C35] to-[#00A859] text-white text-xs font-black shadow-md group-hover:scale-105 transition-transform">
                    اختيار ✓
                  </button>
                </div>
              ))}
            </div>

            {/* Manual Viewer Name Input (Fallback) */}
            <form onSubmit={handleManualViewerSubmit} className="pt-3 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                placeholder="أو اكتب اسم المتابع يدوياً..."
                value={manualNameInput}
                onChange={e => setManualNameInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-[#03150A] border border-white/10 text-white text-xs font-bold outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#C69214] text-slate-950 text-xs font-black shadow-md cursor-pointer hover:bg-[#FFE79A] transition-colors"
              >
                اعتماد
              </button>
            </form>

          </div>
        </div>
      )}

      {/* 🎬 2. FULLSCREEN ANIMATED NATIONAL DEDICATION CELEBRATION VIDEO */}
      {activeFullscreenDedication && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in duration-500 overflow-hidden select-none" dir="rtl">
          
          {/* Main Fullscreen Stage Container (16:9 Aspect Ratio / TV Scale) */}
          <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] flex items-center justify-center overflow-hidden">
            
            {/* Background Graphic Asset (Image 2 - National Day 96 Authentic Backdrop) */}
            <img 
              src="/national-day-96/dedication-fullscreen-bg.png" 
              alt="National Day Celebration Backdrop"
              className="absolute inset-0 w-full h-full object-cover filter brightness-105 contrast-110 select-none pointer-events-none"
            />

            {/* 🌟 Dynamic Celebration Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#00A859]/10 to-[#004D25]/20 pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#00A859]/20 rounded-full filter blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-[#C69214]/15 rounded-full filter blur-[120px] pointer-events-none" />

            {/* Floating Celebration Sparkles */}
            <div className="absolute top-16 right-1/3 animate-bounce text-3xl pointer-events-none">✨</div>
            <div className="absolute top-28 right-1/4 animate-pulse text-2xl pointer-events-none">💚</div>
            <div className="absolute bottom-32 right-1/2 animate-bounce text-2xl pointer-events-none">🇸🇦</div>

            {/* 👤 🎯 VIEWER PROFILE AVATAR & DEDICATION IN THE EXACT RIGHT-SIDE EMPTY SKY AREA (AS INDICATED BY THE ARROWS) */}
            <div 
              className="absolute top-[12%] sm:top-[14%] md:top-[16%] right-[5%] sm:right-[8%] md:right-[10%] lg:right-[12%] w-[90%] max-w-[440px] sm:max-w-[480px] md:max-w-[520px] flex flex-col items-center text-center gap-4 sm:gap-5 z-20 animate-in zoom-in-75 duration-700"
            >
              
              {/* 1. ARROW 1: Profile Avatar Halo with Royal Gold Laurel Border */}
              <div className="relative group">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#00A859] via-[#FFE79A] to-[#C69214] opacity-85 blur-xl animate-pulse" />
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full p-2 bg-gradient-to-tr from-[#C69214] via-[#FFE79A] to-[#00A859] shadow-[0_0_60px_rgba(0,168,89,0.9)]">
                  <img 
                    src={activeFullscreenDedication.avatarUrl} 
                    alt={activeFullscreenDedication.displayName}
                    className="w-full h-full rounded-full object-cover border-4 border-[#02180C] shadow-inner bg-slate-900"
                  />
                </div>
                <div className="absolute -bottom-2 -left-2 px-3 py-1 rounded-full bg-[#082915] border-2 border-[#FFE79A] text-white text-xs font-black shadow-xl flex items-center gap-1.5">
                  <span className="text-sm">🇸🇦</span>
                  <span className="font-mono text-[#FFE79A] font-black">96</span>
                </div>
              </div>

              {/* 2. ARROW 2: Account Name & Username */}
              <div className="flex flex-col items-center gap-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)]">
                  {activeFullscreenDedication.displayName}
                </h2>
                <span className="text-sm sm:text-base font-mono text-[#FFE79A] font-bold drop-shadow-md">
                  {activeFullscreenDedication.username}
                </span>
              </div>

              {/* 3. ARROW 3: THE REQUIRED OFFICIAL DEDICATION SENTENCE (ABOVE THE HISTORIC DIRIYAH BUILDINGS) */}
              <div className="w-full px-6 py-4 sm:px-8 sm:py-5 rounded-3xl bg-[#041D0E]/95 border-2 border-[#FFE79A]/90 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
                <p className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2D4B7] to-[#FFE79A] leading-relaxed drop-shadow-md">
                  إهداء من <span className="text-[#FFE79A] font-black">{activeFullscreenDedication.displayName}</span> إلى وطننا الغالي في يوم الوطن <span className="inline-block align-middle ml-1 text-2xl">🇸🇦</span>
                </p>
              </div>

            </div>

            {/* 📻 TOP BROADCAST BAR & MUSIC CONTROLLER */}
            <div className="absolute top-6 inset-x-6 sm:inset-x-8 flex items-center justify-between z-30 pointer-events-auto flex-wrap gap-3">
              
              {/* Left Side: Broadcast Status Badge */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 rounded-full bg-[#082915]/90 border border-[#00A859] text-xs font-black font-mono text-[#FFE79A] flex items-center gap-2 shadow-lg backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A859] animate-ping" />
                  <span>بث مباشر • إهداء #{activeFullscreenDedication.selectedNumber}</span>
                </div>
              </div>

              {/* Right Side: Audio Controls, Timer, Close Button */}
              <div className="flex items-center gap-2.5">
                
                {/* Interactive Audio Player Pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/70 border border-[#FFE79A]/50 backdrop-blur-md shadow-xl text-white">
                  <button
                    onClick={toggleAudioPlayback}
                    className="p-1 rounded-lg bg-[#00A859] hover:bg-[#00D06E] text-white transition-all cursor-pointer shadow-md"
                    title={isAudioPlaying ? 'إيقاف مؤقت' : 'تشغيل الأغنية'}
                  >
                    {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>

                  <button
                    onClick={() => changeSong(selectedSongIndex + 1)}
                    className="p-1 rounded-lg hover:bg-white/10 text-[#FFE79A] transition-colors cursor-pointer"
                    title="الأغنية التالية"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex flex-col text-right">
                    <span className="text-[11px] font-black text-[#FFE79A] truncate max-w-[150px] sm:max-w-[200px]">
                      🎵 {selectedSong.title}
                    </span>
                    <span className="text-[9px] text-[#E2D4B7]/70 font-mono">
                      {isAudioPlaying ? 'جاري التشغيل الآن 🔊' : 'متوقف مؤقتاً'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const nextMute = !isAudioMuted;
                      setIsAudioMuted(nextMute);
                      if (audioInstanceRef.current) audioInstanceRef.current.muted = nextMute;
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                    title={isAudioMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
                  >
                    {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>

                {/* Time Remaining Bar */}
                <div className="px-3.5 py-1.5 rounded-full bg-black/70 border border-white/20 text-white text-xs font-mono font-black backdrop-blur-md">
                  ⏱️ 00:{String(fullscreenTimeRemaining).padStart(2, '0')}
                </div>

                {/* Close Fullscreen Button */}
                <button
                  onClick={() => {
                    setActiveFullscreenDedication(null);
                    stopAudio();
                  }}
                  className="px-4 py-2 rounded-2xl bg-rose-600/95 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 shadow-2xl transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>إغلاق البث</span>
                </button>
              </div>
            </div>

            {/* Audio Autoplay Unblocker Banner (If blocked by browser) */}
            {!isAudioPlaying && (
              <div className="absolute bottom-6 inset-x-auto z-30 pointer-events-auto animate-in slide-in-from-bottom duration-300">
                <button
                  onClick={toggleAudioPlayback}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#006C35] via-[#00A859] to-[#006C35] text-white text-xs font-black flex items-center gap-2.5 shadow-[0_0_30px_rgba(0,168,89,0.8)] border border-[#FFE79A] hover:scale-105 transition-transform cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-[#FFE79A]" />
                  <span>▶ اضغط هنا لتشغيل الأغنية الوطنية في البث المباشر 🇸🇦</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
