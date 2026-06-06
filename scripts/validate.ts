/* Validador de integridad del banco y engines (sin navegador). */
import { QUESTION_BANK } from '../src/ia/data';
import { GLOSSARY } from '../src/ia/glossary';
import { LEVELS } from '../src/ia/levels';
import { bankStats, pickForLevel } from '../src/ia/engine/questionBank';
import { summarizeSession } from '../src/ia/engine/session';
import { computeProgress } from '../src/ia/engine/progress';
import { defaultProfile, recordSession } from '../src/ia/engine/persistence';
import { CONCEPTS, getConcept } from '../src/ia/concepts';
import { LEARNING_PROMPTS } from '../src/ia/data/prompts';
import { TRENDS } from '../src/ia/data/novedades';
import { buildQueue, newCard, review } from '../src/ia/engine/srs';
import { buildPlacement, scorePlacement } from '../src/ia/engine/placement';
import { computeArchetype, estimatePlacement, signFromDate } from '../src/ia/persona';
import type { Attempt, LevelId } from '../src/ia/types';

let errors = 0;
const fail = (m: string) => { errors += 1; console.error('  ✗ ' + m); };

const ids = new Set<string>();
for (const q of QUESTION_BANK) {
  if (ids.has(q.id)) fail(`id duplicado: ${q.id}`);
  ids.add(q.id);
  const correct = q.opciones.filter((c) => c.correct);
  if (correct.length !== 1) fail(`${q.id}: debe tener exactamente 1 correcta (tiene ${correct.length})`);
  if (correct[0] && correct[0].key !== q.respuestaCorrecta) fail(`${q.id}: respuestaCorrecta no coincide`);
  if (q.opciones.length < 2 || q.opciones.length > 4) fail(`${q.id}: nº de opciones inválido`);
  if (q.level < 1 || q.level > 10) fail(`${q.id}: nivel fuera de rango`);
  if (!(q.tiempoObjetivoSeg > 0)) fail(`${q.id}: tiempo inválido`);
  if (!q.concepto || !q.explicacion) fail(`${q.id}: falta concepto o explicación`);
}

if (LEVELS.length !== 10) fail(`Deben existir 10 niveles (hay ${LEVELS.length})`);
for (const l of [1,2,3,4,5,6,7,8,9,10] as LevelId[]) {
  if (pickForLevel(l, 3).length === 0) fail(`Nivel ${l} sin preguntas`);
}
for (const t of GLOSSARY) if (t.nivel < 1 || t.nivel > 10) fail(`Glosario ${t.termino}: nivel inválido`);

// Flujo: superar nivel 1 desbloquea nivel 2 y suma XP.
let profile = defaultProfile();
const q1 = pickForLevel(1, 6);
const attempts: Attempt[] = q1.map((q, i) => ({
  id: `a${i}`, questionId: q.id, level: q.level, topic: q.topic, tipo: q.tipo, concepto: q.concepto,
  selected: q.respuestaCorrecta, correct: true, responseMs: q.tiempoObjetivoSeg * 800,
  targetMs: q.tiempoObjetivoSeg * 1000, source: 'level', at: new Date().toISOString(),
}));
const sess = summarizeSession('level', 'Nivel 1', 1, attempts, 60000);
if (sess.accuracy !== 100) fail(`accuracy esperada 100, fue ${sess.accuracy}`);
if (sess.xpGained <= 0) fail('xpGained debe ser > 0');
profile = recordSession(profile, sess);
const snap = computeProgress(profile);
if (!snap.levels[0].passed) fail('Nivel 1 debería estar superado con 100%');
if (!snap.levels[1].unlocked) fail('Nivel 2 debería desbloquearse tras superar Nivel 1');
if (snap.xp <= 0) fail('XP del perfil debe ser > 0');

// Conceptos enriquecidos.
for (const c of CONCEPTS) {
  if (!c.explicacion || !c.analogia || !c.criterioClave || !c.buenaPractica || !c.dato) fail(`Concepto ${c.termino}: falta algún campo`);
  if (c.level < 1 || c.level > 10) fail(`Concepto ${c.termino}: nivel inválido`);
}
if (!getConcept('Token')) fail('getConcept no resuelve "Token"');
if (!LEARNING_PROMPTS.every((p) => p.prompt.includes('{tema}') || p.prompt.length > 40)) fail('Prompt sin contenido');
if (LEARNING_PROMPTS.length < 8) fail('Faltan prompts de aprendizaje');
if (TRENDS.length < 5) fail('Faltan novedades');

// SRS: un repaso "good" agenda la tarjeta a futuro.
const card = review(newCard('Token'), 'good');
if (card.intervalDays < 1) fail('SRS: intervalo tras "good" debe ser >= 1 día');
if (buildQueue({}, 1).length === 0) fail('SRS: cola de nivel 1 vacía');

// Test de nivel (onboarding).
const placementQs = buildPlacement();
if (placementQs.length !== 10) fail(`buildPlacement debe dar 10 preguntas (dio ${placementQs.length})`);
const allRight = placementQs.map((q, i) => ({
  id: `p${i}`, questionId: q.id, level: q.level, topic: q.topic, tipo: q.tipo, concepto: q.concepto,
  selected: q.respuestaCorrecta, correct: true, responseMs: 5000, targetMs: q.tiempoObjetivoSeg * 1000,
  source: 'diagnostic' as const, at: new Date().toISOString(),
}));
const placed = scorePlacement(allRight);
if (placed.placementLevel < 8) fail(`Con 10/10 el placement debería ser alto (fue ${placed.placementLevel})`);
const placedZero = scorePlacement(allRight.map((a) => ({ ...a, correct: false })));
if (placedZero.placementLevel !== 1) fail(`Con 0 aciertos el placement debe ser 1 (fue ${placedZero.placementLevel})`);

// Persona: zodiaco + arquetipo + estimación.
const virgo = signFromDate('1996-09-15');
if (!virgo || virgo.sign !== 'Virgo' || virgo.traits.length !== 3) fail('signFromDate no resuelve Virgo con 3 rasgos');
const cap = signFromDate('2000-01-05');
if (!cap || cap.sign !== 'Capricornio') fail('signFromDate no maneja Capricornio (cruce de año)');
const arch = computeArchetype({ goal: 'crear', interests: ['agentes', 'automatizacion'], hard: 60, role: 'dev' });
if (arch.id !== 'constructor') fail(`arquetipo esperado constructor, fue ${arch.id}`);
if (estimatePlacement({ hard: 85, interests: ['rag', 'agentes'] }) < 6) fail('estimatePlacement debería ser alto con hard 85');

const stats = bankStats();
console.log(`Persona: signo(15-sep)=${virgo?.sign} · arquetipo demo=${arch.name} ${arch.emoji}`);
console.log(`Onboarding: 10 preguntas · placement 10/10 → nivel ${placed.placementLevel} (${placed.tier})`);
console.log(`Conceptos: ${CONCEPTS.length} · Prompts: ${LEARNING_PROMPTS.length} · Novedades: ${TRENDS.length}`);
console.log(`Banco: ${stats.total} ejercicios · niveles=${JSON.stringify(stats.byLevel)}`);
console.log(`Glosario: ${GLOSSARY.length} términos · Niveles: ${LEVELS.length}`);
console.log(`Demo: nivel 1 superado=${snap.levels[0].passed}, nivel 2 desbloqueado=${snap.levels[1].unlocked}, XP=${snap.xp}, rank=${snap.rank}`);

if (errors) { console.error(`\n❌ ${errors} problema(s)`); process.exit(1); }
console.log('\n✅ Banco y engines íntegros');
