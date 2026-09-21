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
      {!isTeacher && selectedOption && (
        <div className="p-4 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span>
              <strong>Thank you, {currentStudent?.name || 'Gardener'}!</strong> Your vote is locked in. Watch the teacher's screen to see what the whole class voted.
            </span>
          </div>
        </div>
      )}

      {/* Teacher Live Stats Card */}
      {isTeacher && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-emerald-700" size={20} />
              <h3 className="font-heading font-bold text-lg text-slate-800">
                Live Class Warm-up Poll Results
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              <Users size={14} />
              {totalVotes} of {students.length} student{students.length === 1 ? '' : 's'} voted
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {WARMUP_OPTIONS.map((opt) => (
              <div key={opt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                    <span>{opt.icon}</span> {opt.id.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {votesCount[opt.id]}
                  </span>
                </div>
                {votersByChoice[opt.id].length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {votersByChoice[opt.id].map((name, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No votes yet</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
