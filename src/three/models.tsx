import { useMemo, type ReactNode } from 'react';
import { BufferGeometry, DoubleSide, Float32BufferAttribute, Quaternion, Vector3 } from 'three';
import type { ModelId } from '../data/artifacts';
import { ornamentTexture, textileTexture, thatchTexture } from './textures';

type V3 = [number, number, number];

const WOOD = '#6b4326';
const DARK_WOOD = '#3f2718';
const STONE = '#8d877b';

export function Box({ p, s, color = WOOD, r }: { p: V3; s: V3; color?: string; r?: V3 }) {
  return (
    <mesh position={p} rotation={r} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

/** A timber between two points. */
function Beam({ a, b, radius = 0.06, color = DARK_WOOD }: { a: V3; b: V3; radius?: number; color?: string }) {
  const { mid, quat, len } = useMemo(() => {
    const from = new Vector3(...a);
    const to = new Vector3(...b);
    const dir = to.clone().sub(from);
    return {
      mid: from.clone().add(to).multiplyScalar(0.5),
      len: dir.length(),
      quat: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize()),
    };
  }, [a, b]);
  return (
    <mesh position={mid} quaternion={quat} castShadow>
      <cylinderGeometry args={[radius, radius, len, 7]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}

interface RoofShape {
  eaveY: number;
  ridgeY: number;
  halfWidth: number;
  eaveHalf: number;
  ridgeHalf: number;
  /** Extra rise of the ridge ends, which produces a saddle curve. */
  sweep: number;
}

function useRoofGeometry({ eaveY, ridgeY, halfWidth, eaveHalf, ridgeHalf, sweep }: RoofShape) {
  return useMemo(() => {
    const SEG = 24;
    const ridge = (t: number): V3 => [0, ridgeY + sweep * t * t, t * ridgeHalf];
    const eave = (t: number, side: number): V3 => [side * halfWidth, eaveY + sweep * 0.28 * t * t, t * eaveHalf];

    const slopes: number[] = [];
    const slopeUv: number[] = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < SEG; i++) {
        const u0 = i / SEG;
        const u1 = (i + 1) / SEG;
        const t0 = u0 * 2 - 1;
        const t1 = u1 * 2 - 1;
        slopes.push(...eave(t0, side), ...eave(t1, side), ...ridge(t1), ...eave(t0, side), ...ridge(t1), ...ridge(t0));
        slopeUv.push(u0, 0, u1, 0, u1, 1, u0, 0, u1, 1, u0, 1);
      }
    }
    const gables: number[] = [];
    const gableUv: number[] = [];
    for (const end of [-1, 1]) {
      // Set the gable slightly inside the roof edge so the roof reads as overhanging.
      const inset = (v: V3): V3 => [v[0] * 0.94, v[1] - 0.04, v[2] * 0.97];
      gables.push(...inset(eave(end, -1)), ...inset(eave(end, 1)), ...inset(ridge(end)));
      gableUv.push(0, 0, 1.5, 0, 0.75, 1.5);
    }
    const make = (pos: number[], uv: number[]) => {
      const g = new BufferGeometry();
      g.setAttribute('position', new Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
      g.computeVertexNormals();
      return g;
    };
    const ridgeLine = Array.from({ length: SEG + 1 }, (_, i) => ridge((i / SEG) * 2 - 1));
    return { slopes: make(slopes, slopeUv), gables: make(gables, gableUv), ridgeLine };
  }, [eaveY, ridgeY, halfWidth, eaveHalf, ridgeHalf, sweep]);
}

function Roof({ gable = 'ornament', ...shape }: RoofShape & { gable?: 'ornament' | 'thatch' }) {
  const g = useRoofGeometry(shape);
  return (
    <group>
      <mesh geometry={g.slopes} castShadow receiveShadow>
        <meshStandardMaterial map={thatchTexture()} side={DoubleSide} roughness={1} />
      </mesh>
      <mesh geometry={g.gables}>
        <meshStandardMaterial map={gable === 'ornament' ? ornamentTexture() : thatchTexture()} side={DoubleSide} roughness={0.9} />
      </mesh>
      {g.ridgeLine.slice(1).map((pt, i) => (
        <Beam key={i} a={g.ridgeLine[i]} b={pt} radius={0.07} color="#1d150f" />
      ))}
    </group>
  );
}

function Posts({ xs, zs, height, radius = 0.12 }: { xs: number[]; zs: number[]; height: number; radius?: number }) {
  return (
    <>
      {xs.flatMap((x) =>
        zs.map((z) => (
          <group key={`${x},${z}`}>
            <mesh position={[x, 0.08, z]} receiveShadow>
              <cylinderGeometry args={[radius * 1.7, radius * 2, 0.16, 8]} />
              <meshStandardMaterial color={STONE} roughness={1} />
            </mesh>
            <Beam a={[x, 0.14, z]} b={[x, height, z]} radius={radius} />
          </group>
        )),
      )}
    </>
  );
}

function Stairs({ z, top, width = 0.8 }: { z: number; top: number; width?: number }) {
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} p={[0, (top * (i + 0.5)) / 6, z + (5 - i) * 0.17]} s={[width, 0.08, 0.2]} />
      ))}
    </>
  );
}

