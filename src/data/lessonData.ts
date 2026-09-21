import {
  WarmupPollOption,
  PlantItem,
  FlowerPart,
  ProcessStep,
  SeedFruitItem,
  ExitTicketQuestion,
} from '../types';

export interface SlideMeta {
  index: number;
  id: string;
  title: string;
  shortTitle: string;
  type: 'warmup' | 'explanation' | 'task' | 'exit-ticket' | 'summary';
  icon: string;
  maxPoints: number;
}

export const SLIDES_META: SlideMeta[] = [
  {
    index: 0,
    id: 'slide-0-warmup',
    title: 'Warm-up: Do you think every plant has flowers?',
    shortTitle: 'Warm-up Vote',
    type: 'warmup',
    icon: 'HelpCircle',
    maxPoints: 0,
  },
  {
    index: 1,
    id: 'slide-1-explanation-flowering',
    title: 'Lesson Concept: Not all plants produce flowers',
    shortTitle: 'Plant Groups',
    type: 'explanation',
    icon: 'BookOpen',
    maxPoints: 0,
  },
  {
    index: 2,
    id: 'slide-2-task-flower-or-not',
    title: 'Task 1: Does it have a flower?',
    shortTitle: 'Task 1: Flowers?',
    type: 'task',
    icon: 'CheckCircle2',
    maxPoints: 8,
  },
  {
    index: 3,
    id: 'slide-3-explanation-parts',
    title: 'Lesson Concept: The parts of a flower',
    shortTitle: 'Flower Anatomy',
    type: 'explanation',
    icon: 'Layers',
    maxPoints: 0,
  },
  {
    index: 4,
    id: 'slide-4-task-label-flower',
    title: 'Task 2: Label the flower parts',
    shortTitle: 'Task 2: Labeling',
    type: 'task',
    icon: 'Tag',
    maxPoints: 9, // 7 labels + up to 2 speed bonus
  },
  {
    index: 5,
    id: 'slide-5-explanation-pollination',
    title: 'Lesson Concept: From flowers to seeds',
    shortTitle: 'Pollination Story',
    type: 'explanation',
    icon: 'Compass',
    maxPoints: 0,
  },
  {
    index: 6,
    id: 'slide-6-task-order-process',
    title: 'Task 3: Put the process in order',
    shortTitle: 'Task 3: Sequence',
    type: 'task',
    icon: 'ListOrdered',
    maxPoints: 4,
  },
  {
    index: 7,
    id: 'slide-7-task-fruit-matching',
    title: 'Task 4: Where does the seed come from?',
    shortTitle: 'Task 4: Seed & Fruit',
    type: 'task',
    icon: 'Apple',
    maxPoints: 7,
  },
  {
    index: 8,
    id: 'slide-8-exit-ticket',
    title: 'Exit Ticket: Check your knowledge',
    shortTitle: 'Exit Ticket',
    type: 'exit-ticket',
    icon: 'Award',
    maxPoints: 4,
  },
  {
    index: 9,
    id: 'slide-9-summary',
    title: 'Lesson 2 Summary & Gardener Points Certificate',
    shortTitle: 'Final Results',
    type: 'summary',
    icon: 'Trophy',
    maxPoints: 0,
  },
];

// Slide 0: Warmup Poll
export const WARMUP_OPTIONS: WarmupPollOption[] = [
  {
    id: 'yes',
    label: 'Yes, all plants have flowers',
    icon: '🌸',
    hint: 'Think about all the green plants you see in forests and fields!',
  },
  {
    id: 'no',
    label: 'No, some plants do not produce flowers',
    icon: '🌲',
    hint: 'Have you ever spotted a flower on a pine tree or a fern?',
  },
  {
    id: 'not_sure',
    label: "Not sure / Let's find out!",
    icon: '🔍',
    hint: 'A great scientific curiosity attitude!',
  },
];

