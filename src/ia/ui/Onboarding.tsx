import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Target } from 'lucide-react';
import { AIOrb } from './AIOrb';
import {
  COMM_STYLES, FORMATS, GOALS, INTERESTS, PACES, PAINS, ROLES,
  ageFromDate, computeArchetype, optionLabel, signFromDate, type Option,
} from '../persona';
import { buildPlacement, scorePlacement } from '../engine/placement';
import { summarizeSession } from '../engine/session';
import { useProfile } from '../state';
import type { Attempt, Choice, LevelId, Persona, Question } from '../types';
import { Button } from './components';
import { navigate } from './router';

type Flow = 'landing' | 'wizard' | 'test' | 'result';
type Depth = 'rapido' | 'completo';

const QUICK_LEVELS: Option[] = [
  { id: 'principiante', label: 'Soy nuevo en IA', emoji: '🌱' },
  { id: 'basico', label: 'Sé lo básico', emoji: '🔰' },
  { id: 'intermedio', label: 'Nivel intermedio', emoji: '⚡' },
  { id: 'avanzado', label: 'Bastante avanzado', emoji: '🔥' },
];
const QUICK_MAP: Record<string, { level: LevelId; hard: number }> = {
  principiante: { level: 1, hard: 15 }, basico: { level: 3, hard: 35 },
  intermedio: { level: 5, hard: 60 }, avanzado: { level: 7, hard: 82 },
};

const RAPIDO_STEPS = ['identidad', 'goal', 'interests', 'quick'] as const;
const COMPLETO_STEPS = ['identidad', 'goal', 'pains', 'interests', 'role', 'comm', 'skills', 'prefs'] as const;

