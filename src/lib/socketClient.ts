import { SessionState, Student } from '../types';

type Listener<T> = (data: T) => void;

const STORAGE_ANSWERS_KEY = 'cambridge_lesson_answers';
const STORAGE_PROFILE_KEY = 'gardener_student_profile';
const STORAGE_SLIDE_KEY = 'cambridge_current_slide';

class RealtimeClient {
  private role: 'teacher' | 'student' = 'student';
  private studentData: { id: string; name: string; avatar: string } = {
    id: 'student_local',
    name: 'Diák',
    avatar: '🌱',
  };

  // Listeners
  private stateListeners: Set<Listener<SessionState>> = new Set();
  private studentListListeners: Set<Listener<Student[]>> = new Set();
  private slideListeners: Set<Listener<number>> = new Set();
  private pointsListeners: Set<Listener<{ studentId: string; points: number; reason: string; totalPoints: number }>> = new Set();
  private lockListeners: Set<Listener<boolean>> = new Set();
  private celebrationListeners: Set<Listener<string>> = new Set();
  private connectionListeners: Set<Listener<boolean>> = new Set();

  // Cached state
  public currentState: SessionState = {
    currentSlideIndex: 0,
    isLocked: false,
    lessonId: 'cambridge-sci-stage5-l2',
    lessonTitle: 'Our Living World — Lesson 2: Flowers, Seeds & Fruits',
    totalSlides: 10,
    activeStudentsCount: 1,
    startedAt: Date.now(),
  };

  public students: Student[] = [];
  public currentStudent: Student;
  public isConnected = true;

  constructor() {
    // 1. Load or create student profile
    try {
      const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (savedProfile) {
        this.studentData = JSON.parse(savedProfile);
      }
    } catch (e) {
      // ignore
    }

    // 2. Load saved answers if any
    let initialAnswers: Record<string, any> = {};
    try {
      const savedAnswers = localStorage.getItem(STORAGE_ANSWERS_KEY);
      if (savedAnswers) {
        initialAnswers = JSON.parse(savedAnswers);
      }
    } catch (e) {
      // ignore
    }

    // 3. Load saved slide index if any
    try {
      const savedSlide = localStorage.getItem(STORAGE_SLIDE_KEY);
      if (savedSlide !== null) {
        const parsed = parseInt(savedSlide, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < 10) {
          this.currentState.currentSlideIndex = parsed;
        }
      }
    } catch (e) {
      // ignore
    }

    const calculatedPoints = this.calculateTotalPoints(initialAnswers);

    this.currentStudent = {
      id: this.studentData.id,
      name: this.studentData.name,
      avatar: this.studentData.avatar,
      points: calculatedPoints,
      lessonPoints: calculatedPoints,
      answers: initialAnswers,
      connected: true,
      joinedAt: Date.now(),
      lastActive: Date.now(),
    };

    this.students = [this.currentStudent];
  }

  private calculateTotalPoints(answers: Record<string, any>): number {
    let total = 0;
    // Task 1: slide-2-task-flower-or-not
    if (answers['slide-2-task-flower-or-not']?.scoreEarned) {
      total += Math.min(1, answers['slide-2-task-flower-or-not'].scoreEarned);
    }
    // Task 2: slide-4-task-label-flower
    if (answers['slide-4-task-label-flower']?.scoreEarned) {
      total += Math.min(1, answers['slide-4-task-label-flower'].scoreEarned);
    }
    // Task 3: slide-6-task-order-process
    if (answers['slide-6-task-order-process']?.scoreEarned) {
      total += Math.min(1, answers['slide-6-task-order-process'].scoreEarned);
    }
    // Task 4: slide-7-task-fruit-matching
    if (answers['slide-7-task-fruit-matching']?.scoreEarned) {
      total += Math.min(1, answers['slide-7-task-fruit-matching'].scoreEarned);
    }
    // Task 5: slide-8-exit-ticket
    if (answers['slide-8-exit-ticket']?.scoreEarned) {
      total += Math.min(1, answers['slide-8-exit-ticket'].scoreEarned);
    }
    return Math.min(5, total);
  }

  public saveStudentProfile(name: string, avatar: string): { id: string; name: string; avatar: string } {
    const profile = { id: this.studentData.id || 'student_local', name, avatar };
    this.studentData = profile;
    this.currentStudent.name = name;
    this.currentStudent.avatar = avatar;
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
    this.notifyStudents();
    return profile;
  }

  public getSavedStudent() {
    return this.studentData;
  }

  public connect(role: 'teacher' | 'student', studentData?: { id: string; name: string; avatar: string }) {
    this.role = role;
    if (studentData) {
      this.studentData = studentData;
      this.currentStudent.name = studentData.name;
      this.currentStudent.avatar = studentData.avatar;
    }
    this.isConnected = true;
    this.notifyConnection(true);
    this.notifyStudents();
    this.notifyState();
  }

