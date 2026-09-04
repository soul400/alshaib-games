'use client';

import React, { useState } from 'react';
import { soundFX } from '@aep/audio-visual-fx';
import { SoundEffectType } from '@aep/types';
import { Volume2, Upload, Trash2, Play, Radio, Sparkles } from 'lucide-react';

export default function SoundFXPage() {
  const [customSoundFiles, setCustomSoundFiles] = useState<Record<string, string>>({});

  const soundboardEvents: { label: string; type: SoundEffectType; color: string }[] = [
    { label: 'بدء الجولة', type: 'round_start', color: 'from-blue-600 to-cyan-500' },
    { label: 'إجابة صحيحة ✨', type: 'correct_answer', color: 'from-emerald-600 to-teal-500' },
    { label: 'إجابة خاطئة ❌', type: 'wrong_answer', color: 'from-red-600 to-rose-500' },
    { label: 'إعلان الفائز 🏆', type: 'winner_announcement', color: 'from-amber-500 to-yellow-400' },
    { label: 'تحديث النقاط 📊', type: 'score_update', color: 'from-purple-600 to-indigo-500' },
    { label: 'فتح صندوق 🎁', type: 'box_open', color: 'from-pink-600 to-rose-400' },
    { label: 'انتهاء الوقت ⏳', type: 'time_up', color: 'from-orange-600 to-amber-500' },
    { label: 'نهاية العرض 🎉', type: 'show_end', color: 'from-cyan-600 to-blue-600' },
  ];

  const handleFileUpload = (type: SoundEffectType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      soundFX.setCustomSoundUrl(type, dataUrl);
      setCustomSoundFiles(prev => ({ ...prev, [type]: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomSound = (type: SoundEffectType) => {
    soundFX.clearCustomSound(type);
    setCustomSoundFiles(prev => {
      const copy = { ...prev };
      delete copy[type];
      return copy;
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-arena-card border border-white/10 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center font-black shadow-lg">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">المؤثرات والصوتيات (Sound FX Studio)</h2>
            <p className="text-xs text-slate-300 font-medium">رفع وتعيين ملفات MP3 وتخصيص المؤثرات التفاعلية المباشرة</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/15 border border-pink-400/30 text-pink-300 font-extrabold text-xs backdrop-blur-md">
          <Sparkles className="w-4 h-4" />
          <span>المحرك: Web Audio API Standard</span>
        </div>
      </div>

      {/* Sound Matrix Grid */}
      <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-4 backdrop-blur-xl">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-yellow-400" />
          <span>لوحة التحكم بالمؤثرات الصوتية (Sound Board)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {soundboardEvents.map((evt) => {
            const customFileName = customSoundFiles[evt.type] || (soundFX.getCustomSoundUrl(evt.type) ? 'ملف MP3 مخصص مسبقاً' : undefined);

            return (
              <div key={evt.type} className="p-4 rounded-2xl bg-white/5 border border-white/8 flex flex-col justify-between gap-4 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-sm">{evt.label}</span>
                  {customFileName && (
                    <button
                      onClick={() => handleRemoveCustomSound(evt.type)}
                      className="p-1 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 font-mono truncate">
                  {customFileName ? `🎵 ${customFileName}` : 'المؤثر الافتراضي الأصلي'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => soundFX.play(evt.type)}
                    className={`flex-1 py-2 rounded-xl bg-gradient-to-r ${evt.color} text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>تشغيل</span>
                  </button>

                  <label className="p-2 rounded-xl bg-white/10 text-slate-200 hover:bg-white/20 cursor-pointer transition-all">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="audio/mp3,audio/wav,audio/ogg"
                      onChange={(e) => handleFileUpload(evt.type, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
