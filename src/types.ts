/**
 * Type definitions for Cambridge Primary Science "Our Living World" Lesson 2
 */

export type UserRole = 'teacher' | 'student';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  points: number; // Running total Gardener points
  lessonPoints: number; // Points earned in this specific session
  answers: Record<string, StudentSlideAnswer>;
  connected: boolean;
  joinedAt: number;
  lastActive: number;
}

export interface StudentSlideAnswer {
  slideId: string;
  slideIndex: number;
  submittedAt: number;
  data: any;
  isCorrect?: boolean;
  scoreEarned: number;
}

export interface SessionState {
  currentSlideIndex: number;
  isLocked: boolean;
  lessonId: string;
  lessonTitle: string;
  totalSlides: number;
  activeStudentsCount: number;
  startedAt: number;
}

// Slide 0: Warmup Poll
export interface WarmupPollOption {
  id: 'yes' | 'no' | 'not_sure';
  label: string;
  icon: string;
  hint: string;
}

// Slide 1 & 3 & 5: Teacher explanations
export interface ExplanationConcept {
  title: string;
  summary: string;
  keyTerms: Array<{ term: string; definition: string; icon?: string }>;
  funFact?: string;
}

// Slide 2: Task 1 - Does it have a flower?
export interface PlantItem {
  id: string;
  commonName: string;
  scientificGroup: string;
  hasFlower: boolean;
  explanation: string;
  imageEmoji: string;
  imageUrl?: string;
  tag: 'Flowering' | 'Non-flowering';
  curriculumFact: string;
}

// Slide 4: Task 2 - Flower Parts Labeling
export interface FlowerPart {
  id: string;
  name: string;
  system: 'male' | 'female' | 'other';
  systemName: string;
  description: string;
  targetX: number; // percentage coordinates on diagram
  targetY: number;
}

// Slide 6: Task 3 - Order the pollination process
export interface ProcessStep {
  id: string;
  correctOrder: number;
  title: string;
  detail: string;
  icon: string;
}

// Slide 7: Task 4 - Fruit and Seed matching
export interface SeedFruitItem {
  id: string;
  plantName: string;
  fruitType: string;
  fruitCategory: 'Berry' | 'Pod (Legume)' | 'Fleshy Fruit / Drupe' | 'Shaker Capsule' | 'Wind Parachute';
  description: string;
  seedDetail: string;
  emoji: string;
  imageUrl?: string;
}

// Slide 8: Exit ticket question
export interface ExitTicketQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'flowering' | 'flower-parts' | 'pollination' | 'seeds-fruits';
}

// WebSocket message protocols
export type WSClientMessage =
  | { type: 'JOIN'; role: UserRole; studentId?: string; name?: string; avatar?: string }
  | { type: 'SET_SLIDE'; slideIndex: number }
  | { type: 'NEXT_SLIDE' }
  | { type: 'PREV_SLIDE' }
  | { type: 'SUBMIT_ANSWER'; slideId: string; slideIndex: number; data: any; scoreEarned: number }
  | { type: 'AWARD_BONUS'; studentId: string; points: number; reason: string }
  | { type: 'AWARD_CLASS_BONUS'; points: number; reason: string }
  | { type: 'TOGGLE_LOCK'; isLocked: boolean }
  | { type: 'TRIGGER_CONFETTI' }
  | { type: 'RESET_SESSION' };

export type WSServerMessage =
  | { type: 'INIT_STATE'; session: SessionState; students: Student[]; currentStudent?: Student }
  | { type: 'SLIDE_CHANGED'; slideIndex: number }
  | { type: 'STUDENTS_UPDATED'; students: Student[] }
  | { type: 'ANSWER_RECEIVED'; studentId: string; slideId: string; answer: StudentSlideAnswer }
  | { type: 'POINTS_AWARDED'; studentId: string; points: number; reason: string; totalPoints: number }
  | { type: 'LOCK_UPDATED'; isLocked: boolean }
  | { type: 'CELEBRATION'; message: string };
