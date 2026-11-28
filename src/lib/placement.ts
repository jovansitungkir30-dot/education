/** Where each landmark stands on the map: at its area's label point, nudged apart where neighbours collide. */
import { ADMIN } from '../data/atlas';
import { shapeOf } from './geo';

export interface Placement {
  id: string;
  /** The area's own label point. */
  anchor: [number, number];
  /** Where the miniature stands. */
  at: [number, number];
  /** Model scale. Cities are compact. */
  scale: number;
}

/** Approximate footprint radius of a landmark model, before scaling. */
const MODEL_RADIUS = 4.2;

function layout(): Placement[] {
  const items = ADMIN.map((d) => {
    const { center } = shapeOf(d);
    const scale = d.type === 'kota' ? 0.082 : 0.108;
    return { id: d.id, anchor: center, at: [...center] as [number, number], scale, r: MODEL_RADIUS * scale, city: d.type === 'kota' };
  });
  for (let pass = 0; pass < 500; pass++) {
    // A gentle pull home, which fades out so that the final passes only resolve overlaps.
    const pull = pass < 350 ? 0.015 : 0;
    for (const a of items) {
      a.at[0] += (a.anchor[0] - a.at[0]) * pull;
      a.at[1] += (a.anchor[1] - a.at[1]) * pull;
    }
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        let dx = b.at[0] - a.at[0];
        let dy = b.at[1] - a.at[1];
        let d = Math.hypot(dx, dy);
        const need = (a.r + b.r) * 1.02;
        if (d >= need) continue;
        if (d < 1e-4) {
          dx = Math.cos(i);
          dy = Math.sin(i);
          d = 1;
        }
        const push = (need - Math.min(d, need)) / d;
        // Cities move more readily than regencies, whose areas are larger.
        const wa = a.city === b.city ? 0.5 : a.city ? 0.75 : 0.25;
        a.at[0] -= dx * push * wa;
        a.at[1] -= dy * push * wa;
        b.at[0] += dx * push * (1 - wa);
        b.at[1] += dy * push * (1 - wa);
      }
    }
  }
  return items.map(({ id, anchor, at, scale }) => ({ id, anchor, at, scale }));
}

export const PLACEMENTS = layout();
export const placementById = new Map(PLACEMENTS.map((p) => [p.id, p]));
