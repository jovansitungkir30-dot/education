/** Home hero: the real district boundaries as relief, with illustrative trees and small landmark models. */
import { useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, ConeGeometry, EdgesGeometry, InstancedMesh, MathUtils, Object3D, PerspectiveCamera, Vector3 } from 'three';
import { DISTRICTS, districtById } from '../data/atlas';
import { HALF_HEIGHT, HALF_WIDTH, project, shapeOf } from '../lib/geo';
import { DEPTH, LAND, geometryOf } from '../components/map/Map3D';
import { OmoSebua, RumahBolon, SiwaluhJabu } from './models';
import { BagasGodang } from './diorama/Mandailing';
import { rng } from './diorama/kit';
import { prefersReducedMotion } from './device';

export interface Look {
  /** Rotation requested by dragging or keys, in radians. */
  yaw: number;
  /** Pointer position for parallax, -1..1. */
  px: number;
  py: number;
}

export const LANDMARKS: { id: string; model: () => ReactNode; scale: number; turn: number }[] = [
  { id: 'karo', model: SiwaluhJabu, scale: 0.25, turn: 0.5 },
  { id: 'samosir', model: RumahBolon, scale: 0.24, turn: 0.7 },
  { id: 'mandailing-natal', model: BagasGodang, scale: 0.21, turn: 0.2 },
  { id: 'nias-selatan', model: OmoSebua, scale: 0.23, turn: 0.4 },
];

export type LandmarkDots = RefObject<(HTMLAnchorElement | null)[]>;

function Land() {
  const areas = useMemo(
    () => DISTRICTS.map((d, i) => {
      const geometry = geometryOf(d);
      return { d, geometry, edges: new EdgesGeometry(geometry, 30), color: d.type === 'air' ? '#3a93a8' : d.type === 'kota' ? '#b4603f' : LAND[i % LAND.length] };
    }),
    [],
  );
  return (
    <>
      {areas.map(({ d, geometry, edges, color }) => (
        <group key={d.id}>
          <mesh geometry={geometry} receiveShadow castShadow>
            <meshStandardMaterial color={color} roughness={d.type === 'air' ? 0.25 : 0.9} metalness={d.type === 'air' ? 0.4 : 0} flatShading />
          </mesh>
          <lineSegments geometry={edges}>
            <lineBasicMaterial color="#e9dcb8" transparent opacity={0.28} />
          </lineSegments>
        </group>
      ))}
    </>
  );
}

const inside = (x: number, y: number, ring: [number, number][]) => {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

/** Decorative tree cover. Positions fall on land but do not map real forests. */
function Forest() {
  const ref = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => new ConeGeometry(0.075, 0.24, 6).translate(0, 0.12, 0), []);
  const spots = useMemo(() => {
    const rings = DISTRICTS.filter((d) => d.type === 'kabupaten').flatMap((d) => d.polygons.map((p) => p[0].map(project)));
    const lake = DISTRICTS.filter((d) => d.type === 'air').flatMap((d) => d.polygons.map((p) => p[0].map(project)));
    const keepOut = LANDMARKS.map((l) => shapeOf(districtById(l.id)!).center);
    const r = rng(2024);
    const out: [number, number, number][] = [];
    for (let tries = 0; out.length < 850 && tries < 14000; tries++) {
      const x = (r() * 2 - 1) * HALF_WIDTH;
      const y = (r() * 2 - 1) * HALF_HEIGHT;
      if (!rings.some((g) => inside(x, y, g)) || lake.some((g) => inside(x, y, g))) continue;
      if (keepOut.some(([a, b]) => Math.hypot(x - a, y - b) < 0.75)) continue;
      out.push([x, y, r()]);
    }
    return out;
  }, []);
  useLayoutEffect(() => {
    const mesh = ref.current!;
    const dummy = new Object3D();
    const color = new Color();
    spots.forEach(([x, y, v], i) => {
      dummy.position.set(x, DEPTH, -y);
      dummy.scale.setScalar(0.55 + v * 0.75);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, color.set(['#2c5636', '#386843', '#244a30'][Math.floor(v * 3)]));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [spots]);
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, spots.length]} castShadow>
      <meshStandardMaterial flatShading roughness={1} />
    </instancedMesh>
  );
}

function Rig({ look, dots, still }: { look: RefObject<Look>; dots: LandmarkDots; still: boolean }) {
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

    LANDMARKS.forEach((l, i) => {
      const el = dots.current[i];
      if (!el) return;
      const [x, y] = shapeOf(districtById(l.id)!).center;
      point.current.set(x, DEPTH + 1.45, -y).project(camera);
      el.style.transform = `translate(${((point.current.x + 1) / 2) * size.width}px, ${((1 - point.current.y) / 2) * size.height}px) translate(-50%, -100%)`;
      el.style.visibility = 'visible';
    });
  });
  return null;
}

export default function HeroMapScene({ look, dots }: { look: RefObject<Look>; dots: LandmarkDots }) {
  const still = useMemo(prefersReducedMotion, []);
  return (
    <>
      <color attach="background" args={['#103236']} />
      <fog attach="fog" args={['#103236', 48, 100]} />
      <hemisphereLight args={['#fbe8c4', '#12302a', 1.3]} />
      <directionalLight position={[-14, 20, 8]} intensity={2.4} color="#ffd9a0" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16} shadow-bias={-0.0005} />
      <directionalLight position={[12, 8, -10]} intensity={0.7} color="#8fc6cc" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial color="#19515a" roughness={0.55} metalness={0.2} />
      </mesh>
      <gridHelper args={[130, 65, '#2c6a73', '#235b64']} position={[0, -0.02, 0]} />
      <Land />
      <Forest />
      {LANDMARKS.map(({ id, model: Model, scale, turn }) => {
        const [x, y] = shapeOf(districtById(id)!).center;
        return (
          <group key={id} position={[x, DEPTH, -y]} rotation={[0, turn, 0]} scale={scale}>
            <Model />
          </group>
        );
      })}
      <Rig look={look} dots={dots} still={still} />
    </>
  );
}
