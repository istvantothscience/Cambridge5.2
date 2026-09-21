import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SessionState, Student } from '../types';

// Default project configuration provided by user
const DEFAULT_SUPABASE_URL = 'https://zmjznqvsywizojqoewus.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptempucXZzeXdpem9qcW9ld3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDM2MDUsImV4cCI6MjA4NTE3OTYwNX0.4BkgRZtm3bXu3utRzu-u4uhrthEhwoBO4kzeZMl6obQ';

// Lazy initialization and graceful fallback for Supabase
let supabaseClient: SupabaseClient | null = null;
let isSupabaseConfigured = false;

export function getSupabaseConfig(): { url: string; key: string; isConfigured: boolean } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  // Also check localStorage in case the teacher configures it in settings
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_url') || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') || '' : '';

  const url = envUrl || storedUrl || DEFAULT_SUPABASE_URL;
  const key = envKey || storedKey || DEFAULT_SUPABASE_ANON_KEY;
  const configured = Boolean(url && key && url.startsWith('http'));

  return { url, key, isConfigured: configured };
}

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const { url, key, isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      supabaseClient = createClient(url, key, {
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
      isSupabaseConfigured = true;
      console.log('✅ Supabase client successfully initialized');
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseClient = null;
    }
  }

  return supabaseClient;
}

export function saveSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabase_url', url.trim());
    localStorage.setItem('supabase_anon_key', key.trim());
    supabaseClient = null; // force re-init
    getSupabase();
  }
}

const SESSION_ID = 'cambridge-sci-stage5-l2';

/**
 * Save slide state to Supabase table `lesson_sessions`
 */
export async function saveSessionToSupabase(slideIndex: number, isLocked: boolean): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb.from('lesson_sessions').upsert(
      {
        session_id: SESSION_ID,
        current_slide_index: slideIndex,
        is_locked: isLocked,
        total_slides: 10,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'session_id' }
    );

    if (error) {
      console.warn('Supabase saveSession error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase saveSession exception:', e);
    return false;
  }
}

/**
 * Load latest session state from Supabase
 */
export async function loadSessionFromSupabase(): Promise<{ currentSlideIndex: number; isLocked: boolean } | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('lesson_sessions')
      .select('current_slide_index, is_locked')
      .eq('session_id', SESSION_ID)
      .maybeSingle();

    if (error || !data) return null;
    return {
      currentSlideIndex: data.current_slide_index ?? 0,
      isLocked: Boolean(data.is_locked),
    };
  } catch (e) {
    return null;
  }
}

/**
 * Save student score & answers to Supabase table `student_scores`
 */
export async function saveStudentToSupabase(student: Student): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb.from('student_scores').upsert(
      {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        points: student.points,
        lesson_points: student.lessonPoints,
        answers: student.answers,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.warn('Supabase saveStudent error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Load all students from Supabase
 */
export async function loadStudentsFromSupabase(): Promise<Student[] | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('student_scores')
      .select('*')
      .order('points', { ascending: false });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      avatar: row.avatar || '🌱',
      points: row.points ?? 0,
      lessonPoints: row.lesson_points ?? row.points ?? 0,
      answers: row.answers || {},
      connected: true,
      joinedAt: new Date(row.updated_at || Date.now()).getTime(),
      lastActive: new Date(row.updated_at || Date.now()).getTime(),
    }));
  } catch (e) {
    return null;
  }
}

/**
 * Realtime subscription to lesson_sessions changes via Supabase
 */
export function subscribeToSupabaseSession(onUpdate: (slideIndex: number, isLocked: boolean) => void) {
  const sb = getSupabase();
  if (!sb) return () => {};

  const channel = sb
    .channel('public:lesson_sessions')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'lesson_sessions', filter: `session_id=eq.${SESSION_ID}` },
      (payload) => {
        const row = payload.new as any;
        if (row && typeof row.current_slide_index === 'number') {
          onUpdate(row.current_slide_index, Boolean(row.is_locked));
        }
      }
    )
    .subscribe();

  return () => {
    sb.removeChannel(channel);
  };
}

/**
 * Realtime subscription to student_scores changes via Supabase
 */
export function subscribeToSupabaseStudents(onUpdate: (students: Student[]) => void) {
  const sb = getSupabase();
  if (!sb) return () => {};

  const channel = sb
    .channel('public:student_scores')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'student_scores' },
      async () => {
        const freshStudents = await loadStudentsFromSupabase();
        if (freshStudents) {
          onUpdate(freshStudents);
        }
      }
    )
    .subscribe();

  return () => {
    sb.removeChannel(channel);
  };
}
