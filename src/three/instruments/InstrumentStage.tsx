/** Interactive 3D instruments. Every playable surface reacts the way the real action looks: a beater lands, a skin flexes, a string or gong moves. */
import { useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { CanvasTexture, CatmullRomCurve3, DoubleSide, LatheGeometry, MathUtils, PerspectiveCamera, RepeatWrapping, SRGBColorSpace, TubeGeometry, Vector2, Vector3, type Group, type Mesh } from 'three';
import type { Instrument } from '../../data/instruments';
import Stage from '../Stage';

type Hits = MutableRefObject<Record<string, number>>;
type V3 = [number, number, number];
interface Common {
  hits: Hits;
  onPlay: (partId: string) => void;
}

/** Seconds since a part was last struck. */
const since = (hits: Hits, id: string) => (performance.now() - (hits.current[id] ?? -1e9)) / 1000;

const textures = new Map<string, CanvasTexture>();
/** Procedural wood grain or hide, drawn once and shared. */
function surface(kind: 'wood' | 'darkwood' | 'hide') {
  let t = textures.get(kind);
  if (t) return t;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const c = canvas.getContext('2d')!;
  let seed = 7;
  const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  c.fillStyle = kind === 'wood' ? '#9a6334' : kind === 'darkwood' ? '#5b361f' : '#d9c39a';
  c.fillRect(0, 0, 512, 512);
  if (kind === 'hide') {
    for (let i = 0; i < 5200; i++) {
      c.fillStyle = ['#cdb488', '#e6d3ad', '#bfa476', '#efe0bd'][Math.floor(r() * 4)];
      c.globalAlpha = 0.28;
      c.beginPath();
      c.arc(r() * 512, r() * 512, 1 + r() * 5, 0, 7);
      c.fill();
    }
  } else {
    for (let i = 0; i < 230; i++) {
      const x = r() * 512;
      c.strokeStyle = r() > 0.5 ? '#3a200f' : '#c28a52';
      c.globalAlpha = 0.1 + r() * 0.28;
      c.lineWidth = 0.6 + r() * 3.5;
      c.beginPath();
      c.moveTo(x, 0);
      for (let y = 0; y <= 512; y += 32) c.lineTo(x + Math.sin(y / 70 + i) * 5, y);
      c.stroke();
    }
  }
  t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  textures.set(kind, t);
  return t;
}

const Wood = ({ dark = false, rough = 0.62 }: { dark?: boolean; rough?: number }) => <meshStandardMaterial map={surface(dark ? 'darkwood' : 'wood')} roughness={rough} />;

function Beam({ a, b, radius = 0.12, dark = true }: { a: V3; b: V3; radius?: number; dark?: boolean }) {
  const ref = useRef<Mesh>(null);
  const from = new Vector3(...a);
  const dir = new Vector3(...b).sub(from);
  useEffect(() => { ref.current!.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize()); });
  return (
    <mesh ref={ref} position={from.clone().addScaledVector(dir, 0.5)} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, dir.length(), 14]} />
      <Wood dark={dark} />
    </mesh>
  );
}

