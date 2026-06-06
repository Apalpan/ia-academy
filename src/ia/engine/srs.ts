// ============================================================================
// Repetición espaciada (SM-2 simplificado a 3 grados). Inspirado en FSRS/Anki.
// ============================================================================
import { CONCEPTS } from '../concepts';
import type { CardGrade, CardState } from '../types';

const DAY = 86_400_000;
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (days: number) => new Date(Date.now() + days * DAY).toISOString().slice(0, 10);

export function newCard(termino: string): CardState {
  return { termino, ease: 2.5, intervalDays: 0, due: todayISO(), reps: 0, lapses: 0 };
}

/** Aplica un repaso y devuelve el nuevo estado de la tarjeta. */
export function review(card: CardState, grade: CardGrade): CardState {
  let { ease, intervalDays, reps, lapses } = card;

  if (grade === 'again') {
    reps = 0;
    lapses += 1;
    ease = Math.max(1.3, ease - 0.2);
    intervalDays = 0; // vuelve hoy
  } else {
    reps += 1;
    if (grade === 'easy') ease = Math.min(3.0, ease + 0.15);
    if (reps === 1) intervalDays = grade === 'easy' ? 3 : 1;
    else if (reps === 2) intervalDays = grade === 'easy' ? 7 : 4;
    else intervalDays = Math.round(intervalDays * ease * (grade === 'easy' ? 1.3 : 1));
    intervalDays = Math.min(intervalDays, 365);
  }

  return { ...card, ease, intervalDays, reps, lapses, due: addDays(intervalDays) };
}

const isDue = (card: CardState) => card.due <= todayISO();

/** Cola de repaso del día: vencidas primero, luego conceptos nuevos. */
export function buildQueue(cards: Record<string, CardState>, level?: number, limit = 20): string[] {
  const pool = level ? CONCEPTS.filter((c) => c.level === level) : CONCEPTS;
  const due: string[] = [];
  const fresh: string[] = [];
  for (const c of pool) {
    const card = cards[c.termino];
    if (!card) fresh.push(c.termino);
    else if (isDue(card)) due.push(c.termino);
  }
  return [...due, ...fresh].slice(0, limit);
}

export function dueCount(cards: Record<string, CardState>): number {
  return Object.values(cards).filter(isDue).length;
}

export function stats(cards: Record<string, CardState>) {
  const values = Object.values(cards);
  return {
    estudiadas: values.length,
    total: CONCEPTS.length,
    dominadas: values.filter((c) => c.reps >= 3 && c.lapses === 0).length,
    aRepasar: values.filter(isDue).length,
  };
}
