import React, { useEffect } from 'react';
import { Student } from '../../types';
import { PointBadge } from '../common/PointBadge';
import { fireGrandCelebration } from '../../lib/confetti';
import { Trophy, Sprout, Award, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { realtime } from '../../lib/socketClient';

interface Slide9FinalSummaryProps {
  isTeacher: boolean;
  students: Student[];
  currentStudent: Student | null;
}

export const Slide9FinalSummary: React.FC<Slide9FinalSummaryProps> = ({
  isTeacher,
  students,
  currentStudent,
}) => {
  useEffect(() => {
    fireGrandCelebration();
  }, []);

  // Compute student results
  const lessonPts = currentStudent?.lessonPoints || 0;
  const totalPts = currentStudent?.points || 0;

  // Determine Badge Level on 5-point scale
  const getBadgeTitle = (pts: number) => {
    if (pts >= 5) return { title: 'Master Cambridge Botanist 🌱🌟 (5/5 pont)', color: 'text-amber-800 bg-amber-100 border-amber-300' };
    if (pts >= 4) return { title: 'Expert Flora Explorer 🌿 (4/5 pont)', color: 'text-emerald-800 bg-emerald-100 border-emerald-300' };
    if (pts >= 3) return { title: 'Junior Seed Detective 🔍 (3/5 pont)', color: 'text-lime-800 bg-lime-100 border-lime-300' };
    return { title: 'Budding Plant Explorer 🌸', color: 'text-teal-800 bg-teal-100 border-teal-300' };
  };

  const badge = getBadgeTitle(totalPts);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
          <Trophy size={16} className="text-amber-600" />
          Lesson 2 Complete • Cambridge Primary Science
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-emerald-950 tracking-tight">
          Congratulations, Young Botanists!
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
          You've explored flowering vs. non-flowering plants, decoded flower anatomy, followed the journey to fertilisation, and matched amazing seeds and fruits!
        </p>
      </div>

      {/* Student Personal Certificate Card (shown if student) */}
      {!isTeacher && currentStudent && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-sm space-y-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-600 to-amber-500 text-white flex items-center justify-center text-4xl shadow-md">
              {currentStudent.avatar || '🌱'}
            </div>
            <h2 className="text-2xl font-heading font-bold text-slate-900">
              {currentStudent.name}
            </h2>
            <div className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
              {badge.title}
            </div>
          </div>

          {/* Points Highlight Cards */}
          <div className="max-w-xs mx-auto">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Összesített pontszám
              </span>
              <div className="font-heading font-bold text-3xl sm:text-4xl text-emerald-900">
                {totalPts} / 5
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">
                pont a tanórán
              </span>
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="pt-4 border-t border-slate-100 max-w-lg mx-auto text-left space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Feladatok eredménye (összesen max. 5 pont):
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">🌱 1. feladat: Virágos növények</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${currentStudent.answers['slide-2-task-flower-or-not']?.scoreEarned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {currentStudent.answers['slide-2-task-flower-or-not']?.scoreEarned ? '✓ 1 / 1 pont' : '✗ 0 / 1 pont'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">🏷️ 2. feladat: A virág részei</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${currentStudent.answers['slide-4-task-label-flower']?.scoreEarned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {currentStudent.answers['slide-4-task-label-flower']?.scoreEarned ? '✓ 1 / 1 pont' : '✗ 0 / 1 pont'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">🔢 3. feladat: Szaporodási folyamat sorrendje</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${currentStudent.answers['slide-6-task-order-process']?.scoreEarned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {currentStudent.answers['slide-6-task-order-process']?.scoreEarned ? '✓ 1 / 1 pont' : '✗ 0 / 1 pont'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">🍎 4. feladat: Termés és mag párosítás</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${currentStudent.answers['slide-7-task-fruit-matching']?.scoreEarned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {currentStudent.answers['slide-7-task-fruit-matching']?.scoreEarned ? '✓ 1 / 1 pont' : '✗ 0 / 1 pont'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">🎓 5. feladat: Kilépőcédula ellenőrzés</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${currentStudent.answers['slide-8-exit-ticket']?.scoreEarned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {currentStudent.answers['slide-8-exit-ticket']?.scoreEarned ? '✓ 1 / 1 pont' : '✗ 0 / 1 pont'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => realtime.setSlide(0)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              Diák áttekintése az elejétől
            </button>
            <button
              onClick={() => {
                if (confirm('Biztosan újra szeretnéd kezdeni a prezentációt? Minden válasz és pont törlődik.')) {
                  realtime.resetSession();
                }
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <RotateCcw size={14} />
              <span>Prezentáció újrakezdése</span>
            </button>
          </div>
        </div>
      )}

      {/* Teacher Class Final Leaderboard & Session Summary */}
      {isTeacher && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900">
                Class Final Results &amp; Gardener Points
              </h2>
              <p className="text-xs text-slate-500">
                Points credited automatically to each student's running profile.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => realtime.triggerCelebration()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Sparkles size={14} /> Class Fireworks!
              </button>

              <button
                onClick={() => {
                  if (confirm('Start a new session? This will reset slides to beginning.')) {
                    realtime.resetSession();
                  }
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} /> Reset Lesson
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-2">
            {students
              .slice()
              .sort((a, b) => b.points - a.points)
              .map((s, rank) => (
                <div
                  key={s.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                    rank === 0
                      ? 'bg-amber-50/70 border-amber-300'
                      : rank === 1
                      ? 'bg-slate-50 border-slate-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-100 text-emerald-900">
                      #{rank + 1}
                    </span>
                    <span className="text-2xl">{s.avatar}</span>
                    <div>
                      <strong className="font-heading font-bold text-slate-900 block">
                        {s.name}
                      </strong>
                      <span className="text-[11px] text-slate-500">
                        {Object.keys(s.answers).length} of 5 activities submitted
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-heading font-bold text-lg text-emerald-800">
                        {s.points} Pts
                      </div>
                      <span className="text-[11px] text-amber-700 font-semibold">
                        +{s.lessonPoints} today
                      </span>
                    </div>

                    <button
                      onClick={() => realtime.awardBonus(s.id, 1, 'Outstanding participation!')}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                      title="Award +1 Bonus Point"
                    >
                      +1 Pt
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
