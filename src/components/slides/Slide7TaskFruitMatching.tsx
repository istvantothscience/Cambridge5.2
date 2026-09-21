import React, { useState, useEffect } from 'react';
import { SEED_FRUIT_ITEMS, FRUIT_CATEGORIES } from '../../data/lessonData';
import { SeedFruitItem, Student } from '../../types';
import { realtime } from '../../lib/socketClient';
import { sounds, fireConfetti } from '../../lib/confetti';
import { Apple, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface Slide7TaskFruitMatchingProps {
  isTeacher: boolean;
  students: Student[];
  currentStudent: Student | null;
  savedAnswer?: any;
  isLocked: boolean;
}

export const Slide7TaskFruitMatching: React.FC<Slide7TaskFruitMatchingProps> = ({
  isTeacher,
  students,
  currentStudent,
  savedAnswer,
  isLocked,
}) => {
  // Mapping of plantId -> chosen fruitCategory
  const [matches, setMatches] = useState<Record<string, string>>(savedAnswer?.matches || {});
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!savedAnswer?.submitted);

  useEffect(() => {
    if (savedAnswer?.matches) {
      setMatches(savedAnswer.matches);
      setIsSubmitted(!!savedAnswer.submitted);
    }
  }, [savedAnswer]);

  const handleSelectPlant = (id: string) => {
    if (isSubmitted || isTeacher || isLocked) return;
    setSelectedPlantId(id === selectedPlantId ? null : id);
  };

  const handleSelectCategory = (categoryName: string) => {
    if (isSubmitted || isTeacher || isLocked || !selectedPlantId) return;

    sounds.playPoint();
    setMatches((prev) => ({
      ...prev,
      [selectedPlantId]: categoryName,
    }));
    setSelectedPlantId(null);
  };

  const handleCheck = () => {
    if (isSubmitted || isTeacher || isLocked) return;

    let correctCount = 0;
    SEED_FRUIT_ITEMS.forEach((item) => {
      if (matches[item.id] === item.fruitCategory) {
        correctCount++;
      }
    });

    setIsSubmitted(true);

    const scoreEarned = correctCount >= 5 ? 1 : 0;

    if (correctCount === SEED_FRUIT_ITEMS.length) {
      sounds.playSuccess();
      fireConfetti(60, 80);
    } else {
      sounds.playPoint();
    }

    realtime.submitAnswer(
      'slide-7-task-fruit-matching',
      7,
      {
        matches,
        correctCount,
        submitted: true,
      },
      scoreEarned
    );
  };

  const handleReset = () => {
    if (isTeacher || isLocked) return;
    setMatches({});
    setSelectedPlantId(null);
    setIsSubmitted(false);
  };

  const allAssigned = SEED_FRUIT_ITEMS.every((item) => !!matches[item.id]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Apple size={13} /> 4. feladat • Termés és mag párosítás (1 pont)
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
            Where does the seed come from?
          </h2>
        </div>

        {!isSubmitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
          >
            <RotateCcw size={14} /> Clear Choices
          </button>
        )}
      </div>

      <p className="text-slate-600 text-sm">
        Every seed develops inside a specific type of fruit or protective container. Tap a plant on the left, then tap its matching fruit category on the right!
      </p>

      {/* Main Matching Grid */}
      {!isTeacher && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: 7 Plant Cards (7 cols) */}
            <div className="lg:col-span-7 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                1. Select Plant Specimen:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SEED_FRUIT_ITEMS.map((item) => {
                  const isSelected = selectedPlantId === item.id;
                  const assignedCategory = matches[item.id];
                  const isCorrect = isSubmitted ? assignedCategory === item.fruitCategory : null;

                  return (
                    <button
                      key={item.id}
                      disabled={isSubmitted || isLocked}
                      onClick={() => handleSelectPlant(item.id)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSubmitted
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                            : 'bg-rose-50 border-rose-400'
                          : isSelected
                          ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-2 ring-emerald-400 scale-[1.02]'
                          : assignedCategory
                          ? 'bg-white border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-3xl select-none">{item.emoji}</span>
                        {assignedCategory && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-500 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {assignedCategory}
                          </span>
                        )}
                      </div>

                      <div className="mt-2">
                        <strong className="font-heading font-bold text-slate-800 text-sm block">
                          {item.plantName}
                        </strong>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Fruit Categories Target Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                2. Match to Fruit Container Type:
              </span>

              <div className="space-y-2">
                {FRUIT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.category}
                    disabled={isSubmitted || isLocked || !selectedPlantId}
                    onClick={() => handleSelectCategory(cat.category)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                      selectedPlantId
                        ? 'bg-white hover:bg-emerald-50 border-emerald-300 hover:border-emerald-600 hover:scale-[1.02] cursor-pointer shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-80 cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl select-none">{cat.icon}</span>
                      <div>
                        <div className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                          {cat.label}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected instruction helper */}
              {selectedPlantId && (
                <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-950 animate-fade-in flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-700 shrink-0" />
                  <span>
                    Matching <strong>{SEED_FRUIT_ITEMS.find((p) => p.id === selectedPlantId)?.plantName}</strong>: now tap its fruit type above!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submission and Results Box */}
          {!isSubmitted ? (
            <div className="pt-2">
              <button
                disabled={!allAssigned || isLocked}
                onClick={handleCheck}
                className={`w-full py-4 rounded-2xl font-heading font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  allAssigned
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white hover:scale-[1.01]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 size={18} />
                <span>Párosítások ellenőrzése / Check Fruit Matches</span>
              </button>
              {!allAssigned && (
                <p className="text-xs text-slate-400 text-center mt-2">
                  Párosítsd mind a 7 növényt az ellenőrzés előtt! / Match all 7 plants before checking.
                </p>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-3 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-heading font-bold text-lg">
                    Eredmény: {SEED_FRUIT_ITEMS.filter((i) => matches[i.id] === i.fruitCategory).length} / 7 helyes
                  </div>
                  <div className="pt-0.5">
                    {SEED_FRUIT_ITEMS.filter((i) => matches[i.id] === i.fruitCategory).length >= 5 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        ✓ Sikerült! 1 pont megszerezve a 4. feladatra 🌱
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                        Nem sikerült (legalább 5 helyes szükséges a ponthoz).
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold hover:bg-emerald-100 cursor-pointer text-slate-700"
                  >
                    Újrapróbálás
                  </button>
                  <button
                    onClick={() => realtime.nextSlide()}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Következő: Kilépőcédula</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {SEED_FRUIT_ITEMS.map((item) => (
                  <div key={item.id} className="p-2 bg-white/80 rounded-xl border border-emerald-100">
                    <span className="font-bold text-slate-800">{item.plantName}:</span>{' '}
                    <span className="text-emerald-800 font-semibold">{item.fruitType}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Teacher Monitoring Panel */}
      {isTeacher && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Live Seed &amp; Fruit Matching Submissions
            </h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              7 Points Max
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {students.map((s) => {
              const ans = s.answers['slide-7-task-fruit-matching']?.data;
              const hasSubmitted = !!ans?.submitted;
              const score = ans?.correctCount || 0;

              return (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-xl border ${
                    hasSubmitted ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <span>{s.avatar}</span> {s.name}
                    </span>
                    {hasSubmitted ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-700 text-white">
                        {score}/7 Correct
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Matching...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