// Slide 2: Task 1 Plant Data (8 curated plant examples)
export const TASK_1_PLANTS: PlantItem[] = [
  {
    id: 'p1',
    commonName: 'Marigold (Büdöske / Körömvirág)',
    scientificGroup: 'Tagetes',
    hasFlower: true,
    tag: 'Flowering',
    explanation: 'Marigolds have bright yellow and orange blossoms that attract bees and butterflies!',
    imageEmoji: '🌼',
    curriculumFact: 'Flowering plant (Angiosperm). Seeds develop directly inside the faded flower head.',
  },
  {
    id: 'p2',
    commonName: 'Scots Pine (Erdeifenyő)',
    scientificGroup: 'Pinus sylvestris',
    hasFlower: false,
    tag: 'Non-flowering',
    explanation: 'Pines are conifers! They do NOT have flowers. Instead, their seeds grow inside woody cones.',
    imageEmoji: '🌲',
    curriculumFact: 'Non-flowering plant (Gymnosperm / Conifer). Seeds are sheltered by cone scales.',
  },
  {
    id: 'p3',
    commonName: 'Lawn Grass (Pázsitfű)',
    scientificGroup: 'Poaceae',
    hasFlower: true,
    tag: 'Flowering',
    explanation: 'Surprise! Grass DOES produce flowers! They are small, green spikelets that rely on the wind, not colorful petals.',
    imageEmoji: '🌾',
    curriculumFact: 'Flowering plant! Many students think grass has no flowers because the flowers are tiny and green.',
  },
  {
    id: 'p4',
    commonName: 'Bracken Fern (Páfrány)',
    scientificGroup: 'Pteridium',
    hasFlower: false,
    tag: 'Non-flowering',
    explanation: 'Ferns never produce flowers or seeds! They reproduce using microscopic spores on the underside of their fronds.',
    imageEmoji: '🌿',
    curriculumFact: 'Non-flowering spore plant. Check the golden-brown clusters (sori) on the back of fern leaves.',
  },
  {
    id: 'p5',
    commonName: 'Tomato Plant (Paradicsom)',
    scientificGroup: 'Solanum lycopersicum',
    hasFlower: true,
    tag: 'Flowering',
    explanation: 'Tomato plants grow delicate yellow star-shaped flowers. After pollination, the ovary swells into a juicy red tomato!',
    imageEmoji: '🍅',
    curriculumFact: 'Flowering plant! The tomato fruit forms directly from the pollinated flower ovary.',
  },
  {
    id: 'p6',
    commonName: 'Sago Cycad (Cikász / Pálmapáfrány)',
    scientificGroup: 'Cycas revoluta',
    hasFlower: false,
    tag: 'Non-flowering',
    explanation: 'Cycads look like small palms, but they are ancient non-flowering plants that reproduce with large cones!',
    imageEmoji: '🌴',
    curriculumFact: 'Non-flowering ancient gymnosperm that lived alongside dinosaurs over 200 million years ago.',
  },
  {
    id: 'p7',
    commonName: 'Apple Tree (Almafa)',
    scientificGroup: 'Malus domestica',
    hasFlower: true,
    tag: 'Flowering',
    explanation: 'Apple trees bloom with fragrant pink and white blossoms in spring. Each blossom can grow into a tasty apple!',
    imageEmoji: '🍎',
    curriculumFact: 'Flowering tree. The apple fruit protects the small dark brown seeds inside the core.',
  },
  {
    id: 'p8',
    commonName: 'Peat Moss (Tőzegmoha / Moha)',
    scientificGroup: 'Sphagnum',
    hasFlower: false,
    tag: 'Non-flowering',
    explanation: 'Mosses are simple non-flowering plants that have no flowers, seeds, or true roots. They reproduce with tiny spore capsules.',
    imageEmoji: '🌱',
    curriculumFact: 'Non-flowering bryophyte. Spores shoot out into the damp air to grow new moss mats.',
  },
];

// Slide 4: Task 2 - Flower Parts Labeling Data
export const FLOWER_PARTS: FlowerPart[] = [
  {
    id: 'petal',
    name: 'Petal',
    system: 'other',
    systemName: 'Attraction & Protection',
    description: 'Brightly colored, scented leaves that attract pollinators like bees and butterflies.',
    targetX: 24,
    targetY: 28,
  },
  {
    id: 'anther',
    name: 'Anther',
    system: 'male',
    systemName: 'Male Part (Stamen)',
    description: 'The yellow pollen sac on top of the filament where pollen grains are produced.',
    targetX: 20,
    targetY: 48,
  },
  {
    id: 'filament',
    name: 'Filament',
    system: 'male',
    systemName: 'Male Part (Stamen)',
    description: 'The slender stalk that holds the anther up so insects or wind can catch the pollen.',
    targetX: 26,
    targetY: 66,
  },
  {
    id: 'stigma',
    name: 'Stigma',
    system: 'female',
    systemName: 'Female Part (Carpel / Pistil)',
    description: 'The sticky top surface of the female carpel designed to catch landing pollen grains.',
    targetX: 50,
    targetY: 20,
  },
  {
    id: 'style',
    name: 'Style',
    system: 'female',
    systemName: 'Female Part (Carpel / Pistil)',
    description: 'The tube-like neck connecting the sticky stigma to the ovary below.',
    targetX: 50,
    targetY: 46,
  },
  {
    id: 'ovary',
    name: 'Ovary',
    system: 'female',
    systemName: 'Female Part (Carpel / Pistil)',
    description: 'The swollen base containing ovules (unfertilised egg cells) that will develop into seeds & fruit.',
    targetX: 50,
    targetY: 72,
  },
  {
    id: 'sepal',
    name: 'Sepal',
    system: 'other',
    systemName: 'Attraction & Protection',
    description: 'The tough green leaf-like structures at the base that protect the young flower bud before opening.',
    targetX: 78,
    targetY: 76,
  },
];

