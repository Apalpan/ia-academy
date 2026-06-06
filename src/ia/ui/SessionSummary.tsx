import { useState } from 'react';
import { ChevronDown, RotateCcw, Sparkles, Target, Zap } from 'lucide-react';
import type { Attempt, SessionResult } from '../types';
import { getQuestion } from '../engine/questionBank';
import { Button, Panel, ProgressRing, StatTile } from './components';

export function SessionSummary({ session, onRepeat, onHome, repeatLabel = 'Otra ronda' }: { session: SessionResult; onRepeat?: () => void; onHome: () => void; repeatLabel?: string }) {
  const { attempts } = session;
  const missed = attempts.filter((a) => !a.correct);
  const passed = session.accuracy >= 70;

  return (
    <div className="grid gap-5">
      <Panel accent>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">{session.title} · completado</p>
            <h2 className="font-display mt-1 text-3xl font-black text-white">{passed ? '¡Bien hecho! 🎉' : 'Sigue practicando'}</h2>
            <p className="mt-1 text-sm text-slate-300">{session.correct} de {attempts.length} correctas · {passed ? 'superaste el umbral del 70%' : 'necesitas 70% para avanzar'}</p>
          </div>
          <ProgressRing value={session.accuracy} sublabel="precisión" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <StatTile icon={<Zap size={14} />} label="XP ganada" value={`+${session.xpGained}`} tone="good" />
          <StatTile icon={<Target size={14} />} label="Precisión" value={`${session.accuracy}%`} tone={passed ? 'good' : 'warn'} />
          <StatTile icon={<Sparkles size={14} />} label="Correctas" value={`${session.correct}/${attempts.length}`} />
        </div>
      </Panel>

      {missed.length > 0 && (
        <Panel>
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Repaso de lo que fallaste ({missed.length})</p>
          <div className="grid gap-2">
            {missed.map((a) => <MissedItem key={a.id} attempt={a} />)}
          </div>
        </Panel>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {onRepeat && <Button variant="ghost" onClick={onRepeat}><RotateCcw size={16} /> {repeatLabel}</Button>}
        <Button onClick={onHome}>Volver al mapa</Button>
      </div>
    </div>
  );
}

function MissedItem({ attempt }: { attempt: Attempt }) {
  const [open, setOpen] = useState(false);
  const q = getQuestion(attempt.questionId);
  if (!q) return null;
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 p-3 text-left">
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-black text-slate-200">{q.enunciado}</span>
          <span className="text-xs font-bold text-slate-500">Nivel {q.level} · {q.concepto}</span>
        </span>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-slate-800 p-4 text-sm">
          <p className="font-black text-emerald-300">{q.respuestaCorrecta}. {q.opciones.find((c) => c.correct)?.text}</p>
          <p className="mt-2 leading-6 text-slate-300">{q.explicacion}</p>
        </div>
      )}
    </div>
  );
}
