// ============================================================================
// Test de nivel (onboarding): 10 preguntas, una por nivel (dificultad creciente).
// Mide en qué nivel colocar al usuario.
// ============================================================================
import { questionsByLevel, shuffle } from './questionBank';
import type { Attempt, LevelId, Question } from '../types';

/** Una pregunta representativa por nivel (1→10). */
export function buildPlacement(): Question[] {
  const out: Question[] = [];
  for (let l = 1 as number; l <= 10; l += 1) {
    const pool = questionsByLevel(l as LevelId);
    if (pool.length) out.push(shuffle(pool)[0]);
  }
  return out;
}

export interface PlacementResult {
  placementLevel: LevelId;
  tier: string;
  tierDesc: string;
  correct: number;
  total: number;
}

export function scorePlacement(attempts: Attempt[]): PlacementResult {
  const total = attempts.length || 1;
  const correct = attempts.filter((a) => a.correct).length;
  const correctLevels = attempts.filter((a) => a.correct).map((a) => a.level);
  const ceiling = correctLevels.length ? Math.max(...correctLevels) : 1;

  // Mezcla cantidad de aciertos con el techo de dificultad alcanzado, sin sobre-colocar.
  let placement = Math.round((correct + ceiling) / 2);
  placement = Math.max(1, Math.min(10, placement));

  let tier = 'Principiante';
  let tierDesc = 'Empezarás desde los fundamentos. ¡Perfecto para construir base sólida!';
  if (correct >= 9) { tier = 'Experto'; tierDesc = 'Dominas lo esencial. Te llevamos directo a los temas avanzados.'; }
  else if (correct >= 7) { tier = 'Avanzado'; tierDesc = 'Buen nivel: arrancas en temas intermedios-altos.'; }
  else if (correct >= 4) { tier = 'Intermedio'; tierDesc = 'Ya manejas conceptos clave; reforzamos y subimos.'; }

  return { placementLevel: placement as LevelId, tier, tierDesc, correct, total };
}
