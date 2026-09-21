import React from 'react';
import { WARMUP_OPTIONS } from '../../data/lessonData';
import { Student } from '../../types';
import { realtime } from '../../lib/socketClient';
import { sounds } from '../../lib/confetti';
import { Check, HelpCircle, Users, BarChart3 } from 'lucide-react';

interface Slide0WarmupProps {
  isTeacher: boolean;
  students: Student[];
  currentStudent: Student | null;
  savedAnswer?: any;
  isLocked: boolean;
}

export const Slide0Warmup: React.FC<Slide0WarmupProps> = ({
  isTeacher,
  students,
  currentStudent,
  savedAnswer,
  isLocked,
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    savedAnswer?.choice || null
  );

  React.useEffect(() => {
    if (savedAnswer?.choice) {
      setSelectedOption(savedAnswer.choice);
    }
  }, [savedAnswer]);

  const handleVote = (optionId: string) => {
    if (isTeacher || isLocked) return;
    setSelectedOption(optionId);
    sounds.playPoint();
    realtime.submitAnswer('slide-0-warmup', 0, { choice: optionId }, 0);
  };

  // Compute live vote statistics across all students
  const votesCount: Record<string, number> = { yes: 0, no: 0, not_sure: 0 };
  let totalVotes = 0;
  const votersByChoice: Record<string, string[]> = { yes: [], no: [], not_sure: [] };

  students.forEach((s) => {
    const ans = s.answers['slide-0-warmup'];
    if (ans?.data?.choice && votesCount[ans.data.choice] !== undefined) {
      votesCount[ans.data.choice]++;
      totalVotes++;
      votersByChoice[ans.data.choice].push(s.name);
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <HelpCircle size={14} />
          Warm-up Activity • Unscored Curiosity Vote
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-emerald-950 tracking-tight">
          Do you think every plant has flowers?
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-base">
          Cast your vote based on what you have noticed outdoors in gardens, parks, or forests. There are no wrong guesses here!
        </p>
      </div>

      {/* Student Voting Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {WARMUP_OPTIONS.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const votePercent = totalVotes > 0 ? Math.round((votesCount[opt.id] / totalVotes) * 100) : 0;

          return (
            <button
              key={opt.id}
              disabled={isTeacher || isLocked}
              onClick={() => handleVote(opt.id)}
              className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 group flex flex-col justify-between min-h-[190px] ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
              } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-4xl select-none">{opt.icon}</span>
                {isSelected && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                    <Check size={12} /> Your Vote
                  </span>
                )}
              </div>

              <div className="space-y-1 my-3">
                <div className="font-heading font-bold text-lg text-slate-800 group-hover:text-emerald-900">
                  {opt.label}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{opt.hint}</p>
              </div>

              {/* Vote percentage bar for everyone or teacher */}
              {(isTeacher || selectedOption) && (
                <div className="w-full pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                    <span>{votesCount[opt.id]} {votesCount[opt.id] === 1 ? 'vote' : 'votes'}</span>
                    <span className="text-emerald-700 font-bold">{votePercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${votePercent}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirmation & Status info for student */}
      {selectedOption && (
        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌱</span>
            <div className="space-y-1">
              <strong className="block font-heading font-bold text-base text-emerald-900">
                {selectedOption === 'no'
                  ? '🎯 Helyes meglátás! / Spot on!'
                  : '🔍 Érdekes kérdés! / Good thinking!'}
              </strong>
              <p className="text-sm text-slate-700 leading-relaxed">
                A tudomány válasza: <strong>NEM minden növény hoz virágot!</strong> Bár a virágos növények (pl. rózsa, almafa, napraforgó) nagyon elterjedtek, léteznek nem virágos növények is (pl. fenyők, mohák, páfrányok), amelyek virág nélkül szaporodnak.
              </p>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => realtime.nextSlide()}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <span>Következő dia: Nem virágos növények</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
