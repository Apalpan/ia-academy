import { useRef, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { getQuestions } from '../../engine/questionBank';
import { missedQuestionIds } from '../../engine/progress';
import { summarizeSession } from '../../engine/session';
import { useProfile } from '../../state';
import type { Attempt, SessionResult } from '../../types';
import { Button, EmptyState, Panel } from '../components';
import { QuestionRunner } from '../QuestionRunner';
import { SessionSummary } from '../SessionSummary';
import { navigate } from '../router';

export function ErroresPage() {
  const { profile, recordSession } = useProfile();
  const [phase, setPhase] = useState<'view' | 'run' | 'done'>('view');
  const [session, setSession] = useState<SessionResult | null>(null);
  const startTime = useRef(0);

  const ids = missedQuestionIds(profile.attempts, 12);
  const questions = getQuestions(ids);

  const start = () => {
    startTime.current = Date.now();
    setPhase('run');
  };
  const complete = (attempts: Attempt[]) => {
    const sess = summarizeSession('review', 'Repaso de errores', null, attempts, Date.now() - startTime.current);
    recordSession(sess);
    setSession(sess);
    setPhase('done');
  };

  if (phase === 'run') {
    return <QuestionRunner questions={questions} title="Repaso de errores" source="review" level={null} onComplete={complete} onExit={() => setPhase('view')} />;
  }
  if (phase === 'done' && session) {
    return <SessionSummary session={session} onRepeat={ids.length ? start : undefined} onHome={() => navigate('#/mapa')} repeatLabel="Repasar de nuevo" />;
  }
  if (!questions.length) {
    return <EmptyState title="Sin errores por repasar" text="Cuando falles preguntas en práctica o quizzes, aquí podrás reintentarlas hasta dominarlas." action={<Button onClick={() => navigate('#/mapa')}>Ir al mapa</Button>} />;
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white">Repaso de errores</h1>
        <p className="mt-1 text-sm text-slate-400">Reúne las {questions.length} preguntas que fallaste para volver a intentarlas con su explicación.</p>
      </div>
      <Panel accent>
        <p className="text-sm text-slate-300">Convierte tus errores en XP: vuelve a enfrentarlos con feedback inmediato.</p>
        <div className="mt-4"><Button onClick={start}><RefreshCcw size={16} /> Repasar mis errores</Button></div>
      </Panel>
      <Panel>
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Vista previa</p>
        <div className="grid gap-2">
          {questions.slice(0, 8).map((q) => (
            <div key={q.id} className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm">
              <span className="truncate text-slate-300">{q.enunciado}</span>
              <span className="mt-0.5 block text-xs font-bold text-slate-500">Nivel {q.level} · {q.concepto}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
