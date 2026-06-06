import { useRef, useState } from 'react';
import { ArrowLeft, Check, Cpu, Play, Wrench } from 'lucide-react';
import { getLevel } from '../../levels';
import { glossaryByLevel } from '../../glossary';
import { pickForLevel } from '../../engine/questionBank';
import { summarizeSession } from '../../engine/session';
import { useProfile } from '../../state';
import type { Attempt, LevelId, Question, SessionResult } from '../../types';
import { Bar, Button, EmptyState, Panel, SectionTitle, resolveIcon } from '../components';
import { QuestionRunner } from '../QuestionRunner';
import { SessionSummary } from '../SessionSummary';
import { navigate } from '../router';

export function LevelPage({ levelParam }: { levelParam?: string }) {
  const id = Number(levelParam) as LevelId;
  const valid = id >= 1 && id <= 10;
  const { profile, snapshot, recordSession } = useProfile();
  const [phase, setPhase] = useState<'intro' | 'run' | 'done'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<SessionResult | null>(null);
  const startTime = useRef(0);

  if (!valid) {
    return <EmptyState title="Nivel no encontrado" text="Vuelve al mapa para elegir un nivel válido." action={<Button onClick={() => navigate('#/mapa')}>Ir al mapa</Button>} />;
  }

  const def = getLevel(id);
  const lp = snapshot.levels.find((l) => l.level === id)!;
  const Icon = resolveIcon(def.icon);
  const terms = glossaryByLevel(id);

  if (!lp.unlocked) {
    return (
      <EmptyState
        title={`Nivel ${id} bloqueado`}
        text={`Supera el Nivel ${id - 1} con al menos 70% para desbloquearlo.`}
        action={<Button onClick={() => navigate(`#/level/${id - 1}`)}>Ir al Nivel {id - 1}</Button>}
      />
    );
  }

  const start = () => {
    setQuestions(pickForLevel(id, 6, profile.seenQuestionIds));
    startTime.current = Date.now();
    setPhase('run');
  };

  const complete = (attempts: Attempt[]) => {
    const sess = summarizeSession('level', `Nivel ${id}: ${def.titulo}`, id, attempts, Date.now() - startTime.current);
    recordSession(sess);
    setSession(sess);
    setPhase('done');
  };

  if (phase === 'run') {
    return <QuestionRunner questions={questions} title={`Nivel ${id} · ${def.titulo}`} source="level" level={id} onComplete={complete} onExit={() => setPhase('intro')} />;
  }

  if (phase === 'done' && session) {
    return <SessionSummary session={session} onRepeat={start} onHome={() => navigate('#/mapa')} repeatLabel="Reintentar nivel" />;
  }

  return (
    <div className="grid gap-5">
      <button onClick={() => navigate('#/mapa')} className="inline-flex w-fit items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-200">
        <ArrowLeft size={15} /> Mapa de niveles
      </button>

      <Panel accent>
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-500/20 text-violet-300"><Icon size={26} /></span>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Nivel {id} {lp.passed && '· superado'}</p>
            <h1 className="font-display text-2xl font-black text-white">{def.titulo}</h1>
            <p className="mt-1 text-sm text-slate-300">{def.meta}</p>
          </div>
          {lp.passed && <span className="ml-auto inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-black text-emerald-300"><Check size={13} /> 100%</span>}
        </div>
        {lp.attempts > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2"><Bar label="Dominio" value={lp.mastery} /><Bar label="Mejor intento" value={lp.bestAccuracy} /></div>}
        <div className="mt-5">
          <Button onClick={start}><Play size={16} /> {lp.attempts > 0 ? 'Practicar de nuevo' : 'Empezar nivel'}</Button>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <SectionTitle eyebrow="Qué dominarás" title="Conceptos clave" />
          <div className="flex flex-wrap gap-2">
            {def.conceptos.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-bold text-slate-200"><Cpu size={12} className="text-violet-300" /> {c}</span>
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle eyebrow="Stack" title="Herramientas" />
          <div className="flex flex-wrap gap-2">
            {def.herramientas.map((h) => (
              <span key={h} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-bold text-slate-200"><Wrench size={12} className="text-amber-300" /> {h}</span>
            ))}
          </div>
        </Panel>
      </div>

      {terms.length > 0 && (
        <Panel>
          <SectionTitle eyebrow="Mini-glosario del nivel" title={`${terms.length} términos`} />
          <div className="grid gap-2 sm:grid-cols-2">
            {terms.map((t) => (
              <div key={t.n} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="font-display text-sm font-black text-violet-300">{t.termino}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">{t.definicion}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