export function RumahBolon() {
  return (
    <group>
      <Posts xs={[-1.35, -0.45, 0.45, 1.35]} zs={[-1.7, -0.85, 0, 0.85, 1.7]} height={1.1} />
      {[0.55, 0.85].map((y) => (
        <group key={y}>
          <Box p={[-1.35, y, 0]} s={[0.08, 0.08, 3.8]} color={DARK_WOOD} />
          <Box p={[1.35, y, 0]} s={[0.08, 0.08, 3.8]} color={DARK_WOOD} />
        </group>
      ))}
      <Box p={[0, 1.18, 0]} s={[3.1, 0.18, 3.9]} />
      <Box p={[0, 1.72, 0]} s={[2.85, 0.9, 3.6]} />
      {[-1.44, 1.44].map((x) => (
        <mesh key={x} position={[x, 1.72, 0]} rotation={[0, (Math.sign(x) * Math.PI) / 2, 0]}>
          <planeGeometry args={[3.5, 0.5]} />
          <meshStandardMaterial map={ornamentTexture()} roughness={0.85} />
        </mesh>
      ))}
      <Box p={[0, 1.55, 1.83]} s={[0.6, 0.6, 0.05]} color="#120c08" />
      <Roof eaveY={2.05} ridgeY={3.25} halfWidth={1.95} eaveHalf={2.15} ridgeHalf={2.85} sweep={0.95} />
      <Stairs z={1.95} top={1.18} />
    </group>
  );
}

