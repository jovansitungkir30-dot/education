import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Line, MapControls } from '@react-three/drei';
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Ray, Vector3 } from 'three';
import type { MapControls as MapControlsImpl } from 'three-stdlib';
import { districtById } from '../../data/atlas';
import { STOPS } from '../../data/pins';
import { ADMIN } from '../../data/atlas';
import { LANDMARKS } from '../../data/landmarks';
import { PLACEMENTS, placementById } from '../../lib/placement';
import LandmarkLayer, { standingHeight } from '../../three/LandmarkLayer';
import { HALF_HEIGHT, HALF_WIDTH, shapeOf } from '../../lib/geo';
import { districtAt, useTerrain, type TerrainData } from '../../lib/terrain';
import { prefersReducedMotion } from '../../three/device';
import Stage from '../../three/Stage';
import Terrain from '../../three/Terrain';

export type MapCommand = { type: 'in' | 'out' | 'reset'; n: number } | null;

type PinRefs = React.RefObject<(HTMLButtonElement | null)[]>;

/** Opening rotation on wide screens. Sumatra runs diagonally, so turning the view fills the width. */
const WIDE_TURN = -0.6;

/** Follows the pointer ray down to the relief, which is cheaper than testing every terrain triangle. */
function groundPoint(ray: Ray, data: TerrainData) {
  let height = 0;
  const p = new Vector3();
  for (let i = 0; i < 4; i++) {
    const t = (height - ray.origin.y) / ray.direction.y;
    ray.at(t, p);
    height = (height + data.heightAt(p.x, -p.z)) / 2;
  }
  return p;
}

const pinAnchor = (data: TerrainData, id: string) => {
  const p = placementById.get(id)!;
  return new Vector3(p.at[0], standingHeight(data, p), -p.at[1]);
};

/** Dashed route linking the diorama stops. It is a game route, not a road. */
function Trail({ data }: { data: TerrainData }) {
  const points = useMemo(() => {
    const curve = new CatmullRomCurve3(STOPS.map((s) => pinAnchor(data, s.id)), false, 'centripetal');
    return curve.getPoints(160).map((p) => new Vector3(p.x, Math.max(p.y, data.heightAt(p.x, -p.z) + 0.14), p.z));
  }, [data]);
  return <Line points={points} color="#ffffff" lineWidth={2.6} dashed dashSize={0.24} gapSize={0.18} transparent opacity={0.95} />;
}

