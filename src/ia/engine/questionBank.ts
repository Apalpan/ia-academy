import { QUESTION_BANK } from '../data';
import type { LevelId, Question } from '../types';

const byId = new Map(QUESTION_BANK.map((q) => [q.id, q]));

export const getQuestion = (id: string): Question | undefined => byId.get(id);
export const getQuestions = (ids: string[]): Question[] => ids.map((id) => byId.get(id)).filter((q): q is Question => Boolean(q));
export const allQuestions = (): Question[] => QUESTION_BANK;
export const questionsByLevel = (level: LevelId): Question[] => QUESTION_BANK.filter((q) => q.level === level);

export const bankStats = () => ({
  total: QUESTION_BANK.length,
  byLevel: QUESTION_BANK.reduce<Record<number, number>>((acc, q) => {
    acc[q.level] = (acc[q.level] ?? 0) + 1;
    return acc;
  }, {}),
});

export const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const orderByFreshness = (pool: Question[], deprioritizeIds: string[]): Question[] => {
  const seen = new Set(deprioritizeIds);
  const fresh = shuffle(pool.filter((q) => !seen.has(q.id)));
  const recycled = shuffle(pool.filter((q) => seen.has(q.id)));
  return [...fresh, ...recycled];
};

/** Selecciona preguntas de un nivel, priorizando las no vistas. */
export function pickForLevel(level: LevelId, count: number, deprioritizeIds: string[] = []): Question[] {
  const pool = questionsByLevel(level);
  if (!pool.length) return [];
  const ordered = orderByFreshness(pool, deprioritizeIds);
  if (ordered.length >= count) return ordered.slice(0, count);
  const result = [...ordered];
  while (result.length < count) result.push(...shuffle(pool).slice(0, count - result.length));
  return result.slice(0, count);
}

/** Quiz mixto entre niveles 1..maxLevel. */
export function pickMixed(count: number, maxLevel: LevelId, deprioritizeIds: string[] = []): Question[] {
  const pool = QUESTION_BANK.filter((q) => q.level <= maxLevel);
  return orderByFreshness(pool, deprioritizeIds).slice(0, count);
}
