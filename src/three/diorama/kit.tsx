/** Shared building blocks for the miniature dioramas. Landscape pieces are illustrative. */
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, Color, ConeGeometry, DodecahedronGeometry, InstancedMesh, Object3D, PlaneGeometry, RepeatWrapping, SRGBColorSpace, type BufferGeometry, type Mesh } from 'three';
import { prefersReducedMotion } from '../device';

type V3 = [number, number, number];

/** Seeded generator, so each diorama looks the same on every visit. */
export function rng(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const textures = new Map<string, CanvasTexture>();

function speckle(key: string, base: string, tones: string[], count: number, size: [number, number], repeat: number) {
  let t = textures.get(key);
  if (t) return t;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const c = canvas.getContext('2d')!;
  c.fillStyle = base;
  c.fillRect(0, 0, 256, 256);
  const r = rng(key.length * 97 + 13);
  for (let i = 0; i < count; i++) {
    c.fillStyle = tones[Math.floor(r() * tones.length)];
    c.fillRect(r() * 256, r() * 256, size[0] * (0.5 + r()), size[1] * (0.5 + r()));
  }
  t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(repeat, repeat);
  textures.set(key, t);
  return t;
}

export const grassTexture = () => speckle('grass', '#4c7038', ['#5c8242', '#3f5f30', '#6d8f4a', '#58753a'], 2600, [3, 7], 5);
export const soilTexture = () => speckle('soil', '#9a7650', ['#ab8760', '#876543', '#b59470'], 1600, [5, 4], 4);

export function pavingTexture() {
  let t = textures.get('paving');
  if (t) return t;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const c = canvas.getContext('2d')!;
  c.fillStyle = '#4e4a43';
  c.fillRect(0, 0, 256, 256);
  const r = rng(41);
  for (let row = 0; row < 8; row++) {
    for (let col = -1; col < 6; col++) {
      const v = 108 + Math.floor(r() * 40);
      c.fillStyle = `rgb(${v},${v - 5},${v - 16})`;
      c.fillRect(col * 48 + (row % 2) * 24 + 2, row * 32 + 2, 44, 28);
    }
  }
  t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  textures.set('paving', t);
  return t;
}

/** The plinth: a round slice of land with visible soil layers under the grass. */
export function Plinth({ radius = 11, top = 'grass' }: { radius?: number; top?: 'grass' | 'soil' }) {
  return (
    <group>
      <mesh position={[0, -0.18, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius - 0.1, 0.36, 72]} />
        <meshStandardMaterial map={top === 'grass' ? grassTexture() : soilTexture()} roughness={1} />
      </mesh>
      {([[-0.72, radius - 0.12, radius - 0.4, 0.72, '#6f4c30'], [-1.42, radius - 0.4, radius - 1.1, 0.68, '#533924'], [-2.1, radius - 1.1, radius - 2.6, 0.68, '#3a2a1d']] as const).map(([y, a, b, h, color]) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[a, b, h, 36]} />
          <meshStandardMaterial color={color} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function Patch({ position, size, map, rotation = 0, repeat }: { position: V3; size: [number, number]; map: 'soil' | 'paving'; rotation?: number; repeat?: [number, number] }) {
  const texture = useMemo(() => {
    const t = (map === 'soil' ? soilTexture() : pavingTexture()).clone();
    t.repeat.set(...(repeat ?? [size[0] / 3, size[1] / 3]));
    t.needsUpdate = true;
    return t;
  }, [map, size, repeat]);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial map={texture} roughness={1} />
    </mesh>
  );
}

interface Item {
  position: V3;
  scale: V3;
  rotation: V3;
  color: string;
}

/** Many copies of one geometry in a single draw call. */
function Instances({ geometry, items, cast = true }: { geometry: BufferGeometry; items: Item[]; cast?: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current!;
    const dummy = new Object3D();
    const color = new Color();
    items.forEach((it, i) => {
      dummy.position.set(...it.position);
      dummy.scale.set(...it.scale);
      dummy.rotation.set(...it.rotation);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, color.set(it.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, items.length]} castShadow={cast} receiveShadow>
      <meshStandardMaterial roughness={0.95} flatShading />
    </instancedMesh>
  );
}

/** Returns true when a point should stay free of scattered plants. */
export type Keep = (x: number, z: number) => boolean;

function scatter(seed: number, count: number, inner: number, outer: number, keep: Keep) {
  const r = rng(seed);
  const out: [number, number, number][] = [];
  for (let tries = 0; out.length < count && tries < count * 30; tries++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(inner * inner + r() * (outer * outer - inner * inner));
    const x = Math.cos(a) * d;
    const z = Math.sin(a) * d;
    if (!keep(x, z)) out.push([x, z, r()]);
  }
  return out;
}

export function Grass({ seed, keep, count = 700, radius = 10.6 }: { seed: number; keep: Keep; count?: number; radius?: number }) {
  const geometry = useMemo(() => new ConeGeometry(0.05, 0.3, 4).translate(0, 0.15, 0), []);
  const items = useMemo(
    () => scatter(seed, count, 0, radius, keep).map(([x, z, v]): Item => ({
      position: [x, 0, z], scale: [1, 0.6 + v, 1], rotation: [(v - 0.5) * 0.4, v * 6, (v - 0.5) * 0.4], color: ['#7ea04f', '#5d8340', '#93ab5a'][Math.floor(v * 3)],
    })),
    [seed, keep, count, radius],
  );
  return <Instances geometry={geometry} items={items} cast={false} />;
}

export function Rocks({ seed, keep, count = 45, inner = 5, outer = 10.6 }: { seed: number; keep: Keep; count?: number; inner?: number; outer?: number }) {
  const geometry = useMemo(() => new DodecahedronGeometry(0.22, 0), []);
  const items = useMemo(
    () => scatter(seed, count, inner, outer, keep).map(([x, z, v]): Item => ({
      position: [x, 0.06, z], scale: [0.5 + v, 0.35 + v * 0.5, 0.5 + v * 0.8], rotation: [v * 3, v * 7, v], color: ['#8f897c', '#756f64', '#a39c8c'][Math.floor(v * 3)],
    })),
    [seed, keep, count, inner, outer],
  );
  return <Instances geometry={geometry} items={items} />;
}

export function Bushes({ seed, keep, count = 60, inner = 5, outer = 10.4 }: { seed: number; keep: Keep; count?: number; inner?: number; outer?: number }) {
  const geometry = useMemo(() => new DodecahedronGeometry(0.34, 1), []);
  const items = useMemo(
    () => scatter(seed, count, inner, outer, keep).flatMap(([x, z, v]): Item[] =>
      [0, 1, 2].map((i) => ({
        position: [x + (i - 1) * 0.26, 0.2 + (i === 1 ? 0.12 : 0), z + (i % 2) * 0.16], scale: [0.7 + v * 0.5, 0.6 + v * 0.4, 0.7 + v * 0.4], rotation: [v, v * 5 + i, 0], color: ['#3f6b34', '#547f3c', '#2f5730'][(Math.floor(v * 3) + i) % 3],
      })),
    ),
    [seed, keep, count, inner, outer],
  );
  return <Instances geometry={geometry} items={items} />;
}

/** Layered conifers for highland scenes. */
export function Pines({ seed, keep, count = 26, inner = 6.5, outer = 10.3 }: { seed: number; keep: Keep; count?: number; inner?: number; outer?: number }) {
  const cone = useMemo(() => new ConeGeometry(0.75, 1.1, 9), []);
  const trunk = useMemo(() => new ConeGeometry(0.14, 1.3, 6).translate(0, 0.65, 0), []);
  const spots = useMemo(() => scatter(seed, count, inner, outer, keep), [seed, keep, count, inner, outer]);
  const leaves = useMemo(
    () => spots.flatMap(([x, z, v]): Item[] => {
      const s = 0.65 + v * 0.65;
      return [0, 1, 2, 3].map((i) => ({
        position: [x, s * (1.05 + i * 0.5), z], scale: [s * (1 - i * 0.2), s * 0.85, s * (1 - i * 0.2)], rotation: [0, v * 6 + i, 0], color: ['#244d35', '#2f5c3c', '#3a6a43'][Math.floor(v * 3)],
      }));
    }),
    [spots],
  );
  const stems = useMemo(() => spots.map(([x, z, v]): Item => ({ position: [x, 0, z], scale: [1, 0.7 + v * 0.6, 1], rotation: [0, 0, 0], color: '#4d3522' })), [spots]);
  return (
    <>
      <Instances geometry={trunk} items={stems} />
      <Instances geometry={cone} items={leaves} />
    </>
  );
}

/** A palm with a gently curved trunk and drooping fronds. */
export function Palm({ position, height = 3.4, turn = 0 }: { position: V3; height?: number; turn?: number }) {
  const frond = useMemo(() => {
    const g = new PlaneGeometry(0.62, 1.9, 1, 8).rotateX(-Math.PI / 2).translate(0, 0, 0.95);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const t = p.getZ(i) / 1.9;
      p.setY(i, Math.sin(t * Math.PI * 0.75) * 0.5 - t * t * 0.55);
      p.setX(i, p.getX(i) * (1 - t * 0.85));
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group position={position} rotation={[0, turn, 0]}>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[(i / 7) ** 2 * 0.45, (height / 7) * (i + 0.5), 0]} rotation={[0, 0, -i * 0.03]} castShadow>
          <cylinderGeometry args={[0.11 - i * 0.006, 0.13 - i * 0.006, height / 7 + 0.04, 8]} />
          <meshStandardMaterial color={i % 2 ? '#7a5b3a' : '#6b4e31'} roughness={1} />
        </mesh>
      ))}
      <group position={[0.45, height, 0]}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} geometry={frond} rotation={[(i % 3) * 0.12 - 0.12, (i / 9) * Math.PI * 2, 0]} castShadow>
            <meshStandardMaterial color={i % 2 ? '#3e7a3a' : '#4f8c42'} side={2} roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Water({ position, radius, scale = [1, 1] }: { position: V3; radius: number; scale?: [number, number] }) {
  const ref = useRef<Mesh>(null);
  const geometry = useMemo(() => new PlaneGeometry(radius * 2, radius * 2, 36, 36), [radius]);
  const still = useMemo(prefersReducedMotion, []);
  useLayoutEffect(() => {
    // Pull the square grid into a disc.
    const p = geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) / radius;
      const y = p.getY(i) / radius;
      p.setXY(i, x * Math.sqrt(1 - (y * y) / 2) * radius, y * Math.sqrt(1 - (x * x) / 2) * radius);
    }
    geometry.computeVertexNormals();
  }, [geometry, radius]);
  useFrame(({ clock }) => {
    if (still || !ref.current) return;
    const p = ref.current.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 2.2 + clock.elapsedTime) * 0.025 + Math.cos(p.getY(i) * 2.6 + clock.elapsedTime * 0.8) * 0.02);
    p.needsUpdate = true;
  });
  return (
    <mesh ref={ref} geometry={geometry} position={position} rotation={[-Math.PI / 2, 0, 0]} scale={[scale[0], scale[1], 1]}>
      <meshStandardMaterial color="#2f7f8c" roughness={0.2} metalness={0.35} flatShading />
    </mesh>
  );
}

