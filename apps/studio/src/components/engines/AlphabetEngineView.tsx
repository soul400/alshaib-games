'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnyQuestion } from '@aep/types';
import { ALPHABET_QUESTION_BANK, AlphabetBankQuestion } from '@aep/content-library';
import { useStudioStore } from '../../store/useStudioStore';
import { soundFX, triggerVisualEffect } from '@aep/audio-visual-fx';
import { Sparkles, Swords, RotateCcw, Shield, Trophy, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  question: AnyQuestion;
  isAnswerRevealed: boolean;
}

// EXACT 25 letters in 5 rows from reference board
const EXACT_IMAGE_ROWS: string[][] = [
  ['خ', 'غ', 'ش', 'أ', 'ل'],
  ['ن', 'س', 'ق', 'ب', 'ع'],
  ['ز', 'و', 'ض', 'ي', 'د'],
  ['ث', 'ح', 'هـ', 'ج', 'ذ'],
  ['ف', 'ط', 'ت', 'م', 'ك']
];

/**
 * Check if a team has completed a winning line (Horizontal, Vertical, or Diagonal)
 */
function checkTeamWin(claimedSet: Set<string>): { hasWon: boolean; lineType?: string; winningLetters?: string[] } {
  // 1. Check Rows (5 horizontal lines)
  for (let r = 0; r < 5; r++) {
    const row = EXACT_IMAGE_ROWS[r];
    if (row.every(l => claimedSet.has(l))) {
      return { hasWon: true, lineType: `صف أفقي ${r + 1}`, winningLetters: row };
    }
  }

  // 2. Check Columns (5 vertical lines)
  for (let c = 0; c < 5; c++) {
    const col = [EXACT_IMAGE_ROWS[0][c], EXACT_IMAGE_ROWS[1][c], EXACT_IMAGE_ROWS[2][c], EXACT_IMAGE_ROWS[3][c], EXACT_IMAGE_ROWS[4][c]];
    if (col.every(l => claimedSet.has(l))) {
      return { hasWon: true, lineType: `صف عمودي ${c + 1}`, winningLetters: col };
    }
  }

  // 3. Check Main Diagonal (top-left to bottom-right)
  const diag1 = [EXACT_IMAGE_ROWS[0][0], EXACT_IMAGE_ROWS[1][1], EXACT_IMAGE_ROWS[2][2], EXACT_IMAGE_ROWS[3][3], EXACT_IMAGE_ROWS[4][4]];
  if (diag1.every(l => claimedSet.has(l))) {
    return { hasWon: true, lineType: 'قطر رئيسي ↘', winningLetters: diag1 };
  }

  // 4. Check Anti Diagonal (top-right to bottom-left)
  const diag2 = [EXACT_IMAGE_ROWS[0][4], EXACT_IMAGE_ROWS[1][3], EXACT_IMAGE_ROWS[2][2], EXACT_IMAGE_ROWS[3][1], EXACT_IMAGE_ROWS[4][0]];
  if (diag2.every(l => claimedSet.has(l))) {
    return { hasWon: true, lineType: 'قطر عاكس ↙', winningLetters: diag2 };
  }

  return { hasWon: false };
}