function Cord({ points, radius = 0.025, color = '#b9975a' }: { points: V3[]; radius?: number; color?: string }) {
  const geometry = useMemo(() => new TubeGeometry(new CatmullRomCurve3(points.map((p) => new Vector3(...p)), false, 'catmullrom', 0.1), points.length * 6, radius, 6, false), [points, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} castShadow><meshStandardMaterial color={color} roughness={0.95} /></mesh>;
}

/** A beater that swings down onto a point when its part is struck. It rests slightly raised. */
function Beater({ hits, ids, target, from, length = 1.5, bamboo = false }: { hits: Hits; ids: string[]; target: (id: string) => V3; from: V3; length?: number; bamboo?: boolean }) {
  const ref = useRef<Group>(null);
  const current = useRef(ids[0]);
  const tip = useRef(new Vector3(...target(ids[0])));
  useFrame((_, dt) => {
    let latest = current.current;
    for (const id of ids) if ((hits.current[id] ?? -1e9) > (hits.current[latest] ?? -1e9)) latest = id;
    current.current = latest;
    const age = since(hits, latest);
    const lift = age < 0.06 ? 0 : age < 0.5 ? Math.min(1, (age - 0.06) / 0.2) : 1;
    const hit = new Vector3(...target(latest));
    const away = new Vector3(...from).normalize();
    const goal = hit.clone().addScaledVector(away, lift * 0.55);
    tip.current.lerp(goal, age < 0.09 ? 1 : 1 - Math.exp(-dt * 14));
    const g = ref.current!;
    g.position.copy(tip.current);
    g.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), away);
  });
  return (
    <group ref={ref}>
      <mesh position={[0, length / 2, 0]} castShadow>
        <cylinderGeometry args={bamboo ? [0.028, 0.02, length, 8] : [0.06, 0.045, length, 10]} />
        {bamboo ? <meshStandardMaterial color="#c9b46a" roughness={0.7} /> : <Wood />}
      </mesh>
      <mesh position={[0, 0.07, 0]} castShadow>
        <sphereGeometry args={[bamboo ? 0.035 : 0.095, 14, 10]} />
        <meshStandardMaterial color={bamboo ? '#b49c52' : '#6b3f22'} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Turns a mesh into a playable surface with a hover highlight. */
function useTouch(id: string, onPlay: (id: string) => void) {
  return {
    onPointerDown: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onPlay(id); },
    onPointerOver: () => { document.body.style.cursor = 'pointer'; },
    onPointerOut: () => { document.body.style.cursor = ''; },
  };
}

/** Expanding ring that shows where the strike landed. */
function Ripple({ hits, id, radius }: { hits: Hits; id: string; radius: number }) {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    const age = since(hits, id);
    const m = ref.current!;
    m.visible = age < 0.5;
    if (!m.visible) return;
    m.scale.setScalar(0.25 + age * 2);
    (m.material as unknown as { opacity: number }).opacity = 0.9 * (1 - age * 2);
  });
  return (
    <mesh ref={ref} visible={false} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <ringGeometry args={[radius * 0.82, radius, 40]} />
      <meshBasicMaterial color="#ffd45e" transparent depthWrite={false} side={DoubleSide} />
    </mesh>
  );
}

/** A carved, rattan-laced single- or double-headed drum. Its axis is local y. */
function Drum({ id, hits, onPlay, radius, length, taper = 0.72, bulge = 0.1 }: Common & { id: string; radius: number; length: number; taper?: number; bulge?: number }) {
  const body = useMemo(() => {
    const profile = Array.from({ length: 17 }, (_, i) => {
      const t = i / 16;
      return new Vector2(radius * (MathUtils.lerp(taper, 1, t) + Math.sin(t * Math.PI) * bulge), (t - 0.5) * length);
    });
    return new LatheGeometry(profile, 40);
  }, [radius, length, taper, bulge]);
  useEffect(() => () => body.dispose(), [body]);
  const lacing = useMemo(() => {
    const out: V3[] = [];
    for (let i = 0; i <= 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      const top = i % 2 === 0;
      const t = top ? 0.92 : 0.45;
      const r = radius * (MathUtils.lerp(taper, 1, t) + Math.sin(t * Math.PI) * bulge) + 0.025;
      out.push([Math.cos(a) * r, (t - 0.5) * length, Math.sin(a) * r]);
    }
    return out;
  }, [radius, length, taper, bulge]);
  const skin = useRef<Group>(null);
  useFrame(() => {
    const age = since(hits, id);
    skin.current!.position.y = length / 2 - (age < 0.4 ? Math.cos(age * 55) * Math.exp(-age * 11) * 0.07 : 0);
  });
  const touch = useTouch(id, onPlay);
  return (
    <group>
      <mesh geometry={body} castShadow receiveShadow {...touch}><Wood /></mesh>
      <Cord points={lacing} />
      {[0.92, 0.45].map((t) => (
        <mesh key={t} position={[0, (t - 0.5) * length, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * (MathUtils.lerp(taper, 1, t) + Math.sin(t * Math.PI) * bulge) + 0.02, 0.035, 8, 48]} />
          <meshStandardMaterial color="#8a6a3b" roughness={0.9} />
        </mesh>
      ))}
      <group ref={skin} position={[0, length / 2, 0]}>
        <mesh {...touch}><cylinderGeometry args={[radius * 0.99, radius * 1.02, 0.07, 40]} /><meshStandardMaterial map={surface('hide')} roughness={0.85} /></mesh>
        <Ripple hits={hits} id={id} radius={radius * 0.62} />
      </group>
    </group>
  );
}

