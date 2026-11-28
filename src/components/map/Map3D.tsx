import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { MapControls } from '@react-three/drei';
import { Color, EdgesGeometry, ExtrudeGeometry, MathUtils, Path, PerspectiveCamera, Shape, Vector2, Vector3, type Group } from 'three';
import type { MapControls as MapControlsImpl } from 'three-stdlib';
import { DISTRICTS, districtById, type District } from '../../data/atlas';
import { HALF_HEIGHT, HALF_WIDTH, project, shapeOf } from '../../lib/geo';
import { prefersReducedMotion } from '../../three/device';
import Stage from '../../three/Stage';

export type MapCommand = { type: 'in' | 'out' | 'reset'; n: number } | null;

export const DEPTH = 0.42;
export const LAND = ['#4f7a4d', '#5d8754', '#456f49', '#6a8f58', '#3f6844'];

export function geometryOf(d: District) {
  const shapes = d.polygons.map((rings) => {
    const points = (ring: number[][]) => ring.map((c) => new Vector2(...project(c)));
    const shape = new Shape(points(rings[0]));
    shape.holes = rings.slice(1).map((r) => new Path(points(r)));
    return shape;
  });
  const geometry = new ExtrudeGeometry(shapes, { depth: d.type === 'air' ? DEPTH * 0.55 : DEPTH, bevelEnabled: false });
  // Shapes are drawn in the XY plane. Lay them flat so north points away from the viewer.
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

interface AreaProps {
  district: District;
  index: number;
  hovered: boolean;
  selected: boolean;
  visited: boolean;
  onHover: (id: string | null, e?: ThreeEvent<PointerEvent>) => void;
  onSelect: (id: string) => void;
}

function Area({ district, index, hovered, selected, visited, onHover, onSelect }: AreaProps) {
  const ref = useRef<Group>(null);
  const geometry = useMemo(() => geometryOf(district), [district]);
  const edges = useMemo(() => new EdgesGeometry(geometry, 30), [geometry]);
  useEffect(() => () => { geometry.dispose(); edges.dispose(); }, [geometry, edges]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const lift = selected ? 0.38 : hovered ? 0.18 : 0;
    g.position.y = MathUtils.damp(g.position.y, lift, 12, dt);
  });

  const water = district.type === 'air';
  const base = water ? '#2f7f95' : district.type === 'kota' ? '#b4603f' : LAND[index % LAND.length];
  // Visited areas are tinted rather than repainted, so neighbours stay distinguishable.
  const tint = visited ? `#${new Color(base).lerp(new Color('#d8d28a'), 0.38).getHexString()}` : base;
  const color = selected ? '#d9b153' : hovered ? '#f0d58e' : tint;

  return (
    <group ref={ref}>
      <mesh
        geometry={geometry}
        castShadow
        receiveShadow
        onPointerMove={(e) => { e.stopPropagation(); onHover(district.id, e); }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          // A drag that pans the map must not count as a click.
          if (e.delta <= 6) onSelect(district.id);
        }}
      >
        <meshStandardMaterial color={color} roughness={water ? 0.3 : 0.85} metalness={water ? 0.35 : 0} flatShading />
      </mesh>
      <lineSegments geometry={edges} raycast={() => null}>
        <lineBasicMaterial color={selected ? '#fff6dc' : '#e9dcb8'} transparent opacity={selected ? 0.95 : 0.65} />
      </lineSegments>
    </group>
  );
}

