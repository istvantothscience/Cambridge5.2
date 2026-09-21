import React, { useState } from 'react';
import { Layers, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { FLOWER_PARTS } from '../../data/lessonData';

interface Slide3FlowerPartsProps {
  isTeacher: boolean;
}

export const Slide3FlowerParts: React.FC<Slide3FlowerPartsProps> = ({ isTeacher }) => {
  const [selectedPartId, setSelectedPartId] = useState<string>('anther');
  const [activeSystemFilter, setActiveSystemFilter] = useState<'all' | 'male' | 'female' | 'other'>('all');

  const selectedPart = FLOWER_PARTS.find((p) => p.id === selectedPartId) || FLOWER_PARTS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <Layers size={14} />
          Cambridge Primary Science • Concept 2
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-emerald-950 tracking-tight">
          The parts of a flower
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          A flower is a specialized reproductive structure with distinct male and female organs designed to produce seeds.
        </p>
      </div>

      {/* Main Anatomy Diagram & Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive SVG Diagram (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-emerald-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Interactive Cross-Section Diagram
            </span>

            {/* Filter buttons for Male / Female systems */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveSystemFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeSystemFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Parts
              </button>
              <button
                onClick={() => setActiveSystemFilter('male')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeSystemFilter === 'male'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                ♂ Male (Stamen)
              </button>
              <button
                onClick={() => setActiveSystemFilter('female')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeSystemFilter === 'female'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-800 hover:text-emerald-950'
                }`}
              >
                ♀ Female (Carpel)
              </button>
            </div>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-amber-50/40 via-emerald-50/30 to-emerald-100/40 rounded-2xl border border-emerald-100 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 500 380" className="w-full h-full select-none">
              <defs>
                {/* Petal gradient */}
                <radialGradient id="petalGrad" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#fecdd3" />
                  <stop offset="100%" stopColor="#fb7185" />
                </radialGradient>
                {/* Ovary gradient */}
                <radialGradient id="ovaryGrad" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#dcfce7" />
                  <stop offset="100%" stopColor="#86efac" />
                </radialGradient>
              </defs>

              {/* Stem / Receptacle */}
              <path d="M 235 340 L 265 340 L 260 380 L 240 380 Z" fill="#2d6a4f" />
              <ellipse cx="250" cy="335" rx="35" ry="14" fill="#40916c" />

              {/* Sepals (green leaflets at base) */}
              <g opacity={activeSystemFilter === 'female' || activeSystemFilter === 'male' ? 0.4 : 1}>
                <path
                  d="M 215 330 C 170 340, 130 320, 140 290 C 170 310, 200 320, 225 328 Z"
                  fill="#52b788"
                  stroke="#2d6a4f"
                  strokeWidth="2"
                />
                <path
                  d="M 285 330 C 330 340, 370 320, 360 290 C 330 310, 300 320, 275 328 Z"
                  fill="#52b788"
                  stroke="#2d6a4f"
                  strokeWidth="2"
                />
              </g>

              {/* Petals (outer bloom) */}
              <g opacity={activeSystemFilter === 'male' || activeSystemFilter === 'female' ? 0.35 : 1}>
                {/* Left Petal */}
                <path
                  d="M 215 315 C 120 280, 60 180, 110 110 C 160 150, 190 220, 215 285 Z"
                  fill="url(#petalGrad)"
                  stroke="#e11d48"
                  strokeWidth="2"
                />
                {/* Right Petal */}
                <path
                  d="M 285 315 C 380 280, 440 180, 390 110 C 340 150, 310 220, 285 285 Z"
                  fill="url(#petalGrad)"
                  stroke="#e11d48"
                  strokeWidth="2"
                />
                {/* Upper Left Petal */}
                <path
                  d="M 215 260 C 140 190, 140 90, 210 60 C 230 110, 230 180, 225 240 Z"
                  fill="#fda4af"
                  stroke="#e11d48"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
                {/* Upper Right Petal */}
                <path
                  d="M 285 260 C 360 190, 360 90, 290 60 C 270 110, 270 180, 275 240 Z"
                  fill="#fda4af"
                  stroke="#e11d48"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
              </g>

              {/* Female Carpel (Stigma + Style + Ovary + Ovules) in center */}
              <g opacity={activeSystemFilter === 'male' ? 0.25 : 1}>
                {/* Ovary (swollen base) */}
                <ellipse
                  cx="250"
                  cy="290"
                  rx="38"
                  ry="42"
                  fill="url(#ovaryGrad)"
                  stroke="#15803d"
                  strokeWidth="3"
                />
                {/* Ovules inside ovary */}
                <circle cx="240" cy="285" r="7" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                <circle cx="260" cy="285" r="7" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                <circle cx="250" cy="302" r="7" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />

                {/* Style (neck) */}
                <path
                  d="M 243 252 L 243 130 L 257 130 L 257 252 Z"
                  fill="#86efac"
                  stroke="#15803d"
                  strokeWidth="2"
                />

                {/* Stigma (sticky lobes at the top) */}
                <path
                  d="M 235 125 C 230 105, 245 95, 250 102 C 255 95, 270 105, 265 125 Z"
                  fill="#f59e0b"
                  stroke="#b45309"
                  strokeWidth="2.5"
                />
                {/* Sticky dew droplets on stigma */}
                <circle cx="244" cy="110" r="3" fill="#fef08a" />
                <circle cx="256" cy="110" r="3" fill="#fef08a" />
              </g>

              {/* Male Stamens (Anther + Filament) */}
              <g opacity={activeSystemFilter === 'female' ? 0.25 : 1}>
                {/* Left Stamen */}
                <path
                  d="M 230 300 Q 170 240 180 160"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="180"
                  cy="150"
                  rx="16"
                  ry="10"
                  fill="#fbbf24"
                  stroke="#b45309"
                  strokeWidth="2"
                  transform="rotate(-20 180 150)"
                />
                {/* Pollen dust dots */}
                <circle cx="177" cy="147" r="1.5" fill="#78350f" />
                <circle cx="183" cy="151" r="1.5" fill="#78350f" />

                {/* Right Stamen */}
                <path
                  d="M 270 300 Q 330 240 320 160"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="320"
                  cy="150"
                  rx="16"
                  ry="10"
                  fill="#fbbf24"
                  stroke="#b45309"
                  strokeWidth="2"
                  transform="rotate(20 320 150)"
                />
                {/* Pollen dust dots */}
                <circle cx="317" cy="147" r="1.5" fill="#78350f" />
                <circle cx="323" cy="151" r="1.5" fill="#78350f" />
              </g>
            </svg>

            {/* Clickable interactive hotspots on diagram */}
            <div className="absolute inset-0 pointer-events-auto">
              {FLOWER_PARTS.map((p) => {
                const isSelected = selectedPartId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPartId(p.id)}
                    style={{ left: `${p.targetX}%`, top: `${p.targetY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-800 text-white ring-4 ring-amber-300 scale-110 z-20'
                        : 'bg-white/95 text-slate-800 hover:bg-emerald-50 border border-slate-300 hover:scale-105 z-10'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Detailed Anatomy Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-emerald-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                selectedPart.system === 'male'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : selectedPart.system === 'female'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {selectedPart.systemName}
              </span>
              <h3 className="text-2xl font-heading font-bold text-slate-900 mt-1">
                {selectedPart.name}
              </h3>
            </div>
            <span className="text-3xl">
              {selectedPart.system === 'male' ? '🌾' : selectedPart.system === 'female' ? '🏺' : '🌸'}
            </span>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed">
            {selectedPart.description}
          </p>

          {/* Key System Summary Box */}
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3 text-xs">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-600" />
              Cambridge Curriculum Key Rule:
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                <strong className="text-amber-900 font-bold block mb-0.5">
                  1. The Male Part: Stamen
                </strong>
                <span className="text-slate-600">
                  Formed by the <strong>Anther</strong> (pollen producer) + <strong>Filament</strong> (supporting stalk).
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                <strong className="text-emerald-900 font-bold block mb-0.5">
                  2. The Female Part: Carpel (Pistil)
                </strong>
                <span className="text-slate-600">
                  Formed by the <strong>Stigma</strong> (sticky pollen catcher) + <strong>Style</strong> (connecting neck) + <strong>Ovary</strong> (contains ovules).
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                <strong className="text-rose-900 font-bold block mb-0.5">
                  3. Outer Protective Parts:
                </strong>
                <span className="text-slate-600">
                  <strong>Petals</strong> (bright colors attract insects) and <strong>Sepals</strong> (green leaflets protecting the bud).
                </span>
              </div>
            </div>
          </div>

          {/* Quick select list of all parts */}
          <div className="space-y-1 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Click to examine any part:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FLOWER_PARTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPartId(p.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedPartId === p.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
