import type { CardGrade, Profile, SessionResult, Settings } from '../types';
import { newCard, review } from './srs';

const KEY = 'ia-academy:profile:v1';

const defaultSettings: Settings = { reducedMotion: false, dailyGoal: 15 };

export function defaultProfile(): Profile {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    name: 'Aprendiz',
    xp: 0,
    attempts: [],
    sessions: [],
    seenQuestionIds: [],
    flashcards: {},
    streak: { current: 0, best: 0, lastActiveDay: null },
    settings: { ...defaultSettings },
  };
}

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw) as Partial<Profile>;
    return {
      ...defaultProfile(),
      ...parsed,
      flashcards: parsed.flashcards ?? {},
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      streak: { ...defaultProfile().streak, ...(parsed.streak ?? {}) },
    } as Profile;
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile: Profile): Profile {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    /* storage no disponible */
  }
  return profile;
}

export function resetProfile(): Profile {
  return saveProfile(defaultProfile());
}

const dayKey = (iso: string) => iso.slice(0, 10);
const diffDays = (a: string, b: string) =>
  Math.round((new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / 86_400_000);

export function registerActivity(profile: Profile, atISO = new Date().toISOString()): Profile {
  const today = dayKey(atISO);
  const last = profile.streak.lastActiveDay;
  let current = profile.streak.current;
  if (last === today) current = Math.max(1, current);
  else if (last && diffDays(last, today) === 1) current += 1;
  else current = 1;
  return { ...profile, streak: { current, best: Math.max(profile.streak.best, current), lastActiveDay: today } };
}

export function recordSession(profile: Profile, session: SessionResult): Profile {
  const attempts = [...profile.attempts, ...session.attempts].slice(-4000);
  const seen = Array.from(new Set([...profile.seenQuestionIds, ...session.questionIds]));
  const sessions = [session, ...profile.sessions].slice(0, 100);
  const xp = profile.xp + session.xpGained;
  const next: Profile = { ...profile, attempts, sessions, seenQuestionIds: seen, xp };
  return registerActivity(next, session.at);
}

export function updateSettings(profile: Profile, patch: Partial<Settings>): Profile {
  return { ...profile, settings: { ...profile.settings, ...patch } };
}

export function recordCardReview(profile: Profile, termino: string, grade: CardGrade): Profile {
  const existing = profile.flashcards[termino] ?? newCard(termino);
  const updated = review(existing, grade);
  const next: Profile = { ...profile, flashcards: { ...profile.flashcards, [termino]: updated } };
  return registerActivity(next);
}
