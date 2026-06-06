import { useState } from 'react';
import { RotateCcw, Save, Trash2 } from 'lucide-react';
import { useProfile } from '../../state';
import { bankStats } from '../../engine/questionBank';
import { GLOSSARY } from '../../glossary';
import { Button, Panel, SectionTitle } from '../components';

export function ConfigPage() {
  const { profile, setName, setSettings, reset, restartOnboarding } = useProfile();
  const [name, setLocalName] = useState(profile.name);
  const [saved, setSaved] = useState(false);
  const stats = bankStats();

  const save = () => {
    setName(name);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-2xl font-black text-white">Configuración</h1>

      <Panel>
        <SectionTitle eyebrow="Perfil" title="Tu nombre" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="grid flex-1 gap-1.5 text-sm">
            <span className="font-bold text-slate-300">Nombre</span>
            <input value={name} onChange={(e) => setLocalName(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 font-bold text-slate-100 outline-none focus:border-violet-400" />
          </label>
          <Button onClick={save}><Save size={16} /> Guardar</Button>
          <Button variant="ghost" onClick={restartOnboarding}><RotateCcw size={16} /> Rehacer test de nivel</Button>
          {saved && <span className="self-center text-sm font-bold text-emerald-300">Guardado ✓</span>}
        </div>
        <p className="mt-2 text-xs text-slate-500">Nivel de colocación actual: {profile.placementLevel}/10.</p>
      </Panel>

      <Panel>
        <SectionTitle eyebrow="Preferencias" title="Experiencia" />
        <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3">
          <span>
            <span className="block text-sm font-black text-slate-100">Reducir animaciones</span>
            <span className="text-xs text-slate-500">Menos movimiento por accesibilidad o preferencia.</span>
          </span>
          <button onClick={() => setSettings({ reducedMotion: !profile.settings.reducedMotion })} className={`relative h-6 w-11 shrink-0 rounded-full transition ${profile.settings.reducedMotion ? 'bg-violet-500' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${profile.settings.reducedMotion ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </label>
      </Panel>

      <Panel>
        <SectionTitle eyebrow="Datos" title="Contenido y almacenamiento" />
        <p className="text-sm text-slate-400">Banco: <strong className="text-slate-200">{stats.total}</strong> ejercicios · glosario de <strong className="text-slate-200">{GLOSSARY.length}</strong> términos · 10 niveles. Tu progreso (XP, racha, niveles) se guarda localmente en este navegador.</p>
        <div className="mt-4">
          <Button variant="danger" onClick={() => { if (confirm('¿Borrar todo tu progreso (XP, niveles, racha)?')) reset(); }}>
            <Trash2 size={16} /> Reiniciar progreso
          </Button>
        </div>
      </Panel>
    </div>
  );
}
