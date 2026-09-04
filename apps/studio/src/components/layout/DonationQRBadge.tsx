'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, Gift } from 'lucide-react';

/**
 * 💰 DonationQRBadge — Floating QR Donation Badge for Broadcast
 * 
 * Periodic Broadcast Display:
 * - Appears for 20 seconds with glowing entrance
 * - Hides for 40 seconds
 * - Loops continuously throughout the entire live broadcast
 * - Enlarged, ultra-crisp scan-ready design for mobile & TV stream viewers
 */

import { authManager } from '../../utils/authManager';

// ══════════════════════════════════════════════════════════════
// LAYER 3: Top Banner — "ادعم البث" slide-down announcement
// ══════════════════════════════════════════════════════════════
export function DonationBanner({ show, onDone }: { show: boolean; onDone: () => void }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => {
        onDoneRef.current();
      }, 5500);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] flex justify-center pointer-events-none animate-[slideDown_0.5s_ease-out,slideDown_0.5s_ease-in_5s_reverse_forwards]">
      <div className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600/90 via-yellow-500/90 to-amber-600/90 border border-amber-400/60 backdrop-blur-xl shadow-[0_8px_40px_rgba(245,158,11,0.5)] flex items-center gap-3 pointer-events-auto">
        <Gift className="w-5 h-5 text-white animate-bounce" />
        <span className="text-sm font-black text-white">
          💎 ادعم البث وساهم في استمراره — امسح QR الآن!
        </span>
        <Gift className="w-5 h-5 text-white animate-bounce" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT: Floating QR Badge (20s visible / 40s hidden cycle)
// ══════════════════════════════════════════════════════════════
export function DonationQRBadge() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const bannerShownRef = useRef(false);

  const [activeDonation, setActiveDonation] = useState({
    title: 'رابط الدعم 💎',
    qrUrl: '/donation-qr.png',
    url: ''
  });

  const loadDonationInfo = () => {
    const { user, settings } = authManager.getActiveDonation();
    const qrUrl = settings.qrImageUrl || (settings.url 
      ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(settings.url)}`
      : '/donation-qr.png');
    setActiveDonation({
      title: settings.title || `رابط دعم ${user.displayName} 💎`,
      qrUrl,
      url: settings.url
    });
  };

  // Load enabled state from localStorage safely and subscribe to donation changes
  useEffect(() => {
    loadDonationInfo();

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aep_donation_qr_enabled');
        if (saved === 'false') setIsEnabled(false);
      } catch (e) {
        console.warn('localStorage not available:', e);
      }

      const handler = () => loadDonationInfo();
      window.addEventListener('aep:donation-change', handler);
      window.addEventListener('aep:auth-change', handler);
      return () => {
        window.removeEventListener('aep:donation-change', handler);
        window.removeEventListener('aep:auth-change', handler);
      };
    }
  }, []);

  // ⏱️ 20 Seconds Visible / 40 Seconds Hidden Broadcast Loop
  useEffect(() => {
    if (!isEnabled || isMinimized) return;

    let isMounted = true;
    let timer: ReturnType<typeof setTimeout>;

    const runCycle = () => {
      // 1. Show for 20 seconds
      setIsVisible(true);
      setIsPulsing(true);

      // Stop initial entrance pulse after 3 seconds
      const pulseStop = setTimeout(() => {
        if (isMounted) setIsPulsing(false);
      }, 3000);

      // After 20 seconds, hide
      timer = setTimeout(() => {
        if (!isMounted) return;
        clearTimeout(pulseStop);
        setIsVisible(false);

        // After 40 seconds hidden, restart cycle
        timer = setTimeout(() => {
          if (!isMounted) return;
          runCycle();
        }, 40000); // 40 seconds hidden
      }, 20000); // 20 seconds visible
    };

    runCycle();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isEnabled, isMinimized]);

  // Show banner once on first load after 15 seconds
  useEffect(() => {
    if (!isEnabled || bannerShownRef.current) return;
    const t = setTimeout(() => {
      setShowBanner(true);
      bannerShownRef.current = true;
    }, 15000);
    return () => clearTimeout(t);
  }, [isEnabled]);

  // Listen for custom event to trigger banner (from game engines on round start)
  useEffect(() => {
    const handler = () => {
      setShowBanner(true);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('aep:donation-banner', handler);
      return () => window.removeEventListener('aep:donation-banner', handler);
    }
  }, []);

  if (!isEnabled) return null;

  // Minimized state — just a small heart icon
  if (isMinimized) {
    return (
      <button
        onClick={() => {
          setIsMinimized(false);
          setIsVisible(true);
        }}
        className="fixed bottom-24 left-5 sm:bottom-28 sm:left-8 z-[9999] w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(245,158,11,0.7)] hover:scale-110 transition-all cursor-pointer animate-float-up-down border-2 border-amber-300"
        title="إظهار رابط الدعم"
      >
        <Heart className="w-7 h-7 fill-white" />
      </button>
    );
  }

  return (
    <>
      {/* Layer 3: Top Banner */}
      <DonationBanner show={showBanner} onDone={() => setShowBanner(false)} />

      {/* Floating Enlarged QR Badge with 20s Visible / 40s Hidden Transition */}
      <div
        className={`fixed bottom-20 left-4 sm:bottom-24 sm:left-7 z-[9999] transition-all duration-700 ease-in-out select-none ${
          isVisible
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
        }`}
      >
        <div className={`relative transition-all duration-700 ${
          isPulsing
            ? 'scale-[1.05] shadow-[0_0_50px_rgba(245,158,11,0.8),0_0_100px_rgba(245,158,11,0.3)]'
            : 'scale-100 shadow-[0_12px_45px_rgba(0,0,0,0.85)]'
        }`}>
          {/* Pulsing golden halo ring */}
          {isPulsing && (
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-amber-400/40 via-yellow-300/30 to-amber-400/40 animate-pulse blur-md pointer-events-none" />
          )}

          {/* Main Card Container (Enlarged) */}
          <div className={`relative flex flex-col items-center gap-2.5 p-3.5 sm:p-4 rounded-3xl border-2 backdrop-blur-2xl transition-all duration-500 ${
            isPulsing
              ? 'bg-[#0E0F1E]/95 border-amber-400'
              : 'bg-[#0E0F1E]/90 border-amber-400/40 hover:border-amber-400/80 shadow-2xl'
          }`}>
            {/* Close / Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-800/90 border border-white/20 text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-400 flex items-center justify-center transition-all cursor-pointer z-10 shadow-lg"
              title="تصغير"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Enlarged QR Code Image (140px - 160px for effortless scanning) */}
            <div className={`relative w-[136px] h-[136px] sm:w-[155px] sm:h-[155px] rounded-2xl overflow-hidden bg-white p-2 shadow-inner transition-all duration-500 ${
              isPulsing ? 'ring-3 ring-amber-400 ring-offset-2 ring-offset-[#0E0F1E]' : ''
            }`}>
              <img
                src={activeDonation.qrUrl}
                alt={activeDonation.title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/donation-qr.png';
                }}
                className="w-full h-full object-contain filter contrast-125"
                draggable={false}
              />
            </div>

            {/* Label & Glow Badge */}
            <div className="flex items-center justify-center gap-1.5 w-full px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/25 to-amber-500/20 border border-amber-400/50 shadow-sm text-center">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse shrink-0" />
              <span className="text-[11px] font-black text-amber-300 font-mono tracking-tight truncate">
                {activeDonation.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