// Slide 6: Task 3 - Pollination Process Order (Scrambled)
export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'step-1',
    correctOrder: 1,
    title: 'Pollen lands on the sticky stigma',
    detail: 'A pollinator (bee, butterfly) or the wind brushes pollen grains from an anther onto the sticky surface of the stigma.',
    icon: '🐝',
  },
  {
    id: 'step-2',
    correctOrder: 2,
    title: 'A pollen tube grows down through the style',
    detail: 'A microscopic tube grows from the pollen grain down through the neck (style) heading directly into the ovary.',
    icon: '🧪',
  },
  {
    id: 'step-3',
    correctOrder: 3,
    title: 'Fertilisation takes place inside the ovary',
    detail: 'The pollen cell joins with an ovule inside the ovary. Now the fertilised ovule can begin transforming into a seed!',
    icon: '✨',
  },
  {
    id: 'step-4',
    correctOrder: 4,
    title: 'Petals wither, and the ovary swells into a fruit',
    detail: 'The colourful petals wither and fall off. The ovary swells into a protective fruit or seed pod carrying seeds inside.',
    icon: '🍎',
  },
];

// Slide 7: Task 4 - Seed & Fruit Matching
export const SEED_FRUIT_ITEMS: SeedFruitItem[] = [
  {
    id: 'sf-tomato',
    plantName: 'Tomato',
    fruitType: 'Berry (fleshy fruit with seeds scattered inside)',
    fruitCategory: 'Berry',
    description: 'Juicy, fleshy fruit containing dozens of small seeds suspended in jelly-like pockets.',
    seedDetail: 'Each tiny seed can sprout a new tomato bush after passing safely through an animal.',
    emoji: '🍅',
  },
  {
    id: 'sf-avocado',
    plantName: 'Avocado',
    fruitType: 'Single-seeded fleshy fruit (Stone fruit / Drupe)',
    fruitCategory: 'Fleshy Fruit / Drupe',
    description: 'Creamy green flesh surrounding one giant, hard seed right in the middle.',
    seedDetail: 'The large seed contains lots of stored energy so the seedling can sprout in shaded rainforests.',
    emoji: '🥑',
  },
  {
    id: 'sf-peanuts',
    plantName: 'Peanut (Földimogyoró)',
    fruitType: 'Underground Pod (Legume)',
    fruitCategory: 'Pod (Legume)',
    description: 'A bumpy, fibrous pod that pushes down into the soil to ripen underground.',
    seedDetail: 'Inside each cracked shell are 2 to 3 edible seeds rich in oils and proteins.',
    emoji: '🥜',
  },
  {
    id: 'sf-poppy',
    plantName: 'Poppy (Mák)',
    fruitType: 'Pepper-pot Shaker Capsule',
    fruitCategory: 'Shaker Capsule',
    description: 'A dry, crown-topped capsule with tiny pores around the rim that sway in the breeze.',
    seedDetail: 'When the wind shakes the stem, hundreds of tiny round seeds scatter like salt from a shaker!',
    emoji: '🌸',
  },
  {
    id: 'sf-carob',
    plantName: 'Carob (Szentjánoskenyér)',
    fruitType: 'Long Leathery Pod',
    fruitCategory: 'Pod (Legume)',
    description: 'A tough, brown pod filled with sweet pulp and remarkably uniform, hard seeds.',
    seedDetail: 'Ancient merchants used carob seeds as standard weights—giving us the gemstone unit "carat"!',
    emoji: '🍫',
  },
  {
    id: 'sf-dates',
    plantName: 'Date Palm (Datolya)',
    fruitType: 'Sweet fleshy fruit with hard stone seed',
    fruitCategory: 'Fleshy Fruit / Drupe',
    description: 'Rich, honey-sweet desert fruit wrapped around a single grooved woody seed.',
    seedDetail: 'Desert animals eat the sweet flesh and drop the tough seed far from the mother palm.',
    emoji: '🌴',
  },
  {
    id: 'sf-dandelion',
    plantName: 'Dandelion (Pitypang)',
    fruitType: 'Wind-dispersed Parachute Fruit (Achene with pappus)',
    fruitCategory: 'Wind Parachute',
    description: 'A dry fruit attached to a delicate umbrella of feathery white hairs called a pappus.',
    seedDetail: 'The tiny seed rides gentle air currents for miles across meadows!',
    emoji: '💨',
  },
];

