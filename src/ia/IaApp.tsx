import { Suspense, lazy } from 'react';
import { ProfileProvider } from './state';
import { AppShell } from './ui/AppShell';
import { useRoute } from './ui/router';
import { MapaPage } from './ui/pages/MapaPage';
import { LevelPage } from './ui/pages/LevelPage';

// Rutas secundarias en chunks aparte para una carga inicial más ligera.
const FlashcardsPage = lazy(() => import('./ui/pages/FlashcardsPage').then((m) => ({ default: m.FlashcardsPage })));
const QuizPage = lazy(() => import('./ui/pages/QuizPage').then((m) => ({ default: m.QuizPage })));
const PromptsPage = lazy(() => import('./ui/pages/PromptsPage').then((m) => ({ default: m.PromptsPage })));
const NovedadesPage = lazy(() => import('./ui/pages/NovedadesPage').then((m) => ({ default: m.NovedadesPage })));
const GlosarioPage = lazy(() => import('./ui/pages/GlosarioPage').then((m) => ({ default: m.GlosarioPage })));
const ProgresoPage = lazy(() => import('./ui/pages/ProgresoPage').then((m) => ({ default: m.ProgresoPage })));
const ErroresPage = lazy(() => import('./ui/pages/ErroresPage').then((m) => ({ default: m.ErroresPage })));
const ConfigPage = lazy(() => import('./ui/pages/ConfigPage').then((m) => ({ default: m.ConfigPage })));

function Routed() {
  const route = useRoute();
  const page = (() => {
    switch (route.path) {
      case '/mapa':
        return <MapaPage />;
      case '/level':
        return <LevelPage levelParam={route.param} />;
      case '/flashcards':
        return <FlashcardsPage />;
      case '/quiz':
        return <QuizPage />;
      case '/prompts':
        return <PromptsPage />;
      case '/novedades':
        return <NovedadesPage />;
      case '/glosario':
        return <GlosarioPage />;
      case '/progreso':
        return <ProgresoPage />;
      case '/errores':
        return <ErroresPage />;
      case '/config':
        return <ConfigPage />;
      default:
        return <MapaPage />;
    }
  })();

  return (
    <AppShell path={route.path}>
      <Suspense fallback={<div className="grid place-items-center py-20 text-sm font-bold text-slate-400">Cargando…</div>}>{page}</Suspense>
    </AppShell>
  );
}

export default function IaApp() {
  return (
    <ProfileProvider>
      <Routed />
    </ProfileProvider>
  );
}