/** Moves the camera to the selected area, or back to the whole province. Dragging cancels the flight. */
function Camera({ selected, command, labelRef }: { selected: string | null; command: MapCommand; labelRef: React.RefObject<HTMLDivElement | null> }) {
  const controls = useRef<MapControlsImpl>(null);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / s.size.height);
  const goal = useRef<{ target: Vector3; position: Vector3 } | null>(null);
  const first = useRef(true);
  const point = useRef(new Vector3());

  const frame = (target: Vector3, distance: number) => ({
    target,
    position: target.clone().add(new Vector3(0, distance * 0.82, distance * 0.57)),
  });

  const overview = () => {
    const t = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max((HALF_WIDTH * 1.12) / (t * aspect), (HALF_HEIGHT * 1.14) / t);
    return frame(new Vector3(0, 0, 1.3), distance);
  };

  useEffect(() => {
    const d = districtById(selected);
    let next = overview();
    if (d) {
      const { center, span } = shapeOf(d);
      next = frame(new Vector3(center[0], 0, -center[1]), MathUtils.clamp((span * 2.6) / Math.min(aspect, 1) ** 0.8, 7, 34));
    }
    goal.current = next;
    if (first.current || prefersReducedMotion()) {
      camera.position.copy(next.position);
      controls.current?.target.copy(next.target);
      controls.current?.update();
      goal.current = null;
      first.current = false;
    }
    // The view is recalculated when the selection or the viewport shape changes.
  }, [selected, aspect]);

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

  useFrame(({ size }, dt) => {
    const c = controls.current;
    if (c && goal.current) {
      const k = 1 - Math.exp(-dt * 4.5);
      c.target.lerp(goal.current.target, k);
      camera.position.lerp(goal.current.position, k);
      c.update();
      if (camera.position.distanceTo(goal.current.position) < 0.02) goal.current = null;
    }
    const el = labelRef.current;
    const d = districtById(selected);
    if (el && d) {
      const [x, y] = shapeOf(d).center;
      point.current.set(x, DEPTH + 0.45, -y).project(camera);
      el.style.transform = `translate(${((point.current.x + 1) / 2) * size.width}px, ${((1 - point.current.y) / 2) * size.height}px) translate(-50%, -135%)`;
      el.style.visibility = point.current.z < 1 ? 'visible' : 'hidden';
    }
  });

  return (
    <MapControls
      ref={controls}
      makeDefault
      enableZoom={false}
      screenSpacePanning={false}
      minDistance={5}
      maxDistance={70}
      minPolarAngle={0.15}
      maxPolarAngle={1.1}
      onStart={() => (goal.current = null)}
    />
  );
}

export interface Map3DProps {
  selected: string | null;
  hovered: string | null;
  visited: Set<string>;
  command: MapCommand;
  onHover: (id: string | null, point?: { x: number; y: number }) => void;
  onSelect: (id: string) => void;
  fallback: React.ReactNode;
}

export default function Map3D({ selected, hovered, visited, command, onHover, onSelect, fallback }: Map3DProps) {
  const labelRef = useRef<HTMLDivElement>(null);
  const district = districtById(selected);
  return (
    <>
      <Stage label="Peta 3D Sumatera Utara. Geser untuk berpindah, klik wilayah untuk menjelajah. Daftar wilayah tersedia sebagai alternatif." camera={{ fov: 32, position: [0, 30, 20], far: 200 }} fallback={fallback}>
        <color attach="background" args={['#0f2a2c']} />
        <fog attach="fog" args={['#0f2a2c', 45, 110]} />
        <hemisphereLight args={['#fff0cf', '#163029', 1.35]} />
        <directionalLight position={[-12, 22, 10]} intensity={2} color="#ffe0ad" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow onClick={() => undefined}>
          <planeGeometry args={[220, 220]} />
          <meshStandardMaterial color="#17474f" roughness={0.65} metalness={0.15} />
        </mesh>
        <gridHelper args={[120, 60, '#2b646b', '#215158']} position={[0, -0.02, 0]} />
        {DISTRICTS.map((d, i) => (
          <Area
            key={d.id}
            district={d}
            index={i}
            hovered={hovered === d.id}
            selected={selected === d.id}
            visited={visited.has(d.id)}
            onSelect={onSelect}
            onHover={(id, e) => onHover(id, e && { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
          />
        ))}
        <Camera selected={selected} command={command} labelRef={labelRef} />
      </Stage>
      {district && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div ref={labelRef} style={{ visibility: 'hidden' }} className="absolute top-0 left-0 rounded-full border border-gold-300 bg-forest-950/90 px-4 py-1.5 font-display text-lg whitespace-nowrap text-ivory shadow-xl">
            {district.name}
          </div>
        </div>
      )}
    </>
  );
}
