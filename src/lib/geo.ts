import { DISTRICTS, type District } from '../data/atlas';

/** Scene units per degree of latitude. */
const SCALE = 4;

const all = DISTRICTS.flatMap((d) => d.polygons.flatMap((p) => p[0]));
const lons = all.map((c) => c[0]);
const lats = all.map((c) => c[1]);
const LON0 = (Math.min(...lons) + Math.max(...lons)) / 2;
const LAT0 = (Math.min(...lats) + Math.max(...lats)) / 2;
const KX = Math.cos((LAT0 * Math.PI) / 180);

/** Equirectangular projection, adequate this close to the equator. Returns [east, north] in scene units. */
export const project = ([lon, lat]: number[]): [number, number] => [(lon - LON0) * KX * SCALE, (lat - LAT0) * SCALE];

export const HALF_WIDTH = ((Math.max(...lons) - Math.min(...lons)) / 2) * KX * SCALE;
export const HALF_HEIGHT = ((Math.max(...lats) - Math.min(...lats)) / 2) * SCALE;

function ringArea(ring: [number, number][]) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) sum += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  return sum / 2;
}

export interface Shape {
  center: [number, number];
  /** Size of the largest part, used to decide how close the camera should go. */
  span: number;
}

const cache = new Map<string, Shape>();

/** Label point and size of a district, based on its largest part so that small islands do not skew it. */
export function shapeOf(d: District): Shape {
  let found = cache.get(d.id);
  if (found) return found;
  const rings = d.polygons.map((p) => p[0].map(project));
  const ring = rings.reduce((a, b) => (Math.abs(ringArea(b)) > Math.abs(ringArea(a)) ? b : a));
  const area = ringArea(ring);
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    cx += (ring[j][0] + ring[i][0]) * f;
    cy += (ring[j][1] + ring[i][1]) * f;
  }
  const xs = ring.map((p) => p[0]);
  const ys = ring.map((p) => p[1]);
  found = {
    center: [cx / (6 * area), cy / (6 * area)],
    span: Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)),
  };
  cache.set(d.id, found);
  return found;
}

export function svgPath(d: District) {
  return d.polygons
    .flatMap((p) => p.map((ring) => `M${ring.map((c) => { const [x, y] = project(c); return `${x.toFixed(3)},${(-y).toFixed(3)}`; }).join('L')}Z`))
    .join('');
}