export function AlphabetEngineView({ question, isAnswerRevealed }: Props) {
  const { tiktokEngine } = useStudioStore();

  const [selectedLetter, setSelectedLetter] = useState<string>('أ');
  const [teamPinkCells, setTeamPinkCells] = useState<Set<string>>(new Set());
  const [teamBlueCells, setTeamBlueCells] = useState<Set<string>>(new Set());
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [currentQuestionData, setCurrentQuestionData] = useState<AlphabetBankQuestion | null>(null);
  const [winnerModal, setWinnerModal] = useState<{ team: 'pink' | 'blue'; lineType: string } | null>(null);

  // Get unused question for a selected letter
  const getUnusedQuestionForLetter = useCallback((letter: string, currentUsed: Set<string>): AlphabetBankQuestion | null => {
    const list = ALPHABET_QUESTION_BANK[letter] || [];
    const unused = list.filter(q => !currentUsed.has(q.id));
    if (unused.length > 0) {
      return unused[0];
    }
    // Fallback if all questions for letter were used
    if (list.length > 0) {
      return list[Math.floor(Math.random() * list.length)];
    }
    return {
      id: `fallback-${letter}-${Date.now()}`,
      letter,
      title: `اذكر كلمة أو دولة أو اسم يبدأ بحرف (${letter})؟`,
      acceptableAnswers: [`كلمة تبدأ بحرف ${letter}`],
      points: 100
    };
  }, []);

  // When selected letter changes or on initial mount, load an unused question for that letter
  useEffect(() => {
    const q = getUnusedQuestionForLetter(selectedLetter, usedQuestionIds);
    if (q) {
      setCurrentQuestionData(q);
      // Mark as used
      setUsedQuestionIds(prev => new Set(prev).add(q.id));

      // Sync with TikTok live engine for chat scoring
      if (tiktokEngine) {
        tiktokEngine.setActiveQuestion(
          q.title,
          q.acceptableAnswers,
          q.points || 100,
          'alphabet'
        );
      }
    }
  }, [selectedLetter, getUnusedQuestionForLetter, tiktokEngine]);

  // Handler: Fetch next unused question for current letter
  const handleFetchNextQuestion = () => {
    const q = getUnusedQuestionForLetter(selectedLetter, usedQuestionIds);
    if (q) {
      setCurrentQuestionData(q);
      setUsedQuestionIds(prev => new Set(prev).add(q.id));
      if (tiktokEngine) {
        tiktokEngine.setActiveQuestion(
          q.title,
          q.acceptableAnswers,
          q.points || 100,
          'alphabet'
        );
      }
    }
  };

  // Check for winning lines whenever team cells update
  const checkWinConditions = (pinkSet: Set<string>, blueSet: Set<string>) => {
    const pinkWin = checkTeamWin(pinkSet);
    if (pinkWin.hasWon) {
      soundFX.play('winner_announcement');
      triggerVisualEffect('confetti');
      setWinnerModal({ team: 'pink', lineType: pinkWin.lineType || 'خط متصل' });
      return;
    }

    const blueWin = checkTeamWin(blueSet);
    if (blueWin.hasWon) {
      soundFX.play('winner_announcement');
      triggerVisualEffect('confetti');
      setWinnerModal({ team: 'blue', lineType: blueWin.lineType || 'خط متصل' });
      return;
    }
  };

  // Assign letter cell to Pink Team
  const handleClaimPink = (letter: string) => {
    const newPink = new Set(teamPinkCells);
    newPink.add(letter);
    const newBlue = new Set(teamBlueCells);
    newBlue.delete(letter);

    setTeamPinkCells(newPink);
    setTeamBlueCells(newBlue);
    soundFX.play('score_update');

    checkWinConditions(newPink, newBlue);
  };

  // Assign letter cell to Blue Team
  const handleClaimBlue = (letter: string) => {
    const newBlue = new Set(teamBlueCells);
    newBlue.add(letter);
    const newPink = new Set(teamPinkCells);
    newPink.delete(letter);

    setTeamBlueCells(newBlue);
    setTeamPinkCells(newPink);
    soundFX.play('score_update');

    checkWinConditions(newPink, newBlue);
  };

  // Reset letter cell to unowned
  const handleResetCell = (letter: string) => {
    setTeamPinkCells(prev => {
      const next = new Set(prev);
      next.delete(letter);
      return next;
    });
    setTeamBlueCells(prev => {
      const next = new Set(prev);
      next.delete(letter);
      return next;
    });
  };

  // Reset entire alphabet grid & used questions
  const handleResetEntireGrid = () => {
    setTeamPinkCells(new Set());
    setTeamBlueCells(new Set());
    setUsedQuestionIds(new Set());
    setWinnerModal(null);
    soundFX.play('round_start');
  };

  // Pointy-topped hexagon coordinate points
  const getHexagonPoints = (cx: number, cy: number, r: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle_deg = 60 * i - 30;
      const angle_rad = (Math.PI / 180) * angle_deg;
      const x = cx + r * Math.cos(angle_rad);
      const y = cy + r * Math.sin(angle_rad);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  // Dimensions for 5x5 hexagon grid
  const hexRadius = 38;
  const hexWidth = Math.sqrt(3) * hexRadius; // ~65.8
  const hexHeight = 2 * hexRadius; // 76

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Right Board Panel: Honeycomb Hexagon Grid */}
      <div className="lg:col-span-7 flex flex-col items-center justify-between p-4 sm:p-5 rounded-3xl glass-arena-card border-4 border-cyan-400 relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.4)] w-full">
        {/* Board Header */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <h2 className="text-xl sm:text-2xl font-black text-cyan-300 tracking-wider neon-cyan-text flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span>خلية حروف وألوف 🔤</span>
          </h2>
          <button
            onClick={handleResetEntireGrid}
            className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="تصفير النقاط والشبكة والأسئلة"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير الشبكة</span>
          </button>
        </div>

        {/* Dual Color Board Box */}
        <div className="relative w-full max-w-lg aspect-square border-4 border-cyan-400 rounded-3xl p-1 flex items-center justify-center overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] bg-[#00F0FF]">
          <svg
            viewBox="0 0 440 440"
            className="w-full h-full filter drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)]"
          >
            {/* Background Triangles */}
            <polygon points="0,0 440,0 220,220" fill="#00F0FF" />
            <polygon points="0,440 440,440 220,220" fill="#00F0FF" />
            <polygon points="0,0 0,440 220,220" fill="#FF007F" />
            <polygon points="440,0 440,440 220,220" fill="#FF007F" />

            {/* Inner Frame Ring */}
            <rect x="6" y="6" width="428" height="428" rx="20" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" />

            {/* 5-Row Interlocking Hexagon Grid */}
            {EXACT_IMAGE_ROWS.map((row, r) => {
              const startX = r % 2 === 1 ? 104 : 71;
              const cy = 76 + r * (hexHeight * 0.75);

              return row.map((letter, c) => {
                const cx = startX + c * (hexWidth + 3);
                const isSelected = selectedLetter === letter;
                const isPinkTeam = teamPinkCells.has(letter);
                const isBlueTeam = teamBlueCells.has(letter);

                let fillColor = '#FFFFFF';
                let strokeColor = '#2C0A4C';
                let textColor = '#2C0A4C';
                let strokeWidth = 3.5;

                if (isPinkTeam) {
                  fillColor = '#FF007F'; // Pink Team
                  strokeColor = '#FFFFFF';
                  textColor = '#FFFFFF';
                  strokeWidth = 4;
                } else if (isBlueTeam) {
                  fillColor = '#00F0FF'; // Blue Team
                  strokeColor = '#FFFFFF';
                  textColor = '#040711';
                  strokeWidth = 4;
                } else if (isSelected) {
                  fillColor = '#FFD700'; // Gold Selected
                  strokeColor = '#FFFFFF';
                  textColor = '#040711';
                  strokeWidth = 5;
                }

                return (
                  <g
                    key={`${letter}-${r}-${c}`}
                    onClick={() => setSelectedLetter(letter)}
                    className="cursor-pointer transition-transform duration-300 hover:scale-105"
                  >
                    <polygon
                      points={getHexagonPoints(cx, cy, hexRadius)}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                    />

                    <text
                      x={cx}
                      y={cy + 3}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="26"
                      fontWeight="900"
                      fontFamily="Alexandria, sans-serif"
                      fill={textColor}
                      className="select-none font-black"
                    >
                      {letter}
                    </text>
                  </g>
                );
              });
            })}
          </svg>
        </div>

        {/* Team Score Bar */}
        <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-slate-300 mt-2">
          <div className="flex items-center gap-2 text-pink-400">
            <span className="w-3 h-3 rounded-full bg-[#FF007F] shadow-[0_0_8px_rgba(255,0,127,0.8)]" />
            <span>الفريق الوردي: {teamPinkCells.size} خلايا</span>
          </div>

          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-3 h-3 rounded-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            <span>الفريق الأزرق: {teamBlueCells.size} خلايا</span>
          </div>
        </div>
      </div>

      {/* Left Panel: Question Display & Team Claim Controls */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-3 p-4 sm:p-5 rounded-3xl glass-arena-glow border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(0,102,255,0.35)] w-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>سؤال الحرف الحالي</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-extrabold border border-cyan-400/40">
              حرف: ({selectedLetter})
            </span>
          </div>

          {/* Selected Letter Badge */}
          <div className="flex items-center justify-center gap-3 my-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-[0_0_25px_rgba(0,240,255,0.9)] animate-pulse">
              {selectedLetter}
            </div>
            <span className="text-xs text-cyan-300 font-black">اضغط أي حرف لتغيير السؤال</span>
          </div>

          {/* Question Title Display */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-blue-950/90 border-2 border-cyan-400/40 text-center flex flex-col gap-2 relative shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <h3 className="text-base sm:text-lg font-black text-white leading-relaxed mt-1">
              {currentQuestionData?.title || `سؤال بحرف (${selectedLetter})`}
            </h3>

            {/* Fetch Another Question for Same Letter */}
            <button
              onClick={handleFetchNextQuestion}
              className="mt-2 self-center px-4 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
              <span>سؤال آخر لهذا الحرف</span>
            </button>
          </div>

          {/* Model Answer Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border-2 border-emerald-500/50 text-center flex flex-col gap-0.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">الإجابة النموذجية:</span>
            <p className="text-base font-black text-emerald-300">
              {isAnswerRevealed ? (currentQuestionData?.acceptableAnswers.join(' / ') || 'لا يوجد') : '•••••••••••••••••••••'}
            </p>
          </div>
        </div>

        {/* Team Claim Action Buttons (Pink & Blue) */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10">
          <span className="text-xs text-slate-300 font-bold text-center">حسم الخلية ({selectedLetter}) للفائز:</span>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Pink Team Button */}
            <button
              onClick={() => handleClaimPink(selectedLetter)}
              className="py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-black text-xs shadow-[0_0_15px_rgba(255,0,127,0.6)] border border-white transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Shield className="w-4 h-4 text-pink-200" />
              <span>الفريق الوردي 🌸</span>
            </button>

            {/* Blue Team Button */}
            <button
              onClick={() => handleClaimBlue(selectedLetter)}
              className="py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(0,240,255,0.6)] border border-white transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Shield className="w-4 h-4 text-slate-950" />
              <span>الفريق الأزرق 🔷</span>
            </button>
          </div>

          <button
            onClick={() => handleResetCell(selectedLetter)}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>إلغاء حسم الخلية ({selectedLetter})</span>
          </button>
        </div>
      </div>

      {/* Victory Modal Overlay when a team completes a line */}
      {winnerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border-4 border-amber-400 shadow-[0_0_60px_rgba(255,215,0,0.6)] text-center flex flex-col items-center gap-4 relative">
            <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {winnerModal.team === 'pink' ? '🌸 فوز الفريق الوردي! 🌸' : '🔷 فوز الفريق الأزرق! 🔷'}
            </h2>

            <p className="text-sm font-bold text-amber-300">
              تم إكمال خط متصل ({winnerModal.lineType}) وربط الشبكة بنجاح!
            </p>

            <button
              onClick={() => setWinnerModal(null)}
              className="mt-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              متابعة اللعب
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
