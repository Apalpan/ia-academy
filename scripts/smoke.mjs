import { chromium } from 'playwright-core';

const URL = process.env.SMOKE_URL || 'http://localhost:4173/';
const channels = ['msedge', 'chrome', 'chrome-beta'];

async function launch() {
  for (const channel of channels) {
    try {
      return await chromium.launch({ channel });
    } catch {
      /* siguiente */
    }
  }
  return null;
}

const browser = await launch();
if (!browser) {
  console.log('SKIP: no hay Edge/Chrome para el smoke test.');
  process.exit(2);
}

let ok = true;
const errors = [];

// 1) Onboarding: con storage limpio debe mostrar la landing y llegar al test.
const ctx1 = await browser.newContext();
const p1 = await ctx1.newPage();
p1.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
await p1.goto(URL, { waitUntil: 'networkidle' });
await p1.waitForTimeout(500);
const landing = (await p1.textContent('body')) || '';
const landingOk = landing.includes('Domina la') && landing.includes('Inteligencia Artificial');
console.log(`Landing visible: ${landingOk ? 'OK' : 'NO'}`);
if (!landingOk) ok = false;
await p1.screenshot({ path: 'scripts/smoke-landing.png' });
await p1.getByRole('button', { name: /Conóceme a fondo/i }).click().catch(() => {});
await p1.waitForTimeout(400);
const wizardOk = (await p1.textContent('body'))?.includes('¿Cómo te llamas?');
console.log(`Onboarding wizard arranca (identidad): ${wizardOk ? 'OK' : 'NO'}`);
if (!wizardOk) ok = false;
await ctx1.close();

// 2) Rutas internas: sembramos un perfil ya "onboarded" para saltar la landing.
const ctx2 = await browser.newContext();
const p2 = await ctx2.newPage();
p2.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource/i.test(m.text())) errors.push(m.text()); });
p2.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
await p2.addInitScript(() => {
  localStorage.setItem('ia-academy:profile:v1', JSON.stringify({
    version: 1, createdAt: new Date().toISOString(), name: 'Test', onboarded: true, placementLevel: 3,
    xp: 0, attempts: [], sessions: [], seenQuestionIds: [], flashcards: {},
    streak: { current: 0, best: 0, lastActiveDay: null }, settings: { reducedMotion: false, dailyGoal: 15 },
  }));
});
const routes = ['#/mapa', '#/flashcards', '#/quiz', '#/prompts', '#/novedades', '#/glosario', '#/progreso', '#/errores', '#/config', '#/level/3'];
for (const route of routes) {
  await p2.goto(URL + route, { waitUntil: 'networkidle' });
  await p2.waitForTimeout(300);
  const body = (await p2.textContent('body')) || '';
  const mounted = body.includes('AI Academy');
  console.log(`${route.padEnd(14)} → ${mounted ? 'render OK' : 'VACÍO'} (${body.length} chars)`);
  if (!mounted) ok = false;
}
await ctx2.close();

await browser.close();
if (errors.length) console.error('\nErrores:\n' + errors.slice(0, 10).join('\n'));
console.log(ok && errors.length === 0 ? '\n✅ Smoke test OK' : '\n⚠️ Revisar arriba');
process.exit(ok && errors.length === 0 ? 0 : 1);
