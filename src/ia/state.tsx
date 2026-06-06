import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Profile, ProgressSnapshot, SessionResult, Settings } from './types';
import { loadProfile, recordSession as persist, resetProfile, saveProfile, updateSettings } from './engine/persistence';
import { computeProgress } from './engine/progress';

interface Ctx {
  profile: Profile;
  snapshot: ProgressSnapshot;
  recordSession: (session: SessionResult) => void;
  setSettings: (patch: Partial<Settings>) => void;
  setName: (name: string) => void;
  reset: () => void;
}

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => loadProfile());

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const snapshot = useMemo(() => computeProgress(profile), [profile]);

  const recordSession = useCallback((session: SessionResult) => setProfile((p) => persist(p, session)), []);
  const setSettings = useCallback((patch: Partial<Settings>) => setProfile((p) => updateSettings(p, patch)), []);
  const setName = useCallback((name: string) => setProfile((p) => ({ ...p, name: name.trim() || 'Aprendiz' })), []);
  const reset = useCallback(() => setProfile(resetProfile()), []);

  const value = useMemo(
    () => ({ profile, snapshot, recordSession, setSettings, setName, reset }),
    [profile, snapshot, recordSession, setSettings, setName, reset],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): Ctx {
  const v = useContext(ProfileContext);
  if (!v) throw new Error('useProfile fuera de <ProfileProvider>');
  return v;
}
