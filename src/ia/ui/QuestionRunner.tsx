import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Lightbulb, Route, XCircle } from 'lucide-react';
import type { Attempt, Choice, ChoiceKey, LevelId, Question, SessionKind } from '../types';
import { Button, QTypeBadge } from './components';

interface Props {
  questions: Question[];
  title: string;
  source: SessionKind;
  level: LevelId | null;
  onComplete: (attempts: Attempt[]) => void;
  onExit: () => void;
}

function buildAttempt(q: Question, selected: ChoiceKey, correct: boolean, responseMs: number, source: SessionKind): Attempt {
  return {
    id: crypto.randomUUID(),
    questionId: q.id,
    level: q.level,
    topic: q.topic,
    tipo: q.tipo,
    concepto: q.concepto,
    selected,
    correct,
    responseMs,
    targetMs: q.tiempoObjetivoSeg * 1000,
    source,
    at: new Date().toISOString(),
  };
}

export function QuestionRunner({ questions, title, source, onComplete, onExit }: Props) {
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<ChoiceKey | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const qStart = useRef(Date.now());
  const finished = useRef(false);

  const current = questions[index];
  const correctCount = attempts.filter((a) => a.correct).length;

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(t);
  }, []);

  function handleSelect(choice: Choice) {
    if (revealed || finished.current || !current) return;
    const responseMs = Date.now() - qStart.current;
    setAttempts((prev) => [...prev, buildAttempt(current, choice.key, choice.correct, responseMs, source)]);
    setSelected(choice.key);
    setRevealed(true);
  }

  function advance() {
    const next = index + 1;
    if (next >= total) {
      if (finished.current) return;
      finished.current = true;
      onComplete(attempts);
      return;
    }
    setIndex(next);
    setSelected(null);
    setRevealed(false);
    qStart.current = Date.now();
  }

  // Teclado A–D / Enter, leyendo siempre el último estado vía ref.
  const latest = useRef({ handleSelect, advance, revealed, current });
  latest.current = { handleSelect, advance, revealed, current };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const h = latest.current;
      if (h.revealed) {
        if (e.key === 'Enter') h.advance();
        return;
      }
      const key = e.key.toUpperCase();
      const choice = h.current?.opciones.find((c) => c.key === key);
      if (choice) h.handleSelect(choice);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!current) return null;
  const elapsed = (now - qStart.current) / 1000;
  const over = elapsed > current.tiempoObjetivoSeg;
  const progress = (index / total) * 100;
  const wasCorrect = selected ? current.opciones.find((c) => c.key === selected)?.correct : false;

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={onExit} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-black text-slate-300 hover:border-rose-400 hover:text-rose-300">Salir</button>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-400">{title}</p>
              <p className="font-display text-sm font-black text-slate-200">Pregunta {index + 1} / {total}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-black text-emerald-300">{correctCount} ✓</span>
            <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black ${over ? 'bg-rose-500/15 text-rose-300' : 'bg-slate-800 text-slate-300'}`}>
              <Clock size={13} /> {elapsed.toFixed(0)}s<span className="text-slate-500">/{current.tiempoObjetivoSeg}s</span>
            </span>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="animate-pop rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7">
        <div className="mb-3 flex items-center gap-2">
          <QTypeBadge tipo={current.tipo} />
          <span className="text-xs font-bold text-slate-500">Nivel {current.level} · {current.topic}</span>
        </div>
        <p className="font-display text-xl font-black leading-snug text-slate-100 sm:text-2xl">{current.enunciado}</p>

        <div className="mt-6 grid gap-3">
          {current.opciones.map((choice) => (
            <ChoiceButton key={choice.key} choice={choice} selected={selected} revealed={revealed} onSelect={handleSelect} />
          ))}
        </div>
      </div>

      {revealed && (
        <div className="grid gap-3">
          <div className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-black ${wasCorrect ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
            {wasCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {wasCorrect ? '¡Correcto!' : `Respuesta correcta: ${current.respuestaCorrecta}`}
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-violet-400"><Route size={14} /> Concepto: {current.concepto}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{current.explicacion}</p>
            {current.tip && (
              <p className="mt-3 inline-flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                <Lightbulb size={15} className="mt-0.5 shrink-0" /> {current.tip}
              </p>
            )}
          </div>
          <Button onClick={advance} className="w-full sm:w-auto sm:justify-self-end">
            {index + 1 >= total ? 'Ver resultados' : 'Siguiente'} <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}

function ChoiceButton({ choice, selected, revealed, onSelect }: { choice: Choice; selected: ChoiceKey | null; revealed: boolean; onSelect: (c: Choice) => void }) {
  const isSelected = selected === choice.key;
  const showCorrect = revealed && choice.correct;
  const showWrong = revealed && isSelected && !choice.correct;
  const tone = showCorrect
    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-100'
    : showWrong
      ? 'border-rose-500/50 bg-rose-500/15 text-rose-100'
      : isSelected
        ? 'border-violet-500/60 bg-violet-500/15 text-white'
        : 'border-slate-700 bg-slate-800/40 text-slate-200 hover:border-violet-400 hover:bg-slate-800';
  return (
    <button disabled={revealed} onClick={() => onSelect(choice)} className={`choice-rise flex items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-default ${tone}`}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-950/60 font-display text-sm font-black">{choice.key}</span>
      <span className="font-semibold leading-snug">{choice.text}</span>
    </button>
  );
}
