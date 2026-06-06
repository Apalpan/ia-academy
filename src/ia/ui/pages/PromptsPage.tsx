import { useState } from 'react';
import { Check, Clock, Copy, Wand2 } from 'lucide-react';
import { LEARNING_PROMPTS, PROMPT_CATS, type PromptCat } from '../../data/prompts';
import { Panel } from '../components';

export function PromptsPage() {
  const [cat, setCat] = useState<PromptCat | 'Todos'>('Todos');
  const [copied, setCopied] = useState<string | null>(null);

  const list = cat === 'Todos' ? LEARNING_PROMPTS : LEARNING_PROMPTS.filter((p) => p.categoria === cat);

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
    } catch {
      /* sin permiso de portapapeles */
    }
  };

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white">Prompts de aprendizaje al extremo</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Meta-prompts para dominar cualquier tema con IA: Feynman, active recall, primeros principios y pensamiento crítico.
          Copia, reemplaza <code className="rounded bg-slate-800 px-1 text-violet-300">{'{tema}'}</code> y pégalo en ChatGPT/Claude/Gemini.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['Todos', ...PROMPT_CATS] as const).map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-xl border px-3.5 py-2 text-sm font-black transition ${cat === c ? 'border-violet-500 bg-violet-500/15 text-white' : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-violet-400'}`}>{c}</button>
        ))}
      </div>

      <div className="grid gap-4">
        {list.map((p) => (
          <Panel key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-violet-300"><Wand2 size={16} /></span>
                  <h2 className="font-display text-lg font-black text-slate-100">{p.titulo}</h2>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-black text-slate-400">{p.categoria}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300"><span className="font-bold text-slate-200">Qué hace:</span> {p.que}</p>
                <p className="mt-1 inline-flex items-start gap-1.5 text-xs text-slate-500"><Clock size={13} className="mt-0.5 shrink-0" /> {p.cuando}</p>
              </div>
              <button onClick={() => copy(p.id, p.prompt)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-black transition ${copied === p.id ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300' : 'border-slate-700 text-slate-200 hover:border-violet-400'}`}>
                {copied === p.id ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
              </button>
            </div>
            <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">{p.prompt}</pre>
          </Panel>
        ))}
      </div>
    </div>
  );
}
