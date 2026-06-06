import { ArrowRight, Check, Layers, Lock, Play, Shuffle } from 'lucide-react';
import { LEVELS } from '../../levels';
import { dueCount } from '../../engine/srs';
import { useProfile } from '../../state';
import { AIOrb } from '../AIOrb';
import { Bar, Button, Panel, resolveIcon } from '../components';
import { navigate } from '../router';

export function MapaPage() {
  const { profile, snapshot } = useProfile();
  const persona = profile.persona;
  const passedCount = snapshot.levels.filter((l) => l.passed).length;
  const overall = Math.round(snapshot.levels.reduce((s, l) => s + l.mastery, 0) / snapshot.levels.length);
  const due = dueCount(profile.flashcards);

  return (
    <div className="grid gap-5">
      <Panel accent className="aurora overflow-hidden">
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">
              Hola, {profile.name} {persona?.signEmoji ?? ''}
            </p>
            <h1 className="font-display mt-1 text-3xl font-black text-white sm:text-4xl">
              {persona?.archetype ? <>Eres un <span className="gradient-text">{persona.archetype.name}</span></> : 'Aprende IA, nivel por nivel'}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              {persona?.archetype?.desc ?? 'Del fundamento a la estrategia: supera cada nivel con 70% para desbloquear el siguiente.'}
            </p>
            {persona && (persona.interests.length > 0 || persona.signTraits) && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {persona.signTraits?.map((t) => <span key={t} className="rounded-md bg-violet-500/10 px-2 py-0.5 text-[11px] font-bold text-violet-200">{t}</span>)}
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => navigate(`#/level/${snapshot.currentLevel}`)}>
                <Play size={16} /> Continuar en Nivel {snapshot.currentLevel}
              </Button>
              <Button variant="ghost" onClick={() => navigate('#/quiz')}>Quiz mixto <ArrowRight size={16} /></Button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5">
            <AIOrb size={128} />
            <div className="text-center">
              <p className="font-display text-4xl font-black text-white">{passedCount}<span className="text-lg text-slate-500">/10</span></p>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">niveles superados</p>
              <p className="mt-2 font-display text-2xl font-black text-violet-300">{overall}%</p>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">dominio total</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">Reto del día</p>
            <h2 className="font-display text-xl font-black text-slate-100">Tu rutina para volverte experto</h2>
            <p className="mt-1 text-sm text-slate-400">
              {due > 0 ? `${due} flashcard${due === 1 ? '' : 's'} te esperan` : 'Sin flashcards pendientes hoy'} · racha de {profile.streak.current} día{profile.streak.current === 1 ? '' : 's'} · {snapshot.xp} XP
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => navigate('#/flashcards')}><Layers size={16} /> Flashcards{due > 0 ? ` (${due})` : ''}</Button>
            <Button onClick={() => navigate('#/quiz')}><Shuffle size={16} /> Quiz de hoy</Button>
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
