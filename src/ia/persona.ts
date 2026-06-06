// ============================================================================
// Perfilado del usuario: zodiaco, opciones del onboarding y motor de arquetipo.
// El objetivo es que la plataforma "te conozca": dolores, intereses, skills y
// estilo, para personalizar la experiencia.
// ============================================================================
import type { Archetype, LevelId, Persona } from './types';

export interface Option {
  id: string;
  label: string;
  emoji?: string;
}

// ---- Zodiaco ----
interface Sign { sign: string; emoji: string; from: [number, number]; to: [number, number]; traits: string[]; }
const ZODIAC: Sign[] = [
  { sign: 'Capricornio', emoji: '♑', from: [12, 22], to: [1, 19], traits: ['Disciplina', 'Ambición', 'Estructura'] },
  { sign: 'Acuario', emoji: '♒', from: [1, 20], to: [2, 18], traits: ['Innovación', 'Originalidad', 'Visión a futuro'] },
  { sign: 'Piscis', emoji: '♓', from: [2, 19], to: [3, 20], traits: ['Creatividad', 'Intuición', 'Adaptabilidad'] },
  { sign: 'Aries', emoji: '♈', from: [3, 21], to: [4, 19], traits: ['Iniciativa', 'Energía', 'Valentía'] },
  { sign: 'Tauro', emoji: '♉', from: [4, 20], to: [5, 20], traits: ['Constancia', 'Foco', 'Paciencia'] },
  { sign: 'Géminis', emoji: '♊', from: [5, 21], to: [6, 20], traits: ['Curiosidad', 'Versatilidad', 'Comunicación'] },
  { sign: 'Cáncer', emoji: '♋', from: [6, 21], to: [7, 22], traits: ['Intuición', 'Empatía', 'Memoria'] },
  { sign: 'Leo', emoji: '♌', from: [7, 23], to: [8, 22], traits: ['Liderazgo', 'Creatividad', 'Confianza'] },
  { sign: 'Virgo', emoji: '♍', from: [8, 23], to: [9, 22], traits: ['Análisis', 'Método', 'Detalle'] },
  { sign: 'Libra', emoji: '♎', from: [9, 23], to: [10, 22], traits: ['Equilibrio', 'Criterio', 'Colaboración'] },
  { sign: 'Escorpio', emoji: '♏', from: [10, 23], to: [11, 21], traits: ['Intensidad', 'Profundidad', 'Estrategia'] },
  { sign: 'Sagitario', emoji: '♐', from: [11, 22], to: [12, 21], traits: ['Visión', 'Optimismo', 'Aprendizaje'] },
];

export function signFromDate(iso: string): { sign: string; emoji: string; traits: string[] } | undefined {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return undefined;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  for (const z of ZODIAC) {
    const [fm, fd] = z.from;
    const [tm, td] = z.to;
    const inStart = m === fm && day >= fd;
    const inEnd = m === tm && day <= td;
    if (inStart || inEnd) return { sign: z.sign, emoji: z.emoji, traits: z.traits };
  }
  return undefined;
}

export function ageFromDate(iso: string): number | undefined {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return undefined;
  const diff = Date.now() - d.getTime();
  const age = Math.floor(diff / (365.25 * 86_400_000));
  return age >= 0 && age < 120 ? age : undefined;
}

// ---- Opciones del onboarding ----
export const GOALS: Option[] = [
  { id: 'trabajo', label: 'Ser más productivo en mi trabajo', emoji: '⚡' },
  { id: 'crear', label: 'Crear productos / apps con IA', emoji: '🚀' },
  { id: 'liderar', label: 'Liderar equipos y decidir con IA', emoji: '🧭' },
  { id: 'investigar', label: 'Investigar y profundizar técnicamente', emoji: '🔬' },
  { id: 'ensenar', label: 'Enseñar y comunicar IA', emoji: '🗣️' },
  { id: 'curiosidad', label: 'Curiosidad / no quedarme atrás', emoji: '✨' },
];

export const PAINS: Option[] = [
  { id: 'empezar', label: 'No sé por dónde empezar', emoji: '🧭' },
  { id: 'base', label: 'Me falta base técnica', emoji: '🧱' },
  { id: 'tiempo', label: 'No tengo tiempo', emoji: '⏳' },
  { id: 'teoria', label: 'Me pierdo en la teoría', emoji: '🌫️' },
  { id: 'aplicar', label: 'No sé aplicarlo a lo mío', emoji: '🔧' },
  { id: 'herramientas', label: 'Me abruma tanta herramienta', emoji: '🤯' },
  { id: 'retener', label: 'Olvido lo que aprendo', emoji: '🧠' },
  { id: 'criterio', label: 'No sé en qué confiar', emoji: '⚖️' },
];

export const INTERESTS: Option[] = [
  { id: 'fundamentos', label: 'Fundamentos (ML/DL)', emoji: '📚' },
  { id: 'llms', label: 'LLMs y prompting', emoji: '💬' },
  { id: 'rag', label: 'RAG / bases de conocimiento', emoji: '🗂️' },
  { id: 'agentes', label: 'Agentes y MCP', emoji: '🤖' },
  { id: 'automatizacion', label: 'Automatización y no-code', emoji: '⚙️' },
  { id: 'vibe', label: 'Vibe coding / crear apps', emoji: '🧑‍💻' },
  { id: 'vision', label: 'Visión y AEC/obra', emoji: '👁️' },
  { id: 'datos', label: 'Datos y dashboards', emoji: '📊' },
  { id: 'gobernanza', label: 'Ética y gobernanza', emoji: '🛡️' },
];

