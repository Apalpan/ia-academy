import { ArrowRight, Check, Lock, Play } from 'lucide-react';
import { LEVELS } from '../../levels';
import { useProfile } from '../../state';
import { Bar, Button, Panel, ProgressRing, resolveIcon } from '../components';
import { navigate } from '../router';

export function MapaPage() {
  const { profile, snapshot } = useProfile();
  const passedCount = snapshot.levels.filter((l) => l.passed).length;
  const overall = Math.round(snapshot.levels.reduce((s, l) => s + l.mastery, 0) / snapshot.levels.length);

  return (
    <div className="grid gap-5">
      <Panel accent>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">Hola, {profile.name}</p>
            <h1 className="font-display mt-1 text-3xl font-black text-white sm:text-4xl">Aprende IA, nivel por nivel</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Del fundamento a la estrategia: terminología, conceptos y herramientas de IA y productividad.
              Supera cada nivel con 70% para desbloquear el siguiente.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => navigate(`#/level/${snapshot.currentLevel}`)}>
                <Play size={16} /> Continuar en Nivel {snapshot.currentLevel}
              </Button>
              <Button variant="ghost" onClick={() => navigate('#/quiz')}>Quiz mixto <ArrowRight size={16} /></Button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <ProgressRing value={overall} sublabel="dominio total" />
            <div className="text-center">
              <p className="font-display text-4xl font-black text-white">{passedCount}<span className="text-lg text-slate-500">/10</span></p>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">niveles superados</p>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-3">
        {LEVELS.map((def) => {
          const lp = snapshot.levels.find((l) => l.level === def.id)!;
          const Icon = resolveIcon(def.icon);
          const locked = !lp.unlocked;
          return (
            <button
              key={def.id}
              disabled={locked}
              onClick={() => navigate(`#/level/${def.id}`)}
              className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition ${locked ? 'border-slate-800 bg-slate-900/30 opacity-60' : lp.passed ? 'border-emerald-500/30 bg-emerald-500/[0.06] hover:border-emerald-400' : 'border-slate-800 bg-slate-900/60 hover:border-violet-400'}`}
            >
              <div className="relative">
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${lp.passed ? 'bg-emerald-500/20 text-emerald-300' : locked ? 'bg-slate-800 text-slate-500' : 'bg-violet-500/20 text-violet-300'}`}>
                  {locked ? <Lock size={22} /> : <Icon size={24} />}
                </span>
                {lp.passed && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white"><Check size={13} /></span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Nivel {def.id}</span>
                  {lp.passed && <span className="rounded bg-emerald-500/15 px-1.5 text-[10px] font-black text-emerald-300">SUPERADO</span>}
                </div>
                <p className="font-display text-lg font-black leading-tight text-slate-100">{def.titulo}</p>
                <p className="truncate text-xs text-slate-400">{def.subtitulo}</p>
                {!locked && lp.attempts > 0 && <div className="mt-2 max-w-xs"><Bar label="" value={lp.mastery} sub={`${lp.mastery}% dominio`} /></div>}
              </div>
              {!locked && <ArrowRight size={18} className="shrink-0 text-slate-500 transition group-hover:text-violet-300" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
