import type { BufferGeometry } from 'three';
import { Builder } from './builder';
import { mainland, type Model } from './mainland';
import { coast } from './coast';
import { citiesAndNias } from './cities-nias';

export const MODELS_BY_AREA: Record<string, Model> = { ...mainland, ...coast, ...citiesAndNias };

const cache = new Map<string, BufferGeometry>();

/** The merged geometry of one area's landmark. Built once, then shared by the map and the area page. */
export function landmarkGeometry(id: string) {
  let g = cache.get(id);
  if (!g) {
    const builder = new Builder();
    MODELS_BY_AREA[id](builder);
    cache.set(id, (g = builder.build()));
  }
  return g;
}
