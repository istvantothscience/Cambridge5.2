import React, { useState, useEffect } from 'react';
import { TASK_1_PLANTS } from '../../data/lessonData';
import { Student } from '../../types';
import { realtime } from '../../lib/socketClient';
import { sounds, fireConfetti } from '../../lib/confetti';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle, Sparkles, Award } from 'lucide-react';

interface Slide2TaskFlowerOrNotProps {
  isTeacher: boolean;
  students: Student[];
  currentStudent: Student | null;
  savedAnswer?: any;
  isLocked: boolean;
}

export const Slide2TaskFlowerOrNot: React.FC<Slide2TaskFlowerOrNotProps> = ({
  isTeacher,
  students,
  currentStudent,
  savedAnswer,
  isLocked,
}) => {
  // State for student answering: list of answers so far
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, { choice: boolean; isCorrect: boolean }>>(
    savedAnswer?.answers || {}
  );
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  useEffect(() => {
    if (savedAnswer?.answers) {
      setUserAnswers(savedAnswer.answers);
      // If student previously answered some, advance to next or last
      const answeredCount = Object.keys(savedAnswer.answers).length;
      if (answeredCount < TASK_1_PLANTS.length) {
        setCurrentIndex(answeredCount);
      } else {
        setCurrentIndex(TASK_1_PLANTS.length - 1);
      }
    }
  }, [savedAnswer]);

  const currentPlant = TASK_1_PLANTS[currentIndex];
  const isFinished = Object.keys(userAnswers).length === TASK_1_PLANTS.length;
  const currentPlantAnswered = userAnswers[currentPlant?.id] !== undefined;

  // Calculate score
  const correctCount = Object.values(userAnswers).filter(
    (a: { choice: boolean; isCorrect: boolean }) => a.isCorrect
  ).length;

  const handleChoice = (hasFlowerChoice: boolean) => {
    if (isTeacher || isLocked || currentPlantAnswered) return;

    const isCorrect = hasFlowerChoice === currentPlant.hasFlower;
    const newAnswers = {
      ...userAnswers,
      [currentPlant.id]: { choice: hasFlowerChoice, isCorrect },
    };
    setUserAnswers(newAnswers);

    if (isCorrect) {
      sounds.playSuccess();
      fireConfetti(25, 45);
      setFeedback({
        isCorrect: true,
        text: `Correct! ${currentPlant.explanation}`,
      });
    } else {
      sounds.playIncorrect();
      setFeedback({
        isCorrect: false,
        text: `Not quite! ${currentPlant.explanation}`,
      });
    }

    // Submit updated answer to server: 1 point earned if at least 6 are correct
    const correctTotal = Object.values(newAnswers).filter(
      (a: { choice: boolean; isCorrect: boolean }) => a.isCorrect
    ).length;
    const newScore = correctTotal >= 6 ? 1 : 0;
    realtime.submitAnswer('slide-2-task-flower-or-not', 2, { answers: newAnswers }, newScore);
  };

  const handleNextPlant = () => {
    setFeedback(null);
    if (currentIndex < TASK_1_PLANTS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Sparkles size={13} /> 1. feladat • Kategorizálás (1 pont)
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
            Does it have a flower?
          </h2>
        </div>

        {/* Progress pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {TASK_1_PLANTS.map((p, idx) => {
              const ans = userAnswers[p.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={p.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'ring-2 ring-emerald-600 scale-110 font-extrabold z-10'
                      : ''
                  } ${
                    ans
                      ? ans.isCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                  title={`${p.commonName} (${ans ? (ans.isCorrect ? 'Correct' : 'Incorrect') : 'Not answered yet'})`}
                >
                  {ans ? (ans.isCorrect ? '✓' : '✗') : idx + 1}
                </button>
              );
            })}
          </div>

          <div className="ml-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-900">
            {correctCount} / {TASK_1_PLANTS.length} helyes
          </div>
        </div>
      </div>

      {/* Main Task Card */}
      {!isTeacher && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Plant {currentIndex + 1} of {TASK_1_PLANTS.length}
            </span>

            {/* Visual presentation of plant */}
            <div className="w-36 h-36 mx-auto rounded-3xl bg-gradient-to-b from-emerald-50 to-amber-50 border-2 border-emerald-200 flex items-center justify-center text-7xl shadow-inner select-none transition-transform hover:scale-105">
              {currentPlant.imageEmoji}
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold text-slate-900">
                {currentPlant.commonName}
              </h3>
              <p className="text-xs text-slate-500 italic font-mono mt-0.5">
                {currentPlant.scientificGroup}
              </p>
            </div>
          </div>

          {/* Interactive Choices Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              disabled={currentPlantAnswered || isLocked}
              onClick={() => handleChoice(true)}
              className={`p-5 rounded-2xl border-2 font-heading font-bold text-lg flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs ${
                currentPlantAnswered && userAnswers[currentPlant.id].choice === true
                  ? currentPlant.hasFlower
                    ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400'
                    : 'bg-rose-500 text-white border-rose-600'
                  : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border-emerald-300 hover:border-emerald-500 hover:scale-[1.02]'
              } ${currentPlantAnswered || isLocked ? 'opacity-80' : ''}`}
            >
              <span className="text-2xl">🌸</span>
              <span>Has a Flower</span>
            </button>

            <button
              disabled={currentPlantAnswered || isLocked}
              onClick={() => handleChoice(false)}
              className={`p-5 rounded-2xl border-2 font-heading font-bold text-lg flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs ${
                currentPlantAnswered && userAnswers[currentPlant.id].choice === false
                  ? !currentPlant.hasFlower
                    ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400'
                    : 'bg-rose-500 text-white border-rose-600'
                  : 'bg-amber-50 hover:bg-amber-100/80 text-amber-950 border-amber-300 hover:border-amber-500 hover:scale-[1.02]'
              } ${currentPlantAnswered || isLocked ? 'opacity-80' : ''}`}
            >
              <span className="text-2xl">🌲</span>
              <span>No Flower</span>
            </button>
          </div>

          {/* Feedback & Explanation Box */}
          {currentPlantAnswered && (
            <div
              className={`p-4 rounded-2xl border transition-all animate-fade-in space-y-2 ${
                userAnswers[currentPlant.id].isCorrect
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {userAnswers[currentPlant.id].isCorrect ? (
                    <>
                      <CheckCircle2 size={18} className="text-emerald-700" />
                      <span>Spot on! +1 Gardener Point</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={18} className="text-amber-700" />
                      <span>Good attempt! Let's examine the science:</span>
                    </>
                  )}
                </div>

                {currentIndex < TASK_1_PLANTS.length - 1 && (
                  <button
                    onClick={handleNextPlant}
                    className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Next Plant</span>
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>

              <p className="text-xs leading-relaxed text-slate-700">
                {currentPlant.explanation}
              </p>
              <div className="text-[11px] font-semibold text-emerald-800 bg-white/70 p-2 rounded-lg border border-emerald-200">
                💡 <em>Curriculum Fact:</em> {currentPlant.curriculumFact}
              </div>
            </div>
          )}

          {/* Completion Celebration */}
          {isFinished && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-100 to-amber-100 border border-emerald-300 text-center space-y-3 animate-fade-in">
              <Award className="mx-auto text-amber-600" size={32} />
              <div className="font-heading font-bold text-lg text-emerald-950">
                1. Feladat befejezve! Eredmény: {correctCount} / {TASK_1_PLANTS.length} helyes
              </div>
              <p className="text-sm font-semibold text-emerald-800">
                {correctCount >= 6 ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
                    ✓ Sikerült! 1 pont megszerezve az 1. feladatra 🌱
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                    Nem sikerült (legalább 6 helyes válasz szükséges a ponthoz). Próbáld újra!
                  </span>
                )}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setCurrentIndex(0);
                    setFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-50 cursor-pointer transition-all"
                >
                  Újrapróbálás
                </button>
                <button
                  onClick={() => realtime.nextSlide()}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <span>Következő dia: A virág anatómiája</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Teacher Monitoring Panel */}
      {isTeacher && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Live Class Performance on Task 1
              </h3>
              <p className="text-xs text-slate-500">
                Real-time answers across all 8 plant specimens.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              {students.length} Students Monitored
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TASK_1_PLANTS.map((p, idx) => {
              // Calculate accuracy for this plant
              let plantAttempts = 0;
              let plantCorrect = 0;
              students.forEach((s) => {
                const ans = s.answers['slide-2-task-flower-or-not']?.data?.answers?.[p.id];
                if (ans) {
                  plantAttempts++;
                  if (ans.isCorrect) plantCorrect++;
                }
              });

              const accuracy = plantAttempts > 0 ? Math.round((plantCorrect / plantAttempts) * 100) : 0;

              return (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-xl">{p.imageEmoji}</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      accuracy >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {plantAttempts > 0 ? `${accuracy}%` : 'Waiting'}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-800 truncate" title={p.commonName}>
                    {p.commonName.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {p.hasFlower ? '🌸 Has flower' : '🌲 No flower'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Leaderboard for Task 1 */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <span className="text-xs font-bold text-slate-700">Student Progress & Scores:</span>
            <div className="flex flex-wrap gap-2">
              {students.map((s) => {
                const ans = s.answers['slide-2-task-flower-or-not']?.data?.answers || {};
                const score = Object.values(ans).filter((a: any) => a.isCorrect).length;
                const totalAnswered = Object.keys(ans).length;

                return (
                  <div
                    key={s.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2"
                  >
                    <span>{s.avatar}</span>
                    <span className="font-bold text-slate-800">{s.name}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {score}/{TASK_1_PLANTS.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