/** Nine drums lying side by side on a slanted rack, the skins raised toward the standing players. */
function GordangSet({ instrument, ...c }: Common & { instrument: Instrument }) {
  const drums = instrument.parts.map((part, i) => {
    const radius = 0.34 + i * 0.043;
    return { part, radius, length: 1.7 + i * 0.12, x: 0 };
  });
  let cursor = 0;
  for (const d of drums) {
    d.x = cursor + d.radius;
    cursor += d.radius * 2 + 0.1;
  }
  for (const d of drums) d.x -= cursor / 2;
  const TILT = 0.95;
  const head = (id: string): V3 => {
    const d = drums.find((x) => x.part.id === id)!;
    return [d.x, 1.5 + Math.cos(TILT) * (d.length / 2 + 0.06), Math.sin(TILT) * (d.length / 2 + 0.06)];
  };
  const ids = drums.map((d) => d.part.id);
  return (
    <group>
      {drums.map((d) => (
        <group key={d.part.id} position={[d.x, 1.5, 0]} rotation={[TILT, 0, 0]}><Drum {...c} id={d.part.id} radius={d.radius} length={d.length} /></group>
      ))}
      <Beam a={[-cursor / 2 - 0.4, 1.05, 0.55]} b={[cursor / 2 + 0.4, 0.75, 0.55]} radius={0.11} />
      <Beam a={[-cursor / 2 - 0.4, 0.75, -0.55]} b={[cursor / 2 + 0.4, 0.4, -0.55]} radius={0.11} />
      {[-cursor / 2 - 0.35, cursor / 2 + 0.35].map((x) => [0.55, -0.55].map((z) => <Beam key={`${x}${z}`} a={[x, 0, z]} b={[x, 1.2, z]} radius={0.13} />))}
      <Beater hits={c.hits} ids={ids.slice(0, 5)} target={head} from={[-0.3, 0.7, 0.75]} />
      <Beater hits={c.hits} ids={ids.slice(5)} target={head} from={[0.3, 0.7, 0.75]} />
    </group>
  );
}

function TaganingSet({ instrument, ...c }: Common & { instrument: Instrument }) {
  const drums = instrument.parts.map((part, i) => ({ part, x: (i - 2) * 1.25, radius: 0.56 - i * 0.045, length: 1.9 - i * 0.12 }));
  const head = (id: string): V3 => { const d = drums.find((x) => x.part.id === id)!; return [d.x, 1.2 + d.length, 0]; };
  const ids = drums.map((d) => d.part.id);
  return (
    <group>
      {drums.map((d) => (
        <group key={d.part.id}>
          <group position={[d.x, 1.2 + d.length / 2, 0]}><Drum {...c} id={d.part.id} radius={d.radius} length={d.length} taper={0.62} bulge={0.05} /></group>
          <Cord points={[[d.x - d.radius, 1.2 + d.length * 0.9, 0], [d.x - 0.08, 3.9, -0.55]]} />
          <Cord points={[[d.x + d.radius, 1.2 + d.length * 0.9, 0], [d.x + 0.08, 3.9, -0.55]]} />
        </group>
      ))}
      <Beam a={[-3.7, 3.9, -0.55]} b={[3.7, 3.9, -0.55]} radius={0.14} />
      {[-3.6, 3.6].map((x) => <Beam key={x} a={[x, 0, -0.55]} b={[x, 4.15, -0.55]} radius={0.15} />)}
      <Beater hits={c.hits} ids={ids.slice(0, 3)} target={head} from={[-0.45, 0.65, 0.6]} />
      <Beater hits={c.hits} ids={ids.slice(2)} target={head} from={[0.45, 0.65, 0.6]} />
    </group>
  );
}

