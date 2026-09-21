import React, { useState } from 'react';
import { SLIDES_META } from '../data/lessonData';
import { SessionState, Student } from '../types';
import { realtime } from '../lib/socketClient';
import { PointBadge } from './common/PointBadge';
import { Lock, Sparkles, Sprout, User, CheckCircle2 } from 'lucide-react';
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

interface StudentViewProps {
  session: SessionState;
  students: Student[];
  currentStudent: Student | null;
  onProfileUpdated: () => void;
}

const AVATARS = ['🌱', '🌻', '🌸', '🍓', '🥑', '🌲', '🌾', '🌺', '🌿', '🍎'];

export const StudentView: React.FC<StudentViewProps> = ({
  session,
  students,
  currentStudent,
  onProfileUpdated,
}) => {
  const [joinName, setJoinName] = useState('');
  const [joinAvatar, setJoinAvatar] = useState('🌱');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // If no current student profile registered yet, show friendly Join screen
  if (!currentStudent && !isEditingProfile) {
    const handleJoin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!joinName.trim()) return;
      const profile = realtime.saveStudentProfile(joinName.trim(), joinAvatar);
      realtime.connect('student', profile);
      onProfileUpdated();
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-amber-50/40 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 max-w-md w-full shadow-xl space-y-6 animate-fade-in text-center">
          <div className="space-y-2">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-4xl flex items-center justify-center border-2 border-emerald-300 shadow-inner">
              {joinAvatar}
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-emerald-950">
              Join Science Class
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              Cambridge Primary Science Stage 5–6<br />
              <strong>"Our living world — Lesson 2: Flowers, Seeds &amp; Fruits"</strong>
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Explorer Name:
              </label>
              <input
                type="text"
                required
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="e.g., Maya Botanist, Leo, Alex..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-400/20 text-sm font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Choose Your Plant Avatar:
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {AVATARS.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setJoinAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer border ${
                      joinAvatar === av
                        ? 'bg-emerald-100 border-emerald-600 scale-110 shadow-xs ring-2 ring-emerald-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!joinName.trim()}
              className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-heading font-bold text-base shadow-sm transition-all cursor-pointer hover:scale-[1.01]"
            >
              Enter Classroom 🌱
            </button>
          </form>

          <p className="text-[11px] text-slate-500">
            Your points will be tracked automatically as you complete activities!
          </p>
        </div>
      </div>
    );
  }

  const currentMeta = SLIDES_META[session.currentSlideIndex] || SLIDES_META[0];
  const savedAnswer = currentStudent?.answers[currentMeta.id]?.data;

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col">
      {/* Student Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-emerald-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Student Profile Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl shadow-inner">
              {currentStudent?.avatar || '🌱'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                  {currentStudent?.name || 'Young Botanist'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Synced
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Slide {session.currentSlideIndex + 1} of {SLIDES_META.length}: {currentMeta.shortTitle}
              </div>
            </div>
          </div>

          {/* Gardener Points Counter (prominent on every slide!) */}
          <div className="flex items-center gap-2">
            <PointBadge
              points={currentStudent?.points || 0}
              lessonPoints={currentStudent?.lessonPoints || 0}
              size="md"
            />
          </div>
        </div>

        {/* Lock warning if teacher locked slides */}
        {session.isLocked && (
          <div className="bg-amber-500 text-white px-4 py-1 text-center text-xs font-bold flex items-center justify-center gap-1.5">
            <Lock size={12} />
            <span>Teacher has paused submissions for class discussion</span>
          </div>
        )}
      </header>

      {/* Main Single Slide Content Area (follows teacher automatically) */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {session.currentSlideIndex === 0 && (
          <Slide0Warmup
            isTeacher={false}
            students={students}
            currentStudent={currentStudent}
            savedAnswer={savedAnswer}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 1 && <Slide1NonFlowering isTeacher={false} />}
        {session.currentSlideIndex === 2 && (
          <Slide2TaskFlowerOrNot
            isTeacher={false}
            students={students}
            currentStudent={currentStudent}
            savedAnswer={savedAnswer}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 3 && <Slide3FlowerParts isTeacher={false} />}
        {session.currentSlideIndex === 4 && (
          <Slide4TaskLabelFlower
            isTeacher={false}
            students={students}
            currentStudent={currentStudent}
            savedAnswer={savedAnswer}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 5 && <Slide5PollinationStory isTeacher={false} />}
        {session.currentSlideIndex === 6 && (
          <Slide6TaskOrderProcess
            isTeacher={false}
            students={students}
            currentStudent={currentStudent}
            savedAnswer={savedAnswer}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 7 && (
          <Slide7TaskFruitMatching
            isTeacher={false}
            students={students}
            currentStudent={currentStudent}
            savedAnswer={savedAnswer}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 8 && (
          <Slide8ExitTicket
            isTeacher={false}
            students={students}
            currentStudent={currentStudent}
            savedAnswer={savedAnswer}
            isLocked={session.isLocked}
          />
        )}
        {session.currentSlideIndex === 9 && (
          <Slide9FinalSummary
            isTeacher={false}
            students={students}
            currentStudent={currentStudent}
          />
        )}
      </main>

      {/* Student Friendly Bottom Status Bar */}
      <footer className="bg-white/80 border-t border-slate-200 py-3 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1 text-emerald-800 font-semibold">
            <Sprout size={14} /> Cambridge Primary Science (Stage 5–6)
          </span>
          <span className="text-[11px] text-slate-400">
            Synced live with teacher's screen
          </span>
        </div>
      </footer>
    </div>
  );
};
