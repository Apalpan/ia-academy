import { useRef, useState } from 'react';
import { Shuffle } from 'lucide-react';
import { pickMixed } from '../../engine/questionBank';
import { summarizeSession } from '../../engine/session';
import { useProfile } from '../../state';
import type { Attempt, Question, SessionResult } from '../../types';
import { Button, Panel, SectionTitle } from '../components';
import { QuestionRunner } from '../QuestionRunner';
import { SessionSummary } from '../SessionSummary';
import { navigate } from '../router';

const SIZES = [10, 15, 20];

export function QuizPage() {
  const { profile, snapshot, recordSession } = useProfile();
  const [phase, setPhase] = useState<'intro' | 'run' | 'done'>('intro');
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<SessionResult | null>(null);
  const startTime = useRef(0);

  const start = () => {
    setQuestions(pickMixed(count, snapshot.unlockedLevel, profile.seenQuestionIds));
    startTime.current = Date.now();
    setPhase('run');
  };

  const complete = (attempts: Attempt[]) => {
    const sess = summarizeSession('quiz', 'Quiz mixto', null, attempts, Date.now() - startTime.current);
    recordSession(sess);
    setSession(sess);
    setPhase('done');
  };

  if (phase === 'run') {
    return <QuestionRunner questions={questions} title="Quiz mixto" source="quiz" level={null} onComplete={complete} onExit={() => setPhase('intro')} />;
  }
  if (phase === 'done' && session) {
    return <SessionSummary session={session} onRepeat={start} onHome={() => navigate('#/mapa')} repeatLabel="Otro quiz" />;
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white">Quiz mixto</h1>
        <p className="mt-1 text-sm text-slate-400">Preguntas al azar de tus niveles desbloqueados (1–{snapshot.unlockedLevel}). Ideal para repasar todo junto.</p>
      </div>
      <Panel>
        <SectionTitle eyebrow="Configuración" title="¿Cuántas preguntas?" />
        <div className="flex gap-2">
          {SIZES.map((s) => (
            <button key={s} onClick={() => setCount(s)} className={`rounded-xl border px-5 py-2.5 text-sm font-black transition ${count === s ? 'border-violet-500 bg-violet-500/15 text-white' : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-violet-400'}`}>{s}</button>
          ))}
        </div>
        <div className="mt-5"><Button onClick={start}><Shuffle size={16} /> Iniciar quiz</Button></div>
      </Panel>
    </div>
  );
}
