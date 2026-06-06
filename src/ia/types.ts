// ============================================================================
// IA Academy — modelo de dominio
// ============================================================================

export type LevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type ChoiceKey = 'A' | 'B' | 'C' | 'D';

/** Tipos de ejercicio para variar el entrenamiento. */
export type QType =
  | 'definicion' // dado el término, elegir la definición
  | 'termino' // dada la definición, elegir el término
  | 'aplicacion' // caso práctico → qué concepto/decisión aplica
  | 'herramienta' // qué herramienta usar para X
  | 'odd' // cuál NO pertenece / es falso
  | 'vf'; // verdadero/falso conceptual

export const qTypeLabels: Record<QType, string> = {
  definicion: 'Definición',
  termino: 'Término',
  aplicacion: 'Aplicación',
  herramienta: 'Herramienta',
  odd: 'Detecta el error',
  vf: 'Verdadero/Falso',
};

export interface Choice {
  key: ChoiceKey;
  text: string;
  correct: boolean;
}

export interface Question {
  id: string;
  level: LevelId;
  topic: string; // subtema dentro del nivel
  tipo: QType;
  enunciado: string;
  opciones: Choice[];
  respuestaCorrecta: ChoiceKey;
  explicacion: string; // por qué es correcta
  concepto: string; // término/concepto clave que entrena
  tip?: string; // "en la práctica"
  tiempoObjetivoSeg: number;
  tags: string[];
}

export interface LevelDef {
  id: LevelId;
  titulo: string;
  subtitulo: string;
  meta: string; // qué podrás hacer al dominarlo
  conceptos: string[];
  herramientas: string[];
  icon: string; // nombre de icono lucide
}

export interface GlossaryTerm {
  n: number;
  termino: string;
  definicion: string;
  nivel: LevelId;
}

// ---------------------------------------------------------------------------
// Intentos, sesiones y progreso
// ---------------------------------------------------------------------------

export type SessionKind = 'practice' | 'level' | 'quiz' | 'review' | 'diagnostic';

export const sessionKindLabels: Record<SessionKind, string> = {
  practice: 'Práctica',
  level: 'Reto de nivel',
  quiz: 'Quiz mixto',
  review: 'Repaso de errores',
  diagnostic: 'Test de nivel',
};

export interface Attempt {
  id: string;
  questionId: string;
  level: LevelId;
  topic: string;
  tipo: QType;
  concepto: string;
  selected: ChoiceKey | null;
  correct: boolean;
  responseMs: number;
  targetMs: number;
  source: SessionKind;
  at: string;
}

export interface SessionResult {
  id: string;
  kind: SessionKind;
  at: string;
  title: string;
  level: LevelId | null;
  questionIds: string[];
  attempts: Attempt[];
  totalMs: number;
  accuracy: number;
  correct: number;
  xpGained: number;
}

export interface LevelProgress {
  level: LevelId;
  attempts: number;
  correct: number;
  accuracy: number; // 0..100 (acumulada)
  bestAccuracy: number; // mejor sesión de nivel
  mastery: number; // 0..100
  passed: boolean; // superado (best >= umbral)
  unlocked: boolean;
}

export interface ProgressSnapshot {
  xp: number;
  rank: string;
  currentLevel: LevelId; // nivel sugerido para hoy
  unlockedLevel: LevelId; // nivel máximo desbloqueado
  totalAttempts: number;
  totalCorrect: number;
  globalAccuracy: number;
  streakDays: number;
  termsSeen: number;
  levels: LevelProgress[];
  weakConcepts: { concepto: string; fails: number; level: LevelId }[];
}

export interface Settings {
  reducedMotion: boolean;
  dailyGoal: number;
}

export interface Archetype {
  id: string;
  name: string;
  emoji: string;
  desc: string;
}

/** Perfil personal capturado en el onboarding (conoce al usuario). */
export interface Persona {
  depth: 'rapido' | 'completo' | 'directo';
  name: string;
  birthdate?: string; // yyyy-mm-dd
  age?: number;
  sign?: string;
  signEmoji?: string;
  signTraits?: string[];
  goal?: string;
  painPoints: string[];
  interests: string[];
  role?: string;
  commStyle?: string;
  pace?: string;
  formats: string[];
  hard: number; // autoevaluación 0-100
  soft: number;
  power: number;
  archetype?: Archetype;
  completedAt?: string;
}

/** Estado de una flashcard (repetición espaciada, estilo SM-2). */
export interface CardState {
  termino: string;
  ease: number; // factor de facilidad (≈2.5 inicial)
  intervalDays: number;
  due: string; // ISO de próxima revisión
  reps: number; // repasos correctos consecutivos
  lapses: number; // veces que se falló
}

export type CardGrade = 'again' | 'good' | 'easy';

export interface Profile {
  version: number;
  createdAt: string;
  name: string;
  onboarded: boolean;
  placementLevel: LevelId; // nivel medido en el test inicial (desbloquea hasta aquí)
  persona: Persona | null;
  xp: number;
  attempts: Attempt[];
  sessions: SessionResult[];
  seenQuestionIds: string[];
  flashcards: Record<string, CardState>;
  streak: { current: number; best: number; lastActiveDay: string | null };
  settings: Settings;
}

// Umbral para superar un nivel (desbloquea el siguiente).
export const PASS_THRESHOLD = 70;
export const XP_PER_CORRECT = 10;
export const XP_SPEED_BONUS = 4; // si responde dentro del tiempo objetivo

export const RANKS: { min: number; label: string }[] = [
  { min: 0, label: 'Curioso' },
  { min: 150, label: 'Aprendiz IA' },
  { min: 400, label: 'Practicante' },
  { min: 800, label: 'Operador IA' },
  { min: 1400, label: 'Constructor IA' },
  { min: 2200, label: 'Estratega IA' },
  { min: 3200, label: 'Maestro IA' },
];

export const rankForXp = (xp: number): string => {
  let label = RANKS[0].label;
  for (const rank of RANKS) if (xp >= rank.min) label = rank.label;
  return label;
};
