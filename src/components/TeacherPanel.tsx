import React, { useState } from 'react';
import { SLIDES_META } from '../data/lessonData';
import { SessionState, Student } from '../types';
import { realtime } from '../lib/socketClient';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Users,
  Sparkles,
  Trophy,
  Award,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Tag,
  ListOrdered,
  Apple,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { Slide0Warmup } from './slides/Slide0Warmup';
import { Slide1NonFlowering } from './slides/Slide1NonFlowering';
import { Slide2TaskFlowerOrNot } from './slides/Slide2TaskFlowerOrNot';
import { Slide3FlowerParts } from './slides/Slide3FlowerParts';
import { Slide4TaskLabelFlower } from './slides/Slide4TaskLabelFlower';
import { Slide5PollinationStory } from './slides/Slide5PollinationStory';
import { Slide6TaskOrderProcess } from './slides/Slide6TaskOrderProcess';
import { Slide7TaskFruitMatching } from './slides/Slide7TaskFruitMatching';
import { Slide8ExitTicket } from './slides/Slide8ExitTicket';
import { Slide9FinalSummary } from './slides/Slide9FinalSummary';

interface TeacherPanelProps {
  session: SessionState;
  students: Student[];
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ session, students }) => {
  const [selectedStudentForBonus, setSelectedStudentForBonus] = useState<string | null>(null);
  const [customBonusReason, setCustomBonusReason] = useState('Great verbal answer in class!');
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  const currentMeta = SLIDES_META[session.currentSlideIndex] || SLIDES_META[0];

  const handlePrev = () => {
    if (session.currentSlideIndex > 0) {
      realtime.prevSlide();
    }
  };

  const handleNext = () => {
    if (session.currentSlideIndex < SLIDES_META.length - 1) {
      realtime.nextSlide();
    }
  };

  const handleJump = (idx: number) => {
    realtime.setSlide(idx);
  };

  const handleToggleLock = () => {
    realtime.toggleLock(!session.isLocked);
  };

  const handleAwardBonus = (studentId: string, pts: number) => {
    realtime.awardBonus(studentId, pts, customBonusReason);
  };

  const handleAwardClass = (pts: number) => {
    realtime.awardClassBonus(pts, 'Class participation award!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Teacher Top Sticky Control Bar */}
      <header className="sticky top-0 z-30 bg-emerald-950 text-white border-b border-emerald-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Lesson title and slide indicator */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold shadow-inner">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Teacher Control Console
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-medium">Live Synced</span>
              </div>
              <h1 className="font-heading font-bold text-base sm:text-lg text-white leading-tight">
                Slide {session.currentSlideIndex + 1}/{SLIDES_META.length}: {currentMeta.shortTitle}
              </h1>
            </div>
          </div>

          {/* Center: Slide Step Navigation Buttons */}
          <div className="flex items-center gap-1.5 bg-emerald-900/80 p-1 rounded-2xl border border-emerald-800">
            <button
              disabled={session.currentSlideIndex === 0}
              onClick={handlePrev}
              className="p-2 rounded-xl text-emerald-200 hover:bg-emerald-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              title="Previous Slide"
            >
              <ChevronLeft size={20} />
            </button>

            <span className="text-xs font-bold font-mono px-3 text-amber-300">
              {session.currentSlideIndex + 1} / {SLIDES_META.length}
            </span>

            <button
              disabled={session.currentSlideIndex === SLIDES_META.length - 1}
              onClick={handleNext}
              className="p-2 rounded-xl text-emerald-200 hover:bg-emerald-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              title="Next Slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2">
            {/* Lock toggle */}
            <button
              onClick={handleToggleLock}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                session.isLocked
                  ? 'bg-rose-600 border-rose-500 text-white'
                  : 'bg-emerald-900 border-emerald-800 hover:bg-emerald-800 text-emerald-200'
              }`}
              title={session.isLocked ? 'Submissions Locked' : 'Submissions Active'}
            >
              {session.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
              <span>{session.isLocked ? 'Locked' : 'Unlocked'}</span>
            </button>

            {/* Students roster modal trigger */}
            <button
              onClick={() => setShowStudentsModal(!showStudentsModal)}
              className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 border border-emerald-700 text-emerald-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Users size={14} />
              <span>{students.length} Diák</span>
            </button>
          </div>
        </div>

        {/* Slide Carousel Navigator */}
        <div className="bg-emerald-900/60 border-t border-emerald-900/80 px-4 py-2 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
            {SLIDES_META.map((slide, idx) => {
              const isCurrent = idx === session.currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleJump(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400 text-emerald-950 shadow-xs ring-2 ring-amber-300 font-extrabold scale-102'
                      : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800 hover:text-white border border-emerald-900'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-900/40 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{slide.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Slide Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {session.currentSlideIndex === 0 && (
          <Slide0Warmup
            isTeacher={true}
            students={students}
            currentStudent={null}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 1 && <Slide1NonFlowering isTeacher={true} />}
        {session.currentSlideIndex === 2 && (
          <Slide2TaskFlowerOrNot
            isTeacher={true}
            students={students}
            currentStudent={null}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 3 && <Slide3FlowerParts isTeacher={true} />}
        {session.currentSlideIndex === 4 && (
          <Slide4TaskLabelFlower
            isTeacher={true}
            students={students}
            currentStudent={null}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 5 && <Slide5PollinationStory isTeacher={true} />}
        {session.currentSlideIndex === 6 && (
          <Slide6TaskOrderProcess
            isTeacher={true}
            students={students}
            currentStudent={null}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 7 && (
          <Slide7TaskFruitMatching
            isTeacher={true}
            students={students}
            currentStudent={null}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 8 && (
          <Slide8ExitTicket
            isTeacher={true}
            students={students}
            currentStudent={null}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 9 && (
          <Slide9FinalSummary
            isTeacher={true}
            students={students}
            currentStudent={null}
          />
        )}
      </main>

      {/* Teacher Footer Tools & Student Roster Bar */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Quick Bonus Award Bar */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Award size={14} className="text-amber-600" />
              Award Points:
            </span>

            <select
              value={selectedStudentForBonus || ''}
              onChange={(e) => setSelectedStudentForBonus(e.target.value || null)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-medium cursor-pointer"
            >
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.points} pts)
                </option>
              ))}
            </select>

            <button
              disabled={!selectedStudentForBonus}
              onClick={() => selectedStudentForBonus && handleAwardBonus(selectedStudentForBonus, 1)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              +1 pont
            </button>
          </div>

          {/* Slide Navigation Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              disabled={session.currentSlideIndex === 0}
              onClick={handlePrev}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} /> Prev Slide
            </button>

            <button
              disabled={session.currentSlideIndex === SLIDES_META.length - 1}
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Advance Class</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </footer>

      {/* Slide-over or Drawer for Student Roster */}
      {showStudentsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900">
                  Active Class Roster
                </h3>
                <p className="text-xs text-slate-500">
                  {students.length} students enrolled in this session
                </p>
              </div>
              <button
                onClick={() => setShowStudentsModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{s.avatar}</span>
                    <div>
                      <strong className="text-slate-900 font-bold text-sm block">
                        {s.name}
                      </strong>
                      <span className="text-[11px] text-slate-500">
                        {s.connected ? (
                          <span className="text-emerald-700 font-semibold">● Connected</span>
                        ) : (
                          <span className="text-slate-400">○ Reconnecting</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="font-heading font-bold text-emerald-800 text-sm block">
                        {s.points} pts
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold">
                        +{s.lessonPoints} today
                      </span>
                    </div>

                    <button
                      onClick={() => handleAwardBonus(s.id, 1)}
                      className="px-2 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                    >
                      +1
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowStudentsModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Close Roster
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
