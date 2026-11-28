/** One explorable 3D scene per area: the four detailed dioramas, plus a study built around every other landmark. */
import { ADMIN } from './atlas';
import { DIORAMAS, type Diorama, type DioramaSpot } from './dioramas';
import { LANDMARKS } from './landmarks';

function fromLandmark(id: string): Diorama {
  const l = LANDMARKS[id];
  return {
    id,
    title: l.name,
    summary: l.preview,
    caveat: l.modelNote,
    spots: l.spots.map((s, i): DioramaSpot => ({ id: `s${i}`, title: s.title, topic: s.topic as DioramaSpot['topic'], position: s.at, info: s.info })),
    quiz: l.quiz,
  };
}

export const SCENES: Record<string, Diorama> = Object.fromEntries(ADMIN.map((d) => [d.id, DIORAMAS[d.id] ?? fromLandmark(d.id)]));

export const TOTAL_SPOTS = Object.values(SCENES).reduce((n, s) => n + s.spots.length, 0);

/** Areas whose discovery points have all been opened. */
export const completedAreas = (found: string[]) =>
  new Set(Object.values(SCENES).filter((s) => s.spots.every((spot) => found.includes(`${s.id}:${spot.id}`))).map((s) => s.id));
