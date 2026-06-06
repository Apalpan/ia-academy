import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { GLOSSARY } from '../../glossary';
import { Panel } from '../components';

const LEVEL_FILTERS = ['Todos', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export function GlosarioPage() {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('Todos');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((t) => {
      const matchLevel = level === 'Todos' || String(t.nivel) === level;
      const matchText = !q || t.termino.toLowerCase().includes(q) || t.definicion.toLowerCase().includes(q);
      return matchLevel && matchText;
    });
  }, [query, level]);

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white">Glosario de IA</h1>
        <p className="mt-1 text-sm text-slate-400">{GLOSSARY.length} términos esenciales de IA, productividad y datos. Busca o filtra por nivel.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3">
          <Search size={16} className="text-slate-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar término o definición…" className="w-full bg-transparent py-2.5 text-sm font-semibold text-slate-100 outline-none placeholder:text-slate-500" />
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm font-bold text-slate-100 outline-none [color-scheme:dark]">
          {LEVEL_FILTERS.map((l) => <option key={l} value={l}>{l === 'Todos' ? 'Todos los niveles' : `Nivel ${l}`}</option>)}
        </select>
      </div>

      {results.length === 0 ? (
        <Panel><p className="py-6 text-center text-sm text-slate-400">Sin resultados para "{query}".</p></Panel>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {results.map((t) => (
            <div key={t.n} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-base font-black text-violet-300">{t.termino}</p>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-black text-slate-400">N{t.nivel}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-300">{t.definicion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
