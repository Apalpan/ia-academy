import { ProfileProvider } from './state';
import { AppShell } from './ui/AppShell';
import { useRoute } from './ui/router';
import { MapaPage } from './ui/pages/MapaPage';
import { LevelPage } from './ui/pages/LevelPage';
import { QuizPage } from './ui/pages/QuizPage';
import { GlosarioPage } from './ui/pages/GlosarioPage';
import { ProgresoPage } from './ui/pages/ProgresoPage';
import { ErroresPage } from './ui/pages/ErroresPage';
import { ConfigPage } from './ui/pages/ConfigPage';

function Routed() {
  const route = useRoute();
  const page = (() => {
    switch (route.path) {
      case '/mapa':
        return <MapaPage />;
      case '/level':
        return <LevelPage levelParam={route.param} />;
      case '/quiz':
        return <QuizPage />;
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
  return <AppShell path={route.path}>{page}</AppShell>;
}

export default function IaApp() {
  return (
    <ProfileProvider>
      <Routed />
    </ProfileProvider>
  );
}
