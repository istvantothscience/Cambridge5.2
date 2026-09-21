import React, { useState, useEffect } from 'react';
import { PROCESS_STEPS } from '../../data/lessonData';
import { ProcessStep, Student } from '../../types';
import { realtime } from '../../lib/socketClient';
import { sounds, fireConfetti } from '../../lib/confetti';
import { ListOrdered, ArrowUp, ArrowDown, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface Slide6TaskOrderProcessProps {
  isTeacher: boolean;
  students: Student[];
  currentStudent: Student | null;
  savedAnswer?: any;
  isLocked: boolean;
}

export const Slide6TaskOrderProcess: React.FC<Slide6TaskOrderProcessProps> = ({
  isTeacher,
  students,
  currentStudent,
  savedAnswer,
  isLocked,
}) => {
  // Scrambled initial order
  const getInitialOrder = () => {
    return [
      PROCESS_STEPS[2], // fertilisation
      PROCESS_STEPS[0], // pollen lands on stigma
      PROCESS_STEPS[3], // petals wither & ovary becomes fruit
      PROCESS_STEPS[1], // tube grows down style
    ];
  };

  const [items, setItems] = useState<ProcessStep[]>(getInitialOrder);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!savedAnswer?.submitted);
  const [scoreEarned, setScoreEarned] = useState<number>(savedAnswer?.scoreEarned || 0);

  useEffect(() => {
    if (savedAnswer?.itemIds) {
      const restored = savedAnswer.itemIds
        .map((id: string) => PROCESS_STEPS.find((p) => p.id === id))
        .filter(Boolean);
      if (restored.length === PROCESS_STEPS.length) {
        setItems(restored);
      }
      setIsSubmitted(!!savedAnswer.submitted);
      setScoreEarned(savedAnswer.scoreEarned || 0);
    }
  }, [savedAnswer]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isSubmitted || isTeacher || isLocked) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    sounds.playPoint();
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const handleCheckOrder = () => {
    if (isSubmitted || isTeacher || isLocked) return;

    // Check how many are in their exact correct position
    let matches = 0;
    items.forEach((item, idx) => {
      if (item.correctOrder === idx + 1) {
        matches++;
      }
    });

    // 1 point if all 4 steps are in correct order
    const points = matches === 4 ? 1 : 0;
    setScoreEarned(points);
    setIsSubmitted(true);

    if (matches === 4) {
      sounds.playSuccess();
      fireConfetti(60, 80);
    } else {
      sounds.playPoint();
    }

    realtime.submitAnswer(
      'slide-6-task-order-process',
      6,
      {
        itemIds: items.map((i) => i.id),
        matches,
        scoreEarned: points,
        submitted: true,
      },
      points
    );
  };

  const handleReset = () => {
    if (isTeacher || isLocked) return;
    setItems(getInitialOrder());
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ListOrdered size={13} /> 3. feladat • Folyamat sorrendje (1 pont)
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
            Put the reproduction process in order!
          </h2>
        </div>

        {!isSubmitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
          >
            <RotateCcw size={14} /> Reset Scramble
          </button>
        )}
      </div>

      <p className="text-slate-600 text-sm">
        Use the <strong>Up (▲)</strong> and <strong>Down (▼)</strong> arrows on each card to arrange the 4 stages from the beginning (Step 1) to final seed &amp; fruit development (Step 4).
      </p>

      {/* Reordering Cards List */}
      {!isTeacher && (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isCorrectPosition = isSubmitted ? item.correctOrder === index + 1 : null;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                  isSubmitted
                    ? isCorrectPosition
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-xs'
                      : 'bg-rose-50/80 border-rose-400'
                    : 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Step Number Badge */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-heading font-bold text-lg shrink-0 ${
                      isSubmitted
                        ? isCorrectPosition
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <span className="text-3xl shrink-0 select-none">{item.icon}</span>

                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                      {item.detail}
                    </p>
                  </div>
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  {!isSubmitted ? (
                    <>
                      <button
                        disabled={index === 0 || isLocked}
                        onClick={() => moveItem(index, 'up')}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 hover:text-emerald-800 transition-all cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button
                        disabled={index === items.length - 1 || isLocked}
                        onClick={() => moveItem(index, 'down')}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 hover:text-emerald-800 transition-all cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={18} />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border">
                      {isCorrectPosition ? '✓ Correct Step' : `Needs Step ${item.correctOrder}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Action Button */}
          {!isSubmitted ? (
            <button
              disabled={isLocked}
              onClick={handleCheckOrder}
              className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <CheckCircle2 size={18} />
              <span>Check My Process Order (+4 Pts)</span>
            </button>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-950 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Sparkles className="text-amber-600" />
                <span>Sequence checked! You earned +{scoreEarned} Gardener Points!</span>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-bold hover:bg-emerald-100 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Teacher Monitoring Panel */}
      {isTeacher && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Live Sequencing Task Submissions
            </h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              Full Order = 4 Pts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {students.map((s) => {
              const ans = s.answers['slide-6-task-order-process']?.data;
              const hasSubmitted = !!ans?.submitted;
              const matches = ans?.matches || 0;
              const pts = ans?.scoreEarned || 0;

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
                        +{pts} Pts ({matches}/4 steps)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Sequencing...</span>
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
