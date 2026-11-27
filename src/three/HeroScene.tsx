import { useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, MathUtils, PlaneGeometry, Float32BufferAttribute, type Group, type Mesh, type PerspectiveCamera } from 'three';
import { Drum, Gong, RumahBolon, UlosCloth } from './models';
import { prefersReducedMotion } from './device';

export interface Look {
  /** Rotation requested by dragging or keys, in radians. */
  yaw: number;
  /** Pointer position for parallax, -1..1. */
  px: number;
  py: number;
}

const smooth = (a: number, b: number, v: number) => MathUtils.smoothstep(v, a, b);
const noise = (x: number, y: number) =>
  Math.sin(x * 0.31 + 1.7) * Math.cos(y * 0.27) + 0.5 * Math.sin(x * 0.83 - y * 0.59) + 0.25 * Math.sin(x * 1.9 + y * 2.3);

/** Stylised landscape inspired by a caldera lake. It is not a terrain model of Lake Toba. */
function Terrain() {
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(110, 110, 150, 150);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    const colors: number[] = [];
    const low = new Color('#2f5a3c');
    const mid = new Color('#1f4331');
    const high = new Color('#6d6a4c');
    const sand = new Color('#a98e62');
    const c = new Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const n = noise(x, z);
      const d = Math.hypot(x * 0.85, z + 6);
      const rim = smooth(19, 33, d) * (5.5 + n * 2.8);
      const island = Math.max(0, 1 - Math.hypot((x + 3) / 8, (z + 13) / 4.2)) * (3.4 + n * 0.9);
      const shore = Math.max(0, 1 - smooth(4.2, 6.8, Math.hypot(x - 1, z))) * 1.15;
      const h = Math.max(rim, island * 1.15, shore) - 0.55;
      pos.setY(i, h);
      if (h < 0.18) c.copy(sand);
      else c.copy(low).lerp(mid, smooth(0.6, 2.4, h)).lerp(high, smooth(3.8, 7.5, h));
      c.offsetHSL(0, 0, n * 0.018);
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} flatShading />
    </mesh>
  );
}