/** A faceted mountain used as a backdrop. It does not model any particular peak. */
export function Mountain({ position, radius, height, seed }: { position: V3; radius: number; height: number; seed: number }) {
  const geometry = useMemo(() => {
    const g = new ConeGeometry(radius, height, 14, 5, true);
    const p = g.attributes.position;
    const colors: number[] = [];
    const low = new Color('#35593c');
    const high = new Color('#6f765d');
    const c = new Color();
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      const t = (y + height / 2) / height;
      // Noise depends on position, so duplicated seam vertices stay together.
      const n = Math.sin(p.getX(i) * 3.1 + seed) * Math.cos(p.getZ(i) * 2.7 + seed);
      const k = t > 0.98 ? 1 : 1 + n * 0.2;
      p.setX(i, p.getX(i) * k);
      p.setZ(i, p.getZ(i) * k);
      c.copy(low).lerp(high, t);
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new (p.constructor as typeof import('three').Float32BufferAttribute)(new Float32Array(colors), 3));
    g.computeVertexNormals();
    return g;
  }, [radius, height, seed]);
  return (
    <mesh geometry={geometry} position={[position[0], position[1] + height / 2, position[2]]} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} flatShading side={2} />
    </mesh>
  );
}

/** Rectangle helper for keeping scattered plants away from buildings and paths. */
export const inBox = (x: number, z: number, cx: number, cz: number, w: number, d: number) => Math.abs(x - cx) < w / 2 && Math.abs(z - cz) < d / 2;
