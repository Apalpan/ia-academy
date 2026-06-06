import { useMemo, useState } from 'react';
import { Eye, Lightbulb, Repeat, Sparkles, Target, Zap } from 'lucide-react';
import { getConcept } from '../../concepts';
import { buildQueue, stats as srsStats } from '../../engine/srs';
import { useProfile } from '../../state';
import type { CardGrade } from '../../types';
import { Bar, Button, EmptyState, Panel, SectionTitle, StatTile } from '../components';
import { navigate } from '../router';

const LEVELS = ['Todos', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export function FlashcardsPage() {
  const { profile, reviewCard } = useProfile();
  const [phase, setPhase] = useState<'setup' | 'study' | 'done'>('setup');
  const [level, setLevel] = useState('Todos');
  const [queue, setQueue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const st = useMemo(() => srsStats(profile.flashcards), [profile.flashcards]);

  const start = () => {
    const lvl = level === 'Todos' ? undefined : Number(level);
    const q = buildQueue(profile.flashcards, lvl, 20);
    if (!q.length) return;
    setQueue(q);
    setIndex(0);
    setFlipped(false);
    setReviewed(0);
    setPhase('study');
  };

  const grade = (g: CardGrade) => {
    reviewCard(queue[index], g);
    setReviewed((r) => r + 1);
    if (index + 1 >= queue.length) setPhase('done');
    else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  if (phase === 'study') {
    const concept = getConcept(queue[index]);
    if (!concept) return null;
    const progress = (index / queue.length) * 100;
    return (
      <div className="grid gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setPhase('setup')} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-black text-slate-300 hover:border-rose-400">Salir</button>
            <p className="font-display text-sm font-black text-slate-200">Tarjeta {index + 1} / {queue.length}</p>
            <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-black text-violet-300">Nivel {concept.level}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${progress}%` }} /></div>
        </div>

        <div className="animate-pop min-h-[20rem] rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          {!flipped ? (
            <div className="grid min-h-[16rem] place-items-center text-center">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">¿Qué es?</p>
                <h2 className="font-display mt-3 text-4xl font-black text-white">{concept.termino}</h2>
                <p className="mt-4 text-sm text-slate-500">Intenta explicarlo y dar una analogía antes de voltear.</p>
                <Button className="mt-6" onClick={() => setFlipped(true)}><Eye size={16} /> Mostrar respuesta</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 text-left">
              <h2 className="font-display text-2xl font-black text-violet-300">{concept.termino}</h2>
              <Field label="Explicación">{concept.explicacion}</Field>
              <Field label="Analogía" tone="violet"><span className="italic">{concept.analogia}</span></Field>
              <Field label="Criterio clave" tone="sky">{concept.criterioClave}</Field>
              <Field label="Buena práctica" tone="emerald">{concept.buenaPractica}</Field>
              <Field label="Dato curioso" tone="amber"><span className="inline-flex gap-1.5"><Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-300" />{concept.dato}</span></Field>
            </div>
          )}
        </div>

        {flipped && (
          <div className="grid grid-cols-3 gap-2">
            <Button variant="danger" onClick={() => grade('again')}>Repasar</Button>
            <Button variant="soft" onClick={() => grade('good')}>Bien</Button>
            <Button onClick={() => grade('easy')}>Fácil</Button>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="grid gap-5">
        <Panel accent>
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/20 text-violet-300"><Sparkles size={26} /></span>
            <div>
              <h1 className="font-display text-2xl font-black text-white">Repaso completado 🎉</h1>
              <p className="text-sm text-slate-300">Repasaste {reviewed} tarjeta{reviewed === 1 ? '' : 's'}. La repetición espaciada las traerá de vuelta justo antes de que las olvides.</p>
            </div>
          </div>
        </Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setPhase('setup')}><Repeat size={16} /> Más tarjetas</Button>
          <Button onClick={() => navigate('#/mapa')}>Volver al mapa</Button>
        </div>
      </div>
    );
  }

  // setup
  const lvl = level === 'Todos' ? undefined : Number(level);
  const pending = buildQueue(profile.flashcards, lvl, 999).length;

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white">Flashcards</h1>
        <p className="mt-1 text-sm text-slate-400">Memoriza los conceptos clave con repetición espaciada. Cada tarjeta trae explicación, analogía, criterio, buena práctica y un dato curioso.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={<Target size={14} />} label="A repasar hoy" value={st.aRepasar} tone={st.aRepasar > 0 ? 'warn' : 'good'} />
        <StatTile icon={<Sparkles size={14} />} label="Dominadas" value={st.dominadas} />
        <StatTile icon={<Eye size={14} />} label="Estudiadas" value={`${st.estudiadas}/${st.total}`} />
        <StatTile icon={<Zap size={14} />} label="Total conceptos" value={st.total} />
      </div>

      <Panel>
        <SectionTitle eyebrow="Elige" title="¿Qué repasar?" />
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button key={l} onClick={() => setLevel(l)} className={`rounded-xl border px-3.5 py-2 text-sm font-black transition ${level === l ? 'border-violet-500 bg-violet-500/15 text-white' : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-violet-400'}`}>
              {l === 'Todos' ? 'Todos' : `N${l}`}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-400">{pending > 0 ? `${pending} tarjeta${pending === 1 ? '' : 's'} en cola (vencidas + nuevas).` : 'Nada pendiente aquí ahora mismo. ¡Vuelve mañana o elige otro nivel!'}</p>
        <div className="mt-3">
          <Button onClick={start} disabled={pending === 0}><Sparkles size={16} /> Empezar repaso</Button>
        </div>
      </Panel>

      {st.estudiadas > 0 && (
        <Panel>
          <SectionTitle title="Tu memoria" />
          <Bar label="Conceptos dominados" value={(st.dominadas / st.total) * 100} sub={`${st.dominadas}/${st.total}`} color="bg-emerald-500" />
        </Panel>
      )}

      {st.total === 0 && <EmptyState title="Sin conceptos" text="Aún no hay fichas cargadas." />}
    </div>
  );
}

function Field({ label, children, tone = 'slate' }: { label: string; children: React.ReactNode; tone?: 'slate' | 'violet' | 'sky' | 'emerald' | 'amber' }) {
  const toneText = { slate: 'text-slate-400', violet: 'text-violet-400', sky: 'text-sky-400', emerald: 'text-emerald-400', amber: 'text-amber-400' }[tone];
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
      <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${toneText}`}>{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-200">{children}</p>
    </div>
  );
}
