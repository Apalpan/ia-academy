import { LEVELS } from '../levels';
import { PASS_THRESHOLD, rankForXp } from '../types';
import type { Attempt, LevelId, LevelProgress, Profile, ProgressSnapshot, SessionResult } from '../types';

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const round = (v: number) => Math.round(v);
const MIN_ATTEMPTS_TO_PASS = 4;

function bestSessionAccuracy(sessions: SessionResult[], level: LevelId): number {
  const relevant = sessions.filter((s) => s.level === level && s.attempts.length >= 3);
  return relevant.length ? Math.max(...relevant.map((s) => s.accuracy)) : 0;
}

export function computeProgress(profile: Profile): ProgressSnapshot {
  const { attempts, sessions, xp } = profile;
  const totalAttempts = attempts.length;
  const totalCorrect = attempts.filter((a) => a.correct).length;
  const globalAccuracy = totalAttempts ? round((totalCorrect / totalAttempts) * 100) : 0;

  const levels: LevelProgress[] = [];
  let unlockedLevel: LevelId = 1;
  let prevPassed = true; // nivel 1 siempre desbloqueado

  for (const def of LEVELS) {
    const rows = attempts.filter((a) => a.level === def.id);
    const correct = rows.filter((a) => a.correct).length;
    const accuracy = rows.length ? (correct / rows.length) * 100 : 0;
    const bestAccuracy = bestSessionAccuracy(sessions, def.id);
    const volume = clamp((rows.length / 6) * 100);
    const mastery = round(clamp(0.7 * accuracy + 0.3 * volume));
    const passed = bestAccuracy >= PASS_THRESHOLD && rows.length >= MIN_ATTEMPTS_TO_PASS;
    const unlocked = def.id === 1 || prevPassed;
    if (unlocked) unlockedLevel = def.id;

    levels.push({
      level: def.id,
      attempts: rows.length,
      correct,
      accuracy: round(accuracy),
      bestAccuracy: round(bestAccuracy),
      mastery,
      passed,
      unlocked,
    });
    prevPassed = passed;
  }

  // Nivel sugerido: el primer desbloqueado aún no superado.
  const current = levels.find((l) => l.unlocked && !l.passed)?.level ?? unlockedLevel;

  // Conceptos débiles: errores agrupados por concepto.
  const failMap = new Map<string, { fails: number; level: LevelId }>();
  for (const a of attempts) {
    if (a.correct) continue;
    const prev = failMap.get(a.concepto) ?? { fails: 0, level: a.level };
    prev.fails += 1;
    failMap.set(a.concepto, prev);
  }
  const weakConcepts = [...failMap.entries()]
    .map(([concepto, v]) => ({ concepto, fails: v.fails, level: v.level }))
    .sort((a, b) => b.fails - a.fails)
    .slice(0, 6);

  const termsSeen = new Set(attempts.filter((a) => a.correct).map((a) => a.concepto)).size;

  return {
    xp,
    rank: rankForXp(xp),
    currentLevel: current,
    unlockedLevel,
    totalAttempts,
    totalCorrect,
    globalAccuracy,
    streakDays: profile.streak.current,
    termsSeen,
    levels,
    weakConcepts,
  };
}

/** Ids de preguntas falladas (más recientes primero) para el repaso. */
export function missedQuestionIds(attempts: Attempt[], limit = 12): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (let i = attempts.length - 1; i >= 0; i -= 1) {
    const a = attempts[i];
    if (!a.correct && !seen.has(a.questionId)) {
      seen.add(a.questionId);
      ids.push(a.questionId);
    }
    if (ids.length >= limit) break;
  }
  return ids;
}