function Water({ still }: { still: boolean }) {
  const ref = useRef<Mesh>(null);
  const geometry = useMemo(() => new PlaneGeometry(76, 76, 70, 70).rotateX(-Math.PI / 2), []);
  useFrame(({ clock }) => {
    if (still || !ref.current) return;
    const t = clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, Math.sin(x * 0.9 + t * 0.8) * 0.025 + Math.cos(z * 1.2 + t * 0.65) * 0.025);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh ref={ref} geometry={geometry} position={[0, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#2b6168" metalness={0.45} roughness={0.28} flatShading />
    </mesh>
  );
}

function Clouds({ still }: { still: boolean }) {
  const ref = useRef<Group>(null);
  const clouds = useMemo(
    () => [
      [-17, 8.5, -20, 1.2], [6, 10.5, -26, 1.6], [20, 7.8, -15, 1], [-7, 12, -30, 1.4], [30, 11, -24, 1.3],
    ] as const,
    [],
  );
  useFrame((_, dt) => {
    if (still || !ref.current) return;
    for (const child of ref.current.children) {
      child.position.x += dt * 0.28;
      if (child.position.x > 38) child.position.x = -38;
    }
  });
  return (
    <group ref={ref}>
      {clouds.map(([x, y, z, s], i) => (
        <group key={i} position={[x, y, z]} scale={s}>
          {[[0, 0, 0, 1.2], [1.3, -0.15, 0.2, 0.9], [-1.35, -0.2, 0, 0.8], [0.4, 0.45, -0.2, 0.85], [2.3, -0.35, 0, 0.55]].map(
            ([cx, cy, cz, r], j) => (
              <mesh key={j} position={[cx, cy, cz]} scale={[r * 1.5, r * 0.55, r]}>
                <sphereGeometry args={[1, 12, 8]} />
                <meshBasicMaterial color="#f3dfc4" transparent opacity={0.2} depthWrite={false} />
              </mesh>
            ),
          )}
        </group>
      ))}
    </group>
  );
}

function Trees() {
  const trees = useMemo(
    () => [[-3.4, 0.9, 0.9], [-3.9, -0.6, 1.2], [-2.8, -2.2, 0.8], [5.4, -1.2, 1.1], [4.6, -2.7, 0.8], [5.6, 0.8, 0.75], [-3.2, 2.5, 0.65]],
    [],
  );
  return (
    <>
      {trees.map(([x, z, s], i) => (
        <group key={i} position={[x, 0.5, z]} scale={s}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 1, 6]} />
            <meshStandardMaterial color="#4a3320" />
          </mesh>
          {[1.2, 1.75, 2.25].map((y, j) => (
            <mesh key={y} position={[0, y, 0]} castShadow>
              <coneGeometry args={[0.75 - j * 0.18, 0.95, 8]} />
              <meshStandardMaterial color={i % 2 ? '#1e4a33' : '#2a5a3a'} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

function Floating({ position, speed, still, children }: { position: [number, number, number]; speed: number; still: boolean; children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (still || !ref.current) return;
    const t = clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.22;
    ref.current.rotation.y = Math.sin(t * 0.55) * 0.55;
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

function Rig({ look, still }: { look: RefObject<Look>; still: boolean }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / s.size.height);
  const yaw = useRef(0);
  useFrame(({ clock }, dt) => {
    const wide = aspect > 1.15;
    const k = still ? 1 : 1 - Math.exp(-dt * 3.2);
    yaw.current = MathUtils.lerp(yaw.current, look.current.yaw, k);
    const drift = still ? 0 : Math.sin(clock.elapsedTime * 0.12) * 0.06;
    const a = 0.42 + yaw.current + look.current.px * 0.07 + drift;
    // Pull back on narrow screens so the house stays in frame.
    const dist = wide ? 14.5 : MathUtils.clamp(15 / Math.max(aspect, 0.45) ** 0.6, 16, 24);
    camera.position.set(Math.sin(a) * dist, 4.9 - look.current.py * 0.7, Math.cos(a) * dist);
    camera.lookAt(0, wide ? 2.4 : 3.4, 0);
    // On wide screens, shift the view so the headline does not cover the house.
    const { width, height } = { width: 1000 * aspect, height: 1000 };
    if (wide) camera.setViewOffset(width, height, -width * 0.19, 0, width, height);
    else camera.setViewOffset(width, height, 0, height * 0.13, width, height);
  });
  return null;
}

export default function HeroScene({ look }: { look: RefObject<Look> }) {
  const still = useMemo(prefersReducedMotion, []);
  return (
    <>
      <color attach="background" args={['#193a37']} />
      <fog attach="fog" args={['#3f5a4b', 24, 66]} />
      <hemisphereLight args={['#f4d9ae', '#163026', 1.15]} />
      <directionalLight
        position={[11, 13, 7]}
        intensity={2.5}
        color="#ffd39a"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-9, 5, -8]} intensity={0.65} color="#79b6b2" />
      <mesh position={[-19, 9.5, -42]}>
        <sphereGeometry args={[2.3, 32, 20]} />
        <meshBasicMaterial color="#f6c77e" fog={false} />
      </mesh>
      <Terrain />
      <Water still={still} />
      <Clouds still={still} />
      <Trees />
      <group position={[1.2, 0.58, -0.2]} rotation={[0, -0.2, 0]}>
        <RumahBolon />
      </group>
      <Floating position={[-3.3, 4.1, 1.4]} speed={0.8} still={still}>
        <group scale={0.36}><UlosCloth /></group>
      </Floating>
      <Floating position={[5.4, 4.6, 0.6]} speed={0.65} still={still}>
        <Gong p={[0, 0, 0]} radius={0.58} />
      </Floating>
      <Floating position={[4.9, 2.2, 3.4]} speed={0.95} still={still}>
        <Drum p={[0, 0, 0]} radius={0.3} height={0.95} r={[0.3, 0, -0.32]} />
      </Floating>
      <Rig look={look} still={still} />
    </>
  );
}
