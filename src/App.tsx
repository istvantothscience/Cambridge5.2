import React, { useState, useEffect } from 'react';
import { realtime } from './lib/socketClient';
import { Student } from './types';
import { Slide0Warmup } from './components/slides/Slide0Warmup';
import { Slide1NonFlowering } from './components/slides/Slide1NonFlowering';
import { Slide2TaskFlowerOrNot } from './components/slides/Slide2TaskFlowerOrNot';
import { Slide3FlowerParts } from './components/slides/Slide3FlowerParts';
import { Slide4TaskLabelFlower } from './components/slides/Slide4TaskLabelFlower';
import { Slide5PollinationStory } from './components/slides/Slide5PollinationStory';
import { Slide6TaskOrderProcess } from './components/slides/Slide6TaskOrderProcess';
import { Slide7TaskFruitMatching } from './components/slides/Slide7TaskFruitMatching';
import { Slide8ExitTicket } from './components/slides/Slide8ExitTicket';
import { Slide9FinalSummary } from './components/slides/Slide9FinalSummary';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Sprout,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const SLIDES_CONFIG = [
  { id: 'slide-0-warmup', label: 'Bemelegítő', title: 'Minden növénynek van virága?', isTask: false },
  { id: 'slide-1-non-flowering', label: 'Elmélet 1', title: 'Nem virágos növények csoportjai', isTask: false },
  { id: 'slide-2-task-flower-or-not', label: '1. Feladat', title: 'Virágos vagy nem virágos?', isTask: true, taskKey: 'slide-2-task-flower-or-not' },
  { id: 'slide-3-flower-parts', label: 'Elmélet 2', title: 'A virág anatómiája és részei', isTask: false },
  { id: 'slide-4-task-label-flower', label: '2. Feladat', title: 'Virág részeinek felcímkézése', isTask: true, taskKey: 'slide-4-task-label-flower' },
  { id: 'slide-5-pollination-story', label: 'Elmélet 3', title: 'Beporzástól a megtermékenyülésig', isTask: false },
  { id: 'slide-6-task-order-process', label: '3. Feladat', title: 'Növényi folyamatok sorrendje', isTask: true, taskKey: 'slide-6-task-order-process' },
  { id: 'slide-7-task-fruit-matching', label: '4. Feladat', title: 'Termések és magvak párosítása', isTask: true, taskKey: 'slide-7-task-fruit-matching' },
  { id: 'slide-8-exit-ticket', label: '5. Feladat', title: 'Kilépőcédula ellenőrző kérdések', isTask: true, taskKey: 'slide-8-exit-ticket' },
  { id: 'slide-9-final-summary', label: 'Összegzés', title: 'Eredmények és tanórai pontszám', isTask: false },
];

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(realtime.currentState.currentSlideIndex);
  const [currentStudent, setCurrentStudent] = useState<Student>(realtime.currentStudent);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubSlide = realtime.onSlideChange((idx) => {
      setCurrentSlideIndex(idx);
    });

    const unsubStudents = realtime.onStudentsChange((studentsList) => {
      if (studentsList[0]) {
        setCurrentStudent({ ...studentsList[0] });
      }
    });

    const unsubPoints = realtime.onPointsAwarded((award) => {
      setToastMessage(award.reason);
      const timer = setTimeout(() => setToastMessage(null), 3200);
      return () => clearTimeout(timer);
    });

    return () => {
      unsubSlide();
      unsubStudents();
      unsubPoints();
    };
  }, []);

  // Keyboard navigation support: Left / Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentSlideIndex < SLIDES_CONFIG.length - 1) {
          realtime.nextSlide();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentSlideIndex > 0) {
          realtime.prevSlide();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  const currentMeta = SLIDES_CONFIG[currentSlideIndex] || SLIDES_CONFIG[0];
  const totalPoints = currentStudent?.points || 0;

  const goToSlide = (index: number) => {
    realtime.setSlide(index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-2 animate-fade-in">
          <Sparkles size={16} className="text-amber-300 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Presentation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-emerald-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Lesson Identity & Slide info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xl shadow-2xs text-emerald-800 shrink-0">
              <Sprout size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  Cambridge Science • Lesson 2
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 hidden sm:inline-block">
                  {currentSlideIndex + 1} / {SLIDES_CONFIG.length} dia
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium truncate max-w-[220px] sm:max-w-md">
                {currentMeta.label}: {currentMeta.title}
              </div>
            </div>
          </div>

          {/* Points Counter Badge & Top Prev/Next */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-2xs"
              title="A tanóra 5 interaktív feladatának összpontszáma"
            >
              <span className="text-lg">🌱</span>
              <div className="text-right">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider leading-none">
                  Pontszám
                </div>
                <div className="text-sm font-heading font-bold text-emerald-950 leading-tight">
                  {totalPoints} / 5 pont
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={() => realtime.prevSlide()}
                disabled={currentSlideIndex === 0}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer transition-all"
                title="Előző dia (← nyíl)"
                aria-label="Előző dia"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => realtime.nextSlide()}
                disabled={currentSlideIndex === SLIDES_CONFIG.length - 1}
                className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer transition-all shadow-2xs"
                title="Következő dia (→ nyíl)"
                aria-label="Következő dia"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Slide Progress Strip / Interactive Navigator */}
        <div className="max-w-6xl mx-auto px-4 pb-2 pt-0.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max py-0.5">
            {SLIDES_CONFIG.map((s, idx) => {
              const isActive = idx === currentSlideIndex;
              const hasAnswer = s.taskKey ? currentStudent.answers[s.taskKey]?.scoreEarned : false;
              const isSubmitted = s.taskKey ? Boolean(currentStudent.answers[s.taskKey]) : false;

              return (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs scale-105'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                  title={`${s.label}: ${s.title}`}
                >
                  <span>{idx + 1}.</span>
                  <span>{s.label}</span>
                  {s.isTask && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        hasAnswer
                          ? 'bg-emerald-400 ring-2 ring-white'
                          : isSubmitted
                          ? 'bg-amber-400'
                          : 'bg-slate-300'
                      }`}
                      title={hasAnswer ? '1 pont megszerezve!' : isSubmitted ? 'Megválaszolva' : 'Még nincs megoldva'}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Slide Content Presentation View */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {currentSlideIndex === 0 && (
          <Slide0Warmup
            isTeacher={false}
            students={[currentStudent]}
            currentStudent={currentStudent}
            savedAnswer={currentStudent.answers['slide-0-warmup']?.data}
            isLocked={false}
          />
        )}
        {currentSlideIndex === 1 && <Slide1NonFlowering isTeacher={false} />}
        {currentSlideIndex === 2 && (
          <Slide2TaskFlowerOrNot
            isTeacher={false}
            students={[currentStudent]}
            currentStudent={currentStudent}
            savedAnswer={currentStudent.answers['slide-2-task-flower-or-not']?.data}
            isLocked={false}
          />
        )}
        {currentSlideIndex === 3 && <Slide3FlowerParts isTeacher={false} />}
        {currentSlideIndex === 4 && (
          <Slide4TaskLabelFlower
            isTeacher={false}
            students={[currentStudent]}
            currentStudent={currentStudent}
            savedAnswer={currentStudent.answers['slide-4-task-label-flower']?.data}
            isLocked={false}
          />
        )}
        {currentSlideIndex === 5 && <Slide5PollinationStory isTeacher={false} />}
        {currentSlideIndex === 6 && (
          <Slide6TaskOrderProcess
            isTeacher={false}
            students={[currentStudent]}
            currentStudent={currentStudent}
            savedAnswer={currentStudent.answers['slide-6-task-order-process']?.data}
            isLocked={false}
          />
        )}
        {currentSlideIndex === 7 && (
          <Slide7TaskFruitMatching
            isTeacher={false}
            students={[currentStudent]}
            currentStudent={currentStudent}
            savedAnswer={currentStudent.answers['slide-7-task-fruit-matching']?.data}
            isLocked={false}
          />
        )}
        {currentSlideIndex === 8 && (
          <Slide8ExitTicket
            isTeacher={false}
            students={[currentStudent]}
            currentStudent={currentStudent}
            savedAnswer={currentStudent.answers['slide-8-exit-ticket']?.data}
            isLocked={false}
          />
        )}
        {currentSlideIndex === 9 && (
          <Slide9FinalSummary
            isTeacher={false}
            students={[currentStudent]}
            currentStudent={currentStudent}
          />
        )}
      </main>

      {/* Bottom Sticky Presentation Navigation Controls */}
      <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-xs border-t border-slate-200 py-3 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status info & Keyboard shortcut hint */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
              <BookOpen size={15} /> Cambridge Primary Science
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-400">
              Lapozás billentyűzettel: <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-mono">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-mono">→</kbd>
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => realtime.prevSlide()}
              disabled={currentSlideIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-heading font-bold text-xs text-slate-700 flex items-center gap-1 cursor-pointer transition-all"
            >
              <ChevronLeft size={16} />
              <span>Előző dia</span>
            </button>

            <span className="text-xs font-bold text-slate-600 sm:px-2">
              {currentSlideIndex + 1} / {SLIDES_CONFIG.length}
            </span>

            {currentSlideIndex < SLIDES_CONFIG.length - 1 ? (
              <button
                onClick={() => realtime.nextSlide()}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-[1.02]"
              >
                <span>Következő dia</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (confirm('Biztosan újra szeretnéd kezdeni a prezentációt? Minden válasz törlődik.')) {
                    realtime.resetSession();
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-heading font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <RotateCcw size={14} />
                <span>Újrakezdés</span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