  public setSlide(slideIndex: number) {
    const validIdx = Math.max(0, Math.min(this.currentState.totalSlides - 1, slideIndex));
    this.currentState.currentSlideIndex = validIdx;
    try {
      localStorage.setItem(STORAGE_SLIDE_KEY, validIdx.toString());
    } catch (e) {
      // ignore
    }
    this.notifySlide(validIdx);
    this.notifyState();
  }

  public nextSlide() {
    this.setSlide(this.currentState.currentSlideIndex + 1);
  }

  public prevSlide() {
    this.setSlide(this.currentState.currentSlideIndex - 1);
  }

  public submitAnswer(slideId: string, slideIndex: number, data: any, scoreEarned: number) {
    const normalizedScore = Math.min(1, Math.max(0, scoreEarned));
    
    this.currentStudent.answers = {
      ...this.currentStudent.answers,
      [slideId]: {
        slideId,
        slideIndex,
        submittedAt: Date.now(),
        data,
        scoreEarned: normalizedScore,
      },
    };

    const newTotal = this.calculateTotalPoints(this.currentStudent.answers);
    this.currentStudent.points = newTotal;
    this.currentStudent.lessonPoints = newTotal;
    this.currentStudent.lastActive = Date.now();

    try {
      localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(this.currentStudent.answers));
    } catch (e) {
      // ignore
    }

    this.students = [{ ...this.currentStudent }];
    this.notifyStudents();

    if (normalizedScore > 0) {
      this.notifyPointsAwarded({
        studentId: this.currentStudent.id,
        points: normalizedScore,
        reason: 'Helyes válasz! +1 pont feljegyezve 🌱',
        totalPoints: newTotal,
      });
    }
  }

  public awardBonus(_studentId: string, _points: number, _reason: string) {
    // No-op or optional local point bump
  }

  public awardClassBonus(_points: number, _reason: string) {
    // No-op
  }

  public toggleLock(isLocked: boolean) {
    this.currentState.isLocked = isLocked;
    this.notifyLock(isLocked);
    this.notifyState();
  }

  public triggerCelebration() {
    this.celebrationListeners.forEach((fn) => fn('Gratulálunk a teljesítéshez! 🎉'));
  }

  public resetSession() {
    try {
      localStorage.removeItem(STORAGE_ANSWERS_KEY);
      localStorage.removeItem(STORAGE_SLIDE_KEY);
    } catch (e) {
      // ignore
    }

    this.currentStudent.answers = {};
    this.currentStudent.points = 0;
    this.currentStudent.lessonPoints = 0;
    this.students = [{ ...this.currentStudent }];
    this.currentState.currentSlideIndex = 0;

    this.notifySlide(0);
    this.notifyStudents();
    this.notifyState();
  }

  // Event subscription hooks
  public onStateChange(fn: Listener<SessionState>) {
    this.stateListeners.add(fn);
    fn(this.currentState);
    return () => this.stateListeners.delete(fn);
  }

  public onSlideChange(fn: Listener<number>) {
    this.slideListeners.add(fn);
    fn(this.currentState.currentSlideIndex);
    return () => this.slideListeners.delete(fn);
  }

  public onStudentsChange(fn: Listener<Student[]>) {
    this.studentListListeners.add(fn);
    fn(this.students);
    return () => this.studentListListeners.delete(fn);
  }

  public onPointsAwarded(fn: Listener<{ studentId: string; points: number; reason: string; totalPoints: number }>) {
    this.pointsListeners.add(fn);
    return () => this.pointsListeners.delete(fn);
  }

  public onLockChange(fn: Listener<boolean>) {
    this.lockListeners.add(fn);
    fn(this.currentState.isLocked);
    return () => this.lockListeners.delete(fn);
  }

  public onCelebration(fn: Listener<string>) {
    this.celebrationListeners.add(fn);
    return () => this.celebrationListeners.delete(fn);
  }

  public onConnectionChange(fn: Listener<boolean>) {
    this.connectionListeners.add(fn);
    fn(this.isConnected);
    return () => this.connectionListeners.delete(fn);
  }

  private notifyState() {
    this.stateListeners.forEach((fn) => fn({ ...this.currentState }));
  }

  private notifyStudents() {
    this.studentListListeners.forEach((fn) => fn([...this.students]));
  }

  private notifySlide(slideIndex: number) {
    this.slideListeners.forEach((fn) => fn(slideIndex));
  }

  private notifyLock(isLocked: boolean) {
    this.lockListeners.forEach((fn) => fn(isLocked));
  }

  private notifyPointsAwarded(data: { studentId: string; points: number; reason: string; totalPoints: number }) {
    this.pointsListeners.forEach((fn) => fn(data));
  }

  private notifyConnection(connected: boolean) {
    this.connectionListeners.forEach((fn) => fn(connected));
  }
}

export const realtime = new RealtimeClient();
