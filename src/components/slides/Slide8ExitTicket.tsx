import React, { useState, useEffect } from 'react';
import { EXIT_TICKET_QUESTIONS } from '../../data/lessonData';
import { Student } from '../../types';
import { realtime } from '../../lib/socketClient';
import { sounds, fireGrandCelebration } from '../../lib/confetti';
import { Award, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';

interface Slide8ExitTicketProps {
  isTeacher: boolean;
  students: Student[];
  currentStudent: Student | null;
  savedAnswer?: any;
  isLocked: boolean;
}

export const Slide8ExitTicket: React.FC<Slide8ExitTicketProps> = ({
  isTeacher,
  students,
  currentStudent,
  savedAnswer,
  isLocked,
}) => {
  // Mapping of question id -> selected option index
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(
    savedAnswer?.answers || {}
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!savedAnswer?.submitted);

  useEffect(() => {
    if (savedAnswer?.answers) {
      setSelectedAnswers(savedAnswer.answers);
      setIsSubmitted(!!savedAnswer.submitted);
    }
  }, [savedAnswer]);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted || isTeacher || isLocked) return;
    sounds.playPoint();
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (isSubmitted || isTeacher || isLocked) return;

    let correctCount = 0;
    EXIT_TICKET_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    setIsSubmitted(true);

    const scoreEarned = correctCount >= 3 ? 1 : 0;

    if (correctCount >= 3) {
      sounds.playSuccess();
      fireGrandCelebration();
    } else {
      sounds.playPoint();
    }

    realtime.submitAnswer(
      'slide-8-exit-ticket',
      8,
      {
        answers: selectedAnswers,
        correctCount,
        submitted: true,
      },
      scoreEarned
    );
  };

  const allQuestionsAnswered = EXIT_TICKET_QUESTIONS.every(
    (q) => selectedAnswers[q.id] !== undefined
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <Award size={14} />
          5. feladat • Kilépőcédula (1 pont)
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-emerald-950 tracking-tight">
          Lesson 2 Exit Ticket
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-base">
          Show your mastery of flowering plants, flower anatomy, and the journey from pollination to seeds!
        </p>
      </div>

      {/* Questions List for Students */}
      {!isTeacher && (
        <div className="space-y-6">
          {EXIT_TICKET_QUESTIONS.map((q, qIndex) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = isSubmitted ? selectedOpt === q.correctIndex : null;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${
                  isSubmitted
                    ? isCorrect
                      ? 'bg-emerald-50/70 border-emerald-400'
                      : 'bg-rose-50/60 border-rose-300'
                    : 'bg-white border-emerald-200 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-700 text-white font-heading font-bold text-sm flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-slate-900">
                      {q.question}
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                      Topic: {q.category}
                    </span>
                  </div>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isChoice = selectedOpt === optIdx;
                    const isActualCorrect = optIdx === q.correctIndex;

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted || isLocked}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSubmitted
                            ? isActualCorrect
                              ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300'
                              : isChoice
                              ? 'bg-rose-500 text-white border-rose-600'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                            : isChoice
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-500 ring-2 ring-emerald-400/30'
                            : 'bg-slate-50/80 hover:bg-emerald-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && isActualCorrect && (
                          <CheckCircle2 size={16} className="text-white shrink-0" />
                        )}
                        {isSubmitted && isChoice && !isActualCorrect && (
                          <XCircle size={16} className="text-white shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {isSubmitted && (
                  <div className="p-3 rounded-xl bg-white/90 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <strong className="text-emerald-800 block">Explanation:</strong>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Action */}
          {!isSubmitted ? (
            <button
              disabled={!allQuestionsAnswered || isLocked}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-2xl font-heading font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                allQuestionsAnswered
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white hover:scale-[1.01]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 size={18} />
              <span>Kilépőcédula ellenőrzése / Check Exit Ticket</span>
            </button>
          ) : (
            <div className="p-6 bg-gradient-to-r from-emerald-100 to-amber-100 rounded-3xl border border-emerald-300 text-center space-y-3 animate-fade-in">
              <Sparkles className="mx-auto text-amber-600" size={32} />
              <div className="font-heading font-bold text-xl text-emerald-950">
                5. Feladat (Kilépőcédula) befejezve!
              </div>
              <div className="text-sm font-semibold">
                {EXIT_TICKET_QUESTIONS.filter((q) => selectedAnswers[q.id] === q.correctIndex).length >= 3 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    ✓ Sikerült! {EXIT_TICKET_QUESTIONS.filter((q) => selectedAnswers[q.id] === q.correctIndex).length}/4 kérdés helyes. 1 pont megszerezve az 5. feladatra 🌱
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                    Nem sikerült! {EXIT_TICKET_QUESTIONS.filter((q) => selectedAnswers[q.id] === q.correctIndex).length}/4 helyes (legalább 3 szükséges a ponthoz).
                  </span>
                )}
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedAnswers({});
                  }}
                  className="px-4 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 cursor-pointer"
                >
                  Újrapróbálás
                </button>
                <button
                  onClick={() => realtime.nextSlide()}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <span>Összesített pontszám és oklevél megtekintése</span>
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
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Live Exit Ticket Class Mastery
            </h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              4 Questions Assessed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXIT_TICKET_QUESTIONS.map((q, idx) => {
              let attempts = 0;
              let correct = 0;
              students.forEach((s) => {
                const ans = s.answers['slide-8-exit-ticket']?.data?.answers?.[q.id];
                if (ans !== undefined) {
                  attempts++;
                  if (ans === q.correctIndex) correct++;
                }
              });

              const rate = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

              return (
                <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start text-xs font-bold">
                    <span className="text-slate-800">Q{idx + 1}: {q.category.toUpperCase()}</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      rate >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {attempts > 0 ? `${rate}% Mastery` : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{q.question}</p>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Submissions List */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <span className="text-xs font-bold text-slate-700">Submissions:</span>
            <div className="flex flex-wrap gap-2">
              {students.map((s) => {
                const ans = s.answers['slide-8-exit-ticket']?.data;
                const hasSubmitted = !!ans?.submitted;
                const correctCount = ans?.correctCount || 0;

                return (
                  <div
                    key={s.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2"
                  >
                    <span>{s.avatar}</span>
                    <span className="font-bold text-slate-800">{s.name}</span>
                    {hasSubmitted ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {correctCount}/4 Correct
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Answering...</span>
                    )}
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