export function SiwaluhJabu() {
  return (
    <group>
      <Posts xs={[-1.6, -0.55, 0.55, 1.6]} zs={[-1.6, -0.55, 0.55, 1.6]} height={0.9} />
      <Box p={[0, 0.98, 0]} s={[3.8, 0.16, 3.8]} />
      <Box p={[0, 1.5, 0]} s={[3.3, 0.9, 3.3]} />
      <Box p={[0, 1.3, 1.67]} s={[0.55, 0.7, 0.05]} color="#120c08" />
      {[-1, -0.5, 0.5, 1].map((x) => (
        <Box key={x} p={[x, 1.6, 1.67]} s={[0.28, 0.32, 0.05]} color="#1a110b" />
      ))}
      {/* Lower hipped skirt of the roof. */}
      <mesh position={[0, 2.35, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <cylinderGeometry args={[1.75, 3.1, 0.85, 4, 1, true]} />
        <meshStandardMaterial map={thatchTexture()} side={DoubleSide} roughness={1} flatShading />
      </mesh>
      <Box p={[0, 2.82, 0]} s={[2.4, 0.14, 2.4]} color="#7e2a1c" />
      <Roof eaveY={2.9} ridgeY={4.25} halfWidth={1.35} eaveHalf={1.3} ridgeHalf={1.7} sweep={0.12} />
      <group rotation={[0, Math.PI / 2, 0]}>
        <Roof eaveY={3.2} ridgeY={3.95} halfWidth={0.7} eaveHalf={1.45} ridgeHalf={1.65} sweep={0.08} />
      </group>
      {/* Front platform. */}
      <Box p={[0, 0.82, 2.2]} s={[1.9, 0.1, 0.75]} color="#a58a4c" />
      <Stairs z={2.65} top={0.82} width={0.7} />
    </group>
  );
}

export function OmoSebua() {
  const xs = [-1.2, -0.4, 0.4, 1.2];
  const zs = [-1.3, -0.45, 0.45, 1.3];
  return (
    <group>
      <Posts xs={xs} zs={zs} height={1.65} radius={0.15} />
      {[-1.45, 1.45].flatMap((z) =>
        [-1.2, 0.4].map((x) => (
          <group key={`${x}${z}`}>
            <Beam a={[x, 0.15, z]} b={[x + 0.8, 1.6, z]} radius={0.09} color={WOOD} />
            <Beam a={[x + 0.8, 0.15, z]} b={[x, 1.6, z]} radius={0.09} color={WOOD} />
          </group>
        )),
      )}
      <Box p={[0, 1.72, 0]} s={[2.9, 0.2, 3.1]} />
      <Box p={[0, 2.3, 0]} s={[2.75, 0.95, 2.95]} />
      {[1.5, -1.5].map((z) => (
        <group key={z}>
          <Box p={[0, 2.52, z]} s={[2.9, 0.1, 0.12]} color={DARK_WOOD} />
          {Array.from({ length: 13 }, (_, i) => (
            <Box key={i} p={[-1.2 + i * 0.2, 2.3, z]} s={[0.06, 0.38, 0.05]} color="#1a110b" />
          ))}
        </group>
      ))}
      <Roof gable="thatch" eaveY={2.75} ridgeY={5.7} halfWidth={1.95} eaveHalf={2.0} ridgeHalf={0.95} sweep={0.1} />
      {/* Roof window flap. */}
      <Box p={[1.05, 4.2, 0]} s={[0.05, 0.5, 0.8]} r={[0, 0, 0.62]} color="#150e09" />
    </group>
  );
}

export function HomboBatu() {
  const blocks = useMemo(() => {
    const out: { p: V3; s: V3; c: string }[] = [];
    const shades = ['#8d877b', '#7d786d', '#999385', '#6f6a60'];
    const rows = 8;
    for (let r = 0; r < rows; r++) {
      const width = 2.1 - r * 0.13;
      const depth = 0.85 - r * 0.045;
      const n = r % 2 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        out.push({
          p: [-width / 2 + (width / n) * (i + 0.5), 0.17 + r * 0.31, 0],
          s: [width / n - 0.035, 0.28, depth],
          c: shades[(r + i * 2) % shades.length],
        });
      }
    }
    return out;
  }, []);
  return (
    <group>
      {blocks.map((b, i) => (
        <Box key={i} p={b.p} s={b.s} color={b.c} />
      ))}
      <Box p={[0, 2.65, 0]} s={[1.25, 0.14, 0.55]} color="#a19b8d" />
      <Box p={[0, 0.14, 1.3]} s={[0.55, 0.28, 0.5]} color="#7d786d" />
      {Array.from({ length: 30 }, (_, i) => (
        <Box key={i} p={[((i % 6) - 2.5) * 0.72, -0.03, (Math.floor(i / 6) - 2) * 0.72]} s={[0.68, 0.06, 0.68]} color={i % 2 ? '#5d594f' : '#68635a'} />
      ))}
    </group>
  );
}

export function UlosCloth() {
  const geometry = useMemo(() => cloth(), []);
  return (
    <group>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial map={textileTexture()} side={DoubleSide} roughness={1} />
      </mesh>
      {[1.5, -1.5].flatMap((y) =>
        Array.from({ length: 36 }, (_, i) => {
          const x = -1.75 + i * 0.1;
          return <Beam key={`${y}${i}`} a={[x, y, fold(x, y)]} b={[x + ((i % 3) - 1) * 0.02, y + Math.sign(y) * 0.32, fold(x, y)]} radius={0.012} color="#c9a24b" />;
        }),
      )}
      <Beam a={[-2.1, 1.88, 0]} b={[2.1, 1.88, 0]} radius={0.06} />
    </group>
  );
}

const fold = (x: number, y: number) => Math.sin(x * 2.6) * 0.14 + Math.sin(y * 1.4) * 0.05;

function cloth() {
  const nx = 60;
  const ny = 40;
  const pos: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  for (let j = 0; j <= ny; j++) {
    for (let i = 0; i <= nx; i++) {
      const x = (i / nx) * 3.6 - 1.8;
      const y = (j / ny) * 3 - 1.5;
      pos.push(x, y, fold(x, y));
      uv.push(i / nx, j / ny);
    }
  }
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i;
      index.push(a, a + 1, a + nx + 2, a, a + nx + 2, a + nx + 1);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

export function Drum({ p, radius, height, r }: { p: V3; radius: number; height: number; r?: V3 }) {
  return (
    <group position={p} rotation={r}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius * 0.7, height, 24]} />
        <meshStandardMaterial color={WOOD} roughness={0.75} />
      </mesh>
      <mesh position={[0, height / 2 + 0.02, 0]}>
        <cylinderGeometry args={[radius * 1.03, radius * 1.03, 0.05, 24]} />
        <meshStandardMaterial color="#d8c49a" roughness={0.9} />
      </mesh>
      {[height / 2 - 0.1, -height / 3].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * (y > 0 ? 1.0 : 0.77), 0.025, 6, 28]} />
          <meshStandardMaterial color="#1d150f" />
        </mesh>
      ))}
    </group>
  );
}