function Camera({ data, selected, hovered, highlight, command, pins, panel, compass }: { data: TerrainData; hovered: string | null; highlight: string[] | null; selected: string | null; command: MapCommand; pins: PinRefs; panel: number; compass: React.RefObject<HTMLSpanElement | null> }) {
  const controls = useRef<MapControlsImpl>(null);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;
  const goal = useRef<{ target: Vector3; position: Vector3 } | null>(null);
  const first = useRef(true);
  const point = useRef(new Vector3());
  // Name labels float just above each miniature.
  const anchors = useMemo(() => PLACEMENTS.map((p) => pinAnchor(data, p.id).add(new Vector3(0, p.scale * 5, 0))), [data]);

  // Label priority: the active area, then the chosen pathway, then regencies before the compact cities.
  const order = useRef<number[]>([]);
  useEffect(() => {
    const weight = (id: string) => (id === selected || id === hovered ? 0 : highlight?.includes(id) ? 1 : districtById(id)!.type === 'kota' ? 3 : 2);
    order.current = PLACEMENTS.map((_, i) => i).sort((a, b) => weight(PLACEMENTS[a].id) - weight(PLACEMENTS[b].id));
  }, [selected, hovered, highlight]);

  const frame = (target: Vector3, distance: number) => ({
    target,
    position: target.clone().add(new Vector3(0, distance * 0.76, distance * 0.65).applyAxisAngle(new Vector3(0, 1, 0), aspect > 1.15 ? WIDE_TURN : 0)),
  });

  const overview = () => {
    const t = Math.tan(MathUtils.degToRad(camera.fov / 2));
    if (aspect > 1.15) return frame(new Vector3(-0.5, 0, 0.7), Math.max((HALF_HEIGHT * 1.22) / (t * aspect), (HALF_HEIGHT * 0.7) / t));
    return frame(new Vector3(0, 0, 0.9), Math.max((HALF_WIDTH * 0.98) / (t * aspect), (HALF_HEIGHT * 0.96) / t));
  };

  useEffect(() => {
    const d = districtById(selected);
    let next = overview();
    if (d) {
      const { center, span } = shapeOf(d);
      next = frame(new Vector3(center[0], data.heightAt(center[0], center[1]), -center[1]), MathUtils.clamp((span * 2.5) / Math.min(aspect, 1) ** 0.8, 8, 34));
    }
    goal.current = next;
    if (first.current) {
      // The opening view glides in from higher up, unless reduced motion is requested.
      const from = prefersReducedMotion() ? next.position : next.target.clone().add(next.position.clone().sub(next.target).multiplyScalar(1.35));
      camera.position.copy(from);
      controls.current?.target.copy(next.target);
      controls.current?.update();
      first.current = false;
    }
    if (prefersReducedMotion()) {
      camera.position.copy(next.position);
      controls.current?.target.copy(next.target);
      controls.current?.update();
      goal.current = null;
    }
  }, [selected, aspect]);

  // Shift the picture so that a side panel does not cover the selected area.
  useEffect(() => {
    if (panel > 0 && size.width > 900) camera.setViewOffset(size.width, size.height, panel / 2, 0, size.width, size.height);
    else if (panel > 0) camera.setViewOffset(size.width, size.height, 0, size.height * 0.24, size.width, size.height);
    else camera.clearViewOffset();
  }, [panel, size, camera]);

  useEffect(() => {
    const c = controls.current;
    if (!c || !command) return;
    if (command.type === 'reset') {
      goal.current = overview();
      return;
    }
    const offset = camera.position.clone().sub(c.target);
    offset.setLength(MathUtils.clamp(offset.length() * (command.type === 'in' ? 0.72 : 1.38), c.minDistance, c.maxDistance));
    goal.current = { target: c.target.clone(), position: c.target.clone().add(offset) };
  }, [command]);

  // Panning stops at the edge of the province, so the map cannot be lost.
  const keepInside = () => {
    const c = controls.current;
    if (!c) return;
    const x = MathUtils.clamp(c.target.x, -HALF_WIDTH, HALF_WIDTH);
    const z = MathUtils.clamp(c.target.z, -HALF_HEIGHT, HALF_HEIGHT);
    if (x !== c.target.x || z !== c.target.z) {
      camera.position.x += x - c.target.x;
      camera.position.z += z - c.target.z;
      c.target.x = x;
      c.target.z = z;
    }
  };

  useFrame((state, dt) => {
    const c = controls.current;
    if (c && goal.current) {
      const k = 1 - Math.exp(-dt * 3.4);
      c.target.lerp(goal.current.target, k);
      camera.position.lerp(goal.current.position, k);
      c.update();
      if (camera.position.distanceTo(goal.current.position) < 0.03) goal.current = null;
    }
    camera.updateMatrixWorld();
    if (compass.current && c) compass.current.style.rotate = `${Math.atan2(camera.position.x - c.target.x, camera.position.z - c.target.z)}rad`;
    // Names are placed one by one; a name that would cover an earlier one is hidden.
    const taken: [number, number, number, number][] = [];
    for (const i of order.current) {
      const el = pins.current[i];
      if (!el) continue;
      point.current.copy(anchors[i]).project(camera);
      const x = ((point.current.x + 1) / 2) * state.size.width;
      const y = ((1 - point.current.y) / 2) * state.size.height;
      const half = (el.offsetWidth || 80) / 2 + 2;
      const box: [number, number, number, number] = [x - half, y - 24, x + half, y + 1];
      const inView = point.current.z < 1 && x > -40 && x < state.size.width + 40 && y > 0 && y < state.size.height + 20;
      const free = inView && !taken.some((t) => box[0] < t[2] && box[2] > t[0] && box[1] < t[3] && box[3] > t[1]);
      if (free) taken.push(box);
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
      el.style.visibility = free ? 'visible' : 'hidden';
    }
  });

  return (
    <MapControls
      ref={controls}
      makeDefault
      zoomToCursor
      screenSpacePanning={false}
      onChange={keepInside}
      minDistance={6}
      maxDistance={75}
      minPolarAngle={0.12}
      maxPolarAngle={1.08}
      onStart={() => (goal.current = null)}
    />
  );
}

