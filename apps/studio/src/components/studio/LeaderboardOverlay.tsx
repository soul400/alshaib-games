'use client';

import React from 'react';
import { PlayerScore } from '@aep/types';
import { LiveLeaderboard } from './LiveLeaderboard';
import { X } from 'lucide-react';

interface Props {
  leaderboard: PlayerScore[];
  onClose: () => void;
}

export function LeaderboardOverlay({ leaderboard = [], onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-[#050816]/92 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-[#0B0D1B] border border-white/15 p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col gap-6 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer z-20 flex items-center justify-center"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <LiveLeaderboard
          leaderboard={leaderboard}
          title="لوحة المتصدرين العالمية"
          subtitle="GLOBAL LIVE LEADERBOARD"
          maxItems={10}
        />
      </div>
    </div>
  );
}