export function Gong({ p, radius = 0.55 }: { p: V3; radius?: number }) {
  return (
    <group position={p}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, 0.14, 36]} />
        <meshStandardMaterial color="#b88f3a" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh>
        <torusGeometry args={[radius * 0.66, 0.025, 8, 36]} />
        <meshStandardMaterial color="#6f541d" metalness={0.7} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.07]} scale={[1, 1, 0.55]}>
        <sphereGeometry args={[radius * 0.24, 20, 14]} />
        <meshStandardMaterial color="#d9b45c" metalness={0.5} roughness={0.32} />
      </mesh>
    </group>
  );
}

export function GondangSet() {
  return (
    <group>
      {[-1.5, -0.75, 0, 0.75, 1.5].map((x, i) => (
        <Drum key={x} p={[x - 0.2, 1.25, 0]} radius={0.34 - i * 0.025} height={1.15} />
      ))}
      <Box p={[-0.2, 1.9, -0.45]} s={[3.9, 0.12, 0.12]} color={DARK_WOOD} />
      <Box p={[-0.2, 0.65, 0.4]} s={[3.9, 0.12, 0.12]} color={DARK_WOOD} />
      {[-2.15, 1.75].map((x) => (
        <group key={x}>
          <Beam a={[x, 0, 0.45]} b={[x, 0.7, 0.4]} />
          <Beam a={[x, 0, -0.5]} b={[x, 1.95, -0.45]} />
        </group>
      ))}
      <Beam a={[2.1, 0, -0.1]} b={[2.1, 2.45, -0.1]} />
      <Beam a={[3.55, 0, -0.1]} b={[3.55, 2.45, -0.1]} />
      <Beam a={[2.0, 2.4, -0.1]} b={[3.65, 2.4, -0.1]} />
      <Gong p={[2.82, 1.55, -0.05]} />
      <Gong p={[2.82, 0.55, -0.05]} radius={0.36} />
      <Beam a={[2.82, 2.4, -0.1]} b={[2.82, 2.08, -0.05]} radius={0.015} />
      <Beam a={[2.82, 1.02, -0.05]} b={[2.82, 0.9, -0.05]} radius={0.015} />
    </group>
  );
}

