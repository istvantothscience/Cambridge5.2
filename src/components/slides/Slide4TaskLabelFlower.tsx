import React, { useState, useEffect } from 'react';
import { FLOWER_PARTS } from '../../data/lessonData';
import { Student } from '../../types';
import { realtime } from '../../lib/socketClient';
import { sounds, fireConfetti } from '../../lib/confetti';
import { Tag, Sparkles, CheckCircle2, Clock, RotateCcw, Award } from 'lucide-react';

interface Slide4TaskLabelFlowerProps {
  isTeacher: boolean;
  students: Student[];
  currentStudent: Student | null;
  savedAnswer?: any;
  isLocked: boolean;
}

export const Slide4TaskLabelFlower: React.FC<Slide4TaskLabelFlowerProps> = ({
  isTeacher,
  students,
  currentStudent,
  savedAnswer,
  isLocked,
}) => {
  // Mapping of target part id -> placed label name
  const [placements, setPlacements] = useState<Record<string, string>>(
    savedAnswer?.placements || {}
  );
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!savedAnswer?.submitted);
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(savedAnswer?.timeTaken || 0);

  // Timer while not submitted
  useEffect(() => {
    if (isSubmitted || isTeacher) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, isTeacher, startTime]);

  useEffect(() => {
    if (savedAnswer?.placements) {
      setPlacements(savedAnswer.placements);
      setIsSubmitted(!!savedAnswer.submitted);
      if (savedAnswer.timeTaken) setElapsedSeconds(savedAnswer.timeTaken);
    }
  }, [savedAnswer]);

  const allWords = FLOWER_PARTS.map((p) => p.name);
  const placedWords = Object.values(placements);
  const availableWords = allWords.filter((w) => !placedWords.includes(w));

  const handlePlaceWord = (targetPartId: string) => {
    if (isSubmitted || isTeacher || isLocked) return;

    if (selectedWord) {
      setPlacements((prev) => ({
        ...prev,
        [targetPartId]: selectedWord,
      }));
      sounds.playPoint();
      setSelectedWord(null);
    } else if (placements[targetPartId]) {
      // Remove word back to pool
      const updated = { ...placements };
      delete updated[targetPartId];
      setPlacements(updated);
    }
  };

  const handleCheckAnswers = () => {
    if (isSubmitted || isTeacher || isLocked) return;

    let correctCount = 0;
    FLOWER_PARTS.forEach((p) => {
      if (placements[p.id] === p.name) {
        correctCount++;
      }
    });

    // Award 1 point if at least 5 parts are correctly labeled
    const totalEarned = correctCount >= 5 ? 1 : 0;

    setIsSubmitted(true);

    if (correctCount === FLOWER_PARTS.length) {
      sounds.playSuccess();
      fireConfetti(60, 80);
    } else {
      sounds.playPoint();
    }

    realtime.submitAnswer(
      'slide-4-task-label-flower',
      4,
      {
        placements,
        correctCount,
        timeTaken: elapsedSeconds,
        submitted: true,
      },
      totalEarned
    );
  };

  const handleReset = () => {
    if (isTeacher || isLocked) return;
    setPlacements({});
    setSelectedWord(null);
    setIsSubmitted(false);
  };

  const allTargetsFilled = FLOWER_PARTS.every((p) => !!placements[p.id]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Tag size={13} /> 2. feladat • A virág felépítése (1 pont)
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
            Label the parts of the flower
          </h2>
        </div>

        {/* Stopwatch & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700">
            <Clock size={14} className="text-slate-500" />
            <span>Idő: {elapsedSeconds}s</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
              title="Reset labels"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Student Activity Area */}
      {!isTeacher && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Diagram with Target Dropzones (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-emerald-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                1. Select a word below, then tap the matching box on the flower:
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {Object.keys(placements).length} of {FLOWER_PARTS.length} Labeled
              </span>
            </div>

            <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-amber-50/40 via-emerald-50/20 to-emerald-100/30 rounded-2xl border border-emerald-100 overflow-hidden flex items-center justify-center p-2">
              {/* Botanical SVG Background */}
              <svg viewBox="0 0 500 380" className="w-full h-full select-none">
                <path d="M 235 340 L 265 340 L 260 380 L 240 380 Z" fill="#2d6a4f" />
                <ellipse cx="250" cy="335" rx="35" ry="14" fill="#40916c" />
                {/* Sepals */}
                <path d="M 215 330 C 170 340, 130 320, 140 290 C 170 310, 200 320, 225 328 Z" fill="#52b788" stroke="#2d6a4f" strokeWidth="2" />
                <path d="M 285 330 C 330 340, 370 320, 360 290 C 330 310, 300 320, 275 328 Z" fill="#52b788" stroke="#2d6a4f" strokeWidth="2" />
                {/* Petals */}
                <path d="M 215 315 C 120 280, 60 180, 110 110 C 160 150, 190 220, 215 285 Z" fill="#fda4af" stroke="#e11d48" strokeWidth="2" />
                <path d="M 285 315 C 380 280, 440 180, 390 110 C 340 150, 310 220, 285 285 Z" fill="#fda4af" stroke="#e11d48" strokeWidth="2" />
                {/* Female Carpel */}
                <ellipse cx="250" cy="290" rx="38" ry="42" fill="#86efac" stroke="#15803d" strokeWidth="2.5" />
                <path d="M 243 252 L 243 130 L 257 130 L 257 252 Z" fill="#86efac" stroke="#15803d" strokeWidth="2" />
                <path d="M 235 125 C 230 105, 245 95, 250 102 C 255 95, 270 105, 265 125 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
                {/* Stamens */}
                <path d="M 230 300 Q 170 240 180 160" fill="none" stroke="#d97706" strokeWidth="3" />
                <ellipse cx="180" cy="150" rx="16" ry="10" fill="#fbbf24" stroke="#b45309" strokeWidth="2" transform="rotate(-20 180 150)" />
                <path d="M 270 300 Q 330 240 320 160" fill="none" stroke="#d97706" strokeWidth="3" />
                <ellipse cx="320" cy="150" rx="16" ry="10" fill="#fbbf24" stroke="#b45309" strokeWidth="2" transform="rotate(20 320 150)" />
              </svg>

              {/* Target Drop/Click Zones */}
              <div className="absolute inset-0 pointer-events-auto">
                {FLOWER_PARTS.map((p) => {
                  const placed = placements[p.id];
                  const isCorrect = isSubmitted ? placed === p.name : null;

                  return (
                    <button
                      key={p.id}
                      disabled={isSubmitted || isLocked}
                      onClick={() => handlePlaceWord(p.id)}
                      style={{ left: `${p.targetX}%`, top: `${p.targetY}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer border-2 ${
                        isSubmitted
                          ? isCorrect
                            ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300'
                            : 'bg-rose-500 text-white border-rose-600'
                          : placed
                          ? 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
                          : selectedWord
                          ? 'bg-white border-emerald-500 text-emerald-800 animate-pulse ring-2 ring-emerald-300'
                          : 'bg-white/90 border-dashed border-slate-400 text-slate-500 hover:border-emerald-400'
                      }`}
                    >
                      <span>{placed || `[ ? ${p.name.length} letters ]`}</span>
                      {isSubmitted && (
                        <span>{isCorrect ? '✓' : '✗'}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Word Bank & Submit Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-emerald-200 p-6 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Word Bank (Tap to select)
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mt-0.5">
                Flower Parts
              </h3>
            </div>

            {/* Word Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {allWords.map((word) => {
                const isUsed = placedWords.includes(word);
                const isSelected = selectedWord === word;

                return (
                  <button
                    key={word}
                    disabled={isSubmitted || isLocked || isUsed}
                    onClick={() => setSelectedWord(isSelected ? null : word)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400 scale-105'
                        : isUsed
                        ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed opacity-60'
                        : 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 border-emerald-300 hover:scale-102'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {selectedWord && (
              <div className="p-2.5 bg-emerald-100 rounded-xl text-xs text-emerald-900 font-semibold animate-fade-in flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-700 shrink-0" />
                <span>Selected: <strong>{selectedWord}</strong>. Now tap the matching box on the diagram!</span>
              </div>
            )}

            {/* Check Button */}
            {!isSubmitted ? (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  disabled={!allTargetsFilled || isLocked}
                  onClick={handleCheckAnswers}
                  className={`w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    allTargetsFilled
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white hover:scale-[1.02]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  <span>Check Flower Labels</span>
                </button>
                {!allTargetsFilled && (
                  <p className="text-[11px] text-slate-400 text-center">
                    Place all 7 labels on the diagram before checking.
                  </p>
                )}
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 space-y-3 animate-fade-in">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-center space-y-1">
                  <div className="font-heading font-bold text-emerald-950 text-base">
                    Score: {FLOWER_PARTS.filter((p) => placements[p.id] === p.name).length} / 7
                  </div>
                  {elapsedSeconds <= 45 && FLOWER_PARTS.filter((p) => placements[p.id] === p.name).length >= 5 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200 text-amber-950 border border-amber-400">
                      ⚡ +2 Speed Bonus Earned!
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-600 space-y-1">
                  <strong>Correct Key:</strong>
                  {FLOWER_PARTS.map((p) => (
                    <div key={p.id} className="flex justify-between border-b border-slate-100 py-0.5">
                      <span className="text-slate-500">{p.systemName}:</span>
                      <span className="font-bold text-emerald-900">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Teacher Monitoring Panel */}
      {isTeacher && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Flower Labeling Live Class Submissions
              </h3>
              <p className="text-xs text-slate-500">
                Track labeling accuracy and speed bonuses in real time.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
              <Award size={14} /> Speed Bonus: Under 45s
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {students.map((s) => {
              const ans = s.answers['slide-4-task-label-flower']?.data;
              const hasSubmitted = !!ans?.submitted;
              const correctCount = ans?.correctCount || 0;
              const time = ans?.timeTaken || 0;
              const gotSpeed = !!ans?.gotSpeedBonus;

              return (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    hasSubmitted
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      <span>{s.avatar}</span>
                      <span>{s.name}</span>
                    </div>
                    {hasSubmitted ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                        {correctCount}/7 Pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Working...</span>
                    )}
                  </div>

                  {hasSubmitted && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                      <span>Time: {time}s</span>
                      {gotSpeed && (
                        <span className="font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          ⚡ Speed Bonus!
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
