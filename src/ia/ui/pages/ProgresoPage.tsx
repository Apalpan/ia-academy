import { BookOpen, Sparkles, Target, TrendingUp } from 'lucide-react';
import { getLevel } from '../../levels';
import { useProfile } from '../../state';
import { Bar, Button, EmptyState, Panel, ProgressRing, SectionTitle, StatTile } from '../components';
import { navigate } from '../router';

export function ProgresoPage() {
  const { snapshot } = useProfile();
  if (!snapshot.totalAttempts) {
    return <EmptyState title="Sin progreso aún" text="Empieza el Nivel 1 para generar tu mapa de dominio, XP y conceptos a reforzar." action={<Button onClick={() => navigate('#/level/1')}>Empezar Nivel 1</Button>} />;
  }
  const overall = Math.round(snapshot.levels.reduce((s, l) => s + l.mastery, 0) / snapshot.levels.length);

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-2xl font-black text-white">Tu progreso</h1>

      <Panel accent>
        <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex items-center justify-center gap-6">
            <ProgressRing value={overall} sublabel="dominio total" />
            <div className="text-center">
              <p className="font-display text-3xl font-black text-white">{snapshot.xp}</p>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">XP · {snapshot.rank}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile icon={<Target size={14} />} label="Precisión" value={`${snapshot.globalAccuracy}%`} tone={snapshot.globalAccuracy >= 80 ? 'good' : 'warn'} />
            <StatTile icon={<TrendingUp size={14} />} label="Nivel" value={`${snapshot.unlockedLevel}/10`} />
            <StatTile icon={<BookOpen size={14} />} label="Términos vistos" value={snapshot.termsSeen} />
            <StatTile icon={<Sparkles size={14} />} label="Preguntas" value={snapshot.totalAttempts} />
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle eyebrow="Mapa de dominio" title="Dominio por nivel" />
        <div className="grid gap-3">
          {snapshot.levels.map((l) => (
            <div key={l.level} className="flex items-center gap-3">
              <button onClick={() => l.unlocked && navigate(`#/level/${l.level}`)} className={`w-40 shrink-0 truncate text-left text-sm font-bold ${l.unlocked ? 'text-slate-200 hover:text-violet-300' : 'text-slate-600'}`}>
                N{l.level} · {getLevel(l.level).titulo}
              </button>
              <div className="flex-1"><Bar label="" value={l.unlocked ? l.mastery : 0} sub={l.passed ? '✓ superado' : l.unlocked ? `${l.mastery}%` : '🔒'} /></div>
            </div>
          ))}
        </div>
      </Panel>

      {snapshot.weakConcepts.length > 0 && (
        <Panel>
          <SectionTitle eyebrow="A reforzar" title="Conceptos que más fallas" action={<Button variant="ghost" onClick={() => navigate('#/errores')}>Repasar</Button>} />
          <div className="flex flex-wrap gap-2">
            {snapshot.weakConcepts.map((w) => (
              <span key={w.concepto} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-black text-slate-200">
                {w.concepto} <span className="rounded bg-rose-500/20 px-1.5 text-rose-300">{w.fails}</span>
              </span>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
