import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Line, MapControls } from '@react-three/drei';
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Ray, Vector3 } from 'three';
import type { MapControls as MapControlsImpl } from 'three-stdlib';
import { districtById } from '../../data/atlas';
import { PINS, STOPS } from '../../data/pins';
import { HALF_HEIGHT, HALF_WIDTH, shapeOf } from '../../lib/geo';
import { districtAt, useTerrain, type TerrainData } from '../../lib/terrain';
import { prefersReducedMotion } from '../../three/device';
import Stage from '../../three/Stage';
import Terrain from '../../three/Terrain';
import PinMarker from './PinMarker';

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
  const [x, y] = shapeOf(districtById(id)!).center;
  return new Vector3(x, data.heightAt(x, y) + 0.12, -y);
};

/** Dashed route linking the diorama stops. It is a game route, not a road. */
function Trail({ data }: { data: TerrainData }) {
  const points = useMemo(() => {
    const curve = new CatmullRomCurve3(STOPS.map((s) => pinAnchor(data, s.id)), false, 'centripetal');
    return curve.getPoints(160).map((p) => new Vector3(p.x, Math.max(p.y, data.heightAt(p.x, -p.z) + 0.14), p.z));
  }, [data]);
  return <Line points={points} color="#ffffff" lineWidth={2.6} dashed dashSize={0.24} gapSize={0.18} transparent opacity={0.95} />;
}

function Camera({ data, selected, command, pins, panel, compass }: { data: TerrainData; selected: string | null; command: MapCommand; pins: PinRefs; panel: number; compass: React.RefObject<HTMLSpanElement | null> }) {
  const controls = useRef<MapControlsImpl>(null);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;
  const goal = useRef<{ target: Vector3; position: Vector3 } | null>(null);
  const first = useRef(true);
  const point = useRef(new Vector3());
  const anchors = useMemo(() => PINS.map((p) => pinAnchor(data, p.id)), [data]);

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
    // Smaller markers appear once the view is close enough to give them room.
    const far = c ? camera.position.distanceTo(c.target) > 20 : false;
    anchors.forEach((anchor, i) => {
      const el = pins.current[i];
      if (!el) return;
      point.current.copy(anchor).project(camera);
      const x = ((point.current.x + 1) / 2) * state.size.width;
      const y = ((1 - point.current.y) / 2) * state.size.height;
      const [dx, dy] = PINS[i].shift ?? [0, 0];
      el.style.transform = `translate(${x + dx}px, ${y + dy}px) translate(-50%, -100%)`;
      const crowded = far && !PINS[i].stop && !['kota-medan', 'tapanuli-selatan'].includes(PINS[i].id);
      el.style.visibility = !crowded && point.current.z < 1 && x > -40 && x < state.size.width + 40 && y > 0 && y < state.size.height + 20 ? 'visible' : 'hidden';
    });
  });

  return (
    <MapControls
      ref={controls}
      makeDefault
      enableZoom={false}
      screenSpacePanning={false}
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
  boundaries: boolean;
  /** Width in pixels covered by a side panel. */
  panel: number;
  command: MapCommand;
  onHover: (id: string | null, point?: { x: number; y: number }) => void;
  onSelect: (id: string) => void;
  fallback: React.ReactNode;
}

export default function Map3D({ selected, hovered, completed, boundaries, panel, command, onHover, onSelect, fallback }: Map3DProps) {
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
        <Terrain data={data} selected={selected} hovered={hovered} boundaries={boundaries} />
        <Trail data={data} />
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
        <Camera data={data} selected={selected} command={command} pins={pins} panel={panel} compass={compass} />
      </Stage>
      <div className="hud pointer-events-none absolute top-40 left-3 z-10 grid size-12 place-items-center rounded-full max-lg:top-32" title="Arah utara">
        <span ref={compass} className="flex flex-col items-center text-[11px] leading-none font-black">
          <span className="text-terracotta-500">▲</span>
          <span>U</span>
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PINS.map((pin, i) => (
          <button
            key={pin.id}
            ref={(el) => { pins.current[i] = el; }}
            type="button"
            onClick={() => onSelect(pin.id)}
            aria-pressed={selected === pin.id}
            aria-label={`${pin.stop ? `Perhentian ${pin.stop}: ` : ''}${pin.label}`}
            style={{ visibility: 'hidden', zIndex: pin.stop ? 3 : 2 }}
            className="group pointer-events-auto absolute top-0 left-0 cursor-pointer"
          >
            <PinMarker pin={pin} active={selected === pin.id} done={completed.has(pin.id)} />
          </button>
        ))}
      </div>
    </>
  );
}
