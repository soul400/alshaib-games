'use client';

import React, { useState, useEffect } from 'react';
import { authManager, VALID_USERS, UserProfile, AccountDonationSettings } from '../../utils/authManager';
import { Heart, X, Check, Globe, QrCode, Save, Sparkles, ExternalLink } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [activeAccount, setActiveAccount] = useState<string>('shayeb');
  const [allSettings, setAllSettings] = useState<Record<string, AccountDonationSettings>>({});
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Edit fields
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const user = authManager.getCurrentUser();
      setCurrentUser(user);

      const active = authManager.getActiveDonationUser();
      setActiveAccount(active);

      const settings = authManager.getAllDonationSettings();
      setAllSettings(settings);

      const currentSettings = settings[active] || {
        url: VALID_USERS[active]?.profile?.defaultDonationUrl || '',
        title: `رابط دعم ${active}`
      };
      setUrlInput(currentSettings.url);
      setTitleInput(currentSettings.title);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const handleSelectAccount = (username: string) => {
    setActiveAccount(username);
    authManager.setActiveDonationUser(username);

    const s = allSettings[username] || {
      url: VALID_USERS[username]?.profile?.defaultDonationUrl || '',
      title: `رابط دعم ${username}`
    };
    setUrlInput(s.url);
    setTitleInput(s.title);
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const newSettings: AccountDonationSettings = {
      url: urlInput.trim(),
      title: titleInput.trim() || `رابط دعم ${activeAccount}`
    };

    authManager.saveDonationForUser(activeAccount, newSettings);
    authManager.setActiveDonationUser(activeAccount);

    setAllSettings(prev => ({ ...prev, [activeAccount]: newSettings }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (!isOpen) return null;

  const currentSettings = allSettings[activeAccount] || { url: urlInput, title: titleInput };
  const qrPreviewUrl = urlInput.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(urlInput.trim())}`
    : '/donation-qr.png';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md dir-rtl select-none animate-in fade-in">
      
      <div className="w-full max-w-lg rounded-3xl bg-[#101222] border-2 border-amber-400/40 shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-xl shadow-inner">
              💎
            </div>
            <div className="flex flex-col text-right">
              <h2 className="text-base font-black text-white">إعدادات واختيار رابط الدعم (QR)</h2>
              <span className="text-[11px] text-amber-300 font-bold">حدد الحساب النشط ورابط الدعم المعروض في البث</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
          
          {/* 1. Account Selector Tabs */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>اختر حساب الدعم النشط في البث:</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                الحساب النشط الآن: {VALID_USERS[activeAccount]?.profile?.displayName}
              </span>
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {Object.entries(VALID_USERS).map(([key, item]) => {
                const isSelected = activeAccount === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectAccount(key)}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 text-center cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-[1.02]'
                        : 'bg-[#15182C] border-white/5 hover:border-white/20 opacity-75'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    )}
                    <span className="text-2xl">{key === 'shayeb' ? '🎙️' : key === 'ashley' ? '🌸' : '⚙️'}</span>
                    <span className="text-xs font-black text-white">{item.profile.displayName}</span>
                    <span className="text-[9px] font-mono text-cyan-300">@{key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. QR Code Preview & Edit Form */}
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            
            {/* Live QR Preview */}
            <div className="p-4 rounded-2xl bg-[#0B0C18] border border-white/10 flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-white p-1.5 shrink-0 shadow-md">
                <img
                  src={qrPreviewUrl}
                  alt="QR Preview"
                  className="w-full h-full object-contain filter contrast-125"
                />
              </div>

              <div className="flex flex-col gap-1 text-right min-w-0">
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-mono font-black w-fit">
                  معاينة باركود الـ QR
                </span>
                <span className="text-xs font-bold text-white truncate">
                  {titleInput || `رابط دعم ${activeAccount}`}
                </span>
                <a
                  href={urlInput || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-cyan-400 hover:underline truncate flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{urlInput || 'لم يتم تحديد رابط'}</span>
                </a>
              </div>
            </div>

            {/* Input: URL */}
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>رابط الدعم (URL):</span>
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://tip.live/your-name أو رابط stc pay / paypal"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0C18] border border-[#262A48] focus:border-amber-400 text-white text-xs font-mono outline-none transition-all dir-ltr text-left"
                required
              />
            </div>

            {/* Input: Title */}
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>عنوان شريط الدعم في الشاشة:</span>
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="مثال: رابط دعم الشايب 💎"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0C18] border border-[#262A48] focus:border-amber-400 text-white text-xs outline-none transition-all"
              />
            </div>

            {/* Success message */}
            {saveSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>تم حفظ وتفعيل رابط الدعم على الشاشة بنجاح!</span>
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(245,158,11,0.4)] transition-all cursor-pointer mt-1"
            >
              <Save className="w-4 h-4" />
              <span>حفظ وتحديث باركود الدعم في البث 🚀</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
