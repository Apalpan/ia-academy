import type { ReactNode } from 'react';
import { AlertTriangle, BookOpen, Flame, Layers, LineChart, Map, Newspaper, Settings, Shuffle, Sparkles, Wand2, type LucideIcon } from 'lucide-react';
import { useProfile } from '../state';
import { AIOrb } from './AIOrb';
import { navigate } from './router';

interface NavItem { path: string; label: string; icon: LucideIcon; match?: string[]; }

const NAV: NavItem[] = [
  { path: '/mapa', label: 'Mapa de niveles', icon: Map, match: ['/mapa', '/level'] },
  { path: '/flashcards', label: 'Flashcards', icon: Layers },
  { path: '/quiz', label: 'Quiz mixto', icon: Shuffle },
  { path: '/prompts', label: 'Prompts', icon: Wand2 },
  { path: '/novedades', label: 'Novedades', icon: Newspaper },
  { path: '/glosario', label: 'Glosario', icon: BookOpen },
  { path: '/progreso', label: 'Progreso', icon: LineChart },
  { path: '/errores', label: 'Errores', icon: AlertTriangle },
  { path: '/config', label: 'Configuración', icon: Settings },
];

export function AppShell({ path, children }: { path: string; children: ReactNode }) {
  const { profile, snapshot } = useProfile();
  const isActive = (item: NavItem) => (item.match ?? [item.path]).includes(path);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 ${profile.settings.reducedMotion ? 'no-motion' : ''}`}>
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-slate-800">
          <div className="flex items-center gap-3 px-4 py-5">
            <AIOrb size={40} />
            <div>
              <p className="font-display text-base font-black leading-none">AI Academy</p>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-400">Niveles 1–10</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:grid lg:gap-1 lg:overflow-visible">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <button key={item.path} onClick={() => navigate('#' + item.path)} className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition lg:w-full ${active ? 'bg-violet-500/15 text-white ring-1 ring-violet-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                  <Icon size={17} className={active ? 'text-violet-300' : ''} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/15 px-3 py-1.5 text-xs font-black text-violet-200"><Sparkles size={14} /> {snapshot.rank}</span>
              <span className="text-xs font-bold text-slate-500">{snapshot.xp} XP · Nivel {snapshot.unlockedLevel}/10</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-black text-amber-300">
              <Flame size={14} /> {profile.streak.current} día{profile.streak.current === 1 ? '' : 's'}
            </span>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
