import React, { useState } from 'react';
import { Compass, Play, Pause, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';

interface Slide5PollinationStoryProps {
  isTeacher: boolean;
}

const STORY_STEPS = [
  {
    step: 1,
    title: '1. Pollen on the Anther',
    subtitle: 'Golden dust ready for transport',
    icon: '🌾',
    color: 'from-amber-400 to-amber-600',
    description:
      'Millions of microscopic golden grains called pollen are manufactured in the anthers (the tips of the stamens). When ripe, the anthers burst open, releasing powdery pollen dust.',
    highlight: 'Anther produces ripe pollen grains.',
    diagramState: 'anther-ripe',
  },
  {
    step: 2,
    title: '2. Pollination: Landing on the Stigma',
    subtitle: 'Transfer by insect or breeze',
    icon: '🐝',
    color: 'from-yellow-400 to-emerald-600',
    description:
      'A hungry bee or butterfly visits seeking sweet nectar. Its fuzzy body brushes against an anther and carries pollen grains to the next flower, where they stick to the moist, sticky stigma!',
    highlight: 'Pollination is the transfer of pollen from anther to stigma.',
    diagramState: 'pollen-landing',
  },
  {
    step: 3,
    title: '3. Growing the Pollen Tube',
    subtitle: 'The highway through the style',
    icon: '🧪',
    color: 'from-emerald-500 to-teal-600',
    description:
      'The sticky sugary liquid on the stigma stimulates the pollen grain to germinate! It grows a microscopic tunnel—a pollen tube—all the way down through the long neck (style) toward the ovary.',
    highlight: 'A microscopic pollen tube drills down the style.',
    diagramState: 'tube-growing',
  },
  {
    step: 4,
    title: '4. Fertilisation inside the Ovary',
    subtitle: 'Pollen joins with the ovule',
    icon: '✨',
    color: 'from-teal-500 to-emerald-700',
    description:
      'The male nucleus inside the pollen tube reaches an ovule (egg cell) tucked safely inside the ovary. When they unite, fertilisation is complete! The fertilised ovule starts dividing into a seed.',
    highlight: 'Fertilisation: male pollen nucleus fuses with female ovule cell.',
    diagramState: 'fertilisation',
  },
  {
    step: 5,
    title: '5. Petals Wither & Fruit Swells',
    subtitle: 'The ovary becomes a protective fruit or pod',
    icon: '🍎',
    color: 'from-emerald-600 to-rose-600',
    description:
      'Once fertilisation is finished, the flower no longer needs to attract bees. The colourful petals wither and fall off. The ovary swells dramatically, becoming a fruit or seed pod that guards the seeds!',
    highlight: 'Ovary → Fruit/Pod; Ovule → Seed with baby plant embryo inside.',
    diagramState: 'fruit-swelling',
  },
];

export const Slide5PollinationStory: React.FC<Slide5PollinationStoryProps> = ({ isTeacher }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const step = STORY_STEPS[currentStepIndex];

  React.useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % STORY_STEPS.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <Compass size={14} />
          Cambridge Primary Science • Concept 3
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-emerald-950 tracking-tight">
          From flowers to seeds: The journey of reproduction
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          Follow the magical step-by-step transformation from a dusting of pollen on an anther to a ripe fruit packed with seeds.
        </p>
      </div>

      {/* Stepper Timeline Nav */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 bg-white p-2 sm:p-3 rounded-2xl border border-emerald-200 shadow-xs overflow-x-auto">
        {STORY_STEPS.map((s, idx) => {
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;

          return (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
              className={`flex-1 min-w-[120px] p-2 rounded-xl text-left transition-all cursor-pointer border ${
                isActive
                  ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-400/20'
                  : 'bg-slate-50/70 border-transparent hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="font-bold text-emerald-800">Step {s.step}</span>
                <span className="text-base">{s.icon}</span>
              </div>
              <div className="text-xs font-heading font-bold text-slate-800 truncate">
                {s.title.split('. ')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Main Step Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white rounded-3xl border-2 border-emerald-200 p-6 sm:p-8 shadow-sm">
        {/* Visual Animated SVG Diagram (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-b from-amber-50/50 via-emerald-50/30 to-emerald-100/40 rounded-2xl border border-emerald-100 p-4 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 400 320" className="w-full h-full select-none">
            {/* Base Receptacle */}
            <path d="M 180 270 L 220 270 L 215 300 L 185 300 Z" fill="#2d6a4f" />
            <ellipse cx="200" cy="265" rx="30" ry="10" fill="#40916c" />

            {/* Petals (fade in step 5) */}
            <g opacity={currentStepIndex === 4 ? 0.2 : 0.85} transition-opacity="all 0.5s">
              <path d="M 170 250 C 90 220, 50 140, 90 80 C 130 110, 160 170, 170 230 Z" fill="#fda4af" stroke="#e11d48" strokeWidth="1.5" />
              <path d="M 230 250 C 310 220, 350 140, 310 80 C 270 110, 240 170, 230 230 Z" fill="#fda4af" stroke="#e11d48" strokeWidth="1.5" />
            </g>

            {/* Ovary Base (swells on step 5) */}
            <ellipse
              cx="200"
              cy={currentStepIndex === 4 ? 220 : 230}
              rx={currentStepIndex === 4 ? 50 : 32}
              ry={currentStepIndex === 4 ? 45 : 34}
              fill={currentStepIndex === 4 ? '#ef4444' : '#86efac'}
              stroke={currentStepIndex === 4 ? '#b91c1c' : '#15803d'}
              strokeWidth={currentStepIndex === 4 ? 3.5 : 2.5}
              className="transition-all duration-700"
            />

            {/* Ovules inside Ovary */}
            <circle
              cx="192"
              cy={currentStepIndex === 4 ? 215 : 228}
              r={currentStepIndex === 4 ? 9 : 6}
              fill={currentStepIndex >= 3 ? '#a16207' : '#fef08a'}
              stroke="#713f12"
              strokeWidth="1.5"
              className="transition-all duration-700"
            />
            <circle
              cx="208"
              cy={currentStepIndex === 4 ? 215 : 228}
              r={currentStepIndex === 4 ? 9 : 6}
              fill={currentStepIndex >= 3 ? '#a16207' : '#fef08a'}
              stroke="#713f12"
              strokeWidth="1.5"
              className="transition-all duration-700"
            />

            {/* Style & Stigma (withers in step 5) */}
            <g opacity={currentStepIndex === 4 ? 0.3 : 1} className="transition-opacity duration-500">
              <path d="M 194 200 L 194 95 L 206 95 L 206 200 Z" fill="#86efac" stroke="#15803d" strokeWidth="2" />
              <path d="M 188 95 C 182 78, 195 70, 200 76 C 205 70, 218 78, 212 95 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            </g>

            {/* Step 1: Pollen on Anther */}
            {currentStepIndex >= 0 && currentStepIndex < 4 && (
              <g>
                <path d="M 180 240 Q 130 190 140 120" fill="none" stroke="#d97706" strokeWidth="3" />
                <ellipse cx="140" cy="115" rx="14" ry="9" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                <circle cx="137" cy="113" r="1.5" fill="#78350f" />
                <circle cx="143" cy="116" r="1.5" fill="#78350f" />
              </g>
            )}

            {/* Step 2: Pollen grain landing on Stigma with Bee */}
            {currentStepIndex === 1 && (
              <g className="animate-bounce">
                <circle cx="200" cy="72" r="5" fill="#eab308" stroke="#713f12" strokeWidth="1.5" />
                <text x="220" y="65" fontSize="24">🐝</text>
              </g>
            )}

            {/* Step 3: Pollen Tube Growing Down Style */}
            {currentStepIndex >= 2 && currentStepIndex < 4 && (
              <g>
                <circle cx="200" cy="72" r="4" fill="#eab308" stroke="#713f12" strokeWidth="1" />
                {/* Tube path */}
                <line x1="200" y1="74" x2="200" y2="225" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 2" />
                <circle cx="200" cy="225" r="3.5" fill="#dc2626" className="animate-ping" />
              </g>
            )}

            {/* Step 4: Sparkle of Fertilisation */}
            {currentStepIndex === 3 && (
              <g className="animate-pulse">
                <text x="188" y="222" fontSize="26">✨</text>
              </g>
            )}

            {/* Step 5: Fruit & Seeds labels */}
            {currentStepIndex === 4 && (
              <g>
                <text x="175" y="278" fontSize="11" fontWeight="bold" fill="#7f1d1d">
                  Swollen Fruit 🍎
                </text>
                <text x="178" y="170" fontSize="10" fontWeight="bold" fill="#713f12">
                  Seeds inside 🌰
                </text>
              </g>
            )}
          </svg>

          {/* Current Step Badge overlay */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-emerald-950 border border-emerald-200 shadow-2xs">
            {step.icon} {step.title}
          </div>
        </div>

        {/* Narrative & Explanatory Text (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Stage {step.step} of 5
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
              {step.title}
            </h3>
            <p className="text-xs font-semibold text-amber-800">
              {step.subtitle}
            </p>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed">
            {step.description}
          </p>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-950 font-medium flex items-start gap-2">
            <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <span><strong>Exam Focus:</strong> {step.highlight}</span>
          </div>

          {/* Controller Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex gap-2">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => {
                  setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                  setIsPlaying(false);
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-700"
                title="Previous step"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause size={14} /> Pause
                  </>
                ) : (
                  <>
                    <Play size={14} /> Autoplay
                  </>
                )}
              </button>

              <button
                disabled={currentStepIndex === STORY_STEPS.length - 1}
                onClick={() => {
                  setCurrentStepIndex((prev) => Math.min(STORY_STEPS.length - 1, prev + 1));
                  setIsPlaying(false);
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-700"
                title="Next step"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Step {currentStepIndex + 1} of {STORY_STEPS.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
