/** Home hero: satellite imagery over real relief, with small illustrative landmark models. */
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { useTerrain, type TerrainData } from '../lib/terrain';
import Terrain from './Terrain';
import LandmarkLayer, { standingHeight } from './LandmarkLayer';
import { placementById } from '../lib/placement';
import { ZONES } from '../data/pathways';
import { prefersReducedMotion } from './device';

export interface Look {
  /** Rotation requested by dragging or keys, in radians. */
  yaw: number;
  /** Pointer position for parallax, -1..1. */
  px: number;
  py: number;
}

/** One labelled area from each geographic zone, rotating daily so that no fixed few are always in front. */
const day = Math.floor(Date.now() / 86_400_000);
export const FEATURED = ZONES.map((z, i) => z.areas[(day + i * 3) % z.areas.length]);

export type LandmarkDots = RefObject<(HTMLAnchorElement | null)[]>;

function Rig({ look, dots, still, data }: { look: RefObject<Look>; dots: LandmarkDots; still: boolean; data: TerrainData | null }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / s.size.height);
  const yaw = useRef(0);
  const intro = useRef(still ? 1 : 0);
  const point = useRef(new Vector3());
  useFrame(({ clock, size }, dt) => {
    const wide = aspect > 1.15;
    const k = still ? 1 : 1 - Math.exp(-dt * 3.2);
    intro.current = MathUtils.lerp(intro.current, 1, still ? 1 : 1 - Math.exp(-dt * 1.1));
    yaw.current = MathUtils.lerp(yaw.current, look.current.yaw, k);
    const drift = still ? 0 : Math.sin(clock.elapsedTime * 0.14) * 0.05;
    const a = -0.12 + yaw.current + look.current.px * 0.06 + drift + (1 - intro.current) * 0.5;
    const dist = (wide ? 40 : MathUtils.clamp(38 / Math.max(aspect, 0.45) ** 0.75, 40, 66)) * (1.35 - 0.35 * intro.current);
    const tilt = 0.72 - look.current.py * 0.04;
    camera.position.set(Math.sin(a) * Math.cos(tilt) * dist, Math.sin(tilt) * dist, Math.cos(a) * Math.cos(tilt) * dist);
    camera.lookAt(0, 0, 0.6);
    // Keep the map clear of the headline: to the right on wide screens, above it on narrow ones.
    const w = 1000 * aspect;
    if (wide) camera.setViewOffset(w, 1000, -w * 0.2, -20, w, 1000);
    else camera.setViewOffset(w, 1000, 0, 215, w, 1000);
    camera.updateMatrixWorld();

    FEATURED.forEach((id, i) => {
      const el = dots.current[i];
      if (!el) return;
      const p = placementById.get(id)!;
      point.current.set(p.at[0], (data ? standingHeight(data, p) : 0) + 1, -p.at[1]).project(camera);
      el.style.transform = `translate(${((point.current.x + 1) / 2) * size.width}px, ${((1 - point.current.y) / 2) * size.height}px) translate(-50%, -100%)`;
      el.style.visibility = 'visible';
    });
  });
  return null;
}

export default function HeroMapScene({ look, dots, onReady }: { look: RefObject<Look>; dots: LandmarkDots; onReady: () => void }) {
  const still = useMemo(prefersReducedMotion, []);
  const { data } = useTerrain();
  useEffect(() => {
    if (data) onReady();
  }, [data]);
  return (
    <>
      <color attach="background" args={['#0a4f86']} />
      <fog attach="fog" args={['#0a4f86', 55, 130]} />
      <hemisphereLight args={['#fff3d6', '#24505a', 1.5]} />
      <directionalLight position={[-14, 20, 8]} intensity={2.2} color="#ffe2b0" />
      {data && <Terrain data={data} boundaries />}
      {data && <LandmarkLayer data={data} />}
      <Rig look={look} dots={dots} still={still} data={data} />
    </>
  );
}
