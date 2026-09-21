import React, { useState, useEffect } from 'react';
import { UserRole, SessionState, Student } from './types';
import { realtime } from './lib/socketClient';
import { getSupabaseConfig } from './lib/supabase';
import { TeacherPanel } from './components/TeacherPanel';
import { StudentView } from './components/StudentView';
import { GraduationCap, Monitor, Database } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<UserRole>('teacher');
  const [session, setSession] = useState<SessionState>(realtime.currentState);
  const [students, setStudents] = useState<Student[]>(realtime.students);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(realtime.currentStudent);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { isConfigured: hasSupabase } = getSupabaseConfig();

  // Initialize role from URL query param if present (?role=student or ?role=teacher)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramRole = params.get('role');
    if (paramRole === 'student' || paramRole === 'teacher') {
      setRole(paramRole);
    }

    const saved = realtime.getSavedStudent();
    if (saved) {
      realtime.connect(paramRole === 'student' ? 'student' : (paramRole === 'teacher' ? 'teacher' : role), saved);
    } else {
      realtime.connect(paramRole === 'student' ? 'student' : (paramRole === 'teacher' ? 'teacher' : role));
    }
  }, []);

  // Listen to realtime updates
  useEffect(() => {
    const unsubState = realtime.onStateChange((state) => {
      setSession({ ...state });
    });

    const unsubStudents = realtime.onStudentsChange((list) => {
      setStudents([...list]);
      if (realtime.currentStudent) {
        setCurrentStudent({ ...realtime.currentStudent });
      }
    });

    const unsubPoints = realtime.onPointsAwarded((award) => {
      setToastMessage(award.reason);
      setTimeout(() => setToastMessage(null), 3000);
    });

    const unsubCelebration = realtime.onCelebration((message) => {
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 3500);
    });

    return () => {
      unsubState();
      unsubStudents();
      unsubPoints();
      unsubCelebration();
    };
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    const saved = realtime.getSavedStudent();
    realtime.connect(newRole, saved || undefined);
  };

  const handleProfileUpdated = () => {
    const saved = realtime.getSavedStudent();
    if (saved) {
      const found = students.find((s) => s.id === saved.id);
      if (found) {
        setCurrentStudent(found);
      } else {
        setCurrentStudent({
          id: saved.id,
          name: saved.name,
          avatar: saved.avatar,
          points: 0,
          lessonPoints: 0,
          answers: {},
          connected: true,
          joinedAt: Date.now(),
          lastActive: Date.now(),
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800 relative">
      {/* Toast alert (minimal and calm) */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2">
          <span>🌱</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Single-View Component (No top navigation row, no test simulator) */}
      <div className="flex-1 flex flex-col">
        {role === 'teacher' ? (
          <TeacherPanel session={session} students={students} />
        ) : (
          <StudentView
            session={session}
            students={students}
            currentStudent={currentStudent}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </div>

      {/* Discrete Role Switcher in bottom right corner (never clutters top row) */}
      <div className="fixed bottom-3 right-3 z-40 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-slate-300 px-2 py-1 rounded-full shadow-md text-xs">
        <span className="text-[10px] text-slate-500 font-medium hidden sm:inline px-1">
          Nézet:
        </span>
        <button
          onClick={() => handleRoleChange('teacher')}
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
            role === 'teacher'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap size={12} />
          <span>Tanár</span>
        </button>
        <button
          onClick={() => handleRoleChange('student')}
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
            role === 'student'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Monitor size={12} />
          <span>Diák</span>
        </button>

        {hasSupabase && (
          <span
            className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 flex items-center gap-0.5"
            title="Supabase adatbázis csatlakoztatva"
          >
            <Database size={10} /> Supabase
          </span>
        )}
      </div>
    </div>
  );
}
