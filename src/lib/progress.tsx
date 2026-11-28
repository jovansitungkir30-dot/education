import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** 'warisan' counts discovery points opened inside dioramas. */
export type Kind = 'region' | 'artifact' | 'story' | 'gallery' | 'lesson' | 'warisan';

export interface ProgressState {
  visited: Record<Kind, string[]>;
  /** Best quiz score per module, as a percentage. */
  scores: Record<string, number>;
  name: string;
}

export const POINTS: Record<Kind, number> = { region: 20, artifact: 15, story: 15, gallery: 5, lesson: 10, warisan: 5 };
export const PASS_MARK = 70;
export const QUIZ_POINTS = 50;

const KEY = 'ruangnusantara.progress.v1';
const empty = (): ProgressState => ({
  visited: { region: [], artifact: [], story: [], gallery: [], lesson: [], warisan: [] },
  scores: {},
  name: '',
});

function load(): ProgressState {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (!raw) return empty();
    const base = empty();
    return { ...base, ...raw, visited: { ...base.visited, ...raw.visited } };
  } catch {
    return empty();
  }
}

export const passedModules = (s: ProgressState) => Object.keys(s.scores).filter((id) => !id.startsWith('diorama:') && s.scores[id] >= PASS_MARK);

export const totalPoints = (s: ProgressState) =>
  (Object.keys(POINTS) as Kind[]).reduce((sum, k) => sum + s.visited[k].length * POINTS[k], 0) +
  passedModules(s).length * QUIZ_POINTS;

interface Ctx {
  state: ProgressState;
  points: number;
  visit: (kind: Kind, id: string) => void;
  recordScore: (moduleId: string, pct: number) => void;
  setName: (name: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* Storage unavailable: progress stays in memory for this visit. */
    }
  }, [state]);

  const visit = useCallback((kind: Kind, id: string) => {
    setState((s) =>
      s.visited[kind].includes(id) ? s : { ...s, visited: { ...s.visited, [kind]: [...s.visited[kind], id] } },
    );
  }, []);
  const recordScore = useCallback((id: string, pct: number) => {
    setState((s) => ({ ...s, scores: { ...s.scores, [id]: Math.max(pct, s.scores[id] ?? 0) } }));
  }, []);
  const setName = useCallback((name: string) => setState((s) => ({ ...s, name })), []);
  const reset = useCallback(() => setState(empty()), []);

  const value = useMemo(
    () => ({ state, points: totalPoints(state), visit, recordScore, setName, reset }),
    [state, visit, recordScore, setName, reset],
  );
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
