import { XP_PER_CORRECT, XP_SPEED_BONUS } from '../types';
import type { Attempt, LevelId, SessionKind, SessionResult } from '../types';

export function xpFromAttempts(attempts: Attempt[]): number {
  return attempts.reduce((sum, a) => {
    if (!a.correct) return sum;
    const fast = a.responseMs <= a.targetMs;
    return sum + XP_PER_CORRECT + (fast ? XP_SPEED_BONUS : 0);
  }, 0);
}

export function summarizeSession(kind: SessionKind, title: string, level: LevelId | null, attempts: Attempt[], totalMs: number): SessionResult {
  const answered = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;
  return {
    id: crypto.randomUUID(),
    kind,
    at: new Date().toISOString(),
    title,
    level,
    questionIds: attempts.map((a) => a.questionId),
    attempts,
    totalMs,
    accuracy,
    correct,
    xpGained: xpFromAttempts(attempts),
  };
}
