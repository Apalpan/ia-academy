import type { Question } from '../types';
import { LEVELS_1_5 } from './levels-1-5';
import { LEVELS_6_10 } from './levels-6-10';

/**
 * Banco de ejercicios de IA. Grounded en el currículo y glosario del vault
 * (AP_Knowledge_OS/05_KNOWLEDGE). Para expandir: agrega objetos `Question` con
 * el `level` (1..10) correspondiente. El motor los toma automáticamente.
 */
export const QUESTION_BANK: Question[] = [...LEVELS_1_5, ...LEVELS_6_10];
