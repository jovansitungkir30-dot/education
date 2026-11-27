import { useSyncExternalStore } from 'react';

/** Minimal hash router (#/page?key=value). Works on any static host. */
const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

export function useRoute() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  const [path, query = ''] = hash.replace(/^#/, '').split('?');
  return { path: path || '/', params: new URLSearchParams(query) };
}

export const href = (path: string, params?: Record<string, string>) =>
  `#${path}${params ? `?${new URLSearchParams(params)}` : ''}`;

export const go = (path: string, params?: Record<string, string>) => {
  window.location.hash = href(path, params);
};