// Fruit categories for matching options
export const FRUIT_CATEGORIES: Array<{
  category: SeedFruitItem['fruitCategory'];
  label: string;
  badgeColor: string;
  icon: string;
  description: string;
}> = [
  {
    category: 'Berry',
    label: 'Berry (Soft Flesh, Multiple Seeds)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: '🍇',
    description: 'Fleshy all the way through, multiple seeds scattered inside (e.g. tomato).',
  },
  {
    category: 'Fleshy Fruit / Drupe',
    label: 'Stone Fruit / Single-Seed Flesh',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: '🥑',
    description: 'Soft edible flesh protecting one large, hard central seed (e.g. avocado, date).',
  },
  {
    category: 'Pod (Legume)',
    label: 'Pod / Legume (Protective Shell)',
    badgeColor: 'bg-lime-100 text-lime-800 border-lime-300',
    icon: '🥜',
    description: 'A dry or leathery pod that splits open to reveal seeds in a line (e.g. peanuts, carob).',
  },
  {
    category: 'Shaker Capsule',
    label: 'Shaker Capsule (Pores for Wind)',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: '🏺',
    description: 'A dry cup with holes at the top that shakes seeds out in strong wind (e.g. poppy).',
  },
  {
    category: 'Wind Parachute',
    label: 'Wind Parachute (Feathery Pappus)',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    icon: '🪂',
    description: 'Tiny dry fruit attached to feathery hairs designed to glide on the wind (e.g. dandelion).',
  },
];

// Slide 8: Exit Ticket Questions (Cambridge Primary Science Stage 5-6)
export const EXIT_TICKET_QUESTIONS: ExitTicketQuestion[] = [
  {
    id: 'q1',
    category: 'flowering',
    question: 'Which of these plants does NOT have flowers and reproduces using spores on the back of its leaves?',
    options: ['Bracken Fern', 'Apple Tree', 'Tomato Plant', 'Lawn Grass'],
    correctIndex: 0,
    explanation: 'Ferns are non-flowering spore plants! Apple trees, tomatoes, and even grass all produce flowers and seeds.',
  },
  {
    id: 'q2',
    category: 'flower-parts',
    question: 'Which two parts make up the stamen (the male part of a flower)?',
    options: [
      'Anther + Filament (produces pollen)',
      'Stigma + Style (catches pollen)',
      'Petal + Sepal (protects the bud)',
      'Ovary + Ovule (forms seeds)',
    ],
    correctIndex: 0,
    explanation: 'The stamen consists of the anther (where pollen is made) and the filament (the stalk that holds it up).',
  },
  {
    id: 'q3',
    category: 'pollination',
    question: 'What is the correct scientific sequence from pollination to fruit formation?',
    options: [
      'Pollen lands on stigma → Pollen tube grows down style → Fertilisation in ovary → Ovary swells into fruit',
      'Ovary becomes fruit → Pollen lands on petal → Filament grows into soil → Seeds fall off',
      'Pollen tube grows → Stigma withers → Anther becomes seed → Petals turn into leaves',
      'Fertilisation occurs → Pollen travels to root → Style produces seeds → Flowers open',
    ],
    correctIndex: 0,
    explanation: 'Pollination happens first (pollen on stigma), followed by the tube growing down the style, fertilisation of the ovule, and then ovary swelling into the fruit.',
  },
  {
    id: 'q4',
    category: 'seeds-fruits',
    question: 'After fertilisation, what part of the flower swells to protect the developing seeds and form a fruit or pod?',
    options: ['The Ovary', 'The Petal', 'The Anther', 'The Sepal'],
    correctIndex: 0,
    explanation: 'The ovary swells and thickens to become the fruit or pod, while the fertilised ovules inside turn into seeds!',
  },
];
