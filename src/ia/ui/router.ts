import { useEffect, useState } from 'react';

export interface Route {
  path: string; // '/mapa', '/practice', '/level', ...
  param?: string; // segmento extra (id de nivel, etc.)
  query: URLSearchParams;
}

const DEFAULT = '#/mapa';

export function parseHash(hash: string): Route {
  const raw = (hash || DEFAULT).replace(/^#/, '');
  const [pathPart, queryPart] = raw.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  return {
    path: '/' + (segments[0] ?? 'mapa'),
    param: segments[1],
    query: new URLSearchParams(queryPart ?? ''),
  };
}

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash || DEFAULT);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || DEFAULT);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parseHash(hash);
}

export function navigate(path: string) {
  const target = path.startsWith('#') ? path : '#' + path;
  if (window.location.hash === target) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = target;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
