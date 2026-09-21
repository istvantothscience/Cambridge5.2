import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ChevronRight, Info } from 'lucide-react';

interface Slide1NonFloweringProps {
  isTeacher: boolean;
}

export const Slide1NonFlowering: React.FC<Slide1NonFloweringProps> = ({ isTeacher }) => {
  const [activeTab, setActiveTab] = useState<'flowering' | 'nonflowering'>('flowering');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <BookOpen size={14} />
          Cambridge Primary Science • Concept 1
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-emerald-950 tracking-tight">
          Not all plants produce flowers!
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          While millions of plants brighten our planet with blossoms, nature has developed diverse ways for green plants to reproduce.
        </p>
      </div>

      {/* Common Plant Anatomy Bar */}
      <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-sm">
            🌱 Fundamental Rule
          </span>
          <h2 className="font-heading font-bold text-slate-800 text-lg">
            What ALL green plants share in common
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <strong className="block text-emerald-950 font-bold">1. Leaves</strong>
              <span className="text-slate-600 text-xs leading-relaxed">
                Contain green chlorophyll to trap sunlight and make plant food through photosynthesis.
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3">
            <span className="text-2xl">🪵</span>
            <div>
              <strong className="block text-emerald-950 font-bold">2. Stem / Trunk</strong>
              <span className="text-slate-600 text-xs leading-relaxed">
                Supports the plant upright and acts like a pipeline transporting water & minerals up to the leaves.
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3">
            <span className="text-2xl">🥔</span>
            <div>
              <strong className="block text-emerald-950 font-bold">3. Roots</strong>
              <span className="text-slate-600 text-xs leading-relaxed">
                Anchor the plant firmly into the soil while absorbing vital water and dissolved nutrients.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Groups Comparison Card */}
      <div className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Two Primary Plant Groups
            </span>
            <h3 className="font-heading font-bold text-2xl text-slate-900">
              How plants reproduce
            </h3>
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start">
            <button
              onClick={() => setActiveTab('flowering')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'flowering'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌸 1. Flowering Plants
            </button>
            <button
              onClick={() => setActiveTab('nonflowering')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'nonflowering'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌲 2. Non-Flowering Plants
            </button>
          </div>
        </div>

        {/* Content depending on active tab */}
        {activeTab === 'flowering' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Sparkles size={13} /> Most common group on Earth (Angiosperms)
              </div>
              <h4 className="text-xl font-heading font-bold text-slate-900">
                Seeds form directly inside the <span className="bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-950 font-extrabold underline decoration-amber-500">flower</span>!
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Flowering plants produce colorful or scented flowers to attract pollinators like bees, birds, and wind. After pollination and fertilisation, the base of the flower develops into a fruit that holds the protected <span className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900 font-bold">seed</span>.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span><strong>Examples:</strong> Sunflowers, Apple Trees, Roses, Tomatoes, Marigolds.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span><strong>Yes, even Grass!</strong> Lawn grass produces tiny green wind flowers.</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 via-emerald-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/70 text-center space-y-3">
              <div className="text-6xl select-none animate-bounce">🌻</div>
              <div className="font-heading font-bold text-slate-800 text-lg">
                The Flower is the Reproductive Organ
              </div>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Flower blossoms have specialized male and female parts that collaborate to create seeds.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-full bg-white text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
                  Key Word: Flower 🌸
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
                  Key Word: Seed 🌰
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Sparkles size={13} /> Ancient Plant Families (Gymnosperms & Spore Plants)
              </div>
              <h4 className="text-xl font-heading font-bold text-slate-900">
                Cones with seeds, or microscopic spores!
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Non-flowering plants never blossom. Instead, they use two unique reproduction strategies:
              </p>

              <div className="space-y-3 pt-1 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1">
                    <span className="text-lg">🌲</span>
                    <span>1. Conifers (Pines, Firs, Cycads):</span>
                  </div>
                  <p className="text-slate-600">
                    Produce seeds inside tough, woody <span className="bg-amber-200 px-1 py-0.5 rounded font-bold text-amber-950">cones</span> rather than flowers.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1">
                    <span className="text-lg">🌿</span>
                    <span>2. Ferns & Mosses:</span>
                  </div>
                  <p className="text-slate-600">
                    Do not produce seeds at all! Instead, they make microscopic single-celled <span className="bg-emerald-200 px-1 py-0.5 rounded font-bold text-emerald-950">spores</span> in capsules on the underside of their leaves.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-200/70 text-center space-y-3">
              <div className="text-6xl select-none">🌲</div>
              <div className="font-heading font-bold text-slate-800 text-lg">
                No Petals, No Nectar!
              </div>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Wind carries pollen directly into cone scales, or rain splashes spores into moist damp ground.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-full bg-white text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
                  Key Word: Cone 🌲
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
                  Key Word: Spore 🔬
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vocabulary Flashcard Pill strip */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-950 font-bold">
          <Info size={16} className="text-amber-700 shrink-0" />
          <span>Lesson 2 Key Vocabulary:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold">
            🌸 Flower
          </span>
          <span className="px-3 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold">
            🌰 Seed
          </span>
          <span className="px-3 py-1 rounded-lg bg-white border border-lime-300 text-lime-900 font-bold">
            🌲 Cone
          </span>
          <span className="px-3 py-1 rounded-lg bg-white border border-teal-300 text-teal-900 font-bold">
            🔬 Spore
          </span>
        </div>
      </div>
    </div>
  );
};
