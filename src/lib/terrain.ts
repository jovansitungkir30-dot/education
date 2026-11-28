/**
 * Terrain assets for the atlas.
 * Imagery: Sentinel-2 cloudless 2016 by EOX (CC BY 4.0). Elevation: AWS Terrain Tiles (Mapzen; SRTM, USGS).
 */
import { useEffect, useState } from 'react';
import { LinearFilter, NearestFilter, NoColorSpace, SRGBColorSpace, Texture, TextureLoader } from 'three';
import bounds from '../data/geo/terrain.json';
import { DISTRICTS, type District } from '../data/atlas';
import { project } from './geo';

export const TERRAIN_CREDIT = 'Citra: Sentinel-2 cloudless 2016, s2maps.eu oleh EOX (memuat data Copernicus Sentinel 2016 & 2017 yang dimodifikasi), CC BY 4.0 · Ketinggian: AWS Terrain Tiles (Mapzen; SRTM, USGS) · Batas: geoBoundaries/BPS, CC BY 3.0 IGO';

const [west, south] = project([bounds.west, bounds.south]);
const [east, north] = project([bounds.east, bounds.north]);
export const EXTENT = { west, east, south, north };

/** Scene units per metre of elevation. Relief is exaggerated about eleven times so that it can be read. */
const RELIEF = 0.0004;

export interface TerrainData {
  satellite: Texture;
  water: Texture;
  districts: Texture;
  /** Height in scene units at a projected [east, north] point. */
  heightAt: (x: number, y: number) => number;
}

let loading: Promise<TerrainData> | null = null;
let loaded: TerrainData | null = null;

export function loadTerrain() {
  loading ??= (async () => {
    const loader = new TextureLoader();
    const [satellite, water, districts, buffer] = await Promise.all([
      loader.loadAsync('./terrain/satellite.jpg'),
      loader.loadAsync('./terrain/water.png'),
      loader.loadAsync('./terrain/districts.png'),
      fetch('./terrain/height.bin').then((r) => {
        if (!r.ok) throw new Error('height data unavailable');
        return r.arrayBuffer();
      }),
    ]);
    satellite.colorSpace = SRGBColorSpace;
    satellite.anisotropy = 8;
    water.colorSpace = NoColorSpace;
    water.minFilter = LinearFilter;
    water.generateMipmaps = false;
    // District ids must never be blended between neighbours.
    districts.colorSpace = NoColorSpace;
    districts.minFilter = districts.magFilter = NearestFilter;
    districts.generateMipmaps = false;

    const grid = new Int16Array(buffer);
    const { columns, rows } = bounds;
    const heightAt = (x: number, y: number) => {
      const fx = Math.min(columns - 1.001, Math.max(0, ((x - west) / (east - west)) * columns - 0.5));
      const fy = Math.min(rows - 1.001, Math.max(0, ((north - y) / (north - south)) * rows - 0.5));
      const i = Math.floor(fx);
      const j = Math.floor(fy);
      const tx = fx - i;
      const ty = fy - j;
      const a = grid[j * columns + i] * (1 - tx) + grid[j * columns + i + 1] * tx;
      const b = grid[(j + 1) * columns + i] * (1 - tx) + grid[(j + 1) * columns + i + 1] * tx;
      return (a * (1 - ty) + b * ty) * RELIEF;
    };
    loaded = { satellite, water, districts, heightAt };
    return loaded;
  })();
  return loading;
}

export function useTerrain() {
  const [data, setData] = useState<TerrainData | null>(loaded);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    loadTerrain().then(
      (d) => alive && setData(d),
      () => {
        loading = null;
        if (alive) setFailed(true);
      },
    );
    return () => {
      alive = false;
    };
  }, []);
  return { data, failed };
}

const projected = DISTRICTS.map((d) => ({ d, polygons: d.polygons.map((p) => p.map((ring) => ring.map(project))) }));
// Cities are small and sit inside regencies, so they are tested first.
const order = [...projected].sort((a, b) => Number(b.d.type === 'kota') - Number(a.d.type === 'kota'));

const inRing = (x: number, y: number, ring: [number, number][]) => {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

export function districtAt(x: number, y: number): District | null {
  return order.find(({ polygons }) => polygons.some((p) => inRing(x, y, p[0]) && !p.slice(1).some((h) => inRing(x, y, h))))?.d ?? null;
}

export const projectedRings = (d: District) => projected.find((p) => p.d === d)!.polygons.flat();