export function GordangRow() {
  return (
    <group>
      {Array.from({ length: 9 }, (_, i) => {
        // Largest in the middle, graded outwards. Placement is illustrative.
        const off = i - 4;
        const size = 1 - Math.abs(off) * 0.11;
        const h = 2.3 * size;
        return <Drum key={i} p={[off * 0.62, h / 2 + 0.22, Math.abs(off) * 0.13]} radius={0.31 * size + 0.03} height={h} />;
      })}
      <Box p={[0, 0.12, 0.25]} s={[5.9, 0.2, 1.5]} color={DARK_WOOD} />
    </group>
  );
}

export function GorgaPanel() {
  const rings: ReactNode[] = [1.6, 1.15, 0.7, 0.28].map((s, i) => (
    <mesh key={s} position={[0, 0, 0.18 + i * 0.045]} rotation={[0, 0, Math.PI / 4]} castShadow>
      <boxGeometry args={[s, s, 0.08]} />
      <meshStandardMaterial color={['#17110d', '#efe6d2', '#8f2f1f', '#efe6d2'][i]} roughness={0.8} />
    </mesh>
  ));
  return (
    <group>
      <Box p={[0, 0, 0]} s={[4, 3, 0.2]} color={DARK_WOOD} />
      <mesh position={[0, 0, 0.105]}>
        <planeGeometry args={[3.7, 2.7]} />
        <meshStandardMaterial map={ornamentTexture()} roughness={0.85} />
      </mesh>
      {rings}
      {[-1.45, 1.45].flatMap((x) =>
        [-1.05, 1.05].map((y) => (
          <mesh key={`${x}${y}`} position={[x, y, 0.2]}>
            <sphereGeometry args={[0.16, 18, 12]} />
            <meshStandardMaterial color="#efe6d2" />
          </mesh>
        )),
      )}
    </group>
  );
}

/** Intentionally plain figure: no attempt to reproduce a real puppet's face, dress or mechanism. */
export function SigaleGale() {
  return (
    <group>
      <Box p={[0, 0.45, 0]} s={[2.4, 0.8, 1.25]} />
      <mesh position={[0, 0.45, 0.635]}>
        <planeGeometry args={[2.2, 0.55]} />
        <meshStandardMaterial map={ornamentTexture()} roughness={0.9} />
      </mesh>
      <Box p={[0, 0.9, 0]} s={[2.55, 0.1, 1.4]} color={DARK_WOOD} />
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 1.25, 16]} />
        <meshStandardMaterial color="#3b2a22" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.45, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.27, 0.75, 16]} />
        <meshStandardMaterial color="#7e3224" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.12, 0]} castShadow>
        <sphereGeometry args={[0.3, 24, 18]} />
        <meshStandardMaterial color="#9a6a42" roughness={0.75} />
      </mesh>
      <mesh position={[0, 3.36, 0]}>
        <cylinderGeometry args={[0.26, 0.31, 0.18, 20]} />
        <meshStandardMaterial color="#17110d" />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Beam a={[side * 0.34, 2.72, 0]} b={[side * 0.74, 2.2, 0.08]} radius={0.09} color="#7e3224" />
          <Beam a={[side * 0.74, 2.2, 0.08]} b={[side * 0.72, 2.28, 0.68]} radius={0.075} color="#9a6a42" />
          <mesh position={[side * 0.74, 2.2, 0.08]}>
            <sphereGeometry args={[0.11, 14, 10]} />
            <meshStandardMaterial color={DARK_WOOD} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export const MODELS: Record<ModelId, () => ReactNode> = {
  'sigale-gale': SigaleGale,
  'rumah-bolon': RumahBolon,
  'siwaluh-jabu': SiwaluhJabu,
  'omo-sebua': OmoSebua,
  'hombo-batu': HomboBatu,
  ulos: UlosCloth,
  gondang: GondangSet,
  gordang: GordangRow,
  gorga: GorgaPanel,
};