function Bar({ id, x, length, hits, onPlay }: Common & { id: string; x: number; length: number }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    const age = since(hits, id);
    ref.current!.position.y = 1.55 - (age < 0.3 ? Math.cos(age * 60) * Math.exp(-age * 13) * 0.09 : 0);
  });
  return (
    <group ref={ref} position={[x, 1.55, 0]}>
      <mesh castShadow receiveShadow {...useTouch(id, onPlay)}><boxGeometry args={[0.62, 0.17, length]} /><Wood rough={0.45} /></mesh>
      <Ripple hits={hits} id={id} radius={0.34} />
    </group>
  );
}

function GarantungSet({ instrument, ...c }: Common & { instrument: Instrument }) {
  const bars = instrument.parts.filter((p) => p.voice === 'bar').map((part, i) => ({ part, x: (i - 3) * 0.74, length: 3 - i * 0.17 }));
  const spot = (id: string): V3 => (id === 'wh' ? [3.45, 1.62, 0] : [bars.find((b) => b.part.id === id)!.x, 1.66, 0.35]);
  const touch = useTouch('wh', c.onPlay);
  return (
    <group>
      {/* Resonator box with raised ends. */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow><boxGeometry args={[5.6, 0.9, 1.7]} /><Wood dark /></mesh>
      <mesh position={[0, 1.02, 0]}><boxGeometry args={[5.1, 0.06, 1.2]} /><meshStandardMaterial color="#1d1008" /></mesh>
      {[-2.75, 2.75].map((x) => <mesh key={x} position={[x, 1.15, 0]} castShadow><boxGeometry args={[0.2, 0.45, 1.8]} /><Wood dark /></mesh>)}
      {[-0.75, 0.75].map((z) => <Cord key={z} points={[[-2.75, 1.38, z], [-1.2, 1.42, z], [1.2, 1.42, z], [2.75, 1.38, z]]} />)}
      {bars.map((b) => <Bar key={b.part.id} {...c} id={b.part.id} x={b.x} length={b.length} />)}
      {/* The handle, which the left hand also strikes. */}
      <group position={[3.45, 1.15, 0]}>
        <mesh castShadow {...touch}><boxGeometry args={[1.2, 0.34, 0.42]} /><Wood /></mesh>
        <group position={[0, 0.2, 0]}><Ripple hits={c.hits} id="wh" radius={0.34} /></group>
      </group>
      <Beater hits={c.hits} ids={['wh', ...bars.slice(4).map((b) => b.part.id)]} target={spot} from={[0.5, 0.7, 0.55]} length={1.35} />
      <Beater hits={c.hits} ids={bars.slice(0, 4).map((b) => b.part.id)} target={spot} from={[-0.5, 0.7, 0.55]} length={1.35} />
    </group>
  );
}

function VibratingString({ id, offset, hits, onPlay }: Common & { id: string; offset: number }) {
  const ref = useRef<Mesh>(null);
  const SEGMENTS = 40;
  const base = useRef<Float32Array | null>(null);
  useFrame(() => {
    const g = ref.current!.geometry;
    const p = g.attributes.position;
    base.current ??= Float32Array.from(p.array as Float32Array);
    const age = since(hits, id);
    const swing = age < 1.6 ? Math.exp(-age * 2.4) * 0.13 * Math.cos(age * 90) : 0;
    for (let i = 0; i < p.count; i++) {
      const x = base.current[i * 3 + 1];
      p.setX(i, base.current[i * 3] + Math.sin(MathUtils.clamp((x + 2.5) / 5, 0, 1) * Math.PI) * swing);
    }
    p.needsUpdate = true;
  });
  const touch = useTouch(id, onPlay);
  return (
    <group position={[offset, 0, 0.36]}>
      <mesh ref={ref}><cylinderGeometry args={[0.014, 0.014, 5, 6, SEGMENTS, true]} /><meshStandardMaterial color="#f4ead0" metalness={0.5} roughness={0.35} emissive="#6a5a30" /></mesh>
      {/* A wider invisible strip makes the thin string easy to pluck, also by touch. Dragging across plucks too. */}
      <mesh position={[0, -0.9, 0.05]} {...touch} onPointerEnter={(e) => { if (e.buttons === 1) onPlay(id); }}>
        <boxGeometry args={[0.22, 2.6, 0.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function HasapiModel(c: Common) {
  const body = useMemo(() => new LatheGeometry([[0.02, -2.9], [0.42, -2.75], [0.72, -2.1], [0.78, -1.35], [0.62, -0.7], [0.3, -0.25], [0.2, 0.1]].map(([r, y]) => new Vector2(r, y)), 40), []);
  useEffect(() => () => body.dispose(), [body]);
  return (
    <group position={[0, 3.1, 0]} rotation={[0, 0, -0.32]}>
      <mesh geometry={body} scale={[1, 1, 0.48]} castShadow receiveShadow><Wood rough={0.5} /></mesh>
      <mesh position={[0, -1.35, 0.31]} scale={[0.82, 1.5, 1]}><circleGeometry args={[0.7, 40]} /><meshStandardMaterial map={surface('wood')} color="#e0b27a" roughness={0.55} /></mesh>
      <mesh position={[0, -1.15, 0.33]}><circleGeometry args={[0.17, 28]} /><meshStandardMaterial color="#1c0f07" /></mesh>
      <mesh position={[0, 1.15, 0.05]} castShadow><boxGeometry args={[0.34, 2.4, 0.3]} /><Wood dark /></mesh>
      {/* Carved head and two tuning pegs. */}
      <mesh position={[0, 2.62, 0.05]} rotation={[0, 0, 0.1]} castShadow><boxGeometry args={[0.46, 0.7, 0.34]} /><Wood dark /></mesh>
      <mesh position={[0.05, 3.15, 0.05]} castShadow><coneGeometry args={[0.2, 0.52, 5]} /><Wood dark /></mesh>
      {[2.45, 2.75].map((y, i) => <Beam key={y} a={[i ? 0.2 : -0.2, y, 0.05]} b={[i ? 0.75 : -0.75, y + 0.08, 0.05]} radius={0.065} dark={false} />)}
      <mesh position={[0, -2.2, 0.38]}><boxGeometry args={[0.55, 0.12, 0.16]} /><Wood dark /></mesh>
      <group position={[0, 0.3, 0]}>
        <VibratingString {...c} id="h1" offset={-0.09} />
        <VibratingString {...c} id="h2" offset={0.09} />
      </group>
    </group>
  );
}

function ArambaModel(c: Common) {
  const swing = useRef<Group>(null);
  const face = useMemo(() => {
    // Profile from the centre boss out to the turned-back rim.
    const profile = [[0.001, 0.62], [0.22, 0.6], [0.36, 0.5], [0.42, 0.28], [0.55, 0.2], [1.2, 0.24], [1.72, 0.17], [1.86, 0], [1.88, -0.34], [1.8, -0.4]];
    return new LatheGeometry(profile.map(([r, y]) => new Vector2(r, y)), 56);
  }, []);
  useEffect(() => () => face.dispose(), [face]);
  useFrame(() => {
    const a = since(c.hits, 'a1');
    const b = since(c.hits, 'a2');
    const age = Math.min(a, b);
    swing.current!.rotation.x = age < 4 ? Math.sin(age * 5.5) * Math.exp(-age * 1.2) * (a < b ? 0.1 : 0.05) : 0;
  });
  const boss = useTouch('a1', c.onPlay);
  const side = useTouch('a2', c.onPlay);
  return (
    <group>
      <group position={[0, 4.55, 0]} ref={swing}>
        <Cord points={[[-1.05, -0.55, 0], [-0.85, 0, 0]]} radius={0.04} />
        <Cord points={[[1.05, -0.55, 0], [0.85, 0, 0]]} radius={0.04} />
        <group position={[0, -2.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={face} castShadow {...side}><meshStandardMaterial color="#9a7636" metalness={0.82} roughness={0.38} side={DoubleSide} /></mesh>
          {[0.8, 1.5].map((r) => <mesh key={r} position={[0, 0.245, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.018, 8, 64]} /><meshStandardMaterial color="#6d5225" metalness={0.7} roughness={0.5} /></mesh>)}
          <mesh position={[0, 0.46, 0]} {...boss}><sphereGeometry args={[0.38, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c9a451" metalness={0.85} roughness={0.28} /></mesh>
          <group position={[0, 0.9, 0]}><Ripple hits={c.hits} id="a1" radius={0.5} /></group>
          <group position={[1.15, 0.35, 0]}><Ripple hits={c.hits} id="a2" radius={0.4} /></group>
        </group>
      </group>
      <Beam a={[-2.9, 4.55, 0]} b={[2.9, 4.55, 0]} radius={0.17} />
      {[-2.75, 2.75].map((x) => <group key={x}><Beam a={[x, 0, 0]} b={[x, 4.85, 0]} radius={0.18} /><Beam a={[x, 0.15, -1]} b={[x, 0.15, 1]} radius={0.16} /></group>)}
      <Beater hits={c.hits} ids={['a1', 'a2']} target={(id) => (id === 'a1' ? [0, 2.5, 0.92] : [1.15, 2.5, 0.35])} from={[0.45, -0.2, 0.9]} length={1.4} />
    </group>
  );
}

function GondraModel(c: Common) {
  const swing = useRef<Group>(null);
  useFrame(() => {
    const age = Math.min(since(c.hits, 'n1'), since(c.hits, 'n2'));
    swing.current!.rotation.z = age < 1 ? Math.sin(age * 14) * Math.exp(-age * 6) * 0.02 : 0;
  });
  const rim = useTouch('nr', c.onPlay);
  const face = (id: string): V3 => (id === 'n1' ? [-0.4, 2.65, 1.45] : id === 'n2' ? [0.45, 2.35, 1.45] : [1.22, 2.6, 1.15]);
  return (
    <group>
      <group ref={swing}>
        {/* The barrel hangs with one head toward the player; the front half is played with two bamboo strips. */}
        <group position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <Drum {...c} id="n1" radius={1.15} length={2.6} taper={0.98} bulge={0.2} />
          <mesh position={[0, 1.33, 0]} rotation={[Math.PI / 2, 0, 0]} {...rim}><torusGeometry args={[1.17, 0.11, 12, 48]} /><Wood dark /></mesh>
          <group position={[0.45, 1.37, 0.15]}><Ripple hits={c.hits} id="n2" radius={0.5} /></group>
        </group>
        {[-0.7, 0.7].map((x) => <Cord key={x} points={[[x, 3.75, 0], [x * 0.75, 5, 0]]} radius={0.05} />)}
      </group>
      <Beam a={[-2.4, 5, 0]} b={[2.4, 5, 0]} radius={0.18} />
      {[-2.2, 2.2].map((x) => (
        <group key={x}>
          <Beam a={[x, 0, 0]} b={[x, 5.35, 0]} radius={0.22} />
          <Beam a={[x, 0.18, -1.1]} b={[x, 0.18, 1.1]} radius={0.18} />
          {/* Plain red and yellow bands stand in for the carved ornament. */}
          {[1.2, 1.6, 3.6, 4].map((y, i) => <mesh key={y} position={[x, y, 0]}><cylinderGeometry args={[0.245, 0.245, 0.2, 18]} /><meshStandardMaterial color={i % 2 ? '#d9a727' : '#a3301f'} roughness={0.7} /></mesh>)}
        </group>
      ))}
      <Beater hits={c.hits} ids={['n1', 'nr']} target={face} from={[-0.7, 0.35, 0.65]} length={1.9} bamboo />
      <Beater hits={c.hits} ids={['n2']} target={face} from={[0.7, 0.35, 0.65]} length={1.9} bamboo />
    </group>
  );
}

const VIEW: Record<Instrument['id'], { width: number; height: number; target: number }> = {
  gordang: { width: 11.2, height: 4.6, target: 1.6 }, taganing: { width: 8.4, height: 5, target: 2.2 }, garantung: { width: 7.8, height: 3.6, target: 1.3 },
  hasapi: { width: 4.6, height: 6.8, target: 3.1 }, aramba: { width: 6.8, height: 5.8, target: 2.6 }, gondra: { width: 6, height: 6, target: 2.8 },
};

function Camera({ id, reset }: { id: Instrument['id']; reset: number }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / s.size.height);
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  useEffect(() => {
    const v = VIEW[id];
    const t = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max(v.width / (2 * t * aspect), v.height / (2 * t)) * 1.06;
    const high = id === 'gordang' || id === 'garantung' || id === 'taganing' ? 0.48 : 0.14;
    camera.position.set(0, v.target + distance * high, distance * Math.sqrt(1 - high * high));
    controls.current?.target.set(0, v.target, 0);
    controls.current?.update();
  }, [id, aspect, reset]);
  return <OrbitControls ref={controls} enablePan={false} minDistance={4} maxDistance={40} minPolarAngle={0.3} maxPolarAngle={1.62} minAzimuthAngle={-1.1} maxAzimuthAngle={1.1} />;
}

export default function InstrumentStage({ instrument, hits, onPlay, reset, fallback }: Common & { instrument: Instrument; reset: number; fallback: ReactNode }) {
  const common = { hits, onPlay };
  useEffect(() => () => { document.body.style.cursor = ''; }, []);
  return (
    <Stage label={`Model 3D ${instrument.name}. Ketuk bagiannya untuk memainkan. Tombol di bawah melakukan hal yang sama.`} camera={{ fov: 32, position: [0, 6, 14] }} fallback={fallback}>
      <color attach="background" args={['#1c2b24']} />
      <hemisphereLight args={['#fff1d6', '#1c2b24', 1.1]} />
      <spotLight position={[5, 13, 9]} angle={0.7} penumbra={0.8} intensity={420} color="#ffe2b4" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
      <directionalLight position={[-8, 6, -4]} intensity={1.1} color="#a9cfe0" />
      <directionalLight position={[2, 3, 10]} intensity={0.7} color="#fff" />
      <group key={instrument.id}>
        {instrument.id === 'gordang' && <GordangSet {...common} instrument={instrument} />}
        {instrument.id === 'taganing' && <TaganingSet {...common} instrument={instrument} />}
        {instrument.id === 'garantung' && <GarantungSet {...common} instrument={instrument} />}
        {instrument.id === 'hasapi' && <HasapiModel {...common} />}
        {instrument.id === 'aramba' && <ArambaModel {...common} />}
        {instrument.id === 'gondra' && <GondraModel {...common} />}
      </group>
      {/* Museum plinth. */}
      <mesh position={[0, -0.22, 0]} receiveShadow><cylinderGeometry args={[7, 7.15, 0.4, 72]} /><meshStandardMaterial color="#33261c" roughness={0.95} /></mesh>
      <ContactShadows key={`shadow-${instrument.id}`} position={[0, -0.01, 0]} scale={15} resolution={512} blur={2} opacity={0.6} far={3} frames={1} />
      <Camera id={instrument.id} reset={reset} />
    </Stage>
  );
}
