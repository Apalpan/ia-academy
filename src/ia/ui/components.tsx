import type { ReactNode } from 'react';
import {
  Bot,
  Brain,
  Database,
  Gauge,
  MessageSquareCode,
  Rocket,
  ScanEye,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { QType } from '../types';
import { qTypeLabels } from '../types';

const ICONS: Record<string, LucideIcon> = {
  Brain, Sparkles, Rocket, MessageSquareCode, Database, Gauge, Bot, Workflow, ScanEye, ShieldCheck,
};
export const resolveIcon = (name: string): LucideIcon => ICONS[name] ?? Brain;

export function Panel({ children, className = '', accent = false }: { children: ReactNode; className?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border ${accent ? 'border-violet-500/30 bg-violet-500/[0.07]' : 'border-slate-800 bg-slate-900/60'} p-5 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-400">{eyebrow}</p>}
        <h2 className="font-display text-xl font-black text-slate-100">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatTile({ icon, label, value, hint, tone = 'default' }: { icon?: ReactNode; label: string; value: ReactNode; hint?: string; tone?: 'default' | 'good' | 'warn' | 'bad' }) {
  const toneText = tone === 'good' ? 'text-emerald-300' : tone === 'warn' ? 'text-amber-300' : tone === 'bad' ? 'text-rose-300' : 'text-slate-100';
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{icon}{label}</div>
      <p className={`mt-2 font-display text-2xl font-black ${toneText}`}>{value}</p>
      {hint && <p className="mt-1 text-xs font-semibold text-slate-500">{hint}</p>}
    </div>
  );
}

export function Button({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'soft' | 'danger'; className?: string; disabled?: boolean; type?: 'button' | 'submit' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition disabled:opacity-40 disabled:cursor-not-allowed';
  const styles = {
    primary: 'bg-violet-500 text-white hover:bg-violet-400 shadow-[0_8px_28px_rgba(139,92,246,0.35)]',
    ghost: 'border border-slate-700 text-slate-200 hover:border-violet-400 hover:text-white',
    soft: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    danger: 'border border-rose-500/40 text-rose-300 hover:bg-rose-500/10',
  } as const;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>{children}</button>
  );
}

export function Bar({ label, value, sub, color }: { label: string; value: number; sub?: string; color?: string }) {
  const tone = color ?? (value >= 80 ? 'bg-emerald-500' : value >= 50 ? 'bg-violet-500' : 'bg-rose-500');
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-slate-200">{label}</span>
        <span className="text-xs font-black text-slate-400">{sub ?? `${Math.round(value)}%`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${tone} transition-all duration-700`} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function ProgressRing({ value, size = 132, stroke = 12, label, sublabel }: { value: number; size?: number; stroke?: number; label?: string; sublabel?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const tone = clamped >= 80 ? '#34d399' : clamped >= 50 ? '#a78bfa' : '#fb7185';
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={tone} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" />
      </svg>
      <div className="absolute grid place-items-center text-center">
        <span className="font-display text-3xl font-black text-slate-100">{label ?? `${Math.round(clamped)}%`}</span>
        {sublabel && <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{sublabel}</span>}
      </div>
    </div>
  );
}

const QTYPE_TONE: Record<QType, string> = {
  definicion: 'bg-sky-500/15 text-sky-300',
  termino: 'bg-violet-500/15 text-violet-300',
  aplicacion: 'bg-emerald-500/15 text-emerald-300',
  herramienta: 'bg-amber-500/15 text-amber-300',
  odd: 'bg-rose-500/15 text-rose-300',
  vf: 'bg-indigo-500/15 text-indigo-300',
};
export function QTypeBadge({ tipo }: { tipo: QType }) {
  return <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-black ${QTYPE_TONE[tipo]}`}>{qTypeLabels[tipo]}</span>;
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
      <p className="font-display text-lg font-black text-slate-200">{title}</p>
      <p className="mt-1 max-w-md text-sm text-slate-400">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