export interface Map3DProps {
  selected: string | null;
  hovered: string | null;
  visited: Set<string>;
  /** Area ids whose diorama has been fully explored. */
  completed: Set<string>;
  highlight: string[] | null;
  boundaries: boolean;
  /** Width in pixels covered by a side panel. */
  panel: number;
  command: MapCommand;
  onHover: (id: string | null, point?: { x: number; y: number }) => void;
  onSelect: (id: string) => void;
  fallback: React.ReactNode;
}

export default function Map3D({ selected, hovered, completed, highlight, boundaries, panel, command, onHover, onSelect, fallback }: Map3DProps) {
  const { data, failed } = useTerrain();
  const pins = useRef<(HTMLButtonElement | null)[]>([]);
  const compass = useRef<HTMLSpanElement>(null);

  if (failed) return <>{fallback}</>;
  if (!data) return <div className="grid h-full place-items-center bg-[#0a4f86] font-bold" role="status">Memuat bentang alam…</div>;

  const hit = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    const p = groundPoint(e.ray, data);
    return districtAt(p.x, -p.z);
  };

  return (
    <>
      <Stage label="Peta 3D Sumatera Utara dengan bentang alam. Geser untuk berpindah, klik wilayah atau penanda untuk menjelajah. Daftar wilayah tersedia sebagai alternatif." camera={{ fov: 30, position: [0, 34, 28], near: 0.5, far: 400 }} fallback={fallback}>
        <color attach="background" args={['#0a4f86']} />
        {/* The terrain shader lights itself; these lights are for the miniatures. */}
        <hemisphereLight args={['#fff3d6', '#3c6a70', 1.7]} />
        <directionalLight position={[-14, 20, 8]} intensity={2.2} color="#ffe2b0" />
        <Terrain data={data} selected={selected} hovered={hovered} boundaries={boundaries} />
        <Trail data={data} />
        <LandmarkLayer
          data={data}
          hovered={hovered}
          selected={selected}
          completed={completed}
          highlight={highlight}
          onSelect={onSelect}
          onHover={(id, e) => onHover(id, e && { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
        />
        {/* Invisible sheet that receives pointer events for the whole map. */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.2, 0]}
          onPointerMove={(e) => {
            const d = hit(e);
            onHover(d?.id ?? null, d ? { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY } : undefined);
          }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => {
            // A drag that pans the map must not count as a click.
            if (e.delta > 6) return;
            const d = hit(e);
            if (d) onSelect(d.id);
          }}
        >
          <planeGeometry args={[80, 80]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <Camera data={data} selected={selected} hovered={hovered} highlight={highlight} command={command} pins={pins} panel={panel} compass={compass} />
      </Stage>
      <div className="hud pointer-events-none absolute top-20 right-3 z-10 grid size-11 place-items-center rounded-full max-sm:hidden" title="Arah utara">
        <span ref={compass} className="flex flex-col items-center text-[11px] leading-none font-black">
          <span className="text-terracotta-500">▲</span>
          <span>U</span>
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PLACEMENTS.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => { pins.current[i] = el; }}
            type="button"
            onClick={() => onSelect(p.id)}
            aria-label={`Jelajahi ${ADMIN.find((d) => d.id === p.id)!.name}: ${LANDMARKS[p.id].name}`}
            style={{ visibility: 'hidden' }}
            tabIndex={-1}
            className={`pointer-events-auto absolute top-0 left-0 cursor-pointer rounded-md border border-forest-950/20 bg-ivory px-2 py-0.5 text-[11px] font-extrabold whitespace-nowrap text-forest-950 shadow-md hover:bg-gold-300 ${highlight && !highlight.includes(p.id) ? 'opacity-40' : ''}`}
          >
            {ADMIN.find((d) => d.id === p.id)!.name}
          </button>
        ))}
      </div>
    </>
  );
}