export const ROLES: Option[] = [
  { id: 'estudiante', label: 'Estudiante', emoji: '🎓' },
  { id: 'profesional', label: 'Profesional / Ingeniería / AEC', emoji: '🏗️' },
  { id: 'emprendedor', label: 'Emprendedor / Founder', emoji: '🚀' },
  { id: 'manager', label: 'Manager / Líder', emoji: '🧭' },
  { id: 'docente', label: 'Docente', emoji: '🧑‍🏫' },
  { id: 'dev', label: 'Desarrollador', emoji: '💻' },
  { id: 'otro', label: 'Otro', emoji: '🌟' },
];

export const COMM_STYLES: Option[] = [
  { id: 'directo', label: 'Directo y al grano', emoji: '🎯' },
  { id: 'analogias', label: 'Con analogías', emoji: '🔗' },
  { id: 'ejemplos', label: 'Con ejemplos prácticos', emoji: '🛠️' },
  { id: 'tecnico', label: 'Técnico y profundo', emoji: '🔬' },
  { id: 'visual', label: 'Visual y esquemático', emoji: '🎨' },
];

export const PACES: Option[] = [
  { id: 'micro', label: 'Micro-dosis diarias (5 min)', emoji: '⏱️' },
  { id: 'constante', label: 'Constante (15-20 min)', emoji: '📅' },
  { id: 'intenso', label: 'Intenso (sprints)', emoji: '🔥' },
];

export const FORMATS: Option[] = [
  { id: 'flashcards', label: 'Flashcards', emoji: '🃏' },
  { id: 'quizzes', label: 'Quizzes', emoji: '❓' },
  { id: 'lecturas', label: 'Lecturas cortas', emoji: '📖' },
  { id: 'retos', label: 'Retos prácticos', emoji: '🎮' },
  { id: 'prompts', label: 'Prompts para usar', emoji: '✨' },
];

// ---- Arquetipos ----
const ARCHETYPES: Archetype[] = [
  { id: 'constructor', name: 'Constructor pragmático', emoji: '🛠️', desc: 'Aprendes haciendo. Quieres convertir la IA en productos y automatizaciones reales.' },
  { id: 'estratega', name: 'Estratega', emoji: '🧭', desc: 'Piensas en impacto y decisión. La IA es tu ventaja para liderar y elegir bien.' },
  { id: 'analista', name: 'Explorador analítico', emoji: '🔬', desc: 'Quieres entender el porqué a fondo. Disfrutas la teoría y el detalle técnico.' },
  { id: 'comunicador', name: 'Comunicador', emoji: '🗣️', desc: 'Aprendes para explicar. Brillas traduciendo lo complejo en simple.' },
  { id: 'iniciador', name: 'Iniciador curioso', emoji: '🚀', desc: 'Empiezas con ganas. Construirás una base sólida paso a paso.' },
];

export function computeArchetype(p: Partial<Persona>): Archetype {
  const interests = p.interests ?? [];
  const has = (id: string) => interests.includes(id);
  const score = new Map<string, number>([['constructor', 0], ['estratega', 0], ['analista', 0], ['comunicador', 0], ['iniciador', 0]]);
  const add = (id: string, n: number) => score.set(id, (score.get(id) ?? 0) + n);

  if (p.goal === 'crear' || p.goal === 'trabajo') add('constructor', 3);
  if (p.goal === 'liderar') add('estratega', 3);
  if (p.goal === 'investigar') add('analista', 3);
  if (p.goal === 'ensenar') add('comunicador', 3);
  if (p.goal === 'curiosidad') add('iniciador', 2);

  if (has('automatizacion') || has('agentes') || has('vibe')) add('constructor', 2);
  if (has('gobernanza') || has('datos')) add('estratega', 2);
  if (has('fundamentos') || has('rag')) add('analista', 2);
  if (has('llms')) add('comunicador', 1);

  if (p.role === 'manager' || p.role === 'emprendedor') add('estratega', 2);
  if (p.role === 'docente') add('comunicador', 2);
  if (p.role === 'dev') add('constructor', 1);
  if (p.role === 'estudiante') add('iniciador', 1);

  if (p.commStyle === 'tecnico') add('analista', 1);
  if (p.commStyle === 'analogias' || p.commStyle === 'visual') add('comunicador', 1);
  if (p.commStyle === 'ejemplos') add('constructor', 1);

  const hard = p.hard ?? 30;
  const power = p.power ?? 30;
  if (hard >= 65) add('analista', 1);
  if (hard < 35) add('iniciador', 2);
  if (power >= 65) add('estratega', 1);

  let best = ARCHETYPES[4];
  let max = -1;
  for (const a of ARCHETYPES) {
    const s = score.get(a.id) ?? 0;
    if (s > max) { max = s; best = a; }
  }
  return best;
}

/** Estima nivel de colocación cuando el usuario salta el test (por self-skill + intereses). */
export function estimatePlacement(p: Partial<Persona>): LevelId {
  const hard = p.hard ?? 25;
  let level = Math.round(1 + (hard / 100) * 6); // 1..7
  const advanced = (p.interests ?? []).filter((i) => ['rag', 'agentes', 'gobernanza', 'datos'].includes(i)).length;
  level += advanced >= 2 ? 1 : 0;
  return Math.max(1, Math.min(8, level)) as LevelId;
}

export const optionLabel = (opts: Option[], id?: string) => opts.find((o) => o.id === id)?.label ?? id ?? '';
