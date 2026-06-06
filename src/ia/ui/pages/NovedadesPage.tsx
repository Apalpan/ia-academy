import { useState } from 'react';
import { ArrowRight, Lightbulb, Newspaper } from 'lucide-react';
import { SNAPSHOT_LABEL, TRENDS, type Trend } from '../../data/novedades';
import { Panel } from '../components';

const CATS: (Trend['categoria'] | 'Todas')[] = ['Todas', 'Modelos', 'Agentes', 'Productividad', 'Gobernanza', 'AEC'];

const CAT_TONE: Record<Trend['categoria'], string> = {
  Modelos: 'bg-violet-500/15 text-violet-300',
  Agentes: 'bg-sky-500/15 text-sky-300',
  Productividad: 'bg-emerald-500/15 text-emerald-300',
  Gobernanza: 'bg-rose-500/15 text-rose-300',
  AEC: 'bg-amber-500/15 text-amber-300',
};

export function NovedadesPage() {
  const [cat, setCat] = useState<Trend['categoria'] | 'Todas'>('Todas');
  const list = cat === 'Todas' ? TRENDS : TRENDS.filter((t) => t.categoria === cat);

  return (
    <div className="grid gap-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-black text-white">Novedades y tendencias IA</h1>
          <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-black text-slate-400">{SNAPSHOT_LABEL}</span>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">Tendencias durables (no titulares efímeros). Cada una con <span className="font-bold text-slate-300">por qué importa</span> y <span className="font-bold text-slate-300">qué hacer</span>, para entrenar criterio, no solo enterarte.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-xl border px-3.5 py-2 text-sm font-black transition ${cat === c ? 'border-violet-500 bg-violet-500/15 text-white' : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-violet-400'}`}>{c}</button>
        ))}
      </div>

      <div className="grid gap-4">
        {list.map((t) => (
          <Panel key={t.id}>
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-800 text-slate-300"><Newspaper size={16} /></span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-black text-slate-100">{t.titulo}</h2>
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-black ${CAT_TONE[t.categoria]}`}>{t.categoria}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{t.resumen}</p>
                <p className="mt-2 inline-flex items-start gap-1.5 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-300">
                  <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-300" /><span><span className="font-bold text-slate-200">Por qué importa:</span> {t.porQueImporta}</span>
                </p>
                <p className="mt-2 inline-flex items-start gap-1.5 text-sm text-emerald-200/90">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-emerald-300" /><span><span className="font-bold">Qué hacer:</span> {t.accion}</span>
                </p>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <p className="text-center text-xs text-slate-600">Digest curado · edítalo en <code className="text-slate-500">src/ia/data/novedades.ts</code> para mantenerlo al día.</p>
    </div>
  );
}
