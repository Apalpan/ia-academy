import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CardGrade, LevelId, Profile, ProgressSnapshot, SessionResult, Settings } from './types';
import { loadProfile, recordCardReview, recordSession as persist, resetProfile, saveProfile, updateSettings } from './engine/persistence';
import { computeProgress } from './engine/progress';

interface Ctx {
  profile: Profile;
  snapshot: ProgressSnapshot;
  recordSession: (session: SessionResult) => void;
  reviewCard: (termino: string, grade: CardGrade) => void;
  completeOnboarding: (name: string, placementLevel: LevelId, session: SessionResult) => void;
  restartOnboarding: () => void;
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
  const reviewCard = useCallback((termino: string, grade: CardGrade) => setProfile((p) => recordCardReview(p, termino, grade)), []);
  const completeOnboarding = useCallback((name: string, placementLevel: LevelId, session: SessionResult) => {
    setProfile((p) => persist({ ...p, name: name.trim() || 'Aprendiz', onboarded: true, placementLevel }, session));
  }, []);
  const restartOnboarding = useCallback(() => setProfile((p) => ({ ...p, onboarded: false })), []);
  const setSettings = useCallback((patch: Partial<Settings>) => setProfile((p) => updateSettings(p, patch)), []);
  const setName = useCallback((name: string) => setProfile((p) => ({ ...p, name: name.trim() || 'Aprendiz' })), []);
  const reset = useCallback(() => setProfile(resetProfile()), []);

  const value = useMemo(
    () => ({ profile, snapshot, recordSession, reviewCard, completeOnboarding, restartOnboarding, setSettings, setName, reset }),
    [profile, snapshot, recordSession, reviewCard, completeOnboarding, restartOnboarding, setSettings, setName, reset],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): Ctx {
  const v = useContext(ProfileContext);
  if (!v) throw new Error('useProfile fuera de <ProfileProvider>');
  return v;
}
