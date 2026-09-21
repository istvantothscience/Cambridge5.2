import { SessionState, Student, WSClientMessage, WSServerMessage } from '../types';
import {
  saveSessionToSupabase,
  loadSessionFromSupabase,
  saveStudentToSupabase,
  loadStudentsFromSupabase,
  subscribeToSupabaseSession,
  subscribeToSupabaseStudents,
  getSupabaseConfig,
} from './supabase';

type Listener<T> = (data: T) => void;

class RealtimeClient {
  private ws: WebSocket | null = null;
  private reconnectTimeout: any = null;
  private isConnecting = false;
  private role: 'teacher' | 'student' = 'student';
  private studentData: { id: string; name: string; avatar: string } | null = null;

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
    activeStudentsCount: 0,
    startedAt: Date.now(),
  };

  public students: Student[] = [];
  public currentStudent: Student | null = null;
  public isConnected = false;

  constructor() {
    this.loadSavedStudent();
  }

  private loadSavedStudent() {
    try {
      const saved = localStorage.getItem('gardener_student_profile');
      if (saved) {
        this.studentData = JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
  }

  public saveStudentProfile(name: string, avatar: string): { id: string; name: string; avatar: string } {
    let id = this.studentData?.id;
    if (!id) {
      id = 'student_' + Math.random().toString(36).substring(2, 9);
    }
    const profile = { id, name, avatar };
    this.studentData = profile;
    try {
      localStorage.setItem('gardener_student_profile', JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
    return profile;
  }

  public getSavedStudent() {
    return this.studentData;
  }

  public connect(role: 'teacher' | 'student', studentData?: { id: string; name: string; avatar: string }) {
    this.role = role;
    if (studentData) {
      this.studentData = studentData;
    }

    // Also connect to Supabase if configured
    this.initSupabaseSync();

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      // already active, re-send JOIN
      this.sendJoin();
      return;
    }

    this.isConnecting = true;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.isConnecting = false;
        this.notifyConnection(true);
        this.sendJoin();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg: WSServerMessage = JSON.parse(event.data);
          this.handleServerMessage(msg);
        } catch (err) {
          console.error('Failed to parse WS message:', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.isConnecting = false;
        this.notifyConnection(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        // will trigger onclose
      };
    } catch (err) {
      console.warn('WebSocket init failed, attempting fallback polling:', err);
      this.scheduleReconnect();
    }
  }

  private sendJoin() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const joinMsg: WSClientMessage = {
      type: 'JOIN',
      role: this.role,
      studentId: this.studentData?.id,
      name: this.studentData?.name,
      avatar: this.studentData?.avatar,
    };
    this.ws.send(JSON.stringify(joinMsg));
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      this.connect(this.role, this.studentData || undefined);
    }, 2500);
  }

  private handleServerMessage(msg: WSServerMessage) {
    switch (msg.type) {
      case 'INIT_STATE':
        this.currentState = msg.session;
        this.students = msg.students;
        if (msg.currentStudent) {
          this.currentStudent = msg.currentStudent;
        }
        this.notifyState();
        this.notifyStudents();
        this.notifySlide(msg.session.currentSlideIndex);
        this.notifyLock(msg.session.isLocked);
        break;

      case 'SLIDE_CHANGED':
        this.currentState.currentSlideIndex = msg.slideIndex;
        this.notifySlide(msg.slideIndex);
        this.notifyState();
        break;

      case 'STUDENTS_UPDATED':
        this.students = msg.students;
        this.currentState.activeStudentsCount = msg.students.filter((s) => s.connected).length;
        if (this.studentData?.id) {
          const found = msg.students.find((s) => s.id === this.studentData?.id);
          if (found) this.currentStudent = found;
        }
        this.notifyStudents();
        this.notifyState();
        break;

      case 'LOCK_UPDATED':
        this.currentState.isLocked = msg.isLocked;
        this.notifyLock(msg.isLocked);
        this.notifyState();
        break;

      case 'POINTS_AWARDED':
        if (this.studentData?.id === msg.studentId && this.currentStudent) {
          this.currentStudent.points = msg.totalPoints;
        }
        this.pointsListeners.forEach((fn) => fn(msg));
        break;

      case 'CELEBRATION':
        this.celebrationListeners.forEach((fn) => fn(msg.message));
        break;
    }
  }

  // Senders
  private send(msg: WSClientMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      // Fallback REST call if offline or connecting
      fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      }).catch(() => {});
    }
  }

  private supabaseSubscribed = false;

  private async initSupabaseSync() {
    const { isConfigured } = getSupabaseConfig();
    if (!isConfigured || this.supabaseSubscribed) return;

    this.supabaseSubscribed = true;

    // 1. Initial fetch from Supabase
    try {
      const sbSession = await loadSessionFromSupabase();
      if (sbSession) {
        this.currentState.currentSlideIndex = sbSession.currentSlideIndex;
        this.currentState.isLocked = sbSession.isLocked;
        this.notifyState();
        this.notifySlide(sbSession.currentSlideIndex);
        this.notifyLock(sbSession.isLocked);
      }

      const sbStudents = await loadStudentsFromSupabase();
      if (sbStudents && sbStudents.length > 0) {
        this.students = sbStudents;
        if (this.studentData?.id) {
          const found = sbStudents.find((s) => s.id === this.studentData?.id);
          if (found) this.currentStudent = found;
        }
        this.notifyStudents();
      }
    } catch (e) {
      console.warn('Supabase initial fetch failed:', e);
    }

    // 2. Realtime listener for lesson_sessions table
    subscribeToSupabaseSession((slideIndex, isLocked) => {
      this.currentState.currentSlideIndex = slideIndex;
      this.currentState.isLocked = isLocked;
      this.notifySlide(slideIndex);
      this.notifyLock(isLocked);
      this.notifyState();
    });

    // 3. Realtime listener for student_scores table
    subscribeToSupabaseStudents((updatedList) => {
      this.students = updatedList;
      if (this.studentData?.id) {
        const found = updatedList.find((s) => s.id === this.studentData?.id);
        if (found) this.currentStudent = found;
      }
      this.notifyStudents();
    });
  }

  public setSlide(slideIndex: number) {
    this.send({ type: 'SET_SLIDE', slideIndex });
    saveSessionToSupabase(slideIndex, this.currentState.isLocked);
  }

  public nextSlide() {
    const nextIdx = Math.min(this.currentState.totalSlides - 1, this.currentState.currentSlideIndex + 1);
    this.send({ type: 'NEXT_SLIDE' });
    saveSessionToSupabase(nextIdx, this.currentState.isLocked);
  }

  public prevSlide() {
    const prevIdx = Math.max(0, this.currentState.currentSlideIndex - 1);
    this.send({ type: 'PREV_SLIDE' });
    saveSessionToSupabase(prevIdx, this.currentState.isLocked);
  }

  public submitAnswer(slideId: string, slideIndex: number, data: any, scoreEarned: number) {
    this.send({
      type: 'SUBMIT_ANSWER',
      slideId,
      slideIndex,
      data,
      scoreEarned,
    });

    if (this.currentStudent) {
      const student = { ...this.currentStudent };
      student.points = Math.max(0, student.points + scoreEarned);
      student.lessonPoints = Math.max(0, student.lessonPoints + scoreEarned);
      student.answers = {
        ...student.answers,
        [slideId]: {
          slideId,
          slideIndex,
          submittedAt: Date.now(),
          data,
          scoreEarned,
        },
      };
      saveStudentToSupabase(student);
    }
  }

  public awardBonus(studentId: string, points: number, reason: string) {
    this.send({ type: 'AWARD_BONUS', studentId, points, reason });
    const student = this.students.find((s) => s.id === studentId);
    if (student) {
      student.points += points;
      student.lessonPoints += points;
      saveStudentToSupabase(student);
    }
  }

  public awardClassBonus(points: number, reason: string) {
    this.send({ type: 'AWARD_CLASS_BONUS', points, reason });
    this.students.forEach((s) => {
      s.points += points;
      s.lessonPoints += points;
      saveStudentToSupabase(s);
    });
  }

  public toggleLock(isLocked: boolean) {
    this.send({ type: 'TOGGLE_LOCK', isLocked });
    saveSessionToSupabase(this.currentState.currentSlideIndex, isLocked);
  }

  public triggerCelebration() {
    this.send({ type: 'TRIGGER_CONFETTI' });
  }

  public resetSession() {
    this.send({ type: 'RESET_SESSION' });
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

  private notifySlide(index: number) {
    this.slideListeners.forEach((fn) => fn(index));
  }

  private notifyLock(isLocked: boolean) {
    this.lockListeners.forEach((fn) => fn(isLocked));
  }

  private notifyConnection(connected: boolean) {
    this.connectionListeners.forEach((fn) => fn(connected));
  }
}

export const realtime = new RealtimeClient();
