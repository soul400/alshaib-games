'use client';

import React, { useState, useEffect } from 'react';
import { authManager, UserProfile, VALID_USERS } from '../../utils/authManager';
import { Lock, User, Key, LogIn, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = authManager.getCurrentUser();
      setCurrentUser(user);
      setHasChecked(true);
    };

    checkAuth();

    const handler = () => checkAuth();
    window.addEventListener('aep:auth-change', handler);
    return () => window.removeEventListener('aep:auth-change', handler);
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = authManager.login(username, password);
      setIsLoading(false);
      if (res.success && res.user) {
        setCurrentUser(res.user);
      } else {
        setError(res.error || 'فشل تسجيل الدخول');
      }
    }, 400);
  };

  const handleQuickSelect = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  // Prevent flash before hydration check
  if (!hasChecked) {
    return (
      <div className="min-h-screen w-full bg-[#08090C] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If authenticated, render app
  if (currentUser) {
    return <>{children}</>;
  }

  // If not authenticated, render Login Screen
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#06070B] via-[#0E101B] to-[#08090E] flex items-center justify-center p-4 relative overflow-hidden dir-rtl select-none">
      
      {/* Background Neon Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Main Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111322]/90 border-2 border-[#20243E] shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                <div className="w-full h-full bg-[#0E0F1E] rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">👑</span>
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-black shadow-md">
                LIVE VIP
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-black text-white tracking-tight font-display">
                منصة الشايب للألعاب التفاعلية
              </h1>
              <p className="text-xs text-slate-400 font-bold">
                تسجيل دخول مقدم البث المعتمد لبدء الألعاب والتحكم
              </p>
            </div>
          </div>

          {/* Quick Account Preset Buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-400">اختر الحساب السريع:</span>
            <div className="grid grid-cols-3 gap-2">
              
              <button
                type="button"
                onClick={() => handleQuickSelect('shayeb', 'Aa10203040')}
                className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  username === 'shayeb'
                    ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-[#181A30] border-white/5 hover:border-amber-400/40'
                }`}
              >
                <span className="text-lg">🎙️</span>
                <span className="text-xs font-black text-white">الشايب</span>
                <span className="text-[9px] font-mono text-amber-300">shayeb</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('ashley', 'ash11223344')}
                className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  username === 'ashley'
                    ? 'bg-rose-500/20 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-[#181A30] border-white/5 hover:border-rose-400/40'
                }`}
              >
                <span className="text-lg">🌸</span>
                <span className="text-xs font-black text-white">آشلي</span>
                <span className="text-[9px] font-mono text-rose-300">ashley</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('admin', '11223344')}
                className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  username === 'admin'
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-[#181A30] border-white/5 hover:border-cyan-400/40'
                }`}
              >
                <span className="text-lg">⚙️</span>
                <span className="text-xs font-black text-white">الإدارة</span>
                <span className="text-[9px] font-mono text-cyan-300">admin</span>
              </button>

            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            {/* Username Input */}
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>اسم المستخدم (User)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: shayeb أو ashley أو admin"
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0C18] border border-[#262A48] focus:border-amber-400 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-mono"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>كلمة المرور (Password)</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0C18] border border-[#262A48] focus:border-amber-400 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-mono"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer disabled:opacity-50 mt-1"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>دخول المنصة</span>
                </>
              )}
            </button>
          </form>

          {/* Footer badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>نظام تسجيل الدخول المشفر للبثوث المباشرة</span>
          </div>

        </div>

      </div>

    </div>
  );
}
