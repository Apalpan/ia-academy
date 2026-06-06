import { chromium } from 'playwright-core';

const URL = process.env.SMOKE_URL || 'http://localhost:4173/';
const channels = ['msedge', 'chrome', 'chrome-beta'];

async function launch() {
  for (const channel of channels) {
    try {
      const browser = await chromium.launch({ channel });
      console.log('Navegador:', channel);
      return browser;
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

const page = await browser.newPage();
const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() !== 'error') return;
  if (/favicon|Failed to load resource/i.test(m.text())) return;
  consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

let ok = true;
const routes = ['#/mapa', '#/quiz', '#/glosario', '#/progreso', '#/errores', '#/config', '#/level/1'];
for (const route of routes) {
  await page.goto(URL + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const body = (await page.textContent('body')) || '';
  const mounted = body.includes('IA Academy');
  console.log(`${route.padEnd(14)} → ${mounted ? 'render OK' : 'VACÍO'} (${body.length} chars)`);
  if (!mounted) ok = false;
}

// Flujo: iniciar Nivel 1 y responder la primera.
await page.goto(URL + '#/level/1', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Empezar nivel/i }).click().catch(() => {});
await page.waitForTimeout(400);
const hasQ = (await page.textContent('body'))?.includes('Pregunta 1');
console.log('Nivel 1 inicia y muestra Pregunta 1:', hasQ ? 'OK' : 'NO');
if (!hasQ) ok = false;

await page.goto(URL + '#/mapa', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: 'scripts/smoke-mapa.png', fullPage: true });

await browser.close();
if (consoleErrors.length) console.error('\nErrores de consola:\n' + consoleErrors.slice(0, 10).join('\n'));
console.log(ok && consoleErrors.length === 0 ? '\n✅ Smoke test OK' : '\n⚠️ Revisar arriba');
process.exit(ok && consoleErrors.length === 0 ? 0 : 1);
