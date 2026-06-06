import { useMemo, useRef, useState } from 'react';
import { ArrowRight, Brain, Check, Layers, Newspaper, Rocket, Sparkles, Target, Wand2 } from 'lucide-react';
import { buildPlacement, scorePlacement } from '../engine/placement';
import { summarizeSession } from '../engine/session';
import { useProfile } from '../state';
import type { Attempt, Choice, Question } from '../types';
import { Button, ProgressRing } from './components';
import { navigate } from './router';

type Phase = 'landing' | 'name' | 'quiz' | 'result';

const FEATURES = [
  { icon: Layers, title: '10 niveles', text: 'De fundamentos a estrategia, paso a paso.' },
  { icon: Sparkles, title: 'Flashcards', text: 'Repetición espaciada para no olvidar.' },
  { icon: Wand2, title: 'Prompts', text: 'Aprende cualquier tema con IA.' },
  { icon: Newspaper, title: 'Novedades', text: 'Tendencias con criterio, no ruido.' },
];

function buildAttempt(q: Question, choice: Choice, responseMs: number): Attempt {
  return {
    id: crypto.randomUUID(), questionId: q.id, level: q.level, topic: q.topic, tipo: q.tipo,
    concepto: q.concepto, selected: choice.key, correct: choice.correct,
    responseMs, targetMs: q.tiempoObjetivoSeg * 1000, source: 'diagnostic', at: new Date().toISOString(),
  };
}