export function Onboarding() {
  const { completeOnboarding } = useProfile();
  const [flow, setFlow] = useState<Flow>('landing');
  const [depth, setDepth] = useState<Depth>('completo');
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<Partial<Persona>>({ name: '', painPoints: [], interests: [], formats: [], hard: 30, soft: 45, power: 45 });
  const [quick, setQuick] = useState<string | undefined>();

  // test
  const [questions] = useState<Question[]>(() => buildPlacement());
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const qStart = useRef(Date.now());
  const startedAt = useRef(Date.now());

  const steps = depth === 'rapido' ? RAPIDO_STEPS : COMPLETO_STEPS;
  const update = (patch: Partial<Persona>) => setPersona((p) => ({ ...p, ...patch }));
  const toggle = (key: 'painPoints' | 'interests' | 'formats', id: string) =>
    setPersona((p) => { const arr = p[key] ?? []; return { ...p, [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] }; });

  const sign = persona.birthdate ? signFromDate(persona.birthdate) : undefined;

  const startFlow = (d: Depth) => { setDepth(d); setStep(0); setFlow('wizard'); };

  const skipDirect = () => {
    const p: Persona = { depth: 'directo', name: 'Aprendiz', painPoints: [], interests: [], formats: [], hard: 20, soft: 40, power: 40, archetype: computeArchetype({}) };
    completeOnboarding(p, 1, summarizeSession('diagnostic', 'Inicio directo', null, [], 0));
    navigate('#/mapa');
  };

  const canContinue = () => {
    const k = steps[step];
    if (k === 'identidad') return (persona.name ?? '').trim().length > 0;
    if (k === 'goal') return !!persona.goal;
    if (k === 'interests') return (persona.interests ?? []).length > 0;
    if (k === 'role') return !!persona.role;
    if (k === 'comm') return !!persona.commStyle;
    if (k === 'quick') return !!quick;
    return true;
  };

  const next = () => {
    if (step + 1 < steps.length) { setStep(step + 1); return; }
    if (depth === 'completo') { startedAt.current = Date.now(); qStart.current = Date.now(); setFlow('test'); }
    else setFlow('result');
  };
  const back = () => { if (step > 0) setStep(step - 1); else setFlow('landing'); };

  const choose = (q: Question, c: Choice) => {
    if (picked) return;
    setPicked(c.key);
    const a: Attempt = { id: crypto.randomUUID(), questionId: q.id, level: q.level, topic: q.topic, tipo: q.tipo, concepto: q.concepto, selected: c.key, correct: c.correct, responseMs: Date.now() - qStart.current, targetMs: q.tiempoObjetivoSeg * 1000, source: 'diagnostic', at: new Date().toISOString() };
    const arr = [...attempts, a];
    window.setTimeout(() => { setAttempts(arr); setPicked(null); if (qi + 1 >= questions.length) setFlow('result'); else { setQi(qi + 1); qStart.current = Date.now(); } }, 200);
  };

  const placement: LevelId = useMemo(() => {
    if (depth === 'completo' && attempts.length) return scorePlacement(attempts).placementLevel;
    if (depth === 'rapido' && quick) return QUICK_MAP[quick].level;
    return 1;
  }, [depth, attempts, quick]);

  const archetype = useMemo(() => computeArchetype({ ...persona, hard: quick ? QUICK_MAP[quick].hard : persona.hard }), [persona, quick]);

  const finish = () => {
    const full: Persona = {
      depth, name: (persona.name ?? 'Aprendiz').trim() || 'Aprendiz',
      birthdate: persona.birthdate, age: persona.birthdate ? ageFromDate(persona.birthdate) : undefined,
      sign: sign?.sign, signEmoji: sign?.emoji, signTraits: sign?.traits,
      goal: persona.goal, painPoints: persona.painPoints ?? [], interests: persona.interests ?? [],
      role: persona.role, commStyle: persona.commStyle, pace: persona.pace, formats: persona.formats ?? [],
      hard: quick ? QUICK_MAP[quick].hard : persona.hard ?? 30, soft: persona.soft ?? 45, power: persona.power ?? 45,
      archetype,
    };
    const session = summarizeSession('diagnostic', 'Onboarding', null, attempts, Date.now() - startedAt.current);
    completeOnboarding(full, placement, session);
    navigate('#/mapa');
  };

  return (
    <div className="aurora relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float absolute -left-24 -top-24 h-80 w-80 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="animate-float absolute right-0 top-10 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" style={{ animationDelay: '1.5s' }} />
        <div className="animate-float absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-600/15 blur-3xl" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 py-10">
        {flow === 'landing' && (
          <div className="w-full text-center">
            <div className="fade-up mx-auto"><AIOrb size={132} /></div>
            <h1 className="fade-up-1 font-display mt-7 text-4xl font-black leading-tight sm:text-6xl">
              Domina la <span className="gradient-text">Inteligencia Artificial</span>
            </h1>
            <p className="fade-up-2 mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
              Tu copiloto de aprendizaje adaptativo. Te conoce, mide tu nivel y te entrena con flashcards, retos y prompts hasta volverte experto.
            </p>
            <div className="fade-up-3 mt-8 grid gap-3 sm:grid-cols-3">
              <ChoiceCard emoji="⚡" title="Rápido" desc="~1 min: lo esencial y a entrenar." onClick={() => startFlow('rapido')} />
              <ChoiceCard emoji="🧭" title="Conóceme a fondo" desc="~4 min: perfil + test de nivel." highlight onClick={() => startFlow('completo')} />
              <ChoiceCard emoji="🚀" title="Entrar directo" desc="Sáltate todo y empieza ya." onClick={skipDirect} />
            </div>
            <p className="fade-up-4 mt-5 text-xs text-slate-500">Tus datos se guardan solo en tu navegador.</p>
          </div>
        )}

        {flow === 'wizard' && (
          <div className="w-full">
            <WizardHeader step={step} total={steps.length} />
            <div key={step} className="animate-pop rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
              {steps[step] === 'identidad' && (
                <Step title="¿Cómo te llamas?" subtitle="Y tu fecha de nacimiento, para conocerte mejor (signo y rasgos).">
                  <input autoFocus value={persona.name ?? ''} onChange={(e) => update({ name: e.target.value })} placeholder="Tu nombre" className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 font-bold text-slate-100 outline-none focus:border-violet-400" />
                  <input type="date" value={persona.birthdate ?? ''} onChange={(e) => update({ birthdate: e.target.value })} className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 font-bold text-slate-100 outline-none focus:border-violet-400 [color-scheme:dark]" />
                  {sign && (
                    <div className="animate-pop mt-4 flex items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 p-3">
                      <span className="text-3xl">{sign.emoji}</span>
                      <div>
                        <p className="font-display text-sm font-black text-violet-200">{sign.sign}{persona.birthdate ? ` · ${ageFromDate(persona.birthdate)} años` : ''}</p>
                        <p className="text-xs text-slate-400">{sign.traits.join(' · ')}</p>
                      </div>
                    </div>
                  )}
                </Step>
              )}
              {steps[step] === 'goal' && (
                <Step title="¿Para qué quieres dominar la IA?" subtitle="Tu motivación principal.">
                  <SingleSelect options={GOALS} value={persona.goal} onSelect={(id) => update({ goal: id })} />
                </Step>
              )}
              {steps[step] === 'pains' && (
                <Step title="¿Qué te frena hoy?" subtitle="Elige todo lo que aplique. Atacaremos esto.">
                  <MultiSelect options={PAINS} values={persona.painPoints ?? []} onToggle={(id) => toggle('painPoints', id)} />
                </Step>
              )}
              {steps[step] === 'interests' && (
                <Step title="¿Qué te interesa más?" subtitle="Personalizaremos tu ruta con esto.">
                  <MultiSelect options={INTERESTS} values={persona.interests ?? []} onToggle={(id) => toggle('interests', id)} />
                </Step>
              )}
              {steps[step] === 'role' && (
                <Step title="¿Cuál es tu perfil?" subtitle="Para adaptar ejemplos a tu mundo.">
                  <SingleSelect options={ROLES} value={persona.role} onSelect={(id) => update({ role: id })} />
                </Step>
              )}
              {steps[step] === 'comm' && (
                <Step title="¿Cómo prefieres que te expliquen?" subtitle="Tu estilo de comunicación.">
                  <SingleSelect options={COMM_STYLES} value={persona.commStyle} onSelect={(id) => update({ commStyle: id })} />
                </Step>
              )}
              {steps[step] === 'skills' && (
                <Step title="Autoevalúa tus skills" subtitle="Sé honesto: nos ayuda a ubicarte.">
                  <Slider label="Hard skills (técnicas)" value={persona.hard ?? 30} onChange={(v) => update({ hard: v })} />
                  <Slider label="Soft skills (blandas)" value={persona.soft ?? 45} onChange={(v) => update({ soft: v })} />
                  <Slider label="Power skills (criterio, liderazgo)" value={persona.power ?? 45} onChange={(v) => update({ power: v })} />
                </Step>
              )}
              {steps[step] === 'prefs' && (
                <Step title="¿Cómo te gusta aprender?" subtitle="Ritmo y formatos preferidos.">
                  <SingleSelect options={PACES} value={persona.pace} onSelect={(id) => update({ pace: id })} />
                  <div className="mt-4"><MultiSelect options={FORMATS} values={persona.formats ?? []} onToggle={(id) => toggle('formats', id)} /></div>
                </Step>
              )}
              {steps[step] === 'quick' && (
                <Step title="¿Qué tanto sabes de IA hoy?" subtitle="Para colocarte en el nivel correcto.">
                  <SingleSelect options={QUICK_LEVELS} value={quick} onSelect={setQuick} />
                </Step>
              )}

              <div className="mt-7 flex items-center justify-between gap-3">
                <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-black text-slate-400 hover:text-slate-200"><ArrowLeft size={16} /> Atrás</button>
                <Button onClick={next} disabled={!canContinue()}>
                  {step + 1 < steps.length ? 'Continuar' : depth === 'completo' ? 'Hacer test de nivel' : 'Ver mi perfil'} <ArrowRight size={16} />
                </Button>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-slate-500">{depth === 'completo' ? 'Perfil completo + test de nivel' : 'Flujo rápido'} · paso {step + 1} de {steps.length}</p>
          </div>
        )}

        {flow === 'test' && (() => {
          const q = questions[qi];
          if (!q) return null;
          const progress = (qi / questions.length) * 100;
          return (
            <div className="w-full">
              <WizardHeader step={qi} total={questions.length} label="Test de nivel" />
              <div key={qi} className="animate-pop rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Nivel {q.level}</p>
                <p className="font-display mt-2 text-xl font-black leading-snug text-slate-100 sm:text-2xl">{q.enunciado}</p>
                <div className="mt-6 grid gap-3">
                  {q.opciones.map((c) => (
                    <button key={c.key} disabled={!!picked} onClick={() => choose(q, c)} className={`choice-rise flex items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-default ${picked === c.key ? 'border-violet-500 bg-violet-500/20 text-white' : 'border-white/10 bg-slate-800/40 text-slate-200 hover:border-violet-400 hover:bg-slate-800'}`}>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-950/60 font-display text-sm font-black">{c.key}</span>
                      <span className="font-semibold leading-snug">{c.text}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all" style={{ width: `${progress}%` }} /></div>
            </div>
          );
        })()}

        {flow === 'result' && (
          <div className="w-full max-w-lg text-center">
            <div className="ring-in mx-auto"><AIOrb size={120} /></div>
            <p className="fade-up-1 mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">Tu perfil de aprendiz</p>
            <h2 className="fade-up-1 font-display text-4xl font-black">{archetype.emoji} {archetype.name}</h2>
            <p className="fade-up-2 mx-auto mt-3 max-w-md text-sm leading-6 text-slate-300">{archetype.desc}</p>

            <div className="fade-up-2 mt-5 grid gap-3 sm:grid-cols-2">
              {sign && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Signo</p>
                  <p className="mt-1 font-display text-base font-black text-violet-200">{sign.emoji} {sign.sign}</p>
                  <p className="text-xs text-slate-400">{sign.traits.join(' · ')}</p>
                </div>
              )}
              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-300">Punto de partida</p>
                <p className="mt-1 inline-flex items-center gap-2 font-display text-base font-black text-violet-100"><Target size={16} /> Nivel {placement} · desbloqueas 1–{placement}</p>
              </div>
            </div>

            {(persona.interests ?? []).length > 0 && (
              <div className="fade-up-3 mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Tu ruta priorizará</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(persona.interests ?? []).map((i) => <span key={i} className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-200">{optionLabel(INTERESTS, i)}</span>)}
                </div>
              </div>
            )}

            <Button className="fade-up-4 mt-7 w-full py-3 text-base" onClick={finish}><Check size={18} /> Entrar a AI Academy</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ChoiceCard({ emoji, title, desc, onClick, highlight }: { emoji: string; title: string; desc: string; onClick: () => void; highlight?: boolean }) {
  return (
    <button onClick={onClick} className={`group rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 ${highlight ? 'border-violet-500/50 bg-violet-500/10 hover:border-violet-400' : 'border-white/10 bg-slate-900/50 hover:border-violet-400'}`}>
      <span className="text-2xl">{emoji}</span>
      <p className="mt-2 font-display text-lg font-black text-slate-100">{title}</p>
      <p className="text-xs text-slate-400">{desc}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-violet-300">Elegir <ArrowRight size={13} className="transition group-hover:translate-x-0.5" /></span>
    </button>
  );
}

function WizardHeader({ step, total, label }: { step: number; total: number; label?: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <AIOrb size={44} />
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs font-black text-slate-400">
          <span>{label ?? 'Conociéndote'}</span><span className="text-violet-300">{step + 1}/{total}</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500" style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
      </div>
    </div>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-black text-slate-100">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function SingleSelect({ options, value, onSelect }: { options: Option[]; value?: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => (
        <button key={o.id} onClick={() => onSelect(o.id)} className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-sm font-bold transition ${value === o.id ? 'border-violet-500 bg-violet-500/15 text-white' : 'border-white/10 bg-slate-800/40 text-slate-200 hover:border-violet-400'}`}>
          {o.emoji && <span className="text-lg">{o.emoji}</span>}{o.label}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({ options, values, onToggle }: { options: Option[]; values: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = values.includes(o.id);
        return (
          <button key={o.id} onClick={() => onToggle(o.id)} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold transition ${on ? 'border-violet-500 bg-violet-500/15 text-white' : 'border-white/10 bg-slate-800/40 text-slate-200 hover:border-violet-400'}`}>
            {o.emoji && <span>{o.emoji}</span>}{o.label}{on && <Check size={14} className="text-violet-300" />}
          </button>
        );
      })}
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center justify-between text-sm"><span className="font-bold text-slate-200">{label}</span><span className="font-black text-violet-300">{value}%</span></div>
      <input type="range" min={0} max={100} step={5} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-violet-500" />
    </div>
  );
}
