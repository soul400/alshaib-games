'use client';

import React, { useState } from 'react';
import { Settings, Database, Radio, Check, Save } from 'lucide-react';

export default function SettingsPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [dbUrl, setDbUrl] = useState('postgresql://postgres:A86a7616513@localhost:5432/gameshow');
  const [streamKey, setStreamKey] = useState('soul80813');
  const [autoRevealAnswer, setAutoRevealAnswer] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      const savedChannel = localStorage.getItem('aep_tiktok_channel');
      if (savedChannel) setStreamKey(savedChannel);
      const savedDb = localStorage.getItem('aep_db_url');
      if (savedDb) setDbUrl(savedDb);
      const savedAuto = localStorage.getItem('aep_auto_reveal');
      if (savedAuto !== null) setAutoRevealAnswer(savedAuto === 'true');
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aep_tiktok_channel', streamKey.trim().replace(/^@/, ''));
      localStorage.setItem('aep_db_url', dbUrl.trim());
      localStorage.setItem('aep_auto_reveal', String(autoRevealAnswer));
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-arena-card border border-white/10 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black shadow-lg">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">إعدادات المنصة وقواعد البيانات (Platform Settings)</h2>
            <p className="text-xs text-slate-300 font-medium">تكوين اتصال PostgreSQL pgAdmin 4، شات TikTok، وخيارات البث</p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Config */}
        <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-4 backdrop-blur-xl">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>ربط قاعدة البيانات المحظورة PostgreSQL (gameshow)</span>
          </h3>

          <div className="flex flex-col gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1.5">اسم قاعدة البيانات:</label>
              <input
                type="text"
                readOnly
                value="gameshow"
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-white/10 text-cyan-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1.5">رابط الاتصال (Connection String):</label>
              <input
                type="text"
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>pgAdmin 4 (PostgreSQL localhost:5432/gameshow) متصل بنجاح</span>
            </div>
          </div>
        </div>

        {/* Stream & Engine Config */}
        <div className="p-6 rounded-3xl glass-arena-card border border-white/10 flex flex-col gap-4 backdrop-blur-xl">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-400" />
            <span>إعدادات قناة TikTok Live ونظام النقاط</span>
          </h3>

          <div className="flex flex-col gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1.5">معرف القناة / البث المباشر:</label>
              <input
                type="text"
                value={streamKey}
                onChange={(e) => setStreamKey(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-white block">نظام التنافس النقاط التنازلي</span>
                <span className="text-[10px] text-slate-400">1: 5، 2: 4، 3: 3، 4: 2، 5: 1 نقاط (وحروف وألوف: نقطة)</span>
              </div>
              <input type="checkbox" checked={autoRevealAnswer} onChange={(e) => setAutoRevealAnswer(e.target.checked)} className="w-4 h-4 accent-cyan-400 cursor-pointer" />
            </div>

            <button
              onClick={handleSave}
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-all cursor-pointer shadow-md"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'تم حفظ الإعدادات!' : 'حفظ الإعدادات'}</span>
            </button>
          </div>
        </div>

        {/* Donation QR Settings */}
        <div className="p-6 rounded-3xl glass-arena-card border border-amber-500/30 flex flex-col gap-4 backdrop-blur-xl lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
              <span>💎</span>
              <span>إعدادات QR رابط الدعم (Donation QR Code)</span>
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              ● بث دائم ومباشر
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-2xl border border-white/10">
              <div className="w-36 h-36 bg-white p-2 rounded-2xl shadow-xl">
                <img
                  src="/donation-qr.png"
                  alt="QR الدعم"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-bold text-amber-300 mt-2">معاينة QR الدعم المباشر</span>
            </div>

            <div className="md:col-span-2 flex flex-col gap-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                يظهر كود الـ QR بحجم كبير وواضح للمسح السريع مع نظام ظهور دوري ذكي (يظهر 20 ثانية ويختفي 40 ثانية) طوال فترة البث المباشر لتوفير تجربة مشاهدة مثالية.
              </p>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <span className="font-extrabold text-white block">تفعيل إظهار QR الدعم أثناء البث</span>
                  <span className="text-[10px] text-slate-400">يظهر في جميع شاشات الألعاب والصفحة الرئيسية</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    localStorage.setItem('aep_donation_qr_enabled', String(e.target.checked));
                    window.location.reload();
                  }}
                  className="w-5 h-5 accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