export function Onboarding() {
  const { completeOnboarding } = useProfile();
  const [phase, setPhase] = useState<Phase>('landing');
  const [name, setName] = useState('');
  const [questions] = useState<Question[]>(() => buildPlacement());
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const qStart = useRef(Date.now());
  const startedAt = useRef(Date.now());

  const result = useMemo(() => (phase === 'result' ? scorePlacement(attempts) : null), [phase, attempts]);

  const choose = (q: Question, choice: Choice) => {
    if (selected) return;
    setSelected(choice.key);
    const attempt = buildAttempt(q, choice, Date.now() - qStart.current);
    const next = [...attempts, attempt];
    window.setTimeout(() => {
      setAttempts(next);
      setSelected(null);
      if (qIndex + 1 >= questions.length) setPhase('result');
      else {
        setQIndex((i) => i + 1);
        qStart.current = Date.now();
      }
    }, 220);
  };

  const finish = (placementLevel: number, finalAttempts: Attempt[]) => {
    const session = summarizeSession('diagnostic', 'Test de nivel', null, finalAttempts, Date.now() - startedAt.current);
    completeOnboarding(name, placementLevel as Attempt['level'], session);
    navigate('#/mapa');
  };

  const skip = () => {
    const session = summarizeSession('diagnostic', 'Test de nivel', null, [], 0);
    completeOnboarding(name, 1, session);
    navigate('#/mapa');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Fondo animado */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float absolute -left-24 -top-24 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="animate-float absolute right-0 top-10 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" style={{ animationDelay: '1.5s' }} />
        <div className="animate-float absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 py-10">
        {phase === 'landing' && (
          <div className="w-full text-center">
            <div className="fade-up mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 font-display text-xl font-black shadow-[0_0_50px_rgba(139,92,246,0.6)]">IA</div>
            <h1 className="fade-up-1 font-display mt-6 text-4xl font-black leading-tight sm:text-6xl">
              Vuélvete experto en <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Inteligencia Artificial</span>
            </h1>
            <p className="fade-up-2 mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
              Terminología, conceptos y herramientas de IA y productividad, del nivel 1 al 10. Practica unos minutos al día y domina lo que la mayoría apenas nombra.
            </p>
            <div className="fade-up-3 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-left backdrop-blur">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-500/15 text-violet-300"><Icon size={18} /></span>
                    <p className="mt-2 font-display text-sm font-black text-slate-100">{f.title}</p>
                    <p className="text-xs text-slate-400">{f.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="fade-up-4 mt-8 flex flex-col items-center gap-3">
              <Button className="px-6 py-3 text-base" onClick={() => setPhase('name')}>
                <Rocket size={18} /> Empezar — mide mi nivel
              </Button>
              <button onClick={skip} className="text-xs font-bold text-slate-500 hover:text-slate-300">Prefiero empezar desde el Nivel 1</button>
            </div>
          </div>
        )}

        {phase === 'name' && (
          <div className="w-full max-w-md animate-pop text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/20 text-violet-300"><Brain size={26} /></span>
            <h2 className="font-display mt-5 text-3xl font-black">¿Cómo te llamas?</h2>
            <p className="mt-2 text-sm text-slate-400">Para personalizar tu experiencia (se guarda solo en tu navegador).</p>
            <input
              autoFocus value={name} onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { startedAt.current = Date.now(); qStart.current = Date.now(); setPhase('quiz'); } }}
              placeholder="Tu nombre"
              className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-center font-bold text-slate-100 outline-none focus:border-violet-400"
            />
            <Button className="mt-5 w-full py-3" onClick={() => { startedAt.current = Date.now(); qStart.current = Date.now(); setPhase('quiz'); }}>
              Comenzar test de nivel <ArrowRight size={16} />
            </Button>
            <p className="mt-3 text-xs text-slate-500">10 preguntas · ~3 minutos · sin presión</p>
          </div>
        )}

        {phase === 'quiz' && (() => {
          const q = questions[qIndex];
          if (!q) return null;
          const progress = (qIndex / questions.length) * 100;
          return (
            <div className="w-full">
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between text-xs font-black text-slate-400">
                  <span>Pregunta {qIndex + 1} de {questions.length}</span>
                  <span className="text-violet-300">Test de nivel</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div key={qIndex} className="animate-pop rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Nivel {q.level}</p>
                <p className="font-display mt-2 text-xl font-black leading-snug text-slate-100 sm:text-2xl">{q.enunciado}</p>
                <div className="mt-6 grid gap-3">
                  {q.opciones.map((choice) => (
                    <button
                      key={choice.key}
                      disabled={!!selected}
                      onClick={() => choose(q, choice)}
                      className={`choice-rise flex items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-default ${selected === choice.key ? 'border-violet-500 bg-violet-500/20 text-white' : 'border-slate-700 bg-slate-800/40 text-slate-200 hover:border-violet-400 hover:bg-slate-800'}`}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-950/60 font-display text-sm font-black">{choice.key}</span>
                      <span className="font-semibold leading-snug">{choice.text}</span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">Responde con sinceridad: esto solo nos ayuda a ubicarte bien. No verás "correcto/incorrecto" hasta el final.</p>
            </div>
          );
        })()}

        {phase === 'result' && result && (
          <div className="w-full max-w-md text-center">
            <div className="ring-in mx-auto w-fit">
              <ProgressRing value={Math.round((result.correct / result.total) * 100)} sublabel="aciertos" />
            </div>
            <p className="fade-up-1 mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">Tu nivel</p>
            <h2 className="fade-up-1 font-display text-4xl font-black">{result.tier}</h2>
            <p className="fade-up-2 mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-300">{result.tierDesc}</p>
            <div className="fade-up-2 mt-5 inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-black text-violet-200">
              <Target size={16} /> Empezarás en el Nivel {result.placementLevel}
            </div>
            <div className="fade-up-3 mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat label="Aciertos" value={`${result.correct}/${result.total}`} />
              <Stat label="Nivel" value={`${result.placementLevel}/10`} />
              <Stat label="Desbloqueas" value={`1–${result.placementLevel}`} />
            </div>
            <Button className="fade-up-4 mt-7 w-full py-3 text-base" onClick={() => finish(result.placementLevel, attempts)}>
              <Check size={18} /> Entrar a IA Academy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <p className="font-display text-lg font-black text-slate-100">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
    </div>
  );
}
